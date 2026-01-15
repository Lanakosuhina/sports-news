'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ExternalLink, Download, SkipForward, Loader2 } from 'lucide-react'
import { Category, Tag, ImportSource, ImportedItem } from '@prisma/client'

interface ImportItemPreviewProps {
  item: ImportedItem & { source: ImportSource }
  categories: Category[]
  tags: Tag[]
  onClose: () => void
  onImport: (itemId: string, categoryId: string, tagIds: string[], status: 'DRAFT' | 'PUBLISHED') => Promise<void>
  onSkip: (itemId: string) => Promise<void>
}

export default function ImportItemPreview({
  item,
  categories,
  tags,
  onClose,
  onImport,
  onSkip,
}: ImportItemPreviewProps) {
  const [categoryId, setCategoryId] = useState(item.source.defaultCategory || '')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [skipping, setSkipping] = useState(false)

  const handleImport = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!categoryId) {
      alert('Пожалуйста, выберите категорию')
      return
    }

    setImporting(true)
    await onImport(item.id, categoryId, selectedTags, status)
    setImporting(false)
  }

  const handleSkip = async () => {
    setSkipping(true)
    await onSkip(item.id)
    setSkipping(false)
    onClose()
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(tags =>
      tags.includes(tagId)
        ? tags.filter(id => id !== tagId)
        : [...tags, tagId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Предпросмотр статьи</h2>
            <p className="text-sm text-slate-500">Источник: {item.source.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Image */}
            {item.imageUrl && (
              <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              {item.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
              {item.publishedAt && (
                <span>
                  Опубликовано: {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
                </span>
              )}
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
              >
                <ExternalLink className="w-4 h-4" />
                Смотреть оригинал
              </a>
            </div>

            {/* Excerpt */}
            {item.excerpt && (
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Краткое описание</h3>
                <p className="text-slate-600">{item.excerpt}</p>
              </div>
            )}

            {/* Content Preview */}
            {item.content && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Content Preview</h3>
                <div
                  className="prose prose-sm max-w-none text-slate-600 max-h-64 overflow-y-auto p-4 bg-slate-50 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            )}

            {/* Import Options */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900">Import Settings</h3>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedTags.includes(tag.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={handleSkip}
            disabled={skipping}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition"
          >
            {skipping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SkipForward className="w-4 h-4" />
            )}
            Skip
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleImport('DRAFT')}
              disabled={importing || !categoryId}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-700 rounded-lg transition"
            >
              {importing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Import as Draft
            </button>
            <button
              onClick={() => handleImport('PUBLISHED')}
              disabled={importing || !categoryId}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition"
            >
              {importing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Import & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
