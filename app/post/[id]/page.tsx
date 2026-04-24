import { notFound } from 'next/navigation'
import { getEntry, getEntries } from '@/lib/miniflux'
import SourceBadge from '@/components/SourceBadge'
import { formatRelativeTime } from '@/lib/utils'
import sanitizeHtml from 'sanitize-html'
import type { Metadata } from 'next'

export const dynamicParams = true

export async function generateStaticParams() {
  const articles = await getEntries({ limit: 50 }).catch(() => [])
  return articles.map(a => ({ id: String(a.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const article = await getEntry(Number(id)).catch(() => null)
  if (!article) return {}
  return {
    title: `${article.title} · AI Signal`,
    description: article.summary,
    openGraph: { title: article.title, description: article.summary },
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getEntry(Number(id)).catch(() => null)
  if (!article) notFound()

  const clean = sanitizeHtml(article.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ['src', 'alt'] },
  })

  const related = await getEntries({ limit: 20 }).then(
    all => all.filter(a => a.source === article.source && a.id !== article.id).slice(0, 3)
  ).catch(() => [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <SourceBadge source={article.source} />
        <span className="text-sm text-gray-400">{formatRelativeTime(article.publishedAt)}</span>
      </div>

      <h1 className="font-serif text-3xl leading-tight mb-6 tracking-tight">{article.title}</h1>

      {article.summary && (
        <div className="border-l-2 border-[#1D9E75] pl-4 bg-[#F8F8F6] py-3 pr-4 rounded-r mb-8 text-sm text-gray-600 leading-relaxed">
          <span className="text-xs font-semibold text-[#1D9E75] uppercase tracking-wider block mb-1">AI Summary</span>
          {article.summary}
        </div>
      )}

      <div
        className="prose prose-sm max-w-none prose-a:text-[#1D9E75] prose-headings:font-serif"
        dangerouslySetInnerHTML={{ __html: clean }}
      />

      <div className="mt-8 pt-6 border-t border-[#EBEBEB]">
        <a href={article.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[#1D9E75] hover:underline">
          Read original article →
        </a>
      </div>

      {related.length > 0 && (
        <div className="mt-12 pt-6 border-t border-[#EBEBEB]">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            More from {article.feedTitle || article.source}
          </h3>
          <ul className="space-y-3">
            {related.map(r => (
              <li key={r.id}>
                <a href={`/post/${r.id}`} className="text-sm hover:text-[#1D9E75] transition-colors">
                  {r.title}
                </a>
                <span className="text-xs text-gray-400 ml-2">{formatRelativeTime(r.publishedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
