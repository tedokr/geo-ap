'use client'
import { useState, useEffect, useRef } from 'react'

const C = {
  teal: "#0B4A56", tealDark: "#083542",
  coral: "#FF5A47", mint: "#3ECFB5",
  white: "#FFFFFF", offWhite: "#F0F9FA", lightGray: "#D8EDEF", textMuted: "#4A7A82",
}

const DOMAIN_LIMITS: Record<string, number> = { free: 0, lite: 1, smart: 3, pro: 5 }

async function fetchUserPlan(email: string): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_plans?email=eq.${encodeURIComponent(email)}&select=plan,status`,
      { headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } }
    )
    const data = await res.json()
    if (data?.[0]?.status === 'active') return data[0].plan
    return 'free'
  } catch { return 'free' }
}

const allTabs = [
  { id: 'faqs', label: 'FAQs' },
  { id: 'llms', label: 'llms.txt' },
  { id: 'robots', label: 'robots.txt' },
  { id: 'schema', label: 'Schema.org' },
  { id: 'metadesc', label: 'Meta Description' },
  { id: 'blog', label: 'Blog' },
]

function formatResult(type: string, text: string) {
  if (!text) return ''
  try {
    if (type === 'faqs') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((f: any, i: number) => `Q${i+1}: ${f.question}\nA: ${f.answer}`).join('\n\n') }
    if (type === 'metadesc') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((d: any) => `Option ${d.variant} (${d.length || d.text?.length} chars):\n${d.text}`).join('\n\n') }
    if (type === 'blog') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); const titles = data.titles?.map((t: string, i: number) => `${i+1}. ${t}`).join('\n'); return `TITLES:\n${titles}\n\nOUTLINE:\n${JSON.stringify(data.outline, null, 2)}` }
  } catch {}
  return text.replace(/```json|```/g, '').trim()
}

function ScoreRing({ score }: { score: number }) {
  const color = score > 60 ? "#22c55e" : score > 35 ? C.coral : "#ef4444"
  const r = 28; const circ = 2 * Math.PI * r; const dash = (score / 100) * circ
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke={C.lightGray} strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const }}>
        <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>%</span>
      </div>
    </div>
  )
}

function Logo({ locale }: { locale: string }) {
  return (
    <a href={`/${locale}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5" ry="5" fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: 18, fontWeight: 800, color: C.white }}>findable<span style={{ color: C.coral }}>.app</span></span>
    </a>
  )
}

function getLocaleFromPath() {
  if (typeof window === 'undefined') return 'en'
  const parts = window.location.pathname.split('/')
  return parts[1] === 'bg' ? 'bg' : 'en'
}

