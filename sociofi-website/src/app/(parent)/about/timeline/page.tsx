'use client';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';
import { useState } from 'react';

const SUBPAGES = [
  { label: 'Overview', href: '/about' },
  { label: 'Full Team', href: '/about/team' },
  { label: 'Our Story', href: '/about/story' },
  { label: 'Values', href: '/about/values' },
  { label: 'Timeline', href: '/about/timeline' },
  { label: 'Press Kit', href: '/about/press' },
];

function SubNav({ active }: { active: string }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', position: 'sticky', top: 72, zIndex: 40 }}>
      <Container>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SUBPAGES.map((p) => (
            <a key={p.href} href={p.href} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: p.href === active ? 'var(--teal)' : 'var(--text-muted)',
              padding: '14px 20px', borderBottom: p.href === active ? '2px solid var(--teal)' : '2px solid transparent',
              textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s',
            }}>{p.label}</a>
          ))}
        </div>
      </Container>
    </div>
  );
}

type EventType = 'milestone' | 'labs' | 'product' | 'team' | 'agents';

const EVENTS: {
  date: string;
  title: string;
  desc: string;
  detail?: string;
  type: EventType;
  isNow?: boolean;
}[] = [
  {
    date: 'August 1, 2024',
    title: 'SocioFi Technology founded',
    desc: 'Arifur Rahman and Kamrul Hasan incorporate SocioFi Technology in Dhaka, Bangladesh.',
    detail: 'Founded with a clear mission: bridge the gap between AI-generated prototypes and production-ready software. No office. No external funding. Two BUET graduates with a problem they both understood intimately.',
    type: 'milestone',
  },
  {
    date: 'September 2024',
    title: 'FabricxAI development begins',
    desc: 'Development starts on FabricxAI — a multi-agent AI system for garment manufacturing.',
    detail: 'Rather than pitch clients immediately, the founders decided to prove their approach in a real production environment first. FabricxAI was selected as the proving ground: a complex, high-stakes context where multi-agent AI would either work or fail visibly.',
    type: 'product',
  },
  {
    date: 'October 2024',
    title: 'First 5 agents deployed',
    desc: 'FabricxAI\'s initial quality control agent cluster goes live in a Dhaka garment factory.',
    detail: 'Five specialized agents handling fabric defect detection, pattern analysis, classification, reporting, and alert routing. The system catches its first defect missed by human inspectors within the first week — proof of concept validated.',
    type: 'agents',
  },
  {
    date: 'November 2024',
    title: 'Studio takes first client project',
    desc: 'SocioFi Studio accepts its first external client — a founder building a SaaS tool.',
    detail: 'The Studio division opens for client projects while FabricxAI development continues in parallel. Early methodology: heavy AI-assisted development, engineer review at every stage, deployment-first thinking from day one.',
    type: 'milestone',
  },
  {
    date: 'December 2024',
    title: 'Component library v2 — AI-optimized',
    desc: 'Kamrul restructures the component library based on patterns observed in AI code generation. Error rates drop 70%.',
    detail: 'Analysis of AI-generated code across 3 months of Studio projects revealed systematic error patterns. Version 2 of the component library was designed to make those errors structurally impossible — the right patterns become the easiest patterns.',
    type: 'labs',
  },
  {
    date: 'January 2025',
    title: 'FabricxAI reaches 22 agents',
    desc: 'The full FabricxAI platform is live — 22 specialized agents covering quality, production, supply chain, and analytics.',
    detail: 'What started as 5 QC agents expanded to a comprehensive manufacturing intelligence platform. NEXUS coordinates the 22 agents, routing tasks and managing priorities. The architecture decisions made here became the foundation for the NEXUS system running SocioFi itself.',
    type: 'milestone',
  },
  {
    date: 'February 2025',
    title: 'Services division launches',
    desc: 'SocioFi Services opens for maintenance, monitoring, and bug fix engagements.',
    detail: 'The Services division formalized the ongoing relationship between SocioFi and clients whose software has been built. First two monitoring clients onboarded. SENTINEL deployed for the first external production environment.',
    type: 'product',
  },
  {
    date: 'March 2025',
    title: 'NEXUS ARIA development begins',
    desc: 'Kamrul starts development on NEXUS ARIA — a 13-agent GTM operations system for enterprise data analysis.',
    detail: 'Building on FabricxAI architecture, NEXUS ARIA targets a different context: sales and GTM operations for data-heavy enterprises. The project becomes the proving ground for multi-agent coordination at the enterprise level.',
    type: 'product',
  },
  {
    date: 'May 2025',
    title: 'Labs publishes first research series',
    desc: 'Three technical articles on multi-agent AI patterns published. First Labs research output.',
    detail: 'The research covered: coordination patterns in multi-agent systems, failure modes in AI-generated code at scale, and prompt drift detection and correction. Combined reach exceeded 15,000 readers in the first week.',
    type: 'labs',
  },
  {
    date: 'June 2025',
    title: 'DevBridge OS goes internal',
    desc: 'The 10-agent Studio development pipeline is deployed internally, powering all Studio projects.',
    detail: 'DevBridge OS formalizes the Studio workflow: SCOUT (requirements), HUNTER (research), MIRROR (code generation), ATLAS (architecture review), FORGE (integration), HAMMER (testing), SENTINEL (regression), NEXUS (coordination), BEACON (documentation), SHIELD (security). Every Studio project now runs through this pipeline.',
    type: 'agents',
  },
  {
    date: 'August 2025',
    title: 'SocioFi first year — 12 clients served',
    desc: 'One year anniversary. 12 clients across Studio and Services. 45+ agents across all systems.',
    detail: 'Year one metrics: 12 clients, $0 external funding, 2 founders, 45+ agents deployed across client and internal systems, 3 active research publications, 22-agent FabricxAI still running with 99.4% uptime.',
    type: 'milestone',
  },
  {
    date: 'September 2025',
    title: 'AI pair programming study completed',
    desc: 'Labs study demonstrates 4.2x feature output with the AI-human development workflow. Published.',
    detail: 'Six-month controlled study comparing velocity across traditional development, fully AI-assisted development, and SocioFi\'s supervised AI pipeline. Key finding: 4.2x increase in feature velocity, with no measurable quality degradation and 30% fewer post-launch bugs compared to traditional development.',
    type: 'labs',
  },
  {
    date: 'October 2025',
    title: 'DevBridge opens for external clients',
    desc: 'DevBridge pipeline becomes available to enterprise clients who want to integrate it into their own development.',
    detail: 'First enterprise licensing discussion for DevBridge. The product transitions from internal tool to potential product offering, forming the basis for the Products division portfolio.',
    type: 'product',
  },
  {
    date: 'November 2025',
    title: 'Academy launches beta',
    desc: 'SocioFi Academy beta opens with two foundational courses on AI-native development.',
    detail: 'First cohort: 24 students from 8 countries. Courses built with MENTOR agent, reviewed by Kamrul. Feedback sessions run by Arifur. First Academy revenue generated.',
    type: 'product',
  },
  {
    date: 'December 2025',
    title: 'NEXUS admin system launched',
    desc: '13 AI agents now run SocioFi\'s own operations — NEXUS, INTAKE, HERALD, SCRIBE, and 9 more.',
    detail: 'The same architecture that ran FabricxAI is now running SocioFi itself. NEXUS coordinates, INTAKE processes leads, HERALD drafts emails, SCRIBE writes content, SENTINEL monitors systems. Every output goes through founder review before action. The team page is updated to list all 13 agents.',
    type: 'agents',
  },
  {
    date: 'February 2026',
    title: 'Ventures division opens applications',
    desc: 'SocioFi Ventures begins accepting startup applications for equity co-build partnerships.',
    detail: 'Ventures offers a unique model: SocioFi builds the software in exchange for equity. ORACLE evaluates applications, INTAKE classifies leads, founders make all final decisions on investments. First application cohort opens.',
    type: 'product',
  },
  {
    date: 'March 2026',
    title: 'SocioFi website launches — 8 divisions',
    desc: 'Full website launches with all 8 divisions. Radical transparency about the AI-native team.',
    detail: 'The new website includes the team page that lists 13 AI agents alongside the founders. The decision to be radically transparent about how the company operates becomes itself a differentiator. PILOT launches as the AI website assistant.',
    type: 'milestone',
  },
  {
    date: 'Now',
    title: 'Building the next layer',
    desc: 'Hiring human division supervisors. Growing the agent catalog. Accepting Ventures applications.',
    detail: 'Next phase: per-division human supervisors from SocioFi Guild. Expanding the agent catalog for external enterprise licensing. Growing Academy with structured learning paths. Ventures evaluating first equity partnership cohort.',
    type: 'team',
    isNow: true,
  },
];

