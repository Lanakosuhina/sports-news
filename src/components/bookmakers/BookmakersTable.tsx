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
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm md:text-lg">
          {bookmaker.name.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
      <Image
        src={bookmaker.logo}
        alt={bookmaker.name}
        fill
        className="object-contain p-1"
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
            className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 transition"
          >
            {/* Logo & Name */}
            <div className="flex items-center gap-2 md:gap-3">
              <BookmakerLogo bookmaker={bookmaker} />
              <span className="font-semibold text-slate-900 text-sm md:text-base">{bookmaker.name}</span>
            </div>

            {/* Play/Go Button */}
            <Link
              href={linkToPage ? `/bookmaker/${bookmaker.slug}` : bookmaker.link}
              target={linkToPage ? undefined : "_blank"}
              rel={linkToPage ? undefined : "noopener noreferrer"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition text-sm md:text-base whitespace-nowrap"
            >
              {buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
