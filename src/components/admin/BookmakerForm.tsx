'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Save, ArrowLeft, Upload, Plus, Trash2, GripVertical } from 'lucide-react'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false })

interface CustomField {
  id: string
  key: string
  value: string
  type: 'text' | 'url' | 'number' | 'boolean' | 'textarea'
}

interface BookmakerFormProps {
  bookmaker?: {
    id: string
    name: string
    slug: string
    logo: string | null
    description: string | null
    bonus: string | null
    bonusLabel: string | null
    rating: number
    link: string
    website: string | null
    hasLicense: boolean
    licenseNumber: string | null
    minDeposit: string | null
    hasIosApp: boolean
    hasAndroidApp: boolean
    iosAppLink: string | null
    androidAppLink: string | null
    isActive: boolean
    order: number
    ratingOrder: number
    customFields: Record<string, unknown> | null
  }
}

const PREDEFINED_CUSTOM_FIELDS = [
  { key: 'withdrawalTime', label: 'Время вывода', type: 'text' as const },
  { key: 'paymentMethods', label: 'Способы оплаты', type: 'textarea' as const },
  { key: 'customerSupport', label: 'Служба поддержки', type: 'text' as const },
  { key: 'foundedYear', label: 'Год основания', type: 'number' as const },
  { key: 'headquarters', label: 'Главный офис', type: 'text' as const },
  { key: 'liveStreaming', label: 'Live трансляции', type: 'boolean' as const },
  { key: 'cashOut', label: 'Кэшаут', type: 'boolean' as const },
  { key: 'welcomeBonus', label: 'Приветственный бонус', type: 'textarea' as const },
  { key: 'promoCode', label: 'Промокод', type: 'text' as const },
  { key: 'sportsCount', label: 'Количество видов спорта', type: 'number' as const },
  { key: 'esports', label: 'Киберспорт', type: 'boolean' as const },
  { key: 'virtualSports', label: 'Виртуальный спорт', type: 'boolean' as const },
]

