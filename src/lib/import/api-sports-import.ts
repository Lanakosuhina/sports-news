// API-Sports Import Service
// Transforms API data and imports into our database

import { prisma } from '@/lib/prisma'
import {
  fetchLeagues,
  fetchTeams,
  fetchStandings,
  fetchFixtures,
  mapFixtureStatus,
  getCurrentSeason,
  type ApiLeague,
  type ApiTeam,
  type ApiStanding,
  type ApiFixture,
} from '@/lib/api-sports'

// Create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Import a single league
export async function importLeague(apiLeague: ApiLeague, categoryId: string): Promise<string> {
  const slug = createSlug(apiLeague.league.name)

  const league = await prisma.league.upsert({
    where: { slug },
    update: {
      name: apiLeague.league.name,
      country: apiLeague.country.name,
      logo: apiLeague.league.logo,
    },
    create: {
      name: apiLeague.league.name,
      slug,
      country: apiLeague.country.name,
      logo: apiLeague.league.logo,
      categoryId,
    },
  })

  return league.id
}

// Import leagues for a country
export async function importLeaguesFromCountry(
  country: string,
  categoryId: string
): Promise<{ imported: number; updated: number }> {
  const apiLeagues = await fetchLeagues(country)
  let imported = 0
  let updated = 0

  for (const apiLeague of apiLeagues) {
    const slug = createSlug(apiLeague.league.name)
    const existing = await prisma.league.findUnique({ where: { slug } })

    await importLeague(apiLeague, categoryId)

    if (existing) {
      updated++
    } else {
      imported++
    }
  }

  return { imported, updated }
}

// Import a single team
export async function importTeam(apiTeam: ApiTeam): Promise<string> {
  const slug = createSlug(apiTeam.team.name)

  const team = await prisma.team.upsert({
    where: { slug },
    update: {
      name: apiTeam.team.name,
      shortName: apiTeam.team.code || undefined,
      logo: apiTeam.team.logo,
      country: apiTeam.team.country,
    },
    create: {
      name: apiTeam.team.name,
      slug,
      shortName: apiTeam.team.code || undefined,
      logo: apiTeam.team.logo,
      country: apiTeam.team.country,
    },
  })

  return team.id
}

// Import teams for a league
export async function importTeamsFromLeague(
  apiLeagueId: number,
  season?: number
): Promise<{ imported: number; updated: number }> {
  const currentSeason = season || getCurrentSeason()
  const apiTeams = await fetchTeams(apiLeagueId, currentSeason)
  let imported = 0
  let updated = 0

  for (const apiTeam of apiTeams) {
    const slug = createSlug(apiTeam.team.name)
    const existing = await prisma.team.findUnique({ where: { slug } })

    await importTeam(apiTeam)

    if (existing) {
      updated++
    } else {
      imported++
    }
  }

  return { imported, updated }
}

// Find or create team by API team data
async function findOrCreateTeamFromApi(apiTeam: { id: number; name: string; logo: string }): Promise<string> {
  const slug = createSlug(apiTeam.name)

  const team = await prisma.team.upsert({
    where: { slug },
    update: {
      logo: apiTeam.logo,
    },
    create: {
      name: apiTeam.name,
      slug,
      logo: apiTeam.logo,
    },
  })

  return team.id
}

// Import standings for a league
export async function importStandingsFromLeague(
  apiLeagueId: number,
  leagueId: string,
  season?: number
): Promise<{ imported: number; updated: number }> {
  const currentSeason = season || getCurrentSeason()
  const apiStanding = await fetchStandings(apiLeagueId, currentSeason)

  if (!apiStanding || !apiStanding.league.standings.length) {
    return { imported: 0, updated: 0 }
  }

  let imported = 0
  let updated = 0
  const seasonStr = currentSeason.toString()

  // API returns nested arrays for different groups
  for (const group of apiStanding.league.standings) {
    for (const standing of group) {
      const teamId = await findOrCreateTeamFromApi(standing.team)

      const existing = await prisma.standing.findUnique({
        where: {
          teamId_leagueId_season: {
            teamId,
            leagueId,
            season: seasonStr,
          },
        },
      })

      await prisma.standing.upsert({
        where: {
          teamId_leagueId_season: {
            teamId,
            leagueId,
            season: seasonStr,
          },
        },
        update: {
          position: standing.rank,
          played: standing.all.played,
          won: standing.all.win,
          drawn: standing.all.draw,
          lost: standing.all.lose,
          goalsFor: standing.all.goals.for,
          goalsAgainst: standing.all.goals.against,
          points: standing.points,
        },
        create: {
          teamId,
          leagueId,
          season: seasonStr,
          position: standing.rank,
          played: standing.all.played,
          won: standing.all.win,
          drawn: standing.all.draw,
          lost: standing.all.lose,
          goalsFor: standing.all.goals.for,
          goalsAgainst: standing.all.goals.against,
          points: standing.points,
        },
      })

      if (existing) {
        updated++
      } else {
        imported++
      }
    }
  }

  return { imported, updated }
}

