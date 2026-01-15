'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}page=${page}`
  }

  const pages: (number | string)[] = []
  const showEllipsis = totalPages > 7

  if (showEllipsis) {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    }
  } else {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 text-slate-300">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, index) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-3 py-2 rounded-lg transition ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'hover:bg-slate-100'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 text-slate-300">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </nav>
  )
}
