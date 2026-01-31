import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'
import MatchesSection from '@/components/news/MatchesSection'
import { ChevronLeft, Trophy } from 'lucide-react'
import { getFootballMatches, getHockeyMatches, SportDBMatch } from '@/lib/sportdb'
import { fetchAllTennisEvents, OddsEvent } from '@/lib/odds-api'

interface SportMatchesPageProps {
  params: Promise<{ sport: string }>
}

const sportConfig: Record<string, { name: string; apiSport: string }> = {
  futbol: { name: 'Футбол', apiSport: 'football' },
  hokkey: { name: 'Хоккей', apiSport: 'hockey' },
  tennis: { name: 'Теннис', apiSport: 'tennis' },
  basketbol: { name: 'Баскетбол', apiSport: 'basketball' },
}

// Convert Odds API events to SportDBMatch format
function convertOddsEventToMatch(event: OddsEvent): SportDBMatch {
  return {
    id: event.id,
    homeTeam: {
      name: event.home_team,
      logo: undefined,
    },
    awayTeam: {
      name: event.away_team,
      logo: undefined,
    },
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    startTime: event.commence_time,
    league: {
      name: event.sport_title,
      country: undefined,
    },
    sport: 'tennis',
  }
}

async function getTennisMatches(): Promise<SportDBMatch[]> {
  try {
    const events = await fetchAllTennisEvents()
    return events.map(convertOddsEventToMatch)
  } catch (error) {
    console.error('Failed to fetch tennis events:', error)
    return []
  }
}

async function getMatchesBySport(sport: string): Promise<SportDBMatch[]> {
  const config = sportConfig[sport]
  if (!config) return []

  switch (config.apiSport) {
    case 'football':
      return getFootballMatches()
    case 'hockey':
      return getHockeyMatches()
    case 'tennis':
      return getTennisMatches()
    default:
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

// Group matches by league
function groupMatchesByLeague(matches: SportDBMatch[]): Record<string, SportDBMatch[]> {
  const grouped: Record<string, SportDBMatch[]> = {}
  matches.forEach((match) => {
    const leagueName = match.league.country
      ? `${match.league.country}: ${match.league.name}`
      : match.league.name
    if (!grouped[leagueName]) {
      grouped[leagueName] = []
    }
    grouped[leagueName].push(match)
  })
  return grouped
}

export async function generateMetadata({ params }: SportMatchesPageProps): Promise<Metadata> {
  const { sport } = await params
  const config = sportConfig[sport]

  if (!config) {
    return { title: 'Матчи | Тренды спорта' }
  }

  return {
    title: `${config.name} — Матчи | Тренды спорта`,
    description: `Расписание матчей по ${config.name.toLowerCase()}. Результаты и статистика.`,
  }
}

export default async function SportMatchesPage({ params }: SportMatchesPageProps) {
  const { sport } = await params
  const config = sportConfig[sport]

  if (!config) {
    notFound()
  }

  const [apiMatches, tags] = await Promise.all([
    getMatchesBySport(sport),
    getTags(),
  ])

  const matchesByLeague = groupMatchesByLeague(apiMatches)

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
            <Trophy className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold">{config.name}</h1>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/matches/futbol"
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              sport === 'futbol'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Футбол
          </Link>
          <Link
            href="/matches/hokkey"
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              sport === 'hokkey'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Хоккей
          </Link>
          <Link
            href="/matches/tennis"
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              sport === 'tennis'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Теннис
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {Object.entries(matchesByLeague).length > 0 ? (
              Object.entries(matchesByLeague).map(([league, leagueMatches]) => (
                <MatchesSection
                  key={league}
                  title={league}
                  matches={leagueMatches}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Матчей пока нет
                </h3>
                <p className="text-slate-500 mb-4">
                  На данный момент матчей по {config.name.toLowerCase()} не найдено
                </p>
                <Link
                  href="/matches"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Все матчи
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
