import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List all ad zones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placement = searchParams.get('placement')
    const rotationGroup = searchParams.get('rotationGroup')
    const activeOnly = searchParams.get('active') === 'true'

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (placement) {
      where.placement = placement
    }

    if (rotationGroup) {
      where.rotationGroup = rotationGroup
    }

    if (activeOnly) {
      const now = new Date()
      where.isActive = true
      where.AND = [
        {
          OR: [
            { startDate: null, endDate: null },
            { startDate: { lte: now }, endDate: null },
            { startDate: null, endDate: { gte: now } },
            { startDate: { lte: now }, endDate: { gte: now } },
          ],
        },
      ]
    }

    const ads = await prisma.adZone.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(ads)
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}

// POST - Create new ad zone
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Generate slug from name if not provided
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const ad = await prisma.adZone.create({
      data: {
        name: data.name,
        slug,
        placement: data.placement || 'sidebar-top',
        size: data.size || 'medium-rectangle',
        imageUrl: data.imageUrl || null,
        linkUrl: data.linkUrl || null,
        code: data.code || null,
        isActive: data.isActive ?? true,
        order: data.order || 0,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        rotationGroup: data.rotationGroup || null,
        rotationInterval: data.rotationInterval || 0,
      },
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 })
  }
}
