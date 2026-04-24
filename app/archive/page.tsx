import { getEntries } from '@/lib/miniflux'
import type { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'

export const revalidate = 300

export default async function ArchivePage() {
  const articles = await getEntries({ limit: 100 }).catch(() => [])

  const byMonth: Record<string, Article[]> = {}
  for (const a of articles) {
    const key = new Date(a.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(a)
  }

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8 tracking-tight">Archive</h1>
      {Object.entries(byMonth).length === 0 ? (
        <p className="text-gray-400">No articles yet.</p>
      ) : (
        Object.entries(byMonth).map(([month, items]) => (
          <section key={month} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4 sticky top-14 bg-white py-2">
              {month}
            </h2>
            {items.map(a => <ArticleCard key={a.id} article={a} />)}
          </section>
        ))
      )}
    </div>
  )
}
