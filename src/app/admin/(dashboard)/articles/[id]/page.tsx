import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/admin/ArticleForm'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

async function getArticle(id: string) {
  try {
    return await prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    })
  } catch {
    return null
  }
}

async function getFormData() {
  try {
    const [categories, tags, leagues] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
      prisma.tag.findMany({ orderBy: { name: 'asc' } }),
      prisma.league.findMany({ orderBy: { name: 'asc' } }),
    ])
    return { categories, tags, leagues }
  } catch {
    return { categories: [], tags: [], leagues: [] }
  }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const [article, { categories, tags, leagues }] = await Promise.all([
    getArticle(id),
    getFormData(),
  ])

  if (!article) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Редактировать статью</h1>
      <ArticleForm
        article={article}
        categories={categories}
        tags={tags}
        leagues={leagues}
      />
    </div>
  )
}