const T = {
  en: {
    generator: 'Generator', upgrade: '⬆ Upgrade', profile: 'Profile', logout: 'Logout',
    payment_ok: 'Payment successful!', payment_sub: 'Welcome! Your plan activates automatically.',
    my_profile: 'My Profile', to_scan: 'To scanning',
    account: 'Account', email: 'Email', active_plan: 'Active plan', upgrade_plan: '⬆ Upgrade plan',
    change_password: 'Change password', new_password: 'New password', min_chars: 'Minimum 6 characters',
    save_password: 'Change password', saving: 'Saving...', password_ok: 'Password changed successfully!',
    payment_method: 'Payment method & subscription', payment_desc: 'Manage your card, cancel or change subscription in Stripe.',
    manage_stripe: 'Manage subscription in Stripe', business_profiles: 'Business profiles',
    no_domains: 'No scanned domains yet.', close: 'Close', edit: 'Edit', fill: 'Fill in', save: 'Save',
    dashboard_title: 'findable Dashboard',
    sub_free: 'Free plan — see your domain score', sub_lite: 'LITE plan — 1 domain',
    sub_smart: 'SMART plan — up to 3 domains + content generator',
    sub_pro: 'PRO plan — up to 5 domains + AI mention check + competitor analysis',
    upgrade_tag: 'UPGRADE', upgrade_title: 'See exactly what to fix',
    upgrade_desc: 'With LITE plan you get specific improvement steps', see_plans: 'See plans',
    smart_tag: 'SMART PLAN', smart_title: 'Want step-by-step instructions + ready files?', upgrade_smart: 'Upgrade to SMART',
    pro_tag: 'PRO PLAN', pro_title: '5 domains · AI mention check · Priority support',
    pro_desc: 'See everything included in Pro before upgrading.', upgrade_pro: 'Upgrade to PRO',
    check_domain: 'Check domain', domains_count: 'domains',
    analyze: 'Analyze', scanning: 'Scanning...', checking: 'Checking 14 criteria...',
    scan_error_upgrade: 'Upgrade for more.',
    locked_title: 'Details are locked', locked_sub: 'Get LITE plan to see exactly what to fix',
    recommendations: 'Recommendations', generate_fix: 'Generate fix',
    upgrade_instructions: 'Want step-by-step instructions?',
    my_domains: 'My domains', profile_filled: 'Profile filled', last: 'Last:',
    gen_fix: 'Generate fix', setup_gen: 'Setup & generate', history: 'History', hide: 'Hide',
    scan_history: 'Scan history', generated_content: 'Generated content', back: 'Back', copy: 'Copy',
    good: 'Good AI presence', needs_work: 'Needs improvement', weak: 'Weak AI presence',
    planLabel: { free: 'Free', lite: 'LITE', smart: 'SMART', pro: 'PRO' },
    questionLabels: ['Business name', 'Platform (WordPress, Webflow, Wix...)', 'Describe your business in 20 words', 'Where is your business located', '3 of your competitors'],
    password_error: 'Password must be at least 6 characters.', gens: 'generations',
    contact: 'Contact', contact_title: 'Contact us', contact_name: 'Your name', contact_email: 'Email', contact_message: 'Message', contact_send: 'Send message', contact_sending: 'Sending...', contact_sent: 'Message sent! We will be in touch soon.',
    pro_tools: 'PRO Tools',
    ai_mention_title: 'AI Mention Check',
    ai_mention_desc: 'Check if Claude mentions your business when asked about your category',
    ai_mention_category: 'Business category',
    ai_mention_category_ph: 'e.g. Italian restaurant, web design agency, dental clinic',
    ai_mention_location_ph: 'e.g. Sofia, Bulgaria',
    ai_mention_domain: 'Your domain',
    ai_mention_name: 'Your business name',
    ai_mention_check: 'Check AI mentions',
    ai_mention_checking: 'Checking...',
    ai_mentioned: '🎉 Your business IS mentioned by AI!',
    ai_not_mentioned: '😔 Your business is NOT mentioned by AI',
    ai_position: 'Position in AI response',
    ai_full_response: 'Full AI response',
    ai_query: 'Query used',
    competitor_title: 'Competitor Analysis',
    competitor_desc: 'Compare your AI score against your competitors',
    competitor_domain_ph: 'Your domain (e.g. mybusiness.com)',
    competitor_run: 'Run analysis',
    competitor_running: 'Scanning competitors...',
    competitor_your: 'You',
    competitor_score: 'AI Score',
    competitor_criteria: 'Criteria comparison',
  },
  bg: {
    generator: 'Генератор', upgrade: '⬆ Upgrade', profile: 'Профил', logout: 'Изход',
    payment_ok: 'Плащането е успешно!', payment_sub: 'Добре дошъл! Планът се активира автоматично.',
    my_profile: 'Моят профил', to_scan: 'Към сканирането',
    account: 'Акаунт', email: 'Имейл', active_plan: 'Активен план', upgrade_plan: '⬆ Upgrade план',
    change_password: 'Смяна на парола', new_password: 'Нова парола', min_chars: 'Минимум 6 символа',
    save_password: 'Смени паролата', saving: 'Запазва...', password_ok: 'Паролата е сменена успешно!',
    payment_method: 'Метод на плащане и абонамент', payment_desc: 'Управлявай картата си, спри или промени абонамента директно в Stripe.',
    manage_stripe: 'Управлявай абонамента в Stripe', business_profiles: 'Бизнес профили',
    no_domains: 'Все още нямаш сканирани домейни.', close: 'Затвори', edit: 'Редактирай', fill: 'Попълни', save: 'Запази',
    dashboard_title: 'findable Dashboard',
    sub_free: 'Безплатен план — виж общия скор на домейна си', sub_lite: 'LITE план — 1 домейн',
    sub_smart: 'SMART план — до 3 домейна + генератор на съдържание',
    sub_pro: 'PRO план — до 5 домейна + AI mention check + анализ на конкуренцията',
    upgrade_tag: 'UPGRADE', upgrade_title: 'Виж точно какво да оправиш',
    upgrade_desc: 'С LITE план получаваш конкретни стъпки за подобрение', see_plans: 'Виж плановете',
    smart_tag: 'SMART ПЛАН', smart_title: 'Искаш стъпка по стъпка инструкции + готови файлове?', upgrade_smart: 'Upgrade към SMART',
    pro_tag: 'PRO ПЛАН', pro_title: '5 домейна · AI mention check · Priority support',
    pro_desc: 'Разгледай всичко включено в Pro преди да надградиш.', upgrade_pro: 'Upgrade към PRO',
    check_domain: 'Провери домейн', domains_count: 'домейна',
    analyze: 'Анализирай', scanning: 'Сканирам...', checking: 'Проверяваме 14 критерия...',
    scan_error_upgrade: 'Upgrade за повече.',
    locked_title: 'Детайлите са заключени', locked_sub: 'Вземи LITE план за да видиш какво точно трябва да оправиш',
    recommendations: 'Препоръки за подобрение', generate_fix: 'Генерирай fix',
    upgrade_instructions: 'Искаш стъпка по стъпка инструкции?',
    my_domains: 'Моите домейни', profile_filled: 'Профил попълнен', last: 'Последна:',
    gen_fix: 'Генерирай фикс', setup_gen: 'Настрой и генерирай', history: 'История', hide: 'Скрий',
    scan_history: 'История на сканиранията', generated_content: 'Генерирано съдържание', back: 'Назад', copy: 'Копирай',
    good: 'Добро AI присъствие', needs_work: 'Нужни подобрения', weak: 'Слабо AI присъствие',
    planLabel: { free: 'Безплатен', lite: 'LITE', smart: 'SMART', pro: 'PRO' },
    questionLabels: ['Име на бизнеса', 'На каква платформа е сайтът? (WordPress, Webflow, Wix...)', 'Опиши бизнеса си с 20 думи', 'Където се намира бизнесът ти', '3 твои конкуренти'],
    password_error: 'Паролата трябва да е поне 6 символа.', gens: 'генерации',
    contact: 'Контакт', contact_title: 'Свържи се с нас', contact_name: 'Твоето име', contact_email: 'Имейл', contact_message: 'Съобщение', contact_send: 'Изпрати съобщение', contact_sending: 'Изпращам...', contact_sent: 'Съобщението е изпратено! Скоро ще се свържем.',
    pro_tools: 'PRO Инструменти',
    ai_mention_title: 'AI Mention Check',
    ai_mention_desc: 'Провери дали Claude те споменава при запитване за твоята категория',
    ai_mention_category: 'Категория на бизнеса',
    ai_mention_category_ph: 'напр. италиански ресторант, уеб агенция, зъболекарска клиника',
    ai_mention_location_ph: 'напр. София, България',
    ai_mention_domain: 'Твоят домейн',
    ai_mention_name: 'Име на бизнеса',
    ai_mention_check: 'Провери AI споменавания',
    ai_mention_checking: 'Проверявам...',
    ai_mentioned: '🎉 Твоят бизнес СЕ споменава от AI!',
    ai_not_mentioned: '😔 Твоят бизнес НЕ се споменава от AI',
    ai_position: 'Позиция в AI отговора',
    ai_full_response: 'Пълен AI отговор',
    ai_query: 'Използван запрос',
    competitor_title: 'Анализ на конкуренцията',
    competitor_desc: 'Сравни AI скора си с конкурентите си',
    competitor_domain_ph: 'Твоят домейн (напр. mybusiness.com)',
    competitor_run: 'Стартирай анализа',
    competitor_running: 'Сканирам конкурентите...',
    competitor_your: 'Ти',
    competitor_score: 'AI Скор',
    competitor_criteria: 'Сравнение по критерии',
  }
}

