'use client';
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .cl-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); font-family: ${F.body}; }

  /* ── Hero ── */
  .cl-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .cl-hero canvas { position: absolute; inset: 0; pointer-events: none; width: 100%; height: 100%; }
  .cl-hero-inner { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }

  .cl-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
  .cl-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: ${A}; flex-shrink: 0; animation: cl-pulse 2s ease-in-out infinite; }
  @keyframes cl-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  .cl-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .cl-grad { background: linear-gradient(135deg, ${A}, #A3DFD2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .cl-sub { font-family: ${F.body}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 580px; margin: 0 auto 40px; }

  .cl-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .cl-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .cl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(91,181,224,0.4); }
  .cl-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .cl-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  .cl-pricing-note { font-family: ${F.mono}; font-size: 0.72rem; color: ${A}; margin-top: 20px; opacity: 0.8; }

  .cl-quote-card { margin-top: 56px; background: var(--glass-bg, rgba(17,17,40,0.6)); border: 1px solid var(--glass-border, rgba(91,181,224,0.1)); border-radius: 16px; backdrop-filter: blur(12px); padding: 28px 32px; text-align: left; max-width: 620px; margin-left: auto; margin-right: auto; }
  .cl-quote-text { font-family: ${F.body}; font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); font-style: italic; margin-bottom: 16px; }
  .cl-quote-attr { display: flex; align-items: center; gap: 10px; }
  .cl-quote-line { width: 20px; height: 1.5px; background: ${A}; }
  .cl-quote-name { font-family: ${F.mono}; font-size: 0.72rem; color: ${A}; letter-spacing: 0.06em; text-transform: uppercase; }

  /* ── Sections shared ── */
  .cl-section { padding: 100px 32px; }
  .cl-section-alt { background: var(--bg-2, #111128); }
  .cl-container { max-width: 1200px; margin: 0 auto; }
  .cl-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .cl-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .cl-h2 { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .cl-desc { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); max-width: 580px; }
  .cl-centered { text-align: center; }
  .cl-centered .cl-label { justify-content: center; }
  .cl-centered .cl-desc { margin: 0 auto; }

  /* ── 3-Layer Diagram ── */
  .cl-layers-wrap { max-width: 860px; margin: 64px auto 0; display: flex; flex-direction: column; gap: 0; }
  .cl-layer-divider { height: 1px; background: ${A}30; }

  .cl-layer { position: relative; padding: 32px 40px; overflow: hidden; }
  .cl-layer-top { background: var(--bg-3, #161636); }
  .cl-layer-mid { background: rgba(91,181,224,0.06); border-top: 1px solid rgba(91,181,224,0.2); border-bottom: 1px solid rgba(91,181,224,0.2); }
  .cl-layer-bot { background: var(--bg-card, #13132B); opacity: 0.8; }

  .cl-layer-inner { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; position: relative; z-index: 2; }
  .cl-layer-left { flex: 1; min-width: 200px; }
  .cl-layer-lbl { font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
  .cl-layer-lbl-top { color: var(--text-secondary, #7C8DB0); }
  .cl-layer-lbl-mid { color: ${A}; font-size: 0.8rem; }
  .cl-layer-lbl-bot { color: var(--text-muted, #4A5578); }
  .cl-layer-name { font-family: ${F.display}; font-weight: 800; font-size: 1.1rem; color: var(--text-primary, #fff); margin-bottom: 4px; }
  .cl-layer-name-mid { color: ${A}; font-size: 1.3rem; }
  .cl-layer-name-bot { color: var(--text-muted, #4A5578); font-size: 1rem; }
  .cl-layer-subdesc { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); }
  .cl-layer-note { font-family: ${F.mono}; font-size: 0.7rem; color: ${A}; opacity: 0.7; margin-top: 8px; }
  .cl-layer-note-dim { color: var(--text-muted, #4A5578); }
  .cl-layer-tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding-top: 4px; }
  .cl-layer-tag { font-family: ${F.mono}; font-size: 0.65rem; padding: 4px 10px; border-radius: 4px; background: ${A}12; color: ${A}; border: 1px solid ${A}22; }
  .cl-layer-tag-dim { background: rgba(255,255,255,0.03); color: var(--text-muted, #4A5578); border-color: rgba(255,255,255,0.06); }

  /* canvas inside layer-mid */
  .cl-layer-mid canvas { position: absolute; inset: 0; pointer-events: none; width: 100%; height: 100%; }

  /* ── Capabilities Grid ── */
  .cl-caps-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 700px) { .cl-caps-grid { grid-template-columns: 1fr; } }
  .cl-cap { padding: 28px 32px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); position: relative; overflow: hidden; transition: all 0.35s; }
  .cl-cap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.35s; }
  .cl-cap:hover { transform: translateY(-4px); border-color: ${A}25; box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
  .cl-cap:hover::before { opacity: 1; }
  .cl-cap-icon { width: 44px; height: 44px; border-radius: 10px; background: ${A}15; display: flex; align-items: center; justify-content: center; color: ${A}; margin-bottom: 16px; transition: all 0.3s; }
  .cl-cap:hover .cl-cap-icon { background: ${A}22; box-shadow: 0 0 16px ${A}30; }
  .cl-cap-name { font-family: ${F.display}; font-size: 0.95rem; font-weight: 800; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .cl-cap-row { display: flex; flex-direction: column; gap: 4px; }
  .cl-cap-we { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }
  .cl-cap-we strong { color: ${A}; font-weight: 500; font-family: ${F.mono}; font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; display: block; margin-bottom: 2px; }
  .cl-cap-never { font-size: 0.82rem; color: var(--text-muted, #4A5578); line-height: 1.5; margin-top: 6px; }
  .cl-cap-never strong { color: var(--text-muted, #4A5578); font-weight: 500; font-family: ${F.mono}; font-size: 0.7rem; letter-spacing: 0.04em; text-transform: uppercase; display: block; margin-bottom: 2px; }

  .cl-ceo-quote { margin-top: 56px; padding: 32px 36px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid ${A}18; }

  /* ── Provider Section ── */
  .cl-provs-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 48px; }
  @media(max-width: 900px) { .cl-provs-row { grid-template-columns: repeat(3, 1fr); } }
  @media(max-width: 540px) { .cl-provs-row { grid-template-columns: repeat(2, 1fr); } }
  .cl-prov { padding: 24px 20px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); text-align: center; position: relative; transition: all 0.3s; }
  .cl-prov:hover { border-color: ${A}30; transform: translateY(-3px); }
  .cl-prov-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-family: ${F.mono}; font-size: 0.6rem; font-weight: 600; background: ${A}; color: #000; padding: 3px 10px; border-radius: 100px; white-space: nowrap; letter-spacing: 0.04em; }
  .cl-prov-name { font-family: ${F.display}; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .cl-prov-desc { font-size: 0.8rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }

  .cl-prov-note { margin-top: 32px; text-align: center; font-size: 0.9rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; max-width: 600px; margin-left: auto; margin-right: auto; }

  /* ── Studio+Cloud+Services Flow ── */
  .cl-flow { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; margin-top: 56px; }
  .cl-flow-block { padding: 28px 36px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); text-align: center; min-width: 180px; }
  .cl-flow-block-mid { background: rgba(91,181,224,0.06); border-color: ${A}30; }
  .cl-flow-block-label { font-family: ${F.mono}; font-size: 0.7rem; color: ${A}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
  .cl-flow-block-label-dim { color: var(--text-muted, #4A5578); }
  .cl-flow-block-name { font-family: ${F.display}; font-size: 1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 6px; }
  .cl-flow-block-sub { font-size: 0.8rem; color: var(--text-secondary, #7C8DB0); }
  .cl-flow-arrow { padding: 0 12px; color: ${A}; opacity: 0.6; }
  .cl-flow-desc { margin-top: 40px; text-align: center; font-size: 0.95rem; color: var(--text-secondary, #7C8DB0); line-height: 1.7; max-width: 620px; margin-left: auto; margin-right: auto; }

  /* ── Pricing Invoice ── */
  .cl-invoice { background: var(--bg-3, #161636); border: 1px solid ${A}20; border-radius: 16px; padding: 32px 36px; max-width: 480px; margin: 48px auto 0; font-family: ${F.mono}; }
  .cl-invoice-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); }
  .cl-invoice-row span { color: ${A}; }
  .cl-invoice-divider { height: 1px; background: ${A}20; margin: 8px 0; }
  .cl-invoice-total { display: flex; justify-content: space-between; padding: 12px 0 0; font-family: ${F.display}; font-weight: 700; font-size: 1.05rem; color: var(--text-primary, #fff); }
  .cl-invoice-total span { color: ${A}; }

  .cl-tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
  @media(max-width: 700px) { .cl-tiers { grid-template-columns: 1fr; } }
  .cl-tier { padding: 24px 28px; border-radius: 14px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); position: relative; transition: all 0.3s; }
  .cl-tier.popular { border-color: ${A}40; background: linear-gradient(160deg, ${A}08, var(--bg-card, #13132B)); }
  .cl-tier:hover { transform: translateY(-4px); border-color: ${A}35; }
  .cl-tier-badge { font-family: ${F.mono}; font-size: 0.62rem; background: ${A}; color: #000; padding: 3px 10px; border-radius: 100px; display: inline-block; margin-bottom: 12px; font-weight: 600; letter-spacing: 0.04em; }
  .cl-tier-name { font-family: ${F.display}; font-size: 1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 4px; }
  .cl-tier-price { font-family: ${F.display}; font-size: 1.8rem; font-weight: 800; color: ${A}; letter-spacing: -0.03em; margin: 8px 0; }
  .cl-tier-price span { font-size: 0.9rem; font-weight: 400; color: var(--text-secondary, #7C8DB0); }
  .cl-tier-desc { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); }

  .cl-plans-cta { text-align: center; margin-top: 32px; }

  /* ── Trust ── */
  .cl-trust-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
  @media(max-width: 768px) { .cl-trust-row { grid-template-columns: 1fr; } }
  .cl-trust { padding: 32px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); }
  .cl-trust-title { font-family: ${F.display}; font-size: 1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 12px; }
  .cl-trust-body { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.65; }

  /* ── Final CTA ── */
  .cl-cta-section { padding: 100px 32px; background: linear-gradient(135deg, ${A}10, var(--bg-2, #111128), ${A}06); text-align: center; }
  .cl-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .cl-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }

  .cl-founder-quote { margin-top: 56px; max-width: 560px; margin-left: auto; margin-right: auto; padding: 28px 32px; border-radius: 14px; background: var(--bg-card, #13132B); border: 1px solid ${A}14; }
`;

// ── Reveal utility ──
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ── Hero canvas: band fills + upward moving dots ──
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const dots: { x: number; y: number; speed: number; opacity: number; size: number }[] = [];
    for (let i = 0; i < 40; i++) {
      dots.push({
        x: Math.random() * (canvas.width || 1200),
        y: Math.random() * (canvas.height || 700),
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.12 + Math.random() * 0.28,
        size: 1 + Math.random() * 2,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = canvas.height;
      const w = canvas.width;
      // 3 horizontal band fills
      const bands = [
        { y: 0, h: h * 0.34, opacity: 0.045 },
        { y: h * 0.33, h: h * 0.34, opacity: 0.025 },
        { y: h * 0.66, h: h * 0.34, opacity: 0.015 },
      ];
      bands.forEach(b => {
        ctx.fillStyle = `rgba(17,17,40,${b.opacity})`;
        ctx.fillRect(0, b.y, w, b.h);
      });
      // upward moving dots
      dots.forEach(d => {
        d.y -= d.speed;
        if (d.y < 0) { d.y = h; d.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91,181,224,${d.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} />;
}

// ── Layer-mid canvas: tiny upward dots ──
function LayerMidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const dots: { x: number; y: number; speed: number; opacity: number; size: number }[] = [];
    for (let i = 0; i < 30; i++) {
      dots.push({
        x: Math.random() * (canvas.width || 860),
        y: Math.random() * (canvas.height || 120),
        speed: 0.4 + Math.random() * 0.8,
        opacity: 0.1 + Math.random() * 0.2,
        size: 0.8 + Math.random() * 1.4,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.y -= d.speed;
        if (d.y < 0) { d.y = canvas.height; d.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91,181,224,${d.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

// ── Capability cards data ──
const CAPS = [
  {
    name: 'Deployment',
    we: 'Zero-downtime deploys, staging environments, automated rollbacks',
    never: 'How code gets to servers',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    name: 'Databases',
    we: 'Setup, optimization, connection pooling, read replicas, automated migrations',
    never: 'Database server management',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    name: 'CDN',
    we: 'Global content delivery, edge caching, image optimization, cache invalidation',
    never: 'Why your site loads fast everywhere',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    name: 'SSL / TLS',
    we: 'Certificate provisioning, automatic renewal, HTTPS enforcement everywhere',
    never: 'The padlock in the browser bar',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    name: 'DNS',
    we: 'Domain configuration, DNS records, email routing, subdomain management',
    never: 'How your domain actually works',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: 'Backups',
    we: 'Daily automated snapshots, point-in-time recovery, cross-region redundancy',
    never: 'What happens if the database disappears',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    name: 'Scaling',
    we: 'Vertical and horizontal scaling, auto-scaling policies, load balancer config',
    never: 'What happens when traffic spikes at 3am',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    ),
  },
  {
    name: 'Monitoring',
    we: 'Server health, CPU, memory, disk, network, uptime alerts, on-call response',
    never: 'Whether the infrastructure is healthy right now',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    name: 'Security',
    we: 'Firewall rules, DDoS protection, SSH hardening, OS patches, CVE monitoring',
    never: 'Infrastructure-level attack surface',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    name: 'Environment',
    we: 'Secrets management, environment variables, config across staging and production',
    never: 'How your app knows its own settings',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
  },
];

// ── Provider data ──
const PROVIDERS = [
  { name: 'Vercel', desc: 'Frontend-heavy, JAMstack, maximum simplicity', recommended: false },
  { name: 'AWS', desc: 'Complex backends, enterprise, compliance needs', recommended: false },
  { name: 'DigitalOcean', desc: 'Most products — balanced cost and power', recommended: true },
  { name: 'Railway', desc: 'Fast deployment, early-stage, containers', recommended: false },
  { name: 'Hetzner', desc: 'Cost-optimized compute, EU data residency', recommended: false },
];

// ── Arrow SVG ──
const ArrowRight = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function CloudPage() {
  return (
    <main className="cl-wrap">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="cl-hero">
        <HeroCanvas />
        <div className="cl-hero-inner">
          <Reveal>
            <div className="cl-badge">
              <span className="cl-badge-dot" />
              Managed Infrastructure
            </div>
            <h1 className="cl-h1">
              Your Product Runs on Infrastructure.<br />
              We Make Sure You{' '}
              <span className="cl-grad">Never Think About It.</span>
            </h1>
            <p className="cl-sub">
              Servers, databases, deployments, SSL, CDN, backups, scaling — managed by engineers who understand your code. Choose a cloud provider. We handle everything else.
            </p>
            <div className="cl-btns">
              <Link href="/cloud/get-hosted" className="cl-btn-primary">
                Get Hosted <ArrowRight />
              </Link>
              <Link href="/cloud/plans" className="cl-btn-ghost">
                See Plans
              </Link>
            </div>
            <p className="cl-pricing-note">Management starts at $149/month + hosting pass-through at cost. No markup.</p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="cl-quote-card">
              <p className="cl-quote-text">
                &ldquo;I&rsquo;ve watched founders spend weeks trying to figure out AWS. Setting up a VPC, configuring security groups, debugging deployment pipelines. That&rsquo;s weeks they could have spent on their business. Cloud exists so they never have to learn what a security group is.&rdquo;
              </p>
              <div className="cl-quote-attr">
                <div className="cl-quote-line" />
                <span className="cl-quote-name">Kamrul Hasan, CTO</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THREE-LAYER DIAGRAM ── */}
      <section className="cl-section cl-section-alt">
        <div className="cl-container">
          <Reveal>
            <div className="cl-centered">
              <div className="cl-label">How It Works</div>
              <h2 className="cl-h2">Three Layers. We Manage the Middle.</h2>
            </div>
          </Reveal>

          <div className="cl-layers-wrap">
            {/* TOP — Your App */}
            <Reveal delay={0.05}>
              <div className="cl-layer cl-layer-top" style={{ borderRadius: '16px 16px 0 0' }}>
                <div className="cl-layer-inner">
                  <div className="cl-layer-left">
                    <div className="cl-layer-lbl cl-layer-lbl-top">Your App</div>
                    <div className="cl-layer-name">What your customers see and use</div>
                    <div className="cl-layer-note" style={{ color: '#5BB5E0', opacity: 0.7 }}>Studio builds this &rarr;</div>
                  </div>
                  <div className="cl-layer-tags-wrap">
                    {['Next.js', 'FastAPI', 'Node.js', 'Go', 'React Native'].map(t => (
                      <span key={t} className="cl-layer-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="cl-layer-divider" />

            {/* MIDDLE — SocioFi Cloud */}
            <Reveal delay={0.1}>
              <div className="cl-layer cl-layer-mid" style={{ position: 'relative', overflow: 'hidden' }}>
                <LayerMidCanvas />
                <div className="cl-layer-inner">
                  <div className="cl-layer-left">
                    <div className="cl-layer-lbl cl-layer-lbl-mid">SocioFi Cloud</div>
                    <div className="cl-layer-name cl-layer-name-mid">The Management Layer</div>
                    <div className="cl-layer-subdesc">Everything that keeps your app running in production</div>
                  </div>
                  <div className="cl-layer-tags-wrap">
                    {['Deployment', 'Databases', 'CDN', 'SSL', 'DNS', 'Backups', 'Scaling', 'Monitoring', 'Security'].map(t => (
                      <span key={t} className="cl-layer-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="cl-layer-divider" />

            {/* BOTTOM — Cloud Provider */}
            <Reveal delay={0.15}>
              <div className="cl-layer cl-layer-bot" style={{ borderRadius: '0 0 16px 16px' }}>
                <div className="cl-layer-inner">
                  <div className="cl-layer-left">
                    <div className="cl-layer-lbl cl-layer-lbl-bot">Cloud Provider</div>
                    <div className="cl-layer-name cl-layer-name-bot">The commodity compute layer</div>
                    <div className="cl-layer-note cl-layer-note-dim">We choose the best fit. Pass through at cost.</div>
                  </div>
                  <div className="cl-layer-tags-wrap">
                    {['AWS', 'DigitalOcean', 'Vercel', 'Railway', 'Hetzner'].map(t => (
                      <span key={t} className="cl-layer-tag cl-layer-tag-dim">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="cl-section">
        <div className="cl-container">
          <Reveal>
            <div className="cl-label">Everything Below Your Code</div>
            <h2 className="cl-h2">10 Infrastructure Layers. All Managed.</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="cl-ceo-quote">
              <p className="cl-quote-text">
                &ldquo;The question every non-technical founder asks is &lsquo;but where does it actually run?&rsquo; Cloud is the answer to that question. We pick the server, set up the database, configure the CDN, manage the SSL certificate, handle the DNS, automate the backups, set up the scaling rules, and monitor all of it. You never open a terminal.&rdquo;
              </p>
              <div className="cl-quote-attr">
                <div className="cl-quote-line" />
                <span className="cl-quote-name">Arifur Rahman, CEO</span>
              </div>
            </div>
          </Reveal>

          <div className="cl-caps-grid">
            {CAPS.map((cap, i) => (
              <Reveal key={cap.name} delay={i * 0.05}>
                <div className="cl-cap">
                  <div className="cl-cap-icon">{cap.icon}</div>
                  <div className="cl-cap-name">{cap.name}</div>
                  <div className="cl-cap-row">
                    <div className="cl-cap-we">
                      <strong>We handle:</strong>
                      {cap.we}
                    </div>
                    <div className="cl-cap-never">
                      <strong>You never think about:</strong>
                      {cap.never}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROVIDERS ── */}
      <section className="cl-section cl-section-alt">
        <div className="cl-container">
          <Reveal>
            <div className="cl-centered">
              <div className="cl-label">Provider Agnostic</div>
              <h2 className="cl-h2">We&rsquo;re Not Locked Into One Cloud. Neither Are You.</h2>
            </div>
          </Reveal>

          <div className="cl-provs-row">
            {PROVIDERS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.07}>
                <div className="cl-prov">
                  {p.recommended && <div className="cl-prov-badge">Our Most Recommended</div>}
                  <div className="cl-prov-name">{p.name}</div>
                  <div className="cl-prov-desc">{p.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="cl-prov-note">
              We recommend based on your product&rsquo;s needs and your budget. Not our margins. Hosting is passed through at cost — zero markup.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="cl-quote-card" style={{ marginTop: 40 }}>
              <p className="cl-quote-text">
                &ldquo;Most managed hosting companies push you onto AWS because they get partnership kickbacks. We recommend DigitalOcean for 70% of our clients because it&rsquo;s simpler, cheaper, and perfectly capable. We recommend AWS when you genuinely need AWS. The right answer depends on you, not us.&rdquo;
              </p>
              <div className="cl-quote-attr">
                <div className="cl-quote-line" />
                <span className="cl-quote-name">Kamrul Hasan, CTO</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STUDIO + CLOUD + SERVICES FLOW ── */}
      <section className="cl-section">
        <div className="cl-container">
          <Reveal>
            <div className="cl-centered">
              <div className="cl-label">The Full Stack</div>
              <h2 className="cl-h2">Built. Hosted. Maintained. One Team.</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="cl-flow">
              <div className="cl-flow-block">
                <div className="cl-flow-block-label cl-flow-block-label-dim">Studio</div>
                <div className="cl-flow-block-name">Builds it</div>
                <div className="cl-flow-block-sub">Your app, designed and shipped</div>
              </div>
              <div className="cl-flow-arrow">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
              <div className="cl-flow-block cl-flow-block-mid">
                <div className="cl-flow-block-label">Cloud</div>
                <div className="cl-flow-block-name">Deploys &amp; Hosts</div>
                <div className="cl-flow-block-sub">Infrastructure, managed</div>
              </div>
              <div className="cl-flow-arrow">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
              <div className="cl-flow-block">
                <div className="cl-flow-block-label cl-flow-block-label-dim">Services</div>
                <div className="cl-flow-block-name">Monitors &amp; Maintains</div>
                <div className="cl-flow-block-sub">Ongoing, always on</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="cl-flow-desc">
              When Studio finishes your project, Cloud deployment is already configured. When Services monitors your application, Cloud infrastructure is already reporting. It&rsquo;s one system. One team. No gaps.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="cl-section cl-section-alt">
        <div className="cl-container">
          <Reveal>
            <div className="cl-centered">
              <div className="cl-label">Transparent Pricing</div>
              <h2 className="cl-h2">Management Fee + Hosting at Cost. That&rsquo;s It.</h2>
              <p className="cl-desc" style={{ marginTop: 8 }}>Two line items. Every month. Nothing hidden.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="cl-invoice">
              <div className="cl-invoice-row">
                <span>DigitalOcean hosting (pass-through)</span>
                <span>$48.00</span>
              </div>
              <div className="cl-invoice-row">
                <span>SocioFi Cloud management (Launch)</span>
                <span>$149.00</span>
              </div>
              <div className="cl-invoice-divider" />
              <div className="cl-invoice-total">
                <span>Total</span>
                <span>$197.00</span>
              </div>
            </div>
          </Reveal>

          <div className="cl-tiers">
            {[
              { name: 'Launch', price: '$149', per: '/mo', desc: 'For MVPs and small apps', popular: false },
              { name: 'Professional', price: '$349', per: '/mo', desc: 'For growing products', popular: true },
              { name: 'Enterprise', price: '$799', per: '/mo', desc: 'For mission-critical systems', popular: false },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className={`cl-tier${t.popular ? ' popular' : ''}`}>
                  {t.popular && <div className="cl-tier-badge">Most Popular</div>}
                  <div className="cl-tier-name">{t.name}</div>
                  <div className="cl-tier-price">{t.price}<span>{t.per}</span></div>
                  <div className="cl-tier-desc">{t.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="cl-plans-cta">
            <Link href="/cloud/plans" className="cl-btn-ghost" style={{ display: 'inline-flex' }}>
              See full pricing with examples <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="cl-section">
        <div className="cl-container">
          <Reveal>
            <div className="cl-centered">
              <div className="cl-label">Why Clients Host With Us</div>
            </div>
          </Reveal>
          <div className="cl-trust-row">
            {[
              {
                title: 'Zero markup on hosting.',
                body: 'Your DigitalOcean bill is your DigitalOcean bill. We don\'t add a margin. Our revenue is the management fee. Period.',
              },
              {
                title: 'You can leave anytime.',
                body: 'We don\'t lock you in. Your infrastructure configuration, your database, your deployments — all documented. Take everything and go if you want.',
              },
              {
                title: 'Same engineers who built your product.',
                body: 'The Cloud team knows your code because they deployed it. When scaling decisions come up, they understand your architecture.',
              },
            ].map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08}>
                <div className="cl-trust">
                  <div className="cl-trust-title">{t.title}</div>
                  <div className="cl-trust-body">{t.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cl-cta-section">
        <Reveal>
          <div className="cl-label" style={{ justifyContent: 'center', display: 'flex' }}>Get Started</div>
          <h2 className="cl-cta-h2">Your Product Needs Somewhere to Live.</h2>
          <p className="cl-cta-sub">
            Tell us what you&rsquo;re running and we&rsquo;ll recommend the right provider, the right plan, and the right setup.
          </p>
          <div className="cl-btns">
            <Link href="/cloud/get-hosted" className="cl-btn-primary">
              Get Hosted <ArrowRight />
            </Link>
            <Link href="/cloud/audit" className="cl-btn-ghost">
              Audit My Current Hosting
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="cl-founder-quote">
            <p className="cl-quote-text">
              &ldquo;Before Cloud, I was paying $400/month on AWS and using maybe 10% of it. Cloud migrated me to DigitalOcean, optimized everything, and my total — including their management fee — dropped to $220/month. With better performance.&rdquo;
            </p>
            <div className="cl-quote-attr">
              <div className="cl-quote-line" />
              <span className="cl-quote-name">Startup Founder</span>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
