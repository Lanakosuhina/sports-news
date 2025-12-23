'use client'

import Image from 'next/image'
import { StandingWithTeam } from '@/types'
import { getImageUrl } from '@/lib/utils'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface LeagueStandingsProps {
  standings: StandingWithTeam[]
  title?: string
  compact?: boolean
  showGoals?: boolean
}

export default function LeagueStandings({
  standings,
  title = 'Турнирная таблица',
  compact = false,
  showGoals = false,
}: LeagueStandingsProps) {
  if (standings.length === 0) {
    return null
  }

  const getPositionStyle = (position: number) => {
    if (position <= 4) {
      return 'bg-green-500 text-white' // Champions League
    } else if (position <= 6) {
      return 'bg-blue-500 text-white' // Europa League
    } else if (position >= standings.length - 2) {
      return 'bg-red-500 text-white' // Relegation
    }
    return 'bg-slate-100 text-slate-700'
  }

  const getPositionIcon = (position: number, totalTeams: number) => {
    if (position <= 3) {
      return <TrendingUp className="w-3 h-3 text-green-500" />
    } else if (position >= totalTeams - 2) {
      return <TrendingDown className="w-3 h-3 text-red-500" />
    }
    return <Minus className="w-3 h-3 text-slate-300" />
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                #
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Команда
              </th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                И
              </th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                В
              </th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                Н
              </th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                П
              </th>
              {showGoals && (
                <th className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-14">
                  Голы
                </th>
              )}
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                О
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {standings.map((standing, index) => (
              <tr
                key={standing.id}
                className="hover:bg-slate-50 transition"
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${getPositionStyle(standing.position)}`}>
                      {standing.position}
                    </span>
                    {!compact && getPositionIcon(standing.position, standings.length)}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {standing.team.logo ? (
                      <Image
                        src={getImageUrl(standing.team.logo)}
                        alt={standing.team.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-400">
                          {standing.team.shortName?.[0] || standing.team.name[0]}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-slate-900 truncate max-w-[120px]">
                      {compact ? (standing.team.shortName || standing.team.name) : standing.team.name}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-center text-slate-600">
                  {standing.played}
                </td>
                <td className="px-2 py-2.5 text-center text-green-600 font-medium">
                  {standing.won}
                </td>
                <td className="px-2 py-2.5 text-center text-slate-500">
                  {standing.drawn}
                </td>
                <td className="px-2 py-2.5 text-center text-red-500">
                  {standing.lost}
                </td>
                {showGoals && (
                  <td className="px-2 py-2.5 text-center text-slate-600 text-xs">
                    {standing.goalsFor}:{standing.goalsAgainst}
                  </td>
                )}
                <td className="px-2 py-2.5 text-center">
                  <span className="font-bold text-slate-900">
                    {standing.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      {!compact && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Лига чемпионов</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Лига Европы</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Вылет</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
