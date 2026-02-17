/**
 * API-Sport.ru Integration
 * Fetches matches, fixtures, scores for football, hockey, tennis
 * API Docs: https://app.api-sport.ru/docs
 */

const API_SPORT_URL = 'https://api.api-sport.ru/v2'
const API_SPORT_KEY = process.env.API_SPORT_KEY || ''

// ============================================================================
// Types
// ============================================================================

export interface SportDBMatch {
  id: string
  homeTeam: {
    name: string
    logo?: string
  }
  awayTeam: {
    name: string
    logo?: string
  }
  homeScore: number | null
  awayScore: number | null
  status: 'scheduled' | 'live' | 'finished' | 'postponed'
  startTime: string
  league: {
    name: string
    country?: string
    id?: number
  }
  sport: string
  minute?: number
}

// Raw API response structure from API-Sport.ru
interface ApiSportMatch {
  id: number
  status: string
  dateEvent: string
  startTimestamp: number
  currentMatchMinute?: number
  tournament: {
    id: number
    name: string
    translations?: { ru?: string }
    image?: string
  }
  category: {
    id: number
    name: string
    translations?: { ru?: string }
    image?: string
  }
  homeTeam: {
    id: number
    name: string
    translations?: { ru?: string }
    image?: string
  }
  awayTeam: {
    id: number
    name: string
    translations?: { ru?: string }
    image?: string
  }
  homeScore?: { current?: number }
  awayScore?: { current?: number }
}

interface ApiSportResponse {
  totalMatches: number
  matches: ApiSportMatch[]
}

// ============================================================================
// League/Tournament Configuration
// ============================================================================

/**
 * Tournament IDs for filtering (discovered from API)
 */
export const TOURNAMENT_IDS = {
  // Football
  CHAMPIONS_LEAGUE: 7,
  EUROPA_LEAGUE: 679,
  PREMIER_LEAGUE: 17,
  LA_LIGA: 8,
  SERIE_A: 23,
  BUNDESLIGA: 35,
  LIGUE_1: 34,
  // Hockey
  KHL: 268,
  VHL: 1141,
  MHL: 1159,
  // Tennis Grand Slams (ATP)
  AUSTRALIAN_OPEN_ATP: 2363,
  AUSTRALIAN_OPEN_WTA: 2571,
} as const

/**
 * League slug to tournament IDs mapping
 */
export const LEAGUE_MAPPING: Record<string, { sport: SportSlug; tournamentIds: number[] }> = {
  // Football
  'liga-chempionov': { sport: 'football', tournamentIds: [7] },
  'liga-evropyi': { sport: 'football', tournamentIds: [679] },
  'apl': { sport: 'football', tournamentIds: [17] },
  'la-liga': { sport: 'football', tournamentIds: [8] },
  'seriya-a': { sport: 'football', tournamentIds: [23] },
  'bundesliga': { sport: 'football', tournamentIds: [35] },
  'liga-1': { sport: 'football', tournamentIds: [34] },
  // Hockey
  'khl': { sport: 'ice-hockey', tournamentIds: [268] },
  'nhl': { sport: 'ice-hockey', tournamentIds: [268] }, // Temporary mapping
  // Tennis (will match by name since tournament IDs change per event)
  'australian-open': { sport: 'tennis', tournamentIds: [2363, 2571, 2455, 2650] },
}

/**
 * Available sports in the API
 */
export const AVAILABLE_SPORTS = [
  { slug: 'football', apiSlug: 'football', name: 'Футбол', icon: '⚽' },
  { slug: 'ice-hockey', apiSlug: 'ice-hockey', name: 'Хоккей', icon: '🏒' },
  { slug: 'tennis', apiSlug: 'tennis', name: 'Теннис', icon: '🎾' },
] as const

export type SportSlug = typeof AVAILABLE_SPORTS[number]['slug']

// ============================================================================
// API Functions
// ============================================================================

function mapStatus(apiStatus: string): SportDBMatch['status'] {
  const status = apiStatus.toLowerCase()
  if (status === 'inprogress' || status === 'live' || status === 'in_progress') {
    return 'live'
  }
  if (status === 'finished' || status === 'ended') {
    return 'finished'
  }
  if (status === 'postponed' || status === 'canceled' || status === 'cancelled') {
    return 'postponed'
  }
  return 'scheduled'
}

function mapMatch(raw: ApiSportMatch, sport: string): SportDBMatch {
  const tournamentNameRu = raw.tournament.translations?.ru || raw.tournament.name
  const categoryNameRu = raw.category.translations?.ru || raw.category.name
  const homeNameRu = raw.homeTeam.translations?.ru || raw.homeTeam.name
  const awayNameRu = raw.awayTeam.translations?.ru || raw.awayTeam.name

  return {
    id: String(raw.id),
    homeTeam: {
      name: homeNameRu,
      logo: raw.homeTeam.image,
    },
    awayTeam: {
      name: awayNameRu,
      logo: raw.awayTeam.image,
    },
    homeScore: raw.homeScore?.current ?? null,
    awayScore: raw.awayScore?.current ?? null,
    status: mapStatus(raw.status),
    startTime: new Date(raw.startTimestamp).toISOString(),
    league: {
      name: tournamentNameRu,
      country: categoryNameRu,
      id: raw.tournament.id,
    },
    sport: sport === 'ice-hockey' ? 'hockey' : sport,
    minute: raw.currentMatchMinute,
  }
}

