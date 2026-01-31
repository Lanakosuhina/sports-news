// API-Sports Football API Integration
// Documentation: https://api-sports.io/documentation/football/v3

const API_BASE_URL = 'https://v3.football.api-sports.io'
const API_KEY = process.env.API_SPORTS_KEY || ''

interface ApiResponse<T> {
  get: string
  parameters: Record<string, string>
  errors: Record<string, string> | string[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: T
}

// API request helper
async function apiRequest<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Types for API responses
export interface ApiLeague {
  league: {
    id: number
    name: string
    type: string
    logo: string
  }
  country: {
    name: string
    code: string
    flag: string
  }
  seasons: Array<{
    year: number
    start: string
    end: string
    current: boolean
  }>
}

export interface ApiTeam {
  team: {
    id: number
    name: string
    code: string
    country: string
    founded: number
    national: boolean
    logo: string
  }
  venue: {
    id: number
    name: string
    address: string
    city: string
    capacity: number
    surface: string
    image: string
  }
}

export interface ApiStanding {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    standings: Array<Array<{
      rank: number
      team: {
        id: number
        name: string
        logo: string
      }
      points: number
      goalsDiff: number
      group: string
      form: string
      status: string
      description: string
      all: {
        played: number
        win: number
        draw: number
        lose: number
        goals: {
          for: number
          against: number
        }
      }
    }>>
  }
}

export interface ApiFixture {
  fixture: {
    id: number
    referee: string
    timezone: string
    date: string
    timestamp: number
    periods: {
      first: number
      second: number
    }
    venue: {
      id: number
      name: string
      city: string
    }
    status: {
      long: string
      short: string
      elapsed: number
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    round: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
      winner: boolean | null
    }
    away: {
      id: number
      name: string
      logo: string
      winner: boolean | null
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: { home: number | null; away: number | null }
    fulltime: { home: number | null; away: number | null }
    extratime: { home: number | null; away: number | null }
    penalty: { home: number | null; away: number | null }
  }
}

// League IDs for popular leagues
export const POPULAR_LEAGUES = {
  // Football
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  BUNDESLIGA: 78,
  SERIE_A: 135,
  LIGUE_1: 61,
  RUSSIAN_PREMIER_LEAGUE: 235,
  CHAMPIONS_LEAGUE: 2,
  EUROPA_LEAGUE: 3,
  // Russia
  RUSSIAN_CUP: 236,
  RUSSIAN_SUPER_CUP: 237,
}

// Fetch leagues by country
export async function fetchLeagues(country?: string, season?: number): Promise<ApiLeague[]> {
  const params: Record<string, string> = {}
  if (country) params.country = country
  if (season) params.season = season.toString()

  const response = await apiRequest<ApiLeague[]>('/leagues', params)
  return response.response
}

// Fetch league by ID
export async function fetchLeague(leagueId: number): Promise<ApiLeague | null> {
  const response = await apiRequest<ApiLeague[]>('/leagues', { id: leagueId.toString() })
  return response.response[0] || null
}

// Fetch teams by league and season
export async function fetchTeams(leagueId: number, season: number): Promise<ApiTeam[]> {
  const response = await apiRequest<ApiTeam[]>('/teams', {
    league: leagueId.toString(),
    season: season.toString(),
  })
  return response.response
}

// Fetch standings by league and season
export async function fetchStandings(leagueId: number, season: number): Promise<ApiStanding | null> {
  const response = await apiRequest<ApiStanding[]>('/standings', {
    league: leagueId.toString(),
    season: season.toString(),
  })
  return response.response[0] || null
}

// Fetch fixtures by league and season
export async function fetchFixtures(
  leagueId: number,
  season: number,
  options?: {
    from?: string // YYYY-MM-DD
    to?: string // YYYY-MM-DD
    status?: string // NS, LIVE, FT, etc.
    round?: string
  }
): Promise<ApiFixture[]> {
  const params: Record<string, string> = {
    league: leagueId.toString(),
    season: season.toString(),
  }
  if (options?.from) params.from = options.from
  if (options?.to) params.to = options.to
  if (options?.status) params.status = options.status
  if (options?.round) params.round = options.round

  const response = await apiRequest<ApiFixture[]>('/fixtures', params)
  return response.response
}

// Fetch today's fixtures
export async function fetchTodayFixtures(leagueId?: number): Promise<ApiFixture[]> {
  const today = new Date().toISOString().split('T')[0]
  const params: Record<string, string> = { date: today }
  if (leagueId) params.league = leagueId.toString()

  const response = await apiRequest<ApiFixture[]>('/fixtures', params)
  return response.response
}

// Fetch live fixtures
export async function fetchLiveFixtures(leagueId?: number): Promise<ApiFixture[]> {
  const params: Record<string, string> = { live: 'all' }
  if (leagueId) params.league = leagueId.toString()

  const response = await apiRequest<ApiFixture[]>('/fixtures', params)
  return response.response
}

// Map API fixture status to our MatchStatus
export function mapFixtureStatus(apiStatus: string): 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED' {
  const statusMap: Record<string, 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'> = {
    TBD: 'SCHEDULED',
    NS: 'SCHEDULED',
    '1H': 'LIVE',
    HT: 'LIVE',
    '2H': 'LIVE',
    ET: 'LIVE',
    BT: 'LIVE',
    P: 'LIVE',
    SUSP: 'LIVE',
    INT: 'LIVE',
    FT: 'FINISHED',
    AET: 'FINISHED',
    PEN: 'FINISHED',
    PST: 'POSTPONED',
    CANC: 'CANCELLED',
    ABD: 'CANCELLED',
    AWD: 'FINISHED',
    WO: 'FINISHED',
  }
  return statusMap[apiStatus] || 'SCHEDULED'
}

// Get current season year
export function getCurrentSeason(): number {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  // Football season usually starts in August
  return month >= 7 ? year : year - 1
}
