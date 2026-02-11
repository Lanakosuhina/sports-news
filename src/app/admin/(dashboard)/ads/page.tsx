'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff, BarChart3, Image as ImageIcon, RefreshCw } from 'lucide-react'
import Image from 'next/image'

const AD_SIZES = {
  leaderboard: { width: 728, height: 90, label: '728×90 — Горизонтальный баннер' },
  billboard: { width: 970, height: 250, label: '970×250 — Билборд' },
  banner: { width: 468, height: 60, label: '468×60 — Стандартный баннер' },
  'medium-rectangle': { width: 300, height: 250, label: '300×250 — Средний прямоугольник' },
  'large-rectangle': { width: 336, height: 280, label: '336×280 — Большой прямоугольник' },
  square: { width: 250, height: 250, label: '250×250 — Квадрат' },
  skyscraper: { width: 120, height: 600, label: '120×600 — Небоскрёб' },
  'wide-skyscraper': { width: 160, height: 600, label: '160×600 — Широкий небоскрёб' },
  'half-page': { width: 300, height: 600, label: '300×600 — Полстраницы' },
} as const

const PLACEMENTS = [
  { value: 'header', label: 'Шапка сайта' },
  { value: 'sidebar-top', label: 'Сайдбар — верхний блок' },
  { value: 'sidebar-bottom', label: 'Сайдбар — нижний блок' },
  { value: 'article-top', label: 'Статья — над контентом' },
  { value: 'article-bottom', label: 'Статья — под контентом' },
  { value: 'footer', label: 'Подвал сайта' },
  { value: 'between-articles', label: 'Лента — между статьями' },
]

interface AdZone {
  id: string
  name: string
  slug: string
  placement: string
  size: string
  imageUrl: string | null
  linkUrl: string | null
  code: string | null
  isActive: boolean
  order: number
  startDate: string | null
  endDate: string | null
  impressions: number
  clicks: number
  rotationGroup: string | null
  rotationInterval: number
  createdAt: string
}

const ROTATION_GROUPS = [
  { value: '', label: 'Без ротации' },
  { value: 'sidebar-top', label: 'Сайдбар — верхний блок' },
  { value: 'sidebar-bottom', label: 'Сайдбар — нижний блок' },
  { value: 'article-top', label: 'Статья — над контентом' },
  { value: 'article-bottom', label: 'Статья — под контентом' },
  { value: 'header', label: 'Шапка сайта' },
  { value: 'between-articles', label: 'Лента — между статьями' },
]

