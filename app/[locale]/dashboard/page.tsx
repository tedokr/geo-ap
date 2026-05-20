'use client'
import { useState, useEffect, useRef } from 'react'

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "#0A1628",
  navyMid: "#0D1E35",
  coral:   "#FF5A47",
  coralDk: "#E04535",
  mint:    "#3ECFB5",
  cream:   "#F7F6F2",
  white:   "#FFFFFF",
  border:  "rgba(255,255,255,0.09)",
  borderL: "rgba(10,22,40,0.09)",
  text:    "#0A1628",
  muted:   "#5A6A7A",
  offWhite:"#F0F5F8",
  lightGray:"#E2E8F0",
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

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = score > 60 ? C.mint : score > 35 ? C.coral : "#ef4444"
  const r = 28; const circ = 2 * Math.PI * r; const dash = (score / 100) * circ
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke={C.lightGray} strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const }}>
        <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{score}</span>
        <span style={{ fontSize: 9, color: C.muted, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>%</span>
      </div>
    </div>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ locale }: { locale: string }) {
  return (
    <a href={`/${locale}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5" ry="5" fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: 17, fontWeight: 800, color: C.white, fontFamily: "'Outfit', sans-serif" }}>
        faindable<span style={{ color: C.coral }}>.app</span>
      </span>
    </a>
  )
}

function getLocaleFromPath() {
  if (typeof window === 'undefined') return 'en'
  return window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
}

// ─── Dropdown menu ────────────────────────────────────────────────────────────
function DropdownMenu({
  locale, plan, planLabel, onScan, onProfile, onContact, onLogout, onGenerator, onUpgrade, onSwitchLocale,
}: {
  locale: string; plan: string; planLabel: string;
  onScan: () => void; onProfile: () => void; onContact: () => void; onLogout: () => void;
  onGenerator: () => void; onUpgrade: () => void; onSwitchLocale: (l: string) => void;
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const planColors: Record<string, string> = { free: C.muted, lite: "#7B8FF5", smart: C.mint, pro: C.coral }
  const planColor = planColors[plan] || C.muted

  const items = [
    { icon: "🔍", label: locale === 'en' ? "Scan" : "Скан", action: onScan },
    ...(plan === 'smart' || plan === 'pro' ? [{ icon: "✨", label: locale === 'en' ? "Generator" : "Генератор", action: onGenerator }] : []),
    { icon: "👤", label: locale === 'en' ? "Profile" : "Профил", action: onProfile },
    { icon: "💬", label: locale === 'en' ? "Contact" : "Контакт", action: onContact },
    ...(plan !== 'pro' ? [{ icon: "⚡", label: locale === 'en' ? "Upgrade plan" : "Upgrade план", action: onUpgrade, highlight: true }] : []),
  ]

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: open ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${C.border}`, borderRadius: 10,
          padding: "7px 14px", cursor: "pointer", transition: "background 0.15s",
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          👤
        </div>
        <span style={{ fontSize: 13, color: C.white, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
          {planLabel}
        </span>
        <span style={{ fontSize: 10, color: planColor, background: `${planColor}22`, border: `1px solid ${planColor}44`, padding: "1px 7px", borderRadius: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
          {plan.toUpperCase()}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M2 4l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: C.navyMid, border: `1px solid ${C.border}`,
          borderRadius: 14, overflow: "hidden", minWidth: 210,
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
          zIndex: 200,
        }}>
          {items.map((item, i) => (
            <button
              key={item.label}
              onClick={() => { item.action(); setOpen(false) }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "12px 16px", background: "none", border: "none",
                borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                cursor: "pointer", textAlign: "left" as const,
                color: (item as any).highlight ? C.coral : "rgba(255,255,255,0.8)",
                fontSize: 14, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {(item as any).highlight && (
                <span style={{ marginLeft: "auto", fontSize: 10, background: "rgba(255,90,71,0.2)", color: C.coral, padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>→</span>
              )}
            </button>
          ))}

          {/* Language row */}
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>🌐</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif", flex: 1 }}>
              {locale === 'en' ? "Language" : "Език"}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {(['en', 'bg'] as const).map(l => (
                <button key={l} onClick={() => { onSwitchLocale(l); setOpen(false) }} style={{
                  padding: "4px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                  background: locale === l ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
                  color: locale === l ? C.white : "rgba(255,255,255,0.4)",
                  fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const,
                  fontFamily: "'Outfit', sans-serif",
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Log out — separated */}
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={() => { onLogout(); setOpen(false) }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "12px 16px", background: "none", border: "none",
                cursor: "pointer", textAlign: "left" as const,
                color: "#FF6B6B", fontSize: 14,
                fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <span style={{ fontSize: 16 }}>🚪</span>
              {locale === 'en' ? "Log out" : "Изход"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Plan upsell banner ────────────────────────────────────────────────────────
function UpsellBanner({ locale, plan, t }: { locale: string; plan: string; t: any }) {
  if (plan === 'pro') return null
  const config = {
    free:  { tag: t.upgrade_tag, title: t.upgrade_title, desc: t.upgrade_desc, cta: t.see_plans, color: C.coral },
    lite:  { tag: t.smart_tag,   title: t.smart_title,   desc: null,           cta: t.upgrade_smart, color: C.mint },
    smart: { tag: t.pro_tag,     title: t.pro_title,     desc: t.pro_desc,     cta: t.upgrade_pro, color: "#7B8FF5" },
  }
  const cfg = config[plan as 'free' | 'lite' | 'smart']
  if (!cfg) return null
  return (
    <div style={{ background: C.navy, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" as const }}>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: cfg.color, textTransform: "uppercase" as const, fontFamily: "'Outfit', sans-serif" }}>{cfg.tag}</span>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: "4px 0", fontFamily: "'Outfit', sans-serif" }}>{cfg.title}</div>
        {cfg.desc && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif" }}>{cfg.desc}</div>}
      </div>
      <a href={`/${locale}/upgrade`} style={{ background: cfg.color, color: C.navy, padding: "10px 22px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" as const, fontFamily: "'Outfit', sans-serif", flexShrink: 0 }}>{cfg.cta}</a>
    </div>
  )
}

// ─── Section card ──────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.borderL}`, ...style }}>
      {children}
    </div>
  )
}

// ─── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    generator: 'Generator', upgrade: 'Upgrade', profile: 'Profile', logout: 'Log out',
    payment_ok: 'Payment successful!', payment_sub: 'Welcome! Your plan activates automatically.',
    my_profile: 'My Profile', to_scan: '← Dashboard',
    account: 'Account', email: 'Email', active_plan: 'Active plan', upgrade_plan: '⚡ Upgrade plan',
    change_password: 'Change password', new_password: 'New password', min_chars: 'Minimum 6 characters',
    save_password: 'Change password', saving: 'Saving...', password_ok: 'Password changed successfully!',
    payment_method: 'Subscription & billing', payment_desc: 'Manage your card, cancel or change your subscription in Stripe.',
    manage_stripe: 'Manage in Stripe →', business_profiles: 'Business profiles',
    no_domains: 'No scanned domains yet.', close: 'Close', edit: 'Edit', fill: 'Fill in', save: 'Save',
    dashboard_title: 'Dashboard',
    sub_free: 'Free plan — check your domain AI score',
    sub_lite: 'LITE — 1 domain · detailed report',
    sub_smart: 'SMART — up to 3 domains · content generator',
    sub_pro: 'PRO — up to 5 domains · AI mention check · competitor analysis',
    upgrade_tag: 'UPGRADE', upgrade_title: 'See exactly what to fix',
    upgrade_desc: 'Get specific improvement steps with LITE plan',
    see_plans: 'See plans →',
    smart_tag: 'SMART PLAN', smart_title: 'Get step-by-step instructions + ready files', upgrade_smart: 'Upgrade to SMART →',
    pro_tag: 'PRO PLAN', pro_title: '5 domains · AI mention check · Priority support',
    pro_desc: 'Everything you need to dominate AI search.', upgrade_pro: 'Upgrade to PRO →',
    check_domain: 'Check domain', domains_count: 'domains',
    analyze: 'Analyze →', scanning: 'Scanning...', checking: 'Checking 14 AI criteria...',
    scan_error_upgrade: 'Upgrade for more.',
    locked_title: 'Details locked', locked_sub: 'Get LITE plan to see exactly what to fix',
    recommendations: 'Top recommendations', generate_fix: 'Generate fix →',
    upgrade_instructions: 'Want step-by-step instructions?',
    my_domains: 'My domains', profile_filled: 'Profile filled', last: 'Last:',
    gen_fix: 'Generate fix', setup_gen: 'Setup & generate', history: 'History', hide: 'Hide',
    scan_history: 'Scan history', generated_content: 'Generated content', back: '← Back', copy: 'Copy',
    good: 'Good AI presence', needs_work: 'Needs improvement', weak: 'Weak AI presence',
    planLabel: { free: 'Free', lite: 'LITE', smart: 'SMART', pro: 'PRO' },
    questionLabels: ['Business name', 'Platform (WordPress, Webflow, Wix...)', 'Describe your business in 20 words', 'Where is your business located', '3 of your competitors'],
    password_error: 'Password must be at least 6 characters.', gens: 'gens',
    contact: 'Contact', contact_title: 'Contact us', contact_name: 'Your name',
    contact_email: 'Email', contact_message: 'Message',
    contact_send: 'Send message', contact_sending: 'Sending...', contact_sent: 'Sent! We\'ll be in touch.',
    pro_tools: 'PRO Tools',
    ai_mention_title: 'AI Mention Check',
    ai_mention_desc: 'Check if Claude mentions your business when asked about your category',
    ai_mention_category: 'Business category',
    ai_mention_category_ph: 'e.g. Italian restaurant, dental clinic',
    ai_mention_location_ph: 'e.g. Sofia, Bulgaria',
    ai_mention_domain: 'Your domain', ai_mention_name: 'Business name',
    ai_mention_check: 'Check AI mentions', ai_mention_checking: 'Checking...',
    ai_mentioned: '🎉 Your business IS mentioned by AI!',
    ai_not_mentioned: '😔 Your business is NOT mentioned by AI',
    ai_position: 'Position in AI response', ai_full_response: 'Full AI response', ai_query: 'Query used',
    competitor_title: 'Competitor Analysis',
    competitor_desc: 'Compare your AI score against competitors',
    competitor_domain_ph: 'Select your domain',
    competitor_run: 'Run analysis', competitor_running: 'Scanning...',
    competitor_your: 'You', competitor_score: 'AI Score', competitor_criteria: 'Criteria comparison',
  },
  bg: {
    generator: 'Генератор', upgrade: 'Upgrade', profile: 'Профил', logout: 'Изход',
    payment_ok: 'Плащането е успешно!', payment_sub: 'Добре дошъл! Планът се активира автоматично.',
    my_profile: 'Моят профил', to_scan: '← Dashboard',
    account: 'Акаунт', email: 'Имейл', active_plan: 'Активен план', upgrade_plan: '⚡ Upgrade план',
    change_password: 'Смяна на парола', new_password: 'Нова парола', min_chars: 'Минимум 6 символа',
    save_password: 'Смени паролата', saving: 'Запазва...', password_ok: 'Паролата е сменена успешно!',
    payment_method: 'Абонамент и плащане', payment_desc: 'Управлявай картата, спри или промени абонамента в Stripe.',
    manage_stripe: 'Управлявай в Stripe →', business_profiles: 'Бизнес профили',
    no_domains: 'Все още нямаш сканирани домейни.', close: 'Затвори', edit: 'Редактирай', fill: 'Попълни', save: 'Запази',
    dashboard_title: 'Dashboard',
    sub_free: 'Безплатен план — виж AI скора на домейна си',
    sub_lite: 'LITE — 1 домейн · детайлен доклад',
    sub_smart: 'SMART — до 3 домейна · генератор на съдържание',
    sub_pro: 'PRO — до 5 домейна · AI mention check · анализ на конкуренцията',
    upgrade_tag: 'UPGRADE', upgrade_title: 'Виж точно какво да оправиш',
    upgrade_desc: 'Получи конкретни стъпки с LITE план',
    see_plans: 'Виж плановете →',
    smart_tag: 'SMART ПЛАН', smart_title: 'Стъпка по стъпка инструкции + готови файлове', upgrade_smart: 'Upgrade към SMART →',
    pro_tag: 'PRO ПЛАН', pro_title: '5 домейна · AI mention check · Priority support',
    pro_desc: 'Всичко необходимо за доминиране в AI търсенето.', upgrade_pro: 'Upgrade към PRO →',
    check_domain: 'Провери домейн', domains_count: 'домейна',
    analyze: 'Анализирай →', scanning: 'Сканирам...', checking: 'Проверяваме 14 AI критерия...',
    scan_error_upgrade: 'Upgrade за повече.',
    locked_title: 'Детайлите са заключени', locked_sub: 'Вземи LITE план за да видиш какво точно трябва да оправиш',
    recommendations: 'Топ препоръки', generate_fix: 'Генерирай fix →',
    upgrade_instructions: 'Искаш стъпка по стъпка инструкции?',
    my_domains: 'Моите домейни', profile_filled: 'Профил попълнен', last: 'Последна:',
    gen_fix: 'Генерирай фикс', setup_gen: 'Настрой и генерирай', history: 'История', hide: 'Скрий',
    scan_history: 'История на сканиранията', generated_content: 'Генерирано съдържание', back: '← Назад', copy: 'Копирай',
    good: 'Добро AI присъствие', needs_work: 'Нужни подобрения', weak: 'Слабо AI присъствие',
    planLabel: { free: 'Безплатен', lite: 'LITE', smart: 'SMART', pro: 'PRO' },
    questionLabels: ['Име на бизнеса', 'Платформа (WordPress, Webflow, Wix...)', 'Опиши бизнеса си с 20 думи', 'Локация на бизнеса', '3 твои конкуренти'],
    password_error: 'Паролата трябва да е поне 6 символа.', gens: 'ген.',
    contact: 'Контакт', contact_title: 'Свържи се с нас', contact_name: 'Твоето име',
    contact_email: 'Имейл', contact_message: 'Съобщение',
    contact_send: 'Изпрати', contact_sending: 'Изпращам...', contact_sent: 'Изпратено! Скоро ще се свържем.',
    pro_tools: 'PRO Инструменти',
    ai_mention_title: 'AI Mention Check',
    ai_mention_desc: 'Провери дали Claude те споменава за твоята категория',
    ai_mention_category: 'Категория на бизнеса',
    ai_mention_category_ph: 'напр. италиански ресторант, зъболекарска клиника',
    ai_mention_location_ph: 'напр. София, България',
    ai_mention_domain: 'Твоят домейн', ai_mention_name: 'Име на бизнеса',
    ai_mention_check: 'Провери AI споменавания', ai_mention_checking: 'Проверявам...',
    ai_mentioned: '🎉 Твоят бизнес СЕ споменава от AI!',
    ai_not_mentioned: '😔 Твоят бизнес НЕ се споменава от AI',
    ai_position: 'Позиция в AI отговора', ai_full_response: 'Пълен AI отговор', ai_query: 'Използван запрос',
    competitor_title: 'Анализ на конкуренцията',
    competitor_desc: 'Сравни AI скора си с конкурентите',
    competitor_domain_ph: 'Избери домейн',
    competitor_run: 'Стартирай анализа', competitor_running: 'Сканирам...',
    competitor_your: 'Ти', competitor_score: 'AI Скор', competitor_criteria: 'Сравнение',
  }
}

// ─── Main component ────────────────────────────────────────────────────────────
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
  const [lockedDomains, setLockedDomains] = useState<{ domain: string; answers: any }[]>([])
  const [newPassword, setNewPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [editingDomainIdx, setEditingDomainIdx] = useState<number | null>(null)
  const [editAnswers, setEditAnswers] = useState<any>({})
  const [domainGenerations, setDomainGenerations] = useState<Record<string, any[]>>({})
  const [viewingGeneration, setViewingGeneration] = useState<{ domain: string; gen: any } | null>(null)
  const [viewingTab, setViewingTab] = useState('')
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const planCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [contactSending, setContactSending] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState("")

  useEffect(() => {
    setLocale(getLocaleFromPath())
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') { setSuccess(true); window.history.replaceState({}, '', window.location.pathname) }
    const init = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserEmail(user.email); setContactEmail(user.email)
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
          const stored = localStorage.getItem(`faindable_domains_${user.email}`) || localStorage.getItem(`geo_domains_${user.email}`)
          if (stored) {
            const parsed = JSON.parse(stored)
            setLockedDomains(parsed)
            const first = parsed.find((d: any) => d.answers)
            if (first?.answers) { setMentionDomain(first.domain); setCompetitorDomain(first.domain); setMentionName(first.answers.q0 || ''); setMentionLocation(first.answers.q3 || '') }
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

  const saveLockedDomains = (domains: { domain: string; answers: any }[], email: string) => {
    localStorage.setItem(`faindable_domains_${email}`, JSON.stringify(domains))
    setLockedDomains(domains)
  }

  const handleScan = async () => {
    if (!url) return
    const limit = DOMAIN_LIMITS[plan]
    const cleanDomain = url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()
    const alreadyLocked = lockedDomains.find(d => d.domain === cleanDomain)
    if (!alreadyLocked && lockedDomains.length >= limit) { setError(`${plan.toUpperCase()} — max ${limit}. ${t.scan_error_upgrade}`); return }
    setScanning(true); setResult(null); setError("")
    try {
      const res = await fetch(`/api/scan?domain=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.error) setError(data.message || "Error.")
      else {
        setResult(data); setScanHistory((prev: any[]) => [data, ...prev].slice(0, 5))
        if (!alreadyLocked && userEmail) saveLockedDomains([...lockedDomains, { domain: cleanDomain, answers: null }], userEmail)
      }
    } catch { setError("Error. Try again.") }
    setScanning(false)
  }

  const handleAiMentionCheck = async () => {
    if (!mentionCategory || !mentionLocation) return
    setMentionLoading(true); setMentionResult(null)
    try {
      const res = await fetch('/api/ai-mention', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain: mentionDomain, businessName: mentionName, businessCategory: mentionCategory, location: mentionLocation }) })
      setMentionResult(await res.json())
    } catch { setMentionResult({ error: true }) }
    setMentionLoading(false)
  }

  const handleCompetitorScan = async () => {
    if (!competitorDomain) return
    const domainData = lockedDomains.find(d => d.domain === competitorDomain || competitorDomain.includes(d.domain))
    const competitorList = domainData?.answers?.q4 ? domainData.answers.q4.split('\n').filter((c: string) => c.trim()).slice(0, 3) : []
    if (!competitorList.length) { setCompetitorResult({ error: 'no_competitors', message: locale === 'en' ? 'Fill in competitors in your business profile first.' : 'Попълни конкурентите в бизнес профила си.' }); return }
    setCompetitorLoading(true); setCompetitorResult(null)
    try {
      const res = await fetch('/api/competitor-scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mainDomain: competitorDomain, competitors: competitorList }) })
      setCompetitorResult(await res.json())
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
    } catch { setContactError(locale === 'en' ? "Error sending." : "Грешка при изпращане.") }
    setContactSending(false)
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
    saveLockedDomains(lockedDomains.map((d, i) => i === idx ? { ...d, answers: editAnswers } : d), userEmail)
    setEditingDomainIdx(null)
  }

  const handleLogout = async () => {
    try { const { createClient } = await import('@supabase/supabase-js'); await (createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)).auth.signOut() } catch {}
    window.location.href = `/${locale}`
  }

  const switchLocale = (l: string) => { window.location.href = `/${l}/dashboard` }
  const genLink = (domain: string) => `/${locale}/onboarding?domain=${encodeURIComponent(domain)}&prefill=true`
  const getTopIssues = (results: any, totalScore: number) => Object.values(results).filter((r: any) => r.status !== 'good').slice(0, totalScore < 50 ? 2 : 1)

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.borderL}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif", color: C.text, background: C.white }

  // ── Viewing generated content ─────────────────────────────────────────────
  if (viewingGeneration) {
    const content = viewingGeneration.gen.content || {}
    const tabs = allTabs.filter(tab => content[tab.id])
    const currentTab = viewingTab || tabs[0]?.id || ''
    return (
      <div style={{ minHeight: '100vh', background: C.cream, fontFamily: "'Outfit', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap'); body{margin:0;background:${C.cream}}`}</style>
        <header style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Logo locale={locale} />
          <button onClick={() => setViewingGeneration(null)} style={{ background: C.coral, color: C.white, border: "none", padding: "8px 18px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{t.back}</button>
        </header>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>{t.generated_content}</h1>
          <p style={{ color: C.muted, marginBottom: 28, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
            {viewingGeneration.domain} — {new Date(viewingGeneration.gen.generated_at).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setViewingTab(tab.id)} style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${currentTab === tab.id ? C.coral : C.borderL}`, background: currentTab === tab.id ? "rgba(255,90,71,0.07)" : C.white, color: C.navy, fontSize: 13, fontWeight: currentTab === tab.id ? 700 : 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{tab.label}</button>
            ))}
          </div>
          {currentTab && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{tabs.find(t => t.id === currentTab)?.label}</h2>
                <button onClick={() => navigator.clipboard.writeText(formatResult(currentTab, content[currentTab] || ''))} style={{ background: C.navy, color: C.white, padding: "6px 16px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{t.copy}</button>
              </div>
              <pre style={{ background: C.cream, borderRadius: 10, padding: 16, fontSize: 12, lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: C.text, maxHeight: 500, border: `1px solid ${C.borderL}`, fontFamily: "monospace" }}>{formatResult(currentTab, content[currentTab] || '')}</pre>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // ── Main dashboard ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        body { margin: 0; background: ${C.cream}; }
        input, textarea, select { font-family: 'Outfit', sans-serif !important; }
        input::placeholder, textarea::placeholder { color: rgba(10,22,40,0.3); }
        .dash-input:focus { border-color: ${C.coral} !important; outline: none; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Logo locale={locale} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Dropdown menu */}
          <DropdownMenu
            locale={locale} plan={plan}
            planLabel={t.planLabel[plan as keyof typeof t.planLabel]}
            onScan={() => setActiveTab('scan')}
            onProfile={() => setActiveTab('profile')}
            onContact={() => setActiveTab('contact')}
            onLogout={handleLogout}
            onGenerator={() => window.location.href = `/${locale}/onboarding`}
            onUpgrade={() => window.location.href = `/${locale}/upgrade`}
            onSwitchLocale={switchLocale}
          />
        </div>
      </header>

      {/* ── Page body ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 64px" }}>
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 14, padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "#166534", fontSize: 15, fontFamily: "'Outfit', sans-serif" }}>{t.payment_ok}</div>
            <div style={{ color: "#166534", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{t.payment_sub}</div>
          </div>
        )}

        {/* ── CONTACT ─────────────────────────────────────────────────── */}
        {activeTab === 'contact' && (
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.navy, margin: "0 0 24px", fontFamily: "'Outfit', sans-serif" }}>{t.contact_title}</h1>
            <Card>
              {contactSent ? (
                <div style={{ textAlign: "center" as const, padding: "32px 0", color: C.mint, fontSize: 16, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{t.contact_sent}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {[['contact_name', contactName, setContactName, locale === 'en' ? "Your name" : "Твоето име", 'text'],
                    ['contact_email', contactEmail, setContactEmail, 'email@example.com', 'email'],
                  ].map(([key, val, setter, ph, type]) => (
                    <div key={key as string}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{t[key as keyof typeof t] as string}</div>
                      <input className="dash-input" value={val as string} onChange={e => (setter as any)(e.target.value)} type={type as string} placeholder={ph as string} style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{t.contact_message} *</div>
                    <textarea className="dash-input" value={contactMessage} onChange={e => setContactMessage(e.target.value)} rows={5} placeholder={locale === 'en' ? "How can we help?" : "Как можем да помогнем?"} style={{ ...inputStyle, resize: "none" as const }} />
                  </div>
                  {contactError && <div style={{ color: C.coral, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{contactError}</div>}
                  <button onClick={handleSendContact} disabled={contactSending || !contactEmail || !contactMessage} style={{ background: C.coral, color: C.white, padding: "13px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif", opacity: !contactEmail || !contactMessage ? 0.5 : 1 }}>
                    {contactSending ? t.contact_sending : t.contact_send}
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── PROFILE ─────────────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.navy, margin: "0 0 24px", fontFamily: "'Outfit', sans-serif" }}>{t.my_profile}</h1>

            <Card style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>{t.account}</h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontFamily: "'Outfit', sans-serif" }}>{t.email}</div>
                  <div style={{ fontSize: 14, color: C.navy, fontWeight: 600, background: C.cream, padding: "10px 14px", borderRadius: 9, fontFamily: "'Outfit', sans-serif" }}>{userEmail || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontFamily: "'Outfit', sans-serif" }}>{t.active_plan}</div>
                  <div style={{ fontSize: 14, color: C.coral, fontWeight: 700, background: "rgba(255,90,71,0.06)", padding: "10px 14px", borderRadius: 9, fontFamily: "'Outfit', sans-serif" }}>{t.planLabel[plan as keyof typeof t.planLabel]}</div>
                </div>
                {plan !== 'pro' && <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const, fontFamily: "'Outfit', sans-serif" }}>{t.upgrade_plan}</a>}
              </div>
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>{t.change_password}</h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{t.new_password}</div>
                  <input className="dash-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={t.min_chars} style={inputStyle} />
                </div>
                <button onClick={handleChangePassword} disabled={savingPassword} style={{ background: C.navy, color: C.white, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Outfit', sans-serif", opacity: savingPassword ? 0.7 : 1 }}>
                  {savingPassword ? t.saving : t.save_password}
                </button>
              </div>
              {passwordMsg && <div style={{ marginTop: 10, fontSize: 13, color: passwordMsg.includes('success') || passwordMsg.includes('успешно') ? "#166534" : C.coral, fontFamily: "'Outfit', sans-serif" }}>{passwordMsg}</div>}
            </Card>

            {plan !== 'free' && (
              <Card style={{ marginBottom: 14 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{t.payment_method}</h2>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>{t.payment_desc}</p>
                <a href="https://billing.stripe.com/p/login/test_bpc_1TY3X0EvptFljOFhttCjP2zW" target="_blank" rel="noopener noreferrer" style={{ display: "block", background: C.navy, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, textAlign: "center" as const, fontFamily: "'Outfit', sans-serif" }}>{t.manage_stripe}</a>
              </Card>
            )}

            {plan !== 'free' && (
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{t.business_profiles}</h2>
                  <span style={{ fontSize: 12, color: C.muted, background: C.cream, padding: "3px 10px", borderRadius: 20, fontFamily: "'Outfit', sans-serif" }}>{lockedDomains.length}/{DOMAIN_LIMITS[plan]}</span>
                </div>
                {lockedDomains.length === 0 ? (
                  <div style={{ color: C.muted, fontSize: 13, textAlign: "center" as const, padding: "20px 0", fontFamily: "'Outfit', sans-serif" }}>{t.no_domains}</div>
                ) : lockedDomains.map((d, idx) => (
                  <div key={d.domain} style={{ marginBottom: 10, border: `1px solid ${C.borderL}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: C.cream }}>
                      <span style={{ fontWeight: 700, color: C.navy, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{d.domain}</span>
                      <button onClick={() => { setEditingDomainIdx(editingDomainIdx === idx ? null : idx); setEditAnswers(d.answers || {}) }} style={{ background: C.coral, color: C.white, border: "none", padding: "5px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
                        {editingDomainIdx === idx ? t.close : d.answers ? t.edit : t.fill}
                      </button>
                    </div>
                    {editingDomainIdx === idx && (
                      <div style={{ padding: 14, background: C.white }}>
                        {t.questionLabels.map((q, qi) => (
                          <div key={qi} style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 5, fontFamily: "'Outfit', sans-serif" }}>{q}</div>
                            <input className="dash-input" type="text" value={editAnswers[`q${qi}`] || ""} onChange={e => setEditAnswers((prev: any) => ({ ...prev, [`q${qi}`]: e.target.value }))} style={{ ...inputStyle, padding: "9px 12px", fontSize: 13 }} />
                          </div>
                        ))}
                        <button onClick={() => handleSaveAnswers(idx)} style={{ background: C.navy, color: C.white, padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{t.save}</button>
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {/* ── SCAN ────────────────────────────────────────────────────── */}
        {activeTab === 'scan' && (
          <>
            {/* Page header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: C.navy, margin: "0 0 6px", fontFamily: "'Outfit', sans-serif" }}>{t.dashboard_title}</h1>
              <p style={{ color: C.muted, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>
                {plan === 'free' && t.sub_free}{plan === 'lite' && t.sub_lite}
                {plan === 'smart' && t.sub_smart}{plan === 'pro' && t.sub_pro}
              </p>
            </div>

            <UpsellBanner locale={locale} plan={plan} t={t} />

            {/* Scan card */}
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{t.check_domain}</h2>
                {plan !== 'free' && <span style={{ fontSize: 12, color: C.muted, background: C.cream, padding: "4px 10px", borderRadius: 20, fontFamily: "'Outfit', sans-serif" }}>{lockedDomains.length}/{DOMAIN_LIMITS[plan]} {t.domains_count}</span>}
              </div>
              <div style={{ display: "flex", gap: 10 }} className="scan-row">
                <input className="dash-input" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleScan()} placeholder="example.com" style={{ ...inputStyle, flex: 1, fontSize: 15 }} />
                <button onClick={handleScan} disabled={scanning} style={{ background: scanning ? "rgba(255,90,71,0.5)" : C.coral, color: C.white, padding: "12px 24px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700, cursor: scanning ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                  {scanning ? t.scanning : t.analyze}
                </button>
              </div>
              {scanning && <div style={{ color: C.mint, fontSize: 13, marginTop: 12, padding: "10px 14px", background: "rgba(62,207,181,0.07)", border: "1px solid rgba(62,207,181,0.2)", borderRadius: 8, fontFamily: "'Outfit', sans-serif" }}>{t.checking}</div>}
              {error && (
                <div style={{ background: "#FFF0EF", border: "1px solid rgba(255,90,71,0.25)", borderRadius: 10, padding: "12px 14px", marginTop: 12, color: C.coral, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                  {error}
                  {error.includes('Upgrade') && <a href={`/${locale}/upgrade`} style={{ display: "block", marginTop: 8, background: C.coral, color: C.white, padding: "8px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, textAlign: "center" as const, fontFamily: "'Outfit', sans-serif" }}>{t.upgrade}</a>}
                </div>
              )}
            </Card>

            {/* Result */}
            {result && (
              <Card style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.borderL}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 52, fontWeight: 900, lineHeight: 1, color: result.totalScore > 60 ? C.mint : result.totalScore > 35 ? C.coral : "#ef4444" }}>
                      {result.totalScore}<span style={{ fontSize: 24 }}>%</span>
                    </div>
                    <div style={{ color: C.muted, fontSize: 14, marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>AI score · <strong style={{ color: C.navy }}>{result.domain}</strong></div>
                    <div style={{ display: "inline-block", marginTop: 8, padding: "5px 12px", borderRadius: 20, background: result.totalScore > 60 ? "#f0fdf4" : result.totalScore > 35 ? "rgba(255,90,71,0.08)" : "#fef2f2", color: result.totalScore > 60 ? "#166534" : result.totalScore > 35 ? C.coral : "#991b1b", fontSize: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                      {result.totalScore > 60 ? t.good : result.totalScore > 35 ? t.needs_work : t.weak}
                    </div>
                  </div>
                </div>

                {plan === 'free' ? (
                  <div style={{ textAlign: "center" as const, padding: "24px", background: C.cream, borderRadius: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{t.locked_title}</div>
                    <div style={{ color: C.muted, fontSize: 13, marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>{t.locked_sub}</div>
                    <a href={`/${locale}/upgrade`} style={{ display: "block", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{t.see_plans}</a>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 14, fontFamily: "'Outfit', sans-serif", textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>{t.recommendations}</h3>
                    {getTopIssues(result.results, result.totalScore).map((r: any) => (
                      <div key={r.label} style={{ marginBottom: 12, padding: "16px", borderRadius: 12, border: `1.5px solid rgba(255,90,71,0.25)`, background: "rgba(255,90,71,0.03)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: C.navy, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{r.label}</span>
                          <span style={{ fontWeight: 800, color: "#ef4444", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>{r.score}%</span>
                        </div>
                        <div style={{ color: C.muted, fontSize: 13, fontFamily: "'Outfit', sans-serif", marginBottom: (plan === 'smart' || plan === 'pro') ? 10 : 0 }}>{r.message}</div>
                        {(plan === 'smart' || plan === 'pro') && (
                          <a href={`/${locale}/onboarding`} style={{ display: "inline-block", background: C.coral, color: C.white, padding: "7px 16px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{t.generate_fix}</a>
                        )}
                        {plan === 'lite' && (
                          <div style={{ marginTop: 12, background: C.navy, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" as const }}>
                            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{t.upgrade_instructions}</div>
                            <a href={`/${locale}/upgrade`} style={{ background: C.coral, color: C.white, padding: "7px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 12, fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" as const }}>{t.upgrade_smart}</a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* My domains */}
            {plan !== 'free' && lockedDomains.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>{t.my_domains}</h2>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {lockedDomains.map((d) => {
                    const gens = domainGenerations[d.domain] || []
                    const lastGen = gens[0]
                    const isExpanded = expandedDomain === d.domain
                    return (
                      <Card key={d.domain} style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 11, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>🌐</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, color: C.navy, fontSize: 15, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, fontFamily: "'Outfit', sans-serif" }}>{d.domain}</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                              {d.answers && <span style={{ fontSize: 10, background: "rgba(62,207,181,0.1)", color: "#0F6E56", padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{t.profile_filled}</span>}
                              {gens.length > 0 && <span style={{ fontSize: 10, background: "rgba(255,90,71,0.08)", color: C.coral, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{gens.length} {t.gens}</span>}
                              {lastGen && <span style={{ fontSize: 10, color: C.muted, fontFamily: "'Outfit', sans-serif" }}>{t.last} {new Date(lastGen.generated_at).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB')}</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: "0 20px 16px", display: "flex", gap: 8 }}>
                          {(plan === 'smart' || plan === 'pro') && (
                            <a href={genLink(d.domain)} style={{ flex: 1, background: C.coral, color: C.white, padding: "9px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", textAlign: "center" as const, display: "block", fontFamily: "'Outfit', sans-serif" }}>
                              {d.answers ? t.gen_fix : t.setup_gen}
                            </a>
                          )}
                          {gens.length > 0 && (
                            <button onClick={() => setExpandedDomain(isExpanded ? null : d.domain)} style={{ flex: 1, background: C.cream, color: C.navy, border: `1px solid ${C.borderL}`, padding: "9px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                              {isExpanded ? t.hide : t.history}
                            </button>
                          )}
                        </div>
                        {isExpanded && gens.length > 0 && (
                          <div style={{ borderTop: `1px solid ${C.borderL}`, padding: "14px 20px" }}>
                            {gens.map((gen: any, gi: number) => (
                              <div key={gi} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: C.cream, borderRadius: 10, marginBottom: 8 }}>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, fontFamily: "'Outfit', sans-serif" }}>{new Date(gen.generated_at).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                  <div style={{ fontSize: 11, color: C.muted, fontFamily: "'Outfit', sans-serif" }}>{new Date(gen.generated_at).toLocaleTimeString(locale === 'bg' ? 'bg-BG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <button onClick={() => { setViewingGeneration({ domain: d.domain, gen }); setViewingTab('') }} style={{ background: C.navy, color: C.white, border: "none", padding: "6px 14px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>{t.history}</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* PRO Tools */}
            {plan === 'pro' && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{t.pro_tools}</h2>
                  <span style={{ background: C.coral, color: C.white, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, fontFamily: "'Outfit', sans-serif" }}>PRO</span>
                </div>
                {/* AI Mention Check */}
                <Card style={{ marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>🤖 {t.ai_mention_title}</h3>
                  <p style={{ color: C.muted, fontSize: 13, marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>{t.ai_mention_desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    {[
                      [t.ai_mention_domain, mentionDomain, setMentionDomain, "mybusiness.com"],
                      [t.ai_mention_name, mentionName, setMentionName, "My Business"],
                      [t.ai_mention_category, mentionCategory, setMentionCategory, t.ai_mention_category_ph],
                      ["Location", mentionLocation, setMentionLocation, t.ai_mention_location_ph],
                    ].map(([label, val, setter, ph]) => (
                      <div key={label as string}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 5, fontFamily: "'Outfit', sans-serif" }}>{label as string}</div>
                        <input className="dash-input" value={val as string} onChange={e => (setter as any)(e.target.value)} placeholder={ph as string} style={{ ...inputStyle, padding: "10px 12px", fontSize: 13 }} />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleAiMentionCheck} disabled={mentionLoading || !mentionCategory || !mentionLocation} style={{ width: "100%", background: C.coral, color: C.white, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif", opacity: !mentionCategory || !mentionLocation ? 0.5 : 1 }}>
                    {mentionLoading ? t.ai_mention_checking : t.ai_mention_check}
                  </button>
                  {mentionResult && !mentionResult.error && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ padding: "14px 18px", borderRadius: 12, background: mentionResult.isMentioned ? "#f0fdf4" : "#FFF0EF", border: `1px solid ${mentionResult.isMentioned ? "#86efac" : "rgba(255,90,71,0.25)"}`, marginBottom: 12 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: mentionResult.isMentioned ? "#166534" : C.coral, fontFamily: "'Outfit', sans-serif" }}>{mentionResult.isMentioned ? t.ai_mentioned : t.ai_not_mentioned}</div>
                        {mentionResult.position && <div style={{ fontSize: 13, color: mentionResult.isMentioned ? "#166534" : C.coral, marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>{t.ai_position}: #{mentionResult.position}</div>}
                      </div>
                      <button onClick={() => setShowFullResponse(!showFullResponse)} style={{ background: "none", border: `1px solid ${C.borderL}`, color: C.navy, padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                        {showFullResponse ? '▲' : '▼'} {t.ai_full_response}
                      </button>
                      {showFullResponse && <pre style={{ marginTop: 10, background: C.cream, borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, color: C.text, maxHeight: 300, overflow: "auto", border: `1px solid ${C.borderL}` }}>{mentionResult.aiResponse}</pre>}
                    </div>
                  )}
                </Card>
                {/* Competitor Analysis */}
                <Card>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>📊 {t.competitor_title}</h3>
                  <p style={{ color: C.muted, fontSize: 13, marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>{t.competitor_desc}</p>
                  <select value={competitorDomain} onChange={e => setCompetitorDomain(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }}>
                    <option value="">{t.competitor_domain_ph}</option>
                    {lockedDomains.map(d => <option key={d.domain} value={d.domain}>{d.domain}</option>)}
                  </select>
                  <button onClick={handleCompetitorScan} disabled={competitorLoading || !competitorDomain} style={{ width: "100%", background: C.navy, color: C.white, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif", opacity: !competitorDomain ? 0.5 : 1 }}>
                    {competitorLoading ? t.competitor_running : t.competitor_run}
                  </button>
                  {competitorResult && !competitorResult.error && competitorResult.main && (
                    <div style={{ marginTop: 20 }}>
                      {[competitorResult.main, ...competitorResult.competitors].filter(Boolean).map((d: any, i: number) => (
                        <div key={d.domain} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {i === 0 && <span style={{ background: C.coral, color: C.white, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10, fontFamily: "'Outfit', sans-serif" }}>{t.competitor_your}</span>}
                              <span style={{ fontWeight: i === 0 ? 700 : 500, color: C.navy, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{d.domain}</span>
                            </div>
                            <span style={{ fontWeight: 800, color: d.totalScore > 60 ? C.mint : d.totalScore > 35 ? C.coral : "#ef4444", fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>{d.totalScore}%</span>
                          </div>
                          <div style={{ height: 7, background: C.borderL, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: 7, borderRadius: 4, background: i === 0 ? C.coral : d.totalScore > 60 ? C.mint : d.totalScore > 35 ? C.coral : "#ef4444", width: `${d.totalScore}%`, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {competitorResult?.error && <div style={{ marginTop: 12, background: "#FFF0EF", border: "1px solid rgba(255,90,71,0.25)", borderRadius: 10, padding: "12px 14px", color: C.coral, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{competitorResult.message || (locale === 'en' ? 'Error scanning.' : 'Грешка при сканиране.')}</div>}
                </Card>
              </div>
            )}

            {/* Scan history */}
            {scanHistory.length > 1 && (
              <Card>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>{t.scan_history}</h2>
                {scanHistory.map((h: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < scanHistory.length - 1 ? `1px solid ${C.borderL}` : "none" }}>
                    <ScoreRing score={h.totalScore} />
                    <div>
                      <div style={{ fontWeight: 600, color: C.navy, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{h.domain}</div>
                      <div style={{ color: C.muted, fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>{new Date(h.scannedAt).toLocaleString(locale === 'bg' ? 'bg-BG' : 'en-GB')}</div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.borderL}`, textAlign: "center" as const }}>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: "'Outfit', sans-serif" }}>
            {[['Privacy Policy', `/${locale}/privacy`], ['Terms of Service', `/${locale}/terms`], ['Imprint', `/${locale}/imprint`]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: C.muted, textDecoration: "none", marginRight: 16 }}>{label}</a>
            ))}
            <button onClick={() => setActiveTab('contact')} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "'Outfit', sans-serif" }}>{t.contact}</button>
          </div>
          <div style={{ fontSize: 11, color: C.lightGray, marginTop: 8, fontFamily: "'Outfit', sans-serif" }}>© 2026 faindable.app</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .scan-row { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
