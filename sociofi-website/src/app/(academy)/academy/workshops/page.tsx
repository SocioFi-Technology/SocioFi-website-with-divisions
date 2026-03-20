'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ── Design tokens ─────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Data ──────────────────────────────────────────────────────────────────────
const WORKSHOPS = [
  { slug: 'ai-development-101-q-a', name: 'AI Development 101: Live Q&A', format: 'webinar', date: '2026-04-08', day: '08', month: 'APR', year: '2026', time: '2:00 PM – 3:30 PM BST', duration: '90 minutes', price: 0, maxSeats: 100, seatsRemaining: 67, description: 'Monthly live Q&A where SocioFi engineers answer questions about AI development and agents.' },
  { slug: 'spec-writing-workshop', name: 'Spec Writing Workshop', format: 'workshop', date: '2026-04-22', day: '22', month: 'APR', year: '2026', time: '10:00 AM – 1:00 PM BST', duration: '3 hours', price: 99, maxSeats: 30, seatsRemaining: 12, description: 'Hands-on workshop: write a real product spec with expert guidance and live feedback.' },
  { slug: 'agent-deployment-walkthrough', name: 'Agent Deployment Walkthrough', format: 'workshop', date: '2026-05-06', day: '06', month: 'MAY', year: '2026', time: '3:00 PM – 5:00 PM BST', duration: '2 hours', price: 79, maxSeats: 40, seatsRemaining: 28, description: 'Live demonstration of deploying AI agents into real business workflows.' },
  { slug: 'founders-build-sprint', name: "Founder's Build Sprint", format: 'sprint', date: '2026-05-19', day: '19', month: 'MAY', year: '2026', time: '9:00 AM – 11:00 AM BST (3 days)', duration: '3 × 2 hours', price: 249, maxSeats: 20, seatsRemaining: 8, description: '3-day intensive: go from business idea to fully scoped project brief with engineer coaching.' },
  { slug: 'technical-literacy-bootcamp', name: 'Technical Literacy Bootcamp', format: 'workshop', date: '2026-06-03', day: '03', month: 'JUN', year: '2026', time: '9:00 AM – 3:00 PM BST', duration: 'Full day (6 hours)', price: 199, maxSeats: 25, seatsRemaining: 19, description: 'Full-day immersive bootcamp covering the complete technical literacy curriculum.' },
  { slug: 'corporate-ai-readiness', name: 'Corporate AI Readiness Assessment', format: 'corporate', date: '2026-06-17', day: '17', month: 'JUN', year: '2026', time: '10:00 AM – 2:00 PM BST', duration: 'Half day (4 hours)', price: 499, maxSeats: 15, seatsRemaining: 15, description: 'Private half-day session for your team to assess AI readiness and build an adoption plan.' },
];

