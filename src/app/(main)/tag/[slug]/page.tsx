import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/news/ArticleCard'
import Sidebar from '@/components/layout/Sidebar'
import Pagination from '@/components/ui/Pagination'
import { ArticleWithRelations } from '@/types'
import { Tag } from 'lucide-react'

const PAGE_SIZE = 12

interface TagPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

async function getTag(slug: string) {
  try {
    return await prisma.tag.findUnique({
      where: { slug },
    })
  } catch {
    return null
  }
}

async function getArticles(
  tagId: string,
  page: number
): Promise<{ articles: ArticleWithRelations[]; total: number }> {
  try {
    const where = {
      status: 'PUBLISHED' as const,
      tags: {
        some: { id: tagId },
      },
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
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTag(slug)

  if (!tag) {
    return { title: 'Тег не найден' }
  }

  return {
    title: `#${tag.name}`,
    description: `Все статьи с тегом #${tag.name} на Тренды спорта`,
    openGraph: {
      title: `#${tag.name} | Тренды спорта`,
      description: `Все статьи с тегом #${tag.name} на Тренды спорта`,
    },
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params
  const { page: pageStr } = await searchParams

  const tag = await getTag(slug)

  if (!tag) {
    notFound()
  }

  const page = Math.max(1, parseInt(pageStr || '1'))
  const [{ articles, total }, popularArticles, tags] = await Promise.all([
    getArticles(tag.id, page),
    getPopularArticles(),
    getTags(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tag Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold">#{tag.name}</h1>
        </div>
        <p className="text-slate-600">
          {total} {total === 1 ? 'статья' : total < 5 ? 'статьи' : 'статей'} с тегом #{tag.name}
        </p>
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
                baseUrl={`/tag/${slug}`}
              />
            </>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-slate-500">Статьи с этим тегом не найдены.</p>
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
