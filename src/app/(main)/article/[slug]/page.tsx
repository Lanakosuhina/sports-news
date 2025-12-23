import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/news/ArticleCard'
import Sidebar from '@/components/layout/Sidebar'
import { formatDate, getImageUrl } from '@/lib/utils'
import { ArticleWithRelations } from '@/types'
import { Calendar, User, Eye, Tag, Share2, Facebook, Twitter } from 'lucide-react'

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

    if (article && article.status === 'PUBLISHED') {
      // Increment view count
      await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
      })
    }

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
      orderBy: { views: 'desc' },
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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
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
    alternates: article.canonicalUrl
      ? { canonical: article.canonicalUrl }
      : undefined,
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

  const shareUrl = `${process.env.NEXTAUTH_URL || ''}/article/${slug}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-orange-500">
              Главная
            </Link>
            <span>/</span>
            <Link
              href={`/category/${article.category.slug}`}
              className="hover:text-orange-500"
            >
              {article.category.name}
            </Link>
            {article.league && (
              <>
                <span>/</span>
                <Link
                  href={`/category/${article.category.slug}?league=${article.league.slug}`}
                  className="hover:text-orange-500"
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
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} просмотров</span>
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
                    className="px-3 py-1 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-full text-sm transition"
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
          <div className="bg-slate-100 rounded-xl p-4 text-center mb-6">
            <div className="bg-slate-200 h-[90px] rounded-lg flex items-center justify-center text-slate-400">
              <span>Реклама 728x90</span>
            </div>
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

          {/* Ad Zone - Bottom */}
          <div className="bg-slate-100 rounded-xl p-4 text-center mb-8">
            <div className="bg-slate-200 h-[250px] rounded-lg flex items-center justify-center text-slate-400">
              <span>Реклама 300x250</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 py-6 border-t border-b">
            <span className="flex items-center gap-2 text-slate-600">
              <Share2 className="w-5 h-5" />
              Поделиться:
            </span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
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
  )
}
