// The Odds API Integration (Tennis & other sports)
// Documentation: https://the-odds-api.com/liveapi/guides/v4/

const API_BASE_URL = 'https://api.the-odds-api.com/v4'
const API_KEY = process.env.ODDS_API_KEY || ''

// Types for API responses
export interface OddsSport {
  key: string
  group: string
  title: string
  description: string
  active: boolean
  has_outrights: boolean
}

export interface OddsEvent {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers?: OddsBookmaker[]
}

export interface OddsBookmaker {
  key: string
  title: string
  last_update: string
  markets: OddsMarket[]
}

export interface OddsMarket {
  key: string
  last_update: string
  outcomes: OddsOutcome[]
}

export interface OddsOutcome {
  name: string
  price: number
  point?: number
}

export interface OddsScore {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  completed: boolean
  home_team: string
  away_team: string
  scores: { name: string; score: string }[] | null
  last_update: string | null
}

// API request helper
async function apiRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  url.searchParams.append('apiKey', API_KEY)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Tennis sport keys mapping
export const TENNIS_SPORTS = {
  // Grand Slams
  ATP_AUSTRALIAN_OPEN: 'tennis_atp_aus_open_singles',
  ATP_FRENCH_OPEN: 'tennis_atp_french_open',
  ATP_WIMBLEDON: 'tennis_atp_wimbledon',
  ATP_US_OPEN: 'tennis_atp_us_open',
  WTA_AUSTRALIAN_OPEN: 'tennis_wta_aus_open_singles',
  WTA_FRENCH_OPEN: 'tennis_wta_french_open',
  WTA_WIMBLEDON: 'tennis_wta_wimbledon',
  WTA_US_OPEN: 'tennis_wta_us_open',
}

// Get all available sports (free - no credits)
export async function fetchSports(all = false): Promise<OddsSport[]> {
  const params = all ? { all: 'true' } : undefined
  return apiRequest<OddsSport[]>('/sports', params)
}

// Get tennis sports only
export async function fetchTennisSports(): Promise<OddsSport[]> {
  const allSports = await fetchSports(true)
  return allSports.filter(sport => sport.key.startsWith('tennis_'))
}

// Get events for a sport (free - no credits)
export async function fetchEvents(sportKey: string): Promise<OddsEvent[]> {
  return apiRequest<OddsEvent[]>(`/sports/${sportKey}/events`)
}

// Get odds for a sport (1 credit per market per region)
export async function fetchOdds(
  sportKey: string,
  options?: {
    regions?: string // us, uk, eu, au
    markets?: string // h2h, spreads, totals
    oddsFormat?: 'decimal' | 'american'
  }
): Promise<OddsEvent[]> {
  const params: Record<string, string> = {
    regions: options?.regions || 'eu',
    markets: options?.markets || 'h2h',
    oddsFormat: options?.oddsFormat || 'decimal',
  }
  return apiRequest<OddsEvent[]>(`/sports/${sportKey}/odds`, params)
}

// Get scores for a sport (1-2 credits)
export async function fetchScores(
  sportKey: string,
  options?: {
    daysFrom?: number // 1-3 days of historical scores
  }
): Promise<OddsScore[]> {
  const params: Record<string, string> = {}
  if (options?.daysFrom) {
    params.daysFrom = options.daysFrom.toString()
  }
  return apiRequest<OddsScore[]>(`/sports/${sportKey}/scores`, params)
}

// Get all tennis events across all tournaments
export async function fetchAllTennisEvents(): Promise<OddsEvent[]> {
  const tennisSports = await fetchTennisSports()
  const activeSports = tennisSports.filter(s => s.active)

  const allEvents: OddsEvent[] = []

  for (const sport of activeSports) {
    try {
      const events = await fetchEvents(sport.key)
      allEvents.push(...events)
    } catch (error) {
      console.error(`Failed to fetch events for ${sport.key}:`, error)
    }
  }

  return allEvents
}

