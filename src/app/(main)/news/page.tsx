import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import NewsListCards from '@/components/news/NewsListCards'
import LiveMatchesWidget from '@/components/news/LiveMatchesWidget'
import { ArticleWithRelations } from '@/types'
import { ChevronRight } from 'lucide-react'
import { getTodayMatches, SportDBMatch } from '@/lib/sportdb'

export const metadata: Metadata = {
  title: 'Новости | Тренды спорта',
  description: 'Все спортивные новости: футбол, хоккей, теннис, баскетбол, ММА, бокс и другие виды спорта.',
}

async function getAllNews(): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
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

export default async function AllNewsPage() {
  const [articles, categories, todayMatches] = await Promise.all([
    getAllNews(),
    getSportCategories(),
    getTodayMatches(),
  ])

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition">ГЛАВНАЯ</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">НОВОСТИ</span>
        </nav>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Новости</h1>

        {/* Sport Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/news"
            className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium"
          >
            Все новости
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/news/${category.slug}`}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-sm font-medium transition shadow-sm"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News List - Each in separate block */}
          <div className="lg:col-span-2">
            <NewsListCards articles={articles} showCategory={true} />
          </div>

          {/* Sidebar with Today's Matches */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Today's Matches - scheduled only */}
              <LiveMatchesWidget
                matches={todayMatches.filter((m: SportDBMatch) => m.status === 'scheduled')}
                title="Матчи сегодня"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
