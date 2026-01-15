'use client'

import Link from 'next/link'
import { ArticleWithRelations } from '@/types'

interface NewsListTextProps {
  articles: ArticleWithRelations[]
  showCategory?: boolean
}

function formatTime(date: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NewsListText({ articles, showCategory = true }: NewsListTextProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <p className="text-slate-500">Новости пока не опубликованы.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/article/${article.slug}`}
          className="block py-4 hover:bg-slate-50 transition group"
        >
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
            <span>{formatTime(article.publishedAt)}</span>
            {showCategory && article.category && (
              <span className="text-slate-700">{article.category.name}</span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition leading-tight">
            {article.title}
          </h3>
        </Link>
      ))}
    </div>
  )
}
