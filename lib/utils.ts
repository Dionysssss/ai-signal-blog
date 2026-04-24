import type { FeedSource } from './types'

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

export const SOURCE_LABELS: Record<FeedSource, string> = {
  huggingface: 'HuggingFace',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  deepseek: 'DeepSeek',
  google: 'Google',
  mistral: 'Mistral',
  meta: 'Meta AI',
  arxiv: 'arXiv',
  other: 'Other',
}

export const SOURCE_COLORS: Record<FeedSource, { bg: string; text: string }> = {
  huggingface: { bg: 'bg-amber-100', text: 'text-amber-800' },
  openai:      { bg: 'bg-blue-100',  text: 'text-blue-800'  },
  anthropic:   { bg: 'bg-purple-100',text: 'text-purple-800'},
  deepseek:    { bg: 'bg-red-100',   text: 'text-red-800'   },
  google:      { bg: 'bg-green-100', text: 'text-green-800' },
  mistral:     { bg: 'bg-orange-100',text: 'text-orange-800'},
  meta:        { bg: 'bg-sky-100',   text: 'text-sky-800'   },
  arxiv:       { bg: 'bg-gray-100',  text: 'text-gray-700'  },
  other:       { bg: 'bg-gray-100',  text: 'text-gray-600'  },
}
