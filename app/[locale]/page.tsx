'use client'
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navy:      "#0A1628",
  navyMid:   "#0D1E35",
  navyLight: "rgba(255,255,255,0.06)",
  coral:     "#FF5A47",
  coralDark: "#E04535",
  mint:      "#3ECFB5",
  cream:     "#F7F6F2",
  white:     "#FFFFFF",
  border:    "rgba(255,255,255,0.09)",
  borderCream: "rgba(10,22,40,0.08)",
  text:      "#0A1628",
  textMuted: "#5A6A7A",
  textLight: "rgba(255,255,255,0.65)",
  textDim:   "rgba(255,255,255,0.35)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ light = true, size = 20 }: { light?: boolean; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={size * 1.6} height={size * 1.6} viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5"  ry="5"  fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: size, fontWeight: 800, color: light ? C.white : C.navy, fontFamily: "'Outfit', sans-serif" }}>
        findable<span style={{ color: C.coral }}>.app</span>
      </span>
    </span>
  );
}

// ─── Language switcher ────────────────────────────────────────────────────────
function LanguageSwitcher({ light = true }: { light?: boolean }) {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();
  const switchLocale = (l: string) => {
    const segs = pathname.split('/');
    segs[1] = l;
    router.push(segs.join('/'));
  };
  const bg   = light ? "rgba(255,255,255,0.08)" : "rgba(10,22,40,0.06)";
  const active = light ? "rgba(255,255,255,0.18)" : "rgba(10,22,40,0.12)";
  return (
    <div style={{ display: "flex", background: bg, borderRadius: 8, padding: 3, gap: 3 }}>
      {['en', 'bg'].map(l => (
        <button key={l} onClick={() => switchLocale(l)} style={{
          padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
          background: locale === l ? active : "transparent",
          color: locale === l ? (light ? C.white : C.navy) : (light ? "rgba(255,255,255,0.4)" : C.textMuted),
          fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
          fontFamily: "'Outfit', sans-serif",
        }}>{l}</button>
      ))}
    </div>
  );
}

// ─── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  const locale   = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = locale === 'en'
    ? [["How it works", "howitworks"], ["Pricing", "pricing"]]
    : [["Как работи", "howitworks"], ["Цени", "pricing"]];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const bg = scrolled || menuOpen
    ? "rgba(10,22,40,0.96)"
    : "transparent";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: bg,
      backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.35s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size={20} />

        {/* Desktop */}
        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map(([label, id]) => (
            <a key={id} href={`#${id}`} style={{
              color: "rgba(255,255,255,0.65)", textDecoration: "none",
              fontSize: 14, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >{label}</a>
          ))}
          <LanguageSwitcher />
          <a href={`/${locale}/login`} style={{
            color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14,
            fontWeight: 500, border: "1px solid rgba(255,255,255,0.18)", padding: "8px 20px",
            borderRadius: 8, fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
          }}>{locale === 'en' ? 'Log in' : 'Вход'}</a>
          <a href="#hero-scan" style={{
            background: C.coral, color: C.white, padding: "9px 22px", borderRadius: 8,
            textDecoration: "none", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = C.coralDark)}
            onMouseLeave={e => (e.currentTarget.style.background = C.coral)}
          >{locale === 'en' ? 'Free check' : 'Безплатна проверка'}</a>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 24, height: 2, background: C.white, marginBottom: i < 2 ? 5 : 0,
              transition: "all 0.3s",
              transform: menuOpen
                ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "none"
                : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "rgba(10,22,40,0.98)", padding: "12px 28px 28px", borderTop: `1px solid ${C.border}` }}>
          {navLinks.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{
              display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none",
              fontSize: 18, fontWeight: 500, padding: "14px 0", borderBottom: `1px solid ${C.border}`,
              fontFamily: "'Outfit', sans-serif",
            }}>{label}</a>
          ))}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 20 }}>
            <LanguageSwitcher />
            <a href={`/${locale}/login`} style={{
              color: C.white, textDecoration: "none", fontSize: 16, fontWeight: 600,
              padding: "13px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center" as const, fontFamily: "'Outfit', sans-serif",
            }}>{locale === 'en' ? 'Log in' : 'Вход'}</a>
            <a href="#hero-scan" onClick={() => setMenuOpen(false)} style={{
              background: C.coral, color: C.white, padding: "13px 24px", borderRadius: 10,
              textDecoration: "none", fontSize: 16, fontWeight: 700, textAlign: "center" as const,
              fontFamily: "'Outfit', sans-serif",
            }}>{locale === 'en' ? 'Free check' : 'Безплатна проверка'}</a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Score circle (shared) ─────────────────────────────────────────────────────
function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const r  = (size / 2) - 8;
  const c  = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score > 60 ? C.mint : score > 35 ? C.coral : "#ef4444";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 800, color: C.white, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{score}<span style={{ fontSize: size * 0.14, color: "rgba(255,255,255,0.4)" }}>%</span></span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>AI Score</span>
      </div>
    </div>
  );
}

