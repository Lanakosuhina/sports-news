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

  // Create main categories (Russian)
  const categories = [
    // Main sections
    { name: 'Букмекеры', slug: 'bukmekeryi', order: 1 },
    { name: 'Бонусы', slug: 'bonusyi', order: 2 },
    { name: 'Центр ставок', slug: 'tsentr-stavok', order: 3 },
    { name: 'Новости', slug: 'novosti', order: 4 },

    // Букмекеры subcategories
    { name: 'Букмекеры с бонусами', slug: 'bukmekeryi-s-bonusami', order: 10 },
    { name: 'Приложения букмекеров', slug: 'prilozheniya-bukmekerov', order: 11 },
    { name: 'Все легальные букмекеры', slug: 'vse-legalnyie-bukmekeryi', order: 12 },
    { name: 'Честный рейтинг', slug: 'chestnyiy-reyting', order: 13 },

    // Бонусы subcategories
    { name: 'Без депозита', slug: 'bez-depozita', order: 20 },
    { name: 'Фрибет', slug: 'fribet', order: 21 },
    { name: 'Промокод Winline', slug: 'promokod-winline', order: 22 },
    { name: 'Промокоды Fonbet', slug: 'promokodyi-fonbet', order: 23 },

    // Football leagues (Центр ставок -> Футбол)
    { name: 'Лига чемпионов', slug: 'liga-chempionov', order: 30 },
    { name: 'Лига Европы', slug: 'liga-evropyi', order: 31 },
    { name: 'РПЛ', slug: 'rpl', order: 32 },
    { name: 'Кубок России', slug: 'kubok-rossii', order: 33 },
    { name: 'ЧМ-2026 Европа', slug: 'chm-2026-evropa', order: 34 },
    { name: 'ЧМ-2026 CONMEBOL', slug: 'chm-2026-conmebol', order: 35 },
    { name: 'АПЛ', slug: 'apl', order: 36 },
    { name: 'Ла Лига', slug: 'la-liga', order: 37 },
    { name: 'Серия А', slug: 'seriya-a', order: 38 },
    { name: 'Бундеслига', slug: 'bundesliga', order: 39 },
    { name: 'Лига 1', slug: 'liga-1', order: 40 },

    // Hockey (Центр ставок -> Хоккей)
    { name: 'КХЛ', slug: 'khl', order: 50 },
    { name: 'МЧМ-2026', slug: 'mchm-2026', order: 51 },

    // Tennis (Центр ставок -> Теннис)
    { name: 'Australian Open', slug: 'australian-open', order: 60 },
    { name: 'Roland Garros', slug: 'roland-garros', order: 61 },
    { name: 'Уимблдон', slug: 'uimbldon', order: 62 },
    { name: 'US Open', slug: 'us-open', order: 63 },
    { name: 'ATP Tour', slug: 'atp-tour', order: 64 },
    { name: 'WTA Tour', slug: 'wta-tour', order: 65 },

    // News categories (Новости)
    { name: 'Футбол', slug: 'futbol', order: 70 },
    { name: 'Хоккей', slug: 'hokkey', order: 71 },
    { name: 'Теннис', slug: 'tennis', order: 72 },
    { name: 'Баскетбол', slug: 'basketbol', order: 73 },
    { name: 'ММА', slug: 'mma', order: 74 },
    { name: 'Бокс', slug: 'boks', order: 75 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: category.order },
      create: category,
    })
  }

  console.log('Created categories')

  // Create some leagues
  const footballCategory = await prisma.category.findUnique({ where: { slug: 'futbol' } })

  if (footballCategory) {
    const leagues = [
      { name: 'Премьер-лига', slug: 'premier-league', country: 'Англия', categoryId: footballCategory.id },
      { name: 'Ла Лига', slug: 'la-liga-league', country: 'Испания', categoryId: footballCategory.id },
      { name: 'Лига чемпионов', slug: 'champions-league', country: 'Европа', categoryId: footballCategory.id },
      { name: 'Чемпионат мира', slug: 'world-cup', country: 'Международный', categoryId: footballCategory.id },
      { name: 'РПЛ', slug: 'rpl-league', country: 'Россия', categoryId: footballCategory.id },
    ]

    for (const league of leagues) {
      await prisma.league.upsert({
        where: { slug: league.slug },
        update: { name: league.name, country: league.country },
        create: league,
      })
    }

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
  const premierLeague = await prisma.league.findUnique({ where: { slug: 'premier-league' } })

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
    { name: 'Ставки', slug: 'stavki' },
    { name: 'Прогнозы', slug: 'prognozy' },
    { name: 'Букмекеры', slug: 'bukmekeryi-tag' },
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
      content: '<h2>О портале Тренды Спорта</h2><p> Мы – спортивное СМИ, всем сердцем любящее спорт. Честно пишем о спорте для тех, кто разделяет нашу страсть!</p><p>Наша команда опытных спортивных журналистов работает круглосуточно, чтобы предоставить вам свежие новости, эксклюзивные интервью и экспертные комментарии по футболу, баскетболу, хоккею, теннису, киберспорту и другим видам спорта.</p><h3>Наша миссия</h3><p>Мы стремимся быть лучшим источником спортивных новостей для русскоязычной аудитории, предоставляя актуальную и достоверную информацию.</p>',
      isPublished: true,
    },
    {
      title: 'Контакты',
      slug: 'contacts',
      content: '<h2>Контакты</h2><p>Свяжитесь с нами по любым вопросам:</p><h3>Редакция</h3><p>Email: info@trendysporta.ru</p><h3>Реклама</h3><p>Email: reklama@trendysporta.ru</p><h3>Техническая поддержка</h3><p>Email: support@trendysporta.ru</p><h3>Адрес</h3><p>г. Москва, ул. Спортивная, д. 1</p>',
      isPublished: true,
    },
    {
      title: 'Пользовательское соглашение',
      slug: 'user-agreement',
      content: '<h2>Пользовательское соглашение</h2><p>Последнее обновление: Декабрь 2024</p><h3>1. Общие положения</h3><p>Настоящее Пользовательское соглашение регулирует отношения между администрацией сайта Тренды Спорта и пользователями сайта.</p><h3>2. Права и обязанности сторон</h3><p>Пользователь обязуется не нарушать законодательство РФ при использовании сайта.</p><h3>3. Ответственность</h3><p>Администрация сайта не несёт ответственности за действия пользователей.</p><h3>4. Изменение соглашения</h3><p>Администрация оставляет за собой право изменять настоящее соглашение без предварительного уведомления.</p>',
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
    {
      title: 'Ответственная игра',
      slug: 'responsible-gaming',
      content: '<h2>Ответственная игра</h2><p>Мы заботимся о наших пользователях и поддерживаем принципы ответственной игры.</p><h3>Признаки проблемной игры</h3><ul><li>Вы тратите больше денег, чем можете себе позволить</li><li>Вы играете, чтобы отвлечься от проблем</li><li>Вы пытаетесь отыграть проигрыши</li><li>Вы занимаете деньги для игры</li></ul><h3>Что делать?</h3><p>Если вы или ваши близкие столкнулись с проблемой игровой зависимости, обратитесь за помощью к специалистам.</p><h3>Полезные ресурсы</h3><p>Горячая линия психологической помощи: 8-800-2000-122 (бесплатно по России)</p><h3>Помните</h3><p>Азартные игры предназначены для развлечения. Играйте ответственно!</p>',
      isPublished: true,
    },
    {
      title: 'Реклама',
      slug: 'advertising',
      content: '<h2>Размещение рекламы</h2><p>Охватите миллионы увлечённых спортивных болельщиков через нашу рекламную платформу.</p><p>Мы предлагаем различные варианты рекламы, включая баннерную рекламу, спонсорский контент и спонсорство рассылки.</p><h3>Контакты</h3><p>Свяжитесь с нами по адресу reklama@trendysporta.ru для получения информации о тарифах и наличии мест.</p><h3>Преимущества</h3><ul><li>Целевая аудитория спортивных болельщиков</li><li>Высокая вовлечённость пользователей</li><li>Гибкие форматы размещения</li></ul>',
      isPublished: true,
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, content: page.content },
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
      siteName: 'Тренды спорта',
      siteDescription: 'Мы – спортивное СМИ, всем сердцем любящее спорт. Честно пишем о спорте для тех, кто разделяет нашу страсть!',
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
      defaultCategory: 'futbol',
      checkInterval: 30,
    },
    {
      name: 'ESPN',
      slug: 'espn',
      type: 'RSS' as const,
      url: 'https://www.espn.com',
      feedUrl: 'https://www.espn.com/espn/rss/news',
      defaultCategory: 'futbol',
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

  // Create bookmakers
  // Order: winline, leon, fonbet, betboom, bettery, betcity, marathon, bet, melbet, balbet, liga stavok, olympbet
  const bookmakersData = [
    {
      name: 'Winline',
      slug: 'winline',
      logo: '/bookmakers/winline.svg',
      bonus: '3000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1439,
      playersCount: 10589,
      rating: 4.8,
      link: 'https://winline.ru',
      order: 1,
      ratingOrder: 1,
    },
    {
      name: 'Leon',
      slug: 'leon',
      logo: '/bookmakers/leon.svg',
      bonus: '25000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1188,
      playersCount: 6321,
      rating: 4.7,
      link: 'https://leon.ru',
      order: 2,
      ratingOrder: 2,
    },
    {
      name: 'Fonbet',
      slug: 'fonbet',
      logo: '/bookmakers/fonbet.svg',
      bonus: '15000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 2404,
      playersCount: 11248,
      rating: 4.6,
      link: 'https://fonbet.ru',
      order: 3,
      ratingOrder: 3,
    },
    {
      name: 'BetBoom',
      slug: 'betboom',
      logo: '/bookmakers/betboom.svg',
      bonus: '10000 ₽',
      bonusLabel: 'Эксклюзив',
      reviewsCount: 681,
      playersCount: 5303,
      rating: 4.5,
      link: 'https://betboom.ru',
      order: 4,
      ratingOrder: 4,
    },
    {
      name: 'Bettery',
      slug: 'bettery',
      logo: '/bookmakers/bettery.svg',
      bonus: '10000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 520,
      playersCount: 3200,
      rating: 4.4,
      link: 'https://bettery.ru',
      order: 5,
      ratingOrder: 5,
    },
    {
      name: 'Betcity',
      slug: 'betcity',
      logo: '/bookmakers/betcity.svg',
      bonus: '10000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 567,
      playersCount: 1800,
      rating: 4.3,
      link: 'https://betcity.ru',
      order: 6,
      ratingOrder: 6,
    },
    {
      name: 'Марафон',
      slug: 'marathon',
      logo: '/bookmakers/marathon.svg',
      bonus: '10000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 890,
      playersCount: 4500,
      rating: 4.2,
      link: 'https://marathonbet.ru',
      order: 7,
      ratingOrder: 7,
    },
    {
      name: 'Бет',
      slug: 'bet',
      logo: '/bookmakers/bet.svg',
      bonus: '5000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 340,
      playersCount: 2100,
      rating: 4.1,
      link: 'https://1xbet.ru',
      order: 8,
      ratingOrder: 8,
    },
    {
      name: 'Melbet',
      slug: 'melbet',
      logo: '/bookmakers/melbet.svg',
      bonus: '7000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 456,
      playersCount: 2800,
      rating: 4.0,
      link: 'https://melbet.ru',
      order: 9,
      ratingOrder: 9,
    },
    {
      name: 'Балтбет',
      slug: 'balbet',
      logo: '/bookmakers/balbet.svg',
      bonus: '5000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 456,
      playersCount: 2100,
      rating: 3.9,
      link: 'https://baltbet.ru',
      order: 10,
      ratingOrder: 10,
    },
    {
      name: 'Лига Ставок',
      slug: 'liga-stavok',
      logo: '/bookmakers/liga-stavok.svg',
      bonus: '7777 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1850,
      playersCount: 7195,
      rating: 4.5,
      link: 'https://ligastavok.ru',
      order: 11,
      ratingOrder: 11,
    },
    {
      name: 'Olimpbet',
      slug: 'olimpbet',
      logo: '/bookmakers/olimpbet.svg',
      bonus: '15000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1103,
      playersCount: 5468,
      rating: 4.3,
      link: 'https://olimpbet.ru',
      order: 12,
      ratingOrder: 12,
    },
  ]

  for (const bookmaker of bookmakersData) {
    await prisma.bookmaker.upsert({
      where: { slug: bookmaker.slug },
      update: {
        name: bookmaker.name,
        logo: bookmaker.logo,
        bonus: bookmaker.bonus,
        bonusLabel: bookmaker.bonusLabel,
        reviewsCount: bookmaker.reviewsCount,
        playersCount: bookmaker.playersCount,
        rating: bookmaker.rating,
        link: bookmaker.link,
        order: bookmaker.order,
        ratingOrder: bookmaker.ratingOrder,
      },
      create: bookmaker,
    })
  }

  console.log('Created bookmakers')

  // Create selections
  const selectionsData = [
    { name: 'Букмекеры с бонусами', slug: 'bukmekeryi-s-bonusami', icon: 'gift', order: 1 },
    { name: 'Букмекеры на мобильных', slug: 'prilozheniya-bukmekerov', icon: 'smartphone', order: 2 },
    { name: 'Легальные букмекеры', slug: 'vse-legalnyie-bukmekeryi', icon: 'diamond', order: 3 },
  ]

  for (const selection of selectionsData) {
    await prisma.selection.upsert({
      where: { slug: selection.slug },
      update: { name: selection.name, icon: selection.icon, order: selection.order },
      create: selection,
    })
  }

  console.log('Created selections')

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
