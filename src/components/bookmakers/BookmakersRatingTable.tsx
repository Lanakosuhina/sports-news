'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Bookmaker {
  id: string
  name: string
  slug: string
  logo: string | null
  bonus: string | null
  bonusLabel: string | null
  playersCount: number
  link: string
}

interface BookmakersRatingTableProps {
  bookmakers: Bookmaker[]
  title?: string
}

function BookmakerLogo({ bookmaker, rank }: { bookmaker: Bookmaker; rank: number }) {
  const [hasError, setHasError] = useState(false)

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500'
    if (rank === 2) return 'bg-slate-400'
    if (rank === 3) return 'bg-amber-600'
    return 'bg-blue-500'
  }

  if (!bookmaker.logo || hasError) {
    return (
      <div className="relative">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-slate-600 font-bold text-lg md:text-xl">
            {bookmaker.name.charAt(0)}
          </span>
        </div>
        {rank <= 3 && (
          <span className={`absolute -top-1 -left-1 w-5 h-5 ${getRankColor(rank)} text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md`}>
            {rank}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="w-12 h-12 md:w-14 md:h-14 relative flex-shrink-0 bg-white rounded-xl overflow-hidden border border-slate-100">
        <Image
          src={bookmaker.logo}
          alt={bookmaker.name}
          fill
          className="object-contain p-2"
          unoptimized
          onError={() => setHasError(true)}
        />
      </div>
      {rank <= 3 && (
        <span className={`absolute -top-1 -left-1 w-5 h-5 ${getRankColor(rank)} text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md`}>
          {rank}
        </span>
      )}
    </div>
  )
}

export default function BookmakersRatingTable({ bookmakers, title = 'Честный рейтинг букмекеров' }: BookmakersRatingTableProps) {
  if (bookmakers.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {title && (
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {bookmakers.map((bookmaker, index) => (
          <div
            key={bookmaker.id}
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            {/* Logo & Name */}
            <div className="flex items-center gap-3">
              <BookmakerLogo bookmaker={bookmaker} rank={index + 1} />
              <span className="font-semibold text-slate-900 text-base">{bookmaker.name}</span>
            </div>

            {/* Details Button */}
            <Link
              href={`/bookmaker/${bookmaker.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm whitespace-nowrap"
            >
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
