import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/news/ArticleCard'
import Sidebar from '@/components/layout/Sidebar'
import Pagination from '@/components/ui/Pagination'
import { ArticleWithRelations } from '@/types'

const PAGE_SIZE = 12

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; league?: string }>
}

async function getCategory(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        leagues: {
          orderBy: { name: 'asc' },
        },
      },
    })
  } catch {
    return null
  }
}

async function getArticles(
  categoryId: string,
  page: number,
  leagueSlug?: string
): Promise<{ articles: ArticleWithRelations[]; total: number }> {
  try {
    const where: Record<string, unknown> = {
      categoryId,
      status: 'PUBLISHED',
    }

    if (leagueSlug) {
      const league = await prisma.league.findUnique({
        where: { slug: leagueSlug },
      })
      if (league) {
        where.leagueId = league.id
      }
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

async function getPopularArticles(categoryId: string): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: {
        categoryId,
        status: 'PUBLISHED',
      },
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
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: 'Категория не найдена' }
  }

  return {
    title: `${category.name} — Новости`,
    description: category.description || `Последние новости ${category.name}, обновления и аналитика`,
    openGraph: {
      title: `${category.name} — Новости | Тренды спорта`,
      description: category.description || `Последние новости ${category.name}, обновления и аналитика`,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params
  const { page: pageStr, league: leagueSlug } = await searchParams

  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const page = Math.max(1, parseInt(pageStr || '1'))
  const { articles, total } = await getArticles(category.id, page, leagueSlug)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const [popularArticles, tags] = await Promise.all([
    getPopularArticles(category.id),
    getTags(),
  ])

  const baseUrl = leagueSlug
    ? `/category/${slug}?league=${leagueSlug}`
    : `/category/${slug}`

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-slate-600">{category.description}</p>
        )}

        {/* League filters */}
        {category.leagues.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              href={`/category/${slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                !leagueSlug
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Все
            </Link>
            {category.leagues.map((league) => (
              <Link
                key={league.id}
                href={`/category/${slug}?league=${league.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  leagueSlug === league.slug
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {league.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles */}
        <div className="lg:col-span-2">
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={baseUrl}
              />
            </>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-slate-500">В этой категории пока нет статей.</p>
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
