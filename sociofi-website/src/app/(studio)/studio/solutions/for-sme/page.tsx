'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.sme-page { overflow-x: hidden; background: var(--bg); }

.sec-label {
  font-family: ${F.m};
  font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase;
  letter-spacing: 0.12em; margin-bottom: 14px;
  display: flex; align-items: center; gap: 10px;
}
.sec-label::before {
  content: ''; width: 20px; height: 1.5px;
  background: ${A}; display: inline-block; flex-shrink: 0;
}
.gradient-text {
  background: linear-gradient(135deg, #4A6CB8 0%, ${A} 50%, #A3DFD2 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .gradient-text { -webkit-text-fill-color: unset; } }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #3A589E, ${A});
  color: #fff; border: none; border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(58,88,158,0.5); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: transparent; color: var(--text-primary);
  border: 1.5px solid var(--border); border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-ghost:hover { border-color: ${A}; color: ${A}; transform: translateY(-2px); }

/* Use case cards */
.sme-use-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 768px) { .sme-use-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .sme-use-grid { grid-template-columns: 1fr; } }
.sme-use-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
}
.sme-use-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #3A589E, ${A});
  opacity: 0; transition: opacity 0.3s;
}
.sme-use-card:hover { border-color: var(--border-hover); transform: translateY(-4px); }
.sme-use-card:hover::before { opacity: 1; }
.sme-use-arrow {
  width: 32px; height: 32px;
  background: ${A}18;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
  color: ${A};
}

/* How it works */
.sme-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
@media (max-width: 768px) { .sme-steps { grid-template-columns: 1fr; } }
.sme-step {
  background: var(--bg-card);
  padding: 36px 32px;
}

/* Comparison table */
.sme-compare {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
}
.sme-compare-head {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr;
  gap: 0;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}
@media (max-width: 768px) {
  .sme-compare-head { grid-template-columns: 1.2fr 1fr 1fr 1fr; }
  .sme-compare-row { grid-template-columns: 1.2fr 1fr 1fr 1fr; }
}
.sme-compare-head-cell {
  padding: 16px 20px;
  font-family: ${F.h}; font-size: 0.8rem; font-weight: 700;
  color: var(--text-primary);
  border-right: 1px solid var(--border);
}
.sme-compare-head-cell:last-child { border-right: none; }
.sme-compare-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr;
  gap: 0;
  border-bottom: 1px solid var(--border);
}
.sme-compare-row:last-child { border-bottom: none; }
.sme-compare-cell {
  padding: 16px 20px;
  font-family: ${F.b}; font-size: 0.86rem;
  color: var(--text-secondary); line-height: 1.5;
  border-right: 1px solid var(--border);
}
.sme-compare-cell:last-child { border-right: none; }
.sme-compare-cell.label {
  font-family: ${F.h}; font-weight: 600;
  color: var(--text-primary); font-size: 0.84rem;
}
.sme-compare-cell.highlight {
  color: ${A}; background: ${A}06;
}

/* Testimonials */
.sme-test-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
}
@media (max-width: 768px) { .sme-test-grid { grid-template-columns: 1fr; } }
.sme-test-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 32px;
}
.sme-q-mark {
  font-family: ${F.h}; font-size: 3rem; line-height: 0.5;
  color: ${A}; margin-bottom: 16px; display: block;
}

/* Pricing */
.sme-price-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
}
@media (max-width: 900px) { .sme-price-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .sme-price-grid { grid-template-columns: 1fr; } }
.sme-price-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 32px;
  position: relative;
  transition: border-color 0.3s, transform 0.3s;
}
.sme-price-card:hover { transform: translateY(-4px); border-color: var(--border-hover); }
.sme-price-card.popular { border-color: ${A}44; }
.sme-price-tag {
  display: inline-block; padding: 4px 12px; border-radius: 100px;
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  background: ${A}22; color: ${A}; margin-bottom: 20px;
}

/* FAQ */
.sme-faq-item { border-bottom: 1px solid var(--border); }
.sme-faq-q {
  width: 100%; background: none; border: none;
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0; cursor: pointer; text-align: left; gap: 16px;
}
.sme-faq-a { padding-bottom: 20px; overflow: hidden; }

