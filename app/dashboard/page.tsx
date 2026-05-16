'use client'
import { useState, useEffect } from 'react'

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  orange: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  lightGray: "#E8EDF4",
  textMuted: "#5A6B84",
}

async function getUserPlan(email: string): Promise<string> {
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') setSuccess(true)
    const getSession = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${document.cookie.match(/sb-[^=]+=([^;]+)/)?.[1] || ''}`,
          }
        })
        const user = await res.json()
        if (user?.email) {
          const userPlan = await getUserPlan(user.email)
          setPlan(userPlan)
        }
      } catch {}
    }
    getSession()
  }, [])

  const handleScan = async () => {
    if (!url) return
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

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      <header style={{ background: COLORS.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {(plan === 'smart' || plan === 'pro') && (
            <a href="/onboarding" style={{ background: COLORS.orange, color: COLORS.navy, padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>✨ Генератор</a>
          )}
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: 20 }}>
            {plan === 'free' ? 'Безплатен' : plan.toUpperCase()}
          </div>
          <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none" }}>Изход</a>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>

        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 16, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>🎉</span>
            <div>
              <div style={{ fontWeight: 700, color: "#166534", fontSize: 18 }}>Плащането е успешно!</div>
              <div style={{ color: "#166534", fontSize: 14 }}>Добре дошъл в {plan.toUpperCase()} плана!</div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>GEO Dashboard</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 16 }}>
            {plan === 'free' && 'Безплатен план — виж общия скор на домейна си'}
            {plan === 'lite' && 'LITE план — виж какво трябва да оправиш'}
            {plan === 'smart' && 'SMART план — пълни инструкции и генератор на съдържание'}
            {plan === 'pro' && 'PRO план — пълна картина с конкурентен анализ'}
          </p>
        </div>

        {plan === 'free' && (
          <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "28px 32px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ color: COLORS.orange, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>⬆️ UPGRADE</div>
              <div style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Виж точно какво да оправиш</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>С LITE план получаваш 1-2 конкретни стъпки всеки месец</div>
            </div>
            <a href="/#pricing" style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", flexShrink: 0 }}>
              Виж плановете →
            </a>
          </div>
        )}

        <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}`, marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, marginBottom: 24 }}>🔍 Провери домейн</h2>
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
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px 18px", color: "#991b1b", fontSize: 14 }}>⚠️ {error}</div>}
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
                <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>
                  🎯 {result.totalScore < 50 ? 'Две стъпки за този месец' : 'Една стъпка за този месец'}
                </h3>
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
                <div style={{ padding: "16px 24px", borderRadius: 12, border: `1px dashed ${COLORS.lightGray}`, background: COLORS.offWhite, textAlign: "center" }}>
                  <span style={{ color: COLORS.textMuted, fontSize: 14 }}>
                    🔒 Останалите {Object.values(result.results).filter((r: any) => r.status !== 'good').length - getTopIssues(result.results, result.totalScore).length} проблема ще бъдат показани следващия месец
                  </span>
                </div>
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
      </div>
    </div>
  )
}
