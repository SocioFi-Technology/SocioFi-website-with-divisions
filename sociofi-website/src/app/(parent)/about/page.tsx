import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';
import AboutSubNav from '@/components/about/AboutSubNav';

// ── 10 DevBridge Development Agents ───────────────────────────────────────────

const DEV_AGENTS = [
  {
    id: 'SCOUT',
    role: 'Requirements Analyst',
    step: '01',
    color: '#72C4B2',
    desc: 'Reads project briefs, extracts technical requirements, creates structured specs.',
    svg: `<path d="M32 32 L50 32" stroke="currentColor" stroke-width="1.2" opacity="0.3" stroke-linecap="round"/>
      <path d="M32 32 L32 14" stroke="currentColor" stroke-width="1.2" opacity="0.3" stroke-linecap="round"/>
      <path d="M32 32 L45 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M16 48 A22 22 0 0 1 54 32" stroke="currentColor" stroke-width="1" fill="none" opacity="0.35"/>
      <path d="M20 20 A16 16 0 0 1 48 20" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.55"/>
      <circle cx="32" cy="32" r="3.5" fill="currentColor"/>
      <circle cx="45" cy="19" r="2" fill="currentColor" opacity="0.7"/>`,
  },
  {
    id: 'HUNTER',
    role: 'Pattern Researcher',
    step: '02',
    color: '#4A6CB8',
    desc: 'Finds relevant code patterns, libraries, and proven technical approaches.',
    svg: `<circle cx="30" cy="30" r="14" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="30" y1="8" x2="30" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="30" y1="44" x2="30" y2="52" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="8" y1="30" x2="16" y2="30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="44" y1="30" x2="52" y2="30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="30" cy="30" r="3" fill="currentColor"/>
      <line x1="40" y1="40" x2="52" y2="52" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`,
  },
  {
    id: 'ATLAS',
    role: 'System Architect',
    step: '03',
    color: '#3A589E',
    desc: 'Designs architecture — components, data flow, database structure.',
    svg: `<rect x="14" y="14" width="36" height="36" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.35"/>
      <line x1="26" y1="14" x2="26" y2="50" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
      <line x1="38" y1="14" x2="38" y2="50" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
      <line x1="14" y1="26" x2="50" y2="26" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
      <line x1="14" y1="38" x2="50" y2="38" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>
      <circle cx="26" cy="26" r="3.5" fill="currentColor"/>
      <circle cx="38" cy="38" r="3.5" fill="currentColor"/>
      <circle cx="38" cy="26" r="2" fill="currentColor" opacity="0.55"/>
      <circle cx="26" cy="38" r="2" fill="currentColor" opacity="0.55"/>
      <line x1="26" y1="26" x2="38" y2="38" stroke="currentColor" stroke-width="1" opacity="0.4"/>`,
  },
  {
    id: 'MIRROR',
    role: 'UI Developer',
    step: '04a',
    color: '#72C4B2',
    desc: 'Generates frontend — pages, forms, dashboards, responsive layouts.',
    svg: `<rect x="10" y="18" width="19" height="26" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="35" y="18" width="19" height="26" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" stroke-width="1" opacity="0.25" stroke-dasharray="3,3"/>
      <line x1="12" y1="26" x2="27" y2="26" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="37" y1="26" x2="52" y2="26" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <rect x="12" y="30" width="15" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="37" y="30" width="15" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="12" y="37" width="10" height="3" rx="1" fill="currentColor" opacity="0.25"/>
      <rect x="37" y="37" width="10" height="3" rx="1" fill="currentColor" opacity="0.25"/>`,
  },
  {
    id: 'FORGE',
    role: 'Backend Developer',
    step: '04b',
    color: '#E8916F',
    desc: 'Writes backend — APIs, business logic, database operations, auth.',
    svg: `<path d="M24 44 L20 52 L44 52 L40 44 Z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
      <rect x="22" y="36" width="20" height="10" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M29 36 C27 28 25 22 28 16 C30 12 34 12 36 16 C39 22 37 28 35 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="M32 36 C31 30 30 24 32 20" stroke="currentColor" stroke-width="1" opacity="0.45" stroke-linecap="round"/>`,
  },
  {
    id: 'HAMMER',
    role: 'Integration Engineer',
    step: '05',
    color: '#E8B84D',
    desc: 'Assembles frontend + backend, wires APIs, resolves conflicts.',
    svg: `<rect x="10" y="24" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="34" y="24" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M30 31 L34 31" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
      <path d="M28 27 L36 31 L28 35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="10" y1="24" x2="30" y2="24" stroke="currentColor" stroke-width="0.8" opacity="0" />
      <line x1="12" y1="22" x2="12" y2="16" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-linecap="round"/>
      <line x1="20" y1="22" x2="20" y2="14" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-linecap="round"/>
      <line x1="44" y1="22" x2="44" y2="16" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-linecap="round"/>
      <line x1="52" y1="22" x2="52" y2="14" stroke="currentColor" stroke-width="1" opacity="0.35" stroke-linecap="round"/>`,
  },
  {
    id: 'SENTINEL',
    role: 'Security & Quality Reviewer',
    step: '06',
    color: '#7B6FE8',
    desc: 'Reviews all code for security vulnerabilities, logic errors, architecture problems.',
    svg: `<path d="M32 10 L50 18 L50 34 C50 44 42 52 32 54 C22 52 14 44 14 34 L14 18 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <ellipse cx="32" cy="34" rx="9" ry="5.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <circle cx="32" cy="34" r="2.5" fill="currentColor"/>
      <path d="M18 34 Q24 24 32 24 Q40 24 46 34" stroke="currentColor" stroke-width="1" opacity="0.35" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'SHIELD',
    role: 'Testing & Deployment',
    step: '07',
    color: '#4DBFA8',
    desc: 'Runs test suites, validates deployments, verifies production readiness.',
    svg: `<path d="M18 28 L26 38 L46 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 34 L30 44 L50 24" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
      <path d="M26 40 L34 50 L54 30" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>`,
  },
  {
    id: 'BEACON',
    role: 'Documentation Writer',
    step: '08',
    color: '#6BA3E8',
    desc: 'Generates docs, API documentation, architecture notes, client handoff.',
    svg: `<line x1="32" y1="50" x2="32" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="18" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M22 46 L32 50 L42 46" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 30 C20 22 16 16 18 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M38 30 C44 22 48 16 46 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M22 36 C14 26 10 18 12 12" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.3"/>
      <path d="M42 36 C50 26 54 18 52 12" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" fill="none" opacity="0.3"/>`,
  },
  {
    id: 'NEXUS',
    role: 'Build Orchestrator',
    step: 'ALL',
    color: '#4A6CB8',
    desc: 'Coordinates all agents, manages task order, handles errors — the pipeline conductor.',
    svg: `<polygon points="32,8 55,20.5 55,43.5 32,56 9,43.5 9,20.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.85"/>
      <line x1="32" y1="27" x2="32" y2="14" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="36.5" y1="29.4" x2="47" y2="23" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="36.5" y1="34.6" x2="47" y2="41" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="32" y1="37" x2="32" y2="50" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="27.5" y1="34.6" x2="17" y2="41" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="27.5" y1="29.4" x2="17" y2="23" stroke="currentColor" stroke-width="1" opacity="0.6"/>`,
  },
];

