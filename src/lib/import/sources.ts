// Predefined import sources configuration
// Easy to extend with new sources

export interface SourceConfig {
  name: string
  slug: string
  url: string
  feedUrl?: string
  type: 'RSS' | 'API' | 'SCRAPER'
  defaultCategory?: string
  logo?: string
  selectors?: {
    title?: string
    content?: string
    image?: string
    date?: string
    author?: string
  }
  transform?: {
    titlePrefix?: string
    contentWrapper?: boolean
  }
}

export const PREDEFINED_SOURCES: SourceConfig[] = [
  {
    name: 'Championat',
    slug: 'championat',
    url: 'https://www.championat.com',
    feedUrl: 'https://www.championat.com/rss/news/football/',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/championat.png',
  },
  {
    name: 'Sports.ru',
    slug: 'sports-ru',
    url: 'https://www.sports.ru',
    feedUrl: 'https://www.sports.ru/rss/rubric/football/',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/sportsru.png',
  },
  {
    name: 'Sovsport',
    slug: 'sovsport',
    url: 'https://www.sovsport.ru',
    feedUrl: 'https://www.sovsport.ru/rss',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/sovsport.png',
  },
  {
    name: 'Match TV',
    slug: 'matchtv',
    url: 'https://matchtv.ru',
    feedUrl: 'https://matchtv.ru/rss',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/matchtv.png',
  },
  {
    name: 'ESPN',
    slug: 'espn',
    url: 'https://www.espn.com',
    feedUrl: 'https://www.espn.com/espn/rss/news',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/espn.png',
  },
  {
    name: 'BBC Sport',
    slug: 'bbc-sport',
    url: 'https://www.bbc.com/sport',
    feedUrl: 'https://feeds.bbci.co.uk/sport/rss.xml',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/bbc.png',
  },
  {
    name: 'Sky Sports',
    slug: 'sky-sports',
    url: 'https://www.skysports.com',
    feedUrl: 'https://www.skysports.com/rss/12040',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/skysports.png',
  },
  {
    name: 'Goal.com',
    slug: 'goal',
    url: 'https://www.goal.com',
    feedUrl: 'https://www.goal.com/feeds/en/news',
    type: 'RSS',
    defaultCategory: 'football',
    logo: '/sources/goal.png',
  },
]

// Category-specific feeds for sources that support them
export const CATEGORY_FEEDS: Record<string, Record<string, string>> = {
  championat: {
    football: 'https://www.championat.com/rss/news/football/',
    hockey: 'https://www.championat.com/rss/news/hockey/',
    basketball: 'https://www.championat.com/rss/news/basketball/',
    tennis: 'https://www.championat.com/rss/news/tennis/',
    esports: 'https://www.championat.com/rss/news/cybersport/',
  },
  'sports-ru': {
    football: 'https://www.sports.ru/rss/rubric/football/',
    hockey: 'https://www.sports.ru/rss/rubric/hockey/',
    basketball: 'https://www.sports.ru/rss/rubric/basketball/',
    tennis: 'https://www.sports.ru/rss/rubric/tennis/',
  },
  'bbc-sport': {
    football: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
    tennis: 'https://feeds.bbci.co.uk/sport/tennis/rss.xml',
    basketball: 'https://feeds.bbci.co.uk/sport/basketball/rss.xml',
  },
}

export function getSourceBySlug(slug: string): SourceConfig | undefined {
  return PREDEFINED_SOURCES.find(s => s.slug === slug)
}

export function getCategoryFeed(sourceSlug: string, category: string): string | undefined {
  return CATEGORY_FEEDS[sourceSlug]?.[category]
}
