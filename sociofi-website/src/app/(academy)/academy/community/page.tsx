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
function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <UsersIcon />,
    title: 'Private Community',
    desc: 'A dedicated Slack workspace for all Academy graduates. Ask questions, share what you\'re building, and get answers from peers and SocioFi engineers who are actively working on production projects.',
  },
  {
    icon: <CalendarIcon />,
    title: 'Monthly Alumni Q&A',
    desc: 'Every month, SocioFi engineers host a live Q&A session for community members. Ask about your specific situation — a vendor proposal you\'re evaluating, a project you\'re planning, or a technical decision you\'re facing.',
  },
  {
    icon: <RefreshIcon />,
    title: 'Course Updates',
    desc: 'AI development moves fast. When courses are updated with new content, frameworks, or case studies, all existing graduates get the updates automatically. No additional cost, no re-enrollment.',
  },
  {
    icon: <LinkIcon />,
    title: 'Peer Network',
    desc: 'Connect with other founders and leaders who\'ve completed the same curriculum. Find collaborators, compare vendor experiences, and build relationships with people navigating the same challenges.',
  },
];

const COMMUNITY_QUOTES = [
  {
    quote: "The monthly Q&A alone is worth more than the course price. I brought a vendor proposal to the last session and got a clear assessment in 20 minutes. That would have taken a $500 consultant call otherwise.",
    name: "Oliver S.",
    role: "Founder, Runloop",
  },
  {
    quote: "I've connected with 3 other founders in the community who were building similar products. We now share vendor notes and give each other informal technical reviews. It's become a real resource.",
    name: "Lena V.",
    role: "CEO, DataBridge",
  },
  {
    quote: "The Slack community is high-signal in a way most communities aren't. People ask real questions and get direct answers. No one is selling anything.",
    name: "Carlos M.",
    role: "Operations Lead, FlowState",
  },
];

const GUIDELINES = [
  "Real questions about real projects — no promotional content",
  "Respect the expertise level of all members — beginners and experts welcome",
  "Give before you take — share your experience, not just your questions",
  "Keep it constructive — feedback should help, not criticize",
];

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.comm-page { background: var(--bg); min-height: 100vh; }

/* Hero */
.comm-hero {
  padding: 160px 32px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.comm-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 800px 400px at 50% 0%, rgba(232,184,77,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.comm-label {
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
.comm-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
}
.comm-hero-title {
  font-family: ${F.h};
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin: 0 auto 20px;
  max-width: 680px;
}
.comm-hero-sub {
  font-family: ${F.b};
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--text-secondary);
  max-width: 620px;
  margin: 0 auto;
}

/* Features */
.comm-features {
  padding: 80px 32px;
  max-width: 1100px;
  margin: 0 auto;
}
.comm-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media (max-width: 768px) {
  .comm-features-grid { grid-template-columns: 1fr; }
}
.comm-feat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px;
  box-shadow: var(--card-shadow);
  transition: border-color 0.3s, transform 0.3s;
}
.comm-feat-card:hover {
  border-color: ${A}44;
  transform: translateY(-4px);
  box-shadow: var(--card-hover-shadow);
}
.comm-feat-icon {
  color: ${A};
  margin-bottom: 16px;
}
.comm-feat-title {
  font-family: ${F.h};
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}
.comm-feat-desc {
  font-family: ${F.b};
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Access Card */
.comm-access-section {
  background: var(--bg-2);
  padding: 100px 32px;
}
.comm-access-inner {
  max-width: 900px;
  margin: 0 auto;
}
.comm-access-card {
  background: linear-gradient(135deg, ${A}18 0%, ${A}0a 100%);
  border: 1.5px solid ${A}44;
  border-radius: 24px;
  padding: 48px;
  text-align: center;
}
.comm-access-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}
.comm-access-title {
  font-family: ${F.h};
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 16px;
}
.comm-access-desc {
  font-family: ${F.b};
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 560px;
  margin: 0 auto 12px;
}
.comm-access-note {
  font-family: ${F.m};
  font-size: 0.8rem;
  color: ${A};
  margin-bottom: 32px;
}
.comm-access-btn {
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
.comm-access-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 32px ${A}55;
}

