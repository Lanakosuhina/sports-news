'use client'

import { SportDBMatch, formatMatchTime, getStatusLabel, getStatusColor } from '@/lib/sportdb'

interface LiveMatchesTableProps {
  matches: SportDBMatch[]
  title?: string
}

export default function LiveMatchesTable({ matches, title }: LiveMatchesTableProps) {
  if (matches.length === 0) {
    return null
  }

  // Group matches by league
  const matchesByLeague: Record<string, SportDBMatch[]> = {}
  matches.forEach((match) => {
    const leagueKey = match.league.country
      ? `${match.league.country}: ${match.league.name}`
      : match.league.name
    if (!matchesByLeague[leagueKey]) {
      matchesByLeague[leagueKey] = []
    }
    matchesByLeague[leagueKey].push(match)
  })

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {Object.entries(matchesByLeague).map(([league, leagueMatches]) => (
          <div key={league}>
            {/* League Header */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">{league}</span>
            </div>
            {/* Matches */}
            {leagueMatches.map((match) => (
              <div
                key={match.id}
                className="px-4 py-3 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Time & Status */}
                  <div className="flex flex-col items-center w-16 flex-shrink-0">
                    <span className="text-sm font-medium text-slate-700">
                      {formatMatchTime(match.startTime)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${getStatusColor(match.status)}`}>
                      {getStatusLabel(match.status)}
                    </span>
                  </div>

                  {/* Teams & Score */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {/* Home Team */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-900 truncate">
                            {match.homeTeam.name}
                          </span>
                        </div>
                        {/* Away Team */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900 truncate">
                            {match.awayTeam.name}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      {(match.status === 'live' || match.status === 'finished') && (
                        <div className="flex flex-col items-center w-8 flex-shrink-0">
                          <span className={`text-sm font-bold ${match.status === 'live' ? 'text-red-600' : 'text-slate-900'}`}>
                            {match.homeScore ?? '-'}
                          </span>
                          <span className={`text-sm font-bold ${match.status === 'live' ? 'text-red-600' : 'text-slate-900'}`}>
                            {match.awayScore ?? '-'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
