import { prisma } from '@/lib/prisma'
import { PREDEFINED_SOURCES } from '@/lib/import/sources'
import ImportDashboard from '@/components/admin/ImportDashboard'

export const metadata = {
  title: 'Import News - Admin',
}

export default async function ImportPage() {
  const [sources, categories, tags, pendingItems, recentJobs] = await Promise.all([
    prisma.importSource.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            importedItems: {
              where: { status: 'PENDING' },
            },
          },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
    prisma.importedItem.findMany({
      where: { status: 'PENDING' },
      include: { source: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.importJob.findMany({
      include: { source: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  return (
    <ImportDashboard
      sources={sources}
      predefinedSources={PREDEFINED_SOURCES}
      categories={categories}
      tags={tags}
      pendingItems={pendingItems}
      recentJobs={recentJobs}
    />
  )
}
