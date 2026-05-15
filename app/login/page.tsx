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

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    setTimeout(() => {
      setLoading(false)
      setMessage(isLogin ? 'Влизане успешно! 🎉' : 'Акаунтът е създаден! Провери имейла си. 📧')
    }, 1500)
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
          <p style={{ color: COLORS.textMuted, fontSize: 15 }}>
            {isLogin ? 'Нямаш акаунт?' : 'Вече имаш акаунт?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: COLORS.blue, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
              {isLogin ? 'Регистрирай се' : 'Влез'}
            </button>
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Имейл</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Парола</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {message && (
          <div style={{ background: message.includes('успешно') || message.includes('създаден') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.includes('успешно') || message.includes('създаден') ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: message.includes('успешно') || message.includes('създаден') ? '#166534' : '#991b1b', fontSize: 14 }}>
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
