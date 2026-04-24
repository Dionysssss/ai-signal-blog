import { NextRequest, NextResponse } from 'next/server'
import { getEntries, getFeedStats } from '@/lib/miniflux'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const limit = Number(searchParams.get('limit') ?? 20)
  const offset = Number(searchParams.get('offset') ?? 0)
  const search = searchParams.get('search') ?? undefined
  const stats = searchParams.get('stats') === 'true'

  try {
    if (stats) {
      const data = await getFeedStats()
      return NextResponse.json(data)
    }
    const articles = await getEntries({ limit, offset, search })
    return NextResponse.json(articles)
  } catch (err) {
    console.error('[api/feeds]', err)
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 502 })
  }
}
