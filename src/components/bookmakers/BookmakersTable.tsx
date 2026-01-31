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
  linkToPage = true
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
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            {/* Logo & Name */}
            <div className="flex items-center gap-3">
              <BookmakerLogo bookmaker={bookmaker} />
              <span className="font-semibold text-slate-900 text-base">{bookmaker.name}</span>
            </div>

            {/* Play/Go Button */}
            <Link
              href={linkToPage ? `/bookmaker/${bookmaker.slug}` : bookmaker.link}
              target={linkToPage ? undefined : "_blank"}
              rel={linkToPage ? undefined : "noopener noreferrer"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm whitespace-nowrap"
            >
              {buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
