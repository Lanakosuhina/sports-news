import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { skipImportItem } from '@/lib/import/service'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await skipImportItem(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Skip item error:', error)
    return NextResponse.json(
      { error: 'Failed to skip item' },
      { status: 500 }
    )
  }
}
