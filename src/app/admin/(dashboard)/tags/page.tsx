'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Tag {
  id: string
  name: string
  slug: string
  _count?: { articles: number }
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/tags/${editingId}` : '/api/tags'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchTags()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save tag:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот тег?')) return

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTags()
      }
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id)
    setFormData({
      name: tag.name,
      slug: tag.slug,
    })
    setShowNew(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setShowNew(false)
    setFormData({ name: '', slug: '' })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (loading) {
    return <div className="p-8 text-center">Загрузка...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Теги</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Новый тег</span>
        </button>
      </div>

      {/* New/Edit Form */}
      {showNew && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            {editingId ? 'Редактировать тег' : 'Новый тег'}
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

      {/* Tags Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                Название
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                Статьи
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    #{tag.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{tag.slug}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {tag._count?.articles || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(tag)}
                        className="p-2 text-slate-400 hover:text-blue-500 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
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
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Теги не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
