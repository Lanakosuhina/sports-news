import { NextRequest, NextResponse } from 'next/server'
import { checkAllActiveSources } from '@/lib/import/service'

// This endpoint can be called by a cron job (e.g., Vercel Cron)
// to automatically check all sources for new articles

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // Allow if no secret is set (for development) or if it matches
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await checkAllActiveSources()

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Failed to check sources' },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggering from admin panel
export async function POST(request: NextRequest) {
  // For POST requests, we require authentication
  // This is called from the admin panel
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await checkAllActiveSources()

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Manual check error:', error)
    return NextResponse.json(
      { error: 'Failed to check sources' },
      { status: 500 }
    )
  }
}
