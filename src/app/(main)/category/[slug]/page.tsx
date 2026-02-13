import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/news/ArticleCard'
import Sidebar from '@/components/layout/Sidebar'
import Pagination from '@/components/ui/Pagination'
import BookmakersTable from '@/components/bookmakers/BookmakersTable'
import BookmakersRatingTable from '@/components/bookmakers/BookmakersRatingTable'
import PromoCard from '@/components/bookmakers/PromoCard'
import BonusTable from '@/components/bookmakers/BonusTable'
import { ArticleWithRelations } from '@/types'
import {
  generateCategorySchema,
  generateBreadcrumbSchema,
  JsonLd,
  SITE_URL,
} from '@/lib/structured-data'

const PAGE_SIZE = 12

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; league?: string }>
}

async function getCategory(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        leagues: {
          orderBy: { name: 'asc' },
        },
      },
    })
  } catch {
    return null
  }
}

async function getArticles(
  categoryId: string,
  page: number,
  leagueSlug?: string
): Promise<{ articles: ArticleWithRelations[]; total: number }> {
  try {
    const where: Record<string, unknown> = {
      categoryId,
      status: 'PUBLISHED',
    }

    if (leagueSlug) {
      const league = await prisma.league.findUnique({
        where: { slug: leagueSlug },
      })
      if (league) {
        where.leagueId = league.id
      }
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          author: true,
          category: true,
          league: true,
          tags: true,
        },
      }),
      prisma.article.count({ where }),
    ])

    return { articles, total }
  } catch {
    return { articles: [], total: 0 }
  }
}

async function getPopularArticles(categoryId: string): Promise<ArticleWithRelations[]> {
  try {
    return await prisma.article.findMany({
      where: {
        categoryId,
        status: 'PUBLISHED',
      },
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

async function getBookmakersForRating() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true },
      orderBy: { ratingOrder: 'asc' },
    })
  } catch {
    return []
  }
}

async function getBookmakersForBonusPage() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true },
      orderBy: { orderOnBonusPage: 'asc' },
    })
  } catch {
    return []
  }
}

async function getBookmakersForAppsPage() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true },
      orderBy: { orderOnAppsPage: 'asc' },
    })
  } catch {
    return []
  }
}

async function getBookmakersForLegalPage() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true },
      orderBy: { orderOnLegalPage: 'asc' },
    })
  } catch {
    return []
  }
}

const promoCardSelect = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  bonus: true,
  link: true,
  promoImage: true,
  promoTitle: true,
  promoDescription: true,
  promoCode: true,
  promoExpiry: true,
  promoLabel: true,
  bonusConditions: true,
}

