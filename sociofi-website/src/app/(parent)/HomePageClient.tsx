'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LogoMark } from '@/components/shared/Logo';

/* ═══════════════════════════════════════════════════════════════════════
   SOCIOFI HOMEPAGE — THEME-AWARE · CENTERED · PATTERNED
   All colors use CSS variables for dark/light mode support.
   ═══════════════════════════════════════════════════════════════════════ */

const F = {
  h: "var(--font-manrope, 'Manrope'), sans-serif",
  b: "var(--font-dm-sans, 'DM Sans'), sans-serif",
  m: "var(--font-jb-mono, 'JetBrains Mono'), monospace",
};

const C = {
  studio: '#72C4B2', agents: '#8B5CF6', services: '#4DBFA8',
  cloud: '#5BB5E0', labs: '#7B6FE8', products: '#E8916F',
  academy: '#E8B84D', ventures: '#6BA3E8',
};

const gradTextStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, var(--navy-bright) 0%, var(--teal-light) 60%, var(--teal-pale) 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
};

/* ── Scoped CSS ─────────────────────────────────────────────────────── */
const STYLES = `
  /* ── Layout ── */
  .hp-sec { padding: var(--space-section) 0; position: relative; overflow: hidden; }
  .hp-bg1 { background: var(--bg); }
  .hp-bg2 { background: var(--bg-2); }

  /* ── Running light border ── */
  @property --border-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes hp-border-run {
    0% { --border-angle: 0deg; }
    100% { --border-angle: 360deg; }
  }
  .hp-sec::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0;
    padding: 2.5px;
    pointer-events: none;
    z-index: 3;
    background: conic-gradient(
      from var(--border-angle),
      transparent 0%,
      transparent 35%,
      var(--teal-light) 45%,
      var(--navy-bright) 50%,
      var(--teal-light) 55%,
      transparent 65%,
      transparent 100%
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    animation: hp-border-run 6s linear infinite;
    opacity: 0.4;
  }
  .hp-sec:nth-child(even)::after {
    animation-delay: -3s;
  }
  .hp-sec:nth-child(3n)::after {
    animation-duration: 8s;
  }
  .hp-con { max-width: 1200px; margin-inline: auto; padding-inline: clamp(20px, 5vw, 32px); width: 100%; position: relative; z-index: 2; }
  .hp-center { text-align: center; }

  /* ── Grids ── */
  .hp-g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .hp-g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
  .hp-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  /* ── Cards ── */
  .hp-card {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 32px 28px; position: relative; overflow: hidden;
    transition: transform 0.4s var(--ease), border-color 0.4s, box-shadow 0.4s;
  }
  .hp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--gradient-brand-h); opacity: 0; transition: opacity 0.4s;
  }
  .hp-card:hover { transform: translateY(-6px); border-color: var(--border-hover); box-shadow: var(--card-hover-shadow); }
  .hp-card:hover::before { opacity: 1; }
  .hp-card-v::before { background: linear-gradient(90deg, #8B5CF6, #A78BFA) !important; }
  .hp-card-red::before { background: linear-gradient(90deg, rgba(220,100,100,0.6), rgba(220,100,100,0.3)) !important; }
  .hp-card-p::before { background: linear-gradient(90deg, #E8916F, #F0B49A) !important; }

  /* ── Quote callout ── */
  .hp-quote {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-left: 3px solid var(--division-accent, var(--teal));
    border-radius: var(--radius-md); padding: 24px 28px;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  }
  .hp-quote-tech {
    border-left-color: var(--navy-bright);
    background: var(--glass-bg);
  }
  .hp-quote-v { border-left-color: #8B5CF6; }

  /* ── Division cards ── */
  .hp-div-card {
    display: block; text-decoration: none; position: relative; overflow: hidden;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 18px; padding: 28px 22px;
    transition: transform 0.3s var(--ease), border-color 0.3s, box-shadow 0.3s;
  }
  .hp-div-card::after {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    border-radius: 18px 0 0 18px; background: var(--div-accent); opacity: 0; transition: opacity 0.3s;
  }
  .hp-div-card:hover { transform: translateY(-4px); border-color: var(--border-hover); box-shadow: var(--card-hover-shadow); }
  .hp-div-card:hover::after { opacity: 1; }

  /* ── Pills ── */
  .hp-pill {
    display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px;
    font-family: ${F.m}; font-size: 0.64rem; border: 1px solid var(--border);
    border-radius: 100px; color: var(--text-secondary); text-decoration: none;
    transition: border-color 0.2s, color 0.2s; letter-spacing: 0.02em;
  }
  .hp-pill:hover { border-color: var(--pill-accent, var(--teal-light)); color: var(--pill-accent, var(--teal-light)); }

  /* ── Table ── */
  .hp-table { width: 100%; border-collapse: collapse; }
  .hp-table th, .hp-table td { padding: 14px 20px; text-align: left; border-bottom: 1px solid var(--border); }
  .hp-table th { font-family: ${F.m}; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 500; }
  .hp-table td { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-secondary); }
  .hp-table td:first-child { color: var(--text-primary); font-weight: 500; }
  .hp-sf { color: var(--teal-light) !important; font-weight: 600 !important; }
  .hp-sf-bg { background: color-mix(in srgb, var(--teal) 4%, transparent); }

  /* ── Background patterns ── */
  .hp-constellation { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
  .hp-constellation svg { width: 100%; height: 100%; }
  .hp-dots-bg {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, color-mix(in srgb, var(--teal) 15%, transparent) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%);
  }

  /* ── Noise overlay ── */
  .hp-noise { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; pointer-events: none; opacity: var(--noise-opacity); }

  /* ── Animations ── */
  @keyframes hp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes hp-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .hp-cursor { display: inline-block; width: 2px; height: 1em; background: var(--teal-light); margin-left: 2px; vertical-align: text-bottom; animation: hp-cursor 0.75s step-start infinite; }
  @keyframes hp-float-1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
  @keyframes hp-float-2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-20px, 25px); } }
  .hp-orb-1 { animation: hp-float-1 25s ease-in-out infinite; }
  .hp-orb-2 { animation: hp-float-2 20s ease-in-out infinite; }

  /* ── Responsive ── */
  @media (max-width: 1024px) { .hp-g4, .hp-g3 { grid-template-columns: repeat(2,1fr) !important; } }
  @media (max-width: 768px) {
    .hp-sec { padding: 80px 0; }
    .hp-g3, .hp-g4, .hp-g2 { grid-template-columns: 1fr !important; }
    .hp-card { padding: 24px 20px; }
    .hp-quote { padding: 20px 22px; }
  }
  @media (max-width: 480px) { .hp-sec { padding: 64px 0; } .hp-hero-ctas { flex-direction: column !important; } }
  @media (prefers-reduced-motion: reduce) {
    .hp-orb-1, .hp-orb-2 { animation: none !important; }
    .hp-sec::after { animation: none !important; opacity: 0.15 !important; }
  }

  /* ── Geometric motion backgrounds ── */
  @keyframes hp-geo-fa { 0%,100%{transform:translate(0,0) rotate(45deg);} 40%{transform:translate(-16px,-20px) rotate(51deg);} 70%{transform:translate(10px,14px) rotate(41deg);} }
  @keyframes hp-geo-fb { 0%,100%{transform:translate(0,0) rotate(45deg);} 35%{transform:translate(18px,-12px) rotate(38deg);} 65%{transform:translate(-8px,18px) rotate(53deg);} }
  @keyframes hp-geo-fc { 0%,100%{transform:translate(0,0) rotate(0deg);} 50%{transform:translate(-10px,20px) rotate(7deg);} }
  @keyframes hp-geo-cw { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes hp-geo-ccw { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} }
  @keyframes hp-geo-ring-a { 0%,100%{transform:scale(1); opacity:0.18;} 50%{transform:scale(1.13); opacity:0.06;} }
  @keyframes hp-geo-ring-b { 0%,100%{transform:scale(1); opacity:0.12;} 50%{transform:scale(1.09); opacity:0.04;} }
  @keyframes hp-geo-ring-c { 0%,100%{transform:scale(1); opacity:0.07;} 50%{transform:scale(1.06); opacity:0.02;} }
  @keyframes hp-geo-tri { 0%,100%{transform:translate(0,0) rotate(0deg);} 33%{transform:translate(14px,-16px) rotate(5deg);} 66%{transform:translate(-10px,10px) rotate(-3deg);} }
  @keyframes hp-geo-tri-b { 0%,100%{transform:translate(0,0) rotate(0deg);} 33%{transform:translate(-18px,12px) rotate(-6deg);} 66%{transform:translate(8px,-14px) rotate(4deg);} }
  @keyframes hp-geo-scan { 0%{transform:translateX(-100%);} 100%{transform:translateX(400%);} }
  .hp-geo-fa { animation: hp-geo-fa 20s ease-in-out infinite; }
  .hp-geo-fb { animation: hp-geo-fb 26s ease-in-out infinite; }
  .hp-geo-fc { animation: hp-geo-fc 18s ease-in-out infinite; }
  .hp-geo-cw { animation: hp-geo-cw 60s linear infinite; }
  .hp-geo-ccw { animation: hp-geo-ccw 80s linear infinite; }
  .hp-geo-ra { animation: hp-geo-ring-a 5s ease-in-out infinite; }
  .hp-geo-rb { animation: hp-geo-ring-b 7s ease-in-out infinite 1.8s; }
  .hp-geo-rc { animation: hp-geo-ring-c 9s ease-in-out infinite 3.5s; }
  .hp-geo-ta { animation: hp-geo-tri 24s ease-in-out infinite; }
  .hp-geo-tb { animation: hp-geo-tri-b 30s ease-in-out infinite; }
  .hp-geo-scan { animation: hp-geo-scan 12s linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    .hp-geo-fa,.hp-geo-fb,.hp-geo-fc,.hp-geo-cw,.hp-geo-ccw,
    .hp-geo-ra,.hp-geo-rb,.hp-geo-rc,.hp-geo-ta,.hp-geo-tb,.hp-geo-scan { animation: none !important; }
  }

  /* ── Section watermarks ── */
  @keyframes hp-wm-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes hp-wm-drift {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(-14px, -22px); }
    66% { transform: translate(12px, 14px); }
  }
  .hp-wm { animation: hp-wm-float 24s ease-in-out infinite; }
  .hp-wm-drift { animation: hp-wm-drift 32s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .hp-wm, .hp-wm-drift { animation: none !important; }
  }

  /* ── Section colored orbs ── */
  @keyframes hp-orb-da {
    0%,100%{transform:translate(0,0);}
    25%{transform:translate(45px,-35px);}
    50%{transform:translate(-25px,-55px);}
    75%{transform:translate(-45px,25px);}
  }
  @keyframes hp-orb-db {
    0%,100%{transform:translate(0,0);}
    33%{transform:translate(-55px,45px);}
    66%{transform:translate(40px,60px);}
  }
  @keyframes hp-orb-dc {
    0%,100%{transform:translate(0,0);}
    40%{transform:translate(30px,-40px);}
    80%{transform:translate(-20px,28px);}
  }
  .hp-orb-da { animation: hp-orb-da 32s ease-in-out infinite; }
  .hp-orb-db { animation: hp-orb-db 40s ease-in-out infinite; }
  .hp-orb-dc { animation: hp-orb-dc 26s ease-in-out infinite; }

  /* ── Running gradient strip ── */
  @keyframes hp-rg { 0%{background-position:0% 50%;} 100%{background-position:200% 50%;} }
  .hp-rg { animation: hp-rg 8s linear infinite; opacity:0.55; }
  .hp-rg-slow { animation: hp-rg 14s linear infinite; opacity:0.45; }

  /* ── Diagonal sweep beam ── */
  @keyframes hp-beam {
    0%  { transform:translateX(-110%) skewX(-18deg); opacity:0; }
    6%  { opacity:1; }
    94% { opacity:1; }
    100%{ transform:translateX(220%) skewX(-18deg); opacity:0; }
  }
  .hp-beam-a { animation: hp-beam 16s linear infinite; }
  .hp-beam-b { animation: hp-beam 22s linear infinite 8s; }

  /* ── Hero aurora ── */
  @keyframes hp-aurora-a {
    0%,100%{transform:translate(0,0) scale(1);}
    33%{transform:translate(65px,-45px) scale(1.12);}
    66%{transform:translate(-45px,55px) scale(0.91);}
  }
  @keyframes hp-aurora-b {
    0%,100%{transform:translate(0,0) scale(1);}
    33%{transform:translate(-75px,55px) scale(1.09);}
    66%{transform:translate(55px,-40px) scale(0.94);}
  }
  @keyframes hp-aurora-c {
    0%,100%{transform:translate(0,0) scale(1);}
    50%{transform:translate(35px,65px) scale(1.07);}
  }
  .hp-aurora-a { animation: hp-aurora-a 22s ease-in-out infinite; }
  .hp-aurora-b { animation: hp-aurora-b 28s ease-in-out infinite 4s; }
  .hp-aurora-c { animation: hp-aurora-c 18s ease-in-out infinite 8s; }

  @media (prefers-reduced-motion: reduce) {
    .hp-orb-da,.hp-orb-db,.hp-orb-dc { animation: none !important; }
    .hp-rg,.hp-rg-slow { animation: none !important; opacity:0.25 !important; }
    .hp-beam-a,.hp-beam-b { display:none !important; }
    .hp-aurora-a,.hp-aurora-b,.hp-aurora-c { animation: none !important; }
  }

  /* ── Floating dots ── */
  @keyframes hp-dot-0 {
    0%,100%{transform:translate(0,0);}
    25%{transform:translate(14px,-20px);}
    50%{transform:translate(-10px,-30px);}
    75%{transform:translate(-18px,10px);}
  }
  @keyframes hp-dot-1 {
    0%,100%{transform:translate(0,0);}
    33%{transform:translate(-22px,18px);}
    66%{transform:translate(20px,24px);}
  }
  @keyframes hp-dot-2 {
    0%,100%{transform:translate(0,0);}
    20%{transform:translate(16px,12px);}
    40%{transform:translate(22px,-18px);}
    60%{transform:translate(-12px,-22px);}
    80%{transform:translate(-20px,10px);}
  }
  @keyframes hp-dot-3 {
    0%,100%{transform:translate(0,0);}
    50%{transform:translate(-24px,-16px);}
  }
  @keyframes hp-dot-4 {
    0%,100%{transform:translate(0,0);}
    30%{transform:translate(12px,22px);}
    70%{transform:translate(-16px,-14px);}
  }
  .hp-dot-a0{animation-name:hp-dot-0;animation-timing-function:ease-in-out;animation-iteration-count:infinite;}
  .hp-dot-a1{animation-name:hp-dot-1;animation-timing-function:ease-in-out;animation-iteration-count:infinite;}
  .hp-dot-a2{animation-name:hp-dot-2;animation-timing-function:ease-in-out;animation-iteration-count:infinite;}
  .hp-dot-a3{animation-name:hp-dot-3;animation-timing-function:ease-in-out;animation-iteration-count:infinite;}
  .hp-dot-a4{animation-name:hp-dot-4;animation-timing-function:ease-in-out;animation-iteration-count:infinite;}
  @media(prefers-reduced-motion:reduce){
    .hp-dot-a0,.hp-dot-a1,.hp-dot-a2,.hp-dot-a3,.hp-dot-a4{animation:none!important;opacity:0!important;}
  }
`;

