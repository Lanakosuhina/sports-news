import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'
import MatchesSection from '@/components/news/MatchesSection'
import { Calendar, ChevronLeft, Trophy } from 'lucide-react'
import { getTodayMatches, groupMatchesByLeague, TheSportsDBMatch } from '@/lib/thesportsdb'

export const metadata: Metadata = {
  title: 'Матчи сегодня | Центр ставок — Тренды спорта',
  description: 'Все матчи на сегодня. Футбол, хоккей, теннис и другие виды спорта.',
}

export const revalidate = 60 // Revalidate every minute

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


export default async function TodayMatchesPage() {
  const [apiMatches, tags] = await Promise.all([
    getTodayMatches(),
    getTags(),
  ])

  // Separate football and hockey matches
  const footballMatches = apiMatches.filter((m: TheSportsDBMatch) => m.sport === 'football')
  const hockeyMatches = apiMatches.filter((m: TheSportsDBMatch) => m.sport === 'hockey')

  // Group by league
  const footballByLeague = groupMatchesByLeague(footballMatches)
  const hockeyByLeague = groupMatchesByLeague(hockeyMatches)

  const today = new Date()
  const todayStr = today.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/matches"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-500 mb-4 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Центр ставок
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Матчи сегодня</h1>
          </div>
          <p className="text-slate-600 text-lg capitalize">{todayStr}</p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/matches/today"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Сегодня
          </Link>
          <Link
            href="/matches/tomorrow"
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Завтра
          </Link>
          <Link
            href="/matches"
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Все матчи
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Football Matches */}
            {Object.keys(footballByLeague).length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h3 className="text-xl font-bold">Футбол</h3>
                  <span className="text-slate-500">({footballMatches.length})</span>
                </div>
                {Object.entries(footballByLeague).map(([league, matches]) => (
                  <MatchesSection
                    key={league}
                    title={league}
                    matches={matches}
                  />
                ))}
              </div>
            )}

            {/* Hockey Matches */}
            {Object.keys(hockeyByLeague).length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <h3 className="text-xl font-bold">Хоккей</h3>
                  <span className="text-slate-500">({hockeyMatches.length})</span>
                </div>
                {Object.entries(hockeyByLeague).map(([league, matches]) => (
                  <MatchesSection
                    key={league}
                    title={league}
                    matches={matches}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {apiMatches.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Сегодня нет матчей
                </h3>
                <p className="text-slate-500 mb-4">
                  Посмотрите расписание на завтра или полный список матчей
                </p>
                <Link
                  href="/matches/tomorrow"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Матчи завтра
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar popularArticles={[]} tags={tags} />
          </div>
        </div>
      </div>
    </div>
  )
}
