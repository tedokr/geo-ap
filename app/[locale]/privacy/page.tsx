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

function LegalLayout({ locale, title, subtitle, tag, children }: {
  locale: string; title: string; subtitle: string; tag: string; children: React.ReactNode
}) {
  const backLabel = locale === 'bg' ? '← Към началото' : '← Back to Home'
  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; }
        p { margin: 0 0 12px; }
        p:last-child { margin-bottom: 0; }
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
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.coral, fontFamily: "'Outfit', sans-serif" }}>{tag}</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 900, color: C.navy, margin: "0 0 14px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>{title}</h1>
          <p style={{ color: C.muted, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{subtitle}</p>
          <div style={{ height: 3, background: C.coral, borderRadius: 2, marginTop: 20, width: 48 }} />
        </div>

        {children}

        {/* Footer bar */}
        <div style={{ background: C.navy, borderRadius: 14, padding: "20px 24px", marginTop: 56 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
            &copy; 2026 Business Solutions Consulting EOOD, trading as faindable.app. All rights reserved. VAT: BG200487371.
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Outfit', sans-serif" }}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.navy, color: C.coral, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, fontFamily: "'Outfit', sans-serif" }}>{num}</span>
        {title}
      </h2>
      <div style={{ borderLeft: `3px solid ${C.borderL}`, paddingLeft: 20 }}>
        {children}
      </div>
    </div>
  )
}

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ color: C.text, fontSize: 14, lineHeight: 1.85, marginBottom: 10, fontFamily: "'Outfit', sans-serif", textAlign: "justify" as const }}>{children}</p>
}

