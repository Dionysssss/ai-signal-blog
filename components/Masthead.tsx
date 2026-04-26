import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import LanguageToggle from './LanguageToggle'

function editionNumber() {
  const epoch = new Date('2026-04-22').getTime()
  return Math.floor((Date.now() - epoch) / 86400000) + 1
}

export default function Masthead({ locale }: { locale: Locale }) {
  const date = new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const edition = locale === 'zh'
    ? `${t('home.edition', locale)} ${editionNumber()} 期`
    : `${t('home.edition', locale)} ${editionNumber()}`

  return (
    <div className="mb-0">
      {/* Top rule */}
      <div className="border-t-4 border-[var(--color-ink)] mb-1" />

      {/* Main masthead row */}
      <div className="flex items-end justify-between gap-4 py-2">
        <div className="flex-1 text-xs text-[var(--color-ink-muted)] font-mono tracking-wide hidden sm:block">
          {date}
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tighter text-center text-[var(--color-ink)] leading-none">
          AI Signal
        </h1>
        <div className="flex-1 flex items-center justify-end gap-3">
          <span className="text-xs text-[var(--color-ink-muted)] font-mono tracking-wide hidden sm:block">
            {edition}
          </span>
          <LanguageToggle />
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-center text-xs font-mono tracking-[0.2em] uppercase text-[var(--color-ink-muted)] pb-2">
        {t('home.subtitle', locale)}
      </p>

      {/* Double rule */}
      <div className="rule-double" />
    </div>
  )
}
