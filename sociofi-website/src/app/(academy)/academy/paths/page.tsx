'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
.paths-hero {
  min-height: 50vh;
  display: flex;
  align-items: center;
  padding: 130px 0 64px;
  position: relative;
  overflow: hidden;
}
.paths-hero::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 640px; height: 640px;
  background: radial-gradient(circle, rgba(232,184,77,0.07) 0%, transparent 68%);
  pointer-events: none;
}
.paths-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.paths-label {
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
.paths-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.paths-hero-title {
  font-family: ${F.h};
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.07;
  letter-spacing: -0.032em;
  color: var(--text-primary);
  margin-bottom: 20px;
  max-width: 700px;
}
.paths-hero-sub {
  font-family: ${F.b};
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.72;
  max-width: 580px;
}

/* ── Path Cards ── */
.paths-cards-section {
  padding: 80px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.paths-section-label {
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
.paths-section-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.paths-section-title {
  font-family: ${F.h};
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 40px;
}
.paths-cards-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.paths-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.35s ease;
}
.paths-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px; height: 100%;
  background: ${A};
  opacity: 0;
  transition: opacity 0.35s ease;
}
.paths-card:hover { border-color: rgba(232,184,77,0.3); transform: translateX(4px); }
.paths-card:hover::before { opacity: 1; }
.paths-card-inner {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 28px;
  align-items: start;
}
@media (max-width: 768px) {
  .paths-card-inner { grid-template-columns: 1fr; gap: 20px; }
  .paths-card-cta-col { justify-self: start; }
}
.paths-card-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1.5px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  color: ${A};
  flex-shrink: 0;
}
.paths-card-content {}
.paths-card-eyebrow {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 6px;
}
.paths-card-title {
  font-family: ${F.h};
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}
.paths-card-tagline {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: ${A};
  font-weight: 500;
  margin-bottom: 12px;
}
.paths-card-body {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 20px;
  max-width: 600px;
}
.paths-course-seq {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.paths-course-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.paths-course-num {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: ${F.m};
  font-size: 0.55rem;
  color: ${A};
  font-weight: 700;
  flex-shrink: 0;
}
.paths-course-name {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.paths-course-meta {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: var(--text-muted);
  margin-left: auto;
  white-space: nowrap;
}
.paths-bundle-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(232,184,77,0.08);
  border: 1px solid rgba(232,184,77,0.2);
  border-radius: 100px;
  padding: 5px 14px;
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  letter-spacing: 0.05em;
}
.paths-card-cta-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  flex-shrink: 0;
  padding-top: 4px;
}
.paths-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 12px 22px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.22s ease;
  white-space: nowrap;
}
.paths-cta-btn:hover { opacity: 0.88; transform: translateY(-2px); }

