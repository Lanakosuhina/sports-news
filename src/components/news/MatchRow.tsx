'use client'

import { SportDBMatch, formatMatchTime, getStatusLabel } from '@/lib/sportdb'
import Image from 'next/image'

interface MatchRowProps {
  match: SportDBMatch
  showLeague?: boolean
}

export default function MatchRow({ match, showLeague = false }: MatchRowProps) {
  const statusLabel = getStatusLabel(match.status)

  return (
    <div className="flex items-center py-3 px-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0">
      {/* Time and Status */}
      <div className="w-24 flex-shrink-0">
        <div className="text-sm text-slate-500">{formatMatchTime(match.startTime)}</div>
        <div className={`text-xs font-medium ${
          match.status === 'live'
            ? 'text-red-500'
            : match.status === 'finished'
              ? 'text-green-600'
              : 'text-slate-400'
        }`}>
          {statusLabel}
        </div>
      </div>

      {/* Home Team */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <span className="font-medium text-slate-900 text-right">{match.homeTeam.name}</span>
        {match.homeTeam.logo && (
          <Image
            src={match.homeTeam.logo}
            alt={match.homeTeam.name}
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
        )}
      </div>

      {/* Score */}
      <div className="w-20 flex-shrink-0 mx-4">
        <div className={`flex items-center justify-center gap-1 py-1 px-3 rounded ${
          match.status === 'live'
            ? 'bg-red-500 text-white'
            : match.status === 'finished'
              ? 'bg-slate-100'
              : 'bg-slate-50'
        }`}>
          <span className="font-bold text-lg">
            {match.homeScore !== null ? match.homeScore : '-'}
          </span>
          <span className="text-slate-400">:</span>
          <span className="font-bold text-lg">
            {match.awayScore !== null ? match.awayScore : '-'}
          </span>
        </div>
      </div>

      {/* Away Team */}
      <div className="flex-1 flex items-center gap-2">
        {match.awayTeam.logo && (
          <Image
            src={match.awayTeam.logo}
            alt={match.awayTeam.name}
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
        )}
        <span className="font-medium text-slate-900">{match.awayTeam.name}</span>
      </div>

      {/* League (optional) */}
      {showLeague && (
        <div className="w-40 flex-shrink-0 text-right hidden md:block">
          <span className="text-sm text-slate-500">{match.league.name}</span>
        </div>
      )}
    </div>
  )
}
