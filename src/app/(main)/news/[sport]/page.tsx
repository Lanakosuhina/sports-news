import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import NewsListCards from '@/components/news/NewsListCards'
import { ArticleWithRelations } from '@/types'
import { ChevronRight } from 'lucide-react'

interface SportNewsPageProps {
  params: Promise<{ sport: string }>
}

const sportNames: Record<string, string> = {
  futbol: 'Футбол',
  hokkey: 'Хоккей',
  tennis: 'Теннис',
  basketbol: 'Баскетбол',
  mma: 'ММА',
  boks: 'Бокс',
}

async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
    })
  } catch {
    return null
  }
}

async function getNewsByCategory(categoryId: string): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: {
        categoryId,
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
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

async function getSportCategories() {
  try {
    return await prisma.category.findMany({
      where: {
        slug: {
          in: ['futbol', 'hokkey', 'tennis', 'basketbol', 'mma', 'boks'],
        },
      },
      orderBy: { order: 'asc' },
    })
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: SportNewsPageProps): Promise<Metadata> {
  const { sport } = await params
  const sportName = sportNames[sport] || sport

  return {
    title: `Новости - ${sportName} | Тренды спорта`,
    description: `Последние новости ${sportName.toLowerCase()}: результаты, трансферы, аналитика и обзоры.`,
  }
}

export default async function SportNewsPage({ params }: SportNewsPageProps) {
  const { sport } = await params

  // Check if sport is valid
  if (!sportNames[sport]) {
    notFound()
  }

  const category = await getCategoryBySlug(sport)

  const [articles, categories] = await Promise.all([
    category ? getNewsByCategory(category.id) : Promise.resolve([]),
    getSportCategories(),
  ])

  const sportName = sportNames[sport]

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">ГЛАВНАЯ</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/news" className="hover:text-slate-900 transition">НОВОСТИ</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 uppercase">{sportName}</span>
        </nav>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Новости - {sportName}</h1>

        {/* Sport Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/news"
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-sm font-medium transition shadow-sm"
          >
            Все новости
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/news/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                cat.slug === sport
                  ? 'bg-slate-900 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* News List - Each in separate block */}
        <div className="max-w-4xl">
          {articles.length > 0 ? (
            <NewsListCards articles={articles} showCategory={false} />
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-slate-500">
                В разделе «{sportName}» пока нет новостей.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