/* CTA */
.sme-cta {
  background: linear-gradient(135deg, rgba(58,88,158,0.1) 0%, rgba(89,163,146,0.1) 100%);
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
`;

// ── Reveal ───────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const ChevronDown = ({ open = false }: { open?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

// ── FAQ item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sme-faq-item">
      <button className="sme-faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span style={{ fontFamily: F.h, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{q}</span>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}><ChevronDown open={open} /></span>
      </button>
      {open && (
        <motion.div className="sme-faq-a"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{a}</div>
        </motion.div>
      )}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const USE_CASES = [
  {
    problem: 'We track everything in spreadsheets',
    solution: 'Internal tool / dashboard',
    body: 'A real application with real-time data, role-based access, and the workflows your team actually uses.',
  },
  {
    problem: 'Our team spends hours copying data between systems',
    solution: 'Automation & integration',
    body: 'Connect your tools. Automate the repetitive parts. Your team focuses on work that matters.',
  },
  {
    problem: "We need a customer portal but can't afford agency prices",
    solution: 'Product development',
    body: 'A full client-facing portal with login, dashboards, and self-service features — at a fixed price.',
  },
  {
    problem: "Our old software doesn't work the way our business does",
    solution: 'Rescue & rebuild',
    body: 'We assess what to keep, rebuild what\'s broken, and deliver something that fits how your business actually operates.',
  },
  {
    problem: 'We want to offer our clients a self-service platform',
    solution: 'SaaS / customer portal',
    body: 'Turn your service into a product. Your clients get self-service access; your team gets time back.',
  },
  {
    problem: 'Our reports take half a day to compile manually',
    solution: 'Reporting dashboard',
    body: 'Live data. Automated reports. The visibility your leadership needs without the manual effort.',
  },
];

const COMPARE_ROWS = [
  {
    label: 'One-time project cost',
    sociofi: '$3K–$20K',
    hire: '$60K–$120K/yr',
    agency: '$40K–$150K',
  },
  {
    label: 'Ongoing monthly cost',
    sociofi: '$0 or maintenance plan',
    hire: '$5K–$10K/mo',
    agency: '$2K–$8K/mo',
  },
  {
    label: 'Time to first deliverable',
    sociofi: '2–6 weeks',
    hire: '3–6 months (hire + ramp)',
    agency: '2–4 months',
  },
  {
    label: 'Who manages them',
    sociofi: 'No one needed',
    hire: 'You (or a tech lead)',
    agency: 'Account manager',
  },
  {
    label: 'What happens if they leave',
    sociofi: 'Code stays yours',
    hire: 'Knowledge gap',
    agency: 'Renegotiate contract',
  },
];

const FAQS = [
  {
    q: 'We have no technical person internally — is that a problem?',
    a: 'No. We manage everything: architecture decisions, deployment, maintenance. You describe the business need; we handle the rest.',
  },
  {
    q: 'What about after it\'s built?',
    a: <span>We offer ongoing maintenance plans so you&apos;re never left managing something you didn&apos;t build. <Link href="/services" style={{ color: A }}>See plans.</Link></span>,
  },
  {
    q: 'Can you integrate with our existing software?',
    a: 'Yes. We connect to almost any system with an API — your CRM, ERP, payment processor, or anything else you\'re using.',
  },
  {
    q: 'How do we communicate during the project?',
    a: 'Weekly written updates, demo sessions so you can see progress, and direct Slack or email access to your lead engineer.',
  },
  {
    q: 'What if our needs change mid-project?',
    a: 'We handle change requests. We tell you the impact on cost and timeline before proceeding — nothing changes without your written approval.',
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ForSMEPage() {
  return (
    <main className="sme-page">
      <style>{STYLES}</style>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0 80px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-200px', left: '-100px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, ${A}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Studio — For Businesses</div>
            <h1 style={{
              fontFamily: F.h, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08,
              color: 'var(--text-primary)', maxWidth: 720, marginBottom: 24,
            }}>
              Your Business Needs Software.{' '}
              <span className="gradient-text">You Don&apos;t Need a Dev Department.</span>
            </h1>
            <p style={{
              fontFamily: F.b, fontSize: '1.1rem', color: 'var(--text-secondary)',
              maxWidth: 560, lineHeight: 1.75, marginBottom: 36,
            }}>
              Custom apps, internal tools, automated workflows — built with AI speed, maintained by real engineers. Results in weeks, not quarters.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/studio/start-project" className="btn-primary">
                Start a Project <ArrowRight size={16} />
              </Link>
              <Link href="/studio/pricing" className="btn-ghost">
                See Pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Use Cases ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">What We Build</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 12,
            }}>
              Six Business Problems We Solve Every Week.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 520, marginBottom: 40, lineHeight: 1.7 }}>
              If you recognise your situation in one of these, we&apos;ve almost certainly built the solution.
            </p>
          </Reveal>
          <div className="sme-use-grid">
            {USE_CASES.map((uc, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="sme-use-card">
                  <div className="sme-use-arrow"><ArrowRight size={16} /></div>
                  <div style={{ fontFamily: F.m, fontSize: '0.68rem', fontWeight: 600, color: A, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {uc.solution}
                  </div>
                  <div style={{ fontFamily: F.h, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.35 }}>
                    &ldquo;{uc.problem}&rdquo;
                  </div>
                  <div style={{ fontFamily: F.b, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {uc.body}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">The Process</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 480, marginBottom: 40,
            }}>
              Three Steps. No Technical Background Required.
            </h2>
          </Reveal>
          <div className="sme-steps">
            {[
              { num: '01', title: 'Tell us your business problem', body: 'Not technical requirements. Not a spec. Just the situation you\'re in: what\'s slow, what\'s manual, what\'s costing you time or money.' },
              { num: '02', title: 'We design and build the solution', body: 'We scope it, price it, and build it. Weekly demos so you can see progress. Your input shapes the product throughout.' },
              { num: '03', title: 'Your team uses it — we keep it running', body: 'We train your team on the tool, hand over the code and documentation, and offer ongoing plans to keep everything running.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="sme-step">
                  <div style={{ fontFamily: F.m, fontSize: '1.6rem', fontWeight: 700, color: A, marginBottom: 16, letterSpacing: '-0.02em' }}>
                    {step.num}
                  </div>
                  <div style={{ fontFamily: F.h, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em', marginBottom: 10 }}>
                    {step.title}
                  </div>
                  <div style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {step.body}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">The Numbers</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 12,
            }}>
              SocioFi vs. Hiring vs. Traditional Agency.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 520, marginBottom: 40, lineHeight: 1.7 }}>
              The same result — at a fraction of the cost and in half the time.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="sme-compare" style={{ overflowX: 'auto' }}>
              <div className="sme-compare-head">
                <div className="sme-compare-head-cell" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}></div>
                <div className="sme-compare-head-cell" style={{ color: A }}>SocioFi Studio</div>
                <div className="sme-compare-head-cell">Hiring a developer</div>
                <div className="sme-compare-head-cell">Traditional agency</div>
              </div>
              {COMPARE_ROWS.map((row, i) => (
                <div key={i} className="sme-compare-row">
                  <div className="sme-compare-cell label">{row.label}</div>
                  <div className="sme-compare-cell highlight">{row.sociofi}</div>
                  <div className="sme-compare-cell">{row.hire}</div>
                  <div className="sme-compare-cell">{row.agency}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">In Their Words</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 40,
            }}>
              What Business Owners Say.
            </h2>
          </Reveal>
          <div className="sme-test-grid">
            {[
              {
                quote: 'We needed an internal tool for 30 people. Traditional quotes were $80K and 4 months. SocioFi delivered in 3 weeks.',
                author: 'Marcus T.',
                role: 'COO, BrightPath Logistics',
              },
              {
                quote: 'The ROI was immediate. The automation pays for itself every month.',
                author: 'Sarah M.',
                role: 'Operations Director',
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="sme-test-card">
                  <span className="sme-q-mark">&ldquo;</span>
                  <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                    {t.quote}
                  </p>
                  <div style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.author}</div>
                  <div style={{ fontFamily: F.b, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Investment</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 460, marginBottom: 12,
            }}>
              Straightforward Pricing for Every Business Size.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 460, marginBottom: 40, lineHeight: 1.7 }}>
              50% upfront, 50% on delivery. Fixed scope, fixed price.
            </p>
          </Reveal>
          <div className="sme-price-grid">
            {[
              {
                tier: 'Growth',
                range: '$8,000 – $20,000',
                timeline: '2–4 weeks',
                desc: 'Complete internal tool or customer-facing product with multiple workflows and integrations.',
                features: ['Full product build', 'Third-party integrations', 'Team training', '30-day warranty'],
                featured: false,
              },
              {
                tier: 'Scale',
                range: '$20,000+',
                timeline: '4–8 weeks',
                desc: 'Complex systems: multi-user platforms, large data sets, or automated workflows across multiple systems.',
                features: ['Complex architecture', 'Multi-system integration', 'Performance optimised', '60-day warranty'],
                featured: true,
              },
              {
                tier: 'Retainer',
                range: 'From $2,000/mo',
                timeline: 'Ongoing',
                desc: 'Continuous development capacity — features, fixes, and improvements on a monthly cadence.',
                features: ['Monthly dev capacity', 'Priority response', 'Direct engineer access', 'Monthly reporting'],
                featured: false,
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`sme-price-card${plan.featured ? ' popular' : ''}`}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, #3A589E, ${A})`, borderRadius: '16px 16px 0 0' }} />
                  )}
                  <div className="sme-price-tag">{plan.tier}</div>
                  <div style={{ fontFamily: F.h, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
                    {plan.range}
                  </div>
                  <div style={{ fontFamily: F.m, fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 14, letterSpacing: '0.05em' }}>
                    {plan.timeline}
                  </div>
                  <p style={{ fontFamily: F.b, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                    {plan.desc}
                  </p>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 24 }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${A}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: A }}>
                          <CheckIcon />
                        </div>
                        <span style={{ fontFamily: F.b, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/studio/start-project" className={plan.featured ? 'btn-primary' : 'btn-ghost'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Get started <ArrowRight size={15} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Questions</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 40,
            }}>
              Common Business Questions.
            </h2>
          </Reveal>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-card)', padding: '0 28px' }}>
            {FAQS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="sme-cta" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Reveal>
            <div className="sec-label" style={{ justifyContent: 'center' }}>Start Now</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 16,
            }}>
              Build what your business needs.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 36px' }}>
              Tell us the business problem. We handle everything from there.
            </p>
            <Link href="/studio/start-project" className="btn-primary">
              Start a Project <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