/* ── Quiz ── */
.paths-quiz-section {
  padding: 80px 0;
  background: var(--bg);
}
.paths-quiz-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px 36px;
  max-width: 720px;
}
.paths-quiz-title {
  font-family: ${F.h};
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.paths-quiz-sub {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 28px;
  line-height: 1.6;
}
.paths-quiz-q {
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.paths-quiz-q-num {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  letter-spacing: 0.1em;
  margin-bottom: 6px;
  text-transform: uppercase;
}
.paths-quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.paths-quiz-opt {
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.22s ease;
  text-align: left;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
}
.paths-quiz-opt:hover { border-color: rgba(232,184,77,0.4); color: var(--text-primary); }
.paths-quiz-opt.selected {
  border-color: ${A};
  background: rgba(232,184,77,0.08);
  color: var(--text-primary);
}
.paths-quiz-opt-dot {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  transition: all 0.22s ease;
}
.paths-quiz-opt.selected .paths-quiz-opt-dot {
  background: ${A};
  border-color: ${A};
}
.paths-quiz-result {
  background: rgba(232,184,77,0.08);
  border: 1px solid rgba(232,184,77,0.25);
  border-radius: 12px;
  padding: 20px 22px;
  margin-top: 8px;
}
.paths-quiz-result-label {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}
.paths-quiz-result-title {
  font-family: ${F.h};
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.paths-quiz-result-desc {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
}
.paths-quiz-result-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: ${A};
  text-decoration: none;
}
.paths-quiz-result-link:hover { opacity: 0.8; }

/* ── Bottom CTA ── */
.paths-bottom-section {
  padding: 72px 0 80px;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
  text-align: center;
}
.paths-bottom-title {
  font-family: ${F.h};
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.paths-bottom-sub {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 28px;
}
.paths-bottom-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  border: 1.5px solid rgba(232,184,77,0.4);
  color: ${A};
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.22s ease;
}
.paths-bottom-btn:hover { background: rgba(232,184,77,0.08); }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function LightBulb() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-7 7c0 2.52 1.34 4.73 3.35 5.98L9 17h6l.65-2.02C17.66 13.73 19 11.52 19 9a7 7 0 00-7-7z" />
    </svg>
  );
}
function Chart() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1={18} y1={20} x2={18} y2={10} />
      <line x1={12} y1={20} x2={12} y2={4} />
      <line x1={6} y1={20} x2={6} y2={14} />
      <line x1={2} y1={20} x2={22} y2={20} />
    </svg>
  );
}
function Users() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx={9} cy={7} r={4} />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PATHS = [
  {
    href: '/academy/paths/founder',
    icon: <LightBulb />,
    eyebrow: 'Founder Path',
    title: "I'm Building Something",
    tagline: "The Founder's Path to Technical Confidence",
    body: "You have an idea — maybe a prototype. You need to understand enough about AI development to lead the project, evaluate proposals, and make smart decisions without learning to code.",
    courses: [
      { num: '01', name: "From Idea to MVP", meta: '3 hrs · $59' },
      { num: '02', name: 'How to Spec a Software Product', meta: '4 hrs · $79' },
      { num: '03', name: 'AI Development for Founders', meta: '6 hrs · $149' },
      { num: '04', name: 'Understanding AI Agents for Business', meta: '4 hrs · $99' },
    ],
    bundle: '17 hours · Bundle: $299 (save 23%)',
    ctaLabel: 'See Founder Path',
  },
  {
    href: '/academy/paths/leader',
    icon: <Chart />,
    eyebrow: 'Leader Path',
    title: "I'm Managing Technology",
    tagline: "The Leader's Path to AI Fluency",
    body: "You lead a team or department. You need to understand AI development and modern software well enough to set strategy, manage vendors, and make build/buy/agent decisions.",
    courses: [
      { num: '01', name: 'Managing AI-Powered Development', meta: '5 hrs · $129' },
      { num: '02', name: 'The SaaS to AaaS Transition', meta: '3 hrs · $79' },
      { num: '03', name: 'Build vs Buy vs Agent', meta: '2 hrs · $49' },
    ],
    bundle: '10 hours · Bundle: $199 (save 23%)',
    ctaLabel: 'See Leader Path',
  },
  {
    href: '/academy/paths/team',
    icon: <Users />,
    eyebrow: 'Team Path',
    title: "My Team Needs a Foundation",
    tagline: "The Team Path to Technical Literacy",
    body: "Your organization is adopting AI tools. Your team needs baseline technical literacy to collaborate effectively with developers and work alongside AI agents.",
    courses: [
      { num: '01', name: 'Technical Literacy for Non-Technical Teams', meta: '6 hrs · $149' },
      { num: '02', name: 'Working with AI Agents in Your Organization', meta: '3 hrs · $79' },
      { num: '03', name: 'Reading Technical Documentation', meta: '2 hrs · $39' },
    ],
    bundle: '11 hours · Bundle: $199/person (save 25%)',
    ctaLabel: 'See Team Path',
  },
];

const QUIZ_QUESTIONS = [
  {
    q: "What best describes your situation?",
    options: [
      { label: "I have an idea or prototype I want to build out", path: 'founder' },
      { label: "I manage a team or make technology decisions", path: 'leader' },
      { label: "My team works with developers and AI tools daily", path: 'team' },
    ],
  },
  {
    q: "What's your biggest challenge right now?",
    options: [
      { label: "I can't evaluate whether the work I'm getting is good", path: 'founder' },
      { label: "I approve budgets for projects I don't fully understand", path: 'leader' },
      { label: "Meetings with developers feel like a different language", path: 'team' },
    ],
  },
  {
    q: "What outcome do you most want?",
    options: [
      { label: "Lead my product project with confidence", path: 'founder' },
      { label: "Set AI strategy and evaluate vendors properly", path: 'leader' },
      { label: "My whole team can collaborate with developers effectively", path: 'team' },
    ],
  },
];

const PATH_RESULTS: Record<string, { title: string; href: string; desc: string }> = {
  founder: { title: "The Founder Path is for you.", href: '/academy/paths/founder', desc: "4 courses built for people building products. Start with MVP framing, end with AI agent strategy." },
  leader: { title: "The Leader Path fits your role.", href: '/academy/paths/leader', desc: "3 courses for people who manage technology and need AI fluency to lead effectively." },
  team: { title: "The Team Path is the right fit.", href: '/academy/paths/team', desc: "3 courses that build the technical foundation every non-technical team member needs today." },
};

const rveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } };

