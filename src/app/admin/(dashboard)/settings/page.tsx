'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Globe, Share2, BarChart3, Image as ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface SiteSettings {
  id: string
  siteName: string
  siteDescription: string | null
  logo: string | null
  favicon: string | null
  socialFacebook: string | null
  socialTwitter: string | null
  socialInstagram: string | null
  socialYoutube: string | null
  analyticsCode: string | null
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const [settings, setSettings] = useState<SiteSettings>({
    id: 'default',
    siteName: '',
    siteDescription: '',
    logo: '',
    favicon: '',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    socialYoutube: '',
    analyticsCode: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'favicon'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(field)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })
      const data = await response.json()
      if (data.url) {
        setSettings({ ...settings, [field]: data.url })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(null)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings({
        ...data,
        siteDescription: data.siteDescription || '',
        logo: data.logo || '',
        favicon: data.favicon || '',
        socialFacebook: data.socialFacebook || '',
        socialTwitter: data.socialTwitter || '',
        socialInstagram: data.socialInstagram || '',
        socialYoutube: data.socialYoutube || '',
        analyticsCode: data.analyticsCode || '',
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Ошибка сохранения настроек')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Ошибка сохранения настроек')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Настройки сайта</h1>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Сохранение...' : saved ? 'Сохранено!' : 'Сохранить'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900">Основные</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Название сайта
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Описание сайта
              </label>
              <textarea
                value={settings.siteDescription || ''}
                onChange={(e) =>
                  setSettings({ ...settings, siteDescription: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900">Брендинг</h2>
          </div>
          <div className="space-y-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Логотип сайта
              </label>
              <div className="space-y-3">
                {settings.logo && (
                  <div className="relative w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                    <Image
                      src={settings.logo}
                      alt="Logo preview"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, logo: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                      title="Удалить"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition ${
                    uploading === 'logo' ? 'bg-blue-50 border-blue-300' : 'border-slate-300'
                  }`}
                >
                  <Upload className={`w-5 h-5 ${uploading === 'logo' ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-sm text-slate-600">
                    {uploading === 'logo' ? 'Загрузка...' : 'Загрузить логотип'}
                  </span>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={settings.logo || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, logo: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Или введите URL: /logo.svg"
                />
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Favicon
              </label>
              <div className="space-y-3">
                {settings.favicon && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 group">
                    <div className="relative w-8 h-8 bg-white rounded overflow-hidden border border-slate-200">
                      <Image
                        src={settings.favicon}
                        alt="Favicon preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm text-slate-600 truncate flex-1">{settings.favicon}</span>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, favicon: '' })}
                      className="p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                      title="Удалить"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div
                  onClick={() => faviconInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition ${
                    uploading === 'favicon' ? 'bg-blue-50 border-blue-300' : 'border-slate-300'
                  }`}
                >
                  <Upload className={`w-5 h-5 ${uploading === 'favicon' ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-sm text-slate-600">
                    {uploading === 'favicon' ? 'Загрузка...' : 'Загрузить favicon'}
                  </span>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*,.ico"
                    onChange={(e) => handleImageUpload(e, 'favicon')}
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={settings.favicon || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, favicon: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Или введите URL: /favicon.ico"
                />
                <p className="text-xs text-slate-500">
                  Рекомендуемый размер: 32×32 или 64×64 пикселей. Форматы: ICO, PNG, SVG
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900">Социальные сети</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={settings.socialFacebook || ''}
                onChange={(e) =>
                  setSettings({ ...settings, socialFacebook: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Twitter / X
              </label>
              <input
                type="url"
                value={settings.socialTwitter || ''}
                onChange={(e) =>
                  setSettings({ ...settings, socialTwitter: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={settings.socialInstagram || ''}
                onChange={(e) =>
                  setSettings({ ...settings, socialInstagram: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                YouTube
              </label>
              <input
                type="url"
                value={settings.socialYoutube || ''}
                onChange={(e) =>
                  setSettings({ ...settings, socialYoutube: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900">Аналитика</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Код аналитики (Google Analytics, Яндекс.Метрика)
              </label>
              <textarea
                value={settings.analyticsCode || ''}
                onChange={(e) =>
                  setSettings({ ...settings, analyticsCode: e.target.value })
                }
                rows={6}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="<!-- Вставьте код аналитики -->"
              />
              <p className="text-xs text-slate-500 mt-1">
                Код будет добавлен в &lt;head&gt; всех страниц сайта
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
