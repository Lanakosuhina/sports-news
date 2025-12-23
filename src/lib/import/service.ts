import { prisma } from '@/lib/prisma'
import { parseRSSFeed, fetchArticleContent, ParsedItem } from './parser'
import { ImportSource, ImportStatus, JobStatus } from '@prisma/client'

export interface ImportResult {
  success: boolean
  itemsFound: number
  itemsNew: number
  error?: string
}

export async function checkSourceForNewItems(source: ImportSource): Promise<ImportResult> {
  const job = await prisma.importJob.create({
    data: {
      sourceId: source.id,
      status: 'RUNNING',
      startedAt: new Date(),
    },
  })

  try {
    const feedUrl = source.feedUrl || source.url
    const items = await parseRSSFeed(feedUrl)

    let itemsNew = 0

    for (const item of items) {
      // Check if item already exists
      const existing = await prisma.importedItem.findUnique({
        where: {
          sourceId_externalId: {
            sourceId: source.id,
            externalId: item.externalId,
          },
        },
      })

      if (!existing) {
        await prisma.importedItem.create({
          data: {
            sourceId: source.id,
            externalId: item.externalId,
            externalUrl: item.externalUrl,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            imageUrl: item.imageUrl,
            publishedAt: item.publishedAt,
            rawData: item.rawData as object,
            status: 'PENDING',
          },
        })
        itemsNew++
      }
    }

    // Update job status
    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        itemsFound: items.length,
        itemsNew,
        completedAt: new Date(),
      },
    })

    // Update source last checked time
    await prisma.importSource.update({
      where: { id: source.id },
      data: { lastCheckedAt: new Date() },
    })

    // Create notification if new items found
    if (itemsNew > 0) {
      await createImportNotification(source.name, itemsNew)
    }

    return {
      success: true,
      itemsFound: items.length,
      itemsNew,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: 'FAILED',
        error: errorMessage,
        completedAt: new Date(),
      },
    })

    return {
      success: false,
      itemsFound: 0,
      itemsNew: 0,
      error: errorMessage,
    }
  }
}

export async function importItemAsArticle(
  itemId: string,
  categoryId: string,
  tagIds: string[] = [],
  options: {
    fetchFullContent?: boolean
    status?: 'DRAFT' | 'PUBLISHED'
  } = {}
): Promise<{ success: boolean; articleId?: string; error?: string }> {
  try {
    const item = await prisma.importedItem.findUnique({
      where: { id: itemId },
      include: { source: true },
    })

    if (!item) {
      return { success: false, error: 'Item not found' }
    }

    if (item.status === 'IMPORTED') {
      return { success: false, error: 'Item already imported' }
    }

    let content = item.content || ''
    let imageUrl = item.imageUrl

    // Optionally fetch full content from source
    if (options.fetchFullContent && item.externalUrl) {
      try {
        const sourceConfig = item.source.config as { selectors?: Record<string, string> } | null
        const fullContent = await fetchArticleContent(item.externalUrl, sourceConfig?.selectors)
        content = fullContent.content
        if (!imageUrl) imageUrl = fullContent.imageUrl
      } catch (e) {
        console.error('Failed to fetch full content:', e)
      }
    }

    // Generate slug from title
    const baseSlug = generateSlug(item.title)
    const slug = await ensureUniqueSlug(baseSlug)

    // Create article
    const article = await prisma.article.create({
      data: {
        title: item.title,
        slug,
        excerpt: item.excerpt || item.title,
        content: content || `<p>${item.excerpt || item.title}</p>`,
        featuredImage: imageUrl,
        categoryId,
        status: options.status || 'DRAFT',
        publishedAt: options.status === 'PUBLISHED' ? new Date() : null,
        canonicalUrl: item.externalUrl,
        tags: tagIds.length > 0 ? { connect: tagIds.map(id => ({ id })) } : undefined,
      },
    })

    // Update imported item status
    await prisma.importedItem.update({
      where: { id: itemId },
      data: {
        status: 'IMPORTED',
        articleId: article.id,
        importedAt: new Date(),
      },
    })

    return { success: true, articleId: article.id }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await prisma.importedItem.update({
      where: { id: itemId },
      data: { status: 'FAILED' },
    })

    return { success: false, error: errorMessage }
  }
}

export async function bulkImportItems(
  itemIds: string[],
  categoryId: string,
  tagIds: string[] = [],
  options: { status?: 'DRAFT' | 'PUBLISHED' } = {}
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0
  let failed = 0
  const errors: string[] = []

  for (const itemId of itemIds) {
    const result = await importItemAsArticle(itemId, categoryId, tagIds, options)
    if (result.success) {
      success++
    } else {
      failed++
      if (result.error) errors.push(result.error)
    }
  }

  return { success, failed, errors }
}

export async function skipImportItem(itemId: string): Promise<void> {
  await prisma.importedItem.update({
    where: { id: itemId },
    data: { status: 'SKIPPED' },
  })
}

export async function checkAllActiveSources(): Promise<{
  sourcesChecked: number
  totalNew: number
  errors: string[]
}> {
  const sources = await prisma.importSource.findMany({
    where: { isActive: true },
  })

  let totalNew = 0
  const errors: string[] = []

  for (const source of sources) {
    // Check if enough time has passed since last check
    if (source.lastCheckedAt) {
      const minutesSinceLastCheck = (Date.now() - source.lastCheckedAt.getTime()) / 60000
      if (minutesSinceLastCheck < source.checkInterval) {
        continue
      }
    }

    const result = await checkSourceForNewItems(source)
    if (result.success) {
      totalNew += result.itemsNew
    } else if (result.error) {
      errors.push(`${source.name}: ${result.error}`)
    }
  }

  return {
    sourcesChecked: sources.length,
    totalNew,
    errors,
  }
}

async function createImportNotification(sourceName: string, count: number): Promise<void> {
  await prisma.importNotification.create({
    data: {
      message: `${count} new article${count > 1 ? 's' : ''} available from ${sourceName}`,
      count,
    },
  })
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
    .replace(/^-|-$/g, '')
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
    })

    if (!existing) return slug

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function getPendingItemsCount(): Promise<number> {
  return prisma.importedItem.count({
    where: { status: 'PENDING' },
  })
}

export async function getUnreadNotificationsCount(): Promise<number> {
  return prisma.importNotification.count({
    where: { isRead: false },
  })
}
