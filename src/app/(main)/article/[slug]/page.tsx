import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'
import AdZone from '@/components/ui/AdZone'
import { formatDate, getImageUrl } from '@/lib/utils'
import { ArticleWithRelations } from '@/types'
import { Calendar, User, Tag } from 'lucide-react'
import TimeAgo from '@/components/ui/TimeAgo'
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  JsonLd,
  SITE_URL,
} from '@/lib/structured-data'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<ArticleWithRelations | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        league: true,
        tags: true,
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
            league: true,
          },
        },
      },
    })

    return article
  } catch {
    return null
  }
}

async function getRelatedArticles(
  categoryId: string,
  articleId: string
): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: {
        categoryId,
        status: 'PUBLISHED',
        id: { not: articleId },
      },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: {
        author: true,
        category: true,
        league: true,
        tags: true,
      },
    })
  } catch {
    return []
  }
}

async function getPopularArticles(): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      include: {
        author: true,
        category: true,
        league: true,
        tags: true,
      },
    })
  } catch {
    return []
  }
}

async function getTags() {
  try {
    return await prisma.tag.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: 15,
    })
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Статья не найдена' }
  }

  const title = article.metaTitle || article.title
  const description = article.metaDescription || article.excerpt
  const imageUrl = getImageUrl(article.featuredImage)

  const articleUrl = `${SITE_URL}/article/${slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: articleUrl,
      siteName: 'Тренды спорта',
      locale: 'ru_RU',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: article.author ? [article.author.name] : undefined,
      images: article.featuredImage
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.featuredImage ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: article.canonicalUrl || articleUrl,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article || article.status !== 'PUBLISHED') {
    notFound()
  }

  const [relatedArticles, popularArticles, tags] = await Promise.all([
    getRelatedArticles(article.categoryId, article.id),
    getPopularArticles(),
    getTags(),
  ])

  // Generate structured data
  const breadcrumbItems = [
    { name: 'Главная', url: '/' },
    { name: article.category.name, url: `/category/${article.category.slug}` },
  ]
  if (article.league) {
    breadcrumbItems.push({
      name: article.league.name,
      url: `/category/${article.category.slug}?league=${article.league.slug}`,
    })
  }
  breadcrumbItems.push({ name: article.title, url: `/article/${article.slug}` })

  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt || article.metaDescription || '',
    slug: article.slug,
    featuredImage: article.featuredImage,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: article.author,
    category: article.category,
  })

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems)

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-blue-500">
              Главная
            </Link>
            <span>/</span>
            <Link
              href={`/category/${article.category.slug}`}
              className="hover:text-blue-500"
            >
              {article.category.name}
            </Link>
            {article.league && (
              <>
                <span>/</span>
                <Link
                  href={`/category/${article.category.slug}?league=${article.league.slug}`}
                  className="hover:text-blue-500"
                >
                  {article.league.name}
                </Link>
              </>
            )}
          </nav>

          {/* Article Header */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 bg-slate-100 hover:bg-blue-500 hover:text-white rounded-full text-sm transition"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
              <Image
                src={getImageUrl(article.featuredImage)}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Match Result Box */}
          {article.match && (
            <div className="bg-slate-900 text-white rounded-xl p-6 mb-6">
              <div className="text-center text-sm text-slate-400 mb-4">
                {article.match.league.name}
              </div>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  {article.match.homeTeam.logo && (
                    <Image
                      src={getImageUrl(article.match.homeTeam.logo)}
                      alt={article.match.homeTeam.name}
                      width={64}
                      height={64}
                      className="mx-auto mb-2"
                    />
                  )}
                  <span className="font-semibold">
                    {article.match.homeTeam.name}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {article.match.homeScore ?? '-'} : {article.match.awayScore ?? '-'}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {article.match.status}
                  </div>
                </div>
                <div className="text-center">
                  {article.match.awayTeam.logo && (
                    <Image
                      src={getImageUrl(article.match.awayTeam.logo)}
                      alt={article.match.awayTeam.name}
                      width={64}
                      height={64}
                      className="mx-auto mb-2"
                    />
                  )}
                  <span className="font-semibold">
                    {article.match.awayTeam.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ad Zone - Top */}
          <div className="mb-6">
            <AdZone size="leaderboard" placement="article-top" />
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Gallery */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Галерея</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {article.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`Изображение галереи ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Embed */}
          {article.videoUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Видео</h3>
              <div className="video-embed">
                <iframe
                  src={article.videoUrl}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}       

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Articles with images - medium cards */}
                {relatedArticles.filter(a => a.featuredImage).map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/article/${relatedArticle.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={getImageUrl(relatedArticle.featuredImage)}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {relatedArticle.category.name}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-500 transition line-clamp-2 mb-2">
                        {relatedArticle.title}
                      </h3>
                      <div className="text-xs text-slate-500">
                        <TimeAgo date={relatedArticle.publishedAt || relatedArticle.createdAt} />
                      </div>
                    </div>
                  </Link>
                ))}
                {/* Articles without images - small text-only cards */}
                {relatedArticles.filter(a => !a.featuredImage).map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/article/${relatedArticle.slug}`}
                    className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-blue-500 text-xs font-medium mb-1">
                        {relatedArticle.category.name}
                      </span>
                      <h4 className="font-semibold text-slate-900 group-hover:text-blue-500 transition line-clamp-2 text-sm mb-2">
                        {relatedArticle.title}
                      </h4>
                      <div className="text-xs text-slate-500">
                        <TimeAgo date={relatedArticle.publishedAt || relatedArticle.createdAt} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar popularArticles={popularArticles} tags={tags} />
          </div>
        </div>
      </div>
    </>
  )
}