export default function Privacy() {
  const [locale, setLocale] = useState('en')
  useEffect(() => { setLocale(getLocale()) }, [])

  return (
    <LegalLayout
      locale={locale}
      tag="Legal"
      title="Privacy Policy"
      subtitle="Effective Date: May 2026  ·  Version 1.0  ·  Business Solutions Consulting EOOD (faindable.app)"
    >
      <Section num="1" title="Data Controller">
        <Para>The data controller responsible for the processing of your personal data is: Business Solutions Consulting EOOD, trading as faindable.app. Registered address: bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria. VAT: BG200487371.</Para>
        <Para>This Privacy Policy explains how we collect, use, store, and share your personal data when you use the faindable.app platform and related services. It complies with the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and applicable Bulgarian data protection law.</Para>
      </Section>

      <Section num="2" title="Data We Collect">
        <Para><strong>Account Data:</strong> When you register, we collect your name, email address, password (stored in hashed form), and subscription plan details.</Para>
        <Para><strong>Payment Data:</strong> Payment is processed by Stripe, Inc. We do not store credit card numbers or full payment details. We retain transaction records including amounts, dates, and subscription status.</Para>
        <Para><strong>Usage Data:</strong> We collect information about how you use the platform, including domains you analyze, scan results, generated content, feature interactions, and session activity.</Para>
        <Para><strong>Technical Data:</strong> IP address, browser type and version, operating system, device type, referring URLs, and approximate geographic location.</Para>
        <Para><strong>Communications:</strong> If you contact us by email or through the platform, we retain those communications.</Para>
        <Para><strong>Social/Business Data (No-Website Users):</strong> If you use our social presence analysis feature, we collect any Google Maps, Facebook, or Instagram URLs you provide voluntarily, along with your business description.</Para>
        <Para><strong>Website Request Data:</strong> If you submit a request for website creation services, we collect your name, email, business description, and social profile links.</Para>
      </Section>

      <Section num="3" title="Legal Basis for Processing (GDPR)">
        <Para>We process your personal data on the following legal bases under Article 6 GDPR:</Para>
        <Para><strong>Contractual Necessity (Art. 6(1)(b)):</strong> Processing your account data, subscription information, and usage data is necessary to provide the Services you have contracted for.</Para>
        <Para><strong>Legitimate Interests (Art. 6(1)(f)):</strong> We process technical and usage data to improve the platform, prevent fraud, ensure security, and conduct business analytics.</Para>
        <Para><strong>Consent (Art. 6(1)(a)):</strong> Where we send marketing communications, we rely on your freely given, specific, and informed consent. You may withdraw consent at any time.</Para>
        <Para><strong>Legal Obligation (Art. 6(1)(c)):</strong> We may process data to comply with applicable tax, accounting, and legal obligations.</Para>
      </Section>

      <Section num="4" title="How We Use Your Data">
        <Para>To provide, maintain, and improve the Services.</Para>
        <Para>To process payments and manage your subscription.</Para>
        <Para>To generate AI-assisted content and analysis reports based on the domains and information you provide.</Para>
        <Para>To communicate with you regarding your account, subscription, service updates, and support requests.</Para>
        <Para>To send you marketing communications, where you have consented to receive them.</Para>
        <Para>To detect, prevent, and respond to fraud, abuse, and security incidents.</Para>
        <Para>To comply with legal obligations and respond to lawful requests from authorities.</Para>
        <Para>To analyze aggregate usage patterns and improve platform performance.</Para>
      </Section>

      <Section num="5" title="Data Sharing and Third Parties">
        <Para>We do not sell your personal data. We share data only as described below:</Para>
        <Para><strong>Stripe, Inc.:</strong> Payment processing. Stripe's privacy policy is available at stripe.com/privacy.</Para>
        <Para><strong>Supabase, Inc.:</strong> Database and authentication infrastructure. Data is stored on Supabase-hosted servers.</Para>
        <Para><strong>Anthropic, PBC:</strong> AI content generation. Prompts containing business information you provide are processed by Anthropic's API. We do not share your personal account information with Anthropic.</Para>
        <Para><strong>Vercel, Inc.:</strong> Platform hosting and deployment infrastructure.</Para>
        <Para><strong>Legal Authorities:</strong> We may disclose data to competent authorities where required by applicable law, court order, or to protect faindable.app's legal rights.</Para>
        <Para><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, subject to the same privacy protections.</Para>
      </Section>

      <Section num="6" title="International Data Transfers">
        <Para>Some of our service providers (including Stripe, Anthropic, and Vercel) are located in the United States. When we transfer your personal data outside the European Economic Area, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.</Para>
        <Para>By using the Services, you acknowledge that your data may be transferred to and processed in countries outside your country of residence, including the United States.</Para>
      </Section>

      <Section num="7" title="Data Retention">
        <Para>Account data is retained for the duration of your subscription and for five (5) years thereafter, or as required by applicable law.</Para>
        <Para>Payment and transaction records are retained for ten (10) years to comply with Bulgarian and EU accounting and tax obligations.</Para>
        <Para>Scan results and generated content are retained in accordance with your subscription plan's history limits.</Para>
        <Para>Upon account deletion, we will delete or anonymize your personal data within thirty (30) days, except where retention is required by law.</Para>
      </Section>

      <Section num="8" title="Your Rights">
        <Para>Under GDPR and applicable Bulgarian law, you have the following rights regarding your personal data:</Para>
        <Para><strong>Right of Access (Art. 15 GDPR):</strong> You may request a copy of the personal data we hold about you.</Para>
        <Para><strong>Right to Rectification (Art. 16 GDPR):</strong> You may request correction of inaccurate or incomplete data.</Para>
        <Para><strong>Right to Erasure (Art. 17 GDPR):</strong> You may request deletion of your data in certain circumstances.</Para>
        <Para><strong>Right to Restriction (Art. 18 GDPR):</strong> You may request that we restrict processing of your data.</Para>
        <Para><strong>Right to Data Portability (Art. 20 GDPR):</strong> You may request your data in a structured, machine-readable format.</Para>
        <Para><strong>Right to Object (Art. 21 GDPR):</strong> You may object to processing based on legitimate interests.</Para>
        <Para><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.</Para>
        <Para><strong>California Residents (CCPA):</strong> You have the right to know what personal information is collected, the right to delete, the right to opt-out of sale (we do not sell data), and the right to non-discrimination.</Para>
        <Para>To exercise any of these rights, contact us at the address in Section 1. We will respond within thirty (30) days. You also have the right to lodge a complaint with the Bulgarian Commission for Personal Data Protection (CPDP) at www.cpdp.bg, or with your local supervisory authority.</Para>
      </Section>

      <Section num="9" title="Cookies and Tracking">
        <Para>We use technically necessary cookies to maintain your session and authentication state. These cookies are essential for the platform to function and do not require consent.</Para>
        <Para>We do not currently use advertising cookies, tracking pixels, or cross-site tracking technologies. If this changes, we will update this Policy and obtain your consent where required.</Para>
      </Section>

      <Section num="10" title="Security">
        <Para>We implement commercially reasonable technical and organizational measures to protect your personal data, including encrypted data transmission (TLS), hashed password storage, access controls, and regular security assessments.</Para>
        <Para>In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and affected individuals without undue delay, as required by GDPR.</Para>
      </Section>

      <Section num="11" title="Changes to This Policy">
        <Para>We may update this Privacy Policy from time to time. Material changes will be communicated via email or platform notification at least fourteen (14) days before taking effect. The current version will always be available at faindable.app/privacy.</Para>
      </Section>

      <Section num="12" title="Contact">
        <Para>For any privacy-related questions, requests, or concerns, please contact: Business Solutions Consulting EOOD (faindable.app), bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria. VAT: BG200487371.</Para>
      </Section>
    </LegalLayout>
  )
}
