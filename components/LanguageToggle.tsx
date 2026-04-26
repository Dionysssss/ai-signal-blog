'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/i18n'

export default function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Locale | null
    if (stored === 'zh') setLocale('zh')
  }, [])

  function toggle() {
    const next: Locale = locale === 'en' ? 'zh' : 'en'
    setLocale(next)
    localStorage.setItem('lang', next)
    document.cookie = `lang=${next};path=/;max-age=31536000`
    window.location.reload()
  }

  return (
    <button
      onClick={toggle}
      className="text-xs font-mono tracking-widest border border-[var(--color-rule)] px-2 py-0.5 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors"
      title="Switch language"
    >
      {locale === 'en' ? '中文' : 'EN'}
    </button>
  )
}
