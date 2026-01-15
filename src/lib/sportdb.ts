/**
 * SportDB.dev API Integration
 * Fetches live matches, fixtures, scores, and statistics
 */

const SPORTDB_API_URL = 'https://api.sportdb.dev/api/flashscore'
const SPORTDB_API_KEY = process.env.SPORTDB_API_KEY || ''

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
  }
  sport: string
}

export interface SportDBTeamStats {
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

// Raw API response structure
interface FlashscoreMatch {
  eventId: string
  homeName: string
  awayName: string
  homeLogo?: string
  awayLogo?: string
  homeScore?: string | null
  awayScore?: string | null
  eventStage: 'SCHEDULED' | 'LIVE' | 'FINISHED' | string
  startDateTimeUtc: string
  tournamentName: string
  gameTime?: string
}

function mapStatus(eventStage: string): SportDBMatch['status'] {
  switch (eventStage.toUpperCase()) {
    case 'LIVE':
      return 'live'
    case 'FINISHED':
      return 'finished'
    case 'SCHEDULED':
      return 'scheduled'
    default:
      return 'scheduled'
  }
}

function parseLeagueName(tournamentName: string): { name: string; country?: string } {
  // Format: "COUNTRY: League Name"
  const parts = tournamentName.split(': ')
  if (parts.length >= 2) {
    return { country: parts[0], name: parts.slice(1).join(': ') }
  }
  return { name: tournamentName }
}

function mapMatch(raw: FlashscoreMatch, sport: string): SportDBMatch {
  const league = parseLeagueName(raw.tournamentName)
  return {
    id: raw.eventId,
    homeTeam: {
      name: raw.homeName,
      logo: raw.homeLogo,
    },
    awayTeam: {
      name: raw.awayName,
      logo: raw.awayLogo,
    },
    homeScore: raw.homeScore != null ? parseInt(raw.homeScore, 10) : null,
    awayScore: raw.awayScore != null ? parseInt(raw.awayScore, 10) : null,
    status: mapStatus(raw.eventStage),
    startTime: raw.startDateTimeUtc,
    league,
    sport,
  }
}

async function fetchFromSportDB<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${SPORTDB_API_URL}${endpoint}`, {
      headers: {
        'X-API-Key': SPORTDB_API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error('SportDB API error:', response.status, response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('SportDB API fetch error:', error)
    return null
  }
}

/**
 * Get matches by date (football + hockey combined)
 */
export async function getMatchesByDate(date: Date): Promise<SportDBMatch[]> {
  try {
    const dateStr = date.toISOString().split('T')[0] // Format: YYYY-MM-DD

    // Fetch football and hockey matches for specific date
    const [footballData, hockeyData] = await Promise.all([
      fetchFromSportDB<FlashscoreMatch[]>(`/football/fixtures?date=${dateStr}`),
      fetchFromSportDB<FlashscoreMatch[]>(`/hockey/fixtures?date=${dateStr}`),
    ])

    const matches: SportDBMatch[] = []

    if (footballData && Array.isArray(footballData)) {
      matches.push(...footballData.map(m => mapMatch(m, 'football')))
    }

    if (hockeyData && Array.isArray(hockeyData)) {
      matches.push(...hockeyData.map(m => mapMatch(m, 'hockey')))
    }

    // Sort by start time
    matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    return matches
  } catch (error) {
    console.error('Error fetching matches by date:', error)
    return []
  }
}

/**
 * Get tomorrow's matches (football + hockey combined)
 */
export async function getTomorrowMatches(): Promise<SportDBMatch[]> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return getMatchesByDate(tomorrow)
}

/**
 * Get today's matches (football + hockey combined)
 */
export async function getTodayMatches(): Promise<SportDBMatch[]> {
  try {
    // Fetch football and hockey matches in parallel
    const [footballData, hockeyData] = await Promise.all([
      fetchFromSportDB<FlashscoreMatch[]>('/football/live'),
      fetchFromSportDB<FlashscoreMatch[]>('/hockey/live'),
    ])

    const matches: SportDBMatch[] = []

    if (footballData && Array.isArray(footballData)) {
      matches.push(...footballData.map(m => mapMatch(m, 'football')))
    }

    if (hockeyData && Array.isArray(hockeyData)) {
      matches.push(...hockeyData.map(m => mapMatch(m, 'hockey')))
    }

    // Sort by start time
    matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    return matches
  } catch (error) {
    console.error('Error fetching today matches:', error)
    return []
  }
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
  const data = await fetchFromSportDB<FlashscoreMatch[]>('/football/live')
  if (!data || !Array.isArray(data)) {
    return []
  }
  return data.map(m => mapMatch(m, 'football'))
}

/**
 * Get hockey matches
 */
export async function getHockeyMatches(): Promise<SportDBMatch[]> {
  const data = await fetchFromSportDB<FlashscoreMatch[]>('/hockey/live')
  if (!data || !Array.isArray(data)) {
    return []
  }
  return data.map(m => mapMatch(m, 'hockey'))
}

/**
 * Get match details
 */
export async function getMatchDetails(matchId: string) {
  return fetchFromSportDB(`/match/${matchId}/details`)
}

/**
 * Get match lineups
 */
export async function getMatchLineups(matchId: string) {
  return fetchFromSportDB(`/match/${matchId}/lineups`)
}

/**
 * Get match statistics
 */
export async function getMatchStats(matchId: string) {
  return fetchFromSportDB(`/match/${matchId}/stats`)
}

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
