'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Category, Tag, League, Article } from '@prisma/client'
import { slugify, getImageUrl } from '@/lib/utils'
import { Save, Eye, X, Upload, Plus, Download } from 'lucide-react'
import ImageDownloadModal from './ImageDownloadModal'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-slate-100 rounded-lg animate-pulse" />
  ),
})

interface ArticleFormProps {
  article?: Article & { tags: Tag[] }
  categories: Category[]
  tags: Tag[]
  leagues: League[]
}

export default function ArticleForm({
  article,
  categories,
  tags: availableTags,
  leagues,
}: ArticleFormProps) {
  const router = useRouter()
  const isEditing = !!article

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    featuredImage: article?.featuredImage || '',
    gallery: article?.gallery || [],
    videoUrl: article?.videoUrl || '',
    categoryId: article?.categoryId || '',
    leagueId: article?.leagueId || '',
    status: article?.status || ('DRAFT' as const),
    publishedAt: article?.publishedAt
      ? new Date(article.publishedAt).toISOString().slice(0, 16)
      : '',
    metaTitle: article?.metaTitle || '',
    metaDescription: article?.metaDescription || '',
    canonicalUrl: article?.canonicalUrl || '',
  })
  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tags.map((t) => t.id) || []
  )
  const [newTag, setNewTag] = useState('')
  const [showDownloadModal, setShowDownloadModal] = useState<string | null>(null)

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : slugify(title),
    }))
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'featuredImage' | 'gallery'
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formDataUpload = new FormData()
    Array.from(files).forEach((file) => {
      formDataUpload.append('files', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const { urls } = await response.json()
        if (field === 'featuredImage') {
          setFormData((prev) => ({ ...prev, featuredImage: urls[0] }))
        } else {
          setFormData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, ...urls],
          }))
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      // For simplicity, just add to selected tags if it exists
      const existingTag = availableTags.find(
        (t) => t.name.toLowerCase() === newTag.toLowerCase()
      )
      if (existingTag && !selectedTags.includes(existingTag.id)) {
        setSelectedTags((prev) => [...prev, existingTag.id])
      }
      setNewTag('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        publishedAt:
          formData.status === 'PUBLISHED' && !formData.publishedAt
            ? new Date().toISOString()
            : formData.publishedAt || null,
        tags: selectedTags,
      }

      const url = isEditing ? `/api/articles/${article.id}` : '/api/articles'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/admin/articles/${data.id}`)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.message || 'Не удалось сохранить статью')
      }
    } catch {
      alert('Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const filteredLeagues = leagues.filter(
    (l) => l.categoryId === formData.categoryId
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Заголовок *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Заголовок статьи"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="article-slug"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Краткое описание *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Краткое описание статьи..."
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Содержание *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
            />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">SEO настройки</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SEO заголовок (оставьте пустым для использования заголовка статьи)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SEO описание (оставьте пустым для использования краткого описания)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={formData.canonicalUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Публикация</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DRAFT">Черновик</option>
                  <option value="PUBLISHED">Опубликовано</option>
                  <option value="SCHEDULED">Запланировано</option>
                </select>
              </div>

              {(formData.status === 'SCHEDULED' ||
                formData.status === 'PUBLISHED') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Дата публикации
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        publishedAt: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-emerald-300 text-white py-3 rounded-lg transition"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
                </button>
                {isEditing && article.status === 'PUBLISHED' && (
                  <a
                    href={`/article/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-lg transition"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Category & League */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Категория</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Категория *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                      leagueId: '',
                    }))
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {filteredLeagues.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Лига
                  </label>
                  <select
                    value={formData.leagueId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        leagueId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите лигу (необязательно)</option>
                    {filteredLeagues.map((league) => (
                      <option key={league.id} value={league.id}>
                        {league.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Теги</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tagId) => {
                const tag = availableTags.find((t) => t.id === tagId)
                return tag ? (
                  <span
                    key={tagId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                  >
                    #{tag.name}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.filter((id) => id !== tagId)
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ) : null
              })}
            </div>
            <div className="flex gap-2">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value && !selectedTags.includes(e.target.value)) {
                    setSelectedTags((prev) => [...prev, e.target.value])
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Добавить тег...</option>
                {availableTags
                  .filter((t) => !selectedTags.includes(t.id))
                  .map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Главное изображение</h3>
            {formData.featuredImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 group">
                <Image
                  src={getImageUrl(formData.featuredImage)}
                  alt="Featured"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDownloadModal(formData.featuredImage)}
                    className="p-1.5 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-blue-600"
                    title="Скачать в разных размерах"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, featuredImage: '' }))
                    }
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    title="Удалить"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Загрузить изображение</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'featuredImage')}
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">
              Или введите URL:
            </p>
            <input
              type="text"
              value={formData.featuredImage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))
              }
              className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="/uploads/... или https://..."
            />
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Галерея</h3>
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {formData.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`Gallery ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setShowDownloadModal(image)}
                        className="p-1 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-blue-600"
                        title="Скачать"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        title="Удалить"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <Plus className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Добавить изображения</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'gallery')}
              />
            </label>
          </div>

          {/* Video URL */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Видео</h3>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ссылка на YouTube или Vimeo"
            />
          </div>
        </div>
      </div>

      {/* Image Download Modal */}
      {showDownloadModal && (
        <ImageDownloadModal
          imagePath={showDownloadModal}
          onClose={() => setShowDownloadModal(null)}
        />
      )}
    </form>
  )
}
