import Link from 'next/link'
import type { Article } from '@/lib/types'
import SourceBadge from './SourceBadge'
import { formatRelativeTime, truncate } from '@/lib/utils'

export default function ArticleCard({ article, featured }: { article: Article; featured?: boolean }) {
  return (
    <article className={`py-5 border-b border-[#EBEBEB] ${featured ? 'border-l-2 border-l-[#1D9E75] pl-4' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <SourceBadge source={article.source} />
        <span className="text-xs text-gray-400">{formatRelativeTime(article.publishedAt)}</span>
        {article.feedTitle && (
          <span className="text-xs text-gray-400">· {article.feedTitle}</span>
        )}
      </div>
      <h2 className="font-serif text-lg leading-snug mb-1">
        <Link href={`/post/${article.id}`} className="hover:text-[#1D9E75] transition-colors">
          {article.title}
        </Link>
      </h2>
      {article.summary && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {truncate(article.summary, 180)}
        </p>
      )}
    </article>
  )
}
