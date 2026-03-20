'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.pr-hero {
  min-height: 46vh;
  display: flex;
  align-items: center;
  padding: 130px 0 64px;
  position: relative;
  overflow: hidden;
}
.pr-hero::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 640px; height: 640px;
  background: radial-gradient(circle, rgba(232,184,77,0.06) 0%, transparent 68%);
  pointer-events: none;
}
.pr-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.pr-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.pr-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.pr-hero-title {
  font-family: ${F.h};
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.07;
  letter-spacing: -0.032em;
  color: var(--text-primary);
  margin-bottom: 20px;
  max-width: 700px;
}
.pr-hero-sub {
  font-family: ${F.b};
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.72;
  max-width: 540px;
}
.pr-section-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.pr-section-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.pr-section-title {
  font-family: ${F.h};
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 32px;
}

/* ── Courses Table ── */
.pr-courses-section {
  padding: 80px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.pr-table-wrap {
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid var(--border);
}
.pr-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card);
}
.pr-table thead {
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}
.pr-table th {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 14px 20px;
  text-align: left;
  font-weight: 500;
}
.pr-table td {
  padding: 14px 20px;
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  line-height: 1.4;
}
.pr-table tr:last-child td { border-bottom: none; }
.pr-table tbody tr {
  transition: background 0.18s ease;
}
.pr-table tbody tr:hover { background: rgba(232,184,77,0.04); }
.pr-course-name-cell {
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}
.pr-audience-tag {
  display: inline-block;
  font-family: ${F.m};
  font-size: 0.55rem;
  color: ${A};
  border: 1px solid rgba(232,184,77,0.25);
  border-radius: 100px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pr-price-cell {
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 700;
  color: ${A};
}
.pr-enroll-cell a {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  text-decoration: none;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.pr-enroll-cell a:hover { opacity: 0.75; }

/* ── Bundles ── */
.pr-bundles-section {
  padding: 80px 0;
  background: var(--bg);
}
.pr-bundles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) { .pr-bundles-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .pr-bundles-grid { grid-template-columns: 1fr; } }
.pr-bundle-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 26px 22px;
  position: relative;
  transition: all 0.35s ease;
}
.pr-bundle-card:hover { border-color: rgba(232,184,77,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(232,184,77,0.07); }
.pr-bundle-card.best {
  border-color: rgba(232,184,77,0.45);
  background: linear-gradient(160deg, var(--bg-card), rgba(232,184,77,0.04));
}
.pr-best-badge {
  position: absolute;
  top: -11px; right: 16px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.m};
  font-size: 0.58rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.pr-bundle-count {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}
.pr-bundle-name {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.pr-bundle-desc {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
}
.pr-bundle-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}
.pr-bundle-price {
  font-family: ${F.h};
  font-size: 1.5rem;
  font-weight: 800;
  color: ${A};
}
.pr-bundle-original {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: line-through;
}
.pr-save-badge {
  display: inline-block;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.25);
  border-radius: 100px;
  padding: 2px 10px;
  font-family: ${F.m};
  font-size: 0.6rem;
  color: ${A};
  letter-spacing: 0.06em;
  margin-bottom: 16px;
  font-weight: 700;
}
.pr-bundle-cta {
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: rgba(232,184,77,0.1);
  border: 1.5px solid rgba(232,184,77,0.3);
  border-radius: 9px;
  color: ${A};
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.22s ease;
}
.pr-bundle-card.best .pr-bundle-cta {
  background: ${A};
  border-color: ${A};
  color: #1a1a1a;
}
.pr-bundle-cta:hover { background: ${A}; border-color: ${A}; color: #1a1a1a; }

/* ── SCARL ── */
.pr-scarl-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.pr-scarl-card {
  background: var(--bg-card);
  border: 1.5px solid rgba(232,184,77,0.3);
  border-radius: 20px;
  padding: 36px 32px;
  max-width: 800px;
  position: relative;
  overflow: hidden;
}
.pr-scarl-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.3));
}
.pr-scarl-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.pr-scarl-heading {
  font-family: ${F.h};
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}
.pr-scarl-desc {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 480px;
}
.pr-scarl-tiers {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.pr-scarl-tier {
  text-align: center;
  padding: 12px 18px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  min-width: 110px;
}
.pr-scarl-tier-price {
  font-family: ${F.h};
  font-size: 1.1rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 2px;
}
.pr-scarl-tier-label {
  font-family: ${F.m};
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pr-scarl-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: ${A};
  text-decoration: none;
  margin-top: 16px;
}
.pr-scarl-link:hover { opacity: 0.8; }

/* ── Workshops Table ── */
.pr-workshops-section {
  padding: 72px 0;
  background: var(--bg);
}
.pr-ws-table-wrap {
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid var(--border);
}
.pr-ws-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card);
}
.pr-ws-table th {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 14px 20px;
  text-align: left;
  font-weight: 500;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}
