'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MatchWithTeams } from '@/types'
import { formatDate, getImageUrl } from '@/lib/utils'
import { Trophy, Clock, CheckCircle } from 'lucide-react'

interface MatchesTableProps {
  matches: MatchWithTeams[]
  title?: string
  showLeague?: boolean
  variant?: 'recent' | 'upcoming' | 'all'
}

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Запланирован',
  LIVE: 'Live',
  FINISHED: 'Завершён',
  POSTPONED: 'Отложен',
  CANCELLED: 'Отменён',
}

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  LIVE: 'bg-red-500 text-white animate-pulse',
  FINISHED: 'bg-green-100 text-green-700',
  POSTPONED: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
}

export default function MatchesTable({
  matches,
  title = 'Матчи',
  showLeague = true,
  variant = 'all',
}: MatchesTableProps) {
  if (matches.length === 0) {
    return null
  }

  const icon = variant === 'recent' ? (
    <CheckCircle className="w-5 h-5 text-green-500" />
  ) : variant === 'upcoming' ? (
    <Clock className="w-5 h-5 text-blue-500" />
  ) : (
    <Trophy className="w-5 h-5 text-blue-500" />
  )

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="divide-y">
        {matches.map((match) => (
          <div key={match.id} className="p-4 hover:bg-slate-50 transition">
            {/* League & Date */}
            <div className="flex items-center justify-between mb-3">
              {showLeague && (
                <Link
                  href={`/category/football?league=${match.league.slug}`}
                  className="text-xs text-slate-500 hover:text-blue-500 transition"
                >
                  {match.league.name}
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {formatDate(match.matchDate)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[match.status]}`}>
                  {statusLabels[match.status]}
                </span>
              </div>
            </div>

            {/* Match Score */}
            <div className="flex items-center">
              {/* Home Team */}
              <div className="flex-1 flex items-center gap-2">
                {match.homeTeam.logo && (
                  <Image
                    src={getImageUrl(match.homeTeam.logo)}
                    alt={match.homeTeam.name}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                )}
                <span className="font-medium text-sm truncate">
                  {match.homeTeam.shortName || match.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="px-4 text-center">
                {match.status === 'SCHEDULED' ? (
                  <span className="text-slate-400 text-sm">—</span>
                ) : (
                  <div className="flex items-center gap-1">
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
              <div className="flex-1 flex items-center justify-end gap-2">
                <span className="font-medium text-sm truncate">
                  {match.awayTeam.shortName || match.awayTeam.name}
                </span>
                {match.awayTeam.logo && (
                  <Image
                    src={getImageUrl(match.awayTeam.logo)}
                    alt={match.awayTeam.name}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                )}
              </div>
            </div>

            {/* Venue */}
            {match.venue && (
              <div className="text-xs text-slate-400 mt-2 text-center">
                {match.venue}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
