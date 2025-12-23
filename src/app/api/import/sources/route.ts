import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PREDEFINED_SOURCES } from '@/lib/import/sources'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sources = await prisma.importSource.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          importedItems: {
            where: { status: 'PENDING' },
          },
        },
      },
    },
  })

  return NextResponse.json({ sources, predefined: PREDEFINED_SOURCES })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, slug, url, feedUrl, type, defaultCategory, checkInterval } = body

    const source = await prisma.importSource.create({
      data: {
        name,
        slug,
        url,
        feedUrl,
        type: type || 'RSS',
        defaultCategory,
        checkInterval: checkInterval || 30,
      },
    })

    return NextResponse.json({ source })
  } catch (error) {
    console.error('Create source error:', error)
    return NextResponse.json(
      { error: 'Failed to create source' },
      { status: 500 }
    )
  }
}