.pr-ws-table td {
  padding: 14px 20px;
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}
.pr-ws-table tr:last-child td { border-bottom: none; }
.pr-ws-table tbody tr:hover { background: rgba(232,184,77,0.04); }
.pr-ws-name {
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}
.pr-ws-price {
  font-family: ${F.h};
  font-weight: 700;
  color: ${A};
}
.pr-ws-date {
  font-family: ${F.m};
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}
.pr-free-tag {
  display: inline-block;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.25);
  color: ${A};
  font-family: ${F.m};
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ── Corporate ── */
.pr-corporate-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.pr-corporate-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 768px) { .pr-corporate-grid { grid-template-columns: 1fr; } }
.pr-corp-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}
.pr-corp-card:hover { border-color: rgba(232,184,77,0.25); transform: translateY(-3px); }
.pr-corp-tier {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 6px;
}
.pr-corp-title {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.pr-corp-price {
  font-family: ${F.h};
  font-size: 1.3rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 12px;
}
.pr-corp-desc {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 16px;
}
.pr-corp-link {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.pr-corp-link:hover { opacity: 0.75; }

/* ── Decision Helper ── */
.pr-helper-section {
  padding: 72px 0;
  background: var(--bg);
}
.pr-helper-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 32px;
  max-width: 680px;
}
.pr-helper-title {
  font-family: ${F.h};
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.pr-decision-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pr-decision-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 14px;
  background: var(--bg-2);
  border-radius: 12px;
}
.pr-decision-if {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  width: 60px;
  padding-top: 2px;
}
.pr-decision-condition {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex: 1;
}
.pr-decision-arrow {
  color: ${A};
  flex-shrink: 0;
  padding-top: 2px;
}
.pr-decision-rec {
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

/* ── FAQ ── */
.pr-faq-section {
  padding: 72px 0 80px;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.pr-faq-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 720px;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}
.pr-faq-item {
  border-bottom: 1px solid var(--border);
}
.pr-faq-item:last-child { border-bottom: none; }
.pr-faq-q {
  width: 100%;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--bg-card);
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 12px;
  transition: background 0.18s ease;
}
.pr-faq-q:hover { background: var(--bg-card-hover); }
.pr-faq-icon {
  flex-shrink: 0;
  transition: transform 0.25s ease;
  color: ${A};
}
.pr-faq-icon.open { transform: rotate(45deg); }
.pr-faq-a {
  padding: 0 22px 18px;
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.7;
  background: var(--bg-card);
}
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function Plus({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1={12} y1={5} x2={12} y2={19} />
      <line x1={5} y1={12} x2={19} y2={12} />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const COURSES = [
  { name: "Reading Technical Documentation (Without Panicking)", audience: 'For Teams', duration: '2 hours', price: 39, slug: 'reading-technical-documentation' },
  { name: "Build vs Buy vs Agent: The Decision Framework", audience: 'For Leaders', duration: '2 hours', price: 49, slug: 'build-vs-buy-vs-agent' },
  { name: "From Idea to MVP: The Founder's Playbook", audience: 'For Founders', duration: '3 hours', price: 59, slug: 'from-idea-to-mvp' },
  { name: "How to Spec a Software Product", audience: 'For Founders', duration: '4 hours', price: 79, slug: 'how-to-spec-a-software-product' },
  { name: "The SaaS to AaaS Transition", audience: 'For Leaders', duration: '3 hours', price: 79, slug: 'saas-to-aaas-transition' },
  { name: "Working with AI Agents in Your Organization", audience: 'For Teams', duration: '3 hours', price: 79, slug: 'working-with-ai-agents' },
  { name: "Understanding AI Agents for Business", audience: 'For Founders', duration: '4 hours', price: 99, slug: 'understanding-ai-agents-for-business' },
  { name: "Managing AI-Powered Development", audience: 'For Leaders', duration: '5 hours', price: 129, slug: 'managing-ai-powered-development' },
  { name: "AI Development for Founders", audience: 'For Founders', duration: '6 hours', price: 149, slug: 'ai-development-for-founders' },
  { name: "Technical Literacy for Non-Technical Teams", audience: 'For Teams', duration: '6 hours', price: 149, slug: 'technical-literacy-for-teams' },
];

const BUNDLES = [
  { slug: 'founder', name: 'Founder Bundle', count: 4, desc: '4 courses for solo founders', price: 299, original: 386, save: 23, perPerson: false, best: false },
  { slug: 'leader', name: 'Leader Bundle', count: 3, desc: '3 courses for managers and team leads', price: 199, original: 257, save: 23, perPerson: false, best: false },
  { slug: 'team', name: 'Team Bundle', count: 3, desc: '3 courses for non-technical teams', price: 199, original: 267, save: 25, perPerson: true, best: false },
  { slug: 'complete', name: 'Complete Academy', count: 10, desc: 'All 10 courses. Every path. Maximum value.', price: 599, original: 911, save: 34, perPerson: false, best: true },
];

const WORKSHOPS = [
  { name: 'How AI Builds Software', format: 'Webinar', duration: '90 min', price: 0, next: 'Apr 3, 2026' },
  { name: 'Spec Your First AI Product', format: 'Workshop', duration: '3 hours', price: 89, next: 'Apr 10, 2026' },
  { name: 'AI Agents Explained for Business', format: 'Webinar', duration: '60 min', price: 0, next: 'Apr 17, 2026' },
  { name: 'Build vs Buy: Live Case Studies', format: 'Workshop', duration: '2 hours', price: 69, next: 'May 1, 2026' },
  { name: 'SCARL Certification Prep', format: 'Bootcamp', duration: '2 days', price: 499, next: 'May 14–15, 2026' },
];

const CORPORATE_TIERS = [
  { tier: 'Team', title: '5–15 People', price: '$149/person', desc: 'Any 3 courses + private Q&A session + 30 days post-training support.' },
  { tier: 'Department', title: '15–50 People', price: '$129/person', desc: 'Full curriculum + 2 live sessions + optional SCARL certification + 60 days support.' },
  { tier: 'Custom', title: 'Any Size', price: 'Custom quote', desc: 'Tailored curriculum, custom scheduling, in-person option, executive briefings available.' },
];

const DECISIONS = [
  { condition: "Taking 1–2 courses", rec: "Buy individually" },
  { condition: "Taking 3+ in one path", rec: "Get the bundle — save 23–25%" },
  { condition: "Want everything", rec: "Complete Academy — $599 (save 34%)" },
  { condition: "Team of 5+", rec: "Corporate pricing — more savings + live sessions" },
  { condition: "Want certification", rec: "SCARL Program — $499" },
];

const FAQS = [
  { q: "Do I get lifetime access?", a: "Yes. Every course and bundle purchase includes lifetime access. You can revisit any lesson whenever you need to — there are no time limits or expiration dates." },
  { q: "What's the refund policy?", a: "30-day money-back guarantee on all individual courses and bundles. If you're not satisfied for any reason within 30 days of purchase, we'll refund you in full — no questions asked." },
  { q: "Are there discounts for teams?", a: "Yes. For teams of 5 or more, corporate pricing offers significant per-seat savings compared to individual enrollments. You also get live sessions, custom scheduling, and post-training support included. See the Corporate section above." },
  { q: "Can I upgrade from an individual course to a bundle?", a: "Yes. If you've already purchased a course that's part of a bundle, contact us and we'll apply the course price as credit toward the bundle price. You only pay the difference." },
  { q: "Is corporate invoicing available?", a: "Yes. We issue invoices for corporate training engagements. Payment by bank transfer or card is accepted. Contact us at the corporate inquiry form to get started." },
];

const rveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } };

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQItem({ faq }: { faq: typeof FAQS[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pr-faq-item">
      <button className="pr-faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{faq.q}</span>
        <span className={`pr-faq-icon${open ? ' open' : ''}`}><Plus size={14} /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} style={{ overflow: 'hidden' }}>
            <p className="pr-faq-a">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="pr-hero">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-label">Pricing</div>
            <h1 className="pr-hero-title">Simple, Transparent Pricing.</h1>
            <p className="pr-hero-sub">
              No subscriptions. No recurring fees. Buy what you need, access it forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Individual Courses ── */}
      <section className="pr-courses-section">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-section-label">Individual courses</div>
            <h2 className="pr-section-title">Buy exactly what you need.</h2>
          </motion.div>
          <motion.div className="pr-table-wrap"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <table className="pr-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Audience</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {COURSES.map(c => (
                  <tr key={c.slug}>
                    <td><span className="pr-course-name-cell">{c.name}</span></td>
                    <td><span className="pr-audience-tag">{c.audience}</span></td>
                    <td>{c.duration}</td>
                    <td><span className="pr-price-cell">${c.price}</span></td>
                    <td className="pr-enroll-cell">
                      <Link href={`/academy/enroll?course=${c.slug}`}>Enroll <ArrowRight size={9} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── Bundles ── */}
      <section className="pr-bundles-section">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-section-label">Bundles</div>
            <h2 className="pr-section-title">Save more with bundles.</h2>
          </motion.div>
          <div className="pr-bundles-grid">
            {BUNDLES.map((b, i) => (
              <motion.div key={b.slug} className={`pr-bundle-card${b.best ? ' best' : ''}`}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}>
                {b.best && <span className="pr-best-badge">Best Value</span>}
                <div className="pr-bundle-count">{b.count} courses</div>
                <div className="pr-bundle-name">{b.name}</div>
                <div className="pr-bundle-desc">{b.desc}</div>
                <div className="pr-bundle-pricing">
                  <span className="pr-bundle-price">${b.price}</span>
                  <span className="pr-bundle-original">${b.original}</span>
                </div>
                <div className="pr-save-badge">Save {b.save}%{b.perPerson ? ' · per person' : ''}</div>
                <Link href={`/academy/enroll?bundle=${b.slug}`} className="pr-bundle-cta">
                  Enroll →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCARL ── */}
      <section className="pr-scarl-section">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-section-label">Certification</div>
            <h2 className="pr-section-title">SCARL Certification.</h2>
          </motion.div>
          <motion.div className="pr-scarl-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="pr-scarl-top">
              <div>
                <div className="pr-scarl-heading">SocioFi Certified AI-Ready Leader (SCARL)</div>
                <p className="pr-scarl-desc">A formal certification for professionals who complete the program, pass the assessment, and demonstrate working knowledge of AI development for business.</p>
              </div>
              <div className="pr-scarl-tiers">
                <div className="pr-scarl-tier">
                  <div className="pr-scarl-tier-price">$499</div>
                  <div className="pr-scarl-tier-label">Standard</div>
                </div>
                <div className="pr-scarl-tier">
                  <div className="pr-scarl-tier-price">$399</div>
                  <div className="pr-scarl-tier-label">Early bird</div>
                </div>
                <div className="pr-scarl-tier">
                  <div className="pr-scarl-tier-price">$349</div>
                  <div className="pr-scarl-tier-label">5+ seats</div>
                </div>
              </div>
            </div>
            <Link href="/academy/certification" className="pr-scarl-link">
              Learn more about SCARL <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Workshops ── */}
      <section className="pr-workshops-section">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-section-label">Live workshops</div>
            <h2 className="pr-section-title">Workshops & events.</h2>
          </motion.div>
          <motion.div className="pr-ws-table-wrap"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <table className="pr-ws-table">
              <thead>
                <tr>
                  <th>Workshop</th>
                  <th>Format</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Next date</th>
                </tr>
              </thead>
              <tbody>
                {WORKSHOPS.map((w, i) => (
                  <tr key={i}>
                    <td><span className="pr-ws-name">{w.name}</span></td>
                    <td>{w.format}</td>
                    <td>{w.duration}</td>
                    <td>
                      {w.price === 0
                        ? <span className="pr-free-tag">Free</span>
                        : <span className="pr-ws-price">${w.price}</span>
                      }
                    </td>
                    <td><span className="pr-ws-date">{w.next}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── Corporate ── */}
      <section className="pr-corporate-section">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-section-label">Teams & organizations</div>
            <h2 className="pr-section-title">Corporate training pricing.</h2>
          </motion.div>
          <div className="pr-corporate-grid">
            {CORPORATE_TIERS.map((t, i) => (
              <motion.div key={t.tier} className="pr-corp-card"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}>
                <div className="pr-corp-tier">{t.tier}</div>
                <div className="pr-corp-title">{t.title}</div>
                <div className="pr-corp-price">{t.price}</div>
                <p className="pr-corp-desc">{t.desc}</p>
                <Link href="/academy/corporate" className="pr-corp-link">
                  See details <ArrowRight size={9} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Decision Helper ── */}
      <section className="pr-helper-section">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-section-label">Decision guide</div>
            <h2 className="pr-section-title">What's the best option for you?</h2>
          </motion.div>
          <motion.div className="pr-helper-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="pr-helper-title">Match your situation to the right option.</div>
            <div className="pr-decision-list">
              {DECISIONS.map((d, i) => (
                <div key={i} className="pr-decision-row">
                  <span className="pr-decision-if">If</span>
                  <span className="pr-decision-condition">{d.condition}</span>
                  <span className="pr-decision-arrow"><ArrowRight size={12} /></span>
                  <span className="pr-decision-rec">{d.rec}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pr-faq-section">
        <div className="pr-inner">
          <motion.div {...rveal}>
            <div className="pr-section-label">FAQ</div>
            <h2 className="pr-section-title">Pricing questions.</h2>
          </motion.div>
          <div className="pr-faq-list">
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
          </div>
        </div>
      </section>
    </>
  );
}
