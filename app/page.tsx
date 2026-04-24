import { getEntries, getFeedStats } from '@/lib/miniflux'
import StatsBar from '@/components/StatsBar'
import ArticleList from '@/components/ArticleList'

export const revalidate = 300

export default async function HomePage() {
  const [articles, stats] = await Promise.all([
    getEntries({ limit: 40 }).catch(() => []),
    getFeedStats().catch(() => ({
      totalArticles: 0,
      totalSources: 0,
      weeklyReleases: 0,
      lastUpdated: new Date().toISOString(),
    })),
  ])

  return (
    <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
      <div>
        <div className="mb-8">
          <h1 className="font-serif text-3xl mb-2 tracking-tight">AI Model Releases</h1>
          <p className="text-gray-400 text-sm">
            Aggregated from HuggingFace, OpenAI, Google, arXiv, and more · AI-summarized
          </p>
        </div>
        <StatsBar stats={stats} />
        <ArticleList articles={articles} />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Sources</h3>
            <div className="space-y-2 text-sm text-gray-500">
              {['HuggingFace Blog', 'OpenAI News', 'Google DeepMind', 'arXiv cs.AI', 'arXiv cs.LG', 'arXiv cs.CL', 'Import AI', 'Simon Willison'].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#EBEBEB] pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">About</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              AI Signal tracks model releases and research across major labs.
              Articles are collected via RSS and summarized by Gemini 2.5 Flash Lite.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
