import { prisma } from '@/lib/prisma'
import FootballImportDashboard from '@/components/admin/FootballImportDashboard'

export const metadata = {
  title: 'Football Import - Admin',
}

export default async function FootballImportPage() {
  const [leagues, categories] = await Promise.all([
    prisma.league.findMany({
      orderBy: { name: 'asc' },
      include: {
        category: true,
        _count: {
          select: {
            matches: true,
            standings: true,
          },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <FootballImportDashboard
      leagues={leagues}
      categories={categories}
    />
  )
}
