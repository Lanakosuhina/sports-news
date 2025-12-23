import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const notifications = await prisma.importNotification.findMany({
    where: { isRead: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const pendingCount = await prisma.importedItem.count({
    where: { status: 'PENDING' },
  })

  return NextResponse.json({ notifications, pendingCount })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { notificationIds } = body

    if (notificationIds && Array.isArray(notificationIds)) {
      await prisma.importNotification.updateMany({
        where: { id: { in: notificationIds } },
        data: { isRead: true },
      })
    } else {
      // Mark all as read
      await prisma.importNotification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}