/* Member Quotes */
.comm-quotes-section {
  padding: 100px 32px;
  max-width: 1100px;
  margin: 0 auto;
}
.comm-section-title {
  font-family: ${F.h};
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 40px;
}
.comm-quotes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 900px) {
  .comm-quotes-grid { grid-template-columns: 1fr; }
}
.comm-quote-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid ${A};
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--card-shadow);
}
.comm-quote-text {
  font-family: ${F.h};
  font-size: 0.9rem;
  font-weight: 600;
  font-style: italic;
  line-height: 1.65;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.comm-quote-name {
  font-family: ${F.h};
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-primary);
}
.comm-quote-role {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-secondary);
}

/* Guidelines */
.comm-guidelines-section {
  background: var(--bg-2);
  padding: 80px 32px;
}
.comm-guidelines-inner {
  max-width: 700px;
  margin: 0 auto;
}
.comm-guidelines-title {
  font-family: ${F.h};
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.015em;
  margin-bottom: 8px;
}
.comm-guidelines-sub {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 28px;
}
.comm-guideline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
.comm-guideline-item:last-child { border-bottom: none; }
.comm-guideline-check {
  color: ${A};
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .comm-hero { padding: 120px 20px 80px; }
  .comm-features { padding: 60px 20px; }
  .comm-access-section { padding: 80px 20px; }
  .comm-access-card { padding: 32px 24px; }
  .comm-quotes-section { padding: 80px 20px; }
  .comm-guidelines-section { padding: 60px 20px; }
}
`;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  return (
    <main className="comm-page">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="comm-hero">
        <Reveal>
          <div className="comm-label">ALUMNI COMMUNITY</div>
          <h1 className="comm-hero-title">Keep Learning After the Course Ends.</h1>
          <p className="comm-hero-sub">
            A private community for all SocioFi Academy graduates. Network with other
            founders and leaders, keep learning, and stay connected to what&apos;s
            happening in AI development.
          </p>
        </Reveal>
      </section>

      {/* Features */}
      <section className="comm-features">
        <div className="comm-features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="comm-feat-card">
                <div className="comm-feat-icon">{f.icon}</div>
                <div className="comm-feat-title">{f.title}</div>
                <p className="comm-feat-desc">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Access */}
      <section className="comm-access-section">
        <div className="comm-access-inner">
          <Reveal>
            <div className="comm-access-card">
              <div className="comm-access-label">COMMUNITY ACCESS</div>
              <h2 className="comm-access-title">Free for all Academy graduates. Forever.</h2>
              <p className="comm-access-desc">
                Community access is included with every Academy course enrollment. Lifetime
                access. No additional subscription, no annual renewal, no hidden fees.
              </p>
              <p className="comm-access-note">
                Complete any Academy course → Get community invite in your welcome email.
              </p>
              <Link href="/academy/courses" className="comm-access-btn">
                Enroll in a Course
                <ArrowRightIcon />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Member Quotes */}
      <section className="comm-quotes-section">
        <Reveal>
          <h2 className="comm-section-title">What members are saying</h2>
        </Reveal>
        <div className="comm-quotes-grid">
          {COMMUNITY_QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.1}>
              <div className="comm-quote-card">
                <p className="comm-quote-text">&ldquo;{q.quote}&rdquo;</p>
                <div className="comm-quote-name">{q.name}</div>
                <div className="comm-quote-role">{q.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section className="comm-guidelines-section">
        <Reveal>
          <div className="comm-guidelines-inner">
            <h2 className="comm-guidelines-title">Community Guidelines</h2>
            <p className="comm-guidelines-sub">A focused, professional community. We keep it high signal.</p>
            {GUIDELINES.map((g, i) => (
              <div key={i} className="comm-guideline-item">
                <span className="comm-guideline-check"><CheckIcon /></span>
                <span>{g}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </main>
  );
}
