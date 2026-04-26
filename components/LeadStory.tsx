import Link from 'next/link'
import type { Article } from '@/lib/types'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import SourceBadge from './SourceBadge'
import { formatRelativeTime, truncate, SOURCE_LABELS } from '@/lib/utils'

export default function LeadStory({ article, locale }: { article: Article; locale: Locale }) {
  return (
    <div className="py-6 border-b-2 border-[var(--color-rule)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="kicker">{SOURCE_LABELS[article.source]}</span>
        <span className="text-xs text-[var(--color-ink-muted)]">
          {formatRelativeTime(article.publishedAt)}
        </span>
      </div>

      <Link href={`/post/${article.id}`}>
        <h2 className="font-serif text-4xl sm:text-5xl leading-[1.1] tracking-tight mb-4 hover:text-[var(--color-accent)] transition-colors cursor-pointer">
          {article.title}
        </h2>
      </Link>

      {article.summary && (
        <p className="text-base text-[var(--color-ink-muted)] leading-relaxed max-w-3xl mb-3">
          {truncate(article.summary, 300)}
        </p>
      )}

      <Link
        href={`/post/${article.id}`}
        className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] hover:underline"
      >
        {t('article.readOriginal', locale)}
      </Link>
    </div>
  )
}
