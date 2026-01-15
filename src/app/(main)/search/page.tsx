import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/news/ArticleCard'
import Sidebar from '@/components/layout/Sidebar'
import Pagination from '@/components/ui/Pagination'
import { ArticleWithRelations } from '@/types'
import { Search } from 'lucide-react'

const PAGE_SIZE = 12

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

async function searchArticles(
  query: string,
  page: number
): Promise<{ articles: ArticleWithRelations[]; total: number }> {
  if (!query.trim()) {
    return { articles: [], total: 0 }
  }

  try {
    const where = {
      status: 'PUBLISHED' as const,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { excerpt: { contains: query, mode: 'insensitive' as const } },
        { content: { contains: query, mode: 'insensitive' as const } },
      ],
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          author: true,
          category: true,
          league: true,
          tags: true,
        },
      }),
      prisma.article.count({ where }),
    ])

    return { articles, total }
  } catch {
    return { articles: [], total: 0 }
  }
}

async function getPopularArticles(): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 5,
      include: {
        author: true,
        category: true,
        league: true,
        tags: true,
      },
    })
  } catch {
    return []
  }
}

async function getTags() {
  try {
    return await prisma.tag.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: 15,
    })
  } catch {
    return []
  }
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams

  return {
    title: q ? `Поиск: ${q}` : 'Поиск',
    description: q
      ? `Результаты поиска "${q}" на Тренды спорта`
      : 'Поиск спортивных новостей',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = '', page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))

  const [{ articles, total }, popularArticles, tags] = await Promise.all([
    searchArticles(query, page),
    getPopularArticles(),
    getTags(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Поиск</h1>

        {/* Search Form */}
        <form action="/search" method="GET" className="relative max-w-2xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Поиск новостей..."
            className="w-full bg-white rounded-xl px-5 py-4 pr-12 text-lg shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-500 transition"
          >
            <Search className="w-6 h-6" />
          </button>
        </form>

        {query && (
          <p className="text-slate-600 mt-4">
            Найдено <strong>{total}</strong> результатов по запросу &laquo;{query}&raquo;
          </p>
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Results */}
        <div className="lg:col-span-2">
          {!query ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Введите поисковый запрос для поиска статей</p>
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/search?q=${encodeURIComponent(query)}`}
              />
            </>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-slate-500">Статьи по запросу &laquo;{query}&raquo; не найдены</p>
              <p className="text-sm text-slate-400 mt-2">
                Попробуйте другие ключевые слова или просмотрите наши категории
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar popularArticles={popularArticles} tags={tags} />
        </div>
      </div>
    </div>
  )
}
