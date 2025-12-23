import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/admin/ArticleForm'

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

export default async function NewArticlePage() {
  const { categories, tags, leagues } = await getFormData()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Новая статья</h1>
      <ArticleForm categories={categories} tags={tags} leagues={leagues} />
    </div>
  )
}
