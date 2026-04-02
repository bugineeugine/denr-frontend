"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  {
    number: "01",
    title: "Instant Permit Verification",
    desc: "Scan any QR code for real-time permit status, validity, and full compliance history.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Data Analytics",
    desc: "Interactive dashboards with permit trends, compliance rates, and environmental impact metrics.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Digital Permit Workflow",
    desc: "End-to-end permit lifecycle management with multi-step approval chains and automated notifications.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Forest Product Tracking",
    desc: "Full traceability of timber and non-timber forest products with geo-tagged transport records.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "9", label: "Approval Steps", sub: "Fully automated workflow" },
  { value: "100%", label: "Digital Process", sub: "Paperless end-to-end" },
  { value: "QR", label: "Instant Access", sub: "Scan to verify anywhere" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        :root {
          --forest-950: #0a1a08;
          --forest-900: #0f2d0c;
          --forest-800: #14532d;
          --forest-700: #166534;
          --forest-600: #15803d;
          --forest-400: #4ade80;
          --forest-300: #86efac;
          --gold-400: #fbbf24;
          --gold-300: #fcd34d;
          --cream: #fdf8f0;
          --parchment: #f5ede0;
        }

        body { overflow-x: hidden; }

        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }

        /* Animated background mesh */
        .hero-mesh {
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(21,128,61,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(251,191,36,0.07) 0%, transparent 50%),
            radial-gradient(ellipse 100% 100% at 50% 100%, rgba(15,45,12,0.95) 0%, rgba(10,26,8,1) 80%);
          background-color: var(--forest-950);
        }

        /* Organic SVG blobs */
        .blob-1 {
          position: absolute;
          top: -10%;
          right: -5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(22,101,52,0.15) 0%, transparent 70%);
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph 12s ease-in-out infinite;
          pointer-events: none;
        }
        .blob-2 {
          position: absolute;
          bottom: 0;
          left: -10%;
          width: 500px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(251,191,36,0.05) 0%, transparent 70%);
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          animation: morph 16s ease-in-out infinite reverse;
          pointer-events: none;
        }
        @keyframes morph {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        /* Grid texture overlay */
        .grid-texture {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* Stagger animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .anim-1 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .anim-3 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .anim-4 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .anim-badge { animation: fadeIn 0.5s ease 0.05s both; }

        /* Shimmer on gold */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #fbbf24 0%, #fde68a 45%, #fbbf24 55%, #f59e0b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        /* Navbar glass */
        .nav-glass {
          background: rgba(10,26,8,0.75);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-scrolled {
          background: rgba(10,26,8,0.92);
          border-bottom: 1px solid rgba(251,191,36,0.12);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4);
        }

        /* Feature card */
        .feature-card {
          background: linear-gradient(145deg, rgba(20,83,45,0.18) 0%, rgba(10,26,8,0.6) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .feature-card:hover {
          background: linear-gradient(145deg, rgba(21,128,61,0.28) 0%, rgba(15,45,12,0.7) 100%);
          border-color: rgba(251,191,36,0.2);
          transform: translateY(-4px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(251,191,36,0.08);
        }
        .feature-card:hover .feature-number {
          color: #fbbf24;
        }

        /* Divider line ornament */
        .ornament-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent);
        }

        /* Stat card */
        .stat-card {
          background: linear-gradient(135deg, rgba(20,83,45,0.25), rgba(10,26,8,0.5));
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
        }

        /* CTA button primary */
        .btn-primary {
          background: linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%);
          border: 1px solid rgba(74,222,128,0.2);
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(74,222,128,0.15), transparent);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover {
          box-shadow: 0 8px 32px rgba(21,128,61,0.4), 0 0 0 1px rgba(74,222,128,0.3);
          transform: translateY(-1px);
        }

        /* CTA button secondary */
        .btn-secondary {
          border: 1px solid rgba(251,191,36,0.35);
          color: #fbbf24;
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          background: rgba(251,191,36,0.08);
          border-color: rgba(251,191,36,0.6);
          box-shadow: 0 8px 32px rgba(251,191,36,0.12);
          transform: translateY(-1px);
        }

        /* Scroll indicator */
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(8px); }
        }
        .scroll-bounce { animation: bounce 2s ease-in-out infinite; }

        /* Section reveal (CSS only, always visible) */
        .section-light {
          background: var(--cream);
          color: #1a1a1a;
        }
        .section-dark {
          background: var(--forest-950);
          color: #fff;
        }

        /* About card */
        .about-card {
          background: #fff;
          border: 1px solid rgba(20,83,45,0.12);
          box-shadow: 0 4px 24px rgba(20,83,45,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .about-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(20,83,45,0.12);
        }

        /* Footer */
        .footer-bg {
          background: linear-gradient(180deg, #0a1a08 0%, #060e05 100%);
          border-top: 1px solid rgba(251,191,36,0.08);
        }

        .nav-link {
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #fbbf24;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #fff; }
        .nav-link:hover::after { width: 100%; }
      `}</style>

      <div className="font-body" style={{ background: "var(--forest-950)", color: "#fff" }}>

        {/* ── Navbar ──────────────────────────────────────────────── */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "nav-scrolled" : "nav-glass"}`}
        >
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="relative flex items-center justify-center overflow-hidden rounded-full"
                style={{ width: 40, height: 40, background: "linear-gradient(135deg, #14532d, #166534)", border: "1.5px solid rgba(74,222,128,0.25)" }}
              >
                <Image src="/denr.png" alt="DENR Logo" width={34} height={34} className="rounded-full object-cover" />
              </div>
              <div>
                <p className="font-display text-[13px] font-700 tracking-wide text-white leading-tight">DENR — CENRO</p>
                <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-400/60 leading-tight">Permit System</p>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
              ))}
            </nav>

            {/* Login CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="btn-primary rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white tracking-wide"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden px-6 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="nav-link text-base" onClick={() => setMenuOpen(false)}>{l.label}</a>
              ))}
              <Link href="/login" className="btn-primary rounded-xl px-5 py-3 text-[13px] font-semibold text-white text-center mt-2">
                Sign In to Dashboard
              </Link>
            </div>
          )}
        </header>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section id="home" className="hero-mesh grid-texture relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
          <div className="blob-1" />
          <div className="blob-2" />

          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)" }} />

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">

            {/* Badge */}
            <div className="anim-badge inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8"
              style={{ background: "rgba(20,83,45,0.3)", border: "1px solid rgba(74,222,128,0.2)", backdropFilter: "blur(12px)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                Official DENR Permit Verification System
              </span>
            </div>

            {/* Headline */}
            <h1 className="anim-1 font-display text-5xl md:text-7xl lg:text-8xl font-800 leading-[0.92] mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              <span className="text-white">Centralized</span>
              <br />
              <em className="gold-shimmer not-italic">Permit</em>
              <br />
              <span className="text-white">Verification</span>
            </h1>

            <div className="ornament-line w-24 mx-auto my-7 anim-2" />

            {/* Sub */}
            <p className="anim-2 text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed mb-3"
              style={{ fontWeight: 300 }}
            >
              for Local Transport with Data Analytics & Virtualization
            </p>
            <p className="anim-2 text-sm text-white/30 max-w-lg mx-auto leading-relaxed mb-10">
              Streamlining environmental compliance through advanced digital verification, comprehensive
              analytics, and innovative permit management technology.
            </p>

            {/* CTAs */}
            <div className="anim-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login"
                className="btn-primary rounded-2xl px-8 py-4 text-[15px] font-semibold text-white flex items-center gap-2.5 group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 group-hover:rotate-12 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Access Dashboard
              </Link>
              <a href="#services"
                className="btn-secondary rounded-2xl px-8 py-4 text-[15px] font-semibold"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="anim-4 relative z-10 mx-auto max-w-3xl px-6 mt-20 mb-16 grid grid-cols-3 gap-4 w-full">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card rounded-2xl px-4 py-5 text-center">
                <p className="font-display text-3xl md:text-4xl font-700 mb-1" style={{ color: "#fbbf24" }}>{s.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70 mb-0.5">{s.label}</p>
                <p className="text-[10px] text-white/30">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-bounce flex flex-col items-center gap-2 opacity-30">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white">Scroll</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────── */}
        <section id="services" style={{ background: "var(--forest-950)" }} className="py-28 px-6">
          <div className="mx-auto max-w-6xl">

            {/* Section label */}
            <div className="flex items-center gap-4 mb-5">
              <div className="ornament-line flex-1" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: "#fbbf24" }}>System Features</span>
              <div className="ornament-line flex-1" />
            </div>

            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-700 text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
                Everything you need for<br />
                <em className="not-italic" style={{ color: "#86efac" }}>permit compliance</em>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto text-base" style={{ fontWeight: 300 }}>
                Advanced technology solutions for efficient permit management and environmental monitoring
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {FEATURES.map((f) => (
                <div key={f.number} className="feature-card rounded-2xl p-8 flex gap-6">
                  <div className="shrink-0">
                    <span className="feature-number block font-display text-4xl font-700 leading-none transition-colors duration-300" style={{ color: "rgba(255,255,255,0.08)" }}>
                      {f.number}
                    </span>
                  </div>
                  <div>
                    <div
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                      style={{ background: "rgba(21,128,61,0.25)", border: "1px solid rgba(74,222,128,0.15)", color: "#4ade80" }}
                    >
                      {f.icon}
                    </div>
                    <h3 className="font-display text-xl font-700 text-white mb-2">{f.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed" style={{ fontWeight: 300 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ───────────────────────────────────────────────── */}
        <section id="about" className="section-light py-28 px-6">
          <div className="mx-auto max-w-6xl">

            <div className="flex items-center gap-4 mb-5">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(20,83,45,0.3), transparent)" }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: "#166534" }}>About the System</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(20,83,45,0.3), transparent)" }} />
            </div>

            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-700 mb-6" style={{ color: "#0f2d0c", letterSpacing: "-0.02em" }}>
                Built for DENR-CENRO<br />
                <em className="not-italic" style={{ color: "#166534" }}>operations</em>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed" style={{ fontWeight: 300 }}>
                The Centralized Permit Verification System represents a groundbreaking approach to environmental
                compliance in the transport sector — combining cutting-edge technology with environmental
                stewardship to ensure sustainable transport practices across local communities.
              </p>
            </div>

            {/* Two-column cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="about-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth={1.5} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-700" style={{ color: "#0f2d0c" }}>Our Mission</h3>
                </div>
                <p className="text-slate-500 leading-relaxed text-sm" style={{ fontWeight: 300 }}>
                  To streamline environmental permit processes while maintaining the highest standards of
                  environmental protection and regulatory compliance through innovative digital solutions.
                </p>
              </div>

              <div className="about-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)", border: "1px solid #bbf7d0" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth={1.5} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-700" style={{ color: "#0f2d0c" }}>Our Vision</h3>
                </div>
                <p className="text-slate-500 leading-relaxed text-sm" style={{ fontWeight: 300 }}>
                  A future where environmental compliance is seamlessly integrated into transport operations,
                  promoting sustainable development and environmental conservation for generations to come.
                </p>
              </div>
            </div>

            {/* Process strip */}
            <div
              className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ background: "linear-gradient(135deg, #0f2d0c, #14532d)", border: "1px solid rgba(74,222,128,0.15)" }}
            >
              <div>
                <p className="font-display text-2xl font-700 text-white mb-1">Ready to get started?</p>
                <p className="text-emerald-300/60 text-sm" style={{ fontWeight: 300 }}>
                  Login to access the full permit management dashboard.
                </p>
              </div>
              <Link
                href="/login"
                className="btn-primary shrink-0 rounded-xl px-7 py-3.5 text-[14px] font-semibold text-white whitespace-nowrap"
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="footer-bg py-16 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-10 mb-12">

              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex items-center justify-center overflow-hidden rounded-full"
                    style={{ width: 38, height: 38, background: "linear-gradient(135deg, #14532d, #166534)", border: "1px solid rgba(74,222,128,0.2)" }}
                  >
                    <Image src="/denr.png" alt="DENR Logo" width={32} height={32} className="rounded-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-[12px] font-700 text-white leading-tight">DENR — CENRO</p>
                  </div>
                </div>
                <p className="text-white/30 text-xs leading-relaxed" style={{ fontWeight: 300 }}>
                  Department of Environment and Natural Resources<br />
                  Community Environment and Natural Resources Office
                </p>
              </div>

              {/* Services */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#fbbf24" }}>Services</p>
                <ul className="space-y-2.5">
                  {["Permit Verification", "Data Analytics", "Compliance Monitoring", "Environmental Assessment"].map((s) => (
                    <li key={s}>
                      <a href="#" className="text-white/35 hover:text-white/70 text-xs transition-colors" style={{ fontWeight: 300 }}>{s}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#fbbf24" }}>Quick Links</p>
                <ul className="space-y-2.5">
                  {["User Guide", "FAQ", "Support", "Downloads"].map((s) => (
                    <li key={s}>
                      <a href="#" className="text-white/35 hover:text-white/70 text-xs transition-colors" style={{ fontWeight: 300 }}>{s}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#fbbf24" }}>Contact</p>
                <ul className="space-y-3">
                  {[
                    { icon: "✉", text: "info@denr-cenro.gov.ph" },
                    { icon: "☏", text: "(02) 8929-6626" },
                    { icon: "◎", text: "Visayas Avenue, Quezon City" },
                  ].map((c) => (
                    <li key={c.text} className="flex items-start gap-2.5">
                      <span className="text-emerald-400/50 text-xs mt-0.5">{c.icon}</span>
                      <span className="text-white/30 text-xs leading-relaxed" style={{ fontWeight: 300 }}>{c.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="ornament-line mb-8" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-white/20 text-[11px]" style={{ fontWeight: 300 }}>
                © {new Date().getFullYear()} Department of Environment and Natural Resources — CENRO. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400/40" />
                <span className="text-white/20 text-[11px]" style={{ fontWeight: 300 }}>Official Government System</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
