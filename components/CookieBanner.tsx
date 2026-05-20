'use client'
import { useState, useEffect } from 'react'

function getLocale() {
  if (typeof window === 'undefined') return 'en'
  return window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    setLocale(getLocale())
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  const t = {
    en: {
      text: 'We use essential cookies to keep you logged in and make the platform work. We do not use tracking or advertising cookies.',
      accept: 'Accept',
      decline: 'Decline',
      policy: 'Privacy Policy',
    },
    bg: {
      text: 'Използваме технически необходими бисквитки за да поддържаме сесията ти и да работи платформата. Не използваме проследяващи или рекламни бисквитки.',
      accept: 'Приемам',
      decline: 'Отказвам',
      policy: 'Политика за поверителност',
    }
  }[locale as 'en' | 'bg'] ?? {
    text: 'We use essential cookies to keep you logged in and make the platform work.',
    accept: 'Accept',
    decline: 'Decline',
    policy: 'Privacy Policy',
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, width: 'calc(100% - 48px)', maxWidth: 640,
      background: '#1B2A4A', borderRadius: 16, padding: '20px 24px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          🍪 {t.text}{' '}
          <a href={`/${locale}/privacy`} style={{ color: '#F5A623', textDecoration: 'underline', fontSize: 13 }}>
            {t.policy}
          </a>
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={decline} style={{
          background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.15)', padding: '8px 16px',
          borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
        }}>{t.decline}</button>
        <button onClick={accept} style={{
          background: '#F5A623', color: '#1B2A4A',
          border: 'none', padding: '8px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
        }}>{t.accept}</button>
      </div>
    </div>
  )
}
