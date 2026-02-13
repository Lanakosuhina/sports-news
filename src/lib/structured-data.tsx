// JSON-LD Structured Data for SEO
// Schema.org types for news articles, organization, breadcrumbs

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportstrends.ru'
export const SITE_NAME = 'Тренды спорта'

interface ArticleSchemaInput {
  title: string
  description: string
  slug: string
  featuredImage?: string | null
  publishedAt?: Date | null
  updatedAt: Date
  author?: { name: string } | null
  category: { name: string; slug: string }
}

interface BreadcrumbItem {
  name: string
  url: string
}

// NewsArticle schema for article pages
export function generateArticleSchema(article: ArticleSchemaInput) {
  const imageUrl = article.featuredImage
    ? article.featuredImage.startsWith('http')
      ? article.featuredImage
      : `${SITE_URL}${article.featuredImage}`
    : `${SITE_URL}/og-default.jpg`

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: imageUrl,
    datePublished: article.publishedAt?.toISOString() || article.updatedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Редакция Тренды спорта',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/article/${article.slug}`,
    },
    articleSection: article.category.name,
    inLanguage: 'ru-RU',
  }
}

// Organization schema for the website
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'Sports Trends',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: 'Спортивное СМИ, всем сердцем любящее спорт. Честно пишем о спорте для тех, кто разделяет нашу страсть!',
    foundingDate: '2025',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
    },
    sameAs: [
      // Add social media URLs if available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Russian',
    },
  }
}

// WebSite schema with search action
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Спортивные новости, аналитика и прогнозы',
    inLanguage: 'ru-RU',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// BreadcrumbList schema
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

// Category/CollectionPage schema
export function generateCategorySchema(category: {
  name: string
  slug: string
  description?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || `Новости и статьи в категории ${category.name}`,
    url: `${SITE_URL}/category/${category.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: 'ru-RU',
  }
}

// SportsEvent schema for match pages
export function generateSportsEventSchema(match: {
  homeTeam: { name: string }
  awayTeam: { name: string }
  homeScore?: number | null
  awayScore?: number | null
  startTime: Date
  league: { name: string }
  status: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    startDate: match.startTime.toISOString(),
    homeTeam: {
      '@type': 'SportsTeam',
      name: match.homeTeam.name,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: match.awayTeam.name,
    },
    location: {
      '@type': 'Place',
      name: 'Stadium',
    },
    eventStatus: match.status === 'FINISHED'
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventScheduled',
  }
}

// Helper to render JSON-LD script tag
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}
