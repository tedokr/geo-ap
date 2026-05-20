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
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,90,71,0.07)", border: "1px solid rgba(255,90,71,0.18)", borderRadius: 100, padding: "5px 16px", marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.coral, fontFamily: "'Outfit', sans-serif" }}>{tag}</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 900, color: C.navy, margin: "0 0 14px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>{title}</h1>
          <p style={{ color: C.muted, fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>{subtitle}</p>
          <div style={{ height: 3, background: C.coral, borderRadius: 2, marginTop: 20, width: 48 }} />
        </div>

        {children}

        <div style={{ background: C.navy, borderRadius: 14, padding: "20px 24px", marginTop: 56 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
            &copy; 2026 Business Solutions Consulting EOOD, trading as faindable.app. All rights reserved. VAT: BG200487371. These Terms of Service were last updated in May 2026.
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
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.navy, color: C.coral, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{num}</span>
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

export default function Terms() {
  const [locale, setLocale] = useState('en')
  useEffect(() => { setLocale(getLocale()) }, [])

  return (
    <LegalLayout
      locale={locale}
      tag="Legal"
      title="Terms of Service"
      subtitle="Effective Date: May 2026  ·  Version 1.0  ·  Operated by Business Solutions Consulting EOOD"
    >
      {/* Important notice banner */}
      <div style={{ background: C.white, border: `1px solid rgba(255,90,71,0.2)`, borderLeft: `4px solid ${C.coral}`, borderRadius: 10, padding: "16px 20px", marginBottom: 40 }}>
        <p style={{ fontWeight: 700, color: C.navy, marginBottom: 6, fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontFamily: "'Outfit', sans-serif" }}>Important Notice</p>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, fontFamily: "'Outfit', sans-serif" }}>Please read these Terms of Service carefully before using faindable.app. By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.</p>
      </div>

      <Section num="1" title="Parties and Acceptance">
        <Para>These Terms of Service ("Agreement") constitute a legally binding contract between you, whether as an individual or on behalf of a legal entity ("Client," "you," or "your"), and Business Solutions Consulting EOOD, trading as faindable.app ("Company," "we," "us," or "our"), registered in Bulgaria under VAT number BG200487371, with registered address at bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria.</Para>
        <Para>By creating an account, accessing the platform, or using any of our Services, you represent and warrant that: (i) you are at least 18 years of age; (ii) you have the legal capacity to enter into binding agreements; (iii) if acting on behalf of an entity, you have full authority to bind that entity to this Agreement; and (iv) your use of the Services complies with all applicable laws in your jurisdiction.</Para>
        <Para>We reserve the right to modify these Terms at any time. Material changes will be communicated via email or platform notification no fewer than fourteen (14) days prior to their effective date. Continued use of the Services following such notice constitutes your acceptance of the revised Terms.</Para>
      </Section>

      <Section num="2" title="Description of Services">
        <Para>faindable.app provides a subscription-based Software-as-a-Service ("SaaS") platform that analyzes the AI search visibility of websites and digital presences, generates optimization recommendations, and produces AI-assisted content files intended to improve discoverability by artificial intelligence systems, including but not limited to ChatGPT, Google Gemini, Perplexity, and similar platforms (collectively, the "Services").</Para>
        <Para>The Services are provided on a tiered subscription basis. The scope, features, and deliverables available to each Client are determined by the subscription plan selected at the time of purchase.</Para>
        <Para>We reserve the right to modify, suspend, or discontinue any feature or component of the Services at any time, provided that we will use reasonable efforts to notify Clients of material changes in advance.</Para>
      </Section>

      <Section num="3" title="AI-Generated Content — Disclaimer and Limitations">
        <Para>THE CLIENT EXPRESSLY ACKNOWLEDGES AND AGREES THAT: All recommendations, optimization files, content suggestions, schema markup, meta descriptions, FAQ content, robots.txt configurations, llms.txt files, blog ideas, and any other outputs generated by the faindable.app platform are produced using artificial intelligence technology and are provided strictly "AS IS" and "AS AVAILABLE," without any representation or warranty of any kind, whether express, implied, or statutory.</Para>
        <Para>faindable.app makes no warranty, representation, or guarantee that: (i) the use of any generated content will result in the Client's website or business being cited, mentioned, recommended, or referenced by any artificial intelligence system; (ii) any particular AI visibility score, ranking, or discoverability outcome will be achieved or maintained; (iii) the generated content is accurate, complete, current, or suitable for the Client's specific business needs; or (iv) the implementation of any recommendation will produce measurable improvements in AI search visibility.</Para>
        <Para>The Client understands and accepts that: (a) artificial intelligence search systems operate on proprietary algorithms that change frequently and without notice; (b) faindable.app has no control over, affiliation with, or access to these third-party AI systems; (c) citation or recommendation by any AI system is entirely at the discretion of such systems and cannot be guaranteed; and (d) the landscape of AI search is rapidly evolving.</Para>
        <Para>The Client uses all AI-generated content entirely at their own risk and assumes full responsibility for reviewing, validating, and implementing any such content.</Para>
      </Section>

      <Section num="4" title="Limitation of Liability">
        <Para>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FAINDABLE.APP, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY: (i) INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES; (ii) LOSS OF PROFITS, REVENUE, BUSINESS OPPORTUNITIES, OR ANTICIPATED SAVINGS; (iii) LOSS OF DATA OR GOODWILL; (iv) SERVICE INTERRUPTIONS OR PLATFORM DOWNTIME; (v) ERRORS, INACCURACIES, OR OMISSIONS IN AI-GENERATED CONTENT; OR (vi) ANY OTHER LOSSES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES.</Para>
        <Para>DIRECT DAMAGES LIMITATION: To the maximum extent permitted by applicable law, faindable.app's liability for direct damages is strictly limited to the total subscription fees paid by the Client in the three (3) calendar months immediately preceding the event giving rise to the claim.</Para>
        <Para>CLIENT'S DUTY TO REVIEW: By using the Services, the Client expressly agrees that: (i) no AI-generated output should be implemented without independent review and validation by the Client or a qualified professional; (ii) the Client assumes all risk associated with the implementation of any generated content; (iii) faindable.app provides tools and outputs, not professional advice; and (iv) the existence of a paid subscription does not create any guarantee, warranty, or duty of care beyond the express terms of this Agreement.</Para>
        <Para>The limitations set forth in this Section shall not apply to liability arising from: (i) gross negligence or willful misconduct by faindable.app; (ii) death or personal injury caused by faindable.app's negligence; or (iii) any liability that cannot be excluded or limited under applicable mandatory law.</Para>
      </Section>

      <Section num="5" title="Client Responsibilities and Acceptable Use">
        <Para>The Client is solely responsible for: (a) the accuracy and legality of all information provided to the platform; (b) reviewing all AI-generated content prior to implementation; (c) ensuring that any content implemented complies with applicable laws and third-party terms of service; and (d) maintaining the security of account credentials.</Para>
        <Para>The Client agrees not to: (i) use the Services for any unlawful purpose; (ii) attempt to reverse-engineer or copy the platform's methodologies; (iii) share account access with unauthorized parties; (iv) use the Services to generate content that is misleading or infringes third-party rights; or (v) interfere with the integrity or performance of the platform.</Para>
      </Section>

      <Section num="6" title="Subscription, Payment, and Refunds">
        <Para>Subscription fees are billed in advance on a monthly or annual basis. All fees are exclusive of applicable taxes.</Para>
        <Para>Annual subscriptions are billed as a single upfront payment covering twelve (12) months. Annual subscriptions may be cancelled at any time; however, no partial refunds are available for unused portions.</Para>
        <Para>Monthly subscriptions may be cancelled at any time and will not renew following the end of the current billing period. faindable.app does not offer refunds for partially used monthly periods.</Para>
        <Para>faindable.app reserves the right to suspend or terminate access in the event of non-payment or repeated chargebacks.</Para>
      </Section>

      <Section num="7" title="Intellectual Property">
        <Para>All rights, title, and interest in and to the faindable.app platform, including its software, algorithms, user interface, methodologies, trademarks, and branding, are and shall remain the exclusive property of Business Solutions Consulting EOOD.</Para>
        <Para>Subject to compliance with this Agreement and payment of applicable fees, faindable.app grants the Client a limited, non-exclusive, non-transferable, revocable license to access and use the Services solely for internal business purposes during the subscription term.</Para>
      </Section>

      <Section num="8" title="Confidentiality and Data Protection">
        <Para>Each party agrees to maintain the confidentiality of the other party's non-public information disclosed in connection with the Services.</Para>
        <Para>faindable.app processes personal data in accordance with its Privacy Policy, available at faindable.app/privacy. The Client, by using the Services, consents to such processing as described therein.</Para>
      </Section>

      <Section num="9" title="Service Availability and Maintenance">
        <Para>faindable.app endeavors to maintain platform availability on a commercially reasonable basis. However, the Client acknowledges that the platform may be temporarily unavailable due to scheduled maintenance, infrastructure failures, or third-party service disruptions.</Para>
        <Para>faindable.app does not guarantee any specific uptime percentage. Temporary unavailability shall not constitute a breach of this Agreement.</Para>
      </Section>

      <Section num="10" title="Termination">
        <Para>Either party may terminate this Agreement at any time by providing written notice. Upon termination, the Client's access to the Services will cease at the end of the current billing period.</Para>
        <Para>faindable.app may immediately suspend or terminate the Client's account without notice in the event of: (a) material breach of this Agreement; (b) suspected fraudulent or illegal activity; or (c) non-payment of fees.</Para>
      </Section>

      <Section num="11" title="Governing Law and Dispute Resolution">
        <Para>This Agreement shall be governed by and construed in accordance with the laws of the Republic of Bulgaria.</Para>
        <Para>Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts located in Sofia, Republic of Bulgaria.</Para>
        <Para>For Clients located in the European Union: nothing in this Agreement affects your rights under mandatory consumer protection laws of your country of residence.</Para>
      </Section>

      <Section num="12" title="General Provisions">
        <Para><strong>Entire Agreement:</strong> This Agreement, together with the Privacy Policy, constitutes the entire agreement between the parties and supersedes all prior negotiations or agreements.</Para>
        <Para><strong>Severability:</strong> If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.</Para>
        <Para><strong>Contact:</strong> Business Solutions Consulting EOOD, bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria. VAT: BG200487371.</Para>
      </Section>
    </LegalLayout>
  )
}
