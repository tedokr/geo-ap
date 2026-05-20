'use client'
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const C = {
  teal: "#0B4A56", tealDark: "#083542", tealLight: "#0D5A68",
  coral: "#FF5A47", coralDark: "#E04535",
  mint: "#3ECFB5", mintLight: "rgba(62,207,181,0.15)",
  white: "#FFFFFF", offWhite: "#F0F9FA", lightGray: "#D8EDEF",
  textMuted: "#4A7A82", textDark: "#0B4A56",
};

function Logo({ size = 22 }: { size?: number }) {
  const s = size;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={s * 1.6} height={s * 1.6} viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5" ry="5" fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: s, fontWeight: 800, color: C.white }}>
        findable<span style={{ color: C.coral }}>.app</span>
      </span>
    </span>
  );
}

function LogoDark({ size = 22 }: { size?: number }) {
  const s = size;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={s * 1.6} height={s * 1.6} viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="17" rx="11" ry="11" fill={C.coral} />
        <ellipse cx="22" cy="17" rx="5" ry="5" fill="white" />
        <polygon points="22,40 16,27 28,27" fill={C.coral} />
      </svg>
      <span style={{ fontSize: s, fontWeight: 800, color: C.teal }}>
        findable<span style={{ color: C.coral }}>.app</span>
      </span>
    </span>
  );
}

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
        <button key={l} onClick={() => switchLocale(l)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: locale === l ? "rgba(255,255,255,0.2)" : "transparent", color: locale === l ? C.white : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, fontFamily: "'Outfit', sans-serif" }}>{l}</button>
      ))}
    </div>
  );
}

