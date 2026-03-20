'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { CLOUD_PLANS, CLOUD_ADDONS } from '@/lib/cloud-plans';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne, sans-serif)',
  body: 'var(--font-body, Outfit, sans-serif)',
  mono: 'var(--font-mono, "Fira Code", monospace)',
};

const STYLES = `
  .clp-page { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); min-height: 100vh; font-family: ${F.body}; }

  /* ── Hero ── */
  .clp-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .clp-hero-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px); width: 800px; height: 800px; background: radial-gradient(circle, ${A}12 0%, transparent 70%); top: -250px; left: 50%; transform: translateX(-50%); }
  .clp-hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 2; }
  .clp-label { display: flex; align-items: center; justify-content: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; }
  .clp-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .clp-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .clp-grad { background: linear-gradient(135deg, ${A} 0%, #A3DFD2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .clp-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 560px; margin: 0 auto; }

  /* ── Section shared ── */
  .clp-section { padding: 100px 32px; }
  .clp-section-alt { background: var(--bg-2, #111128); }
  .clp-container { max-width: 1200px; margin: 0 auto; }
  .clp-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .clp-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .clp-sec-h2 { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; line-height: 1.2; }
  .clp-centered { text-align: center; }
  .clp-centered .clp-sec-label { justify-content: center; }
  .clp-centered .clp-sec-desc { margin: 0 auto; }
  .clp-sec-desc { font-size: 1rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); max-width: 560px; margin-bottom: 8px; }

  /* ── Plans grid ── */
  .clp-plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 52px; }
  @media(max-width: 960px) { .clp-plans-grid { grid-template-columns: 1fr; max-width: 480px; margin-left: auto; margin-right: auto; } }

  .clp-plan { background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 24px; padding: 32px; position: relative; transition: all 0.35s; display: flex; flex-direction: column; }
  .clp-plan:hover { transform: translateY(-5px); border-color: ${A}28; box-shadow: 0 16px 48px rgba(0,0,0,0.2); }
  .clp-plan-highlighted { border-color: ${A}45; background: linear-gradient(160deg, ${A}10 0%, var(--bg-card, #13132B) 55%); }
  .clp-plan-highlighted:hover { border-color: ${A}60; }

  .clp-popular { display: inline-flex; align-items: center; gap: 5px; font-family: ${F.mono}; font-size: 0.62rem; font-weight: 600; padding: 4px 12px; border-radius: 100px; background: ${A}; color: #0C0C1D; margin-bottom: 20px; letter-spacing: 0.06em; }
  .clp-plan-name { font-family: ${F.display}; font-size: 1.25rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 4px; }
  .clp-plan-audience { font-size: 0.85rem; color: var(--text-secondary, #7C8DB0); margin-bottom: 16px; line-height: 1.5; }
  .clp-plan-price { font-family: ${F.display}; font-size: 3rem; font-weight: 800; color: var(--text-primary, #fff); letter-spacing: -0.04em; line-height: 1; margin-bottom: 4px; }
  .clp-plan-price span { font-size: 1rem; font-weight: 500; color: var(--text-secondary, #7C8DB0); }
  .clp-plan-period { font-family: ${F.mono}; font-size: 0.66rem; color: ${A}; margin-bottom: 24px; }
  .clp-plan-divider { height: 1px; background: var(--border, rgba(91,181,224,0.08)); margin: 20px 0; }
  .clp-plan-feats { list-style: none; padding: 0; margin: 0 0 28px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .clp-plan-feat { display: flex; align-items: flex-start; gap: 8px; font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }
  .clp-plan-feat-icon { flex-shrink: 0; margin-top: 2px; }
  .clp-plan-cta-primary { display: block; text-align: center; padding: 14px 20px; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; background: ${A}; color: #0C0C1D; transition: all 0.2s; }
  .clp-plan-cta-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 24px ${A}40; }
  .clp-plan-cta-outline { display: block; text-align: center; padding: 14px 20px; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; background: transparent; border: 1.5px solid ${A}40; color: ${A}; transition: all 0.2s; }
  .clp-plan-cta-outline:hover { background: ${A}12; border-color: ${A}70; }

  /* ── Invoice mockup ── */
  .clp-invoice-wrap { max-width: 520px; margin: 56px auto 0; }
  .clp-invoice { background: var(--bg-card, #13132B); border: 1px solid ${A}20; border-radius: 20px; padding: 36px; font-family: ${F.mono}; position: relative; overflow: hidden; }
  .clp-invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid ${A}15; }
  .clp-invoice-title { font-family: ${F.display}; font-size: 1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 4px; }
  .clp-invoice-date { font-size: 0.65rem; color: var(--text-muted, #4A5578); text-transform: uppercase; letter-spacing: 0.08em; }
  .clp-invoice-logo { font-family: ${F.mono}; font-size: 0.62rem; color: ${A}; letter-spacing: 0.1em; }
  .clp-invoice-line { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border, rgba(91,181,224,0.06)); }
  .clp-invoice-line:last-of-type { border-bottom: none; }
  .clp-invoice-line-label { font-size: 0.82rem; color: var(--text-secondary, #7C8DB0); }
  .clp-invoice-line-val { font-size: 0.84rem; color: var(--text-primary, #fff); }
  .clp-invoice-total-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0 0; margin-top: 6px; border-top: 1px solid ${A}25; }
  .clp-invoice-total-label { font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary, #fff); }
  .clp-invoice-total-val { font-family: ${F.display}; font-size: 1.4rem; font-weight: 800; color: ${A}; }
  .clp-invoice-stamp { position: absolute; bottom: 28px; right: 28px; transform: rotate(12deg); border: 2px solid ${A}; border-radius: 6px; padding: 5px 12px; font-family: ${F.mono}; font-size: 0.6rem; font-weight: 700; color: ${A}; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.6; pointer-events: none; }

  /* ── Add-ons ── */
  .clp-addons-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
  @media(max-width: 860px) { .clp-addons-grid { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 520px) { .clp-addons-grid { grid-template-columns: 1fr; } }
  .clp-addon { background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 16px; padding: 24px; position: relative; transition: all 0.3s; }
  .clp-addon::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; border-radius: 16px 16px 0 0; transition: opacity 0.3s; }
  .clp-addon:hover { transform: translateY(-3px); border-color: ${A}22; }
  .clp-addon:hover::before { opacity: 1; }
  .clp-addon-name { font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 4px; }
  .clp-addon-price { font-family: ${F.mono}; font-size: 0.78rem; color: ${A}; margin-bottom: 10px; }
  .clp-addon-desc { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.55; }

  /* ── Comparison table ── */
  .clp-comp-wrap { overflow-x: auto; margin-top: 48px; }
  .clp-comp-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; min-width: 600px; }
  .clp-comp-table thead th { font-family: ${F.mono}; font-size: 0.68rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; padding: 14px 20px; border-bottom: 1px solid var(--border, rgba(91,181,224,0.08)); color: var(--text-muted, #4A5578); text-align: center; }
  .clp-comp-table thead th:first-child { text-align: left; }
  .clp-comp-table thead th.clp-col-pro { color: ${A}; background: ${A}08; }
  .clp-comp-table tbody td { padding: 11px 20px; border-bottom: 1px solid var(--border, rgba(91,181,224,0.06)); color: var(--text-secondary, #7C8DB0); text-align: center; vertical-align: middle; }
  .clp-comp-table tbody td:first-child { color: var(--text-primary, #fff); font-weight: 500; text-align: left; }
  .clp-comp-table tbody td.clp-col-pro { background: ${A}05; }
  .clp-comp-table tbody tr:hover td { background: ${A}04; }
  .clp-comp-table tbody tr:hover td.clp-col-pro { background: ${A}08; }
  .clp-comp-table tbody .clp-group-header td { background: var(--bg-2, #111128); font-family: ${F.mono}; font-size: 0.65rem; color: var(--text-muted, #4A5578); text-transform: uppercase; letter-spacing: 0.1em; padding: 10px 20px; }

  /* ── FAQ ── */
  .clp-faq-list { display: flex; flex-direction: column; gap: 2px; margin-top: 48px; }
  .clp-faq-item { background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 12px; overflow: hidden; transition: border-color 0.2s; }
  .clp-faq-item:hover { border-color: ${A}20; }
  .clp-faq-q { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; cursor: pointer; gap: 16px; width: 100%; background: transparent; border: none; text-align: left; }
  .clp-faq-qtext { font-family: ${F.display}; font-size: 0.95rem; font-weight: 600; color: var(--text-primary, #fff); }
  .clp-faq-icon { flex-shrink: 0; color: ${A}; transition: transform 0.3s; }
  .clp-faq-icon-open { transform: rotate(45deg); }
  .clp-faq-a { padding: 0 24px 20px; font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); }

  /* ── CTA ── */
  .clp-cta-section { padding: 100px 32px; text-align: center; background: linear-gradient(135deg, ${A}10, var(--bg, #0C0C1D) 50%, ${A}06); }
  .clp-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .clp-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
  .clp-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .clp-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px ${A}25; }
  .clp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px ${A}40; }
  .clp-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .clp-btn-ghost:hover { border-color: ${A}; color: ${A}; }
`;

