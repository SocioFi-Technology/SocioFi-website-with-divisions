import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { courses, workshops, getCourseImage } from '@/lib/academy';
import LearningPathQuiz from './_components/LearningPathQuiz';
import AudiencePills from './_components/AudiencePills';
import './academy-page.css';

export const metadata: Metadata = {
  title: 'Academy',
  description: 'Practical AI development courses for non-technical founders, business leaders, and teams. Learn to build with AI — or lead teams that do.',
  openGraph: {
    title: 'SocioFi Academy — Learn to Build with AI',
    description: 'Practical courses for founders, leaders, and teams. Understand AI development well enough to commission it, manage it, and build on it.',
  },
};

// ── Constants (used in inline styles) ────────────────────────────────────────
const A = 'var(--division-accent, #E8B84D)';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURED_SLUGS = [
  'ai-development-for-founders',
  'understanding-ai-agents-for-business',
  'technical-literacy-for-teams',
];

const AUDIENCE_LABELS: Record<string, string> = {
  founder: 'For Founders',
  leader: 'For Leaders',
  team: 'For Teams',
};

function parseDateBadge(dateStr: string): { day: string; mon: string } {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day: d.getDate().toString(),
    mon: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
  };
}

// ── Layout helpers ────────────────────────────────────────────────────────────
function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', ...style }}>
      {children}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconBookOpen = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const IconUsers = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBriefcase = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconStar = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconZap = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconCloud = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);
