'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  orange: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  lightGray: "#E8EDF4",
  textMuted: "#5A6B84",
}

export default function UpgradePage() {
 const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [loading, setLoading] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [userEmail, setUserEmail] = useState<string>('')
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUserEmail(user.email || '')
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_plans?email=eq.${encodeURIComponent(user.email || '')}&select=plan,status`,
          {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            }
          }
        )
        const data = await res.json()
        if (data?.[0]?.status === 'active') setCurrentPlan(data[0].plan)
      } catch { /* free plan */ }
      setPageLoading(false)
    }
    init()
  }, [])

  const priceIds = {
    monthly: {
      lite: process.env.NEXT_PUBLIC_STRIPE_LITE_MONTHLY || '',
      smart: process.env.NEXT_PUBLIC_STRIPE_SMART_MONTHLY || '',
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY || '',
    },
    yearly: {
      lite: process.env.NEXT_PUBLIC_STRIPE_LITE_YEARLY || '',
      smart: process.env.NEXT_PUBLIC_STRIPE_SMART_YEARLY || '',
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY || '',
    }
  }

  const plans = [
    {
      key: 'lite',
      name: 'Lite',
      monthlyPrice: '€29.90',
      yearlyPrice: '€9.90',
      yearlyTotal: '€118.80/yr',
      domains: 1,
      features: [
        '1 domain',
        'robots.txt & sitemap check',
        'llms.txt generator',
        'Schema.org generator',
        'FAQ generator',
        '1 fix per month',
      ],
    },
    {
      key: 'smart',
      name: 'Smart',
      monthlyPrice: '€59.90',
      yearlyPrice: '€39.90',
      yearlyTotal: '€478.80/yr',
      domains: 3,
      recommended: true,
      features: [
        '3 domains',
        'Everything in Lite',
        'Blog post generator',
        'Social media content',
        'Competitor analysis',
        '3 fixes per month',
      ],
    },
    {
      key: 'pro',
      name: 'Pro',
      monthlyPrice: '€79.90',
      yearlyPrice: '€59.90',
      yearlyTotal: '€718.80/yr',
      domains: 5,
      features: [
        '5 domains',
        'Everything in Smart',
        'AI mention check',
        'Priority support',
        'Custom integrations',
        'Unlimited fixes',
      ],
    },
  ]

  const planOrder = ['free', 'lite', 'smart', 'pro']
  const currentIdx = planOrder.indexOf(currentPlan)

  const handleCheckout = async (planKey: string) => {
    if (!agreed) {
      alert('Please agree to the Terms & Privacy Policy first.')
      return
    }
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
    } catch {
      alert('Checkout error. Please try again.')
    }
    setLoading(null)
  }

  if (pageLoading) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.offWhite, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: COLORS.navy, fontSize: 18, fontWeight: 600 }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(170deg, #1B2A4A 0%, #1E3558 100%)`, fontFamily: "'Outfit', sans-serif", padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto 40px' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          ← Back to Dashboard
        </a>
        <h1 style={{ color: COLORS.white, fontSize: 36, fontWeight: 800, margin: '0 0 12px' }}>
          Upgrade your plan
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, margin: 0 }}>
          You are currently on the <span style={{ color: COLORS.orange, fontWeight: 700, textTransform: 'capitalize' }}>{currentPlan}</span> plan.
        </p>
      </div>

      {/* Period toggle */}
      <div style={{ maxWidth: 900, margin: '0 auto 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, display: 'inline-flex', gap: 4 }}>
          {(['monthly', 'yearly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '10px 28px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'Outfit', sans-serif",
                transition: 'all 0.2s',
                background: period === p ? COLORS.white : 'transparent',
                color: period === p ? COLORS.navy : 'rgba(255,255,255,0.6)',
              }}
            >
              {p === 'monthly' ? 'Monthly' : 'Annual'} {p === 'yearly' && <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700 }}>SAVE 30%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {plans.map(plan => {
          const planIdx = planOrder.indexOf(plan.key)
          const isCurrent = plan.key === currentPlan
          const isDowngrade = planIdx < currentIdx
          const isUpgrade = planIdx > currentIdx

          return (
            <div
              key={plan.key}
              style={{
                background: plan.recommended ? COLORS.orange : COLORS.white,
                borderRadius: 20,
                padding: 28,
                border: isCurrent ? `3px solid #4ade80` : plan.recommended ? 'none' : `2px solid ${COLORS.lightGray}`,
                position: 'relative',
                opacity: isDowngrade ? 0.6 : 1,
              }}
            >
              {isCurrent && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#4ade80', color: '#064e3b', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>
                  YOUR CURRENT PLAN
                </div>
              )}
              {plan.recommended && !isCurrent && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: COLORS.navy, color: COLORS.white, padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}

              <h3 style={{ fontSize: 22, fontWeight: 800, color: plan.recommended ? COLORS.navy : COLORS.navy, margin: '0 0 4px' }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: 13, color: plan.recommended ? 'rgba(0,0,0,0.5)' : COLORS.textMuted, margin: '0 0 20px' }}>
                {plan.domains} domain{plan.domains > 1 ? 's' : ''}
              </p>

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: plan.recommended ? COLORS.navy : COLORS.navy }}>
                  {period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span style={{ fontSize: 14, color: plan.recommended ? 'rgba(0,0,0,0.5)' : COLORS.textMuted }}>/mo</span>
                {period === 'yearly' && (
                  <div style={{ fontSize: 12, color: plan.recommended ? 'rgba(0,0,0,0.5)' : COLORS.textMuted, marginTop: 2 }}>
                    Billed {plan.yearlyTotal}
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 13, color: plan.recommended ? COLORS.navy : COLORS.navy, padding: '5px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: plan.recommended ? COLORS.navy : '#4ade80', fontSize: 16, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div style={{ textAlign: 'center', padding: '12px', borderRadius: 10, background: 'rgba(74, 222, 128, 0.15)', color: '#064e3b', fontWeight: 700, fontSize: 14, border: '1px solid rgba(74,222,128,0.3)' }}>
                  ✓ Current Plan
                </div>
              ) : isDowngrade ? (
                <div style={{ textAlign: 'center', padding: '12px', borderRadius: 10, background: 'rgba(0,0,0,0.06)', color: COLORS.textMuted, fontWeight: 600, fontSize: 13 }}>
                  Downgrade — contact support
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => handleCheckout(plan.key)}
                    disabled={!agreed || loading === plan.key}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 10,
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 15,
                      fontFamily: "'Outfit', sans-serif",
                      cursor: agreed ? 'pointer' : 'not-allowed',
                      background: agreed
                        ? (plan.recommended ? COLORS.navy : COLORS.orange)
                        : 'rgba(0,0,0,0.12)',
                      color: agreed
                        ? (plan.recommended ? COLORS.white : COLORS.navy)
                        : COLORS.textMuted,
                      transition: 'all 0.2s',
                      marginBottom: 12,
                    }}
                  >
                    {loading === plan.key ? 'Loading...' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Global checkbox */}
      <div style={{ maxWidth: 900, margin: '28px auto 0', display: 'flex', justifyContent: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', maxWidth: 500 }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            style={{ width: 16, height: 16, marginTop: 2, cursor: 'pointer', accentColor: COLORS.orange, flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            I agree to the{' '}
            <a href="/terms" target="_blank" style={{ color: COLORS.orange, textDecoration: 'underline' }}>Terms of Service</a>
            {' & '}
            <a href="/privacy" target="_blank" style={{ color: COLORS.orange, textDecoration: 'underline' }}>Privacy Policy</a>
            . Services start immediately. EU withdrawal right waived.
          </span>
        </label>
      </div>

    </div>
  )
}
