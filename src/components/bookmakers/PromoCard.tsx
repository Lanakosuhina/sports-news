'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'

interface PromoCardProps {
  bookmaker: {
    id: string
    name: string
    slug: string
    logo: string | null
    bonus: string | null
    link: string
    promoImage: string | null
    promoTitle: string | null
    promoDescription: string | null
    promoCode: string | null
    promoExpiry: Date | null
    promoLabel: string | null
  }
}

export default function PromoCard({ bookmaker }: PromoCardProps) {
  const [copied, setCopied] = useState(false)

  const copyPromoCode = async () => {
    if (bookmaker.promoCode) {
      await navigator.clipboard.writeText(bookmaker.promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatExpiry = (date: Date | null) => {
    if (!date) return 'бессрочно'
    const now = new Date()
    const expiry = new Date(date)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) return 'истёк'
    if (diffDays === 1) return 'через 1 день'
    return `через ${diffDays} дней`
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Promo Image / Banner */}
      <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900">
        {bookmaker.promoImage ? (
          <Image
            src={bookmaker.promoImage}
            alt={bookmaker.promoTitle || bookmaker.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white/30">
              {bookmaker.name}
            </span>
          </div>
        )}

        {/* Label badge */}
        {bookmaker.promoLabel && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded">
              {bookmaker.promoLabel}
            </span>
          </div>
        )}

        {/* Promo title overlay */}
        {bookmaker.promoTitle && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-xl font-bold text-white">
              {bookmaker.promoTitle}
            </h3>
          </div>
        )}

        {/* Verified badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-green-500/90 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
            <Check className="w-3 h-3" />
            Проверено
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Logo and Bonus */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 relative flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
            {bookmaker.logo ? (
              <Image
                src={bookmaker.logo}
                alt={bookmaker.name}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-400">
                {bookmaker.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="text-xl font-bold text-slate-900">
            {bookmaker.bonus || 'Бонус'}
          </span>
        </div>

        {/* Description */}
        {bookmaker.promoDescription && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {bookmaker.promoDescription}
          </p>
        )}

        {/* Promo Code */}
        {bookmaker.promoCode && (
          <button
            onClick={copyPromoCode}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg mb-3 transition"
          >
            <span className="font-mono font-medium">{bookmaker.promoCode}</span>
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}

        {/* CTA Button */}
        <Link
          href={bookmaker.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold py-3 rounded-lg transition"
        >
          Получить бонус
        </Link>

        {/* Expiry */}
        <p className="text-center text-slate-400 text-xs mt-3">
          Истекает: {formatExpiry(bookmaker.promoExpiry)}
        </p>
      </div>
    </div>
  )
}
