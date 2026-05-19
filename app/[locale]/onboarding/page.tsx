'use client'
import { useState, useEffect } from 'react'

const COLORS = {
  navy: "#1B2A4A", blue: "#2E6BAD", orange: "#F5A623",
  white: "#FFFFFF", offWhite: "#F8FAFD", lightGray: "#E8EDF4", textMuted: "#5A6B84",
}

const PLATFORMS = ['WordPress', 'Webflow', 'Wix', 'Shopify', 'Squarespace', 'Custom HTML', 'Other']

function getLocale() {
  if (typeof window === 'undefined') return 'en'
  return window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
}

const T = {
  en: {
    step1: 'Business info', step2: 'Platform', step3: 'Competitors',
    next: 'Next step', back: 'Back', generate: 'Generate', generating: 'Generating content...',
    tell_us: 'Tell us about your business', tell_sub: 'This info will help us generate personalized content',
    domain_label: 'Website domain', name_label: 'Business name', describe_label: 'Describe your business in 20 words',
    location_label: 'Location', location_ph: 'e.g. Sofia, Bulgaria', name_ph: 'e.g. Romano Pizzeria',
    desc_ph: 'e.g. Authentic Italian pizzeria in the center of Sofia', domain_ph: 'example.com',
    platform_title: 'What platform is your website on?', platform_sub: 'Instructions will be tailored to your platform',
    social_label: 'Social media & Google Maps (optional)', social_ph: 'Facebook: https://facebook.com/...',
    competitors_title: 'Who are your competitors?', competitors_sub: "We'll generate better content knowing your competitors",
    competitors_label: '3-5 competitors (optional)', competitors_ph: 'Napoli Pizzeria - napoli.bg',
    prefill_data: 'Loaded data:', ready: 'Ready to generate!',
    ready_sub: 'Personalized SEO content for', on: 'on',
    done_title: 'Done! Content generated', done_sub: 'Everything personalized for', done_sub2: 'View it again from Profile → My domains',
    copy: 'Copy', how_to: 'How to add it to', step_by_step: '— step by step',
    dashboard: 'Dashboard', generate_again: 'Generate again',
    not_logged: 'You are not logged in.', needs_plan: 'A paid plan is required.',
    gen_fix: 'Generate fix for',
  },
  bg: {
    step1: 'Бизнес информация', step2: 'Платформа', step3: 'Конкуренти',
    next: 'Следваща стъпка', back: 'Назад', generate: 'Генерирай', generating: 'Генерирам съдържание...',
    tell_us: 'Разкажи ни за бизнеса си', tell_sub: 'Тази информация ще помогне да генерираме персонализирано съдържание',
    domain_label: 'Домейн на сайта', name_label: 'Име на бизнеса', describe_label: 'Опиши бизнеса си с 20 думи',
    location_label: 'Локация', location_ph: 'Примерно: София, България', name_ph: 'Примерно: Пицария Романо',
    desc_ph: 'Примерно: Автентична италианска пицария...', domain_ph: 'example.com',
    platform_title: 'На каква платформа е сайтът ти?', platform_sub: 'Инструкциите ще бъдат адаптирани за твоята платформа',
    social_label: 'Социални мрежи и Google Maps (незадължително)', social_ph: 'Facebook: https://facebook.com/...',
    competitors_title: 'Кои са конкурентите ти?', competitors_sub: 'Ще генерираме по-добро съдържание като знаем конкурентите ти',
    competitors_label: '3-5 конкурента (незадължително)', competitors_ph: 'Пицария Наполи - napoli.bg',
    prefill_data: 'Заредени данни:', ready: 'Готово за генерация!',
    ready_sub: 'Персонализирано SEO съдържание за', on: 'на',
    done_title: 'Готово! Съдържанието е генерирано', done_sub: 'Всичко е персонализирано за', done_sub2: 'Можеш да го видиш отново от Профил → Моите домейни',
    copy: 'Копирай', how_to: 'Как да го сложиш на', step_by_step: '— стъпка по стъпка',
    dashboard: 'Dashboard', generate_again: 'Генерирай отново',
    not_logged: 'Не си логнат.', needs_plan: 'Нужен е платен план.',
    gen_fix: 'Генерирай фикс за',
  }
}

