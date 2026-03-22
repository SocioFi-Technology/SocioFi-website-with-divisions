'use client';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';

// ── Data ──────────────────────────────────────────────────────────────────────

const AGENT_AVATARS: Record<string, { svg: string; color: string }> = {
  NEXUS: {
    color: '#4A6CB8',
    svg: `<polygon points="32,8 56,20 56,44 32,56 8,44 8,20" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.8"/>
      <line x1="32" y1="27" x2="32" y2="14" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="36.5" y1="29.4" x2="47" y2="23" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="36.5" y1="34.6" x2="47" y2="41" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="32" y1="37" x2="32" y2="50" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="27.5" y1="34.6" x2="17" y2="41" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <line x1="27.5" y1="29.4" x2="17" y2="23" stroke="currentColor" stroke-width="1" opacity="0.6"/>`,
  },
  INTAKE: {
    color: '#72C4B2',
    svg: `<path d="M12 16 L32 16 L52 16" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <path d="M16 24 L32 24 L48 24" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
      <path d="M20 32 L32 32 L44 32" stroke="currentColor" stroke-width="1.5" opacity="0.8"/>
      <path d="M24 40 L32 40 L40 40" stroke="currentColor" stroke-width="1.5"/>
      <path d="M28 48 L32 48 L36 48" stroke="currentColor" stroke-width="1.5" opacity="0.8"/>
      <circle cx="32" cy="52" r="3" fill="currentColor"/>`,
  },
  SCRIBE: {
    color: '#7B6FE8',
    svg: `<path d="M22 42 L30 22 L38 42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 50 Q30 42 40 50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="14" y1="32" x2="22" y2="32" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="14" y1="36" x2="20" y2="36" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="42" y1="32" x2="50" y2="32" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="44" y1="36" x2="50" y2="36" stroke="currentColor" stroke-width="1" opacity="0.5"/>`,
  },
  HERALD: {
    color: '#4DBFA8',
    svg: `<circle cx="32" cy="32" r="5" fill="currentColor"/>
      <circle cx="32" cy="32" r="11" stroke="currentColor" stroke-width="1" opacity="0.7" fill="none"/>
      <circle cx="32" cy="32" r="18" stroke="currentColor" stroke-width="1" opacity="0.4" fill="none"/>
      <circle cx="32" cy="32" r="25" stroke="currentColor" stroke-width="1" opacity="0.2" fill="none"/>`,
  },
  COMPASS: {
    color: '#72C4B2',
    svg: `<circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M32 12 L35 26 L32 22 L29 26 Z" fill="currentColor"/>
      <path d="M32 52 L29 38 L32 42 L35 38 Z" fill="currentColor" opacity="0.5"/>
      <path d="M12 32 L26 29 L22 32 L26 35 Z" fill="currentColor" opacity="0.5"/>
      <path d="M52 32 L38 35 L42 32 L38 29 Z" fill="currentColor" opacity="0.5"/>
      <circle cx="32" cy="32" r="3" fill="currentColor"/>`,
  },
  SENTINEL: {
    color: '#4DBFA8',
    svg: `<path d="M32 10 L50 18 L50 34 C50 44 42 52 32 54 C22 52 14 44 14 34 L14 18 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M18 36 Q22 28 26 32 Q30 36 34 28 Q38 20 42 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  CHRONICLE: {
    color: '#72C4B2',
    svg: `<rect x="12" y="44" width="8" height="8" fill="currentColor" opacity="0.5"/>
      <rect x="24" y="36" width="8" height="16" fill="currentColor" opacity="0.7"/>
      <rect x="36" y="26" width="8" height="26" fill="currentColor" opacity="0.9"/>
      <rect x="48" y="16" width="8" height="36" fill="currentColor"/>
      <path d="M14 40 Q22 32 30 26 Q38 20 52 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
  },
  MENTOR: {
    color: '#E8B84D',
    svg: `<path d="M10 42 Q10 32 20 28 L32 24 L44 28 Q54 32 54 42 L54 46 Q32 52 10 46 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="32" y1="24" x2="32" y2="14" stroke="currentColor" stroke-width="1.5"/>
      <path d="M32 14 Q24 10 20 14" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
      <path d="M32 14 Q40 10 44 14" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6"/>`,
  },
  CURATOR: {
    color: '#7B6FE8',
    svg: `<rect x="16" y="12" width="28" height="36" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="22" y1="22" x2="38" y2="22" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
      <line x1="22" y1="28" x2="38" y2="28" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>
      <line x1="22" y1="34" x2="32" y2="34" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
      <rect x="28" y="36" width="20" height="16" rx="3" fill="var(--bg-card)" stroke="currentColor" stroke-width="1.5"/>
      <line x1="32" y1="42" x2="44" y2="42" stroke="currentColor" stroke-width="1.2" opacity="0.8"/>
      <line x1="32" y1="46" x2="42" y2="46" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>`,
  },
  WARDEN: {
    color: '#4DBFA8',
    svg: `<rect x="12" y="18" width="32" height="20" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="16" y1="26" x2="40" y2="26" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="16" y1="30" x2="36" y2="30" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <path d="M44 22 L52 30 L44 38" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="44" cy="46" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="44" cy="46" r="1.5" fill="currentColor" opacity="0.8"/>
      <circle cx="52" cy="46" r="3" fill="currentColor" opacity="0.6"/>
      <circle cx="52" cy="46" r="1.5" fill="currentColor"/>`,
  },
  BRIDGE: {
    color: '#6BA3E8',
    svg: `<circle cx="16" cy="32" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="48" cy="32" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M24 32 L40 32" stroke="currentColor" stroke-width="1.5"/>
      <path d="M35 28 L40 32 L35 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  ORACLE: {
    color: '#4A6CB8',
    svg: `<ellipse cx="32" cy="32" rx="18" ry="12" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="32" cy="32" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="32" cy="32" r="2" fill="currentColor"/>
      <line x1="14" y1="24" x2="22" y2="28" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="14" y1="40" x2="22" y2="36" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="50" y1="24" x2="42" y2="28" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="50" y1="40" x2="42" y2="36" stroke="currentColor" stroke-width="1" opacity="0.4"/>`,
  },
  PULSE: {
    color: '#E8916F',
    svg: `<circle cx="32" cy="32" r="22" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M10 32 L20 32 L24 20 L28 44 L32 26 L36 38 L40 32 L54 32" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
};

const AGENTS = [
  {
    id: 'NEXUS', title: 'Operations Director',
    divisions: ['All divisions'], supervisor: 'Both founders',
    fullDesc: 'NEXUS is the central nervous system of SocioFi. It coordinates every other agent — routing tasks, managing priorities, flagging bottlenecks, and ensuring nothing falls through the cracks. Every morning, NEXUS generates an operations report that Kamrul and Arifur review before the workday begins.',
    how: ['Reads the task queue from all 13 agents', 'Routes tasks to the correct specialist agent', 'Flags overdue items and escalates to founders'],
    cannotDo: 'NEXUS cannot make final decisions on client-facing matters. It routes and coordinates — humans decide.',
    sample: 'NEXUS detected that 3 leads had been in the pipeline for more than 48 hours without response. It flagged them to INTAKE for re-engagement drafts, then notified Arifur directly.',
  },
  {
    id: 'INTAKE', title: 'Lead Analyst',
    divisions: ['All divisions'], supervisor: 'Arifur Rahman',
    fullDesc: 'INTAKE is the first team member you interact with after submitting any form on our website. Within seconds of your submission, INTAKE reads your project description, classifies which division can help, scores the lead based on fit and urgency, assigns it to the right founder, and drafts a personalized welcome email.',
    how: ['Reads your form submission in full', 'Classifies: division, type, urgency, tags', 'Scores 0-100 based on budget, clarity, fit, urgency', 'Assigns to the right founder', 'Drafts a personalized response referencing YOUR specific project'],
    cannotDo: 'INTAKE cannot evaluate whether your project is technically feasible — that\'s Kamrul\'s job. It also can\'t negotiate pricing or commit to timelines.',
    sample: 'Within 28 seconds of a founder submitting their InboxFlow project form, INTAKE classified it as Studio/Rescue (score 78), assigned it to Kamrul, and drafted: "I read about InboxFlow and the deployment issues you\'re hitting. That\'s the #1 reason founders come to us..." Arifur reviewed and sent the email 12 minutes later.',
  },
  {
    id: 'HERALD', title: 'Communications Lead',
    divisions: ['All divisions'], supervisor: 'Arifur Rahman',
    fullDesc: 'HERALD manages all outbound email communication for SocioFi. It drafts responses, schedules follow-up sequences, sends weekly reports to active clients, and manages the newsletter distribution. Every single email HERALD prepares is reviewed and approved by a founder before it sends.',
    how: ['Drafts email responses based on conversation context', 'Schedules follow-up sequences for leads and clients', 'Prepares weekly client status updates'],
    cannotDo: 'HERALD cannot send any email without explicit founder approval. Every draft sits in a review queue.',
    sample: 'HERALD drafted 14 emails in one day — client updates, lead follow-ups, and partnership inquiries. Arifur approved 12, edited 1, and rejected 1 that needed a different tone.',
  },
  {
    id: 'SCRIBE', title: 'Content Writer',
    divisions: ['Labs', 'Academy'], supervisor: 'Kamrul Hasan',
    fullDesc: 'SCRIBE handles all long-form content for SocioFi — blog articles, course materials, documentation, and case studies. It researches topics, drafts complete articles, and structures educational content. Every piece of content SCRIBE produces is reviewed by a human before publishing.',
    how: ['Researches topic from multiple sources', 'Drafts complete articles or course sections', 'Formats for the CMS and adds internal links'],
    cannotDo: 'SCRIBE cannot publish content directly. Every draft requires human review and approval. It also can\'t interview real people or gather primary research.',
    sample: 'SCRIBE drafted a 1,800-word article on multi-agent AI coordination patterns in 22 minutes. Kamrul reviewed it, made 3 factual corrections, and published it the same day.',
  },
  {
    id: 'SENTINEL', title: 'Systems Monitor',
    divisions: ['Services', 'Cloud'], supervisor: 'Kamrul Hasan',
    fullDesc: 'SENTINEL watches client software 24/7. It monitors uptime, response times, error rates, and system health metrics. When something goes wrong — or is about to go wrong — SENTINEL alerts the team immediately. It never sleeps and never misses an incident.',
    how: ['Polls health endpoints every 60 seconds', 'Analyzes error logs for patterns', 'Triggers alerts when thresholds are crossed'],
    cannotDo: 'SENTINEL cannot fix issues itself — it detects and alerts. Kamrul\'s team handles the actual fixes. SENTINEL also can\'t predict novel failure modes it hasn\'t been trained on.',
    sample: 'SENTINEL detected a 40% increase in database query times at 2:47am for a client system. It alerted Kamrul before the client experienced any visible slowdown. Issue resolved by 3:15am.',
  },
  {
    id: 'COMPASS', title: 'Pipeline Manager',
    divisions: ['Studio', 'Services', 'Cloud'], supervisor: 'Arifur Rahman',
    fullDesc: 'COMPASS tracks every lead and client through their journey with SocioFi. It monitors where people are in the sales and delivery pipeline, flags when someone needs attention, and recommends next steps. COMPASS is what keeps clients from falling through the cracks.',
    how: ['Monitors all active leads and clients in CRM', 'Flags leads that haven\'t progressed in 72+ hours', 'Recommends next actions to founders daily'],
    cannotDo: 'COMPASS can\'t make contact with clients directly — it only recommends. All client communication goes through HERALD and founder approval.',
    sample: 'COMPASS identified that a high-value prospect had opened the pricing page 3 times without contacting us. It flagged this to Arifur and recommended a personalized outreach.',
  },
  {
    id: 'WARDEN', title: 'Support Triage',
    divisions: ['Services'], supervisor: 'Kamrul Hasan',
    fullDesc: 'WARDEN handles every incoming support ticket. It reads the issue, classifies urgency, identifies if there\'s a known solution, routes to the right engineer, and drafts an initial response. WARDEN is why no support ticket goes unanswered for more than a few hours.',
    how: ['Reads every support submission', 'Classifies: urgency level, issue type, affected system', 'Routes to the correct team member', 'Drafts initial response with suggested fix if known'],
    cannotDo: 'WARDEN cannot resolve technical issues — it triages and routes. Complex debugging always requires Kamrul\'s team.',
    sample: 'WARDEN received a ticket about a login failure at 11pm. It classified it as high urgency (auth system), identified it matched a known session token bug, routed to Kamrul, and drafted a response with a temporary workaround.',
  },
  {
    id: 'CHRONICLE', title: 'Analytics Lead',
    divisions: ['All divisions'], supervisor: 'Both founders',
    fullDesc: 'CHRONICLE generates daily and weekly analytics reports for SocioFi\'s internal operations. It tracks lead velocity, client health scores, revenue metrics, agent performance, and content analytics. CHRONICLE is the team\'s memory — keeping track of every metric that matters.',
    how: ['Aggregates data from all operational systems', 'Generates daily summary reports for founders', 'Flags metrics that deviate from baseline'],
    cannotDo: 'CHRONICLE reports on what happened — it doesn\'t predict the future. That\'s ORACLE\'s job. CHRONICLE also can\'t access client-confidential data without explicit founder authorization.',
    sample: 'CHRONICLE\'s Monday morning report: "This week — 8 new leads, 3 qualified, 1 closed. Average response time: 4.2 hours. Top blog article: 847 views. Agent uptime: 99.97%."',
  },
  {
    id: 'ORACLE', title: 'Strategy Analyst',
    divisions: ['All divisions'], supervisor: 'Both founders',
    fullDesc: 'ORACLE analyzes patterns across SocioFi\'s data to surface strategic insights. It forecasts revenue, detects early churn signals, scores pipeline health, and identifies trends that humans might miss. ORACLE is the agent that sees around corners.',
    how: ['Analyzes historical patterns in pipeline data', 'Builds revenue forecasts based on current pipeline', 'Scores churn risk for active clients'],
    cannotDo: 'ORACLE\'s predictions are probabilistic — not guarantees. It works with the data available and can miss context that humans would catch.',
    sample: 'ORACLE flagged that a maintenance client\'s ticket volume had increased 40% over 3 months and recommended a proactive check-in call. Arifur made the call — client needed an upgrade.',
  },
  {
    id: 'MENTOR', title: 'Course Designer',
    divisions: ['Academy'], supervisor: 'Arifur Rahman',
    fullDesc: 'MENTOR creates educational content for SocioFi Academy. It designs course syllabi, writes lesson content, creates quizzes, and structures learning paths. Every piece of content MENTOR produces is reviewed by a human instructor before publishing.',
    how: ['Researches learning objectives for each course', 'Drafts lesson content and exercises', 'Builds assessment questions for each module'],
    cannotDo: 'MENTOR cannot teach live sessions or answer student questions in real-time. It creates content; humans facilitate learning.',
    sample: 'MENTOR drafted a complete 8-module course on multi-agent system design in 3 days. Kamrul reviewed the technical content, made corrections in modules 3 and 6, and approved the rest.',
  },
  {
    id: 'CURATOR', title: 'Newsletter Editor',
    divisions: ['All divisions'], supervisor: 'Arifur Rahman',
    fullDesc: 'CURATOR assembles SocioFi\'s monthly newsletter. It reviews new content across all divisions, selects the most relevant pieces, writes editorial summaries, and prepares the newsletter draft. Every newsletter is reviewed by Arifur before sending.',
    how: ['Reviews all new content from the month', 'Selects top 5-7 items for curation', 'Writes editorial summaries and links them together'],
    cannotDo: 'CURATOR cannot write original long-form content — that\'s SCRIBE\'s job. It curates and summarizes.',
    sample: 'CURATOR\'s March newsletter draft included: 2 Labs articles, 1 case study, 1 new Academy course, and 1 industry insight. Arifur approved with minor edits. Sent to 847 subscribers.',
  },
  {
    id: 'BRIDGE', title: 'Partnership Advisor',
    divisions: ['All divisions'], supervisor: 'Arifur Rahman',
    fullDesc: 'BRIDGE identifies opportunities for cross-division referrals and partnerships. When a client working with Studio could benefit from Cloud, or an Academy student would be a good fit for Ventures — BRIDGE flags these opportunities and recommends next steps.',
    how: ['Monitors active clients across all divisions', 'Identifies cross-division needs based on usage patterns', 'Recommends partnership moves to founders weekly'],
    cannotDo: 'BRIDGE can\'t make any offers or commitments — it identifies opportunities and humans close them.',
    sample: 'BRIDGE flagged that a Studio client who had just launched was not yet using Services monitoring. Arifur sent a personalized offer — client signed up for the maintenance plan within a week.',
  },
  {
    id: 'PULSE', title: 'System Health',
    divisions: ['Internal'], supervisor: 'Kamrul Hasan',
    fullDesc: 'PULSE monitors the AI agent team itself. It checks that every agent is running correctly, identifies when an agent is producing degraded output, and alerts Kamrul when the system needs attention. PULSE is the agent that watches the agents.',
    how: ['Runs health checks on all 13 agents every hour', 'Monitors output quality metrics per agent', 'Alerts Kamrul when any agent behaves anomalously'],
    cannotDo: 'PULSE can\'t fix other agents — it monitors and alerts. Kamrul handles all agent maintenance and updates.',
    sample: 'PULSE detected that HERALD\'s email drafts were averaging 40% longer than baseline — a sign of a prompt drift issue. Kamrul diagnosed and corrected it within the same day.',
  },
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

const DIVISION_COVERAGE = [
  { division: 'Studio', founders: ['Kamrul (technical)', 'Arifur (business)'], agents: ['INTAKE', 'HERALD', 'COMPASS', 'SCRIBE'], supervisor: 'Studio Supervisor', color: '#72C4B2' },
  { division: 'Agents', founders: ['Kamrul'], agents: ['INTAKE', 'HERALD', 'COMPASS', 'SENTINEL'], supervisor: 'Agent Systems Supervisor', color: '#8B5CF6' },
  { division: 'Services', founders: ['Kamrul'], agents: ['SENTINEL', 'WARDEN', 'HERALD', 'COMPASS'], supervisor: 'Maintenance Supervisor', color: '#4DBFA8' },
  { division: 'Cloud', founders: ['Kamrul'], agents: ['SENTINEL', 'PULSE'], supervisor: 'Infrastructure Supervisor', color: '#5BB5E0' },
  { division: 'Labs', founders: ['Kamrul'], agents: ['SCRIBE', 'CHRONICLE'], supervisor: 'Research Supervisor', color: '#7B6FE8' },
  { division: 'Products', founders: ['Kamrul'], agents: ['SENTINEL', 'PULSE', 'CHRONICLE'], supervisor: 'Platform Supervisor', color: '#E8916F' },
  { division: 'Academy', founders: ['Arifur'], agents: ['MENTOR', 'SCRIBE', 'CURATOR'], supervisor: 'Content Supervisor', color: '#E8B84D' },
  { division: 'Ventures', founders: ['Both'], agents: ['INTAKE', 'COMPASS', 'ORACLE', 'BRIDGE'], supervisor: 'Portfolio Supervisor', color: '#6BA3E8' },
];

// ── SubNav ────────────────────────────────────────────────────────────────────

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
              textTransform: 'uppercase',
              color: p.href === active ? 'var(--teal)' : 'var(--text-muted)',
              padding: '14px 20px',
              borderBottom: p.href === active ? '2px solid var(--teal)' : '2px solid transparent',
              textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s',
            }}>{p.label}</a>
          ))}
        </div>
      </Container>
    </div>
  );
}

