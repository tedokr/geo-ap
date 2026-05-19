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

async function scanDomain(domain: string) {
  const base = domain.startsWith('http') ? domain : `https://${domain}`

  const [sitemap, robots, llms, homepage] = await Promise.all([
    checkUrl(`${base}/sitemap.xml`),
    checkUrl(`${base}/robots.txt`),
    checkUrl(`${base}/llms.txt`),
    checkUrl(base),
  ])

  const html = homepage.text || ''

  const hasSitemap = sitemap.ok && (sitemap.text?.includes('<urlset') || sitemap.text?.includes('<sitemapindex'))
  const hasRobots = robots.ok && (robots.text?.length || 0) > 10
  const blocksAI = robots.text?.includes('GPTBot') || robots.text?.includes('ClaudeBot')
  const hasLlms = llms.ok && (llms.text?.length || 0) > 10
  const hasSchema = html.includes('application/ld+json') || html.includes('schema.org')
  const hasOrgSchema = html.includes('"Organization"') || html.includes('"LocalBusiness"')
  const hasFaqSchema = html.includes('FAQPage')
  const hasFaqContent = html.toLowerCase().includes('faq') || html.toLowerCase().includes('frequently asked')
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']{10,})["']/i)
  const hasMetaDesc = !!metaMatch
  const metaLength = metaMatch?.[1]?.length || 0
  const hasSSL = base.startsWith('https')
  const hasCanonical = html.includes('rel="canonical"')
  const hasFacebook = html.includes('facebook.com')
  const hasInstagram = html.includes('instagram.com')
  const socialCount = [hasFacebook, hasInstagram, html.includes('twitter.com'), html.includes('linkedin.com')].filter(Boolean).length

  const scores = {
    llms: hasLlms ? 100 : 0,
    sitemap: hasSitemap ? 100 : sitemap.ok ? 50 : 0,
    robots: !hasRobots ? 0 : blocksAI ? 40 : 100,
    schema: !hasSchema ? 0 : hasOrgSchema ? 100 : 60,
    faq: hasFaqSchema ? 100 : hasFaqContent ? 60 : 0,
    metaDesc: !hasMetaDesc ? 0 : (metaLength >= 120 && metaLength <= 160) ? 100 : 60,
    ssl: hasSSL ? 100 : 0,
    canonical: hasCanonical ? 100 : 0,
    social: socialCount === 0 ? 0 : socialCount === 1 ? 40 : socialCount >= 2 ? 80 : 100,
  }

  const totalScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length)

  return { domain, totalScore, scores, reachable: homepage.ok }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { mainDomain, competitors } = body

  if (!mainDomain || !competitors?.length) {
    return NextResponse.json({ error: 'Missing mainDomain or competitors' }, { status: 400 })
  }

  // Limit to 3 competitors max to avoid timeout
  const competitorList = competitors.slice(0, 3)

  try {
    // Scan all domains in parallel
    const [mainResult, ...competitorResults] = await Promise.all([
      scanDomain(mainDomain),
      ...competitorList.map((c: string) => {
        // Extract domain from string like "Competitor Name - competitor.com"
        const domainMatch = c.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/)
        return domainMatch ? scanDomain(domainMatch[0]) : Promise.resolve(null)
      })
    ])

    const validCompetitors = competitorResults.filter(Boolean)

    return NextResponse.json({
      main: mainResult,
      competitors: validCompetitors,
      scannedAt: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Scan failed: ' + String(error) }, { status: 500 })
  }
}
