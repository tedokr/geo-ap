import { NextRequest, NextResponse } from 'next/server'

async function checkUrl(url: string): Promise<{ ok: boolean; status: number; text?: string }> {
  try {
    const res = await fetch(url, { 
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'GEOBot/1.0' }
    })
    const text = await res.text()
    return { ok: res.ok, status: res.status, text }
  } catch {
    return { ok: false, status: 0 }
  }
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get('domain')
  if (!domain) return NextResponse.json({ error: 'No domain' }, { status: 400 })

  const base = domain.startsWith('http') ? domain : `https://${domain}`

  const [sitemap, robots, llms, homepage] = await Promise.all([
    checkUrl(`${base}/sitemap.xml`),
    checkUrl(`${base}/robots.txt`),
    checkUrl(`${base}/llms.txt`),
    checkUrl(base),
  ])

  // Sitemap
  const hasSitemap = sitemap.ok && (sitemap.text?.includes('<urlset') || sitemap.text?.includes('<sitemapindex'))
  
  // Robots.txt
  const hasRobots = robots.ok && robots.text && robots.text.length > 10
  const robotsAIFriendly = hasRobots && !robots.text?.includes('GPTBot') && !robots.text?.includes('ClaudeBot')
  
  // llms.txt
  const hasLlms = llms.ok && llms.text && llms.text.length > 10

  // Schema.org
  const hasSchema = homepage.text?.includes('application/ld+json') || homepage.text?.includes('schema.org')

  // FAQs
  const hasFaq = homepage.text?.includes('FAQPage') || 
    homepage.text?.toLowerCase().includes('faq') ||
    homepage.text?.toLowerCase().includes('frequently asked')

  const results = {
    sitemap: {
      score: hasSitemap ? 100 : sitemap.ok ? 50 : 0,
      status: hasSitemap ? 'good' : sitemap.ok ? 'partial' : 'missing',
      label: 'Sitemap.xml',
      message: hasSitemap ? 'Валиден sitemap намерен ✓' : sitemap.ok ? 'Файлът съществува но е невалиден' : 'Sitemap не е намерен'
    },
    robots: {
      score: hasRobots ? (robotsAIFriendly ? 100 : 60) : 0,
      status: hasRobots ? (robotsAIFriendly ? 'good' : 'partial') : 'missing',
      label: 'robots.txt',
      message: hasRobots ? (robotsAIFriendly ? 'Конфигуриран правилно ✓' : 'Блокира AI ботове') : 'robots.txt не е намерен'
    },
    llms: {
      score: hasLlms ? 100 : 0,
      status: hasLlms ? 'good' : 'missing',
      label: 'llms.txt',
      message: hasLlms ? 'llms.txt намерен ✓' : 'llms.txt липсва — AI не може да чете съдържанието ти'
    },
    schema: {
      score: hasSchema ? 100 : 0,
      status: hasSchema ? 'good' : 'missing',
      label: 'Schema.org',
      message: hasSchema ? 'Structured data намерен ✓' : 'Няма schema.org markup'
    },
    faq: {
      score: hasFaq ? 100 : 0,
      status: hasFaq ? 'good' : 'missing',
      label: 'FAQs',
      message: hasFaq ? 'FAQ секция намерена ✓' : 'Няма FAQ секция'
    }
  }

  const totalScore = Math.round(
    Object.values(results).reduce((sum, r) => sum + r.score, 0) / Object.keys(results).length
  )

  return NextResponse.json({ domain, totalScore, results })
}
