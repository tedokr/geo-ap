import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (resets on redeploy)
const ipRequests = new Map<string, { count: number; date: string }>()

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().split('T')[0]
  const record = ipRequests.get(ip)
  
  if (!record || record.date !== today) {
    ipRequests.set(ip, { count: 1, date: today })
    return { allowed: true, remaining: 2 }
  }
  
  if (record.count >= 3) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  return { allowed: true, remaining: 3 - record.count }
}

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
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
              request.headers.get('x-real-ip') || 'unknown'
  
  const { allowed, remaining } = getRateLimitInfo(ip)
  
  if (!allowed) {
    return NextResponse.json({ 
      error: 'rate_limit',
      message: 'Достигна лимита от 3 проверки на ден. Опитай утре или се регистрирай за неограничени проверки.'
    }, { status: 429 })
  }

  const domain = request.nextUrl.searchParams.get('domain')
  if (!domain) return NextResponse.json({ error: 'No domain' }, { status: 400 })

  const base = domain.startsWith('http') ? domain : `https://${domain}`

  const [sitemap, robots, llms, homepage] = await Promise.all([
    checkUrl(`${base}/sitemap.xml`),
    checkUrl(`${base}/robots.txt`),
    checkUrl(`${base}/llms.txt`),
    checkUrl(base),
  ])

  const html = homepage.text || ''

  // 1. Sitemap
  const hasSitemap = sitemap.ok && (sitemap.text?.includes('<urlset') || sitemap.text?.includes('<sitemapindex'))

  // 2. robots.txt
  const hasRobots = robots.ok && (robots.text?.length || 0) > 10
  const blocksAI = robots.text?.includes('GPTBot') || robots.text?.includes('ClaudeBot') || robots.text?.includes('PerplexityBot')
  const robotsScore = !hasRobots ? 0 : blocksAI ? 40 : 100

  // 3. llms.txt
  const hasLlms = llms.ok && (llms.text?.length || 0) > 10

  // 4. Schema.org
  const hasSchema = html.includes('application/ld+json') || html.includes('schema.org')
  const hasOrgSchema = html.includes('"Organization"') || html.includes('"LocalBusiness"')
  const schemaScore = !hasSchema ? 0 : hasOrgSchema ? 100 : 60

  // 5. FAQs
  const hasFaqSchema = html.includes('FAQPage')
  const hasFaqContent = html.toLowerCase().includes('faq') || html.toLowerCase().includes('frequently asked')
  const faqScore = hasFaqSchema ? 100 : hasFaqContent ? 60 : 0

  // 6. Meta description
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']{10,})["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']{10,})["'][^>]*name=["']description["']/i)
  const hasMetaDesc = !!metaMatch
  const metaLength = metaMatch?.[1]?.length || 0
  const metaScore = !hasMetaDesc ? 0 : (metaLength >= 120 && metaLength <= 160) ? 100 : 60

  // 7. Social media presence
  const hasFacebook = html.includes('facebook.com') || html.includes('fb.com')
  const hasTwitter = html.includes('twitter.com') || html.includes('x.com')
  const hasLinkedin = html.includes('linkedin.com')
  const hasInstagram = html.includes('instagram.com')
  const socialCount = [hasFacebook, hasTwitter, hasLinkedin, hasInstagram].filter(Boolean).length
  const socialScore = socialCount === 0 ? 0 : socialCount === 1 ? 40 : socialCount === 2 ? 70 : 100

  // 8. Reddit presence
  const hasReddit = html.includes('reddit.com')
  const redditScore = hasReddit ? 100 : 0

  // 9. High authority signals
  const hasSSL = base.startsWith('https')
  const hasCanonical = html.includes('rel="canonical"') || html.includes("rel='canonical'")
  const hasHreflang = html.includes('hreflang')
  const authorityScore = (!hasSSL ? 0 : 40) + (hasCanonical ? 40 : 0) + (hasHreflang ? 20 : 0)

  // 10. Customer reviews
  const hasReviewSchema = html.includes('"Review"') || html.includes('"AggregateRating"')
  const hasReviewPlatform = html.includes('trustpilot') || html.includes('google.com/maps') || html.includes('tripadvisor')
  const reviewScore = hasReviewSchema ? 100 : hasReviewPlatform ? 60 : 0

  // 11. SEO basics
  const hasH1 = html.includes('<h1')
  const hasTitle = html.includes('<title>')
  const hasAltTags = html.includes('alt="') || html.includes("alt='")
  const seoScore = [hasH1, hasTitle, hasMetaDesc, hasAltTags].filter(Boolean).length * 25

  const results = {
    seo: {
      score: seoScore,
      status: seoScore >= 75 ? 'good' : seoScore >= 50 ? 'partial' : 'missing',
      label: 'SEO основи',
      message: seoScore >= 75 ? 'H1, title, meta description и alt tags ✓' : `Липсват: ${[!hasH1 && 'H1 таг', !hasTitle && 'Title', !hasMetaDesc && 'Meta description', !hasAltTags && 'Alt tags'].filter(Boolean).join(', ')}`
    },
    robots: {
      score: robotsScore,
      status: robotsScore >= 75 ? 'good' : robotsScore >= 40 ? 'partial' : 'missing',
      label: 'robots.txt',
      message: !hasRobots ? 'robots.txt не е намерен' : blocksAI ? 'Блокира AI ботове (GPTBot/ClaudeBot)' : 'Конфигуриран правилно за AI ✓'
    },
    faq: {
      score: faqScore,
      status: hasFaqSchema ? 'good' : hasFaqContent ? 'partial' : 'missing',
      label: 'FAQs',
      message: hasFaqSchema ? 'FAQ schema markup намерен ✓' : hasFaqContent ? 'FAQ секция има, но без schema markup' : 'Няма FAQ секция'
    },
    llms: {
      score: hasLlms ? 100 : 0,
      status: hasLlms ? 'good' : 'missing',
      label: 'llms.txt',
      message: hasLlms ? 'llms.txt намерен — AI може да чете съдържанието ✓' : 'llms.txt липсва — AI не може да разбере бизнеса ти'
    },
    sitemap: {
      score: hasSitemap ? 100 : sitemap.ok ? 50 : 0,
      status: hasSitemap ? 'good' : sitemap.ok ? 'partial' : 'missing',
      label: 'XML Sitemap',
      message: hasSitemap ? 'Валиден sitemap.xml ✓' : sitemap.ok ? 'Файлът съществува но е невалиден' : 'sitemap.xml не е намерен'
    },
    social: {
      score: socialScore,
      status: socialScore >= 70 ? 'good' : socialScore >= 40 ? 'partial' : 'missing',
      label: 'Social Media',
      message: socialCount === 0 ? 'Няма линкове към социални мрежи' : `Намерени: ${[hasFacebook && 'Facebook', hasTwitter && 'Twitter/X', hasLinkedin && 'LinkedIn', hasInstagram && 'Instagram'].filter(Boolean).join(', ')}`
    },
    schema: {
      score: schemaScore,
      status: schemaScore >= 75 ? 'good' : schemaScore >= 50 ? 'partial' : 'missing',
      label: 'Schema.org',
      message: !hasSchema ? 'Няма structured data markup' : hasOrgSchema ? 'Organization/LocalBusiness schema ✓' : 'Schema.org намерен, но без Organization markup'
    },
    metaDesc: {
      score: metaScore,
      status: metaScore >= 75 ? 'good' : metaScore >= 50 ? 'partial' : 'missing',
      label: 'Meta Description',
      message: !hasMetaDesc ? 'Няма meta description' : (metaLength >= 120 && metaLength <= 160) ? `Оптимална дължина (${metaLength} символа) ✓` : `Дължина ${metaLength} символа (препоръчително: 120-160)`
    },
    reddit: {
      score: redditScore,
      status: hasReddit ? 'good' : 'missing',
      label: 'Reddit присъствие',
      message: hasReddit ? 'Reddit линк намерен на сайта ✓' : 'Няма Reddit присъствие'
    },
    authority: {
      score: authorityScore,
      status: authorityScore >= 75 ? 'good' : authorityScore >= 40 ? 'partial' : 'missing',
      label: 'Domain Authority сигнали',
      message: `SSL: ${hasSSL ? '✓' : '✗'} | Canonical: ${hasCanonical ? '✓' : '✗'} | Hreflang: ${hasHreflang ? '✓' : '✗'}`
    },
    reviews: {
      score: reviewScore,
      status: reviewScore >= 75 ? 'good' : reviewScore >= 50 ? 'partial' : 'missing',
      label: 'Customer Reviews',
      message: hasReviewSchema ? 'Review schema markup намерен ✓' : hasReviewPlatform ? 'Платформа за отзиви намерена' : 'Няма отзиви или review markup'
    },
  }

  const totalScore = Math.round(
    Object.values(results).reduce((sum, r) => sum + r.score, 0) / Object.keys(results).length
  )

  return NextResponse.json({ 
    domain, 
    totalScore, 
    results,
    remaining,
    scannedAt: new Date().toISOString()
  })
}