// ── Quiz Component ────────────────────────────────────────────────────────────
function PathQuiz() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (path: string) => {
    setSelected(path);
    const next = [...answers, path];
    setTimeout(() => {
      if (qIndex < QUIZ_QUESTIONS.length - 1) {
        setAnswers(next);
        setQIndex(qIndex + 1);
        setSelected(null);
      } else {
        setAnswers(next);
        setQIndex(QUIZ_QUESTIONS.length);
      }
    }, 300);
  };

  const reset = () => { setAnswers([]); setQIndex(0); setSelected(null); };

  const resultPath = answers.length >= 3
    ? (['founder', 'leader', 'team'].sort((a, b) =>
        answers.filter(x => x === b).length - answers.filter(x => x === a).length
      )[0])
    : null;

  if (qIndex >= QUIZ_QUESTIONS.length && resultPath) {
    const result = PATH_RESULTS[resultPath];
    return (
      <motion.div className="paths-quiz-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="paths-quiz-result-label">Your recommended path</div>
        <div className="paths-quiz-result-title">{result.title}</div>
        <p className="paths-quiz-result-desc">{result.desc}</p>
        <Link href={result.href} className="paths-quiz-result-link">
          See the path <ArrowRight size={13} />
        </Link>
        <button onClick={reset} style={{ display: 'block', marginTop: 12, fontFamily: F.m, fontSize: '0.62rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Start over
        </button>
      </motion.div>
    );
  }

  const q = QUIZ_QUESTIONS[qIndex];
  return (
    <>
      <div className="paths-quiz-q-num">Question {qIndex + 1} of {QUIZ_QUESTIONS.length}</div>
      <div className="paths-quiz-q">{q.q}</div>
      <div className="paths-quiz-options">
        {q.options.map((opt, i) => (
          <button key={i} className={`paths-quiz-opt${selected === opt.path ? ' selected' : ''}`}
            onClick={() => handleSelect(opt.path)}>
            <div className={`paths-quiz-opt-dot${selected === opt.path ? ' selected' : ''}`} />
            {opt.label}
          </button>
        ))}
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PathsOverviewPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="paths-hero">
        <div className="paths-inner">
          <motion.div {...rveal}>
            <div className="paths-label">Learning Paths</div>
            <h1 className="paths-hero-title">Your Learning Path. Based on Who You Are.</h1>
            <p className="paths-hero-sub">
              Three structured paths — each a sequence of courses designed for your role and goals. Pick the path, follow the sequence, and come out the other side with real technical confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Path Cards ── */}
      <section className="paths-cards-section">
        <div className="paths-inner">
          <motion.div {...rveal}>
            <div className="paths-section-label">Three paths</div>
            <h2 className="paths-section-title">Pick the one that fits.</h2>
          </motion.div>
          <div className="paths-cards-stack">
            {PATHS.map((p, i) => (
              <motion.div key={p.href} className="paths-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="paths-card-inner">
                  <div className="paths-card-icon">{p.icon}</div>
                  <div className="paths-card-content">
                    <div className="paths-card-eyebrow">{p.eyebrow}</div>
                    <div className="paths-card-title">{p.title}</div>
                    <div className="paths-card-tagline">{p.tagline}</div>
                    <p className="paths-card-body">{p.body}</p>
                    <div className="paths-course-seq">
                      {p.courses.map((c) => (
                        <div key={c.num} className="paths-course-item">
                          <div className="paths-course-num">{c.num}</div>
                          <span className="paths-course-name">{c.name}</span>
                          <span className="paths-course-meta">{c.meta}</span>
                        </div>
                      ))}
                    </div>
                    <div className="paths-bundle-info">{p.bundle}</div>
                  </div>
                  <div className="paths-card-cta-col">
                    <Link href={p.href} className="paths-cta-btn">
                      {p.ctaLabel} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quiz ── */}
      <section className="paths-quiz-section">
        <div className="paths-inner">
          <motion.div {...rveal}>
            <div className="paths-section-label">Path finder</div>
            <h2 className="paths-section-title">Not sure which path?</h2>
          </motion.div>
          <motion.div className="paths-quiz-card"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="paths-quiz-title">Answer 3 questions.</div>
            <p className="paths-quiz-sub">We'll recommend the right path for your situation.</p>
            <PathQuiz />
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="paths-bottom-section">
        <div className="paths-inner">
          <motion.div {...rveal}>
            <div className="paths-bottom-title">Ready to browse individual courses?</div>
            <p className="paths-bottom-sub">All 10 courses available individually or as bundles.</p>
            <Link href="/academy/courses" className="paths-bottom-btn">
              See all courses <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
