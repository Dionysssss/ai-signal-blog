import { NextRequest, NextResponse } from 'next/server'

const SUMMARY_API = process.env.SUMMARY_API_URL ?? 'http://163.192.14.127:8090'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const res = await fetch(`${SUMMARY_API}/summary/${id}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 })
  }
}
