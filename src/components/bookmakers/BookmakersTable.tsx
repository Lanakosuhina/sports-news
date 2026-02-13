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
  reviewsCount: number
  link: string
}

interface BookmakersTableProps {
  bookmakers: Bookmaker[]
  title?: string
  buttonText?: string
  linkToPage?: boolean
  showBonus?: boolean
}

function BookmakerLogo({ bookmaker }: { bookmaker: Bookmaker }) {
  const [hasError, setHasError] = useState(false)

  if (!bookmaker.logo || hasError) {
    return (
      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-lg md:text-xl">
          {bookmaker.name.charAt(0)}
        </span>
      </div>
    )
  }

  return (
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
  )
}

export default function BookmakersTable({
  bookmakers,
  title = 'Легальные букмекерские конторы',
  buttonText = 'Перейти',
  linkToPage = true,
  showBonus = false
}: BookmakersTableProps) {
  if (bookmakers.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {title && (
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {bookmakers.map((bookmaker) => (
          <div
            key={bookmaker.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-slate-50 transition gap-3"
          >
            {/* Logo & Name */}
            <div className="flex items-center gap-3 flex-1">
              <BookmakerLogo bookmaker={bookmaker} />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900 text-base">{bookmaker.name}</span>
                {showBonus && bookmaker.bonusLabel && (
                  <span className="text-xs text-slate-500">{bookmaker.bonusLabel}</span>
                )}
              </div>
            </div>

            {/* Bonus Amount */}
            {showBonus && bookmaker.bonus && (
              <div className="flex items-center">
                <div className="text-center px-3 py-1.5 bg-slate-50 rounded-lg">
                  <div className="text-base font-bold text-slate-900">{bookmaker.bonus}</div>
                  <div className="text-[10px] text-slate-500">Бонус</div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              {/* Забрать button - links to external bookmaker site */}
              {showBonus && bookmaker.bonus && (
                <a
                  href={bookmaker.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm whitespace-nowrap text-center"
                >
                  Забрать
                </a>
              )}
              {/* Перейти button - links to internal page */}
              <Link
                href={linkToPage ? `/bookmaker/${bookmaker.slug}` : bookmaker.link}
                target={linkToPage ? undefined : "_blank"}
                rel={linkToPage ? undefined : "noopener noreferrer"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm whitespace-nowrap text-center"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
