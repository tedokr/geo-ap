'use client'
import { useState } from 'react'

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  orange: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  lightGray: "#E8EDF4",
  textMuted: "#5A6B84",
}

const PLATFORMS = ['WordPress', 'Webflow', 'Wix', 'Shopify', 'Squarespace', 'Custom HTML', 'Друго']

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [info, setInfo] = useState({
    name: '',
    platform: '',
    description: '',
    location: '',
    competitors: '',
    social: '',
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('faqs')
  const [error, setError] = useState('')

  const generateAll = async () => {
    setGenerating(true)
    setError('')
    const types = ['faqs', 'llms', 'robots', 'schema', 'metadesc', 'blog']
    const results: Record<string, string> = {}

    for (const type of types) {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, businessInfo: info })
        })
        const data = await res.json()
        results[type] = data.result || 'Грешка при генерация'
      } catch {
        results[type] = 'Грешка при генерация'
      }
    }
    setGenerated(results)
    setGenerating(false)
    setStep(4)
  }

  const tabs = [
    { id: 'faqs', label: '❓ FAQs' },
    { id: 'llms', label: '🤖 llms.txt' },
    { id: 'robots', label: '🤖 robots.txt' },
    { id: 'schema', label: '📊 Schema.org' },
    { id: 'metadesc', label: '📝 Meta Description' },
    { id: 'blog', label: '✍️ Blog идеи' },
  ]

  const formatResult = (type: string, text: string) => {
    if (!text) return ''
    try {
      if (type === 'faqs') {
        const clean = text.replace(/```json|```/g, '').trim()
        const data = JSON.parse(clean)
        return data.map((f: any, i: number) => `Q${i+1}: ${f.question}\nA: ${f.answer}`).join('\n\n')
      }
      if (type === 'metadesc') {
        const clean = text.replace(/```json|```/g, '').trim()
        const data = JSON.parse(clean)
        return data.map((d: any) => `Вариант ${d.variant} (${d.length || d.text?.length} символа):\n${d.text}`).join('\n\n')
      }
      if (type === 'blog') {
        const clean = text.replace(/```json|```/g, '').trim()
        const data = JSON.parse(clean)
        const titles = data.titles?.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')
        return `ЗАГЛАВИЯ:\n${titles}\n\nСТРУКТУРА НА ПЪРВИЯ ПОСТ:\n${JSON.stringify(data.outline, null, 2)}`
      }
    } catch {}
    return text.replace(/```json|```/g, '').trim()
  }

  const getInstructions = (type: string) => {
    const platform = info.platform
    const instructions: Record<string, Record<string, string>> = {
      faqs: {
        WordPress: '1. Инсталирай плъгин "Rank Math SEO"\n2. Отиди на страница/пост → Rank Math → Schema\n3. Добави FAQ Block и копирай въпросите',
        Wix: '1. Отиди на страницата ти\n2. Добави секция → FAQ Widget\n3. Копирай въпросите и отговорите',
        Webflow: '1. Добави нов Section в страницата\n2. Използвай Rich Text за въпросите\n3. Добави Custom Code за schema markup',
        default: '1. Добави нова секция на страницата си\n2. Копирай въпросите и отговорите\n3. За schema markup — добави JSON-LD script в <head>'
      },
      llms: {
        WordPress: '1. Отиди в WordPress Admin → Media → Add New\n2. Качи llms.txt файла\n3. Или използвай плъгин "WP File Manager"',
        default: '1. Запази файла като llms.txt\n2. Качи го в root директорията на сайта\n3. Провери на yoursite.com/llms.txt'
      },
      robots: {
        WordPress: '1. Отиди в Rank Math → General Settings → Edit robots.txt\n2. Замени съдържанието с генерирания файл\n3. Запази',
        Wix: '1. Отиди в Settings → SEO → robots.txt\n2. Замени съдържанието\n3. Публикувай',
        default: '1. Отвори robots.txt файла на сайта си\n2. Замени съдържанието с генерирания\n3. Качи в root директорията'
      },
      schema: {
        WordPress: '1. Отиди в Appearance → Theme Editor → header.php\n2. Постави кода преди </head>\n3. Или използвай плъгин "Schema Pro"',
        Wix: '1. Отиди в Settings → Advanced → Custom Code\n2. Постави в <head> секцията\n3. Публикувай',
        default: '1. Отвори HTML файла на главната страница\n2. Постави кода преди </head>\n3. Качи промените'
      },
      metadesc: {
        WordPress: '1. Инсталирай Rank Math или Yoast SEO\n2. Отвори страницата за редакция\n3. Намери "Meta Description" полето и постави текста',
        Wix: '1. Отиди на страницата → Settings (иконка) → SEO\n2. Намери "Meta Description"\n3. Постави текста',
        default: '1. Намери <meta name="description"> в HTML\n2. Замени content атрибута\n3. Качи промените'
      },
      blog: {
        WordPress: '1. Отиди в Posts → Add New\n2. Копирай заглавието и структурата\n3. Напиши съдържанието по структурата\n4. Публикувай',
        default: '1. Създай нова страница/пост в CMS-а си\n2. Използвай структурата като outline\n3. Напиши съдържанието\n4. Публикувай'
      }
    }
    const typeInstructions = instructions[type] || {}
    return typeInstructions[platform] || typeInstructions['default'] || 'Следвай документацията на платформата си.'
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{ background: COLORS.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </a>
        <a href="/dashboard" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>← Dashboard</a>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 32px" }}>

        {/* Progress */}
        {step < 4 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {['Бизнес информация', 'Платформа', 'Конкуренти'].map((s, i) => (
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

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Разкажи ни за бизнеса си</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Тази информация ще помогне на AI да генерира персонализирано съдържание</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Име на бизнеса *</label>
              <input value={info.name} onChange={e => setInfo({...info, name: e.target.value})} placeholder="Примерно: Пицария Романо" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Опиши бизнеса си с 20 думи *</label>
              <textarea value={info.description} onChange={e => setInfo({...info, description: e.target.value})} placeholder="Примерно: Автентична италианска пицария в центъра на София с 10 години опит..." rows={3} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Локация *</label>
              <input value={info.location} onChange={e => setInfo({...info, location: e.target.value})} placeholder="Примерно: София, България" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>

            <button onClick={() => { if (info.name && info.description && info.location) setStep(2) }} style={{ width: "100%", background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Следваща стъпка →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>На каква платформа е сайтът ти?</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Инструкциите ще бъдат адаптирани специално за твоята платформа</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setInfo({...info, platform: p})} style={{ padding: "16px", borderRadius: 10, border: `2px solid ${info.platform === p ? COLORS.orange : COLORS.lightGray}`, background: info.platform === p ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 15, fontWeight: info.platform === p ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                  {info.platform === p ? "✓ " : ""}{p}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Социални мрежи и Google Maps (незадължително)</label>
              <textarea value={info.social} onChange={e => setInfo({...info, social: e.target.value})} placeholder="Facebook: https://facebook.com/...\nInstagram: https://instagram.com/...\nGoogle Maps: https://maps.google.com/..." rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
                ← Назад
              </button>
              <button onClick={() => { if (info.platform) setStep(3) }} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                Следваща стъпка →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Кои са конкурентите ти?</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>AI ще анализира конкурентите и ще генерира по-добро съдържание</p>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>3-5 конкурента (незадължително)</label>
              <textarea value={info.competitors} onChange={e => setInfo({...info, competitors: e.target.value})} placeholder="Примерно:\nПицария Наполи - napoli.bg\nПицария Венеция - venezia.bg\nPizza Hut Bulgaria" rows={5} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>

            <div style={{ background: "rgba(245,166,35,0.1)", border: `1px solid rgba(245,166,35,0.3)`, borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 4 }}>🚀 Готово за генерация!</div>
              <div style={{ color: COLORS.textMuted, fontSize: 14 }}>AI ще генерира: FAQs, llms.txt, robots.txt, Schema.org, Meta descriptions и Blog идеи — всичко персонализирано за {info.name}</div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px", marginBottom: 20, color: "#991b1b", fontSize: 14 }}>
                ❌ {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
                ← Назад
              </button>
              <button onClick={generateAll} disabled={generating} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.8 : 1 }}>
                {generating ? "⏳ AI генерира съдържание..." : "✨ Генерирай с AI →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Results */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Готово! AI генерира съдържанието</h1>
              <p style={{ color: COLORS.textMuted, fontSize: 16 }}>Всичко е персонализирано за {info.name} на {info.platform}</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 16px", borderRadius: 8, border: `2px solid ${activeTab === tab.id ? COLORS.orange : COLORS.lightGray}`, background: activeTab === tab.id ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400, cursor: "pointer" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <button
                  onClick={() => navigator.clipboard.writeText(formatResult(activeTab, generated[activeTab] || ''))}
                  style={{ background: COLORS.navy, color: COLORS.white, padding: "8px 20px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  📋 Копирай
                </button>
              </div>

              <pre style={{ background: COLORS.offWhite, borderRadius: 10, padding: 20, fontSize: 13, lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", color: COLORS.navy, maxHeight: 400, border: `1px solid ${COLORS.lightGray}` }}>
                {formatResult(activeTab, generated[activeTab] || '⏳ Зареждане...')}
              </pre>
            </div>

            {/* Instructions */}
            <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: 32 }}>
              <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                📋 Как да го сложиш на {info.platform}
              </h3>
              <pre style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>
                {getInstructions(activeTab)}
              </pre>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <a href="/dashboard" style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600, textAlign: "center", display: "block" }}>
                ← Dashboard
              </a>
              <button onClick={() => { setStep(1); setGenerated({}); setInfo({ name: '', platform: '', description: '', location: '', competitors: '', social: '' }) }} style={{ flex: 1, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                🔄 Генерирай отново
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
