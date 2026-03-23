import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import AboutSubNav from '@/components/about/AboutSubNav';
import ScrollReveal from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';

export const metadata: Metadata = {
  title: 'Our Story — SocioFi Technology',
  description: 'How two BUET graduates built an AI-native company from Dhaka — and why the team page lists 10 AI development agents alongside the founders.',
};



const CHAPTERS = [
  {
    num: '01',
    title: 'The Problem That Shouldn\'t Exist',
    body: [
      'In early 2024, Arifur Rahman had a product idea. Not an abstract idea — a specific, validated, actionable one. He had talked to potential customers. He had sketched the flows. He had even used AI coding tools to build a working prototype on his laptop. It ran. It worked. He was excited.',
      'Then he tried to ship it.',
      'The first agency he contacted quoted $80,000 and a four-month timeline. The second quoted $65,000 and said they\'d "need more discovery calls before committing to scope." The third was a freelancer who had excellent reviews and seemed genuinely excited — right up until three weeks in, after a $3,000 deposit, when they stopped responding.',
      'So Arifur went back to AI coding tools. He used everything available to him — cursor IDEs, AI assistants, code generation tools — and got further than he expected. The prototype was solid. The database schema was reasonable. The UI actually looked good.',
      'Then he tried to deploy it.',
      'The deployment process revealed a cascade of problems that the AI tools had quietly accumulated: environment variables hardcoded in the wrong places, database connections that worked locally but timed out in production, security configurations that were technically present but practically ineffective, and a background job system that simply didn\'t work outside of localhost. The AI had built everything it was asked to build — but nobody had asked it to build something that actually runs in production.',
      'Arifur spent three weeks trying to fix the deployment issues. He made progress on some, created new problems on others. He talked to other founders in online communities. Every single one had a version of the same story. The problem wasn\'t unique to him — it was structural. The AI tools were getting better every month, but the gap between "AI can build this" and "this works in production" wasn\'t closing. If anything, it was widening.',
      'This is the problem that shouldn\'t exist. The technology to build great software is increasingly accessible. The ability to turn that technology into production-ready products is increasingly scarce. That gap costs founders months of their lives and tens of thousands of dollars — and it doesn\'t have to.',
    ],
  },
  {
    num: '02',
    title: 'The Engineer Who Was Equally Frustrated',
    body: [
      'Kamrul Hasan was watching the same problem from the other side of the table.',
      'As a BUET-trained computer scientist with years of experience building production systems, Kamrul had a front-row seat to what AI coding tools could and couldn\'t do. He used them in his own work. He watched colleagues use them. He reviewed AI-generated code for clients.',
      'The pattern was consistent: AI coding tools were remarkably good at generating plausible-looking code. The structure was usually right. The syntax was clean. The documentation was better than most humans wrote. But beneath the surface, there were systematic failure modes that someone with production experience could spot immediately — and that someone without it would discover at the worst possible moment.',
      'Security configurations that looked correct but had subtle misconfigurations. Database queries that worked under light load and became catastrophically slow at scale. Error handling that caught the expected failures and silently swallowed the dangerous ones. Authentication implementations that passed every test and still had exploitable edge cases.',
      'Kamrul also watched the economics of the industry. Agencies were charging six figures for work that AI tools could accelerate dramatically — not because agencies were inefficient, but because they hadn\'t restructured their workflows around what AI actually enabled. The billing models hadn\'t changed. The timelines hadn\'t changed. Only the margins had changed.',
      'He wanted to build something different. Not another agency. Not another AI tool. A company built from the ground up around the insight that AI handles the volume and engineers handle the judgment. Where the billing model reflected actual costs instead of legacy pricing. Where clients paid for results, not for time.',
      'When Kamrul met Arifur and heard about the deployment failure story, he recognized the person his hypothetical company was built for. They started talking about what it would look like to build it together.',
    ],
  },
  {
    num: '03',
    title: 'August 1, 2024',
    body: [
      'SocioFi Technology was incorporated on August 1, 2024. There was no office. No funding round. No press release. Two laptops in Dhaka, a shared vision, and a decision that would define how they approached everything that followed.',
      'They decided not to pitch clients first.',
      'This was a deliberate, slightly risky decision. The conventional startup path would have been to find early customers immediately, start generating revenue, iterate based on feedback. Arifur and Kamrul chose differently: before they asked anyone to trust them with their software, they needed to prove to themselves that what they were promising actually worked.',
      'So instead of selling, they started building FabricxAI.',
      'The logic was clear: if they were going to tell clients that AI agents could run complex production systems, they needed to demonstrate that with something real — not in a controlled demo environment, but in an actual production context with actual constraints and actual failure modes. The garment manufacturing sector in Bangladesh offered exactly that: complex supply chains, high stakes, and a context where Kamrul had existing relationships and domain knowledge.',
      'The decision to build before selling added months to their path to revenue. But it gave them something more valuable: certainty. By the time they started talking to clients, they weren\'t speculating about what multi-agent AI systems could do. They had built one. They knew where it worked, where it struggled, and what it took to make it reliable.',
    ],
  },
  {
    num: '04',
    title: '22 Agents in a Factory',
    body: [
      'FabricxAI started with five agents. The initial scope was narrow by design: quality control detection in a Dhaka garment factory. Computer vision agents analyzing fabric samples. Pattern recognition on defect types. Reporting workflows that surfaced findings to human supervisors.',
      'It worked. Not perfectly, not immediately — there were false positive rates to tune, edge cases to handle, workflows to restructure. But it worked in a way that mattered: it caught things. Real defects, in a real factory, before they became real problems.',
      'The moment Kamrul remembers most clearly wasn\'t when a system flag matched a human catch. It was when it didn\'t — when the system identified a subtle defect in a fabric batch that three experienced human inspectors had passed. The defect was real. The fabric was rejected. No client received a bad product because of it.',
      'That was the proof they needed. Not "AI can automate a workflow" — every vendor in the world makes that claim. But: AI agents, built correctly, with the right architecture and the right human oversight, can reliably catch things that humans miss, at scale, in a production environment.',
      'From that proof point, FabricxAI expanded. Quality control grew into production tracking. Production tracking connected to supply chain management. Supply chain management generated analytics. Analytics informed quality control. By January 2025, the system had grown to 22 specialized agents, each handling a specific function within a coordinated workflow.',
      'The 22-agent system running in production was the architecture that would eventually become the NEXUS system at the core of SocioFi\'s own operations. Every design decision made under the constraints of a real garment factory — the fault tolerance, the human escalation logic, the audit trails, the approval workflows — those decisions transferred directly into how SocioFi would eventually run itself.',
    ],
  },
  {
    num: '05',
    title: 'Building the Machine That Builds',
    body: [
      'The lesson from FabricxAI wasn\'t just that AI agents could work in production. It was that the infrastructure around the agents mattered as much as the agents themselves.',
      'What made FabricxAI reliable wasn\'t any single agent — it was the pipeline. The way agents handed work to each other. The way human review was embedded at the right points. The way audit trails made it possible to understand what happened when something went wrong. The way the system degraded gracefully when one component had a problem, instead of failing completely.',
      'Kamrul started applying the same thinking to software development itself. What if Studio projects used a coordinated pipeline of agents — each specialized for a specific phase of development — instead of a single general-purpose AI doing everything?',
      'The result was DevBridge OS: a 10-agent development pipeline where SCOUT handles requirements analysis, HUNTER researches technical approaches, MIRROR generates initial code, ATLAS handles architecture review, FORGE manages integration, HAMMER runs automated testing, SENTINEL monitors for regressions, NEXUS coordinates the workflow, BEACON handles documentation, and SHIELD performs security analysis.',
      'Every Studio project runs through DevBridge. The pipeline doesn\'t replace the engineers — it runs alongside them, handling the systematic work so engineers can focus on the judgment calls. The speed improvement is real, but the quality improvement is more important: DevBridge makes it harder to accidentally skip steps, miss edge cases, or ship without adequate testing.',
    ],
  },
  {
    num: '06',
    title: '13 Agents Running the Company',
    body: [
      'By late 2025, SocioFi had successfully built multi-agent AI systems for clients in manufacturing, logistics, and B2B software. The pattern was consistent: well-architected agent systems could handle significant operational volume reliably, with appropriate human oversight at the right points.',
      'The obvious next question was: why weren\'t they using the same approach to run SocioFi itself?',
      'The answer was that they were about to. Kamrul spent the second half of 2025 designing NEXUS — not the orchestrator in DevBridge, but a 13-agent administrative system for SocioFi\'s own operations. The agents each had a specific function: INTAKE handling lead processing, HERALD managing email communications, SCRIBE writing content, HERALD overseeing communications, and so on.',
      'The design principle was the same as FabricxAI: agents do the operational work, humans do the judgment work. INTAKE could classify a lead in 30 seconds — but Arifur still decides how to respond. SCRIBE could draft an article in 20 minutes — but Kamrul still reviews it for technical accuracy. HERALD could prepare 14 emails in a day — but Arifur still approves each one before it sends.',
      'The approval system isn\'t bureaucratic overhead. It\'s the architecture. It\'s what makes the whole system trustworthy. Anyone who receives an email from SocioFi is receiving something a founder has read and approved — they\'re not getting automated output that nobody looked at. The transparency about how the system works is itself part of what makes clients trust it.',
      'By December 2025, 13 agents were running SocioFi\'s operations around the clock. Two founders were reviewing their output and making the final calls. The approach worked.',
    ],
  },
  {
    num: '07',
    title: 'The Team Page Decision',
    body: [
      'When it came time to build the SocioFi website, Arifur and Kamrul faced a genuine branding question: what do we do about the team page?',
      'Most companies in their position would have done one of two things. Some would have omitted a team page entirely, or listed only the founders. Others would have listed human employees who don\'t exist yet — using stock photography and invented names to appear larger than they are.',
      'Both options felt wrong.',
      'Arifur\'s argument was simple: if SocioFi was going to sell AI agent systems to clients, and the pitch was that those clients should trust their operations to AI agents, then SocioFi had to demonstrate that it trusted its own operations to AI agents. You can\'t say "AI agents are reliable enough to run your business" while hiding the fact that AI agents run yours.',
      'Kamrul\'s argument was about accuracy. The agents ARE the team. They process every lead, write every content piece, send every email draft, monitor every system, generate every report. Presenting SocioFi as a traditional agency with human employees would be factually misleading. Presenting it honestly — as an AI-native company where agents do the operational work and founders make the decisions — was simply accurate.',
      'The decision they made was radical transparency. Put the agents on the team page. Name them. Give them titles. Explain what they do. Be explicit about what they can and can\'t do, and who supervises them.',
      'The response from clients has been consistently positive. Not because clients love the idea of AI agents in principle, but because the transparency itself is reassuring. They know exactly what they\'re working with. They know who reviews the output. They know the approval chain. That knowledge is worth more than the comfortable fiction of a larger human team.',
    ],
  },
  {
    num: '08',
    title: "What's Next",
    body: [
      'The next phase of SocioFi\'s development is straightforward: add human supervisors.',
      'For each of the eight divisions, SocioFi plans to hire a part-time specialist engineer whose job is to supervise the AI agents working in that division. Not to do the work — the agents do the work. But to verify the work, catch edge cases, and provide the human expertise that AI can\'t replicate.',
      'These supervisors will come from SocioFi Guild — a managed network of specialist engineers that Arifur and Kamrul are building in parallel with the rest of the company. The Guild is not a traditional freelancer marketplace. It\'s a curated network of engineers who have demonstrated specific technical competence, whose work has been evaluated through actual projects, and who understand how to work alongside AI agents rather than in spite of them.',
      'The long-term vision is a company that scales without the usual overhead. As SocioFi takes on more clients, more agent capacity can be deployed without proportional increases in headcount. Human supervisors and founders provide the judgment layer; agents provide the execution layer. The ratio stays consistent even as volume grows.',
      'There is a version of this company that looks, in five years, like a 200-person agency. Arifur and Kamrul are not building that company. They are building a company where the AI-human ratio stays intelligently managed — where growth means deploying more agents with better supervision, not hiring more people to do what agents already do reliably.',
      'The goal is not to build the biggest company. The goal is to build the most effective one.',
      'SocioFi Technology was founded on August 1, 2024, in Dhaka, Bangladesh. If you\'re curious about working with us, start at /studio. If you want to join the team — human or supervisor role — visit /careers.',
    ],
  },
];

