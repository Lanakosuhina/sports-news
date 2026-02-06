'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Star, Check, X, ExternalLink } from 'lucide-react'

interface Bookmaker {
  id: string
  name: string
  slug: string
  logo: string | null
  bonus: string | null
  rating: number
  link: string
  hasLicense: boolean
  isActive: boolean
  order: number
}

export default function BookmakersPage() {
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmakers()
  }, [])

  const fetchBookmakers = async () => {
    try {
      const response = await fetch('/api/bookmakers')
      const data = await response.json()
      if (Array.isArray(data)) {
        setBookmakers(data)
      }
    } catch (error) {
      console.error('Error fetching bookmakers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого букмекера?')) return

    try {
      await fetch(`/api/bookmakers/${id}`, { method: 'DELETE' })
      setBookmakers(bookmakers.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Error deleting bookmaker:', error)
    }
  }

  const toggleActive = async (bookmaker: Bookmaker) => {
    try {
      await fetch(`/api/bookmakers/${bookmaker.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookmaker, isActive: !bookmaker.isActive }),
      })
      setBookmakers(
        bookmakers.map((b) =>
          b.id === bookmaker.id ? { ...b, isActive: !b.isActive } : b
        )
      )
    } catch (error) {
      console.error('Error updating bookmaker:', error)
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Букмекеры</h1>
        <Link
          href="/admin/bookmakers/new"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить букмекера</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Букмекер
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Бонус
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Рейтинг
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Лицензия
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookmakers.length > 0 ? (
              bookmakers.map((bookmaker) => (
                <tr key={bookmaker.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {bookmaker.logo ? (
                        <Image
                          src={bookmaker.logo}
                          alt={bookmaker.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-contain"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                          <span className="text-slate-400 text-xs">N/A</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{bookmaker.name}</p>
                        <p className="text-sm text-slate-500">/{bookmaker.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {bookmaker.bonus ? (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {bookmaker.bonus}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{bookmaker.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {bookmaker.hasLicense ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        Есть
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <X className="w-4 h-4" />
                        Нет
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(bookmaker)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        bookmaker.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {bookmaker.isActive ? 'Активен' : 'Неактивен'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/bookmaker/${bookmaker.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-blue-500 transition"
                        title="Просмотр"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/bookmakers/${bookmaker.id}`}
                        className="p-2 text-slate-400 hover:text-blue-500 transition"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(bookmaker.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  Букмекеров пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