/* ═══════════════════════════════════════════════════════════════════════
   PRIMITIVES (theme-aware)
   ═══════════════════════════════════════════════════════════════════════ */

function Fade({ children, d = 0, style, className }: { children: React.ReactNode; d?: number; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 40 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: d }} style={style}>
      {children}
    </motion.div>
  );
}

function SLabel({ children, color, center }: { children: React.ReactNode; color?: string; center?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      fontFamily: F.m, fontSize: '0.72rem', fontWeight: 600,
      color: color ?? 'var(--division-accent, var(--teal-light))',
      textTransform: 'uppercase', letterSpacing: '0.14em',
      ...(center ? { justifyContent: 'center' } : {}),
    }}>
      <span style={{ width: 20, height: 1.5, background: color ?? 'var(--division-accent, var(--teal-light))', flexShrink: 0 }} aria-hidden="true" />
      {children}
    </div>
  );
}

function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{
      fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800,
      letterSpacing: '-0.03em', lineHeight: 1.12, color: 'var(--text-primary)', ...style,
    }}>
      {children}
    </h2>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontFamily: F.b, fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary)', ...style }}>{children}</p>;
}

function FounderQuote({ text, name, title, highlight }: { text: string; name: string; title: string; highlight?: string }) {
  let content: React.ReactNode = text;
  if (highlight) {
    const idx = text.indexOf(highlight);
    if (idx !== -1) {
      content = <>{text.slice(0, idx)}<strong style={{ color: 'var(--teal-light)', fontWeight: 600, fontStyle: 'normal' }}>{highlight}</strong>{text.slice(idx + highlight.length)}</>;
    }
  }
  return (
    <div className="hp-quote" style={{ marginBlock: 24 }}>
      <p style={{ fontFamily: F.b, fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.8, marginBottom: 14, opacity: 0.9 }}>
        &ldquo;{content}&rdquo;
      </p>
      <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', fontWeight: 500 }}>
        — <span style={{ color: 'var(--teal-light)' }}>{name}</span>, {title}
      </p>
    </div>
  );
}

function TechQuote({ text, highlight, name, title, event, variant }: {
  text: string; highlight?: string; name: string; title: string; event?: string; variant?: 'navy' | 'violet';
}) {
  let content: React.ReactNode = text;
  if (highlight) {
    const idx = text.indexOf(highlight);
    if (idx !== -1) {
      content = <>{text.slice(0, idx)}<strong style={{ color: variant === 'violet' ? C.agents : 'var(--teal-light)', fontWeight: 700, fontStyle: 'normal' }}>{highlight}</strong>{text.slice(idx + highlight.length)}</>;
    }
  }
  return (
    <div className={`hp-quote ${variant === 'violet' ? 'hp-quote-v' : 'hp-quote-tech'}`} style={{ marginBlock: 24 }}>
      <p style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 600, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: 14, opacity: 0.9 }}>
        &ldquo;{content}&rdquo;
      </p>
      <p style={{ fontFamily: F.m, fontSize: '0.66rem', color: 'var(--text-secondary)', letterSpacing: '0.04em', fontWeight: 500 }}>
        — <span style={{ color: variant === 'violet' ? C.agents : 'var(--navy-bright)' }}>{name}</span>, {title}{event ? ` — ${event}` : ''}
      </p>
    </div>
  );
}

function ArrowSvg({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
}

function Dot({ color, size = 6 }: { color: string; size?: number }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} aria-hidden="true" />;
}

/* ── Background Patterns ── */
function ConstellationBg() {
  return (
    <div className="hp-constellation" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="15" y1="20" x2="45" y2="35" stroke="var(--grid-color)" strokeWidth="0.15" />
        <line x1="45" y1="35" x2="80" y2="25" stroke="var(--grid-color)" strokeWidth="0.15" />
        <line x1="80" y1="25" x2="70" y2="60" stroke="var(--grid-color)" strokeWidth="0.15" />
        <line x1="70" y1="60" x2="35" y2="75" stroke="var(--grid-color)" strokeWidth="0.15" />
        <line x1="35" y1="75" x2="15" y2="55" stroke="var(--grid-color)" strokeWidth="0.15" />
        <line x1="15" y1="55" x2="15" y2="20" stroke="var(--grid-color)" strokeWidth="0.15" />
        <line x1="45" y1="35" x2="35" y2="75" stroke="var(--grid-color)" strokeWidth="0.1" />
        <line x1="50" y1="10" x2="45" y2="35" stroke="var(--grid-color)" strokeWidth="0.1" />
        <line x1="90" y1="80" x2="70" y2="60" stroke="var(--grid-color)" strokeWidth="0.1" />
        <circle cx="15" cy="20" r="0.6" fill="var(--division-accent)" opacity="0.25" />
        <circle cx="45" cy="35" r="0.8" fill="var(--division-accent)" opacity="0.35" />
        <circle cx="80" cy="25" r="0.5" fill="var(--division-accent)" opacity="0.2" />
        <circle cx="70" cy="60" r="0.7" fill="var(--division-accent)" opacity="0.3" />
        <circle cx="35" cy="75" r="0.6" fill="var(--division-accent)" opacity="0.25" />
        <circle cx="15" cy="55" r="0.5" fill="var(--division-accent)" opacity="0.2" />
        <circle cx="50" cy="10" r="0.4" fill="var(--division-accent)" opacity="0.15" />
        <circle cx="90" cy="80" r="0.5" fill="var(--division-accent)" opacity="0.2" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, var(--bg) 80%)' }} />
    </div>
  );
}

function DotsBg() {
  return <div className="hp-dots-bg" aria-hidden="true" />;
}

function GridBg() {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
      backgroundSize: '80px 80px',
      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
    }} />
  );
}