// Get all tennis scores
export async function fetchAllTennisScores(): Promise<OddsScore[]> {
  const tennisSports = await fetchTennisSports()
  const activeSports = tennisSports.filter(s => s.active)

  const allScores: OddsScore[] = []

  for (const sport of activeSports) {
    try {
      const scores = await fetchScores(sport.key, { daysFrom: 1 })
      allScores.push(...scores)
    } catch (error) {
      console.error(`Failed to fetch scores for ${sport.key}:`, error)
    }
  }

  return allScores
}

// Map our tournament slug to Odds API sport key
export const TOURNAMENT_MAPPING: Record<string, string[]> = {
  // Grand Slams
  'australian-open': ['tennis_atp_aus_open_singles', 'tennis_wta_aus_open_singles'],
  'roland-garros': ['tennis_atp_french_open', 'tennis_wta_french_open'],
  'wimbledon': ['tennis_atp_wimbledon', 'tennis_wta_wimbledon'],
  'us-open': ['tennis_atp_us_open', 'tennis_wta_us_open'],
  // ATP Masters 1000
  'indian-wells': ['tennis_atp_indian_wells', 'tennis_wta_indian_wells'],
  'miami-open': ['tennis_atp_miami_open', 'tennis_wta_miami_open'],
  'monte-carlo': ['tennis_atp_monte_carlo_masters'],
  'madrid-open': ['tennis_atp_madrid_open', 'tennis_wta_madrid_open'],
  'italian-open': ['tennis_atp_italian_open', 'tennis_wta_italian_open'],
  'canadian-open': ['tennis_atp_canadian_open', 'tennis_wta_canadian_open'],
  'cincinnati-open': ['tennis_atp_cincinnati_open', 'tennis_wta_cincinnati_open'],
  'shanghai-masters': ['tennis_atp_shanghai_masters'],
  'paris-masters': ['tennis_atp_paris_masters'],
  // ATP 500
  'dubai': ['tennis_atp_dubai', 'tennis_wta_dubai'],
  'qatar-open': ['tennis_atp_qatar_open', 'tennis_wta_qatar_open'],
  'china-open': ['tennis_atp_china_open', 'tennis_wta_china_open'],
}

// Tournament season info (approximate dates)
export const TOURNAMENT_SEASONS: Record<string, { months: string; period: string }> = {
  'australian-open': { months: 'Январь', period: '13-26 января' },
  'roland-garros': { months: 'Май-Июнь', period: '25 мая - 8 июня' },
  'wimbledon': { months: 'Июнь-Июль', period: '30 июня - 13 июля' },
  'us-open': { months: 'Август-Сентябрь', period: '25 августа - 7 сентября' },
  'indian-wells': { months: 'Март', period: '5-16 марта' },
  'miami-open': { months: 'Март', period: '19-30 марта' },
  'monte-carlo': { months: 'Апрель', period: '6-13 апреля' },
  'madrid-open': { months: 'Апрель-Май', period: '25 апреля - 4 мая' },
  'italian-open': { months: 'Май', period: '7-18 мая' },
  'canadian-open': { months: 'Август', period: '4-10 августа' },
  'cincinnati-open': { months: 'Август', period: '11-17 августа' },
  'shanghai-masters': { months: 'Октябрь', period: '1-12 октября' },
  'paris-masters': { months: 'Октябрь-Ноябрь', period: '27 октября - 2 ноября' },
  'dubai': { months: 'Февраль', period: '17-22 февраля' },
  'qatar-open': { months: 'Февраль', period: '17-22 февраля' },
  'china-open': { months: 'Сентябрь-Октябрь', period: '23 сентября - 6 октября' },
}

// Get events for a specific tournament
export async function fetchTournamentEvents(tournamentSlug: string): Promise<OddsEvent[]> {
  const sportKeys = TOURNAMENT_MAPPING[tournamentSlug]
  if (!sportKeys) {
    return []
  }

  const allEvents: OddsEvent[] = []

  for (const sportKey of sportKeys) {
    try {
      const events = await fetchEvents(sportKey)
      allEvents.push(...events)
    } catch (error) {
      console.error(`Failed to fetch events for ${sportKey}:`, error)
    }
  }

  return allEvents
}