function SectionTitle({ tag, title, subtitle, light = false }: { tag?: string, title: string, subtitle?: string, light?: boolean }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      {tag && <div style={{ display: "inline-flex", padding: "6px 18px", borderRadius: 100, marginBottom: 16, background: light ? "rgba(255,90,71,0.15)" : "rgba(11,74,86,0.08)", border: `1px solid ${light ? "rgba(255,90,71,0.3)" : "rgba(11,74,86,0.15)"}` }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: light ? C.coral : C.teal }}>{tag}</span></div>}
      <h2 className="section-title" style={{ fontSize: 42, fontWeight: 800, color: light ? C.white : C.teal, letterSpacing: "-1px", margin: "0 0 16px", lineHeight: 1.2 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 18, color: light ? "rgba(255,255,255,0.65)" : C.textMuted, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function NavBar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = locale === 'en'
    ? [["What we do","what"],["Why it matters","why"],["How it works","howitworks"],["Pricing","pricing"]]
    : [["Какво правим","what"],["Защо е важно","why"],["Как работи","howitworks"],["Цени","pricing"]];
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menuOpen ? "rgba(11,74,86,0.97)" : "transparent", backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none", transition: "all 0.4s ease", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo size={20} />
        <div className="desktop-nav" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {navLinks.map(([label, id]) => (<a key={id} href={`#${id}`} style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{label}</a>))}
          <LanguageSwitcher />
          <a href={`/${locale}/login`} style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.25)", padding: "8px 20px", borderRadius: 8 }}>{t('login')}</a>
          <a href="#scan" style={{ background: C.coral, color: C.white, padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>{t('free_check')}</a>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <div style={{ width: 24, height: 2, background: C.white, marginBottom: 5, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <div style={{ width: 24, height: 2, background: C.white, marginBottom: 5, opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: C.white, transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: "rgba(11,74,86,0.98)", padding: "16px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {navLinks.map(([label, id]) => (<a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 18, fontWeight: 500, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{label}</a>))}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 20 }}>
            <LanguageSwitcher />
            <a href={`/${locale}/login`} style={{ color: C.white, textDecoration: "none", fontSize: 16, fontWeight: 600, padding: "14px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.25)", textAlign: "center" as const }}>{t('login')}</a>
            <a href="#scan" onClick={() => setMenuOpen(false)} style={{ background: C.coral, color: C.white, padding: "14px 24px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, textAlign: "center" as const }}>{t('free_check')}</a>
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
    <section style={{ minHeight: "100vh", background: C.teal, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "rgba(62,207,181,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,90,71,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: "10%", width: 200, height: 200, borderRadius: "50%", background: "rgba(62,207,181,0.05)", pointerEvents: "none" }} />

      <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,90,71,0.15)", border: "1px solid rgba(255,90,71,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: C.coral, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" as const }}>{t('tag')}</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: 56, fontWeight: 800, color: C.white, lineHeight: 1.1, letterSpacing: "-1.5px", margin: "0 0 24px" }}>{t('title')}</h1>
          <p style={{ fontSize: 19, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 500 }}>{t('subtitle')}</p>
          <a href="#scan" style={{ background: C.coral, color: C.white, padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>{t('cta')} →</a>
          <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
            {[["14", locale === 'en' ? "AI criteria" : "AI критерия"], ["2 min", locale === 'en' ? "analysis" : "за анализ"], ["100%", locale === 'en' ? "free" : "безплатно"]].map(([num, label]) => (
              <div key={label}><div style={{ fontSize: 28, fontWeight: 800, color: C.coral }}>{num}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{label}</div></div>
            ))}
          </div>
        </div>

        {/* Hero card — new design: checklist style */}
        <div className="hero-card" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(60px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.coral }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>findable.app — AI Visibility Report</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>yourbusiness.com</div>

            {/* Score bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 12 }}>
              <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                <svg viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                  <circle cx="26" cy="26" r="22" fill="none" stroke={C.coral} strokeWidth="5" strokeDasharray={`${0.38 * 2 * Math.PI * 22} ${2 * Math.PI * 22}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: C.white }}>38%</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>AI Score: 38%</div>
                <div style={{ fontSize: 12, color: C.coral }}>Needs improvement</div>
              </div>
            </div>

            {/* Criteria list */}
            {[
              { label: "llms.txt", status: "missing" },
              { label: "Schema.org markup", status: "partial" },
              { label: "FAQ section", status: "missing" },
              { label: "robots.txt", status: "ok" },
              { label: "SSL & canonical", status: "ok" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{item.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: item.status === 'ok' ? "rgba(62,207,181,0.15)" : item.status === 'partial' ? "rgba(255,180,0,0.15)" : "rgba(255,90,71,0.15)", color: item.status === 'ok' ? C.mint : item.status === 'partial' ? "#F5A623" : C.coral }}>
                  {item.status === 'ok' ? '✓ OK' : item.status === 'partial' ? '~ Partial' : '✗ Missing'}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,90,71,0.12)", borderRadius: 10, border: "1px solid rgba(255,90,71,0.2)" }}>
              <span style={{ fontSize: 12, color: C.coral, fontWeight: 600 }}>{locale === 'en' ? 'Sign up to see full report & fixes' : 'Регистрирай се за пълен доклад'}</span>
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
    <section id="scan" style={{ padding: "80px 24px", background: C.offWhite }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle tag={locale === 'en' ? "Free Check" : "Безплатна проверка"} title={locale === 'en' ? "Check your AI visibility in 2 minutes" : "Провери AI видимостта си за 2 минути"} subtitle={locale === 'en' ? "Enter your domain and see how ready your business is for the AI era." : "Въведи домейна си и виж колко е подготвен бизнесът ти за AI ерата."} />
        <div style={{ background: C.white, borderRadius: 20, padding: "32px 24px", border: "1px solid rgba(11,74,86,0.08)" }}>
          {!noWebsite ? (
            <div className="scan-row" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input type="text" placeholder={t('placeholder')} value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && handleScan()} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, fontSize: 16, border: `2px solid ${C.lightGray}`, outline: "none", minWidth: 0 }} />
              <button onClick={handleScan} disabled={scanning} style={{ background: scanning ? C.textMuted : C.coral, color: C.white, padding: "14px 24px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: scanning ? "wait" : "pointer", whiteSpace: "nowrap" as const, fontFamily: "'Outfit', sans-serif" }}>{scanning ? t('scanning') : locale === 'en' ? 'Analyze' : 'Анализирай'}</button>
            </div>
          ) : (
            <div style={{ marginBottom: 16, textAlign: "left" as const }}>
              {([[locale === 'en' ? "Describe your business" : "Опиши бизнеса си", businessDesc, setBusinessDesc, locale === 'en' ? "Italian pizzeria in Sofia" : "Примерно: Италианска пицария в София"], ["Google Maps", googleMaps, setGoogleMaps, "https://maps.google.com/..."], ["Facebook", facebook, setFacebook, "https://facebook.com/..."], ["Instagram", instagram, setInstagram, "https://instagram.com/..."]] as [string, string, (v: string) => void, string][]).map(([label, val, setter, ph]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 6 }}>{label}</label>
                  <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${C.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
                </div>
              ))}
              <button onClick={handleScan} disabled={scanning} style={{ width: "100%", background: scanning ? C.textMuted : C.coral, color: C.white, padding: "14px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: scanning ? "wait" : "pointer", fontFamily: "'Outfit', sans-serif" }}>{scanning ? t('scanning') : locale === 'en' ? 'Analyze' : 'Анализирай'}</button>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: "center" }}>
            <input type="checkbox" id="noWebsite" checked={noWebsite} onChange={e => { setNoWebsite(e.target.checked); setResult(null); setError(""); setShowWebsiteOffer(false); }} style={{ width: 18, height: 18, cursor: "pointer", accentColor: C.coral }} />
            <label htmlFor="noWebsite" style={{ fontSize: 14, color: C.textMuted, cursor: "pointer" }}>{locale === 'en' ? "I don't have a website" : "Нямам уебсайт"}</label>
          </div>
          <p style={{ fontSize: 13, color: C.textMuted }}>{t('trust')}</p>
          {error && <div style={{ marginTop: 20, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "16px 20px", color: "#991b1b", fontSize: 14 }}>{error}</div>}
          {result && !scanning && (
            <div style={{ marginTop: 32 }}>
              <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
                <svg viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="90" cy="90" r="78" fill="none" stroke={C.lightGray} strokeWidth="14" />
                  <circle cx="90" cy="90" r="78" fill="none" stroke={result.totalScore > 60 ? "#22c55e" : result.totalScore > 35 ? C.coral : "#ef4444"} strokeWidth="14" strokeDasharray={`${(result.totalScore / 100) * 2 * Math.PI * 78} ${2 * Math.PI * 78}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <div style={{ fontSize: 44, fontWeight: 800, color: C.teal }}>{result.totalScore}<span style={{ fontSize: 22, color: C.textMuted }}>%</span></div>
                </div>
              </div>
              {showWebsiteOffer && !offerSent && (
                <div style={{ background: C.teal, borderRadius: 16, padding: 24, marginBottom: 20, textAlign: "left" as const }}>
                  <h3 style={{ color: C.white, fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>{locale === 'en' ? "AI can't find you without a website" : "AI системите не могат да те намерят без уебсайт"}</h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: "0 0 16px" }}>{locale === 'en' ? "Want a quote for a website?" : "Искаш оферта за уебсайт?"}</p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                    <input value={offerName} onChange={e => setOfferName(e.target.value)} placeholder={locale === 'en' ? "Your name" : "Твоето име"} style={{ padding: "12px 14px", borderRadius: 10, border: "none", fontSize: 14, outline: "none" }} />
                    <input value={offerEmail} onChange={e => setOfferEmail(e.target.value)} placeholder="Email *" style={{ padding: "12px 14px", borderRadius: 10, border: "none", fontSize: 14, outline: "none" }} />
                    <button onClick={handleSendOffer} disabled={sendingOffer || !offerEmail} style={{ background: C.coral, color: C.white, padding: "14px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 15, cursor: sendingOffer || !offerEmail ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif" }}>{locale === 'en' ? "Get a website quote" : "Искам оферта за уебсайт"}</button>
                  </div>
                </div>
              )}
              {offerSent && <div style={{ background: "rgba(62,207,181,0.1)", border: "1px solid #3ECFB5", borderRadius: 12, padding: 20, marginBottom: 20, color: C.teal }}>🎉 {locale === 'en' ? "We'll be in touch within 24 hours!" : "Ще се свържем с теб до 24 часа!"}</div>}
              <a href={`/${locale}/login`} style={{ display: "inline-block", background: C.coral, color: C.white, border: "none", padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>{locale === 'en' ? "Get the full report" : "Получи пълния доклад"}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email || !message) return;
    setSending(true); setError("");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, created_at: new Date().toISOString() })
      });
      setSent(true);
    } catch { setError(locale === 'en' ? "Error sending message. Please try again." : "Грешка при изпращане. Опитай отново."); }
    setSending(false);
  };

  return (
    <section id="contact" style={{ padding: "80px 24px", background: C.teal }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle light
          tag={locale === 'en' ? "Contact" : "Контакт"}
          title={locale === 'en' ? "Have a question?" : "Имаш въпрос?"}
          subtitle={locale === 'en' ? "We respond within 24 hours." : "Отговаряме до 24 часа."}
        />
        {sent ? (
          <div style={{ background: "rgba(62,207,181,0.15)", border: "1px solid rgba(62,207,181,0.4)", borderRadius: 16, padding: "32px", color: C.white, fontSize: 16, fontWeight: 600 }}>
            {locale === 'en' ? "Message sent! We'll be in touch soon." : "Съобщението е изпратено! Скоро ще се свържем."}
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "32px 28px" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={locale === 'en' ? "Your name" : "Твоето име"} style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: C.white, fontSize: 14, outline: "none" }} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" type="email" style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: C.white, fontSize: 14, outline: "none" }} />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={locale === 'en' ? "Your message *" : "Твоето съобщение *"} rows={4} style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: C.white, fontSize: 14, outline: "none", resize: "none" as const }} />
              {error && <div style={{ color: C.coral, fontSize: 13 }}>{error}</div>}
              <button onClick={handleSend} disabled={sending || !email || !message} style={{ background: C.coral, color: C.white, padding: "14px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 15, cursor: sending || !email || !message ? "not-allowed" : "pointer", opacity: sending || !email || !message ? 0.6 : 1, fontFamily: "'Outfit', sans-serif" }}>
                {sending ? (locale === 'en' ? "Sending..." : "Изпращам...") : (locale === 'en' ? "Send message" : "Изпрати съобщение")}
              </button>
            </div>
          </div>
        )}
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

  const prices = { monthly: ["€14.90", "€59.90", "€89.90"], yearly: ["€9.90", "€39.90", "€59.90"] };
  const planKeys = ['lite', 'smart', 'pro'] as const;

  return (
    <section id="pricing" style={{ padding: "80px 24px", background: C.tealDark, position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <SectionTitle light tag={t('tag')} title={t('title')} subtitle={t('subtitle')} />
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 4, marginBottom: 40 }}>
          {(["yearly", "monthly"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: "10px 24px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer", background: period === p ? C.coral : "transparent", color: period === p ? C.white : "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>
              {p === "yearly" ? `${t('annual')} (${t('save')})` : t('monthly')}
            </button>
          ))}
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {planKeys.map((key, i) => {
            const planData = t.raw(key) as any;
            const recommended = key === 'smart';
            return (
              <div key={key} style={{ background: recommended ? C.coral : "rgba(255,255,255,0.05)", border: `2px solid ${recommended ? C.coral : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: 32, position: "relative", textAlign: "left" as const, display: "flex", flexDirection: "column" as const }}>
                {recommended && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.teal, color: C.coral, padding: "6px 20px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const }}>{planData.popular}</div>}
                <div style={{ color: C.white, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{planData.name}</div>
                <div style={{ color: recommended ? C.white : C.mint, fontSize: 44, fontWeight: 900, marginBottom: 4 }}>{prices[period][i]}<span style={{ fontSize: 16 }}>/mo</span></div>
                {period === 'monthly' && <div style={{ color: recommended ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 4 }}>{locale === 'en' ? `Save with yearly: ${prices.yearly[i]}/mo` : `Спести с годишен: ${prices.yearly[i]}/мес`}</div>}
                <div style={{ color: recommended ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 24 }}>{planData.domains}</div>
                {(planData.features as string[]).map((f: string) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: recommended ? C.white : C.mint, fontWeight: 700 }}>✓</span>
                    <span style={{ color: recommended ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.85)", fontSize: 14 }}>{f}</span>
                  </div>
                ))}
                <div style={{ marginTop: "auto", paddingTop: 24 }}>
                  <button onClick={() => handleCheckout(key)} disabled={loading === key || !agreed} style={{ width: "100%", background: recommended ? C.teal : C.coral, color: C.white, padding: "14px", borderRadius: 12, border: "none", fontWeight: 700, cursor: !agreed || loading === key ? "not-allowed" : "pointer", fontSize: 15, opacity: !agreed || loading === key ? 0.5 : 1, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>
                    {loading === key ? "Loading..." : `${t('cta_start')} ${planData.name}`}
                  </button>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <input type="checkbox" id={`agree-${key}`} checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 13, height: 13, marginTop: 2, cursor: "pointer", accentColor: C.mint, flexShrink: 0 }} />
                    <label htmlFor={`agree-${key}`} style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, textAlign: "left" as const, cursor: "pointer" }}>
                      {t('agree')}{" "}<a href={`/${locale}/terms`} target="_blank" style={{ color: C.mint, textDecoration: "underline" }}>{t('terms')}</a>{" & "}<a href={`/${locale}/privacy`} target="_blank" style={{ color: C.mint, textDecoration: "underline" }}>{t('privacy')}</a>{t('agree_suffix')}
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

function HowItWorksSection() {
  const locale = useLocale();

  const enSteps = [
    {
      step: "01", icon: "🔍", color: C.coral,
      title: "Get your free AI score",
      desc: "Enter your domain and we instantly scan 14 AI visibility metrics. See exactly where you stand — for free, in under 2 minutes.",
      tag: "Free · No registration",
      mock: (
        <div style={{ background: "linear-gradient(135deg, #0B4A56, #083542)", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Scanning...</div>
          {[92, 67, 45, 23, 78].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: w > 70 ? "#3ECFB5" : w > 50 ? C.coral : "#ef4444", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${w}%`, height: "100%", borderRadius: 3, background: w > 70 ? "#3ECFB5" : w > 50 ? C.coral : "#ef4444" }} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", width: 28, textAlign: "right" as const }}>{w}%</div>
            </div>
          ))}
          <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: C.coral }}>AI Score: 42% - Needs work</div>
        </div>
      )
    },
    {
      step: "02", icon: "📋", color: C.mint,
      title: "See exactly what's missing",
      desc: "Register for free and unlock your full report. We show you precisely which optimizations are keeping you invisible to AI.",
      tag: "From €9.90/mo · No limits",
      mock: (
        <div style={{ background: "linear-gradient(135deg, #0B4A56, #083542)", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: C.coral, fontWeight: 700, marginBottom: 10 }}>YOUR ACTION PLAN</div>
          {["Improve AI discoverability", "Strengthen content signals", "Boost authority markers"].map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,90,71,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.coral, flexShrink: 0 }}>{i + 1}</div>
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
      tag: "From €39.90/mo · Any platform",
      mock: (
        <div style={{ background: "linear-gradient(135deg, #0B4A56, #083542)", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginBottom: 10 }}>FILES READY TO UPLOAD</div>
          {[
            { icon: "📄", name: "AI Optimization Guide", desc: "Step-by-step implementation" },
            { icon: "⚙️", name: "Technical Config File", desc: "Ready to upload" },
            { icon: "📝", name: "Content Enhancement Doc", desc: "Tailored to your business" },
            { icon: "🎯", name: "Quick Win Checklist", desc: "Do it yourself in 5 min" },
          ].map((file) => (
            <div key={file.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{file.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{file.name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{file.desc}</div>
              </div>
              <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 700, background: "rgba(34,197,94,0.15)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>READY</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,90,71,0.12)", borderRadius: 8, fontSize: 10, color: C.coral }}>
            {"⚡ Tailored for your platform - no tech skills needed"}
          </div>
        </div>
      )
    }
  ];

  const bgSteps = [
    {
      step: "01", icon: "🔍", color: C.coral,
      title: "Вземи безплатния си AI скор",
      desc: "Въведи домейна си и ние веднага сканираме 14 показателя за AI видимост. Виж точно къде стоиш — безплатно, за под 2 минути.",
      tag: "Безплатно · Без регистрация",
      mock: (
        <div style={{ background: "linear-gradient(135deg, #0B4A56, #083542)", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Сканирам...</div>
          {[92, 67, 45, 23, 78].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: w > 70 ? "#3ECFB5" : w > 50 ? C.coral : "#ef4444", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${w}%`, height: "100%", borderRadius: 3, background: w > 70 ? "#3ECFB5" : w > 50 ? C.coral : "#ef4444" }} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", width: 28, textAlign: "right" as const }}>{w}%</div>
            </div>
          ))}
          <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: C.coral }}>AI Скор: 42% - Нужни подобрения</div>
        </div>
      )
    },
    {
      step: "02", icon: "📋", color: C.mint,
      title: "Виж точно какво липсва",
      desc: "Регистрирай се безплатно и отключи пълния доклад. Показваме ти точно кои оптимизации те правят невидим за AI.",
      tag: "От €9.90/мес · Без ограничения",
      mock: (
        <div style={{ background: "linear-gradient(135deg, #0B4A56, #083542)", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: C.coral, fontWeight: 700, marginBottom: 10 }}>ТВОЯТ ПЛАН ЗА ДЕЙСТВИЕ</div>
          {["Подобри AI откриваемостта", "Засили контент сигналите", "Укрепи авторитетните маркери"].map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,90,71,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.coral, flexShrink: 0 }}>{i + 1}</div>
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
      tag: "От €39.90/мес · Всяка платформа",
      mock: (
        <div style={{ background: "linear-gradient(135deg, #0B4A56, #083542)", borderRadius: 12, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginBottom: 10 }}>ФАЙЛОВЕТЕ СА ГОТОВИ</div>
          {[
            { icon: "📄", name: "Ръководство за AI оптимизация", desc: "Стъпка по стъпка" },
            { icon: "⚙️", name: "Технически конфигурационен файл", desc: "Готов за качване" },
            { icon: "📝", name: "Документ за подобряване на съдържанието", desc: "Адаптиран за твоя бизнес" },
            { icon: "🎯", name: "Чеклист за бързи резултати", desc: "Направи го сам за 5 мин" },
          ].map((file) => (
            <div key={file.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{file.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{file.name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{file.desc}</div>
              </div>
              <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 700, background: "rgba(34,197,94,0.15)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>ГОТОВ</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,90,71,0.12)", borderRadius: 8, fontSize: 10, color: C.coral }}>
            {"⚡ Адаптирано за твоята платформа - без технически познания"}
          </div>
        </div>
      )
    }
  ];

  const steps = locale === 'en' ? enSteps : bgSteps;

  return (
    <section id="howitworks" style={{ padding: "80px 24px", background: C.white }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle
          tag={locale === 'en' ? "How it works" : "Как работи"}
          title={locale === 'en' ? "From invisible to AI-recommended in 3 steps" : "От невидим до препоръчан от AI в 3 стъпки"}
          subtitle={locale === 'en' ? "No technical knowledge needed. No agency required. Just results." : "Без технически познания. Без агенция. Само резултати."}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }} className="grid-3">
          <div className="connector-line" style={{ position: "absolute", top: 52, left: "16.5%", right: "16.5%", height: 2, background: `linear-gradient(90deg, ${C.coral}, ${C.mint})`, zIndex: 0 }} />
          {steps.map((s) => (
            <div key={s.step} style={{ position: "relative", zIndex: 1, padding: "0 16px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 24px", boxShadow: `0 0 0 6px white, 0 0 0 8px ${s.color}33`, position: "relative", zIndex: 2 }}>
                {s.icon}
              </div>
              <div style={{ background: C.white, borderRadius: 20, padding: 24, border: "1px solid rgba(11,74,86,0.08)" }}>
                <div style={{ display: "inline-block", background: `${s.color}18`, border: `1px solid ${s.color}33`, borderRadius: 20, padding: "3px 10px", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: 1 }}>STEP {s.step}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.teal, margin: "0 0 10px", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: "0 0 12px" }}>{s.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.offWhite, borderRadius: 20, padding: "4px 12px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted }}>{s.tag}</span>
                </div>
                {s.mock}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 20 }}>
            {locale === 'en' ? "Ready to become findable by AI?" : "Готов ли си да станеш намираем от AI?"}
          </p>
          <a href="#scan" style={{ display: "inline-block", background: C.coral, color: C.white, padding: "16px 40px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>
            {locale === 'en' ? "Get your free AI score →" : "Вземи безплатния си AI скор →"}
          </a>
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
          .scan-row { flex-direction: column !important; }
          .connector-line { display: none !important; }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 32px !important; }
        }
        input::placeholder { color: rgba(11,74,86,0.4); }
        textarea::placeholder { color: rgba(255,255,255,0.4); }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <NavBar />
      <HeroSection />

      {/* WHAT WE DO */}
      <section id="what" style={{ padding: "80px 24px", background: C.offWhite }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle tag={locale === 'en' ? "What we do" : "Какво правим"} title={locale === 'en' ? "findable.app makes your business AI-ready" : "findable.app прави бизнеса ти AI-ready"} subtitle={locale === 'en' ? "We analyze, optimize and track your AI visibility so ChatGPT and Gemini can find and recommend you." : "Анализираме, оптимизираме и следим AI видимостта ти за да може ChatGPT и Gemini да те намерят."} />
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {(locale === 'en' ? [
              ["🔍","Scan 14 AI criteria","We check every signal AI systems use to discover, understand and recommend businesses like yours."],
              ["📊","Personalized action plan","You get a clear, prioritized list of exactly what to fix — no guesswork, no jargon."],
              ["📁","Ready-to-use files","We generate the exact files you need — llms.txt, schema, FAQs — ready to upload in minutes."],
              ["📈","Track your progress","Every month we re-scan and show your improvement. Stay ahead of your competitors."]
            ] : [
              ["🔍","Сканираме 14 AI критерия","Проверяваме всеки сигнал, който AI системите използват за да открият и препоръчат бизнеси като твоя."],
              ["📊","Персонализиран план","Получаваш ясен, приоритизиран списък с точно това, което трябва да оправиш."],
              ["📁","Готови файлове","Генерираме точните файлове — llms.txt, schema, FAQs — готови за качване за минути."],
              ["📈","Следи напредъка си","Всеки месец правим ново сканиране и показваме подобрението. Изпреварвай конкурентите."]
            ]).map(([icon, title, desc]) => (
              <div key={title as string} style={{ background: C.white, borderRadius: 16, padding: 28, border: "1px solid rgba(11,74,86,0.06)" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(11,74,86,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.teal, margin: "0 0 10px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section id="why" style={{ padding: "80px 24px", background: C.teal }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle light tag={locale === 'en' ? "Why it matters" : "Защо е важно"} title={locale === 'en' ? "AI search is not the future — it's now" : "AI търсенето не е бъдещето — то е настоящето"} subtitle={locale === 'en' ? "Millions of people already use AI to find products, services and local businesses. Are you showing up?" : "Милиони хора вече използват AI за да намерят продукти, услуги и местни бизнеси. Ти показваш ли се?"} />
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
              {([
                ["9B+", locale === 'en' ? "AI interactions per month in 2025" : "AI взаимодействия на месец", C.coral],
                ["50%", locale === 'en' ? "of online searches will be AI-powered by 2027" : "от търсенията ще са AI-базирани до 2027", C.mint],
                ["90%", locale === 'en' ? "of SMEs have no AI optimization" : "от МСП нямат AI оптимизация", "#F5A623"],
                ["3x", locale === 'en' ? "more conversions from AI recommendations" : "повече конверсии от AI препоръки", C.mint],
              ] as [string,string,string][]).map(([num, label, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "18px 22px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color, minWidth: 70 }}>{num}</div>
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.white, margin: "0 0 20px" }}>{locale === 'en' ? "The difference is simple" : "Разликата е проста"}</h3>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: 1 }}>Google</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{locale === 'en' ? '"best dentist sofia" → 10 blue links → user chooses' : '"най-добър зъболекар софия" → 10 сини линка → потребителят избира'}</div>
                </div>
                <div style={{ textAlign: "center" as const, fontSize: 20, color: "rgba(255,255,255,0.3)" }}>↓</div>
                <div style={{ background: "rgba(255,90,71,0.1)", borderRadius: 12, padding: 18, border: "1px solid rgba(255,90,71,0.2)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.coral, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: 1 }}>AI</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{locale === 'en' ? '"best dentist in sofia?" → One specific answer. Either it\'s you — or it isn\'t.' : '"най-добър зъболекар в софия?" → Един конкретен отговор. Или си ти — или не си.'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SME */}
      <section id="sme" style={{ padding: "80px 24px", background: C.offWhite }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <SectionTitle tag={locale === 'en' ? "The Opportunity" : "Възможността"} title={locale === 'en' ? "First movers win in AI search" : "Първите печелят в AI търсенето"} subtitle={locale === 'en' ? "Most businesses haven't optimized for AI yet. This is your chance to get ahead." : "Повечето бизнеси все още не са оптимизирани за AI. Това е шансът ти да изпревариш конкурентите."} />
          <div style={{ background: C.teal, borderRadius: 20, padding: "40px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32 }} className="grid-3">
              {(locale === 'en' ? [
                ["⚡", "Act now", "While competitors are still relying on old SEO, you can dominate AI search."],
                ["🎯", "Be specific", "AI recommends businesses that explain themselves clearly. We help you do exactly that."],
                ["🔄", "Stay current", "AI algorithms change monthly. We track them so you don't have to."]
              ] : [
                ["⚡", "Действай сега", "Докато конкурентите разчитат на стар SEO, ти можеш да доминираш в AI търсенето."],
                ["🎯", "Бъди конкретен", "AI препоръчва бизнеси, които се обясняват ясно. Ние ти помагаме с точно това."],
                ["🔄", "Бъди актуален", "AI алгоритмите се менят всеки месец. Ние ги следим вместо теб."]
              ]).map(([icon, title, desc]) => (
                <div key={title as string} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 24, textAlign: "left" as const }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 8 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
            <a href="#scan" style={{ display: "inline-block", background: C.coral, color: C.white, padding: "14px 36px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>{locale === 'en' ? "Start for free today" : "Започни безплатно днес"}</a>
          </div>
        </div>
      </section>

      <HowItWorksSection />
      <ScanSection />

      {/* WHY MONTHLY */}
      <section id="whymonthly" style={{ padding: "80px 24px", background: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle tag={locale === 'en' ? "Why monthly" : "Защо всеки месец"} title={locale === 'en' ? "AI optimization is an ongoing process" : "AI оптимизацията е непрекъснат процес"} subtitle={locale === 'en' ? "AI algorithms update constantly. What works today may be outdated in 3 months." : "AI алгоритмите се обновяват постоянно. Това, което работи днес, може да е остаряло след 3 месеца."} />
          <div className="grid-2" style={{ background: C.teal, borderRadius: 20, padding: "40px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: "0 0 16px" }}>{locale === 'en' ? "One-time fixes aren't enough." : "Еднократните поправки не са достатъчни."}</h3>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 28px" }}>{locale === 'en' ? "We monitor changes in AI search behavior and update your optimization strategy every month." : "Следим промените в AI търсенето и обновяваме стратегията за оптимизация всеки месец."}</p>
              <a href="#pricing" style={{ display: "inline-block", background: C.coral, color: C.white, padding: "14px 32px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>{locale === 'en' ? "See plans" : "Виж плановете"}</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              {(locale === 'en' ? [
                ["Month 1", "Baseline optimization - llms.txt, schema, robots.txt"],
                ["Month 3", "AI visibility improves, first mentions appear"],
                ["Month 6", "Stable presence across multiple AI platforms"],
                ["Month 12", "Significant advantage over non-optimized competitors"]
              ] : [
                ["Месец 1", "Базова оптимизация - llms.txt, schema, robots.txt"],
                ["Месец 3", "AI видимостта се подобрява, появяват се споменавания"],
                ["Месец 6", "Стабилно присъствие в множество AI платформи"],
                ["Месец 12", "Значително предимство пред неоптимизираните конкуренти"]
              ]).map(([month, desc]) => (
                <div key={month} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ background: C.coral, color: C.white, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{month}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, paddingTop: 4 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PricingSection />
      <ContactSection />

      <footer style={{ background: "#051E25", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ marginBottom: 16 }}><LogoDark size={20} /></div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 8 }}>
          © 2026 Business Solutions Consulting EOOD, trading as findable.app &nbsp;·&nbsp; VAT: BG200487371
        </div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
          <a href={`/${locale}/privacy`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Privacy Policy</a>
          &nbsp;·&nbsp;
          <a href={`/${locale}/terms`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Terms of Service</a>
          &nbsp;·&nbsp;
          <a href={`/${locale}/imprint`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Imprint</a>
          &nbsp;·&nbsp;
          <a href="#contact" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{locale === 'en' ? 'Contact' : 'Контакт'}</a>
        </div>
      </footer>
    </>
  );
}