const IconTool = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AcademyPage() {
  const featuredCourses = FEATURED_SLUGS.map((s) => courses.find((c) => c.slug === s)!).filter(Boolean);
  const upcomingWorkshops = workshops.slice(0, 3);

  return (
    <main className="acad-page">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="acad-section" style={{ paddingTop: 140, paddingBottom: 100 }}>
        <Container>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <ScrollReveal>
              <div className="sec-label" style={{ justifyContent: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: A, display: 'inline-block', flexShrink: 0 }} />
                Education &amp; Training
              </div>
              <h1 style={{ fontFamily: F.h, fontSize: 'clamp(2.6rem,5vw,4rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.035em', color: 'var(--text-primary)', marginBottom: 24 }}>
                Learn to Build with AI. Or{' '}
                <br />
                <span className="gradient-text">Lead Teams That Do.</span>
              </h1>
              <p style={{ fontFamily: F.b, fontSize: '1.1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
                Practical courses for non-technical founders, business leaders, and teams. Understand AI development well enough to commission it, manage it, and build on it.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              {/* Client island: interactive audience pill selector */}
              <AudiencePills />

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32, justifyContent: 'center' }}>
                <Link href="/academy/courses" className="btn-amber">
                  Browse Courses <IconArrowRight size={14} />
                </Link>
                <Link href="/academy/free" className="btn-ghost">
                  Try Something Free
                </Link>
              </div>

              <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                &ldquo;I wish someone had explained this to me before I hired my first dev team.&rdquo; — Tamar, SaaS founder
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── 2. CHOOSE YOUR PATH ─────────────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>Where do you start?</div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 0 }}>
                Three Paths. Pick the One That Fits.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid-3">
            {[
              {
                icon: <IconBookOpen size={22} />,
                title: 'Founder Path',
                body: 'You are building or planning to build a product. Learn how AI development works, how to spec your idea, and how to work with a dev team — without needing to write code.',
                meta: '4 courses · 16 hours · from $59',
                cta: 'Start as a Founder',
                href: '/academy/courses?audience=founder',
              },
              {
                icon: <IconBriefcase size={22} />,
                title: 'Leader Path',
                body: 'You manage teams, budgets, or strategy. Understand the AI development landscape well enough to lead decisions, evaluate vendors, and drive adoption.',
                meta: '4 courses · 14 hours · from $49',
                cta: 'Start as a Leader',
                href: '/academy/courses?audience=leader',
              },
              {
                icon: <IconUsers size={22} />,
                title: 'Team Path',
                body: 'You work alongside engineers or AI tools. Build the technical literacy to collaborate confidently, understand documentation, and work with AI agents.',
                meta: '3 courses · 11 hours · from $39',
                cta: 'Start as a Team Member',
                href: '/academy/courses?audience=team',
              },
            ].map((path, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="path-card" style={{ background: 'color-mix(in srgb, var(--bg-card) 97%, #E8B84D 3%)' }}>
                  <div className="path-icon">{path.icon}</div>
                  <h3 style={{ fontFamily: F.h, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {path.title}
                  </h3>
                  <p style={{ fontFamily: F.b, fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                    {path.body}
                  </p>
                  <p style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, letterSpacing: '0.05em', margin: 0 }}>
                    {path.meta}
                  </p>
                  <Link
                    href={path.href}
                    style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}
                  >
                    {path.cta} <IconArrowRight size={13} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. LEARNING PATH QUIZ ───────────────────────────────────────── */}
      <section className="acad-warm-tint" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>Find Your Course</div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 16 }}>
                Not Sure Where to Start?
              </h2>
              <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
                Answer three quick questions and we will recommend the right course for you.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            {/* Client island: interactive 3-step quiz */}
            <LearningPathQuiz />
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 4. FEATURED COURSES ─────────────────────────────────────────── */}
      <section className="acad-section" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div className="sec-label">Most Popular</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12, maxWidth: 560 }}>
              Courses Founders and Leaders Start With.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 520 }}>
              Three courses that cover the most common gaps between business understanding and technical reality.
            </p>
          </ScrollReveal>

          <div className="grid-3">
            {featuredCourses.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 0.1}>
                <Link href={`/academy/courses/${c.slug}`} className="course-tile">
                  <div className="course-thumb" style={{ background: c.thumbnailGradient, position: 'relative', overflow: 'hidden' }}>
                    <Image src={getCourseImage(c.category)} alt="" fill style={{ objectFit: 'cover' }} />
                    <span className="course-thumb-price" style={{ position: 'relative', zIndex: 1 }}>${c.price}</span>
                    <span className="course-thumb-badge" style={{ position: 'relative', zIndex: 1 }}>{c.duration}</span>
                  </div>
                  <div className="course-body">
                    <p className="course-audience">{AUDIENCE_LABELS[c.audience]}</p>
                    <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0 }}>
                      {c.name}
                    </h3>
                    <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                      {c.tagline}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: A, fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600, marginTop: 8 }}>
                      Enroll <IconArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/academy/courses" className="btn-ghost">
                View All 10 Courses <IconArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 5. UPCOMING WORKSHOPS ───────────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div className="sec-label">Live Workshops</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12, maxWidth: 560 }}>
              Learn Together. Ask Questions Live.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 520 }}>
              Small cohorts, expert facilitators, real feedback. Every session is practical, not theoretical.
            </p>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {upcomingWorkshops.map((ws, i) => {
              const { day, mon } = parseDateBadge(ws.date);
              const isLow = ws.seatsRemaining <= 10;
              return (
                <ScrollReveal key={ws.slug} delay={i * 0.08}>
                  <div className="ws-card">
                    <div className="ws-date-badge">
                      <span className="ws-date-day">{day}</span>
                      <span className="ws-date-mon">{mon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                        <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {ws.name}
                        </h3>
                        <span className="ws-format-badge">{ws.format}</span>
                      </div>
                      <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                        {ws.time} · {ws.duration}
                      </p>
                      <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {ws.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      <p style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {ws.price === 0 ? 'Free' : `$${ws.price}`}
                      </p>
                      <span className={`ws-seats${isLow ? ' low' : ''}`}>
                        {ws.seatsRemaining} / {ws.maxSeats} seats
                      </span>
                      <Link
                        href={`/academy/workshops/${ws.slug}`}
                        className="btn-amber"
                        style={{ fontSize: '0.8rem', padding: '9px 18px', whiteSpace: 'nowrap' }}
                      >
                        {ws.price === 0 ? 'Register Free' : 'Register'}
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.3}>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/academy/workshops" style={{ fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                See all workshops <IconArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 6. SCARL CERTIFICATION ─────────────────────────────────────── */}
      <section className="acad-warm-tint" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div className="sec-label">Certification</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 48, maxWidth: 560 }}>
              Become a Certified AI-Ready Leader.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="scarl-panel">
              <div style={{ textAlign: 'center' }}>
                <div className="scarl-badge">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                    <path d="M28 8 L38 18 L50 20 L40 30 L42 44 L28 36 L14 44 L16 30 L6 20 L18 18 Z" stroke={A} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                    <path d="M22 28 L26 32 L34 24" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{ fontFamily: F.m, fontSize: '0.84rem', fontWeight: 700, color: A, letterSpacing: '0.1em', textTransform: 'uppercase' }}>SCARL</p>
                <p style={{ fontFamily: F.b, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  SocioFi Certified<br />AI-Ready Leader
                </p>
              </div>

              <div>
                <p style={{ fontFamily: F.b, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  A structured 6-week program combining all three leader-path courses with live sessions, peer cohorts, and a final project review. Complete it and earn a credential that signals genuine AI literacy to teams, investors, and partners.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                  {[['6 weeks', 'Duration'], ['~4 hrs/week', 'Commitment'], ['30 per cohort', 'Cohort size']].map(([val, lbl]) => (
                    <div key={lbl} style={{ textAlign: 'center', padding: '14px 8px', background: 'rgba(232,184,77,0.06)', borderRadius: 12, border: '1px solid rgba(232,184,77,0.1)' }}>
                      <p style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{val}</p>
                      <p style={{ fontFamily: F.b, fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{lbl}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>$499</p>
                  <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: A, margin: 0 }}>$399 early bird through June 2026</p>
                </div>

                <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 24, borderLeft: `2px solid rgba(232,184,77,0.3)`, paddingLeft: 14 }}>
                  &ldquo;We designed SCARL for people who need to lead AI-driven organisations, not write the code.&rdquo; — Kamrul Hasan, CTO
                </p>

                <Link href="/academy/certification" className="btn-amber">
                  Learn More About SCARL <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 7. FREE RESOURCES ───────────────────────────────────────────── */}
      <section className="acad-section" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div className="sec-label">Start Free</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12, maxWidth: 560 }}>
              Not Ready to Commit? Start Here.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 520 }}>
              No email required. No sign-up. Three free resources to help you understand what you are getting into before you invest.
            </p>
          </ScrollReveal>

          <div className="grid-3">
            {[
              { title: 'AI Development Glossary', desc: 'The 60 technical terms every founder and leader needs to know. Bookmark it before your next dev meeting.', icon: <IconBookOpen size={22} />, href: '/academy/free#glossary' },
              { title: "The Founder's Cost Guide", desc: 'What software actually costs — broken down by project type, team size, and approach. No agency BS.', icon: <IconBriefcase size={22} />, href: '/academy/free#cost-guide' },
              { title: 'Is AI Development Right for You?', desc: 'A 5-minute self-assessment. Answer honestly and you will know whether to build with AI, buy a tool, or wait.', icon: <IconZap size={22} />, href: '/academy/free#assessment' },
            ].map((r, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="resource-card">
                  <span className="free-badge">Free</span>
                  <div style={{ width: 40, height: 40, background: 'rgba(232,184,77,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: A, marginBottom: 16 }}>
                    {r.icon}
                  </div>
                  <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    {r.title}
                  </h3>
                  <p style={{ fontFamily: F.b, fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 16 }}>
                    {r.desc}
                  </p>
                  <Link href={r.href} style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Access Free <IconArrowRight size={13} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 8. CORPORATE TRAINING ───────────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '80px 0' }}>
        <Container>
          <ScrollReveal>
            <div className="corporate-section">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
                <div>
                  <div className="sec-label">For Organisations</div>
                  <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.6rem,2.5vw,2.1rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>
                    Train Your Entire Team.
                  </h2>
                  <p style={{ fontFamily: F.b, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 520, margin: 0 }}>
                    Private cohorts, custom curriculum, live facilitation. We run bespoke training sessions for teams of 5 to 200. Technical literacy, AI agent workflows, and leadership programmes — tailored to your organisation.
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Link href="/academy/corporate" className="btn-amber">
                    Inquire About Corporate Training <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 9. TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="acad-section" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div className="sec-label">What Learners Say</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 48, maxWidth: 560 }}>
              From founders who were exactly where you are.
            </h2>
          </ScrollReveal>

          <div className="grid-3">
            {[
              {
                quote: 'I went into my first developer meeting able to actually evaluate their proposals. Before the course, I was nodding along hoping they were being honest. After it, I was asking the right questions.',
                name: 'Priya S.',
                role: 'Founder, logistics startup',
                rating: 5,
              },
              {
                quote: 'The spec writing workshop saved me at least two months of back-and-forth. I handed the team a brief they could actually build from, and they shipped ahead of schedule.',
                name: 'Marcus L.',
                role: 'CEO, B2B SaaS company',
                rating: 5,
              },
              {
                quote: "My whole ops team took the technical literacy course before we rolled out our first AI agent. The adoption was smoother than anything we'd done before. They understood what it was doing.",
                name: 'Fatima A.',
                role: 'COO, 80-person professional services firm',
                rating: 5,
              },
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="testi-card">
                  <span className="testi-quote-mark">&ldquo;</span>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16, paddingTop: 24 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} style={{ color: A }}>
                        <IconStar size={14} />
                      </span>
                    ))}
                  </div>
                  <p style={{ fontFamily: F.b, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20 }}>
                    {t.quote}
                  </p>
                  <div>
                    <p style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{t.name}</p>
                    <p style={{ fontFamily: F.b, fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 10. ACADEMY → SOCIOFI FLOW ──────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '100px 0' }}>
        <Container>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>Learn Then Build</div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>
                Academy Prepares You. The Rest of SocioFi Delivers.
              </h2>
              <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
                Academy graduates are better clients, better collaborators, and better leaders. Every division in SocioFi exists to support what you build next.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flow-steps">
              {[
                { icon: <IconBookOpen size={22} />, label: 'Learn', sub: 'Academy', href: '/academy' },
                null,
                { icon: <IconTool size={22} />, label: 'Build', sub: 'Studio', href: '/studio' },
                null,
                { icon: <IconZap size={22} />, label: 'Deploy Agents', sub: 'Agents', href: '/agents' },
                null,
                { icon: <IconCloud size={22} />, label: 'Host', sub: 'Cloud', href: '/cloud' },
                null,
                { icon: <IconTool size={22} />, label: 'Maintain', sub: 'Services', href: '/services' },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} className="flow-arrow">
                    <IconArrowRight size={16} />
                  </div>
                ) : (
                  <Link key={i} href={item.href} className="flow-step" style={{ textDecoration: 'none' }}>
                    <div className="flow-step-icon" style={item.href === '/academy' ? { background: 'rgba(232,184,77,0.15)', borderColor: A } : {}}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{item.label}</p>
                      <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 11. CTA ─────────────────────────────────────────────────────── */}
      <section className="cta-section" style={{ padding: '120px 0' }}>
        <div className="cta-glow" />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>Ready to Learn?</div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 20 }}>
                Start with one course. Change how you work.
              </h2>
              <p style={{ fontFamily: F.b, fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Every course is practical, jargon-free, and built for the kind of person who is moving fast and needs real answers — not academic theory.
              </p>
              <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 36, borderLeft: `2px solid rgba(232,184,77,0.3)`, paddingLeft: 14, textAlign: 'left', maxWidth: 480, margin: '0 auto 36px' }}>
                &ldquo;We built Academy because every time a founder hired us without understanding the basics, the project took twice as long.&rdquo; — Arifur Rahman, CEO
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/academy/courses" className="btn-amber">
                  Browse All Courses <IconArrowRight size={14} />
                </Link>
                <Link href="/academy/free" className="btn-ghost">
                  Start Free
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </main>
  );
}
