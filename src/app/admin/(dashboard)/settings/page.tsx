'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Share2, BarChart3, Image as ImageIcon } from 'lucide-react'

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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL логотипа
              </label>
              <input
                type="text"
                value={settings.logo || ''}
                onChange={(e) =>
                  setSettings({ ...settings, logo: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/logo.svg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL favicon
              </label>
              <input
                type="text"
                value={settings.favicon || ''}
                onChange={(e) =>
                  setSettings({ ...settings, favicon: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/favicon.ico"
              />
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