const EASE = [0.16, 1, 0.3, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ── Reveal ──
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

// ── Icons ──
function Check({ color = A }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="clp-plan-feat-icon" aria-hidden="true">
      <path d="M2.5 7.5l3.5 3.5 6.5-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', opacity: 0.3 }}>
      <path d="M4 4l7 7M11 4l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Plus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Comparison table data ──
type RowVal = boolean | string;
interface CompRow {
  group?: string;
  feature?: string;
  launch?: RowVal;
  professional?: RowVal;
  enterprise?: RowVal;
}

const COMP_ROWS: CompRow[] = [
  { group: 'Compute' },
  { feature: 'vCPU', launch: '2 cores', professional: '4 cores', enterprise: '16 cores' },
  { feature: 'RAM', launch: '4 GB', professional: '16 GB', enterprise: '64 GB' },
  { feature: 'Storage', launch: '50 GB SSD', professional: '200 GB NVMe', enterprise: '1 TB NVMe' },
  { feature: 'Bandwidth', launch: '1 TB/mo', professional: '5 TB/mo', enterprise: 'Unlimited' },
  { group: 'Deployments' },
  { feature: 'Deployment pipeline', launch: true, professional: true, enterprise: true },
  { feature: 'CI/CD auto-deploy', launch: false, professional: true, enterprise: true },
  { feature: 'Zero-downtime deploys', launch: false, professional: true, enterprise: true },
  { feature: 'Canary deployments', launch: false, professional: false, enterprise: true },
  { feature: 'Staging environment', launch: false, professional: true, enterprise: true },
  { feature: 'Preview per PR', launch: false, professional: false, enterprise: true },
  { group: 'Databases' },
  { feature: 'Managed database', launch: true, professional: true, enterprise: true },
  { feature: 'Connection pooling', launch: true, professional: true, enterprise: true },
  { feature: 'Read replica', launch: false, professional: true, enterprise: true },
  { feature: 'Multi-DB / failover', launch: false, professional: false, enterprise: true },
  { feature: 'Database sharding', launch: false, professional: false, enterprise: true },
  { group: 'Backups' },
  { feature: 'Automated backups', launch: 'Daily', professional: 'Daily + on-demand', enterprise: 'Hourly' },
  { feature: 'Retention', launch: '7 days', professional: '30 days', enterprise: '90 days' },
  { feature: 'Point-in-time restore', launch: false, professional: true, enterprise: true },
  { feature: 'Cross-region backups', launch: false, professional: false, enterprise: true },
  { group: 'Security' },
  { feature: 'Firewall + DDoS', launch: true, professional: true, enterprise: true },
  { feature: 'SSL certificates', launch: true, professional: true, enterprise: true },
  { feature: 'Custom domains + wildcard SSL', launch: false, professional: true, enterprise: true },
  { feature: 'Certificate pinning + HSTS', launch: false, professional: false, enterprise: true },
  { feature: 'Compliance ready (SOC2/GDPR)', launch: false, professional: false, enterprise: true },
  { group: 'Scaling' },
  { feature: 'Vertical scaling', launch: true, professional: true, enterprise: true },
  { feature: 'Horizontal scaling', launch: false, professional: true, enterprise: true },
  { feature: 'Auto-scaling', launch: false, professional: 'Up to 8 cores', enterprise: 'Unlimited' },
  { feature: 'Multi-region redundancy', launch: false, professional: false, enterprise: true },
  { group: 'Support' },
  { feature: 'Uptime SLA', launch: '99.9%', professional: '99.95%', enterprise: '99.99%' },
  { feature: 'Email support', launch: '48h response', professional: '4h response', enterprise: '1h response' },
  { feature: 'Slack support', launch: false, professional: true, enterprise: true },
  { feature: 'Phone support', launch: false, professional: false, enterprise: true },
  { feature: 'Dedicated account engineer', launch: false, professional: false, enterprise: true },
  { feature: '24/7 on-call', launch: false, professional: false, enterprise: true },
];

// ── FAQs ──
const FAQS = [
  {
    q: 'What does the management fee cover?',
    a: 'The management fee covers everything we do to keep your infrastructure running — deployment pipelines, SSL certificates, DNS configuration, backup management, monitoring, scaling, security patching, and engineering time. The cloud provider cost (AWS, DigitalOcean, etc.) is a separate line item at exact cost.',
  },
  {
    q: 'Is there a markup on hosting costs?',
    a: 'No. Zero. Your cloud provider bill goes directly to your card. Our management fee is always a separate, transparent line item. We earn on management, not on marking up compute.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. Upgrade or downgrade any time. Upgrades take effect immediately, downgrades at the next billing cycle. No penalties, no lock-in periods.',
  },
  {
    q: 'What happens to my infrastructure if I cancel?',
    a: "Your servers keep running. We hand over all access credentials, infrastructure documentation, and deployment configs. Everything is yours — we just stop managing it. We give you a clean handover with a 30-day notice period.",
  },
  {
    q: 'Can I keep my existing cloud provider?',
    a: "Yes. We work with AWS, DigitalOcean, Vercel, Railway, Hetzner, and others. If you're already on a provider, we can manage it from where you are or migrate you if a different provider is a better fit.",
  },
  {
    q: 'Do I need both Cloud and Services?',
    a: "Cloud manages infrastructure — servers, deployments, databases, CDN, SSL, backups. Services manages your application code — bugs, performance, feature updates, monitoring. They're complementary. Many clients use both for full coverage.",
  },
  {
    q: 'How does billing work exactly?',
    a: 'Two invoices per month: one from your cloud provider for hosting (at exact cost), one from us for management. Monthly billing, no annual contract required. Payment by card.',
  },
  {
    q: 'What if my traffic spikes beyond my plan?',
    a: "We scale your infrastructure to handle the load regardless of plan. On Launch, we alert you and discuss a plan upgrade. On Professional and Enterprise, auto-scaling handles spikes automatically without any action from you or us.",
  },
];

// ── FAQ Item ──
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="clp-faq-item">
      <button
        className="clp-faq-q"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="clp-faq-qtext">{q}</span>
        <span className={`clp-faq-icon${open ? ' clp-faq-icon-open' : ''}`}>
          <Plus />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="clp-faq-a">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Cell renderer ──
function CompCell({ val, isPro }: { val?: RowVal; isPro?: boolean }) {
  if (val === true) {
    return <Check color={isPro ? A : `${A}80`} />;
  }
  if (val === false) {
    return <XMark />;
  }
  if (typeof val === 'string') {
    return <span style={{ fontFamily: F.mono, fontSize: '0.72rem', color: isPro ? A : 'var(--text-secondary, #7C8DB0)' }}>{val}</span>;
  }
  return null;
}

export default function CloudPlansPage() {
  return (
    <main className="clp-page">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="clp-hero">
        <div className="clp-hero-orb" />
        <motion.div
          className="clp-hero-inner"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={reveal} className="clp-label">Cloud Hosting Plans</motion.div>
          <motion.h1 variants={reveal} className="clp-h1">
            Simple,{' '}
            <span className="clp-grad">Honest Pricing</span>
          </motion.h1>
          <motion.p variants={reveal} className="clp-sub">
            No hidden fees. No surprise bills. Pay once a month, cancel anytime.
          </motion.p>
        </motion.div>
      </section>

      {/* ── PLANS ── */}
      <section className="clp-section clp-section-alt">
        <div className="clp-container">
          <Reveal>
            <div className="clp-centered">
              <div className="clp-sec-label">Management Tiers</div>
              <h2 className="clp-sec-h2">Choose the right level of management</h2>
              <p className="clp-sec-desc">
                All plans include zero markup on hosting. You pay the cloud provider directly.
              </p>
            </div>
          </Reveal>

          <motion.div
            className="clp-plans-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {CLOUD_PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={reveal}
                className={`clp-plan${plan.highlighted ? ' clp-plan-highlighted' : ''}`}
              >
                {plan.badge && (
                  <div className="clp-popular">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M5 1l1 2.5L8.5 4l-2 2 .5 2.5L5 7 2 8.5l.5-2.5-2-2L3 3z" stroke="#0C0C1D" strokeWidth="1.2" fill="#0C0C1D" />
                    </svg>
                    {plan.badge}
                  </div>
                )}
                <div className="clp-plan-name">{plan.name}</div>
                <div className="clp-plan-price">
                  ${plan.price}<span>/{plan.period}</span>
                </div>
                <div className="clp-plan-period">management fee — hosting billed separately</div>
                <div className="clp-plan-audience">{plan.description}</div>

                {/* Specs */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  {plan.specs.map(spec => (
                    <div key={spec.label} style={{ padding: '4px 10px', background: `${A}10`, border: `1px solid ${A}18`, borderRadius: 6 }}>
                      <span style={{ fontFamily: F.mono, fontSize: '0.6rem', color: `${A}80` }}>{spec.label}:</span>
                      {' '}
                      <span style={{ fontFamily: F.mono, fontSize: '0.62rem', color: A }}>{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="clp-plan-divider" />

                <ul className="clp-plan-feats">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="clp-plan-feat">
                      <Check color={plan.highlighted ? A : `${A}80`} />
                      <span style={i === 0 && feat.toLowerCase().startsWith('everything') ? { color: 'var(--text-primary, #fff)', fontWeight: 600 } : {}}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/cloud/get-hosted"
                  className={plan.highlighted ? 'clp-plan-cta-primary' : 'clp-plan-cta-outline'}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INVOICE MOCKUP ── */}
      <section className="clp-section">
        <div className="clp-container">
          <Reveal>
            <div className="clp-centered">
              <div className="clp-sec-label">Billing Transparency</div>
              <h2 className="clp-sec-h2">This is what your invoice looks like</h2>
              <p className="clp-sec-desc">Two line items. Every month. Nothing hidden.</p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="clp-invoice-wrap">
              <div className="clp-invoice">
                <div className="clp-invoice-header">
                  <div>
                    <div className="clp-invoice-title">SocioFi Cloud Invoice</div>
                    <div className="clp-invoice-date">March 2026</div>
                  </div>
                  <div className="clp-invoice-logo">SOCIOFI CLOUD</div>
                </div>

                {[
                  { label: 'DigitalOcean (pass-through, at cost)', val: '$48.00' },
                  { label: 'SocioFi Cloud — Professional plan', val: '$349.00' },
                  { label: 'SSL Certificate', val: '$0.00' },
                  { label: 'Bandwidth (within plan)', val: '$0.00' },
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    className="clp-invoice-line"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.3, duration: 0.45, ease: EASE }}
                  >
                    <span className="clp-invoice-line-label">{line.label}</span>
                    <span className="clp-invoice-line-val">{line.val}</span>
                  </motion.div>
                ))}

                <motion.div
                  className="clp-invoice-total-row"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                >
                  <span className="clp-invoice-total-label">Total due</span>
                  <span className="clp-invoice-total-val">$397.00</span>
                </motion.div>

                <div className="clp-invoice-stamp">No Surprise Charges</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ADD-ONS ── */}
      <section className="clp-section clp-section-alt">
        <div className="clp-container">
          <Reveal>
            <div className="clp-sec-label">Add-Ons</div>
            <h2 className="clp-sec-h2">Expand your plan when you need it</h2>
            <p className="clp-sec-desc" style={{ maxWidth: 520 }}>
              Add individual services to any plan. Pay only for what you use.
            </p>
          </Reveal>

          <div className="clp-addons-grid">
            {CLOUD_ADDONS.map((addon, i) => (
              <Reveal key={addon.id} delay={i * 0.06}>
                <div className="clp-addon">
                  <div className="clp-addon-name">{addon.name}</div>
                  <div className="clp-addon-price">
                    ${addon.price} / {addon.unit}
                  </div>
                  <div className="clp-addon-desc">{addon.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="clp-section">
        <div className="clp-container">
          <Reveal>
            <div className="clp-sec-label">Feature Comparison</div>
            <h2 className="clp-sec-h2">Everything, side by side</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="clp-comp-wrap">
              <table className="clp-comp-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Feature</th>
                    <th>Launch</th>
                    <th className="clp-col-pro">Professional</th>
                    <th>Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMP_ROWS.map((row, i) => {
                    if (row.group) {
                      return (
                        <tr key={i} className="clp-group-header">
                          <td colSpan={4}>{row.group}</td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={i}>
                        <td>{row.feature}</td>
                        <td><CompCell val={row.launch} /></td>
                        <td className="clp-col-pro"><CompCell val={row.professional} isPro /></td>
                        <td><CompCell val={row.enterprise} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="clp-section clp-section-alt">
        <div className="clp-container">
          <Reveal>
            <div className="clp-centered">
              <div className="clp-sec-label">Questions</div>
              <h2 className="clp-sec-h2">Pricing & billing — answered</h2>
            </div>
          </Reveal>

          <motion.div
            className="clp-faq-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {FAQS.map((faq, i) => (
              <motion.div key={i} variants={reveal}>
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="clp-cta-section">
        <Reveal>
          <div className="clp-label">Get Started</div>
          <h2 className="clp-cta-h2">Start with Launch</h2>
          <p className="clp-cta-sub">
            Ship your MVP and worry about infrastructure later. Start small, scale when you need to. We make switching plans seamless.
          </p>
          <div className="clp-btns">
            <Link href="/cloud/get-hosted" className="clp-btn-primary">
              Start with Launch <ArrowRight />
            </Link>
            <Link href="/contact" className="clp-btn-ghost">
              Talk to us <ArrowRight />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
