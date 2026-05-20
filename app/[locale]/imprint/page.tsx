'use client'
import { useEffect, useState } from 'react'

const C = {
  navy:    "#0A1628",
  coral:   "#FF5A47",
  cream:   "#F7F6F2",
  white:   "#FFFFFF",
  border:  "rgba(255,255,255,0.09)",
  borderL: "rgba(10,22,40,0.09)",
  text:    "#1A2B40",
  muted:   "#5A6A7A",
}

function getLocale() {
  if (typeof window === 'undefined') return 'en'
  return window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
}

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ color: C.text, fontSize: 14, lineHeight: 1.85, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>{children}</p>
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, padding: "24px 28px", border: `1px solid ${C.borderL}`, marginBottom: 16 }}>
      {children}
    </div>
  )
}

export default function Imprint() {
  const [locale, setLocale] = useState('en')
  useEffect(() => { setLocale(getLocale()) }, [])
  const backLabel = locale === 'bg' ? '← Към началото' : '← Back to Home'

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; }
      `}</style>

      {/* Header */}
      <header style={{ background: C.navy, borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <a href={`/${locale}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
            <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
            <ellipse cx="22" cy="17" rx="5" ry="5" fill="white" />
            <polygon points="22,40 16,27 28,27" fill={C.coral} />
          </svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: C.white, fontFamily: "'Outfit', sans-serif" }}>
            faindable<span style={{ color: C.coral }}>.app</span>
          </span>
        </a>
        <a href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", background: "rgba(255,255,255,0.07)", border: `1px solid ${C.border}`, padding: "7px 16px", borderRadius: 8, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>
          {backLabel}
        </a>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,90,71,0.07)", border: "1px solid rgba(255,90,71,0.18)", borderRadius: 100, padding: "5px 16px", marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.coral, fontFamily: "'Outfit', sans-serif" }}>Legal</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 900, color: C.navy, margin: "0 0 14px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>Imprint / Impressum</h1>
          <p style={{ color: C.muted, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>Legal disclosure pursuant to applicable EU, German, Austrian, and Swiss law</p>
          <div style={{ height: 3, background: C.coral, borderRadius: 2, marginTop: 20, width: 48 }} />
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 40 }} className="imprint-grid">
          {[
            { label: "Company Name",          value: "Business Solutions Consulting EOOD\n(trading as faindable.app)" },
            { label: "Legal Form",             value: "EOOD — Single-Member Limited Liability Company\n(equivalent to GmbH / Ltd)" },
            { label: "Registered Address",     value: "bul. Knyaz Aleksandar Dondukov 79\nFloor 7, Apt. 7\nSofia 1504, Bulgaria" },
            { label: "VAT Number",             value: "BG200487371" },
            { label: "Country of Registration",value: "Republic of Bulgaria\n(European Union member state)" },
            { label: "Commercial Register",    value: "Bulgarian Commercial Register\n(Targovskiy Registar)" },
            { label: "Platform",               value: "faindable.app\nAI Search Optimization Platform" },
            { label: "Governing Law",          value: "Republic of Bulgaria\nJurisdiction: Sofia courts" },
          ].map(item => (
            <div key={item.label} style={{ background: C.white, borderRadius: 12, padding: "18px 22px", border: `1px solid ${C.borderL}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{item.label}</div>
              <div style={{ fontSize: 14, color: C.navy, fontWeight: 600, lineHeight: 1.6, whiteSpace: "pre-line" as const, fontFamily: "'Outfit', sans-serif" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Responsible for Content */}
        <InfoCard>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: "'Outfit', sans-serif" }}>Responsible for Content</h2>
          <Para>
            Business Solutions Consulting EOOD<br />
            bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7<br />
            Sofia 1504, Bulgaria<br />
            VAT: BG200487371
          </Para>
        </InfoCard>

        {/* Dispute Resolution */}
        <InfoCard>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: "'Outfit', sans-serif" }}>Dispute Resolution</h2>
          <Para><strong>EU Online Dispute Resolution:</strong> The European Commission provides an online dispute resolution platform available at <strong>ec.europa.eu/consumers/odr</strong>. We are not obligated to participate in dispute resolution proceedings before a consumer arbitration board, but we are willing to do so in appropriate cases.</Para>
          <Para><strong>Governing Law:</strong> All disputes arising from or in connection with the use of this platform shall be governed by the laws of the Republic of Bulgaria. The competent courts in Sofia, Bulgaria shall have exclusive jurisdiction.</Para>
        </InfoCard>

        {/* Disclaimer */}
        <InfoCard>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: "'Outfit', sans-serif" }}>Disclaimer of Liability</h2>
          <Para><strong>Content:</strong> The content of this website has been prepared with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the information provided.</Para>
          <Para><strong>External Links:</strong> Our website may contain links to external third-party websites. We have no influence over the content of those sites and accept no responsibility for them.</Para>
          <Para><strong>AI-Generated Content:</strong> faindable.app utilizes artificial intelligence to generate optimization recommendations and content files. Such outputs are provided for informational purposes only and do not constitute professional advice. We make no warranty that AI-generated content will result in specific outcomes. See our Terms of Service for complete limitations.</Para>
        </InfoCard>

        {/* Copyright */}
        <InfoCard>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: "'Outfit', sans-serif" }}>Copyright</h2>
          <Para>The content and works published on this website are governed by Bulgarian and international copyright law. Reproduction, processing, distribution, or any form of commercialization of such material beyond the scope of copyright law requires the prior written consent of Business Solutions Consulting EOOD.</Para>
        </InfoCard>

        {/* Footer bar */}
        <div style={{ background: C.navy, borderRadius: 14, padding: "20px 24px", marginTop: 40 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
            &copy; 2026 Business Solutions Consulting EOOD, trading as faindable.app. All rights reserved.<br />
            VAT: BG200487371 | Sofia 1504, Bulgaria | Last updated: May 2026
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .imprint-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
