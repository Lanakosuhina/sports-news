import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { importItemAsArticle } from '@/lib/import/service'

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
    const body = await request.json()
    const { categoryId, tagIds, fetchFullContent, status } = body

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    const result = await importItemAsArticle(id, categoryId, tagIds || [], {
      fetchFullContent,
      status,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Import item error:', error)
    return NextResponse.json(
      { error: 'Failed to import item' },
      { status: 500 }
    )
  }
}
