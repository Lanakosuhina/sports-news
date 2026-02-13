'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'

interface BonusTableBookmaker {
  id: string
  name: string
  slug: string
  logo: string | null
  bonus: string | null
  link: string
  promoCode?: string | null
  bonusConditions?: string | null
}

interface BonusTableProps {
  bookmakers: BonusTableBookmaker[]
  title?: string
}

export default function BonusTable({ bookmakers, title }: BonusTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyPromoCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (bookmakers.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-sm font-normal text-slate-500">Букмекер</th>
              <th className="px-6 py-4 text-left text-sm font-normal text-slate-500">Сумма</th>
              <th className="px-6 py-4 text-left text-sm font-normal text-slate-500">Номинал и условия</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {bookmakers.map((bookmaker, index) => (
              <tr
                key={bookmaker.id}
                className={index !== bookmakers.length - 1 ? 'border-b border-slate-100' : ''}
              >
                {/* Bookmaker Logo & Name */}
                <td className="px-6 py-5">
                  <Link
                    href={`/bookmaker/${bookmaker.slug}`}
                    className="flex items-center gap-3 hover:opacity-80 transition"
                  >
                    <div className="w-10 h-10 relative flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden">
                      {bookmaker.logo ? (
                        <Image
                          src={bookmaker.logo}
                          alt={bookmaker.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-400">
                          {bookmaker.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-blue-500 hover:text-blue-600">
                      {bookmaker.name}
                    </span>
                  </Link>
                </td>

                {/* Bonus Amount */}
                <td className="px-6 py-5">
                  <span className="text-lg font-semibold text-slate-900">
                    {bookmaker.bonus || '—'}
                  </span>
                </td>

                {/* Conditions & Promo Code */}
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    {bookmaker.bonusConditions && (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {bookmaker.bonusConditions}
                      </p>
                    )}
                    {bookmaker.promoCode && (
                      <button
                        onClick={() => copyPromoCode(bookmaker.id, bookmaker.promoCode!)}
                        className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 text-sm font-medium transition"
                      >
                        <span>{bookmaker.promoCode}</span>
                        {copiedId === bookmaker.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>

                {/* CTA Button */}
                <td className="px-6 py-5 text-right">
                  <a
                    href={bookmaker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
                  >
                    Получить
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {bookmakers.map((bookmaker, index) => (
          <div
            key={bookmaker.id}
            className={`p-4 ${index !== bookmakers.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            {/* Header: Logo, Name, Amount */}
            <div className="flex items-center justify-between mb-3">
              <Link
                href={`/bookmaker/${bookmaker.slug}`}
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <div className="w-10 h-10 relative flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden">
                  {bookmaker.logo ? (
                    <Image
                      src={bookmaker.logo}
                      alt={bookmaker.name}
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-400">
                      {bookmaker.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-medium text-blue-500">{bookmaker.name}</span>
              </Link>
              <span className="text-lg font-semibold text-slate-900">
                {bookmaker.bonus || '—'}
              </span>
            </div>

            {/* Conditions */}
            {bookmaker.bonusConditions && (
              <p className="text-sm text-slate-700 mb-3">{bookmaker.bonusConditions}</p>
            )}

            {/* Promo Code & Button */}
            <div className="flex items-center gap-3">
              {bookmaker.promoCode && (
                <button
                  onClick={() => copyPromoCode(bookmaker.id, bookmaker.promoCode!)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition"
                >
                  <span className="text-blue-500 font-medium">{bookmaker.promoCode}</span>
                  {copiedId === bookmaker.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              )}
              <a
                href={bookmaker.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${bookmaker.promoCode ? 'flex-1' : 'w-full'} flex items-center justify-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition`}
              >
                Получить
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
