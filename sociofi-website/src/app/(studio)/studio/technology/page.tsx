'use client';

import React, { useRef } from 'react';
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
.tech-page { overflow-x: hidden; background: var(--bg); }

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

/* Architecture diagram */
.tech-arch {
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  overflow: hidden; background: var(--bg-card);
}
.tech-arch-layer {
  padding: 28px 32px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 24px;
}
.tech-arch-layer:last-child { border-bottom: none; }
.tech-arch-num {
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 600;
  color: ${A}; letter-spacing: 0.1em; white-space: nowrap;
  min-width: 60px;
}
.tech-arch-bar {
  flex: 1; height: 56px; border-radius: 10px;
  display: flex; align-items: center; padding: 0 20px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 700;
  letter-spacing: -0.01em; color: white;
  position: relative; overflow: hidden;
}
.tech-arch-label {
  font-family: ${F.b}; font-size: 0.82rem;
  color: var(--text-muted); min-width: 180px;
  line-height: 1.4;
}
@media (max-width: 640px) {
  .tech-arch-layer { flex-direction: column; align-items: flex-start; gap: 12px; }
  .tech-arch-label { min-width: unset; }
}

/* Tech stack grid */
.tech-stack-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
}
@media (max-width: 900px) { .tech-stack-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .tech-stack-grid { grid-template-columns: 1fr; } }
.tech-stack-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 24px;
}
.tech-stack-cat {
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 600;
  color: ${A}; letter-spacing: 0.1em; text-transform: uppercase;
  margin-bottom: 14px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.tech-item {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
  font-family: ${F.b}; font-size: 0.86rem; color: var(--text-secondary);
}
.tech-item:last-child { margin-bottom: 0; }
.tech-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: ${A}; flex-shrink: 0;
}

/* Human review flow */
.tech-flow {
  display: flex; align-items: center; flex-wrap: wrap; gap: 0;
}
@media (max-width: 768px) {
  .tech-flow { flex-direction: column; align-items: flex-start; gap: 0; }
}
.tech-flow-step {
  display: flex; flex-direction: column; align-items: center;
  position: relative;
}
.tech-flow-box {
  padding: 12px 18px; border-radius: var(--radius-sm);
  background: var(--bg-card); border: 1px solid var(--border);
  font-family: ${F.b}; font-size: 0.82rem; color: var(--text-secondary);
  text-align: center; white-space: nowrap;
  transition: border-color 0.3s;
}
.tech-flow-box.highlight {
  background: ${A}12; border-color: ${A}44; color: var(--text-primary);
  font-weight: 600;
}
.tech-flow-arrow {
  color: var(--text-muted); font-size: 1.2rem; padding: 0 8px;
  display: flex; align-items: center;
}
@media (max-width: 768px) {
  .tech-flow-arrow { transform: rotate(90deg); padding: 4px 0; }
}

