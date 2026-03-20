'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Scroll Reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const INSTRUCTORS = [
  {
    initials: 'AR',
    name: 'Arifur Rahman',
    title: 'CEO & Co-Founder, SocioFi Technology',
    bio: 'BUET graduate with 10+ years building software products. Arifur leads SocioFi\'s client engagements and has personally overseen 80+ software projects from MVP to scale. He designed the Academy curriculum around the exact questions clients ask before they know enough to ask the right ones.',
    expertise: ['AI Development Strategy', 'Product Scoping', 'Client Education'],
    courses: ['AI Development for Founders', 'From Idea to MVP', 'Managing AI-Powered Development'],
    linkedin: 'https://linkedin.com',
  },
  {
    initials: 'KH',
    name: 'Kamrul Hasan',
    title: 'CTO & Co-Founder, SocioFi Technology',
    bio: 'BUET graduate and lead architect behind SocioFi\'s AI-native development methodology. Kamrul designed the technical curriculum for SCARL and the AI Development for Founders course. He believes the fastest way to improve client projects is to make clients technically literate.',
    expertise: ['AI Agent Systems', 'Software Architecture', 'Technical Education'],
    courses: ['Understanding AI Agents for Business', 'Technical Literacy for Non-Technical Teams', 'SCARL Certification'],
    linkedin: 'https://linkedin.com',
  },
  {
    initials: '+',
    name: 'Academy Team',
    title: 'SocioFi Engineering Team',
    bio: 'Select courses and workshops feature guest sessions from SocioFi\'s broader engineering team — specialists in deployment, security, databases, and specific technology stacks. All guest instructors are vetted practitioners with production experience.',
    expertise: ['Varies by session'],
    courses: ['Selected workshops and guest modules'],
    linkedin: null,
  },
];

const DIFFERENTIATORS = [
  {
    label: 'They build real software',
    desc: 'Not course creators. SocioFi engineers ship production code weekly. Every lesson is grounded in what\'s actually happening on active projects.',
  },
  {
    label: 'They\'ve seen every mistake',
    desc: '80+ client projects means 80+ learning opportunities about what goes wrong. You\'re getting hard-won experience, not curated theory.',
  },
  {
    label: 'They want you to succeed as a client, not as a student',
    desc: 'If you understand what you\'re buying, projects run better. That\'s the real motivation. Academy exists because educated clients build better products.',
  },
];

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.instr-page { background: var(--bg); min-height: 100vh; }

/* Hero */
.instr-hero {
  padding: 160px 32px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.instr-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 800px 400px at 50% 0%, rgba(232,184,77,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.instr-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.instr-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
}
.instr-hero-title {
  font-family: ${F.h};
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin: 0 auto 20px;
  max-width: 700px;
}
.instr-hero-sub {
  font-family: ${F.b};
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Instructors Section */
.instr-section {
  padding: 80px 32px 120px;
  max-width: 1100px;
  margin: 0 auto;
}
.instr-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.instr-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px;
  box-shadow: var(--card-shadow);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}
.instr-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3A589E, ${A});
  opacity: 0;
  transition: opacity 0.4s;
}
.instr-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--card-hover-shadow);
}
.instr-card:hover::before { opacity: 1; }

.instr-card-header {
  display: flex;
  align-items: flex-start;
  gap: 28px;
  margin-bottom: 24px;
}
.instr-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${A}33, ${A}66);
  border: 2px solid ${A}44;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${F.h};
  font-size: 1.1rem;
  font-weight: 800;
  color: ${A};
  flex-shrink: 0;
}
.instr-name {
  font-family: ${F.h};
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}
.instr-role {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.instr-linkedin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.b};
  font-size: 0.82rem;
  color: ${A};
  text-decoration: none;
  transition: opacity 0.2s;
}
.instr-linkedin:hover { opacity: 0.75; }

.instr-bio {
  font-family: ${F.b};
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

.instr-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 640px) {
  .instr-meta { grid-template-columns: 1fr; }
}
.instr-meta-block {}
.instr-meta-label {
  font-family: ${F.m};
  font-size: 0.68rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
}
.instr-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.instr-tag {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 4px 12px;
}
.instr-course-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.instr-course-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.instr-course-check { color: ${A}; flex-shrink: 0; }

