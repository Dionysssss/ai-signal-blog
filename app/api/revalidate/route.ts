import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const secret = process.env.MINIFLUX_WEBHOOK_SECRET
  if (secret) {
    const sig = req.headers.get('x-miniflux-signature') ?? ''
    const body = await req.text()
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  revalidatePath('/')
  revalidatePath('/archive')
  return NextResponse.json({ revalidated: true, ts: Date.now() })
}
