import Parser from 'rss-parser'
import * as cheerio from 'cheerio'
import crypto from 'crypto'

export interface ParsedItem {
  externalId: string
  externalUrl: string
  title: string
  excerpt: string | null
  content: string | null
  imageUrl: string | null
  publishedAt: Date | null
  author: string | null
  categories: string[]
  rawData: Record<string, unknown>
}

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SportsNewsBot/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
      ['dc:creator', 'creator'],
    ],
  },
})

export async function parseRSSFeed(feedUrl: string): Promise<ParsedItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl)

    return feed.items.map(item => {
      const itemRecord = item as unknown as Record<string, unknown>
      const imageUrl = extractImageUrl(itemRecord)
      const content = (itemRecord['content:encoded'] || itemRecord.content || null) as string | null
      const excerpt = (itemRecord.contentSnippet || extractExcerpt(content)) as string | null

      return {
        externalId: generateExternalId((itemRecord.link || itemRecord.guid || itemRecord.title || '') as string),
        externalUrl: (itemRecord.link || '') as string,
        title: cleanText((itemRecord.title || 'Untitled') as string),
        excerpt: excerpt ? cleanText(excerpt) : null,
        content: content ? cleanHtml(content) : null,
        imageUrl,
        publishedAt: itemRecord.pubDate ? new Date(itemRecord.pubDate as string) : null,
        author: (itemRecord.creator || itemRecord.author || null) as string | null,
        categories: (itemRecord.categories || []) as string[],
        rawData: itemRecord,
      }
    })
  } catch (error) {
    console.error('RSS parsing error:', error)
    throw new Error(`Failed to parse RSS feed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function extractImageUrl(item: Record<string, unknown>): string | null {
  // Try media:content
  if (item.mediaContent) {
    const media = item.mediaContent as { $?: { url?: string } }
    if (media.$?.url) return media.$.url
  }

  // Try media:thumbnail
  if (item.mediaThumbnail) {
    const thumb = item.mediaThumbnail as { $?: { url?: string } }
    if (thumb.$?.url) return thumb.$.url
  }

  // Try enclosure
  if (item.enclosure) {
    const enc = item.enclosure as { url?: string; type?: string }
    if (enc.url && enc.type?.startsWith('image/')) return enc.url
  }

  // Try to extract from content
  const content = (item['content:encoded'] || item.content) as string | undefined
  if (content) {
    const $ = cheerio.load(content)
    const firstImg = $('img').first().attr('src')
    if (firstImg) return firstImg
  }

  return null
}

function extractExcerpt(content: string | null, maxLength = 200): string | null {
  if (!content) return null

  const $ = cheerio.load(content)
  const text = $.text().trim()

  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

function cleanHtml(html: string): string {
  const $ = cheerio.load(html)

  // Remove scripts and styles
  $('script, style, iframe').remove()

  // Remove empty paragraphs
  $('p').each((_, el) => {
    if ($(el).text().trim() === '') {
      $(el).remove()
    }
  })

  return $.html() || ''
}

function generateExternalId(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex')
}

// Fetch full article content from URL (for scrapers)
export async function fetchArticleContent(url: string, selectors?: {
  title?: string
  content?: string
  image?: string
  date?: string
  author?: string
}): Promise<{
  title: string
  content: string
  imageUrl: string | null
  author: string | null
}> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SportsNewsBot/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  // Use provided selectors or common defaults
  const titleSel = selectors?.title || 'h1, .article-title, .post-title'
  const contentSel = selectors?.content || 'article, .article-content, .post-content, .entry-content'
  const imageSel = selectors?.image || '.featured-image img, article img, .post-thumbnail img'
  const authorSel = selectors?.author || '.author-name, .byline, [rel="author"]'

  const title = $(titleSel).first().text().trim() || 'Untitled'
  const content = $(contentSel).first().html() || ''
  const imageUrl = $(imageSel).first().attr('src') || null
  const author = $(authorSel).first().text().trim() || null

  return {
    title: cleanText(title),
    content: cleanHtml(content),
    imageUrl,
    author,
  }
}
