import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { cookies } from 'next/headers'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import LanguageToggle from '@/components/LanguageToggle'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'AI Signal — Model Release Tracker',
  description: 'Tracking AI model releases from HuggingFace, OpenAI, Anthropic, Google, and more.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale

  return (
    <html lang={locale}>
      <body className={`${geist.variable} antialiased min-h-screen`}>
        <nav className="border-b border-[var(--color-ink)] border-opacity-20">
          <div className="max-w-5xl mx-auto px-4 h-10 flex items-center justify-between">
            <div className="flex gap-5 text-xs font-mono uppercase tracking-widest text-[var(--color-ink-muted)]">
              <a href="/" className="hover:text-[var(--color-ink)] transition-colors">
                {t('nav.feed', locale)}
              </a>
              <a href="/archive" className="hover:text-[var(--color-ink)] transition-colors">
                {t('nav.archive', locale)}
              </a>
              <a href="/digest" className="hover:text-[var(--color-ink)] transition-colors">
                {t('nav.digest', locale)}
              </a>
            </div>
            <LanguageToggle />
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="border-t border-[var(--color-ink)] border-opacity-20 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-4 text-[10px] font-mono text-[var(--color-ink-muted)] flex justify-between">
            <span>{t('footer.powered', locale)}</span>
            <span>© 2026 Steve</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
