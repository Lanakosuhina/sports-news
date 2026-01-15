'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArticleWithRelations } from '@/types'

interface NewsListCardsProps {
  articles: ArticleWithRelations[]
  showCategory?: boolean
}

function formatDateTime(date: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  const time = d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateStr = d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
  return `${dateStr}, ${time}`
}

export default function NewsListCards({ articles, showCategory = true }: NewsListCardsProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <p className="text-slate-500">Новости пока не опубликованы.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/article/${article.slug}`}
          className="block bg-white rounded-xl shadow-sm hover:shadow-md transition group overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            {article.featuredImage && (
              <div className="sm:w-48 sm:h-32 w-full h-40 relative flex-shrink-0">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4 flex-1">
              <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                <span>{formatDateTime(article.publishedAt)}</span>
                {showCategory && article.category && (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                    {article.category.name}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition leading-tight line-clamp-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
