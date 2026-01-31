import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/news/ArticleCard'
import Sidebar from '@/components/layout/Sidebar'
import Pagination from '@/components/ui/Pagination'
import BookmakersTable from '@/components/bookmakers/BookmakersTable'
import BookmakersRatingTable from '@/components/bookmakers/BookmakersRatingTable'
import { ArticleWithRelations } from '@/types'

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

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: 'Категория не найдена' }
  }

  return {
    title: `${category.name} — Новости`,
    description: category.description || `Последние новости ${category.name}, обновления и аналитика`,
    openGraph: {
      title: `${category.name} — Новости | Тренды спорта`,
      description: category.description || `Последние новости ${category.name}, обновления и аналитика`,
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
    const bookmakers = await getBookmakers()
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
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-slate-900">{bookmaker.name} на Android</span>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">18+</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <span>✓ Лицензия</span>
                            <span>№1 Рейтинг</span>
                          </div>
                          <Link
                            href={`/bookmaker/${bookmaker.slug}`}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                          >
                            Скачать приложение
                          </Link>
                        </div>

                        {/* iOS */}
                        <div className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-slate-900">{bookmaker.name} на iOS</span>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">18+</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <span>✓ Лицензия</span>
                            <span>№1 Рейтинг</span>
                          </div>
                          <Link
                            href={`/bookmaker/${bookmaker.slug}`}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                          >
                          Скачать приложение
                          </Link>
                        </div>
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
    const bookmakers = await getBookmakers()
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
    const bookmakers = await getBookmakers()
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

              <BookmakersTable bookmakers={bookmakers} title="" />
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
    const tags = await getTags()
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
            <Link href="/category/bonusyi" className="hover:text-slate-900 transition">БОНУСЫ</Link>
            <span>/</span>
            <span className="text-slate-900">БЕЗ ДЕПОЗИТА</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <p className="text-slate-500 text-sm mb-4">Обновлено: {updateDate}</p>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">Бонусы без депозита БК</h1>

                <p className="text-slate-600 leading-relaxed mb-8">
                  Бездепозитные бонусы — редкая акция, позволяющая игрокам делать ставки без внесения средств на счёт.
                  Чаще всего такие предложения направлены на новых пользователей.
                </p>

                {/* Bonus Table Header */}
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <div className="grid grid-cols-12 gap-4 text-sm text-slate-500">
                    <div className="col-span-4">Букмекер</div>
                    <div className="col-span-2">Сумма</div>
                    <div className="col-span-4">Номинал и условия</div>
                    <div className="col-span-2"></div>
                  </div>
                </div>

                {/* Empty state / Placeholder */}
                <div className="py-12 text-center text-slate-400">
                  <p>Список бонусов без депозита будет добавлен позже</p>
                </div>

                {/* Footer note */}
                <p className="text-sm text-slate-500 mt-8 pt-4 border-t border-slate-200">
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
    const tags = await getTags()
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
            <Link href="/category/bonusyi" className="hover:text-slate-900 transition">БОНУСЫ</Link>
            <span>/</span>
            <span className="text-slate-900">ФРИБЕТ</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <p className="text-slate-500 text-sm mb-4">Обновлено: {updateDate}</p>

                <h1 className="text-3xl md:text-4xl font-bold mb-6">Фрибеты от букмекеров</h1>

                <p className="text-slate-600 leading-relaxed mb-8">
                  Фрибет — это бесплатная ставка, которую букмекер дарит игроку в качестве бонуса.
                  Фрибеты позволяют делать ставки без риска потери собственных средств.
                </p>

                {/* Bonus Table Header */}
                <div className="border-b border-slate-200 pb-3 mb-4">
                  <div className="grid grid-cols-12 gap-4 text-sm text-slate-500">
                    <div className="col-span-4">Букмекер</div>
                    <div className="col-span-2">Сумма</div>
                    <div className="col-span-4">Номинал и условия</div>
                    <div className="col-span-2"></div>
                  </div>
                </div>

                {/* Empty state / Placeholder */}
                <div className="py-12 text-center text-slate-400">
                  <p>Список фрибетов будет добавлен позже</p>
                </div>

                {/* Footer note */}
                <p className="text-sm text-slate-500 mt-8 pt-4 border-t border-slate-200">
                  *Условия получения фрибета могут отличаться у разных букмекеров.
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

  return (
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
  )
}
