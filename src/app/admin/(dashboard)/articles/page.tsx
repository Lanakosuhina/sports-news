import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'
import { Plus, Search, Eye, Edit } from 'lucide-react'
import Pagination from '@/components/ui/Pagination'
import DeleteArticleButton from '@/components/admin/DeleteArticleButton'

const PAGE_SIZE = 20

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    category?: string
    q?: string
  }>
}

async function getArticles(
  page: number,
  status?: string,
  categoryId?: string,
  query?: string
) {
  try {
    const where: Record<string, unknown> = {}

    if (status && ['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(status)) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          category: true,
          author: true,
        },
      }),
      prisma.article.count({ where }),
    ])

    return { articles, total }
  } catch {
    return { articles: [], total: 0 }
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function AdminArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const { page: pageStr, status, category, q } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))

  const [{ articles, total }, categories] = await Promise.all([
    getArticles(page, status, category, q),
    getCategories(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Build filter URL
  const buildFilterUrl = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value)
    })
    const queryString = searchParams.toString()
    return `/admin/articles${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Статьи</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Новая статья</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Поиск статей..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Status Filter */}
          <select
            name="status"
            defaultValue={status || ''}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все статусы</option>
            <option value="DRAFT">Черновик</option>
            <option value="PUBLISHED">Опубликовано</option>
            <option value="SCHEDULED">Запланировано</option>
          </select>

          {/* Category Filter */}
          <select
            name="category"
            defaultValue={category || ''}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
          >
            Фильтр
          </button>

          {(status || category || q) && (
            <Link
              href="/admin/articles"
              className="px-6 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg transition"
            >
              Сбросить
            </Link>
          )}
        </form>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Заголовок
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Категория
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Автор
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Просмотры
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Дата
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="font-medium text-slate-900 hover:text-blue-500 line-clamp-1"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {article.category.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {article.author?.name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          article.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : article.status === 'SCHEDULED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {article.views.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {formatDateTime(article.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'PUBLISHED' && (
                          <Link
                            href={`/article/${article.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-slate-600 transition"
                            title="Просмотр"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-2 text-slate-400 hover:text-blue-500 transition"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteArticleButton articleId={article.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Статьи не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl={buildFilterUrl({ status, category, q })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
