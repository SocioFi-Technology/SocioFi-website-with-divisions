import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';

export const metadata: Metadata = {
  title: 'Values — SocioFi Technology',
  description: 'Six things we won\'t compromise on. The principles behind every decision at SocioFi Technology.',
};

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
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
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

const VALUES = [
  {
    num: '01',
    title: '"We say what things cost."',
    story: [
      'Arifur once received a "change order" for $15,000 that nobody had mentioned during the original project discussion. The agency explained that "scope naturally evolves" and that this kind of adjustment was "standard in the industry." He paid it, because the project was too far along to walk away. He also never worked with that agency again.',
      'This experience — repeated in various forms by almost every founder and SMB owner we\'ve talked to — shaped one of SocioFi\'s most non-negotiable principles: real numbers, on the website, before the first conversation.',
    ],
    showsUp: [
      'Pricing is published on the website. Not "starting from" pricing — actual packages with actual prices.',
      'Scope changes require written approval before work begins. No change order surprises.',
      'Ventures terms are published publicly. No negotiation opacity.',
    ],
    founderQuote: { text: 'The moment you say "we\'ll figure out pricing later," you\'ve already created the conditions for someone to feel burned.', attr: 'Arifur Rahman, CEO' },
    agentEnforcement: 'HERALD\'s welcome emails always include a pricing range that matches the client\'s budget and project scope. INTAKE flags leads where the stated budget is significantly misaligned with the project description — before anyone wastes time on a conversation that can\'t go anywhere.',
  },
  {
    num: '02',
    title: '"We explain in plain English."',
    story: [
      'The pattern shows up in every client conversation: technical jargon is often used not to communicate, but to avoid communicating. "We\'re implementing a microservices architecture with Kubernetes orchestration" sounds more impressive than "we\'re organizing the software so it\'s easier to update different parts separately" — but the second one is what the client actually needed to hear.',
      'SocioFi\'s clients are smart. They\'re just not technical. The difference matters. Smart non-technical people can make excellent decisions about their software when given information they can understand. They can\'t make good decisions based on jargon that sounds like it means something.',
    ],
    showsUp: [
      'Every client update is written for the founder, not for the engineer. "Your payment system is now live and handling real transactions" instead of "the payment gateway integration has been deployed to production."',
      'Technical concepts are always accompanied by what they mean for the client\'s business.',
      'PILOT, our AI assistant, is trained to detect when it\'s using jargon and rewrite in plain English.',
    ],
    founderQuote: { text: 'If a client can\'t understand what we\'re telling them, that\'s our failure. Not their limitation.', attr: 'Arifur Rahman, CEO' },
    agentEnforcement: 'HERALD\'s system prompt includes explicit instructions to flag any technical jargon in drafts and suggest plain-English alternatives. CHRONICLE\'s client reports use a readability check before they\'re sent for review.',
  },
  {
    num: '03',
    title: '"We build things that work."',
    story: [
      'There is a category of software project outcome that is technically a delivery but practically a failure: the demo that breaks in production, the prototype that can\'t handle real users, the codebase that works today and becomes unmaintainable in six months.',
      'Kamrul has reviewed hundreds of AI-generated codebases. The failure mode is consistent: the code is syntactically correct, passes basic tests, and appears to implement the requirements — but has systematic vulnerabilities in security, performance, and maintainability that only surface under real conditions. Shipping software like this is not delivering value; it\'s deferring cost.',
    ],
    showsUp: [
      'Every piece of code generated by AI is reviewed by a senior engineer before deployment.',
      'DevBridge runs automated security, performance, and maintainability analysis on every project.',
      'Services division provides ongoing monitoring so issues are caught before they become client problems.',
    ],
    founderQuote: { text: 'AI writes great code at the sentence level. Engineers are responsible for whether it works at the paragraph level, the page level, and the book level.', attr: 'Kamrul Hasan, CTO' },
    agentEnforcement: 'SENTINEL monitors every client system in Services and Cloud, running continuous health checks. PULSE monitors SENTINEL. CHRONICLE tracks incident rates across the portfolio and flags any system with increasing error rates for immediate review.',
  },
  {
    num: '04',
    title: '"Your code is yours."',
    story: [
      'Software lock-in is a genuine industry problem. It takes many forms: proprietary platforms that can\'t be migrated away from, codebases that depend on agency-owned infrastructure, licensing models that make the client dependent on the vendor for every change.',
      'The outcome is always the same: the client who thought they owned their software discovers, at the worst possible moment, that they\'re actually a subscriber to it. When they want to change vendors, or when the vendor raises prices, or when the vendor goes out of business — they\'re stuck.',
    ],
    showsUp: [
      'Clients receive 100% of the source code, infrastructure configs, and documentation at the end of every engagement.',
      'No proprietary platforms. No vendor lock-in. You can take the code and deploy it anywhere.',
      'No licensing fees for code we built for you. You paid for it. You own it.',
    ],
    founderQuote: { text: 'The goal is for every client to be capable of walking away with everything they\'ve paid us to build. That\'s what makes us trustworthy — not contractual obligations.', attr: 'Arifur Rahman, CEO' },
    agentEnforcement: 'NEXUS tracks all client project deliverables and flags any project that hasn\'t had a code handoff scheduled within 2 weeks of completion. BEACON (in DevBridge) generates comprehensive documentation so clients\' future teams can understand the code without needing to call us.',
  },
  {
    num: '05',
    title: '"We tell you when AI isn\'t the answer."',
    story: [
      'The most common question SocioFi gets isn\'t "can you build X?" It\'s "should I use AI for X?" The honest answer, in a significant minority of cases, is: probably not, or not yet, or not in the way you\'re imagining.',
      'AI is a powerful tool with specific strengths. It excels at volume, pattern recognition, automation of well-defined processes, and tasks where "good enough" output at scale beats "perfect" output in small quantities. It struggles at tasks requiring deep contextual judgment, novel problem-solving, genuine creativity, and anything where errors have high-stakes consequences that are difficult to catch.',
      'Being honest about these limitations costs SocioFi deals. Sometimes the right answer for a client is a simpler solution that doesn\'t involve AI at all, and that means losing the engagement. We\'d rather lose the deal than deliver a solution that doesn\'t actually serve the client.',
    ],
    showsUp: [
      'PILOT is trained to recommend simpler solutions when AI isn\'t the right fit for a described problem.',
      'Project scoping conversations always include an honest assessment of where AI adds clear value vs. where it adds complexity without proportional benefit.',
      'Lab publications document failures and limitations, not just successes.',
    ],
    founderQuote: { text: 'The companies that sell AI as the answer to everything are setting up their clients for expensive disappointments. We\'d rather be the company that said "not this time" when we meant it.', attr: 'Kamrul Hasan, CTO' },
    agentEnforcement: 'INTAKE\'s scoring system includes a "complexity appropriateness" metric that flags projects where the requested AI complexity may exceed the actual problem complexity. These get a note in the brief for Kamrul to review in the technical assessment.',
  },
  {
    num: '06',
    title: '"We stay."',
    story: [
      'The handoff problem is endemic in software development. A team builds something, delivers it, and moves on. A different team maintains it. A different team, again, handles the next feature. Nobody has the full context. Institutional knowledge lives in people who are no longer working on the project. The software gradually becomes harder to understand, maintain, and improve.',
      'SocioFi\'s Services division exists specifically because Arifur and Kamrul believe the handoff model is fundamentally broken. The team that understands the software best — because they built it — should be the team that keeps it running.',
    ],
    showsUp: [
      'Studio projects can transition to Services maintenance without any documentation or knowledge transfer overhead — the same team that built it maintains it.',
      'Services clients have a direct line to the engineers who understand their systems, not a generic support queue.',
      'SENTINEL and WARDEN give Services the operational capacity to monitor and respond without the overhead of a traditional support team.',
    ],
    founderQuote: { text: 'The best maintenance arrangement is one where the people fixing the problem also remember building it. That\'s not a luxury — it\'s how software stays healthy.', attr: 'Kamrul Hasan, CTO' },
    agentEnforcement: 'COMPASS tracks which clients have active Services engagements and which completed Studio projects don\'t. It flags to Arifur when a client has been without monitoring for more than 30 days post-launch. CHRONICLE tracks time-to-resolution metrics for all Services tickets.',
  },
];