export default function AdsPage() {
  const [ads, setAds] = useState<AdZone[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    placement: 'sidebar-top',
    size: 'medium-rectangle',
    imageUrl: '',
    linkUrl: '',
    code: '',
    isActive: true,
    order: 0,
    startDate: '',
    endDate: '',
    rotationGroup: '',
    rotationInterval: 5,
  })

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads')
      const data = await response.json()
      setAds(data)
    } catch (error) {
      console.error('Failed to fetch ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const { url } = await response.json()
        setFormData((prev) => ({ ...prev, imageUrl: url }))
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/ads/${editingId}` : '/api/ads'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          imageUrl: formData.imageUrl || null,
          linkUrl: formData.linkUrl || null,
          code: formData.code || null,
          rotationGroup: formData.rotationGroup || null,
          rotationInterval: formData.rotationInterval || 0,
        }),
      })

      if (response.ok) {
        fetchAds()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save ad:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту рекламу?')) return

    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAds()
      }
    } catch (error) {
      console.error('Failed to delete ad:', error)
    }
  }

  const toggleActive = async (ad: AdZone) => {
    try {
      const response = await fetch(`/api/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ad, isActive: !ad.isActive }),
      })

      if (response.ok) {
        fetchAds()
      }
    } catch (error) {
      console.error('Failed to toggle ad:', error)
    }
  }

  const startEdit = (ad: AdZone) => {
    setEditingId(ad.id)
    setFormData({
      name: ad.name,
      slug: ad.slug,
      placement: ad.placement,
      size: ad.size,
      imageUrl: ad.imageUrl || '',
      linkUrl: ad.linkUrl || '',
      code: ad.code || '',
      isActive: ad.isActive,
      order: ad.order,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
      rotationGroup: ad.rotationGroup || '',
      rotationInterval: ad.rotationInterval || 5,
    })
    setShowNew(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setShowNew(false)
    setFormData({
      name: '',
      slug: '',
      placement: 'sidebar-top',
      size: 'medium-rectangle',
      imageUrl: '',
      linkUrl: '',
      code: '',
      isActive: true,
      order: 0,
      startDate: '',
      endDate: '',
      rotationGroup: '',
      rotationInterval: 5,
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const getSizeLabel = (size: string) => {
    return AD_SIZES[size as keyof typeof AD_SIZES]?.label || size
  }

  const getPlacementLabel = (placement: string) => {
    return PLACEMENTS.find((p) => p.value === placement)?.label || placement
  }

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return '0%'
    return ((clicks / impressions) * 100).toFixed(2) + '%'
  }

  if (loading) {
    return <div className="p-8 text-center">Загрузка...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Реклама</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Новая реклама</span>
        </button>
      </div>

      {/* New/Edit Form */}
      {showNew && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            {editingId ? 'Редактировать рекламу' : 'Новая реклама'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: editingId ? prev.slug : generateSlug(e.target.value),
                    }))
                  }}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: Главный баннер сайдбара"
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
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Размещение
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, placement: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PLACEMENTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Размер
                </label>
                <select
                  value={formData.size}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, size: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(AD_SIZES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Порядок
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Изображение баннера
              </label>
              <div className="space-y-3">
                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50')
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
                    const file = e.dataTransfer.files?.[0]
                    if (file && file.type.startsWith('image/')) {
                      const dataTransfer = new DataTransfer()
                      dataTransfer.items.add(file)
                      if (fileInputRef.current) {
                        fileInputRef.current.files = dataTransfer.files
                        handleImageUpload({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>)
                      }
                    }
                  }}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    formData.imageUrl ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {formData.imageUrl ? (
                    <div className="space-y-3">
                      <div className="relative mx-auto w-full max-w-md h-32 rounded-lg overflow-hidden border border-slate-200">
                        <Image
                          src={formData.imageUrl}
                          alt="Preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <ImageIcon className="w-5 h-5" />
                        <span className="font-medium">Изображение загружено</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Нажмите или перетащите новое изображение для замены
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Upload className={`w-6 h-6 ${uploading ? 'animate-pulse text-blue-400' : 'text-blue-500'}`} />
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">
                          {uploading ? 'Загрузка...' : 'Загрузите изображение'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Перетащите файл сюда или нажмите для выбора
                      </p>
                      <p className="text-xs text-slate-400">
                        PNG, JPG, GIF или WEBP до 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual URL Input */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs text-slate-400 uppercase">или</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  placeholder="Введите URL изображения"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ссылка
              </label>
              <input
                type="url"
                value={formData.linkUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))
                }
                placeholder="https://example.com"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* External Ad Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Код рекламы (Google Ads, Яндекс.Директ и т.д.)
              </label>
              <textarea
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
                rows={3}
                placeholder="<script>...</script>"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Если указан код, он будет использован вместо изображения
              </p>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Дата начала
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Дата окончания
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Rotation Settings */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-medium text-slate-900 mb-3">Ротация баннеров</h3>
              <p className="text-sm text-slate-500 mb-4">
                Объедините несколько баннеров в группу ротации для автоматической смены
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Группа ротации
                  </label>
                  <select
                    value={formData.rotationGroup}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, rotationGroup: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROTATION_GROUPS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1">
                    Баннеры с одинаковой группой будут чередоваться
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Интервал ротации (сек)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.rotationInterval}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rotationInterval: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.rotationGroup}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    0 = без автоматической смены, только при перезагрузке
                  </p>
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">
                Реклама активна
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                <Save className="w-5 h-5" />
                <span>Сохранить</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
                <span>Отмена</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ads Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Превью
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Название
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Размещение
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Размер
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-600">
                  Ротация
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-600">
                  Статус
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-slate-600">
                  <BarChart3 className="w-4 h-4 inline" />
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {ad.imageUrl ? (
                        <div className="w-16 h-12 relative rounded overflow-hidden border border-slate-200">
                          <Image
                            src={ad.imageUrl}
                            alt={ad.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : ad.code ? (
                        <div className="w-16 h-12 bg-slate-100 rounded flex items-center justify-center">
                          <span className="text-xs text-slate-500">Код</span>
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-slate-100 rounded flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{ad.name}</div>
                      <div className="text-xs text-slate-500">{ad.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {getPlacementLabel(ad.placement)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {getSizeLabel(ad.size)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ad.rotationGroup ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          <RefreshCw className="w-3 h-3" />
                          <span>{ad.rotationInterval}с</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(ad)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          ad.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {ad.isActive ? (
                          <>
                            <Eye className="w-3 h-3" /> Активна
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Скрыта
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-xs text-slate-600">
                        <div>{ad.impressions.toLocaleString()} показов</div>
                        <div>{ad.clicks.toLocaleString()} кликов</div>
                        <div className="font-medium text-blue-600">
                          CTR: {calculateCTR(ad.clicks, ad.impressions)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(ad)}
                          className="p-2 text-slate-400 hover:text-blue-500 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Рекламные блоки не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
