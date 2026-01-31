'use client'

import { SportDBMatch, formatMatchTime, getStatusLabel, getStatusColor } from '@/lib/sportdb'
import { Trophy, Zap } from 'lucide-react'
import Link from 'next/link'

interface LiveMatchesWidgetProps {
  matches: SportDBMatch[]
  title?: string
  showLiveOnly?: boolean
}

export default function LiveMatchesWidget({
  matches,
  title = 'Матчи сегодня',
  showLiveOnly = false
}: LiveMatchesWidgetProps) {
  const filteredMatches = showLiveOnly
    ? matches.filter(m => m.status === 'live')
    : matches

  if (filteredMatches.length === 0) {
    return null
  }

  const liveCount = matches.filter(m => m.status === 'live').length

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showLiveOnly ? (
            <Zap className="w-5 h-5 text-red-500" />
          ) : (
            <Trophy className="w-5 h-5 text-blue-500" />
          )}
          <h3 className="font-semibold">{title}</h3>
        </div>
        {liveCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            {liveCount} LIVE
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {filteredMatches.slice(0, 6).map((match) => (
          <div key={match.id} className="p-4 hover:bg-slate-50 transition">
            {/* League and Status */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">
                {match.league.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {formatMatchTime(match.startTime)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(match.status)}`}>
                  {getStatusLabel(match.status)}
                </span>
              </div>
            </div>

            {/* Match Score */}
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex-1">
                <span className="font-medium text-slate-900 text-sm">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="px-4 text-center min-w-[60px]">
                {match.status === 'scheduled' ? (
                  <span className="text-slate-400 text-sm">VS</span>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-lg font-bold ${
                      match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore
                        ? 'text-green-600'
                        : 'text-slate-900'
                    }`}>
                      {match.homeScore ?? '-'}
                    </span>
                    <span className="text-slate-400">:</span>
                    <span className={`text-lg font-bold ${
                      match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore
                        ? 'text-green-600'
                        : 'text-slate-900'
                    }`}>
                      {match.awayScore ?? '-'}
                    </span>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex-1 text-right">
                <span className="font-medium text-slate-900 text-sm">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <Link
          href="/matches"
          className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center gap-1"
        >
          Все матчи →
        </Link>
      </div>
    </div>
  )
}
