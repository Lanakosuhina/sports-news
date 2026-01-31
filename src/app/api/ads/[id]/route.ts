import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single ad zone
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const ad = await prisma.adZone.findUnique({
      where: { id },
    })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error fetching ad:', error)
    return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 })
  }
}

// PUT - Update ad zone
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const ad = await prisma.adZone.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        placement: data.placement,
        size: data.size,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        code: data.code,
        isActive: data.isActive,
        order: data.order,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 })
  }
}

// DELETE - Delete ad zone
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.adZone.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 })
  }
}

// PATCH - Track impression or click
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { action } = await request.json()

    if (action === 'impression') {
      await prisma.adZone.update({
        where: { id },
        data: { impressions: { increment: 1 } },
      })
    } else if (action === 'click') {
      await prisma.adZone.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking ad:', error)
    return NextResponse.json({ error: 'Failed to track ad' }, { status: 500 })
  }
}
