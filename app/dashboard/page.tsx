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
  free: 0,
  lite: 1,
  smart: 3,
  pro: 5,
}

async function fetchUserPlan(email: string): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_plans?email=eq.${encodeURIComponent(email)}&select=plan,status`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
      }
    )
    const data = await res.json()
    if (data?.[0]?.status === 'active') return data[0].plan
    return 'free'
  } catch {
    return 'free'
  }
}

export default function Dashboard() {
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<any[]>([])
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
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
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
              if (freshPlan !== 'free') {
                setPlan(freshPlan)
                clearInterval(planCheckInterval.current!)
              }
              if (attempts >= 10) clearInterval(planCheckInterval.current!)
            }, 3000)
          }

          const stored = localStorage.getItem(`geo_domains_${user.email}`)
          if (stored) setLockedDomains(JSON.parse(stored))
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

    setScanning(true)
    setResult(null)
    setError("")
    try {
      const res = await fetch(`/api/scan?domain=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.error) {
        setError(data.message || "Грешка при сканиране.")
      } else {
        setResult(data)
        setHistory((prev: any[]) => [data, ...prev].slice(0, 5))
        if (!alreadyLocked && userEmail) {
          const updated = [...lockedDomains, { domain: cleanDomain, answers: null }]
          saveLockedDomains(updated, userEmail)
        }
      }
    } catch {
      setError("Грешка при сканиране. Опитай пак.")
    }
    setScanning(false)
  }

  const getTopIssues = (results: any, totalScore: number) => {
    const issues = Object.values(results).filter((r: any) => r.status !== 'good')
    const count = totalScore < 50 ? 2 : 1
    return issues.slice(0, count)
  }

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg("Паролата трябва да е поне 6 символа.")
      return
    }
    setSavingPassword(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) setPasswordMsg("Грешка: " + error.message)
      else { setPasswordMsg("✅ Паролата е сменена успешно!"); setNewPassword("") }
    } catch {
      setPasswordMsg("Грешка при смяна на паролата.")
    }
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
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.signOut()
    } catch {}
    window.location.href = '/'
  }

  const planLabel: Record<string, string> = {
    free: 'Безплатен', lite: 'LITE', smart: 'SMART', pro: 'PRO'
  }

  const questionLabels = [
    "Имаш ли сайт?",
    "На каква платформа е сайтът? (WordPress, Webflow, Wix...)",
    "Опиши бизнеса си с 20 думи",
    "Където се намира бизнесът ти",
    "3 твои конкуренти",
  ]

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <header style={{ background: COLORS.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {(plan === 'smart' || plan === 'pro') && (
            <a href="/onboarding" style={{ background: COLORS.orange, color: COLORS.navy, padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>⚡ Генератор</a>
          )}
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: 20 }}>
            {planLabel[plan]}
          </div>
          <button
            onClick={() => setActiveTab(activeTab === 'profile' ? 'scan' : 'profile')}
            style={{ background: activeTab === 'profile' ? COLORS.orange : "rgba(255,255,255,0.12)", color: activeTab === 'profile' ? COLORS.navy : "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}
          >
            👤 Профил
          </button>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", padding: 0 }}>
            Изход
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>

        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 16, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>🎉</span>
            <div>
              <div style={{ fontWeight: 700, color: "#166534", fontSize: 18 }}>Плащането е успешно!</div>
              <div style={{ color: "#166534", fontSize: 14 }}>Добре дошъл! Планът се активира автоматично.</div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, margin: 0 }}>👤 Моят профил</h1>
              <button
                onClick={() => setActiveTab('scan')}
                style={{ background: COLORS.orange, color: COLORS.navy, border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}
              >
                ← Към сканирането
              </button>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 20, padding: 36, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Акаунт</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Имейл</div>
                  <div style={{ fontSize: 15, color: COLORS.navy, fontWeight: 600, background: COLORS.offWhite, padding: "10px 16px", borderRadius: 8 }}>{userEmail || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Активен план</div>
                  <div style={{ fontSize: 15, color: COLORS.orange, fontWeight: 700, background: COLORS.offWhite, padding: "10px 16px", borderRadius: 8 }}>{planLabel[plan]}</div>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 20, padding: 36, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Смяна на парола</h2>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6 }}>Нова парола</div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Минимум 6 символа"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  style={{ background: COLORS.orange, color: COLORS.navy, padding: "12px 24px", borderRadius: 10, border: "none", fontWeight: 700, cursor: savingPassword ? "not-allowed" : "pointer", fontSize: 14, opacity: savingPassword ? 0.7 : 1, whiteSpace: "nowrap" }}
                >
                  {savingPassword ? "Запазва..." : "Смени паролата"}
                </button>
              </div>
              {passwordMsg && (
                <div style={{ marginTop: 12, fontSize: 14, color: passwordMsg.startsWith("✅") ? "#166534" : "#991b1b" }}>{passwordMsg}</div>
              )}
            </div>

            {plan !== 'free' && (
              <div style={{ background: COLORS.white, borderRadius: 20, padding: 36, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>Метод на плащане & Абонамент</h2>
                <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>Управлявай картата си, спри или промени абонамента директно в Stripe.</p>
                
                  href="https://billing.stripe.com/p/login/test_bpc_1TY3X0EvptFljOFhttCjP2zW"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", background: COLORS.navy, color: COLORS.white, padding: "12px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}
                >
                  💳 Управлявай абонамента в Stripe →
                </a>
                <div style={{ marginTop: 12, fontSize: 12, color: COLORS.textMuted }}>
                  Ще се отвори Stripe Billing Portal — там можеш да смениш карта, да спреш или upgrade-неш плана.
                </div>
              </div>
            )}

            {plan !== 'free' && (
              <div style={{ background: COLORS.white, borderRadius: 20, padding: 36, border: `1px solid ${COLORS.lightGray}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, margin: 0 }}>Моите домейни</h2>
                  <span style={{ fontSize: 13, color: COLORS.textMuted, background: COLORS.offWhite, padding: "4px 12px", borderRadius: 20 }}>
                    {lockedDomains.length}/{DOMAIN_LIMITS[plan]} използвани
                  </span>
                </div>

                {lockedDomains.length === 0 ? (
                  <div style={{ color: COLORS.textMuted, fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                    Все още нямаш сканирани домейни. Провери домейн от таба "Сканиране".
                  </div>
                ) : (
                  lockedDomains.map((d, idx) => (
                    <div key={d.domain} style={{ marginBottom: 16, border: `1px solid ${COLORS.lightGray}`, borderRadius: 14, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: COLORS.offWhite }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>🌐</span>
                          <span style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15 }}>{d.domain}</span>
                          {d.answers && <span style={{ fontSize: 11, background: "#f0fdf4", color: "#166534", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>✓ Профил попълнен</span>}
                        </div>
                        <button
                          onClick={() => {
                            setEditingDomainIdx(editingDomainIdx === idx ? null : idx)
                            setEditAnswers(d.answers || {})
                          }}
                          style={{ background: COLORS.orange, color: COLORS.navy, border: "none", padding: "6px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                        >
                          {editingDomainIdx === idx ? "Затвори" : d.answers ? "Редактирай" : "Попълни профил"}
                        </button>
                      </div>

                      {editingDomainIdx === idx && (
                        <div style={{ padding: "20px 20px 24px", background: COLORS.white }}>
                          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>
                            Тези данни се използват от генератора за персонализирано съдържание.
                          </div>
                          {questionLabels.map((q, qi) => (
                            <div key={qi} style={{ marginBottom: 14 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, marginBottom: 6 }}>{q}</div>
                              <input
                                type="text"
                                value={editAnswers[`q${qi}`] || ""}
                                onChange={e => setEditAnswers((prev: any) => ({ ...prev, [`q${qi}`]: e.target.value }))}
                                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => handleSaveAnswers(idx)}
                            style={{ background: COLORS.navy, color: COLORS.white, padding: "10px 24px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, marginTop: 4 }}
                          >
                            💾 Запази
                          </button>
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
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>GEO Dashboard</h1>
              <p style={{ color: COLORS.textMuted, fontSize: 16 }}>
                {plan === 'free' && 'Безплатен план — виж общия скор на домейна си'}
                {plan === 'lite' && 'LITE план — 1 домейн'}
                {plan === 'smart' && 'SMART план — до 3 домейна + генератор на съдържание'}
                {plan === 'pro' && 'PRO план — до 5 домейна + пълна картина'}
              </p>
            </div>

            {plan === 'free' && (
              <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "28px 32px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
                <div>
                  <div style={{ color: COLORS.orange, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>⬆️ UPGRADE</div>
                  <div style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Виж точно какво да оправиш</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>С LITE план получаваш конкретни стъпки за подобрение</div>
                </div>
                <a href="/#pricing" style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", flexShrink: 0 }}>
                  Виж плановете →
                </a>
              </div>
            )}

            {plan === 'lite' && (
              <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "20px 28px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
                <div>
                  <div style={{ color: COLORS.orange, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>⭐ SMART ПЛАН</div>
                  <div style={{ color: COLORS.white, fontSize: 16, fontWeight: 700 }}>Искаш стъпка по стъпка инструкции + готови файлове?</div>
                </div>
                <a href="/#pricing" style={{ background: COLORS.orange, color: COLORS.navy, padding: "12px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", flexShrink: 0 }}>
                  Upgrade към SMART →
                </a>
              </div>
            )}

            <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}`, marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, margin: 0 }}>🔍 Провери домейн</h2>
                {plan !== 'free' && (
                  <span style={{ fontSize: 13, color: COLORS.textMuted, background: COLORS.offWhite, padding: "4px 12px", borderRadius: 20 }}>
                    {lockedDomains.length}/{DOMAIN_LIMITS[plan]} домейна
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleScan()}
                  placeholder="example.com"
                  style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, outline: "none" }}
                />
                <button onClick={handleScan} disabled={scanning} style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px 32px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: scanning ? "not-allowed" : "pointer", opacity: scanning ? 0.7 : 1, whiteSpace: "nowrap" }}>
                  {scanning ? "⏳ Сканирам..." : "Анализирай"}
                </button>
              </div>
              {scanning && <div style={{ color: COLORS.blue, fontSize: 14, padding: "12px 16px", background: COLORS.offWhite, borderRadius: 8 }}>🔍 Проверяваме 11 критерия...</div>}
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px 18px", color: "#991b1b", fontSize: 14 }}>
                  ⚠️ {error}
                  {error.includes('Upgrade') && (
                    <a href="/#pricing" style={{ display: "inline-block", marginLeft: 12, background: COLORS.orange, color: COLORS.navy, padding: "4px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                      Upgrade →
                    </a>
                  )}
                </div>
              )}
            </div>

            {result && (
              <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}`, marginBottom: 32 }}>
                <div style={{ textAlign: "center", marginBottom: 40, paddingBottom: 32, borderBottom: `1px solid ${COLORS.lightGray}` }}>
                  <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 1, color: result.totalScore > 60 ? "#22c55e" : result.totalScore > 35 ? "#f59e0b" : "#ef4444" }}>
                    {result.totalScore}%
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: 18, marginTop: 8 }}>
                    GEO скор за <strong style={{ color: COLORS.navy }}>{result.domain}</strong>
                  </div>
                  <div style={{ display: "inline-block", marginTop: 12, padding: "6px 16px", borderRadius: 20, background: result.totalScore > 60 ? "#f0fdf4" : result.totalScore > 35 ? "#fffbeb" : "#fef2f2", color: result.totalScore > 60 ? "#166534" : result.totalScore > 35 ? "#92400e" : "#991b1b", fontSize: 14, fontWeight: 600 }}>
                    {result.totalScore > 60 ? "✓ Добро AI присъствие" : result.totalScore > 35 ? "⚠ Нужни подобрения" : "✗ Слабо AI присъствие"}
                  </div>
                </div>

                {plan === 'free' ? (
                  <div style={{ textAlign: "center", padding: "32px", background: COLORS.offWhite, borderRadius: 16 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>Детайлите са заключени</div>
                    <div style={{ color: COLORS.textMuted, fontSize: 15, marginBottom: 24 }}>Вземи LITE план за да видиш какво точно трябва да оправиш</div>
                    <a href="/#pricing" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, padding: "14px 32px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>
                      Виж плановете →
                    </a>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>🎯 Препоръки за подобрение</h3>
                    {getTopIssues(result.results, result.totalScore).map((r: any) => (
                      <div key={r.label} style={{ marginBottom: 16, padding: "20px 24px", borderRadius: 12, border: `2px solid ${COLORS.orange}`, background: "rgba(245,166,35,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>{r.label}</span>
                          <span style={{ fontWeight: 800, color: "#ef4444", fontSize: 14 }}>{r.score}%</span>
                        </div>
                        <div style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: plan === 'smart' || plan === 'pro' ? 12 : 0 }}>{r.message}</div>
                        {(plan === 'smart' || plan === 'pro') && (
                          <a href="/onboarding" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                            ⚡ Генерирай fix →
                          </a>
                        )}
                      </div>
                    ))}
                    {plan === 'lite' && (
                      <div style={{ marginTop: 24, background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                        <div style={{ color: COLORS.white, fontSize: 14 }}>Искаш стъпка по стъпка инструкции как да оправиш тези проблеми?</div>
                        <a href="/#pricing" style={{ background: COLORS.orange, color: COLORS.navy, padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 }}>
                          Upgrade към SMART →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {history.length > 1 && (
              <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.lightGray}` }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>📋 История</h2>
                {history.map((h: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: i < history.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: h.totalScore > 60 ? "#f0fdf4" : h.totalScore > 35 ? "#fffbeb" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: h.totalScore > 60 ? "#166534" : h.totalScore > 35 ? "#92400e" : "#991b1b", flexShrink: 0 }}>
                      {h.totalScore}%
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: COLORS.navy, fontSize: 15 }}>{h.domain}</div>
                      <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{new Date(h.scannedAt).toLocaleString('bg-BG')}</div>
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
