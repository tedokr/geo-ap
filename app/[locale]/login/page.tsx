'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'

// ─── Design tokens (matches landing page) ─────────────────────────────────────
const C = {
  navy:    "#0A1628",
  coral:   "#FF5A47",
  coralDk: "#E04535",
  mint:    "#3ECFB5",
  cream:   "#F7F6F2",
  white:   "#FFFFFF",
  border:  "rgba(255,255,255,0.09)",
  borderL: "rgba(10,22,40,0.09)",
  text:    "#0A1628",
  muted:   "#5A6A7A",
}

function Logo({ size = 22 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
      <svg width={size * 1.6} height={size * 1.6} viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5"  ry="5"  fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: size, fontWeight: 800, color: C.white, fontFamily: "'Outfit', sans-serif" }}>
        findable<span style={{ color: C.coral }}>.app</span>
      </span>
    </span>
  )
}

export default function LoginPage() {
  const locale = useLocale()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState('')

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const t = (locale === 'bg' ? {
    title_login: 'Добре дошъл обратно',
    title_register: 'Създай акаунт',
    sub_login: 'Влез в акаунта си и провери AI видимостта си.',
    sub_register: 'Безплатно. Без кредитна карта.',
    no_account: 'Нямаш акаунт?',
    have_account: 'Вече имаш акаунт?',
    register: 'Регистрирай се',
    login: 'Влез',
    google: 'Продължи с Google',
    redirecting: 'Пренасочване...',
    or: 'или с имейл',
    email: 'Имейл',
    password: 'Парола',
    submit_login: 'Влез в акаунта',
    submit_register: 'Създай акаунт',
    loading: 'Зареждане...',
    confirm_email: 'Провери имейла си за потвърждение!',
    error: 'Грешка. Опитай пак.',
    back: '← Обратно към началото',
  } : {
    title_login: 'Welcome back',
    title_register: 'Create your account',
    sub_login: 'Log in and check your AI visibility score.',
    sub_register: 'Free to start. No credit card required.',
    no_account: "Don't have an account?",
    have_account: 'Already have an account?',
    register: 'Sign up',
    login: 'Log in',
    google: 'Continue with Google',
    redirecting: 'Redirecting...',
    or: 'or continue with email',
    email: 'Email',
    password: 'Password',
    submit_login: 'Log in',
    submit_register: 'Create account',
    loading: 'Loading...',
    confirm_email: 'Check your email for a confirmation link!',
    error: 'Error. Please try again.',
    back: '← Back to home',
  })

  const handleGoogle = async () => {
    setGoogleLoading(true)
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=https://geo-ap.vercel.app/${locale}/dashboard&scopes=email+profile`
  }

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setMessage('')
    try {
      const endpoint = isLogin ? 'token?grant_type=password' : 'signup'
      const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.error || data.error_description) {
        setMessage(data.error_description || data.error || t.error)
      } else if (!isLogin) {
        setMessage(t.confirm_email)
      } else if (data.access_token) {
        window.location.href = `/${locale}/dashboard`
      }
    } catch {
      setMessage(t.error)
    }
    setLoading(false)
  }

  const isError = message && !message.includes('email') && !message.includes('имейл')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.navy}; }
        input { font-family: 'Outfit', sans-serif; }
        input::placeholder { color: rgba(10,22,40,0.3); }
        .input-field:focus { border-color: ${C.coral} !important; outline: none; }
        .google-btn:hover { background: ${C.cream} !important; }
        .switch-btn:hover { color: ${C.coralDk} !important; }
        .submit-btn:hover:not(:disabled) { background: ${C.coralDk} !important; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: C.navy,
        display: 'flex',
        flexDirection: 'column' as const,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />
        {/* Radial accents */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,90,71,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 400, height: 400, borderRadius: "50%", background: "rgba(62,207,181,0.03)", pointerEvents: "none" }} />

        {/* Nav */}
        <nav style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
          <a href={`/${locale}`} style={{ textDecoration: "none" }}><Logo size={20} /></a>
          <a href={`/${locale}`} style={{ fontSize: 13, color: C.muted, textDecoration: "none", fontFamily: "'Outfit', sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.white)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >{t.back}</a>
        </nav>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 48px", position: "relative", zIndex: 2 }}>
          <div style={{ width: "100%", maxWidth: 440 }}>

            {/* Card */}
            <div style={{
              background: C.white,
              borderRadius: 24,
              padding: "44px 40px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
            }}>
              {/* Header */}
              <div style={{ textAlign: "center" as const, marginBottom: 36 }}>
                <h1 style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: 32, fontWeight: 900, color: C.navy,
                  letterSpacing: "-0.02em", lineHeight: 1.1,
                  margin: "0 0 10px",
                }}>
                  {isLogin
                    ? <>{locale === 'en' ? 'Welcome' : 'Добре дошъл'} <em style={{ color: C.coral, fontStyle: "italic" }}>{locale === 'en' ? 'back' : 'обратно'}</em></>
                    : <>{locale === 'en' ? 'Create your' : 'Създай'} <em style={{ color: C.coral, fontStyle: "italic" }}>{locale === 'en' ? 'account' : 'акаунт'}</em></>
                  }
                </h1>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}>
                  {isLogin ? t.sub_login : t.sub_register}
                </p>
              </div>

              {/* Google button */}
              <button
                className="google-btn"
                onClick={handleGoogle}
                disabled={googleLoading}
                style={{
                  width: '100%', background: C.cream, color: C.text,
                  padding: '13px 16px', borderRadius: 12,
                  border: `1.5px solid ${C.borderL}`,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  marginBottom: 24, opacity: googleLoading ? 0.7 : 1,
                  fontFamily: "'Outfit', sans-serif", transition: "background 0.2s",
                }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {googleLoading ? t.redirecting : t.google}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: C.borderL }} />
                <span style={{ color: C.muted, fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>{t.or}</span>
                <div style={{ flex: 1, height: 1, background: C.borderL }} />
              </div>

              {/* Email field */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{t.email}</label>
                <input
                  className="input-field"
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: `1.5px solid ${C.borderL}`, fontSize: 14, color: C.navy, background: C.white, transition: "border-color 0.2s" }}
                />
              </div>

              {/* Password field */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{t.password}</label>
                <input
                  className="input-field"
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: `1.5px solid ${C.borderL}`, fontSize: 14, color: C.navy, background: C.white, transition: "border-color 0.2s" }}
                />
              </div>

              {/* Message */}
              {message && (
                <div style={{
                  background: isError ? "#FFF0EF" : "#F0FDF4",
                  border: `1px solid ${isError ? "rgba(255,90,71,0.3)" : "rgba(34,197,94,0.3)"}`,
                  borderRadius: 10, padding: '12px 16px', marginBottom: 18,
                  color: isError ? C.coral : "#166534", fontSize: 13,
                  fontFamily: "'Outfit', sans-serif", lineHeight: 1.5,
                }}>
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', background: C.coral, color: C.white,
                  padding: '14px', borderRadius: 12, border: 'none',
                  fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1, fontFamily: "'Outfit', sans-serif",
                  transition: "background 0.2s", marginBottom: 20,
                }}>
                {loading ? t.loading : isLogin ? t.submit_login : t.submit_register}
              </button>

              {/* Toggle */}
              <p style={{ textAlign: 'center' as const, fontSize: 13, color: C.muted, fontFamily: "'Outfit', sans-serif" }}>
                {isLogin ? t.no_account : t.have_account}{' '}
                <button
                  className="switch-btn"
                  onClick={() => { setIsLogin(!isLogin); setMessage('') }}
                  style={{ background: 'none', border: 'none', color: C.coral, fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit', sans-serif", transition: "color 0.2s" }}>
                  {isLogin ? t.register : t.login}
                </button>
              </p>
            </div>

            {/* Below card */}
            <p style={{ textAlign: "center" as const, marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
              {locale === 'en'
                ? "By continuing you agree to our Terms of Service and Privacy Policy."
                : "Продължавайки, се съгласяваш с Условията за ползване и Политиката за поверителност."}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