// Pipeline steps (excluding NEXUS which orchestrates all)
const PIPELINE = [
  { id: 'SCOUT', color: '#72C4B2', label: 'Requirements' },
  { id: 'HUNTER', color: '#4A6CB8', label: 'Research' },
  { id: 'ATLAS', color: '#3A589E', label: 'Architecture' },
  { id: 'MIRROR+FORGE', color: '#E8916F', label: 'Build (parallel)', parallel: true },
  { id: 'HAMMER', color: '#E8B84D', label: 'Integration' },
  { id: 'SENTINEL', color: '#7B6FE8', label: 'Security Review' },
  { id: 'SHIELD', color: '#4DBFA8', label: 'Testing & Deploy' },
  { id: 'BEACON', color: '#6BA3E8', label: 'Documentation' },
];

const DIVISIONS = [
  { name: 'Studio', slug: 'studio', accent: '#72C4B2', desc: 'Custom software development for founders and SMBs' },
  { name: 'Services', slug: 'services', accent: '#4DBFA8', desc: 'Ongoing maintenance, monitoring, and bug fixes' },
  { name: 'Labs', slug: 'labs', accent: '#7B6FE8', desc: 'Research, open source, and public experiments' },
  { name: 'Products', slug: 'products', accent: '#E8916F', desc: 'FabricxAI, NEXUS ARIA, DevBridge OS' },
  { name: 'Academy', slug: 'academy', accent: '#E8B84D', desc: 'Courses, workshops, and corporate training' },
  { name: 'Ventures', slug: 'ventures', accent: '#6BA3E8', desc: 'Equity co-builds with early-stage startups' },
  { name: 'Cloud', slug: 'cloud', accent: '#5BB5E0', desc: 'Managed infrastructure and hosting' },
  { name: 'Technology', slug: '', accent: '#4A6CB8', desc: 'Parent company — strategy, research, and leadership' },
];

