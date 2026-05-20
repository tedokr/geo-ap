'use client'
import { useState, useEffect } from 'react'

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "#0A1628",
  coral:   "#FF5A47",
  coralDk: "#E04535",
  mint:    "#3ECFB5",
  cream:   "#F7F6F2",
  white:   "#FFFFFF",
  border:  "rgba(255,255,255,0.09)",
  borderL: "rgba(10,22,40,0.09)",
  text:    "#0A1628",
  muted:   "#5A6A7A",
  green:   "#22c55e",
}

const PLATFORMS = ['WordPress', 'Webflow', 'Wix', 'Shopify', 'Squarespace', 'Custom HTML', 'Other']

const PLATFORM_ICONS: Record<string, string> = {
  WordPress: '🔷', Webflow: '🌊', Wix: '🔶', Shopify: '🛍️',
  Squarespace: '⬛', 'Custom HTML': '💻', Other: '🔧',
}

function getLocale() {
  if (typeof window === 'undefined') return 'en'
  return window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
}

function Logo({ size = 20 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={size * 1.6} height={size * 1.6} viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5" ry="5" fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: size, fontWeight: 800, color: C.white, fontFamily: "'Outfit', sans-serif" }}>
        faindable<span style={{ color: C.coral }}>.app</span>
      </span>
    </span>
  )
}

const T = {
  en: {
    step1: 'Business', step2: 'Platform', step3: 'Generate',
    next: 'Continue →', back: 'Back', generate: 'Generate content', generating: 'Generating...',
    tell_us: 'Tell us about your business',
    tell_sub: "We'll use this to generate personalized AI visibility content.",
    domain_label: 'Website domain', name_label: 'Business name',
    describe_label: 'Describe your business', location_label: 'Location',
    location_ph: 'e.g. Sofia, Bulgaria', name_ph: 'e.g. Romano Pizzeria',
    desc_ph: 'Authentic Italian pizzeria in the center of Sofia, known for wood-fired pizza',
    domain_ph: 'example.com',
    platform_title: "What platform is your website on?",
    platform_sub: 'Instructions will be tailored to your platform.',
    social_label: 'Social media & Google Maps (optional)',
    social_ph: 'Facebook: https://facebook.com/...\nInstagram: https://instagram.com/...',
    competitors_title: 'Almost there!',
    competitors_sub: "Add competitors to help us generate stronger content (optional).",
    competitors_label: 'Competitors (3–5)',
    competitors_ph: 'Napoli Pizzeria - napoli.bg\nBella Roma - bellaroma.bg',
    prefill_data: 'Loaded from your profile:',
    ready: 'Ready to generate!',
    ready_sub: 'Personalized AI content for',
    done_title: 'Content generated!',
    done_sub: "Here's your personalized content for",
    done_sub2: 'Access it anytime from Dashboard - My domains.',
    copy: 'Copy', how_to: 'How to add to',
    step_by_step: '— step by step',
    dashboard: '← Dashboard', generate_again: 'Generate again',
    not_logged: 'You are not logged in.', needs_plan: 'A paid plan is required.',
    gen_fix: 'Regenerate content for',
    required: 'Please fill in all required fields.',
  },
  bg: {
    step1: 'Бизнес', step2: 'Платформа', step3: 'Генерирай',
    next: 'Напред →', back: 'Назад', generate: 'Генерирай съдържание', generating: 'Генерирам...',
    tell_us: 'Разкажи ни за бизнеса си',
    tell_sub: 'Ще използваме тази информация за персонализирано AI съдържание.',
    domain_label: 'Домейн', name_label: 'Име на бизнеса',
    describe_label: 'Опиши бизнеса си', location_label: 'Локация',
    location_ph: 'София, България', name_ph: 'Пицария Романо',
    desc_ph: 'Автентична италианска пицария в центъра на София, известна с дърводжийска пица',
    domain_ph: 'example.com',
    platform_title: 'На каква платформа е сайтът ти?',
    platform_sub: 'Инструкциите ще бъдат адаптирани за твоята платформа.',
    social_label: 'Социални мрежи и Google Maps (незадължително)',
    social_ph: 'Facebook: https://facebook.com/...\nInstagram: https://instagram.com/...',
    competitors_title: 'Почти готово!',
    competitors_sub: 'Добави конкуренти за по-добро съдържание (незадължително).',
    competitors_label: 'Конкуренти (3–5)',
    competitors_ph: 'Пицария Наполи - napoli.bg\nБела Рома - bellaroma.bg',
    prefill_data: 'Заредено от профила ти:',
    ready: 'Готово за генерация!',
    ready_sub: 'AI съдържание за',
    done_title: 'Съдържанието е готово!',
    done_sub: 'Ето персонализираното ти съдържание за',
    done_sub2: 'Виж го отново от Dashboard - Моите домейни.',
    copy: 'Копирай', how_to: 'Как да го добавиш към',
    step_by_step: '— стъпка по стъпка',
    dashboard: '← Dashboard', generate_again: 'Генерирай отново',
    not_logged: 'Не си влязъл в акаунта.', needs_plan: 'Нужен е платен план.',
    gen_fix: 'Регенерирай за',
    required: 'Попълни всички задължителни полета.',
  }
}

