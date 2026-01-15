import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'
import { Star, ExternalLink, ChevronRight, Check, Smartphone } from 'lucide-react'

// Extended bookmaker type with new fields
interface BookmakerData {
  id: string
  name: string
  slug: string
  logo: string | null
  bonus: string | null
  bonusLabel: string | null
  reviewsCount: number
  playersCount: number
  rating: number
  link: string
  website: string | null
  hasLicense: boolean
  licenseNumber: string | null
  minDeposit: string | null
  hasIosApp: boolean
  hasAndroidApp: boolean
  iosAppLink: string | null
  androidAppLink: string | null
  isActive: boolean
  order: number
  ratingOrder: number
  createdAt: Date
  updatedAt: Date
}

interface BookmakerPageProps {
  params: Promise<{ slug: string }>
}

async function getBookmaker(slug: string): Promise<BookmakerData | null> {
  try {
    const result = await prisma.bookmaker.findUnique({
      where: { slug },
    })
    return result as BookmakerData | null
  } catch {
    return null
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
}: BookmakerPageProps): Promise<Metadata> {
  const { slug } = await params
  const bookmaker = await getBookmaker(slug)

  if (!bookmaker) {
    return { title: 'Букмекер не найден' }
  }

  return {
    title: `${bookmaker.name} — Обзор букмекера`,
    description: `Полный обзор букмекерской конторы ${bookmaker.name}. Бонусы, рейтинг, отзывы игроков и актуальная информация.`,
    openGraph: {
      title: `${bookmaker.name} — Обзор букмекера | Тренды спорта`,
      description: `Полный обзор букмекерской конторы ${bookmaker.name}. Бонусы, рейтинг, отзывы игроков.`,
    },
  }
}

export default async function BookmakerPage({ params }: BookmakerPageProps) {
  const { slug } = await params
  const [bookmaker, tags] = await Promise.all([
    getBookmaker(slug),
    getTags(),
  ])

  if (!bookmaker) {
    notFound()
  }

  const features = [
    'Лицензия ФНС России',
    'Быстрые выплаты',
    'Мобильное приложение',
    'Live-ставки',
    'Широкая линия',
    'Круглосуточная поддержка',
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-700">Главная</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/category/chestnyiy-reyting" className="hover:text-slate-700">Честный рейтинг</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">{bookmaker.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Logo */}
                <div className="w-20 h-20 md:w-24 md:h-24 relative bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  {bookmaker.logo ? (
                    <Image
                      src={bookmaker.logo}
                      alt={bookmaker.name}
                      fill
                      className="object-contain p-3"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-400">
                        {bookmaker.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    {bookmaker.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">{bookmaker.rating.toFixed(1)}</span>
                    <span className="text-slate-500">рейтинг</span>
                  </div>
                </div>
              </div>

              {/* Info Row - Site, License, Min Deposit, Apps */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {/* Website */}
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Сайт</div>
                    {bookmaker.website ? (
                      <a
                        href={`https://${bookmaker.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-900 underline hover:text-blue-600"
                      >
                        {bookmaker.website}
                      </a>
                    ) : (
                      <span className="font-semibold text-slate-900">—</span>
                    )}
                  </div>

                  {/* License */}
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Лицензия</div>
                    <span className="font-semibold text-slate-900">
                      {bookmaker.hasLicense ? 'Есть' : 'Нет'}
                    </span>
                  </div>

                  {/* Min Deposit */}
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Мин. депозит</div>
                    <span className="font-semibold text-slate-900">
                      {bookmaker.minDeposit || '—'}
                    </span>
                  </div>

                  {/* Apps */}
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Приложение</div>
                    <div className="flex items-center gap-2">
                      {bookmaker.hasIosApp && (
                        <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                      )}
                      {bookmaker.hasAndroidApp && (
                        <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.523 15.341c-.5 0-.91-.41-.91-.91s.41-.91.91-.91.91.41.91.91-.41.91-.91.91m-11.046 0c-.5 0-.91-.41-.91-.91s.41-.91.91-.91.91.41.91.91-.41.91-.91.91m11.4-6.02l1.97-3.41c.11-.19.05-.43-.14-.54-.19-.11-.43-.05-.54.14l-2 3.46C15.53 8.09 13.82 7.5 12 7.5s-3.53.59-5.16 1.46l-2-3.46c-.11-.19-.35-.25-.54-.14-.19.11-.25.35-.14.54l1.97 3.41C2.82 11.18 0 14.97 0 19.5h24c0-4.53-2.82-8.32-6.12-10.18"/>
                        </svg>
                      )}
                      {!bookmaker.hasIosApp && !bookmaker.hasAndroidApp && (
                        <span className="text-slate-500">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App Block */}
            {(bookmaker.hasIosApp || bookmaker.hasAndroidApp) && (
              <div className="bg-slate-900 rounded-xl p-6 md:p-8 mb-6 overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      Мобильные приложения {bookmaker.name}
                    </h2>
                    <div className="text-blue-400 font-medium mb-3">
                      Больше эмоций в приложении
                    </div>
                    <p className="text-slate-400 mb-6">
                      Скачай мобильное приложение {bookmaker.name}, чтобы воспользоваться
                      всеми преимуществами букмекера.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {bookmaker.hasIosApp && (
                        <a
                          href={bookmaker.iosAppLink || bookmaker.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg transition"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                          <span className="text-sm font-medium">Скачать для iOS</span>
                        </a>
                      )}
                      {bookmaker.hasAndroidApp && (
                        <a
                          href={bookmaker.androidAppLink || bookmaker.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg transition"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.523 15.341c-.5 0-.91-.41-.91-.91s.41-.91.91-.91.91.41.91.91-.41.91-.91.91m-11.046 0c-.5 0-.91-.41-.91-.91s.41-.91.91-.91.91.41.91.91-.41.91-.91.91m11.4-6.02l1.97-3.41c.11-.19.05-.43-.14-.54-.19-.11-.43-.05-.54.14l-2 3.46C15.53 8.09 13.82 7.5 12 7.5s-3.53.59-5.16 1.46l-2-3.46c-.11-.19-.35-.25-.54-.14-.19.11-.25.35-.14.54l1.97 3.41C2.82 11.18 0 14.97 0 19.5h24c0-4.53-2.82-8.32-6.12-10.18"/>
                          </svg>
                          <span className="text-sm font-medium">Скачать для Android</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block flex-shrink-0">
                    <div className="w-32 h-48 bg-slate-800 rounded-2xl flex items-center justify-center">
                      <Smartphone className="w-16 h-16 text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About */}
            <div className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">О букмекере</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {bookmaker.name} — это надёжная букмекерская контора, работающая на российском
                рынке на основании лицензии ФНС. Компания предоставляет широкий выбор спортивных
                событий для ставок, включая футбол, хоккей, теннис, баскетбол и многие другие
                виды спорта.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Букмекер предлагает конкурентные коэффициенты, быстрые выплаты выигрышей и
                качественную службу поддержки клиентов. Для новых игроков действует приветственный
                бонус.
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Преимущества</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 rounded-xl p-6 md:p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-2">
                Готовы начать?
              </h2>
              <p className="text-slate-400 mb-6">
                Зарегистрируйтесь и получите приветственный бонус
              </p>
              <Link
                href={bookmaker.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Перейти на сайт
                <ExternalLink className="w-4 h-4" />
              </Link>
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
