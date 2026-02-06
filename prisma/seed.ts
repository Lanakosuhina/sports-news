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
      // England
      { name: 'АПЛ', slug: 'apl', country: 'Англия', categoryId: footballCategory.id },
      // Spain
      { name: 'Ла Лига', slug: 'la-liga', country: 'Испания', categoryId: footballCategory.id },
      // Germany
      { name: 'Бундеслига', slug: 'bundesliga', country: 'Германия', categoryId: footballCategory.id },
      // Italy
      { name: 'Серия А', slug: 'seriya-a', country: 'Италия', categoryId: footballCategory.id },
      // France
      { name: 'Лига 1', slug: 'liga-1', country: 'Франция', categoryId: footballCategory.id },
      // Russia
      { name: 'РПЛ', slug: 'rpl', country: 'Россия', categoryId: footballCategory.id },
      { name: 'Кубок России', slug: 'kubok-rossii', country: 'Россия', categoryId: footballCategory.id },
      // European competitions
      { name: 'Лига чемпионов', slug: 'liga-chempionov', country: 'Европа', categoryId: footballCategory.id },
      { name: 'Лига Европы', slug: 'liga-evropyi', country: 'Европа', categoryId: footballCategory.id },
      { name: 'Лига конференций', slug: 'liga-konferenciy', country: 'Европа', categoryId: footballCategory.id },
      // International
      { name: 'Чемпионат мира', slug: 'world-cup', country: 'Международный', categoryId: footballCategory.id },
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
      content: `<div class="user-agreement-content">
  <p class="document-info">Сайт: Тренды спорта<br>Дата вступления в силу: 30.12.2025<br>Версия: 1.1</p>
  <h2>ПРЕАМБУЛА</h2>
  <p>Настоящее Пользовательское соглашение (далее – «Соглашение») регулирует отношения между Обществом с ограниченной ответственностью «МГ Маркетинг» (ИНН 9729386454, ОГРН 1247700667136) (далее – «Оператор», «Администрация») и любым физическим лицом, использующим Сайт (далее – «Пользователь»), в том числе без регистрации.</p>
  <div class="warning-box"><strong>ВАЖНО:</strong> Данный Сайт является зарегистрированным СМИ распространяет информацию спортивного характера, а также информацию о букмекерских конторах, имеющих лицензию в Российской Федерации, рейтинги букмекеров, новости спорта и аналитические материалы. Сайт НЕ ЯВЛЯЕТСЯ букмекерской конторой. Сайт не принимает ставки, не организует азартные игры и не осуществляет игровую деятельность. Контент Сайта предназначен исключительно для лиц старше 18 лет.</div>
  <h2>ОБЩИЕ ПОЛОЖЕНИЯ</h2>
  <h3>Определение и статус Сайта</h3>
  <p>Сайт является зарегистрированным спортивным сетевым средством массовой информации (Свидетельство о регистрации средств массовой информации: ЭЛ № ФС 77 – 90561, выдано Федеральной службой по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзором) 23.12.2025 г.)</p>
  <h3>Определение Пользователя</h3>
  <p>Пользователем признается любое дееспособное физическое лицо старше 18 лет, которое использует Сайт в режиме реального времени, без регистрации.</p>
  <h3>Сфера действия Соглашения</h3>
  <p>Настоящее Соглашение распространяется на все отношения, связанные с использованием Пользователем функциональности Сайта;</p>
  <p>Оператор не контролирует и не несет ответственности за сайты третьих лиц, на которые Пользователь может перейти по ссылкам со Сайта. Использование таких сайтов осуществляется на риск Пользователя в соответствии с их условиями использования.</p>
  <h3>Обязательность соглашения</h3>
  <p>Использование Сайта любым способом означает полное принятие Пользователем всех условий настоящего Соглашения в том виде, в котором они опубликованы.</p>
  <p>В случае несогласия с условиями Соглашения Пользователь обязан незамедлительно прекратить использование Сайта.</p>
  <h3>Изменение Соглашения</h3>
  <p>Оператор вправе вносить изменения в Соглашение в одностороннем порядке без какого-либо специального уведомления Пользователя. Новая редакция Соглашения вступает в силу с момента её опубликования на Сайте. Продолжение использования Сайта после опубликования новой редакции означает согласие Пользователя с произведенными изменениями.</p>
  <h2>ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ ОПЕРАТОРА</h2>
  <div class="info-box info-box-red"><h4>Что Сайт НЕ делает</h4><p>Сайт явно НЕ:</p><ul><li>не принимает ставки и не организует азартные игры;</li><li>не является букмекерской конторой;</li><li>не гарантирует результаты прогнозов и аналитических материалов;</li><li>не предоставляет финансовые консультации и рекомендации по ставкам;</li><li>не имеет лицензии на ведение игорного бизнеса;</li><li>не осуществляет торговлю финансовыми инструментами.</li></ul></div>
  <h3>Сайт не несёт ответственности за</h3>
  <p>Финансовые потери, убытки или иные материальные убытки Пользователя, понесенные в результате:</p>
  <ul><li>использования информации, размещенной на Сайте;</li><li>участия в азартных играх, ставках или пари;</li><li>нарушения букмекерами своих обязательств перед Пользователями;</li><li>неточности, неполноту или устаревание информации о букмекерских конторах;</li><li>действий третьих лиц, включая капперов, аналитиков.</li></ul>
  <p>Персональные финансовые решения Пользователя, принятые на основе информации со Сайта.</p>
  <p>Действия или бездействие букмекерских контор, представленных на Сайте.</p>
  <h3>Отказ от гарантий</h3>
  <p>Сайт предоставляется на условиях «как есть» и «как доступно» без каких-либо гарантий, включая гарантии:</p>
  <ul><li>беспрерывного функционирования;</li><li>отсутствия ошибок;</li><li>точности и надежности информации;</li><li>соответствия информации действительности;</li><li>защиты от вредоносных программ.</li></ul>
  <h2>ВОЗРАСТНОЕ ОГРАНИЧЕНИЕ И ПРОВЕРКА ВОЗРАСТА</h2>
  <div class="warning-box warning-box-fraud"><h4>Возрастное требование</h4><p>Контент Сайта предназначен исключительно для лиц старше 18 лет. Лица, не достигшие 18 лет, категорически запрещается использовать Сайт.</p></div>
  <h3>Проверка возраста</h3>
  <p>Пользователь гарантирует Оператору, что ему исполнилось 18 лет и что он обладает полной дееспособностью для заключения Соглашения.</p>
  <p>Оператор вправе использовать доступные технические и организационные меры для проверки соответствия возрастным требованиям.</p>
  <h2>АВТОРСКИЕ ПРАВА И ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ</h2>
  <h3>Собственность Оператора</h3>
  <p>Все материалы, размещенные на Сайте, включая, но не ограничиваясь:</p>
  <ul><li>тексты, статьи и аналитические материалы;</li><li>фотографии, графику и видеоконтент;</li><li>рейтинги, данные и статистику;</li><li>исходный код и базы данных;</li><li>логотип и фирменный стиль;</li><li>прочие объекты интеллектуальной собственности;</li></ul>
  <p>являются объектами авторского права, принадлежащими Оператору или используемыми им на законных основаниях.</p>
  <p>Весь контент Сайта охраняется авторским правом в соответствии с законодательством Российской Федерации и международными соглашениями.</p>
  <h3>Права Пользователя на использование контента</h3>
  <p>Пользователю предоставляется простое (неисключительное) право на просмотр контента Сайта исключительно для личного, некоммерческого использования.</p>
  <p>Пользователь может загружать («скачивать») материалы только для личного использования, при условии сохранения всех знаков авторского права и авторства.</p>
  <h3>Запрещенные действия</h3>
  <p>Пользователю запрещается:</p>
  <ul><li>копировать, распространять, передавать третьим лицам материалы со Сайта без письменного разрешения Оператора;</li><li>использовать материалы в коммерческих целях;</li><li>модифицировать, адаптировать, переводить контент;</li><li>удалять или изменять указания на авторские права;</li><li>создавать производные работы на основе контента Сайта;</li><li>использовать контент в целях конкуренции с Оператором;</li><li>применять боты, скреперы и автоматизированные средства для сбора данных со Сайта, за исключением случаев, когда это явно разрешено Оператором;</li></ul>
  <h3>Уведомление о нарушении авторских прав</h3>
  <p>При обнаружении нарушения авторских прав правообладатель может направить Оператору заявление на адрес электронной почты.</p>
  <p>Заявление должно содержать:</p>
  <ul><li>информацию о правообладателе;</li><li>описание произведения, нарушающего авторское право;</li><li>ссылку на материал на Сайте;</li><li>обоснование нарушения;</li><li>подпись и контактную информацию.</li></ul>
  <p>Оператор обязуется рассмотреть заявление в течение 24 часов и, при подтверждении нарушения, удалить материал.</p>
  <h2>ПРАВИЛА ПОВЕДЕНИЯ НА САЙТЕ</h2>
  <h3>Общие требования</h3>
  <p>При использовании Сайта Пользователь обязан:</p>
  <ul><li>соблюдать действующее законодательство Российской Федерации;</li><li>соблюдать положения настоящего Соглашения;</li><li>уважать права и достоинство других Пользователей и третьих лиц;</li><li>воздерживаться от действий, которые могут повредить репутации Сайта.</li></ul>
  <p>Пользователь гарантирует, что не включен в реестр физических лиц, отказавшихся от участия в азартных играх, и берет на себя обязательство немедленно прервать использование Сайта, если его статус изменится на указанный.</p>
  <h3>Запрещенные действия</h3>
  <p>Пользователям запрещается:</p>
  <p><strong>Использование запрещенных технологий:</strong></p>
  <ul><li>использовать боты, парсеры, скреперы для автоматического сбора данных;</li><li>осуществлять несанкционированный доступ к системам Сайта;</li><li>атаковать Сайт (DDoS-атаки, SQL-инъекции и т.д.).</li></ul>
  <p><strong>Нарушение функционирования:</strong></p>
  <ul><li>загружать и распространять вредоносное программное обеспечение;</li><li>перегружать серверы Сайта;</li><li>использовать Сайт для фишинга и кража личных данных.</li></ul>
  <h2>ОБРАБОТКА ПЕРСОНАЛЬНЫХ ДАННЫХ</h2>
  <h3>Применимые политики</h3>
  <p>Обработка персональных данных Пользователя осуществляется в соответствии с:</p>
  <ul><li>Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»;</li><li><a href="/page/privacy-policy">Политикой конфиденциальности</a>;</li><li><a href="/page/cookie-policy">Политикой в отношении файлов cookie</a>.</li></ul>
  <p>Указанные документы являются неотъемлемой частью настоящего Соглашения.</p>
  <h3>Категории собираемых данных</h3>
  <p>Оператор собирает следующие категории персональных данных:</p>
  <p><strong>Добровольно предоставляемые данные:</strong></p>
  <ul><li>Адрес электронной почты в случае направления обращения в адрес Сайта.</li><li>Фамилия, имя, отчество в случае направления обращения в адрес Сайта.</li><li>Файлы cookie Пользователя, разрешенные к обработке путём проставления согласия в чек-боксе всплывающего баннера согласия, согласно <a href="/page/cookie-policy">Политике в отношении файлов cookie</a>.</li></ul>
  <p><strong>Автоматически собираемые данные:</strong></p>
  <ul><li>IP-адрес;</li><li>информация о браузере и операционной системе;</li><li>данные о поведении на Сайте;</li><li>файлы cookie.</li></ul>
  <h3>Безопасность данных</h3>
  <p>Оператор примет все необходимые меры для защиты персональных данных от несанкционированного доступа, нарушения конфиденциальности и целостности.</p>
  <h2>ФАЙЛЫ COOKIE И ОТСЛЕЖИВАНИЕ</h2>
  <h3>Использование файлов cookie</h3>
  <p>Сайт использует файлы cookie для:</p>
  <ul><li>функционирования Сайта;</li><li>сохранения пользовательских настроек;</li><li>аналитики и улучшения Сайта;</li><li>персонализации контента и рекламы.</li></ul>
  <h3>Типы cookie</h3>
  <p>Обязательные cookie активированы по умолчанию без согласия.</p>
  <p>Функциональные, аналитические и рекламные cookie требуют согласия Пользователя, которое может быть предоставлено через баннер при первом посещении.</p>
  <h3>Управление cookie</h3>
  <p>Пользователь может управлять файлами cookie через настройки браузера или отказаться от них, однако это может влиять на функциональность Сайта.</p>
  <h2>КОНТАКТЫ И ПОДДЕРЖКА</h2>
  <h3>Контактная информация Оператора</h3>
  <ul><li><strong>Оператор:</strong> ООО «МГ Маркетинг»</li><li><strong>ИНН:</strong> 9729386454</li><li><strong>ОГРН:</strong> 1247700667136</li><li><strong>Адрес для корреспонденции:</strong> 119607, г. Москва, вн.тер.г. Муниципальный округ Раменки, Пр-кт Мичуринский, д. 27 к. 3, помещ. 12Н.</li></ul>
  <h3>Обращения Пользователей</h3>
  <p>Пользователи могут обращаться к Оператору с вопросами, предложениями и жалобами через форму обратной связи на Сайте или по электронной почте.</p>
  <h2>РАЗРЕШЕНИЕ СПОРОВ</h2>
  <p>Все споры между Оператором и Пользователем разрешаются в соответствии с законодательством Российской Федерации.</p>
  <p>При возникновении споров Стороны обязуются приложить все усилия для их разрешения путем переговоров.</p>
  <p>В случае невозможности разрешить спор путем переговоров, он подлежит рассмотрению в суде Российской Федерации по месту нахождения Оператора.</p>
  <p>Все претензии должны подаваться в письменной форме или на адрес электронной почты Оператора с обязательным направлением физической копии на юридический адрес Оператора.</p>
  <h2>ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ И ОТКАЗ</h2>
  <h3>Полная ответственность Пользователя</h3>
  <p>Пользователь несет полную и единоличную ответственность за все свои действия на Сайте и информацию, которую он размещает.</p>
  <p>Пользователь возмещает все убытки и вред, понесенные Оператором в результате:</p>
  <ul><li>нарушения Пользователем законодательства;</li><li>нарушения Пользователем условий Соглашения;</li></ul>
  <h3>Отказ от ответственности Оператора</h3>
  <p>Сайт предоставляется на условиях «как есть» без каких-либо гарантий.</p>
  <p>Оператор не несет ответственности за:</p>
  <ul><li>убытки, понесенные Пользователем при использовании Сайта;</li><li>точность, полноту и своевременность информации;</li><li>непрерывность функционирования Сайта;</li><li>технические ошибки и сбои;</li><li>действия третьих лиц;</li><li>утрату данных или работоспособности устройств Пользователя;</li><li>последствия использования информации со Сайта.</li></ul>
  <h2>ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>
  <p>В случае, если одно или более положений настоящего Соглашения являются недействительными, такая недействительность не должна оказывать влияния на действительность других положений Соглашения. При этом Соглашение должно толковаться таким образом, как если бы оно не содержал такого недействительного положения.</p>
  <p>Соглашение вступает в силу с момента начала использования Сайта и действует бессрочно до тех пор, пока Пользователь использует Сайт.</p>
  <p>Оператор вправе в любое время в одностороннем порядке расторгнуть Соглашение и запретить доступ к Сайту без указания причины.</p>
  <div class="highlight"><p>© 2026 ООО «МГ Маркетинг». Все права защищены.<br>Последнее обновление: 15.01.2026</p></div>
</div>`,
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

  // Create bookmakers
  // Order: winline, leon, fonbet, betboom, bettery, betcity, marathon, bet, melbet, balbet, liga stavok, olympbet
  const bookmakersData = [
    {
      name: 'Winline',
      slug: 'winline',
      logo: '/bookmakers/winline.png',
      bonus: '3000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1439,
      playersCount: 10589,
      rating: 4.8,
      link: 'https://winline.ru',
      website: 'winline.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №27',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/winline/id1087498010',
      androidAppLink: 'https://winline.ru/android/',
      order: 1,
      ratingOrder: 1,
    },
    {
      name: 'Leon',
      slug: 'leon',
      logo: '/bookmakers/leon.png',
      bonus: '25000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1188,
      playersCount: 6321,
      rating: 4.7,
      link: 'https://leon.ru',
      website: 'leon.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №22',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/leon-ставки-на-спорт/id1450043999',
      androidAppLink: 'https://leon.ru/app/',
      order: 3,
      ratingOrder: 3,
    },
    {
      name: 'Fonbet',
      slug: 'fonbet',
      logo: '/bookmakers/fonbet.png',
      bonus: '15000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 2404,
      playersCount: 11248,
      rating: 4.6,
      link: 'https://fonbet.ru',
      website: 'fonbet.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №1',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/фонбет-ставки-на-спорт/id1059498038',
      androidAppLink: 'https://fonbet.ru/android/',
      order: 2,
      ratingOrder: 2,
    },
    {
      name: 'BetBoom',
      slug: 'betboom',
      logo: '/bookmakers/betboom.png',
      bonus: '10000 ₽',
      bonusLabel: 'Эксклюзив',
      reviewsCount: 681,
      playersCount: 5303,
      rating: 4.5,
      link: 'https://betboom.ru',
      website: 'betboom.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №14',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/betboom-ставки-на-спорт/id1588562887',
      androidAppLink: 'https://betboom.ru/android/',
      order: 4,
      ratingOrder: 4,
    },
    {
      name: 'Bettery',
      slug: 'bettery',
      logo: '/bookmakers/bettery.png',
      bonus: '10000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 520,
      playersCount: 3200,
      rating: 4.4,
      link: 'https://bettery.ru',
      website: 'bettery.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №30',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/bettery/id1547618584',
      androidAppLink: 'https://bettery.ru/android/',
      order: 5,
      ratingOrder: 5,
    },
    {
      name: 'Betcity',
      slug: 'betcity',
      logo: '/bookmakers/betcity.png',
      bonus: '10000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 567,
      playersCount: 1800,
      rating: 4.3,
      link: 'https://betcity.ru',
      website: 'betcity.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №16',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/бетсити-ставки-на-спорт/id1450821458',
      androidAppLink: 'https://betcity.ru/ru/app',
      order: 6,
      ratingOrder: 6,
    },
    {
      name: 'Марафон',
      slug: 'marathon',
      logo: '/bookmakers/marathon.png',
      bonus: '10000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 890,
      playersCount: 4500,
      rating: 4.2,
      link: 'https://marathonbet.ru',
      website: 'marathonbet.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №18',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/марафон-ставки-на-спорт/id1481907997',
      androidAppLink: 'https://marathonbet.ru/android/',
      order: 7,
      ratingOrder: 7,
    },
    {
      name: 'Melbet',
      slug: 'melbet',
      logo: '/bookmakers/melbet.png',
      bonus: '7000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 456,
      playersCount: 2800,
      rating: 4.0,
      link: 'https://melbet.ru',
      website: 'melbet.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №28',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/мелбет/id1534498498',
      androidAppLink: 'https://melbet.ru/android/',
      order: 9,
      ratingOrder: 9,
    },
    {
      name: 'Балтбет',
      slug: 'balbet',
      logo: '/bookmakers/balbet.png',
      bonus: '5000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 456,
      playersCount: 2100,
      rating: 3.9,
      link: 'https://baltbet.ru',
      website: 'baltbet.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №5',
      minDeposit: '50 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/балтбет/id1479661538',
      androidAppLink: 'https://baltbet.ru/android/',
      order: 10,
      ratingOrder: 10,
    },
    {
      name: 'Лига Ставок',
      slug: 'liga-stavok',
      logo: '/bookmakers/liga-stavok.png',
      bonus: '7777 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1850,
      playersCount: 7195,
      rating: 4.5,
      link: 'https://ligastavok.ru',
      website: 'ligastavok.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №6',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/лига-ставок-ставки-на-спорт/id1060498493',
      androidAppLink: 'https://ligastavok.ru/android/',
      order: 11,
      ratingOrder: 11,
    },
    {
      name: 'Olimpbet',
      slug: 'olimpbet',
      logo: '/bookmakers/olimpbet.png',
      bonus: '15000 ₽',
      bonusLabel: 'Новым игрокам',
      reviewsCount: 1103,
      playersCount: 5468,
      rating: 4.3,
      link: 'https://olimpbet.ru',
      website: 'olimpbet.ru',
      hasLicense: true,
      licenseNumber: 'ФНС №26',
      minDeposit: '100 ₽',
      hasIosApp: true,
      hasAndroidApp: true,
      iosAppLink: 'https://apps.apple.com/ru/app/олимпбет-ставки-на-спорт/id1508949485',
      androidAppLink: 'https://olimpbet.ru/android/',
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
        website: bookmaker.website,
        hasLicense: bookmaker.hasLicense,
        licenseNumber: bookmaker.licenseNumber,
        minDeposit: bookmaker.minDeposit,
        hasIosApp: bookmaker.hasIosApp,
        hasAndroidApp: bookmaker.hasAndroidApp,
        iosAppLink: bookmaker.iosAppLink,
        androidAppLink: bookmaker.androidAppLink,
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

  // Create articles
  const futbolCategory = await prisma.category.findUnique({ where: { slug: 'futbol' } })
  const hokkeyCategory = await prisma.category.findUnique({ where: { slug: 'hokkey' } })
  const tennisCategory = await prisma.category.findUnique({ where: { slug: 'tennis' } })
  const basketbolCategory = await prisma.category.findUnique({ where: { slug: 'basketbol' } })
  const mmaCategory = await prisma.category.findUnique({ where: { slug: 'mma' } })
  const boksCategory = await prisma.category.findUnique({ where: { slug: 'boks' } })

  const transferTag = await prisma.tag.findUnique({ where: { slug: 'transfer' } })
  const matchPreviewTag = await prisma.tag.findUnique({ where: { slug: 'match-preview' } })
  const matchReportTag = await prisma.tag.findUnique({ where: { slug: 'match-report' } })
  const breakingNewsTag = await prisma.tag.findUnique({ where: { slug: 'breaking-news' } })
  const rplLeague = await prisma.league.findUnique({ where: { slug: 'rpl-league' } })

  // Helper function to generate random date within last 30 days
  function randomDate(daysBack: number = 30): Date {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
    date.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0)
    return date
  }

  // Helper function to create specific date
  function specificDate(month: number, day: number, hour: number = 12): Date {
    const date = new Date(2025, month - 1, day, hour, 0, 0, 0)
    return date
  }

  const articlesData = [
    // Article 1: Черевченко о VAR
    {
      title: 'Черевченко: «VAR раздражает больше всего. В России просмотр может растянуться на десять минут»',
      slug: 'cherevchenko-var-razdrazhaet-bolshe-vsego',
      excerpt: 'Тренер таджикского «Истиклола» Игорь Черевченко дал критическую оценку работе видеоассистента в современном футболе.',
      content: `<p>Тренер таджикского «Истиклола» Игорь Черевченко дал критическую оценку работе видеоассистента в современном футболе, назвав VAR главным раздражающим его фактором в игре.</p>
<p>«Больше всего меня раздражает VAR, без него было лучше. Если в Европе еще более-менее терпимо, судьи смотрят секунды, то в России совсем тяжело — просмотр может растянуться надолго», — заявил Черевченко в интервью LiveSport.Ru. В качестве примера он привёл матч «Ростов» — «Акрон», где арбитры изучали один эпизод целых десять минут.</p>
<p>По мнению экс-тренера «Химок» и «Балтики», полная отмена VAR не нанесёт вред футболу, а может даже его улучшить. «Ничего футбол не потеряет, а может даже и приобретет. Потому что VAR, по сути, дает неравномерное распределение — одни команды от него регулярно страдают, а другие, благодаря ему, регулярно выигрывают», — объяснил Черевченко.</p>
<p>На втором месте в списке его претензий к современному футболу стоят судейские трактовки: «Почему никак не могут договориться ни у нас, ни в Европе, например, по правилам игры рукой — не понимаю». При этом Черевченко отметил, что сам никогда не конфликтовал с судьями, проповедуя спокойствие: «Не стоит ругаться с судьями, хотя бы потому, что это все равно ничего не изменит, раз арбитр уже принял решение».</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 19, 14),
    },
    // Article 2: Луис Энрике — лучший тренер года
    {
      title: 'Луис Энрике — лучший тренер года по версии ФИФА',
      slug: 'luis-enrike-luchshij-trener-goda-fifa',
      excerpt: '«ПСЖ» поздравил главного тренера команды Луиса Энрике с присуждением ему награды «Лучший тренер года» на церемонии The Best FIFA Football Awards.',
      content: `<p>«ПСЖ» поздравил главного тренера команды Луиса Энрике с присуждением ему награды «Лучший тренер года» на церемонии The Best FIFA Football Awards.</p>
<p>«Наш тренер Луис Энрике завоевал трофей FIFA #TheBest, признав лучшим тренером года!», — написал официальный аккаунт парижского клуба на X.</p>
<p>Это признание стало заслуженным подтверждением успешной работы испанского специалиста, который привёл «ПСЖ» к результатам на клубном уровне. Энрике продолжает укреплять свой статус одного из ведущих тренеров мировой футбольной элиты, работая с одной из сильнейших команд Европы.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 16, 18),
    },
    // Article 3: Семин о Станковиче
    {
      title: 'Семин о Станковиче: «Не готов к давлению в „Спартаке". И без тренера клуб может быть шестым»',
      slug: 'semin-o-stankoviche-ne-gotov-k-davleniyu',
      excerpt: 'Юрий Семин, бывший тренер московского «Локомотива», дал критическую оценку работе Деяна Станковича в «Спартаке» и объяснил причины его отставки.',
      content: `<p>Юрий Семин, бывший тренер московского «Локомотива», дал критическую оценку работе Деяна Станковича в «Спартаке» и объяснил причины его отставки с должности.</p>
<p>По мнению Семина, сербский специалист недооценил сложность работы в московском клубе. «В этой команде ты должен справляться с огромным давлением. Ведь болельщики красно-белых не только любят футбол, но и разбираются в нём. Станкович до конца не представлял, с каким прессингом он тут столкнется. Он же раньше не работал в таких командах», — сказал Семин.</p>
<p>Семин подчеркнул, что расставание со Станковичем произошло не из-за четырёх побед подряд, которые он добился перед отставкой, а из-за отсутствия перспектив. «Все закономерно. Четыре победы роли не играют. Со Станковичем расстались, так как не было перспектив. Нельзя бесконечно тасовать состав», — отметил он.</p>
<h3>Предложение для «Спартака»</h3>
<p>Семин высказал рекомендацию московскому клубу: приглашать либо серьёзного иностранного специалиста с победным опытом в топ-лигах, либо российского тренера, адаптированного к реалиям и имеющего спартаковские корни. «Либо нужен серьезный иностранный специалист, либо российский, который уже адаптирован к нашим реалиям, со спартаковскими корнями», — уточнил он.</p>
<p>В заключение легенда «Локомотива» довольно критично оценил состав: «Сейчас „Спартак" только шестой. Да с таким составом он и без тренера будет занимать пятые-шестые места!»</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 19, 10),
    },
    // Article 4: Александр Головин о жизни в «Монако»
    {
      title: 'Александр Головин о жизни в «Монако», амбициях и инвестициях в компьютерные игры',
      slug: 'aleksandr-golovin-o-zhizni-v-monako',
      excerpt: 'Звезда «Монако» и сборной России Александр Головин дал развёрнутое интервью о жизни во французском княжестве, карьерных решениях и личных пристрастиях.',
      content: `<p>Звезда «Монако» и сборной России Александр Головин дал развёрнутое интервью в рамках проекта FONBET FONtour Европа, где подробно рассказал о жизни во французском княжестве, карьерных решениях и личных пристрастиях.</p>
<h3>На вершине европейского футбола</h3>
<p>Полузащитник вспомнил недавнюю победу «Монако» над парижским ПСЖ и подчеркнул уровень развития французского чемпионата. Он также поделился гордостью за то, что вошёл в топ-15 игроков по количеству матчей в истории клуба и был внесён в «книгу легенд». Головин отметил, что играет в высоком темпе рядом с такими звёздами, как Фалькао и Поль Погба, что постоянно требует максимальной отдачи.</p>
<h3>Разница между РПЛ и Лигой 1</h3>
<p>Основываясь на своём опыте, Головин объяснил главные различия между российской Премьер-лигой и чемпионатом Франции. По его мнению, ключевые факторы успеха в Европе — это интенсивность, взрывная скорость и физическая подготовка. Он считает, что многие российские игроки имеют потенциал для Лиги 1, но сталкиваются с проблемами адаптации именно в этих аспектах.</p>
<h3>Жизнь вдали от дома</h3>
<p>Головин признался в ностальгии по России. Несмотря на комфортную жизнь в Монако, он живёт один, практически без близкого круга друзей. Даже в отпуск предпочитает ездить домой, а не путешествовать по другим странам.</p>
<h3>Неожиданное хобби: инвестиции в киберспорт</h3>
<p>Пожалуй, самой неожиданной темой стали компьютерные игры. Головин рассказал, что серьёзно инвестировал во внутриигровые предметы, стоимость которых на игровом рынке выросла с 4 млн до 8-11 млн рублей. Это хобби помогает ему справляться со стрессом и отвлекаться от футбольной суеты.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 15, 15),
    },
    // Article 5: Овсянников о португальском опыте
    {
      title: 'Овсянников о португальском опыте: «У нас более развитая страна, чем Португалия»',
      slug: 'ovsyannikov-o-portugalskom-opyte',
      excerpt: 'Вратарь «Оренбурга» Богдан Овсянников подробно рассказал о своём времени в Португалии и сравнил условия жизни в двух странах.',
      content: `<p>Вратарь «Оренбурга» Богдан Овсянников подробно рассказал о своём времени в Португалии, где он прошёл стажировку в академиях ведущих клубов, и сравнил условия жизни в двух странах.</p>
<p>Овсянников приехал в Португалию совсем юным — ему было всего 17–18 лет, когда он оказался в стране для развития в академиях португальских гигантов. «Получил опыт, поиграл с хорошими академиями: «Бенфика», «Спортинг», «Порту». Адаптация была непростая, но, думаю, в будущем это помогло», — вспоминал он.</p>
<p>Говоря о стиле португальского футбола, Овсянников отметил его атакующий характер: «Они больше играют в атаку, не закрываются, обороны намного меньше, например, чем в России». Тренеры учили его быстро доставлять мяч в атакующую зону.</p>
<p>На вопрос о затратах Овсянников подчеркнул, что жить в Португалии дороже: «Цены на ЖКХ — у них намного выше. И электроэнергия, и отопление — это всё больше, чем в России».</p>
<p>В итоговой оценке стран вратарь отдал предпочтение России: «Скорее всего, в России. У нас более развитая страна, чем Португалия. Не стоим на месте, развиваемся. Вся Россия и города развиваются, инфраструктура становится лучше».</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 16, 11),
    },
    // Article 6: Алаев о судействе РПЛ
    {
      title: 'Алаев о судействе РПЛ: ошибок столько же, но РФС проделала большую работу',
      slug: 'alaev-o-sudejstve-rpl-oshibok-stolko-zhe',
      excerpt: 'Президент РПЛ Александр Алаев дал взвешенную оценку качеству судейства в российском футболе.',
      content: `<p>Президент РПЛ Александр Алаев дал взвешенную оценку качеству судейства в российском футболе, подчеркнув баланс между признанием усилий РФС и критикой отдельных аспектов системы.</p>
<p>«Я не вижу грязи, просто ошибки — столько же, что и в прошлом году», — сказал Алаев, уточняя, что судейские ошибки — это естественная часть футбола, а не результат целенаправленного влияния на результаты матчей. Он позитивно оценил работу федерации: «У нас нет отношений с Мажичем, но РФС проделала большую работу».</p>
<p>Однако Алаев не оставил без критики ряд проблемных зон в судейской системе. Он заявил, что главный судейский арбитр Мажич «слишком закрыт», а решения Этической комиссии РФС (ЭСК) «слишком однобокие». Кроме того, глава лиги раскритиковал инновационное решение с офсайдными линиями: «Офсайдные линии не убеждают и меня».</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 16, 16),
    },
    // Article 7: Мини-футбол — русский вид спорта
    {
      title: '«Мини-футбол — русский вид спорта». Россия сохранила место в топ-10 футзального рейтинга',
      slug: 'mini-futbol-russkij-vid-sporta',
      excerpt: 'Автор телеграмканала «Едим спорт» Дмитрий Егоров объяснил, почему Россия традиционно сильна в минифутболе.',
      content: `<p>Автор телеграмканала «Едим спорт» Дмитрий Егоров объяснил, почему, по его мнению, Россия традиционно сильна в минифутболе и до сих пор входит в топ-10 мирового рейтинга даже в статусе отстранённой сборной.</p>
<p>Егоров утверждает, что Россия «не предназначена для игры в большой футбол — ни климатически, ни географически», так как большинству людей элементарно негде и не с кем играть на открытых полях. При этом он напоминает, что даже в таких условиях национальная команда по футболу доходила до полуфинала чемпионата Европы и четвертьфинала чемпионата мира, но это скорее исключение, чем правило.</p>
<p>Мини-футбол он называет «русским видом спорта», отмечая, что около 70 процентов школьных занятий физкультурой в стране проходят именно в зале. Егоров уверен, что без международных отстранений Россия продолжала бы бороться за первую строчку рейтинга.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 15, 12),
    },
    // Article 8: Наумов о Карпине
    {
      title: 'Наумов: Карпин не раскрылся в «Динамо», но мог бы привести «Спартак» к чемпионству',
      slug: 'naumov-karpin-ne-raskrylsya-v-dinamo',
      excerpt: 'Бывший президент «Локомотива» Николай Наумов заявил, что неудача Валерия Карпина в «Динамо» связана не с уровнем тренера.',
      content: `<p>Бывший президент «Локомотива» Николай Наумов заявил, что неудача Валерия Карпина в московском «Динамо» связана не с уровнем тренера, а с тем, что это «не его команда». По его словам, иногда тренер попадает «не в ту команду или не в ту систему», и тогда у него не складывается, хотя в других условиях он способен добиваться больших успехов.</p>
<p>Наумов напомнил пример Унаи Эмери, у которого «ничего не получилось в „Спартаке"», но затем он ушёл и «выиграл почти всё» в других клубах. Аналогичную ситуацию он видит и в случае с Карпиным, у которого «не сложилось» в «Динамо», ушедшем на зимний перерыв на 10-м месте с 21 очком после 18 туров.</p>
<p>При этом Наумов подчеркнул, что продолжает верить в талант Карпина и считает, что в другом клубе он мог бы добиться гораздо большего. «Возьми его в „Спартак" — и он, возможно, приведёт команду к медалям или чемпионству», — заявил функционер.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 15, 14),
    },
    // Article 9: Слуцкий о Березуцком
    {
      title: 'Слуцкий — о назначении Березуцкого в «Урал»: «Он приходит не тушить пожар, а заходить на волну роста»',
      slug: 'sluckij-o-naznachenii-berezuckogo-v-ural',
      excerpt: 'Леонид Слуцкий подробно высказался о назначении Василия Березуцкого главным тренером «Урала».',
      content: `<p>Леонид Слуцкий подробно высказался о назначении Василия Березуцкого главным тренером «Урала», назвав этот шаг «максимально логичным и правильным для всех участников». По его словам, Василий давно был готов к самостоятельной работе, а ситуация в екатеринбургском клубе «создаёт идеальные стартовые условия для первого по-настоящему серьёзного тренерского проекта в России».</p>
<p>Слуцкий отметил, что «Урал» идёт с большим отрывом в ФНЛ и практически гарантировал себе выход в РПЛ, поэтому, как выразился специалист, «Бережок приходит не тушить пожар, а заходить на волну роста». Он подчеркнул, что у клуба «прекрасная инфраструктура, нормальная база, достойный стадион и смесь опытных и молодых игроков, с которой можно работать не в режиме выживания, а в режиме развития».</p>
<p>Отдельно Слуцкий остановился на сложном характере владельца «Урала» Григория Иванова, назвав работу с ним «специфической, требующей крепких нервов и очень жёсткого внутреннего стержня». При этом он добавил, что «у Григория Викторовича ещё не было тренера с таким характером, как у Васи».</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 15, 17),
    },
    // Article 10: Наумов о главном событии года
    {
      title: 'Наумов: главное событие года в российском футболе — появление молодого поколения игроков',
      slug: 'naumov-glavnoe-sobytie-goda-molodoe-pokolenie',
      excerpt: 'Бывший президент «Локомотива» выделил появление молодых талантов как главное достижение года.',
      content: `<p>Бывший президент «Локомотива» Николай Наумов выделил главное событие года в российском футболе. Он отметил, что несмотря на санкции и внешние трудности, «наш футбол неубиваемый» и главное достижение — это появление молодого поколения игроков высокого уровня.</p>
<p>По словам Наумова, особое внимание заслуживают молодые таланты, которые уже проявляют себя на высоком уровне. Полузащитник «Локомотива» Алексей Батраков показал впечатляющие результаты в первой части сезона с двузначным количеством забитых мячей. Аналогичные успехи демонстрируют игроки ЦСКА — Матвей Кисляк и Кирилл Глебов, которых Наумов назвал примерами успешного развития молодежи в отечественном футболе.</p>
<p>Текущая турнирная ситуация в РПЛ также остается напряженной, с тремя грандами — «Краснодаром» (40 очков), «Зенитом» (39 очков) и «Локомотивом» (37 очков) — разделенными всего несколькими очками на вершине таблицы.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 15, 11),
    },
    // Article 11: Суарес остаётся в Интер Майами
    {
      title: 'Суарес остаётся в «Интер Майами»: клуб закрепляет легенду на 2026 год',
      slug: 'suares-ostaetsya-v-inter-majami-2026',
      excerpt: '«Интер Майами» обезопасил своё спортивное будущее, закрепив за собой Луиса Суареса контрактом на сезон MLS 2026.',
      content: `<p>Майами — «Интер Майами» обезопасил своё спортивное будущее, закрепив за собой Луиса Суареса контрактом на сезон MLS 2026. Решение клуба продлить соглашение с уругвайским нападающим выглядит логичным завершением исторического 2025 года, когда флоридский коллектив завоевал три трофея и потряс американский футбол своими результатами.</p>
<p>За два года, проведённых на берегах Майами, Суарес трансформировал «Интер» из середняка в серьёзного конкурента мировой лиги. Его прибытие в 2024 году совпало с взлётом команды — в первый же сезон нападающий забил 25 голов, помогая клубу установить рекорд MLS по количеству очков и завоевать первый в истории «Supporters' Shield».</p>
<p>Нынешний сезон показал, что 38-летний форвард остаётся грозной силой. Суарес сыграл во всех 50 матчах клуба, забив 17 голов и отдав столько же передач. Статистика подтверждает его ценность: 42 гола и 30 передач в 87 матчах — это второй результат в истории франшизы.</p>
<p>Новый сезон будет особенным — «Интер Майами» переедет на новый стадион Miami Freedom Park, где Суарес получит шанс оставить свой след в новой главе истории клуба.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      publishDate: specificDate(12, 18, 13),
    },
    // Article 12: Орлов об Аленичеве
    {
      title: 'Геннадий Орлов: Аленичеву надо дать второй шанс в «Спартаке»',
      slug: 'orlov-alenichev-vtoroj-shans-v-spartake',
      excerpt: 'Известный спортивный комментатор Геннадий Орлов поделился мнением о том, как поступить «Спартаку» с выбором нового главного тренера.',
      content: `<p>Известный спортивный комментатор Геннадий Орлов в разговоре с «РБ Спорт» поделился мнением о том, как поступить «Спартаку» с выбором нового главного тренера.</p>
<h3>Критика Станковича и Романова</h3>
<p>Орлов высказал критику в адрес текущей ситуации с руководством команды. По его словам, Романов «просто исполнил обязанности» и является неопытным тренером. Что касается Станковича, комментатор полагает, что тот «не очень хотел» работать в клубе. «Но так нельзя было делать, как он себя повел. И он сам это почувствовал, что ему надо уходить», — отметил Орлов.</p>
<h3>Предложение вернуть Аленичева</h3>
<p>В качестве решения Орлов предложил вспомнить о Сергее Аленичеве, несмотря на его неудачный опыт в клубе. По мнению комментатора, Аленичев был несправедливо уволен, хотя именно он собрал команду, которая позже под руководством Каррера выиграла чемпионат.</p>
<p>Геннадий Орлов указал на серьёзные достижения Аленичева: выигрыш Лиги чемпионов и Кубка УЕФА под руководством Жозе Моуриньо, высокий авторитет в международном футболе, статус легенды для болельщиков «Спартака».</p>
<p>По итогам 18 туров чемпионата «Спартак» занимает шестое место с 29 очками.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 18, 10),
    },
    // Article 13: Хайбулаев дисквалифицирован
    {
      title: 'Чемпион PFL Мовлид Хайбулаев дисквалифицирован за допинг',
      slug: 'chempion-pfl-hajbulaev-diskvalificirovan-za-doping',
      excerpt: 'Российский боец лишен титула и запрещен в спорте на год после положительного допинг-теста.',
      content: `<p>35-летний чемпион Professional Fighting League в полулегком весе Мовлид Хайбулаев получил годовую дисквалификацию после положительного допинг-теста. Согласно информации от Антидопингового агентства США (USADA), в его пробе обнаружен рекомбинантный эритропоэтин (rEPO) — запрещенное вещество, повышающее спортивные результаты.</p>
<p>Проба была сдана во время финала Гран-при PFL 1 августа текущего года. На основании этого результата организация лишила Хайбулаева титула чемпиона. Дисквалификация началась с даты взятия пробы и продлится до 1 августа 2026 года.</p>
<p>PFL издала официальное заявление, подтверждающее приверженность «нулевой терпимости» к допингу и приоритет честной конкуренции и безопасности спортсменов. Это решение поставило точку в карьере Хайбулаева, который незадолго до этого заявил о своем доминировании после победы над тремя чемпионами в финале Гран-при.</p>`,
      categorySlug: 'mma',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 18, 15),
    },
    // Article 14: Орловский получил контракт BKFC
    {
      title: 'Орловский получил боевой контракт BKFC',
      slug: 'orlovskij-poluchil-boevoj-kontrakt-bkfc',
      excerpt: 'Андрей Орловский, 46-летний российский экс-боец UFC, получил контракт на бой в Bare Knuckle FC за титул чемпиона в тяжелом весе.',
      content: `<p>Андрей Орловский, 46-летний российский экс-боец UFC, получил контракт на бой в Bare Knuckle FC за титул чемпиона в тяжелом весе. Его соперником на турнире Knucklemania выступит американец Бен Ротвелл, также известный по своему периоду в UFC. Турнир запланирован на 8 февраля.</p>
<p>Это событие становится еще одной вехой в боевой карьере Орловского. Напомним, что в ноябре текущего года российский боец дебютировал в боксе, выступив в промоушене Misfits Boxing в Нэшвилле.</p>`,
      categorySlug: 'mma',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 17, 14),
    },
    // Article 15: Пакьяо 47-летие
    {
      title: 'Мэнни «Пакман» Пакьяо отметил 47-летие',
      slug: 'menni-pakman-pakyao-otmetil-47-letie',
      excerpt: 'Легендарный филиппинский боксёр по-прежнему остаётся одной из ключевых фигур мирового бокса и рекордсменом по числу завоёванных титулов в разных весах.',
      content: `<p>Мэнни «Пакман» Пакьяо 17 декабря отметил 47-летие, по-прежнему оставаясь одной из ключевых фигур мирового бокса и рекордсменом по числу завоёванных титулов в разных весах. Его день рождения в Генерал-Сантос прошёл в семейной обстановке: близкие, друзья и коллеги по цеху адресовали ему поздравления и публиковали архивные кадры из самых ярких боёв.</p>
<h3>Кратко о пути</h3>
<p>Пакьяо родился 17 декабря 1978 года и прошёл путь от юниора в малых залах до статуса одного из самых результативных профессионалов в истории. На его счету 62 победы при 8 поражениях и 2 ничьих, а главное — уникальное достижение: 12 крупных поясов в восьми весовых категориях от наилегчайшего до первого среднего.</p>
<h3>Роль в боксе сейчас</h3>
<p>Даже после пиковой части карьеры Пакьяо остаётся активным участником боксерской сцены. В 2025 году он принял должность вице-президента Международной боксерской ассоциации (IBA), где занимается развитием любительского и профессионального бокса.</p>
<h3>Почему о нём вспоминают</h3>
<p>Сегодня Пакьяо — живой ориентир для боксёров из Азии и всего мира: пример того, как дисциплина и готовность рисковать категориями и соперниками могут переписать историю спорта. Его рекорды восьми дивизионов и миллиарды, собранные в PPV-продажах, сделали его одним из самых узнаваемых бойцов XXI века.</p>`,
      categorySlug: 'boks',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 17, 12),
    },
    // Article 16: Финал ЧМ-2030 на Сантьяго Бернабеу
    {
      title: 'Финал ЧМ-2030, скорее всего, пройдёт на «Сантьяго Бернабеу»',
      slug: 'final-chm-2030-na-santyago-bernabeu',
      excerpt: 'Финал чемпионата мира по футболу 2030 года с высокой вероятностью примет стадион «Сантьяго Бернабеу» в Мадриде.',
      content: `<p>Финал чемпионата мира по футболу 2030 года с высокой вероятностью примет стадион «Сантьяго Бернабеу» в Мадриде. Об этом сообщает издание AS, ссылаясь на собственные источники. Главная арена мадридского «Реала» рассматривается как приоритетный вариант для проведения решающего матча турнира, который состоится 21 июля 2030 года.</p>
<p>Ключевым фактором в пользу мадридского стадиона стали не только его статус и масштабная реконструкция, превратившая арену в мультифункциональный комплекс, но и тесные рабочие отношения между президентом ФИФА Джанни Инфантино и президентом «Реала» Флорентино Пересом. Испания в целом позиционируется как «опорная» страна совместной заявки (включающей также Португалию и Марокко), а Мадрид — как естественный центр для кульминации турнира.</p>
<p>Конкуренцию Мадриду всё ещё составляют другие площадки. Марокко активно лоббирует проведение финала в Касабланке, где строится новый гигантский стадион. Португалия предлагает арену «Эштадиу да Луш» («Бенфики»), но эксперты полагают, что она вряд ли получит именно финал.</p>
<p>Официальное решение и окончательный список городов-организаторов ФИФА планирует утвердить не ранее конца 2026 года.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 17, 16),
    },
    // Article 17: Кирьяков о «Динамо» и «Спартаке»
    {
      title: 'Кирьяков о «Динамо» и «Спартаке»: «Другие клубы соблюдают традиции, а они всё время смотрят на Запад»',
      slug: 'kiryakov-o-dinamo-i-spartake-smotryat-na-zapad',
      excerpt: 'Бывший нападающий «Динамо» и сборной России Сергей Кирьяков резко высказался о кадровой политике бело-голубых.',
      content: `<p>Бывший нападающий «Динамо» и сборной России Сергей Кирьяков резко высказался о кадровой политике бело-голубых на фоне возможного продления контракта со спортивным директором Желько Бувачем. По его словам, за пять лет работы боснийца действительно удачным для клуба можно назвать лишь один сезон, когда «всё было в руках „Динамо", чтобы стать чемпионом».</p>
<p>Кирьяков отметил, что клуб уже много лет принимает «неоднозначные решения», а сама фигура Бувача остаётся в тени. «Что происходит в клубе — это никто не понимает. Выносят те или иные решения, но они не объясняются. На определённые посты приглашаются люди, которые не имеют никакого отношения к „Динамо"», — заявил он.</p>
<p>В качестве противопоставления он привёл примеры «Зенита» и ЦСКА, где, по его словам, стараются соблюдать традиции и не допускают случайных людей в структуру. «„Спартак" — такой же, как и „Динамо". Смотрят на Запад, кого-то оттуда всё время приглашают. Таков наш футбол», — добавил Кирьяков.</p>
<p>Бувач работает в московском клубе с 2020 года, ранее входил в тренерский штаб Юргена Клоппа в «Майнце» и дортмундской «Боруссии». После 18 туров РПЛ «Динамо» идёт на десятом месте с 21 очком.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 22, 12),
    },
    // Article 18: Сафонов написал историю
    {
      title: 'Русский вратарь Сафонов написал историю: как провинциальный голкипер покорил мир пенальти',
      slug: 'safonov-napisal-istoriyu-4-penalti',
      excerpt: 'Матвей Сафонов пережил ночь, которую будет помнить всю жизнь. В финале Межконтинентального кубка ФИФА русский голкипер отразил четыре пенальти подряд.',
      content: `<p>Матвей Сафонов пережил ночь, которую будет помнить всю жизнь. В финале Межконтинентального кубка ФИФА русский голкипер «ПСЖ» совершил невероятное — отразил четыре пенальти подряд, став первым вратарём в истории турнира, кому это удалось.</p>
<p>Серия пенальти началась, когда казалось, что «Фламенго» утащит трофей. Бразильцы верили в свою звёзду, в силу момента, в удачу. Но вот на линию выходит Сафонов — молодой парень из провинции, который всего за пару матчей преодолел путь от просто талантливого юноши до звёзды европейского футбола.</p>
<p>Луис Энрике, великий тренер, который видел множество чудес футбола, после матча признался: «Впервые вижу вратаря, который отбивает четыре пенальти подряд». Слова легендарного испанца звучали как приговор — в лучшем смысле этого слова. Это было признание.</p>
<p>Сафонов получил награду лучшего игрока финала. «ПСЖ» завоевал шестой трофей в году, но главная награда досталась русскому парню, который своей решимостью и профессионализмом напомнил миру, что в футболе чудеса случаются.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 18, 23),
      featuredImage: '/uploads/image1-2.jpeg',
    },
    // Article 19: Аршавин — Сафонову
    {
      title: 'Аршавин — Сафонову: покоряй Европу и учи их русскому',
      slug: 'arshavin-safonovu-pokoryaj-evropu',
      excerpt: 'Андрей Аршавин эмоционально поздравил Матвея Сафонова с его историческим матчем и пожелал ему продолжать покорять Европу.',
      content: `<p>Андрей Аршавин эмоционально поздравил Матвея Сафонова с его историческим матчем и пожелал ему продолжать покорять Европу, не забывая при этом «учить их русскому». Такое обращение появилось после того, как российский голкипер «ПСЖ» стал главным героем финала Межконтинентального кубка ФИФА против «Фламенго».</p>
<p>Поводом для обращения стал исторический перформанс Сафонова в серии пенальти, где он парировал четыре удара подряд и принёс «ПСЖ» трофей в матче, завершившемся 1:1 в основное время и 2:1 по пенальти. Россиянин стал первым вратарём на турнирах под эгидой ФИФА, кому удалось отразить четыре одиннадцатиметровых подряд, за что был признан лучшим игроком финала.</p>
<p>Напомним, что ещё недавно Сафонов играл за «Краснодар», а летом 2024 года совершил рекордный для российского голкипера переход в «ПСЖ» за 20 млн евро. В Париже он постепенно завоёвывал доверие тренерского штаба и к моменту финала уже успел провести несколько сухих матчей, подведя черту впечатляющим международным выступлением.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 18, 20),
      featuredImage: '/uploads/image1-3.jpeg',
    },
    // Article 20: Лукас Вера усилит Локомотив
    {
      title: 'Лукас Вера усилит «Локомотив» до 2028 года',
      slug: 'lukas-vera-usilit-lokomotiv-do-2028',
      excerpt: 'Московский «Локомотив» объявил о переходе 28-летнего аргентинского полузащитника Лукаса Веры.',
      content: `<p>Московский «Локомотив» объявил о переходе 28-летнего аргентинского полузащитника Лукаса Веры, который присоединился к клубу в статусе свободного агента. Контракт с футболистом рассчитан до конца сезона 2027/28, ранее он уже выступал в России за «Оренбург» и «Химки».</p>
<p>В «Локомотиве» рассчитывают, что аргентинец усилит конкуренцию в средней линии и привнесёт в игру команды агрессию и интеллект на мяче, а болельщики уже поприветствовали новичка тёплыми откликами в клубных медиа-ресурсах.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 20, 14),
      featuredImage: '/uploads/image1-4.jpeg',
    },
    // Article 21: Астон Вилла разгромила Манчестер Юнайтед
    {
      title: 'Астон Вилла разгромила Манчестер Юнайтед и остаётся скромной в амбициях',
      slug: 'aston-villa-razgromila-manchester-yunajted',
      excerpt: 'Астон Вилла одержала важную победу над Манчестер Юнайтед со счётом 2:1, однако тренер Унай Эмери остался верен своей философии умеренности.',
      content: `<p>Астон Вилла одержала важную победу над Манчестер Юнайтед со счётом 2:1, однако тренер Унай Эмери остался верен своей философии умеренности, отказавшись называть команду претендентом на титул.</p>
<h3>Матч и результат</h3>
<p>Встреча, прошедшая в эмоциональной атмосфере, принесла Виллам ценные три очка. Команда продемонстрировала улучшение игры во втором тайме, изменив свой подход и отказавшись от оборонительной тактики с передачами назад.</p>
<h3>Позиция Эмери: реализм вместо эйфории</h3>
<p>Испанский наставник в интервью Sky Sports чётко обозначил реальные амбиции своей команды: «Мы не претенденты на титул. Мы здесь, потому что конкурируем на фантастическом уровне. Игроки действительно сосредоточены на каждом матче, следуя нашему плану и сохраняя консистентность. Но быть претендентом — это не наша реальность».</p>
<p>Эмери подчеркнул, что, несмотря на периодические победы над лидерами вроде Арсенала и Манчестер Сити, эти команды обладают массивным тактическим преимуществом и имеют игроков, находящихся на другом уровне.</p>
<h3>Ключевые цифры</h3>
<p>Счёт: Астон Вилла 2:1 Манчестер Юнайтед</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['match-report'],
      publishDate: specificDate(12, 21, 22),
    },
    // Article 22: Ташуев о Дзюбе
    {
      title: 'Ташуев о Дзюбе: «В сборную вызывают не для рекордов, а для конкурентоспособности»',
      slug: 'tashuev-o-dzyube-v-sbornuyu-ne-dlya-rekordov',
      excerpt: 'Бывший главный тренер «Краснодара» Сергей Ташуев заявил, что возможный вызов Артёма Дзюбы в сборную не должен рассматриваться ради рекордов.',
      content: `<p>Бывший главный тренер «Краснодара» Сергей Ташуев заявил, что возможный вызов Артёма Дзюбы в сборную России не должен рассматриваться ради рекордов и красивых историй. По его словам, национальная команда должна формироваться из сильнейших футболистов текущего момента.</p>
<p>«Я считаю, что в сборную страны нужно вызывать самых сильных футболистов на данный момент. Не для рекордов и не для красивых историй, а для того, чтобы команда была максимально конкурентоспособной», — подчеркнул специалист. При этом он отказался напрямую сравнивать Дзюбу и Александра Кержакова, отметив, что «каждый играл в своё время» и оба являются хорошими нападающими.</p>
<p>Поводом для дискуссии стало решение ФИФА засчитать гол в матче Германии и России 2005 года на счёт Кержакова, а не Аршавина, из-за чего Дзюба может лишиться статуса единоличного рекордсмена сборной. В случае подтверждения этого РФС у Дзюбы и Кержакова будет по 31 мячу за национальную команду.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 21, 15),
    },
    // Article 23: Аморим о трансферном рынке
    {
      title: 'Аморим: «Манчестер Юнайтед» не станет паниковать на зимнем трансферном рынке',
      slug: 'amorim-manchester-yunajted-ne-stanet-panikovat',
      excerpt: 'Главный тренер «Манчестер Юнайтед» Рубен Аморим заявил, что клуб не собирается хаотично усиливаться в январское трансферное окно.',
      content: `<p>Главный тренер «Манчестер Юнайтед» Рубен Аморим заявил, что клуб не собирается хаотично усиливаться в январское трансферное окно, несмотря на растущие кадровые проблемы. Его слова прозвучали после поражения от «Астон Виллы» (1:2), в ходе которого травму мягких тканей получил капитан команды Бруну Фернандеш и был заменён в перерыве.</p>
<p>Аморим подтвердил, что Фернандеш пропустит «какое-то количество матчей», а полузащитник Кобби Мэйну также выбыл из строя из-за повреждения и не сыграет в Boxing Day против «Ньюкасла». «Что мы точно не можем сделать — дойти до января и в спешке пытаться сделать всё сразу и наделать ошибок. Тогда снова начнётся: „мы опять всё сделали неправильно"», — подчеркнул тренер.</p>
<p>Португальский специалист добавил, что в нынешней ситуации команда, возможно, вынуждена будет «пострадать», но интересы клуба должны стоять выше сиюминутных решений. «Конечно, нам нужны очки. Сейчас чувствуется, что нам предстоит страдать, но клуб — на первом месте», — резюмировал Аморим.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      publishDate: specificDate(12, 21, 23),
    },
    // Article 24: Глушаков подвёл итоги 2025 года
    {
      title: 'Глушаков подвёл итоги 2025 года в российском футболе',
      slug: 'glushakov-podvel-itogi-2025-goda',
      excerpt: 'Экс-полузащитник сборной России Денис Глушаков подвёл итоги 2025 года в футболе в формате блиц-интервью.',
      content: `<p>Экс-полузащитник сборной России Денис Глушаков подвёл итоги 2025 года в футболе в формате блиц-интервью, отвечая на вопросы супруги.</p>
<h3>Главные ассоциации года</h3>
<p>По словам Глушакова, главной личной вехой 2025 года стало завершение его профессиональной карьеры, решение о котором он принял заранее и описал как момент, когда «ёкнуло». Среди событий в российском футболе он выделил первое чемпионство «Краснодара» в РПЛ.</p>
<h3>Лидеры и недооценённые игроки</h3>
<p>Отвечая на вопрос о лучшем игроке РПЛ на своей позиции, Глушаков выделил Батракова, отметив его универсальность в центре поля и вклад в результаты команды. В числе самых недооценённых футболистов 2025 года он назвал Пруцева и Руденко.</p>
<h3>Разочарование года</h3>
<p>В качестве главного разочарования сезона Глушаков назвал «Спартак», пояснив, что клуб с таким составом и амбициями обязан бороться за чемпионство, но по-прежнему не показывает должного результата. Он признался, что к «Спартаку» у него по-прежнему «лежит душа», поэтому отсутствие борьбы за вершину турнирной таблицы воспринимает особенно болезненно.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 21, 18),
    },
    // Article 25: Точилин о лучших тренерах РПЛ
    {
      title: 'Точилин назвал тройку лучших тренеров РПЛ-2025: Мусаев, Талалаев и Семак',
      slug: 'tochilin-trojka-luchshih-trenerov-rpl-2025',
      excerpt: 'Бывший главный тренер «Сочи» Александр Точилин выделил тройку лучших тренеров сезона-2025 в РПЛ.',
      content: `<p>Бывший главный тренер «Сочи» Александр Точилин выделил тройку лучших тренеров сезона-2025 в Российской Премьер-лиге, поставив на первое место наставника «Краснодара» Мурада Мусаева, а также включив в список Андрея Талалаева («Балтика») и Сергея Семака («Зенит»).</p>
<p>Отвечая на вопрос о прогрессе тренеров, Точилин особо отметил Талалаева: по его словам, именно он прибавил больше остальных, поскольку «для Андрея Викторовича „Балтика" — это такой большой шаг вперед», тогда как Мусаев и Семак уже давно заявили о себе на этом уровне.</p>
<p>При этом Фабио Челестини в тройку не попал: Точилин считает, что по первому сезону рано судить о влиянии швейцарца на ЦСКА. Говоря о тех, у кого сезон складывается неудачно, специалист назвал Валерия Карпина, Игоря Осинькина и Вадима Шпилевского.</p>
<p>После 18 туров РПЛ лидирует «Краснодар» Мусаева (40 очков), далее идут «Зенит» (39) и «Локомотив» (37).</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 21, 11),
    },
    // Article 26: Батраков о Лиге чемпионов
    {
      title: 'Батраков: мурашки по коже от гимна Лиги чемпионов и откровения о переводе в Европу',
      slug: 'batrakov-murashki-ot-gimna-ligi-chempionov',
      excerpt: 'Лучший футболист России 2025 года откровенно рассказал о мечтах, давлении СМИ и готовности покинуть Локомотив.',
      content: `<p>Алексей Батраков, признанный лучшим футболистом России в 2025 году по опросу Sport-Express, дал развёрнутое интервью о своих амбициях, жизненной философии и возможном переводе в европейские клубы.</p>
<h3>Награда как подтверждение, а не цель</h3>
<p>Батраков относится к личным наградам философски. «Приятно! Это показатель того, что я делаю что-то правильно. Нужно двигаться только вперед, чтобы выиграть что-то еще», — сказал полузащитник. При этом 23-летний игрок сознательно старается не зацикливаться на индивидуальных достижениях.</p>
<h3>Мечта о Лиге чемпионов: мурашки и реальность</h3>
<p>Для Батракова Лига чемпионов остаётся главной мечтой. «Когда слышу гимн Лиги чемпионов, идут мурашки по коже. А если еще стоять на поле в этот момент... Совершенно другая история», — признался полузащитник.</p>
<h3>Европа: не спешу, но готов</h3>
<p>Вопрос о возможном переводе в европейские клубы остаётся самым острым в карьере Батракова. Его имя уже связывают с «Барселоной», «Реалом», ПСЖ, «Интером». Батраков явно устал от постоянных спекуляций: «Я просто стараюсь не забивать этим голову. Говорят о „ПСЖ", „Монако", „Интере" или „Барселоне", а на самом деле до этого еще далеко».</p>
<h3>Главное событие 2025: хет-трик против «Спартака»</h3>
<p>Самым ярким моментом года для Батракова стала победа над «Спартаком» 4:2, в которой он забил хет-трик. «О хет-трике в ворота красно-белых я мог только мечтать. Это произошло и вспоминать приятно», — заявил полузащитник.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 22, 10),
    },
    // Article 27: Комбаров о русской молодёжи
    {
      title: 'Комбаров: «Когда нет еврокубков — время воспитывать русскую молодежь и давать шанс российским тренерам»',
      slug: 'kombarov-vremya-vospityvat-russkuyu-molodezh',
      excerpt: 'Бывший защитник «Спартака» и сборной России Дмитрий Комбаров считает, что московскому клубу пора доверить команду российскому специалисту.',
      content: `<p>Бывший защитник «Спартака» и сборной России Дмитрий Комбаров считает, что московскому клубу пора доверить команду российскому специалисту. По его мнению, текущая ситуация без участия в еврокубках идеальна для курса на развитие своих тренеров и молодых игроков.</p>
<p>Комбаров отметил, что исполняющий обязанности главного тренера Вадим Романов начал работу удачно — с побед в двух дерби, но затем последовало поражение от «Балтики», которая заканчивала матч в меньшинстве, и этот результат он назвал «спорным».</p>
<p>«Конечно. В сегодняшнее время, когда нет еврокубков — время воспитывать русскую молодежь и давать шанс русским тренерам», — заявил Комбаров, отвечая на вопрос, нужно ли дать шанс специалистам из России.</p>
<p>После 18 туров «Спартак» набрал 29 очков и занимает шестое место в таблице чемпионата России.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 22, 14),
    },
    // Article 28: Гвардиола о взвешивании игроков
    {
      title: 'Гвардиола будет взвешивать игроков «Сити» после Рождества и грозит оставить «лишний вес» в Манчестере',
      slug: 'gvardiola-budet-vzveshivat-igrokov-siti',
      excerpt: 'Главный тренер «Манчестер Сити» Пеп Гвардиола предупредил игроков, что переедание на рождественских выходных может стоить им места в заявке.',
      content: `<p>Главный тренер «Манчестер Сити» Пеп Гвардиола предупредил игроков, что переедание на рождественских выходных может стоить им места в заявке на матч с «Ноттингем Форест» 27 декабря. Испанец рассказал, что футболистов взвесили в пятницу, а повторное взвешивание ждёт их в день возвращения на базу — 25 декабря.</p>
<p>«Каждый игрок взвешен. Они вернутся 25-го, и я буду контролировать, сколько килограммов прибавили. Представьте, игрок идеален сейчас, но вернётся с плюс тремя килограммами — он останется в Манчестере и не поедет в Ноттингем», — заявил Гвардиола, добавив, что подопечным можно есть, но он намерен их «контролировать».</p>
<p>После уверенной победы над «Вест Хэмом» со счётом 3:0 и выхода на второе место в АПЛ, где «Сити» отстаёт от «Арсенала» на два очка, тренер остался недоволен отдельными элементами игры команды. В результате он отменил запланированный выходной в воскресенье: «Игроки попросили выходной, я сказал: нет, вы сыграли недостаточно хорошо».</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 22, 16),
    },
    // Article 29: Король Кадзу продолжит карьеру
    {
      title: '«Король Кадзу» продолжит карьеру в 58 лет: Миура близок к переходу в клуб третьего дивизиона Японии',
      slug: 'korol-kadzu-prodolzhit-kareru-v-58-let',
      excerpt: 'Легендарный японский нападающий Кадзуёси Миура, известный как «King Kazu», в 58 лет готовится к 41-му сезону на профессиональном уровне.',
      content: `<p>Легендарный японский нападающий Кадзуёси Миура, известный как «King Kazu», в 58 лет готовится к 41-му сезону на профессиональном уровне и, по данным японских СМИ, перейдёт в клуб третьего дивизиона Fukushima United на годичную аренду. В прошлом сезоне форвард выступал за команду четвёртого уровня Atletico Suzuka, за которую провёл семь матчей.</p>
<p>Сделка пока не объявлена официально, однако последние клубы Миуры традиционно раскрывали его переходы 11 января в 11:11 — в отсылке к любимому игровому номеру ветерана. В феврале он отметит 59-летие, оставаясь одним из старейших действующих профессиональных футболистов в мире.</p>
<p>Миура начал карьеру ещё в 1986 году в бразильском «Сантосе» и за почти четыре десятилетия успел поиграть в Италии, Хорватии, Австралии и Португалии, став одной из ключевых фигур в расцвете J-League в 1990-х. За сборную Японии нападающий забил 55 голов в 89 матчах, хотя и не попал в заявку на первый для страны чемпионат мира 1998 года.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      publishDate: specificDate(12, 22, 18),
    },
    // Article 30: Газзаев может вернуться в «Динамо»
    {
      title: '71-летний Валерий Газзаев может вернуться в «Динамо» в статусе топ-менеджера',
      slug: 'gazzaev-mozhet-vernutsya-v-dinamo-topmenedzherom',
      excerpt: 'Легендарный форвард и экс-тренер «Динамо» Валерий Газзаев рассматривается кандидатом на одну из ключевых руководящих должностей в московском клубе.',
      content: `<p>Легендарный форвард и экс-тренер «Динамо» Валерий Газзаев рассматривается кандидатом на одну из ключевых руководящих должностей в московском клубе — генерального директора или председателя совета директоров. Об этом сообщает телеграм-канал «Инсайды от Карпа», отмечая, что инициативу выдвигает консультативный совет «Динамо».</p>
<p>Газзаев, которому 71 год, считается одной из главных фигур в истории бело-голубых: как игрок он выигрывал Кубок СССР и становился лучшим бомбардиром Кубка обладателей кубков 1984/85 с пятью голами, а в роли тренера привёл клуб к бронзе чемпионата России 1992. При этом возвращение, по данным инсайда, не предполагает работу главным тренером, а связано именно с управленческим блоком.</p>
<p>Источник уточняет, что в окружении Сергея Степашина информацию пока не подтвердили, сославшись на то, что в клубной структуре уже работают генеральный директор Пивоваров и председатель совета директоров Ивлев.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 22, 10),
    },
    // Article 31: Каряка может сменить Биджиева
    {
      title: 'Каряка может сменить Биджиева в махачкалинском «Динамо»',
      slug: 'karyaka-mozhet-smenit-bidzhieva-v-dinamo-mahachkala',
      excerpt: 'Главный тренер медиаклуба «СКА-Ростов» Андрей Каряка попал в шорт-лист претендентов на пост наставника «Динамо» Махачкала.',
      content: `<p>Главный тренер медиаклуба «СКА-Ростов» Андрей Каряка попал в шорт-лист претендентов на пост наставника «Динамо» Махачкала. О интересе к 47-летнему специалисту сообщил журналист Legalbet Анар Ибрагимов.</p>
<p>По его информации, Каряка рассматривается на равных с нынешним тренером «Черноморца» Вадимом Евсеевым. При этом у Каряки уже есть опыт работы в структуре дагестанского футбола: в 2015–2018 годах он был помощником Гаджи Гаджиева в «Амкаре», а сейчас Гаджиев возглавляет «Махачкалу» в статусе президента.</p>
<p>Тренерский вопрос в «Динамо» обострился после недавней отставки Хасанби Биджиева, одобренной попечительским советом клуба. Команда идёт лишь на 13-м месте в таблице чемпионата России с 15 очками, поэтому выбор нового главного тренера рассматривают как ключевой шаг в попытке выправить ситуацию во второй части сезона.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 9),
    },
    // Article 32: Станкович вернулся в «Црвену Звезду»
    {
      title: '«Осталась одна запятая». Деян Станкович официально вернулся в «Црвену Звезду»',
      slug: 'stankovich-vernulsya-v-crvenu-zvezdu',
      excerpt: 'Деян Станкович во второй раз назначен главным тренером «Црвены Звезды», вновь сменив на этом посту Владана Милоевича.',
      content: `<p>Деян Станкович во второй раз назначен главным тренером «Црвены Звезды», вновь сменив на этом посту Владана Милоевича, как и шесть лет назад.</p>
<p>На презентации он сразу обозначил личную мотивацию: «У меня осталась всего одна запятая… Рад, что у меня будет возможность стереть эту запятую, это, пожалуй, моя главная цель» — речь об автоголе Павкова и незавершённости первого цикла работы.</p>
<h3>Стиль игры и усиление состава</h3>
<p>Станкович подтвердил, что команда будет играть с четырьмя защитниками: «Эта команда создана для игры вчетвером… Четыре защитника — вот как мы будем играть».</p>
<p>Он высоко оценил текущий подбор исполнителей: «Отличный состав игроков… Одной-двух удачных попыток для этой команды к лету будет достаточно», при этом слухи о переходе Угалде и Барко из «Спартака» назвал «нереалистичными».</p>
<h3>Лидеры и результаты</h3>
<p>Новый тренер выделил дуэт Иванич — Катай: «28 голов на двоих — вау. Это серьёзные цифры, надеюсь, они и дальше будут солдатами „Црвены Звезды"».</p>
<h3>Давление, «Спартак» и опыт в России</h3>
<p>Сравнивая «Звезду» и московский «Спартак», Станкович подчеркнул, что уровень эмоций в Белграде особенный: «„Спартак" — огромный клуб… но дома всё по-другому, я не могу сравнивать эти эмоции и любовь».</p>
<p>О российском этапе он сказал: «Со мной многое произошло. Я становлюсь опытнее, лучше подготовленнее и спокойнее… Иногда нужно что-то менять», признав, что раньше слишком остро реагировал на судейство и несправедливость.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 22, 14),
    },
    // Article 33: «Ростов» может не доиграть сезон
    {
      title: '«Ростов» может не доиграть сезон: долги до ₽5 млрд и неоплаченные сборы',
      slug: 'rostov-mozhet-ne-doigrat-sezon-dolgi-5-mlrd',
      excerpt: 'Финансовое положение «Ростова» стремительно ухудшилось: по разным оценкам, совокупный долг клуба достиг уже от 4 до 5 млрд рублей.',
      content: `<p>Финансовое положение «Ростова» стремительно ухудшилось: по разным оценкам, совокупный долг клуба достиг уже от 4 до 5 млрд рублей, при этом зимние сборы на данный момент не оплачены, а задержки по зарплате тянутся с сентября–октября и различаются по срокам у разных игроков. Государственное финансирование в объёме 700 млн рублей в год пока не подтверждено, что делает перспективы окончания текущего чемпионата туманными.</p>
<p>Проблемы выходят за рамки одного клуба: в проекте областного бюджета на 2026 год расходы на спорт фактически отсутствуют, из-за чего под угрозой участие в турнирах баскетбольных «Платова» и «Ростов-ЮФУ», которым, по оценкам, хватило бы порядка 60 млн рублей на сезон.</p>
<p>Даже если «Ростов» чудом доиграет чемпионат и сохранит прописку в РПЛ, клуб почти наверняка столкнётся с проблемами при лицензировании на следующий сезон: при заявленном бюджете порядка 2,7 млрд рублей даже потенциальные 0,7 млрд из областного бюджета не перекроют дыру, а оставшиеся 2 млрд взять банально неоткуда.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 22, 16),
    },
    // Article 34: Гендиректор «Ростова» о разблокировке счетов
    {
      title: 'Гендиректор «Ростова»: счета клуба разблокируют до конца года',
      slug: 'gendirektor-rostova-scheta-razblokiruyut-do-konca-goda',
      excerpt: 'Генеральный директор «Ростова» Игорь Гончаров заявил, что в ближайшие дни ограничения на операции по банковским счетам клуба будут сняты.',
      content: `<p>Генеральный директор «Ростова» Игорь Гончаров заявил, что в ближайшие дни ограничения на операции по банковским счетам клуба будут сняты. По его словам, с налоговой инспекцией удалось выйти на общий знаменатель, и задолженность будет погашена до конца года.</p>
<p>22 декабря ФНС приостановила операции по 11 счетам «Ростова» из-за долгов по налогам, сборам, пеням и штрафам; в августовских данных службы фигурировала просрочка по пеням около 2,8 млн рублей. «Есть задолженность по налогам и сборам… В ближайшее время долг погасим», — подчеркнул Гончаров, комментируя ситуацию.</p>
<p>Несмотря на финансовые трудности, команда Джонатана Альбы завершила первую часть сезона на 11-м месте в чемпионате России, набрав 21 очко после 18 туров. В прошлом сезоне «Ростов» стал серебряным призёром Кубка России, и руководство надеется стабилизировать финансовый блок, не допустив влияния проблем со счетами на спортивные результаты.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 11),
    },
    // Article 35: Роднина о водке на стадионах
    {
      title: 'Роднина о водке на стадионах: «Значит, футбол уже не умеет сам привлекать людей»',
      slug: 'rodnina-o-vodke-na-stadionah',
      excerpt: 'Трёхкратная олимпийская чемпионка Ирина Роднина раскритиковала обсуждение идеи продаж водки на футбольных аренах.',
      content: `<p>Трёхкратная олимпийская чемпионка Ирина Роднина раскритиковала обсуждение идеи продаж водки на футбольных аренах, связав это с кризисом интереса к игре как к зрелищному продукту. По её словам, переход дискуссии от пива к крепкому алкоголю показывает тревожную тенденцию в российском футболе.</p>
<p>Роднина считает, что появление водки в буфетах стадионов стало бы символом деградации отрасли: это означало бы, что матч сам по себе уже не способен привлечь болельщика на трибуны без дополнительного «алкогольного» фактора. Она напомнила, что продажа пива на спортивных и концертных площадках в России запрещена с 2005 года, после ужесточения ограничений на рекламу напитка.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 22, 19),
    },
    // Article 36: Гусев назначен главным тренером «Динамо»
    {
      title: 'Официально: Ролан Гусев назначен главным тренером «Динамо» до конца сезона',
      slug: 'gusev-naznachen-glavnym-trenerom-dinamo',
      excerpt: 'Московское «Динамо» утвердило Ролана Гусева главным тренером команды с контрактом до окончания текущего сезона.',
      content: `<p>Московское «Динамо» утвердило Ролана Гусева главным тренером команды с контрактом до окончания текущего сезона. До этого он несколько раз исполнял обязанности наставника бело-голубых, включая концовку прошлого чемпионата и период с ноября нынешнего года.</p>
<p>Гусев является воспитанником «Динамо», заслуженным мастером спорта России и обладателем Кубка УЕФА, а первые шаги в тренерской карьере делал в системе ЦСКА — с молодёжной командой, академией и юношескими сборными России, где выиграл Молодёжную футбольную лигу. В штаб «Динамо» он вошёл летом 2023 года и с тех пор последовательно поднимался в структуре клуба, что логично завершилось назначением на пост главного тренера.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 12),
    },
    // Article 37: Баранник о обмене Дивеева на Гонду
    {
      title: 'Баранник о возможном обмене Дивеева на Гонду: «Не могу представить такой неравноценный обмен»',
      slug: 'barannik-o-obmene-diveeva-na-gondu',
      excerpt: 'Бывший полузащитник «Зенита» Дмитрий Баранник раскритиковал возможный обмен нападающего Лусиано Гонды в ЦСКА на защитника Игоря Дивеева.',
      content: `<p>Бывший полузащитник «Зенита» Дмитрий Баранник раскритиковал возможный обмен нападающего Лусиано Гонды в ЦСКА на защитника Игоря Дивеева, о котором сообщают источники. По его словам, подобная сделка изначально выглядит неравнозначной для петербургского клуба.</p>
<p>«Я вообще не могу представить себе такой обмен — он для меня явно неравноценный», — заявил Баранник. Он напомнил, что в период, когда Гонда был в форме и регулярно играл, «по его взгляду, был одним из лучших нападающих „Зенита"», и признался, что не понимает, почему аргентинец перестал попадать в состав.</p>
<p>По мнению экс-игрока, менять нападающего на центрального защитника в текущих условиях для «Зенита» в принципе неверно: «Дивеев не из тех футболистов, кто выручит „Зенит"», — подчеркнул он. Ранее сообщалось, что потенциальная сделка оценена сторонами примерно на 90% готовности: петербуржцы, помимо Гонды, готовы заплатить за Дивеева от трёх до пяти миллионов евро.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 14),
    },
    // Article 38: Источник из «Ростова» смягчил картину
    {
      title: 'Источник из «Ростова» смягчил картину: «Не 5, а до 2 млрд долга»',
      slug: 'istochnik-iz-rostova-smyagchil-kartinu',
      excerpt: 'После сообщений о долге «Ростова» до ₽5 млрд один из представителей клуба озвучил другую версию происходящего.',
      content: `<p>После сообщений о долге «Ростова» до ₽5 млрд и риске не доиграть сезон в РПЛ один из представителей клуба связался с автором инсайда и озвучил «ростовскую» версию происходящего. По его словам, обязательства клуба не превышают 2 млрд рублей, из которых около 600–700 млн составляют кассовый разрыв, а остальная часть может обслуживаться «долго».</p>
<p>Собеседник также заявил, что зимние сборы команды уже оплачены примерно на 50%, а контракт с техническим спонсором «Альбой» подписан, несмотря на ранее звучавшие сомнения. Отдельно подчёркнуто, что зарплата футболистам основной обоймы закрыта по октябрь, что, по версии клуба, не позволяет говорить о критической просрочке по всем ведомостям.</p>
<p>Автор канала отмечает, что считает важным представить и такой взгляд на состояние дел в главном клубе Юга России, на фоне более жёстких оценок о долговой нагрузке и неясных перспективах финансирования спорта в регионе в проекте бюджета 2026.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 16),
    },
    // Article 39: Тебас о напряжении в Ла Лиге
    {
      title: 'Тебас: «Напряжение в Ла Лиге исходит не от „Барсы", а от „Реала"»',
      slug: 'tebas-napryazhenie-v-la-lige-ot-reala',
      excerpt: 'Президент Ла Лиги Хавьер Тебас заявил, что нынешнюю «напряжённость» в испанском футболе формирует не «Барселона», а «Реал Мадрид».',
      content: `<p>Президент Ла Лиги Хавьер Тебас в интервью изданию Sport заявил, что нынешнюю «напряжённость» в испанском футболе, по его мнению, формирует не «Барселона», а «Реал Мадрид» и медиа-ресурсы клуба. «„Барса" не создаёт напряжение, это „Мадрид" со своими заявлениями и своим президентом против всех», — сказал функционер, комментируя информационную повестку вокруг судейства и скандалов последних лет.</p>
<p>Тебас вновь раскритиковал позицию Флорентино Переса, отметив, что мадридский клуб, по его мнению, строит «нарратив всемирной конспирации против „Реала"». Глава Ла Лиги подчёркнул, что регулярно слышит из Мадрида обвинения в адрес арбитров и организаций, тогда как сам считает ситуацию следствием обычных ошибок и недочётов системы, а не целенаправленного заговора.</p>
<p>Высказывания Тебаса вызвали очередной виток полемики между сторонниками двух грандов испанского футбола, для которых медиа-война стала неотъемлемой частью противостояния на фоне судейских споров, дела Негрейры и обсуждения реформ европейских турниров.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 23, 18),
    },
    // Article 40: Аршавин об обмене Дивеева на Лусиано
    {
      title: 'Аршавин: от обмена Дивеева на Лусиано выиграют и ЦСКА, и «Зенит»',
      slug: 'arshavin-obmen-diveeva-na-lusiano-vyigrayut-obe-komandy',
      excerpt: 'Зампред правления «Зенита» Андрей Аршавин считает, что потенциальный обмен может пойти на пользу обеим командам.',
      content: `<p>Зампред правления «Зенита» по спортивному развитию Андрей Аршавин считает, что потенциальный обмен защитника ЦСКА Игоря Дивеева на нападающего петербуржцев Лусиано Гонду может пойти на пользу обеим командам. По его словам, армейцы в таком сценарии получают нужного форварда, а «Зенит» усиливает центр обороны игроком с большим опытом в РПЛ.</p>
<p>Аршавин назвал Лусиано «сильным и очень мастеровитым футболистом», отметив, что ему «немного не хватает скорости», но в остальном он способен укрепить атаку ЦСКА. 24-летний аргентинец забил 13 мячей в 51 матче за «Зенит», тогда как 26-летний Дивеев провёл за ЦСКА более 200 игр и отличился 20 голами, что делает возможный обмен одним из самых обсуждаемых трансферных ходов зимы в РПЛ.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 24, 10),
    },
    // Article 41: Радимов о Станковиче в «Спартаке»
    {
      title: 'Радимов: «Станкович так и не смог организовать „Спартак" — от хорошего стали искать лучшего»',
      slug: 'radimov-stankovich-ne-smog-organizovat-spartak',
      excerpt: 'Владислав Радимов раскритиковал работу Деяна Станковича в «Спартаке» по итогам первой части сезона.',
      content: `<p>Владислав Радимов раскритиковал работу Деяна Станковича в «Спартаке» по итогам первой части сезона, отметив, что сербский специалист не сумел разобраться с составом и превратить дорогие трансферы в цельную игру. По его словам, команда показала отличную осень в прошлом сезоне, но затем тренер «начал шарахаться», а клуб от «хорошего начал искать лучшего».</p>
<p>Радимов заявил, что при таких исполнителях, как Барко и Жедсон, красно-белые обязаны демонстрировать более яркий футбол: «Такой связки нет ни у одной другой команды, с такими футболистами ты должен легко вскрывать обороны соперников ниже классом, а они еле-еле забивали по одному мячу». Он назвал происходящее «катастрофой», учитывая суммы, потраченные на новичков.</p>
<p>Отдельно Радимов раскритиковал управленческие решения «Спартака»: продление контракта со Станковичем после четвёртого места и вылета из Кубка, а также предыдущий эксперимент с Гильермо Абаскалем. Он считает, что подобными решениями руководство «четыре года из истории „Спартака" выкинуло просто своим управлением».</p>
<p>После первой части сезона у «Спартака» 29 очков и шестое место в таблице РПЛ.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 20),
    },
    // Article 42: Степашин о Гусеве и Газзаеве
    {
      title: 'Степашин: «Гусеву будет помогать Газзаев. Кубок — одна из главных задач „Динамо"»',
      slug: 'stepashin-gusevu-budet-pomogat-gazzaev',
      excerpt: 'Сергей Степашин подтвердил, что Ролан Гусев утверждён главным тренером «Динамо», а помогать ему будет Валерий Газзаев.',
      content: `<p>Сергей Степашин подтвердил, что Ролан Гусев утверждён главным тренером «Динамо» до конца сезона, а ключевая цель — завоевание Кубка России и подъём в таблице РПЛ.</p>
<p>По словам Степашина, есть договорённость, что Валерий Газзаев, при котором Гусев «играл очень здорово», будет помогать новому наставнику: «Он воспитал и сделал Ролана как футболиста».</p>
<h3>Усиление состава</h3>
<p>Совет директоров уже обсуждал трансферы: «Нужно укреплять и защиту, и нападение, и опорную зону, совершенно очевидно», — отметил Степашин, добавив, что есть ряд предложений, но говорить о них пока рано.</p>
<h3>Почему выбрали именно Гусева</h3>
<p>«Карпин ушёл. Все остальные заняты. Это свой человек, проверенный», — объяснил Степашин выбор в пользу Гусева, напомнив, что тот был старшим помощником при Карпине и хорошо знает команду.</p>
<h3>Планы на весну и пример Сёмина</h3>
<p>«Динамо» проведёт зимние сборы в ОАЭ. Степашин сравнил ситуацию с возвращением Юрия Сёмина в «Локомотив», когда тот сначала взял Кубок при седьмом месте в лиге, а на следующий год стал чемпионом России.</p>
<p>«У нас осталось три-четыре матча, и мы можем взять Кубок. Я рассчитываю, что Кубок — это одна из главных задач, которая сегодня стоит перед „Динамо"», — подытожил он.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 15),
    },
    // Article 43: РФС выпустил детскую книгу
    {
      title: 'РФС выпустил детскую книгу «Как устроен футбол» о истории игры и пути в профессию',
      slug: 'rfs-vypustil-detskuyu-knigu-kak-ustroen-futbol',
      excerpt: 'Российский футбольный союз представил иллюстрированную книгу «Как устроен футбол» для детей 5–12 лет.',
      content: `<p>Российский футбольный союз представил иллюстрированную книгу «Как устроен футбол» для детей 5–12 лет, в которой простым языком рассказывается, как возник и развивался футбол: от игр в Древнем Китае, Греции и Риме до современности. Юные читатели узнают, как устроены команды, из чего состоит экипировка, что происходит на стадионе в день матча и какие шаги нужно пройти, чтобы стать профессиональным футболистом.</p>
<p>Издание сопровождается множеством рисунков художника Екатерины Минеевой, которые помогают детям лучше ориентироваться в материале и визуально представить устройство футбольного мира. Книга адресована не только детям, уже увлечённым футболом, но и тем, кто только начинает интересоваться игрой, а также родителям, тренерам и педагогам.</p>
<p>Главный тренер сборной России Валерий Карпин назвал книгу «настоящим подарком для юных болельщиков и спортсменов», отметив, что в ней «просто и понятно рассказано, с чего начался футбол, как он развивался и почему миллионы людей во всем мире так сильно его любят».</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 24, 12),
    },
    // Article 44: Смородская о лицензировании тренеров
    {
      title: 'Смородская раскритиковала систему лицензирования тренеров в России',
      slug: 'smorodskaya-raskritikovala-licenzirovanie-trenerov',
      excerpt: 'Бывший президент «Локомотива» Ольга Смородская заявила, что профессия футбольного тренера является «очень редкой».',
      content: `<p>Бывший президент «Локомотива» Ольга Смородская заявила, что профессия футбольного тренера является «очень редкой», а в России к подготовке специалистов относятся слишком формально. По её словам, в стране допущено много ошибок: «надавали бумажек людям» после короткого курса, сразу делая их «профессионалами», либо наоборот не допускали достойных кандидатов до учёбы, что подрывает качество тренерской школы.</p>
<p>Смородская подчеркнула, что к лицензированию тренеров необходимо подходить гораздо более предметно и ответственно, особенно с учётом того, что Россия позиционирует себя как футбольная страна, но при этом тренерам «очень сложно расти», когда клубы почти не представлены на международной арене.</p>
<p>На этом фоне она отдельно отметила, что назначение Ролана Гусева главным тренером «Динамо» до конца сезона выглядит логичным шагом: времени на поиск другого кандидата мало, и российским специалистам нужно давать шанс проявить свой потенциал.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 24, 14),
    },
    // Article 45: Тринкану о переходе в «Барсу»
    {
      title: '«Переход в „Барсу" показался шуткой». Тринкану признался, что не был готов к такому прыжку',
      slug: 'trinkanu-perehod-v-barsu-pokazalsya-shutkoj',
      excerpt: 'Полузащитник «Спортинга» Франсишку Тринкану рассказал, как узнал об интересе «Барселоны» и признался, что поначалу не воспринял новость всерьёз.',
      content: `<p>Полузащитник «Спортинга» Франсишку Тринкану рассказал, как узнал об интересе «Барселоны» и признался, что поначалу не воспринял новость всерьёз. По словам игрока, отец позвонил ему во время сбора и сообщил о предложении каталонцев, но футболист решил, что это одна из привычных семейных шуток и лишь после матча понял, что речь идёт о реальном переходе.</p>
<p>Тринкану отметил, что резкий шаг из «Браги» в «Барселону» оказался для него слишком большим вызовом, к которому он не чувствовал себя до конца подготовленным. В Португалии он оставался «домашним парнем», окружённым заботой и более мягкими ожиданиями, тогда как в Испании сразу столкнулся с колоссальным уровнем давления и интереса к каждой своей игре.</p>
<p>Футболист добавил, что период адаптации в Испании был особенно тяжёлым для его семьи. Сам Тринкану старается воспринимать этот опыт как важный этап карьеры, подчёркивая, что выступления рядом с Лионелем Месси и работа в одной сборной с Криштиану Роналду дали ему огромный профессиональный рост.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 24, 16),
    },
    // Article 46: Рэшфорд хочет остаться в «Барсе»
    {
      title: 'Рэшфорд: «Тренируюсь изо всех сил, чтобы остаться в „Барсе"»',
      slug: 'reshford-treniruus-chtoby-ostatsya-v-barse',
      excerpt: 'Нападающий «Барселоны» Маркус Рэшфорд заявил, что его главная цель — продолжить карьеру в каталонском клубе после завершения аренды.',
      content: `<p>Нападающий «Барселоны» Маркус Рэшфорд в эксклюзивном интервью Sport заявил, что его главная цель — продолжить карьеру в каталонском клубе после завершения аренды из «Манчестер Юнайтед». Англичанин отметил, что чувствует себя в команде комфортно и рассматривает «Барсу» как идеальное место для дальнейшего развития.</p>
<p>«Конечно, я хочу остаться в „Барсе". Это конечная цель, но не поэтому я так усердно тренируюсь и выкладываюсь по максимуму. Цель — победы. „Барса" — огромный, фантастический клуб, созданный для того, чтобы выигрывать трофеи», — сказал Рэшфорд, у которого в этом сезоне 7 голов и 11 результативных передач во всех турнирах.</p>
<p>Форвард подчеркнул, что давление на «Камп Ноу» его не пугает, а наоборот мотивирует: «Здесь есть давление, но не негативное — это именно тот уровень требований, который я хотел всегда. Мне трудно было бы выкладываться на максимум в клубе без больших задач».</p>
<p>Контракт аренды Рэшфорда рассчитан до июня 2026 года и включает опцию выкупа, которую «Барселона» может активировать в любой момент сезона.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 24, 18),
    },
    // Article 47: Евсеев возглавит махачкалинское «Динамо»
    {
      title: 'СМИ: Евсеев возглавит махачкалинское «Динамо», стороны согласовывают детали контракта',
      slug: 'evseev-vozglavit-dinamo-mahachkala',
      excerpt: 'По информации «Чемпионата», 49-летний Вадим Евсеев в ближайшее время станет новым главным тренером махачкалинского «Динамо».',
      content: `<p>По информации «Чемпионата», 49-летний Вадим Евсеев в ближайшее время станет новым главным тренером махачкалинского «Динамо». Источник, знакомый с ситуацией, сообщает, что сейчас клуб и специалист согласовывают последние детали трудового соглашения.</p>
<p>В данный момент Евсеев руководит новороссийским «Черноморцем», с которым работает с сентября этого года, его контракт рассчитан до конца сезона. Ранее сообщалось, что «Динамо» готово выплатить компенсацию за тренера клубу из Первой лиги.</p>
<p>Пост наставника махачкалинцев освободился после отставки Хасанби Биджиева, подавшего заявление после поражения от «Пари НН» (0:1) в 18-м туре Мир РПЛ. Сейчас «Динамо» занимает 13-е место в таблице чемпионата России и ведёт борьбу за сохранение прописки в лиге, а выбор нового главного тренера рассматривается как ключевой шаг в подготовке ко второй части сезона.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 24, 11),
    },
    // Article 48: Кафанов — главный кандидат на пост тренера «Рубина»
    {
      title: 'Кафанов — главный кандидат на пост главного тренера «Рубина»',
      slug: 'kafanov-glavnyj-kandidat-na-post-trenera-rubina',
      excerpt: 'По информации телеграм-канала «Инсайды от Карпа», 65-летний тренер Виталий Кафанов стал основным претендентом на замену Рашида Рахимова в «Рубине».',
      content: `<p>По информации телеграм-канала «Инсайды от Карпа», 65-летний тренер Виталий Кафанов стал основным претендентом на замену Рашида Рахимова в «Рубине». Помощник Валерия Карпина в сборной России на днях прилетал в Казань на собеседование и сейчас считается фаворитом в борьбе за пост главного тренера.</p>
<p>До этого казанцы вели переговоры с испанцем Артигой, который уже прилетал в столицу Татарстана, однако переход сорвался из-за его действующих обязательств перед клубом в Анголе до лета. Параллельно «Рубин» изучал несколько балканских вариантов, но именно Кафанов оказался ближе всех к назначению.</p>
<p>Источник отмечает, что окончательное решение ещё не принято, однако в текущей конфигурации именно опытный российский специалист рассматривается как приоритетный вариант для смены Рахимова на тренерском мостике.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 17),
    },
    // Article 49: Ротенберг поздравил Гусева
    {
      title: 'Ротенберг поздравил Гусева с назначением и назвал его выбором «в долгую»',
      slug: 'rotenberg-pozdravil-guseva-s-naznacheniem',
      excerpt: 'Владелец «Динамо» Борис Ротенберг поздравил Ролана Гусева с утверждением на пост главного тренера и подчеркнул ставку на долгосрочное развитие.',
      content: `<p>Владелец «Динамо» Борис Ротенберг поздравил Ролана Гусева с утверждением на пост главного тренера московского клуба и подчеркнул, что видит в этом ставку на долгосрочное развитие, а не временное решение. По его словам, Гусев — «человек динамовской системы», воспитанник клуба, заслуженный мастер спорта и обладатель Кубка УЕФА, который давно работает внутри структуры и хорошо знает команду и клубную философию.</p>
<p>Ротенберг отдельно отметил важность того, что «клуб доверяет людям, которые по-настоящему переживают за эмблему и понимают, что такое преемственность». Он пожелал Гусеву удачи и уверенности на новом этапе и напомнил, что у «Динамо» есть все условия для поступательного развития: «сильный состав, отличные условия и преданные болельщики», что позволяет спокойно и последовательно строить команду.</p>
<p>Владелец клуба выразил надежду, что доверие руководства будет оправдано результатами, а проделанная работа принесёт плоды не только в ближайшей перспективе, но и в будущем.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 23, 19),
    },
    // Article 50: Сулейманов о «Краснодаре»
    {
      title: 'Сулейманов: выиграть РПЛ с 11 воспитанниками «Краснодара» очень сложно, но Галицкий мечту не оставит',
      slug: 'suleymanov-vyigrat-rpl-s-11-vospitannikami-krasnodara',
      excerpt: 'Нападающий «Спортинг Канзас-Сити» Магомед-Шапи Сулейманов считает, что «Краснодару» будет крайне сложно стать чемпионом с составом из воспитанников.',
      content: `<p>Нападающий «Спортинг Канзас-Сити» Магомед-Шапи Сулейманов считает, что «Краснодару» будет крайне сложно стать чемпионом России, если в стартовом составе одновременно будут выходить 11 воспитанников клуба. По его словам, на дистанции сезона команде необходимы опытные лидеры, вокруг которых строится игра, и сейчас таковой фигурой у «быков» является нападающий Джон Кордоба.</p>
<p>При этом Сулейманов уверен, что владелец клуба Сергей Галицкий не откажется от давней идеи построить команду мечты исключительно из выпускников академии «Краснодара». Форвард напомнил, что его поколение стало первым, кто забивал за «быков» в еврокубках, но тогда конкурировать за место в основе приходилось с такими игроками, как Вандерсон, Классон, Павел Мамаев и Лаборде, тогда как нынешние воспитанники получили больше шансов и уже выросли в лидеров.</p>
<p>Оценивая расстановку сил в чемпионате, Сулейманов подчеркнул, что сегодня в России есть лишь две по-настоящему топ-команды — «Краснодар» и «Зенит», которые реально борются за золото, тогда как остальные клубы он назвал просто хорошими.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 25, 10),
    },
    // Article 51: Белоголовцев о Титове
    {
      title: 'Белоголовцев: «Будь моя воля, „Спартак" тренировал бы Титов»',
      slug: 'belogolovcev-bud-moya-volya-spartak-treniroval-by-titov',
      excerpt: 'Актёр и давний фанат красно-белых Сергей Белоголовцев признался, что в идеале хотел бы видеть у руля «Спартака» Егора Титова.',
      content: `<p>Актёр и давний фанат красно-белых Сергей Белоголовцев признался, что в идеале хотел бы видеть у руля «Спартака» Егора Титова. Он подчеркнул, что относится к нему с огромным уважением и считает, что для клуба было бы «круто», если бы команду возглавил человек, который долгие годы был её лицом на поле.</p>
<p>По словам Белоголовцева, Титов был не только топ-футболистом с выдающимся пониманием игры, но и настоящим «мужиком» и бойцом — тем типом лидера, который умеет терпеть, держать удар и требовать от других того же. Актёр отметил, что часто именно таким людям верят в раздевалке, и это качество он считает не менее важным, чем тренерские дипломы и модные тактические схемы.</p>
<p>Отсутствие у Титова серьёзного опыта работы главным тренером Белоголовцев не видит критическим фактором, напомнив, что «никто не начинает сразу с багажом десяти лет на скамейке». Он уверен, что при должной поддержке клуба и правильном штабе бывший капитан «Спартака» мог бы вырасти в сильного наставника и стать для команды символом преемственности.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 26, 11),
    },
    // Article 52: Гришин о «Балтике»
    {
      title: 'Гришин: «Секрет „Балтики" — в лучшей обороне лиги, но из-за фолов игра рвётся на части»',
      slug: 'grishin-sekret-baltiki-v-luchshej-oborone-ligi',
      excerpt: 'Бывший полузащитник ЦСКА Александр Гришин назвал крепкую оборону главным козырем «Балтики», которая после 18 туров идёт пятой в РПЛ.',
      content: `<p>Бывший полузащитник ЦСКА Александр Гришин назвал крепкую оборону главным козырем «Балтики», которая после 18 туров идёт пятой в Мир РПЛ с 35 очками и имеет наименьшее число пропущенных мячей в лиге. По его словам, команда Андрея Талалаева «строится от печки», надёжно защищается и за счёт реализации моментов Хиля (10 голов), Петрова и Титкова удерживается так высоко в таблице.</p>
<p>При этом Гришин отметил, что использование тактики мелкого фола негативно влияет на зрелищность: игра «рвётся на части», за тайм может набираться около 20 нарушений, а чистое игровое время, по его оценке, иногда составляет всего «условные семь минут» из 45. Эксперт считает, что футбол у калининградцев «неплохой, но не очень зрелищный», так как постоянные ауты и штрафные сбивают темп, хотя с точки зрения результата команда продолжает набирать очки.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 25, 14),
    },
    // Article 53: «Бернабеу» превращается в золотую жилу
    {
      title: '«Бернабеу» превращается в золотую жилу: тур, рестораны и VR-проект с Apple ведут «Реал» к рекордным 400 млн евро',
      slug: 'bernabeu-prevrashhaetsya-v-zolotuyu-zhilu',
      excerpt: 'Обновлённый «Сантьяго Бернабеу» становится главным финансовым драйвером «Реала»: клуб заложил рекордные 1,248 млрд евро доходов на сезон 2025/26.',
      content: `<p>Обновлённый «Сантьяго Бернабеу» становится главным финансовым драйвером «Реала»: клуб заложил рекордные 1,248 млрд евро доходов на сезон 2025/26, из которых около 402,5 млн даст именно эксплуатация стадиона. Маркетинг (примерно 540 млн) и коммерческое использование арены вместе обеспечат более 75% всех поступлений, а сам «Бернабеу» уже позиционируется не как футбольное поле, а как многофункциональная площадка развлечений и туризма.</p>
<p>Отдельный блок — «новые» стадионные доходы, не связанные с матчами: тур по стадиону, мероприятия, концерты и рестораны уже принесли клубу 79,1 млн евро за прошлый сезон, причём только тур дал 52,6 млн и по выручке уверенно обошёл Музей Прадо (27 млн в 2023-м). Сети общественного питания, VIP-зоны, Bernabéu Market и гастрономические проекты вроде KŌ by 99 Sushi Bar ещё не вышли на полный режим, но уже стали важной частью «рецепта».</p>
<p>Следующий шаг — технологический проект Bernabéu Infinito в партнёрстве с Apple, который должен позволить болельщикам по всему миру «посещать» стадион в формате VR с помощью гарнитур Apple Vision Pro. Президент «Реала» Флорентино Перес описывает это как «открытие дверей стадиона для всей планеты».</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 26, 12),
    },
    // Article 54: «Реал» готовит перестройку центра обороны
    {
      title: '«Реал» готовит перестройку центра обороны: уйдут Алаба и, возможно, Рюдигер',
      slug: 'real-gotovit-perestrojku-centra-oborony',
      excerpt: '«Реал» уже активно просматривает рынок центральных защитников и нацелился на серьёзное усиление линии обороны следующим летом.',
      content: `<p>«Реал» уже активно просматривает рынок центральных защитников и, по данным ESPN, нацелился на серьёзное усиление линии обороны следующим летом на фоне травм Эдера Милитао и неопределённости с контрактами Давида Алабы и Антонио Рюдигера. В планах мадридцев — не продлевать соглашение с 33-летним Алабой, которому прочат уход в ближайшее трансферное окно, а по Рюдигеру в клубе колеблются: немцу готовы предложить новый контракт, но его привлекает вариант доиграть карьеру в Саудовской Аравии.</p>
<p>При этом привычная для «Реала» ставка на свободных агентов в случае с Ибраимой Конате, Дайо Упамекано и Марком Гэи, чьи контракты истекают летом, пока не выглядит приоритетной: их переходы источник в клубе называет маловероятными. Скаутский отдел во главе с Джуни Калафатом высоко оценивает Жереми Жаке из «Ренна» и Ника Шлоттербека из «Боруссии» Д.</p>
<p>Параллельно в клубе внимательно следят за прогрессом своих центральных защитников Якобо Рамона (аренда в «Комо» с опцией выкупа) и Жоана Мартинеса, считающихся главными кандидатами из кантеры на усиление первой команды.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      publishDate: specificDate(12, 26, 15),
    },
    // Article 55: Матич о переходе в «МЮ»
    {
      title: '«Уходил из „Челси" чемпионом и понял, что мне нужен „МЮ" в резюме» — Матич о переходе к сопернику',
      slug: 'matich-o-perehode-iz-chelsi-v-myu',
      excerpt: 'Неманья Матич объяснил, что переход из «Челси» в «Манчестер Юнайтед» в 2017-м был для него осознанным карьерным шагом.',
      content: `<p>Неманья Матич объяснил, что переход из «Челси» в «Манчестер Юнайтед» в 2017-м был для него осознанным карьерным шагом: он уходил с «Стэмфорд Бридж» в статусе чемпиона и чувствовал, что «нужно иметь „Юнайтед" в своём резюме». По словам серба, решающим фактором стало приглашение Жозе Моуринью и ощущение, что в Лондоне клуб ищет нового игрока на его позицию, тогда как «Юнайтед» оставался для него наряду с «Реалом» одним из двух исторически самых больших клубов мира.</p>
<p>Матич отметил, что до сих пор считает переход правильным решением, несмотря на непростую пост-фергюсоновскую эпоху: за пять сезонов на «Олд Траффорд» он закрепил репутацию надёжного полузащитника, выиграл трофеи и забил несколько эффектных голов, прежде чем продолжить карьеру в «Роме», «Ренне», «Лионе» и затем «Сассуоло».</p>
<p>Сам факт выступления за «Челси», «Манчестер Юнайтед» и «Бенфику» он называет частью пути игрока, который сознательно выбирал челленджи на высочайшем уровне, а не только комфорт.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 25, 16),
    },
    // Article 56: РФС о рисках лимита на легионеров
    {
      title: 'В РФС подсветили риски установления лимитов на легионеров',
      slug: 'rfs-podsvetili-riski-limita-na-legionerov',
      excerpt: 'В Российском футбольном союзе считают, что переход к обновлённой системе лимита на легионеров несёт серьёзные риски для развития клубов.',
      content: `<p>В Российском футбольном союзе считают, что переход к обновлённой системе лимита на легионеров несёт серьёзные риски для развития клубов и всего чемпионата. Отмечается, что жёсткие ограничения по иностранцам могут снизить зрелищность и общий уровень РПЛ, а также осложнить конкурентоспособность российских команд на международной арене.</p>
<p>Кроме того, в РФС предупреждают о возможных финансовых последствиях: падение качества футбола и интереса болельщиков может ударить по доходам от трансляций, спонсорских контрактов и маркетинга. При этом вопрос баланса между поддержкой российских игроков и сохраняющейся привлекательностью лиги для сильных легионеров назван одним из ключевых в текущей дискуссии о лимите.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 25, 12),
    },
    // Article 57: Масалитин о тренерах
    {
      title: 'Масалитин: в России тренеров продвигают по связям, а не по доверию и системе',
      slug: 'masalitin-v-rossii-trenerov-prodvigayut-po-svyazyam',
      excerpt: 'Бывший форвард ЦСКА Валерий Масалитин заявил, что ключевая проблема российской тренерской школы в том, что карьера тренеров зависит от знакомств.',
      content: `<p>Бывший форвард ЦСКА и эксперт Валерий Масалитин заявил, что ключевая проблема российской тренерской школы в том, что карьера тренеров всё чаще зависит от знакомств, а не от системной подготовки и доверия клубов. Он напомнил, что раньше на тренерские курсы попадали по направлению от клубов, специалисты возвращались на конкретные места работы, а теперь «плати и учись», и многие остаются без команды, если нет нужных контактов.</p>
<p>По мнению Масалитина, единицы в России идут вверх за счёт реального таланта и знаний, а большинство назначений делается «по указке», что отражает общую модель отношений в стране. Он считает, что топ-клубы почти не воспитывают собственных тренеров, хотя могли бы последовательно поднимать специалистов из академий и нижних лиг, как это когда-то проходили Сёмин, Романцев и Газзаев.</p>
<p>Эксперт отмечает, что в итоге в РПЛ мало готовых к работе в топ-клубах наставников, а клубы предпочитают «низкосортных иностранцев». На примере Ролана Гусева в «Динамо» он говорит, что успех возможен только при реальном доверии и готовности клубов отвечать за свои кадровые решения.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 25, 18),
    },
    // Article 58: Лебёф о ЧМ-2026 и Роналду
    {
      title: 'Лебёф: «Надеюсь, ЧМ-2026 будет посвящён Роналду»',
      slug: 'lebef-nadeyus-chm-2026-budet-posvyashhen-ronaldu',
      excerpt: 'Чемпион мира-1998 Франк Лебёф заявил, что хотел бы увидеть, как ЧМ-2026 станет для Криштиану Роналду тем же, чем мундиаль-2022 был для Месси.',
      content: `<p>Чемпион мира-1998 Франк Лебёф заявил, что хотел бы увидеть, как ЧМ-2026 станет для Криштиану Роналду тем же, чем мундиаль-2022 был для Лионеля Месси, и португалец наконец поднимет над головой трофей, которого ему не хватает для полного комплекта. По его словам, несмотря на выигранные Евро и Лигу наций, отсутствие золота чемпионата мира остаётся единственным крупным трофеем, который отделяет Роналду от идеальной коллекции, и победа в Северной Америке стала бы «фантастическим достижением».</p>
<p>Лебёф подчеркнул, что соперничество Роналду и Месси уже два десятилетия определяет разговоры о величайшем футболисте, и триумф Португалии на ЧМ-2026 позволил бы CR7 зеркально повторить путь аргентинца.</p>
<p>При этом он предупредил Роберто Мартинеса: ключевой вопрос для тренера — как управлять ролью 41-летнего форварда в условиях матчей «через три дня на четвёртый», грамотно дозируя время на поле, чтобы сохранить его эффективность и шансы команды на трофей.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['breaking-news'],
      publishDate: specificDate(12, 25, 20),
    },
    // Article 59: Зобнин близок к новому контракту
    {
      title: 'Зобнин близок к новому контракту со «Спартаком»: стороны улаживают последние детали',
      slug: 'zobnin-blizok-k-novomu-kontraktu-so-spartakom',
      excerpt: 'Полузащитник и капитан «Спартака» Роман Зобнин ведёт финальные переговоры о новом контракте с московским клубом.',
      content: `<p>Полузащитник и капитан «Спартака» Роман Зобнин ведёт финальные переговоры о новом контракте с московским клубом, при этом обе стороны настроены сохранить сотрудничество. По данным Metaratings.ru, действующее соглашение 31-летнего игрока рассчитано до конца сезона 2025/26, а сейчас клуб и футболист согласовывают оставшиеся детали сделки в позитивном ключе.</p>
<p>Зобнин выступает за «Спартак» с 2016 года, успев провести за красно-белых 291 матч, забить 21 гол и стать чемпионом России, обладателем Кубка и Суперкубка страны. Отмечается, что хавбек не раз публично декларировал желание остаться в клубе, а новый контракт должен закрепить его статус одного из ключевых и самых стабильных игроков нынешнего состава.</p>`,
      categorySlug: 'futbol',
      tagSlugs: ['transfer'],
      leagueSlug: 'rpl-league',
      publishDate: specificDate(12, 25, 15),
    },
  ]

  for (const articleData of articlesData) {
    const category = articleData.categorySlug === 'futbol' ? futbolCategory :
                     articleData.categorySlug === 'hokkey' ? hokkeyCategory :
                     articleData.categorySlug === 'tennis' ? tennisCategory :
                     articleData.categorySlug === 'basketbol' ? basketbolCategory :
                     articleData.categorySlug === 'mma' ? mmaCategory :
                     articleData.categorySlug === 'boks' ? boksCategory : null

    if (!category) continue

    const tags = articleData.tagSlugs?.map(slug => {
      if (slug === 'transfer') return transferTag
      if (slug === 'match-preview') return matchPreviewTag
      if (slug === 'match-report') return matchReportTag
      if (slug === 'breaking-news') return breakingNewsTag
      return null
    }).filter(Boolean) || []

    const league = articleData.leagueSlug === 'rpl-league' ? rplLeague : null

    // Use specific publishDate if available, otherwise use randomDate
    const publishedAt = (articleData as { publishDate?: Date }).publishDate || randomDate(30)
    const featuredImage = (articleData as { featuredImage?: string }).featuredImage || null

    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        categoryId: category.id,
        leagueId: league?.id || null,
        publishedAt,
        featuredImage,
      },
      create: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        categoryId: category.id,
        authorId: admin.id,
        leagueId: league?.id || null,
        status: 'PUBLISHED',
        publishedAt,
        featuredImage,
        tags: {
          connect: tags.map(tag => ({ id: tag!.id })),
        },
      },
    })
  }

  console.log('Created articles')

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