export default function BookmakerForm({ bookmaker }: BookmakerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: bookmaker?.name || '',
    slug: bookmaker?.slug || '',
    logo: bookmaker?.logo || '',
    description: bookmaker?.description || '',
    bonus: bookmaker?.bonus || '',
    bonusLabel: bookmaker?.bonusLabel || '',
    rating: bookmaker?.rating || 0,
    link: bookmaker?.link || '',
    website: bookmaker?.website || '',
    hasLicense: bookmaker?.hasLicense ?? true,
    licenseNumber: bookmaker?.licenseNumber || '',
    minDeposit: bookmaker?.minDeposit || '',
    hasIosApp: bookmaker?.hasIosApp ?? true,
    hasAndroidApp: bookmaker?.hasAndroidApp ?? true,
    iosAppLink: bookmaker?.iosAppLink || '',
    androidAppLink: bookmaker?.androidAppLink || '',
    isActive: bookmaker?.isActive ?? true,
    order: bookmaker?.order || 0,
    ratingOrder: bookmaker?.ratingOrder || 0,
  })

  // Initialize custom fields from bookmaker data
  const initializeCustomFields = (): CustomField[] => {
    if (!bookmaker?.customFields || typeof bookmaker.customFields !== 'object') {
      return []
    }

    const fields: CustomField[] = []
    const customData = bookmaker.customFields as Record<string, unknown>

    Object.entries(customData).forEach(([key, value]) => {
      const predefined = PREDEFINED_CUSTOM_FIELDS.find(f => f.key === key)
      fields.push({
        id: crypto.randomUUID(),
        key,
        value: String(value ?? ''),
        type: predefined?.type || 'text',
      })
    })

    return fields
  }

  const [customFields, setCustomFields] = useState<CustomField[]>(initializeCustomFields)
  const [showFieldSelector, setShowFieldSelector] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const map: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        }
        return map[char] || char
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: bookmaker ? formData.slug : generateSlug(name),
    })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })
      const data = await response.json()
      if (data.url) {
        setFormData({ ...formData, logo: data.url })
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
    }
  }

  const addCustomField = (predefined?: typeof PREDEFINED_CUSTOM_FIELDS[0]) => {
    const newField: CustomField = {
      id: crypto.randomUUID(),
      key: predefined?.key || '',
      value: '',
      type: predefined?.type || 'text',
    }
    setCustomFields([...customFields, newField])
    setShowFieldSelector(false)
  }

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const getAvailablePredefinedFields = () => {
    const usedKeys = customFields.map(f => f.key)
    return PREDEFINED_CUSTOM_FIELDS.filter(f => !usedKeys.includes(f.key))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Convert custom fields array to object
    const customFieldsObject: Record<string, string | number | boolean> = {}
    customFields.forEach(field => {
      if (field.key.trim()) {
        if (field.type === 'boolean') {
          customFieldsObject[field.key] = field.value === 'true'
        } else if (field.type === 'number') {
          customFieldsObject[field.key] = parseFloat(field.value) || 0
        } else {
          customFieldsObject[field.key] = field.value
        }
      }
    })

    try {
      const url = bookmaker ? `/api/bookmakers/${bookmaker.id}` : '/api/bookmakers'
      const method = bookmaker ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: parseFloat(formData.rating.toString()) || 0,
          order: parseInt(formData.order.toString()) || 0,
          ratingOrder: parseInt(formData.ratingOrder.toString()) || 0,
          customFields: Object.keys(customFieldsObject).length > 0 ? customFieldsObject : null,
        }),
      })

      if (response.ok) {
        router.push('/admin/bookmakers')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка сохранения')
      }
    } catch (error) {
      console.error('Error saving bookmaker:', error)
      alert('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  const renderCustomFieldInput = (field: CustomField) => {
    const predefined = PREDEFINED_CUSTOM_FIELDS.find(f => f.key === field.key)
    const label = predefined?.label || field.key

    switch (field.type) {
      case 'boolean':
        return (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.value === 'true'}
                onChange={(e) => updateCustomField(field.id, { value: e.target.checked ? 'true' : 'false' })}
                className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          </div>
        )
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <textarea
              value={field.value}
              onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
              type="number"
              value={field.value}
              onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )
      case 'url':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
              type="url"
              value={field.value}
              onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://"
            />
          </div>
        )
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bookmakers"
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {bookmaker ? 'Редактировать букмекера' : 'Новый букмекер'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Fields Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Основная информация</h2>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">Обязательные</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Название *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ссылка на сайт *
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Домен сайта
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Бонус
                  </label>
                  <input
                    type="text"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10000 ₽"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Метка бонуса
                  </label>
                  <input
                    type="text"
                    value={formData.bonusLabel}
                    onChange={(e) => setFormData({ ...formData, bonusLabel: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Новым игрокам"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Рейтинг (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Мин. депозит
                  </label>
                  <input
                    type="text"
                    value={formData.minDeposit}
                    onChange={(e) => setFormData({ ...formData, minDeposit: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500 ₽"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Номер лицензии
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ФНС №12345"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Описание</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">Опционально</span>
            </div>
            <RichTextEditor
              content={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              placeholder="Описание букмекера..."
            />
          </div>

          {/* Mobile Apps */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Мобильные приложения</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">Опционально</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ссылка на iOS приложение
                  </label>
                  <input
                    type="url"
                    value={formData.iosAppLink}
                    onChange={(e) => setFormData({ ...formData, iosAppLink: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://apps.apple.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ссылка на Android приложение
                  </label>
                  <input
                    type="url"
                    value={formData.androidAppLink}
                    onChange={(e) => setFormData({ ...formData, androidAppLink: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://play.google.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Custom/Dynamic Fields Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Дополнительные поля</h2>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Расширяемые</span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFieldSelector(!showFieldSelector)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  Добавить поле
                </button>

                {showFieldSelector && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border rounded-xl shadow-lg z-10">
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-medium text-slate-500 uppercase">Предопределённые поля</p>
                      {getAvailablePredefinedFields().length > 0 ? (
                        getAvailablePredefinedFields().map(field => (
                          <button
                            key={field.key}
                            type="button"
                            onClick={() => addCustomField(field)}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                          >
                            {field.label}
                            <span className="text-xs text-slate-400 ml-2">({field.type})</span>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-slate-400">Все поля уже добавлены</p>
                      )}
                      <div className="border-t mt-2 pt-2">
                        <button
                          type="button"
                          onClick={() => addCustomField()}
                          className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          + Создать своё поле
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {customFields.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>Нет дополнительных полей</p>
                <p className="text-sm mt-1">Нажмите &quot;Добавить поле&quot; чтобы расширить информацию</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customFields.map((field) => {
                  const predefined = PREDEFINED_CUSTOM_FIELDS.find(f => f.key === field.key)
                  const isCustomKey = !predefined && !field.key

                  return (
                    <div key={field.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <GripVertical className="w-5 h-5 text-slate-300 mt-2 cursor-grab" />
                      <div className="flex-1 space-y-3">
                        {isCustomKey && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Название поля</label>
                              <input
                                type="text"
                                value={field.key}
                                onChange={(e) => updateCustomField(field.id, { key: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="my_field"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Тип</label>
                              <select
                                value={field.type}
                                onChange={(e) => updateCustomField(field.id, { type: e.target.value as CustomField['type'] })}
                                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="text">Текст</option>
                                <option value="textarea">Многострочный текст</option>
                                <option value="number">Число</option>
                                <option value="url">URL</option>
                                <option value="boolean">Да/Нет</option>
                              </select>
                            </div>
                          </div>
                        )}
                        {renderCustomFieldInput(field)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Логотип</h3>
            <div className="space-y-4">
              {formData.logo && (
                <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden">
                  <Image
                    src={formData.logo}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-600">Загрузить логотип</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Или введите URL"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Настройки</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-slate-700">Активен</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasLicense}
                  onChange={(e) => setFormData({ ...formData, hasLicense: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-slate-700">Есть лицензия</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasIosApp}
                  onChange={(e) => setFormData({ ...formData, hasIosApp: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-slate-700">Есть iOS приложение</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAndroidApp}
                  onChange={(e) => setFormData({ ...formData, hasAndroidApp: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-slate-700">Есть Android приложение</span>
              </label>
            </div>
          </div>

          {/* Order */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Сортировка</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Порядок в списке
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Порядок в рейтинге
                </label>
                <input
                  type="number"
                  value={formData.ratingOrder}
                  onChange={(e) => setFormData({ ...formData, ratingOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
