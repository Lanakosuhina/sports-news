import { prisma } from '@/lib/prisma'
import MatchImportForm from '@/components/admin/MatchImportForm'

export const metadata = {
  title: 'Import Matches - Admin',
}

export default async function MatchImportPage() {
  const leagues = await prisma.league.findMany({
    include: { category: true },
    orderBy: { name: 'asc' },
  })

  const recentMatches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Import Matches</h1>
        <p className="text-slate-600">Add match results and upcoming fixtures</p>
      </div>

      <MatchImportForm leagues={leagues} recentMatches={recentMatches} />
    </div>
  )
}
