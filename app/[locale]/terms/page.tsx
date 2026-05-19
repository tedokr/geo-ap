'use client'
import { useEffect, useState } from 'react'

function getLocale() {
  if (typeof window === 'undefined') return 'en'
  return window.location.pathname.split('/')[1] === 'bg' ? 'bg' : 'en'
}

export default function Terms() {
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
        <a href={`/${locale}`} style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textDecoration: "none" }}>{backLabel}</a>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 32px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: "#F5A623" }}>Legal</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1B2A4A", margin: "0 0 12px", lineHeight: 1.2 }}>Terms of Service</h1>
          <p style={{ color: "#5A6B84", fontSize: 15, margin: 0 }}>Effective Date: May 2026 &nbsp;|&nbsp; Version 1.0 &nbsp;|&nbsp; Operated by Business Solutions Consulting EOOD</p>
          <div style={{ height: 3, background: "linear-gradient(90deg, #F5A623, #2E6BAD)", borderRadius: 2, marginTop: 24, width: 80 }} />
        </div>

        <div style={{ background: "#FFF8E7", border: "1px solid #F5A623", borderRadius: 12, padding: "16px 20px", marginBottom: 40 }}>
          <p style={{ fontWeight: 700, color: "#1B2A4A", margin: "0 0 6px", fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 1 }}>Important Notice</p>
          <p style={{ color: "#5A6B84", margin: 0, fontSize: 14, lineHeight: 1.7 }}>Please read these Terms of Service carefully before using GEO.app. By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.</p>
        </div>

        {[
          { num: "1", title: "Parties and Acceptance", content: ["These Terms of Service (\"Agreement\") constitute a legally binding contract between you, whether as an individual or on behalf of a legal entity (\"Client,\" \"you,\" or \"your\"), and Business Solutions Consulting EOOD, trading as GEO.app (\"Company,\" \"we,\" \"us,\" or \"our\"), registered in Bulgaria under VAT number BG200487371, with registered address at bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria.", "By creating an account, accessing the platform, or using any of our Services, you represent and warrant that: (i) you are at least 18 years of age; (ii) you have the legal capacity to enter into binding agreements; (iii) if acting on behalf of an entity, you have full authority to bind that entity to this Agreement; and (iv) your use of the Services complies with all applicable laws in your jurisdiction.", "We reserve the right to modify these Terms at any time. Material changes will be communicated via email or platform notification no fewer than fourteen (14) days prior to their effective date. Continued use of the Services following such notice constitutes your acceptance of the revised Terms."] },
          { num: "2", title: "Description of Services", content: ["GEO.app provides a subscription-based Software-as-a-Service (\"SaaS\") platform that analyzes the AI search visibility of websites and digital presences, generates optimization recommendations, and produces AI-assisted content files intended to improve discoverability by artificial intelligence systems, including but not limited to ChatGPT, Google Gemini, Perplexity, and similar platforms (collectively, the \"Services\").", "The Services are provided on a tiered subscription basis. The scope, features, and deliverables available to each Client are determined by the subscription plan selected at the time of purchase.", "We reserve the right to modify, suspend, or discontinue any feature or component of the Services at any time, provided that we will use reasonable efforts to notify Clients of material changes in advance."] },
          { num: "3", title: "AI-Generated Content — Disclaimer and Limitations", content: ["THE CLIENT EXPRESSLY ACKNOWLEDGES AND AGREES THAT: All recommendations, optimization files, content suggestions, schema markup, meta descriptions, FAQ content, robots.txt configurations, llms.txt files, blog ideas, and any other outputs generated by the GEO.app platform are produced using artificial intelligence technology and are provided strictly \"AS IS\" and \"AS AVAILABLE,\" without any representation or warranty of any kind, whether express, implied, or statutory.", "GEO.app makes no warranty, representation, or guarantee that: (i) the use of any generated content will result in the Client's website or business being cited, mentioned, recommended, or referenced by any artificial intelligence system; (ii) any particular AI visibility score, ranking, or discoverability outcome will be achieved or maintained; (iii) the generated content is accurate, complete, current, or suitable for the Client's specific business needs; or (iv) the implementation of any recommendation will produce measurable improvements in AI search visibility.", "The Client understands and accepts that: (a) artificial intelligence search systems operate on proprietary algorithms that change frequently and without notice; (b) GEO.app has no control over, affiliation with, or access to these third-party AI systems; (c) citation or recommendation by any AI system is entirely at the discretion of such systems and cannot be guaranteed; and (d) the landscape of AI search is rapidly evolving.", "The Client uses all AI-generated content entirely at their own risk and assumes full responsibility for reviewing, validating, and implementing any such content."] },
          { num: "4", title: "Limitation of Liability", content: ["TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GEO.APP, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY: (i) INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES; (ii) LOSS OF PROFITS, REVENUE, BUSINESS OPPORTUNITIES, OR ANTICIPATED SAVINGS; (iii) LOSS OF DATA OR GOODWILL; (iv) SERVICE INTERRUPTIONS OR PLATFORM DOWNTIME; (v) ERRORS, INACCURACIES, OR OMISSIONS IN AI-GENERATED CONTENT; OR (vi) ANY OTHER LOSSES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES.", "Notwithstanding the foregoing, GEO.app's total aggregate liability to the Client for any and all claims shall not exceed the total fees paid by the Client to GEO.app in the three (3) calendar months immediately preceding the event giving rise to the claim.", "The limitations set forth in this Section shall not apply to liability arising from: (i) gross negligence or willful misconduct by GEO.app; (ii) death or personal injury caused by GEO.app's negligence; or (iii) any liability that cannot be excluded or limited under applicable mandatory law."] },
          { num: "5", title: "Client Responsibilities and Acceptable Use", content: ["The Client is solely responsible for: (a) the accuracy and legality of all information provided to the platform; (b) reviewing all AI-generated content prior to implementation; (c) ensuring that any content implemented complies with applicable laws and third-party terms of service; and (d) maintaining the security of account credentials.", "The Client agrees not to: (i) use the Services for any unlawful purpose; (ii) attempt to reverse-engineer or copy the platform's methodologies; (iii) share account access with unauthorized parties; (iv) use the Services to generate content that is misleading or infringes third-party rights; or (v) interfere with the integrity or performance of the platform."] },
          { num: "6", title: "Subscription, Payment, and Refunds", content: ["Subscription fees are billed in advance on a monthly or annual basis. All fees are exclusive of applicable taxes.", "Annual subscriptions are billed as a single upfront payment covering twelve (12) months. Annual subscriptions may be cancelled at any time; however, no partial refunds are available for unused portions.", "Monthly subscriptions may be cancelled at any time and will not renew following the end of the current billing period. GEO.app does not offer refunds for partially used monthly periods.", "GEO.app reserves the right to suspend or terminate access in the event of non-payment or repeated chargebacks."] },
          { num: "7", title: "Intellectual Property", content: ["All rights, title, and interest in and to the GEO.app platform, including its software, algorithms, user interface, methodologies, trademarks, and branding, are and shall remain the exclusive property of Business Solutions Consulting EOOD.", "Subject to compliance with this Agreement and payment of applicable fees, GEO.app grants the Client a limited, non-exclusive, non-transferable, revocable license to access and use the Services solely for internal business purposes during the subscription term."] },
          { num: "8", title: "Confidentiality and Data Protection", content: ["Each party agrees to maintain the confidentiality of the other party's non-public information disclosed in connection with the Services.", "GEO.app processes personal data in accordance with its Privacy Policy, available at geo-ap.vercel.app/privacy. The Client, by using the Services, consents to such processing as described therein."] },
          { num: "9", title: "Service Availability and Maintenance", content: ["GEO.app endeavors to maintain platform availability on a commercially reasonable basis. However, the Client acknowledges that the platform may be temporarily unavailable due to scheduled maintenance, infrastructure failures, or third-party service disruptions.", "GEO.app does not guarantee any specific uptime percentage. Temporary unavailability shall not constitute a breach of this Agreement."] },
          { num: "10", title: "Termination", content: ["Either party may terminate this Agreement at any time by providing written notice. Upon termination, the Client's access to the Services will cease at the end of the current billing period.", "GEO.app may immediately suspend or terminate the Client's account without notice in the event of: (a) material breach of this Agreement; (b) suspected fraudulent or illegal activity; or (c) non-payment of fees."] },
          { num: "11", title: "Governing Law and Dispute Resolution", content: ["This Agreement shall be governed by and construed in accordance with the laws of the Republic of Bulgaria.", "Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts located in Sofia, Republic of Bulgaria.", "For Clients located in the European Union: nothing in this Agreement affects your rights under mandatory consumer protection laws of your country of residence."] },
          { num: "12", title: "General Provisions", content: ["Entire Agreement: This Agreement, together with the Privacy Policy, constitutes the entire agreement between the parties and supersedes all prior negotiations or agreements.", "Severability: If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.", "Contact: Business Solutions Consulting EOOD, bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7, Sofia 1504, Bulgaria. VAT: BG200487371."] },
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
            &copy; 2026 Business Solutions Consulting EOOD, trading as GEO.app. All rights reserved. VAT: BG200487371. These Terms of Service were last updated in May 2026.
          </p>
        </div>
      </div>
    </div>
  )
}
