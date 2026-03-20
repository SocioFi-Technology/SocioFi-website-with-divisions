'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const A = '#7B6FE8';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  .talks-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .talks-hero { padding: 148px 0 100px; position: relative; overflow: hidden; }
  .talks-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .talks-hero-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
  .talks-hero-orb-1 { width: 600px; height: 400px; background: radial-gradient(circle, rgba(123,111,232,0.07) 0%, transparent 70%); top: -100px; right: -100px; }
  .talks-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; position: relative; }
  .talks-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 28px; }
  .talks-hero-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .talks-hero-h1 { font-family: ${F.h}; font-size: clamp(2.4rem, 4vw, 3.4rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary); margin: 0 0 24px; max-width: 680px; }
  .talks-hero-accent { background: linear-gradient(135deg, #5548B0, ${A}, #9D94F0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .talks-hero-sub { font-family: ${F.b}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary); max-width: 560px; margin: 0 0 40px; }
  .talks-hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
  .talks-hero-stat-val { font-family: ${F.h}; font-size: 2rem; font-weight: 800; color: ${A}; letter-spacing: -0.04em; display: block; line-height: 1; margin-bottom: 4px; }
  .talks-hero-stat-label { font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted); }

  /* Section */
  .talks-section { padding: 100px 0; }
  .talks-section-alt { background: var(--bg-2); }
  .talks-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .talks-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 14px; }
  .talks-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .talks-section-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 16px; }
  .talks-section-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 640px; margin: 0 0 56px; }

  /* Year filter */
  .talks-filter { display: flex; gap: 8px; margin-bottom: 36px; flex-wrap: wrap; }
  .talks-filter-btn { font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.06em; padding: 6px 14px; border-radius: 100px; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-muted); }
  .talks-filter-btn:hover, .talks-filter-btn.active { border-color: ${A}; color: ${A}; background: rgba(123,111,232,0.08); }

  /* Talk list */
  .talks-list { display: flex; flex-direction: column; gap: 2px; }
  .talk-item { display: grid; grid-template-columns: 100px 1fr auto; gap: 28px; align-items: start; padding: 24px 20px; border-radius: 12px; border: 1px solid transparent; transition: all 0.25s; }
  .talk-item:hover { background: var(--bg-card); border-color: var(--border); }
  .talk-date { font-family: ${F.m}; font-size: 0.75rem; color: var(--text-muted); padding-top: 3px; }
  .talk-content { flex: 1; }
  .talk-title { font-family: ${F.h}; font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; letter-spacing: -0.01em; cursor: default; }
  .talk-event { font-family: ${F.b}; font-size: 0.84rem; color: ${A}; margin-bottom: 10px; }
  .talk-desc { font-family: ${F.b}; font-size: 0.84rem; line-height: 1.65; color: var(--text-secondary); margin: 0; max-width: 620px; }
  .talk-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .talk-chip { font-family: ${F.m}; font-size: 0.65rem; padding: 2px 8px; border-radius: 100px; background: rgba(123,111,232,0.08); color: var(--text-muted); border: 1px solid rgba(123,111,232,0.12); }
  .talk-slides { display: inline-flex; align-items: center; gap: 6px; font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted); text-decoration: none; padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border); transition: all 0.2s; white-space: nowrap; margin-top: 2px; }
  .talk-slides:hover { border-color: ${A}; color: ${A}; }
  .talk-divider { height: 1px; background: var(--border); margin: 4px 0; opacity: 0.4; }

  /* Featured (upcoming) */
  .talks-featured { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 48px; margin-bottom: 64px; position: relative; overflow: hidden; }
  .talks-featured-glow { position: absolute; width: 500px; height: 300px; background: radial-gradient(ellipse, rgba(123,111,232,0.07) 0%, transparent 70%); top: 50%; right: -100px; transform: translateY(-50%); pointer-events: none; }
  .talks-featured-badge { display: inline-flex; align-items: center; gap: 6px; font-family: ${F.m}; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; background: rgba(123,111,232,0.12); color: ${A}; margin-bottom: 20px; }
  .talks-featured-dot { width: 5px; height: 5px; border-radius: 50%; background: ${A}; animation: talkPulse 2s ease-in-out infinite; }
  .talks-featured-title { font-family: ${F.h}; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; letter-spacing: -0.02em; position: relative; }
  .talks-featured-event { font-family: ${F.b}; font-size: 1rem; color: ${A}; margin-bottom: 16px; position: relative; }
  .talks-featured-desc { font-family: ${F.b}; font-size: 0.95rem; line-height: 1.75; color: var(--text-secondary); max-width: 600px; position: relative; }

  /* Speaking CTA */
  .talks-cta-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 48px; text-align: center; position: relative; overflow: hidden; }
  .talks-cta-glow { position: absolute; width: 600px; height: 300px; background: radial-gradient(ellipse, rgba(123,111,232,0.07) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
  .talks-cta-title { font-family: ${F.h}; font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 0 0 14px; letter-spacing: -0.02em; position: relative; }
  .talks-cta-sub { font-family: ${F.b}; font-size: 0.95rem; line-height: 1.75; color: var(--text-secondary); margin: 0 0 12px; position: relative; max-width: 520px; margin-left: auto; margin-right: auto; }
  .talks-cta-topics { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin: 20px 0 36px; position: relative; }
  .talks-cta-topic { font-family: ${F.b}; font-size: 0.82rem; padding: 5px 14px; border-radius: 100px; background: rgba(123,111,232,0.08); border: 1px solid rgba(123,111,232,0.15); color: var(--text-secondary); }
  .talks-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, #5548B0, ${A}); border: none; cursor: pointer; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 20px rgba(123,111,232,0.4); position: relative; }
  .talks-btn-primary:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 32px rgba(123,111,232,0.55); }

  @keyframes talkPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @media (max-width: 768px) {
    .talks-hero { padding: 120px 0 80px; }
    .talks-container { padding: 0 20px; }
    .talks-section { padding: 72px 0; }
    .talk-item { grid-template-columns: 1fr; gap: 12px; }
    .talk-date { padding-top: 0; }
    .talks-featured { padding: 32px; }
    .talks-cta-box { padding: 32px 24px; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const TALKS = [
  {
    date: 'Mar 2026',
    year: 2026,
    title: 'The Future of AI-Native Development',
    event: 'Future Forward Tech 2026 · Dhaka, Bangladesh',
    desc: 'Where AI-native development goes from here: what the next generation of developer tooling looks like, which parts of software engineering will and will not be automated, and what the human role looks like in a world where AI writes most of the code.',
    tags: ['Keynote', 'AI-native', 'Future of work'],
    slides: '#',
    upcoming: true,
  },
  {
    date: 'Jan 2026',
    year: 2026,
    title: 'Reliability Patterns for Production AI Agents',
    event: 'AI Engineering Summit 2025 · Online',
    desc: 'A deep-dive into the failure modes we have seen across two years of running AI agents in production: what breaks, when it breaks, and the architectural patterns that make systems recoverable. Covers output validation, failure recovery, observability, and human escalation design.',
    tags: ['Architecture', 'Reliability', 'Production'],
    slides: '#',
    upcoming: false,
  },
  {
    date: 'Nov 2025',
    year: 2025,
    title: 'Spec-to-Code Pipelines in Practice',
    event: 'Bangladesh Software Summit 2025 · Dhaka, Bangladesh',
    desc: 'How we build pipelines that take a written feature specification and produce reviewed, tested, deployable code — and where those pipelines break down. Includes honest numbers on first-pass accuracy, failure classification, and the human review steps that are not optional.',
    tags: ['Engineering', 'Pipelines', 'Spec-to-code'],
    slides: '#',
    upcoming: false,
  },
  {
    date: 'Sep 2025',
    year: 2025,
    title: 'The 40% Automation Threshold: Setting Realistic Expectations',
    event: 'DevOps Days Dhaka 2025 · Dhaka, Bangladesh',
    desc: 'What 40% AI automation actually looks like in a software team: which tasks get automated first, what changes about the human engineer role, and why the "AI replaces developers" narrative misses the point entirely. Data from our own projects.',
    tags: ['Automation', 'Reality check', 'DevOps'],
    slides: '#',
    upcoming: false,
  },
  {
    date: 'Aug 2025',
    year: 2025,
    title: 'Open Sourcing AI Tooling: Lessons from 18 Months',
    event: 'FOSS Asia 2025 · Singapore',
    desc: 'What we learned from releasing and maintaining open-source AI tooling for 18 months: what makes AI tooling hard to open-source (it is not the licensing), why documentation is three times as important as the code, and when to archive instead of maintain.',
    tags: ['Open source', 'Tooling', 'Sustainability'],
    slides: '#',
    upcoming: false,
  },
  {
    date: 'Jun 2025',
    year: 2025,
    title: 'Why Your RAG Pipeline Is Lying to You',
    event: 'AI Bangladesh Meetup 2025 · Dhaka, Bangladesh',
    desc: 'The failure modes of retrieval-augmented generation that nobody talks about: context window mismatches, embedding model drift, chunk boundary artefacts, and the cases where RAG performs worse than a simple keyword search. Practical debugging techniques.',
    tags: ['RAG', 'Vector search', 'Debugging'],
    slides: '#',
    upcoming: false,
  },
  {
    date: 'Dec 2024',
    year: 2024,
    title: 'When AI Agents Fail: Failure Modes and Recovery',
    event: 'DevFest Dhaka 2024 · Dhaka, Bangladesh',
    desc: 'A taxonomy of AI agent failure modes: model errors, tool errors, coordination failures, silent degradation. For each failure mode: how to detect it, how to design for recovery, and real examples from production systems we have built and debugged.',
    tags: ['Failure modes', 'Agents', 'Recovery'],
    slides: '#',
    upcoming: false,
  },
  {
    date: 'Oct 2024',
    year: 2024,
    title: 'Building With AI Without Getting Burned',
    event: 'Startup Bangladesh 2024 · Dhaka, Bangladesh',
    desc: 'A practical guide for founders who are building with AI for the first time: what AI coding tools are actually good at, where they fail, why a prototype that works is not a product that ships, and the questions to ask before trusting AI-generated code in production.',
    tags: ['Founders', 'Practical guide', 'AI tools'],
    slides: '#',
    upcoming: false,
  },
];

const SPEAKING_TOPICS = [
  'AI agent reliability and failure modes',
  'Production AI pipeline architecture',
  'Spec-to-code pipelines and automation',
  'Open-source AI tooling',
  'Developer experience for AI-native teams',
  'Realistic AI expectations for founders',
];

const YEARS = ['All', '2026', '2025', '2024'];

// ─── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TalksPage() {
  const [activeYear, setActiveYear] = useState('All');

  const upcoming = TALKS.filter((t) => t.upcoming);
  const filtered = TALKS.filter((t) => !t.upcoming && (activeYear === 'All' || t.year === parseInt(activeYear)));

  return (
    <div className="talks-page">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="talks-hero">
        <div className="talks-hero-bg">
          <div className="talks-hero-orb talks-hero-orb-1" />
        </div>
        <div className="talks-hero-inner">
          <Reveal>
            <div className="talks-hero-badge">Labs · Talks</div>
            <h1 className="talks-hero-h1">
              Where we share the{' '}
              <span className="talks-hero-accent">research externally.</span>
            </h1>
            <p className="talks-hero-sub">
              Presentations, conference talks, and meetup sessions from 2024 to present.
              We speak on what we are actively researching — not polished retrospectives of things
              we figured out years ago.
            </p>
            <div className="talks-hero-stats">
              <div>
                <span className="talks-hero-stat-val">8</span>
                <span className="talks-hero-stat-label">Talks given</span>
              </div>
              <div>
                <span className="talks-hero-stat-val">6</span>
                <span className="talks-hero-stat-label">Events</span>
              </div>
              <div>
                <span className="talks-hero-stat-val">3</span>
                <span className="talks-hero-stat-label">Countries</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Talks ── */}
      <section className="talks-section">
        <div className="talks-container">

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <Reveal>
              <div className="talks-sec-label">Coming up</div>
              {upcoming.map((talk) => (
                <div key={talk.title} className="talks-featured" style={{ marginBottom: 64 }}>
                  <div className="talks-featured-glow" />
                  <div className="talks-featured-badge">
                    <span className="talks-featured-dot" />
                    Upcoming
                  </div>
                  <div className="talks-featured-title">{talk.title}</div>
                  <div className="talks-featured-event">{talk.event}</div>
                  <p className="talks-featured-desc">{talk.desc}</p>
                </div>
              ))}
            </Reveal>
          )}

          <Reveal>
            <div className="talks-sec-label">All talks</div>
            <h2 className="talks-section-title">Presentations and conference sessions.</h2>
            <p className="talks-section-sub">
              Slides are linked where available. Talk descriptions are the abstract as submitted —
              we do not retroactively edit them to look better than the talk turned out to be.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="talks-filter">
              {YEARS.map((y) => (
                <button
                  key={y}
                  className={`talks-filter-btn${activeYear === y ? ' active' : ''}`}
                  onClick={() => setActiveYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="talks-list">
            {filtered.map((talk, i) => (
              <Reveal key={talk.title} delay={i * 0.05}>
                <div className="talk-item">
                  <div className="talk-date">{talk.date}</div>
                  <div className="talk-content">
                    <div className="talk-title">{talk.title}</div>
                    <div className="talk-event">{talk.event}</div>
                    <p className="talk-desc">{talk.desc}</p>
                    <div className="talk-chips">
                      {talk.tags.map((tag) => (
                        <span key={tag} className="talk-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <a href={talk.slides} className="talk-slides">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15V6m0 0H12M21 6l-9 9" />
                        <path d="M3 15V5a2 2 0 0 1 2-2h11" />
                        <rect x="3" y="15" width="18" height="6" rx="1" />
                      </svg>
                      Slides
                    </a>
                  </div>
                </div>
                {i < filtered.length - 1 && <div className="talk-divider" />}
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <div style={{ fontFamily: F.b, color: 'var(--text-muted)', padding: '40px 20px', fontSize: '0.9rem' }}>
                No talks found for {activeYear}.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Speaking CTA ── */}
      <section className="talks-section talks-section-alt">
        <div className="talks-container">
          <Reveal>
            <div className="talks-cta-box">
              <div className="talks-cta-glow" />
              <div className="talks-sec-label" style={{ justifyContent: 'center' }}>Speaking</div>
              <h2 className="talks-cta-title">Invite us to speak.</h2>
              <p className="talks-cta-sub">
                We accept a limited number of speaking invitations each year. We prioritise events
                where the audience is technical and the questions are hard. We do not give the same
                talk twice without updating it with new data.
              </p>
              <div className="talks-cta-topics">
                {SPEAKING_TOPICS.map((t) => (
                  <span key={t} className="talks-cta-topic">{t}</span>
                ))}
              </div>
              <Link href="/contact" className="talks-btn-primary">
                Send a speaking inquiry
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
