import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { importMatches } from '@/lib/import/matches'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { matches } = body

    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json(
        { error: 'Matches array is required' },
        { status: 400 }
      )
    }

    // Validate and transform match data
    const validatedMatches = matches.map(match => ({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore ?? null,
      awayScore: match.awayScore ?? null,
      matchDate: new Date(match.matchDate),
      status: match.status || 'SCHEDULED',
      venue: match.venue,
      leagueId: match.leagueId,
    }))

    const result = await importMatches(validatedMatches)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Import matches error:', error)
    return NextResponse.json(
      { error: 'Failed to import matches' },
      { status: 500 }
    )
  }
}
