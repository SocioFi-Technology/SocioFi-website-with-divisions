'use client';

import Container from '@/components/shared/Container';
import AboutSubNav from '@/components/about/AboutSubNav';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';
import { useState } from 'react';

// ── 10 DevBridge Development Agents — Full Profiles ───────────────────────────

const DEV_AGENTS = [
  {
    id: 'SCOUT',
    role: 'Requirements Analyst',
    step: '01',
    color: '#72C4B2',
    tagline: 'Turns vague briefs into airtight specifications.',
    howItWorks: 'Reads the client\'s project brief, interview notes, or initial description. Extracts functional requirements, technical constraints, edge cases, and success criteria. Outputs a structured specification document that every downstream agent relies on.',
    cantDo: 'Clarify genuinely ambiguous requirements without human input. If a brief is vague on a critical point, SCOUT flags it for founder review rather than guessing — a wrong assumption at step 1 costs the entire pipeline.',
    whoReviews: 'Kamrul Hasan (CTO) reviews all SCOUT specifications before the pipeline proceeds. Arifur reviews anything touching client-facing features.',
    sampleOutput: 'Structured spec with 24 requirements across 6 feature categories. 3 flagged ambiguities sent for human clarification. 2 out-of-scope items identified and noted separately.',
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
    tagline: 'Finds what already works so we don\'t rebuild from scratch.',
    howItWorks: 'Takes SCOUT\'s structured spec and researches proven technical approaches. Identifies relevant libraries, existing patterns, reference implementations, known failure modes in similar projects, and compatibility constraints. Outputs a research brief with ranked stack recommendations.',
    cantDo: 'Evaluate whether an approach is right for a specific client\'s business context. HUNTER knows patterns — Kamrul knows which patterns match which situations.',
    whoReviews: 'Kamrul Hasan reviews all stack and library recommendations before they\'re committed to the project.',
    sampleOutput: 'Stack recommendation: Next.js + Supabase + Stripe. 4 alternative approaches evaluated with trade-offs. 2 known pitfalls documented with specific mitigations. 1 library conflict flagged.',
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
    tagline: 'Blueprints the entire system before a line of code is written.',
    howItWorks: 'Takes SCOUT\'s requirements and HUNTER\'s research to design the full technical architecture. Creates component hierarchy, database schema, API contracts, data flow diagrams, and integration maps. Everything that follows is built from ATLAS\'s blueprint.',
    cantDo: 'Make architecture trade-off decisions that depend on business priorities — such as choosing between a more scalable but complex architecture vs. a simpler one that ships faster. These calls go to Kamrul.',
    whoReviews: 'Kamrul Hasan reviews every architecture decision. No code is generated until the architecture is approved.',
    sampleOutput: '18-table database schema. 34 API endpoints documented with request/response contracts. 3 architectural alternatives compared for the real-time sync component. Data flow diagrams for 6 key user journeys.',
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
    tagline: 'Builds the entire frontend from ATLAS\'s blueprint.',
    howItWorks: 'Runs in parallel with FORGE. Generates complete frontend from ATLAS\'s architecture and HUNTER\'s stack: pages, components, forms, dashboards, responsive layouts, and design system implementation. Outputs production-grade frontend code.',
    cantDo: 'Make aesthetic judgment calls beyond the technical brief. MIRROR implements what\'s specified — ambiguous design decisions that require client taste or business judgment are flagged for Arifur to resolve.',
    whoReviews: 'Arifur Rahman reviews all frontend outputs for quality and alignment with client expectations before HAMMER integrates them.',
    sampleOutput: '14 pages generated. 48 components. Full responsive implementation for mobile, tablet, and desktop. 2 design ambiguities flagged for client review. Design system tokens applied consistently.',
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
    tagline: 'Builds the entire backend in parallel with MIRROR.',
    howItWorks: 'Runs in parallel with MIRROR. Generates all server-side code from ATLAS\'s API contracts: REST and GraphQL endpoints, business logic layers, database operations, authentication systems, background jobs, webhooks, and server-side validation. Outputs production-grade backend code.',
    cantDo: 'Handle novel security edge cases not covered by established patterns. This is intentional — SENTINEL exists specifically to catch the security problems FORGE might not anticipate.',
    whoReviews: 'Kamrul Hasan reviews all backend outputs before HAMMER begins integration.',
    sampleOutput: '34 API routes. Authentication system with session management. 6 background jobs. Database migrations for all 18 tables. 3 webhook handlers. Input validation on all endpoints.',
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
    tagline: 'Assembles MIRROR and FORGE into one working application.',
    howItWorks: 'Takes the frontend from MIRROR and backend from FORGE and assembles the complete, integrated application. Wires all API connections, resolves interface conflicts, handles environment configuration, establishes end-to-end data flows, and runs integration smoke tests.',
    cantDo: 'Debug complex race conditions, performance bottlenecks under load, or environment-specific issues that require deep systems knowledge. HAMMER flags these for Kamrul with full context.',
    whoReviews: 'Kamrul Hasan reviews integration outputs and the integration smoke test results before SENTINEL begins review.',
    sampleOutput: 'Full-stack integration complete. 3 frontend/backend interface conflicts identified and resolved. 2 performance issues flagged with reproduction steps. End-to-end smoke tests passing for all 14 core user flows.',
    svg: `<rect x="10" y="24" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="34" y="24" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M28 27 L36 31 L28 35" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
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
    tagline: 'The agent that reviews everything everyone else built.',
    howItWorks: 'Performs a comprehensive review of the complete integrated codebase. Checks for security vulnerabilities (injection, auth flaws, data exposure, rate limiting), architectural problems, logic errors, code quality issues, and deviations from ATLAS\'s architecture. SENTINEL does not write code — it reviews it.',
    cantDo: 'Verify that business logic is correct without understanding the client\'s domain. Domain-specific logic review requires human expertise. SENTINEL catches technical problems; Kamrul reviews domain accuracy.',
    whoReviews: 'Kamrul Hasan reviews every SENTINEL finding report. High-severity issues must be resolved before SHIELD proceeds. No deployment exceptions.',
    sampleOutput: '2 high-severity issues: SQL injection risk in search query construction, missing rate limiting on authentication endpoint. 6 medium-severity issues. 4 low-severity style inconsistencies. All high-severity issues resolved before handoff to SHIELD.',
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
    tagline: 'Tests thoroughly, deploys carefully, verifies completely.',
    howItWorks: 'Writes comprehensive test suites: unit tests, integration tests, end-to-end tests, and edge case scenarios. Runs the full suite and reports results. Then manages staging deployment, runs post-deployment health checks, and verifies production readiness before the final go-live.',
    cantDo: 'Test user experience quality, subjective usability, or whether the product serves the client\'s business objectives. SHIELD validates that the code does what it\'s supposed to do — it can\'t validate that it does what the client actually needs.',
    whoReviews: 'Both Kamrul and Arifur review the pre-deployment report. Production go-live requires explicit founder approval.',
    sampleOutput: '247 automated tests written and passing. 94% code coverage. Staging deployment verified with 12 post-deployment checks. Zero critical health check failures. Production deployment ready for approval.',
    svg: `<path d="M18 28 L26 38 L46 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 34 L30 44 L50 24" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
      <path d="M26 40 L34 50 L54 30" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>`,
  },
  {
    id: 'BEACON',
    role: 'Documentation Writer',
    step: '08',
    color: '#6BA3E8',
    tagline: 'Makes sure the work outlasts the project.',
    howItWorks: 'Generates comprehensive documentation across the entire codebase: README, API endpoint documentation with examples, architecture decision records, database schema documentation, deployment runbooks, environment setup guides, and client-facing handoff documents in plain English.',
    cantDo: 'Write contextual documentation explaining why business decisions were made, or provide strategic guidance on how to grow the product. Those require human judgment and are authored by the founders.',
    whoReviews: 'Kamrul reviews technical docs for accuracy; Arifur reviews client-facing handoff documentation for clarity and completeness.',
    sampleOutput: 'README. 34 API endpoint docs with request/response examples. Architecture decision records for 6 key technical choices. Database schema reference with field descriptions. 12-page client handoff guide written for a non-technical founder.',
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
    tagline: 'Coordinates everything. Builds nothing.',
    howItWorks: 'Manages the entire DevBridge pipeline. Routes work between agents in the correct order, enforces pipeline dependencies, monitors agent progress and timeouts, handles retries on transient failures, and ensures the right outputs flow into the right inputs at each step. NEXUS orchestrates — it doesn\'t build.',
    cantDo: 'Make judgment calls when agents encounter genuinely novel problems or business-critical ambiguities. NEXUS recognizes these situations and escalates to Kamrul with full context rather than guessing forward.',
    whoReviews: 'Kamrul Hasan monitors NEXUS orchestration logs for all active projects and reviews every escalation.',
    sampleOutput: 'Pipeline run completed in 4h 23m. 3 inter-agent handoffs. 1 HAMMER timeout — retried successfully after 12-minute delay. SENTINEL flagged 2 high-severity issues — pipeline paused for Kamrul review. All stages resolved to green.',
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

const COVERAGE = [
  { division: 'Studio', agents: ['SCOUT', 'HUNTER', 'ATLAS', 'MIRROR', 'FORGE', 'HAMMER', 'SENTINEL', 'SHIELD', 'BEACON', 'NEXUS'], primary: true },
  { division: 'Services', agents: ['SENTINEL', 'SHIELD', 'BEACON'], primary: false },
  { division: 'Labs', agents: ['SCOUT', 'HUNTER', 'ATLAS', 'BEACON'], primary: false },
  { division: 'Products', agents: ['SCOUT', 'HUNTER', 'ATLAS', 'MIRROR', 'FORGE', 'HAMMER', 'SENTINEL', 'SHIELD', 'BEACON', 'NEXUS'], primary: true },
  { division: 'Cloud', agents: ['SENTINEL', 'SHIELD', 'BEACON'], primary: false },
];

function AgentAvatar({ color, svgContent }: { color: string; svgContent: string }) {
  return (
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      border: `2px solid ${color}35`,
      background: `${color}12`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 64 64" style={{ width: 44, height: 44, color }} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}

export default function TeamPage() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes agentPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .agent-profile:hover { border-color: var(--agent-color) !important; }
        .agent-profile { transition: border-color 0.3s; }
        .pipeline-node { cursor: pointer; transition: all 0.2s; }
        .pipeline-node:hover { transform: scale(1.05); }
        .team-coverage-table td, .team-coverage-table th { padding: 10px 14px; }

        @media (max-width: 768px) {
          .team-founder-profile { grid-template-columns: 1fr !important; gap: 24px !important; }
          .team-agent-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
          .team-agent-avatar { justify-self: center !important; }
        }
        @media (max-width: 640px) {
          .team-coverage-table { font-size: 0.72rem !important; }
          .team-coverage-table td, .team-coverage-table th { padding: 7px 8px !important; }
          .team-supervisor-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: 'var(--bg)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,108,184,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <Container>
          <ScrollReveal>
            <p className="sec-label" style={{ justifyContent: 'center' }}>The team</p>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20 }}>
              12 team members.<br />
              <span className="gradient-text">2 human. 10 AI.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 600, marginInline: 'auto' }}>
              We list the agents on the team page because they ARE the team. They process every spec, write every line of code, run every test. The founders architect, review, and decide. Both layers are real.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      <AboutSubNav active="/about/team" />

      {/* ── Founders ─────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Layer 1 — Human" title="The Founders" subtitle="Two BUET graduates who built FabricxAI's 22-agent system, then turned the same architecture on SocioFi itself." centered className="mb-12" />
          </ScrollReveal>

          {/* Arifur */}
          <ScrollReveal>
            <div className="team-founder-profile" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'start', maxWidth: 900, marginInline: 'auto', marginBottom: 20 }}>
              <div className="team-agent-avatar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(74,108,184,0.15)', border: '2px solid rgba(74,108,184,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '2rem', color: '#4A6CB8' }}>A</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textAlign: 'center' }}>HUMAN</span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Arifur Rahman</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: '#4A6CB8', letterSpacing: '0.08em', margin: '0 0 24px' }}>CEO & CO-FOUNDER · SINCE AUGUST 1, 2024</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  BUET graduate. Product strategist. The person who lived the problem SocioFi was built to solve — tried to deploy an AI-built prototype, spent three weeks hitting walls, talked to dozens of founders with identical stories.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  {[
                    { label: 'Owns', text: 'Client relationships, business development, Studio pipeline quality, final approval on all external communications.' },
                    { label: 'Reviews daily', text: 'Every HERALD-drafted email. Every SCOUT client spec. All frontend outputs from MIRROR. Client handoff docs from BEACON.' },
                    { label: 'Typical day', text: 'Project briefings at 9am. Client calls 10–12. Agent output review 2–4pm. Business development evenings.' },
                    { label: 'Background', text: 'BUET CS. Worked across product and operations before SocioFi. Deep experience with the non-technical founder perspective.' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{item.label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Kamrul */}
          <ScrollReveal>
            <div className="team-founder-profile" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'start', maxWidth: 900, marginInline: 'auto' }}>
              <div className="team-agent-avatar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(89,163,146,0.15)', border: '2px solid rgba(89,163,146,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '2rem', color: 'var(--teal)' }}>K</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textAlign: 'center' }}>HUMAN</span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Kamrul Hasan</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--teal)', letterSpacing: '0.08em', margin: '0 0 24px' }}>CTO & CO-FOUNDER · SINCE AUGUST 1, 2024</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  BUET graduate. Production systems engineer. Designed the 22-agent FabricxAI system from scratch, built DevBridge OS, and architected the NEXUS admin system that now runs SocioFi&apos;s own operations.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Owns', text: 'All technical architecture, agent system design, code review on every project, DevBridge pipeline, infrastructure decisions.' },
                    { label: 'Reviews daily', text: 'Every ATLAS architecture. All FORGE backend code. Every SENTINEL security finding. NEXUS pipeline logs for active projects.' },
                    { label: 'Typical day', text: 'Architecture reviews 8–10am. Code and agent output review 10–1pm. Pipeline design and R&D afternoons. Labs writing evenings.' },
                    { label: 'Background', text: 'BUET CS. Production systems experience across manufacturing, logistics, and B2B software. Deep expertise in multi-agent AI architectures.' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{item.label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Dev Agents Full Profiles ──────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Layer 2 — AI Developers"
              title="DevBridge: The Development Team"
              subtitle="10 specialized agents built and maintained by Kamrul. Every Studio project runs through this pipeline."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          {/* Pipeline nav */}
          <ScrollReveal>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
              {DEV_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  className="pipeline-node"
                  onClick={() => {
                    setActiveAgent(activeAgent === agent.id ? null : agent.id);
                    const el = document.getElementById(`agent-${agent.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
                    padding: '7px 16px', borderRadius: 'var(--radius-full)',
                    border: `1px solid ${agent.color}50`,
                    background: `${agent.color}12`,
                    color: agent.color, cursor: 'pointer',
                  }}
                >
                  {agent.id}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Agent profiles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {DEV_AGENTS.map((agent, i) => (
              <ScrollReveal key={agent.id} delay={0.05}>
                <div
                  id={`agent-${agent.id}`}
                  className="agent-profile"
                  style={{
                    background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-2)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                    padding: '40px 44px',
                    ['--agent-color' as string]: agent.color,
                  }}
                >
                  <div className="team-agent-layout" style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 36, alignItems: 'start' }}>
                    {/* Avatar column */}
                    <div className="team-agent-avatar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{ animation: 'agentPulse 4s ease-in-out infinite' }}>
                        <AgentAvatar color={agent.color} svgContent={agent.svg} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', color: agent.color, letterSpacing: '0.08em', border: `1px solid ${agent.color}40`, borderRadius: 'var(--radius-full)', padding: '2px 8px', textAlign: 'center' }}>AI DEV</span>
                      {agent.step !== 'ALL' && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>STEP {agent.step}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.015em' }}>{agent.id}</h3>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: agent.color, letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase' }}>{agent.role}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: '0 0 28px', fontStyle: 'italic' }}>{agent.tagline}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>How it works</p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>{agent.howItWorks}</p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What it can&apos;t do</p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>{agent.cantDo}</p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Who reviews the output</p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>{agent.whoReviews}</p>
                        </div>
                        <div style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}20`, borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: agent.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Sample output</p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{agent.sampleOutput}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Supervisors Coming Soon ───────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Layer 3 — Human Supervisors (Coming)"
              title="One per division. Part-time. Expert."
              subtitle="From SocioFi Guild. Their job is to review agent output — not to do the work themselves."
              centered
              className="mb-10"
            />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="team-supervisor-grid">
            <StaggerChildren>
              {SUPERVISORS.map((sup) => (
                <StaggerItem key={sup.division}>
                  <div style={{ border: `1px dashed ${sup.accent}35`, borderRadius: 'var(--radius-md)', padding: '20px 20px', opacity: 0.7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: sup.accent, opacity: 0.5, marginBottom: 12 }} />
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>Coming — {sup.division}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>{sup.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
          <ScrollReveal delay={0.1}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-muted)', textAlign: 'center', marginTop: 28, maxWidth: 580, marginInline: 'auto' }}>
              Supervisors will be hired from SocioFi Guild — a curated network of specialist engineers with demonstrated technical competence and experience working alongside AI systems.
              {' '}<a href="/careers" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Apply →</a>
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Division Coverage Table ───────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Agent coverage" title="Which agents work on which divisions?" centered className="mb-10" />
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ overflowX: 'auto' }}>
              <table className="team-coverage-table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '10px 14px', fontWeight: 500 }}>Division</th>
                    {DEV_AGENTS.map(a => (
                      <th key={a.id} style={{ textAlign: 'center', color: a.color, letterSpacing: '0.06em', padding: '10px 8px', fontWeight: 600, fontSize: '0.64rem' }}>{a.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COVERAGE.map((row, i) => (
                    <tr key={row.division} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-2)' }}>
                      <td style={{ color: 'var(--text-primary)', padding: '10px 14px', fontWeight: row.primary ? 600 : 400 }}>{row.division}</td>
                      {DEV_AGENTS.map(agent => {
                        const active = row.agents.includes(agent.id);
                        return (
                          <td key={agent.id} style={{ textAlign: 'center', padding: '10px 8px' }}>
                            {active ? (
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color, margin: 'auto', opacity: 0.85 }} />
                            ) : (
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)', margin: 'auto', opacity: 0.4 }} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <CTASection
        title="Work with the whole team."
        subtitle="Every project gets all 10 agents plus Kamrul's architecture review and Arifur's client oversight. That's the whole team, every time."
        primaryCTA={{ label: 'Start a project', href: '/studio/start-project' }}
        ghostCTA={{ label: 'Read the story', href: '/about/story' }}
      />
    </>
  );
}
