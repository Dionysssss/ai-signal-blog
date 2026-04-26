import { NextRequest, NextResponse } from 'next/server'

const SUMMARY_API = process.env.SUMMARY_API_URL ?? 'http://163.192.14.127:8090'

// GET /api/summaries?ids=1,2,3  — batch fetch summaries
export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids') ?? ''
  if (!ids) return NextResponse.json([])
  try {
    const res = await fetch(`${SUMMARY_API}/summaries?ids=${ids}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return NextResponse.json([])
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json([])
  }
}
