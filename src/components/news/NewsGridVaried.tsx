import Link from 'next/link'
import Image from 'next/image'
import { ArticleWithRelations } from '@/types'
import { timeAgo, getImageUrl } from '@/lib/utils'

interface NewsGridVariedProps {
  articles: ArticleWithRelations[]
}

function LargeCard({ article }: { article: ArticleWithRelations }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition col-span-2"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
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
      <div className="p-5">
        <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-500 transition line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="text-xs text-slate-500">
          <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}

function SmallCard({ article }: { article: ArticleWithRelations }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex-1 min-w-0">
        <span className="inline-block text-blue-500 text-xs font-medium mb-1">
          {article.category.name}
        </span>
        <h4 className="font-semibold text-slate-900 group-hover:text-blue-500 transition line-clamp-2 text-sm mb-2">
          {article.title}
        </h4>
        <div className="text-xs text-slate-500">
          <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}

function MediumCard({ article }: { article: ArticleWithRelations }) {
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
        <div className="text-xs text-slate-500">
          <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}

export default function NewsGridVaried({ articles }: NewsGridVariedProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <p className="text-slate-500">Статьи пока не опубликованы.</p>
        <p className="text-sm text-slate-400 mt-2">
          Скоро здесь появятся последние спортивные новости!
        </p>
      </div>
    )
  }

  // Separate articles with and without images
  const articlesWithImages = articles.filter(a => a.featuredImage)
  const articlesWithoutImages = articles.filter(a => !a.featuredImage)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Articles with images - large/medium cards */}
      {articlesWithImages.map((article, index) => {
        // First article with image is large (spans 2 columns)
        if (index === 0) {
          return <LargeCard key={article.id} article={article} />
        }
        // Rest are medium cards
        return <MediumCard key={article.id} article={article} />
      })}

      {/* Articles without images - small text-only cards */}
      {articlesWithoutImages.map((article) => (
        <SmallCard key={article.id} article={article} />
      ))}
    </div>
  )
}
