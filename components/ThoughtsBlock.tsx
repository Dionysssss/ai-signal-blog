import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

export default function ThoughtsBlock({
  thoughtsEn,
  thoughtsZh,
  locale,
}: {
  thoughtsEn: string
  thoughtsZh: string
  locale: Locale
}) {
  const text = locale === 'zh' && thoughtsZh ? thoughtsZh : thoughtsEn

  if (!text) return null

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="kicker">{t('digest.thoughts', locale)}</span>
        <div className="flex-1 border-t border-[var(--color-rule)] border-opacity-20" />
      </div>
      <div className="font-serif text-base leading-relaxed text-[var(--color-ink)] space-y-4 max-w-2xl">
        {text.split('\n').filter(p => p.trim()).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  )
}
