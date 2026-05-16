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

export default function Dashboard() {
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<any[]>([])

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
        setHistory(prev => [data, ...prev].slice(0, 5))
      }
    } catch {
      setError("Грешка при сканиране. Опитай пак.")
    }
    setScanning(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header style={{ background: COLORS.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Dashboard</span>
          <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none" }}>Изход</a>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>
        
        {/* Welcome */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>GEO Dashboard</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 16 }}>Провери AI видимостта на твоя домейн</p>
        </div>

        {/* Scanner */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}`, marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, marginBottom: 24 }}>🔍 Нова проверка</h2>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              placeholder="example.com"
              style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, outline: "none" }}
            />
            <button
              onClick={handleScan}
              disabled={scanning}
              style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px 32px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: scanning ? "not-allowed" : "pointer", opacity: scanning ? 0.7 : 1, whiteSpace: "nowrap" }}
            >
              {scanning ? "⏳ Сканирам..." : "Анализирай"}
            </button>
          </div>

          {scanning && (
            <div style={{ color: COLORS.blue, fontSize: 14, padding: "12px 16px", background: COLORS.offWhite, borderRadius: 8 }}>
              🔍 Проверяваме SEO, robots.txt, llms.txt, sitemap, schema.org, social media...
            </div>
          )}

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px 18px", color: "#991b1b", fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}`, marginBottom: 32 }}>
            
            {/* Score header */}
            <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 40, paddingBottom: 32, borderBottom: `1px solid ${COLORS.lightGray}` }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, color: result.totalScore > 60 ? "#22c55e" : result.totalScore > 35 ? "#f59e0b" : "#ef4444" }}>
                  {result.totalScore}%
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4 }}>GEO Скор</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>{result.domain}</div>
                <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: result.totalScore > 60 ? "#f0fdf4" : result.totalScore > 35 ? "#fffbeb" : "#fef2f2", color: result.totalScore > 60 ? "#166534" : result.totalScore > 35 ? "#92400e" : "#991b1b", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                  {result.totalScore > 60 ? "✓ Добро AI присъствие" : result.totalScore > 35 ? "⚠ Нужни подобрения" : "✗ Слабо AI присъствие"}
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
                  Сканирано: {new Date(result.scannedAt).toLocaleString('bg-BG')}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>Детайлни резултати</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {Object.values(result.results).map((r: any) => (
                <div key={r.label} style={{ padding: "16px 20px", borderRadius: 12, border: `1px solid ${COLORS.lightGray}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4, background: r.status === "good" ? "#22c55e" : r.status === "partial" ? "#f59e0b" : "#ef4444" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{r.label}</span>
                      <span style={{ fontWeight: 800, fontSize: 14, color: r.status === "good" ? "#22c55e" : r.status === "partial" ? "#f59e0b" : "#ef4444" }}>{r.score}%</span>
                    </div>
                    <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.4 }}>{r.message}</div>
                    <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: COLORS.lightGray }}>
                      <div style={{ width: `${r.score}%`, height: 4, borderRadius: 2, background: r.status === "good" ? "#22c55e" : r.status === "partial" ? "#f59e0b" : "#ef4444", transition: "width 1s ease" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div style={{ background: COLORS.offWhite, borderRadius: 16, padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>🎯 Препоръки за подобрение</h3>
              {Object.values(result.results)
                .filter((r: any) => r.status !== 'good')
                .slice(0, 2)
                .map((r: any) => (
                  <div key={r.label} style={{ display: "flex", gap: 12, marginBottom: 16, padding: "16px", background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.lightGray}` }}>
                    <span style={{ fontSize: 20 }}>⚡</span>
                    <div>
                      <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15, marginBottom: 4 }}>{r.label}</div>
                      <div style={{ color: COLORS.textMuted, fontSize: 14 }}>{r.message}</div>
                    </div>
                  </div>
                ))}
              <div style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 8 }}>
                💡 Upgrade към SMART план за детайлни инструкции как да поправиш всеки проблем
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.lightGray}` }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 20 }}>📋 История</h2>
            {history.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: i < history.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: h.totalScore > 60 ? "#f0fdf4" : h.totalScore > 35 ? "#fffbeb" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: h.totalScore > 60 ? "#166534" : h.totalScore > 35 ? "#92400e" : "#991b1b", flexShrink: 0 }}>
                  {h.totalScore}%
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: COLORS.navy, fontSize: 15 }}>{h.domain}</div>
                  <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{new Date(h.scannedAt).toLocaleString('bg-BG')}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upgrade banner */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "36px 40px", marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div>
            <div style={{ color: COLORS.white, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Upgrade към SMART план</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>Получи стъпка по стъпка инструкции, готови файлове и месечно проследяване</div>
          </div>
          <a href="/#pricing" style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px 32px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", flexShrink: 0 }}>
            Виж плановете →
          </a>
        </div>
      </div>
    </div>
  )
}
