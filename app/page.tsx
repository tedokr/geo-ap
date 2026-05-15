'use client'
import { useState } from "react";

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  orange: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  textMuted: "#5A6B84",
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleScan = () => {
    if (!url) return;
    setScanning(true);
    setScore(null);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 60) + 20);
      setScanning(false);
    }, 2500);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: COLORS.offWhite, minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{ background: COLORS.navy, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: COLORS.white, fontSize: 22, fontWeight: 700 }}>
          GEO<span style={{ color: COLORS.orange }}>.app</span>
        </span>
        <a href="#scan" style={{ background: COLORS.orange, color: COLORS.navy, padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
          Безплатна проверка
        </a>
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(165deg, ${COLORS.navy} 0%, #243B65 50%, ${COLORS.blue} 100%)`, padding: "100px 32px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
          <span style={{ color: COLORS.orange, fontSize: 13, fontWeight: 600 }}>✨ Generative Engine Optimization</span>
        </div>
        <h1 style={{ color: COLORS.white, fontSize: 52, fontWeight: 800, margin: "0 0 24px", lineHeight: 1.2 }}>
          Направи бизнеса си<br />
          <span style={{ color: COLORS.orange }}>видим за AI</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 20, maxWidth: 600, margin: "0 auto 40px" }}>
          Анализираме дигиталното ти присъствие и те правим открываем от ChatGPT, Claude, Perplexity и Google AI.
        </p>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 48 }}>
          {[["14", "AI показателя"], ["2 мин", "за анализ"], ["100%", "безплатно"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: COLORS.orange, fontSize: 32, fontWeight: 800 }}>{num}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{label}</div>
            </div>
          ))}
        </div>
        <a href="#scan" style={{ background: COLORS.orange, color: COLORS.navy, padding: "16px 40px", borderRadius: 10, textDecoration: "none", fontSize: 18, fontWeight: 700, display: "inline-block" }}>
          Провери домейна си безплатно →
        </a>
      </section>

      {/* SCAN */}
      <section id="scan" style={{ padding: "80px 32px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ color: COLORS.navy, fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Безплатна GEO проверка</h2>
        <p style={{ color: COLORS.textMuted, marginBottom: 40 }}>Въведи домейна си и виж колко е готов за AI търсачките</p>
        <div style={{ display: "flex", gap: 12, maxWidth: 560, margin: "0 auto 32px" }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="example.com"
            style={{ flex: 1, padding: "16px 20px", borderRadius: 10, border: `2px solid ${COLORS.blue}`, fontSize: 16, outline: "none" }}
          />
          <button
            onClick={handleScan}
            style={{ background: COLORS.orange, color: COLORS.navy, padding: "16px 32px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            {scanning ? "Анализирам..." : "Анализирай"}
          </button>
        </div>

        {scanning && (
          <div style={{ color: COLORS.blue, fontSize: 18, fontWeight: 600 }}>⏳ Проверяваме sitemap, robots.txt, schema.org...</div>
        )}

        {score !== null && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, boxShadow: "0 8px 32px rgba(27,42,74,0.12)" }}>
            <div style={{ fontSize: 80, fontWeight: 900, color: score > 60 ? "#22c55e" : score > 35 ? "#f59e0b" : "#ef4444" }}>
              {score}%
            </div>
            <div style={{ color: COLORS.textMuted, fontSize: 18, marginBottom: 24 }}>
              GEO скор за <strong>{url}</strong>
            </div>
            <div style={{ background: COLORS.navy, color: COLORS.white, padding: "16px 32px", borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
              🔒 Регистрирай се за пълен доклад с детайли и препоръки
            </div>
          </div>
        )}
      </section>

      {/* PRICING */}
      <section style={{ background: COLORS.navy, padding: "80px 32px", textAlign: "center" }}>
        <h2 style={{ color: COLORS.white, fontSize: 36, fontWeight: 800, marginBottom: 48 }}>Планове</h2>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { name: "LITE", price: "€9.90", desc: "Базов одит — виж къде стоиш", color: COLORS.blue },
            { name: "SMART", price: "€39.90", desc: "Одит + стъпка по стъпка инструкции", color: COLORS.orange, recommended: true },
            { name: "PRO", price: "€59.90", desc: "Всичко + конкуренти + AI mentions", color: "#7C3AED" },
          ].map(plan => (
            <div key={plan.name} style={{ background: plan.recommended ? COLORS.orange : "rgba(255,255,255,0.05)", border: `2px solid ${plan.color}`, borderRadius: 16, padding: "32px 28px", width: 240, position: "relative" }}>
              {plan.recommended && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: COLORS.navy, color: COLORS.orange, padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>ПРЕПОРЪЧАН</div>}
              <div style={{ color: plan.recommended ? COLORS.navy : COLORS.white, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ color: plan.recommended ? COLORS.navy : COLORS.orange, fontSize: 36, fontWeight: 900, marginBottom: 8 }}>{plan.price}<span style={{ fontSize: 16 }}>/мес</span></div>
              <div style={{ color: plan.recommended ? COLORS.navy : "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 24 }}>{plan.desc}</div>
              <button style={{ background: plan.recommended ? COLORS.navy : COLORS.orange, color: plan.recommended ? COLORS.white : COLORS.navy, padding: "12px 24px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", width: "100%" }}>
                Започни
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0F1A2E", padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
        © 2026 GEO App · Privacy Policy · Terms of Service
      </footer>
    </div>
  );
}
