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
.ft-page { overflow-x: hidden; background: var(--bg); }

.sec-label {
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
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
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
  background: linear-gradient(135deg, #3A589E, ${A}); color: #fff;
  border: none; border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(58,88,158,0.5); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
  background: transparent; color: var(--text-primary);
  border: 1.5px solid var(--border); border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-ghost:hover { border-color: ${A}; color: ${A}; transform: translateY(-2px); }

/* Scenario cards */
.ft-scenario-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
}
@media (max-width: 640px) { .ft-scenario-grid { grid-template-columns: 1fr; } }
.ft-scenario-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 28px;
  position: relative; overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
}
.ft-scenario-card:hover { border-color: ${A}44; transform: translateY(-3px); }
.ft-scenario-num {
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 600;
  color: ${A}; letter-spacing: 0.1em; margin-bottom: 12px;
}

/* How we work */
.ft-work-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
}
@media (max-width: 768px) { .ft-work-grid { grid-template-columns: 1fr; } }
.ft-work-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 28px;
  position: relative;
}
.ft-work-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #3A589E, ${A}); border-radius: 16px 16px 0 0;
}
.ft-work-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: ${A}18; color: ${A};
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}

/* Security / IP grid */
.ft-security-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
}
@media (max-width: 640px) { .ft-security-grid { grid-template-columns: 1fr; } }
.ft-security-item {
  padding: 22px 24px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex; align-items: flex-start; gap: 14px;
}
.ft-sec-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: ${A}18; color: ${A};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Pricing */
.ft-price-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
}
@media (max-width: 900px) { .ft-price-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .ft-price-grid { grid-template-columns: 1fr; } }
.ft-price-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 32px; position: relative;
  transition: border-color 0.3s, transform 0.3s;
}
.ft-price-card:hover { transform: translateY(-4px); border-color: var(--border-hover); }
.ft-price-card.featured { border-color: ${A}44; }
.ft-price-tag {
  display: inline-block; padding: 4px 12px; border-radius: 100px;
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  background: ${A}22; color: ${A}; margin-bottom: 20px;
}

/* FAQ */
.ft-faq-item { border-bottom: 1px solid var(--border); }
.ft-faq-q {
  width: 100%; background: none; border: none;
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0; cursor: pointer; text-align: left; gap: 16px;
}
.ft-faq-a { padding-bottom: 20px; }

/* CTA */
.ft-cta {
  background: linear-gradient(135deg, rgba(58,88,158,0.1) 0%, rgba(89,163,146,0.1) 100%);
  border-top: 1px solid var(--border);
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
const MessageIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const GitBranchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
);
const ShieldIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const FileTextIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const LockIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ServerIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

// ── FAQ item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ft-faq-item">
      <button className="ft-faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span style={{ fontFamily: F.h, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{q}</span>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}><ChevronDown open={open} /></span>
      </button>
      {open && (
        <motion.div className="ft-faq-a"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{a}</div>
        </motion.div>
      )}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    quote: 'Operations team needs a real-time dashboard. IT backlog is 18 months.',
    detail: 'We deliver in 3–6 weeks. No waiting in the queue. No internal politics.',
  },
  {
    quote: 'Finance wants automated reporting. Current process takes 8 hours every quarter.',
    detail: 'Automated, scheduled, accurate. That\'s 8 hours back every quarter.',
  },
  {
    quote: 'Customer success team needs a client portal. No devs available.',
    detail: 'A full client-facing portal with login, dashboards, and self-service features.',
  },
  {
    quote: 'Leadership wants a live view of key metrics. It\'s currently in 3 different spreadsheets.',
    detail: 'One dashboard. Real-time data. Connected to every source your business uses.',
  },
];

const HOW_WE_WORK = [
  {
    icon: <MessageIcon size={20} />,
    title: 'Communication',
    points: ['Weekly written status updates', 'Demo sessions at each milestone', 'Direct Slack channel with your team', 'Dedicated project board'],
  },
  {
    icon: <GitBranchIcon size={20} />,
    title: 'Process',
    points: ['Discovery → Proposal (2 days)', 'Build → Review → Deploy', 'No work starts without written approval', 'Scope changes quoted before proceeding'],
  },
  {
    icon: <ShieldIcon size={20} />,
    title: 'Compliance',
    points: ['NDAs available for all engagements', 'Data processing agreements on request', 'Code ownership transferred on delivery', 'Security review included in Scale tier'],
  },
  {
    icon: <FileTextIcon size={20} />,
    title: 'Documentation',
    points: ['Full technical documentation on handover', 'Deployment and infrastructure notes', 'Architecture decision records', 'User guides for your team'],
  },
];

const SECURITY_ITEMS = [
  { icon: <LockIcon size={18} />, title: 'Code ownership', body: '100% yours from day one. No lock-in. No SocioFi-specific dependencies that hold you hostage.' },
  { icon: <ShieldIcon size={18} />, title: 'NDAs', body: 'Available for all engagements. Signed before any project details are shared.' },
  { icon: <ServerIcon size={18} />, title: 'Data handling', body: 'We process only data required for the project. No retention after project completion.' },
  { icon: <GitBranchIcon size={18} />, title: 'Hosting', body: <span>Your infrastructure or SocioFi Cloud — your choice. <Link href="/cloud" style={{ color: A }}>Learn about hosting.</Link></span> },
];

