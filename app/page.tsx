'use client'
import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  lightBlue: "#4A90D9",
  orange: "#F5A623",
  orangeHover: "#E8951A",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  lightGray: "#E8EDF4",
  textDark: "#1B2A4A",
  textMuted: "#5A6B84",
};

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(27,42,74,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.4s ease",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.orange}, #F7C948)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: COLORS.navy, fontFamily: "'Outfit', sans-serif",
          }}>G</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.5px" }}>
            GEO<span style={{ color: COLORS.orange }}>.app</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[["Какво правим", "what"], ["Защо е важно", "why"], ["Проверка", "scan"], ["Цени", "pricing"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} style={{
              color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500,
              fontFamily: "'Outfit', sans-serif", transition: "color 0.2s",
            }}>{label}</a>
          ))}
          <a href="#scan" style={{
            background: COLORS.orange, color: COLORS.navy, padding: "10px 24px",
            borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
          }}>Безплатна проверка</a>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  return (
    <section style={{
      minHeight: "100vh", background: `linear-gradient(165deg, ${COLORS.navy} 0%, #243B65 50%, ${COLORS.blue} 100%)`,
      display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 2 }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ color: COLORS.orange, fontSize: 13, fontWeight: 600 }}>✨ Generative Engine Optimization</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, color: COLORS.white, lineHeight: 1.15, marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>
            Направи бизнеса си<br /><span style={{ color: COLORS.orange }}>видим за AI</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40, fontFamily: "'DM Sans', sans-serif" }}>
            Анализираме дигиталното ти присъствие и те правим откриваем от ChatGPT, Claude, Perplexity и Google AI Overviews.
          </p>
          <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
            <a href="#scan" style={{ background: COLORS.orange, color: COLORS.navy, padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
              Провери домейна си →
            </a>
            <a href="#why" style={{ background: "rgba(255,255,255,0.1)", color: COLORS.white, padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)" }}>
              Научи повече
            </a>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {[["14", "AI показателя"], ["2 мин", "за анализ"], ["100%", "безплатно"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ color: COLORS.orange, fontSize: 28, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{num}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ opacity: visible ? 1 : 0, transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s", background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>GEO СКОР ПРЕГЛЕД</div>
          {[["Sitemap.xml", 92, "#22c55e"], ["Schema.org", 78, "#22c55e"], ["robots.txt", 45, "#f59e0b"], ["llms.txt", 0, "#ef4444"], ["FAQs", 60, "#f59e0b"]].map(([label, val, color]) => (
            <div key={label as string} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: COLORS.white, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{label as string}</span>
                <span style={{ color: color as string, fontSize: 14, fontWeight: 700 }}>{val}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${val}%`, height: 6, borderRadius: 4, background: color as string, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatSection() {
  return (
    <section id="what" style={{ padding: "100px 32px", background: COLORS.white }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: COLORS.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Какво правим</h2>
        <p style={{ color: COLORS.textMuted, fontSize: 18, maxWidth: 600, margin: "0 auto 64px", fontFamily: "'DM Sans', sans-serif" }}>
          Четири стъпки към пълна AI видимост
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            ["🔍", "Анализираме AI видимостта", "Проверяваме 14 технически показателя за готовност към AI търсачки"],
            ["📊", "Персонализиран отчет", "Получаваш детайлен доклад с точен скор и конкретни препоръки"],
            ["📅", "Месечно проследяване", "Следим прогреса ти всеки месец и даваме по 2 нови стъпки"],
            ["🚀", "От SEO към AEO", "Преминаваш от класическо SEO към Answer Engine Optimization"],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background: COLORS.offWhite, borderRadius: 16, padding: 32, textAlign: "left", border: `1px solid ${COLORS.lightGray}` }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{icon as string}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>{title as string}</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{desc as string}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section id="why" style={{ padding: "100px 32px", background: COLORS.offWhite }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: COLORS.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Защо е важно</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 18, maxWidth: 600, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>Светът на търсенето се промени завинаги</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 64 }}>
          {[["9 млрд", "AI взаимодействия дневно"], ["50%", "пазарен дял на AI търсене"], ["60%", "до 2028г."], ["90%", "от МСП не са готови"]].map(([num, label]) => (
            <div key={label as string} style={{ background: COLORS.white, borderRadius: 16, padding: 32, textAlign: "center", border: `1px solid ${COLORS.lightGray}` }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.orange, fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>{num as string}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>{label as string}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, border: `1px solid ${COLORS.lightGray}` }}>
            <div style={{ color: COLORS.textMuted, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>🔵 GOOGLE ТЪРСЕНЕ</div>
            <div style={{ color: COLORS.navy, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>"добър ресторант в София"</div>
            <div style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6 }}>↓ 10 сини линка<br />↓ Потребителят избира кой да отвори<br />↓ Чете 3-4 сайта<br />↓ Взима решение</div>
          </div>
          <div style={{ background: COLORS.navy, borderRadius: 16, padding: 32, border: `2px solid ${COLORS.orange}` }}>
            <div style={{ color: COLORS.orange, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>✨ AI АСИСТЕНТ</div>
            <div style={{ color: COLORS.white, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>"добър ресторант в София"</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6 }}>↓ AI дава директен отговор<br />↓ Споменава 2-3 конкретни места<br />↓ <span style={{ color: COLORS.orange, fontWeight: 700 }}>Или те споменава — или не</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScanSection() {
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
    <section id="scan" style={{ padding: "100px 32px", background: COLORS.white }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: COLORS.navy, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Безплатна GEO проверка</h2>
        <p style={{ color: COLORS.textMuted, fontSize: 18, marginBottom: 48, fontFamily: "'DM Sans', sans-serif" }}>Въведи домейна си и виж колко е готов за AI търсачките</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleScan()}
            placeholder="example.com"
            style={{ flex: 1, padding: "16px 20px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
          />
          <button onClick={handleScan} style={{ background: COLORS.orange, color: COLORS.navy, padding: "16px 32px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
            {scanning ? "⏳ Анализирам..." : "Анализирай"}
          </button>
        </div>
        {score !== null && (
          <div style={{ background: COLORS.offWhite, borderRadius: 20, padding: 48, border: `1px solid ${COLORS.lightGray}` }}>
            <div style={{ fontSize: 96, fontWeight: 900, color: score > 60 ? "#22c55e" : score > 35 ? "#f59e0b" : "#ef4444", fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{score}%</div>
            <div style={{ color: COLORS.textMuted, fontSize: 18, margin: "16px 0 32px", fontFamily: "'DM Sans', sans-serif" }}>GEO скор за <strong style={{ color: COLORS.navy }}>{url}</strong></div>
            <div style={{ background: COLORS.navy, color: COLORS.white, padding: "20px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
              🔒 Регистрирай се за пълен доклад с детайли и препоръки
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PricingSection() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const prices = {
    monthly: [["€29.90", "€59.90", "€79.90"]],
    yearly: [["€9.90", "€39.90", "€59.90"]],
  };
  const currentPrices = prices[period][0];
  return (
    <section id="pricing" style={{ padding: "100px 32px", background: COLORS.navy }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: COLORS.white, marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Планове и цени</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginBottom: 40, fontFamily: "'DM Sans', sans-serif" }}>Избери плана, който отговаря на нуждите ти</p>
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 4, marginBottom: 56 }}>
          {(["yearly", "monthly"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "10px 24px", borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", background: period === p ? COLORS.orange : "transparent", color: period === p ? COLORS.navy : "rgba(255,255,255,0.7)", fontSize: 14 }}>
              {p === "yearly" ? "Годишно (спести 67%)" : "Месечно"}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { name: "LITE", price: currentPrices[0], desc: "Разбери къде стоиш", features: ["1 домейн", "Месечно сканиране", "Базов одит", "Email напомняния", "3 месеца история"], recommended: false },
            { name: "SMART", price: currentPrices[1], desc: "Знай точно какво да направиш", features: ["Всичко от LITE", "Step-by-step инструкции", "Готови файлове", "Адаптирано за платформата ти", "6 месеца история"], recommended: true },
            { name: "PRO", price: currentPrices[2], desc: "Пълна картина + конкуренция", features: ["Всичко от SMART", "Сравнение с конкуренти", "AI Mention Check", "ChatGPT/Gemini/Perplexity", "Неограничена история"], recommended: false },
          ].map(plan => (
            <div key={plan.name} style={{ background: plan.recommended ? COLORS.orange : "rgba(255,255,255,0.05)", border: `2px solid ${plan.recommended ? COLORS.orange : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: 40, position: "relative", textAlign: "left" }}>
              {plan.recommended && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: COLORS.navy, color: COLORS.orange, padding: "6px 20px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>⭐ ПРЕПОРЪЧАН</div>}
              <div style={{ color: plan.recommended ? COLORS.navy : COLORS.white, fontSize: 22, fontWeight: 800, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{plan.name}</div>
              <div style={{ color: plan.recommended ? COLORS.navy : COLORS.orange, fontSize: 42, fontWeight: 900, fontFamily: "'Outfit', sans-serif", marginBottom: 4 }}>{plan.price}<span style={{ fontSize: 18 }}>/мес</span></div>
              <div style={{ color: plan.recommended ? COLORS.navy : "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 32, fontFamily: "'DM Sans', sans-serif" }}>{plan.desc}</div>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: plan.recommended ? COLORS.navy : COLORS.orange }}>✓</span>
                  <span style={{ color: plan.recommended ? COLORS.navy : "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                </div>
              ))}
              <button style={{ marginTop: 32, width: "100%", background: plan.recommended ? COLORS.navy : COLORS.orange, color: plan.recommended ? COLORS.white : COLORS.navy, padding: "14px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>
                Започни с {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <NavBar />
      <HeroSection />
      <WhatSection />
      <WhySection />
      <ScanSection />
      <PricingSection />
      <footer style={{ background: "#0F1A2E", padding: "40px 32px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 GEO App · Privacy Policy · Terms of Service
        </div>
      </footer>
    </>
  );
}