/* ── Hero Watermark — unique, dramatic ── */
function HeroWatermark({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Large SOCIOFI wordmark — center, diagonal, drifting */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 0 }}>
        <div
          className={reducedMotion ? undefined : 'hp-wm-drift'}
          style={{
            transform: 'translate(-50%, -55%) rotate(-20deg)',
            fontFamily: F.h,
            fontSize: 'clamp(72px, 14vw, 210px)',
            fontWeight: 900,
            letterSpacing: '-0.06em',
            whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg, var(--navy-bright) 0%, var(--teal-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0.09,
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          SOCIOFI
        </div>
      </div>
      {/* Network nodes SVG — bottom-right, partially cropped */}
      <div style={{ position: 'absolute', right: '-6%', bottom: '-10%', width: 'clamp(260px, 40vw, 540px)', zIndex: 0 }}>
        <div className={reducedMotion ? undefined : 'hp-wm'} style={{ opacity: 0.07 }}>
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hero-wm-g" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--navy-bright)" />
                <stop offset="100%" stopColor="var(--teal-light)" />
              </linearGradient>
            </defs>
            {/* Central hub */}
            <circle cx="150" cy="150" r="14" stroke="url(#hero-wm-g)" strokeWidth="2.5" />
            {/* Outer nodes */}
            <circle cx="68" cy="76" r="9" stroke="url(#hero-wm-g)" strokeWidth="2" />
            <circle cx="238" cy="58" r="7" stroke="url(#hero-wm-g)" strokeWidth="1.5" />
            <circle cx="262" cy="198" r="11" stroke="url(#hero-wm-g)" strokeWidth="2" />
            <circle cx="48" cy="234" r="8" stroke="url(#hero-wm-g)" strokeWidth="1.5" />
            <circle cx="192" cy="272" r="6" stroke="url(#hero-wm-g)" strokeWidth="1.5" />
            {/* Connections from hub */}
            <line x1="150" y1="150" x2="68" y2="76" stroke="url(#hero-wm-g)" strokeWidth="1" />
            <line x1="150" y1="150" x2="238" y2="58" stroke="url(#hero-wm-g)" strokeWidth="1" />
            <line x1="150" y1="150" x2="262" y2="198" stroke="url(#hero-wm-g)" strokeWidth="1" />
            <line x1="150" y1="150" x2="48" y2="234" stroke="url(#hero-wm-g)" strokeWidth="1" />
            <line x1="150" y1="150" x2="192" y2="272" stroke="url(#hero-wm-g)" strokeWidth="1" />
            {/* Cross-links */}
            <line x1="68" y1="76" x2="238" y2="58" stroke="url(#hero-wm-g)" strokeWidth="0.5" opacity="0.5" />
            <line x1="262" y1="198" x2="192" y2="272" stroke="url(#hero-wm-g)" strokeWidth="0.5" opacity="0.5" />
            {/* SocioFi double-chevron brand mark */}
            <path d="M22 118 L6 150 L22 182" stroke="url(#hero-wm-g)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 128 L26 150 L42 172" stroke="url(#hero-wm-g)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
          </svg>
        </div>
      </div>
      {/* Subtle "TECHNOLOGY" text — top-left, very faint */}
      <div style={{ position: 'absolute', top: '12%', left: '-1%', zIndex: 0 }}>
        <div
          className={reducedMotion ? undefined : 'hp-wm'}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'left center',
            fontFamily: F.m,
            fontSize: 'clamp(9px, 1.1vw, 14px)',
            fontWeight: 500,
            letterSpacing: '0.25em',
            whiteSpace: 'nowrap',
            color: 'var(--teal-light)',
            opacity: 0.12,
            userSelect: 'none',
          }}
        >
          INTELLIGENT SYSTEMS · AUTONOMOUS RESULTS
        </div>
      </div>
    </div>
  );
}

