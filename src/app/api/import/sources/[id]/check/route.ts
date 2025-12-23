import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkSourceForNewItems } from '@/lib/import/service'

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
    const source = await prisma.importSource.findUnique({
      where: { id },
    })

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    }

    const result = await checkSourceForNewItems(source)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Check source error:', error)
    return NextResponse.json(
      { error: 'Failed to check source' },
      { status: 500 }
    )
  }
}
