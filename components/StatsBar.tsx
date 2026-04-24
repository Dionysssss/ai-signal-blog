import type { FeedStats } from '@/lib/types'

export default function StatsBar({ stats }: { stats: FeedStats }) {
  return (
    <div className="flex gap-6 py-4 border-y border-[#EBEBEB] mb-8 text-sm">
      <div>
        <span className="font-semibold text-[#1D9E75]">{stats.totalArticles.toLocaleString()}</span>
        <span className="text-gray-400 ml-1">articles</span>
      </div>
      <div>
        <span className="font-semibold text-[#1D9E75]">{stats.totalSources}</span>
        <span className="text-gray-400 ml-1">sources</span>
      </div>
      <div>
        <span className="font-semibold text-[#1D9E75]">{stats.weeklyReleases}</span>
        <span className="text-gray-400 ml-1">this week</span>
      </div>
    </div>
  )
}
