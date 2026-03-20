'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
function QuoteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" opacity="0.3"/>
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
const TESTIMONIALS = [
  {
    quote: "I took the AI Development for Founders course before hiring SocioFi to build my product. I understood the proposal immediately, asked the right questions, and the project shipped in 2 weeks. Best $149 I ever spent.",
    name: "Priya D.",
    role: "Founder",
    company: "InboxFlow",
    audience: "founder",
    course: "AI Development for Founders",
  },
  {
    quote: "The Spec Writing course alone saved me from a $30K mistake. I was about to sign a proposal that was missing half of what I needed. After the course, I rewrote the requirements and the new proposal was 40% cheaper and more complete.",
    name: "Marcus T.",
    role: "CEO",
    company: "Healthify",
    audience: "founder",
    course: "How to Spec a Software Product",
  },
  {
    quote: "My team of 15 did the Technical Literacy bootcamp. Within a month, our conversations with our dev team completely changed. We stopped asking 'is it done yet?' and started asking 'what's blocking the deployment pipeline?' That shift saved us weeks.",
    name: "Sarah M.",
    role: "Operations Director",
    company: "LogiLink",
    audience: "team",
    course: "Technical Literacy for Non-Technical Teams",
  },
  {
    quote: "The AI Agents course saved me from buying a $50K automation platform. Turns out I needed two $199/month agents from SocioFi instead. I would never have known the difference without taking the course first.",
    name: "David K.",
    role: "Business Owner",
    company: "RetailEdge",
    audience: "leader",
    course: "Understanding AI Agents for Business",
  },
  {
    quote: "I've managed software teams for 8 years but never really understood what they were building. The Managing AI Development course changed that. Now I can read a sprint report and actually understand what's happening.",
    name: "Jennifer L.",
    role: "VP of Product",
    company: "FinTechCo",
    audience: "leader",
    course: "Managing AI-Powered Development",
  },
  {
    quote: "The From Idea to MVP course taught me what to cut. I went into my first development project with a 40-feature wishlist. After the course, I started with 6 features. We launched in 3 weeks. The 40-feature version would have taken 6 months.",
    name: "Omar A.",
    role: "Founder",
    company: "Stackly",
    audience: "founder",
    course: "From Idea to MVP",
  },
  {
    quote: "Reading Technical Documentation changed how I work with our dev agency. I used to just nod along in meetings. Now I can read their architecture docs and ask real questions. They actually seem relieved.",
    name: "Rachel P.",
    role: "Product Manager",
    company: "DesignOps",
    audience: "team",
    course: "Reading Technical Documentation",
  },
  {
    quote: "The SCARL certification was the most practical professional development I've done in 10 years. The final assessment — evaluating a real technical proposal — was exactly the situation I was facing at work. I passed and immediately used the skills.",
    name: "Nathan B.",
    role: "Director of Technology",
    company: "MediaGroup",
    audience: "leader",
    course: "SCARL Certification",
  },
  {
    quote: "Our entire 8-person founding team took the Technical Literacy course together. It created a shared vocabulary we didn't have before. Decisions that used to take 3 meetings now take 20 minutes.",
    name: "Tae-Yang K.",
    role: "Co-Founder",
    company: "Nexara",
    audience: "team",
    course: "Technical Literacy for Non-Technical Teams",
  },
  {
    quote: "I was skeptical — how much can you really learn about AI development in 6 hours? Answer: enough to change how you run your company. I restructured our entire vendor selection process after taking the course.",
    name: "Amelia R.",
    role: "CEO",
    company: "ConsultCo",
    audience: "founder",
    course: "AI Development for Founders",
  },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'founder', label: 'Founders' },
  { key: 'leader', label: 'Leaders' },
  { key: 'team', label: 'Teams' },
];

const STATS = [
  { value: '500+', label: 'learners' },
  { value: '4.9/5', label: 'average rating' },
  { value: '95%', label: 'completion rate' },
  { value: '73%', label: 'go on to hire SocioFi' },
];

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.test-page { background: var(--bg); min-height: 100vh; }

