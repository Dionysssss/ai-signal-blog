import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import ThoughtsBlock from '@/components/ThoughtsBlock'
import DigestSection from '@/components/DigestSection'

const SUMMARY_API = process.env.SUMMARY_API_URL ?? 'http://163.192.14.127:8090'
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const revalidate = 3600

async function getDigest(date: string) {
  // Try proxy route first (works from Vercel), fall back to direct
  const urls = [
    `${BASE_URL}/api/digest/${date}`,
    `${SUMMARY_API}/digest/${date}`,
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) return res.json()
    } catch {
      continue
    }
  }
  return null
}

export default async function DigestPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const cookieStore = await cookies()
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound()

  const digest = await getDigest(date)
  if (!digest) notFound()

  const displayDate = new Date(date + 'T12:00:00Z').toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="max-w-3xl mx-auto">
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-6 py-3 border-b-2 border-[var(--color-rule)]">
        {digest.prev_date ? (
          <Link href={`/digest/${digest.prev_date}`}
            className="text-xs font-mono text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors">
            ← {digest.prev_date}
          </Link>
        ) : <span />}
        <div className="text-center">
          <div className="font-serif text-2xl">{t('digest.title', locale)}</div>
          <div className="text-xs font-mono text-[var(--color-ink-muted)] mt-0.5">{displayDate}</div>
        </div>
        {digest.next_date ? (
          <Link href={`/digest/${digest.next_date}`}
            className="text-xs font-mono text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors">
            {digest.next_date} →
          </Link>
        ) : <span />}
      </div>

      {/* Today's Thoughts */}
      <ThoughtsBlock
        thoughtsEn={digest.thoughts_en ?? ''}
        thoughtsZh={digest.thoughts_zh ?? ''}
        locale={locale}
      />

      {/* Double rule */}
      <div className="rule-double my-8" />

      {/* Releases & Products */}
      <DigestSection
        title={t('digest.releases', locale)}
        articles={digest.releases ?? []}
        emptyMsg={t('digest.empty', locale)}
      />

      {/* Research */}
      <DigestSection
        title={t('digest.research', locale)}
        articles={digest.research ?? []}
        emptyMsg={t('digest.empty', locale)}
      />

      {/* Community Takes */}
      <DigestSection
        title={t('digest.community', locale)}
        articles={digest.community ?? []}
        emptyMsg={t('digest.empty', locale)}
      />

      {/* Footer nav */}
      <div className="mt-12 pt-6 border-t border-[var(--color-rule)] border-opacity-20 text-center">
        <Link href="/" className="text-xs font-mono text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]">
          ← {t('nav.feed', locale)}
        </Link>
      </div>
    </div>
  )
}
