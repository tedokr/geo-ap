'use client'
import { useState, useEffect } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled || menuOpen ? "rgba(27,42,74,0.97)" : "transparent",
      backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
      transition: "all 0.4s ease",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, zIndex: 101 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.orange}, #F7C948)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: COLORS.navy }}>G</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, letterSpacing: "-0.5px" }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </div>
        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[["Какво правим", "what"], ["Защо е важно", "why"], ["МСП", "sme"], ["Защо всеки месец", "whymonthly"], ["Цени", "pricing"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{label}</a>
          ))}
          <a href="/login" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.25)", padding: "8px 20px", borderRadius: 8 }}>Вход</a>
          <a href="#scan" style={{ background: COLORS.orange, color: COLORS.navy, padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Безплатна проверка</a>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, zIndex: 101 }}>
          <div style={{ width: 24, height: 2, background: COLORS.white, marginBottom: 5, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <div style={{ width: 24, height: 2, background: COLORS.white, marginBottom: 5, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: COLORS.white, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: "rgba(27,42,74,0.98)", padding: "16px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {[["Какво правим", "what"], ["Защо е важно", "why"], ["МСП", "sme"], ["Защо всеки месец", "whymonthly"], ["Цени", "pricing"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 18, fontWeight: 500, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{label}</a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
            <a href="/login" onClick={() => setMenuOpen(false)} style={{ color: COLORS.white, textDecoration: "none", fontSize: 16, fontWeight: 600, padding: "14px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.25)", textAlign: "center" }}>Вход</a>
            <a href="#scan" onClick={() => setMenuOpen(false)} style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px 24px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, textAlign: "center" }}>Безплатна проверка</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function MockScoreCard() {
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>AI Visibility Score</div>
        <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
          <svg viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            <circle cx="80" cy="80" r="70" fill="none" stroke={COLORS.orange} strokeWidth="12" strokeDasharray={`${0.42 * 2 * Math.PI * 70} ${2 * Math.PI * 70}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 44, fontWeight: 800, color: COLORS.white }}>42<span style={{ fontSize: 20, color: COLORS.orange }}>%</span></div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
        {[1,2,3,4,5].map((i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", filter: "blur(6px)", userSelect: "none" }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>{"██████████".slice(0, 4 + i * 2)}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>? ? ?</span>
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.orange, background: "rgba(27,42,74,0.8)", padding: "8px 18px", borderRadius: 8 }}>Детайли след регистрация</span>
        </div>
      </div>
      <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Регистрирай се за пълен доклад</div>
    </div>
  );
}

function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  return (
    <section style={{ minHeight: "100vh", background: `linear-gradient(165deg, ${COLORS.navy} 0%, #243B65 50%, ${COLORS.blue} 100%)`, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(46,107,173,0.2) 0%, transparent 70%)` }} />
      <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: COLORS.orange, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>AI Search Optimization Platform</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: 56, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 24px" }}>
            Направи бизнеса си{" "}
            <span style={{ background: `linear-gradient(135deg, ${COLORS.orange}, #F7C948)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>видим за AI</span>
          </h1>
          <p style={{ fontSize: 19, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 500 }}>
            ChatGPT, Gemini и Perplexity вече дават отговори, не просто резултати. GEO.app ти помага да бъдеш открит и препоръчан от AI търсачките.
          </p>
          <a href="#scan" style={{ background: COLORS.orange, color: COLORS.navy, padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(245,166,35,0.35)" }}>
            Провери сайта си безплатно
          </a>
          <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
            {[["14", "AI показателя"], ["2 мин", "за анализ"], ["100%", "безплатно"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.orange }}>{num}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-card" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(60px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
          <MockScoreCard />
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ tag, title, subtitle, light = false }: { tag?: string, title: string, subtitle?: string, light?: boolean }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      {tag && (
        <div style={{ display: "inline-flex", padding: "6px 18px", borderRadius: 100, marginBottom: 16, background: light ? "rgba(245,166,35,0.12)" : "rgba(46,107,173,0.1)", border: `1px solid ${light ? "rgba(245,166,35,0.25)" : "rgba(46,107,173,0.15)"}` }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: light ? COLORS.orange : COLORS.blue }}>{tag}</span>
        </div>
      )}
      <h2 className="section-title" style={{ fontSize: 42, fontWeight: 800, color: light ? COLORS.white : COLORS.navy, letterSpacing: "-1px", margin: "0 0 16px", lineHeight: 1.2 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 18, color: light ? "rgba(255,255,255,0.65)" : COLORS.textMuted, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function WhatSection() {
  const cards = [
    { icon: "🔍", title: "Анализираме AI видимостта", desc: "Сканираме сайта ви по 14 ключови показателя, за да определим колко лесно AI системите могат да ви открият и препоръчат." },
    { icon: "📊", title: "Персонализиран отчет", desc: "Получавате доклад с конкретна стъпка за подобрение — ясна, приложима, адаптирана към вашия бизнес." },
    { icon: "🔄", title: "Месечно проследяване", desc: "Всеки месец проверяваме прогреса ви и ви даваме следващата стъпка. Постепенно, без претоварване." },
    { icon: "🚀", title: "От SEO към AEO", desc: "Извеждаме ви отвъд класическото SEO — в ерата на Answer Engine Optimization, където AI дава отговори, а не линкове." },
  ];
  return (
    <section id="what" style={{ padding: "80px 24px", background: COLORS.offWhite }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle tag="Какво правим" title="GEO.app подобрява онлайн откриваемостта ви" subtitle="Преработваме дигиталното ви присъствие, така че да бъде лесно разбираемо за AI системи като ChatGPT, Gemini и други." />
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: 28, border: "1px solid rgba(27,42,74,0.06)", boxShadow: "0 2px 16px rgba(27,42,74,0.04)" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, rgba(245,166,35,0.12), rgba(46,107,173,0.08))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20 }}>{c.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: "0 0 10px" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const stats = [
    { num: "9 млрд", label: "AI взаимодействия през 2025г.", color: COLORS.orange },
    { num: "50%", label: "пазарен дял на AI търсачките днес", color: COLORS.lightBlue },
    { num: "60%", label: "на търсенията ще са през AI до 2028г.", color: COLORS.orange },
    { num: "90%", label: "от МСП не са готови за AI ерата", color: "#E74C3C" },
  ];
  return (
    <section id="why" style={{ padding: "80px 24px", background: `linear-gradient(170deg, ${COLORS.navy} 0%, #1E3558 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `radial-gradient(circle at 20% 80%, rgba(245,166,35,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(46,107,173,0.08) 0%, transparent 50%)` }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle light tag="Защо е важно" title="Онлайн търсенето се промени завинаги" subtitle="AI асистентите вече дават отговори, не просто резултати. Ако бизнесът ви не е оптимизиран за AI — просто не съществувате за милиони потребители." />
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: s.color, minWidth: 110 }}>{s.num}</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, margin: "0 0 20px" }}>Google vs AI: как се търси днес</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: 1 }}>Google търсене</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>"best matcha latte Sofia" → 10 сини линка, реклами. Потребителят сам решава кой линк да натисне.</div>
              </div>
              <div style={{ textAlign: "center", fontSize: 24 }}>↓</div>
              <div style={{ background: `linear-gradient(135deg, rgba(245,166,35,0.12), rgba(245,166,35,0.04))`, borderRadius: 12, padding: 20, border: `1px solid rgba(245,166,35,0.2)` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.orange, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: 1 }}>AI асистент</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>"where's the best matcha latte in Sofia?" → Конкретен отговор с препоръки. Или те споменава — или не. Няма среден вариант.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SMESection() {
  const problems = [
    { title: "Неструктурирана информация", desc: "Съдържанието не е организирано по начин, който AI моделите разбират — липсват schema markup, FAQ секции, структурирани данни.", icon: "📄" },
    { title: "Липса на технически файлове", desc: "Няма llms.txt, robots.txt не е оптимизиран за AI ботове, sitemap.xml липсва или е невалиден.", icon: "⚙️" },
    { title: "Нисък Domain Authority", desc: "Малките бизнеси нямат достатъчно авторитет в очите на AI системите, за да бъдат препоръчвани.", icon: "📉" },
    { title: "Не знаят, че проблемът съществува", desc: "90% от МСП дори не осъзнават, че AI търсачките са нов канал — и че клиенти ги търсят там.", icon: "🔇" },
  ];
  return (
    <section id="sme" style={{ padding: "80px 24px", background: COLORS.offWhite }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle tag="Проблемът" title="90% от МСП не са подготвени" subtitle="Повечето малки и средни предприятия са невидими за AI — информацията им е неструктурирана, неподредена и ненасочена." />
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          {problems.map((p, i) => (
            <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: 28, border: "1px solid rgba(27,42,74,0.06)", display: "flex", gap: 20, boxShadow: "0 2px 12px rgba(27,42,74,0.03)" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p.icon}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: COLORS.white, margin: "0 0 12px" }}>Ти можеш да бъдеш изключението.</h3>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 28px" }}>Докато конкурентите ти не знаят за GEO — ти вече оптимизираш.</p>
          <a href="#scan" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, padding: "14px 36px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>Започни безплатно</a>
        </div>
      </div>
    </section>
  );
}

function ScanSection() {
  const [domain, setDomain] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const [googleMaps, setGoogleMaps] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showWebsiteOffer, setShowWebsiteOffer] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);

  const handleScan = async () => {
    if (!noWebsite && !domain) return;
    if (noWebsite && !googleMaps && !facebook && !instagram) {
      setError("Добави поне един профил — Google Maps, Facebook или Instagram.");
      return;
    }
    setScanning(true); setResult(null); setError("");
    if (noWebsite) {
      try {
        const res = await fetch('/api/scan-social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ googleMaps, facebook, instagram, businessDesc })
        });
        const data = await res.json();
        if (data.error) setError(data.message || "Грешка при анализ.");
        else { setResult(data); setShowWebsiteOffer(true); }
      } catch { setError("Грешка при анализ. Опитай пак."); }
    } else {
      try {
        const res = await fetch(`/api/scan?domain=${encodeURIComponent(domain)}`);
        const data = await res.json();
        if (data.error === 'rate_limit') setError(data.message);
        else if (data.error) setError("Не можахме да сканираме домейна. Провери URL-а.");
        else setResult(data);
      } catch { setError("Грешка при сканиране. Опитай пак."); }
    }
    setScanning(false);
  };

  const handleSendOffer = async () => {
    if (!offerEmail) return;
    setSendingOffer(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/website_requests`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: offerName, email: offerEmail, business_description: businessDesc, google_maps: googleMaps, facebook, instagram })
      });
      setOfferSent(true);
    } catch { setOfferSent(true); }
    setSendingOffer(false);
  };

  return (
    <section id="scan" style={{ padding: "80px 24px", background: `linear-gradient(170deg, #F0F5FB 0%, ${COLORS.white} 100%)` }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle tag="Безплатна проверка" title="Провери AI видимостта си за 2 минути" subtitle="Въведи домейна си и виж колко е подготвен бизнесът ти за AI ерата." />
        <div style={{ background: COLORS.white, borderRadius: 20, padding: "32px 24px", boxShadow: "0 8px 40px rgba(27,42,74,0.08)", border: "1px solid rgba(27,42,74,0.06)" }}>

          {!noWebsite ? (
            <div className="scan-row" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input type="text" placeholder="yourbusiness.com" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && handleScan()}
                style={{ flex: 1, padding: "14px 16px", borderRadius: 12, fontSize: 16, border: `2px solid ${COLORS.lightGray}`, outline: "none", minWidth: 0 }} />
              <button onClick={handleScan} disabled={scanning} style={{ background: scanning ? COLORS.textMuted : COLORS.orange, color: scanning ? COLORS.white : COLORS.navy, padding: "14px 24px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: scanning ? "wait" : "pointer", whiteSpace: "nowrap" as const }}>
                {scanning ? "Анализирам..." : "Анализирай"}
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 16, textAlign: "left" as const }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>Опиши бизнеса си</label>
                <input value={businessDesc} onChange={e => setBusinessDesc(e.target.value)} placeholder="Примерно: Италианска пицария в центъра на София"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>Google Maps линк</label>
                <input value={googleMaps} onChange={e => setGoogleMaps(e.target.value)} placeholder="https://maps.google.com/..."
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>Facebook страница</label>
                <input value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/..."
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>Instagram профил</label>
                <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/..."
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <button onClick={handleScan} disabled={scanning} style={{ width: "100%", background: scanning ? COLORS.textMuted : COLORS.orange, color: scanning ? COLORS.white : COLORS.navy, padding: "14px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: scanning ? "wait" : "pointer" }}>
                {scanning ? "Анализирам..." : "Анализирай присъствието си"}
              </button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: "center" }}>
            <input type="checkbox" id="noWebsite" checked={noWebsite} onChange={e => { setNoWebsite(e.target.checked); setResult(null); setError(""); setShowWebsiteOffer(false); }}
              style={{ width: 18, height: 18, cursor: "pointer", accentColor: COLORS.orange }} />
            <label htmlFor="noWebsite" style={{ fontSize: 14, color: COLORS.textMuted, cursor: "pointer", fontWeight: 500 }}>Нямам уебсайт</label>
          </div>

          <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 0 }}>Без регистрация. Безплатен анализ. До 3 проверки на ден.</p>

          {scanning && (
            <div style={{ marginTop: 24 }}>
              <div style={{ height: 6, borderRadius: 3, background: COLORS.lightGray, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.orange})`, width: "60%" }} />
              </div>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 12 }}>
                {noWebsite ? "Анализираме онлайн присъствието ти..." : "Проверяваме sitemap, robots.txt, llms.txt, FAQ, structured data..."}
              </p>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 20, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "16px 20px", color: "#991b1b", fontSize: 14 }}>
              {error}
              {error.includes('лимита') && (
                <div style={{ marginTop: 12 }}>
                  <a href="/login" style={{ background: COLORS.orange, color: COLORS.navy, padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, display: "inline-block" }}>Регистрирай се за неограничени проверки</a>
                </div>
              )}
            </div>
          )}

          {result && !scanning && (
            <div style={{ marginTop: 32 }}>
              <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
                <svg viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="90" cy="90" r="78" fill="none" stroke={COLORS.lightGray} strokeWidth="14" />
                  <circle cx="90" cy="90" r="78" fill="none"
                    stroke={result.totalScore > 60 ? "#4CAF50" : result.totalScore > 35 ? COLORS.orange : "#E74C3C"}
                    strokeWidth="14"
                    strokeDasharray={`${(result.totalScore / 100) * 2 * Math.PI * 78} ${2 * Math.PI * 78}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.navy }}>{result.totalScore}<span style={{ fontSize: 22, color: COLORS.textMuted }}>%</span></div>
                </div>
              </div>

              <p style={{ fontSize: 16, color: COLORS.navy, fontWeight: 600, marginBottom: 8 }}>
                AI Visibility Score {noWebsite ? "за онлайн присъствието ти" : `за ${domain}`}
              </p>

              {noWebsite && result.feedback && (
                <div style={{ marginBottom: 20, padding: "14px 18px", background: "#fef2f2", borderRadius: 12, border: "1px solid #fca5a5", fontSize: 14, color: "#991b1b", textAlign: "left" as const }}>
                  {result.feedback}
                </div>
              )}

              {noWebsite && showWebsiteOffer && (
                <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "28px 24px", marginBottom: 20, textAlign: "left" as const }}>
                  <div style={{ color: COLORS.orange, fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: 1 }}>Защо имаш нужда от уебсайт?</div>
                  <h3 style={{ color: COLORS.white, fontSize: 20, fontWeight: 800, margin: "0 0 12px" }}>AI системите не могат да те намерят без уебсайт</h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>
                    ChatGPT, Gemini и Perplexity индексират уебсайтове. Без сайт — просто не съществуваш за AI търсачките. Скорът ти никога няма да надхвърли 25% без уебсайт.
                  </p>
                  {!offerSent ? (
                    <div>
                      <div style={{ color: COLORS.orange, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Искаш оферта за уебсайт? Пиши ни:</div>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                        <input value={offerName} onChange={e => setOfferName(e.target.value)} placeholder="Твоето име"
                          style={{ padding: "12px 14px", borderRadius: 10, border: "none", fontSize: 14, outline: "none" }} />
                        <input value={offerEmail} onChange={e => setOfferEmail(e.target.value)} placeholder="Имейл за връзка *"
                          style={{ padding: "12px 14px", borderRadius: 10, border: "none", fontSize: 14, outline: "none" }} />
                        <button onClick={handleSendOffer} disabled={sendingOffer || !offerEmail}
                          style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 15, cursor: sendingOffer || !offerEmail ? "not-allowed" : "pointer", opacity: sendingOffer || !offerEmail ? 0.7 : 1 }}>
                          {sendingOffer ? "Изпращам..." : "Искам оферта за уебсайт"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px", textAlign: "center" as const }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                      <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Получихме заявката ти!</div>
                      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>Ще се свържем с теб до 24 часа с оферта.</div>
                    </div>
                  )}
                </div>
              )}

              <a href="/login" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, border: "none", padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,166,35,0.3)" }}>
                {noWebsite ? "Регистрирай се и следи прогреса си" : "Получи пълния доклад"}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WhyMonthlySection() {
  return (
    <section id="whymonthly" style={{ padding: "80px 24px", background: COLORS.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle tag="Защо всеки месец" title="GEO оптимизацията не е еднократна задача" subtitle="AI алгоритмите се променят постоянно — това което работи днес, може да не работи след 3 месеца." />
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 48 }}>
          {[
            ["🔄", "Алгоритмите се менят", "ChatGPT, Gemini и Perplexity обновяват моделите си редовно. Без постоянна оптимизация — изпадаш от резултатите."],
            ["📈", "Конкуренцията расте", "Всеки месец все повече бизнеси се оптимизират за AI. Само постоянното подобрение гарантира видимост."],
            ["🎯", "Резултатите се натрупват", "GEO оптимизацията работи като сложна лихва — всяка малка стъпка надгражда върху предишната."],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background: COLORS.offWhite, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.lightGray}` }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, rgba(245,166,35,0.15), rgba(46,107,173,0.1))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20 }}>{icon as string}</div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: COLORS.navy, marginBottom: 10 }}>{title as string}</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 15, lineHeight: 1.7, margin: 0 }}>{desc as string}</p>
            </div>
          ))}
        </div>
        <div className="grid-2" style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "40px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: COLORS.white, margin: "0 0 16px" }}>Не е достатъчно да го направиш веднъж.</h3>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 28px" }}>SEO отне години да стане стандарт. GEO се развива пред очите ни — действай сега.</p>
            <a href="#pricing" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, padding: "14px 32px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>Започни сега</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Месец 1", "Базова оптимизация — sitemap, robots.txt, schema"], ["Месец 3", "AI видимостта се подобрява, първи резултати"], ["Месец 6", "Стабилно присъствие в AI резултати"], ["Месец 12", "Значително предимство пред конкурентите"]].map(([month, desc]) => (
              <div key={month as string} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ background: COLORS.orange, color: COLORS.navy, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{month as string}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, paddingTop: 4 }}>{desc as string}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState<string | null>(null);

  const priceIds = {
    monthly: { lite: process.env.NEXT_PUBLIC_STRIPE_LITE_MONTHLY || '', smart: process.env.NEXT_PUBLIC_STRIPE_SMART_MONTHLY || '', pro: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY || '' },
    yearly: { lite: process.env.NEXT_PUBLIC_STRIPE_LITE_YEARLY || '', smart: process.env.NEXT_PUBLIC_STRIPE_SMART_YEARLY || '', pro: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY || '' }
  }

  const handleCheckout = async (plan: string) => {
    setLoading(plan)
    const priceId = priceIds[period][plan as keyof typeof priceIds.monthly]
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Грешка при checkout. Опитай пак.')
    } catch { alert('Грешка при checkout. Опитай пак.') }
    setLoading(null)
  }

  const prices = { monthly: ["€29.90", "€59.90", "€79.90"], yearly: ["€9.90", "€39.90", "€59.90"] };

  return (
    <section id="pricing" style={{ padding: "80px 24px", background: `linear-gradient(170deg, ${COLORS.navy} 0%, #1E3558 100%)`, position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle light tag="Планове и цени" title="Избери своя план" subtitle="Започни безплатно, надгради когато си готов." />
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, marginBottom: 40 }}>
          {(["yearly", "monthly"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer", background: period === p ? COLORS.orange : "transparent", color: period === p ? COLORS.navy : "rgba(255,255,255,0.7)", fontSize: 14, transition: "all 0.2s" }}>
              {p === "yearly" ? "Годишно (спести 67%)" : "Месечно"}
            </button>
          ))}
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { name: "LITE", key: "lite", price: prices[period][0], desc: "Разбери къде стоиш", features: ["1 домейн", "Месечно сканиране", "Конкретни препоръки", "Email напомняния", "3 месеца история"], recommended: false },
            { name: "SMART", key: "smart", price: prices[period][1], desc: "Знай точно какво да направиш", features: ["3 домейна", "Всичко от LITE", "Step-by-step инструкции", "Генератор на съдържание", "6 месеца история"], recommended: true },
            { name: "PRO", key: "pro", price: prices[period][2], desc: "Пълна картина + конкуренция", features: ["5 домейна", "Всичко от SMART", "Сравнение с конкуренти", "AI Mention Check", "Неограничена история"], recommended: false },
          ].map(plan => (
            <div key={plan.name} style={{ background: plan.recommended ? COLORS.orange : "rgba(255,255,255,0.05)", border: `2px solid ${plan.recommended ? COLORS.orange : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: 32, position: "relative", textAlign: "left" as const, boxShadow: plan.recommended ? "0 24px 64px rgba(245,166,35,0.25)" : "none" }}>
              {plan.recommended && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: COLORS.navy, color: COLORS.orange, padding: "6px 20px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>ПРЕПОРЪЧАН</div>}
              <div style={{ color: plan.recommended ? COLORS.navy : COLORS.white, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ color: plan.recommended ? COLORS.navy : COLORS.orange, fontSize: 44, fontWeight: 900, marginBottom: 4, letterSpacing: "-2px" }}>{plan.price}<span style={{ fontSize: 16, fontWeight: 600 }}>/мес</span></div>
              <div style={{ color: plan.recommended ? COLORS.navy : "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 24 }}>{plan.desc}</div>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: plan.recommended ? COLORS.navy : COLORS.orange, fontWeight: 700 }}>✓</span>
                  <span style={{ color: plan.recommended ? COLORS.navy : "rgba(255,255,255,0.85)", fontSize: 14 }}>{f}</span>
                </div>
              ))}
              <button onClick={() => handleCheckout(plan.key)} disabled={loading === plan.key} style={{ marginTop: 24, width: "100%", background: plan.recommended ? COLORS.navy : COLORS.orange, color: plan.recommended ? COLORS.white : COLORS.navy, padding: "14px", borderRadius: 12, border: "none", fontWeight: 700, cursor: loading === plan.key ? "not-allowed" : "pointer", fontSize: 15, opacity: loading === plan.key ? 0.7 : 1 }}>
                {loading === plan.key ? "Зареждане..." : `Започни с ${plan.name}`}
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
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-grid { grid-template-columns: 1fr !important; padding: 100px 20px 60px !important; gap: 0 !important; }
          .hero-card { display: none !important; }
          .hero-title { font-size: 38px !important; }
          .section-title { font-size: 28px !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 400px; margin: 0 auto; }
          .scan-row { flex-direction: column !important; }
          .scan-row input { width: 100% !important; }
          .scan-row button { width: 100% !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 32px !important; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <NavBar />
      <HeroSection />
      <WhatSection />
      <WhySection />
      <SMESection />
      <ScanSection />
      <WhyMonthlySection />
      <PricingSection />
      <footer style={{ background: "#0F1A2E", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, marginBottom: 12 }}>GEO<span style={{ color: COLORS.orange }}>.app</span></div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>© 2026 GEO App · Privacy Policy · Terms of Service</div>
      </footer>
    </>
  );
}
