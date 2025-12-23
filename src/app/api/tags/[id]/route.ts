import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ message: 'Failed to update tag' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.tag.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tag deleted' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ message: 'Failed to delete tag' }, { status: 500 })
  }
}
