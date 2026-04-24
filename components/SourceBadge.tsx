import type { FeedSource } from '@/lib/types'
import { SOURCE_LABELS, SOURCE_COLORS } from '@/lib/utils'

export default function SourceBadge({ source }: { source: FeedSource }) {
  const { bg, text } = SOURCE_COLORS[source]
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {SOURCE_LABELS[source]}
    </span>
  )
}