// BonusTable queries (for table at top)
async function getBookmakersForFribetTable() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showOnFribet: true },
      orderBy: { orderOnFribet: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

async function getBookmakersForBezDepozitaTable() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showOnBezDepozita: true },
      orderBy: { orderOnBezDepozita: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

async function getBookmakersForPromokodWinlineTable() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showOnPromokodWinline: true },
      orderBy: { orderOnPromokodWinline: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

async function getBookmakersForPromokodyFonbetTable() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showOnPromokodyFonbet: true },
      orderBy: { orderOnPromokodyFonbet: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

// PromoCard queries (for cards below table)
async function getPromoCardsForFribet() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showPromoCardOnFribet: true },
      orderBy: { orderOnFribet: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

async function getPromoCardsForBezDepozita() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showPromoCardOnBezDepozita: true },
      orderBy: { orderOnBezDepozita: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

async function getPromoCardsForPromokodWinline() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showPromoCardOnPromokodWinline: true },
      orderBy: { orderOnPromokodWinline: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

async function getPromoCardsForPromokodyFonbet() {
  try {
    return await prisma.bookmaker.findMany({
      where: { isActive: true, showPromoCardOnPromokodyFonbet: true },
      orderBy: { orderOnPromokodyFonbet: 'asc' },
      select: promoCardSelect,
    })
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: 'Категория не найдена' }
  }

  const categoryUrl = `${SITE_URL}/category/${slug}`

  return {
    title: `${category.name} — Новости`,
    description: category.description || `Последние новости ${category.name}, обновления и аналитика`,
    openGraph: {
      title: `${category.name} — Новости | Тренды спорта`,
      description: category.description || `Последние новости ${category.name}, обновления и аналитика`,
      url: categoryUrl,
      siteName: 'Тренды спорта',
      locale: 'ru_RU',
      type: 'website',
    },
    alternates: {
      canonical: categoryUrl,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params
  const { page: pageStr, league: leagueSlug } = await searchParams

  // Special page for bookmaker apps
  if (slug === 'prilozheniya-bukmekerov') {
    const bookmakers = await getBookmakersForAppsPage()
    const tags = await getTags()

    // Show all bookmakers with apps
    const appBookmakers = bookmakers

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Приложения букмекеров</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-600 leading-relaxed text-lg">
                  Мобильные приложения легальных букмекерских контор
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Скачивайте официальные приложения букмекеров для Android и iOS. Все приложения
                  прошли проверку и доступны для скачивания бесплатно. Делайте ставки на спорт
                  в любом месте и в любое время с удобных мобильных приложений.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Преимущества мобильных приложений
                </h2>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li>Быстрый доступ к ставкам в один клик</li>
                  <li>Push-уведомления о результатах матчей</li>
                  <li>Эксклюзивные бонусы для пользователей приложений</li>
                  <li>Оптимизированный интерфейс для мобильных устройств</li>
                </ul>
              </div>

              {/* Apps Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900">Лучшие приложения букмекеров</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {appBookmakers.map((bookmaker) => (
                    <div key={bookmaker.id} className="p-4 md:p-6">
                      <div className="flex items-center gap-4 mb-4">
                        {bookmaker.logo ? (
                          <div className="w-14 h-14 relative flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden">
                            <img
                              src={bookmaker.logo}
                              alt={bookmaker.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xl">
                              {bookmaker.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{bookmaker.name}</h3>
                          <p className="text-sm text-slate-500">Официальное приложение</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Android */}
                        {bookmaker.hasAndroidApp && (
                          <div className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-slate-900">{bookmaker.name} на Android</span>
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded">18+</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                              <span>✓ Лицензия</span>
                            </div>
                            {bookmaker.androidAppLink && bookmaker.androidAppLink.trim() ? (
                              <a
                                href={bookmaker.androidAppLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M17.523 15.341a.5.5 0 0 0-.5-.5h-.25v-1.5a3 3 0 0 0-3-3h-3.5a3 3 0 0 0-3 3v1.5h-.25a.5.5 0 0 0-.5.5v4.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-4.5zM7.773 8.341a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6.5 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-6.5 4a.5.5 0 0 1 .5-.5h.25a.5.5 0 0 1 .5.5v1.5h4.5v-1.5a.5.5 0 0 1 .5-.5h.25a.5.5 0 0 1 .5.5v1.5h1v-1.5a2 2 0 0 0-2-2h-3.5a2 2 0 0 0-2 2v1.5h1v-1.5z"/>
                                </svg>
                                Скачать для Android
                              </a>
                            ) : (
                              <Link
                                href={`/bookmaker/${bookmaker.slug}`}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                Подробнее
                              </Link>
                            )}
                          </div>
                        )}

                        {/* iOS */}
                        {bookmaker.hasIosApp && (
                          <div className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-slate-900">{bookmaker.name} на iOS</span>
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded">18+</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                              <span>✓ Лицензия</span>
                            </div>
                            {bookmaker.iosAppLink && bookmaker.iosAppLink.trim() ? (
                              <a
                                href={bookmaker.iosAppLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
                                </svg>
                                Скачать для iOS
                              </a>
                            ) : (
                              <Link
                                href={`/bookmaker/${bookmaker.slug}`}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                Подробнее
                              </Link>
                            )}
                          </div>
                        )}

                        {/* Show message if no apps */}
                        {!bookmaker.hasAndroidApp && !bookmaker.hasIosApp && (
                          <div className="col-span-2 text-center text-slate-500 py-4">
                            Приложение недоступно
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Special page for bookmakers with bonuses
  if (slug === 'bukmekeryi-s-bonusami') {
    const bookmakers = await getBookmakersForBonusPage()
    const tags = await getTags()

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Букмекеры с бонусами</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-600 leading-relaxed text-lg">
                  Букмекеры с приветственными бонусами
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Список букмекерских контор с бонусом за регистрацию — только для новых пользователей
                  и только для граждан России.
                </p>
              </div>

              <BookmakersTable
                bookmakers={bookmakers}
                title="Букмекеры с бонусами"
                buttonText="Перейти"
                linkToPage={true}
                showBonus={true}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Special page for legal bookmakers
  if (slug === 'vse-legalnyie-bukmekeryi') {
    const bookmakers = await getBookmakersForLegalPage()
    const tags = await getTags()

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Все легальные букмекеры</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-600 leading-relaxed">
                  Мы ответственно подходим ко всем рейтингам и информации, размещённой на нашем сайте,
                  поэтому вы не найдёте здесь ничего о нелегальных букмекерах. Потому что «если о спорте —
                  то честно», а уж о букмекерах — тем более!
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Мы рассматриваем ставки на спорт исключительно как развлечение и просим вас относиться
                  к этому так же. Если ставки перестали быть развлечением, пора сделать перерыв и посетить
                  раздел сайта{' '}
                  <Link href="/page/responsible-gaming" className="text-blue-500 hover:text-blue-600 font-medium">
                    «Ответственная игра»
                  </Link>.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Кто такие легальные букмекеры?
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Легальные букмекеры — это те, кто работает в России официально и законно, что гарантирует
                  прозрачность всех финансовых операций, защиту прав игроков и отсутствие юридических проблем.
                </p>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Легальные букмекеры в России
              </h2>

              <BookmakersTable bookmakers={bookmakers} title="" showBonus={true} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Bonus page template - No deposit bonuses
  if (slug === 'bez-depozita') {
    const [tags, tableBookmakers, promoCardBookmakers] = await Promise.all([
      getTags(),
      getBookmakersForBezDepozitaTable(),
      getPromoCardsForBezDepozita(),
    ])
    const now = new Date()
    const updateDate = now.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900 transition">ГЛАВНАЯ</Link>
            <span>/</span>
            <span className="text-slate-900">БЕЗ ДЕПОЗИТА</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-6">
                <p className="text-slate-500 text-sm mb-4">Обновлено: {updateDate}</p>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">Бонусы без депозита БК</h1>

                <p className="text-slate-600 leading-relaxed">
                  Бездепозитные бонусы — редкая акция, позволяющая игрокам делать ставки без внесения средств на счёт.
                  Чаще всего такие предложения направлены на новых пользователей.
                </p>
              </div>

              {/* Bonus Table */}
              {tableBookmakers.length > 0 && (
                <div className="mb-8">
                  <BonusTable
                    bookmakers={tableBookmakers}
                    title="Бонусы без депозита БК"
                  />
                </div>
              )}

              {/* Promo Cards Grid */}
              {promoCardBookmakers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                  {promoCardBookmakers.map((bookmaker) => (
                    <PromoCard key={bookmaker.id} bookmaker={bookmaker} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center text-slate-400 mb-6">
                  <p>Промо-предложения будут добавлены позже</p>
                  <p className="text-sm mt-2">Включите &quot;Без депозита&quot; в настройках букмекера</p>
                </div>
              )}

              {/* Footer note */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  *Дополнительные средства выдаются в рамках выполнения цепочки заданий.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Bonus page template - Freebet
  if (slug === 'fribet') {
    const [tags, tableBookmakers, promoCardBookmakers] = await Promise.all([
      getTags(),
      getBookmakersForFribetTable(),
      getPromoCardsForFribet(),
    ])
    const now = new Date()
    const updateDate = now.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900 transition">ГЛАВНАЯ</Link>
            <span>/</span>
            <span className="text-slate-900">ФРИБЕТ</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-6">
                <p className="text-slate-500 text-sm mb-4">Обновлено: {updateDate}</p>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">Фрибеты от букмекеров</h1>

                <p className="text-slate-600 leading-relaxed">
                  Фрибет — это бесплатная ставка, которую букмекер дарит игроку в качестве бонуса.
                  Фрибеты позволяют делать ставки без риска потери собственных средств.
                </p>
              </div>

              {/* Bonus Table */}
              {tableBookmakers.length > 0 && (
                <div className="mb-8">
                  <BonusTable
                    bookmakers={tableBookmakers}
                    title="Фрибеты от букмекеров"
                  />
                </div>
              )}

              {/* Promo Cards Grid */}
              {promoCardBookmakers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                  {promoCardBookmakers.map((bookmaker) => (
                    <PromoCard key={bookmaker.id} bookmaker={bookmaker} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center text-slate-400 mb-6">
                  <p>Промо-предложения будут добавлены позже</p>
                  <p className="text-sm mt-2">Включите &quot;Показывать на странице фрибетов&quot; в настройках букмекера</p>
                </div>
              )}

              {/* Footer note */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  *Условия получения фрибета могут отличаться у разных букмекеров.
                  Перед активацией бонуса ознакомьтесь с правилами на сайте букмекера.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Promokod Winline page
  if (slug === 'promokod-winline') {
    const [tags, tableBookmakers, promoCardBookmakers] = await Promise.all([
      getTags(),
      getBookmakersForPromokodWinlineTable(),
      getPromoCardsForPromokodWinline(),
    ])
    const now = new Date()
    const updateDate = now.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900 transition">ГЛАВНАЯ</Link>
            <span>/</span>
            <span className="text-slate-900">ПРОМОКОД WINLINE</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-6">
                <p className="text-slate-500 text-sm mb-4">Обновлено: {updateDate}</p>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">Промокоды Winline</h1>

                <p className="text-slate-600 leading-relaxed">
                  Актуальные промокоды Winline для получения бонусов при регистрации и пополнении счёта.
                  Используйте промокод для увеличения приветственного бонуса.
                </p>
              </div>

              {/* Bonus Table */}
              {tableBookmakers.length > 0 && (
                <div className="mb-8">
                  <BonusTable
                    bookmakers={tableBookmakers}
                    title="Промокоды Winline"
                  />
                </div>
              )}

              {/* Promo Cards Grid */}
              {promoCardBookmakers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                  {promoCardBookmakers.map((bookmaker) => (
                    <PromoCard key={bookmaker.id} bookmaker={bookmaker} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center text-slate-400 mb-6">
                  <p>Промо-предложения будут добавлены позже</p>
                  <p className="text-sm mt-2">Включите &quot;Промокод Winline&quot; в настройках букмекера</p>
                </div>
              )}

              {/* Footer note */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  *Промокоды имеют ограниченный срок действия. Актуальность уточняйте на сайте букмекера.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Promokody Fonbet page
  if (slug === 'promokodyi-fonbet') {
    const [tags, tableBookmakers, promoCardBookmakers] = await Promise.all([
      getTags(),
      getBookmakersForPromokodyFonbetTable(),
      getPromoCardsForPromokodyFonbet(),
    ])
    const now = new Date()
    const updateDate = now.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900 transition">ГЛАВНАЯ</Link>
            <span>/</span>
            <span className="text-slate-900">ПРОМОКОДЫ FONBET</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-6">
                <p className="text-slate-500 text-sm mb-4">Обновлено: {updateDate}</p>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">Промокоды Fonbet</h1>

                <p className="text-slate-600 leading-relaxed">
                  Актуальные промокоды Fonbet для получения бонусов при регистрации и пополнении счёта.
                  Используйте промокод для увеличения приветственного бонуса.
                </p>
              </div>

              {/* Bonus Table */}
              {tableBookmakers.length > 0 && (
                <div className="mb-8">
                  <BonusTable
                    bookmakers={tableBookmakers}
                    title="Промокоды Fonbet"
                  />
                </div>
              )}

              {/* Promo Cards Grid */}
              {promoCardBookmakers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                  {promoCardBookmakers.map((bookmaker) => (
                    <PromoCard key={bookmaker.id} bookmaker={bookmaker} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center text-slate-400 mb-6">
                  <p>Промо-предложения будут добавлены позже</p>
                  <p className="text-sm mt-2">Включите &quot;Промокоды Fonbet&quot; в настройках букмекера</p>
                </div>
              )}

              {/* Footer note */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  *Промокоды имеют ограниченный срок действия. Актуальность уточняйте на сайте букмекера.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Special page for honest rating
  if (slug === 'chestnyiy-reyting') {
    const bookmakers = await getBookmakersForRating()
    const tags = await getTags()

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Честный рейтинг</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-600 leading-relaxed text-lg">
                  Рейтинг основан на общедоступной информации, которую мы собрали, тщательно
                  проанализировали и готовы поделиться с вами.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Мы учитываем множество факторов: количество активных игроков, качество
                  обслуживания, скорость выплат, разнообразие линий и коэффициентов,
                  а также отзывы реальных пользователей.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Как формируется рейтинг?
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Наш честный рейтинг букмекеров составлен на основе объективных данных
                  и реального опыта игроков. Мы не принимаем оплату за позиции в рейтинге
                  и регулярно обновляем информацию.
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li>Анализ количества активных игроков</li>
                  <li>Оценка качества бонусных программ</li>
                  <li>Проверка скорости выплат выигрышей</li>
                  <li>Учёт отзывов реальных пользователей</li>
                </ul>
              </div>

              <BookmakersRatingTable bookmakers={bookmakers} title="" />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar popularArticles={[]} tags={tags} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const page = Math.max(1, parseInt(pageStr || '1'))
  const { articles, total } = await getArticles(category.id, page, leagueSlug)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const [popularArticles, tags] = await Promise.all([
    getPopularArticles(category.id),
    getTags(),
  ])

  const baseUrl = leagueSlug
    ? `/category/${slug}?league=${leagueSlug}`
    : `/category/${slug}`

  // Generate structured data
  const categorySchema = generateCategorySchema({
    name: category.name,
    slug: category.slug,
    description: category.description,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: '/' },
    { name: category.name, url: `/category/${category.slug}` },
  ])

  return (
    <>
      <JsonLd data={[categorySchema, breadcrumbSchema]} />
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-slate-600">{category.description}</p>
        )}

        {/* League filters */}
        {category.leagues.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              href={`/category/${slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                !leagueSlug
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Все
            </Link>
            {category.leagues.map((league) => (
              <Link
                key={league.id}
                href={`/category/${slug}?league=${league.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  leagueSlug === league.slug
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {league.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles */}
        <div className="lg:col-span-2">
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={baseUrl}
              />
            </>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-slate-500">В этой категории пока нет статей.</p>
            </div>
          )}
        </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar popularArticles={popularArticles} tags={tags} />
          </div>
        </div>
      </div>
    </>
  )
}