// ─── SECTION 1: Hero + Scan ────────────────────────────────────────────────────
function HeroScanSection() {
  const locale  = useLocale();
  const [tab, setTab]       = useState<'domain' | 'nosite'>('domain');
  const [domain, setDomain] = useState('');
  const [googleMaps, setGoogleMaps] = useState('');
  const [facebook, setFacebook]     = useState('');
  const [instagram, setInstagram]   = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [scanning, setScanning]   = useState(false);
  const [result, setResult]       = useState<any>(null);
  const [error, setError]         = useState('');
  const [visible, setVisible]     = useState(false);

  // Website offer states
  const [offerName, setOfferName]   = useState('');
  const [offerEmail, setOfferEmail] = useState('');
  const [offerSent, setOfferSent]   = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleScan = async () => {
    if (tab === 'domain' && !domain) return;
    setScanning(true); setResult(null); setError('');
    try {
      if (tab === 'nosite') {
        const res  = await fetch('/api/scan-social', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ googleMaps, facebook, instagram, businessDesc }) });
        const data = await res.json();
        if (data.error) setError(data.message || 'Error.'); else setResult(data);
      } else {
        const res  = await fetch(`/api/scan?domain=${encodeURIComponent(domain)}`);
        const data = await res.json();
        if (data.error === 'rate_limit') setError(data.message);
        else if (data.error) setError(locale === 'en' ? 'Could not scan domain.' : 'Неуспешно сканиране.');
        else setResult(data);
      }
    } catch { setError(locale === 'en' ? 'Error. Try again.' : 'Грешка. Опитай отново.'); }
    setScanning(false);
  };

  const handleSendOffer = async () => {
    if (!offerEmail) return;
    setSendingOffer(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/website_requests`, {
        method: 'POST',
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: offerName, email: offerEmail, business_description: businessDesc, google_maps: googleMaps, facebook, instagram }),
      });
    } catch {}
    setOfferSent(true);
    setSendingOffer(false);
  };

  const en = locale === 'en';

  return (
    <section id="hero-scan" style={{ background: C.navy, minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Subtle geometric texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,90,71,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(62,207,181,0.03) 0%, transparent 40%)", pointerEvents: "none" }} />
      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 28px 80px", width: "100%", position: "relative", zIndex: 2 }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

          {/* Left — headline */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(255,90,71,0.1)", border: "1px solid rgba(255,90,71,0.25)", borderRadius: 100, padding: "6px 16px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: C.coral, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Outfit', sans-serif" }}>
                {en ? "AI Visibility Platform" : "AI Видимост Платформа"}
              </span>
            </div>

            <h1 className="hero-h1" style={{
              fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
              fontSize: 70, fontWeight: 900, color: C.white,
              lineHeight: 1.0, letterSpacing: "-0.03em",
              margin: "0 0 24px",
            }}>
              {en ? (
                <>Be found<br />by <em style={{ color: C.coral, fontStyle: "italic" }}>AI</em><br />search</>
              ) : (
                <>Бъди намиран<br />от <em style={{ color: C.coral, fontStyle: "italic" }}>AI</em><br />търсенето</>
              )}
            </h1>

            <p style={{ fontSize: 18, color: C.textLight, lineHeight: 1.7, margin: "0 0 40px", maxWidth: 440, fontFamily: "'Outfit', sans-serif" }}>
              {en
                ? "We analyze many different AI criteria and generate ready-to-use files so ChatGPT, Claude, Gemini and others can find and recommend your business."
                : "Анализираме множество AI критерия и генерираме готови файлове — за да те намерят и препоръчат ChatGPT, Claude, Gemini и другите."}
            </p>

            <div style={{ display: "flex", gap: 36 }}>
              {[
                ["14", en ? "AI criteria" : "AI критерия"],
                ["<1m", en ? "analysis" : "анализ"],
                ["€0", en ? "to start" : "за начало"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.coral, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 12, color: C.textDim, marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — scan panel */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.25s" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
              {/* Panel header */}
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                {['#FF5A47','#F5A623','#3ECFB5'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                <span style={{ marginLeft: 8, fontSize: 12, color: C.textDim, fontFamily: "'Outfit', sans-serif" }}>
                  {en ? "AI Visibility Check — free" : "AI Видимост Проверка — безплатно"}
                </span>
              </div>

              <div style={{ padding: "28px 28px 32px" }}>
                {/* Tab switcher */}
                <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
                  {(['domain', 'nosite'] as const).map(t => (
                    <button key={t} onClick={() => { setTab(t); setResult(null); setError(''); }} style={{
                      flex: 1, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer",
                      background: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                      color: tab === t ? C.white : "rgba(255,255,255,0.4)",
                      fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                      transition: "all 0.2s",
                    }}>
                      {t === 'domain'
                        ? (en ? "I have a website" : "Имам уебсайт")
                        : (en ? "No website" : "Нямам уебсайт")}
                    </button>
                  ))}
                </div>

                {/* Inputs */}
                {tab === 'domain' ? (
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }} className="scan-row">
                    <input
                      type="text" value={domain} placeholder={en ? "yourbusiness.com" : "вашбизнес.com"}
                      onChange={e => setDomain(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleScan()}
                      style={{ flex: 1, padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: C.white, fontSize: 15, outline: "none", fontFamily: "'Outfit', sans-serif", minWidth: 0 }}
                    />
                    <button onClick={handleScan} disabled={scanning} style={{
                      background: scanning ? "rgba(255,90,71,0.5)" : C.coral, color: C.white,
                      padding: "13px 22px", borderRadius: 10, border: "none", fontSize: 14,
                      fontWeight: 700, cursor: scanning ? "wait" : "pointer",
                      fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" as const, flexShrink: 0,
                      transition: "background 0.2s",
                    }}>
                      {scanning ? (en ? "Scanning…" : "Сканирам…") : (en ? "Analyze →" : "Анализирай →")}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 16 }}>
                    {([
                      [en ? "Describe your business" : "Опиши бизнеса си", businessDesc, setBusinessDesc, en ? "Italian pizzeria in Sofia" : "Пицария в София"],
                      ["Google Maps", googleMaps, setGoogleMaps, "https://maps.google.com/..."],
                      ["Facebook", facebook, setFacebook, "https://facebook.com/..."],
                      ["Instagram", instagram, setInstagram, "https://instagram.com/..."],
                    ] as [string, string, (v: string) => void, string][]).map(([label, val, setter, ph]) => (
                      <div key={label}>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 5, fontFamily: "'Outfit', sans-serif" }}>{label}</div>
                        <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "11px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: C.white, fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "'Outfit', sans-serif" }} />
                      </div>
                    ))}
                    <button onClick={handleScan} disabled={scanning} style={{ background: scanning ? "rgba(255,90,71,0.5)" : C.coral, color: C.white, padding: "13px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700, cursor: scanning ? "wait" : "pointer", fontFamily: "'Outfit', sans-serif" }}>
                      {scanning ? (en ? "Scanning…" : "Сканирам…") : (en ? "Analyze →" : "Анализирай →")}
                    </button>
                  </div>
                )}

                <p style={{ fontSize: 12, color: C.textDim, textAlign: "center" as const, fontFamily: "'Outfit', sans-serif" }}>
                  {en ? "No registration · No credit card" : "Без регистрация · Без кредитна карта"}
                </p>

                {error && (
                  <div style={{ marginTop: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "14px 16px", color: "#fca5a5", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                    {error}
                  </div>
                )}

                {/* Result */}
                {result && !scanning && (
                  <div style={{ marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                      <ScoreCircle score={result.totalScore} size={100} />
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: "'Outfit', sans-serif" }}>
                          {result.totalScore > 60
                            ? (en ? "Looking good!" : "Изглежда добре!")
                            : result.totalScore > 35
                            ? (en ? "Needs improvement" : "Нужни подобрения")
                            : (en ? "Critical issues found" : "Критични проблеми")}
                        </div>
                        <div style={{ fontSize: 13, color: C.textDim, marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>
                          {tab === 'nosite'
                            ? (en ? "AI can't find you without a website" : "AI не може да те намери без уебсайт")
                            : (en ? `${result.issues?.length ?? 0} issues found` : `${result.issues?.length ?? 0} проблема открити`)}
                        </div>
                      </div>
                    </div>

                    {/* Website offer for no-site users */}
                    {tab === 'nosite' && !offerSent && (
                      <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>
                          {en ? "Want a website quote?" : "Искаш оферта за уебсайт?"}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                          <input value={offerName} onChange={e => setOfferName(e.target.value)} placeholder={en ? "Your name" : "Твоето име"} style={{ padding: "11px 13px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: C.white, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
                          <input value={offerEmail} onChange={e => setOfferEmail(e.target.value)} placeholder="Email *" style={{ padding: "11px 13px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: C.white, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
                          <button onClick={handleSendOffer} disabled={sendingOffer || !offerEmail} style={{ background: C.coral, color: C.white, padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 14, cursor: sendingOffer || !offerEmail ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", opacity: !offerEmail ? 0.5 : 1 }}>
                            {en ? "Get website quote" : "Искам оферта"}
                          </button>
                        </div>
                      </div>
                    )}
                    {tab === 'nosite' && offerSent && (
                      <div style={{ background: "rgba(62,207,181,0.08)", border: "1px solid rgba(62,207,181,0.2)", borderRadius: 10, padding: 16, marginBottom: 16, color: C.mint, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
                        {en ? "🎉 We'll be in touch within 24 hours!" : "🎉 Ще се свържем до 24 часа!"}
                      </div>
                    )}

                    <a href={`/${locale}/login`} style={{ display: "block", background: C.coral, color: C.white, border: "none", padding: "14px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center" as const, fontFamily: "'Outfit', sans-serif" }}>
                      {en ? "Get the full report →" : "Получи пълния доклад →"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 2: Social proof strip ────────────────────────────────────────────
function SocialProofStrip() {
  const locale = useLocale();
  const en = locale === 'en';

  const categories = en ? [
    { icon: "🍕", label: "Restaurants", sub: "& food & beverage" },
    { icon: "⚖️", label: "Law firms", sub: "& consultants" },
    { icon: "🛍️", label: "E-shops", sub: "& retail brands" },
    { icon: "🏥", label: "Clinics", sub: "& health services" },
    { icon: "📣", label: "Agencies", sub: "& studios" },
  ] : [
    { icon: "🍕", label: "Ресторанти", sub: "& заведения" },
    { icon: "⚖️", label: "Адвокати", sub: "& консултанти" },
    { icon: "🛍️", label: "Онлайн магазини", sub: "& търговци" },
    { icon: "🏥", label: "Клиники", sub: "& здравни услуги" },
    { icon: "📣", label: "Агенции", sub: "& студия" },
  ];

  return (
    <div style={{ background: C.white, borderTop: `1px solid ${C.borderCream}`, borderBottom: `1px solid ${C.borderCream}`, padding: "40px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center" as const, marginBottom: 28 }}>
          <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, fontFamily: "'Outfit', sans-serif" }}>
            {en ? "Trusted by businesses across industries" : "Използват го бизнеси от всички сфери"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }} className="proof-grid">
          {categories.map((cat) => (
            <div key={cat.label} style={{
              display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8,
              padding: "20px 12px", borderRadius: 14,
              border: `1px solid ${C.borderCream}`,
              background: C.cream,
            }}>
              <span style={{ fontSize: 30 }}>{cat.icon}</span>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: "'Outfit', sans-serif", lineHeight: 1.3 }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Outfit', sans-serif", marginTop: 3 }}>{cat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 3: Why it matters ────────────────────────────────────────────────
function WhyItMattersSection() {
  const locale = useLocale();
  const en = locale === 'en';
  const { ref, visible } = useVisible(0.08);

  const stats = en ? [
    { num: "90%", pct: 90, color: C.coral,   label: "Businesses with no AI optimization",       note: "9 in 10 SMEs are invisible to AI search" },
    { num: "74%", pct: 74, color: C.mint,    label: "Users who trust AI recommendations",        note: "vs. 46% who trust traditional search results" },
    { num: "62%", pct: 62, color: "#F5A623", label: "Search queries answered directly by AI",    note: "No click needed — AI gives the answer" },
    { num: "40%", pct: 40, color: "#7B8FF5", label: "Revenue increase after AI optimization",    note: "Average for businesses that implement GEO" },
  ] : [
    { num: "90%", pct: 90, color: C.coral,   label: "Бизнеси без AI оптимизация",                note: "9 от 10 МСП са невидими за AI търсенето" },
    { num: "74%", pct: 74, color: C.mint,    label: "Потребители, доверяващи се на AI препоръки", note: "спрямо 46% при традиционното търсене" },
    { num: "62%", pct: 62, color: "#F5A623", label: "Търсения с директен AI отговор",             note: "Без клик — AI дава директен отговор" },
    { num: "40%", pct: 40, color: "#7B8FF5", label: "Ръст на приходите след AI оптимизация",      note: "Средно за бизнеси, внедрили GEO" },
  ];

  return (
    <section id="why" style={{ background: C.white, padding: "100px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{ textAlign: "center" as const, marginBottom: 72, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, background: "rgba(255,90,71,0.07)", border: "1px solid rgba(255,90,71,0.2)", borderRadius: 100, padding: "6px 18px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.coral, fontFamily: "'Outfit', sans-serif" }}>
              {en ? "Why it matters" : "Защо е важно"}
            </span>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 900, color: C.navy, letterSpacing: "-0.03em", margin: "0 0 20px", lineHeight: 1.05 }}>
            {en
              ? <>AI search is not the future —<br /><em style={{ color: C.coral, fontStyle: "italic" }}>it's now</em></>
              : <>AI търсенето не е бъдещето —<br /><em style={{ color: C.coral, fontStyle: "italic" }}>то е настоящето</em></>}
          </h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 600, margin: "0 auto", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif" }}>
            {en
              ? "Millions of people already use AI to find products, services and local businesses. Are you showing up?"
              : "Милиони хора вече използват AI за да намерят продукти, услуги и местни бизнеси. Ти показваш ли се?"}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* Left: stat rows with progress bars */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                background: C.cream, border: `1px solid ${C.borderCream}`,
                borderRadius: 14, padding: "20px 24px",
                position: "relative", overflow: "hidden",
                opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-20px)",
                transition: `all 0.6s ease ${0.1 + i * 0.1}s`,
              }}>
                {/* Left accent bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: s.color, borderRadius: "14px 0 0 14px" }} />
                <div style={{ paddingLeft: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: C.textMuted, fontWeight: 500, flex: 1, paddingRight: 16, lineHeight: 1.4, fontFamily: "'Outfit', sans-serif" }}>{s.label}</span>
                    <span style={{
                      fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
                      fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1, flexShrink: 0,
                    }}>{s.num}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(10,22,40,0.08)", borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ width: visible ? `${s.pct}%` : "0%", height: "100%", background: s.color, borderRadius: 3, transition: `width 1s ease ${0.3 + i * 0.1}s` }} />
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted, opacity: 0.7, fontFamily: "'Outfit', sans-serif" }}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Google vs AI comparison */}
          <div style={{
            background: C.navy, borderRadius: 20, padding: 28,
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(20px)",
            transition: "all 0.7s ease 0.2s",
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>
              {en ? "Google vs AI: how search works today" : "Google vs AI: как се търси днес"}
            </div>

            {/* Google card */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18, marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
                {en ? "Google search · before" : "Google търсене · преди"}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontFamily: "'Outfit', sans-serif" }}>
                {en
                  ? <>"best matcha latte Sofia" → 10 blue links, ads, maps. User decides which link to click.</>
                  : <>"best matcha latte Sofia" → 10 сини линка, реклами, Maps. Потребителят сам решава кой линк да натисне.</>}
              </div>
            </div>

            <div style={{ textAlign: "center" as const, color: "rgba(255,255,255,0.2)", fontSize: 20, margin: "6px 0", lineHeight: 1 }}>↓</div>

            {/* AI card */}
            <div style={{ background: "rgba(255,90,71,0.1)", border: "1px solid rgba(255,90,71,0.22)", borderRadius: 12, padding: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.coral, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
                {en ? "AI assistant · now" : "AI асистент · сега"}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, fontFamily: "'Outfit', sans-serif" }}>
                {en
                  ? <>"where's the best matcha latte in Sofia?" → <strong style={{ color: C.white }}>One direct recommendation.</strong> You're in — or you're out. No middle ground.</>
                  : <>"where's the best matcha latte in Sofia?" → <strong style={{ color: C.white }}>Конкретен отговор с препоръки.</strong> Или те споменава — или не те споменава. Няма среден вариант.</>}
              </div>
            </div>

            {/* Urgency */}
            <div style={{ background: "rgba(255,90,71,0.07)", border: "1px solid rgba(255,90,71,0.18)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>⚡</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.coral, marginBottom: 5, fontFamily: "'Outfit', sans-serif" }}>
                  {en ? "The window is open — but closing fast" : "Прозорецът е отворен — но се затваря"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
                  {en
                    ? "Early adopters are already building authority in AI systems. Every month you wait, competitors get harder to displace."
                    : "Ранните последователи вече изграждат авторитет. Всеки месец закъснение прави конкурентите по-трудни за изместване."}
                </div>
              </div>
            </div>

            {/* CTA inside card */}
            <a href="#hero-scan" style={{
              display: "block", marginTop: 20, background: C.coral, color: C.white,
              padding: "13px", borderRadius: 10, textDecoration: "none", fontSize: 14,
              fontWeight: 700, textAlign: "center" as const, fontFamily: "'Outfit', sans-serif",
            }}>
              {en ? "Check your AI visibility — free →" : "Провери AI видимостта си — безплатно →"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 4: How it works (+ what we do) ────────────────────────────────────
function HowItWorksSection() {
  const locale  = useLocale();
  const en      = locale === 'en';
  const { ref, visible } = useVisible(0.1);

  const steps = [
    {
      num: "01", color: C.coral,
      title: en ? "Get your free AI score" : "Вземи безплатния AI скор",
      desc: en
        ? "Enter your domain — we instantly scan 14 visibility metrics. In under 1 minute, for free, no registration needed."
        : "Въведи домейна си — сканираме 14 показателя за под 1 минута. Безплатно, без регистрация.",
      tag: en ? "Free · No registration" : "Безплатно · Без регистрация",
      bars: [92, 67, 45, 23, 78],
    },
    {
      num: "02", color: C.mint,
      title: en ? "See exactly what's missing" : "Виж точно какво липсва",
      desc: en
        ? "Unlock the full report and get a prioritized action plan — exactly which optimizations are keeping you invisible to AI."
        : "Отключи пълния доклад и получи приоритизиран план — кои оптимизации те правят невидим за AI.",
      tag: en ? "From €9.90/mo" : "От €9.90/мес",
      items: en
        ? ["Improve AI discoverability", "Strengthen content signals", "Boost authority markers"]
        : ["Подобри AI откриваемостта", "Засили контент сигналите", "Укрепи авторитетните маркери"],
    },
    {
      num: "03", color: "#22c55e",
      title: en ? "Upload & boost visibility" : "Качи и подобри видимостта",
      desc: en
        ? "Get ready-to-upload files with step-by-step instructions for your platform. 5 minutes. No agency. No code."
        : "Получи готови за качване файлове с инструкции. 5 минути. Без агенция. Без код.",
      tag: en ? "From €39.90/mo · Any platform" : "От €39.90/мес · Всяка платформа",
      files: en
        ? ["AI Optimization Guide", "Technical Config File", "Content Enhancement Doc", "Quick Win Checklist"]
        : ["Ръководство за AI оптимизация", "Технически конфиг файл", "Документ за съдържание", "Чеклист за бързи резултати"],
    },
  ];

  return (
    <section id="howitworks" style={{ padding: "100px 28px", background: C.cream }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div ref={ref} style={{ textAlign: "center", marginBottom: 72, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, background: "rgba(10,22,40,0.06)", border: "1px solid rgba(10,22,40,0.1)", borderRadius: 100, padding: "6px 18px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.text, fontFamily: "'Outfit', sans-serif" }}>
              {en ? "How it works" : "Как работи"}
            </span>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", fontSize: 48, fontWeight: 900, color: C.navy, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
            {en ? "From invisible to recommended\nin 3 steps" : "От невидим до препоръчан\nв 3 стъпки"}
          </h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 540, margin: "0 auto", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif" }}>
            {en ? "No technical knowledge. No agency. Just results." : "Без технически познания. Без агенция. Само резултати."}
          </p>
        </div>

        {/* Steps */}
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)", transition: `all 0.7s ease ${0.1 + i * 0.12}s` }}>
              {/* Step number accent */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.white, fontFamily: "'Outfit', sans-serif" }}>{s.num}</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${s.color}18`, border: `1px solid ${s.color}30`, borderRadius: 100, padding: "4px 12px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.color, fontFamily: "'Outfit', sans-serif" }}>{s.tag}</span>
                </div>
              </div>

              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.borderCream}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: "0 0 10px", lineHeight: 1.3, fontFamily: "'Outfit', sans-serif" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: "0 0 18px", fontFamily: "'Outfit', sans-serif" }}>{s.desc}</p>

                {/* Mini mockup */}
                <div style={{ background: C.navy, borderRadius: 10, padding: 14 }}>
                  {s.bars && (
                    <>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
                        {en ? "Scanning…" : "Сканирам…"}
                      </div>
                      {s.bars.map((w, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: w > 70 ? C.mint : w > 50 ? C.coral : "#ef4444", flexShrink: 0 }} />
                          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                            <div style={{ width: `${w}%`, height: "100%", background: w > 70 ? C.mint : w > 50 ? C.coral : "#ef4444", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", width: 26, textAlign: "right" as const, fontFamily: "'Outfit', sans-serif" }}>{w}%</span>
                        </div>
                      ))}
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.coral, marginTop: 8, fontFamily: "'Outfit', sans-serif" }}>AI Score: 42%</div>
                    </>
                  )}
                  {s.items && s.items.map((item, j) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: j < s.items!.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,90,71,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.coral, flexShrink: 0, fontFamily: "'Outfit', sans-serif" }}>{j + 1}</div>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "'Outfit', sans-serif" }}>{item}</span>
                    </div>
                  ))}
                  {s.files && s.files.map((f, j) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: j < s.files!.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 700, background: "rgba(34,197,94,0.12)", padding: "2px 6px", borderRadius: 4, flexShrink: 0, fontFamily: "'Outfit', sans-serif" }}>
                        {en ? "READY" : "ГОТОВ"}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "'Outfit', sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}