const SUPERVISORS = [
  { division: 'Studio', role: 'Lead Software Architect', accent: '#72C4B2' },
  { division: 'Services', role: 'Site Reliability Engineer', accent: '#4DBFA8' },
  { division: 'Labs', role: 'Research Engineer', accent: '#7B6FE8' },
  { division: 'Products', role: 'Product Engineer', accent: '#E8916F' },
  { division: 'Academy', role: 'Curriculum Architect', accent: '#E8B84D' },
  { division: 'Ventures', role: 'Technical Due Diligence Lead', accent: '#6BA3E8' },
  { division: 'Cloud', role: 'Infrastructure Engineer', accent: '#5BB5E0' },
  { division: 'Technology', role: 'Chief of Staff (AI Operations)', accent: '#4A6CB8' },
];

const VALUES_SUMMARY = [
  { num: '01', title: 'We say what things cost.', href: '/about/values#value-1' },
  { num: '02', title: 'We explain in plain English.', href: '/about/values#value-2' },
  { num: '03', title: 'We build things that work.', href: '/about/values#value-3' },
  { num: '04', title: 'Your code is yours.', href: '/about/values#value-4' },
  { num: '05', title: "We tell you when AI isn't the answer.", href: '/about/values#value-5' },
  { num: '06', title: 'We stay.', href: '/about/values#value-6' },
];

function AgentAvatar({ id, color, svgContent }: { id: string; color: string; svgContent: string }) {
  return (
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      border: `1.5px solid ${color}40`,
      background: `${color}10`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      animation: 'agentPulse 4s ease-in-out infinite',
    }}>
      <svg
        viewBox="0 0 64 64"
        style={{ width: 36, height: 36, color }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'About',
  description: 'SocioFi Technology — an AI-agent-native software studio founded by two BUET engineers in Dhaka. We combine AI-driven development with expert human oversight to build, launch, and maintain real products.',
  openGraph: {
    title: 'About SocioFi Technology',
    description: 'AI-agent-native software studio. AI builds. Humans architect. You scale.',
  },
};

