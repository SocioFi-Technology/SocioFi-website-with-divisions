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
.ff-page { overflow-x: hidden; background: var(--bg); }

.sec-label {
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
.sec-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}

.gradient-text {
  background: linear-gradient(135deg, #4A6CB8 0%, ${A} 50%, #A3DFD2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (forced-colors: active) { .gradient-text { -webkit-text-fill-color: unset; } }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #3A589E, ${A});
  color: #fff;
  border: none; border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(58,88,158,0.5); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border); border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-ghost:hover { border-color: ${A}; color: ${A}; transform: translateY(-2px); }

/* Pain point cards */
.pain-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid rgba(232,145,111,0.5);
  border-radius: var(--radius-md);
  padding: 24px 28px;
  transition: border-left-color 0.3s, transform 0.3s;
}
.pain-card:hover {
  border-left-color: #E8916F;
  transform: translateY(-3px);
}

/* Process steps */
.ff-process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  position: relative;
}
.ff-process-step {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  position: relative;
}
.ff-process-step:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 48px;
  width: 1px;
  height: 48px;
  background: var(--border);
}
@media (max-width: 768px) {
  .ff-process-grid { grid-template-columns: 1fr 1fr; }
  .ff-process-step:nth-child(2)::after { display: none; }
  .ff-process-step:last-child::after { display: none; }
}
@media (max-width: 480px) {
  .ff-process-grid { grid-template-columns: 1fr; }
  .ff-process-step::after { display: none !important; }
}

/* Deliverables */
.ff-deliv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 768px) {
  .ff-deliv-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .ff-deliv-grid { grid-template-columns: 1fr; }
}
.ff-deliv-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.ff-check {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: ${A}22;
  border: 1.5px solid ${A}44;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  color: ${A};
}

/* Pricing snapshot */
.ff-price-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 640px) {
  .ff-price-grid { grid-template-columns: 1fr; }
}
.ff-price-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  position: relative;
  transition: border-color 0.3s, transform 0.3s;
}
.ff-price-card:hover { border-color: var(--border-hover); transform: translateY(-4px); }
.ff-price-card.featured { border-color: ${A}44; }
.ff-price-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-family: ${F.m};
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${A}22;
  color: ${A};
  margin-bottom: 20px;
}

/* Testimonials */
.ff-test-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 768px) {
  .ff-test-grid { grid-template-columns: 1fr; }
}
.ff-test-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
}
.ff-quote-mark {
  font-family: ${F.h};
  font-size: 3rem;
  line-height: 0.5;
  color: ${A};
  margin-bottom: 16px;
  display: block;
}

/* FAQ accordion */
.ff-faq-item {
  border-bottom: 1px solid var(--border);
}
.ff-faq-q {
  width: 100%;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  cursor: pointer;
  text-align: left;
  gap: 16px;
}
.ff-faq-a {
  padding-bottom: 20px;
  overflow: hidden;
}

/* CEO quote card */
.ff-ceo-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  padding: 36px;
  position: relative;
  overflow: hidden;
}
.ff-ceo-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3A589E, ${A});
}

/* Section alt bg */
.ff-section-alt { background: var(--bg-2); }

/* Pain grid */
.ff-pain-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 768px) {
  .ff-pain-grid { grid-template-columns: 1fr; }
}
.pain-card:last-child:nth-child(odd) {
  grid-column: span 2;
}
@media (max-width: 768px) {
  .pain-card:last-child:nth-child(odd) { grid-column: span 1; }
}