// ─── SECTION 4: Pricing ────────────────────────────────────────────────────────
function PricingSection() {
  const t      = useTranslations('plans');
  const locale = useLocale();
  const en     = locale === 'en';
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState<string | null>(null);
  const [agreed, setAgreed]   = useState(false);
  const { ref, visible }      = useVisible(0.1);

  const priceIds = {
    monthly: { lite: process.env.NEXT_PUBLIC_STRIPE_LITE_MONTHLY || '', smart: process.env.NEXT_PUBLIC_STRIPE_SMART_MONTHLY || '', pro: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY || '' },
    yearly:  { lite: process.env.NEXT_PUBLIC_STRIPE_LITE_YEARLY || '',  smart: process.env.NEXT_PUBLIC_STRIPE_SMART_YEARLY || '',  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY || '' },
  };

  const handleCheckout = async (plan: string) => {
    if (!agreed) return;
    setLoading(plan);
    const priceId = priceIds[period][plan as keyof typeof priceIds.monthly];
    try {
      const res  = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url; else alert('Checkout error. Try again.');
    } catch { alert('Checkout error.'); }
    setLoading(null);
  };

  const prices     = { monthly: ['€14.90', '€59.90', '€89.90'], yearly: ['€9.90', '€39.90', '€59.90'] };
  const planKeys   = ['lite', 'smart', 'pro'] as const;

  return (
    <section id="pricing" style={{ padding: "100px 28px", background: C.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 56, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, background: "rgba(255,90,71,0.06)", border: "1px solid rgba(255,90,71,0.15)", borderRadius: 100, padding: "6px 18px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.coral, fontFamily: "'Outfit', sans-serif" }}>{t('tag')}</span>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", fontSize: 48, fontWeight: 900, color: C.navy, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>{t('title')}</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif" }}>{t('subtitle')}</p>
        </div>

        {/* Period toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", background: C.cream, borderRadius: 12, padding: 4, gap: 4 }}>
            {(['yearly', 'monthly'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "10px 28px", borderRadius: 9, border: "none", fontWeight: 600, cursor: "pointer",
                background: period === p ? C.white : "transparent",
                color: period === p ? C.navy : C.textMuted,
                fontSize: 14, fontFamily: "'Outfit', sans-serif",
                boxShadow: period === p ? `0 1px 4px rgba(10,22,40,0.1)` : "none",
                transition: "all 0.2s",
              }}>
                {p === 'yearly' ? `${t('annual')} (${t('save')})` : t('monthly')}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {planKeys.map((key, i) => {
            const planData   = t.raw(key) as any;
            const recommended = key === 'smart';
            return (
              <div key={key} style={{
                background: recommended ? C.navy : C.white,
                border: recommended ? `2px solid ${C.coral}` : `1px solid ${C.borderCream}`,
                borderRadius: 20,
                padding: 32,
                position: "relative",
                display: "flex",
                flexDirection: "column" as const,
              }}>
                {recommended && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: C.coral, color: C.white, padding: "5px 18px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" as const, fontFamily: "'Outfit', sans-serif" }}>
                    {planData.popular}
                  </div>
                )}
                <div style={{ color: recommended ? C.white : C.navy, fontSize: 19, fontWeight: 800, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{planData.name}</div>
                <div style={{ color: recommended ? C.white : C.coral, fontSize: 42, fontWeight: 900, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>
                  {prices[period][i]}<span style={{ fontSize: 15, opacity: 0.6 }}>/mo</span>
                </div>
                {period === 'monthly' && (
                  <div style={{ fontSize: 12, color: recommended ? "rgba(255,255,255,0.5)" : C.textMuted, marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>
                    {en ? `Save with yearly: ${prices.yearly[i]}/mo` : `Спести с годишен: ${prices.yearly[i]}/мес`}
                  </div>
                )}
                <div style={{ fontSize: 13, color: recommended ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>{planData.domains}</div>

                {(planData.features as string[]).map((f: string) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: recommended ? C.mint : C.coral, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: recommended ? "rgba(255,255,255,0.85)" : C.text, fontSize: 14, lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}>{f}</span>
                  </div>
                ))}

                <div style={{ marginTop: "auto", paddingTop: 24 }}>
                  <button onClick={() => handleCheckout(key)} disabled={loading === key || !agreed} style={{
                    width: "100%", background: recommended ? C.coral : C.navy,
                    color: C.white, padding: "14px", borderRadius: 12, border: "none",
                    fontWeight: 700, fontSize: 15, cursor: !agreed || loading === key ? "not-allowed" : "pointer",
                    opacity: !agreed || loading === key ? 0.5 : 1,
                    marginBottom: 12, fontFamily: "'Outfit', sans-serif",
                    transition: "opacity 0.2s",
                  }}>
                    {loading === key ? 'Loading…' : `${t('cta_start')} ${planData.name}`}
                  </button>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <input type="checkbox" id={`agree-${key}`} checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 13, height: 13, marginTop: 2, cursor: "pointer", accentColor: C.coral, flexShrink: 0 }} />
                    <label htmlFor={`agree-${key}`} style={{ fontSize: 11, color: recommended ? "rgba(255,255,255,0.4)" : C.textMuted, lineHeight: 1.5, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                      {t('agree')}{" "}<a href={`/${locale}/terms`} target="_blank" style={{ color: recommended ? C.mint : C.coral, textDecoration: "underline" }}>{t('terms')}</a>{" & "}<a href={`/${locale}/privacy`} target="_blank" style={{ color: recommended ? C.mint : C.coral, textDecoration: "underline" }}>{t('privacy')}</a>{t('agree_suffix')}
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 5: Footer + Contact ──────────────────────────────────────────────
function FooterSection() {
  const locale = useLocale();
  const en     = locale === 'en';
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSend = async () => {
    if (!email || !message) return;
    setSending(true); setError('');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, created_at: new Date().toISOString() }),
      });
      setSent(true);
    } catch { setError(en ? 'Error sending. Try again.' : 'Грешка при изпращане.'); }
    setSending(false);
  };

  const navLinks = en
    ? [["How it works", "#howitworks"], ["Pricing", "#pricing"], ["Log in", `/${locale}/login`], ["Privacy", `/${locale}/privacy`], ["Terms", `/${locale}/terms`], ["Imprint", `/${locale}/imprint`]]
    : [["Как работи", "#howitworks"], ["Цени", "#pricing"], ["Вход", `/${locale}/login`], ["Поверителност", `/${locale}/privacy`], ["Условия", `/${locale}/terms`], ["Импресум", `/${locale}/imprint`]];

  return (
    <footer id="contact" style={{ background: C.navy, borderTop: `1px solid ${C.border}` }}>
      {/* Two-column footer */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 28px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }} className="footer-grid">

        {/* Left: brand + nav + legal */}
        <div>
          <div style={{ marginBottom: 28 }}><Logo size={20} /></div>
          <p style={{ fontSize: 15, color: C.textLight, lineHeight: 1.7, maxWidth: 360, margin: "0 0 32px", fontFamily: "'Outfit', sans-serif" }}>
            {en
              ? "AI search is already changing how customers find businesses. We help you be found."
              : "AI търсенето вече променя как клиентите намират бизнеси. Ние те помагаме да бъдеш намиран."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "10px 24px", marginBottom: 40 }}>
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 13, color: C.textDim, textDecoration: "none", fontFamily: "'Outfit', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = C.textDim)}
              >{label}</a>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", lineHeight: 1.7, fontFamily: "'Outfit', sans-serif" }}>
            © 2026 Business Solutions Consulting EOOD<br />
            trading as findable.app · VAT: BG200487371
          </div>
        </div>

        {/* Right: contact form */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.textDim, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>
              {en ? "Get in touch" : "Свържи се с нас"}
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: C.white, margin: "0 0 6px", fontFamily: "'Outfit', sans-serif" }}>
              {en ? "Have a question?" : "Имаш въпрос?"}
            </h3>
            <p style={{ fontSize: 14, color: C.textDim, fontFamily: "'Outfit', sans-serif" }}>
              {en ? "We respond within 24 hours." : "Отговаряме до 24 часа."}
            </p>
          </div>

          {sent ? (
            <div style={{ background: "rgba(62,207,181,0.08)", border: "1px solid rgba(62,207,181,0.2)", borderRadius: 14, padding: "28px", color: C.mint, fontSize: 15, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
              {en ? "Message sent! We'll be in touch soon." : "Съобщението е изпратено! Скоро ще се свържем."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={en ? "Your name" : "Твоето име"} style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.05)", color: C.white, fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" type="email" style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.05)", color: C.white, fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={en ? "Your message *" : "Твоето съобщение *"} rows={4} style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.05)", color: C.white, fontSize: 14, outline: "none", resize: "none" as const, fontFamily: "'Outfit', sans-serif" }} />
              {error && <div style={{ color: "#fca5a5", fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{error}</div>}
              <button onClick={handleSend} disabled={sending || !email || !message} style={{
                background: C.coral, color: C.white, padding: "14px", borderRadius: 10, border: "none",
                fontWeight: 700, fontSize: 15, cursor: sending || !email || !message ? "not-allowed" : "pointer",
                opacity: sending || !email || !message ? 0.5 : 1,
                fontFamily: "'Outfit', sans-serif", transition: "opacity 0.2s",
              }}>
                {sending ? (en ? "Sending…" : "Изпращам…") : (en ? "Send message" : "Изпрати съобщение")}
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${C.navy}; }

        input::placeholder  { color: rgba(255,255,255,0.3); }
        textarea::placeholder { color: rgba(255,255,255,0.3); }

        @media (max-width: 768px) {
          .desktop-nav     { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-grid       { grid-template-columns: 1fr !important; gap: 40px !important; padding-top: 100px !important; }
          .hero-h1         { font-size: 52px !important; }
          .grid-3          { grid-template-columns: 1fr !important; }
          .grid-4          { grid-template-columns: 1fr 1fr !important; }
          .why-grid        { grid-template-columns: 1fr !important; }
          .proof-grid      { grid-template-columns: 1fr 1fr !important; }
          .pricing-grid    { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; }
          .footer-grid     { grid-template-columns: 1fr !important; gap: 40px !important; }
          .scan-row        { flex-direction: column !important; }
          .strip-div       { display: none !important; }
        }
        @media (max-width: 480px) {
          .hero-h1  { font-size: 40px !important; }
          .grid-4   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <NavBar />
      <HeroScanSection />
      <SocialProofStrip />
      <WhyItMattersSection />
      <HowItWorksSection />
      <PricingSection />
      <FooterSection />
    </>
  );
}
