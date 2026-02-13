import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'
import MatchesSection from '@/components/news/MatchesSection'
import { StandingWithTeam } from '@/types'
import { Calendar, CalendarDays, Trophy } from 'lucide-react'
import { getAllUpcomingMatches, groupMatchesByLeague, TheSportsDBMatch } from '@/lib/thesportsdb'

export const metadata: Metadata = {
  title: 'Центр ставок — Матчи | Тренды спорта',
  description: 'Расписание матчей на сегодня и завтра. Футбол, хоккей, теннис и другие виды спорта.',
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: {
        slug: {
          in: ['futbol', 'hokkey', 'tennis', 'basketbol'],
        },
      },
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


export default async function MatchesPage() {
  const [apiMatches, categories, tags, standings] = await Promise.all([
    getAllUpcomingMatches(),
    getCategories(),
    getTags(),
    getStandings(),
  ])

  // Separate football and hockey matches
  const footballMatches = apiMatches.filter((m: TheSportsDBMatch) => m.sport === 'football')
  const hockeyMatches = apiMatches.filter((m: TheSportsDBMatch) => m.sport === 'hockey')

  // Group by league
  const footballByLeague = groupMatchesByLeague(footballMatches)
  const hockeyByLeague = groupMatchesByLeague(hockeyMatches)

  // Get today's date for header
  const today = new Date()
  const todayStr = today.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Центр ставок</h1>
          <p className="text-slate-600 text-lg">
            Расписание матчей, результаты и статистика для ваших ставок
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/matches/today"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <Calendar className="w-5 h-5" />
            Матчи сегодня
          </Link>
          <Link
            href="/matches/tomorrow"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <CalendarDays className="w-5 h-5" />
            Матчи завтра
          </Link>
        </div>

        {/* Sport Categories */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">Виды спорта</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/matches/${category.slug}`}
                className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Date Header */}
            <h2 className="text-2xl font-bold mb-6 capitalize">Сегодня, {todayStr}</h2>

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
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Матчей пока нет
                </h3>
                <p className="text-slate-500">
                  На данный момент нет матчей для отображения
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar popularArticles={[]} tags={tags} standings={standings} />
          </div>
        </div>
      </div>
    </div>
  )
}
