/**
 * TheSportsDB Free API Integration
 * https://www.thesportsdb.com/api.php
 * Uses public API key "3" for free tier
 */

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3'

// Popular football leagues
const FOOTBALL_LEAGUES = [
  4328, // English Premier League
  4335, // Spanish La Liga
  4331, // German Bundesliga
  4332, // Italian Serie A
  4334, // French Ligue 1
  4344, // Portuguese Primeira Liga
  4330, // Scottish Premiership
  4337, // Dutch Eredivisie
  4351, // Belgian First Division A
  4359, // Russian Premier League
]

// Popular hockey leagues
const HOCKEY_LEAGUES = [
  4380, // NHL
  4520, // KHL
]

export interface TheSportsDBMatch {
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

interface TSDBEvent {
  idEvent: string
  strEvent: string
  strHomeTeam: string
  strAwayTeam: string
  strHomeTeamBadge?: string
  strAwayTeamBadge?: string
  intHomeScore?: string | null
  intAwayScore?: string | null
  strStatus?: string
  dateEvent: string
  strTime: string
  strLeague: string
  strCountry?: string
}

interface TSDBEventsResponse {
  events: TSDBEvent[] | null
}

function mapStatus(status?: string): TheSportsDBMatch['status'] {
  if (!status) return 'scheduled'
  const s = status.toLowerCase()
  if (s.includes('ft') || s.includes('aet') || s.includes('pen') || s === 'match finished') {
    return 'finished'
  }
  if (s.includes('live') || s.includes('ht') || /^\d+/.test(s) || s === '1h' || s === '2h') {
    return 'live'
  }
  if (s.includes('post') || s.includes('canc') || s.includes('abd')) {
    return 'postponed'
  }
  return 'scheduled'
}

function mapEvent(event: TSDBEvent, sport: string): TheSportsDBMatch {
  return {
    id: event.idEvent,
    homeTeam: {
      name: event.strHomeTeam,
      logo: event.strHomeTeamBadge,
    },
    awayTeam: {
      name: event.strAwayTeam,
      logo: event.strAwayTeamBadge,
    },
    homeScore: event.intHomeScore != null ? parseInt(event.intHomeScore, 10) : null,
    awayScore: event.intAwayScore != null ? parseInt(event.intAwayScore, 10) : null,
    status: mapStatus(event.strStatus),
    startTime: `${event.dateEvent}T${event.strTime || '00:00'}:00`,
    league: {
      name: event.strLeague,
      country: event.strCountry,
    },
    sport,
  }
}

async function fetchEvents(leagueId: number, sport: string): Promise<TheSportsDBMatch[]> {
  try {
    const response = await fetch(
      `${API_BASE}/eventsnextleague.php?id=${leagueId}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      console.error(`TheSportsDB API error for league ${leagueId}:`, response.status)
      return []
    }

    const data: TSDBEventsResponse = await response.json()

    if (!data.events) return []

    return data.events.map(e => mapEvent(e, sport))
  } catch (error) {
    console.error(`Error fetching events for league ${leagueId}:`, error)
    return []
  }
}

async function fetchPastEvents(leagueId: number, sport: string): Promise<TheSportsDBMatch[]> {
  try {
    const response = await fetch(
      `${API_BASE}/eventspastleague.php?id=${leagueId}`,
      { next: { revalidate: 300 } }
    )

    if (!response.ok) return []

    const data: TSDBEventsResponse = await response.json()

    if (!data.events) return []

    return data.events.map(e => mapEvent(e, sport))
  } catch (error) {
    console.error(`Error fetching past events for league ${leagueId}:`, error)
    return []
  }
}

/**
 * Get all upcoming matches across football and hockey leagues
 */
export async function getAllUpcomingMatches(): Promise<TheSportsDBMatch[]> {
  const footballPromises = FOOTBALL_LEAGUES.map(id => fetchEvents(id, 'football'))
  const hockeyPromises = HOCKEY_LEAGUES.map(id => fetchEvents(id, 'hockey'))

  const results = await Promise.all([...footballPromises, ...hockeyPromises])
  const allMatches = results.flat()

  // Sort by start time
  allMatches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return allMatches
}

/**
 * Get today's matches (filter from upcoming)
 */
export async function getTodayMatches(): Promise<TheSportsDBMatch[]> {
  const allMatches = await getAllUpcomingMatches()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Also get recent past events to include finished matches
  const footballPast = await Promise.all(FOOTBALL_LEAGUES.slice(0, 5).map(id => fetchPastEvents(id, 'football')))
  const hockeyPast = await Promise.all(HOCKEY_LEAGUES.map(id => fetchPastEvents(id, 'hockey')))

  const pastMatches = [...footballPast.flat(), ...hockeyPast.flat()]
    .filter(m => m.startTime.startsWith(todayStr))

  const todayUpcoming = allMatches.filter(m => m.startTime.startsWith(todayStr))

  // Combine and dedupe by id
  const combined = [...pastMatches, ...todayUpcoming]
  const seen = new Set<string>()
  const unique = combined.filter(m => {
    if (seen.has(m.id)) return false
    seen.add(m.id)
    return true
  })

  unique.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return unique
}

/**
 * Get tomorrow's matches
 */
export async function getTomorrowMatches(): Promise<TheSportsDBMatch[]> {
  const allMatches = await getAllUpcomingMatches()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  return allMatches.filter(m => m.startTime.startsWith(tomorrowStr))
}

/**
 * Group matches by league
 */
export function groupMatchesByLeague(matches: TheSportsDBMatch[]): Record<string, TheSportsDBMatch[]> {
  const grouped: Record<string, TheSportsDBMatch[]> = {}

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
export function getStatusLabel(status: TheSportsDBMatch['status']): string {
  const labels: Record<TheSportsDBMatch['status'], string> = {
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
export function getStatusColor(status: TheSportsDBMatch['status']): string {
  const colors: Record<TheSportsDBMatch['status'], string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    live: 'bg-red-500 text-white animate-pulse',
    finished: 'bg-green-100 text-green-700',
    postponed: 'bg-yellow-100 text-yellow-700',
  }
  return colors[status]
}

// Re-export as SportDBMatch for compatibility
export type SportDBMatch = TheSportsDBMatch
