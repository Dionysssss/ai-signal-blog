import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'AI Signal — Model Release Tracker',
  description: 'Tracking AI model releases from HuggingFace, OpenAI, Anthropic, Google, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <header className="border-b border-[#EBEBEB] sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-serif text-lg tracking-tight">
              AI <span className="text-[#1D9E75]">Signal</span>
            </a>
            <nav className="flex gap-6 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-900 transition-colors">Feed</a>
              <a href="/archive" className="hover:text-gray-900 transition-colors">Archive</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-[#EBEBEB] mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-gray-400 flex justify-between">
            <span>Powered by Miniflux · miniflux-ai · Gemini</span>
            <span>© 2026 Steve</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
