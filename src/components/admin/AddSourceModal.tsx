'use client'

import { useState } from 'react'
import { X, Rss, Check } from 'lucide-react'
import { SourceConfig } from '@/lib/import/sources'

interface AddSourceModalProps {
  predefinedSources: SourceConfig[]
  existingSlugs: string[]
  onClose: () => void
  onAdd: (source: {
    name: string
    slug: string
    url: string
    feedUrl?: string
    type: 'RSS' | 'API' | 'SCRAPER'
    defaultCategory?: string
  }) => void
}

export default function AddSourceModal({
  predefinedSources,
  existingSlugs,
  onClose,
  onAdd,
}: AddSourceModalProps) {
  const [mode, setMode] = useState<'predefined' | 'custom'>('predefined')
  const [selectedPredefined, setSelectedPredefined] = useState<string | null>(null)
  const [customSource, setCustomSource] = useState<{
    name: string
    slug: string
    url: string
    feedUrl: string
    type: 'RSS' | 'API' | 'SCRAPER'
  }>({
    name: '',
    slug: '',
    url: '',
    feedUrl: '',
    type: 'RSS',
  })
  const [loading, setLoading] = useState(false)

  const availablePredefined = predefinedSources.filter(
    s => !existingSlugs.includes(s.slug)
  )

  const handleAddPredefined = async () => {
    if (!selectedPredefined) return

    const source = predefinedSources.find(s => s.slug === selectedPredefined)
    if (!source) return

    setLoading(true)
    await onAdd({
      name: source.name,
      slug: source.slug,
      url: source.url,
      feedUrl: source.feedUrl,
      type: source.type,
      defaultCategory: source.defaultCategory,
    })
    setLoading(false)
  }

  const handleAddCustom = async () => {
    if (!customSource.name || !customSource.url) return

    const slug = customSource.slug || customSource.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')

    setLoading(true)
    await onAdd({
      ...customSource,
      slug,
    })
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Add Import Source</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('predefined')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'predefined'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Predefined Sources
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'custom'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Custom Source
            </button>
          </div>

          {mode === 'predefined' ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Select from our list of pre-configured news sources
              </p>

              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {availablePredefined.map(source => (
                  <button
                    key={source.slug}
                    onClick={() => setSelectedPredefined(source.slug)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      selectedPredefined === source.slug
                        ? 'border-blue-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Rss className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{source.name}</h3>
                        <p className="text-xs text-slate-500">{source.type}</p>
                      </div>
                      {selectedPredefined === source.slug && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}

                {availablePredefined.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-slate-500">
                    All predefined sources have been added
                  </div>
                )}
              </div>

              <button
                onClick={handleAddPredefined}
                disabled={!selectedPredefined || loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-emerald-300 text-white font-medium py-3 rounded-lg transition"
              >
                {loading ? 'Adding...' : 'Add Selected Source'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Add a custom RSS feed or news source
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Source Name *
                </label>
                <input
                  type="text"
                  value={customSource.name}
                  onChange={e => setCustomSource({ ...customSource, name: e.target.value })}
                  placeholder="e.g., My Sports Blog"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Website URL *
                </label>
                <input
                  type="url"
                  value={customSource.url}
                  onChange={e => setCustomSource({ ...customSource, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  RSS Feed URL
                </label>
                <input
                  type="url"
                  value={customSource.feedUrl}
                  onChange={e => setCustomSource({ ...customSource, feedUrl: e.target.value })}
                  placeholder="https://example.com/feed.xml"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Source Type
                </label>
                <select
                  value={customSource.type}
                  onChange={e => setCustomSource({ ...customSource, type: e.target.value as 'RSS' | 'API' | 'SCRAPER' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RSS">RSS Feed</option>
                  <option value="API">API</option>
                  <option value="SCRAPER">Web Scraper</option>
                </select>
              </div>

              <button
                onClick={handleAddCustom}
                disabled={!customSource.name || !customSource.url || loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-emerald-300 text-white font-medium py-3 rounded-lg transition"
              >
                {loading ? 'Adding...' : 'Add Custom Source'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