export default function Onboarding() {
  const [locale, setLocale] = useState<'en' | 'bg'>('en')
  const [step, setStep] = useState(1)
  const [info, setInfo] = useState({ name: '', platform: '', description: '', location: '', competitors: '', social: '', domain: '' })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('')
  const [visibleTabs, setVisibleTabs] = useState<{id: string, label: string}[]>([])
  const [error, setError] = useState('')
  const [prefillMode, setPrefillMode] = useState(false)

  const allTabs = [
    { id: 'faqs', label: 'FAQs' },
    { id: 'llms', label: 'llms.txt' },
    { id: 'robots', label: 'robots.txt' },
    { id: 'schema', label: 'Schema.org' },
    { id: 'metadesc', label: 'Meta Description' },
    { id: 'blog', label: 'Blog' },
  ]

  useEffect(() => {
    const l = getLocale()
    setLocale(l as 'en' | 'bg')
    const params = new URLSearchParams(window.location.search)
    const domainParam = params.get('domain')
    const prefill = params.get('prefill') === 'true'
    if (prefill && domainParam) {
      setPrefillMode(true)
      const tryLoad = async () => {
        try {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
          const { data: { user } } = await supabase.auth.getUser()
          if (user?.email) {
            const stored = localStorage.getItem(`geo_domains_${user.email}`)
            if (stored) {
              const domains = JSON.parse(stored)
              const found = domains.find((d: any) => d.domain === domainParam)
              if (found?.answers) {
                const a = found.answers
                setInfo({ domain: domainParam, name: a.q0 || '', platform: a.q1 || '', description: a.q2 || '', location: a.q3 || '', competitors: a.q4 || '', social: a.q5 || '' })
                setStep(3)
              }
            }
          }
        } catch {}
      }
      tryLoad()
    }
  }, [])

  const t = T[locale]

  const checkAndGenerate = async () => {
    setGenerating(true); setError('')
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) { setError(t.not_logged); setGenerating(false); return }
      const planRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_plans?email=eq.${encodeURIComponent(user.email)}&select=plan`, { headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } })
      const planData = await planRes.json()
      const userPlan = planData?.[0]?.plan || 'free'
      const domainLimits: Record<string, number> = { lite: 1, smart: 3, pro: 5 }
      if (!domainLimits[userPlan]) { setError(t.needs_plan); setGenerating(false); return }
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const cleanDomain = info.domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase() || info.name.toLowerCase().replace(/\s/g, '')
      const domainsRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/domain_generations?email=eq.${encodeURIComponent(user.email)}&month=eq.${currentMonth}&year=eq.${currentYear}&select=domain`, { headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } })
      const domainsData = await domainsRes.json()
      const uniqueDomains = [...new Set(domainsData.map((d: any) => d.domain))]
      const generationsForThisDomain = domainsData.filter((d: any) => d.domain === cleanDomain).length
      if (!uniqueDomains.includes(cleanDomain) && uniqueDomains.length >= domainLimits[userPlan]) { setError(`${userPlan.toUpperCase()} — max ${domainLimits[userPlan]} domains.`); setGenerating(false); return }
      if (generationsForThisDomain >= 2) { setError(`Limit reached for ${cleanDomain} this month.`); setGenerating(false); return }
      const types = ['faqs', 'llms', 'robots', 'schema', 'metadesc', 'blog']
      const results: Record<string, string> = {}
      for (const type of types) {
        try {
          const genRes = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, businessInfo: info }) })
          const data = await genRes.json()
          results[type] = data.result || 'Error'
        } catch { results[type] = 'Error' }
      }
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/domain_generations`, { method: 'POST', headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, domain: cleanDomain, month: currentMonth, year: currentYear, content: results }) })
      const shuffled = [...allTabs].sort(() => Math.random() - 0.5).slice(0, 2)
      setVisibleTabs(shuffled); setActiveTab(shuffled[0].id); setGenerated(results); setGenerating(false); setStep(4)
    } catch { setError('Error. Try again.'); setGenerating(false) }
  }

  const formatResult = (type: string, text: string) => {
    if (!text) return ''
    try {
      if (type === 'faqs') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((f: any, i: number) => `Q${i+1}: ${f.question}\nA: ${f.answer}`).join('\n\n') }
      if (type === 'metadesc') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((d: any) => `Option ${d.variant} (${d.length || d.text?.length} chars):\n${d.text}`).join('\n\n') }
      if (type === 'blog') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); const titles = data.titles?.map((tt: string, i: number) => `${i+1}. ${tt}`).join('\n'); return `TITLES:\n${titles}\n\nOUTLINE:\n${JSON.stringify(data.outline, null, 2)}` }
    } catch {}
    return text.replace(/```json|```/g, '').trim()
  }

  const getInstructions = (type: string) => {
    const p = info.platform
    const instr: Record<string, Record<string, string>> = {
      faqs: { WordPress: `WORDPRESS:\n\n1. Plugins → Rank Math SEO → Install\n2. Pages → Edit → + → FAQ Block\n3. Copy Q&A → Update`, Webflow: `WEBFLOW:\n\n1. + → Section → H3 + Paragraph per Q\n2. Page Settings → Custom Code → Schema\n3. Publish`, default: `1. Add FAQ section\n2. Paste Schema before </head>\n3. Publish` },
      llms: { WordPress: `WORDPRESS:\n\n1. WP File Manager → public_html\n2. Upload llms.txt\n3. Check: yoursite.com/llms.txt`, Webflow: `WEBFLOW:\n\n1. Assets → Upload llms.txt\n2. Check: yoursite.com/llms.txt`, default: `1. Save as llms.txt\n2. Upload to public root\n3. Check: yoursite.com/llms.txt` },
      robots: { WordPress: `WORDPRESS:\n\n1. Rank Math → General → Edit robots.txt\n2. Replace → Save\n3. Check: yoursite.com/robots.txt`, Webflow: `WEBFLOW:\n\n1. Project Settings → SEO → robots.txt\n2. Replace → Publish`, default: `1. public_html → robots.txt\n2. Replace content\n3. Check: yoursite.com/robots.txt` },
      schema: { WordPress: `WORDPRESS:\n\n1. Theme Editor → header.php\n2. Paste before </head> → Save`, Webflow: `WEBFLOW:\n\n1. Page Settings → Custom Code → Head\n2. Paste → Publish`, default: `1. Find </head>\n2. Paste before it\n3. Check rich results` },
      metadesc: { WordPress: `WORDPRESS:\n\n1. Pages → Edit → Rank Math → Snippet\n2. Description → paste → Update`, Webflow: `WEBFLOW:\n\n1. Page Settings → SEO → Meta Description\n2. Paste → Publish`, default: `1. SEO Settings → Meta Description\n2. Paste → Save` },
      blog: { WordPress: `WORDPRESS:\n\n1. Posts → Add New\n2. Title + H2 sections\n3. Rank Math Focus Keyword\n4. Publish`, default: `1. New post → title\n2. H2 for each section\n3. Meta description\n4. Publish` }
    }
    const typeInstr = instr[type] || {}
    return typeInstr[p] || typeInstr['default'] || 'Follow your platform documentation.'
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <header style={{ background: COLORS.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href={`/${locale}`} style={{ textDecoration: "none" }}><span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span></a>
        <a href={`/${locale}/dashboard`} style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>Dashboard</a>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 32px" }}>
        {!prefillMode && step < 4 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {[t.step1, t.step2, t.step3].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? "#22c55e" : step === i + 1 ? COLORS.orange : COLORS.lightGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: step >= i + 1 ? COLORS.navy : COLORS.textMuted }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: step === i + 1 ? COLORS.navy : COLORS.textMuted, fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 4, background: COLORS.lightGray, borderRadius: 2 }}>
              <div style={{ width: `${((step - 1) / 2) * 100}%`, height: 4, background: COLORS.orange, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>{t.tell_us}</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>{t.tell_sub}</p>
            {([['domain_label', 'domain', 'domain_ph'], ['name_label', 'name', 'name_ph'], ['location_label', 'location', 'location_ph']] as [keyof typeof t, keyof typeof info, keyof typeof t][]).map(([labelKey, field, phKey]) => (
              <div key={field} style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>{t[labelKey]}</label>
                <input value={info[field]} onChange={e => setInfo({...info, [field]: e.target.value})} placeholder={t[phKey]} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" as const }} />
              </div>
            ))}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>{t.describe_label}</label>
              <textarea value={info.description} onChange={e => setInfo({...info, description: e.target.value})} placeholder={t.desc_ph} rows={3} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" as const, resize: "vertical" as const }} />
            </div>
            <button onClick={() => { if (info.name && info.description && info.location) setStep(2) }} style={{ width: "100%", background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.next}</button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>{t.platform_title}</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>{t.platform_sub}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setInfo({...info, platform: p})} style={{ padding: "16px", borderRadius: 10, border: `2px solid ${info.platform === p ? COLORS.orange : COLORS.lightGray}`, background: info.platform === p ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 15, fontWeight: info.platform === p ? 700 : 400, cursor: "pointer", textAlign: "left" as const, fontFamily: "'Outfit', sans-serif" }}>
                  {info.platform === p ? "✓ " : ""}{p}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>{t.social_label}</label>
              <textarea value={info.social} onChange={e => setInfo({...info, social: e.target.value})} placeholder={t.social_ph} rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const, resize: "vertical" as const }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.back}</button>
              <button onClick={() => { if (info.platform) setStep(3) }} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.next}</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>{prefillMode ? `${t.gen_fix} ${info.domain}` : t.competitors_title}</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>{prefillMode ? t.prefill_data : t.competitors_sub}</p>
            {!prefillMode && (
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>{t.competitors_label}</label>
                <textarea value={info.competitors} onChange={e => setInfo({...info, competitors: e.target.value})} placeholder={t.competitors_ph} rows={5} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const, resize: "vertical" as const }} />
              </div>
            )}
            {prefillMode && (
              <div style={{ background: COLORS.offWhite, borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>{t.prefill_data}</div>
                <div style={{ fontSize: 14, color: COLORS.navy, fontWeight: 600 }}>{info.name} — {info.platform} — {info.location}</div>
              </div>
            )}
            <div style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 4 }}>{t.ready}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 14 }}>{t.ready_sub} {info.name} {t.on} {info.platform}</div>
            </div>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px", marginBottom: 20, color: "#991b1b", fontSize: 14 }}>{error}</div>}
            <div style={{ display: "flex", gap: 12 }}>
              {prefillMode ? (
                <a href={`/${locale}/dashboard`} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600, textAlign: "center" as const, display: "block" }}>{t.back}</a>
              ) : (
                <button onClick={() => setStep(2)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.back}</button>
              )}
              <button onClick={checkAndGenerate} disabled={generating} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.8 : 1, fontFamily: "'Outfit', sans-serif" }}>
                {generating ? t.generating : t.generate}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{ textAlign: "center" as const, marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>{t.done_title}</h1>
              <p style={{ color: COLORS.textMuted, fontSize: 16 }}>{t.done_sub} {info.name} {t.on} {info.platform}</p>
              <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 8 }}>{t.done_sub2}</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
              {visibleTabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 16px", borderRadius: 8, border: `2px solid ${activeTab === tab.id ? COLORS.orange : COLORS.lightGray}`, background: activeTab === tab.id ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: 0 }}>{visibleTabs.find(tab => tab.id === activeTab)?.label}</h2>
                <button onClick={() => navigator.clipboard.writeText(formatResult(activeTab, generated[activeTab] || ''))} style={{ background: COLORS.navy, color: COLORS.white, padding: "8px 20px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.copy}</button>
              </div>
              <pre style={{ background: COLORS.offWhite, borderRadius: 10, padding: 20, fontSize: 13, lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: COLORS.navy, maxHeight: 400, border: `1px solid ${COLORS.lightGray}` }}>
                {formatResult(activeTab, generated[activeTab] || 'Loading...')}
              </pre>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t.how_to} {info.platform} {t.step_by_step}</h3>
              <pre style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap" as const, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                {getInstructions(activeTab)}
              </pre>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <a href={`/${locale}/dashboard`} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600, textAlign: "center" as const, display: "block" }}>{t.dashboard}</a>
              <button onClick={() => { setStep(1); setGenerated({}); setVisibleTabs([]); setActiveTab(''); setPrefillMode(false); setInfo({ name: '', platform: '', description: '', location: '', competitors: '', social: '', domain: '' }) }} style={{ flex: 1, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.generate_again}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