const allTabs = [
  { id: 'faqs', label: 'FAQs', icon: '❓' },
  { id: 'llms', label: 'llms.txt', icon: '🤖' },
  { id: 'robots', label: 'robots.txt', icon: '⚙️' },
  { id: 'schema', label: 'Schema.org', icon: '🏷️' },
  { id: 'metadesc', label: 'Meta Description', icon: '📝' },
  { id: 'blog', label: 'Blog', icon: '✍️' },
]

// ─── Step indicator ─────────────────────────────────────────────────────────────
function StepBar({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 12 }}>
        {labels.map((label, i) => {
          const done = step > i + 1
          const active = step === i + 1
          return (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: done ? C.mint : active ? C.coral : "rgba(255,255,255,0.08)",
                  border: `2px solid ${done ? C.mint : active ? C.coral : "rgba(255,255,255,0.15)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: C.white,
                  transition: "all 0.3s",
                }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? C.white : "rgba(255,255,255,0.35)", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" as const }}>
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <div style={{ width: 80, height: 2, background: done ? C.mint : "rgba(255,255,255,0.08)", margin: "0 8px", marginBottom: 20, transition: "background 0.4s" }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Field component ────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 7, fontFamily: "'Outfit', sans-serif" }}>
        {label}{required && <span style={{ color: C.coral, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: "100%", padding: "13px 16px", borderRadius: 10,
  border: `1.5px solid rgba(10,22,40,0.1)`, fontSize: 14,
  color: C.text, background: C.white, outline: "none",
  boxSizing: "border-box" as const, fontFamily: "'Outfit', sans-serif",
  transition: "border-color 0.2s",
}

export default function Onboarding() {
  const [locale, setLocale] = useState<'en' | 'bg'>('en')
  const [step, setStep] = useState(1)
  const [info, setInfo] = useState({ name: '', platform: '', description: '', location: '', competitors: '', social: '', domain: '' })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('')
  const [visibleTabs, setVisibleTabs] = useState<{ id: string; label: string; icon: string }[]>([])
  const [error, setError] = useState('')
  const [prefillMode, setPrefillMode] = useState(false)
  const [fieldError, setFieldError] = useState('')

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
      if (type === 'faqs') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((f: any, i: number) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`).join('\n\n') }
      if (type === 'metadesc') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((d: any) => `Option ${d.variant} (${d.length || d.text?.length} chars):\n${d.text}`).join('\n\n') }
      if (type === 'blog') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); const titles = data.titles?.map((tt: string, i: number) => `${i + 1}. ${tt}`).join('\n'); return `TITLES:\n${titles}\n\nOUTLINE:\n${JSON.stringify(data.outline, null, 2)}` }
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.navy}; }
        input, textarea { font-family: 'Outfit', sans-serif !important; }
        input::placeholder, textarea::placeholder { color: rgba(10,22,40,0.3); }
        .onb-input:focus, .onb-textarea:focus { border-color: ${C.coral} !important; }
        .platform-btn:hover { border-color: rgba(255,90,71,0.4) !important; }
        @media (max-width: 600px) {
          .platform-grid { grid-template-columns: 1fr 1fr !important; }
          .step-actions { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.navy, position: "relative" }}>
        {/* bg texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

        {/* Header */}
        <header style={{ borderBottom: `1px solid ${C.border}`, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "relative", zIndex: 10, backdropFilter: "blur(8px)" }}>
          <a href={`/${locale}`} style={{ textDecoration: "none" }}><Logo size={18} /></a>
          <a href={`/${locale}/dashboard`} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", fontFamily: "'Outfit', sans-serif" }}>Dashboard</a>
        </header>

        {/* Content */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px", position: "relative", zIndex: 2 }}>

          {/* Step bar — only steps 1-3 */}
          {!prefillMode && step < 4 && (
            <StepBar step={step} labels={[t.step1, t.step2, t.step3]} />
          )}

          {/* ── STEP 1: Business info ─────────────────────────────────── */}
          {step === 1 && (
            <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 30, fontWeight: 900, color: C.navy, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                {t.tell_us}
              </h1>
              <p style={{ color: C.muted, fontSize: 14, margin: "0 0 32px", fontFamily: "'Outfit', sans-serif" }}>{t.tell_sub}</p>

              <Field label={t.domain_label}><input className="onb-input" value={info.domain} onChange={e => setInfo({ ...info, domain: e.target.value })} placeholder={t.domain_ph} style={inputStyle} /></Field>
              <Field label={t.name_label} required><input className="onb-input" value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} placeholder={t.name_ph} style={inputStyle} /></Field>
              <Field label={t.location_label} required><input className="onb-input" value={info.location} onChange={e => setInfo({ ...info, location: e.target.value })} placeholder={t.location_ph} style={inputStyle} /></Field>
              <Field label={t.describe_label} required>
                <textarea className="onb-textarea" value={info.description} onChange={e => setInfo({ ...info, description: e.target.value })} placeholder={t.desc_ph} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
              </Field>

              {fieldError && <div style={{ color: C.coral, fontSize: 13, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>{fieldError}</div>}

              <button onClick={() => {
                if (!info.name || !info.description || !info.location) { setFieldError(t.required); return }
                setFieldError(''); setStep(2)
              }} style={{ width: "100%", background: C.coral, color: C.white, padding: "14px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                {t.next}
              </button>
            </div>
          )}

          {/* ── STEP 2: Platform ──────────────────────────────────────── */}
          {step === 2 && (
            <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 30, fontWeight: 900, color: C.navy, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                {t.platform_title}
              </h1>
              <p style={{ color: C.muted, fontSize: 14, margin: "0 0 28px", fontFamily: "'Outfit', sans-serif" }}>{t.platform_sub}</p>

              <div className="platform-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
                {PLATFORMS.map(p => {
                  const selected = info.platform === p
                  return (
                    <button key={p} className="platform-btn" onClick={() => setInfo({ ...info, platform: p })} style={{
                      padding: "14px 10px", borderRadius: 12,
                      border: `2px solid ${selected ? C.coral : "rgba(10,22,40,0.1)"}`,
                      background: selected ? "rgba(255,90,71,0.06)" : C.cream,
                      color: C.navy, fontSize: 13, fontWeight: selected ? 700 : 500,
                      cursor: "pointer", textAlign: "center" as const,
                      fontFamily: "'Outfit', sans-serif", transition: "all 0.15s",
                      display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6,
                    }}>
                      <span style={{ fontSize: 22 }}>{PLATFORM_ICONS[p]}</span>
                      <span>{p}</span>
                      {selected && <span style={{ color: C.coral, fontSize: 11 }}>✓</span>}
                    </button>
                  )
                })}
              </div>

              <Field label={t.social_label}>
                <textarea className="onb-textarea" value={info.social} onChange={e => setInfo({ ...info, social: e.target.value })} placeholder={t.social_ph} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
              </Field>

              <div className="step-actions" style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: C.cream, color: C.navy, padding: "13px", borderRadius: 12, border: `1.5px solid rgba(10,22,40,0.1)`, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.back}</button>
                <button onClick={() => { if (info.platform) setStep(3) }} style={{ flex: 2, background: C.coral, color: C.white, padding: "13px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.next}</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Competitors / Generate ───────────────────────── */}
          {step === 3 && (
            <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 30, fontWeight: 900, color: C.navy, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                {prefillMode ? `${t.gen_fix} ${info.domain}` : t.competitors_title}
              </h1>
              <p style={{ color: C.muted, fontSize: 14, margin: "0 0 28px", fontFamily: "'Outfit', sans-serif" }}>
                {prefillMode ? t.prefill_data : t.competitors_sub}
              </p>

              {!prefillMode && (
                <Field label={t.competitors_label}>
                  <textarea className="onb-textarea" value={info.competitors} onChange={e => setInfo({ ...info, competitors: e.target.value })} placeholder={t.competitors_ph} rows={4} style={{ ...inputStyle, resize: "vertical" as const }} />
                </Field>
              )}

              {prefillMode && (
                <div style={{ background: C.cream, border: `1px solid rgba(10,22,40,0.08)`, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{t.prefill_data}</div>
                  <div style={{ fontSize: 14, color: C.navy, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{info.name} · {info.platform} · {info.location}</div>
                </div>
              )}

              {/* Ready summary card */}
              <div style={{ background: "rgba(255,90,71,0.05)", border: "1px solid rgba(255,90,71,0.18)", borderRadius: 14, padding: "18px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✦</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.navy, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{t.ready}</div>
                  <div style={{ color: C.muted, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{t.ready_sub} <strong>{info.name}</strong> · {info.platform}</div>
                </div>
              </div>

              {error && (
                <div style={{ background: "#FFF0EF", border: "1px solid rgba(255,90,71,0.25)", borderRadius: 10, padding: "13px 16px", marginBottom: 20, color: C.coral, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{error}</div>
              )}

              <div className="step-actions" style={{ display: "flex", gap: 12 }}>
                {prefillMode
                  ? <a href={`/${locale}/dashboard`} style={{ flex: 1, background: C.cream, color: C.navy, padding: "13px", borderRadius: 12, border: `1.5px solid rgba(10,22,40,0.1)`, fontSize: 14, fontWeight: 600, textDecoration: "none", textAlign: "center" as const, fontFamily: "'Outfit', sans-serif", display: "block" }}>{t.back}</a>
                  : <button onClick={() => setStep(2)} style={{ flex: 1, background: C.cream, color: C.navy, padding: "13px", borderRadius: 12, border: `1.5px solid rgba(10,22,40,0.1)`, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.back}</button>
                }
                <button onClick={checkAndGenerate} disabled={generating} style={{ flex: 2, background: generating ? "rgba(255,90,71,0.5)" : C.coral, color: C.white, padding: "13px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {generating && <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: C.white, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
                  {generating ? t.generating : t.generate}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Results ───────────────────────────────────────── */}
          {step === 4 && (
            <div>
              {/* Success header */}
              <div style={{ textAlign: "center" as const, marginBottom: 36 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(62,207,181,0.15)", border: "2px solid rgba(62,207,181,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✓</div>
                <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 32, fontWeight: 900, color: C.white, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{t.done_title}</h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, fontFamily: "'Outfit', sans-serif" }}>{t.done_sub} <strong style={{ color: C.white }}>{info.name}</strong></p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 6, fontFamily: "'Outfit', sans-serif" }}>{t.done_sub2}</p>
              </div>

              {/* Tab pills */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const, justifyContent: "center" }}>
                {visibleTabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    padding: "9px 18px", borderRadius: 100,
                    border: `1.5px solid ${activeTab === tab.id ? C.coral : C.border}`,
                    background: activeTab === tab.id ? "rgba(255,90,71,0.12)" : "rgba(255,255,255,0.04)",
                    color: activeTab === tab.id ? C.white : "rgba(255,255,255,0.5)",
                    fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400,
                    cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                  }}>
                    <span>{tab.icon}</span>{tab.label}
                  </button>
                ))}
              </div>

              {/* Content card */}
              <div style={{ background: C.white, borderRadius: 20, padding: "28px 28px 24px", marginBottom: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                    {visibleTabs.find(tab => tab.id === activeTab)?.icon}{' '}
                    {visibleTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <button onClick={() => navigator.clipboard.writeText(formatResult(activeTab, generated[activeTab] || ''))} style={{ background: C.navy, color: C.white, padding: "7px 18px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                    {t.copy}
                  </button>
                </div>
                <pre style={{ background: C.cream, borderRadius: 10, padding: "16px 18px", fontSize: 13, lineHeight: 1.7, overflow: "auto", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: C.navy, maxHeight: 380, border: `1px solid rgba(10,22,40,0.08)`, fontFamily: "monospace" }}>
                  {formatResult(activeTab, generated[activeTab] || 'Loading...')}
                </pre>
              </div>

              {/* Instructions card */}
              <div style={{ background: C.navy, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px 28px 24px", marginBottom: 24 }}>
                <h3 style={{ color: C.white, fontSize: 15, fontWeight: 700, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>
                  {t.how_to} {info.platform} {t.step_by_step}
                </h3>
                <pre style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap" as const, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                  {getInstructions(activeTab)}
                </pre>
              </div>

              {/* Action buttons */}
              <div className="step-actions" style={{ display: "flex", gap: 12 }}>
                <a href={`/${locale}/dashboard`} style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: C.white, padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, textDecoration: "none", fontSize: 14, fontWeight: 600, textAlign: "center" as const, fontFamily: "'Outfit', sans-serif", display: "block" }}>
                  {t.dashboard}
                </a>
                <button onClick={() => { setStep(1); setGenerated({}); setVisibleTabs([]); setActiveTab(''); setPrefillMode(false); setInfo({ name: '', platform: '', description: '', location: '', competitors: '', social: '', domain: '' }) }} style={{ flex: 1, background: C.coral, color: C.white, padding: "13px", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                  {t.generate_again}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