const PAST_WORKSHOPS = [
  { slug: 'ai-dev-q-a-march', name: 'AI Development 101: Live Q&A (March)', day: '11', month: 'MAR', year: '2026', time: '2:00 PM – 3:30 PM BST', duration: '90 minutes', price: 0, description: 'Recording available.' },
  { slug: 'spec-writing-feb', name: 'Spec Writing Workshop (February)', day: '18', month: 'FEB', year: '2026', time: '10:00 AM – 1:00 PM BST', duration: '3 hours', price: 99, description: 'Recording available to enrolled students.' },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  .wk-page { background: var(--bg); min-height: 100vh; }

  .wk-hero {
    min-height: 52vh;
    display: flex; align-items: center;
    padding: 120px 0 80px;
    position: relative; overflow: hidden;
  }
  .wk-hero-orb1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    filter: blur(120px); background: rgba(232,184,77,0.06);
    top: -100px; left: -200px; pointer-events: none;
  }
  .wk-hero-orb2 {
    position: absolute; width: 400px; height: 400px; border-radius: 50%;
    filter: blur(100px); background: rgba(232,184,77,0.04);
    bottom: -100px; right: -100px; pointer-events: none;
  }
  .wk-hero-inner {
    max-width: 900px; margin: 0 auto; padding: 0 32px;
    position: relative; z-index: 1; text-align: center;
  }
  .wk-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500;
    color: ${A}; letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .wk-label::before, .wk-label::after {
    content: ''; width: 24px; height: 1.5px; background: ${A}; display: inline-block;
  }
  .wk-hero-title {
    font-family: ${F.h}; font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 20px;
  }
  .wk-hero-sub {
    font-family: ${F.b}; font-size: 1.05rem; color: var(--text-secondary);
    line-height: 1.7; max-width: 640px; margin: 0 auto;
  }

  .wk-section { padding: 80px 32px; max-width: 860px; margin: 0 auto; }
  .wk-section-title {
    font-family: ${F.h}; font-size: 1.6rem; font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 32px;
  }
  .wk-divider { height: 1px; background: var(--border); margin: 0 32px; }

  /* Workshop card */
  .wk-list { display: flex; flex-direction: column; gap: 16px; }
  .wk-card {
    display: grid; grid-template-columns: 88px 1fr; gap: 0;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden; transition: all 0.35s ease;
    text-decoration: none;
  }
  .wk-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(232,184,77,0.12);
    border-color: rgba(232,184,77,0.3);
  }
  .wk-date-badge {
    background: linear-gradient(180deg, #E8B84D, #D4A030);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 20px 0; flex-shrink: 0;
  }
  .wk-day { font-family: ${F.h}; font-size: 2.2rem; font-weight: 800; color: #fff; line-height: 1; }
  .wk-month { font-family: ${F.m}; font-size: 0.65rem; color: rgba(255,255,255,0.85); letter-spacing: 0.1em; margin-top: 2px; }
  .wk-year { font-family: ${F.m}; font-size: 0.5rem; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .wk-content { padding: 20px 24px; }
  .wk-format-badge {
    display: inline-flex; align-items: center; gap: 4px;
    border: 1px solid rgba(232,184,77,0.4); border-radius: 100px;
    padding: 2px 10px; font-family: ${F.m}; font-size: 0.55rem;
    color: ${A}; letter-spacing: 0.06em; margin-bottom: 8px; text-transform: uppercase;
  }
  .wk-title { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
  .wk-desc { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.55; }
  .wk-meta { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 3px; display: flex; align-items: center; gap: 5px; }
  .wk-price { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: ${A}; }
  .wk-seats { font-family: ${F.b}; font-size: 0.75rem; color: var(--text-muted); margin-top: 3px; display: flex; align-items: center; gap: 4px; }
  .wk-seats.urgent { color: #F87171; font-weight: 600; }
  .wk-footer { display: flex; align-items: center; gap: 16px; margin-top: 14px; flex-wrap: wrap; }
  .wk-register {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 8px;
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    color: #1a1a1a; font-family: ${F.h}; font-size: 0.82rem; font-weight: 700;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
  }
  .wk-register:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,184,77,0.4); }
  .wk-register.wk-free {
    background: rgba(232,184,77,0.1); color: ${A};
    border: 1px solid rgba(232,184,77,0.35); box-shadow: none;
  }
  .wk-register.wk-free:hover { background: rgba(232,184,77,0.18); box-shadow: none; }

  /* Past workshops */
  .wk-past-toggle {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 8px; background: transparent;
    border: 1px solid var(--border); color: var(--text-secondary);
    font-family: ${F.b}; font-size: 0.85rem;
    cursor: pointer; transition: all 0.2s; margin-bottom: 20px;
  }
  .wk-past-toggle:hover { border-color: rgba(232,184,77,0.4); color: ${A}; }
  .wk-past-toggle .chev { transition: transform 0.3s; }
  .wk-past-toggle.open .chev { transform: rotate(180deg); }
  .wk-past-card {
    display: grid; grid-template-columns: 88px 1fr; gap: 0;
    background: var(--bg-2); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden; opacity: 0.65;
  }
  .wk-past-badge {
    background: var(--bg-3);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 20px 0;
  }
  .wk-past-day { font-family: ${F.h}; font-size: 2rem; font-weight: 800; color: var(--text-muted); line-height: 1; }
  .wk-past-month { font-family: ${F.m}; font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; margin-top: 2px; }
  .wk-recording {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: ${F.b}; font-size: 0.8rem; color: ${A};
    text-decoration: none; margin-top: 10px;
  }
  .wk-recording:hover { text-decoration: underline; }

  /* Workshop types */
  .wk-types-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }
  .wk-type-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 22px; transition: all 0.3s ease;
  }
  .wk-type-card:hover {
    border-color: rgba(232,184,77,0.3); transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(232,184,77,0.08);
  }
  .wk-type-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(232,184,77,0.1);
    display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
  }
  .wk-type-name { font-family: ${F.h}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
  .wk-type-freq { font-family: ${F.m}; font-size: 0.6rem; color: ${A}; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
  .wk-type-desc { font-family: ${F.b}; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.55; }
  .wk-type-price { font-family: ${F.h}; font-size: 0.85rem; font-weight: 700; color: ${A}; margin-top: 10px; }
  .wk-type-link {
    display: inline-flex; align-items: center; gap: 4px;
    margin-top: 8px; font-family: ${F.b}; font-size: 0.78rem;
    color: ${A}; text-decoration: none;
  }
  .wk-type-link:hover { text-decoration: underline; }

  /* CTA */
  .wk-cta { background: var(--bg-2); border-top: 1px solid var(--border); padding: 80px 32px; text-align: center; }
  .wk-cta-inner { max-width: 560px; margin: 0 auto; }
  .wk-cta-title { font-family: ${F.h}; font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 12px; }
  .wk-cta-sub { font-family: ${F.b}; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 28px; line-height: 1.6; }
  .wk-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 10px;
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    color: #1a1a1a; font-family: ${F.h}; font-size: 0.9rem; font-weight: 700;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
  }
  .wk-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(232,184,77,0.4); }

  @media (max-width: 640px) {
    .wk-hero { padding: 100px 0 60px; }
    .wk-section { padding: 60px 20px; }
    .wk-divider { margin: 0 20px; }
    .wk-card { grid-template-columns: 72px 1fr; }
    .wk-day { font-size: 1.8rem; }
    .wk-types-grid { grid-template-columns: 1fr 1fr; }
    .wk-cta { padding: 60px 20px; }
  }
  @media (max-width: 400px) {
    .wk-types-grid { grid-template-columns: 1fr; }
  }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
