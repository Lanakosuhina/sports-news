import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  syncLeagueData,
  importLeaguesFromCountry,
  getLeagueMapping,
} from '@/lib/import/api-sports-import'
import { fetchLeagues, getCurrentSeason } from '@/lib/api-sports'

// GET - List available leagues and their sync status
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const mapping = await getLeagueMapping()
    const leagues = await prisma.league.findMany({
      include: {
        _count: {
          select: {
            matches: true,
            standings: true,
          },
        },
      },
    })

    const leaguesWithApiInfo = leagues.map((league) => {
      const apiInfo = mapping.get(league.slug)
      return {
        ...league,
        apiId: apiInfo?.apiId || null,
        apiName: apiInfo?.name || null,
        hasApiMapping: !!apiInfo,
      }
    })

    return NextResponse.json({
      leagues: leaguesWithApiInfo,
      currentSeason: getCurrentSeason(),
    })
  } catch (error) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json({ error: 'Failed to fetch leagues' }, { status: 500 })
  }
}

// POST - Sync data for a specific league
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, leagueSlug, country, categoryId, season, options } = body

    switch (action) {
      case 'sync-league': {
        if (!leagueSlug) {
          return NextResponse.json({ error: 'leagueSlug is required' }, { status: 400 })
        }

        const result = await syncLeagueData(leagueSlug, {
          season,
          syncTeams: options?.syncTeams,
          syncStandings: options?.syncStandings,
          syncFixtures: options?.syncFixtures,
          fixturesDays: options?.fixturesDays,
        })

        return NextResponse.json({
          success: true,
          leagueSlug,
          result,
        })
      }

      case 'import-country-leagues': {
        if (!country || !categoryId) {
          return NextResponse.json(
            { error: 'country and categoryId are required' },
            { status: 400 }
          )
        }

        const result = await importLeaguesFromCountry(country, categoryId)

        return NextResponse.json({
          success: true,
          country,
          result,
        })
      }

      case 'fetch-api-leagues': {
        const leagues = await fetchLeagues(country)
        return NextResponse.json({
          success: true,
          leagues: leagues.map((l) => ({
            id: l.league.id,
            name: l.league.name,
            type: l.league.type,
            logo: l.league.logo,
            country: l.country.name,
          })),
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Football import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import data' },
      { status: 500 }
    )
  }
}