export default function StoryPage() {
  return (
    <>
      <style>{`
        .story-body p { margin: 0 0 24px; }
        .story-body p:last-child { margin-bottom: 0; }
        .chapter-number {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .chapter-title {
          font-family: var(--font-headline);
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 28px;
          line-height: 1.2;
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(89,163,146,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        <Container narrow>
          <p className="sec-label">Extended narrative</p>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.1 }}>
            The Story of SocioFi Technology
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 24 }}>
            How two BUET graduates built an AI-native company from Dhaka — and why the team page lists 10 AI development agents alongside the founders.
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>SOCIOFI TEAM · PUBLISHED MARCH 2026</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>· 8 CHAPTERS · ~12 MIN READ</span>
          </div>
        </Container>
      </section>

      <AboutSubNav active="/about/story" />

      {/* ── Chapters ─────────────────────────────────────────────────────── */}
      {CHAPTERS.map((chapter, i) => (
        <section
          key={i}
          style={{
            paddingBlock: 'var(--space-section)',
            background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)',
          }}
        >
          <Container narrow>
            <ScrollReveal>
              <p className="chapter-number">Chapter {chapter.num}</p>
              <h2 className="chapter-title">{chapter.title}</h2>
              <div className="story-body" style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
                {chapter.body.map((para, pi) => (
                  <p key={pi}>{para}</p>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </section>
      ))}

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 48, background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <Container narrow>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.04em', lineHeight: 1.7, margin: 0 }}>
            SocioFi Technology was founded on August 1, 2024, in Dhaka, Bangladesh. If you&apos;re curious about working with us, start at{' '}
            <a href="/studio" style={{ color: 'var(--teal)', textDecoration: 'none' }}>/studio</a>.
            If you want to join the team (human or supervisor role), visit{' '}
            <a href="/careers" style={{ color: 'var(--teal)', textDecoration: 'none' }}>/careers</a>.
          </p>
        </Container>
      </section>

      <CTASection
        title="Ready to build something together?"
        subtitle="Tell us what you're working on. We'll tell you exactly how we'd approach it, what it costs, and when it would be done."
        primaryCTA={{ label: 'Start a project', href: '/studio/start-project' }}
        ghostCTA={{ label: 'Read the values', href: '/about/values' }}
      />
    </>
  );
}
