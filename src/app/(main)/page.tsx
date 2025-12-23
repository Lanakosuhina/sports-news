import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/news/ArticleCard'
import CategoryGrid from '@/components/news/CategoryGrid'
import Sidebar from '@/components/layout/Sidebar'
import MatchesTable from '@/components/news/MatchesTable'
import LeagueStandings from '@/components/news/LeagueStandings'
import { ArticleWithRelations, MatchWithTeams, StandingWithTeam } from '@/types'
import Link from 'next/link'
import { ChevronRight, Flame } from 'lucide-react'

async function getFeaturedArticle(): Promise<ArticleWithRelations | null> {
  try {
    return await prisma.article.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: true,
        category: true,
        league: true,
        tags: true,
      },
    })
  } catch {
    return null
  }
}

async function getLatestArticles(): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip: 1,
      take: 8,
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

async function getTrendingArticles(): Promise<ArticleWithRelations[]> {
  try {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    return await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: weekAgo }
      },
      orderBy: { views: 'desc' },
      take: 4,
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

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { order: 'asc' },
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

async function getUpcomingMatches(): Promise<MatchWithTeams[]> {
  try {
    return await prisma.match.findMany({
      where: {
        matchDate: { gte: new Date() },
        status: 'SCHEDULED',
      },
      orderBy: { matchDate: 'asc' },
      take: 5,
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
      },
    })
  } catch {
    return []
  }
}

async function getRecentMatches(): Promise<MatchWithTeams[]> {
  try {
    return await prisma.match.findMany({
      where: {
        status: 'FINISHED',
      },
      orderBy: { matchDate: 'desc' },
      take: 6,
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
      },
    })
  } catch {
    return []
  }
}

async function getStandings(): Promise<StandingWithTeam[]> {
  try {
    const currentYear = new Date().getFullYear()
    const season = `${currentYear}-${currentYear + 1}`

    return await prisma.standing.findMany({
      where: {
        season: {
          in: [season, `${currentYear - 1}-${currentYear}`, String(currentYear)]
        }
      },
      orderBy: [
        { leagueId: 'asc' },
        { position: 'asc' }
      ],
      take: 10,
      include: {
        team: true,
      },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [
    featuredArticle,
    latestArticles,
    trendingArticles,
    popularArticles,
    categories,
    tags,
    upcomingMatches,
    recentMatches,
    standings,
  ] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(),
    getTrendingArticles(),
    getPopularArticles(),
    getCategories(),
    getTags(),
    getUpcomingMatches(),
    getRecentMatches(),
    getStandings(),
  ])

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article - Large */}
            {featuredArticle && (
              <div className="lg:col-span-2">
                <ArticleCard article={featuredArticle} variant="featured" />
              </div>
            )}

            {/* Trending Articles - Sidebar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-lg">В тренде</h2>
              </div>
              {trendingArticles.length > 0 ? (
                <div className="space-y-3">
                  {trendingArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="group flex gap-3 bg-slate-800/50 rounded-lg p-3 hover:bg-slate-700/50 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-orange-400 font-medium">
                          {article.category.name}
                        </span>
                        <h3 className="text-sm font-medium text-white group-hover:text-orange-400 transition line-clamp-2 mt-1">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-lg p-4 text-center text-slate-400">
                  Скоро здесь появятся популярные новости
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Категории</h2>
          </div>
          <CategoryGrid categories={categories} />
        </section>
      )}

      {/* Matches & Standings Section */}
      {(recentMatches.length > 0 || upcomingMatches.length > 0 || standings.length > 0) && (
        <section className="bg-white border-y border-slate-200">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Matches */}
              {recentMatches.length > 0 && (
                <div>
                  <MatchesTable
                    matches={recentMatches}
                    title="Последние результаты"
                    variant="recent"
                  />
                </div>
              )}

              {/* Upcoming Matches */}
              {upcomingMatches.length > 0 && (
                <div>
                  <MatchesTable
                    matches={upcomingMatches}
                    title="Ближайшие матчи"
                    variant="upcoming"
                  />
                </div>
              )}

              {/* League Standings */}
              {standings.length > 0 && (
                <div>
                  <LeagueStandings standings={standings} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest News */}
          <div className="lg:col-span-2">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Последние новости</h2>
                <Link
                  href="/search"
                  className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 transition"
                >
                  Все новости <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {latestArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <p className="text-slate-500">Статьи пока не опубликованы.</p>
                  <p className="text-sm text-slate-400 mt-2">
                    Скоро здесь появятся последние спортивные новости!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              popularArticles={popularArticles}
              upcomingMatches={[]}
              standings={standings}
              tags={tags}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
