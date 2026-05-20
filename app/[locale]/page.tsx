'use client'
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const COLORS = {
  navy: "#1B2A4A", blue: "#2E6BAD", lightBlue: "#4A90D9",
  orange: "#F5A623", white: "#FFFFFF", offWhite: "#F8FAFD",
  lightGray: "#E8EDF4", textDark: "#1B2A4A", textMuted: "#5A6B84",
};

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };
  return (
    <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 3 }}>
      {['en', 'bg'].map(l => (
        <button key={l} onClick={() => switchLocale(l)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: locale === l ? "rgba(255,255,255,0.2)" : "transparent", color: locale === l ? COLORS.white : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, fontFamily: "'Outfit', sans-serif" }}>{l}</button>
      ))}
    </div>
  );
}

function SectionTitle({ tag, title, subtitle, light = false }: { tag?: string, title: string, subtitle?: string, light?: boolean }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      {tag && <div style={{ display: "inline-flex", padding: "6px 18px", borderRadius: 100, marginBottom: 16, background: light ? "rgba(245,166,35,0.12)" : "rgba(46,107,173,0.1)", border: `1px solid ${light ? "rgba(245,166,35,0.25)" : "rgba(46,107,173,0.15)"}` }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: light ? COLORS.orange : COLORS.blue }}>{tag}</span></div>}
      <h2 className="section-title" style={{ fontSize: 42, fontWeight: 800, color: light ? COLORS.white : COLORS.navy, letterSpacing: "-1px", margin: "0 0 16px", lineHeight: 1.2 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 18, color: light ? "rgba(255,255,255,0.65)" : COLORS.textMuted, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function NavBar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = locale === 'en'
    ? [["What we do","what"],["Why it matters","why"],["SMEs","sme"],["Why monthly","whymonthly"],["Pricing","pricing"]]
    : [["Какво правим","what"],["Защо е важно","why"],["МСП","sme"],["Защо всеки месец","whymonthly"],["Цени","pricing"]];
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menuOpen ? "rgba(27,42,74,0.97)" : "transparent", backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none", transition: "all 0.4s ease", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.orange}, #F7C948)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: COLORS.navy }}>G</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </div>
        <div className="desktop-nav" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {navLinks.map(([label, id]) => (<a key={id} href={`#${id}`} style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{label}</a>))}
          <LanguageSwitcher />
          <a href={`/${locale}/login`} style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.25)", padding: "8px 20px", borderRadius: 8 }}>{t('login')}</a>
          <a href="#scan" style={{ background: COLORS.orange, color: COLORS.navy, padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>{t('free_check')}</a>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <div style={{ width: 24, height: 2, background: COLORS.white, marginBottom: 5, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <div style={{ width: 24, height: 2, background: COLORS.white, marginBottom: 5, opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: COLORS.white, transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: "rgba(27,42,74,0.98)", padding: "16px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {navLinks.map(([label, id]) => (<a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 18, fontWeight: 500, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{label}</a>))}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 20 }}>
            <LanguageSwitcher />
            <a href={`/${locale}/login`} style={{ color: COLORS.white, textDecoration: "none", fontSize: 16, fontWeight: 600, padding: "14px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.25)", textAlign: "center" as const }}>{t('login')}</a>
            <a href="#scan" onClick={() => setMenuOpen(false)} style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px 24px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, textAlign: "center" as const }}>{t('free_check')}</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  return (
    <section style={{ minHeight: "100vh", background: `linear-gradient(165deg, ${COLORS.navy} 0%, #243B65 50%, ${COLORS.blue} 100%)`, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,107,173,0.2) 0%, transparent 70%)" }} />
      <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: COLORS.orange, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" as const }}>{t('tag')}</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: 56, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 24px" }}>{t('title')}</h1>
          <p style={{ fontSize: 19, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 500 }}>{t('subtitle')}</p>
          <a href="#scan" style={{ background: COLORS.orange, color: COLORS.navy, padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 24px rgba(245,166,35,0.35)" }}>{t('cta')}</a>
          <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
            {[["14", locale === 'en' ? "AI metrics" : "AI показателя"], ["2 min", locale === 'en' ? "analysis" : "за анализ"], ["100%", locale === 'en' ? "free" : "безплатно"]].map(([num, label]) => (
              <div key={label}><div style={{ fontSize: 28, fontWeight: 800, color: COLORS.orange }}>{num}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{label}</div></div>
            ))}
          </div>
        </div>
        <div className="hero-card" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(60px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32 }}>
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
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, position: "relative" }}>
              {[1,2,3,4,5].map(i => (<div key={i} style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", filter: "blur(6px)" }}><span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>{"██████████".slice(0, 4 + i * 2)}</span></div>))}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.orange, background: "rgba(27,42,74,0.8)", padding: "8px 18px", borderRadius: 8 }}>{locale === 'en' ? 'Details after sign up' : 'Детайли след регистрация'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScanSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [domain, setDomain] = useState("");
  const [noWebsite, setNoWebsite] = useState(false);
  const [googleMaps, setGoogleMaps] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [offerName, setOfferName] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);
  const [showWebsiteOffer, setShowWebsiteOffer] = useState(false);

  const handleScan = async () => {
    if (!noWebsite && !domain) return;
    setScanning(true); setResult(null); setError("");
    if (noWebsite) {
      try {
        const res = await fetch('/api/scan-social', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ googleMaps, facebook, instagram, businessDesc }) });
        const data = await res.json();
        if (data.error) setError(data.message || "Error."); else { setResult(data); setShowWebsiteOffer(true); }
      } catch { setError("Error. Try again."); }
    } else {
      try {
        const res = await fetch(`/api/scan?domain=${encodeURIComponent(domain)}`);
        const data = await res.json();
        if (data.error === 'rate_limit') setError(data.message); else if (data.error) setError("Could not scan domain."); else setResult(data);
      } catch { setError("Error. Try again."); }
    }
    setScanning(false);
  };

  const handleSendOffer = async () => {
    if (!offerEmail) return;
    setSendingOffer(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/website_requests`, { method: 'POST', headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: offerName, email: offerEmail, business_description: businessDesc, google_maps: googleMaps, facebook, instagram }) });
      setOfferSent(true);
    } catch { setOfferSent(true); }
    setSendingOffer(false);
  };

  return (
    <section id="scan" style={{ padding: "80px 24px", background: `linear-gradient(170deg, #F0F5FB 0%, ${COLORS.white} 100%)` }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle tag={locale === 'en' ? "Free Check" : "Безплатна проверка"} title={locale === 'en' ? "Check your AI visibility in 2 minutes" : "Провери AI видимостта си за 2 минути"} subtitle={locale === 'en' ? "Enter your domain and see how ready your business is for the AI era." : "Въведи домейна си и виж колко е подготвен бизнесът ти за AI ерата."} />
        <div style={{ background: COLORS.white, borderRadius: 20, padding: "32px 24px", boxShadow: "0 8px 40px rgba(27,42,74,0.08)", border: "1px solid rgba(27,42,74,0.06)" }}>
          {!noWebsite ? (
            <div className="scan-row" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input type="text" placeholder={t('placeholder')} value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && handleScan()} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, fontSize: 16, border: `2px solid ${COLORS.lightGray}`, outline: "none", minWidth: 0 }} />
              <button onClick={handleScan} disabled={scanning} style={{ background: scanning ? COLORS.textMuted : COLORS.orange, color: scanning ? COLORS.white : COLORS.navy, padding: "14px 24px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: scanning ? "wait" : "pointer", whiteSpace: "nowrap" as const, fontFamily: "'Outfit', sans-serif" }}>{scanning ? t('scanning') : locale === 'en' ? 'Analyze' : 'Анализирай'}</button>
            </div>
          ) : (
            <div style={{ marginBottom: 16, textAlign: "left" as const }}>
              {([[locale === 'en' ? "Describe your business" : "Опиши бизнеса си", businessDesc, setBusinessDesc, locale === 'en' ? "Italian pizzeria in Sofia" : "Примерно: Италианска пицария в София"], ["Google Maps", googleMaps, setGoogleMaps, "https://maps.google.com/..."], ["Facebook", facebook, setFacebook, "https://facebook.com/..."], ["Instagram", instagram, setInstagram, "https://instagram.com/..."]] as [string, string, (v: string) => void, string][]).map(([label, val, setter, ph]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy, display: "block", marginBottom: 6 }}>{label}</label>
                  <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
                </div>
              ))}
              <button onClick={handleScan} disabled={scanning} style={{ width: "100%", background: scanning ? COLORS.textMuted : COLORS.orange, color: scanning ? COLORS.white : COLORS.navy, padding: "14px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: scanning ? "wait" : "pointer", fontFamily: "'Outfit', sans-serif" }}>{scanning ? t('scanning') : locale === 'en' ? 'Analyze' : 'Анализирай'}</button>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: "center" }}>
            <input type="checkbox" id="noWebsite" checked={noWebsite} onChange={e => { setNoWebsite(e.target.checked); setResult(null); setError(""); setShowWebsiteOffer(false); }} style={{ width: 18, height: 18, cursor: "pointer", accentColor: COLORS.orange }} />
            <label htmlFor="noWebsite" style={{ fontSize: 14, color: COLORS.textMuted, cursor: "pointer" }}>{locale === 'en' ? "I don't have a website" : "Нямам уебсайт"}</label>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textMuted }}>{t('trust')}</p>
          {error && <div style={{ marginTop: 20, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "16px 20px", color: "#991b1b", fontSize: 14 }}>{error}</div>}
          {result && !scanning && (
            <div style={{ marginTop: 32 }}>
              <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
                <svg viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="90" cy="90" r="78" fill="none" stroke={COLORS.lightGray} strokeWidth="14" />
                  <circle cx="90" cy="90" r="78" fill="none" stroke={result.totalScore > 60 ? "#4CAF50" : result.totalScore > 35 ? COLORS.orange : "#E74C3C"} strokeWidth="14" strokeDasharray={`${(result.totalScore / 100) * 2 * Math.PI * 78} ${2 * Math.PI * 78}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.navy }}>{result.totalScore}<span style={{ fontSize: 22, color: COLORS.textMuted }}>%</span></div>
                </div>
              </div>
              {showWebsiteOffer && !offerSent && (
                <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 16, padding: 24, marginBottom: 20, textAlign: "left" as const }}>
                  <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>{locale === 'en' ? "AI can't find you without a website" : "AI системите не могат да те намерят без уебсайт"}</h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: "0 0 16px" }}>{locale === 'en' ? "Want a quote for a website?" : "Искаш оферта за уебсайт?"}</p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                    <input value={offerName} onChange={e => setOfferName(e.target.value)} placeholder={locale === 'en' ? "Your name" : "Твоето име"} style={{ padding: "12px 14px", borderRadius: 10, border: "none", fontSize: 14, outline: "none" }} />
                    <input value={offerEmail} onChange={e => setOfferEmail(e.target.value)} placeholder="Email *" style={{ padding: "12px 14px", borderRadius: 10, border: "none", fontSize: 14, outline: "none" }} />
                    <button onClick={handleSendOffer} disabled={sendingOffer || !offerEmail} style={{ background: COLORS.orange, color: COLORS.navy, padding: "14px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 15, cursor: sendingOffer || !offerEmail ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif" }}>{locale === 'en' ? "Get a website quote" : "Искам оферта за уебсайт"}</button>
                  </div>
                </div>
              )}
              {offerSent && <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid #4ade80", borderRadius: 12, padding: 20, marginBottom: 20, color: "#166534" }}>🎉 {locale === 'en' ? "We'll be in touch within 24 hours!" : "Ще се свържем с теб до 24 часа!"}</div>}
              <a href={`/${locale}/login`} style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, border: "none", padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>{locale === 'en' ? "Get the full report" : "Получи пълния доклад"}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const t = useTranslations('plans');
  const locale = useLocale();
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const priceIds = {
    monthly: { lite: process.env.NEXT_PUBLIC_STRIPE_LITE_MONTHLY || '', smart: process.env.NEXT_PUBLIC_STRIPE_SMART_MONTHLY || '', pro: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY || '' },
    yearly: { lite: process.env.NEXT_PUBLIC_STRIPE_LITE_YEARLY || '', smart: process.env.NEXT_PUBLIC_STRIPE_SMART_YEARLY || '', pro: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY || '' }
  };

  const handleCheckout = async (plan: string) => {
    if (!agreed) return;
    setLoading(plan);
    const priceId = priceIds[period][plan as keyof typeof priceIds.monthly];
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url; else alert('Checkout error. Try again.');
    } catch { alert('Checkout error. Try again.'); }
    setLoading(null);
  };

  const prices = { monthly: ["€29.90", "€59.90", "€79.90"], yearly: ["€9.90", "€39.90", "€59.90"] };
  const planKeys = ['lite', 'smart', 'pro'] as const;

  return (
    <section id="pricing" style={{ padding: "80px 24px", background: "linear-gradient(170deg, #1B2A4A 0%, #1E3558 100%)", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle light tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, marginBottom: 40 }}>
          {(["yearly", "monthly"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer", background: period === p ? COLORS.orange : "transparent", color: period === p ? COLORS.navy : "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>
              {p === "yearly" ? `${t('annual')} (${t('save')})` : t('monthly')}
            </button>
          ))}
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {planKeys.map((key, i) => {
            const planData = t.raw(key) as any;
            const recommended = key === 'smart';
            return (
              <div key={key} style={{ background: recommended ? COLORS.orange : "rgba(255,255,255,0.05)", border: `2px solid ${recommended ? COLORS.orange : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: 32, position: "relative", textAlign: "left" as const, display: "flex", flexDirection: "column" as const }}>
                {recommended && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: COLORS.navy, color: COLORS.orange, padding: "6px 20px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>{planData.popular}</div>}
                <div style={{ color: recommended ? COLORS.navy : COLORS.white, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{planData.name}</div>
                <div style={{ color: recommended ? COLORS.navy : COLORS.orange, fontSize: 44, fontWeight: 900, marginBottom: 4 }}>{prices[period][i]}<span style={{ fontSize: 16 }}>/mo</span></div>
                <div style={{ color: recommended ? COLORS.navy : "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 24 }}>{planData.domains}</div>
                {(planData.features as string[]).map((f: string) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: recommended ? COLORS.navy : COLORS.orange, fontWeight: 700 }}>✓</span>
                    <span style={{ color: recommended ? COLORS.navy : "rgba(255,255,255,0.85)", fontSize: 14 }}>{f}</span>
                  </div>
                ))}
                <div style={{ marginTop: "auto", paddingTop: 24 }}>
                  <button onClick={() => handleCheckout(key)} disabled={loading === key || !agreed} style={{ width: "100%", background: recommended ? COLORS.navy : COLORS.orange, color: recommended ? COLORS.white : COLORS.navy, padding: "14px", borderRadius: 12, border: "none", fontWeight: 700, cursor: !agreed || loading === key ? "not-allowed" : "pointer", fontSize: 15, opacity: !agreed || loading === key ? 0.5 : 1, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>
                    {loading === key ? "Loading..." : `${t('cta_start')} ${planData.name}`}
                  </button>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <input type="checkbox" id={`agree-${key}`} checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 13, height: 13, marginTop: 2, cursor: "pointer", accentColor: recommended ? COLORS.navy : COLORS.orange, flexShrink: 0 }} />
                    <label htmlFor={`agree-${key}`} style={{ fontSize: 11, color: recommended ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, textAlign: "left" as const, cursor: "pointer" }}>
                      {t('agree')}{" "}<a href={`/${locale}/terms`} target="_blank" style={{ color: recommended ? COLORS.navy : COLORS.orange, textDecoration: "underline" }}>{t('terms')}</a>{" & "}<a href={`/${locale}/privacy`} target="_blank" style={{ color: recommended ? COLORS.navy : COLORS.orange, textDecoration: "underline" }}>{t('privacy')}</a>{t('agree_suffix')}
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

export default function Home() {
  const locale = useLocale();
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
         .connector-line { display: none !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 32px !important; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <NavBar />
      <HeroSection />

      <section id="what" style={{ padding: "80px 24px", background: COLORS.offWhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle tag={locale === 'en' ? "What we do" : "Какво правим"} title={locale === 'en' ? "GEO.app improves your online discoverability" : "GEO.app подобрява онлайн откриваемостта ви"} subtitle={locale === 'en' ? "We restructure your digital presence so AI systems like ChatGPT and Gemini can easily understand it." : "Преработваме дигиталното ви присъствие, така че да бъде лесно разбираемо за AI системи като ChatGPT и Gemini."} />
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {(locale === 'en' ? [["🔍","Analyze AI visibility","We scan your site across 14 key metrics to determine how easily AI systems can find and recommend you."],["📊","Personalized report","You receive a report with a specific improvement step — clear, actionable, tailored to your business."],["🔄","Monthly tracking","Every month we check your progress and give you the next step. Gradual, without overwhelm."],["🚀","From SEO to AEO","We take you beyond classic SEO — into the era of Answer Engine Optimization."]] : [["🔍","Анализираме AI видимостта","Сканираме сайта ви по 14 ключови показателя, за да определим колко лесно AI системите могат да ви открият."],["📊","Персонализиран отчет","Получавате доклад с конкретна стъпка за подобрение — ясна, приложима, адаптирана към вашия бизнес."],["🔄","Месечно проследяване","Всеки месец проверяваме прогреса ви и ви даваме следващата стъпка. Постепенно, без претоварване."],["🚀","От SEO към AEO","Извеждаме ви отвъд класическото SEO — в ерата на Answer Engine Optimization."]]).map(([icon, title, desc]) => (
              <div key={title} style={{ background: COLORS.white, borderRadius: 16, padding: 28, border: "1px solid rgba(27,42,74,0.06)" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, rgba(245,166,35,0.12), rgba(46,107,173,0.08))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: "0 0 10px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" style={{ padding: "80px 24px", background: `linear-gradient(170deg, ${COLORS.navy} 0%, #1E3558 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle light tag={locale === 'en' ? "Why it matters" : "Защо е важно"} title={locale === 'en' ? "Online search has changed forever" : "Онлайн търсенето се промени завинаги"} subtitle={locale === 'en' ? "AI assistants now give answers, not just results. If your business isn't AI-optimized — you simply don't exist for millions of users." : "AI асистентите вече дават отговори, не просто резултати. Ако бизнесът ви не е оптимизиран за AI — просто не съществувате за милиони потребители."} />
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
              {([["9B", locale === 'en' ? "AI interactions in 2025" : "AI взаимодействия през 2025г.", COLORS.orange],["50%", locale === 'en' ? "AI search market share today" : "пазарен дял на AI търсачките днес", COLORS.lightBlue],["60%", locale === 'en' ? "of searches via AI by 2028" : "на търсенията ще са през AI до 2028г.", COLORS.orange],["90%", locale === 'en' ? "of SMEs not ready for AI era" : "от МСП не са готови за AI ерата", "#E74C3C"]] as [string,string,string][]).map(([num, label, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color, minWidth: 80 }}>{num}</div>
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, margin: "0 0 20px" }}>{locale === 'en' ? "Google vs AI: how people search today" : "Google vs AI: как се търси днес"}</h3>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 8, textTransform: "uppercase" as const }}>Google</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{locale === 'en' ? '"best coffee Sofia" → 10 blue links. User decides which to click.' : '"best coffee Sofia" → 10 сини линка. Потребителят сам решава.'}</div>
                </div>
                <div style={{ textAlign: "center", fontSize: 24 }}>↓</div>
                <div style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.12), rgba(245,166,35,0.04))", borderRadius: 12, padding: 20, border: "1px solid rgba(245,166,35,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.orange, marginBottom: 8, textTransform: "uppercase" as const }}>AI</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{locale === 'en' ? '"best coffee in Sofia?" → Specific recommendation. Either mentions you — or not. No middle ground.' : '"best coffee in Sofia?" → Конкретна препоръка. Или те споменава — или не. Няма среден вариант.'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sme" style={{ padding: "80px 24px", background: COLORS.offWhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle tag={locale === 'en' ? "The Problem" : "Проблемът"} title={locale === 'en' ? "90% of SMEs are not prepared" : "90% от МСП не са подготвени"} subtitle={locale === 'en' ? "Most small businesses are invisible to AI — their information is unstructured and misdirected." : "Повечето малки и средни предприятия са невидими за AI — информацията им е неструктурирана и ненасочена."} />
          <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: COLORS.white, margin: "0 0 12px" }}>{locale === 'en' ? "You can be the exception." : "Ти можеш да бъдеш изключението."}</h3>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 28px" }}>{locale === 'en' ? "While your competitors don't know about GEO — you're already optimizing." : "Докато конкурентите ти не знаят за GEO — ти вече оптимизираш."}</p>
            <a href="#scan" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, padding: "14px 36px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>{locale === 'en' ? "Start for free" : "Започни безплатно"}</a>
          </div>
        </div>
      </section>
{/* HOW IT WORKS */}
      <section id="howitworks" style={{ padding: "80px 24px", background: COLORS.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle
            tag={locale === 'en' ? "How it works" : "Как работи"}
            title={locale === 'en' ? "From invisible to AI-recommended in 3 steps" : "От невидим до препоръчан от AI в 3 стъпки"}
            subtitle={locale === 'en' ? "No technical knowledge needed. No agency required. Just results." : "Без технически познания. Без агенция. Само резултати."}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }} className="grid-3">
            <div className="connector-line" style={{ position: "absolute", top: 52, left: "16.5%", right: "16.5%", height: 2, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.blue})`, zIndex: 0 }} />

            {(locale === 'en' ? [
              {
                step: "01", icon: "🔍", color: COLORS.orange,
                title: "Get your free AI score",
                desc: "Enter your domain and we instantly scan 14 AI visibility metrics. See exactly where you stand — for free, in under 2 minutes.",
                tag: "Free · No registration",
                mock: (
                  <div style={{ background: "linear-gradient(135deg, #1B2A4A, #2E6BAD)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Scanning...</div>
                    {[92, 67, 45, 23, 78].map((w, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: w > 70 ? "#22c55e" : w > 50 ? COLORS.orange : "#ef4444", flexShrink: 0 }} />
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{ width: `${w}%`, height: "100%", borderRadius: 3, background: w > 70 ? "#22c55e" : w > 50 ? COLORS.orange : "#ef4444" }} />
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", width: 28, textAlign: "right" as const }}>{w}%</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: COLORS.orange }}>AI Score: 42% — Needs work</div>
                  </div>
                )
              },
              {
                step: "02", icon: "📋", color: COLORS.blue,
                title: "See exactly what's missing",
                desc: "Register for free and unlock your full report. We show you precisely which optimizations are keeping you invisible to AI.",
                tag: "Instant · Clear",
                mock: (
                  <div style={{ background: "linear-gradient(135deg, #1B2A4A, #2E6BAD)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: COLORS.orange, fontWeight: 700, marginBottom: 10 }}>YOUR ACTION PLAN</div>
                    {["Improve AI discoverability", "Strengthen content signals", "Boost authority markers"].map((item, i) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: COLORS.orange, flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{item}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>+ 3 more improvements unlocked</div>
                  </div>
                )
              },
              {
                step: "03", icon: "🚀", color: "#22c55e",
                title: "Upload & boost your visibility",
                desc: "Get ready-to-use files with step-by-step instructions tailored to your platform. Upload in under 5 minutes. No agency. No code. No hassle.",
                tag: "From €9.90/mo · Any platform",
                mock: (
                  <div style={{ background: "linear-gradient(135deg, #1B2A4A, #2E6BAD)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginBottom: 10 }}>FILES READY TO UPLOAD</div>
                    {["llms.txt", "robots.txt", "schema.json", "faq-markup.html"].map((file) => (
                      <div key={file} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                        <span style={{ fontSize: 14 }}>📄</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{file}</span>
                        <span style={{ marginLeft: "auto", fontSize: 9, color: "#22c55e", fontWeight: 700, background: "rgba(34,197,94,0.15)", padding: "2px 6px", borderRadius: 4 }}>READY</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(245,166,35,0.15)", borderRadius: 8, fontSize: 10, color: COLORS.orange }}>
                      📋 WordPress instructions included
                    </div>
                  </div>
                )
              }
            ] : [
              {
                step: "01", icon: "🔍", color: COLORS.orange,
                title: "Вземи безплатния си AI скор",
                desc: "Въведи домейна си и ние веднага сканираме 14 показателя за AI видимост. Виж точно къде стоиш — безплатно, за под 2 минути.",
                tag: "Безплатно · Без регистрация",
                mock: (
                  <div style={{ background: "linear-gradient(135deg, #1B2A4A, #2E6BAD)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Сканирам...</div>
                    {[92, 67, 45, 23, 78].map((w, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: w > 70 ? "#22c55e" : w > 50 ? COLORS.orange : "#ef4444", flexShrink: 0 }} />
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{ width: `${w}%`, height: "100%", borderRadius: 3, background: w > 70 ? "#22c55e" : w > 50 ? COLORS.orange : "#ef4444" }} />
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", width: 28, textAlign: "right" as const }}>{w}%</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: COLORS.orange }}>AI Скор: 42% — Нужни подобрения</div>
                  </div>
                )
              },
              {
                step: "02", icon: "📋", color: COLORS.blue,
                title: "Виж точно какво липсва",
                desc: "Регистрирай се безплатно и отключи пълния доклад. Показваме ти точно кои оптимизации те правят невидим за AI.",
                tag: "Незабавно · Ясно",
                mock: (
                  <div style={{ background: "linear-gradient(135deg, #1B2A4A, #2E6BAD)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: COLORS.orange, fontWeight: 700, marginBottom: 10 }}>ТВОЯТ ПЛАН ЗА ДЕЙСТВИЕ</div>
                    {["Подобри AI откриваемостта", "Засили контент сигналите", "Укрепи авторитетните маркери"].map((item, i) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: COLORS.orange, flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{item}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>+ 3 допълнителни подобрения отключени</div>
                  </div>
                )
              },
              {
                step: "03", icon: "🚀", color: "#22c55e",
                title: "Качи и подобри видимостта си",
                desc: "Получи готови за качване файлове с инструкции стъпка по стъпка за твоята платформа. Качи за под 5 минути. Без агенция. Без код.",
                tag: "От €9.90/мес · Всяка платформа",
                mock: (
                  <div style={{ background: "linear-gradient(135deg, #1B2A4A, #2E6BAD)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginBottom: 10 }}>ФАЙЛОВЕТЕ СА ГОТОВИ</div>
                    {["llms.txt", "robots.txt", "schema.json", "faq-markup.html"].map((file) => (
                      <div key={file} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                        <span style={{ fontSize: 14 }}>📄</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{file}</span>
                        <span style={{ marginLeft: "auto", fontSize: 9, color: "#22c55e", fontWeight: 700, background: "rgba(34,197,94,0.15)", padding: "2px 6px", borderRadius: 4 }}>ГОТОВ</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(245,166,35,0.15)", borderRadius: 8, fontSize: 10, color: COLORS.orange }}>
                      📋 Включени инструкции за WordPress
                    </div>
                  </div>
                )
              }
            ]).map((s) => (
              <div key={s.step} style={{ position: "relative", zIndex: 1, padding: "0 16px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 24px", boxShadow: `0 0 0 6px white, 0 0 0 8px ${s.color}33`, position: "relative", zIndex: 2 }}>
                  {s.icon}
                </div>
                <div style={{ background: COLORS.white, borderRadius: 20, padding: 24, border: "1px solid rgba(27,42,74,0.08)", boxShadow: "0 4px 24px rgba(27,42,74,0.06)" }}>
                  <div style={{ display: "inline-block", background: `${s.color}18`, border: `1px solid ${s.color}33`, borderRadius: 20, padding: "3px 10px", marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: 1 }}>STEP {s.step}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.navy, margin: "0 0 10px", lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, margin: "0 0 12px" }}>{s.desc}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.offWhite, borderRadius: 20, padding: "4px 12px" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted }}>{s.tag}</span>
                  </div>
                  {s.mock}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 20 }}>
              {locale === 'en' ? "Ready to become visible to AI?" : "Готов ли си да станеш видим за AI?"}
            </p>
            <a href="#scan" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, padding: "16px 40px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16, boxShadow: "0 4px 24px rgba(245,166,35,0.3)" }}>
              {locale === 'en' ? "Get your free AI score →" : "Вземи безплатния си AI скор →"}
            </a>
          </div>
        </div>
      </section>
      
      <ScanSection />

      <section id="whymonthly" style={{ padding: "80px 24px", background: COLORS.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle tag={locale === 'en' ? "Why monthly" : "Защо всеки месец"} title={locale === 'en' ? "GEO optimization is not a one-time task" : "GEO оптимизацията не е еднократна задача"} subtitle={locale === 'en' ? "AI algorithms change constantly — what works today may not work in 3 months." : "AI алгоритмите се променят постоянно — това което работи днес, може да не работи след 3 месеца."} />
          <div className="grid-2" style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: "40px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: COLORS.white, margin: "0 0 16px" }}>{locale === 'en' ? "Once is not enough." : "Не е достатъчно да го направиш веднъж."}</h3>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 28px" }}>{locale === 'en' ? "SEO took years to become standard. GEO is developing in front of our eyes — act now." : "SEO отне години да стане стандарт. GEO се развива пред очите ни — действай сега."}</p>
              <a href="#pricing" style={{ display: "inline-block", background: COLORS.orange, color: COLORS.navy, padding: "14px 32px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>{locale === 'en' ? "Start now" : "Започни сега"}</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              {(locale === 'en' ? [["Month 1","Basic optimization — sitemap, robots.txt, schema"],["Month 3","AI visibility improves, first results"],["Month 6","Stable presence in AI results"],["Month 12","Significant advantage over competitors"]] : [["Месец 1","Базова оптимизация — sitemap, robots.txt, schema"],["Месец 3","AI видимостта се подобрява, първи резултати"],["Месец 6","Стабилно присъствие в AI резултати"],["Месец 12","Значително предимство пред конкурентите"]]).map(([month, desc]) => (
                <div key={month} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ background: COLORS.orange, color: COLORS.navy, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{month}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, paddingTop: 4 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      <footer style={{ background: "#0F1A2E", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, marginBottom: 12 }}>GEO<span style={{ color: COLORS.orange }}>.app</span></div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          © 2026 GEO App &nbsp;·&nbsp;
          <a href={`/${locale}/privacy`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy Policy</a>
          &nbsp;·&nbsp;
          <a href={`/${locale}/terms`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms of Service</a>
          &nbsp;·&nbsp;
          <a href={`/${locale}/imprint`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Imprint</a>
        </div>
      </footer>
    </>
  );
}