async function fetchFromApiSport<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_SPORT_URL}${endpoint}`, {
      headers: {
        Authorization: API_SPORT_KEY,
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.error('API-Sport error:', response.status, response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('API-Sport fetch error:', error)
    return null
  }
}

/**
 * Get matches by date for a specific sport
 */
async function getMatchesByDateAndSport(
  date: Date,
  sport: typeof AVAILABLE_SPORTS[number]
): Promise<SportDBMatch[]> {
  try {
    const dateStr = date.toISOString().split('T')[0]
    const data = await fetchFromApiSport<ApiSportResponse>(
      `/${sport.apiSlug}/matches?date=${dateStr}`
    )

    if (!data?.matches || !Array.isArray(data.matches)) {
      return []
    }

    return data.matches.map(m => mapMatch(m, sport.slug))
  } catch (error) {
    console.error(`Error fetching ${sport.name} matches:`, error)
    return []
  }
}

/**
 * Get matches by date (all sports combined)
 */
export async function getMatchesByDate(date: Date): Promise<SportDBMatch[]> {
  try {
    const results = await Promise.all(
      AVAILABLE_SPORTS.map(sport => getMatchesByDateAndSport(date, sport))
    )

    const matches = results.flat()
    matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    return matches
  } catch (error) {
    console.error('Error fetching matches by date:', error)
    return []
  }
}

/**
 * Get today's matches (all sports combined)
 */
export async function getTodayMatches(): Promise<SportDBMatch[]> {
  return getMatchesByDate(new Date())
}

/**
 * Get tomorrow's matches (all sports combined)
 */
export async function getTomorrowMatches(): Promise<SportDBMatch[]> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return getMatchesByDate(tomorrow)
}

/**
 * Get all upcoming matches (alias for today)
 */
export async function getAllUpcomingMatches(): Promise<SportDBMatch[]> {
  return getTodayMatches()
}

/**
 * Get matches for a specific sport
 */
export async function getMatchesBySport(sport: SportSlug): Promise<SportDBMatch[]> {
  const sportConfig = AVAILABLE_SPORTS.find(s => s.slug === sport)
  if (!sportConfig) return []

  return getMatchesByDateAndSport(new Date(), sportConfig)
}

/**
 * Get matches by league slug (from URL)
 */
export async function getMatchesByLeague(
  leagueSlug: string,
  date?: Date
): Promise<SportDBMatch[]> {
  const mapping = LEAGUE_MAPPING[leagueSlug]
  if (!mapping) {
    console.warn(`Unknown league slug: ${leagueSlug}`)
    return []
  }

  const sportConfig = AVAILABLE_SPORTS.find(s => s.slug === mapping.sport)
  if (!sportConfig) return []

  const matches = await getMatchesByDateAndSport(date || new Date(), sportConfig)

  // Filter by tournament IDs
  return matches.filter(m => mapping.tournamentIds.includes(m.league.id || 0))
}

/**
 * Get live matches only (currently in progress)
 */
export async function getLiveMatches(): Promise<SportDBMatch[]> {
  const allMatches = await getTodayMatches()
  return allMatches.filter(m => m.status === 'live')
}

/**
 * Get football matches
 */
export async function getFootballMatches(): Promise<SportDBMatch[]> {
  return getMatchesBySport('football')
}

/**
 * Get hockey matches
 */
export async function getHockeyMatches(): Promise<SportDBMatch[]> {
  return getMatchesBySport('ice-hockey')
}

/**
 * Get tennis matches
 */
export async function getTennisMatches(): Promise<SportDBMatch[]> {
  return getMatchesBySport('tennis')
}

/**
 * Get match details
 */
export async function getMatchDetails(matchId: string, sport: SportSlug = 'football') {
  const sportConfig = AVAILABLE_SPORTS.find(s => s.slug === sport)
  if (!sportConfig) return null

  return fetchFromApiSport(`/${sportConfig.apiSlug}/matches/${matchId}`)
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format match time for display
 */
export function formatMatchTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Format match date for display
 */
export function formatMatchDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

/**
 * Get status label in Russian
 */
export function getStatusLabel(status: SportDBMatch['status']): string {
  const labels: Record<SportDBMatch['status'], string> = {
    scheduled: 'Запланирован',
    live: 'Live',
    finished: 'Завершён',
    postponed: 'Отложен',
  }
  return labels[status]
}

/**
 * Get status color class
 */
export function getStatusColor(status: SportDBMatch['status']): string {
  const colors: Record<SportDBMatch['status'], string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    live: 'bg-red-500 text-white animate-pulse',
    finished: 'bg-green-100 text-green-700',
    postponed: 'bg-yellow-100 text-yellow-700',
  }
  return colors[status]
}

/**
 * Group matches by league
 */
export function groupMatchesByLeague(matches: SportDBMatch[]): Record<string, SportDBMatch[]> {
  const grouped: Record<string, SportDBMatch[]> = {}

  matches.forEach(match => {
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

/**
 * Get sport info by slug
 */
export function getSportInfo(slug: string) {
  return AVAILABLE_SPORTS.find(s => s.slug === slug || s.slug === slug.replace('hockey', 'ice-hockey'))
}
