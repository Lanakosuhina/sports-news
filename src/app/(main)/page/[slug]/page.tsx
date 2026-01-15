import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface StaticPageProps {
  params: Promise<{ slug: string }>
}

async function getPage(slug: string) {
  try {
    return await prisma.page.findUnique({
      where: { slug },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: StaticPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    return { title: 'Страница не найдена' }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || `${page.title} - Тренды спорта`,
  }
}

export default async function StaticPage({ params }: StaticPageProps) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page || !page.isPublished) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-500">
            Главная
          </Link>
          <span>/</span>
          <span className="text-slate-900">{page.title}</span>
        </nav>

        {/* Page Content */}
        <article className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </div>
    </div>
  )
}
