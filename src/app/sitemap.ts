import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ]

  // Get all categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    })
    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  // Get all published articles
  let articlePages: MetadataRoute.Sitemap = []
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 1000, // Limit for performance
    })
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
  }

  // Get all tags
  let tagPages: MetadataRoute.Sitemap = []
  try {
    const tags = await prisma.tag.findMany({
      select: { slug: true, createdAt: true },
    })
    tagPages = tags.map((tag) => ({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: tag.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch (error) {
    console.error('Error fetching tags for sitemap:', error)
  }

  // Get all static pages
  let staticContentPages: MetadataRoute.Sitemap = []
  try {
    const pages = await prisma.page.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })
    staticContentPages = pages.map((page) => ({
      url: `${baseUrl}/page/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }))
  } catch (error) {
    console.error('Error fetching pages for sitemap:', error)
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...articlePages,
    ...tagPages,
    ...staticContentPages,
  ]
}