/* ── Section Watermark — per-section large word ── */
function SectionWatermark({ word, side = 'right' }: { word: string; side?: 'left' | 'right' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...(side === 'right' ? { right: '-1%' } : { left: '-1%' }),
        top: '50%',
        transform: 'translateY(-50%) rotate(-8deg)',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <div
        className="hp-wm"
        style={{
          fontFamily: F.h,
          fontSize: 'clamp(52px, 9vw, 130px)',
          fontWeight: 900,
          letterSpacing: '-0.06em',
          whiteSpace: 'nowrap',
          color: 'var(--text-primary)',
          opacity: 0.032,
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {word}
      </div>
    </div>
  );
}

type GeoVariant = 'diamonds' | 'hexagons' | 'rings' | 'triangles' | 'nodes' | 'brackets';

function GeometricBg({ variant, accent = 'var(--teal-light)' }: { variant: GeoVariant; accent?: string }) {
  const wrap: React.CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' };

  if (variant === 'diamonds') {
    const items = [
      { w: 54, top: '12%', left: '6%', cls: 'hp-geo-fa', delay: '0s', op: 0.09 },
      { w: 82, top: '60%', left: '88%', cls: 'hp-geo-fb', delay: '-6s', op: 0.06 },
      { w: 36, top: '36%', left: '84%', cls: 'hp-geo-fa', delay: '-11s', op: 0.11 },
      { w: 68, top: '76%', left: '12%', cls: 'hp-geo-fb', delay: '-17s', op: 0.07 },
    ];
    return (
      <div aria-hidden="true" style={wrap}>
        {items.map((it, i) => (
          <div key={i} style={{ position: 'absolute', top: it.top, left: it.left, width: it.w, height: it.w }}>
            <div className={it.cls} style={{ width: '100%', height: '100%', border: `1.5px solid ${accent}`, borderRadius: 3, animationDelay: it.delay, opacity: it.op }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'hexagons') {
    const hexPath = 'M50 2 L98 25 L98 75 L50 98 L2 75 L2 25 Z';
    return (
      <div aria-hidden="true" style={wrap}>
        <div style={{ position: 'absolute', top: '-8%', left: '-6%', width: 260, height: 260, opacity: 0.07 }}>
          <div className="hp-geo-cw" style={{ width: '100%', height: '100%' }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%' }}>
              <path d={hexPath} stroke={accent} strokeWidth="1.5" />
            </svg>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 310, height: 310, opacity: 0.05 }}>
          <div className="hp-geo-ccw" style={{ width: '100%', height: '100%' }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%' }}>
              <path d={hexPath} stroke={accent} strokeWidth="1" />
            </svg>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '28%', right: '7%', width: 130, height: 130, opacity: 0.09 }}>
          <div className="hp-geo-cw" style={{ width: '100%', height: '100%', animationDuration: '40s' }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%' }}>
              <path d={hexPath} stroke={accent} strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'rings') {
    return (
      <div aria-hidden="true" style={wrap}>
        <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
          {([{ r: 80, cls: 'hp-geo-ra' }, { r: 140, cls: 'hp-geo-rb' }, { r: 200, cls: 'hp-geo-rc' }] as const).map((ring, i) => (
            <div key={i} className={ring.cls} style={{ position: 'absolute', width: ring.r * 2, height: ring.r * 2, marginLeft: -ring.r, marginTop: -ring.r, borderRadius: '50%', border: `1px solid ${accent}` }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: '18%', left: '78%' }}>
          {([{ r: 38, cls: 'hp-geo-rb' }, { r: 72, cls: 'hp-geo-rc' }] as const).map((ring, i) => (
            <div key={i} className={ring.cls} style={{ position: 'absolute', width: ring.r * 2, height: ring.r * 2, marginLeft: -ring.r, marginTop: -ring.r, borderRadius: '50%', border: `1px solid ${accent}` }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'triangles') {
    const triPath = 'M50 5 L95 92 L5 92 Z';
    const items = [
      { top: '8%', left: '4%', size: 64, cls: 'hp-geo-ta', delay: '0s', op: 0.08 },
      { top: '66%', left: '88%', size: 90, cls: 'hp-geo-tb', delay: '-5s', op: 0.05 },
      { top: '22%', left: '90%', size: 46, cls: 'hp-geo-ta', delay: '-13s', op: 0.09 },
      { top: '52%', left: '7%', size: 52, cls: 'hp-geo-tb', delay: '-19s', op: 0.06 },
    ];
    return (
      <div aria-hidden="true" style={wrap}>
        {items.map((it, i) => (
          <div key={i} style={{ position: 'absolute', top: it.top, left: it.left, width: it.size, height: it.size }}>
            <div className={it.cls} style={{ width: '100%', height: '100%', animationDelay: it.delay, opacity: it.op }}>
              <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%' }}>
                <path d={triPath} stroke={accent} strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'nodes') {
    return (
      <div aria-hidden="true" style={wrap}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} viewBox="0 0 800 400" preserveAspectRatio="none">
          {([[120,80,320,200],[320,200,540,120],[540,120,680,280],[320,200,200,320],[200,320,400,360],[400,360,540,280],[540,280,680,280],[120,80,200,320]] as [number,number,number,number][]).map((l, i) => (
            <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={accent} strokeWidth="0.8" />
          ))}
          {([[120,80,7],[320,200,10],[540,120,6],[680,280,8],[200,320,7],[400,360,5],[540,280,8]] as [number,number,number][]).map((n, i) => (
            <circle key={i} cx={n[0]} cy={n[1]} r={n[2]} stroke={accent} strokeWidth="1.5" fill="none" />
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="hp-geo-scan" style={{ position: 'absolute', top: 0, bottom: 0, width: '28%', background: `linear-gradient(90deg, transparent, ${accent}18, transparent)` }} />
        </div>
      </div>
    );
  }

  if (variant === 'brackets') {
    const corners = [
      { top: '10%', left: '3%', rot: 'none' },
      { top: '10%', right: '3%', rot: 'scaleX(-1)' },
      { bottom: '10%', left: '3%', rot: 'scaleY(-1)' },
      { bottom: '10%', right: '3%', rot: 'scale(-1,-1)' },
    ];
    return (
      <div aria-hidden="true" style={wrap}>
        {corners.map((pos, i) => (
          <div key={i} className="hp-geo-fc" style={{ position: 'absolute', top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right, width: 52, height: 52, opacity: 0.11, animationDelay: `${i * -4}s` }}>
            <svg viewBox="0 0 52 52" fill="none" style={{ width: '100%', height: '100%', transform: pos.rot }}>
              <path d="M4 24 L4 4 L24 4" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
        <div className="hp-geo-fa" style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -26, marginTop: -26, width: 52, height: 52, opacity: 0.07 }}>
          <svg viewBox="0 0 52 52" fill="none" style={{ width: '100%', height: '100%' }}>
            <circle cx="26" cy="26" r="22" stroke={accent} strokeWidth="1.5" strokeDasharray="5 7" />
            <line x1="26" y1="4" x2="26" y2="48" stroke={accent} strokeWidth="0.8" />
            <line x1="4" y1="26" x2="48" y2="26" stroke={accent} strokeWidth="0.8" />
          </svg>
        </div>
      </div>
    );
  }

  return null;
}

/* ── Section Orbs — colored floating blobs per section ── */
function SectionOrbs({ c1, c2, c3, op1 = 0.07, op2 = 0.08, op3 = 0.04 }: {
  c1: string; c2: string; c3?: string; op1?: number; op2?: number; op3?: number;
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} aria-hidden="true">
      <div className="hp-orb-da" style={{ position: 'absolute', width: 'clamp(260px,36vw,540px)', height: 'clamp(260px,36vw,540px)', borderRadius: '50%', background: `radial-gradient(circle, ${c1}, transparent 70%)`, top: '-8%', left: '-6%', filter: 'blur(90px)', opacity: op1 }} />
      <div className="hp-orb-db" style={{ position: 'absolute', width: 'clamp(200px,28vw,420px)', height: 'clamp(200px,28vw,420px)', borderRadius: '50%', background: `radial-gradient(circle, ${c2}, transparent 70%)`, bottom: '-10%', right: '-4%', filter: 'blur(80px)', opacity: op2 }} />
      {c3 && <div className="hp-orb-dc" style={{ position: 'absolute', width: 'clamp(120px,16vw,240px)', height: 'clamp(120px,16vw,240px)', borderRadius: '50%', background: `radial-gradient(circle, ${c3}, transparent 70%)`, top: '40%', left: '50%', filter: 'blur(60px)', opacity: op3 }} />}
    </div>
  );
}

/* ── Running Gradient — animated color strip at section bottom ── */
function RunningGradient({ c1, c2, c3, slow }: { c1: string; c2: string; c3?: string; slow?: boolean }) {
  const stops = c3 ? `${c1}, ${c2}, ${c3}, ${c1}` : `${c1}, ${c2}, ${c1}`;
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 2, pointerEvents: 'none' }} aria-hidden="true">
      <div
        className={slow ? 'hp-rg-slow' : 'hp-rg'}
        style={{ height: '100%', background: `linear-gradient(90deg, ${stops})`, backgroundSize: '200% 100%' }}
      />
    </div>
  );
}

/* ── Sweep Beam — diagonal light beam sweeping across section ── */
function SweepBeam({ c1, c2, delay = '0s' }: { c1: string; c2: string; delay?: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} aria-hidden="true">
      <div
        className="hp-beam-a"
        style={{ position: 'absolute', top: '-20%', left: '-30%', width: '30%', height: '140%', background: `linear-gradient(90deg, transparent 0%, ${c1}14 40%, ${c2}20 50%, ${c1}14 60%, transparent 100%)`, filter: 'blur(32px)', animationDelay: delay }}
      />
      <div
        className="hp-beam-b"
        style={{ position: 'absolute', top: '-20%', left: '-30%', width: '20%', height: '140%', background: `linear-gradient(90deg, transparent 0%, ${c2}10 40%, ${c1}16 50%, ${c2}10 60%, transparent 100%)`, filter: 'blur(22px)', animationDelay: delay }}
      />
    </div>
  );
}

/* ── Hero Aurora — multi-color animated aurora backdrop ── */
function HeroAurora({ rm }: { rm: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} aria-hidden="true">
      <div className={rm ? undefined : 'hp-aurora-a'} style={{ position: 'absolute', width: 'clamp(380px,52vw,760px)', height: 'clamp(380px,52vw,760px)', borderRadius: '50%', background: 'radial-gradient(circle, #3A589E 0%, #59A392 45%, transparent 70%)', top: '-25%', left: '-5%', filter: 'blur(120px)', opacity: 0.16 }} />
      <div className={rm ? undefined : 'hp-aurora-b'} style={{ position: 'absolute', width: 'clamp(300px,42vw,620px)', height: 'clamp(300px,42vw,620px)', borderRadius: '50%', background: 'radial-gradient(circle, #72C4B2 0%, #4A6CB8 50%, transparent 70%)', bottom: '-20%', right: '-5%', filter: 'blur(100px)', opacity: 0.13 }} />
      <div className={rm ? undefined : 'hp-aurora-c'} style={{ position: 'absolute', width: 'clamp(180px,26vw,400px)', height: 'clamp(180px,26vw,400px)', borderRadius: '50%', background: 'radial-gradient(circle, #8B5CF6 0%, #3A589E 55%, transparent 70%)', top: '30%', right: '8%', filter: 'blur(80px)', opacity: 0.08 }} />
    </div>
  );
}

/* ── Floating Dots — non-uniform colored moving particles per section ── */
function FloatingDots({ colors, count = 20 }: { colors: string[]; count?: number }) {
  const dots = Array.from({ length: count }, (_, i) => {
    const h = ((i + 1) * 2654435761) >>> 0;
    return {
      top: h % 94,
      left: (h >> 7) % 96,
      size: 2 + (h >> 14) % 4,
      dur: 10 + (h >> 3) % 18,
      delay: -((h >> 19) % 22),
      variant: (h >> 1) % 5,
      colorIdx: (h >> 5) % colors.length,
      opacity: 0.15 + ((h >> 10) % 18) * 0.012,
    };
  });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} aria-hidden="true">
      {dots.map((d, i) => (
        <div
          key={i}
          className={`hp-dot-a${d.variant}`}
          style={{
            position: 'absolute',
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: colors[d.colorIdx],
            opacity: d.opacity,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function makeGradStyle(colors?: string): React.CSSProperties {
  return {
    background: colors ?? 'linear-gradient(135deg, var(--navy-bright) 0%, var(--teal-light) 60%, var(--teal-pale) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };
}

function StreamHeadline({ lines, gradientLine, gradientColors, rm }: {
  lines: string[]; gradientLine: number; gradientColors?: string; rm: boolean;
}) {
  const totalChars = lines.reduce((s, l) => s + l.length, 0);
  const [count, setCount] = useState(rm ? totalChars : 0);

  useEffect(() => {
    if (rm) { setCount(totalChars); return; }
    setCount(0);

    // Use setInterval (not rAF) — rAF is throttled/paused by mobile browsers
    // during heavy GPU paint, causing the typewriter to appear frozen.
    // setInterval runs on the JS thread and is unaffected by GPU load.
    const MS_PER_CHAR = 55; // slightly faster for better mobile feel
    let intervalId: ReturnType<typeof setInterval>;
    let started = false;

    function start() {
      if (started) return;
      started = true;
      let current = 0;
      intervalId = setInterval(() => {
        current = Math.min(current + 1, totalChars);
        setCount(current);
        if (current >= totalChars) clearInterval(intervalId);
      }, MS_PER_CHAR);
    }

    // If loading screen already dismissed, start immediately
    if (typeof window !== 'undefined' && (window as any).__sfLoadingDone) {
      start();
    } else {
      window.addEventListener('loading-done', start, { once: true });
      // Safety fallback: start after 4s regardless (handles missed events on mobile)
      const fallback = setTimeout(start, 4000);
      return () => {
        window.removeEventListener('loading-done', start);
        clearTimeout(fallback);
        clearInterval(intervalId);
      };
    }

    return () => {
      window.removeEventListener('loading-done', start);
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTyping = count < totalChars;
  const gradStyle = makeGradStyle(gradientColors);
  let remaining = count;

  return (
    <>
      {lines.map((line, idx) => {
        const show = Math.min(remaining, line.length);
        remaining = Math.max(0, remaining - line.length);
        const visible = line.slice(0, show);
        const isLastLine = idx === lines.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx === gradientLine
              ? <span style={gradStyle}>{visible}</span>
              : visible}
            {isLastLine && isTyping && <span className="hp-cursor" aria-hidden="true" />}
            {!isLastLine && <br />}
          </React.Fragment>
        );
      })}
    </>
  );
}

function highlightSubtext(text: string, highlights: string[]): React.ReactNode {
  if (!highlights.length) return text;
  const escaped = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    highlights.some(h => h.toLowerCase() === part.toLowerCase())
      ? <strong key={i} style={{ color: 'var(--teal-light)', fontWeight: 600, fontStyle: 'normal' }}>{part}</strong>
      : part
  );
}

/* ── Streaming subtext — word-by-word reveal, preserving highlights ── */
function StreamSubtext({ text, highlights, rm }: {
  text: string; highlights: string[]; rm: boolean;
}) {
  const [animating, setAnimating] = useState(rm);

  useEffect(() => {
    if (rm) return;
    // Start 1.4s after loading screen exits so headline has a moment to run
    function start() {
      setTimeout(() => setAnimating(true), 1400);
    }
    if (typeof window !== 'undefined' && (window as any).__sfLoadingDone) {
      start();
    } else {
      window.addEventListener('loading-done', start, { once: true });
    }
    return () => window.removeEventListener('loading-done', start);
  }, [rm]);

  if (rm) {
    return <>{highlightSubtext(text, highlights)}</>;
  }
  type Token = { content: string; isHighlight: boolean };
  const tokens: Token[] = [];
  if (!highlights.length) {
    text.split(' ').forEach(w => { if (w) tokens.push({ content: w, isHighlight: false }); });
  } else {
    const escaped = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    text.split(regex).forEach(part => {
      const isH = highlights.some(h => h.toLowerCase() === part.toLowerCase());
      if (isH) {
        tokens.push({ content: part, isHighlight: true });
      } else {
        part.split(' ').forEach(w => { if (w) tokens.push({ content: w, isHighlight: false }); });
      }
    });
  }
  return (
    <motion.span
      initial="hidden"
      animate={animating ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } } }}
      style={{ display: 'inline' }}
    >
      {tokens.map((token, i) => (
        <React.Fragment key={i}>
          {i > 0 && ' '}
          <motion.span
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.28 }}
            style={token.isHighlight ? { color: 'var(--teal-light)', fontWeight: 600, fontStyle: 'normal' } : {}}
          >
            {token.content}
          </motion.span>
        </React.Fragment>
      ))}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 1: ROTATING HERO
   ═══════════════════════════════════════════════════════════════════════ */

interface HeroSlide {
  id: string;
  badge: string;
  badgeDotColor: string;
  headline: string[];
  gradientLine: number;
  gradientColors?: string;
  subtext: string;
  primaryCta: { text: string; href: string };
  ghostCta: { text: string; href: string };
  subtextHighlights?: string[];
  accentColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'direct',
    badge: 'YOUR SOFTWARE DEVELOPMENT PARTNER',
    badgeDotColor: 'var(--teal-light)',
    headline: ['We Build Software That Runs Your Business.', 'Not Demos. Not Prototypes.', 'Production Systems.'],
    gradientLine: 2,
    subtext: 'Most development agencies take months and charge a fortune. We combine AI-powered development with human engineering oversight to deliver in weeks \u2014 at a fraction of the cost. Then we stick around to maintain it.',
    primaryCta: { text: 'Talk to Us About Your Project', href: '/contact' },
    ghostCta: { text: 'See What We\u2019ve Built', href: '/studio/portfolio' },
    subtextHighlights: ['in weeks', 'fraction of the cost', 'stick around'],
    accentColor: '#72C4B2',
  },
  {
    id: 'problem',
    badge: 'SOUND FAMILIAR?',
    badgeDotColor: 'rgba(220,130,100,0.6)',
    headline: ['Your Last Agency Took Three Months', 'and Charged a Fortune.', 'We\u2019ll Ship It in Three Weeks.'],
    gradientLine: 2,
    subtext: 'You\u2019ve been quoted $50K\u2013$200K and timelines that stretch past next quarter. You\u2019ve tried building it yourself with AI tools and hit a wall at deployment. There\u2019s a faster, cheaper, better way \u2014 and it doesn\u2019t require you to manage anyone.',
    primaryCta: { text: 'See How We\u2019re Different', href: '#solution' },
    ghostCta: { text: 'View Pricing', href: '/studio/pricing' },
    subtextHighlights: ['$50K\u2013$200K', 'hit a wall at deployment', 'faster, cheaper, better way'],
    accentColor: 'rgba(220,130,100,0.7)',
  },
  {
    id: 'ai-human',
    badge: 'AI + HUMAN ENGINEERING',
    badgeDotColor: '#4A6CB8',
    headline: ['AI Writes the Code.', 'Our Engineers Make Sure', 'It Doesn\u2019t Break.'],
    gradientLine: 2,
    subtext: 'AI development tools have gotten remarkably good at generating code. What they haven\u2019t gotten good at is architecture, security, debugging, and the hundred other things that separate a prototype from a product. We handle both sides.',
    primaryCta: { text: 'See Our Process', href: '/studio/process' },
    ghostCta: { text: 'How It Works', href: '#process' },
    subtextHighlights: ['architecture', 'security', 'debugging', 'prototype from a product'],
    accentColor: '#4A6CB8',
  },
  {
    id: 'agents',
    badge: 'AGENT-AS-A-SERVICE',
    badgeDotColor: '#8B5CF6',
    headline: ['Your Next Employee', 'Won\u2019t Be Human.', 'We Build the AI Agents That Work for You.'],
    gradientLine: 2,
    gradientColors: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
    subtext: 'Report generators. Customer service handlers. Data processors. Email managers. Individual AI agents \u2014 each trained for one specific job \u2014 that you subscribe to and deploy into your business. Starting from $199/month per agent.',
    primaryCta: { text: 'Browse AI Agents', href: '/agents/catalog' },
    ghostCta: { text: 'Learn About AaaS', href: '/aaas' },
    subtextHighlights: ['one specific job', '$199/month per agent'],
    accentColor: '#8B5CF6',
  },
  {
    id: 'outcome',
    badge: '45+ PRODUCTION AGENTS \u00b7 3 LIVE PLATFORMS',
    badgeDotColor: '#E8916F',
    headline: ['From Idea to Live Product.', 'In Weeks, Not Months.', 'At a Fraction of the Cost.'],
    gradientLine: 2,
    subtext: 'We\u2019ve built manufacturing intelligence platforms with 22 AI agents, enterprise data analysts with 12 specialist agents, and our own internal development system with 10 agents. We don\u2019t just talk about AI \u2014 we ship it. Every day.',
    primaryCta: { text: 'See What We\u2019ve Built', href: '/products' },
    ghostCta: { text: 'Book a Free Call', href: '/contact' },
    subtextHighlights: ['22 AI agents', '12 specialist agents', 'we ship it'],
    accentColor: '#72C4B2',
  },
];

const HERO_INTERVAL = 13000;
const HERO_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const QUICK_ROUTES = [
  { label: 'Building a product?', url: '/studio', color: '#72C4B2' },
  { label: 'Need AI agents?', url: '/agents', color: '#8B5CF6' },
  { label: 'Have live software?', url: '/services', color: '#4DBFA8' },
];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const directionRef = useRef<1 | -1>(1);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    // Detect mobile on mount (used to reduce GPU load)
    setIsMobile(window.innerWidth < 768);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    setProgress(0);
    const start = Date.now();
    let rafId: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / HERO_INTERVAL, 1);
      setProgress(p);
      if (p >= 1) {
        directionRef.current = 1;
        setCurrent(prev => (prev + 1) % HERO_SLIDES.length);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [current, paused, reducedMotion]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { directionRef.current = -1; setCurrent(p => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length); setProgress(0); }
      if (e.key === 'ArrowRight') { directionRef.current = 1; setCurrent(p => (p + 1) % HERO_SLIDES.length); setProgress(0); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const goTo = (i: number) => { directionRef.current = i > current ? 1 : -1; setCurrent(i); setProgress(0); };
  const slide = HERO_SLIDES[current];

  const renderSlideContent = (s: HeroSlide, rm: boolean) => (
    <>
      {/* Headline — streaming typewriter */}
      <h1 style={{ fontFamily: F.h, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 20 }}>
        <StreamHeadline lines={s.headline} gradientLine={s.gradientLine} gradientColors={s.gradientColors} rm={rm} />
      </h1>

      {/* Subtext — streams word-by-word after headline */}
      <p style={{ fontFamily: F.b, fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 560, marginInline: 'auto', marginBottom: 28 }}>
        <StreamSubtext text={s.subtext} highlights={s.subtextHighlights ?? []} rm={rm} />
      </p>

      {/* CTAs */}
      <motion.div
        className="hp-hero-ctas"
        initial={rm ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: HERO_EASE, delay: 1.0 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Link href={s.primaryCta.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 14, background: 'var(--gradient-brand)', color: '#fff', fontFamily: F.h, fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(58,88,158,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
          {s.primaryCta.text} <ArrowSvg color="#fff" />
        </Link>
        <Link href={s.ghostCta.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 14, background: 'transparent', border: '1.5px solid var(--border-hover)', color: 'var(--text-primary)', fontFamily: F.h, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}>
          {s.ghostCta.text}
        </Link>
      </motion.div>

    </>
  );

  return (
    <section
      ref={ref}
      className="hp-bg1"
      style={{ position: 'relative', height: '100dvh', minHeight: 680, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Homepage hero"
    >
      <GridBg />
      {/* Reduce floating dot count on mobile to avoid GPU overload */}
      <FloatingDots colors={['#72C4B2', '#4A6CB8', '#A3DFD2', '#8B5CF6']} count={isMobile ? 6 : 22} />
      {/* Blur orbs disabled on mobile — filter:blur(100px) on 900px elements freezes mobile GPUs */}
      {!isMobile && (
        <>
          <motion.div className="hp-orb-1" aria-hidden="true" style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, var(--navy), transparent 70%)', top: '-20%', left: '-15%', opacity: 'var(--glow-opacity)', filter: 'blur(100px)', y: orbY1 }} />
          <motion.div className="hp-orb-2" aria-hidden="true" style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, var(--teal), transparent 70%)', bottom: '-15%', right: '-10%', opacity: 'var(--glow-opacity)', filter: 'blur(100px)', y: orbY2 }} />
        </>
      )}
      <HeroWatermark reducedMotion={reducedMotion} />
      <HeroAurora rm={reducedMotion || isMobile} />

      {/* ── Main content area: fills space between nav and bottom bar ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: 80, position: 'relative', zIndex: 2 }}>
        <div className="hp-con" style={{ width: '100%' }}>
          <div style={{ maxWidth: 700, marginInline: 'auto', textAlign: 'center' }}>
            {/* Slide badge — small label, part of flow */}
            {reducedMotion ? null : (
              <motion.div
                key={`badge-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: HERO_EASE }}
                style={{ marginBottom: 20 }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 14px', background: 'rgba(89,163,146,0.04)', border: '1px solid rgba(89,163,146,0.12)', borderRadius: 100 }}>
                  <span style={{ fontFamily: F.m, fontSize: '0.6rem', fontWeight: 600, color: 'var(--teal-light)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{slide.badge}</span>
                </span>
              </motion.div>
            )}

            {/* Slide content — directional horizontal slide */}
            {reducedMotion ? (
              renderSlideContent(HERO_SLIDES[0], true)
            ) : (
              <AnimatePresence mode="wait" custom={directionRef.current}>
                <motion.div
                  key={current}
                  custom={directionRef.current}
                  variants={{
                    enter: (dir: any) => ({ opacity: 0, x: (dir as number) * 60 }),
                    center: { opacity: 1, x: 0 },
                    exit: (dir: any) => ({ opacity: 0, x: (dir as number) * -60 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: HERO_EASE }}
                  role="tabpanel"
                  aria-live="polite"
                >
                  {renderSlideContent(slide, false)}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar: pills + dots + progress — all in flow at bottom ── */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {/* Quick-route pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {QUICK_ROUTES.map(r => (
            <Link
              key={r.label}
              href={r.url}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '8px 20px',
                borderRadius: 100, border: `1px solid ${r.color}30`,
                background: `${r.color}08`, color: r.color,
                fontFamily: F.m, fontSize: '0.68rem', fontWeight: 500,
                letterSpacing: '0.02em', textDecoration: 'none',
                transition: 'background 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${r.color}15`; e.currentTarget.style.borderColor = `${r.color}50`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${r.color}08`; e.currentTarget.style.borderColor = `${r.color}30`; }}
            >
              {r.label}
            </Link>
          ))}
        </div>

        {/* Navigation — segmented progress bars */}
        <div
          role="tablist"
          aria-label="Hero slides"
          style={{ display: 'flex', gap: 5, alignItems: 'center' }}
        >
          {HERO_SLIDES.map((s, i) => (
            /* Tap-target wrapper: 44px tall touch area, slim 3px visual bar inside */
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? 52 : 28,
                height: 44,
                padding: '20px 0',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                WebkitAppearance: 'none',
                appearance: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'width 0.35s var(--ease)',
              }}
            >
              <span style={{
                display: 'block',
                width: '100%',
                height: 3,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {i === current && (
                  <span style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${progress * 100}%`,
                    background: s.accentColor,
                    borderRadius: 2,
                    transition: 'background-color 0.5s',
                    display: 'block',
                  }} />
                )}
                {i < current && (
                  <span style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.35)', borderRadius: 2, display: 'block' }} />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 2: THE PROBLEM
   ═══════════════════════════════════════════════════════════════════════ */
function Problem() {
  return (
    <section className="hp-sec hp-bg2">
      <DotsBg />
      <FloatingDots colors={['#DC6464', '#E8916F', '#F0B49A']} count={18} />
      <SectionOrbs c1="#DC6464" c2="#E8916F" op1={0.06} op2={0.07} />
      <SweepBeam c1="#DC6464" c2="#E8916F" />
      <GeometricBg variant="diamonds" accent="rgba(220,100,100,0.4)" />
      <SectionWatermark word="REALITY" side="right" />
      <RunningGradient c1="#DC6464" c2="#E8916F" c3="#F0B49A" />
      <div className="hp-con hp-center">
        <Fade>
          <SLabel color="rgba(220,100,100,0.6)" center>The Reality</SLabel>
          <H2 style={{ maxWidth: 620, marginInline: 'auto', marginBottom: 16 }}>You Need Software Built. Here&apos;s What You&apos;re Up Against.</H2>
          <P style={{ maxWidth: 600, marginInline: 'auto', marginBottom: 28 }}>You&apos;ve talked to agencies. You&apos;ve seen the proposals. Six-figure quotes, vague timelines, and a process designed for Fortune 500 companies — not someone who needs a working product.</P>
        </Fade>
        <Fade d={0.08}>
          <FounderQuote text="I spent two years as the non-technical founder trying to get my ideas built. Agencies quoted me $80K and four months. Freelancers disappeared after collecting the deposit. I built SocioFi so nobody else has to go through that." name="Arifur Rahman" title="CEO & Co-founder" highlight="I built SocioFi so nobody else has to go through that" />
        </Fade>
        <div className="hp-g3" style={{ textAlign: 'left' }}>
          {[
            { title: 'The Agency Route', price: '$50,000 – $200,000 · 3-6 months', body: "A team of twelve people, half of whom you'll never talk to. Weekly status meetings that don't tell you anything. And when it's done — if it's done on time — you'll need another contract just to keep it running." },
            { title: 'The DIY Route', price: 'Free tools · Unlimited frustration', body: "You tried Cursor, Bolt, or Replit. Got something working. Then tried to deploy it, connect a database, add authentication — and realized there's a reason software engineers exist.", link: { label: 'We rescue stuck projects', url: '/studio/services/rescue-ship' } },
            { title: 'The Freelancer Route', price: '$10K-40K · Hope for the best', body: "Cheaper than an agency, but you're managing a developer. Reviewing code you don't understand. Hoping they'll respond next month when something breaks. And if they disappear — you're starting over." },
          ].map((c, i) => (
            <Fade key={c.title} d={0.12 + i * 0.08}>
              <div className="hp-card hp-card-red" style={{ height: '100%' }}>
                <h3 style={{ fontFamily: F.h, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.01em' }}>{c.title}</h3>
                <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'rgba(220,100,100,0.6)', marginBottom: 14, letterSpacing: '0.02em' }}>{c.price}</p>
                <p style={{ fontFamily: F.b, fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{c.body}</p>
                {c.link && <Link href={c.link.url} style={{ display: 'block', marginTop: 14, fontFamily: F.b, fontSize: '0.84rem', color: 'var(--teal-light)', textDecoration: 'none' }}>{c.link.label} →</Link>}
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 3: THE SOLUTION
   ═══════════════════════════════════════════════════════════════════════ */
function Solution() {
  return (
    <section className="hp-sec hp-bg1">
      <ConstellationBg />
      <FloatingDots colors={['#59A392', '#72C4B2', '#4A6CB8', '#A3DFD2']} count={20} />
      <SectionOrbs c1="#59A392" c2="#4A6CB8" c3="#72C4B2" op1={0.07} op2={0.06} op3={0.04} />
      <SweepBeam c1="#59A392" c2="#72C4B2" delay="4s" />
      <GeometricBg variant="hexagons" accent="var(--teal-light)" />
      <SectionWatermark word="BUILD" side="left" />
      <RunningGradient c1="#59A392" c2="#72C4B2" c3="#4A6CB8" slow />
      <div className="hp-con hp-center">
        <Fade>
          <SLabel center>A Different Approach</SLabel>
          <H2 style={{ maxWidth: 620, marginInline: 'auto', marginBottom: 16 }}>AI Handles the Heavy Lifting. Our Engineers Make Sure It Works.</H2>
          <P style={{ maxWidth: 600, marginInline: 'auto', marginBottom: 40 }}>Let AI do what it&apos;s good at — generating code fast. Then put experienced engineers in charge of everything else.</P>
        </Fade>
        <div className="hp-g2" style={{ marginBottom: 32, textAlign: 'left' }}>
          <Fade>
            <div style={{ background: 'color-mix(in srgb, var(--teal) 4%, var(--bg-card))', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 36px' }}>
              <h3 style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 800, color: 'var(--teal-light)', marginBottom: 20 }}>What AI Does For Your Project</h3>
              {['Writes the initial codebase in hours, not weeks', 'Generates tests, documentation, and boilerplate', 'Handles repetitive tasks that would take developers days', 'Powers the individual AI agents we deploy for your operations', "Result: your project moves at a pace traditional agencies can't match"].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <Dot color="var(--teal-light)" size={6} />
                  <span style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </Fade>
          <Fade d={0.1}>
            <div style={{ background: 'color-mix(in srgb, var(--navy) 4%, var(--bg-card))', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 36px' }}>
              <h3 style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-bright)', marginBottom: 20 }}>What Our Engineers Do</h3>
              {['Design the architecture so it scales when your business grows', 'Review every line of AI-generated code before it ships', 'Handle deployment, hosting, databases, and security', 'Debug the problems AI creates (because it does create them)', 'Maintain your software after launch', "Talk to you in plain English about what's happening and why"].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <Dot color="var(--navy-bright)" size={6} />
                  <span style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </Fade>
        </div>
        <Fade d={0.15}>
          <FounderQuote text="Every AI coding tool can generate a React component. None of them can tell you why your database schema will break at ten thousand users, or why your authentication flow has a security hole. That's what engineers do. That's what we do." name="Kamrul Hasan" title="CTO & Co-founder" highlight="That's what engineers do. That's what we do." />
          <P style={{ fontSize: '0.88rem', marginTop: -8 }}>Every piece of code that reaches your product has been reviewed by a human engineer. Not spot-checked. Reviewed. <Link href="/studio/process" style={{ color: 'var(--teal-light)', textDecoration: 'none' }}>See our process →</Link></P>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 4: HOW IT WORKS
   ═══════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'We Listen', body: "You tell us what you need \u2014 in business terms, not technical terms. What problem are you solving? Who\u2019s using it? What does success look like? We ask the right questions so you don\u2019t have to know the right answers. 30 minutes. Costs you nothing.", link: { label: 'Free call', url: '/contact' } },
    { n: '02', title: 'We Plan', body: "We design the architecture and write a plain-English proposal: what we\u2019ll build, how long it takes, exactly what it costs. You approve before we write a single line of code." },
    { n: '03', title: 'We Build', body: "AI agents handle code generation. Our engineers handle architecture, review, testing, and deployment. You get weekly updates \u2014 written for humans, not developers.", link: { label: 'Studio', url: '/studio' } },
    { n: '04', title: 'You Launch', body: "We deploy to production. Real hosting, real domain, real SSL, real monitoring. Your customers can use it. If anything isn\u2019t right, we fix it before the final invoice.", link: { label: 'Cloud', url: '/cloud' } },
    { n: '05', title: 'We Stay', body: "Software isn\u2019t a one-time thing. Our maintenance plans mean there\u2019s always a team behind your product \u2014 the same team that built it. No handoff. No starting over.", link: { label: 'Services', url: '/services' } },
  ];

  return (
    <section className="hp-sec hp-bg2">
      <FloatingDots colors={['#3A589E', '#4A6CB8', '#5BB5E0']} count={16} />
      <SectionOrbs c1="#3A589E" c2="#4A6CB8" c3="#5BB5E0" op1={0.07} op2={0.06} op3={0.04} />
      <SweepBeam c1="#3A589E" c2="#5BB5E0" />
      <GeometricBg variant="brackets" accent="var(--navy-bright)" />
      <SectionWatermark word="PROCESS" side="right" />
      <RunningGradient c1="#3A589E" c2="#5BB5E0" c3="#4A6CB8" />
      <div className="hp-con hp-center">
        <Fade>
          <SLabel center>How It Works</SLabel>
          <H2 style={{ maxWidth: 620, marginInline: 'auto', marginBottom: 48 }}>From Your Idea to a Running Product. Here&apos;s Exactly What Happens.</H2>
        </Fade>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'left' }}>
          {steps.map((s, i) => (
            <Fade key={s.n} d={i * 0.08}>
              <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 20, paddingBottom: 32, marginBottom: 32, borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.h, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>{s.n}</div>
                <div>
                  <h3 style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    {s.title}
                    {s.link && <Link href={s.link.url} style={{ fontFamily: F.m, fontSize: '0.62rem', color: 'var(--teal-light)', textDecoration: 'none', marginLeft: 12, letterSpacing: '0.04em', fontWeight: 500 }}>[{s.link.label}]</Link>}
                  </h3>
                  <P style={{ fontSize: '0.88rem' }}>{s.body}</P>
                </div>
              </div>
            </Fade>
          ))}
        </div>
        <Fade>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {[{ label: 'Studio builds it', url: '/studio', color: C.studio }, { label: 'Cloud runs it', url: '/cloud', color: C.cloud }, { label: 'Services maintains it', url: '/services', color: C.services }].map((f, i, a) => (
              <React.Fragment key={f.label}>
                <Link href={f.url} className="hp-pill" style={{ '--pill-accent': f.color, borderColor: `${f.color}30`, color: f.color } as React.CSSProperties}>{f.label}</Link>
                {i < a.length - 1 && <span style={{ color: 'var(--text-muted)', fontFamily: F.m, fontSize: '0.68rem' }}>&middot;</span>}
              </React.Fragment>
            ))}
            <span style={{ fontFamily: F.b, fontSize: '0.72rem', color: 'var(--text-muted)' }}>— One team. One codebase.</span>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 5: WHAT WE BUILD
   ═══════════════════════════════════════════════════════════════════════ */
function WhatWeBuild() {
  const items = [
    { name: 'AI Agents for Your Business', url: '/agents', accent: C.agents, featured: true, body: "Your business has tasks that eat human time every day. Report generation. Customer inquiries. Data entry. Email triage. Lead qualification. We build individual AI agents \u2014 each trained for one job \u2014 that handle these around the clock. Subscribe, deploy, scale.", linkLabel: 'Browse agents' },
    { name: 'Custom Software', url: '/studio', accent: C.studio, body: "Web apps, SaaS platforms, customer portals \u2014 designed for your business. Most launch in 2-6 weeks." },
    { name: 'Internal Tools', url: '/studio/services/internal-tools', accent: C.studio, body: "Replace the spreadsheets your team has outgrown. Dashboards, admin panels, reporting tools." },
    { name: 'Automation', url: '/studio/services/automation-integration', accent: C.studio, body: "Connect tools that don\u2019t talk to each other. Automate workflows your team does manually." },
    { name: 'Rescue & Ship', url: '/studio/services/rescue-ship', accent: C.studio, body: "Started with AI tools and got stuck? We take over. Code review, bug fixes, deployment." },
    { name: 'Managed Hosting', url: '/cloud', accent: C.cloud, body: "Servers, databases, SSL, backups, scaling \u2014 managed by engineers who know your code." },
    { name: 'Maintenance', url: '/services', accent: C.services, body: "Bug fixes, security patches, features, optimization. The team that built it keeps it running." },
  ];

  return (
    <section className="hp-sec hp-bg1">
      <DotsBg />
      <FloatingDots colors={['#72C4B2', '#8B5CF6', '#A3DFD2', '#E8916F']} count={20} />
      <SectionOrbs c1="#72C4B2" c2="#8B5CF6" op1={0.07} op2={0.06} />
      <SweepBeam c1="#72C4B2" c2="#8B5CF6" delay="6s" />
      <GeometricBg variant="triangles" accent="var(--teal-light)" />
      <SectionWatermark word="SYSTEMS" side="left" />
      <RunningGradient c1="#72C4B2" c2="#8B5CF6" slow />
      <div className="hp-con hp-center">
        <Fade>
          <SLabel center>What We Build</SLabel>
          <H2 style={{ maxWidth: 480, marginInline: 'auto', marginBottom: 12 }}>Whatever Your Business Needs.</H2>
        </Fade>
        <Fade d={0.06}>
          <FounderQuote text="We stopped saying 'we build apps.' We build systems that run businesses. Some of those systems are software. Some are AI agents. Most are both." name="Arifur Rahman" title="CEO" highlight="We build systems that run businesses" />
        </Fade>
        <div className="hp-g3" style={{ textAlign: 'left' }}>
          {items.map((it, i) => (
            <Fade key={it.name} d={0.08 + i * 0.05} style={it.featured ? { gridColumn: 'span 2' } : {}}>
              <Link href={it.url} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div className={`hp-card ${it.accent === C.agents ? 'hp-card-v' : ''}`} style={{ height: '100%', ...(it.featured ? { background: `color-mix(in srgb, ${it.accent} 4%, var(--bg-card))`, borderColor: `${it.accent}20` } : {}) }}>
                  <h3 style={{ fontFamily: F.h, fontSize: it.featured ? '1.1rem' : '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>{it.name}</h3>
                  <p style={{ fontFamily: F.b, fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{it.body}</p>
                  {it.linkLabel && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontFamily: F.m, fontSize: '0.66rem', color: it.accent, letterSpacing: '0.04em' }}>{it.linkLabel} <ArrowSvg size={12} color={it.accent} /></span>}
                </div>
              </Link>
            </Fade>
          ))}
        </div>
        <Fade d={0.3}>
          <P style={{ marginTop: 32, fontStyle: 'italic', fontSize: '0.85rem' }}>Not sure which you need? Most clients start with a conversation. <Link href="/contact" style={{ color: 'var(--teal-light)', textDecoration: 'none' }}>Let&apos;s figure it out →</Link></P>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 6: THE AGENTS — AaaS
   ═══════════════════════════════════════════════════════════════════════ */
function AgentsSection() {
  const agents = [
    { name: 'Report Generator', body: "Auto-generates business reports on schedule. Sales, financial, inventory." },
    { name: 'Customer Service', body: "First-line inquiries across email, chat, tickets. Routes complex issues." },
    { name: 'Data Processor', body: "Ingests from spreadsheets, emails, forms. Cleans, transforms, loads." },
    { name: 'Email Triage', body: "Reads, categorizes, drafts responses, flags urgent, routes to right person." },
    { name: 'Lead Qualifier', body: "Scores leads, enriches with public data, routes hot, nurtures cold." },
    { name: 'Document Processor', body: "Reads contracts, invoices, forms. Extracts, validates, files." },
  ];

  return (
    <section className="hp-sec hp-bg2" style={{ position: 'relative' }}>
      <FloatingDots colors={['#8B5CF6', '#A78BFA', '#6BA3E8', '#C4B5FD']} count={22} />
      <SectionOrbs c1="#8B5CF6" c2="#7C3AED" c3="#6BA3E8" op1={0.09} op2={0.08} op3={0.04} />
      <SweepBeam c1="#8B5CF6" c2="#6BA3E8" />
      <GeometricBg variant="nodes" accent="#8B5CF6" />
      <SectionWatermark word="AGENTS" side="right" />
      <RunningGradient c1="#8B5CF6" c2="#7C3AED" c3="#6BA3E8" />
      <div className="hp-con hp-center">
        <Fade><SLabel color={C.agents} center>Agent-as-a-Service</SLabel></Fade>
        <Fade d={0.08}>
          <H2 style={{ maxWidth: 640, marginInline: 'auto', marginBottom: 16 }}>AI Agents That Do the Work Your Team Shouldn&apos;t Have To.</H2>
          <P style={{ maxWidth: 600, marginInline: 'auto', marginBottom: 36 }}>Purpose-built agents — each designed for one specific job, connected to your data, configured to your rules, running around the clock.</P>
        </Fade>
        <div className="hp-g3" style={{ marginBottom: 32, textAlign: 'left' }}>
          {agents.map((a, i) => (
            <Fade key={a.name} d={0.12 + i * 0.06}>
              <div className="hp-card hp-card-v" style={{ padding: '26px 22px', borderRadius: 16 }}>
                <Dot color={C.agents} size={8} />
                <h3 style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: '12px 0 8px', letterSpacing: '-0.01em' }}>{a.name}</h3>
                <p style={{ fontFamily: F.b, fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{a.body}</p>
              </div>
            </Fade>
          ))}
        </div>
        <Fade d={0.15}><FounderQuote text="We tested this internally first. We deployed our own data processing agent and it replaced fourteen hours of manual work per week — in the first month. That's when we knew this had to be a product, not just an internal tool." name="Kamrul Hasan" title="CTO" highlight="fourteen hours of manual work per week" /></Fade>
        <div className="hp-g3" style={{ marginBottom: 32 }}>
          {[{ n: '1', t: 'Choose', b: 'Pick from the catalog or describe what you need' }, { n: '2', t: 'Connect', b: 'We integrate with your existing tools and systems' }, { n: '3', t: 'Deploy', b: 'Your agent goes live. Add more as you grow.' }].map((s, i) => (
            <Fade key={s.n} d={0.2 + i * 0.06}>
              <div style={{ padding: 28, borderRadius: 16, background: 'color-mix(in srgb, #8B5CF6 3%, var(--bg-card))', border: '1px solid color-mix(in srgb, #8B5CF6 8%, transparent)' }}>
                <div style={{ fontFamily: F.h, fontSize: '1.8rem', fontWeight: 800, color: C.agents, opacity: 0.3, marginBottom: 8 }}>{s.n}</div>
                <h4 style={{ fontFamily: F.h, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{s.t}</h4>
                <p style={{ fontFamily: F.b, fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{s.b}</p>
              </div>
            </Fade>
          ))}
        </div>
        <Fade d={0.25}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, borderRadius: 16, background: 'color-mix(in srgb, #8B5CF6 4%, var(--bg-card))', border: '1px solid color-mix(in srgb, #8B5CF6 10%, transparent)', padding: '24px 32px' }}>
            <div><span style={{ fontFamily: F.h, fontSize: '1.8rem', fontWeight: 800, color: C.agents }}>$199</span><span style={{ fontFamily: F.b, fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 6 }}>/mo per agent</span></div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>No long-term contracts. Cancel anytime.</p>
              <Link href="/agents/pricing" style={{ fontFamily: F.m, fontSize: '0.66rem', color: C.agents, textDecoration: 'none', letterSpacing: '0.04em' }}>Full pricing <ArrowSvg size={12} color={C.agents} /></Link>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 7: THE NUMBERS
   ═══════════════════════════════════════════════════════════════════════ */
function Numbers() {
  const rows = [
    { l: 'Timeline', a: '3-6 months', f: '2-4 months', h: 'Ongoing', s: '2-6 weeks' },
    { l: 'Cost', a: '$50K-200K', f: '$10K-40K', h: '$80K-150K/yr', s: '$3K-20K' },
    { l: 'After Launch', a: 'New contract', f: 'Hope they respond', h: 'You manage', s: 'Same team' },
    { l: 'AI-Powered', a: 'Rarely', f: 'Sometimes', h: 'Depends', s: 'Every project' },
    { l: 'AI Agents', a: 'No', f: 'No', h: 'No', s: 'Yes' },
    { l: 'Code Ownership', a: 'Sometimes', f: 'Usually', h: 'Yes', s: 'Always — 100%' },
  ];

  return (
    <section className="hp-sec hp-bg1">
      <ConstellationBg />
      <FloatingDots colors={['#3A589E', '#59A392', '#72C4B2', '#4A6CB8']} count={16} />
      <SectionOrbs c1="#3A589E" c2="#59A392" op1={0.06} op2={0.07} />
      <SweepBeam c1="#3A589E" c2="#59A392" delay="3s" />
      <GeometricBg variant="rings" accent="var(--navy-bright)" />
      <SectionWatermark word="COMPARE" side="left" />
      <RunningGradient c1="#3A589E" c2="#59A392" slow />
      <div className="hp-con hp-center">
        <Fade>
          <SLabel center>The Math</SLabel>
          <H2 style={{ maxWidth: 520, marginInline: 'auto', marginBottom: 16 }}>Why Businesses Choose Us Over Agencies.</H2>
        </Fade>
        <Fade d={0.06}><FounderQuote text="We don't win on being cheap. We win on being fast, transparent, and still being there six months after launch. That's the combination nobody else offers." name="Arifur Rahman" title="CEO" highlight="fast, transparent, and still being there six months after launch" /></Fade>
        <Fade d={0.1}>
          <div style={{ overflowX: 'auto', borderRadius: 20, border: '1px solid var(--border)' }}>
            <table className="hp-table">
              <thead><tr style={{ background: 'var(--bg-card)' }}><th style={{ minWidth: 120 }}></th><th>Traditional Agency</th><th>Freelancer</th><th>In-House</th><th className="hp-sf hp-sf-bg">SocioFi</th></tr></thead>
              <tbody>{rows.map((r, i) => (
                <tr key={r.l} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-card)' }}>
                  <td>{r.l}</td><td>{r.a}</td><td>{r.f}</td><td>{r.h}</td>
                  <td className="hp-sf hp-sf-bg">{r.l === 'After Launch' ? <Link href="/services" style={{ color: 'var(--teal-light)', textDecoration: 'none' }}>{r.s}</Link> : r.l === 'AI Agents' ? <Link href="/agents" style={{ color: 'var(--teal-light)', textDecoration: 'none' }}>{r.s}</Link> : r.s}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Fade>
        <Fade d={0.15}><P style={{ marginTop: 24, maxWidth: 600, marginInline: 'auto' }}>We're not the cheapest for every project. But factor in speed, quality, ongoing support, and zero management overhead — the math works differently. <Link href="/studio/pricing" style={{ color: 'var(--teal-light)', textDecoration: 'none' }}>Full pricing →</Link></P></Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 8: PROOF — Products
   ═══════════════════════════════════════════════════════════════════════ */
function ProductsSection() {
  const products = [
    { name: 'FabricxAI', count: '22', label: 'Production Agents', desc: 'Manufacturing intelligence for the garment industry. Quality control, production tracking, supply chain, analytics. Running in factories.', countColor: C.products },
    { name: 'NEXUS ARIA', count: '12', label: 'Specialist Agents', desc: 'Enterprise data analyst. Role-personalized reports, anomaly detection, continuous analysis across financial, marketing, HR data.', countColor: 'var(--navy-bright)' },
    { name: 'DevBridge OS', count: '10', label: 'Internal Agents', desc: 'Our development platform. Agent orchestration, code generation, quality gates. This is why we deliver in weeks.', countColor: C.studio },
  ];

  return (
    <section className="hp-sec hp-bg2">
      <DotsBg />
      <FloatingDots colors={['#E8916F', '#E8B84D', '#F0B49A', '#3A589E']} count={18} />
      <SectionOrbs c1="#E8916F" c2="#3A589E" c3="#E8B84D" op1={0.08} op2={0.06} op3={0.03} />
      <SweepBeam c1="#E8916F" c2="#3A589E" delay="8s" />
      <GeometricBg variant="diamonds" accent="#E8916F" />
      <SectionWatermark word="PROOF" side="right" />
      <RunningGradient c1="#E8916F" c2="#E8B84D" c3="#3A589E" />
      <div className="hp-con hp-center">
        <Fade><SLabel color={C.products} center>Built by SocioFi</SLabel></Fade>
        <Fade d={0.08}><H2 style={{ maxWidth: 520, marginInline: 'auto', marginBottom: 36 }}>Our Platforms. Running in Production.</H2></Fade>
        <div className="hp-g3" style={{ marginBottom: 32, textAlign: 'left' }}>
          {products.map((p, i) => (
            <Fade key={p.name} d={0.12 + i * 0.08}>
              <div className="hp-card hp-card-p" style={{ height: '100%' }}>
                <div style={{ fontFamily: F.h, fontSize: '3rem', fontWeight: 800, color: p.countColor, lineHeight: 1, marginBottom: 4 }}>{p.count}</div>
                <div style={{ fontFamily: F.m, fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{p.label}</div>
                <h3 style={{ fontFamily: F.h, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.01em' }}>{p.name}</h3>
                <p style={{ fontFamily: F.b, fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
            </Fade>
          ))}
        </div>
        <Fade d={0.2}><FounderQuote text="We built FabricxAI because we needed to prove — to ourselves first — that multi-agent systems could work in production. Not in a demo. In a factory, processing real data, making real decisions. Once we proved that, everything else became possible." name="Kamrul Hasan" title="CTO" highlight="multi-agent systems could work in production" /></Fade>
        <Fade d={0.25}>
          <div className="hp-g3">
            {[{ n: '45+', l: 'Production Agents' }, { n: '3', l: 'Live Platforms', url: '/products' }, { n: 'Daily', l: 'Used By Our Team' }].map(m => (
              <div key={m.l} style={{ padding: 28, borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ ...gradTextStyle, fontFamily: F.h, fontSize: '2rem', fontWeight: 800, display: 'inline-block' }}>{m.n}</div>
                <div style={{ fontFamily: F.m, fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.url ? <Link href={m.url} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{m.l}</Link> : m.l}</div>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 9: THE BIGGER PICTURE
   ═══════════════════════════════════════════════════════════════════════ */
function BiggerPicture() {
  return (
    <section className="hp-sec hp-bg1">
      <ConstellationBg />
      <FloatingDots colors={['#3A589E', '#72C4B2', '#8B5CF6', '#4A6CB8']} count={18} />
      <SectionOrbs c1="#3A589E" c2="#72C4B2" c3="#8B5CF6" op1={0.06} op2={0.07} op3={0.03} />
      <SweepBeam c1="#3A589E" c2="#72C4B2" />
      <GeometricBg variant="triangles" accent="var(--navy-bright)" />
      <SectionWatermark word="FUTURE" side="left" />
      <RunningGradient c1="#3A589E" c2="#72C4B2" c3="#8B5CF6" slow />
      <div className="hp-con hp-center">
        <Fade><SLabel center>Where This Is Heading</SLabel></Fade>
        <Fade d={0.08}>
          <H2 style={{ maxWidth: 640, marginInline: 'auto', marginBottom: 24 }}>The Software Industry Is Changing. We&apos;re Already Building What Comes Next.</H2>
          <P style={{ maxWidth: 680, marginInline: 'auto', marginBottom: 28, fontSize: '0.95rem', lineHeight: 1.8 }}>For twenty years, businesses bought software-as-a-service — tools that store data and follow rules. That model is evolving. The next generation doesn&apos;t just store data. It analyzes, decides, and acts. Individual AI agents handling specific tasks — working as part of your team.</P>
        </Fade>
        <Fade d={0.14}>
          <P style={{ maxWidth: 680, marginInline: 'auto', marginBottom: 32 }}>
            SocioFi is substance. Our <Link href="/agents" style={{ color: 'var(--teal-light)', textDecoration: 'none' }}>Agents division</Link> deploys agents that generate real reports, handle real inquiries, process real data. <Link href="/studio" style={{ color: C.studio, textDecoration: 'none' }}>Studio</Link> builds the software. <Link href="/cloud" style={{ color: C.cloud, textDecoration: 'none' }}>Cloud</Link> hosts it. <Link href="/services" style={{ color: C.services, textDecoration: 'none' }}>Services</Link> maintains it.
          </P>
        </Fade>
        <Fade d={0.22}>
          <FounderQuote text="Everyone's talking about AI agents. We've been building them for two years. Forty-five agents in production. Three live systems. The conversation has finally caught up to what we've been doing." name="Arifur Rahman" title="CEO" highlight="Forty-five agents in production. Three live systems." />
          <Link href="/aaas" style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--teal-light)', textDecoration: 'none', letterSpacing: '0.04em' }}>Read more about the AaaS transition <ArrowSvg size={12} /></Link>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 10: EIGHT DIVISIONS
   ═══════════════════════════════════════════════════════════════════════ */
function DivisionsSection() {
  const divs = [
    { name: 'Studio', slug: 'studio', url: '/studio', accent: C.studio, desc: "We build your software. Custom products, tools, automation." },
    { name: 'Agents', slug: 'agents', url: '/agents', accent: C.agents, desc: "AI agents for your business. Subscribe, deploy, scale. Agent-as-a-Service." },
    { name: 'Services', slug: 'services', url: '/services', accent: C.services, desc: "Maintain what\u2019s live. Bugs, security, performance, features." },
    { name: 'Cloud', slug: 'cloud', url: '/cloud', accent: C.cloud, desc: "Hosting, databases, deployments, scaling, backups." },
    { name: 'Labs', slug: 'labs', url: '/labs', accent: C.labs, desc: "Research. Agent architecture, methodology, open source." },
    { name: 'Products', slug: 'products', url: '/products', accent: C.products, desc: "FabricxAI, NEXUS ARIA, DevBridge. Our own platforms." },
    { name: 'Academy', slug: 'academy', url: '/academy', accent: C.academy, desc: "Courses and workshops for founders and leaders." },
    { name: 'Ventures', slug: 'ventures', url: '/ventures', accent: C.ventures, desc: "Development for equity or revenue share." },
  ];

  return (
    <section className="hp-sec hp-bg2">
      <FloatingDots colors={['#72C4B2', '#8B5CF6', '#E8B84D', '#6BA3E8', '#E8916F']} count={24} />
      <SectionOrbs c1="#72C4B2" c2="#8B5CF6" c3="#E8B84D" op1={0.07} op2={0.06} op3={0.03} />
      <SweepBeam c1="#72C4B2" c2="#8B5CF6" delay="5s" />
      <GeometricBg variant="hexagons" accent="var(--teal-light)" />
      <SectionWatermark word="TOGETHER" side="right" />
      <RunningGradient c1="#72C4B2" c2="#8B5CF6" c3="#E8B84D" />
      <div className="hp-con hp-center">
        <Fade>
          <SLabel center>One Company. Eight Divisions.</SLabel>
          <H2 style={{ maxWidth: 560, marginInline: 'auto', marginBottom: 16 }}>Build, Run, and Scale Software. Under One Roof.</H2>
          <P style={{ maxWidth: 600, marginInline: 'auto', marginBottom: 24 }}>Most companies hire one agency to build, another to host, another to maintain. Then spend half their time coordinating. We built all of it into one company.</P>
        </Fade>
        <Fade d={0.06}><FounderQuote text="The reason we structured SocioFi as eight divisions instead of one generic agency is accountability. When the team that builds your software also hosts it and maintains it — nobody can point fingers. If something breaks, it's on us. All of us. That's the point." name="Arifur Rahman" title="CEO" highlight="nobody can point fingers" /></Fade>
        <div className="hp-g4" style={{ marginBottom: 48, textAlign: 'left' }}>
          {divs.map((d, i) => (
            <Fade key={d.name} d={0.1 + i * 0.04}>
              <Link href={d.url} className="hp-div-card" style={{ '--div-accent': d.accent } as React.CSSProperties}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LogoMark division={d.slug} size="sm" />
                </div>
                <h3 style={{ fontFamily: F.h, fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: '14px 0 6px', letterSpacing: '-0.01em' }}>{d.name}</h3>
                <p style={{ fontFamily: F.b, fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{d.desc}</p>
              </Link>
            </Fade>
          ))}
        </div>
        <Fade>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[{ label: 'Studio', url: '/studio', color: C.studio, verb: 'builds' }, { label: 'Agents', url: '/agents', color: C.agents, verb: 'thinks' }, { label: 'Cloud', url: '/cloud', color: C.cloud, verb: 'runs' }, { label: 'Services', url: '/services', color: C.services, verb: 'maintains' }].map((f, i, a) => (
              <React.Fragment key={f.label}>
                <div style={{ textAlign: 'center' }}>
                  <Link href={f.url} className="hp-pill" style={{ '--pill-accent': f.color, borderColor: `${f.color}40`, color: f.color, marginBottom: 4 } as React.CSSProperties}>{f.label}</Link>
                  <div style={{ fontFamily: F.m, fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: 4 }}>{f.verb}</div>
                </div>
                {i < a.length - 1 && <span style={{ color: 'var(--text-muted)', fontFamily: F.m, fontSize: '0.72rem', marginTop: -16 }}>&rarr;</span>}
              </React.Fragment>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 11: TRUST SIGNALS
   ═══════════════════════════════════════════════════════════════════════ */
function TrustSignals() {
  const items = [
    { title: 'You own everything.', body: "Every line of code. Every agent configuration. It\u2019s yours. No lock-in.", url: '/legal' },
    { title: 'We speak your language.', body: "No jargon. Every update written for the person running the business.", url: '/academy' },
    { title: 'Real cost upfront.', body: "You know what you\u2019re paying before we start. No surprises.", url: '/studio/pricing' },
    { title: 'Honest about limits.', body: "If your project doesn\u2019t benefit from AI, we\u2019ll tell you. We\u2019d rather lose a project than deliver the wrong solution." },
    { title: 'Same team maintains it.', body: "No handoff. The engineers who wrote your code keep it running.", url: '/services/how-it-works' },
    { title: "We\u2019ve built this before.", body: "Three platforms. Forty-five agents. Running in production.", url: '/products' },
  ];

  return (
    <section className="hp-sec hp-bg1">
      <DotsBg />
      <FloatingDots colors={['#72C4B2', '#4A6CB8', '#A3DFD2']} count={16} />
      <SectionOrbs c1="#72C4B2" c2="#4A6CB8" op1={0.07} op2={0.06} />
      <SweepBeam c1="#72C4B2" c2="#4A6CB8" delay="2s" />
      <GeometricBg variant="brackets" accent="var(--teal-light)" />
      <SectionWatermark word="TRUST" side="left" />
      <RunningGradient c1="#72C4B2" c2="#4A6CB8" slow />
      <div className="hp-con hp-center">
        <Fade><SLabel center>Why People Work With Us</SLabel></Fade>
        <div className="hp-g3" style={{ marginBottom: 32, textAlign: 'left' }}>
          {items.map((it, i) => (
            <Fade key={it.title} d={0.1 + i * 0.06}>
              <div className="hp-card" style={{ padding: '32px 26px', borderRadius: 18, height: '100%' }}>
                <h3 style={{ fontFamily: F.h, fontSize: '0.92rem', fontWeight: 800, color: 'var(--teal-light)', marginBottom: 10, letterSpacing: '-0.01em' }}>&ldquo;{it.title}&rdquo;</h3>
                <p style={{ fontFamily: F.b, fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                  {it.body}
                  {it.url && <Link href={it.url} style={{ color: 'var(--teal-light)', textDecoration: 'none', marginLeft: 4 }}><ArrowSvg size={12} /></Link>}
                </p>
              </div>
            </Fade>
          ))}
        </div>
        <Fade d={0.2}><FounderQuote text="The thing I'm most proud of isn't the technology. It's that we've never had a client say 'I didn't understand what was happening with my project.' Every update is in plain English. Every cost is transparent. That's not a feature — it's a promise." name="Arifur Rahman" title="CEO" highlight="Every update is in plain English. Every cost is transparent." /></Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 12: CTA
   ═══════════════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="hp-sec hp-bg2" style={{ position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '120%', height: '60%', background: 'radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--teal) 6%, transparent), transparent 60%)', pointerEvents: 'none' }} />
      <FloatingDots colors={['#3A589E', '#72C4B2', '#4A6CB8', '#A3DFD2']} count={20} />
      <SectionOrbs c1="#3A589E" c2="#72C4B2" op1={0.10} op2={0.11} />
      <SweepBeam c1="#3A589E" c2="#72C4B2" />
      <GeometricBg variant="rings" accent="var(--teal-light)" />
      <SectionWatermark word="START" side="right" />
      <RunningGradient c1="#3A589E" c2="#72C4B2" c3="#59A392" />
      <div className="hp-con hp-center" style={{ position: 'relative', zIndex: 1 }}>
        <Fade>
          <SLabel center>Ready?</SLabel>
          <H2 style={{ marginBottom: 20, textAlign: 'center' }}>Let&apos;s Talk About What You&apos;re Building.</H2>
          <P style={{ maxWidth: 520, marginInline: 'auto', marginBottom: 8, fontSize: '1rem', lineHeight: 1.75 }}>Book a 30-minute call. Tell us what your business needs. We&apos;ll give you an honest assessment. If we&apos;re not the right fit, we&apos;ll tell you.</P>
          <P style={{ maxWidth: 520, marginInline: 'auto', marginBottom: 32, fontWeight: 500, color: 'var(--text-primary)' }}>No pitch deck. No pressure. No commitment.</P>
        </Fade>
        <Fade d={0.08}>
          <div className="hp-hero-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: 'var(--gradient-brand)', color: '#fff', fontFamily: F.h, fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(58,88,158,0.35)' }}>Book Your Free Call <ArrowSvg color="#fff" /></Link>
            <Link href="/contact#form" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, background: 'transparent', border: '1.5px solid var(--border-hover)', color: 'var(--text-primary)', fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Send a Message</Link>
          </div>
          <p style={{ fontFamily: F.b, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 40 }}>We respond within 4 hours. Confidential. Come with questions, not answers — that&apos;s our job.</p>
        </Fade>
        <Fade d={0.12}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
            {[{ l: 'Build software', u: '/studio/start-project' }, { l: 'Deploy agents', u: '/agents' }, { l: 'Get maintenance', u: '/services/get-protected' }, { l: 'Host with us', u: '/cloud/get-hosted' }, { l: 'Apply to Ventures', u: '/ventures/apply' }].map(r => (
              <Link key={r.l} href={r.u} className="hp-pill">{r.l}</Link>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NOISE OVERLAY + EXPORT
   ═══════════════════════════════════════════════════════════════════════ */
function NoiseOverlay() {
  return (
    <svg className="hp-noise" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <filter id="hp-noise-filter"><feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#hp-noise-filter)" />
    </svg>
  );
}

export default function HomePageClient() {
  return (
    <>
      <style>{STYLES}</style>
      <NoiseOverlay />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <WhatWeBuild />
      <AgentsSection />
      <Numbers />
      <ProductsSection />
      <BiggerPicture />
      <DivisionsSection />
      <TrustSignals />
      <CTASection />
    </>
  );
}