const TYPE_LABELS: Record<EventType, string> = {
  milestone: 'Milestone', labs: 'Labs', product: 'Product', team: 'Team', agents: 'Agents',
};

const TYPE_COLORS: Record<EventType, string> = {
  milestone: 'var(--teal)', labs: '#7B6FE8', product: '#E8916F', team: '#E8B84D', agents: '#4A6CB8',
};

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = EVENTS.filter((e) => activeFilter === 'all' || e.type === activeFilter);

  return (
    <>
      <style>{`
        @keyframes nowPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
        .filter-btn { transition: all 0.2s; cursor: pointer; }
        .filter-btn:hover { opacity: 1 !important; }
        .timeline-event { cursor: pointer; }
        .timeline-event:hover .event-title { color: var(--teal) !important; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: 'var(--bg)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '20%', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,108,184,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <Container>
          <p className="sec-label" style={{ justifyContent: 'center' }}>Our Journey</p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20 }}>
            From Idea to 45+ Production Agents{' '}
            <span className="gradient-text">in 18 Months.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 580, marginInline: 'auto' }}>
            Every major moment in SocioFi&apos;s history, from August 2024 to present. Click any event to expand the full story.
          </p>
        </Container>
      </section>

      <SubNav active="/about/timeline" />

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          {/* Filter bar */}
          <ScrollReveal>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 64, justifyContent: 'center' }}>
              {(['all', 'milestone', 'agents', 'product', 'labs', 'team'] as const).map((f) => (
                <button
                  key={f}
                  className="filter-btn"
                  onClick={() => setActiveFilter(f)}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '7px 18px', borderRadius: 'var(--radius-full)',
                    border: `1px solid ${activeFilter === f ? (f === 'all' ? 'var(--teal)' : TYPE_COLORS[f as EventType]) : 'var(--border)'}`,
                    background: activeFilter === f ? (f === 'all' ? 'rgba(89,163,146,0.1)' : `${TYPE_COLORS[f as EventType]}18`) : 'transparent',
                    color: activeFilter === f ? (f === 'all' ? 'var(--teal)' : TYPE_COLORS[f as EventType]) : 'var(--text-muted)',
                    opacity: activeFilter === f ? 1 : 0.65,
                  }}
                >
                  {f === 'all' ? 'All Events' : TYPE_LABELS[f]}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <div style={{ maxWidth: 760, marginInline: 'auto', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 24, top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(180deg, var(--navy) 0%, var(--teal) 60%, #22c55e 100%)',
              opacity: 0.35,
            }} />

            {filtered.map((event, i) => {
              const color = event.isNow ? '#22c55e' : TYPE_COLORS[event.type];
              const isExpanded = expandedIndex === i;
              return (
                <ScrollReveal key={i} delay={i * 0.04}>
                  <div
                    className="timeline-event"
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    style={{ display: 'flex', gap: 28, paddingBottom: 40, position: 'relative' }}
                  >
                    {/* Dot */}
                    <div style={{ width: 48, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: event.isNow ? '#22c55e' : color,
                        border: `3px solid var(--bg)`,
                        outline: `2px solid ${color}`,
                        zIndex: 1, flexShrink: 0,
                        animation: event.isNow ? 'nowPulse 2s ease-in-out infinite' : 'none',
                      }} />
                    </div>

                    <div style={{ flex: 1, paddingBottom: 16, borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{event.date}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: color, border: `1px solid ${color}50`, borderRadius: 'var(--radius-full)', padding: '1px 8px', letterSpacing: '0.06em' }}>
                          {event.isNow ? 'NOW' : TYPE_LABELS[event.type]}
                        </span>
                      </div>
                      <h3 className="event-title" style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0 0 6px', transition: 'color 0.2s' }}>{event.title}</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>{event.desc}</p>

                      {/* Expanded detail */}
                      {isExpanded && event.detail && (
                        <div style={{
                          marginTop: 16, padding: '16px 20px',
                          background: `${color}08`, border: `1px solid ${color}25`,
                          borderRadius: 'var(--radius-sm)',
                        }}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>{event.detail}</p>
                        </div>
                      )}

                      {event.detail && (
                        <button style={{
                          marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                          color: color, letterSpacing: '0.06em', background: 'none', border: 'none',
                          cursor: 'pointer', padding: 0, textTransform: 'uppercase',
                        }}>
                          {isExpanded ? 'Collapse ↑' : 'Read more ↓'}
                        </button>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Stats summary */}
          <ScrollReveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px 48px', marginTop: 64, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
              {[
                { value: '18', label: 'months since founding' },
                { value: '22', label: 'peak FabricxAI agents' },
                { value: '13', label: 'internal operational agents' },
                { value: '45+', label: 'total agents in production' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.04em' }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <CTASection
        title="Write the next chapter with us"
        subtitle="Whether you want to build software, learn from us, or join the team — there's a path forward."
        primaryCTA={{ label: 'Start a project', href: '/studio/start-project' }}
        ghostCTA={{ label: 'Read the full story', href: '/about/story' }}
      />
    </>
  );
}
