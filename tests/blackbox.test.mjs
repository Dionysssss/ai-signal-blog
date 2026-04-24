/**
 * Blackbox tests for AI Signal blog
 * Tests the live Vercel deployment — no mocks, no internals.
 * Run: node tests/blackbox.test.mjs [BASE_URL]
 */

const BASE = process.argv[2] ?? 'https://ai-signal-blog.vercel.app'

let passed = 0
let failed = 0
const failures = []

async function test(name, fn) {
  try {
    await fn()
    console.log(`  ✅ ${name}`)
    passed++
  } catch (err) {
    console.log(`  ❌ ${name}`)
    console.log(`     ${err.message}`)
    failures.push({ name, error: err.message })
    failed++
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg)
}

function assertShape(obj, fields) {
  for (const [key, type] of Object.entries(fields)) {
    assert(key in obj, `missing field: ${key}`)
    assert(typeof obj[key] === type, `${key} expected ${type}, got ${typeof obj[key]}`)
  }
}

// ─── Pages ────────────────────────────────────────────────────────────────────

console.log('\n📄 Pages')

await test('GET / returns 200', async () => {
  const res = await fetch(`${BASE}/`)
  assert(res.status === 200, `status ${res.status}`)
})

await test('GET / returns HTML with correct title', async () => {
  const res = await fetch(`${BASE}/`)
  const html = await res.text()
  assert(html.includes('AI Signal'), 'missing "AI Signal" in HTML')
  assert(html.includes('AI Model Releases'), 'missing heading')
})

await test('GET /archive returns 200', async () => {
  const res = await fetch(`${BASE}/archive`)
  assert(res.status === 200, `status ${res.status}`)
})

await test('GET /post/770 returns 200', async () => {
  const res = await fetch(`${BASE}/post/770`)
  assert(res.status === 200, `status ${res.status}`)
})

await test('GET /post/99999999 returns 404', async () => {
  const res = await fetch(`${BASE}/post/99999999`)
  assert(res.status === 404, `expected 404, got ${res.status}`)
})

// ─── API /api/feeds ────────────────────────────────────────────────────────────

console.log('\n🔌 API — /api/feeds')

await test('GET /api/feeds returns array', async () => {
  const res = await fetch(`${BASE}/api/feeds`)
  assert(res.status === 200, `status ${res.status}`)
  const data = await res.json()
  assert(Array.isArray(data), 'response is not an array')
  assert(data.length > 0, 'array is empty')
})

await test('GET /api/feeds articles have required fields', async () => {
  const res = await fetch(`${BASE}/api/feeds?limit=5`)
  const articles = await res.json()
  assert(Array.isArray(articles) && articles.length > 0, 'no articles returned')
  for (const a of articles) {
    assertShape(a, { id: 'number', title: 'string', url: 'string', publishedAt: 'string', source: 'string' })
  }
})

await test('GET /api/feeds?limit=5 returns ≤5 articles', async () => {
  const res = await fetch(`${BASE}/api/feeds?limit=5`)
  const data = await res.json()
  assert(Array.isArray(data) && data.length <= 5, `got ${data.length} articles, expected ≤5`)
})

await test('GET /api/feeds sorted newest first', async () => {
  const res = await fetch(`${BASE}/api/feeds?limit=10`)
  const articles = await res.json()
  for (let i = 1; i < articles.length; i++) {
    const prev = new Date(articles[i - 1].publishedAt).getTime()
    const curr = new Date(articles[i].publishedAt).getTime()
    assert(prev >= curr, `articles not sorted descending at index ${i}`)
  }
})

await test('GET /api/feeds?feedId=1 returns HuggingFace articles', async () => {
  const res = await fetch(`${BASE}/api/feeds?feedId=1&limit=5`)
  const articles = await res.json()
  assert(Array.isArray(articles) && articles.length > 0, 'no articles for feedId=1')
  for (const a of articles) {
    assert(a.source === 'huggingface', `expected source=huggingface, got ${a.source}`)
  }
})

await test('GET /api/feeds?feedId=2 returns OpenAI articles', async () => {
  const res = await fetch(`${BASE}/api/feeds?feedId=2&limit=5`)
  const articles = await res.json()
  assert(Array.isArray(articles) && articles.length > 0, 'no articles for feedId=2')
  for (const a of articles) {
    assert(a.source === 'openai', `expected source=openai, got ${a.source}`)
  }
})

await test('GET /api/feeds?feedId=5 returns arxiv articles', async () => {
  const res = await fetch(`${BASE}/api/feeds?feedId=5&limit=5`)
  const articles = await res.json()
  assert(Array.isArray(articles) && articles.length > 0, 'no articles for feedId=5 (arXiv cs.AI)')
  for (const a of articles) {
    assert(a.source === 'arxiv', `expected source=arxiv, got ${a.source}`)
  }
})

await test('GET /api/feeds?stats=true returns stats shape', async () => {
  const res = await fetch(`${BASE}/api/feeds?stats=true`)
  assert(res.status === 200, `status ${res.status}`)
  const data = await res.json()
  assertShape(data, {
    totalArticles: 'number',
    totalSources:  'number',
    weeklyReleases:'number',
    lastUpdated:   'string',
  })
  assert(data.totalArticles > 0, 'totalArticles is 0')
  assert(data.totalSources > 0, 'totalSources is 0')
})

// ─── API /api/revalidate ───────────────────────────────────────────────────────

console.log('\n🔁 API — /api/revalidate')

await test('POST /api/revalidate returns {revalidated: true}', async () => {
  const res = await fetch(`${BASE}/api/revalidate`, { method: 'POST' })
  assert(res.status === 200, `status ${res.status}`)
  const data = await res.json()
  assert(data.revalidated === true, `expected revalidated=true, got ${JSON.stringify(data)}`)
})

await test('GET /api/revalidate returns 405', async () => {
  const res = await fetch(`${BASE}/api/revalidate`, { method: 'GET' })
  assert(res.status === 405, `expected 405, got ${res.status}`)
})

// ─── Content integrity ─────────────────────────────────────────────────────────

console.log('\n📰 Content integrity')

await test('HuggingFace articles have valid URLs', async () => {
  const res = await fetch(`${BASE}/api/feeds?feedId=1&limit=3`)
  const articles = await res.json()
  for (const a of articles) {
    assert(a.url.startsWith('http'), `invalid url: ${a.url}`)
    assert(a.title.length > 0, 'empty title')
  }
})

await test('Article publishedAt is valid ISO date', async () => {
  const res = await fetch(`${BASE}/api/feeds?limit=10`)
  const articles = await res.json()
  for (const a of articles) {
    const d = new Date(a.publishedAt)
    assert(!isNaN(d.getTime()), `invalid date: ${a.publishedAt}`)
  }
})

await test('Article detail page contains article title in HTML', async () => {
  const res = await fetch(`${BASE}/api/feeds?feedId=1&limit=1`)
  const [article] = await res.json()
  const page = await fetch(`${BASE}/post/${article.id}`)
  const html = await page.text()
  // Title should appear somewhere in the rendered HTML
  const firstWords = article.title.split(' ').slice(0, 3).join(' ')
  assert(html.includes(firstWords), `page for post/${article.id} missing title words "${firstWords}"`)
})

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`)
console.log(`Results: ${passed} passed, ${failed} failed`)
if (failures.length > 0) {
  console.log('\nFailed tests:')
  failures.forEach(f => console.log(`  • ${f.name}: ${f.error}`))
  process.exit(1)
} else {
  console.log('All tests passed ✅')
}