/* Hero */
.test-hero {
  padding: 160px 32px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.test-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 800px 400px at 50% 0%, rgba(232,184,77,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.test-label {
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
.test-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
}
.test-hero-title {
  font-family: ${F.h};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin: 0 auto 32px;
  max-width: 700px;
}

/* Filters */
.test-filters {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.test-filter-btn {
  font-family: ${F.b};
  font-size: 0.88rem;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 100px;
  border: 1.5px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.test-filter-btn:hover {
  border-color: ${A}55;
  color: var(--text-primary);
}
.test-filter-btn.active {
  background: ${A};
  border-color: ${A};
  color: #0C0C1D;
  font-weight: 600;
}

/* Grid */
.test-section {
  padding: 80px 32px 100px;
  max-width: 1100px;
  margin: 0 auto;
}
.test-masonry {
  columns: 2;
  column-gap: 24px;
}
@media (max-width: 768px) {
  .test-masonry { columns: 1; }
}
.test-card-wrap {
  break-inside: avoid;
  margin-bottom: 24px;
}
.test-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid ${A};
  border-radius: 16px;
  padding: 28px;
  box-shadow: var(--card-shadow);
  transition: border-color 0.3s, transform 0.3s;
}
.test-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--card-hover-shadow);
}
.test-quote-icon { color: ${A}; margin-bottom: 12px; }
.test-quote {
  font-family: ${F.h};
  font-size: 0.95rem;
  font-weight: 600;
  font-style: italic;
  line-height: 1.65;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.test-author {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.test-author-info {}
.test-author-name {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
}
.test-author-role {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.test-course-tag {
  font-family: ${F.m};
  font-size: 0.68rem;
  color: ${A};
  background: ${A}15;
  border: 1px solid ${A}33;
  border-radius: 6px;
  padding: 3px 8px;
  letter-spacing: 0.02em;
}

/* Stats Bar */
.test-stats {
  background: var(--bg-2);
  padding: 60px 32px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.test-stats-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
}
.test-stat {
  text-align: center;
}
.test-stat-value {
  font-family: ${F.h};
  font-size: 2rem;
  font-weight: 800;
  color: ${A};
  letter-spacing: -0.03em;
  display: block;
}
.test-stat-label {
  font-family: ${F.b};
  font-size: 0.84rem;
  color: var(--text-secondary);
}
.test-stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}
@media (max-width: 600px) {
  .test-stat-divider { display: none; }
  .test-stats-inner { gap: 28px; }
}

/* CTA */
.test-cta {
  padding: 100px 32px;
  text-align: center;
}
.test-cta-inner { max-width: 500px; margin: 0 auto; }
.test-cta-title {
  font-family: ${F.h};
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 16px;
}
.test-cta-sub {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 32px;
}
.test-cta-btn {
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
.test-cta-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 32px ${A}55;
}

@media (max-width: 768px) {
  .test-hero { padding: 120px 20px 60px; }
  .test-section { padding: 60px 20px 80px; }
  .test-cta { padding: 80px 20px; }
}
`;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = TESTIMONIALS.filter(t =>
    activeFilter === 'all' ? true : t.audience === activeFilter
  );

  return (
    <main className="test-page">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="test-hero">
        <Reveal>
          <div className="test-label">LEARNER STORIES</div>
          <h1 className="test-hero-title">What Students Say After Completing Academy Courses.</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="test-filters">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`test-filter-btn${activeFilter === f.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="test-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="test-masonry"
          >
            {filtered.map((t, i) => (
              <div key={`${t.name}-${i}`} className="test-card-wrap">
                <div className="test-card">
                  <div className="test-quote-icon"><QuoteIcon /></div>
                  <p className="test-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="test-author">
                    <div className="test-author-info">
                      <div className="test-author-name">{t.name}</div>
                      <div className="test-author-role">{t.role}, {t.company}</div>
                    </div>
                    <span className="test-course-tag">{t.course}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Stats Bar */}
      <section className="test-stats">
        <div className="test-stats-inner">
          {STATS.map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
              <div className="test-stat">
                <span className="test-stat-value">{s.value}</span>
                <span className="test-stat-label">{s.label}</span>
              </div>
              {i < STATS.length - 1 && <div className="test-stat-divider" />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="test-cta">
        <Reveal>
          <div className="test-cta-inner">
            <h2 className="test-cta-title">Join 500+ founders and leaders who&apos;ve already enrolled.</h2>
            <p className="test-cta-sub">
              Browse the full course catalog and find the right starting point for your goals.
            </p>
            <Link href="/academy/courses" className="test-cta-btn">
              Browse Courses
              <ArrowRightIcon />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
