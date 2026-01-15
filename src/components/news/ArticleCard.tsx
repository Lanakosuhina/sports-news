import Link from 'next/link'
import Image from 'next/image'
import { ArticleWithRelations } from '@/types'
import { timeAgo, getImageUrl, truncate } from '@/lib/utils'

interface ArticleCardProps {
  article: ArticleWithRelations
  variant?: 'default' | 'horizontal' | 'featured' | 'compact'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group relative block rounded-xl overflow-hidden aspect-[16/9] lg:aspect-[21/9]"
      >
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <span className="inline-block bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
            {article.category.name}
          </span>
          <h2 className="text-white text-2xl lg:text-4xl font-bold mb-2 group-hover:text-blue-400 transition line-clamp-2">
            {article.title}
          </h2>
          <p className="text-slate-300 hidden md:block line-clamp-2 mb-3 max-w-3xl">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            {article.author && <span>{article.author.name}</span>}
            <span>•</span>
            <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex gap-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <div className="relative w-48 md:w-64 aspect-[4/3] flex-shrink-0">
          <Image
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 py-4 pr-4">
          <span className="inline-block text-blue-500 text-xs font-medium mb-2">
            {article.category.name}
          </span>
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-500 transition line-clamp-2 mb-2">
            {article.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-3 hidden md:block">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
            <span>•</span>
            <span>{article.views.toLocaleString()} просм.</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex gap-3"
      >
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(article.featuredImage)}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 group-hover:text-blue-500 transition line-clamp-2 text-sm">
            {article.title}
          </h4>
          <span className="text-xs text-slate-500 mt-1 block">
            {timeAgo(article.publishedAt || article.createdAt)}
          </span>
        </div>
      </Link>
    )
  }

  // Default card
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={getImageUrl(article.featuredImage)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
          {article.category.name}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-500 transition line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
          <span>{article.views.toLocaleString()} просм.</span>
        </div>
      </div>
    </Link>
  )
}