const FAQS = [
  {
    q: 'Can we work within our procurement process?',
    a: 'Yes. We can work with purchase orders, master service agreements, and standard vendor agreements. We\'ve navigated enterprise procurement before.',
  },
  {
    q: 'What about security and confidentiality?',
    a: <span>NDAs are available for every engagement. Data is handled under strict policies and processing agreements are available on request.</span>,
  },
  {
    q: 'Can we host on our own infrastructure?',
    a: 'Yes. We deploy to your AWS, Azure, GCP, or on-premise environment. We write deployment documentation so your team can manage it going forward.',
  },
  {
    q: 'What if we have multiple projects?',
    a: 'We offer dedicated development capacity via our Dedicated plan — a reserved engineering team for your organisation, scoped monthly.',
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ForTeamsPage() {
  return (
    <main className="ft-page">
      <style>{STYLES}</style>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0 80px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-200px', right: '-100px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, ${A}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Studio — For Teams</div>
            <h1 style={{
              fontFamily: F.h, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08,
              color: 'var(--text-primary)', maxWidth: 720, marginBottom: 24,
            }}>
              Build What Your Team Needs.{' '}
              <span className="gradient-text">Without Hiring Developers.</span>
            </h1>
            <p style={{
              fontFamily: F.b, fontSize: '1.1rem', color: 'var(--text-secondary)',
              maxWidth: 560, lineHeight: 1.75, marginBottom: 36,
            }}>
              Custom internal tools, dashboards, and automation — delivered in weeks, with the documentation and process your organisation requires.
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

      {/* ── Scenarios ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Sound Familiar?</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 40,
            }}>
              Your Team Has the Problem. We Have the Build.
            </h2>
          </Reveal>
          <div className="ft-scenario-grid">
            {SCENARIOS.map((sc, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="ft-scenario-card">
                  <div className="ft-scenario-num">Scenario {String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.4 }}>
                    &ldquo;{sc.quote}&rdquo;
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px',
                    background: `${A}0C`,
                    borderRadius: 10,
                    border: `1px solid ${A}22`,
                  }}>
                    <div style={{ color: A, marginTop: 1, flexShrink: 0 }}><ArrowRight size={14} /></div>
                    <span style={{ fontFamily: F.b, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{sc.detail}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Work ───────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">How We Work With Teams</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 480, marginBottom: 40,
            }}>
              Process Built for Organisations.
            </h2>
          </Reveal>
          <div className="ft-work-grid">
            {HOW_WE_WORK.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="ft-work-card">
                  <div className="ft-work-icon">{item.icon}</div>
                  <div style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 14 }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.points.map((pt, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${A}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: A }}>
                          <CheckIcon />
                        </div>
                        <span style={{ fontFamily: F.b, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security & IP ─────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Security & Ownership</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 480, marginBottom: 12,
            }}>
              Your Code. Your Data. Your Infrastructure.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 480, marginBottom: 40, lineHeight: 1.7 }}>
              We build it and hand it to you. What we build is yours — completely and permanently.
            </p>
          </Reveal>
          <div className="ft-security-grid">
            {SECURITY_ITEMS.map((item, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="ft-security-item">
                  <div className="ft-sec-icon">{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: F.h, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em' }}>
                      {item.title}
                    </div>
                    <div style={{ fontFamily: F.b, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.body}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Investment</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 460, marginBottom: 12,
            }}>
              Pricing That Works for Teams.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 460, marginBottom: 40, lineHeight: 1.7 }}>
              POs, MSAs, and vendor agreements are all supported.
            </p>
          </Reveal>
          <div className="ft-price-grid">
            {[
              {
                tier: 'Growth',
                range: '$8,000 – $20,000',
                timeline: '2–4 weeks',
                desc: 'One focused internal tool or customer portal. Includes documentation, training, and handover.',
                features: ['Single application build', 'Integrations with existing tools', 'Team training session', '30-day warranty'],
                featured: false,
              },
              {
                tier: 'Scale',
                range: '$20,000+',
                timeline: '4–8 weeks',
                desc: 'Complex multi-user systems, large data pipelines, or cross-department platforms.',
                features: ['Complex architecture', 'Multi-team access controls', 'Compliance documentation', '60-day warranty'],
                featured: true,
              },
              {
                tier: 'Dedicated',
                range: 'From $6,000/mo',
                timeline: 'Ongoing',
                desc: 'A reserved engineering team for your organisation. Multiple projects, continuous delivery.',
                features: ['Reserved team capacity', 'Multiple concurrent projects', 'Priority support SLA', 'Monthly reporting'],
                featured: false,
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`ft-price-card${plan.featured ? ' featured' : ''}`}>
                  {plan.featured && (
                    <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, #3A589E, ${A})`, borderRadius: '16px 16px 0 0' }} />
                  )}
                  <div className="ft-price-tag">{plan.tier}</div>
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
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Questions</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 40,
            }}>
              Common Team Questions.
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
      <section className="ft-cta" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Reveal>
            <div className="sec-label" style={{ justifyContent: 'center' }}>Start Now</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 16,
            }}>
              Build what your team needs.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 36px' }}>
              Tell us the problem. We handle everything from there — scoping, building, and handing over something your team actually uses.
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
