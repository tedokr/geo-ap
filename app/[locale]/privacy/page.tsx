'use client'
import { useEffect, useState } from 'react'

function getLocale() {
  if (typeof window === 'undefined') return 'en'
  return window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
}

export default function Privacy() {
  const [locale, setLocale] = useState('en')
  useEffect(() => { setLocale(getLocale()) }, [])
  const backLabel = locale === 'bg' ? 'Към началото' : 'Back to Home'

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFD", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <header style={{ background: "#1B2A4A", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
  <a href={`/${locale}`} style={{ textDecoration: "none" }}>
    <span style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>GEO<span style={{ color: "#F5A623" }}>.app</span></span>
  </a>
  <a href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", background: "rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: 20, fontWeight: 600 }}>← {backLabel}</a>
</header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 32px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: "#F5A623" }}>Legal</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1B2A4A", margin: "0 0 12px", lineHeight: 1.2 }}>Privacy Policy</h1>
          <p style={{ color: "#5A6B84", fontSize: 15, margin: 0 }}>Effective Date: May 2026 &nbsp;|&nbsp; Version 1.0 &nbsp;|&nbsp; Business Solutions Consulting EOOD (GEO.app)</p>
          <div style={{ height: 3, background: "linear-gradient(90deg, #F5A623, #2E6BAD)", borderRadius: 2, marginTop: 24, width: 80 }} />
        </div>

        {[
          { num: "1", title: "Data Controller", content: ["The data controller responsible for the processing of your personal data is: Business Solutions Consulting EOOD, trading as GEO.app. Registered address: bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria. VAT: BG200487371.", "This Privacy Policy explains how we collect, use, store, and share your personal data when you use the GEO.app platform and related services. It complies with the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and applicable Bulgarian data protection law."] },
          { num: "2", title: "Data We Collect", content: ["Account Data: When you register, we collect your name, email address, password (stored in hashed form), and subscription plan details.", "Payment Data: Payment is processed by Stripe, Inc. We do not store credit card numbers or full payment details. We retain transaction records including amounts, dates, and subscription status.", "Usage Data: We collect information about how you use the platform, including domains you analyze, scan results, generated content, feature interactions, and session activity.", "Technical Data: IP address, browser type and version, operating system, device type, referring URLs, and approximate geographic location.", "Communications: If you contact us by email or through the platform, we retain those communications.", "Social/Business Data (No-Website Users): If you use our social presence analysis feature, we collect any Google Maps, Facebook, or Instagram URLs you provide voluntarily, along with your business description.", "Website Request Data: If you submit a request for website creation services, we collect your name, email, business description, and social profile links."] },
          { num: "3", title: "Legal Basis for Processing (GDPR)", content: ["We process your personal data on the following legal bases under Article 6 GDPR:", "Contractual Necessity (Art. 6(1)(b)): Processing your account data, subscription information, and usage data is necessary to provide the Services you have contracted for.", "Legitimate Interests (Art. 6(1)(f)): We process technical and usage data to improve the platform, prevent fraud, ensure security, and conduct business analytics.", "Consent (Art. 6(1)(a)): Where we send marketing communications, we rely on your freely given, specific, and informed consent. You may withdraw consent at any time.", "Legal Obligation (Art. 6(1)(c)): We may process data to comply with applicable tax, accounting, and legal obligations."] },
          { num: "4", title: "How We Use Your Data", content: ["To provide, maintain, and improve the Services.", "To process payments and manage your subscription.", "To generate AI-assisted content and analysis reports based on the domains and information you provide.", "To communicate with you regarding your account, subscription, service updates, and support requests.", "To send you marketing communications, where you have consented to receive them.", "To detect, prevent, and respond to fraud, abuse, and security incidents.", "To comply with legal obligations and respond to lawful requests from authorities.", "To analyze aggregate usage patterns and improve platform performance."] },
          { num: "5", title: "Data Sharing and Third Parties", content: ["We do not sell your personal data. We share data only as described below:", "Stripe, Inc.: Payment processing. Stripe's privacy policy is available at stripe.com/privacy.", "Supabase, Inc.: Database and authentication infrastructure. Data is stored on Supabase-hosted servers.", "Anthropic, PBC: AI content generation. Prompts containing business information you provide are processed by Anthropic's API. We do not share your personal account information with Anthropic.", "Vercel, Inc.: Platform hosting and deployment infrastructure.", "Legal Authorities: We may disclose data to competent authorities where required by applicable law, court order, or to protect GEO.app's legal rights.", "Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, subject to the same privacy protections."] },
          { num: "6", title: "International Data Transfers", content: ["Some of our service providers (including Stripe, Anthropic, and Vercel) are located in the United States. When we transfer your personal data outside the European Economic Area, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.", "By using the Services, you acknowledge that your data may be transferred to and processed in countries outside your country of residence, including the United States."] },
          { num: "7", title: "Data Retention", content: ["Account data is retained for the duration of your subscription and for five (5) years thereafter, or as required by applicable law.", "Payment and transaction records are retained for ten (10) years to comply with Bulgarian and EU accounting and tax obligations.", "Scan results and generated content are retained in accordance with your subscription plan's history limits.", "Upon account deletion, we will delete or anonymize your personal data within thirty (30) days, except where retention is required by law."] },
          { num: "8", title: "Your Rights", content: ["Under GDPR and applicable Bulgarian law, you have the following rights regarding your personal data:", "Right of Access (Art. 15 GDPR): You may request a copy of the personal data we hold about you.", "Right to Rectification (Art. 16 GDPR): You may request correction of inaccurate or incomplete data.", "Right to Erasure (Art. 17 GDPR): You may request deletion of your data in certain circumstances.", "Right to Restriction (Art. 18 GDPR): You may request that we restrict processing of your data.", "Right to Data Portability (Art. 20 GDPR): You may request your data in a structured, machine-readable format.", "Right to Object (Art. 21 GDPR): You may object to processing based on legitimate interests.", "Right to Withdraw Consent: Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.", "California Residents (CCPA): You have the right to know what personal information is collected, the right to delete, the right to opt-out of sale (we do not sell data), and the right to non-discrimination.", "To exercise any of these rights, contact us at the address in Section 1. We will respond within thirty (30) days. You also have the right to lodge a complaint with the Bulgarian Commission for Personal Data Protection (CPDP) at www.cpdp.bg, or with your local supervisory authority."] },
          { num: "9", title: "Cookies and Tracking", content: ["We use technically necessary cookies to maintain your session and authentication state. These cookies are essential for the platform to function and do not require consent.", "We do not currently use advertising cookies, tracking pixels, or cross-site tracking technologies. If this changes, we will update this Policy and obtain your consent where required."] },
          { num: "10", title: "Security", content: ["We implement commercially reasonable technical and organizational measures to protect your personal data, including encrypted data transmission (TLS), hashed password storage, access controls, and regular security assessments.", "In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and affected individuals without undue delay, as required by GDPR."] },
          { num: "11", title: "Changes to This Policy", content: ["We may update this Privacy Policy from time to time. Material changes will be communicated via email or platform notification at least fourteen (14) days before taking effect. The current version will always be available at geo-ap.vercel.app/privacy."] },
          { num: "12", title: "Contact", content: ["For any privacy-related questions, requests, or concerns, please contact: Business Solutions Consulting EOOD (GEO.app), bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria. VAT: BG200487371."] },
        ].map(section => (
          <div key={section.num} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1B2A4A", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ background: "#1B2A4A", color: "#F5A623", width: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{section.num}</span>
              {section.title}
            </h2>
            <div style={{ borderLeft: "3px solid #E8EDF4", paddingLeft: 20 }}>
              {section.content.map((para, i) => (
                <p key={i} style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px", textAlign: "justify" as const }}>{para}</p>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: "#1B2A4A", borderRadius: 16, padding: "24px 28px", marginTop: 48 }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            &copy; 2026 Business Solutions Consulting EOOD, trading as GEO.app. All rights reserved. VAT: BG200487371. This Privacy Policy was last updated in May 2026.
          </p>
        </div>
      </div>
    </div>
  )
}