// ── Agent Avatar ──────────────────────────────────────────────────────────────

function AgentAvatar({ agentId, size = 80 }: { agentId: string; size?: number }) {
  const agent = AGENT_AVATARS[agentId];
  if (!agent) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${agent.color}18`, border: `2px solid ${agent.color}50`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: agent.color, flexShrink: 0,
      animation: 'agentPulse 4s ease-in-out infinite',
    }}>
      <svg viewBox="0 0 64 64" fill="none" style={{ width: size * 0.55, height: size * 0.55 }}
        dangerouslySetInnerHTML={{ __html: agent.svg }} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  return (
    <>
      <style>{`
        @keyframes agentPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.025); } }
        @keyframes nowPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .agent-section:nth-child(even) { background: var(--bg-2); }
        .agent-section:nth-child(odd) { background: var(--bg); }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: 'var(--bg)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,88,158,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <Container>
          <p className="sec-label" style={{ justifyContent: 'center' }}>The Full Team</p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20 }}>
            Everyone Who Works at SocioFi.{' '}
            <span className="gradient-text">Human and AI.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 600, marginInline: 'auto', marginBottom: 40 }}>
            Two founders make the decisions. Thirteen AI agents do the operational work. Eight human supervisors are joining next. No inflated headcount, no stock photo employees.
          </p>

          {/* Counter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px 40px' }}>
            {[
              { value: '2', label: 'human founders', color: 'var(--teal)' },
              { value: '13', label: 'AI agents', color: '#4A6CB8' },
              { value: '8', label: 'supervisors coming', color: '#E8B84D' },
              { value: '45+', label: 'agents deployed for clients', color: 'var(--teal)' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '2.2rem', fontWeight: 800, color: s.color, letterSpacing: '-0.04em' }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <SubNav active="/about/team" />

      {/* ── Layer 1: Founders ─────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Layer 1" title="The Founders" subtitle="The two humans who make every final decision." centered className="mb-14" />
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* Arifur */}
            <ScrollReveal>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'start' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '2rem', color: 'white', marginBottom: 12 }}>AR</div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--teal)', border: '1px solid var(--teal)', borderRadius: 'var(--radius-full)', padding: '2px 10px' }}>HUMAN — FOUNDER</span>
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>Arifur Rahman</h2>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: '0 0 20px' }}>CEO & CO-FOUNDER · SINCE AUGUST 1, 2024</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                    The non-technical founder who built SocioFi because he lived the problem it solves. In 2024, Arifur had great product ideas but no path to build them — agencies were too expensive, freelancers were unreliable, and AI tools got him 70% there but left him stuck at production. He built SocioFi for every founder in that situation. Today he handles business strategy, client relationships, pricing, and company vision across all eight divisions.
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--teal)', lineHeight: 1.7, marginBottom: 20 }}>
                    &ldquo;I built SocioFi for the version of me that existed two years ago — a founder with a great idea and no way to get it built without going broke or getting burned.&rdquo;
                  </p>
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>What Arifur does at SocioFi</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {['Company strategy and vision', 'Client relationships and communication', 'Business development and pricing', 'Final approval on all AI agent outputs', 'Public representation of SocioFi'].map((r) => (
                        <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 0 }}>
                    A typical day for Arifur: Reviews AI agent drafts, takes client calls, writes proposals, approves emails, plans strategy. Most of his day is reviewing what AI agents prepared overnight and making the final calls.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Kamrul */}
            <ScrollReveal>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'start' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #7B6FE8 0%, #4A6CB8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '2rem', color: 'white', marginBottom: 12 }}>KH</div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--teal)', border: '1px solid var(--teal)', borderRadius: 'var(--radius-full)', padding: '2px 10px' }}>HUMAN — FOUNDER</span>
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>Kamrul Hasan</h2>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: '0 0 20px' }}>CTO & CO-FOUNDER · SINCE AUGUST 1, 2024</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
                    BUET Computer Science graduate who built every technical system SocioFi runs on. Kamrul designed FabricxAI (22 agents), NEXUS ARIA, and DevBridge before turning those insights into the 13-agent NEXUS system that runs SocioFi itself. He watched agencies charge six figures for work AI could handle in days — and built a company where AI handles the volume and engineers handle the judgment.
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--teal)', lineHeight: 1.7, marginBottom: 20 }}>
                    &ldquo;The most dangerous thing in our industry is a company that tells clients AI can do everything. It can&apos;t. Knowing the boundaries is what makes us good at this.&rdquo;
                  </p>
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>What Kamrul does at SocioFi</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {['System architecture for all client projects', 'AI agent development and the NEXUS system', 'Code review and engineering standards', 'Labs research direction and publications', 'Technical evaluation of all incoming projects'].map((r) => (
                        <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7B6FE8', flexShrink: 0 }} />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: 0 }}>
                    A typical day for Kamrul: Reviews code (AI-generated and human), designs system architecture, develops new agents, pushes Labs research forward, debugs production issues. Most of his day is making sure the things AI built actually work correctly.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── Layer 2: AI Agents ────────────────────────────────────────────── */}
      <section style={{ paddingTop: 'var(--space-section)', paddingBottom: 0, background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Layer 2"
              title="The AI Agent Team"
              subtitle="13 specialized agents. Running 24/7. Here's what each one does."
              centered className="mb-6"
            />
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ maxWidth: 720, marginInline: 'auto', marginBottom: 60, padding: '28px 32px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
                Most companies hide the fact that AI does their work. We put our agents on the team page because they ARE the team. Each agent is specialized, connected to our tools and data, and supervised by a founder. They don&apos;t replace humans — they handle the volume so humans can handle the judgment.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {AGENTS.map((agent, i) => {
        const avatarData = AGENT_AVATARS[agent.id];
        const color = avatarData?.color || '#72C4B2';
        const isEven = i % 2 === 0;
        return (
          <section
            key={agent.id}
            id={agent.id.toLowerCase()}
            className="agent-section"
            style={{ paddingBlock: 64 }}
          >
            <Container>
              <div style={{ display: 'grid', gridTemplateColumns: isEven ? '280px 1fr' : '1fr 280px', gap: 48, alignItems: 'start' }}>
                {/* Avatar side */}
                {isEven && (
                  <ScrollReveal direction="right">
                    <div style={{ textAlign: 'center', paddingTop: 8 }}>
                      <AgentAvatar agentId={agent.id} size={96} />
                      <div style={{ marginTop: 16 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: color, border: `1px solid ${color}60`, borderRadius: 'var(--radius-full)', padding: '3px 12px' }}>AI AGENT</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', margin: '12px 0 4px' }}>{agent.id}</h3>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: color, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 12px' }}>{agent.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'nowPulse 2s ease-in-out infinite', display: 'inline-block' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#22c55e', letterSpacing: '0.06em' }}>ACTIVE — 24/7</span>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {agent.divisions.map((d) => (
                          <span key={d} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Content side */}
                <ScrollReveal direction={isEven ? 'left' : 'right'}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 24 }}>{agent.fullDesc}</p>

                    <div style={{ marginBottom: 20 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>How {agent.id} works</p>
                      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {agent.how.map((step, si) => (
                          <li key={si} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: color, fontWeight: 600, minWidth: 18, marginTop: 1 }}>{si + 1}.</span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div style={{ padding: '16px 20px', background: 'var(--bg-3)', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#E8916F', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>What {agent.id} can&apos;t do</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{agent.cannotDo}</p>
                    </div>

                    <div style={{ padding: '16px 20px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Sample output</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{agent.sample}</p>
                    </div>

                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em', margin: 0 }}>
                      SUPERVISED BY: <span style={{ color: 'var(--text-primary)' }}>{agent.supervisor}</span>
                    </p>
                  </div>
                </ScrollReveal>

                {/* Avatar side (odd) */}
                {!isEven && (
                  <ScrollReveal direction="left">
                    <div style={{ textAlign: 'center', paddingTop: 8 }}>
                      <AgentAvatar agentId={agent.id} size={96} />
                      <div style={{ marginTop: 16 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: color, border: `1px solid ${color}60`, borderRadius: 'var(--radius-full)', padding: '3px 12px' }}>AI AGENT</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', margin: '12px 0 4px' }}>{agent.id}</h3>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: color, letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 12px' }}>{agent.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'nowPulse 2s ease-in-out infinite', display: 'inline-block' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#22c55e', letterSpacing: '0.06em' }}>ACTIVE — 24/7</span>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {agent.divisions.map((d) => (
                          <span key={d} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </Container>
          </section>
        );
      })}

      {/* ── Layer 3: Supervisors ──────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Layer 3 — Coming Next"
              title="Human Division Supervisors"
              subtitle="The best-performing part-time engineers who will oversee AI output per division."
              centered className="mb-6"
            />
          </ScrollReveal>

          <ScrollReveal>
            <div style={{ maxWidth: 680, marginInline: 'auto', marginBottom: 48, paddingLeft: 20, borderLeft: '2px solid #E8B84D' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 8 }}>
                &ldquo;We&apos;re not hiring humans to do what AI does. We&apos;re hiring humans to supervise what AI does. Each division will have a specialist engineer who reviews agent output, catches edge cases, and ensures quality.&rdquo;
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#E8B84D', letterSpacing: '0.06em', margin: 0 }}>— ARIFUR RAHMAN, CEO</p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StaggerChildren>
            {SUPERVISORS.map((s) => (
              <StaggerItem key={s.division}>
                <div style={{ padding: '24px', border: `1px dashed ${s.color}40`, borderRadius: 'var(--radius-md)', background: `${s.color}05`, opacity: 0.75 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, opacity: 0.6 }} />
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.division} Supervisor</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#E8B84D', border: '1px solid #E8B84D60', borderRadius: 'var(--radius-full)', padding: '1px 7px' }}>COMING SOON</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.65, color: 'var(--text-muted)', margin: '0 0 12px' }}>{s.desc}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', margin: 0 }}>Part-time · Specialist · From SocioFi Guild</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>

          <ScrollReveal>
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '28px 32px', maxWidth: 640, marginInline: 'auto' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What supervisors won&apos;t do vs what they will</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>
                What supervisors WON&apos;T do: the work. That&apos;s what agents do. What supervisors WILL do: ensure the work is correct, catch edge cases the agents miss, and bring the human judgment that AI can&apos;t replicate.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Coverage Map ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Coverage" title="Who Covers What" centered className="mb-10" />
          </ScrollReveal>
          <ScrollReveal>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Division', 'Founders', 'AI Agents', 'Supervisor (Coming)'].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DIVISION_COVERAGE.map((row, i) => (
                    <tr key={row.division} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-3)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color }} />
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.division}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{row.founders.join(', ')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {row.agents.map((a) => (
                            <span key={a} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: row.color, border: `1px solid ${row.color}40`, borderRadius: 'var(--radius-full)', padding: '1px 7px' }}>{a}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.82rem' }}>{row.supervisor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CTASection
        title="Want to Join This Team?"
        subtitle="We're looking for part-time specialist engineers to supervise AI agent output. Work at the intersection of AI and human judgment."
        primaryCTA={{ label: 'See Open Roles', href: '/careers' }}
        ghostCTA={{ label: 'Learn More About SocioFi', href: '/about/story' }}
      />
    </>
  );
}
