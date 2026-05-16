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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function signInWithGoogle() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent('https://geo-ap.vercel.app/dashboard')}`, {
    headers: { apikey: SUPABASE_ANON_KEY }
  })
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent('https://geo-ap.vercel.app/dashboard')}`
}

async function signInWithEmail(email: string, password: string, isLogin: boolean) {
  const endpoint = isLogin ? 'token?grant_type=password' : 'signup'
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setMessage('')
    const data = await signInWithEmail(email, password, isLogin)
    setLoading(false)
    if (data.error) {
      setMessage('❌ ' + data.error_description || data.error)
    } else if (!isLogin) {
      setMessage('📧 Провери имейла си за потвърждение!')
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(165deg, ${COLORS.navy} 0%, #243B65 50%, ${COLORS.blue} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ background: COLORS.white, borderRadius: 24, padding: 48, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
          </a>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginTop: 24, marginBottom: 8 }}>
            {isLogin ? 'Влез в акаунта си' : 'Създай акаунт'}
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 15, margin: 0 }}>
            {isLogin ? 'Нямаш акаунт?' : 'Вече имаш акаунт?'}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setMessage('') }} style={{ background: 'none', border: 'none', color: COLORS.blue, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
              {isLogin ? 'Регистрирай се' : 'Влез'}
            </button>
          </p>
        </div>

        {/* Google бутон */}
        <button
          onClick={signInWithGoogle}
          style={{ width: '100%', background: COLORS.white, color: '#1f1f1f', padding: '14px', borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Продължи с Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: COLORS.lightGray }} />
          <span style={{ color: COLORS.textMuted, fontSize: 13 }}>или с имейл</span>
          <div style={{ flex: 1, height: 1, background: COLORS.lightGray }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Имейл</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Парола</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {message && (
          <div style={{ background: message.includes('❌') ? '#fef2f2' : '#f0fdf4', border: `1px solid ${message.includes('❌') ? '#fca5a5' : '#86efac'}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: message.includes('❌') ? '#991b1b' : '#166534', fontSize: 14 }}>
            {message}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{ width: '100%', background: COLORS.orange, color: COLORS.navy, padding: '16px', borderRadius: 10, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
        >
          {loading ? '⏳ Зареждане...' : isLogin ? 'Влез' : 'Създай акаунт'}
        </button>
      </div>
    </div>
  )
}
