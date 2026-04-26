import { cookies } from 'next/headers'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { getEntries, getFeedStats, getFeedSourceMap } from '@/lib/miniflux'
import Masthead from '@/components/Masthead'
import NewsGrid from '@/components/NewsGrid'

export const revalidate = 300

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale

  const [articles, stats, feedSourceMap] = await Promise.all([
    getEntries({ limit: 40 }).catch(() => []),
    getFeedStats().catch(() => ({
      totalArticles: 0, totalSources: 0, weeklyReleases: 0,
      lastUpdated: new Date().toISOString(),
    })),
    getFeedSourceMap().catch(() => ({} as Record<string, number[]>)),
  ])

  const sourceList = Object.keys(feedSourceMap).filter(s => s !== 'other')

  return (
    <div>
      <Masthead locale={locale} />

      <div className="mt-6 lg:grid lg:grid-cols-[1fr_260px] lg:gap-10">
        {/* Main: filter tabs + lead + grid */}
        <NewsGrid
          articles={articles}
          feedSourceMap={feedSourceMap}
          stats={stats}
          locale={locale}
        />

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-8 pt-10">
            {/* Stats */}
            <div>
              <div className="kicker mb-3">{t('stats.thisWeek', locale)}</div>
              <div className="rule-single mb-3" />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-ink-muted)]">{t('stats.articles', locale)}</dt>
                  <dd className="font-mono font-bold">{stats.totalArticles.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-ink-muted)]">{t('stats.sources', locale)}</dt>
                  <dd className="font-mono font-bold">{stats.totalSources}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-ink-muted)]">{t('stats.thisWeek', locale)}</dt>
                  <dd className="font-mono font-bold">{stats.weeklyReleases}</dd>
                </div>
              </dl>
            </div>

            {/* Sources */}
            <div>
              <div className="kicker mb-3">{t('home.sources', locale)}</div>
              <div className="rule-single mb-3" />
              <ul className="space-y-2">
                {sourceList.map(s => (
                  <li key={s} className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">
                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <div className="kicker mb-3">{t('home.about', locale)}</div>
              <div className="rule-single mb-3" />
              <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                {t('home.aboutText', locale)}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
