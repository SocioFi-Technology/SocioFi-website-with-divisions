import AudienceLanding, { type AudienceLandingContent } from '@/templates/AudienceLanding';
import { Rocket, Code, Shield, Globe, Brain, Wrench, Target, Zap, Users } from '@/lib/icons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ── Solution data map ─────────────────────────────────────────────────────────

const SOLUTIONS: Record<string, { metadata: Metadata; content: AudienceLandingContent }> = {

  'for-founders': {
    metadata: {
      title: 'For Founders — SocioFi Studio',
      description:
        "You've built a prototype with AI tools. Now you need someone to make it production-ready. SocioFi Studio is that team.",
    },
    content: {
      hero: {
        badge: 'For founders',
        headline: (
          <>
            The gap between{' '}
            <span className="gradient-text">&ldquo;AI can build this&rdquo;</span>
            {' '}and &ldquo;it actually works&rdquo;
          </>
        ),
        description:
          "You've used AI coding tools to get something working. The demo is impressive. But it's not a product — not yet. We close the gap between prototype and production.",
        buttons: [
          { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
          { label: 'See how we work', href: '/studio/process', variant: 'ghost' },
        ],
      },
      painPoints: {
        label: 'Who this is for',
        title: "You built the prototype. Now you need to ship it.",
        intro:
          "You're technical enough to use AI coding tools. You're not technical enough to deploy to production, debug authentication, wire up Stripe, or know why your app crashes under load. That gap — between 'it works on my machine' and 'it's live and people are paying for it' — is exactly what we close.",
        points: [
          {
            title: 'Solo founders building their first product',
            description:
              "You have an idea, a prototype, and a deadline. You need someone who can take what you've built and make it real — without a three-month engagement and a $100k price tag.",
          },
          {
            title: "Founders whose AI prototype is broken",
            description:
              "The code worked in development. In production it's a different story — no auth, no Stripe, the database crashes. We diagnose this and fix it properly.",
          },
          {
            title: 'Founders who tried to hire developers',
            description:
              "You posted on job boards, talked to agencies, got quoted 6 months and $80,000. You need a faster, more direct path to a working product.",
          },
          {
            title: 'Founders preparing for fundraising or launch',
            description:
              "You have investors interested or a launch date set. You need the product to hold up under scrutiny — and someone who can move fast.",
          },
        ],
        closing:
          "If you have a prototype that needs to become a product — and you need it in weeks, not months — we should talk.",
      },
      process: [
        {
          title: 'Tell us what you have',
          description:
            "Send us a link to your prototype or describe what you're building. We review it and come back within 4 hours with a clear picture of what it would take.",
          duration: 'Day 1',
        },
        {
          title: 'Scoping call (30 min)',
          description:
            "A senior engineer goes through your project, identifies the gaps, and gives you an honest assessment. You leave with a clear path forward.",
          duration: 'Day 2–3',
        },
        {
          title: 'Fixed proposal',
          description:
            "Exact deliverables, timeline, and price — in writing. We don't start until you've approved it. No scope creep, no surprise invoices.",
          duration: 'Day 4',
        },
        {
          title: 'We build. You see progress.',
          description:
            "We build in 1-week cycles. Real progress at each checkpoint — not just status updates. The code is yours throughout.",
          duration: 'Weeks 1–N',
        },
      ],
      processLabel: 'How it works',
      processTitle: 'From prototype to product in four steps',
      processSubtitle: "No long discovery phases. No months of back-and-forth. Clear scoping and fast delivery.",
      deliverables: [
        {
          icon: <Rocket size={22} aria-hidden="true" />,
          title: 'Production deployment',
          description:
            "Your product launches on real infrastructure. Automatic deployments, SSL, custom domain, uptime monitoring. Not localhost.",
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Secure authentication',
          description:
            "Proper login flows, session management, password resets, OAuth. The auth layer that AI-generated code almost always gets wrong.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'Payment integration',
          description:
            "Stripe connected properly — one-time payments, subscriptions, webhooks, refunds. Revenue infrastructure that handles edge cases.",
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Clean, documented code',
          description:
            "Code you own and can hand to another developer. No spaghetti architecture, no hardcoded secrets.",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: '30 days post-launch support',
          description:
            "Something breaks after launch? We fix it — no extra charge. You're not on your own the moment we hand over the keys.",
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'Fixed price',
          description:
            "You know what you're paying before we start. No hourly billing, no scope creep invoices. If the estimate was wrong, that's on us.",
        },
      ],
      deliverablesLabel: 'What you get',
      deliverablesTitle: 'Everything a founder needs to launch',
      metrics: [
        { numeric: 50, suffix: '+', label: 'Founder projects shipped' },
        { numeric: 4, label: 'Average weeks to launch' },
        { numeric: 30, label: 'Days post-launch support included' },
        { numeric: 100, suffix: '%', label: 'Code ownership transferred' },
      ],
      testimonials: [
        {
          quote:
            "I had a working demo but it wasn't production-ready. SocioFi took what I built and made it real. We launched in 6 weeks and I haven't had a single critical bug since.",
          author: 'Marcus T.',
          role: 'Founder',
          company: 'BuildFlow',
        },
        {
          quote:
            "They scoped the project in 30 minutes and gave me a fixed price the same day. Other agencies wanted 2 weeks just to tell me what it would cost.",
          author: 'Sarah K.',
          role: 'Solo Founder',
          company: 'Independent',
        },
        {
          quote:
            "The AI prototype I built had authentication that could be bypassed in seconds. SocioFi found it in the first review, fixed it, and rebuilt the whole auth layer properly.",
          author: 'Yemi A.',
          role: 'Founder',
          company: 'DataLayer',
        },
      ],
      pricingTeaser: {
        headline: 'What does it actually cost?',
        description:
          'Our MVP Sprint starts from $4,500. A full product with multiple user flows typically runs $8,000–$25,000. We give you the exact number after the scoping call.',
        href: '/studio/pricing',
        cta: 'See Studio pricing',
      },
      faqs: [
        {
          question: "What if my prototype is really messy?",
          answer:
            "That's fine — it's what we expect. We review what you have and either build on top or recommend a clean-start approach. We tell you which before you commit.",
        },
        {
          question: "Do you sign NDAs?",
          answer:
            "Yes. We sign mutual NDAs before the scoping call if requested. Your idea and your code are confidential.",
        },
        {
          question: "What tech stack do you use?",
          answer:
            "We default to Next.js, TypeScript, PostgreSQL, and Vercel — scalable and easy to hand to another team. If you have an existing stack, we work with that too.",
        },
        {
          question: "Can I be involved in the build?",
          answer:
            "Yes. You'll have visibility into the project board and get weekly check-ins. If you want to be more hands-on, we can accommodate that.",
        },
      ],
      cta: {
        title: "Ready to turn your prototype into a product?",
        subtitle:
          "Tell us what you're building and where you're stuck. We'll give you a clear path forward within 4 hours.",
        primaryCTA: { label: 'Start a project', href: '/studio/start-project' },
        ghostCTA: { label: 'See our process', href: '/studio/process' },
        note: 'Free scoping call. Fixed-scope pricing. No commitment until you approve the proposal.',
      },
    },
  },

  'for-smbs': {
    metadata: {
      title: 'For SMBs — SocioFi Studio',
      description:
        "Your business needs software. You don't need a dev team. Internal tools, customer portals, and automation built for how SMBs actually work.",
    },
    content: {
      hero: {
        badge: 'For small and medium businesses',
        headline: (
          <>
            Your business needs software.{' '}
            <span className="gradient-text">You don&apos;t need a dev team.</span>
          </>
        ),
        description:
          "Internal dashboards, customer portals, workflow automation, custom integrations. We build what your business needs to operate — without you needing to hire, manage, or retain engineers.",
        buttons: [
          { label: 'Discuss your project', href: '/studio/start-project', variant: 'primary' },
          { label: 'See our process', href: '/studio/process', variant: 'ghost' },
        ],
      },
      painPoints: {
        label: 'Who this is for',
        title: "Your business needs software your existing tools can't provide.",
        intro:
          "You've hit the ceiling of what off-the-shelf tools can do. The processes you're running manually could be automated. Your team is using spreadsheets where they should be using a proper system.",
        points: [
          {
            title: "Running critical processes in spreadsheets",
            description:
              "Inventory tracking, client management, project status, financial reporting — all in Excel or Google Sheets that break when someone uses the wrong formula.",
          },
          {
            title: "You need a customer-facing portal or app",
            description:
              "Your clients need to log in, see their data, submit requests, or track orders. No off-the-shelf tool does exactly what you need.",
          },
          {
            title: "Your team is doing work a computer could do",
            description:
              "Data entry from one system to another. Email notifications sent manually. Reports compiled from multiple sources every week. All of this is automatable.",
          },
          {
            title: "Your systems don't talk to each other",
            description:
              "Your CRM doesn't connect to your billing system. Your e-commerce platform doesn't update your stock tool. Every sync is manual.",
          },
        ],
        closing:
          "If you're running a business that needs custom software — and you don't have or want to manage an in-house development team — we're built for you.",
      },
      process: [
        {
          title: 'Discovery call',
          description:
            "We talk through the problem you're solving, the current process it replaces, and who will use it. 30 minutes is usually enough.",
          duration: 'Day 1',
        },
        {
          title: 'Requirements document',
          description:
            "We write up exactly what we're building — user flows, data model, integrations, access controls. You approve it before we quote.",
          duration: 'Day 3–5',
        },
        {
          title: 'Fixed proposal',
          description:
            "Price, timeline, deliverables — in writing. No hourly billing. No moving goalposts.",
          duration: 'Day 5–7',
        },
        {
          title: 'Build and handover',
          description:
            "We build in cycles, show you progress, and deploy when done. You receive the codebase, documentation, and a handover call.",
          duration: 'Weeks 2–N',
        },
      ],
      processLabel: 'How it works',
      processTitle: 'Scoped, built, and handed to you',
      processSubtitle: "No retainers. No ongoing dependency. You own the software.",
      deliverables: [
        {
          icon: <Target size={22} aria-hidden="true" />,
          title: 'Internal dashboards',
          description:
            "Operations dashboards, admin panels, reporting tools. Built for your team's exact workflow — not a generic template.",
        },
        {
          icon: <Users size={22} aria-hidden="true" />,
          title: 'Customer portals',
          description:
            "Client-facing apps where customers log in, track orders, submit requests, or access their data.",
        },
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: 'Workflow automation',
          description:
            "Automate the manual processes your team does every week. Data syncing, report generation, notification routing, approval workflows.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'System integrations',
          description:
            "Make your existing tools talk to each other. CRM, ERP, e-commerce, accounting — connected and synced.",
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Data management tools',
          description:
            "Replace critical spreadsheets with proper database-backed systems. Reliable, auditable, accessible to your whole team.",
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Full code ownership',
          description:
            "You own everything we build. No licensing fees, no platform dependency. The code goes with you.",
        },
      ],
      deliverablesLabel: 'What we build',
      deliverablesTitle: 'Software that fits how your business works',
      metrics: [
        { numeric: 50, suffix: '+', label: 'Projects shipped for SMBs' },
        { numeric: 4, label: 'Typical weeks to delivery' },
        { numeric: 0, label: 'Ongoing licensing fees' },
        { numeric: 100, suffix: '%', label: 'Code ownership transferred' },
      ],
      testimonials: [
        {
          quote:
            "We were running our entire client onboarding in a shared Google Sheet. SocioFi built us a proper portal in 5 weeks. The team hasn't touched the spreadsheet since.",
          author: 'Rebecca O.',
          role: 'Operations Director',
          company: 'Professional Services Firm',
        },
        {
          quote:
            "Fixed scope, fixed price — no surprises. They scoped the project clearly, hit every milestone, and the system has been running without issues for 8 months.",
          author: 'Layla A.',
          role: 'Head of Product',
          company: 'DataNest',
        },
        {
          quote:
            "We needed our CRM to push data to our billing tool automatically. SocioFi built the integration in 2 weeks. It saves 8 hours of manual work every month.",
          author: 'Thomas R.',
          role: 'Managing Director',
          company: 'Agency Group',
        },
      ],
      pricingTeaser: {
        headline: 'What does custom software cost for an SMB?',
        description:
          "Internal tools and integrations typically start from $3,500. Customer-facing applications run $8,000–$25,000 depending on scope. We give you the exact number in the proposal.",
        href: '/studio/pricing',
        cta: 'See Studio pricing',
      },
      faqs: [
        {
          question: "Do we need technical knowledge to work with you?",
          answer:
            "No. You tell us what the software needs to do in plain language. We write the specification, show it to you for approval, and build it.",
        },
        {
          question: "What happens after the project is delivered?",
          answer:
            "You get the codebase, documentation, and access to all infrastructure. You can self-maintain, bring in another developer, or engage us on a maintenance plan.",
        },
        {
          question: "Can you work with our existing systems?",
          answer:
            "Usually yes. We review your current tools during the discovery call and tell you what's feasible before scoping anything.",
        },
      ],
      cta: {
        title: "Tell us what your business needs.",
        subtitle:
          "Describe the process you want to automate or the tool you need. We'll scope it clearly and give you a fixed price.",
        primaryCTA: { label: 'Discuss your project', href: '/studio/start-project' },
        ghostCTA: { label: 'See our portfolio', href: '/studio/portfolio' },
        note: 'Fixed-scope pricing. No ongoing retainer required.',
      },
    },
  },

  'for-enterprises': {
    metadata: {
      title: 'For Enterprise Teams — SocioFi Studio',
      description:
        'Innovation speed without enterprise risk. Dedicated engineering team, SLA guarantees, compliance-ready architecture, and full security controls.',
    },
    content: {
      hero: {
        badge: 'For enterprise teams',
        headline: (
          <>
            Innovation speed.{' '}
            <span className="gradient-text">Without enterprise risk.</span>
          </>
        ),
        description:
          "Your internal IT backlog is 18 months long. Your team has the mandate and the budget. We act as a dedicated external engineering team — with the compliance, security, and process rigour your organisation demands.",
        buttons: [
          { label: 'Start the conversation', href: '/studio/start-project', variant: 'primary' },
          { label: 'See our portfolio', href: '/studio/portfolio', variant: 'ghost' },
        ],
      },
      painPoints: {
        label: 'Who this is for',
        title: "You have the mandate to build. The IT backlog is 18 months long.",
        intro:
          "You're a digital transformation lead, innovation director, or product manager at a company with real budget and real urgency. Internal engineering is fully committed. A large consultancy would cost ten times more and take twice as long. You need a focused, senior external team that operates with enterprise-grade rigour.",
        points: [
          {
            title: "Innovation and digital transformation leads",
            description:
              "You've been tasked with building a new tool, automating a process, or launching a new digital product. Internal engineering is unavailable or the wrong fit.",
          },
          {
            title: "Product managers without a delivery team",
            description:
              "You know what needs to be built. You have wireframes, user research, and stakeholder sign-off. You need engineers who can execute.",
          },
          {
            title: "Teams needing a proof-of-concept fast",
            description:
              "You need something real — not a Figma mock — to demonstrate value before the next board meeting or budget cycle.",
          },
          {
            title: "Operations teams with compliance requirements",
            description:
              "You need software that meets your organisation's security standards, data residency requirements, and audit trail obligations.",
          },
        ],
        closing:
          "If you have the business context and the budget — but not the engineers — we operate as your dedicated technical execution partner.",
      },
      process: [
        {
          title: "Stakeholder alignment call",
          description:
            "We talk to you and relevant stakeholders to understand the business context, success criteria, constraints, and security requirements.",
          duration: 'Week 0',
        },
        {
          title: "Technical specification",
          description:
            "We translate business requirements into a clear technical specification — in plain English — that your team can understand and approve before anything is built.",
          duration: 'Week 1',
        },
        {
          title: "Staged build with visibility",
          description:
            "We build in 1-week cycles with a shared project board. Stakeholders see progress at each checkpoint. No surprises.",
          duration: 'Weeks 2–N',
        },
        {
          title: "Handover and documentation",
          description:
            "We deliver code, documentation, and a handover session. We can also set up ongoing support if you need continued engineering availability.",
          duration: 'Final week',
        },
      ],
      processLabel: 'How we work with enterprise teams',
      processTitle: 'Business requirements in. Working software out.',
      processSubtitle: "We translate strategy into code. Your team doesn't need to understand the technology.",
      deliverables: [
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Compliance-ready architecture',
          description:
            "Proper authentication, data access controls, audit logging, and data residency options. The standard your IT and legal teams expect.",
        },
        {
          icon: <Target size={22} aria-hidden="true" />,
          title: 'SSO and enterprise identity',
          description:
            "Okta, Azure AD, Google Workspace — we integrate with your existing identity provider so new tools fit into how your organisation already authenticates.",
        },
        {
          icon: <Rocket size={22} aria-hidden="true" />,
          title: 'Rapid delivery cycles',
          description:
            "1-week build cycles with visible progress. Stakeholders see the product taking shape — not just status reports.",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'Plain-English communication',
          description:
            "Written updates in plain language. No jargon. No 'waiting on a dependency' without explaining what that means for the timeline.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'Integration with existing systems',
          description:
            "We connect new tools to your existing infrastructure — data warehouses, CRMs, ERPs — so the product fits into how your organisation works.",
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'SLA-backed ongoing support',
          description:
            "After delivery, we offer maintenance plans with defined response times so you always have engineering support available.",
        },
      ],
      deliverablesLabel: 'What you get',
      deliverablesTitle: 'A technical partner that meets your standards',
      metrics: [
        { numeric: 50, suffix: '+', label: 'Projects delivered for enterprise teams' },
        { numeric: 4, label: 'Average weeks to delivery' },
        { numeric: 100, suffix: '%', label: 'Fixed-price engagements' },
        { numeric: 30, label: 'Days post-launch support included' },
      ],
      testimonials: [
        {
          quote:
            "Our internal IT team said 18 months. SocioFi delivered in 8 weeks. Same outcome, fraction of the timeline, fraction of the cost.",
          author: 'Simon W.',
          role: 'Operations Director',
          company: 'Financial Services Firm',
        },
        {
          quote:
            "They wrote the technical spec in plain English and asked us to approve it before building anything. That level of transparency is rare in external partners.",
          author: 'Claire M.',
          role: 'Head of Innovation',
          company: 'Enterprise Services Group',
        },
        {
          quote:
            "We had three developers leave mid-project and a deadline in 4 weeks. SocioFi stepped in, understood the codebase overnight, and shipped on time.",
          author: 'Dominic F.',
          role: 'CTO',
          company: 'ShiftOps',
        },
      ],
      pricingTeaser: {
        headline: "What's the budget conversation like?",
        description:
          "We work with teams at all budget levels. A focused internal tool starts from $5,000. More complex multi-team systems run higher. We scope before we quote — fixed prices always.",
        href: '/studio/pricing',
        cta: 'See Studio pricing',
      },
      faqs: [
        {
          question: "Do you work under NDAs and data processing agreements?",
          answer:
            "Yes. We sign NDAs, data processing agreements, and any other legal requirements your organisation needs before work begins.",
        },
        {
          question: "Can you integrate with our SSO and corporate systems?",
          answer:
            "Yes. We've integrated with Okta, Azure AD, Google Workspace, Salesforce, and most standard enterprise systems.",
        },
        {
          question: "How do you handle stakeholder review cycles?",
          answer:
            "We accommodate review checkpoints at the end of each build cycle. Feedback goes into the spec for the next cycle. We keep the process moving.",
        },
        {
          question: "What if our requirements change?",
          answer:
            "Scope changes happen in writing, with a clear impact assessment before we action anything. You always know what a change will cost before you approve it.",
        },
      ],
      cta: {
        title: "Ready to move faster than your IT backlog?",
        subtitle:
          "Tell us what your team needs to build. We'll show you how quickly it can happen.",
        primaryCTA: { label: 'Start the conversation', href: '/studio/start-project' },
        ghostCTA: { label: 'See our portfolio', href: '/studio/portfolio' },
        note: 'NDA available on request. Fixed-scope pricing.',
      },
    },
  },
};

// ── Route handlers ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(SOLUTIONS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const solution = SOLUTIONS[params.slug];
  if (!solution) return {};
  return solution.metadata;
}

export default function StudioSolutionPage({ params }: { params: { slug: string } }) {
  const solution = SOLUTIONS[params.slug];
  if (!solution) notFound();
  return <AudienceLanding content={solution.content} />;
}
