import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, FolderOpen, Tags, Eye, TrendingUp, Plus } from 'lucide-react'
import { unstable_cache } from 'next/cache'

// Cached stats function - revalidates every 60 seconds
const getCachedStats = unstable_cache(
  async () => {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalCategories,
      totalTags,
      totalViews,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.article.aggregate({ _sum: { views: true } }),
    ])

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalCategories,
      totalTags,
      totalViews: totalViews._sum.views || 0,
    }
  },
  ['admin-dashboard-stats'],
  { revalidate: 60, tags: ['dashboard-stats'] }
)

async function getStats() {
  try {
    return await getCachedStats()
  } catch {
    return {
      totalArticles: 0,
      publishedArticles: 0,
      draftArticles: 0,
      totalCategories: 0,
      totalTags: 0,
      totalViews: 0,
    }
  }
}

async function getRecentArticles() {
  try {
    return await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        category: true,
        author: true,
      },
    })
  } catch {
    return []
  }
}

async function getPopularArticles() {
  try {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 5,
      include: {
        category: true,
      },
    })
  } catch {
    return []
  }
}

export default async function AdminDashboardPage() {
  const [stats, recentArticles, popularArticles] = await Promise.all([
    getStats(),
    getRecentArticles(),
    getPopularArticles(),
  ])

  const statCards = [
    {
      label: 'Всего статей',
      value: stats.totalArticles,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      label: 'Опубликовано',
      value: stats.publishedArticles,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Черновики',
      value: stats.draftArticles,
      icon: FileText,
      color: 'bg-yellow-500',
    },
    {
      label: 'Категории',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'bg-purple-500',
    },
    {
      label: 'Теги',
      value: stats.totalTags,
      icon: Tags,
      color: 'bg-pink-500',
    },
    {
      label: 'Просмотров',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-blue-500',
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Панель управления</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Новая статья</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-slate-900">Последние статьи</h2>
            <Link
              href="/admin/articles"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Все статьи →
            </Link>
          </div>
          <div className="divide-y">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}`}
                  className="block p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {article.category.name} • {article.author?.name || 'Unknown'}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                        article.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : article.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                Статей пока нет
              </div>
            )}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-slate-900">Популярные статьи</h2>
          </div>
          <div className="divide-y">
            {popularArticles.length > 0 ? (
              popularArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition"
                >
                  <span className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {article.category.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{article.views.toLocaleString()}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                Опубликованных статей пока нет
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