/* Why Different */
.instr-why-section {
  background: var(--bg-2);
  padding: 100px 32px;
}
.instr-why-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.instr-why-title {
  font-family: ${F.h};
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 48px;
  text-align: center;
}
.instr-why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 900px) {
  .instr-why-grid { grid-template-columns: 1fr; }
}
.instr-why-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px;
  transition: border-color 0.3s, transform 0.3s;
}
.instr-why-card:hover {
  border-color: ${A}44;
  transform: translateY(-4px);
}
.instr-why-num {
  font-family: ${F.m};
  font-size: 0.72rem;
  color: ${A};
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.instr-why-heading {
  font-family: ${F.h};
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}
.instr-why-desc {
  font-family: ${F.b};
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

/* CTA */
.instr-cta {
  padding: 100px 32px;
  text-align: center;
}
.instr-cta-inner { max-width: 560px; margin: 0 auto; }
.instr-cta-title {
  font-family: ${F.h};
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 16px;
}
.instr-cta-sub {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 32px;
}
.instr-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: ${A};
  color: #0C0C1D;
  font-family: ${F.h};
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 100px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px ${A}44;
}
.instr-cta-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 32px ${A}55;
}

@media (max-width: 768px) {
  .instr-hero { padding: 120px 20px 80px; }
  .instr-section { padding: 60px 20px 80px; }
  .instr-card { padding: 28px 24px; }
  .instr-card-header { flex-direction: column; gap: 16px; }
  .instr-why-section { padding: 80px 20px; }
  .instr-cta { padding: 80px 20px; }
}
`;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function InstructorsPage() {
  return (
    <main className="instr-page">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="instr-hero">
        <Reveal>
          <div className="instr-label">WHO TEACHES</div>
          <h1 className="instr-hero-title">Practitioners, Not Academics.</h1>
          <p className="instr-hero-sub">
            All Academy instructors are SocioFi engineers and leaders who build production
            software daily. They teach what they do — not what they&apos;ve read about.
          </p>
        </Reveal>
      </section>

      {/* Instructors */}
      <section className="instr-section">
        <div className="instr-grid">
          {INSTRUCTORS.map((inst, i) => (
            <Reveal key={inst.name} delay={i * 0.1}>
              <div className="instr-card">
                <div className="instr-card-header">
                  <div className="instr-avatar">{inst.initials}</div>
                  <div>
                    <div className="instr-name">{inst.name}</div>
                    <div className="instr-role">{inst.title}</div>
                    {inst.linkedin && (
                      <a href={inst.linkedin} target="_blank" rel="noopener noreferrer" className="instr-linkedin">
                        <LinkedInIcon />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                <p className="instr-bio">{inst.bio}</p>
                <div className="instr-meta">
                  <div className="instr-meta-block">
                    <div className="instr-meta-label">Areas of Expertise</div>
                    <div className="instr-tag-list">
                      {inst.expertise.map(e => (
                        <span key={e} className="instr-tag">{e}</span>
                      ))}
                    </div>
                  </div>
                  <div className="instr-meta-block">
                    <div className="instr-meta-label">Courses Taught</div>
                    <div className="instr-course-list">
                      {inst.courses.map(c => (
                        <div key={c} className="instr-course-item">
                          <span className="instr-course-check"><CheckIcon /></span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why Our Instructors Are Different */}
      <section className="instr-why-section">
        <div className="instr-why-inner">
          <Reveal>
            <h2 className="instr-why-title">Why Our Instructors Are Different</h2>
          </Reveal>
          <div className="instr-why-grid">
            {DIFFERENTIATORS.map((d, i) => (
              <Reveal key={d.label} delay={i * 0.1}>
                <div className="instr-why-card">
                  <div className="instr-why-num">0{i + 1}</div>
                  <div className="instr-why-heading">{d.label}</div>
                  <p className="instr-why-desc">{d.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="instr-cta">
        <Reveal>
          <div className="instr-cta-inner">
            <h2 className="instr-cta-title">Ready to learn from people who do this every day?</h2>
            <p className="instr-cta-sub">
              Browse all courses and find the right starting point for your role and goals.
            </p>
            <Link href="/academy/courses" className="instr-cta-btn">
              Browse Courses
              <ArrowRightIcon />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