function IcoCalendar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IcoClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcoUsers() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IcoArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IcoChevron() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chev">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function IcoPlay() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function IcoMonitor() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function IcoZap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IcoBriefcase() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IcoUsersLg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ── Workshop card component ───────────────────────────────────────────────────
function WorkshopCard({ w, index }: { w: typeof WORKSHOPS[0]; index: number }) {
  const urgent = w.seatsRemaining <= 10;
  const isFree = w.price === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <div className="wk-card">
        <div className="wk-date-badge">
          <span className="wk-day">{w.day}</span>
          <span className="wk-month">{w.month}</span>
          <span className="wk-year">{w.year}</span>
        </div>
        <div className="wk-content">
          <div className="wk-format-badge">{w.format}</div>
          <div className="wk-title">{w.name}</div>
          <div className="wk-desc">{w.description}</div>
          <div className="wk-meta"><IcoCalendar /> {w.time}</div>
          <div className="wk-meta"><IcoClock /> {w.duration}</div>
          <div className="wk-footer">
            <div>
              <div className="wk-price">{isFree ? 'Free' : `$${w.price}`}</div>
              <div className={`wk-seats${urgent ? ' urgent' : ''}`}>
                <IcoUsers />
                {urgent
                  ? `Only ${w.seatsRemaining} seats left!`
                  : `${w.seatsRemaining} of ${w.maxSeats} seats remaining`}
              </div>
            </div>
            <Link
              href={`/academy/workshops/${w.slug}`}
              className={`wk-register${isFree ? ' wk-free' : ''}`}
            >
              {isFree ? 'Register Free' : 'Register'} <IcoArrow />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const TYPE_CARDS = [
  { icon: <IcoUsersLg />, name: 'Free Webinars', freq: 'Monthly', desc: 'Monthly 90-minute live Q&A sessions. Intro-level, open to everyone. Bring any question about AI development.', price: 'Free' },
  { icon: <IcoMonitor />, name: 'Skill Workshops', freq: 'Bi-monthly', desc: 'Interactive 2–3 hour deep-dives on specific skills. Hands-on exercises, small groups, real-time feedback.', price: '$79 – $99' },
  { icon: <IcoZap />, name: 'Intensive Sprints', freq: 'Quarterly', desc: 'Multi-session deep-dives spread over 2–3 days. Go from idea to output with expert engineer coaching throughout.', price: '$249' },
  { icon: <IcoBriefcase />, name: 'Corporate Sessions', freq: 'On request', desc: 'Private half-day or full-day sessions for your team. Custom agenda, internal case studies, confidential format.', price: '$499+', link: '/academy/corporate' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WorkshopsPage() {
  const [pastOpen, setPastOpen] = useState(false);

  return (
    <>
      <style>{STYLES}</style>
      <main className="wk-page">

        {/* Hero */}
        <section className="wk-hero">
          <div className="wk-hero-orb1" />
          <div className="wk-hero-orb2" />
          <div className="wk-hero-inner">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="wk-label">Live Workshops</div>
            </motion.div>
            <motion.h1 className="wk-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
              Learn Together. Ask Questions. Get Answers.
            </motion.h1>
            <motion.p className="wk-hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}>
              Live virtual sessions where you learn alongside other founders and leaders. Interactive, not lecture-style. Bring your real questions.
            </motion.p>
          </div>
        </section>

        <div className="wk-divider" />

        {/* Upcoming workshops */}
        <section className="wk-section">
          <h2 className="wk-section-title">Upcoming Sessions</h2>
          <div className="wk-list">
            {WORKSHOPS.map((w, i) => <WorkshopCard key={w.slug} w={w} index={i} />)}
          </div>
        </section>

        <div className="wk-divider" />

        {/* Past workshops */}
        <section className="wk-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <button
            className={`wk-past-toggle${pastOpen ? ' open' : ''}`}
            onClick={() => setPastOpen((p) => !p)}
          >
            <IcoPlay />
            {pastOpen ? 'Hide past recordings' : 'Show past recordings'}
            <IcoChevron />
          </button>

          <AnimatePresence>
            {pastOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="wk-list">
                  {PAST_WORKSHOPS.map((p) => (
                    <div key={p.slug} className="wk-past-card">
                      <div className="wk-past-badge">
                        <span className="wk-past-day">{p.day}</span>
                        <span className="wk-past-month">{p.month}</span>
                      </div>
                      <div className="wk-content">
                        <div className="wk-title" style={{ opacity: 0.75 }}>{p.name}</div>
                        <div className="wk-meta"><IcoClock /> {p.duration}</div>
                        <div className="wk-meta" style={{ marginTop: 4, color: 'var(--text-muted)' }}>{p.description}</div>
                        <Link href={`/academy/workshops/${p.slug}`} className="wk-recording">
                          <IcoPlay /> Watch Recording
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="wk-divider" />

        {/* Workshop types */}
        <section className="wk-section">
          <h2 className="wk-section-title">Four types of live learning:</h2>
          <div className="wk-types-grid">
            {TYPE_CARDS.map((t, i) => (
              <motion.div
                key={t.name}
                className="wk-type-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <div className="wk-type-icon">{t.icon}</div>
                <div className="wk-type-name">{t.name}</div>
                <div className="wk-type-freq">{t.freq}</div>
                <div className="wk-type-desc">{t.desc}</div>
                <div className="wk-type-price">{t.price}</div>
                {t.link && (
                  <Link href={t.link} className="wk-type-link">
                    Learn more <IcoArrow />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="wk-cta">
          <div className="wk-cta-inner">
            <motion.h2 className="wk-cta-title" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              Want to run a workshop for your team privately?
            </motion.h2>
            <motion.p className="wk-cta-sub" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.08 }}>
              Corporate sessions are tailored to your team&apos;s specific situation — your tools, your challenges, your goals. Half-day or full-day formats available.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.14 }}>
              <Link href="/academy/corporate" className="wk-cta-btn">
                Explore Corporate Sessions <IcoArrow />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}