export default function ValuesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', left: '15%', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(89,163,146,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <Container>
          <ScrollReveal>
            <p className="sec-label">Our Values</p>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text-primary)', marginBottom: 20, maxWidth: 700 }}>
              Six Things We Won&apos;t Compromise On.
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 620 }}>
              Every decision at SocioFi comes back to these six principles. They&apos;re not aspirations — they&apos;re constraints. Here&apos;s where each one came from, how it shows up in our work, and how our AI agents enforce it.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      <SubNav active="/about/values" />

      {/* ── Values ───────────────────────────────────────────────────────── */}
      {VALUES.map((val, i) => (
        <section
          key={i}
          id={`value-${i + 1}`}
          style={{ paddingBlock: 'var(--space-section)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}
        >
          <Container>
            <ScrollReveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 48px', maxWidth: 900, marginInline: 'auto' }}>
                {/* Number */}
                <div style={{ paddingTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.14em' }}>{val.num}</span>
                </div>

                <div>
                  {/* Title */}
                  <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--teal)', letterSpacing: '-0.02em', marginBottom: 32, lineHeight: 1.15 }}>
                    {val.title}
                  </h2>

                  {/* The story */}
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>The story behind this value</p>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: 36 }}>
                    {val.story.map((para, pi) => (
                      <p key={pi} style={{ margin: pi < val.story.length - 1 ? '0 0 20px' : 0 }}>{para}</p>
                    ))}
                  </div>

                  {/* How it shows up */}
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>How it shows up</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {val.showsUp.map((item, ii) => (
                      <li key={ii} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: 'var(--font-body)', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(89,163,146,0.15)', border: '1px solid rgba(89,163,146,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)' }} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Founder quote */}
                  <div style={{ borderLeft: '2px solid var(--teal)', paddingLeft: 24, marginBottom: 32 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.75, color: 'var(--text-primary)', marginBottom: 8 }}>
                      &ldquo;{val.founderQuote.text}&rdquo;
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: 0 }}>— {val.founderQuote.attr.toUpperCase()}</p>
                  </div>

                  {/* Agent enforcement */}
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#4A6CB8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>How our AI agents enforce this</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{val.agentEnforcement}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      ))}

      {/* ── Index ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 80, background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Quick reference" title="All Six Values" centered className="mb-10" />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, maxWidth: 900, marginInline: 'auto' }}>
            {VALUES.map((val, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <a href={`#value-${i + 1}`} style={{
                  display: 'block', padding: '20px 24px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', transition: 'all 0.3s var(--ease)',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>{val.num}</span>
                  <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--teal)' }}>{val.title}</span>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="See how these values shape our work"
        subtitle="Read the full story of how SocioFi was built, or start a project and experience the values in practice."
        primaryCTA={{ label: 'Start a project', href: '/studio/start-project' }}
        ghostCTA={{ label: 'Read our story', href: '/about/story' }}
      />
    </>
  );
}