/* CTA section */
.ff-cta {
  background: linear-gradient(135deg, rgba(58,88,158,0.12) 0%, rgba(89,163,146,0.12) 100%);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
`;

// ── Reveal component ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
}

// ── SVG Icons ───────────────────────────────────────────────────────────────
const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const CheckIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const ChevronDown = ({ size = 18, open = false }: { size?: number; open?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

// ── FAQ item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="ff-faq-item">
      <button className="ff-faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span style={{ fontFamily: F.h, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{q}</span>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}><ChevronDown size={18} open={open} /></span>
      </button>
      {open && (
        <motion.div
          className="ff-faq-a"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{a}</div>
        </motion.div>
      )}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PAIN_POINTS = [
  {
    title: 'Your AI-generated code works locally but won\'t deploy',
    body: 'You\'ve followed every tutorial. The error messages make no sense. The deploy logs are a wall of red.',
  },
  {
    title: 'You need auth and payments but the AI keeps getting it wrong',
    body: 'Login works, then breaks. Stripe webhooks fail silently. The AI confidently writes broken code.',
  },
  {
    title: 'You don\'t know if your architecture will hold up',
    body: 'What happens when you get 1,000 users? Will the database crash? Will it cost $500/month to host?',
  },
  {
    title: 'A freelancer took your money and disappeared',
    body: '6 weeks. $3K. A half-finished codebase and no answers.',
  },
  {
    title: 'You\'ve been building for 3 months and still don\'t have something to show investors',
    body: 'Progress feels real until you try to demo it. Then the cracks show.',
  },
];

const HOW_WE_HELP = [
  { num: '01', title: 'You describe the vision', sub: 'No tech required' },
  { num: '02', title: 'We scope and price it', sub: 'Written proposal, 2 days' },
  { num: '03', title: 'We build it', sub: 'AI speed, human quality, weekly demos' },
  { num: '04', title: 'You launch', sub: 'Live product, 100% your code' },
];

const DELIVERABLES = [
  'A working product deployed to production',
  'Architecture that can grow with your business',
  'Auth, payments, hosting — handled',
  'Code you own 100% (no lock-in)',
  'Plain-English updates throughout',
  '30-day warranty after launch',
];

const FAQS = [
  {
    q: 'Do I need a technical co-founder to work with you?',
    a: 'No. That\'s the point. We are the technical team. You bring the vision, the domain knowledge, and the decisions. We handle everything else.',
  },
  {
    q: 'What if I only have a rough idea?',
    a: 'Perfect. We\'ll do the scoping together. We\'ve turned rough ideas into production products dozens of times. You don\'t need a spec — you need a conversation.',
  },
  {
    q: 'Can you work with what I\'ve already built?',
    a: 'Yes. We\'ll assess what to keep, what to improve, and what to replace. We don\'t throw away good work.',
  },
  {
    q: 'What happens if I need changes after launch?',
    a: <span>The 30-day warranty covers bugs at no cost. After that, we offer ongoing plans. <Link href="/services" style={{ color: A }}>See Services plans.</Link></span>,
  },
  {
    q: 'Do I need a big budget?',
    a: 'Starter projects begin at $3,000. We can also scope a lean MVP if you want to validate before committing to a full build.',
  },
  {
    q: 'How do you charge?',
    a: '50% upfront, 50% on delivery. Fixed price, no surprises. No hourly billing. No invoices for things you didn\'t agree to.',
  },
];

// ── Page component ───────────────────────────────────────────────────────────
export default function ForFoundersPage() {
  return (
    <main className="ff-page">
      <style>{STYLES}</style>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0 80px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-300px', right: '-200px',
          width: '700px', height: '700px', borderRadius: '50%',
          background: `radial-gradient(circle, ${A}14 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Studio — For Founders</div>
            <h1 style={{
              fontFamily: F.h, fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06,
              color: 'var(--text-primary)', maxWidth: 760, marginBottom: 24,
            }}>
              You&apos;ve Got the Vision.{' '}
              <span className="gradient-text">We&apos;ve Got the Engineers.</span>
            </h1>
            <p style={{
              fontFamily: F.b, fontSize: '1.1rem', color: 'var(--text-secondary)',
              maxWidth: 580, lineHeight: 1.75, marginBottom: 36,
            }}>
              You don&apos;t need to learn to code. You don&apos;t need a technical co-founder. You need a team that builds with AI speed and has real engineers to make it work.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/studio/start-project" className="btn-primary">
                Start Your Project <ArrowRight size={16} />
              </Link>
              <Link href="/studio/process" className="btn-ghost">
                See How It Works
              </Link>
            </div>
          </Reveal>

          {/* CEO quote */}
          <Reveal delay={0.2}>
            <div className="ff-ceo-card" style={{ maxWidth: 660, marginTop: 56 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: `linear-gradient(135deg, #3A589E, ${A})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: F.h, fontSize: '1.1rem', fontWeight: 800, color: 'white',
                }}>AR</div>
                <div>
                  <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                    &ldquo;I was the non-technical founder. I know exactly what it feels like to have an idea, a prototype, and no way to get it to production.&rdquo;
                  </p>
                  <div style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>Arifur Rahman</div>
                  <div style={{ fontFamily: F.b, fontSize: '0.78rem', color: 'var(--text-muted)' }}>CEO, SocioFi Technology</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Pain Points ───────────────────────────────────────────────── */}
      <section className="ff-section-alt" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">The Wall</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 40,
            }}>
              You&apos;ve Hit One of These. We Know.
            </h2>
          </Reveal>
          <div className="ff-pain-grid">
            {PAIN_POINTS.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="pain-card">
                  <div style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.3 }}>
                    {p.title}
                  </div>
                  <div style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {p.body}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Help ───────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">The Fix</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 48,
            }}>
              How It Works in 4 Steps
            </h2>
          </Reveal>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div className="ff-process-grid">
              {HOW_WE_HELP.map((step, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="ff-process-step">
                    <div style={{ fontFamily: F.m, fontSize: '1.4rem', fontWeight: 700, color: A, marginBottom: 12, letterSpacing: '-0.02em' }}>
                      {step.num}
                    </div>
                    <div style={{ fontFamily: F.h, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em' }}>
                      {step.title}
                    </div>
                    <div style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {step.sub}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Get ──────────────────────────────────────────────── */}
      <section className="ff-section-alt" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">What You Get</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 480, marginBottom: 40,
            }}>
              Everything Your Product Needs to Go Live.
            </h2>
          </Reveal>
          <div className="ff-deliv-grid">
            {DELIVERABLES.map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="ff-deliv-item">
                  <div className="ff-check"><CheckIcon size={12} /></div>
                  <span style={{ fontFamily: F.b, fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Snapshot ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Pricing</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 480, marginBottom: 12,
            }}>
              Clear Prices. No Surprises.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 480 }}>
              50% upfront, 50% on delivery. Fixed scope, fixed price.
            </p>
          </Reveal>
          <div className="ff-price-grid">
            {[
              {
                tier: 'Starter',
                range: '$3,000 – $8,000',
                timeline: '1–2 weeks',
                desc: 'Focused MVP with one core workflow. Auth, one key feature, deployed. Ideal for validation before a full build.',
                features: ['1 core feature set', 'Auth + deployment', 'Code ownership', '30-day warranty'],
                cta: 'Start here',
                featured: false,
              },
              {
                tier: 'Growth',
                range: '$8,000 – $20,000',
                timeline: '2–4 weeks',
                desc: 'Complete product with multiple user flows, third-party integrations, payments, and a production-ready deployment.',
                features: ['Full product build', 'Payments + integrations', 'Architecture review', '30-day warranty'],
                cta: 'Most founders choose this',
                featured: true,
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`ff-price-card${plan.featured ? ' featured' : ''}`}>
                  {plan.featured && (
                    <div style={{
                      position: 'absolute', top: -1, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, #3A589E, ${A})`,
                      borderRadius: '16px 16px 0 0',
                    }} />
                  )}
                  <div className="ff-price-tag">{plan.tier}</div>
                  <div style={{ fontFamily: F.h, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
                    {plan.range}
                  </div>
                  <div style={{ fontFamily: F.m, fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '0.05em' }}>
                    Typical timeline: {plan.timeline}
                  </div>
                  <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    {plan.desc}
                  </p>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 24 }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${A}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckIcon size={9} />
                        </div>
                        <span style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/studio/start-project" className={plan.featured ? 'btn-primary' : 'btn-ghost'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {plan.cta} <ArrowRight size={15} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
              Need something bigger?{' '}
              <Link href="/studio/pricing" style={{ color: A, textDecoration: 'none' }}>See full pricing →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="ff-section-alt" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">From Other Founders</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 40,
            }}>
              They Were In Your Shoes.
            </h2>
          </Reveal>
          <div className="ff-test-grid">
            {[
              {
                quote: 'I was two weeks from giving up. SocioFi shipped it in 18 days and it\'s been running perfectly for 6 months.',
                author: 'Priya D.',
                role: 'Founder, InboxFlow',
              },
              {
                quote: 'I\'m not technical. I never felt lost or talked down to. They explained every decision in plain English.',
                author: 'David K.',
                role: 'Founder',
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="ff-test-card">
                  <span className="ff-quote-mark">&ldquo;</span>
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

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Common Questions</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 40,
            }}>
              Honest Answers to Founder Questions.
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
      <section className="ff-cta" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Reveal>
            <div className="sec-label" style={{ justifyContent: 'center' }}>Ready When You Are</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 16,
            }}>
              Ready to stop being stuck?
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
              Fill in the form, skip what you don&apos;t know, and we&apos;ll take it from there.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/studio/start-project" className="btn-primary">
                Start Your Project <ArrowRight size={16} />
              </Link>
              <Link href="/studio/pricing" className="btn-ghost">
                See Pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