// Import fixtures for a league
export async function importFixturesFromLeague(
  apiLeagueId: number,
  leagueId: string,
  options?: {
    season?: number
    from?: string
    to?: string
    status?: string
  }
): Promise<{ imported: number; updated: number; failed: number }> {
  const currentSeason = options?.season || getCurrentSeason()
  const apiFixtures = await fetchFixtures(apiLeagueId, currentSeason, {
    from: options?.from,
    to: options?.to,
    status: options?.status,
  })

  let imported = 0
  let updated = 0
  let failed = 0

  for (const fixture of apiFixtures) {
    try {
      const homeTeamId = await findOrCreateTeamFromApi(fixture.teams.home)
      const awayTeamId = await findOrCreateTeamFromApi(fixture.teams.away)
      const matchDate = new Date(fixture.fixture.date)
      const status = mapFixtureStatus(fixture.fixture.status.short)

      // Check for existing match
      const existingMatch = await prisma.match.findFirst({
        where: {
          homeTeamId,
          awayTeamId,
          leagueId,
          matchDate: {
            gte: new Date(matchDate.getTime() - 3600000),
            lte: new Date(matchDate.getTime() + 3600000),
          },
        },
      })

      if (existingMatch) {
        await prisma.match.update({
          where: { id: existingMatch.id },
          data: {
            homeScore: fixture.goals.home,
            awayScore: fixture.goals.away,
            status,
            venue: fixture.fixture.venue?.name,
          },
        })
        updated++
      } else {
        await prisma.match.create({
          data: {
            homeTeamId,
            awayTeamId,
            leagueId,
            matchDate,
            homeScore: fixture.goals.home,
            awayScore: fixture.goals.away,
            status,
            venue: fixture.fixture.venue?.name,
          },
        })
        imported++
      }
    } catch (error) {
      console.error('Failed to import fixture:', error)
      failed++
    }
  }

  return { imported, updated, failed }
}

// Get league mapping between API IDs and our database IDs
export async function getLeagueMapping(): Promise<Map<string, { apiId: number; name: string }>> {
  // This mapping connects our league slugs to API-Sports league IDs
  const mapping = new Map<string, { apiId: number; name: string }>([
    // Russia
    ['rpl', { apiId: 235, name: 'Russian Premier League' }],
    ['kubok-rossii', { apiId: 236, name: 'Russian Cup' }],
    // England
    ['apl', { apiId: 39, name: 'Premier League' }],
    // Spain
    ['la-liga', { apiId: 140, name: 'La Liga' }],
    // Germany
    ['bundesliga', { apiId: 78, name: 'Bundesliga' }],
    // Italy
    ['seriya-a', { apiId: 135, name: 'Serie A' }],
    // France
    ['liga-1', { apiId: 61, name: 'Ligue 1' }],
    // European competitions
    ['liga-chempionov', { apiId: 2, name: 'Champions League' }],
    ['liga-evropyi', { apiId: 3, name: 'Europa League' }],
    ['liga-konferenciy', { apiId: 848, name: 'Conference League' }],
  ])

  return mapping
}

// Sync all data for a league
export async function syncLeagueData(
  leagueSlug: string,
  options?: {
    season?: number
    syncTeams?: boolean
    syncStandings?: boolean
    syncFixtures?: boolean
    fixturesDays?: number // Number of days to sync fixtures (past and future)
  }
): Promise<{
  teams: { imported: number; updated: number }
  standings: { imported: number; updated: number }
  fixtures: { imported: number; updated: number; failed: number }
}> {
  const mapping = await getLeagueMapping()
  const leagueInfo = mapping.get(leagueSlug)

  if (!leagueInfo) {
    throw new Error(`Unknown league slug: ${leagueSlug}`)
  }

  const league = await prisma.league.findUnique({ where: { slug: leagueSlug } })
  if (!league) {
    throw new Error(`League not found in database: ${leagueSlug}`)
  }

  const result = {
    teams: { imported: 0, updated: 0 },
    standings: { imported: 0, updated: 0 },
    fixtures: { imported: 0, updated: 0, failed: 0 },
  }

  const season = options?.season || getCurrentSeason()

  if (options?.syncTeams !== false) {
    result.teams = await importTeamsFromLeague(leagueInfo.apiId, season)
  }

  if (options?.syncStandings !== false) {
    result.standings = await importStandingsFromLeague(leagueInfo.apiId, league.id, season)
  }

  if (options?.syncFixtures !== false) {
    const days = options?.fixturesDays || 30
    const now = new Date()
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const to = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    result.fixtures = await importFixturesFromLeague(leagueInfo.apiId, league.id, {
      season,
      from,
      to,
    })
  }

  return result
}
