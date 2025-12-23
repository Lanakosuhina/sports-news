import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        league: true,
        author: true,
        tags: true,
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { message: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    })

    if (!existingArticle) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 })
    }

    // Check slug uniqueness if changed
    let slug = data.slug || slugify(data.title)
    if (slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      })

      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage || null,
        gallery: data.gallery || [],
        videoUrl: data.videoUrl || null,
        status: data.status || 'DRAFT',
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        categoryId: data.categoryId,
        leagueId: data.leagueId || null,
        tags: {
          set: [],
          connect: (data.tags || []).map((tagId: string) => ({ id: tagId })),
        },
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { message: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.article.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Article deleted' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { message: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
