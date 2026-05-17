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
    domain: '',
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('faqs')
  const [error, setError] = useState('')

  const checkAndGenerate = async () => {
    setGenerating(true)
    setError('')

    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        setError('Не си логнат. Моля влез в акаунта си.')
        setGenerating(false)
        return
      }

      // Get user plan
      const planRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_plans?email=eq.${encodeURIComponent(user.email)}&select=plan`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          }
        }
      )
      const planData = await planRes.json()
      const userPlan = planData?.[0]?.plan || 'free'

      // Domain limits per plan
      const domainLimits: Record<string, number> = { lite: 1, smart: 3, pro: 5 }
      const domainLimit = domainLimits[userPlan] || 0

      if (domainLimit === 0) {
        setError('Нужен е платен план за генерация на съдържание.')
        setGenerating(false)
        return
      }

      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const cleanDomain = info.domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase() || info.name.toLowerCase().replace(/\s/g, '')

      // Check how many unique domains this user has generated for this month
      const domainsRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/domain_generations?email=eq.${encodeURIComponent(user.email)}&month=eq.${currentMonth}&year=eq.${currentYear}&select=domain`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          }
        }
      )
      const domainsData = await domainsRes.json()
      const uniqueDomains = [...new Set(domainsData.map((d: any) => d.domain))]
      const generationsForThisDomain = domainsData.filter((d: any) => d.domain === cleanDomain).length

      // Check if new domain exceeds plan limit
      if (!uniqueDomains.includes(cleanDomain) && uniqueDomains.length >= domainLimit) {
        setError(`С ${userPlan.toUpperCase()} план можеш да генерираш за максимум ${domainLimit} домейна. Вече имаш: ${uniqueDomains.join(', ')}.`)
        setGenerating(false)
        return
      }

      // Check generations per domain this month (1 if score > 50, 2 if score <= 50)
      // We allow max 2 per domain per month
      if (generationsForThisDomain >= 2) {
        setError(`Достигна лимита за ${cleanDomain} този месец. Следващата генерация е от 1-ви на следващия месец.`)
        setGenerating(false)
        return
      }

      // Generate all content
      const types = ['faqs', 'llms', 'robots', 'schema', 'metadesc', 'blog']
      const results: Record<string, string> = {}

      for (const type of types) {
        try {
          const genRes = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, businessInfo: info })
          })
          const data = await genRes.json()
          results[type] = data.result || 'Грешка при генерация'
        } catch {
          results[type] = 'Грешка при генерация'
        }
      }

      // Save generation record
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/domain_generations`,
        {
          method: 'POST',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            domain: cleanDomain,
            month: currentMonth,
            year: currentYear,
          })
        }
      )

      setGenerated(results)
      setGenerating(false)
      setStep(4)

    } catch {
      setError('Грешка при генерация. Опитай пак.')
      setGenerating(false)
    }
  }

  const tabs = [
    { id: 'faqs', label: 'FAQs' },
    { id: 'llms', label: 'llms.txt' },
    { id: 'robots', label: 'robots.txt' },
    { id: 'schema', label: 'Schema.org' },
    { id: 'metadesc', label: 'Meta Description' },
    { id: 'blog', label: 'Blog идеи' },
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
    const p = info.platform
    const instructions: Record<string, Record<string, string>> = {
      faqs: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:\n\n1. Влез в WordPress Admin\n   → yoursite.com/wp-admin\n\n2. Инсталирай Rank Math SEO\n   → Plugins → Add New → "Rank Math SEO"\n   → Install → Activate\n\n3. Отвори страницата за редакция\n   → Pages → намери страницата → Edit\n\n4. Добави FAQ блок\n   → Кликни "+" → търси "FAQ"\n   → Избери "Rank Math FAQ Block"\n   → Копирай въпросите и отговорите\n\n5. Публикувай → Update`,
        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:\n\n1. Влез в Webflow Designer\n\n2. Добави FAQ секция\n   → "+" → Section → вътре Div Block за всеки въпрос\n   → H3 за въпроса, Paragraph за отговора\n\n3. Добави Schema markup\n   → Page Settings → Custom Code → Head Code\n   → Постави Schema.org кода\n\n4. Publish`,
        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:\n\n1. Wix Editor → Add Elements → App Market\n   → Търси "FAQ" → инсталирай "Wix FAQ"\n\n2. Manage Questions → Add Question\n   → Копирай въпросите и отговорите\n\n3. Publish`,
        default: `ОБЩА ИНСТРУКЦИЯ:\n\n1. Отвори редактора на сайта\n2. Добави FAQ секция с въпросите и отговорите\n3. Постави Schema.org кода преди </head>\n4. Запази и публикувай`
      },
      llms: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:\n\n1. Копирай съдържанието → запази като "llms.txt"\n\n2. Plugins → Add New → "WP File Manager" → Activate\n\n3. WP File Manager → public_html → качи llms.txt\n\n4. Провери на yoursite.com/llms.txt`,
        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:\n\n1. Копирай и запази като "llms.txt"\n\n2. Designer → Assets → качи файла\n\n3. Провери на yoursite.com/llms.txt`,
        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:\n\n1. Editor → Dev Mode → Turn on Dev Mode\n2. "+" до Public → създай "llms.txt"\n3. Постави съдържанието\n4. Провери на yoursite.com/llms.txt`,
        default: `ОБЩА ИНСТРУКЦИЯ:\n\n1. Копирай съдържанието\n2. Запази като "llms.txt"\n3. Качи в root директорията (public_html)\n4. Провери на yoursite.com/llms.txt`
      },
      robots: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:\n\n1. Rank Math → General Settings → Edit robots.txt\n2. Замени съдържанието с новото\n3. Save Changes\n4. Провери на yoursite.com/robots.txt`,
        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:\n\n1. Project Settings → SEO → robots.txt\n2. Замени съдържанието\n3. Save → Publish\n4. Провери на yoursite.com/robots.txt`,
        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:\n\n1. Dashboard → Marketing & SEO → SEO Tools → robots.txt\n2. Edit → замени съдържанието\n3. Save\n4. Провери на yoursite.com/robots.txt`,
        default: `ОБЩА ИНСТРУКЦИЯ:\n\n1. Хостинг панел → File Manager → public_html\n2. Намери или създай robots.txt\n3. Замени съдържанието\n4. Провери на yoursite.com/robots.txt`
      },
      schema: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:\n\n1. Plugins → Add New → "Schema Pro" → Activate\n2. Schema Pro → Add New Schema\n3. Или: Appearance → Theme Editor → header.php\n   → Постави кода ПРЕДИ </head>`,
        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:\n\n1. Page Settings → Custom Code → Inside head tag\n2. Постави Schema кода\n3. Save → Publish\n4. Провери: search.google.com/test/rich-results`,
        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:\n\n1. Settings → Advanced → Custom Code\n2. Add Custom Code → постави кода → Head\n3. Apply → Publish`,
        default: `ОБЩА ИНСТРУКЦИЯ:\n\n1. Намери </head> в HTML файла\n2. Постави кода ПРЕДИ </head>\n3. Запази и качи\n4. Провери: search.google.com/test/rich-results`
      },
      metadesc: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:\n\n1. Pages → Edit страницата\n2. Rank Math SEO → Edit Snippet\n3. Description → постави избрания вариант (120-160 символа)\n4. Update`,
        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:\n\n1. Page Settings → SEO Settings → Meta Description\n2. Постави избрания вариант\n3. Publish`,
        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:\n\n1. Page Settings → SEO Basics → Page Description\n2. Постави избрания вариант\n3. Save → Publish`,
        default: `ОБЩА ИНСТРУКЦИЯ:\n\n1. SEO Settings на платформата\n2. Meta Description → постави Вариант 1\n3. Запази`
      },
      blog: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:\n\n1. Posts → Add New Post\n2. Добави заглавието от горе\n3. Пиши по структурата с H2 за всяка секция\n4. Rank Math → Focus Keyword\n5. Publish`,
        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:\n\n1. CMS → Blog Posts → New Blog Post\n2. Добави заглавието\n3. Rich Text → пиши по структурата\n4. SEO Settings → Meta Description\n5. Published → Publish`,
        default: `ОБЩА ИНСТРУКЦИЯ:\n\n1. CMS/Blog → нов пост\n2. Заглавие от горе\n3. Структура: Въведение → 4 секции → Заключение\n4. Meta Description\n5. Публикувай`
      }
    }
    const typeInstructions = instructions[type] || {}
    return typeInstructions[p] || typeInstructions['default'] || 'Следвай документацията на платформата си.'
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <header style={{ background: COLORS.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </a>
        <a href="/dashboard" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>Dashboard</a>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 32px" }}>

        {step < 4 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {['Бизнес информация', 'Платформа', 'Конкуренти'].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? "#22c55e" : step === i + 1 ? COLORS.orange : COLORS.lightGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: step >= i + 1 ? COLORS.navy : COLORS.textMuted }}>
                    {step > i + 1 ? "v" : i + 1}
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
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Разкажи ни за бизнеса си</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Тази информация ще помогне да генерираме персонализирано съдържание</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Домейн на сайта</label>
              <input value={info.domain} onChange={e => setInfo({...info, domain: e.target.value})} placeholder="example.com" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" as const }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Име на бизнеса</label>
              <input value={info.name} onChange={e => setInfo({...info, name: e.target.value})} placeholder="Примерно: Пицария Романо" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" as const }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Опиши бизнеса си с 20 думи</label>
              <textarea value={info.description} onChange={e => setInfo({...info, description: e.target.value})} placeholder="Примерно: Автентична италианска пицария в центъра на София с 10 години опит..." rows={3} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" as const, resize: "vertical" as const }} />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Локация</label>
              <input value={info.location} onChange={e => setInfo({...info, location: e.target.value})} placeholder="Примерно: София, България" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" as const }} />
            </div>

            <button onClick={() => { if (info.name && info.description && info.location) setStep(2) }} style={{ width: "100%", background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Следваща стъпка
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>На каква платформа е сайтът ти?</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Инструкциите ще бъдат адаптирани специално за твоята платформа</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setInfo({...info, platform: p})} style={{ padding: "16px", borderRadius: 10, border: `2px solid ${info.platform === p ? COLORS.orange : COLORS.lightGray}`, background: info.platform === p ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 15, fontWeight: info.platform === p ? 700 : 400, cursor: "pointer", textAlign: "left" as const }}>
                  {info.platform === p ? "v " : ""}{p}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Социални мрежи и Google Maps (незадължително)</label>
              <textarea value={info.social} onChange={e => setInfo({...info, social: e.target.value})} placeholder="Facebook: https://facebook.com/..." rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const, resize: "vertical" as const }} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Назад</button>
              <button onClick={() => { if (info.platform) setStep(3) }} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Следваща стъпка</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Кои са конкурентите ти?</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Ще генерираме по-добро съдържание като знаем конкурентите ти</p>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>3-5 конкурента (незадължително)</label>
              <textarea value={info.competitors} onChange={e => setInfo({...info, competitors: e.target.value})} placeholder="Пицария Наполи - napoli.bg" rows={5} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const, resize: "vertical" as const }} />
            </div>

            <div style={{ background: "rgba(245,166,35,0.1)", border: `1px solid rgba(245,166,35,0.3)`, borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 4 }}>Готово за генерация!</div>
              <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Ще генерираме персонализирано съдържание за {info.name} на {info.platform}</div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px", marginBottom: 20, color: "#991b1b", fontSize: 14 }}>{error}</div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Назад</button>
              <button onClick={checkAndGenerate} disabled={generating} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.8 : 1 }}>
                {generating ? "Генерирам съдържание..." : "Генерирай"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{ textAlign: "center" as const, marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Готово! Съдържанието е генерирано</h1>
              <p style={{ color: COLORS.textMuted, fontSize: 16 }}>Всичко е персонализирано за {info.name} на {info.platform}</p>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 16px", borderRadius: 8, border: `2px solid ${activeTab === tab.id ? COLORS.orange : COLORS.lightGray}`, background: activeTab === tab.id ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400, cursor: "pointer" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <button onClick={() => navigator.clipboard.writeText(formatResult(activeTab, generated[activeTab] || ''))} style={{ background: COLORS.navy, color: COLORS.white, padding: "8px 20px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Копирай
                </button>
              </div>
              <pre style={{ background: COLORS.offWhite, borderRadius: 10, padding: 20, fontSize: 13, lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: COLORS.navy, maxHeight: 400, border: `1px solid ${COLORS.lightGray}` }}>
                {formatResult(activeTab, generated[activeTab] || 'Зареждане...')}
              </pre>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Как да го сложиш на {info.platform} — стъпка по стъпка
              </h3>
              <pre style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap" as const, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                {getInstructions(activeTab)}
              </pre>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <a href="/dashboard" style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600, textAlign: "center" as const, display: "block" }}>Dashboard</a>
              <button onClick={() => { setStep(1); setGenerated({}); setInfo({ name: '', platform: '', description: '', location: '', competitors: '', social: '', domain: '' }) }} style={{ flex: 1, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Генерирай отново</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
