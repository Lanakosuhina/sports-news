'use client'

import Link from 'next/link'
import { TrendingUp, Eye, ChevronRight } from 'lucide-react'
import { ArticleWithRelations } from '@/types'
import { timeAgo } from '@/lib/utils'

interface PopularSidebarProps {
  articles: ArticleWithRelations[]
  title?: string
}

export default function PopularSidebar({ articles, title = 'Популярное' }: PopularSidebarProps) {
  if (articles.length === 0) return null

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {articles.slice(0, 5).map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="flex gap-3 p-3 hover:bg-slate-50 transition group"
          >
            <span className="text-xl font-bold text-slate-200 group-hover:text-blue-500 transition w-6 flex-shrink-0">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-900 group-hover:text-blue-500 transition line-clamp-2 text-sm">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">
                  {timeAgo(article.publishedAt || article.createdAt)}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Eye className="w-3 h-3" />
                  {article.views.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-slate-100">
        <Link
          href="/news"
          className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
        >
          Все новости <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
