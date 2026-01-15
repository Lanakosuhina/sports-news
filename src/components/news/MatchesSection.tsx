'use client'

import { SportDBMatch, formatMatchTime, getStatusLabel } from '@/lib/sportdb'
import Link from 'next/link'

interface MatchesSectionProps {
  title: string
  matches: SportDBMatch[]
  leagueLink?: string
}

export default function MatchesSection({ title, matches, leagueLink }: MatchesSectionProps) {
  if (matches.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      {/* League Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {matches.length}
          </span>
          {leagueLink && (
            <Link href={leagueLink} className="text-sm text-blue-500 hover:text-blue-600">
              Все матчи →
            </Link>
          )}
        </div>
      </div>

      {/* Matches */}
      <div className="divide-y divide-slate-100">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center py-3 px-4 hover:bg-slate-50 transition"
          >
            {/* Time and Status */}
            <div className="w-20 flex-shrink-0">
              <div className="text-sm text-slate-500">{formatMatchTime(match.startTime)}</div>
              <div className={`text-xs font-medium ${
                match.status === 'live'
                  ? 'text-red-500'
                  : match.status === 'finished'
                    ? 'text-green-600'
                    : 'text-slate-400'
              }`}>
                {getStatusLabel(match.status)}
              </div>
            </div>

            {/* Home Team */}
            <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
              <span className="font-medium text-slate-900 text-sm truncate">{match.homeTeam.name}</span>
              {match.homeTeam.logo && (
                <img
                  src={match.homeTeam.logo}
                  alt=""
                  className="w-6 h-6 object-contain flex-shrink-0"
                />
              )}
            </div>

            {/* Score */}
            <div className="w-16 flex-shrink-0 mx-2">
              <div className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-sm ${
                match.status === 'live'
                  ? 'bg-red-500 text-white'
                  : match.status === 'finished'
                    ? 'bg-slate-100 text-slate-900'
                    : 'bg-slate-50 text-slate-400'
              }`}>
                <span className="font-bold">
                  {match.homeScore !== null ? match.homeScore : '-'}
                </span>
                <span>:</span>
                <span className="font-bold">
                  {match.awayScore !== null ? match.awayScore : '-'}
                </span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
              {match.awayTeam.logo && (
                <img
                  src={match.awayTeam.logo}
                  alt=""
                  className="w-6 h-6 object-contain flex-shrink-0"
                />
              )}
              <span className="font-medium text-slate-900 text-sm truncate">{match.awayTeam.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
