import Link from 'next/link'
import Image from 'next/image'
import { ArticleWithRelations, StandingWithTeam, MatchWithTeams } from '@/types'
import { formatDate, getImageUrl } from '@/lib/utils'
import { Calendar, Trophy } from 'lucide-react'
import { ImageIcon } from 'lucide-react'

interface SidebarProps {
  popularArticles?: ArticleWithRelations[]
  standings?: StandingWithTeam[]
  upcomingMatches?: MatchWithTeams[]
  tags?: { id: string; name: string; slug: string; _count: { articles: number } }[]
  showAds?: boolean
}

export default function Sidebar({
  popularArticles = [],
  standings = [],
  upcomingMatches = [],
  tags = [],
  showAds = true,
}: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Ad Placeholder - Top */}
      {showAds && (
        <div className="bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 aspect-[300/250]">
          <ImageIcon className="w-12 h-12 mb-2" />
          <span className="text-sm">Рекламный блок</span>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Ближайшие матчи</h3>
          </div>
          <div className="divide-y">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="p-4 hover:bg-slate-50 transition">
                <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                  <span className="font-medium text-blue-500">{match.league.name}</span>
                  <span>{formatDate(match.matchDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {match.homeTeam.logo ? (
                      <Image
                        src={getImageUrl(match.homeTeam.logo)}
                        alt={match.homeTeam.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                    )}
                    <span className="text-sm font-medium truncate">
                      {match.homeTeam.shortName || match.homeTeam.name}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 rounded text-slate-500 text-xs font-medium">VS</span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-sm font-medium truncate">
                      {match.awayTeam.shortName || match.awayTeam.name}
                    </span>
                    {match.awayTeam.logo ? (
                      <Image
                        src={getImageUrl(match.awayTeam.logo)}
                        alt={match.awayTeam.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* League Table - Compact Version */}
      {standings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Турнирная таблица</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">#</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Клуб</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-500">И</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-500">В</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-500">Н</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-500">П</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-500">О</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standings.slice(0, 8).map((standing) => (
                  <tr key={standing.id} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-2">
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                        standing.position <= 4 ? 'bg-green-500 text-white' :
                        standing.position <= 6 ? 'bg-blue-500 text-white' :
                        standing.position >= standings.length - 2 ? 'bg-red-500 text-white' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {standing.position}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {standing.team.logo ? (
                          <Image
                            src={getImageUrl(standing.team.logo)}
                            alt={standing.team.name}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                        )}
                        <span className="truncate max-w-[80px] font-medium text-slate-900">
                          {standing.team.shortName || standing.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center text-slate-600">{standing.played}</td>
                    <td className="px-2 py-2 text-center text-green-600">{standing.won}</td>
                    <td className="px-2 py-2 text-center text-slate-500">{standing.drawn}</td>
                    <td className="px-2 py-2 text-center text-red-500">{standing.lost}</td>
                    <td className="px-2 py-2 text-center font-bold text-slate-900">{standing.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tags Cloud */}
      {tags.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold mb-3 text-slate-900">Популярные теги</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-500 hover:text-white rounded-full text-sm transition font-medium text-slate-700"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ad Placeholder - Bottom */}
      {showAds && (
        <div className="bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 aspect-[300/600] sticky top-4">
          <ImageIcon className="w-12 h-12 mb-2" />
          <span className="text-sm">Рекламный блок</span>
        </div>
      )}
    </aside>
  )
}