/* Security grid */
.tech-sec-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
}
@media (max-width: 640px) { .tech-sec-grid { grid-template-columns: 1fr; } }
.tech-sec-item {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 24px;
  display: flex; align-items: flex-start; gap: 16px;
}
.tech-sec-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: ${A}18; color: ${A};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* CTA */
.tech-cta {
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
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const ShieldIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const DatabaseIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const LockIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const CodeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const ChevronRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const TECH_STACK = [
  {
    cat: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    cat: 'Backend',
    items: ['FastAPI (Python)', 'Node.js', 'REST APIs', 'GraphQL'],
  },
  {
    cat: 'Database',
    items: ['PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    cat: 'Hosting',
    items: ['Vercel', 'AWS', 'DigitalOcean', 'Railway'],
  },
  {
    cat: 'AI & Build',
    items: ['Advanced AI models', 'AI code generation', 'Automated review'],
  },
  {
    cat: 'Testing',
    items: ['Unit + integration tests', 'End-to-end testing', 'Automated CI/CD'],
  },
  {
    cat: 'Monitoring',
    items: ['Sentry (error tracking)', 'Uptime monitoring', 'Performance tracking'],
  },
  {
    cat: 'Security',
    items: ['TLS encryption', 'Secrets management', 'Least-privilege access'],
  },
];

const FLOW_STEPS = [
  { label: 'AI writes code', highlight: false },
  { label: 'Automated tests', highlight: false },
  { label: 'Engineer review', highlight: true },
  { label: 'Issues fixed', highlight: false },
  { label: 'Staging deploy', highlight: false },
  { label: 'QA pass', highlight: true },
  { label: 'Production', highlight: true },
];

const SECURITY = [
  {
    icon: <LockIcon size={20} />,
    title: 'Encryption',
    body: 'All data encrypted in transit (TLS) and at rest. No exceptions.',
  },
  {
    icon: <DatabaseIcon size={20} />,
    title: 'Backups',
    body: 'Automated daily backups with point-in-time recovery. Your data is always recoverable.',
  },
  {
    icon: <ShieldIcon size={20} />,
    title: 'Access control',
    body: 'Least-privilege architecture. Credentials are never stored in code. Secrets managed securely.',
  },
  {
    icon: <CodeIcon size={20} />,
    title: 'Code ownership',
    body: 'Complete codebase handoff on delivery. You own everything — permanently and completely.',
  },
];

// ── Architecture layer colors ─────────────────────────────────────────────
const LAYER_COLORS = [
  'linear-gradient(135deg, #3A589E, #2C4478)',
  `linear-gradient(135deg, ${A}, #4DBFA8)`,
  'linear-gradient(135deg, #4A5578, #3A4268)',
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TechnologyPage() {
  return (
    <main className="tech-page">
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
            <div className="sec-label">How We Build It</div>
            <h1 style={{
              fontFamily: F.h, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08,
              color: 'var(--text-primary)', maxWidth: 700, marginBottom: 24,
            }}>
              The Technology Behind{' '}
              <span className="gradient-text">Every Project.</span>
            </h1>
            <p style={{
              fontFamily: F.b, fontSize: '1.1rem', color: 'var(--text-secondary)',
              maxWidth: 540, lineHeight: 1.75, marginBottom: 12,
            }}>
              Accessible overview. No jargon. If you want the deep technical version, just ask.
            </p>
            <p style={{
              fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-muted)',
              maxWidth: 500, lineHeight: 1.7, marginBottom: 36,
            }}>
              This page explains how we build — what we use, why we use it, and how we make sure quality is maintained throughout.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">3-Layer Architecture</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 12,
            }}>
              How Every Project Is Structured.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 500, marginBottom: 36, lineHeight: 1.7 }}>
              Every product we build sits on the same three layers. Each layer has a clear job.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="tech-arch">
              {[
                {
                  num: 'Layer 1',
                  title: 'Your Product',
                  desc: 'What your users see and interact with. The interface, the features, the workflows you asked for.',
                  color: LAYER_COLORS[0],
                },
                {
                  num: 'Layer 2',
                  title: 'SocioFi Platform',
                  desc: 'Development environment, AI assistance, automated testing, and engineer review. This is where quality is made.',
                  color: LAYER_COLORS[1],
                },
                {
                  num: 'Layer 3',
                  title: 'Infrastructure',
                  desc: 'Hosting, databases, monitoring, backups. The foundation everything runs on.',
                  color: LAYER_COLORS[2],
                },
              ].map((layer, i) => (
                <div key={i} className="tech-arch-layer">
                  <div className="tech-arch-num">{layer.num}</div>
                  <div className="tech-arch-bar" style={{ background: layer.color }}>
                    {layer.title}
                  </div>
                  <div className="tech-arch-label">{layer.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Tools We Use</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 12,
            }}>
              The Full Stack.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 500, marginBottom: 40, lineHeight: 1.7 }}>
              We pick tools that are proven, well-maintained, and have strong support communities — not whatever&apos;s trending this month.
            </p>
          </Reveal>
          <div className="tech-stack-grid">
            {TECH_STACK.map((cat, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="tech-stack-card">
                  <div className="tech-stack-cat">{cat.cat}</div>
                  {cat.items.map((item, j) => (
                    <div key={j} className="tech-item">
                      <div className="tech-dot" />
                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Human Review Process ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Quality Control</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 540, marginBottom: 12,
            }}>
              AI Writes. Humans Review. Nothing Ships Without Both.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 560, marginBottom: 36, lineHeight: 1.7 }}>
              This is the most important thing to understand about how we build. AI generates code quickly — but every single file gets reviewed by an engineer before it enters the codebase.
            </p>
          </Reveal>

          {/* Flow diagram */}
          <Reveal delay={0.1}>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '36px',
              marginBottom: 32, overflowX: 'auto',
            }}>
              <div className="tech-flow">
                {FLOW_STEPS.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="tech-flow-step">
                      <div className={`tech-flow-box${step.highlight ? ' highlight' : ''}`}>
                        {step.label}
                      </div>
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div className="tech-flow-arrow">
                        <ChevronRight size={14} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p style={{ fontFamily: F.b, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 20 }}>
                Highlighted steps are human-gated. Nothing moves forward without human sign-off.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { num: '~70%', label: 'AI-generated initial code', note: 'Boilerplate, scaffold, test stubs' },
              { num: '100%', label: 'Files reviewed by engineers', note: 'Every file, every time' },
              { num: '2x', label: 'Review passes before deploy', note: 'Staging then production' },
              { num: '0', label: 'AI commits allowed without review', note: 'Non-negotiable rule' },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '24px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: F.h, fontSize: '2rem', fontWeight: 800, color: A, letterSpacing: '-0.03em', marginBottom: 6 }}>
                    {stat.num}
                  </div>
                  <div style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontFamily: F.b, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {stat.note}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Security Practices</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 480, marginBottom: 12,
            }}>
              Security Is Not Optional.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 480, marginBottom: 40, lineHeight: 1.7 }}>
              These aren&apos;t add-ons. They&apos;re included in every project, by default.
            </p>
          </Reveal>
          <div className="tech-sec-grid">
            {SECURITY.map((item, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="tech-sec-item">
                  <div className="tech-sec-icon">{item.icon}</div>
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

      {/* ── Why These Choices ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Why These Choices</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', maxWidth: 480, marginBottom: 40,
            }}>
              Not Trend-Chasing. Deliberate Choices.
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              {
                title: 'Next.js for frontend',
                body: 'Runs on Vercel, has excellent performance defaults, and the ecosystem is mature. Your product is easier to hand off to another team if needed.',
              },
              {
                title: 'PostgreSQL for data',
                body: 'Relational databases handle complex data correctly. NoSQL is chosen when the data genuinely fits it — not as a default.',
              },
              {
                title: 'FastAPI for backend logic',
                body: 'Python has the best AI tooling. FastAPI is fast, typed, and well-documented. Your backend is readable by any Python developer.',
              },
              {
                title: 'Vercel / AWS for hosting',
                body: 'Reliable, global CDN, automatic SSL. We pick the platform that fits your scale and budget — not the one we\'re most comfortable billing.',
              },
              {
                title: 'TypeScript everywhere',
                body: 'Type safety catches bugs before they reach users. AI-generated code is more reliable when it has type constraints to conform to.',
              },
              {
                title: 'AI as assistant, not architect',
                body: 'AI writes the parts of code that are well-defined. Humans make the architectural decisions. The distinction matters.',
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${A}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: A, flexShrink: 0 }}>
                      <CheckIcon />
                    </div>
                    <div style={{ fontFamily: F.h, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {item.title}
                    </div>
                  </div>
                  <div style={{ fontFamily: F.b, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, paddingLeft: 24 }}>
                    {item.body}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="tech-cta" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Reveal>
            <div className="sec-label" style={{ justifyContent: 'center' }}>Specific requirements?</div>
            <h2 style={{
              fontFamily: F.h, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--text-primary)', marginBottom: 16,
            }}>
              Have specific tech requirements? Let&apos;s talk.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 36px' }}>
              If you need a specific framework, language, or infrastructure setup — tell us. We&apos;ll assess it honestly.
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
