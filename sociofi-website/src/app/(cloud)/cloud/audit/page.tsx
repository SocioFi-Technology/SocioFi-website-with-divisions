'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .au-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); font-family: ${F.body}; }

  /* ── Hero ── */
  .au-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; background: radial-gradient(ellipse 80% 60% at 50% 0%, ${A}0C, transparent 70%); }
  .au-hero-inner { position: relative; z-index: 2; max-width: 760px; margin: 0 auto; }

  .au-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
  .au-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: ${A}; flex-shrink: 0; animation: au-pulse 2s ease-in-out infinite; }
  @keyframes au-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  .au-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .au-grad { background: linear-gradient(135deg, ${A}, #A3DFD2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .au-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 600px; margin: 0 auto 40px; }

  .au-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .au-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .au-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(91,181,224,0.4); }
  .au-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .au-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Shared ── */
  .au-section { padding: 100px 32px; }
  .au-section-alt { background: var(--bg-2, #111128); }
  .au-container { max-width: 1200px; margin: 0 auto; }
  .au-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .au-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .au-h2 { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .au-desc { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); max-width: 580px; }
  .au-centered { text-align: center; }
  .au-centered .au-label { justify-content: center; }
  .au-centered .au-desc { margin: 0 auto; }

  /* ── Pain point bullets ── */
  .au-pains { max-width: 680px; margin: 56px auto 0; display: flex; flex-direction: column; gap: 16px; }
  .au-pain { display: flex; align-items: flex-start; gap: 16px; padding: 20px 24px; border-radius: 14px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); transition: all 0.3s; }
  .au-pain:hover { border-color: ${A}25; transform: translateX(4px); }
  .au-pain-check { width: 22px; height: 22px; border-radius: 50%; background: ${A}15; border: 1px solid ${A}30; display: flex; align-items: center; justify-content: center; color: ${A}; flex-shrink: 0; margin-top: 1px; }
  .au-pain-text { font-size: 0.95rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; }

  /* ── Audit areas grid ── */
  .au-areas-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 700px) { .au-areas-grid { grid-template-columns: 1fr; } }
  .au-area { padding: 28px 30px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); position: relative; overflow: hidden; transition: all 0.35s; }
  .au-area::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.35s; }
  .au-area:hover { border-color: ${A}25; transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
  .au-area:hover::before { opacity: 1; }
  .au-area-icon { width: 42px; height: 42px; border-radius: 10px; background: ${A}15; display: flex; align-items: center; justify-content: center; color: ${A}; margin-bottom: 16px; transition: all 0.3s; }
  .au-area:hover .au-area-icon { background: ${A}22; box-shadow: 0 0 16px ${A}30; }
  .au-area-name { font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .au-area-desc { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; }

  /* ── Deliverables ── */
  .au-deliv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 900px) { .au-deliv-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 560px) { .au-deliv-grid { grid-template-columns: 1fr; } }
  .au-deliv { padding: 28px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); text-align: center; transition: all 0.3s; }
  .au-deliv:hover { border-color: ${A}25; transform: translateY(-4px); }
  .au-deliv-icon { width: 48px; height: 48px; border-radius: 12px; background: ${A}12; display: flex; align-items: center; justify-content: center; color: ${A}; margin: 0 auto 16px; }
  .au-deliv-name { font-family: ${F.display}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .au-deliv-desc { font-size: 0.82rem; color: var(--text-secondary, #7C8DB0); line-height: 1.55; }

  /* ── Process timeline ── */
  .au-timeline { display: flex; align-items: flex-start; gap: 0; margin-top: 56px; flex-wrap: wrap; }
  @media(max-width: 768px) { .au-timeline { flex-direction: column; } }
  .au-step { flex: 1; min-width: 180px; position: relative; }
  .au-step-top { display: flex; align-items: center; margin-bottom: 16px; }
  .au-step-num { width: 40px; height: 40px; border-radius: 50%; background: ${A}18; border: 1.5px solid ${A}40; display: flex; align-items: center; justify-content: center; font-family: ${F.mono}; font-size: 0.78rem; font-weight: 700; color: ${A}; flex-shrink: 0; }
  .au-step-line { flex: 1; height: 1.5px; background: linear-gradient(90deg, ${A}40, ${A}15); margin: 0 12px; }
  .au-step:last-child .au-step-line { display: none; }
  .au-step-body { padding-right: 20px; }
  .au-step-title { font-family: ${F.display}; font-size: 0.92rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .au-step-desc { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; }
  @media(max-width: 768px) {
    .au-step-line { display: none; }
    .au-step { padding-bottom: 24px; border-left: 1.5px solid ${A}25; padding-left: 20px; margin-left: 20px; }
    .au-step-top { margin-left: -30px; }
  }

  /* ── Pricing callout ── */
  .au-price-card { max-width: 520px; margin: 56px auto 0; padding: 48px 40px; border-radius: 20px; background: var(--glass-bg, rgba(17,17,40,0.6)); border: 1px solid ${A}30; backdrop-filter: blur(12px); text-align: center; position: relative; overflow: hidden; }
  .au-price-card::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, ${A}60, transparent); }
  .au-price-amount { font-family: ${F.display}; font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 800; letter-spacing: -0.04em; color: ${A}; line-height: 1; margin-bottom: 8px; }
  .au-price-note { font-family: ${F.mono}; font-size: 0.78rem; color: var(--text-muted, #4A5578); letter-spacing: 0.06em; margin-bottom: 28px; }
  .au-price-credit { font-size: 0.9rem; color: var(--text-secondary, #7C8DB0); line-height: 1.7; max-width: 380px; margin: 0 auto 32px; padding: 16px 20px; border-radius: 10px; background: ${A}08; border: 1px solid ${A}15; }
  .au-price-credit strong { color: ${A}; font-weight: 600; }

  /* ── FAQ ── */
  .au-faq { max-width: 720px; margin: 56px auto 0; display: flex; flex-direction: column; gap: 2px; }
  .au-faq-item { border-radius: 12px; overflow: hidden; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); transition: border-color 0.3s; }
  .au-faq-item.open { border-color: ${A}25; }
  .au-faq-q { width: 100%; background: none; border: none; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; cursor: pointer; text-align: left; }
  .au-faq-q-text { font-family: ${F.display}; font-size: 0.92rem; font-weight: 600; color: var(--text-primary, #fff); }
  .au-faq-chevron { color: ${A}; flex-shrink: 0; transition: transform 0.3s; }
  .au-faq-item.open .au-faq-chevron { transform: rotate(180deg); }
  .au-faq-a { padding: 0 24px 20px; font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.7; }

  /* ── Request form ── */
  .au-form-wrap { max-width: 680px; margin: 0 auto; }
  .au-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media(max-width: 600px) { .au-form { grid-template-columns: 1fr; } }
  .au-form-full { grid-column: 1 / -1; }
  .au-field { display: flex; flex-direction: column; gap: 6px; }
  .au-label-text { font-family: ${F.mono}; font-size: 0.68rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; }
  .au-input { background: var(--bg-3, #161636); border: 1px solid var(--border, rgba(91,181,224,0.1)); border-radius: 10px; padding: 12px 16px; font-family: ${F.body}; font-size: 0.9rem; color: var(--text-primary, #fff); outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
  .au-input:focus { border-color: ${A}50; }
  .au-input::placeholder { color: var(--text-muted, #4A5578); }
  .au-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235BB5E0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; cursor: pointer; }
  .au-textarea { resize: vertical; min-height: 120px; }
  .au-form-submit { margin-top: 8px; }
  .au-submit-btn { width: 100%; padding: 16px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border: none; border-radius: 12px; font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .au-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(91,181,224,0.4); }
  .au-form-note { text-align: center; margin-top: 12px; font-family: ${F.mono}; font-size: 0.68rem; color: var(--text-muted, #4A5578); letter-spacing: 0.04em; }

  /* ── CTA section ── */
  .au-cta-section { padding: 100px 32px; background: linear-gradient(135deg, ${A}10, var(--bg-2, #111128), ${A}06); text-align: center; }
  .au-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .au-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
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

const ArrowRight = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDown = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PAIN_POINTS = [
  "You&rsquo;re not sure if your hosting can handle more visitors",
  "Your AWS or GCP bill keeps creeping up and you don&rsquo;t know what&rsquo;s using it",
  "You had a downtime incident and still aren&rsquo;t completely sure why",
  "You&rsquo;re paying for resources you don&rsquo;t use",
  "You inherited an app from a previous developer and don&rsquo;t know how it&rsquo;s deployed",
];

const AUDIT_AREAS = [
  {
    name: 'Security configuration',
    desc: 'Firewall rules, open ports, SSH setup, installed patches, vulnerable package versions.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    name: 'Performance & response times',
    desc: 'Time-to-first-byte, database query speeds, cache hit rates, geographic latency.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    name: 'Cost efficiency',
    desc: 'Over-provisioned servers, idle resources, services you pay for but don&rsquo;t use.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    name: 'Backup & recovery readiness',
    desc: 'What&rsquo;s backed up, how often, where to, and how long recovery actually takes.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    name: 'Monitoring & alerting gaps',
    desc: 'What gets alerted on, what gets missed, who gets paged and when.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    name: 'Deployment process risk',
    desc: 'How code gets to production, whether rollbacks are possible, and where human error can creep in.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    name: 'Scaling capacity',
    desc: 'How much traffic your current setup can absorb before things break, and what it would take to handle 10x.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    ),
  },
  {
    name: 'Dependency vulnerabilities',
    desc: 'Third-party packages, OS packages, and services with known CVEs affecting your stack.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

const DELIVERABLES = [
  {
    name: 'PDF report',
    desc: '15–25 pages covering every area we audited, with findings, evidence, and recommendations.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    name: 'Executive summary',
    desc: 'One page. The most important things, ranked by urgency. Share with co-founders or investors.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    name: 'Prioritized fix list',
    desc: 'Every issue labeled critical / high / medium / low. Tackle critical items first — usually security.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    name: 'Cost savings estimate',
    desc: 'A calculation of what optimizing over-provisioned resources would save you per month.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    name: 'Architecture recommendations',
    desc: 'Specific changes we&rsquo;d make if this were our own infrastructure — with rationale for each.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    name: '30-min video walkthrough',
    desc: 'A scheduled call where we walk through the findings together and answer any questions.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
];

const PROCESS_STEPS = [
  {
    title: 'Fill out the intake form',
    desc: 'Tell us your stack, what providers you use, and what level of access you can share. The form is below.',
  },
  {
    title: 'We run the checks',
    desc: 'Automated scans plus manual review. We need up to 48 hours. No disruption to your live environment.',
  },
  {
    title: 'You receive the report',
    desc: 'Full PDF with all findings, plus an executive summary and prioritized fix list delivered to your inbox.',
  },
  {
    title: '30-min walkthrough call',
    desc: 'We schedule a call to walk through the findings together, answer questions, and discuss next steps.',
  },
];

const FAQS = [
  {
    q: 'Do you need server access?',
    a: 'Read-only access helps us do a thorough job. We can work with SSH access, cloud console read permissions, or even just a description of your setup. The more access you can share, the more specific our findings — but we can deliver useful results either way.',
  },
  {
    q: 'What if I\'m on AWS, GCP, or Azure?',
    a: 'We audit all major cloud providers. AWS, GCP, Azure, DigitalOcean, Hetzner, Railway — wherever you\'re hosted, the audit process is the same. We\'ll ask for read-only IAM credentials or equivalent access.',
  },
  {
    q: 'How long does the audit take?',
    a: 'Typically 48 hours from the time you provide access and complete the intake form. We\'ll send you a delivery estimate after reviewing your intake.',
  },
  {
    q: 'Is this just a sales pitch to move to SocioFi Cloud?',
    a: 'No. We deliver the audit report whether or not you end up working with us. If everything looks great, we\'ll tell you that. If it\'s a mess, we\'ll tell you what to fix — even if you fix it yourself. Our reputation depends on honest assessments.',
  },
  {
    q: 'What if I want to fix the issues myself?',
    a: 'That\'s completely fine. The report includes enough detail to hand to a developer or DevOps engineer. If you get stuck, we\'re available for follow-up consulting at our standard hourly rate.',
  },
  {
    q: 'Can you audit a staging environment only?',
    a: 'Yes. Staging audits are especially useful if you\'re about to go live and want to catch issues before they become production problems. Note that staging and production configs often differ — we\'ll flag anything we can\'t verify.',
  },
];

// ── FAQ accordion item ──
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`au-faq-item${open ? ' open' : ''}`}>
      <button className="au-faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="au-faq-q-text">{q}</span>
        <span className="au-faq-chevron"><ChevronDown /></span>
      </button>
      {open && (
        <motion.div
          className="au-faq-a"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

// ── Request form ──
function AuditForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 32px', background: `${A}08`, border: `1px solid ${A}25`, borderRadius: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${A}20`, border: `1.5px solid ${A}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: A }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={{ fontFamily: F.display, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary, #fff)', marginBottom: 10 }}>Request received</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #7C8DB0)', lineHeight: 1.7 }}>
          We&rsquo;ll review your intake and send you a confirmation with next steps within one business day.
        </div>
      </div>
    );
  }

  return (
    <form className="au-form" onSubmit={handleSubmit} noValidate>
      <div className="au-field">
        <label className="au-label-text" htmlFor="audit-name">Your name</label>
        <input id="audit-name" name="name" type="text" className="au-input" placeholder="Alex Johnson" required />
      </div>
      <div className="au-field">
        <label className="au-label-text" htmlFor="audit-email">Work email</label>
        <input id="audit-email" name="email" type="email" className="au-input" placeholder="alex@yourcompany.com" required />
      </div>
      <div className="au-field">
        <label className="au-label-text" htmlFor="audit-company">Company / product name</label>
        <input id="audit-company" name="company" type="text" className="au-input" placeholder="Your company" />
      </div>
      <div className="au-field">
        <label className="au-label-text" htmlFor="audit-provider">Current hosting provider</label>
        <select id="audit-provider" name="provider" className="au-input au-select" required defaultValue="">
          <option value="" disabled>Select provider</option>
          <option value="aws">Amazon Web Services (AWS)</option>
          <option value="gcp">Google Cloud Platform (GCP)</option>
          <option value="azure">Microsoft Azure</option>
          <option value="digitalocean">DigitalOcean</option>
          <option value="hetzner">Hetzner</option>
          <option value="railway">Railway</option>
          <option value="vercel">Vercel</option>
          <option value="render">Render</option>
          <option value="other">Other / multiple providers</option>
          <option value="unsure">Not sure</option>
        </select>
      </div>
      <div className="au-field au-form-full">
        <label className="au-label-text" htmlFor="audit-setup">Describe your setup</label>
        <textarea
          id="audit-setup"
          name="setup"
          className="au-input au-textarea"
          placeholder="Tell us what you're running: tech stack, rough traffic levels, how long you've been live, and anything you're worried about. The more context you give us, the more useful the audit will be."
          required
        />
      </div>
      <div className="au-form-submit au-form-full">
        <button type="submit" className="au-submit-btn" disabled={loading}>
          {loading ? (
            <>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Sending request...
            </>
          ) : (
            <>
              Request Audit — $299
              <ArrowRight />
            </>
          )}
        </button>
        <p className="au-form-note">We&rsquo;ll confirm receipt within one business day. Payment collected after we review your intake.</p>
      </div>
    </form>
  );
}

export default function CloudAuditPage() {
  return (
    <main className="au-wrap">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="au-hero">
        <div className="au-hero-inner">
          <Reveal>
            <div className="au-badge">
              <span className="au-badge-dot" />
              Cloud Audit Service
            </div>
            <h1 className="au-h1">
              Find Out What&rsquo;s <span className="au-grad">Actually Wrong</span>
            </h1>
            <p className="au-sub">
              A one-time $299 deep dive into your current hosting setup. We tell you exactly what to fix — whether you hire us or not.
            </p>
            <div className="au-btns">
              <a href="#request-audit" className="au-btn-primary">
                Request the Audit <ArrowRight />
              </a>
              <Link href="/cloud/plans" className="au-btn-ghost">
                Or get fully managed
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 1: Is this you? ── */}
      <section className="au-section au-section-alt">
        <div className="au-container">
          <Reveal>
            <div className="au-centered">
              <div className="au-label">Sound Familiar?</div>
              <h2 className="au-h2">Is This You?</h2>
              <p className="au-desc">
                Most of our audit requests come from one of these five situations. If any of these feel familiar, the audit is for you.
              </p>
            </div>
          </Reveal>

          <div className="au-pains">
            {PAIN_POINTS.map((pain, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="au-pain">
                  <div className="au-pain-check"><CheckIcon /></div>
                  <p className="au-pain-text" dangerouslySetInnerHTML={{ __html: pain }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: What we audit ── */}
      <section className="au-section">
        <div className="au-container">
          <Reveal>
            <div className="au-centered">
              <div className="au-label">Scope of Work</div>
              <h2 className="au-h2">Eight Areas. Every One Examined.</h2>
              <p className="au-desc">
                We don&rsquo;t just run an automated scanner and send you a CSV. We review each area manually and provide context — what the finding means for your specific product.
              </p>
            </div>
          </Reveal>

          <div className="au-areas-grid">
            {AUDIT_AREAS.map((area, i) => (
              <Reveal key={area.name} delay={i * 0.05}>
                <div className="au-area">
                  <div className="au-area-icon">{area.icon}</div>
                  <div className="au-area-name">{area.name}</div>
                  <p className="au-area-desc" dangerouslySetInnerHTML={{ __html: area.desc }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: What you get ── */}
      <section className="au-section au-section-alt">
        <div className="au-container">
          <Reveal>
            <div className="au-centered">
              <div className="au-label">Deliverables</div>
              <h2 className="au-h2">What You Walk Away With.</h2>
              <p className="au-desc">
                Six concrete outputs. Not a slide deck with vague recommendations. Specific, actionable, prioritized.
              </p>
            </div>
          </Reveal>

          <div className="au-deliv-grid">
            {DELIVERABLES.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.07}>
                <div className="au-deliv">
                  <div className="au-deliv-icon">{d.icon}</div>
                  <div className="au-deliv-name">{d.name}</div>
                  <p className="au-deliv-desc" dangerouslySetInnerHTML={{ __html: d.desc }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Process ── */}
      <section className="au-section">
        <div className="au-container">
          <Reveal>
            <div className="au-centered">
              <div className="au-label">How It Works</div>
              <h2 className="au-h2">Four Steps. Start to Finish in About 72 Hours.</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="au-timeline">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.title} className="au-step">
                  <div className="au-step-top">
                    <div className="au-step-num">{String(i + 1).padStart(2, '0')}</div>
                    {i < PROCESS_STEPS.length - 1 && <div className="au-step-line" />}
                  </div>
                  <div className="au-step-body">
                    <div className="au-step-title">{step.title}</div>
                    <p className="au-step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: Pricing callout ── */}
      <section className="au-section au-section-alt">
        <div className="au-container">
          <Reveal>
            <div className="au-price-card">
              <div className="au-price-amount">$299</div>
              <div className="au-price-note">One-time fee &mdash; no recurring charges</div>
              <div className="au-price-credit">
                If you choose to move to SocioFi Cloud within 30 days, we <strong>credit the full $299</strong> toward your first month of managed hosting.
              </div>
              <div className="au-btns">
                <a href="#request-audit" className="au-btn-primary">
                  Request Audit <ArrowRight />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 6: FAQ ── */}
      <section className="au-section">
        <div className="au-container">
          <Reveal>
            <div className="au-centered">
              <div className="au-label">Questions</div>
              <h2 className="au-h2">Frequently Asked.</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="au-faq">
              {FAQS.map(faq => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── REQUEST FORM ── */}
      <section className="au-section au-section-alt" id="request-audit">
        <div className="au-container">
          <Reveal>
            <div className="au-centered">
              <div className="au-label">Request the Audit</div>
              <h2 className="au-h2">Tell Us About Your Setup.</h2>
              <p className="au-desc" style={{ marginBottom: 48 }}>
                Fill out the form below. We&rsquo;ll review your intake and confirm the audit within one business day. Payment is collected after we review — not before.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="au-form-wrap">
              <AuditForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="au-cta-section">
        <Reveal>
          <div className="au-label" style={{ justifyContent: 'center', display: 'flex' }}>Not Ready for an Audit?</div>
          <h2 className="au-cta-h2">Just Want Someone to Handle All of This?</h2>
          <p className="au-cta-sub">
            Skip the audit and move straight to fully managed hosting. We set everything up correctly from day one.
          </p>
          <div className="au-btns">
            <Link href="/cloud/get-hosted" className="au-btn-primary">
              Get Fully Managed <ArrowRight />
            </Link>
            <Link href="/cloud/plans" className="au-btn-ghost">
              View Plans
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
