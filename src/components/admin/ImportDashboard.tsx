'use client'

import { useState } from 'react'
import {
  Download,
  RefreshCw,
  Plus,
  Check,
  X,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Rss,
  Globe
} from 'lucide-react'
import { Category, Tag, ImportSource, ImportedItem, ImportJob } from '@prisma/client'
import { SourceConfig } from '@/lib/import/sources'
import ImportItemPreview from './ImportItemPreview'
import AddSourceModal from './AddSourceModal'

interface ImportDashboardProps {
  sources: (ImportSource & { _count: { importedItems: number } })[]
  predefinedSources: SourceConfig[]
  categories: Category[]
  tags: Tag[]
  pendingItems: (ImportedItem & { source: ImportSource })[]
  recentJobs: (ImportJob & { source: ImportSource | null })[]
}

export default function ImportDashboard({
  sources: initialSources,
  predefinedSources,
  categories,
  tags,
  pendingItems: initialPendingItems,
  recentJobs: initialRecentJobs,
}: ImportDashboardProps) {
  const [sources, setSources] = useState(initialSources)
  const [pendingItems, setPendingItems] = useState(initialPendingItems)
  const [recentJobs, setRecentJobs] = useState(initialRecentJobs)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [checkingSource, setCheckingSource] = useState<string | null>(null)
  const [showAddSource, setShowAddSource] = useState(false)
  const [previewItem, setPreviewItem] = useState<(ImportedItem & { source: ImportSource }) | null>(null)
  const [bulkCategory, setBulkCategory] = useState('')
  const [importing, setImporting] = useState(false)

  const handleCheckSource = async (sourceId: string) => {
    setCheckingSource(sourceId)
    try {
      const res = await fetch(`/api/import/sources/${sourceId}/check`, {
        method: 'POST',
      })
      const data = await res.json()

      if (data.success && data.itemsNew > 0) {
        // Refresh pending items
        const itemsRes = await fetch('/api/import/items?status=PENDING&limit=50')
        const itemsData = await itemsRes.json()
        setPendingItems(itemsData.items)
      }

      // Refresh sources to update counts
      const sourcesRes = await fetch('/api/import/sources')
      const sourcesData = await sourcesRes.json()
      setSources(sourcesData.sources)

      alert(`Найдено ${data.itemsFound} элементов, ${data.itemsNew} новых`)
    } catch (error) {
      console.error('Check source error:', error)
      alert('Не удалось проверить источник')
    } finally {
      setCheckingSource(null)
    }
  }

  const handleSkipItem = async (itemId: string) => {
    try {
      await fetch(`/api/import/items/${itemId}/skip`, { method: 'POST' })
      setPendingItems(items => items.filter(i => i.id !== itemId))
      setSelectedItems(items => items.filter(id => id !== itemId))
    } catch (error) {
      console.error('Skip item error:', error)
    }
  }

  const handleImportItem = async (itemId: string, categoryId: string, tagIds: string[], status: 'DRAFT' | 'PUBLISHED') => {
    try {
      const res = await fetch(`/api/import/items/${itemId}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, tagIds, status }),
      })

      if (res.ok) {
        setPendingItems(items => items.filter(i => i.id !== itemId))
        setSelectedItems(items => items.filter(id => id !== itemId))
        setPreviewItem(null)
      } else {
        const data = await res.json()
        alert(data.error || 'Не удалось импортировать')
      }
    } catch (error) {
      console.error('Import item error:', error)
      alert('Не удалось импортировать элемент')
    }
  }

  const handleBulkImport = async () => {
    if (!bulkCategory || selectedItems.length === 0) {
      alert('Выберите категорию и хотя бы один элемент')
      return
    }

    setImporting(true)
    try {
      const res = await fetch('/api/import/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemIds: selectedItems,
          categoryId: bulkCategory,
          status: 'DRAFT',
        }),
      })

      const data = await res.json()
      alert(`Импортировано ${data.success} элементов, ${data.failed} не удалось`)

      // Refresh pending items
      const itemsRes = await fetch('/api/import/items?status=PENDING&limit=50')
      const itemsData = await itemsRes.json()
      setPendingItems(itemsData.items)
      setSelectedItems([])
    } catch (error) {
      console.error('Bulk import error:', error)
      alert('Не удалось выполнить массовый импорт')
    } finally {
      setImporting(false)
    }
  }

  const handleAddSource = async (source: Partial<ImportSource>) => {
    try {
      const res = await fetch('/api/import/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(source),
      })

      if (res.ok) {
        const sourcesRes = await fetch('/api/import/sources')
        const sourcesData = await sourcesRes.json()
        setSources(sourcesData.sources)
        setShowAddSource(false)
      }
    } catch (error) {
      console.error('Add source error:', error)
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === pendingItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(pendingItems.map(i => i.id))
    }
  }

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(items =>
      items.includes(itemId)
        ? items.filter(id => id !== itemId)
        : [...items, itemId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Импорт новостей</h1>
          <p className="text-slate-600">Импортируйте статьи из внешних источников</p>
        </div>
        <button
          onClick={() => setShowAddSource(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Добавить источник
        </button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map(source => (
          <div
            key={source.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  {source.type === 'RSS' ? (
                    <Rss className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Globe className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{source.name}</h3>
                  <p className="text-sm text-slate-500">{source.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                source.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {source.isActive ? 'Активен' : 'Неактивен'}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
              <span>
                {source._count.importedItems} ожидает
              </span>
              {source.lastCheckedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(source.lastCheckedAt).toLocaleTimeString()}
                </span>
              )}
            </div>

            <button
              onClick={() => handleCheckSource(source.id)}
              disabled={checkingSource === source.id}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {checkingSource === source.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Проверить новые статьи
            </button>
          </div>
        ))}

        {sources.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <Rss className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Источники импорта не настроены</p>
            <button
              onClick={() => setShowAddSource(true)}
              className="mt-3 text-blue-500 hover:text-blue-600 font-medium"
            >
              Добавить первый источник
            </button>
          </div>
        )}
      </div>

      {/* Pending Items */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Ожидающие статьи ({pendingItems.length})
          </h2>
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-3">
              <select
                value={bulkCategory}
                onChange={e => setBulkCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={handleBulkImport}
                disabled={importing || !bulkCategory}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                {importing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Импортировать {selectedItems.length} выбранных
              </button>
            </div>
          )}
        </div>

        {pendingItems.length > 0 ? (
          <div className="divide-y divide-slate-200">
            <div className="px-4 py-2 bg-slate-50 flex items-center gap-4 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={selectedItems.length === pendingItems.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="flex-1">Статья</span>
              <span className="w-32">Источник</span>
              <span className="w-32">Дата</span>
              <span className="w-24">Действия</span>
            </div>

            {pendingItems.map(item => (
              <div
                key={item.id}
                className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="text-left hover:text-blue-500 transition"
                  >
                    <h3 className="font-medium text-slate-900 truncate">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-sm text-slate-500 truncate">
                        {item.excerpt}
                      </p>
                    )}
                  </button>
                </div>
                <span className="w-32 text-sm text-slate-500">
                  {item.source.name}
                </span>
                <span className="w-32 text-sm text-slate-500">
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString()
                    : '-'}
                </span>
                <div className="w-24 flex items-center gap-2">
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-600 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 text-green-500 hover:text-green-600 transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSkipItem(item.id)}
                    className="p-1.5 text-red-500 hover:text-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            Нет ожидающих статей. Проверьте источники на наличие нового контента.
          </div>
        )}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Последние задания импорта</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentJobs.map(job => (
            <div key={job.id} className="px-4 py-3 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                job.status === 'COMPLETED' ? 'bg-green-100' :
                job.status === 'FAILED' ? 'bg-red-100' :
                job.status === 'RUNNING' ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                {job.status === 'COMPLETED' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : job.status === 'FAILED' ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : job.status === 'RUNNING' ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  {job.source?.name || 'Неизвестный источник'}
                </p>
                <p className="text-sm text-slate-500">
                  Найдено {job.itemsFound} элементов, {job.itemsNew} новых
                </p>
              </div>
              <span className="text-sm text-slate-500">
                {new Date(job.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
          {recentJobs.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Заданий импорта пока нет
            </div>
          )}
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddSource && (
        <AddSourceModal
          predefinedSources={predefinedSources}
          existingSlugs={sources.map(s => s.slug)}
          onClose={() => setShowAddSource(false)}
          onAdd={handleAddSource}
        />
      )}

      {/* Preview Modal */}
      {previewItem && (
        <ImportItemPreview
          item={previewItem}
          categories={categories}
          tags={tags}
          onClose={() => setPreviewItem(null)}
          onImport={handleImportItem}
          onSkip={handleSkipItem}
        />
      )}
    </div>
  )
}
