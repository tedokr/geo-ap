export default function Imprint() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFD", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <header style={{ background: "#1B2A4A", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>GEO<span style={{ color: "#F5A623" }}>.app</span></span>
        </a>
        <a href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textDecoration: "none" }}>Back to Home</a>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 32px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: "#F5A623" }}>Legal</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1B2A4A", margin: "0 0 12px", lineHeight: 1.2 }}>Imprint / Impressum</h1>
          <p style={{ color: "#5A6B84", fontSize: 15, margin: 0 }}>Legal disclosure pursuant to applicable EU, German, Austrian, and Swiss law</p>
          <div style={{ height: 3, background: "linear-gradient(90deg, #F5A623, #2E6BAD)", borderRadius: 2, marginTop: 24, width: 80 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
          {[
            { label: "Company Name", value: "Business Solutions Consulting EOOD\n(trading as GEO.app)" },
            { label: "Legal Form", value: "EOOD — Single-Member Limited Liability Company\n(equivalent to GmbH / Ltd)" },
            { label: "Registered Address", value: "bul. Knyaz Aleksandar Dondukov 79\nFloor 7, Apt. 7\nSofia 1504, Bulgaria" },
            { label: "VAT Number", value: "BG200487371" },
            { label: "Country of Registration", value: "Republic of Bulgaria\n(European Union member state)" },
            { label: "Commercial Register", value: "Bulgarian Commercial Register\n(Targovskiy Registar)" },
            { label: "Platform", value: "GEO.app\nAI Search Optimization Platform" },
            { label: "Governing Law", value: "Republic of Bulgaria\nJurisdiction: Sofia courts" },
          ].map(item => (
            <div key={item.label} style={{ background: "#FFFFFF", borderRadius: 12, padding: "20px 24px", border: "1px solid #E8EDF4" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#5A6B84", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 14, color: "#1B2A4A", fontWeight: 600, lineHeight: 1.6, whiteSpace: "pre-line" as const }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "28px 32px", border: "1px solid #E8EDF4", marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1B2A4A", margin: "0 0 20px" }}>Responsible for Content</h2>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            Business Solutions Consulting EOOD<br />
            bul. Knyaz Aleksandar Dondukov 79, Floor 7, Apt. 7<br />
            Sofia 1504, Bulgaria<br />
            VAT: BG200487371
          </p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "28px 32px", border: "1px solid #E8EDF4", marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1B2A4A", margin: "0 0 20px" }}>Dispute Resolution</h2>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px" }}>
            <strong>EU Online Dispute Resolution:</strong> The European Commission provides an online dispute resolution platform available at <strong>ec.europa.eu/consumers/odr</strong>. We are not obligated to participate in dispute resolution proceedings before a consumer arbitration board, but we are willing to do so in appropriate cases.
          </p>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            <strong>Governing Law:</strong> All disputes arising from or in connection with the use of this platform shall be governed by the laws of the Republic of Bulgaria. The competent courts in Sofia, Bulgaria shall have exclusive jurisdiction.
          </p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "28px 32px", border: "1px solid #E8EDF4", marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1B2A4A", margin: "0 0 20px" }}>Disclaimer of Liability</h2>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px" }}>
            <strong>Content:</strong> The content of this website has been prepared with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the information provided. As a service provider, we are responsible for our own content under general law.
          </p>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: "0 0 12px" }}>
            <strong>External Links:</strong> Our website may contain links to external third-party websites. We have no influence over the content of those sites and accept no responsibility for them. The respective provider or operator of the linked pages is always responsible for their content.
          </p>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            <strong>AI-Generated Content:</strong> GEO.app utilizes artificial intelligence to generate optimization recommendations and content files. Such outputs are provided for informational purposes only and do not constitute professional advice. We make no warranty that AI-generated content will result in specific outcomes. See our Terms of Service for complete limitations.
          </p>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "28px 32px", border: "1px solid #E8EDF4", marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1B2A4A", margin: "0 0 20px" }}>Copyright</h2>
          <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            The content and works published on this website are governed by Bulgarian and international copyright law. Reproduction, processing, distribution, or any form of commercialization of such material beyond the scope of copyright law requires the prior written consent of Business Solutions Consulting EOOD. Downloads and copies of this site are only permitted for private, non-commercial use.
          </p>
        </div>

        <div style={{ background: "#1B2A4A", borderRadius: 16, padding: "24px 28px", marginTop: 48 }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            &copy; 2026 Business Solutions Consulting EOOD, trading as GEO.app. All rights reserved.<br />
            VAT: BG200487371 | Sofia 1504, Bulgaria | Last updated: May 2026
          </p>
        </div>
      </div>
    </div>
  )
}
