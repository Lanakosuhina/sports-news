import { prisma } from '@/lib/prisma'

export interface MatchData {
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  matchDate: Date
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'
  venue?: string
  leagueId: string
}

export interface TeamData {
  name: string
  shortName?: string
  logo?: string
  country?: string
}

// Find or create a team
async function findOrCreateTeam(teamData: TeamData): Promise<string> {
  const slug = teamData.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')

  const existing = await prisma.team.findUnique({ where: { slug } })
  if (existing) return existing.id

  const team = await prisma.team.create({
    data: {
      name: teamData.name,
      slug,
      shortName: teamData.shortName,
      logo: teamData.logo,
      country: teamData.country,
    },
  })

  return team.id
}

// Import a single match
export async function importMatch(matchData: MatchData): Promise<string> {
  const homeTeamId = await findOrCreateTeam({ name: matchData.homeTeam })
  const awayTeamId = await findOrCreateTeam({ name: matchData.awayTeam })

  // Check if match already exists (same teams, same date, same league)
  const existingMatch = await prisma.match.findFirst({
    where: {
      homeTeamId,
      awayTeamId,
      leagueId: matchData.leagueId,
      matchDate: {
        gte: new Date(matchData.matchDate.getTime() - 3600000), // 1 hour before
        lte: new Date(matchData.matchDate.getTime() + 3600000), // 1 hour after
      },
    },
  })

  if (existingMatch) {
    // Update existing match
    const updated = await prisma.match.update({
      where: { id: existingMatch.id },
      data: {
        homeScore: matchData.homeScore,
        awayScore: matchData.awayScore,
        status: matchData.status,
        venue: matchData.venue,
      },
    })
    return updated.id
  }

  // Create new match
  const match = await prisma.match.create({
    data: {
      homeTeamId,
      awayTeamId,
      homeScore: matchData.homeScore,
      awayScore: matchData.awayScore,
      leagueId: matchData.leagueId,
      matchDate: matchData.matchDate,
      status: matchData.status,
      venue: matchData.venue,
    },
  })

  return match.id
}

// Import multiple matches
export async function importMatches(matches: MatchData[]): Promise<{
  imported: number
  updated: number
  failed: number
}> {
  let imported = 0
  let updated = 0
  let failed = 0

  for (const match of matches) {
    try {
      const existingMatch = await prisma.match.findFirst({
        where: {
          leagueId: match.leagueId,
          matchDate: {
            gte: new Date(match.matchDate.getTime() - 3600000),
            lte: new Date(match.matchDate.getTime() + 3600000),
          },
        },
      })

      await importMatch(match)

      if (existingMatch) {
        updated++
      } else {
        imported++
      }
    } catch (error) {
      console.error('Failed to import match:', error)
      failed++
    }
  }

  return { imported, updated, failed }
}

// Update standings for a league
export async function updateStandings(
  leagueId: string,
  season: string,
  standings: Array<{
    teamName: string
    position: number
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    points: number
  }>
): Promise<void> {
  for (const standing of standings) {
    const teamId = await findOrCreateTeam({ name: standing.teamName })

    await prisma.standing.upsert({
      where: {
        teamId_leagueId_season: {
          teamId,
          leagueId,
          season,
        },
      },
      update: {
        position: standing.position,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        points: standing.points,
      },
      create: {
        teamId,
        leagueId,
        season,
        position: standing.position,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        points: standing.points,
      },
    })
  }
}

// Get today's matches
export async function getTodayMatches() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.match.findMany({
    where: {
      matchDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
    },
    orderBy: { matchDate: 'asc' },
  })
}

// Get upcoming matches
export async function getUpcomingMatches(limit = 10) {
  return prisma.match.findMany({
    where: {
      matchDate: {
        gte: new Date(),
      },
      status: 'SCHEDULED',
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
    },
    orderBy: { matchDate: 'asc' },
    take: limit,
  })
}

// Get recent results
export async function getRecentResults(limit = 10) {
  return prisma.match.findMany({
    where: {
      status: 'FINISHED',
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
    },
    orderBy: { matchDate: 'desc' },
    take: limit,
  })
}
