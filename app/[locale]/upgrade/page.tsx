'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  green:   "#22c55e",
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ locale }: { locale: string }) {
  return (
    <a href={`/${locale}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5"  ry="5"  fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: 17, fontWeight: 800, color: C.white, fontFamily: "'Outfit', sans-serif" }}>
        faindable<span style={{ color: C.coral }}>.app</span>
      </span>
    </a>
  )
}

// ─── Dropdown menu ────────────────────────────────────────────────────────────
function DropdownMenu({ locale, onSwitchLocale }: {
  locale: string
  onSwitchLocale: (l: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const items = [
    { icon: "📊", label: locale === 'en' ? "Dashboard" : "Dashboard", href: `/${locale}/dashboard` },
    { icon: "🔍", label: locale === 'en' ? "Scan" : "Скан",           href: `/${locale}/dashboard` },
  ]

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 8,
        background: open ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
        border: `1px solid ${C.border}`, borderRadius: 10,
        padding: "7px 14px", cursor: "pointer", transition: "background 0.15s",
      }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          ⚡
        </div>
        <span style={{ fontSize: 13, color: C.white, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
          {locale === 'en' ? "Upgrade" : "Upgrade"}
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
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)", zIndex: 200,
        }}>
          {items.map((item, i) => (
            <a key={item.label} href={item.href} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", background: "none",
              borderTop: i > 0 ? `1px solid ${C.border}` : "none",
              textDecoration: "none",
              color: "rgba(255,255,255,0.8)", fontSize: 14,
              fontFamily: "'Outfit', sans-serif", fontWeight: 500, transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </a>
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
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function UpgradePage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [locale, setLocale] = useState('en')
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [loading, setLoading] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const l = window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
    setLocale(l)
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = `/${l}/login`; return }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_plans?email=eq.${encodeURIComponent(user.email || '')}&select=plan,status`,
          { headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}` } }
        )
        const data = await res.json()
        if (data?.[0]?.status === 'active') setCurrentPlan(data[0].plan)
      } catch {}
      setPageLoading(false)
    }
    init()
  }, [])

  const priceIds = {
    monthly: {
      lite:  process.env.NEXT_PUBLIC_STRIPE_LITE_MONTHLY  || '',
      smart: process.env.NEXT_PUBLIC_STRIPE_SMART_MONTHLY || '',
      pro:   process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY   || '',
    },
    yearly: {
      lite:  process.env.NEXT_PUBLIC_STRIPE_LITE_YEARLY  || '',
      smart: process.env.NEXT_PUBLIC_STRIPE_SMART_YEARLY || '',
      pro:   process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY   || '',
    }
  }

  const plans = [
    {
      key: 'lite', name: 'Lite',
      monthlyPrice: '€14.90', yearlyPrice: '€9.90', yearlyTotal: '€118.80/yr',
      domains: 1,
      features: ['1 domain', 'robots.txt & sitemap check', 'llms.txt generator', 'Schema.org generator', 'FAQ generator', '1 fix per month'],
    },
    {
      key: 'smart', name: 'Smart',
      monthlyPrice: '€59.90', yearlyPrice: '€39.90', yearlyTotal: '€478.80/yr',
      domains: 3, recommended: true,
      features: ['3 domains', 'Everything in Lite', 'Blog post generator', 'Social media content', 'Competitor analysis', '3 fixes per month'],
    },
    {
      key: 'pro', name: 'Pro',
      monthlyPrice: '€89.90', yearlyPrice: '€59.90', yearlyTotal: '€718.80/yr',
      domains: 5,
      features: ['5 domains', 'Everything in Smart', 'AI mention check', 'Priority support', 'Custom integrations', 'Unlimited fixes'],
    },
  ]

  const planOrder = ['free', 'lite', 'smart', 'pro']
  const currentIdx = planOrder.indexOf(currentPlan)

  const handleCheckout = async (planKey: string) => {
    if (!agreed) return
    setLoading(planKey)
    const priceId = priceIds[period][planKey as keyof typeof priceIds.monthly]
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Checkout error. Please try again.')
    } catch { alert('Checkout error. Please try again.') }
    setLoading(null)
  }

  if (pageLoading) {
    return (
      <div style={{ minHeight: '100vh', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');`}</style>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.navy, fontFamily: "'Outfit', sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.navy}; }
        @media (max-width: 768px) {
          .plans-grid { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; }
        }
      `}</style>

      {/* bg texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.border}`, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)", background: "rgba(10,22,40,0.85)" }}>
        <Logo locale={locale} />
        <DropdownMenu locale={locale} onSwitchLocale={(l) => window.location.href = `/${l}/upgrade`} />
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 24px 80px", position: "relative", zIndex: 2 }}>

        {/* Page headline */}
        <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,90,71,0.1)", border: "1px solid rgba(255,90,71,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.coral, fontFamily: "'Outfit', sans-serif" }}>
              {locale === 'en' ? "Choose a plan" : "Избери план"}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 900, color: C.white, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 14px" }}>
            {locale === 'en' ? <>Upgrade your <em style={{ color: C.coral, fontStyle: "italic" }}>plan</em></> : <>Надгради <em style={{ color: C.coral, fontStyle: "italic" }}>плана си</em></>}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, fontFamily: "'Outfit', sans-serif" }}>
            {locale === 'en'
              ? <>You are currently on the <span style={{ color: C.coral, fontWeight: 700, textTransform: "capitalize" as const }}>{currentPlan}</span> plan.</>
              : <>В момента си на <span style={{ color: C.coral, fontWeight: 700, textTransform: "capitalize" as const }}>{currentPlan}</span> план.</>}
          </p>
        </div>

        {/* Period toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, display: "inline-flex", gap: 4 }}>
            {(['yearly', 'monthly'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "10px 28px", borderRadius: 9, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 14, fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                background: period === p ? C.white : "transparent",
                color: period === p ? C.navy : "rgba(255,255,255,0.55)",
                boxShadow: period === p ? "0 1px 6px rgba(0,0,0,0.15)" : "none",
              }}>
                {p === 'yearly'
                  ? <>{locale === 'en' ? "Annual" : "Годишен"} <span style={{ color: C.mint, fontSize: 11, fontWeight: 700, marginLeft: 4 }}>–30%</span></>
                  : (locale === 'en' ? "Monthly" : "Месечен")}
              </button>
            ))}
          </div>
        </div>

        {/* Plans grid */}
        <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {plans.map(plan => {
            const planIdx   = planOrder.indexOf(plan.key)
            const isCurrent = plan.key === currentPlan
            const isDowngrade = planIdx < currentIdx

            return (
              <div key={plan.key} style={{
                background: plan.recommended ? C.white : "rgba(255,255,255,0.04)",
                border: isCurrent
                  ? `2px solid ${C.mint}`
                  : plan.recommended
                  ? `2px solid ${C.coral}`
                  : `1px solid ${C.border}`,
                borderRadius: 20, padding: 32,
                position: "relative",
                display: "flex", flexDirection: "column" as const,
                opacity: isDowngrade ? 0.5 : 1,
              }}>
                {/* Badge */}
                {isCurrent && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: C.mint, color: "#064e3b", padding: "4px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" as const, fontFamily: "'Outfit', sans-serif" }}>
                    {locale === 'en' ? "YOUR PLAN" : "ТВОЯТ ПЛАН"}
                  </div>
                )}
                {plan.recommended && !isCurrent && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: C.coral, color: C.white, padding: "4px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" as const, fontFamily: "'Outfit', sans-serif" }}>
                    {locale === 'en' ? "MOST POPULAR" : "НАЙ-ПОПУЛЯРЕН"}
                  </div>
                )}

                {/* Plan name */}
                <div style={{ fontSize: 20, fontWeight: 800, color: plan.recommended ? C.navy : C.white, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>{plan.name}</div>
                <div style={{ fontSize: 13, color: plan.recommended ? C.muted : "rgba(255,255,255,0.45)", marginBottom: 22, fontFamily: "'Outfit', sans-serif" }}>
                  {plan.domains} domain{plan.domains > 1 ? 's' : ''}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 900, color: plan.recommended ? C.coral : C.white, lineHeight: 1 }}>
                    {period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span style={{ fontSize: 14, color: plan.recommended ? C.muted : "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" }}>/mo</span>
                  {period === 'yearly' && (
                    <div style={{ fontSize: 12, color: plan.recommended ? C.muted : "rgba(255,255,255,0.35)", marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>
                      {locale === 'en' ? "Billed" : "Фактурирано"} {plan.yearlyTotal}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 28, flex: 1 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ color: plan.recommended ? C.coral : C.mint, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 13, color: plan.recommended ? C.navy : "rgba(255,255,255,0.8)", fontFamily: "'Outfit', sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div style={{ textAlign: "center" as const, padding: "12px", borderRadius: 10, background: "rgba(62,207,181,0.1)", color: C.mint, fontWeight: 700, fontSize: 13, border: "1px solid rgba(62,207,181,0.25)", fontFamily: "'Outfit', sans-serif" }}>
                    ✓ {locale === 'en' ? "Current Plan" : "Текущ план"}
                  </div>
                ) : isDowngrade ? (
                  <div style={{ textAlign: "center" as const, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                    {locale === 'en' ? "Downgrade — contact support" : "Понижаване — свържи се с нас"}
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.key)}
                    disabled={!agreed || loading === plan.key}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 12, border: "none",
                      fontWeight: 700, fontSize: 15, fontFamily: "'Outfit', sans-serif",
                      cursor: agreed ? "pointer" : "not-allowed",
                      background: !agreed
                        ? "rgba(255,255,255,0.08)"
                        : plan.recommended ? C.coral : C.white,
                      color: !agreed
                        ? "rgba(255,255,255,0.3)"
                        : plan.recommended ? C.white : C.navy,
                      opacity: loading === plan.key ? 0.6 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {loading === plan.key
                      ? "Loading..."
                      : `${locale === 'en' ? "Upgrade to" : "Upgrade към"} ${plan.name}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Checkbox */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", maxWidth: 520 }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ width: 16, height: 16, marginTop: 2, cursor: "pointer", accentColor: C.coral, flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
              {locale === 'en' ? "I agree to the" : "Съгласявам се с"}{' '}
              <a href={`/${locale}/terms`} target="_blank" style={{ color: C.coral, textDecoration: "underline" }}>
                {locale === 'en' ? "Terms of Service" : "Условията за ползване"}
              </a>
              {' & '}
              <a href={`/${locale}/privacy`} target="_blank" style={{ color: C.coral, textDecoration: "underline" }}>
                {locale === 'en' ? "Privacy Policy" : "Политиката за поверителност"}
              </a>
              {locale === 'en' ? ". Services start immediately. EU withdrawal right waived." : ". Услугата започва незабавно. Правото на отказ е отказано."}
            </span>
          </label>
        </div>

      </div>
    </div>
  )
}
