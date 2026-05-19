'use client'
import { useState, useEffect, useRef } from 'react'

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  orange: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  lightGray: "#E8EDF4",
  textMuted: "#5A6B84",
}

const DOMAIN_LIMITS: Record<string, number> = {
  free: 0, lite: 1, smart: 3, pro: 5,
}

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
  { id: 'blog', label: 'Blog идеи' },
]

function formatResult(type: string, text: string) {
  if (!text) return ''
  try {
    if (type === 'faqs') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((f: any, i: number) => `Q${i+1}: ${f.question}\nA: ${f.answer}`).join('\n\n') }
    if (type === 'metadesc') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); return data.map((d: any) => `Вариант ${d.variant} (${d.length || d.text?.length} символа):\n${d.text}`).join('\n\n') }
    if (type === 'blog') { const clean = text.replace(/```json|```/g, '').trim(); const data = JSON.parse(clean); const titles = data.titles?.map((t: string, i: number) => `${i+1}. ${t}`).join('\n'); return `ЗАГЛАВИЯ:\n${titles}\n\nСТРУКТУРА НА ПЪРВИЯ ПОСТ:\n${JSON.stringify(data.outline, null, 2)}` }
  } catch {}
  return text.replace(/```json|```/g, '').trim()
}

function ScoreRing({ score }: { score: number }) {
  const color = score > 60 ? "#22c55e" : score > 35 ? "#f59e0b" : "#ef4444"
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke={COLORS.lightGray} strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const }}>
        <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: COLORS.textMuted, fontWeight: 600 }}>%</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [plan, setPlan] = useState<string>('free')
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [activeTab, setActiveTab] = useState<'scan' | 'profile'>('scan')
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setSuccess(true)
      window.history.replaceState({}, '', '/dashboard')
    }
    const init = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserEmail(user.email)
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
          const stored = localStorage.getItem(`geo_domains_${user.email}`)
          if (stored) setLockedDomains(JSON.parse(stored))
          const genRes = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/domain_generations?email=eq.${encodeURIComponent(user.email)}&select=domain,generated_at,month,year,content&order=generated_at.desc`,
            { headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } }
          )
          const genData = await genRes.json()
          if (Array.isArray(genData)) {
            const grouped: Record<string, any[]> = {}
            genData.forEach((g: any) => {
              if (!grouped[g.domain]) grouped[g.domain] = []
              grouped[g.domain].push(g)
            })
            setDomainGenerations(grouped)
          }
        }
      } catch {}
    }
    init()
    return () => { if (planCheckInterval.current) clearInterval(planCheckInterval.current) }
  }, [])

  const saveLockedDomains = (domains: { domain: string, answers: any }[], email: string) => {
    localStorage.setItem(`geo_domains_${email}`, JSON.stringify(domains))
    setLockedDomains(domains)
  }

  const handleScan = async () => {
    if (!url) return
    const limit = DOMAIN_LIMITS[plan]
    const cleanDomain = url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()
    const alreadyLocked = lockedDomains.find(d => d.domain === cleanDomain)
    if (!alreadyLocked && lockedDomains.length >= limit) {
      setError(`С ${plan.toUpperCase()} план можеш да добавиш максимум ${limit} домейн${limit > 1 ? 'а' : ''}. Upgrade за повече.`)
      return
    }
    setScanning(true); setResult(null); setError("")
    try {
      const res = await fetch(`/api/scan?domain=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.error) { setError(data.message || "Грешка при сканиране.") }
      else {
        setResult(data)
        setScanHistory((prev: any[]) => [data, ...prev].slice(0, 5))
        if (!alreadyLocked && userEmail) {
          const updated = [...lockedDomains, { domain: cleanDomain, answers: null }]
          saveLockedDomains(updated, userEmail)
        }
      }
    } catch { setError("Грешка при сканиране. Опитай пак.") }
    setScanning(false)
  }

  const getTopIssues = (results: any, totalScore: number) => {
    const issues = Object.values(results).filter((r: any) => r.status !== 'good')
    return issues.slice(0, totalScore < 50 ? 2 : 1)
  }

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) { setPasswordMsg("Паролата трябва да е поне 6 символа."); return }
    setSavingPassword(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) setPasswordMsg("Грешка: " + error.message)
      else { setPasswordMsg("Паролата е сменена успешно!"); setNewPassword("") }
    } catch { setPasswordMsg("Грешка при смяна на паролата.") }
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
    window.location.href = '/'
  }

  const planLabel: Record<string, string> = { free: 'Безплатен', lite: 'LITE', smart: 'SMART', pro: 'PRO' }
  const questionLabels = ["Име на бизнеса", "На каква платформа е сайтът? (WordPress, Webflow, Wix...)", "Опиши бизнеса си с 20 думи", "Където се намира бизнесът ти", "3 твои конкуренти"]
  const genLink = (domain: string) => "/onboarding?domain=" + encodeURIComponent(domain) + "&prefill=true"

  if (viewingGeneration) {
    const content = viewingGeneration.gen.content || {}
    const tabs = allTabs.filter(t => content[t.id])
    const currentTab = viewingTab || tabs[0]?.id || ''
    return (
      <div style={{ minHeight: '100vh', background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <header style={{ background: COLORS.navy, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="/" style={{ textDecoration: "none" }}><span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span></a>
          <button onClick={() => setViewingGeneration(null)} style={{ background: COLORS.orange, color: COLORS.navy, border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Назад</button>
        </header>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, marginBottom: 4 }}>Генерирано съдържание</h1>
          <p style={{ color: COLORS.textMuted, marginBottom: 24, fontSize: 14 }}>
            {viewingGeneration.domain} — {new Date(viewingGeneration.gen.generated_at).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setViewingTab(tab.id)} style={{ padding: "8px 14px", borderRadius: 8, border: `2px solid ${currentTab === tab.id ? COLORS.orange : COLORS.lightGray}`, background: currentTab === tab.id ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 13, fontWeight: currentTab === tab.id ? 700 : 400, cursor: "pointer" }}>
                {tab.label}
              </button>
            ))}
          </div>
          {currentTab && (
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: 0 }}>{tabs.find(t => t.id === currentTab)?.label}</h2>
                <button onClick={() => navigator.clipboard.writeText(formatResult(currentTab, content[currentTab] || ''))} style={{ background: COLORS.navy, color: COLORS.white, padding: "6px 16px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Копирай</button>
              </div>
              <pre style={{ background: COLORS.offWhite, borderRadius: 10, padding: 16, fontSize: 12, lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: COLORS.navy, maxHeight: 500, border: `1px solid ${COLORS.lightGray}` }}>
                {formatResult(currentTab, content[currentTab] || '')}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ background: COLORS.navy, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(plan === 'smart' || plan === 'pro') && (
            <a href="/onboarding" style={{ background: COLORS.orange, color: COLORS.navy, padding: "6px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>Генератор</a>
          )}
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" as const }}>{planLabel[plan]}</div>
          <button onClick={() => setActiveTab(activeTab === 'profile' ? 'scan' : 'profile')} style={{ background: activeTab === 'profile' ? COLORS.orange : "rgba(255,255,255,0.12)", color: activeTab === 'profile' ? COLORS.navy : "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" as const }}>Профил</button>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", padding: 0, whiteSpace: "nowrap" as const }}>Изход</button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>

        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 16, padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "#166534", fontSize: 16 }}>Плащането е успешно!</div>
            <div style={{ color: "#166534", fontSize: 13 }}>Добре дошъл! Планът се активира автоматично.</div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" as const }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, margin: 0 }}>Моят профил</h1>
              <button onClick={() => setActiveTab('scan')} style={{ background: COLORS.orange, color: COLORS.navy, border: "none", padding: "8px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Към сканирането</button>
            </div>

            {/* Account */}
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}`, marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>Акаунт</h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 1 }}>Имейл</div>
                  <div style={{ fontSize: 14, color: COLORS.navy, fontWeight: 600, background: COLORS.offWhite, padding: "10px 14px", borderRadius: 8 }}>{userEmail || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 1 }}>Активен план</div>
                  <div style={{ fontSize: 14, color: COLORS.orange, fontWeight: 700, background: COLORS.offWhite, padding: "10px 14px", borderRadius: 8 }}>{planLabel[plan]}</div>
                </div>
              </div>
            </div>

            {/* Password */}
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}`, marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>Смяна на парола</h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6 }}>Нова парола</div>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Минимум 6 символа" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
                </div>
                <button onClick={handleChangePassword} disabled={savingPassword} style={{ background: COLORS.orange, color: COLORS.navy, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, cursor: savingPassword ? "not-allowed" : "pointer", fontSize: 14, opacity: savingPassword ? 0.7 : 1 }}>
                  {savingPassword ? "Запазва..." : "Смени паролата"}
                </button>
              </div>
              {passwordMsg && <div style={{ marginTop: 10, fontSize: 13, color: passwordMsg.includes("успешно") ? "#166534" : "#991b1b" }}>{passwordMsg}</div>}
            </div>

            {/* Stripe */}
            {plan !== 'free' && (
              <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}`, marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>Метод на плащане и абонамент</h2>
                <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 16 }}>Управлявай картата си, спри или промени абонамента директно в Stripe.</p>
                <a href="https://billing.stripe.com/p/login/test_bpc_1TY3X0EvptFljOFhttCjP2zW" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: COLORS.navy, color: COLORS.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>Управлявай абонамента в Stripe</a>
                <div style={{ marginTop: 10, fontSize: 11, color: COLORS.textMuted }}>Stripe Billing Portal — смени карта, спри или промени плана.</div>
              </div>
            )}

            {/* Business profiles */}
            {plan !== 'free' && (
              <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, margin: 0 }}>Бизнес профили</h2>
                  <span style={{ fontSize: 12, color: COLORS.textMuted, background: COLORS.offWhite, padding: "4px 10px", borderRadius: 20 }}>{lockedDomains.length}/{DOMAIN_LIMITS[plan]}</span>
                </div>
                {lockedDomains.length === 0 ? (
                  <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: "center" as const, padding: "20px 0" }}>Все още нямаш сканирани домейни.</div>
                ) : (
                  lockedDomains.map((d, idx) => (
                    <div key={d.domain} style={{ marginBottom: 10, border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: COLORS.offWhite }}>
                        <span style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{d.domain}</span>
                        <button onClick={() => { setEditingDomainIdx(editingDomainIdx === idx ? null : idx); setEditAnswers(d.answers || {}) }} style={{ background: COLORS.orange, color: COLORS.navy, border: "none", padding: "5px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                          {editingDomainIdx === idx ? "Затвори" : d.answers ? "Редактирай" : "Попълни"}
                        </button>
                      </div>
                      {editingDomainIdx === idx && (
                        <div style={{ padding: "14px", background: COLORS.white }}>
                          {questionLabels.map((q, qi) => (
                            <div key={qi} style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.navy, marginBottom: 5 }}>{q}</div>
                              <input type="text" value={editAnswers[`q${qi}`] || ""} onChange={e => setEditAnswers((prev: any) => ({ ...prev, [`q${qi}`]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.lightGray}`, fontSize: 13, outline: "none", boxSizing: "border-box" as const }} />
                            </div>
                          ))}
                          <button onClick={() => handleSaveAnswers(idx)} style={{ background: COLORS.navy, color: COLORS.white, padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Запази</button>
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
              <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 6 }}>GEO Dashboard</h1>
              <p style={{ color: COLORS.textMuted, fontSize: 15 }}>
                {plan === 'free' && 'Безплатен план — виж общия скор на домейна си'}
                {plan === 'lite' && 'LITE план — 1 домейн'}
                {plan === 'smart' && 'SMART план — до 3 домейна + генератор на съдържание'}
                {plan === 'pro' && 'PRO план — до 5 домейна + пълна картина'}
              </p>
            </div>

            {plan === 'free' && (
              <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
                <div style={{ color: COLORS.orange, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>UPGRADE</div>
                <div style={{ color: COLORS.white, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Виж точно какво да оправиш</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 16 }}>С LITE план получаваш конкретни стъпки за подобрение</div>
                <a href="/upgrade" style={{ display: "block", background: COLORS.orange, color: COLORS.navy, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>Виж плановете</a>
              </div>
            )}

            {plan === 'lite' && (
  <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
    <div style={{ color: COLORS.orange, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>SMART ПЛАН</div>
    <div style={{ color: COLORS.white, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Искаш стъпка по стъпка инструкции + готови файлове?</div>
    <a href="/upgrade" style={{ display: "block", background: COLORS.orange, color: COLORS.navy, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>Upgrade към SMART</a>
  </div>
)}
{plan === 'smart' && (
  <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
    <div style={{ color: COLORS.orange, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>PRO ПЛАН</div>
    <div style={{ color: COLORS.white, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>5 домейна · AI mention check · Priority support</div>
    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 }}>Разгледай всичко включено в Pro преди да надградиш.</div>
    <a href="/upgrade" style={{ display: "block", background: COLORS.orange, color: COLORS.navy, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const }}>Upgrade към PRO</a>
  </div>
)}

            {/* SCAN BOX */}
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: 0 }}>Провери домейн</h2>
                {plan !== 'free' && <span style={{ fontSize: 12, color: COLORS.textMuted, background: COLORS.offWhite, padding: "4px 10px", borderRadius: 20 }}>{lockedDomains.length}/{DOMAIN_LIMITS[plan]} домейна</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 12 }}>
                <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleScan()} placeholder="example.com" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, outline: "none", boxSizing: "border-box" as const }} />
                <button onClick={handleScan} disabled={scanning} style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: scanning ? "not-allowed" : "pointer", opacity: scanning ? 0.7 : 1 }}>
                  {scanning ? "Сканирам..." : "Анализирай"}
                </button>
              </div>
              {scanning && <div style={{ color: COLORS.blue, fontSize: 13, padding: "10px 14px", background: COLORS.offWhite, borderRadius: 8 }}>Проверяваме 11 критерия...</div>}
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 14px", color: "#991b1b", fontSize: 13 }}>
                  {error}
                  {error.includes('Upgrade') && <a href="/#pricing" style={{ display: "block", marginTop: 8, background: COLORS.orange, color: COLORS.navy, padding: "8px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, textAlign: "center" as const }}>Upgrade</a>}
                </div>
              )}
            </div>

            {/* SCAN RESULT */}
            {result && (
              <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
                <div style={{ textAlign: "center" as const, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${COLORS.lightGray}` }}>
                  <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, color: result.totalScore > 60 ? "#22c55e" : result.totalScore > 35 ? "#f59e0b" : "#ef4444" }}>{result.totalScore}%</div>
                  <div style={{ color: COLORS.textMuted, fontSize: 15, marginTop: 8 }}>GEO скор за <strong style={{ color: COLORS.navy }}>{result.domain}</strong></div>
                  <div style={{ display: "inline-block", marginTop: 10, padding: "6px 14px", borderRadius: 20, background: result.totalScore > 60 ? "#f0fdf4" : result.totalScore > 35 ? "#fffbeb" : "#fef2f2", color: result.totalScore > 60 ? "#166534" : result.totalScore > 35 ? "#92400e" : "#991b1b", fontSize: 13, fontWeight: 600 }}>
                    {result.totalScore > 60 ? "Добро AI присъствие" : result.totalScore > 35 ? "Нужни подобрения" : "Слабо AI присъствие"}
                  </div>
                </div>
                {plan === 'free' ? (
                  <div style={{ textAlign: "center" as const, padding: "24px", background: COLORS.offWhite, borderRadius: 14 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>Детайлите са заключени</div>
                    <div style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>Вземи LITE план за да видиш какво точно трябва да оправиш</div>
                    <a href="/#pricing" style={{ display: "block", background: COLORS.orange, color: COLORS.navy, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>Виж плановете</a>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 14 }}>Препоръки за подобрение</h3>
                    {getTopIssues(result.results, result.totalScore).map((r: any) => (
                      <div key={r.label} style={{ marginBottom: 14, padding: "16px", borderRadius: 12, border: `2px solid ${COLORS.orange}`, background: "rgba(245,166,35,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{r.label}</span>
                          <span style={{ fontWeight: 800, color: "#ef4444", fontSize: 13 }}>{r.score}%</span>
                        </div>
                        <div style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: plan === 'smart' || plan === 'pro' ? 10 : 0 }}>{r.message}</div>
                      {(plan === 'smart' || plan === 'pro') && (
  <a href="/onboarding" style={{ background: COLORS.orange, color: COLORS.navy, padding: "6px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>Генератор</a>
)}
{plan !== 'pro' && (
  <a href="/upgrade" style={{ background: "rgba(245,166,35,0.15)", color: COLORS.orange, border: "1px solid rgba(245,166,35,0.4)", padding: "6px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>⬆ Upgrade</a>
)}
                    {plan === 'lite' && (
                      <div style={{ marginTop: 16, background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 14, padding: "16px" }}>
                        <div style={{ color: COLORS.white, fontSize: 13, marginBottom: 10 }}>Искаш стъпка по стъпка инструкции?</div>
                        <a href="/#pricing" style={{ display: "block", background: COLORS.orange, color: COLORS.navy, padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13, textAlign: "center" as const }}>Upgrade към SMART</a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DOMAIN CARDS */}
            {plan !== 'free' && lockedDomains.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>Моите домейни</h2>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {lockedDomains.map((d) => {
                    const gens = domainGenerations[d.domain] || []
                    const lastGen = gens[0]
                    const isExpanded = expandedDomain === d.domain
                    return (
                      <div key={d.domain} style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.lightGray}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(27,42,74,0.06)" }}>
                        <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🌐</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{d.domain}</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                              {d.answers && <span style={{ fontSize: 10, background: "#f0fdf4", color: "#166534", padding: "2px 7px", borderRadius: 6, fontWeight: 600 }}>Профил попълнен</span>}
                              {gens.length > 0 && <span style={{ fontSize: 10, background: "rgba(46,107,173,0.1)", color: COLORS.blue, padding: "2px 7px", borderRadius: 6, fontWeight: 600 }}>{gens.length} генерации</span>}
                              {lastGen && <span style={{ fontSize: 10, color: COLORS.textMuted }}>Последна: {new Date(lastGen.generated_at).toLocaleDateString('bg-BG')}</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
                          {(plan === 'smart' || plan === 'pro') && (
                            <a href={genLink(d.domain)} style={{ flex: 1, background: COLORS.orange, color: COLORS.navy, padding: "9px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center" as const, display: "block" }}>
                              {d.answers ? "Генерирай фикс" : "Настрой и генерирай"}
                            </a>
                          )}
                          {gens.length > 0 && (
                            <button onClick={() => setExpandedDomain(isExpanded ? null : d.domain)} style={{ flex: 1, background: COLORS.offWhite, color: COLORS.navy, border: `1px solid ${COLORS.lightGray}`, padding: "9px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                              {isExpanded ? "Скрий" : "История"}
                            </button>
                          )}
                        </div>

                        {isExpanded && gens.length > 0 && (
                          <div style={{ borderTop: `1px solid ${COLORS.lightGray}`, padding: "14px 16px" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 10 }}>История</div>
                            {gens.map((gen: any, gi: number) => (
                              <div key={gi} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: COLORS.offWhite, borderRadius: 10, marginBottom: 8 }}>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{new Date(gen.generated_at).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{new Date(gen.generated_at).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <button onClick={() => { setViewingGeneration({ domain: d.domain, gen }); setViewingTab('') }} style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "6px 14px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Виж</button>
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

            {/* SCAN HISTORY */}
            {scanHistory.length > 1 && (
              <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.lightGray}` }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>История на сканиранията</h2>
                {scanHistory.map((h: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < scanHistory.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
                    <ScoreRing score={h.totalScore} />
                    <div>
                      <div style={{ fontWeight: 600, color: COLORS.navy, fontSize: 14 }}>{h.domain}</div>
                      <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{new Date(h.scannedAt).toLocaleString('bg-BG')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