export default function AboutPage() {
  return (
    <>
      <style>{`
        @keyframes agentPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.025); opacity: 0.85; }
        }
        @keyframes nowDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .about-agent-card:hover .agent-card-border { opacity: 1 !important; }
        .about-agent-card:hover { transform: translateY(-4px); }
        .about-agent-card { transition: transform 0.35s var(--ease); }
        .division-card:hover { border-color: var(--card-accent-color) !important; transform: translateY(-3px); }
        .division-card { transition: all 0.3s var(--ease); }
        .value-card:hover { border-color: var(--teal) !important; }
        .value-card { transition: border-color 0.2s; }

        @media (max-width: 640px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-founder-cards { grid-template-columns: 1fr !important; }
          .about-agent-grid { grid-template-columns: 1fr !important; }
          .about-division-grid { grid-template-columns: 1fr 1fr !important; }
          .about-supervisor-grid { grid-template-columns: 1fr 1fr !important; }
          .about-values-grid { grid-template-columns: 1fr 1fr !important; }
          .pipeline-flow { flex-direction: column !important; }
          .pipeline-arrow { transform: rotate(90deg) !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 100, background: 'var(--bg)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,88,158,0.08) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(89,163,146,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <Container>
          <ScrollReveal>
            <p className="sec-label" style={{ justifyContent: 'center' }}>About SocioFi Technology</p>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.6rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1.06 }}>
              Two Founders.<br />
              <span className="gradient-text">Ten AI Developers.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 620, marginInline: 'auto', marginBottom: 48 }}>
              SocioFi Technology is an AI-native software development company based in Dhaka, Bangladesh. We operate 10 AI development agents and 8 divisions — and we&apos;re radically transparent about all of it.
            </p>
            {/* Founding stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px 48px', flexWrap: 'wrap' }}>
              {[
                { value: 'Aug 1, 2024', label: 'Founded' },
                { value: '10', label: 'AI dev agents' },
                { value: '8', label: 'Divisions' },
                { value: 'Dhaka, BD', label: 'Headquarters' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <AboutSubNav active="/about" />

      {/* ── Origin Story ─────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start', maxWidth: 1100, marginInline: 'auto' }} className="about-hero-grid">
            <ScrollReveal>
              <p className="sec-label">The origin</p>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1.15 }}>
                Built to close the gap AI tools left open.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: 20 }}>
                In early 2024, Arifur Rahman had a product idea, a working prototype, and a deployment problem that no AI tool would fix. Agencies quoted $80,000. Freelancers disappeared. The AI code worked on localhost and broke in production.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Kamrul Hasan was watching the same problem from the other side — a BUET-trained engineer who had reviewed hundreds of AI-generated codebases. The code looked right. The security configurations had subtle flaws. The database queries worked under light load and became catastrophically slow at scale.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
                They founded SocioFi to be the team that bridges that gap — AI agents for the volume, engineers for the judgment.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Problem', text: 'AI coding tools build the code. Nobody builds the production system around it.' },
                  { label: 'The Gap', text: 'Deployment, security, scaling, debugging, maintenance — AI tools leave these to humans who don\'t have them.' },
                  { label: 'Our Answer', text: 'A hybrid team: 10 AI agents handle the volume, human engineers handle the judgment. Both, together, at a fixed price.' },
                ].map((item) => (
                  <div key={item.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{item.label}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── 8 Divisions ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="8 divisions" title="One Company, Eight Specialisations" subtitle="Every division is a distinct capability. Same standards, same team, different focus." centered className="mb-14" />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="about-division-grid">
            <StaggerChildren>
              {DIVISIONS.map((div) => (
                <StaggerItem key={div.slug}>
                  <a
                    href={div.slug ? `/${div.slug}` : '/'}
                    className="division-card"
                    style={{
                      display: 'block', textDecoration: 'none',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)', padding: '20px 22px',
                      ['--card-accent-color' as string]: div.accent,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: div.accent, marginBottom: 14 }} />
                    <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{div.name}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{div.desc}</p>
                  </a>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── The Founders ─────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Layer 1 — Human" title="The Founders" subtitle="Every decision, every output, every client relationship — they review it all." centered className="mb-12" />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 860, marginInline: 'auto' }} className="about-founder-cards">
            {[
              {
                name: 'Arifur Rahman',
                title: 'CEO & Co-founder',
                since: 'Aug 1, 2024',
                background: 'BUET graduate. Product strategist. The person who lived the problem SocioFi was built to solve.',
                focus: 'Client relationships, Studio pipeline, business development, and final approval on all external communications.',
                color: '#4A6CB8',
              },
              {
                name: 'Kamrul Hasan',
                title: 'CTO & Co-founder',
                since: 'Aug 1, 2024',
                background: 'BUET graduate. Production systems engineer. Built FabricxAI\'s 22-agent system and designed DevBridge OS.',
                focus: 'All technical architecture, agent system design, code reviews, DevBridge pipeline, and infrastructure decisions.',
                color: '#72C4B2',
              },
            ].map((f) => (
              <ScrollReveal key={f.name}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px 36px', height: '100%' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${f.color}20`, border: `1.5px solid ${f.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1rem', color: f.color }}>{f.name.charAt(0)}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{f.name}</h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: f.color, letterSpacing: '0.08em', margin: '0 0 20px' }}>{f.title.toUpperCase()} · SINCE {f.since.toUpperCase()}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: '0 0 16px' }}>{f.background}</p>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Responsibilities</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{f.focus}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Dev Agents ───────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Layer 2 — AI Developers"
              title="The DevBridge Development Team"
              subtitle="10 specialized agents. Each owns a specific phase of every software build. Coordinated by NEXUS, supervised by Kamrul."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          {/* Agent Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 64 }} className="about-agent-grid">
            <StaggerChildren>
              {DEV_AGENTS.map((agent) => (
                <StaggerItem key={agent.id}>
                  <div className="about-agent-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
                    {/* Top accent bar */}
                    <div className="agent-card-border" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: agent.color, opacity: 0, transition: 'opacity 0.3s' }} />
                    <AgentAvatar id={agent.id} color={agent.color} svgContent={agent.svg} />
                    <div style={{ marginTop: 16, marginBottom: 10 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: agent.color, border: `1px solid ${agent.color}50`, borderRadius: 'var(--radius-full)', padding: '2px 8px', letterSpacing: '0.06em', display: 'inline-block' }}>AI DEVELOPER</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 3px', letterSpacing: '-0.01em' }}>{agent.id}</h3>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>{agent.role}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>{agent.desc}</p>
                    {agent.step !== 'ALL' && (
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>PIPELINE STEP {agent.step}</span>
                      </div>
                    )}
                    {agent.step === 'ALL' && (
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: agent.color, letterSpacing: '0.06em' }}>ORCHESTRATES ALL STEPS</span>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Pipeline Flow Diagram */}
          <ScrollReveal>
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '36px 32px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>DevBridge Pipeline — every Studio project runs through these steps in order</p>
              <div className="pipeline-flow" style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'center', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
                {PIPELINE.map((step, i) => (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                    {step.parallel ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                        {['MIRROR', 'FORGE'].map((p) => {
                          const a = DEV_AGENTS.find(ag => ag.id === p)!;
                          return (
                            <div key={p} style={{ padding: '6px 12px', background: `${a.color}15`, border: `1px solid ${a.color}40`, borderRadius: 'var(--radius-full)', textAlign: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: a.color, letterSpacing: '0.06em', fontWeight: 600 }}>{p}</span>
                            </div>
                          );
                        })}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>parallel</span>
                      </div>
                    ) : (
                      <div style={{ padding: '8px 14px', background: `${step.color}15`, border: `1px solid ${step.color}40`, borderRadius: 'var(--radius-full)', textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: step.color, letterSpacing: '0.06em', fontWeight: 600, display: 'block' }}>{step.id}</span>
                      </div>
                    )}
                    {i < PIPELINE.length - 1 && (
                      <div className="pipeline-arrow" style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg viewBox="0 0 16 16" style={{ width: 14, height: 14, color: 'var(--text-muted)' }} fill="none">
                          <path d="M4 8 L12 8 M9 5 L12 8 L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--text-muted)', textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
                NEXUS orchestrates every step — routing work, managing dependencies, escalating to Kamrul when judgment is needed.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Supervisors Coming Soon ───────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Layer 3 — Human Supervisors (Coming)"
              title="One specialist per division."
              subtitle="Part-time engineers from SocioFi Guild who review agent output, catch edge cases, and provide domain expertise AI can't replicate."
              centered
              className="mb-12"
            />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="about-supervisor-grid">
            <StaggerChildren>
              {SUPERVISORS.map((sup) => (
                <StaggerItem key={sup.division}>
                  <div style={{
                    background: 'transparent',
                    border: `1px dashed ${sup.accent}40`,
                    borderRadius: 'var(--radius-md)',
                    padding: '22px 20px',
                    opacity: 0.75,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: sup.accent, opacity: 0.6 }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Coming</span>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{sup.division} Division</h4>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{sup.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
          <ScrollReveal delay={0.2}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-muted)', textAlign: 'center', marginTop: 32, maxWidth: 600, marginInline: 'auto' }}>
              Supervisors come from SocioFi Guild — a curated network of specialist engineers who know how to work alongside AI agents, not in spite of them.
              {' '}<a href="/careers" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Join the Guild →</a>
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Values Summary ───────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Our values" title="Six things we won't compromise on." centered className="mb-12" />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 860, marginInline: 'auto' }} className="about-values-grid">
            <StaggerChildren>
              {VALUES_SUMMARY.map((v) => (
                <StaggerItem key={v.num}>
                  <a href={v.href} className="value-card" style={{
                    display: 'block', textDecoration: 'none',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '20px 22px',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>{v.num}</span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--teal)', lineHeight: 1.35 }}>{v.title}</span>
                  </a>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
          <ScrollReveal delay={0.2}>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <a href="/about/values" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
                Read the stories behind each value →
              </a>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Timeline teaser ──────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 80, background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <Container>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <p className="sec-label">Company timeline</p>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                  From 2 founders to 45+ agents in 18 months.
                </h2>
              </div>
              <a
                href="/about/timeline"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--teal)',
                  border: '1px solid var(--teal)', borderRadius: 'var(--radius-full)',
                  padding: '10px 24px', textDecoration: 'none', letterSpacing: '0.06em',
                  flexShrink: 0, transition: 'all 0.2s',
                }}
              >
                View full timeline →
              </a>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <CTASection
        title="Ready to work with the team?"
        subtitle="Tell us what you're building. We'll tell you exactly how our agents would approach it, what it costs, and when it would ship."
        primaryCTA={{ label: 'Start a project', href: '/studio/start-project' }}
        ghostCTA={{ label: 'Meet the full team', href: '/about/team' }}
      />
    </>
  );
}
