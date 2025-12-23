import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sportsnews.com' },
    update: {},
    create: {
      email: 'admin@sportsnews.com',
      password: hashedPassword,
      name: 'Администратор',
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create categories (Russian)
  const categories = [
    { name: 'Футбол', slug: 'football', order: 1 },
    { name: 'Баскетбол', slug: 'basketball', order: 2 },
    { name: 'Хоккей', slug: 'hockey', order: 3 },
    { name: 'Теннис', slug: 'tennis', order: 4 },
    { name: 'Киберспорт', slug: 'esports', order: 5 },
    { name: 'Другие виды', slug: 'other-sports', order: 6 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    })
  }

  console.log('Created categories')

  // Create some leagues
  const football = await prisma.category.findUnique({ where: { slug: 'football' } })

  let premierLeague, laLiga, championsLeague

  if (football) {
    const leagues = [
      { name: 'Премьер-лига', slug: 'premier-league', country: 'Англия', categoryId: football.id },
      { name: 'Ла Лига', slug: 'la-liga', country: 'Испания', categoryId: football.id },
      { name: 'Лига чемпионов', slug: 'champions-league', country: 'Европа', categoryId: football.id },
      { name: 'Чемпионат мира', slug: 'world-cup', country: 'Международный', categoryId: football.id },
      { name: 'РПЛ', slug: 'rpl', country: 'Россия', categoryId: football.id },
    ]

    for (const league of leagues) {
      await prisma.league.upsert({
        where: { slug: league.slug },
        update: { name: league.name, country: league.country },
        create: league,
      })
    }

    premierLeague = await prisma.league.findUnique({ where: { slug: 'premier-league' } })
    laLiga = await prisma.league.findUnique({ where: { slug: 'la-liga' } })
    championsLeague = await prisma.league.findUnique({ where: { slug: 'champions-league' } })

    console.log('Created leagues')
  }

  // Create teams
  const teamsData = [
    { name: 'Манчестер Сити', slug: 'manchester-city', shortName: 'Ман Сити', country: 'Англия' },
    { name: 'Арсенал', slug: 'arsenal', shortName: 'Арсенал', country: 'Англия' },
    { name: 'Ливерпуль', slug: 'liverpool', shortName: 'Ливерпуль', country: 'Англия' },
    { name: 'Астон Вилла', slug: 'aston-villa', shortName: 'Астон Вилла', country: 'Англия' },
    { name: 'Тоттенхэм', slug: 'tottenham', shortName: 'Тоттенхэм', country: 'Англия' },
    { name: 'Ньюкасл', slug: 'newcastle', shortName: 'Ньюкасл', country: 'Англия' },
    { name: 'Манчестер Юнайтед', slug: 'manchester-united', shortName: 'Ман Юнайтед', country: 'Англия' },
    { name: 'Вест Хэм', slug: 'west-ham', shortName: 'Вест Хэм', country: 'Англия' },
    { name: 'Челси', slug: 'chelsea', shortName: 'Челси', country: 'Англия' },
    { name: 'Брайтон', slug: 'brighton', shortName: 'Брайтон', country: 'Англия' },
    { name: 'Реал Мадрид', slug: 'real-madrid', shortName: 'Реал', country: 'Испания' },
    { name: 'Барселона', slug: 'barcelona', shortName: 'Барса', country: 'Испания' },
    { name: 'Атлетико Мадрид', slug: 'atletico-madrid', shortName: 'Атлетико', country: 'Испания' },
    { name: 'Жирона', slug: 'girona', shortName: 'Жирона', country: 'Испания' },
    { name: 'Бавария', slug: 'bayern-munich', shortName: 'Бавария', country: 'Германия' },
    { name: 'ПСЖ', slug: 'psg', shortName: 'ПСЖ', country: 'Франция' },
  ]

  const teams: Record<string, { id: string }> = {}

  for (const team of teamsData) {
    const created = await prisma.team.upsert({
      where: { slug: team.slug },
      update: { name: team.name, shortName: team.shortName },
      create: team,
    })
    teams[team.slug] = created
  }

  console.log('Created teams')

  // Create standings for Premier League
  if (premierLeague) {
    const currentYear = new Date().getFullYear()
    const season = `${currentYear}-${currentYear + 1}`

    const standingsData = [
      { teamSlug: 'liverpool', position: 1, played: 15, won: 11, drawn: 4, lost: 0, goalsFor: 33, goalsAgainst: 12, points: 37 },
      { teamSlug: 'chelsea', position: 2, played: 15, won: 9, drawn: 4, lost: 2, goalsFor: 32, goalsAgainst: 17, points: 31 },
      { teamSlug: 'arsenal', position: 3, played: 15, won: 8, drawn: 5, lost: 2, goalsFor: 30, goalsAgainst: 15, points: 29 },
      { teamSlug: 'manchester-city', position: 4, played: 15, won: 8, drawn: 4, lost: 3, goalsFor: 28, goalsAgainst: 20, points: 28 },
      { teamSlug: 'tottenham', position: 5, played: 15, won: 8, drawn: 3, lost: 4, goalsFor: 35, goalsAgainst: 20, points: 27 },
      { teamSlug: 'aston-villa', position: 6, played: 15, won: 7, drawn: 4, lost: 4, goalsFor: 24, goalsAgainst: 22, points: 25 },
      { teamSlug: 'brighton', position: 7, played: 15, won: 6, drawn: 6, lost: 3, goalsFor: 25, goalsAgainst: 21, points: 24 },
      { teamSlug: 'newcastle', position: 8, played: 15, won: 6, drawn: 5, lost: 4, goalsFor: 20, goalsAgainst: 16, points: 23 },
      { teamSlug: 'manchester-united', position: 9, played: 15, won: 5, drawn: 4, lost: 6, goalsFor: 18, goalsAgainst: 18, points: 19 },
      { teamSlug: 'west-ham', position: 10, played: 15, won: 5, drawn: 3, lost: 7, goalsFor: 20, goalsAgainst: 27, points: 18 },
    ]

    for (const standing of standingsData) {
      const team = teams[standing.teamSlug]
      if (team) {
        await prisma.standing.upsert({
          where: {
            teamId_leagueId_season: {
              teamId: team.id,
              leagueId: premierLeague.id,
              season: season,
            },
          },
          update: {
            position: standing.position,
            played: standing.played,
            won: standing.won,
            drawn: standing.drawn,
            lost: standing.lost,
            goalsFor: standing.goalsFor,
            goalsAgainst: standing.goalsAgainst,
            points: standing.points,
          },
          create: {
            teamId: team.id,
            leagueId: premierLeague.id,
            season: season,
            position: standing.position,
            played: standing.played,
            won: standing.won,
            drawn: standing.drawn,
            lost: standing.lost,
            goalsFor: standing.goalsFor,
            goalsAgainst: standing.goalsAgainst,
            points: standing.points,
          },
        })
      }
    }

    console.log('Created standings')
  }

  // Create matches
  if (premierLeague) {
    const matchesData = [
      // Recent finished matches
      { homeSlug: 'liverpool', awaySlug: 'manchester-city', homeScore: 2, awayScore: 0, status: 'FINISHED' as const, daysAgo: 2 },
      { homeSlug: 'arsenal', awaySlug: 'chelsea', homeScore: 1, awayScore: 1, status: 'FINISHED' as const, daysAgo: 3 },
      { homeSlug: 'manchester-united', awaySlug: 'tottenham', homeScore: 2, awayScore: 3, status: 'FINISHED' as const, daysAgo: 4 },
      { homeSlug: 'aston-villa', awaySlug: 'brighton', homeScore: 1, awayScore: 0, status: 'FINISHED' as const, daysAgo: 5 },
      { homeSlug: 'newcastle', awaySlug: 'west-ham', homeScore: 3, awayScore: 1, status: 'FINISHED' as const, daysAgo: 6 },
      { homeSlug: 'chelsea', awaySlug: 'liverpool', homeScore: 0, awayScore: 2, status: 'FINISHED' as const, daysAgo: 7 },
      // Upcoming matches
      { homeSlug: 'manchester-city', awaySlug: 'arsenal', homeScore: null, awayScore: null, status: 'SCHEDULED' as const, daysAhead: 2 },
      { homeSlug: 'tottenham', awaySlug: 'liverpool', homeScore: null, awayScore: null, status: 'SCHEDULED' as const, daysAhead: 3 },
      { homeSlug: 'chelsea', awaySlug: 'manchester-united', homeScore: null, awayScore: null, status: 'SCHEDULED' as const, daysAhead: 5 },
      { homeSlug: 'brighton', awaySlug: 'newcastle', homeScore: null, awayScore: null, status: 'SCHEDULED' as const, daysAhead: 6 },
      { homeSlug: 'west-ham', awaySlug: 'aston-villa', homeScore: null, awayScore: null, status: 'SCHEDULED' as const, daysAhead: 7 },
    ]

    for (const match of matchesData) {
      const homeTeam = teams[match.homeSlug]
      const awayTeam = teams[match.awaySlug]

      if (homeTeam && awayTeam) {
        const matchDate = new Date()
        if ('daysAgo' in match && match.daysAgo) {
          matchDate.setDate(matchDate.getDate() - match.daysAgo)
        } else if ('daysAhead' in match && match.daysAhead) {
          matchDate.setDate(matchDate.getDate() + match.daysAhead)
        }
        matchDate.setHours(20, 0, 0, 0)

        await prisma.match.create({
          data: {
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            leagueId: premierLeague.id,
            matchDate: matchDate,
            status: match.status,
          },
        })
      }
    }

    console.log('Created matches')
  }

  // Create tags (Russian)
  const tags = [
    { name: 'Трансфер', slug: 'transfer' },
    { name: 'Превью матча', slug: 'match-preview' },
    { name: 'Обзор матча', slug: 'match-report' },
    { name: 'Травма', slug: 'injury' },
    { name: 'Срочные новости', slug: 'breaking-news' },
    { name: 'Лига чемпионов', slug: 'ucl' },
    { name: 'Месси', slug: 'messi' },
    { name: 'Роналду', slug: 'ronaldo' },
    { name: 'Премьер-лига', slug: 'premier-league-tag' },
    { name: 'Ла Лига', slug: 'la-liga-tag' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    })
  }

  console.log('Created tags')

  // Create static pages (Russian)
  const pages = [
    {
      title: 'О нас',
      slug: 'about',
      content: '<h2>О портале Тренды Спорта</h2><p>Тренды Спорта — ваш надёжный источник последних спортивных новостей, результатов матчей и аналитики со всего мира.</p><p>Наша команда опытных спортивных журналистов работает круглосуточно, чтобы предоставить вам свежие новости, эксклюзивные интервью и экспертные комментарии по футболу, баскетболу, хоккею, теннису, киберспорту и другим видам спорта.</p><h3>Наша миссия</h3><p>Мы стремимся быть лучшим источником спортивных новостей для русскоязычной аудитории, предоставляя актуальную и достоверную информацию.</p>',
      isPublished: true,
    },
    {
      title: 'Реклама',
      slug: 'advertising',
      content: '<h2>Размещение рекламы</h2><p>Охватите миллионы увлечённых спортивных болельщиков через нашу рекламную платформу.</p><p>Мы предлагаем различные варианты рекламы, включая баннерную рекламу, спонсорский контент и спонсорство рассылки.</p><h3>Контакты</h3><p>Свяжитесь с нами по адресу reklama@trendysporta.ru для получения информации о тарифах и наличии мест.</p><h3>Преимущества</h3><ul><li>Целевая аудитория спортивных болельщиков</li><li>Высокая вовлечённость пользователей</li><li>Гибкие форматы размещения</li></ul>',
      isPublished: true,
    },
    {
      title: 'Политика конфиденциальности',
      slug: 'privacy-policy',
      content: '<h2>Политика конфиденциальности</h2><p>Последнее обновление: Декабрь 2024</p><p>Настоящая Политика конфиденциальности описывает, как Тренды Спорта собирает, использует и передаёт информацию о вас при использовании нашего веб-сайта.</p><h3>Какую информацию мы собираем</h3><p>Мы собираем информацию, которую вы предоставляете нам напрямую, например, при создании учётной записи, подписке на рассылку или обращении к нам.</p><h3>Как мы используем информацию</h3><p>Мы используем собранную информацию для предоставления, поддержки и улучшения наших услуг, а также для связи с вами.</p>',
      isPublished: true,
    },
    {
      title: 'Политика Cookie',
      slug: 'cookie-policy',
      content: '<h2>Политика использования Cookie</h2><p>Последнее обновление: Декабрь 2024</p><p>Настоящая Политика Cookie объясняет, как Тренды Спорта использует файлы cookie и аналогичные технологии.</p><h3>Что такое Cookie?</h3><p>Cookie — это небольшие текстовые файлы, которые размещаются на вашем устройстве при посещении веб-сайта.</p><h3>Как мы используем Cookie</h3><p>Мы используем cookie для анализа трафика сайта, персонализации контента и показа целевой рекламы.</p><h3>Ваш выбор</h3><p>Вы можете управлять cookie через настройки браузера. Однако отключение cookie может повлиять на функциональность нашего веб-сайта.</p>',
      isPublished: true,
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
  }

  console.log('Created static pages')

  // Create ad zones
  const adZones = [
    { name: 'Header Banner', slug: 'header-banner', isActive: true },
    { name: 'Sidebar Top', slug: 'sidebar-top', isActive: true },
    { name: 'Sidebar Bottom', slug: 'sidebar-bottom', isActive: true },
    { name: 'Article Top', slug: 'article-top', isActive: true },
    { name: 'Article Bottom', slug: 'article-bottom', isActive: true },
    { name: 'In-Article', slug: 'in-article', isActive: true },
  ]

  for (const adZone of adZones) {
    await prisma.adZone.upsert({
      where: { slug: adZone.slug },
      update: {},
      create: adZone,
    })
  }

  console.log('Created ad zones')

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Sports News',
      siteDescription: 'Your trusted source for the latest sports news, match results, and in-depth analysis.',
    },
  })

  console.log('Created site settings')

  // Create import sources
  const importSources = [
    {
      name: 'BBC Sport',
      slug: 'bbc-sport',
      type: 'RSS' as const,
      url: 'https://www.bbc.com/sport',
      feedUrl: 'https://feeds.bbci.co.uk/sport/rss.xml',
      defaultCategory: 'football',
      checkInterval: 30,
    },
    {
      name: 'ESPN',
      slug: 'espn',
      type: 'RSS' as const,
      url: 'https://www.espn.com',
      feedUrl: 'https://www.espn.com/espn/rss/news',
      defaultCategory: 'football',
      checkInterval: 30,
    },
  ]

  for (const source of importSources) {
    await prisma.importSource.upsert({
      where: { slug: source.slug },
      update: {},
      create: source,
    })
  }

  console.log('Created import sources')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
