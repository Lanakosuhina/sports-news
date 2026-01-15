import { prisma } from '@/lib/prisma'
import NewsGridVaried from '@/components/news/NewsGridVaried'
import Sidebar from '@/components/layout/Sidebar'
import BookmakersTable from '@/components/bookmakers/BookmakersTable'
import SelectionsSidebar from '@/components/bookmakers/SelectionsSidebar'
import PopularSidebar from '@/components/news/PopularSidebar'
import AboutUsCarousel from '@/components/sections/AboutUsCarousel'
import MediaCitations from '@/components/sections/MediaCitations'
import { ArticleWithRelations } from '@/types'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

async function getLatestArticles(): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 8,
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


async function getBookmakers() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 7,
    })
  } catch {
    return []
  }
}

async function getSelections() {
  try {
    return await prisma.selection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [
    latestArticles,
    popularArticles,
    tags,
    bookmakers,
    selections,
  ] = await Promise.all([
    getLatestArticles(),
    getPopularArticles(),
    getTags(),
    getBookmakers(),
    getSelections(),
  ])

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">
            О спорте — честно!
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Bookmakers Table */}
            <div className="lg:col-span-2">
              <BookmakersTable bookmakers={bookmakers} />
            </div>

            {/* Right Sidebar - Selections + Popular */}
            <div className="space-y-6">
              {selections.length > 0 && (
                <SelectionsSidebar selections={selections} />
              )}
              {popularArticles.length > 0 && (
                <PopularSidebar articles={popularArticles} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Carousel */}
      <AboutUsCarousel />

      {/* Media Citations */}
      <MediaCitations />

      {/* Community Stats - temporarily commented out */}
      {/* <CommunityStats /> */}

      {/* Social Media - temporarily commented out */}
      {/* <SocialMedia /> */}

      {/* News Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest News */}
          <div className="lg:col-span-2">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Последние новости</h2>
                <Link
                  href="/news"
                  className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition"
                >
                  Все новости <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <NewsGridVaried articles={latestArticles} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              popularArticles={popularArticles}
              upcomingMatches={[]}
              tags={tags}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