export default function Dashboard() {
  const [locale, setLocale] = useState<'en' | 'bg'>('en')
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [plan, setPlan] = useState<string>('free')
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [activeTab, setActiveTab] = useState<'scan' | 'profile' | 'contact'>('scan')
  const [lockedDomains, setLockedDomains] = useState<{ domain: string, answers: any }[]>([])
  const [newPassword, setNewPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [editingDomainIdx, setEditingDomainIdx] = useState<number | null>(null)
  const [editAnswers, setEditAnswers] = useState<any>({})
  const [domainGenerations, setDomainGenerations] = useState<Record<string, any[]>>({})
  const [viewingGeneration, setViewingGeneration] = useState<{domain: string, gen: any} | null>(null)
  const [viewingTab, setViewingTab] = useState('')
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const planCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // PRO state
  const [mentionDomain, setMentionDomain] = useState("")
  const [mentionName, setMentionName] = useState("")
  const [mentionCategory, setMentionCategory] = useState("")
  const [mentionLocation, setMentionLocation] = useState("")
  const [mentionLoading, setMentionLoading] = useState(false)
  const [mentionResult, setMentionResult] = useState<any>(null)
  const [showFullResponse, setShowFullResponse] = useState(false)
  const [competitorDomain, setCompetitorDomain] = useState("")
  const [competitorLoading, setCompetitorLoading] = useState(false)
  const [competitorResult, setCompetitorResult] = useState<any>(null)

  // Contact state
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [contactSending, setContactSending] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState("")

  useEffect(() => {
    setLocale(getLocaleFromPath())
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setSuccess(true)
      window.history.replaceState({}, '', window.location.pathname)
    }
    const init = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserEmail(user.email)
          setContactEmail(user.email)
          const userPlan = await fetchUserPlan(user.email)
          setPlan(userPlan)
          if (params.get('success') === 'true' && userPlan === 'free') {
            let attempts = 0
            planCheckInterval.current = setInterval(async () => {
              attempts++
              const freshPlan = await fetchUserPlan(user.email!)
              if (freshPlan !== 'free') { setPlan(freshPlan); clearInterval(planCheckInterval.current!) }
              if (attempts >= 10) clearInterval(planCheckInterval.current!)
            }, 3000)
          }
          const stored = localStorage.getItem(`findable_domains_${user.email}`) || localStorage.getItem(`geo_domains_${user.email}`)
          if (stored) {
            const parsed = JSON.parse(stored)
            setLockedDomains(parsed)
            const firstWithAnswers = parsed.find((d: any) => d.answers)
            if (firstWithAnswers?.answers) {
              setMentionDomain(firstWithAnswers.domain)
              setCompetitorDomain(firstWithAnswers.domain)
              setMentionName(firstWithAnswers.answers.q0 || '')
              setMentionLocation(firstWithAnswers.answers.q3 || '')
            }
          }
          const genRes = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/domain_generations?email=eq.${encodeURIComponent(user.email)}&select=domain,generated_at,month,year,content&order=generated_at.desc`,
            { headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } }
          )
          const genData = await genRes.json()
          if (Array.isArray(genData)) {
            const grouped: Record<string, any[]> = {}
            genData.forEach((g: any) => { if (!grouped[g.domain]) grouped[g.domain] = []; grouped[g.domain].push(g) })
            setDomainGenerations(grouped)
          }
        }
      } catch {}
    }
    init()
    return () => { if (planCheckInterval.current) clearInterval(planCheckInterval.current) }
  }, [])

  const t = T[locale]

  const saveLockedDomains = (domains: { domain: string, answers: any }[], email: string) => {
    localStorage.setItem(`findable_domains_${email}`, JSON.stringify(domains))
    setLockedDomains(domains)
  }

  const handleScan = async () => {
    if (!url) return
    const limit = DOMAIN_LIMITS[plan]
    const cleanDomain = url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()
    const alreadyLocked = lockedDomains.find(d => d.domain === cleanDomain)
    if (!alreadyLocked && lockedDomains.length >= limit) {
      setError(`${plan.toUpperCase()} — max ${limit}. ${t.scan_error_upgrade}`)
      return
    }
    setScanning(true); setResult(null); setError("")
    try {
      const res = await fetch(`/api/scan?domain=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.error) { setError(data.message || "Error.") }
      else {
        setResult(data)
        setScanHistory((prev: any[]) => [data, ...prev].slice(0, 5))
        if (!alreadyLocked && userEmail) {
          const updated = [...lockedDomains, { domain: cleanDomain, answers: null }]
          saveLockedDomains(updated, userEmail)
        }
      }
    } catch { setError("Error. Try again.") }
    setScanning(false)
  }

  const handleAiMentionCheck = async () => {
    if (!mentionCategory || !mentionLocation) return
    setMentionLoading(true); setMentionResult(null)
    try {
      const res = await fetch('/api/ai-mention', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain: mentionDomain, businessName: mentionName, businessCategory: mentionCategory, location: mentionLocation }) })
      const data = await res.json()
      setMentionResult(data)
    } catch { setMentionResult({ error: true }) }
    setMentionLoading(false)
  }

  const handleCompetitorScan = async () => {
    if (!competitorDomain) return
    const domainData = lockedDomains.find(d => d.domain === competitorDomain || competitorDomain.includes(d.domain))
    const competitorList = domainData?.answers?.q4 ? domainData.answers.q4.split('\n').filter((c: string) => c.trim()).slice(0, 3) : []
    if (competitorList.length === 0) { setCompetitorResult({ error: 'no_competitors', message: locale === 'en' ? 'Please fill in competitors in your business profile first.' : 'Моля попълни конкурентите в бизнес профила си.' }); return }
    setCompetitorLoading(true); setCompetitorResult(null)
    try {
      const res = await fetch('/api/competitor-scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mainDomain: competitorDomain, competitors: competitorList }) })
      const data = await res.json()
      setCompetitorResult(data)
    } catch { setCompetitorResult({ error: true }) }
    setCompetitorLoading(false)
  }

  const handleSendContact = async () => {
    if (!contactEmail || !contactMessage) return
    setContactSending(true); setContactError("")
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage, created_at: new Date().toISOString() })
      })
      setContactSent(true)
    } catch { setContactError(locale === 'en' ? "Error sending. Please try again." : "Грешка при изпращане. Опитай отново.") }
    setContactSending(false)
  }

  const getTopIssues = (results: any, totalScore: number) => {
    const issues = Object.values(results).filter((r: any) => r.status !== 'good')
    return issues.slice(0, totalScore < 50 ? 2 : 1)
  }

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) { setPasswordMsg(t.password_error); return }
    setSavingPassword(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) setPasswordMsg("Error: " + error.message)
      else { setPasswordMsg(t.password_ok); setNewPassword("") }
    } catch { setPasswordMsg("Error.") }
    setSavingPassword(false)
  }

  const handleSaveAnswers = (idx: number) => {
    const updated = lockedDomains.map((d, i) => i === idx ? { ...d, answers: editAnswers } : d)
    saveLockedDomains(updated, userEmail)
    setEditingDomainIdx(null)
  }

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      await supabase.auth.signOut()
    } catch {}
    window.location.href = `/${locale}`
  }

  const switchLocale = (l: string) => { window.location.href = `/${l}/dashboard` }
  const genLink = (domain: string) => `/${locale}/onboarding?domain=${encodeURIComponent(domain)}&prefill=true`

  if (viewingGeneration) {
    const content = viewingGeneration.gen.content || {}
    const tabs = allTabs.filter(tab => content[tab.id])
    const currentTab = viewingTab || tabs[0]?.id || ''
    return (
      <div style={{ minHeight: '100vh', background: C.offWhite, fontFamily: "'Outfit', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <header style={{ background: C.teal, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Logo locale={locale} />
          <button onClick={() => setViewingGeneration(null)} style={{ background: C.coral, color: C.white, border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>{t.back}</button>
        </header>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.teal, marginBottom: 4 }}>{t.generated_content}</h1>
          <p style={{ color: C.textMuted, marginBottom: 24, fontSize: 14 }}>{viewingGeneration.domain} — {new Date(viewingGeneration.gen.generated_at).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
            {tabs.map(tab => (<button key={tab.id} onClick={() => setViewingTab(tab.id)} style={{ padding: "8px 14px", borderRadius: 8, border: `2px solid ${currentTab === tab.id ? C.coral : C.lightGray}`, background: currentTab === tab.id ? "rgba(255,90,71,0.08)" : C.white, color: C.teal, fontSize: 13, fontWeight: currentTab === tab.id ? 700 : 400, cursor: "pointer" }}>{tab.label}</button>))}
          </div>
          {currentTab && (
            <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.teal, margin: 0 }}>{tabs.find(tab => tab.id === currentTab)?.label}</h2>
                <button onClick={() => navigator.clipboard.writeText(formatResult(currentTab, content[currentTab] || ''))} style={{ background: C.teal, color: C.white, padding: "6px 16px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.copy}</button>
              </div>
              <pre style={{ background: C.offWhite, borderRadius: 10, padding: 16, fontSize: 12, lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: C.teal, maxHeight: 500, border: `1px solid ${C.lightGray}` }}>{formatResult(currentTab, content[currentTab] || '')}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${C.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }

  return (
    <div style={{ minHeight: "100vh", background: C.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <header style={{ background: C.teal, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <Logo locale={locale} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(plan === 'smart' || plan === 'pro') && (
            <a href={`/${locale}/onboarding`} style={{ background: C.coral, color: C.white, padding: "6px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>{t.generator}</a>
          )}
          {plan !== 'pro' && (
            <a href={`/${locale}/upgrade`} style={{ background: "rgba(255,90,71,0.15)", color: C.coral, border: "1px solid rgba(255,90,71,0.3)", padding: "6px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>{t.upgrade}</a>
          )}
          <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 3 }}>
            {(['en', 'bg'] as const).map(l => (
              <button key={l} onClick={() => switchLocale(l)} style={{ padding: "3px 8px", borderRadius: 5, border: "none", cursor: "pointer", background: locale === l ? "rgba(255,255,255,0.2)" : "transparent", color: locale === l ? C.white : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, fontFamily: "'Outfit', sans-serif" }}>{l}</button>
            ))}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" as const }}>{t.planLabel[plan as keyof typeof t.planLabel]}</div>
          <button onClick={() => setActiveTab(activeTab === 'profile' ? 'scan' : 'profile')} style={{ background: activeTab === 'profile' ? C.coral : "rgba(255,255,255,0.12)", color: C.white, border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" as const }}>{t.profile}</button>
          <button onClick={() => setActiveTab(activeTab === 'contact' ? 'scan' : 'contact')} style={{ background: activeTab === 'contact' ? C.coral : "rgba(255,255,255,0.12)", color: C.white, border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" as const }}>{t.contact}</button>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", padding: 0, whiteSpace: "nowrap" as const }}>{t.logout}</button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 16, padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "#166534", fontSize: 16 }}>{t.payment_ok}</div>
            <div style={{ color: "#166534", fontSize: 13 }}>{t.payment_sub}</div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: C.teal, margin: 0 }}>{t.contact_title}</h1>
              <button onClick={() => setActiveTab('scan')} style={{ background: C.coral, color: C.white, border: "none", padding: "8px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>{t.to_scan}</button>
            </div>
            <div style={{ background: C.white, borderRadius: 16, padding: 28, border: `1px solid ${C.lightGray}`, maxWidth: 560 }}>
              {contactSent ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: C.teal, fontSize: 16, fontWeight: 600 }}>{t.contact_sent}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>{t.contact_name}</div>
                    <input value={contactName} onChange={e => setContactName(e.target.value)} style={inputStyle} placeholder={locale === 'en' ? "Your name" : "Твоето име"} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>{t.contact_email} *</div>
                    <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" style={inputStyle} placeholder="email@example.com" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>{t.contact_message} *</div>
                    <textarea value={contactMessage} onChange={e => setContactMessage(e.target.value)} rows={5} style={{ ...inputStyle, resize: "none" as const }} placeholder={locale === 'en' ? "How can we help?" : "Как можем да помогнем?"} />
                  </div>
                  {contactError && <div style={{ color: C.coral, fontSize: 13 }}>{contactError}</div>}
                  <button onClick={handleSendContact} disabled={contactSending || !contactEmail || !contactMessage} style={{ background: C.coral, color: C.white, padding: "13px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: contactSending || !contactEmail || !contactMessage ? "not-allowed" : "pointer", opacity: contactSending || !contactEmail || !contactMessage ? 0.6 : 1, fontFamily: "'Outfit', sans-serif" }}>
                    {contactSending ? t.contact_sending : t.contact_send}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" as const }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: C.teal, margin: 0 }}>{t.my_profile}</h1>
              <button onClick={() => setActiveTab('scan')} style={{ background: C.coral, color: C.white, border: "none", padding: "8px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>{t.to_scan}</button>
            </div>
            <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}`, marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 16 }}>{t.account}</h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 1 }}>{t.email}</div>
                  <div style={{ fontSize: 14, color: C.teal, fontWeight: 600, background: C.offWhite, padding: "10px 14px", borderRadius: 8 }}>{userEmail || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 1 }}>{t.active_plan}</div>
                  <div style={{ fontSize: 14, color: C.coral, fontWeight: 700, background: C.offWhite, padding: "10px 14px", borderRadius: 8 }}>{t.planLabel[plan as keyof typeof t.planLabel]}</div>
                </div>
                {plan !== 'pro' && (
                  <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>{t.upgrade_plan}</a>
                )}
              </div>
            </div>
            <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}`, marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 16 }}>{t.change_password}</h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>{t.new_password}</div>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={t.min_chars} style={inputStyle} />
                </div>
                <button onClick={handleChangePassword} disabled={savingPassword} style={{ background: C.coral, color: C.white, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, cursor: savingPassword ? "not-allowed" : "pointer", fontSize: 14, opacity: savingPassword ? 0.7 : 1 }}>
                  {savingPassword ? t.saving : t.save_password}
                </button>
              </div>
              {passwordMsg && <div style={{ marginTop: 10, fontSize: 13, color: passwordMsg.includes(locale === 'bg' ? "успешно" : "successfully") ? "#166534" : "#991b1b" }}>{passwordMsg}</div>}
            </div>
            {plan !== 'free' && (
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}`, marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 8 }}>{t.payment_method}</h2>
                <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 16 }}>{t.payment_desc}</p>
                <a href="https://billing.stripe.com/p/login/test_bpc_1TY3X0EvptFljOFhttCjP2zW" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: C.teal, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>{t.manage_stripe}</a>
              </div>
            )}
            {plan !== 'free' && (
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: C.teal, margin: 0 }}>{t.business_profiles}</h2>
                  <span style={{ fontSize: 12, color: C.textMuted, background: C.offWhite, padding: "4px 10px", borderRadius: 20 }}>{lockedDomains.length}/{DOMAIN_LIMITS[plan]}</span>
                </div>
                {lockedDomains.length === 0 ? (
                  <div style={{ color: C.textMuted, fontSize: 13, textAlign: "center" as const, padding: "20px 0" }}>{t.no_domains}</div>
                ) : (
                  lockedDomains.map((d, idx) => (
                    <div key={d.domain} style={{ marginBottom: 10, border: `1px solid ${C.lightGray}`, borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: C.offWhite }}>
                        <span style={{ fontWeight: 700, color: C.teal, fontSize: 14 }}>{d.domain}</span>
                        <button onClick={() => { setEditingDomainIdx(editingDomainIdx === idx ? null : idx); setEditAnswers(d.answers || {}) }} style={{ background: C.coral, color: C.white, border: "none", padding: "5px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                          {editingDomainIdx === idx ? t.close : d.answers ? t.edit : t.fill}
                        </button>
                      </div>
                      {editingDomainIdx === idx && (
                        <div style={{ padding: "14px", background: C.white }}>
                          {t.questionLabels.map((q, qi) => (
                            <div key={qi} style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, marginBottom: 5 }}>{q}</div>
                              <input type="text" value={editAnswers[`q${qi}`] || ""} onChange={e => setEditAnswers((prev: any) => ({ ...prev, [`q${qi}`]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.lightGray}`, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                            </div>
                          ))}
                          <button onClick={() => handleSaveAnswers(idx)} style={{ background: C.teal, color: C.white, padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>{t.save}</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* SCAN TAB */}
        {activeTab === 'scan' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: C.teal, marginBottom: 6 }}>{t.dashboard_title}</h1>
              <p style={{ color: C.textMuted, fontSize: 15 }}>
                {plan === 'free' && t.sub_free}{plan === 'lite' && t.sub_lite}
                {plan === 'smart' && t.sub_smart}{plan === 'pro' && t.sub_pro}
              </p>
            </div>

            {plan === 'free' && (
              <div style={{ background: C.teal, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
                <div style={{ color: C.coral, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{t.upgrade_tag}</div>
                <div style={{ color: C.white, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{t.upgrade_title}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 16 }}>{t.upgrade_desc}</div>
                <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>{t.see_plans}</a>
              </div>
            )}
            {plan === 'lite' && (
              <div style={{ background: C.teal, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
                <div style={{ color: C.coral, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{t.smart_tag}</div>
                <div style={{ color: C.white, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.smart_title}</div>
                <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>{t.upgrade_smart}</a>
              </div>
            )}
            {plan === 'smart' && (
              <div style={{ background: C.teal, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
                <div style={{ color: C.coral, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{t.pro_tag}</div>
                <div style={{ color: C.white, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t.pro_title}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 }}>{t.pro_desc}</div>
                <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>{t.upgrade_pro}</a>
              </div>
            )}

            <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}`, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.teal, margin: 0 }}>{t.check_domain}</h2>
                {plan !== 'free' && <span style={{ fontSize: 12, color: C.textMuted, background: C.offWhite, padding: "4px 10px", borderRadius: 20 }}>{lockedDomains.length}/{DOMAIN_LIMITS[plan]} {t.domains_count}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 12 }}>
                <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleScan()} placeholder="example.com" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${C.lightGray}`, fontSize: 16, outline: "none", boxSizing: "border-box" as const }} />
                <button onClick={handleScan} disabled={scanning} style={{ background: C.coral, color: C.white, padding: "14px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: scanning ? "not-allowed" : "pointer", opacity: scanning ? 0.7 : 1, fontFamily: "'Outfit', sans-serif" }}>
                  {scanning ? t.scanning : t.analyze}
                </button>
              </div>
              {scanning && <div style={{ color: C.mint, fontSize: 13, padding: "10px 14px", background: C.offWhite, borderRadius: 8 }}>{t.checking}</div>}
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 14px", color: "#991b1b", fontSize: 13 }}>
                  {error}
                  {error.includes('Upgrade') && <a href={`/${locale}/upgrade`} style={{ display: "block", marginTop: 8, background: C.coral, color: C.white, padding: "8px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, textAlign: "center" as const }}>{t.upgrade}</a>}
                </div>
              )}
            </div>

            {result && (
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}`, marginBottom: 24 }}>
                <div style={{ textAlign: "center" as const, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.lightGray}` }}>
                  <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, color: result.totalScore > 60 ? "#22c55e" : result.totalScore > 35 ? C.coral : "#ef4444" }}>{result.totalScore}%</div>
                  <div style={{ color: C.textMuted, fontSize: 15, marginTop: 8 }}>AI score for <strong style={{ color: C.teal }}>{result.domain}</strong></div>
                  <div style={{ display: "inline-block", marginTop: 10, padding: "6px 14px", borderRadius: 20, background: result.totalScore > 60 ? "#f0fdf4" : result.totalScore > 35 ? "#fff5f4" : "#fef2f2", color: result.totalScore > 60 ? "#166534" : result.totalScore > 35 ? C.coral : "#991b1b", fontSize: 13, fontWeight: 600 }}>
                    {result.totalScore > 60 ? t.good : result.totalScore > 35 ? t.needs_work : t.weak}
                  </div>
                </div>
                {plan === 'free' ? (
                  <div style={{ textAlign: "center" as const, padding: "24px", background: C.offWhite, borderRadius: 14 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 8 }}>{t.locked_title}</div>
                    <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 20 }}>{t.locked_sub}</div>
                    <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>{t.see_plans}</a>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 14 }}>{t.recommendations}</h3>
                    {getTopIssues(result.results, result.totalScore).map((r: any) => (
                      <div key={r.label} style={{ marginBottom: 14, padding: "16px", borderRadius: 12, border: `2px solid ${C.coral}`, background: "rgba(255,90,71,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: C.teal, fontSize: 14 }}>{r.label}</span>
                          <span style={{ fontWeight: 800, color: "#ef4444", fontSize: 13 }}>{r.score}%</span>
                        </div>
                        <div style={{ color: C.textMuted, fontSize: 13, marginBottom: (plan === 'smart' || plan === 'pro') ? 10 : 0 }}>{r.message}</div>
                        {(plan === 'smart' || plan === 'pro') && (
                          <a href={`/${locale}/onboarding`} style={{ display: "block", background: C.coral, color: C.white, padding: "8px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, textAlign: "center" as const, marginTop: 4 }}>{t.generate_fix}</a>
                        )}
                        {plan === 'lite' && (
                          <div style={{ marginTop: 12, background: C.teal, borderRadius: 10, padding: "12px" }}>
                            <div style={{ color: C.white, fontSize: 13, marginBottom: 8 }}>{t.upgrade_instructions}</div>
                            <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "8px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13, textAlign: "center" as const }}>{t.upgrade_smart}</a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {plan !== 'free' && lockedDomains.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: C.teal, marginBottom: 16 }}>{t.my_domains}</h2>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {lockedDomains.map((d) => {
                    const gens = domainGenerations[d.domain] || []
                    const lastGen = gens[0]
                    const isExpanded = expandedDomain === d.domain
                    return (
                      <div key={d.domain} style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.lightGray}`, overflow: "hidden" }}>
                        <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🌐</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, color: C.teal, fontSize: 15, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{d.domain}</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                              {d.answers && <span style={{ fontSize: 10, background: "rgba(62,207,181,0.12)", color: C.teal, padding: "2px 7px", borderRadius: 6, fontWeight: 600 }}>{t.profile_filled}</span>}
                              {gens.length > 0 && <span style={{ fontSize: 10, background: "rgba(255,90,71,0.1)", color: C.coral, padding: "2px 7px", borderRadius: 6, fontWeight: 600 }}>{gens.length} {t.gens}</span>}
                              {lastGen && <span style={{ fontSize: 10, color: C.textMuted }}>{t.last} {new Date(lastGen.generated_at).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB')}</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
                          {(plan === 'smart' || plan === 'pro') && (
                            <a href={genLink(d.domain)} style={{ flex: 1, background: C.coral, color: C.white, padding: "9px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center" as const, display: "block" }}>
                              {d.answers ? t.gen_fix : t.setup_gen}
                            </a>
                          )}
                          {gens.length > 0 && (
                            <button onClick={() => setExpandedDomain(isExpanded ? null : d.domain)} style={{ flex: 1, background: C.offWhite, color: C.teal, border: `1px solid ${C.lightGray}`, padding: "9px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                              {isExpanded ? t.hide : t.history}
                            </button>
                          )}
                        </div>
                        {isExpanded && gens.length > 0 && (
                          <div style={{ borderTop: `1px solid ${C.lightGray}`, padding: "14px 16px" }}>
                            {gens.map((gen: any, gi: number) => (
                              <div key={gi} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: C.offWhite, borderRadius: 10, marginBottom: 8 }}>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{new Date(gen.generated_at).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                  <div style={{ fontSize: 11, color: C.textMuted }}>{new Date(gen.generated_at).toLocaleTimeString(locale === 'bg' ? 'bg-BG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <button onClick={() => { setViewingGeneration({ domain: d.domain, gen }); setViewingTab('') }} style={{ background: C.teal, color: C.white, border: "none", padding: "6px 14px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>{t.history}</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {plan === 'pro' && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: C.teal, margin: 0 }}>{t.pro_tools}</h2>
                  <span style={{ background: C.coral, color: C.white, fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20 }}>PRO</span>
                </div>
                <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}`, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 4 }}>🤖 {t.ai_mention_title}</h3>
                  <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}>{t.ai_mention_desc}</p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, marginBottom: 5 }}>{t.ai_mention_domain}</div>
                        <input value={mentionDomain} onChange={e => setMentionDomain(e.target.value)} placeholder="mybusiness.com" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.lightGray}`, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, marginBottom: 5 }}>{t.ai_mention_name}</div>
                        <input value={mentionName} onChange={e => setMentionName(e.target.value)} placeholder="My Business Name" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.lightGray}`, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, marginBottom: 5 }}>{t.ai_mention_category}</div>
                        <input value={mentionCategory} onChange={e => setMentionCategory(e.target.value)} placeholder={t.ai_mention_category_ph} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.lightGray}`, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, marginBottom: 5 }}>Location</div>
                        <input value={mentionLocation} onChange={e => setMentionLocation(e.target.value)} placeholder={t.ai_mention_location_ph} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.lightGray}`, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleAiMentionCheck} disabled={mentionLoading || !mentionCategory || !mentionLocation} style={{ width: "100%", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: mentionLoading || !mentionCategory || !mentionLocation ? "not-allowed" : "pointer", opacity: mentionLoading || !mentionCategory || !mentionLocation ? 0.6 : 1, fontFamily: "'Outfit', sans-serif" }}>
                    {mentionLoading ? t.ai_mention_checking : t.ai_mention_check}
                  </button>
                  {mentionResult && !mentionResult.error && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ padding: "16px 20px", borderRadius: 12, background: mentionResult.isMentioned ? "#f0fdf4" : "#fef2f2", border: `1px solid ${mentionResult.isMentioned ? "#86efac" : "#fca5a5"}`, marginBottom: 12 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: mentionResult.isMentioned ? "#166534" : "#991b1b" }}>{mentionResult.isMentioned ? t.ai_mentioned : t.ai_not_mentioned}</div>
                        {mentionResult.position && <div style={{ fontSize: 13, color: mentionResult.isMentioned ? "#166534" : "#991b1b", marginTop: 4 }}>{t.ai_position}: #{mentionResult.position}</div>}
                      </div>
                      <button onClick={() => setShowFullResponse(!showFullResponse)} style={{ background: "none", border: `1px solid ${C.lightGray}`, color: C.teal, padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                        {showFullResponse ? '▲' : '▼'} {t.ai_full_response}
                      </button>
                      {showFullResponse && <pre style={{ marginTop: 10, background: C.offWhite, borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: C.teal, maxHeight: 300, overflow: "auto", border: `1px solid ${C.lightGray}` }}>{mentionResult.aiResponse}</pre>}
                    </div>
                  )}
                </div>
                <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}` }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.teal, marginBottom: 4 }}>📊 {t.competitor_title}</h3>
                  <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}>{t.competitor_desc}</p>
                  <div style={{ marginBottom: 12 }}>
                    <select value={competitorDomain} onChange={e => setCompetitorDomain(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.lightGray}`, fontSize: 13, outline: "none", background: C.white }}>
                      <option value="">{t.competitor_domain_ph}</option>
                      {lockedDomains.map(d => <option key={d.domain} value={d.domain}>{d.domain}</option>)}
                    </select>
                  </div>
                  <button onClick={handleCompetitorScan} disabled={competitorLoading || !competitorDomain} style={{ width: "100%", background: C.teal, color: C.white, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: competitorLoading || !competitorDomain ? "not-allowed" : "pointer", opacity: competitorLoading || !competitorDomain ? 0.6 : 1, fontFamily: "'Outfit', sans-serif" }}>
                    {competitorLoading ? t.competitor_running : t.competitor_run}
                  </button>
                  {competitorResult && !competitorResult.error && competitorResult.main && (
                    <div style={{ marginTop: 20 }}>
                      {[competitorResult.main, ...competitorResult.competitors].filter(Boolean).map((d: any, i: number) => (
                        <div key={d.domain} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {i === 0 && <span style={{ background: C.coral, color: C.white, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>{t.competitor_your}</span>}
                              <span style={{ fontWeight: i === 0 ? 700 : 500, color: C.teal, fontSize: 14 }}>{d.domain}</span>
                            </div>
                            <span style={{ fontWeight: 800, color: d.totalScore > 60 ? "#22c55e" : d.totalScore > 35 ? C.coral : "#ef4444", fontSize: 16 }}>{d.totalScore}%</span>
                          </div>
                          <div style={{ height: 8, background: C.lightGray, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: 8, borderRadius: 4, background: i === 0 ? C.coral : d.totalScore > 60 ? "#22c55e" : d.totalScore > 35 ? C.coral : "#ef4444", width: `${d.totalScore}%`, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {competitorResult?.error && <div style={{ marginTop: 12, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 14px", color: "#991b1b", fontSize: 13 }}>{competitorResult.message || (locale === 'en' ? 'Error scanning competitors.' : 'Грешка при сканиране.')}</div>}
                </div>
              </div>
            )}

            {scanHistory.length > 1 && (
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.lightGray}` }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.teal, marginBottom: 16 }}>{t.scan_history}</h2>
                {scanHistory.map((h: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < scanHistory.length - 1 ? `1px solid ${C.lightGray}` : "none" }}>
                    <ScoreRing score={h.totalScore} />
                    <div>
                      <div style={{ fontWeight: 600, color: C.teal, fontSize: 14 }}>{h.domain}</div>
                      <div style={{ color: C.textMuted, fontSize: 12 }}>{new Date(h.scannedAt).toLocaleString(locale === 'bg' ? 'bg-BG' : 'en-GB')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.lightGray}`, textAlign: "center" as const }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            <a href={`/${locale}/privacy`} style={{ color: C.textMuted, textDecoration: "none", marginRight: 16 }}>Privacy Policy</a>
            <a href={`/${locale}/terms`} style={{ color: C.textMuted, textDecoration: "none", marginRight: 16 }}>Terms of Service</a>
            <a href={`/${locale}/imprint`} style={{ color: C.textMuted, textDecoration: "none", marginRight: 16 }}>Imprint</a>
            <button onClick={() => setActiveTab('contact')} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "'Outfit', sans-serif" }}>{t.contact}</button>
          </div>
          <div style={{ fontSize: 11, color: C.lightGray, marginTop: 8 }}>© 2026 findable.app</div>
        </div>
      </div>
    </div>
  )
}
