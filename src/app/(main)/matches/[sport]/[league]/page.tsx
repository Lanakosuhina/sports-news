import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'
import MatchesSection from '@/components/news/MatchesSection'
import { ChevronLeft, Trophy } from 'lucide-react'
import { getFootballMatches, getHockeyMatches, SportDBMatch } from '@/lib/sportdb'
import { fetchAllTennisEvents, fetchTournamentEvents, OddsEvent, TOURNAMENT_SEASONS } from '@/lib/odds-api'
import { Calendar } from 'lucide-react'

interface LeagueMatchesPageProps {
  params: Promise<{ sport: string; league: string }>
}

const sportConfig: Record<string, { name: string; apiSport: string }> = {
  futbol: { name: 'Футбол', apiSport: 'football' },
  hokkey: { name: 'Хоккей', apiSport: 'hockey' },
  tennis: { name: 'Теннис', apiSport: 'tennis' },
  basketbol: { name: 'Баскетбол', apiSport: 'basketball' },
}

const leagueConfig: Record<string, { name: string; keywords: string[] }> = {
  // Football leagues
  'liga-chempionov': { name: 'Лига чемпионов', keywords: ['Champions League', 'UEFA Champions'] },
  'apl': { name: 'АПЛ', keywords: ['Premier League'] },
  'la-liga': { name: 'Ла Лига', keywords: ['LaLiga', 'La Liga'] },
  'seriya-a': { name: 'Серия А', keywords: ['Serie A'] },
  'bundesliga': { name: 'Бундеслига', keywords: ['Bundesliga'] },
  'liga-1': { name: 'Лига 1', keywords: ['Ligue 1'] },
  // Hockey leagues
  'khl': { name: 'КХЛ', keywords: ['KHL'] },
  'nhl': { name: 'НХЛ', keywords: ['NHL'] },
  // Tennis tournaments - Grand Slams
  'australian-open': { name: 'Australian Open', keywords: ['Australian Open'] },
  'roland-garros': { name: 'Roland Garros', keywords: ['Roland Garros', 'French Open'] },
  'wimbledon': { name: 'Уимблдон', keywords: ['Wimbledon'] },
  'us-open': { name: 'US Open', keywords: ['US Open'] },
  // Tennis tournaments - Masters 1000
  'indian-wells': { name: 'Indian Wells', keywords: ['Indian Wells'] },
  'miami-open': { name: 'Miami Open', keywords: ['Miami Open'] },
  'monte-carlo': { name: 'Monte-Carlo Masters', keywords: ['Monte-Carlo', 'Monte Carlo'] },
  'madrid-open': { name: 'Madrid Open', keywords: ['Madrid Open'] },
  'italian-open': { name: 'Italian Open', keywords: ['Italian Open', 'Rome'] },
  'canadian-open': { name: 'Canadian Open', keywords: ['Canadian Open'] },
  'cincinnati-open': { name: 'Cincinnati Open', keywords: ['Cincinnati'] },
  'shanghai-masters': { name: 'Shanghai Masters', keywords: ['Shanghai'] },
  'paris-masters': { name: 'Paris Masters', keywords: ['Paris Masters'] },
  // Tennis tournaments - ATP 500
  'dubai': { name: 'Dubai Tennis', keywords: ['Dubai'] },
  'qatar-open': { name: 'Qatar Open', keywords: ['Qatar'] },
  'china-open': { name: 'China Open', keywords: ['China Open'] },
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

async function getTennisTournamentMatches(tournamentSlug: string): Promise<SportDBMatch[]> {
  try {
    const events = await fetchTournamentEvents(tournamentSlug)
    return events.map(convertOddsEventToMatch)
  } catch (error) {
    console.error(`Failed to fetch tennis tournament ${tournamentSlug}:`, error)
    return []
  }
}

function filterMatchesByLeague(matches: SportDBMatch[], leagueSlug: string): SportDBMatch[] {
  const config = leagueConfig[leagueSlug]
  if (!config) return []

  return matches.filter((match) => {
    const leagueName = match.league.name.toLowerCase()
    const countryLeague = match.league.country
      ? `${match.league.country}: ${match.league.name}`.toLowerCase()
      : leagueName

    return config.keywords.some(
      (keyword) =>
        leagueName.includes(keyword.toLowerCase()) ||
        countryLeague.includes(keyword.toLowerCase())
    )
  })
}

export async function generateMetadata({ params }: LeagueMatchesPageProps): Promise<Metadata> {
  const { sport, league } = await params
  const sportConf = sportConfig[sport]
  const leagueConf = leagueConfig[league]

  if (!sportConf || !leagueConf) {
    return { title: 'Матчи | Тренды спорта' }
  }

  return {
    title: `${leagueConf.name} — ${sportConf.name} | Тренды спорта`,
    description: `Матчи ${leagueConf.name}. Расписание, результаты и статистика.`,
  }
}

export default async function LeagueMatchesPage({ params }: LeagueMatchesPageProps) {
  const { sport, league } = await params
  const sportConf = sportConfig[sport]
  const leagueConf = leagueConfig[league]

  if (!sportConf) {
    notFound()
  }

  // Fetch tags
  const tags = await getTags()

  // For tennis tournaments, fetch directly from Odds API
  let leagueMatches: SportDBMatch[] = []

  if (sportConf.apiSport === 'tennis' && leagueConf) {
    // Direct tournament fetch for tennis
    leagueMatches = await getTennisTournamentMatches(league)
  } else {
    const allMatches = await getMatchesBySport(sport)
    // Filter matches for specific league
    leagueMatches = leagueConf
      ? filterMatchesByLeague(allMatches, league)
      : allMatches
  }

  const leagueName = leagueConf?.name || league.replace(/-/g, ' ')

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/matches" className="hover:text-blue-500 transition">
            Центр ставок
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <Link href={`/matches/${sport}`} className="hover:text-blue-500 transition">
            {sportConf.name}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-slate-900">{leagueName}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold">{leagueName}</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Матчи {leagueName} — {sportConf.name}
          </p>
        </div>

        {/* Back Link */}
        <div className="mb-8">
          <Link
            href={`/matches/${sport}`}
            className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Все матчи {sportConf.name.toLowerCase()}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {leagueMatches.length > 0 ? (
              <MatchesSection
                title={leagueName}
                matches={leagueMatches}
              />
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Матчей в {leagueName} пока нет
                </h3>
                {sportConf.apiSport === 'tennis' && TOURNAMENT_SEASONS[league] ? (
                  <>
                    <p className="text-slate-500 mb-4">
                      Турнир проводится в другое время года
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 inline-block">
                      <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                        <Calendar className="w-5 h-5" />
                        <span>Сезон турнира</span>
                      </div>
                      <p className="text-blue-600 text-lg font-semibold">
                        {TOURNAMENT_SEASONS[league].period}
                      </p>
                      <p className="text-blue-500 text-sm">
                        ({TOURNAMENT_SEASONS[league].months})
                      </p>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">
                      Матчи появятся когда турнир начнётся
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500 mb-4">
                    На данный момент нет активных матчей в этом турнире
                  </p>
                )}
                <Link
                  href={`/matches/${sport}`}
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Все матчи {sportConf.name.toLowerCase()}
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
