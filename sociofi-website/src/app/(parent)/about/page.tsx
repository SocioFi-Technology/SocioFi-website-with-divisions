'use client';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';
import { LogoMark } from '@/components/shared/Logo';
import AboutSubNav from '@/components/about/AboutSubNav';
import type { DivisionSlug } from '@/lib/divisions';

// ── Agent avatar SVGs ─────────────────────────────────────────────────────────

const AGENT_AVATARS: Record<string, { svg: string; color: string }> = {
  NEXUS: {
    color: '#4A6CB8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,8 56,20 56,44 32,56 8,44 8,20" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.8"/>
      <line x1="32" y1="27" x2="32" y2="14" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="36.5" y1="29.4" x2="47" y2="23" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="36.5" y1="34.6" x2="47" y2="41" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="32" y1="37" x2="32" y2="50" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="27.5" y1="34.6" x2="17" y2="41" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="27.5" y1="29.4" x2="17" y2="23" stroke="currentColor" stroke-width="1" opacity="0.6"/>
    </svg>`,
  },
  INTAKE: {
    color: '#72C4B2',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16 L32 16 L52 16" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <path d="M16 24 L32 24 L48 24" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
      <path d="M20 32 L32 32 L44 32" stroke="currentColor" stroke-width="1.5" opacity="0.8"/>
      <path d="M24 40 L32 40 L40 40" stroke="currentColor" stroke-width="1.5"/>
      <path d="M28 48 L32 48 L36 48" stroke="currentColor" stroke-width="1.5" opacity="0.8"/>
      <circle cx="32" cy="52" r="3" fill="currentColor"/>
    </svg>`,
  },
  SCRIBE: {
    color: '#7B6FE8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 42 L30 22 L38 42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 50 Q30 42 40 50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="14" y1="32" x2="22" y2="32" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="14" y1="36" x2="20" y2="36" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="42" y1="32" x2="50" y2="32" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="44" y1="36" x2="50" y2="36" stroke="currentColor" stroke-width="1" opacity="0.5"/>
    </svg>`,
  },
  HERALD: {
    color: '#4DBFA8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="5" fill="currentColor"/>
      <circle cx="32" cy="32" r="11" stroke="currentColor" stroke-width="1" opacity="0.7" fill="none"/>
      <circle cx="32" cy="32" r="18" stroke="currentColor" stroke-width="1" opacity="0.4" fill="none"/>
      <circle cx="32" cy="32" r="25" stroke="currentColor" stroke-width="1" opacity="0.2" fill="none"/>
    </svg>`,
  },
  COMPASS: {
    color: '#72C4B2',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M32 12 L35 26 L32 22 L29 26 Z" fill="currentColor"/>
      <path d="M32 52 L29 38 L32 42 L35 38 Z" fill="currentColor" opacity="0.5"/>
      <path d="M12 32 L26 29 L22 32 L26 35 Z" fill="currentColor" opacity="0.5"/>
      <path d="M52 32 L38 35 L42 32 L38 29 Z" fill="currentColor" opacity="0.5"/>
      <circle cx="32" cy="32" r="3" fill="currentColor"/>
    </svg>`,
  },
  SENTINEL: {
    color: '#4DBFA8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10 L50 18 L50 34 C50 44 42 52 32 54 C22 52 14 44 14 34 L14 18 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M18 36 Q22 28 26 32 Q30 36 34 28 Q38 20 42 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  CHRONICLE: {
    color: '#72C4B2',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="44" width="8" height="8" fill="currentColor" opacity="0.5"/>
      <rect x="24" y="36" width="8" height="16" fill="currentColor" opacity="0.7"/>
      <rect x="36" y="26" width="8" height="26" fill="currentColor" opacity="0.9"/>
      <rect x="48" y="16" width="8" height="36" fill="currentColor"/>
      <path d="M14 40 Q22 32 30 26 Q38 20 52 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    </svg>`,
  },
  MENTOR: {
    color: '#E8B84D',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 42 Q10 32 20 28 L32 24 L44 28 Q54 32 54 42 L54 46 Q32 52 10 46 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="32" y1="24" x2="32" y2="14" stroke="currentColor" stroke-width="1.5"/>
      <path d="M32 14 Q24 10 20 14" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
      <path d="M32 14 Q40 10 44 14" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
      <path d="M32 8 Q26 4 22 8" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <path d="M32 8 Q38 4 42 8" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
    </svg>`,
  },
  CURATOR: {
    color: '#7B6FE8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="12" width="28" height="36" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="22" y1="22" x2="38" y2="22" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
      <line x1="22" y1="28" x2="38" y2="28" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>
      <line x1="22" y1="34" x2="32" y2="34" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
      <rect x="28" y="36" width="20" height="16" rx="3" fill="var(--bg-card)" stroke="currentColor" stroke-width="1.5"/>
      <line x1="32" y1="42" x2="44" y2="42" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
      <line x1="32" y1="46" x2="42" y2="46" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
    </svg>`,
  },
  WARDEN: {
    color: '#4DBFA8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="18" width="32" height="20" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="16" y1="26" x2="40" y2="26" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="16" y1="30" x2="36" y2="30" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <path d="M44 22 L52 30 L44 38" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="44" cy="46" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="44" cy="46" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="52" cy="46" r="3" fill="currentColor" opacity="0.6"/>
      <circle cx="52" cy="46" r="1.5" fill="currentColor"/>
    </svg>`,
  },
  BRIDGE: {
    color: '#6BA3E8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="32" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="48" cy="32" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M24 32 L40 32" stroke="currentColor" stroke-width="1.5"/>
      <path d="M35 28 L40 32 L35 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
  ORACLE: {
    color: '#4A6CB8',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="32" rx="18" ry="12" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="32" cy="32" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="32" cy="32" r="2" fill="currentColor"/>
      <line x1="14" y1="24" x2="22" y2="28" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="14" y1="40" x2="22" y2="36" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="50" y1="24" x2="42" y2="28" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="50" y1="40" x2="42" y2="36" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    </svg>`,
  },
  PULSE: {
    color: '#E8916F',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M10 32 L20 32 L24 20 L28 44 L32 26 L36 38 L40 32 L54 32" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  },
};

const AGENTS = [
  { id: 'NEXUS', title: 'Operations Director', desc: 'Coordinates the entire team. Routes tasks. Manages priorities.', divisions: ['All'] },
  { id: 'INTAKE', title: 'Lead Analyst', desc: 'Reads every inquiry. Scores and classifies. Makes sure the right person responds within hours.', divisions: ['All'] },
  { id: 'HERALD', title: 'Communications Lead', desc: 'Manages all email communication. Drafts responses, schedules follow-ups. Every email approved by a founder before it reaches you.', divisions: ['All'] },
  { id: 'SCRIBE', title: 'Content Writer', desc: 'Researches topics, writes articles, maintains the blog. Everything published goes through human review.', divisions: ['Labs', 'Academy'] },
  { id: 'SENTINEL', title: 'Systems Monitor', desc: 'Watches your software 24/7. Detects issues before they become problems. Never sleeps.', divisions: ['Services', 'Cloud'] },
  { id: 'COMPASS', title: 'Pipeline Manager', desc: 'Watches every lead\'s journey. Flags when someone needs attention. Recommends next steps.', divisions: ['Studio', 'Services', 'Cloud'] },
  { id: 'WARDEN', title: 'Support Triage', desc: 'Reads every support ticket. Classifies urgency. Routes to the right engineer.', divisions: ['Services'] },
  { id: 'CHRONICLE', title: 'Analytics Lead', desc: 'Generates daily reports, tracks metrics, identifies trends. The team\'s memory.', divisions: ['All'] },
  { id: 'ORACLE', title: 'Strategy Analyst', desc: 'Forecasts revenue. Detects churn risk. Scores pipeline health. Sees patterns humans miss.', divisions: ['All'] },
  { id: 'MENTOR', title: 'Course Designer', desc: 'Creates educational content. Designs syllabi. Writes lessons. All content reviewed by humans before publishing.', divisions: ['Academy'] },
  { id: 'CURATOR', title: 'Newsletter Editor', desc: 'Curates the best content each month. Writes the editorial. Prepares the newsletter.', divisions: ['All'] },
  { id: 'BRIDGE', title: 'Partnership Advisor', desc: 'Identifies when a client needs more than one division. Creates cross-referrals. Connects the dots.', divisions: ['All'] },
  { id: 'PULSE', title: 'System Health', desc: 'Monitors the AI team itself. Makes sure every agent is running correctly. The agent that watches the agents.', divisions: ['Internal'] },
];

const SUPERVISORS = [
  { division: 'Studio', color: '#72C4B2', desc: 'Review all AI-generated code, architecture decisions, and client deliverables.' },
  { division: 'Agents', color: '#8B5CF6', desc: 'Monitor deployed agents, review accuracy, handle edge cases in production.' },
  { division: 'Services', color: '#4DBFA8', desc: 'Verify bug fixes, review security patches, validate performance changes.' },
  { division: 'Cloud', color: '#5BB5E0', desc: 'Verify deployment configs, review scaling decisions, security audit.' },
  { division: 'Academy', color: '#E8B84D', desc: 'Review course content for accuracy, test assessments, moderate community.' },
  { division: 'Labs', color: '#7B6FE8', desc: 'Validate experiment results, review publications, maintain methodology.' },
  { division: 'Products', color: '#E8916F', desc: 'Monitor production platforms (FabricxAI, NEXARA, DevBridge).' },
  { division: 'Ventures', color: '#6BA3E8', desc: 'Review application evaluations, validate term sheet recommendations.' },
];

const DIVISIONS: { name: string; slug: DivisionSlug; accent: string; desc: string; url: string }[] = [
  { name: 'Studio', slug: 'studio', accent: '#72C4B2', desc: 'Custom software development', url: '/studio' },
  { name: 'Services', slug: 'services', accent: '#4DBFA8', desc: 'Maintenance & monitoring', url: '/services' },
  { name: 'Labs', slug: 'labs', accent: '#7B6FE8', desc: 'Research & open source', url: '/labs' },
  { name: 'Products', slug: 'products', accent: '#E8916F', desc: 'Own platforms & tools', url: '/products' },
  { name: 'Academy', slug: 'academy', accent: '#E8B84D', desc: 'Courses & education', url: '/academy' },
  { name: 'Ventures', slug: 'ventures', accent: '#6BA3E8', desc: 'Equity co-builds', url: '/ventures' },
  { name: 'Cloud', slug: 'cloud', accent: '#5BB5E0', desc: 'Managed infrastructure', url: '/cloud' },
  { name: 'Agents', slug: 'agents' as DivisionSlug, accent: '#8B5CF6', desc: 'AI agent subscriptions', url: '/aaas' },
];

const TIMELINE_EVENTS = [
  { date: 'Aug 2024', title: 'SocioFi Technology founded', desc: 'Arifur Rahman and Kamrul Hasan launch from Dhaka, Bangladesh.', badge: 'MILESTONE' },
  { date: 'Sep 2024', title: 'FabricxAI development begins', desc: 'Our first multi-agent system — proving AI agents work in production.' },
  { date: 'Oct 2024', title: 'First 5 agents deployed', desc: 'Quality control agents running in garment factories.' },
  { date: 'Dec 2024', title: 'Component library v2 (AI-optimized)', desc: 'Restructured how AI agents generate code. Errors dropped 70%.', badge: 'LABS' },
  { date: 'Jan 2025', title: 'FabricxAI reaches 22 agents', desc: 'Full manufacturing intelligence platform live in production.', badge: 'MILESTONE' },
  { date: 'Mar 2025', title: 'NEXUS ARIA development begins', desc: '13-agent GTM operations system for enterprise data analysis.' },
  { date: 'Jun 2025', title: 'DevBridge OS goes internal', desc: 'Our 10-agent development pipeline powers every Studio project.' },
  { date: 'Sep 2025', title: 'AI pair programming study completed', desc: '4.2x feature output. Labs publishes results.', badge: 'LABS' },
  { date: 'Dec 2025', title: 'NEXUS admin agent system launched', desc: '13 AI agents now run SocioFi\'s own operations.', badge: 'MILESTONE' },
  { date: 'Mar 2026', title: 'SocioFi website launches with 8 divisions', desc: 'Studio, Agents, Services, Cloud, Labs, Products, Academy, Ventures.' },
  { date: 'Now', title: 'Building the team', desc: 'Hiring human division supervisors. Growing the agent catalog. Accepting Ventures applications.', badge: 'NOW' },
];

const VALUES = [
  { title: '"We say what things cost."', body: 'Real numbers on the website. No "contact sales." No surprise change orders.' },
  { title: '"We explain in plain English."', body: 'Every update written for business people, not developers. No jargon, no mystery.' },
  { title: '"We build things that work."', body: 'Production systems, not demos. Every line reviewed by a human engineer.' },
  { title: '"Your code is yours."', body: '100% ownership. No lock-in. Leave anytime with everything. Full IP transfer.' },
  { title: '"We tell you when AI isn\'t the answer."', body: 'Honest about limitations. We\'d rather lose a deal than promise the wrong thing.' },
  { title: '"We stay."', body: 'Same team builds and maintains. No handoff. No starting over six months later.' },
];

// ── Agent Avatar Component ────────────────────────────────────────────────────

function AgentAvatar({ agentId, size = 64 }: { agentId: string; size?: number }) {
  const agent = AGENT_AVATARS[agentId];
  if (!agent) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${agent.color}18`,
      border: `2px solid ${agent.color}50`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: agent.color, flexShrink: 0,
      animation: 'agentPulse 4s ease-in-out infinite',
    }}>
      <div
        style={{ width: size * 0.55, height: size * 0.55 }}
        dangerouslySetInnerHTML={{ __html: agent.svg }}
      />
    </div>
  );
}

// ── Subpage nav ───────────────────────────────────────────────────────────────


// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <style>{`
        @keyframes agentPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.025); opacity: 0.85; }
        }
        @keyframes nowPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .agent-card:hover { transform: translateY(-3px); border-color: var(--border-hover) !important; }
        .agent-card:hover .agent-avatar { animation-duration: 1s !important; }
        .value-card:hover { transform: translateY(-4px); border-color: var(--teal) !important; }
        .division-node:hover { transform: scale(1.05); }
        .supervisor-card { opacity: 0.7; }
        .supervisor-card:hover { opacity: 0.9; }

        /* ── About page mobile ── */
        @media (max-width: 640px) {
          .about-founder-cards {
            grid-template-columns: 1fr !important;
          }
          .about-founder-card-inner {
            padding: 28px 24px !important;
          }
          .about-founder-avatar-circle {
            width: 56px !important; height: 56px !important;
            font-size: 1rem !important;
          }
          .about-stats-row {
            gap: 20px 28px !important;
          }
          .about-metrics-row {
            gap: 20px 28px !important;
          }
          .about-agent-grid {
            grid-template-columns: 1fr !important;
          }
          .about-division-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .about-supervisor-grid {
            grid-template-columns: 1fr !important;
          }
          .about-values-grid {
            grid-template-columns: 1fr !important;
          }
          .about-timeline-inner {
            max-width: 100% !important;
          }
          .about-flow-steps {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @media (max-width: 768px) {
          .about-hero { padding-top: 120px !important; padding-bottom: 64px !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="about-hero" style={{
        paddingTop: 160, paddingBottom: 100,
        background: 'var(--bg)',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,88,158,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '30%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(89,163,146,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <Container>
          <p className="sec-label" style={{ justifyContent: 'center' }}>About SocioFi</p>

          <h1 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.06,
            color: 'var(--text-primary)',
            marginBottom: 28,
            maxWidth: 800,
            marginInline: 'auto',
          }}>
            Two Founders. Thirteen AI Agents.{' '}
            <span className="gradient-text">One Mission.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            lineHeight: 1.85,
            color: 'var(--text-secondary)',
            maxWidth: 620,
            marginInline: 'auto',
            marginBottom: 48,
          }}>
            SocioFi Technology was founded on August 1, 2024, to solve a problem that shouldn&apos;t exist:
            great software shouldn&apos;t require a Fortune 500 budget or a computer science degree to get built.
            We&apos;re a small, AI-native company — and that&apos;s by design.
          </p>

          {/* Founding stats */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px 48px',
          }}>
            {[
              { value: 'Aug 1, 2024', label: 'Founded' },
              { value: 'Dhaka, Bangladesh', label: 'Based in' },
              { value: '2 humans + 13 AI agents', label: 'Team' },
              { value: '45+', label: 'Agents deployed' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop: 4,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <AboutSubNav active="/about" />

      {/* ── The Origin ───────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <div style={{ maxWidth: 720, marginInline: 'auto' }}>
              <p className="sec-label">How It Started</p>
              <h2 style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: 32,
              }}>
                We Built SocioFi Because This Problem Shouldn&apos;t Exist.
              </h2>

              <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: 20 }}>
                  In early 2024, Arifur Rahman had ideas he couldn&apos;t build. Not because the ideas were bad — because the development industry was broken. Agencies quoted $50K–$200K and timelines measured in quarters. Freelancers started strong and vanished. AI coding tools got him 70% there — but deployment, databases, security, and the hundred things that make software actually work in production? That was a wall he couldn&apos;t climb alone.
                </p>
                <p style={{ marginBottom: 20 }}>
                  He wasn&apos;t alone. Every founder he talked to had the same story. Every small business owner who needed custom software hit the same wall. Smart people. Validated ideas. Stuck at the gap between &ldquo;AI can build this&rdquo; and &ldquo;this actually runs in production.&rdquo;
                </p>
                <p style={{ marginBottom: 40 }}>
                  Kamrul Hasan saw the same problem from the engineering side. As a BUET-trained computer scientist, he watched AI tools generate impressive code that fell apart in production. On August 1, 2024, they launched SocioFi Technology. Not as another agency. Not as an AI tool. As the team that bridges the gap.
                </p>
              </div>

              {/* Pull quote */}
              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 36px',
                backdropFilter: 'blur(12px)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  lineHeight: 1.75,
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                }}>
                  &ldquo;We didn&apos;t start by pitching clients. We started by building FabricxAI — a 22-agent manufacturing platform. We needed to prove to ourselves that multi-agent AI systems work in production. Not in a demo. In a factory.&rdquo;
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: 0 }}>
                  — KAMRUL HASAN, CTO
                </p>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── 8 Divisions ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Today"
              title="8 Divisions. 45+ Agents. Real Products in Production."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div className="about-division-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
            <StaggerChildren>
            {DIVISIONS.map((div) => (
              <StaggerItem key={div.slug}>
                <a
                  href={div.url}
                  className="division-node"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '20px 24px',
                    background: 'var(--bg-card)',
                    border: `1px solid ${div.accent}30`,
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    transition: 'all 0.3s var(--ease)',
                  }}
                >
                  <LogoMark division={div.slug} size="sm" />
                  <div>
                    <div style={{ fontFamily: 'var(--font-headline)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{div.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{div.desc}</div>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>

          {/* Metrics */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px 48px' }}>
            {[
              { value: '45+', label: 'production agents' },
              { value: '3', label: 'live platforms' },
              { value: '8', label: 'specialized divisions' },
              { value: 'Global', label: 'serving clients from Dhaka' },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 700, color: 'var(--teal)', letterSpacing: '-0.03em' }}>{m.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* CEO quote */}
          <div style={{ maxWidth: 640, marginInline: 'auto', marginTop: 48, textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 12 }}>
              &ldquo;We structured SocioFi as eight divisions because accountability requires specialization. When the team that builds your software also hosts it and maintains it, nobody can point fingers. If something breaks, it&apos;s on us.&rdquo;
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: 0 }}>— ARIFUR RAHMAN, CEO</p>
          </div>
        </Container>
      </section>

      {/* ── The Team ─────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="The Team"
              title="2 Founders. 13 AI Agents. Future Human Supervisors."
              subtitle="We don't pretend to be a 50-person agency. We're a small, AI-native company where AI agents do the operational work and human founders make the decisions."
              centered
              className="mb-16"
            />
          </ScrollReveal>

          {/* Sub A: Founders */}
          <ScrollReveal>
            <p className="sec-label" style={{ marginBottom: 24 }}>The Founders — Human</p>
          </ScrollReveal>

          <div className="about-founder-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 80 }}>
            {/* Arifur */}
            <ScrollReveal direction="right">
              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 40px',
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.4rem', color: 'white', flexShrink: 0,
                  }}>AR</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--teal)', border: '1px solid var(--teal)', borderRadius: 'var(--radius-full)', padding: '2px 8px', letterSpacing: '0.06em' }}>HUMAN</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Arifur Rahman</h3>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: '4px 0 0' }}>CEO & CO-FOUNDER</p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  The non-technical founder who built SocioFi because he lived the problem it solves. Handles business strategy, client relationships, pricing, and company vision across all eight divisions.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--teal)', lineHeight: 1.6, marginBottom: 20 }}>
                  &ldquo;I built SocioFi for the version of me that existed two years ago — a founder with a great idea and no way to get it built without going broke or getting burned.&rdquo;
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['BUET', 'Dhaka, Bangladesh', 'Since Aug 1, 2024'].map((tag) => (
                    <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '3px 10px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Kamrul */}
            <ScrollReveal direction="left">
              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 40px',
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7B6FE8 0%, #4A6CB8 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.4rem', color: 'white', flexShrink: 0,
                  }}>KH</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--teal)', border: '1px solid var(--teal)', borderRadius: 'var(--radius-full)', padding: '2px 8px', letterSpacing: '0.06em' }}>HUMAN</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>Kamrul Hasan</h3>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: '4px 0 0' }}>CTO & CO-FOUNDER</p>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  BUET Computer Science graduate who built every technical system SocioFi runs on — FabricxAI, NEXUS ARIA, DevBridge, and the 13-agent NEXUS operations system. Handles architecture, AI development, and engineering standards.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--teal)', lineHeight: 1.6, marginBottom: 20 }}>
                  &ldquo;The most dangerous thing in our industry is a company that tells clients AI can do everything. It can&apos;t. Knowing the boundaries is what makes us good at this.&rdquo;
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['BUET CS', 'Dhaka, Bangladesh', 'Since Aug 1, 2024'].map((tag) => (
                    <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '3px 10px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sub B: AI Agents */}
          <ScrollReveal>
            <p className="sec-label" style={{ marginBottom: 8 }}>The AI Agent Team — Running 24/7</p>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Meet the Team That Never Sleeps.
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 680, marginBottom: 12 }}>
              13 AI agents — each with a specific job, running 24/7, coordinated by the NEXUS orchestrator. Every agent&apos;s output is reviewed by a founder before it reaches a client.
            </p>
          </ScrollReveal>

          {/* CTO quote */}
          <ScrollReveal>
            <div style={{ maxWidth: 680, marginBottom: 40, paddingLeft: 20, borderLeft: '2px solid var(--teal)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 8 }}>
                &ldquo;People ask &apos;how does a 2-person company serve multiple clients?&apos; This is how. Thirteen specialized agents handle the operational load that would normally require a team of 20.&rdquo;
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: 0 }}>— KAMRUL HASAN, CTO</p>
            </div>
          </ScrollReveal>

          {/* Agent grid */}
          <div className="about-agent-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
            <StaggerChildren>
            {AGENTS.map((agent) => {
              const avatarColor = AGENT_AVATARS[agent.id]?.color || '#72C4B2';
              return (
                <StaggerItem key={agent.id}>
                  <a
                    href={`/about/team#${agent.id.toLowerCase()}`}
                    className="agent-card"
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 12,
                      padding: '24px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'all 0.3s var(--ease)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="agent-avatar">
                        <AgentAvatar agentId={agent.id} size={52} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: avatarColor, border: `1px solid ${avatarColor}60`, borderRadius: 'var(--radius-full)', padding: '1px 7px', letterSpacing: '0.06em' }}>AI AGENT</span>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'nowPulse 2s ease-in-out infinite', display: 'inline-block' }} />
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0 }}>{agent.id}</h4>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: avatarColor, letterSpacing: '0.05em', margin: '2px 0 0', textTransform: 'uppercase' }}>{agent.title}</p>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>{agent.desc}</p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {agent.divisions.map((d) => (
                        <span key={d} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '1px 7px' }}>{d}</span>
                      ))}
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
          </div>

          {/* How human + AI works together */}
          <ScrollReveal>
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
              marginBottom: 80,
            }}>
              <p className="sec-label" style={{ marginBottom: 16 }}>How It Works</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                {[
                  'AI Agent does the work',
                  '→',
                  'Creates draft / recommendation',
                  '→',
                  'Human founder reviews',
                  '→',
                  'Approves, edits, or rejects',
                  '→',
                  'Action executes',
                ].map((step, i) => (
                  <span key={i} style={{
                    fontFamily: step === '→' ? 'var(--font-body)' : 'var(--font-mono)',
                    fontSize: step === '→' ? '1.2rem' : '0.72rem',
                    color: step === '→' ? 'var(--text-muted)' : 'var(--text-primary)',
                    background: step === '→' ? 'transparent' : 'var(--bg-3)',
                    border: step === '→' ? 'none' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: step === '→' ? '0' : '5px 14px',
                    letterSpacing: step === '→' ? 0 : '0.04em',
                  }}>{step}</span>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 680, margin: 0 }}>
                Every email you receive from SocioFi was drafted by an AI agent and approved by a founder. Every blog post was written by SCRIBE and edited by a human. Every lead classification was done by INTAKE and verified by the team. AI handles the volume. Humans handle the judgment.
              </p>
            </div>
          </ScrollReveal>

          {/* Sub C: Human Supervisors */}
          <ScrollReveal>
            <p className="sec-label" style={{ marginBottom: 8 }}>Coming Soon</p>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Next: Human Supervisors for Every Division.
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 680, marginBottom: 32 }}>
              We&apos;re building the next layer of the team — part-time human specialists who supervise AI agent output in their area of expertise.
            </p>
          </ScrollReveal>

          <div className="about-supervisor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 32 }}>
            <StaggerChildren>
            {SUPERVISORS.map((s) => (
              <StaggerItem key={s.division}>
                <div
                  className="supervisor-card"
                  style={{
                    padding: '20px 22px',
                    border: `1px dashed ${s.color}40`,
                    borderRadius: 'var(--radius-md)',
                    background: `${s.color}05`,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, opacity: 0.6 }} />
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{s.division} Supervisor</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#E8B84D', border: '1px solid #E8B84D60', borderRadius: 'var(--radius-full)', padding: '1px 7px', marginLeft: 'auto' }}>COMING SOON</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>

          <ScrollReveal>
            <a
              href="/careers"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--teal)',
                textDecoration: 'none', borderBottom: '1px solid var(--teal)',
                paddingBottom: 2,
              }}
            >
              Interested in a supervisor role? See open roles
            </a>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Company Timeline ──────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Our Journey"
              title="From Idea to 45+ Production Agents in 18 Months."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{ maxWidth: 680, marginInline: 'auto', position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 20, top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(180deg, var(--navy) 0%, var(--teal) 100%)',
              opacity: 0.4,
            }} />

            {TIMELINE_EVENTS.map((event, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div style={{ display: 'flex', gap: 24, paddingBottom: 36, position: 'relative' }}>
                  {/* Dot */}
                  <div style={{
                    width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 4,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: event.badge === 'NOW' ? '#22c55e' : event.badge === 'MILESTONE' ? 'var(--teal)' : 'var(--bg-3)',
                      border: '2px solid var(--teal)',
                      zIndex: 1,
                      animation: event.badge === 'NOW' ? 'nowPulse 2s ease-in-out infinite' : 'none',
                    }} />
                  </div>
                  <div style={{ flex: 1, paddingTop: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{event.date}</span>
                      {event.badge && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                          color: event.badge === 'NOW' ? '#22c55e' : event.badge === 'MILESTONE' ? 'var(--teal)' : 'var(--text-muted)',
                          border: `1px solid ${event.badge === 'NOW' ? '#22c55e' : event.badge === 'MILESTONE' ? 'var(--teal)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-full)', padding: '1px 7px', letterSpacing: '0.06em',
                        }}>{event.badge}</span>
                      )}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>{event.title}</h4>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>{event.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/about/timeline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.08em', textDecoration: 'none', borderBottom: '1px solid var(--teal)', paddingBottom: 2 }}>
              VIEW FULL TIMELINE
            </a>
          </div>
        </Container>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Our Values"
              title='Six Things We Won&apos;t Compromise On.'
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div className="about-values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <StaggerChildren>
            {VALUES.map((val, i) => (
              <StaggerItem key={i}>
                <div
                  className="value-card"
                  style={{
                    padding: '28px 28px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.3s var(--ease)',
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1rem', color: 'var(--teal)', marginBottom: 10 }}>{val.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{val.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/about/values" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.08em', textDecoration: 'none', borderBottom: '1px solid var(--teal)', paddingBottom: 2 }}>
              READ THE FULL VALUES
            </a>
          </div>
        </Container>
      </section>

      {/* ── Why Dhaka ────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <div style={{ maxWidth: 720, marginInline: 'auto' }}>
            <ScrollReveal>
              <p className="sec-label">Based in Dhaka, Serving Globally</p>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 24 }}>
                Dhaka-Based. World-Ready.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: 20 }}>
                SocioFi is based in Dhaka, Bangladesh. Our founders graduated from BUET — the Bangladesh University of Engineering and Technology, one of the most competitive technical universities in South Asia.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--text-secondary)', margin: 0 }}>
                We serve clients globally. Time zones work in our favor — we often work while our clients sleep, delivering progress overnight. Our location means operational costs are lower than Silicon Valley, which is why we offer Studio quality at a fraction of the typical price. We&apos;re not a low-cost outsourcing shop. We&apos;re a technology company based in one of the fastest-growing tech ecosystems in the world.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CTASection
        title="Want to Work With Us? Or For Us?"
        subtitle="Three paths forward — choose yours."
        primaryCTA={{ label: 'Build software', href: '/studio/start-project' }}
        ghostCTA={{ label: 'Join the team', href: '/careers' }}
        note="Or just talk: /contact"
      />
    </>
  );
}
