import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Code, Shield, Rocket, Wrench, Globe, Brain, Database, Layers, GitBranch, Zap, Target } from '@/lib/icons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ── Service data map ───────────────────────────────────────────────────────────

const SERVICES: Record<string, { metadata: Metadata; content: ServiceDetailContent }> = {

  // ── 6 Core Service Pages ───────────────────────────────────────────────────

  'product-development': {
    metadata: {
      title: 'Product Development — SocioFi Studio',
      description:
        'From idea to scaled product. Full-stack applications built with AI assistance and reviewed by senior engineers. Fixed scope, fixed price.',
    },
    content: {
      hero: {
        badge: 'Studio · Product Development',
        headline: (
          <>
            From Idea to{' '}
            <span className="gradient-text">Scaled Product.</span>
          </>
        ),
        description:
          "You have a product idea but no team to build it properly. We take it from architecture through to a deployed, production-ready application — using AI to accelerate the build while our engineers ensure it actually works.",
        buttons: [
          { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
          { label: 'See our work', href: '/studio/portfolio', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'The reality',
        headline: 'Building software is easy. Building software that lasts is not.',
        description:
          "AI coding tools have made it possible to generate a working prototype in days. But prototypes are not products. The gap between 'it works on my machine' and 'it's live, stable, and handling real users' is where most projects fail.",
        points: [
          'AI-generated code has no architecture — it accumulates problems from line one',
          'Deployment, hosting, and infrastructure require real engineering knowledge',
          'Authentication, payments, and data security cannot be figured out later',
          'Nobody is available at 2am when the database goes down',
        ],
      },
      capabilities: [
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Full-stack web applications',
          description:
            'Next.js, React, Node.js, PostgreSQL, Redis. We build the whole thing — frontend, backend, database, API. Scalable from day one.',
        },
        {
          icon: <Rocket size={22} aria-hidden="true" />,
          title: 'Mobile applications',
          description:
            'React Native for cross-platform apps, or native Swift/Kotlin when the use case demands it. Submitted to the App Store and Play Store.',
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Authentication & security',
          description:
            'Secure login flows, role-based access control, OAuth integrations, data encryption. Security is designed in — not bolted on.',
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'Payments & subscriptions',
          description:
            'Stripe integration, subscription billing, invoicing, refunds, webhooks. Revenue infrastructure that handles edge cases gracefully.',
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'AI feature integration',
          description:
            'Document processing, natural language search, smart recommendations, workflow automation. AI capabilities that work in production.',
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'Infrastructure & deployment',
          description:
            'Managed hosting on Vercel, Railway, or AWS. Automatic deployments, error monitoring, uptime alerts. Your app stays up.',
        },
      ],
      capabilitiesLabel: 'What we build',
      capabilitiesTitle: 'Every layer of the stack',
      process: [
        {
          title: 'Scoping call (30 min)',
          description:
            'A senior engineer reviews your idea and asks the right questions. We map out what needs to be built, what the dependencies are, and what the risks look like.',
          duration: 'Week 0',
        },
        {
          title: 'Fixed-scope proposal',
          description:
            "You receive a written proposal: exact deliverables, timeline, and price. We don't start building until you've approved the scope in writing.",
          duration: 'Week 0–1',
        },
        {
          title: 'Architecture & setup',
          description:
            'We design the system architecture, set up the repository, configure the infrastructure, and establish the development workflow before a single feature is written.',
          duration: 'Week 1',
        },
        {
          title: 'Build cycles',
          description:
            'We build in 1–2 week cycles. You see real progress at each checkpoint — not a big reveal at the end. Scope changes are handled in writing.',
          duration: 'Weeks 2–N',
        },
        {
          title: 'QA and launch',
          description:
            "Full testing pass, performance profiling, security review, and pre-launch checklist. We don't ship until we'd be comfortable with 10,000 users on day one.",
          duration: 'Final week',
        },
        {
          title: '30-day post-launch support',
          description:
            'Every project includes 30 days of post-launch support. Something unexpected breaks after go-live? We fix it at no extra charge.',
          duration: '+30 days',
        },
      ],
      processLabel: 'How it works',
      processTitle: 'A clear path from idea to live',
      caseStudy: {
        label: 'Case study',
        headline: 'From broken prototype to 10,000 active users in 8 weeks',
        description:
          "A founder had a working demo built with an AI coding platform — but it crashed under load, had no authentication, and couldn't connect to Stripe. We rebuilt the architecture, added proper auth and payments, deployed to managed infrastructure, and launched.",
        result: '10,000',
        resultLabel: 'active users within 8 weeks of launch',
        href: '/studio/portfolio/rescue-to-launch',
      },
      faqs: [
        {
          question: 'How long does a typical project take?',
          answer:
            'An MVP Sprint runs 3–6 weeks. A full product with multiple features typically runs 8–16 weeks. We give you a specific timeline in the proposal — not a range.',
        },
        {
          question: 'Do I own the code?',
          answer:
            'Yes. All intellectual property developed for you transfers to you on delivery. Source code, repositories, documentation — yours to keep, modify, and hand to anyone else.',
        },
        {
          question: 'What if my requirements change mid-project?',
          answer:
            'Scope changes happen. We handle them in writing, with a clear impact on timeline and price before we action anything. No surprise invoices.',
        },
        {
          question: 'Can you work with code I already have?',
          answer:
            'Yes. We review your existing codebase, document what we find, and recommend either building on top or a targeted rescue. Our Rescue & Ship service is designed for exactly this.',
        },
      ],
      cta: {
        title: 'Ready to build something real?',
        subtitle:
          "Tell us what you're building. We'll tell you what it takes, what it costs, and when we can ship it.",
        primaryCTA: { label: 'Start a project', href: '/studio/start-project' },
        ghostCTA: { label: 'See our pricing', href: '/studio/pricing' },
        note: 'Free scoping call. No commitment.',
      },
    },
  },

  'rescue-ship': {
    metadata: {
      title: 'Rescue & Ship — SocioFi Studio',
      description:
        "Already started with AI tools? We diagnose what went wrong, fix it properly, and get you to launch — without starting over.",
    },
    content: {
      hero: {
        badge: 'Studio · Rescue & Ship',
        headline: (
          <>
            Already Started with AI Tools?{' '}
            <span className="gradient-text">{"We'll Take It From Here."}</span>
          </>
        ),
        description:
          "AI-generated code breaks in predictable ways. We've seen it hundreds of times. We audit what you have, fix the problems that matter, and get you to launch — usually in 2–4 weeks.",
        buttons: [
          { label: 'Get a codebase audit', href: '/studio/start-project', variant: 'primary' },
          { label: 'See a rescue case study', href: '/studio/portfolio/rescue-to-launch', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'What went wrong',
        headline: 'AI-generated prototypes fail in the same ways, every time.',
        description:
          "If you built your prototype with an AI coding tool, you probably have a working demo. But the moment it meets real users, real data, or real infrastructure — things break. Here's what we find in almost every rescue.",
        points: [
          'No authentication, or auth that can be trivially bypassed',
          "Database schemas that don't handle real-world data volumes or edge cases",
          'Payment integrations wired to test mode or breaking on webhooks',
          'No error handling — one bad request takes the whole app down',
          'Secrets hardcoded in the codebase or committed to version control',
          'No deployment pipeline — still running on localhost or shared hosting',
        ],
      },
      capabilities: [
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Security audit & hardening',
          description:
            'We review authentication flows, data access patterns, API endpoints, and environment config for vulnerabilities — and fix what we find.',
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Architecture stabilisation',
          description:
            'We document what your codebase does, identify structural problems, and refactor the parts that will cause real issues under production load.',
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'Payment & integration repair',
          description:
            "Stripe, OAuth providers, third-party APIs — we fix integrations that are either broken or only work in happy-path scenarios.",
        },
        {
          icon: <Rocket size={22} aria-hidden="true" />,
          title: 'Production deployment',
          description:
            'We take you from localhost to a real hosting environment with automatic deployments, SSL, custom domain, and monitoring.',
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'Performance optimisation',
          description:
            'We profile your app under load, identify slow queries and unoptimised rendering paths, and fix them before your first real traffic spike.',
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'Test coverage baseline',
          description:
            'We add enough test coverage to give you confidence in the critical paths — auth, payments, data writes — before you go live.',
        },
      ],
      capabilitiesLabel: 'What we fix',
      capabilitiesTitle: 'Every layer that AI got wrong',
      process: [
        {
          title: 'Codebase audit (48 hours)',
          description:
            "We review your entire codebase and give you a written report: what works, what's broken, what's a security risk, and what the fix looks like. You decide whether to proceed.",
          duration: '48 hours',
        },
        {
          title: 'Rescue plan & proposal',
          description:
            'Based on the audit, we scope the rescue: exact work, timeline, and price. Some rescues take 1 week; some take 4. We tell you which before you commit.',
          duration: 'Day 3',
        },
        {
          title: 'Critical fixes first',
          description:
            'We prioritise issues that would cause data loss, security breaches, or payment failures. These get fixed before anything cosmetic.',
          duration: 'Week 1',
        },
        {
          title: 'Stabilise and ship',
          description:
            'Once critical issues are resolved, we stabilise the rest of the codebase and deploy to a production environment you own and control.',
          duration: 'Week 2–4',
        },
      ],
      processLabel: 'The rescue process',
      processTitle: 'Audit first. Fix with a plan.',
      caseStudy: {
        label: 'Case study',
        headline: 'Rescued a broken SaaS prototype in 2 weeks',
        description:
          "A founder came to us with a prototype built over three months — three critical authentication bugs, no Stripe connection, and a database schema that would have corrupted data at scale. We audited in 48 hours, fixed the critical issues in week one, and shipped to production in week two.",
        result: '2 weeks',
        resultLabel: 'from broken prototype to live product',
        href: '/studio/portfolio/rescue-to-launch',
      },
      faqs: [
        {
          question: 'Do you always recommend a rescue over a rebuild?',
          answer:
            'No. Sometimes the right answer is to rebuild from scratch — especially if the original code is structurally unsound. We tell you this in the audit, honestly, before you commit to anything.',
        },
        {
          question: 'What if the audit reveals more problems than expected?',
          answer:
            'We scope the audit separately from the fix. The audit gives you full information before you decide what to do. There are no surprises in the proposal.',
        },
        {
          question: 'How much does a rescue typically cost?',
          answer:
            "It depends on the scope of what's broken. Small rescues (1–2 critical fixes + deployment) start from $2,500. More complex stabilisation projects run $5,000–$15,000. The audit tells us which you're in for.",
        },
      ],
      cta: {
        title: "Is your prototype broken? Let's find out.",
        subtitle:
          "Send us a link to your repository or a description of what's not working. We'll tell you what we can do.",
        primaryCTA: { label: 'Get a codebase audit', href: '/studio/start-project' },
        ghostCTA: { label: 'Read a rescue case study', href: '/studio/portfolio/rescue-to-launch' },
        note: 'Audit completed within 48 hours.',
      },
    },
  },

  'automation-integration': {
    metadata: {
      title: 'Automation & Integration — SocioFi Studio',
      description:
        "Stop doing manually what software can do. We connect your tools, automate your workflows, and build the integrations your team actually needs.",
    },
    content: {
      hero: {
        badge: 'Studio · Automation & Integration',
        headline: (
          <>
            Stop Doing Manually{' '}
            <span className="gradient-text">What Software Can Do.</span>
          </>
        ),
        description:
          "Your team spends hours on tasks that should take seconds. Data entry between systems, manual reporting, status updates, file processing. We build the automations and integrations that give that time back — and keep running without anyone babysitting them.",
        buttons: [
          { label: 'Automate my workflow', href: '/studio/start-project', variant: 'primary' },
          { label: 'See automation types', href: '/studio/services/automation-integration/workflow', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'The hidden cost',
        headline: "Manual processes feel manageable — until you add up the hours.",
        description:
          "Most teams underestimate how much time they spend on work that could be automated. It's not one big process — it's a hundred small ones. Copying data from one system to another. Checking a spreadsheet to trigger an action. Sending the same email with slightly different content. Each one takes minutes. Together, they take days.",
        points: [
          'Data copied between systems manually — introducing errors and delays',
          'Reports built by hand each week from multiple sources',
          'Processes that depend on someone remembering to do them',
          "Integrations between tools that 'almost' talk to each other but need a human in the middle",
        ],
      },
      capabilities: [
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: 'Workflow automation',
          description:
            'Trigger actions based on events — new customer, completed order, status change. Build multi-step workflows that run without human intervention.',
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'API integrations',
          description:
            "Connect the tools your business already uses. CRMs, payment processors, communication platforms, data providers. Bidirectional sync with proper error handling.",
        },
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: 'Data sync & pipelines',
          description:
            'Keep data consistent across systems — without manual exports, imports, or reconciliation. Scheduled or event-triggered, with conflict resolution built in.',
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'Document processing',
          description:
            'Extract data from invoices, contracts, and forms automatically. Route, categorise, and store structured data without manual review of every file.',
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Custom webhook & event systems',
          description:
            'Build event-driven systems that react in real time — new payment, support ticket, form submission. No polling. No delays.',
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'Monitoring & error alerting',
          description:
            'Every automation we build includes logging and alerting. When something fails — and eventually something always does — you know immediately and we fix it.',
        },
      ],
      capabilitiesLabel: 'What we automate',
      capabilitiesTitle: 'Every type of repetitive work',
      process: [
        {
          title: 'Process mapping (1 hour)',
          description:
            'We walk through your current workflow step by step. We document what happens, who does it, how long it takes, and where it breaks.',
          duration: 'Day 1',
        },
        {
          title: 'Automation design',
          description:
            'We design the automation architecture — triggers, actions, error paths, edge cases. You review and approve before any code is written.',
          duration: 'Day 2–3',
        },
        {
          title: 'Build & test',
          description:
            'We build the automation against test environments first, covering success paths and failure scenarios. You see it working before it goes near production data.',
          duration: 'Week 1–2',
        },
        {
          title: 'Deploy & monitor',
          description:
            'We deploy to production, run the first few cycles alongside the existing manual process, and confirm everything matches. Then we hand over the keys.',
          duration: 'Week 2–3',
        },
      ],
      processLabel: 'How we automate',
      processTitle: 'Map the process first. Build the right thing.',
      faqs: [
        {
          question: "What if we use tools that don't have good APIs?",
          answer:
            "We've worked with poorly documented and legacy APIs. For tools without APIs, we explore alternatives — browser automation, file-based integrations, or webhook workarounds. We tell you upfront if something isn't feasible.",
        },
        {
          question: 'What happens when an automation breaks?',
          answer:
            "We build monitoring and alerting into every automation. When something fails, you get notified and we diagnose it. If you need ongoing support, our maintenance plans cover this.",
        },
        {
          question: 'Can you automate a process that currently relies on a person making judgement calls?',
          answer:
            "Sometimes yes — AI-assisted automations can handle classification, routing, and decision-making for well-defined scenarios. Sometimes no — we tell you honestly when a human is still the right answer.",
        },
      ],
      cta: {
        title: "What's taking your team the most time?",
        subtitle:
          "Tell us the process. We'll tell you whether it can be automated, what it would take, and what you'd get back.",
        primaryCTA: { label: 'Describe your workflow', href: '/studio/start-project' },
        ghostCTA: { label: 'See automation examples', href: '/studio/portfolio' },
        note: 'Fixed-scope pricing. No hourly billing.',
      },
    },
  },

  'internal-tools': {
    metadata: {
      title: 'Internal Tools — SocioFi Studio',
      description:
        "The dashboard your team actually needs. Custom internal tools, admin panels, and operational software built for how your business actually works.",
    },
    content: {
      hero: {
        badge: 'Studio · Internal Tools',
        headline: (
          <>
            The Dashboard Your Team{' '}
            <span className="gradient-text">Actually Needs.</span>
          </>
        ),
        description:
          "Off-the-shelf tools don't fit how your business works. You end up with workarounds, spreadsheets bolted onto software, and a team that avoids the tools you paid for. We build internal software designed around your actual operations — not a generic template.",
        buttons: [
          { label: 'Build my internal tool', href: '/studio/start-project', variant: 'primary' },
          { label: 'See what we build', href: '/studio/services/internal-tools/dashboards', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'The spreadsheet problem',
        headline: "If your team still uses a spreadsheet, your software isn't working.",
        description:
          "Spreadsheets aren't bad tools. They're the symptom of a gap between what your off-the-shelf software does and what your team actually needs. That gap costs you time, introduces errors, and makes onboarding new people harder than it should be.",
        points: [
          "Off-the-shelf tools that are 80% right but require manual workarounds for the other 20%",
          'Data living in three different places because no single tool shows the full picture',
          'Reporting that requires someone to spend half a day pulling data from different systems',
          'Onboarding new staff to a set of tools that nobody fully understands',
        ],
      },
      capabilities: [
        {
          icon: <Layers size={22} aria-hidden="true" />,
          title: 'Operational dashboards',
          description:
            'Real-time views of the metrics that matter — orders, inventory, revenue, support volume. Built around how your team monitors and manages the business.',
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Admin panels',
          description:
            "Manage your product data, users, content, and configuration through a purpose-built interface — not a raw database editor or a clunky default admin.",
        },
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: 'Workflow tools',
          description:
            "Tools that guide your team through multi-step processes — approvals, reviews, handoffs. Reduce errors by making the right action obvious.",
        },
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: 'Reporting & analytics',
          description:
            'Custom reports that pull from your actual data sources and surface the numbers your stakeholders actually need. No more manual exports.',
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'Customer-facing portals',
          description:
            'Give clients, suppliers, or partners their own view — order status, document uploads, account management. Reduce inbound queries by giving people self-service access.',
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Data entry & processing tools',
          description:
            "Replace manual data entry with forms, parsers, and validation tools that catch errors before they propagate. Built around your data model.",
        },
      ],
      capabilitiesLabel: 'What we build',
      capabilitiesTitle: 'Internal tools that people actually use',
      process: [
        {
          title: 'Workflow discovery',
          description:
            "We spend time understanding how your team actually works — not just the documented process, but the workarounds, the spreadsheets, and the informal steps that make things run.",
          duration: 'Week 0',
        },
        {
          title: 'Tool specification',
          description:
            "We produce a written spec: what the tool does, who uses it, what data it shows, and what actions it enables. You approve this before we build anything.",
          duration: 'Week 1',
        },
        {
          title: 'Build & iterate',
          description:
            'We build in visible increments. Every week you have something you can click through and give feedback on — not a status report.',
          duration: 'Weeks 2–N',
        },
        {
          title: 'Rollout & training',
          description:
            "We deploy to your environment, document how everything works, and support the handover to your team. Including the edge cases nobody thought to ask about.",
          duration: 'Final week',
        },
      ],
      processLabel: 'How we build it',
      processTitle: 'Understand the work before writing the tool',
      faqs: [
        {
          question: "How do you connect internal tools to our existing systems?",
          answer:
            "We connect to your existing databases, APIs, or third-party services. If you use a CRM, an ERP, or a custom database — we build the connectors. We tell you upfront if access or permissions are going to be a constraint.",
        },
        {
          question: "Can you build on top of existing tools like Airtable, Notion, or Retool?",
          answer:
            "Sometimes yes — if the tool's capabilities fit the use case. But often the reason you need a custom build is because those tools don't fit well enough. We'll tell you honestly which situation you're in.",
        },
        {
          question: "How do we handle access control? Different people should see different things.",
          answer:
            "Role-based access control is standard in everything we build. We design the permission model with you during specification and implement it properly — not as an afterthought.",
        },
      ],
      cta: {
        title: "What would your team build if they could?",
        subtitle:
          "Tell us the workflow, the workaround, or the spreadsheet. We'll show you what a proper internal tool looks like.",
        primaryCTA: { label: 'Describe my tool', href: '/studio/start-project' },
        ghostCTA: { label: 'See examples', href: '/studio/services/internal-tools/dashboards' },
        note: 'Fixed scope. You approve the spec before we build.',
      },
    },
  },

  'architecture-consulting': {
    metadata: {
      title: 'Architecture Consulting — SocioFi Studio',
      description:
        'Get the architecture right before you build. Technical review, system design, and written recommendations from senior engineers.',
    },
    content: {
      hero: {
        badge: 'Studio · Architecture Consulting',
        headline: (
          <>
            Get the Architecture Right{' '}
            <span className="gradient-text">Before You Build.</span>
          </>
        ),
        description:
          "The most expensive mistakes in software are architectural. A bad database schema, a wrong choice of framework, a tightly coupled system that can't scale — these become visible only after months of work and tens of thousands of dollars. We help you avoid them before a line of production code is written.",
        buttons: [
          { label: 'Book a technical review', href: '/studio/start-project', variant: 'primary' },
          { label: 'See how it works', href: '/studio/process', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'Why architecture matters',
        headline: "Most technical problems are architectural problems that appeared later.",
        description:
          "Performance issues, scaling bottlenecks, security vulnerabilities, integration nightmares — these rarely emerge from bad code in isolation. They emerge from structural decisions made early that locked the system into a shape it couldn't grow out of. The right time to address them is before they're embedded in months of work.",
        points: [
          'A database schema that works for 100 records but breaks at 100,000',
          'A monolith that needs to be a service mesh, or a microservices setup that should have been a monolith',
          "An authentication approach that works now but cannot support enterprise customers next year",
          "AI features bolted onto an architecture that was never designed to handle them",
        ],
      },
      capabilities: [
        {
          icon: <Layers size={22} aria-hidden="true" />,
          title: 'System architecture review',
          description:
            "We review your existing or proposed architecture against your use case, traffic projections, and growth plans — and give you a written assessment.",
        },
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: 'Data model design',
          description:
            'We review or design your database schema, indexing strategy, and data access patterns. Getting this right early saves massive refactoring later.',
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Security architecture',
          description:
            "Authentication flows, authorisation models, data encryption at rest and in transit, secrets management. We design it before it becomes a vulnerability.",
        },
        {
          icon: <GitBranch size={22} aria-hidden="true" />,
          title: 'API & integration design',
          description:
            "REST vs GraphQL, versioning strategy, rate limiting, webhook design. We help you design APIs that are easy to consume and maintain over time.",
        },
        {
          icon: <Target size={22} aria-hidden="true" />,
          title: 'Scalability planning',
          description:
            "We map your expected growth to your infrastructure choices. Where will you hit limits? What needs to change before you add the next zero to your user count?",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'AI integration architecture',
          description:
            "Where AI features fit in your system, how to manage cost and latency, RAG architecture, model selection criteria. We design the integration, not just the feature.",
        },
      ],
      capabilitiesLabel: 'What we review',
      capabilitiesTitle: 'Decisions that are hard to undo',
      process: [
        {
          title: 'Context gathering',
          description:
            "We review your existing codebase, infrastructure, and documentation — or your proposed design if you haven't built yet. We ask pointed questions about your use case and constraints.",
          duration: 'Days 1–2',
        },
        {
          title: 'Technical assessment',
          description:
            'We evaluate the architecture against your actual requirements: performance, security, scalability, maintainability, and cost.',
          duration: 'Days 3–5',
        },
        {
          title: 'Written recommendations',
          description:
            'You receive a written report: what we found, what it means, and specific recommendations in priority order. No vague concerns — actionable next steps.',
          duration: 'Day 6',
        },
        {
          title: 'Review call',
          description:
            "A 60-minute call to walk through the findings, answer questions, and discuss tradeoffs. You leave with a clear picture of what to do next.",
          duration: 'Day 7',
        },
      ],
      processLabel: 'The review process',
      processTitle: 'One week to a clear technical direction',
      faqs: [
        {
          question: "We haven't started building yet. Can you help us design the architecture from scratch?",
          answer:
            "Yes — this is the ideal time. We take your requirements, constraints, and growth assumptions and produce a recommended architecture. You go into the build with a clear technical plan.",
        },
        {
          question: "We have a working system but it's getting slow. Can you help?",
          answer:
            "Yes. Performance issues almost always have architectural roots. We review your system, identify the structural causes of the slowdown, and give you a prioritised remediation plan.",
        },
        {
          question: "Do you implement the recommendations, or just provide them?",
          answer:
            "Both options are available. The consulting engagement gives you written recommendations. If you want us to implement them, we scope that as a separate build engagement.",
        },
        {
          question: 'How much does an architecture review cost?',
          answer:
            'A standard review (assessment + written report + review call) starts from $1,500. More complex systems or multi-day engagements are priced based on scope.',
        },
      ],
      cta: {
        title: "What decision are you trying to get right?",
        subtitle:
          "Tell us what you're building or where you're stuck. We'll tell you if an architecture review is the right answer.",
        primaryCTA: { label: 'Book a technical review', href: '/studio/start-project' },
        ghostCTA: { label: 'Learn about our process', href: '/studio/process' },
        note: 'Written report delivered within one week.',
      },
    },
  },

  'maintenance-support': {
    metadata: {
      title: 'Maintenance & Support — SocioFi Studio',
      description:
        "Your product is live. Keep it that way. Ongoing engineering support, security updates, bug fixes, and feature additions.",
    },
    content: {
      hero: {
        badge: 'Studio · Maintenance & Support',
        headline: (
          <>
            Your Product is Live.{' '}
            <span className="gradient-text">Now Keep It That Way.</span>
          </>
        ),
        description:
          "Launching is the beginning, not the end. Libraries go out of date. Security patches appear. Users find bugs. Features pile up. We provide ongoing engineering support so your product stays running, secure, and improving — without you needing to hire a developer.",
        buttons: [
          { label: 'Get maintenance cover', href: '/studio/start-project', variant: 'primary' },
          { label: 'See ongoing support plans', href: '/services/plans', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'What happens without maintenance',
        headline: 'Software decays. Libraries go out of date. Security gaps appear.',
        description:
          "A product you launched 6 months ago isn't the same product today — not because you changed it, but because the world around it changed. Frameworks release security patches. Dependencies reach end-of-life. APIs change. If no one's watching, you find out the hard way.",
        points: [
          'Outdated dependencies with known security vulnerabilities',
          'Breaking changes in upstream APIs your app depends on',
          'Performance degradation as data volumes grow and queries slow down',
          'Feature requests that pile up because there is no developer to action them',
        ],
      },
      capabilities: [
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Security patch management',
          description:
            "We track CVEs affecting your stack, test patches in staging before applying them, and keep your dependency tree clean. You get notified; we handle the work.",
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'Bug fixes',
          description:
            "When something breaks, we diagnose and fix it. Response time depends on your plan — critical issues are prioritised regardless.",
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Feature additions',
          description:
            "Small improvements, UI tweaks, new integrations, content updates. We scope, build, and deploy — you approve before anything goes live.",
        },
        {
          icon: <Rocket size={22} aria-hidden="true" />,
          title: 'Performance monitoring',
          description:
            "We watch your error rates, response times, and database query performance. When something degrades, we investigate before you notice the slowdown.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'Uptime monitoring',
          description:
            "Continuous uptime checks with automatic alerts. If your app goes down, we know about it — often before you do.",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'Monthly reporting',
          description:
            "A monthly summary of what was done, what was fixed, what's coming, and the current health of your app. Clear, jargon-free.",
        },
      ],
      capabilitiesLabel: "What's covered",
      capabilitiesTitle: 'Ongoing engineering, not just firefighting',
      process: [
        {
          title: 'Onboarding audit',
          description:
            "We review your codebase, infrastructure, and monitoring setup. We document what exists, flag anything that needs immediate attention, and establish the baseline.",
          duration: 'Week 1',
        },
        {
          title: 'Monthly maintenance cycle',
          description:
            "Security updates, dependency management, proactive performance checks. Handled every month, with a written summary.",
          duration: 'Monthly',
        },
        {
          title: 'Bug triage & fixes',
          description:
            "You report a bug (or we detect it). We triage, estimate, and fix — keeping you informed at each step. Critical issues skip the queue.",
          duration: 'As needed',
        },
        {
          title: 'Feature scoping & delivery',
          description:
            "When you want something new, we scope it with a written spec before building. Your allocated hours are used transparently.",
          duration: 'On request',
        },
      ],
      processLabel: 'How it works',
      processTitle: 'Proactive, not reactive',
      faqs: [
        {
          question: "Do I need to have built with SocioFi to get maintenance?",
          answer:
            "No. We take on maintenance for products built by other teams. Our onboarding audit gives us the full picture of your codebase before we commit to anything.",
        },
        {
          question: "What's the minimum commitment?",
          answer:
            "Maintenance plans run month-to-month with a 3-month minimum. Most clients stay for years — but you're not locked in.",
        },
        {
          question: "What if I need more than bug fixes? I want ongoing feature development.",
          answer:
            "That's handled within the same relationship. Our SocioFi Services division offers structured ongoing support plans that cover development hours, monitoring, and SLAs. Talk to us about the right plan for your stage.",
        },
        {
          question: "What if I need more hours than my plan includes?",
          answer:
            "We'll tell you before we exceed your allocation. You can approve additional hours or defer the work to the next month. No surprise invoices.",
        },
      ],
      cta: {
        title: "Who's looking after your product?",
        subtitle:
          "If the answer is 'no one', that's a problem waiting to happen. Let's set up proper maintenance cover.",
        primaryCTA: { label: 'Get maintenance cover', href: '/studio/start-project' },
        ghostCTA: { label: 'See ongoing support plans', href: '/services/plans' },
        note: 'Month-to-month after the initial 3 months.',
      },
    },
  },

  // ── 3 Service Combination Pages ────────────────────────────────────────────

  'mvp-to-growth': {
    metadata: {
      title: 'MVP to Growth — SocioFi Studio',
      description:
        'From first version to scaled product. A complete engagement covering MVP build, post-launch iteration, and the infrastructure to grow.',
    },
    content: {
      hero: {
        badge: 'Studio · MVP to Growth',
        headline: (
          <>
            From First Version to{' '}
            <span className="gradient-text">Scaled Product.</span>
          </>
        ),
        description:
          "Most agencies build your MVP and walk away. We stay. This engagement covers the initial build, the post-launch iteration, and the ongoing engineering support to take you from your first user to your ten-thousandth — without rebuilding from scratch.",
        buttons: [
          { label: 'Start the conversation', href: '/studio/start-project', variant: 'primary' },
          { label: 'See Studio pricing', href: '/studio/pricing', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'The handover problem',
        headline: "The gap between 'built' and 'growing' is where most products get stuck.",
        description:
          "An MVP launches. Users arrive. Things break in ways nobody anticipated. Features need adding. The original scope is done but the product isn't finished — and the team that built it has moved on to the next client. We structure our engagements to avoid this entirely.",
        points: [
          "MVP built to spec, but not built to scale — every growth milestone triggers a rebuild",
          "Handover documentation that explains what was built but not why — making changes dangerous",
          "No ongoing relationship means every change requires a new scoping process with a new team",
          "Architecture decisions made for an MVP that fight against the features needed at scale",
        ],
      },
      capabilities: [
        {
          icon: <Rocket size={22} aria-hidden="true" />,
          title: 'MVP build',
          description:
            'The core product — scoped tightly, built properly. Authentication, data model, key workflows, deployment. Built to scale from day one.',
        },
        {
          icon: <Target size={22} aria-hidden="true" />,
          title: 'Post-launch iteration',
          description:
            'After launch, we turn user feedback into prioritised feature work. You have a team that knows the codebase and can act on what you learn immediately.',
        },
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: 'Performance & scalability',
          description:
            'As traffic grows, we proactively address the bottlenecks — caching, database optimisation, infrastructure scaling — before they become incidents.',
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Security & compliance',
          description:
            'As you acquire more users, security requirements increase. We handle the ongoing audit and hardening that comes with scale.',
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'AI feature development',
          description:
            "When you're ready to add AI capabilities — search, automation, document processing — we build them into an architecture that was designed for it.",
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'Maintenance & monitoring',
          description:
            'Dependency updates, uptime monitoring, error tracking. The unglamorous work that keeps a live product running.',
        },
      ],
      capabilitiesLabel: 'What this covers',
      capabilitiesTitle: 'One engagement, full lifecycle',
      process: [
        {
          title: 'MVP scoping & build',
          description:
            'We scope the minimum viable version, get written approval, and build. You launch with something real — not a demo.',
          duration: 'Weeks 1–6',
        },
        {
          title: 'Post-launch support (30 days)',
          description:
            'The first 30 days after launch are included. Bugs, unexpected behaviour, small additions — handled as part of the engagement.',
          duration: '+30 days',
        },
        {
          title: 'Iteration cycles',
          description:
            "Based on what you learn from real users, we scope and build the next features. You have a team that knows the product — no re-onboarding required.",
          duration: 'Ongoing',
        },
        {
          title: 'Ongoing maintenance',
          description:
            "Monthly security updates, dependency management, performance monitoring. The product stays healthy without you managing it.",
          duration: 'Monthly',
        },
      ],
      processLabel: 'The engagement structure',
      processTitle: 'Build once. Support and grow from there.',
      faqs: [
        {
          question: "How long does this type of engagement run?",
          answer:
            "The initial build is typically 4–8 weeks. After launch, the ongoing iteration and maintenance runs month-to-month. Most clients stay for 12–18 months — some much longer.",
        },
        {
          question: "What if we only want the MVP for now?",
          answer:
            "That's fine — we can start with just the MVP Sprint. The difference with this package is you get a structured plan for what comes after, and the ongoing relationship is already established.",
        },
        {
          question: "Can we pause the engagement if we're not ready to iterate?",
          answer:
            "Yes. We maintain the codebase on a reduced maintenance plan and you can re-engage for iteration work when you're ready.",
        },
      ],
      cta: {
        title: 'Building a product you intend to grow?',
        subtitle:
          "Tell us what you're building. We'll scope the MVP and the path beyond it.",
        primaryCTA: { label: 'Start the conversation', href: '/studio/start-project' },
        ghostCTA: { label: 'See our portfolio', href: '/studio/portfolio' },
        note: 'Free 30-minute scoping call.',
      },
    },
  },

  'full-tech-stack': {
    metadata: {
      title: 'Full Tech Stack — SocioFi Studio',
      description:
        "Everything your business needs: product development, automation, internal tools, and ongoing support. One team, one relationship.",
    },
    content: {
      hero: {
        badge: 'Studio · Full Tech Stack',
        headline: (
          <>
            One Team for Your{' '}
            <span className="gradient-text">Entire Tech Stack.</span>
          </>
        ),
        description:
          "Customer-facing product. Internal tools. Automations. Integrations. Ongoing maintenance. Instead of managing four different vendors or trying to hire for four different roles, you work with one team that knows all of it.",
        buttons: [
          { label: 'Talk to us', href: '/studio/start-project', variant: 'primary' },
          { label: 'See what we cover', href: '/studio/services', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'The vendor problem',
        headline: "Most businesses end up with four different teams who don't talk to each other.",
        description:
          "One agency for your website. A freelancer for your internal tools. A no-code consultant for your automations. A third party for your hosting. Every handoff is a gap. Every vendor needs context the others have. And when something breaks at the boundary, everyone points at someone else.",
        points: [
          'Multiple vendors with overlapping responsibilities and unclear ownership',
          'Context lost at every handoff — teams that built something are gone when it needs changing',
          'Integrations that work in isolation but break when the pieces have to talk',
          'No single team with a view of the whole system',
        ],
      },
      capabilities: [
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: 'Product development',
          description:
            'Customer-facing web and mobile applications. Built on proper foundations — auth, payments, data architecture, deployment.',
        },
        {
          icon: <Layers size={22} aria-hidden="true" />,
          title: 'Internal tools',
          description:
            'Dashboards, admin panels, workflow tools. The software your operations team needs to run the business efficiently.',
        },
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: 'Automation & integration',
          description:
            'Workflows between systems, API integrations, document processing. The connective tissue that makes everything work together.',
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: 'AI features',
          description:
            'Smart search, document analysis, workflow automation, conversational interfaces. AI capabilities that fit your actual use cases.',
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Security & compliance',
          description:
            "One team maintains the security posture of your entire stack — not three vendors each thinking someone else owns it.",
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: 'Maintenance & support',
          description:
            "Ongoing engineering across everything we build. No handoffs. No re-onboarding. The team that built it keeps it running.",
        },
      ],
      capabilitiesLabel: 'What we own',
      capabilitiesTitle: 'Every part of your technical stack',
      process: [
        {
          title: 'Technical audit',
          description:
            "We assess your current stack — what exists, what works, what is missing, and what needs changing. We produce a written overview before recommending anything.",
          duration: 'Week 1',
        },
        {
          title: 'Prioritised roadmap',
          description:
            "We sequence the work: what to build first, what to fix, what to automate. You approve the roadmap before we build anything.",
          duration: 'Week 2',
        },
        {
          title: 'Phased delivery',
          description:
            "We work through the roadmap in phases. Each phase has a clear scope and deliverable. You always know what we're building and when.",
          duration: 'Ongoing',
        },
        {
          title: 'Retainer & maintenance',
          description:
            "After the initial build phases, we move into ongoing support — shipping new features, maintaining security, and responding to operational needs.",
          duration: 'Monthly',
        },
      ],
      processLabel: 'How the engagement works',
      processTitle: 'Audit, prioritise, build, maintain.',
      faqs: [
        {
          question: "We already have some things built. Do you take over existing work?",
          answer:
            "Yes. We review what exists, assess what's worth keeping and what needs replacing, and integrate into the ongoing relationship. The onboarding audit covers this.",
        },
        {
          question: "How do you price a full-stack engagement?",
          answer:
            "The initial build phases are fixed-scope, fixed-price. Ongoing maintenance and support runs on a monthly retainer sized to your needs.",
        },
        {
          question: "What size of business is this for?",
          answer:
            "Typically businesses with 5–50 employees that are past early MVP stage and need real engineering support without hiring a full in-house team. If you're larger, we can discuss a more structured arrangement.",
        },
      ],
      cta: {
        title: "Ready to consolidate your tech into one relationship?",
        subtitle:
          "Tell us what you have, what you need, and what's not working. We'll give you a clear picture of how we'd approach it.",
        primaryCTA: { label: 'Book a technical discussion', href: '/studio/start-project' },
        ghostCTA: { label: 'Learn about our process', href: '/studio/process' },
        note: 'No commitment required for the first call.',
      },
    },
  },

  'operations-redesign': {
    metadata: {
      title: 'Operations Redesign — SocioFi Studio',
      description:
        "Your business runs on manual processes and disconnected tools. We audit how your operations work and rebuild the software layer that holds it together.",
    },
    content: {
      hero: {
        badge: 'Studio · Operations Redesign',
        headline: (
          <>
            Your Operations Are Being{' '}
            <span className="gradient-text">Held Back by Software.</span>
          </>
        ),
        description:
          "Your team is working hard, but too much of that work is fighting the tools — or doing manually what should be automatic. We audit how your business actually runs, find the friction, and rebuild the software layer that supports your operations.",
        buttons: [
          { label: 'Start with an audit', href: '/studio/start-project', variant: 'primary' },
          { label: 'See what we deliver', href: '/studio/services/internal-tools', variant: 'ghost' },
        ],
      },
      problem: {
        label: 'Operational debt',
        headline: "Bad software doesn't just waste time. It shapes your business in the wrong direction.",
        description:
          "Every workaround your team uses is a process that's slightly wrong. Every spreadsheet that should be a database is a risk. Every integration that requires a human in the middle is a bottleneck. Over time, these accumulate into a business that can't scale — not because of the market, but because of the tools.",
        points: [
          'Processes that depend on institutional knowledge held by one or two people',
          'Reporting that takes days because data lives in three different places',
          'Onboarding that takes weeks because the tools are too complex to learn',
          'Growth that creates operational pain because processes were designed for a smaller version of the business',
        ],
      },
      capabilities: [
        {
          icon: <Target size={22} aria-hidden="true" />,
          title: 'Operations audit',
          description:
            "We map your actual workflows — not the documented ones, but how work actually moves through your business. We find the gaps, the bottlenecks, and the manual steps that should not exist.",
        },
        {
          icon: <Layers size={22} aria-hidden="true" />,
          title: 'Internal tool redesign',
          description:
            "We replace the spreadsheets, the workarounds, and the cobbled-together software with internal tools designed around how your team actually works.",
        },
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: 'Process automation',
          description:
            "Every manual step that can be automated, is. Every system that should talk to another system, does. Your team's time goes back to work that actually needs a person.",
        },
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: 'Data consolidation',
          description:
            "Data living in multiple places gets pulled into a single source of truth — or at minimum, consistently synchronised. Reporting becomes a button, not a project.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: 'System integration',
          description:
            "The tools you already use get connected properly — CRM, payments, fulfilment, support. No more humans acting as the integration layer.",
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: 'Handover & documentation',
          description:
            "We document how everything works — for your team, for new hires, and for future engineers. You are not dependent on us forever.",
        },
      ],
      capabilitiesLabel: 'What we do',
      capabilitiesTitle: 'From audit to operational clarity',
      process: [
        {
          title: 'Operations audit',
          description:
            "We spend time with your team understanding how work actually flows — including the unofficial steps, the workarounds, and the things people do because the tools don't quite fit.",
          duration: 'Week 1',
        },
        {
          title: 'Redesign recommendation',
          description:
            "We produce a written recommendation: what to build, what to automate, what to connect, and in what order. You approve before we start.",
          duration: 'Week 2',
        },
        {
          title: 'Phased build',
          description:
            "We build in priority order — highest-impact changes first. Each phase has a clear outcome. Your team starts benefiting before the whole project is complete.",
          duration: 'Weeks 3–N',
        },
        {
          title: 'Rollout & training',
          description:
            "We roll out to your team with documentation and training. We stay close during the transition to catch any friction the new tools create.",
          duration: 'Final phase',
        },
      ],
      processLabel: 'How we work',
      processTitle: 'Understand the operations before redesigning them.',
      faqs: [
        {
          question: "How long does an operations redesign take?",
          answer:
            "It depends on the complexity. A focused automation and tooling project runs 4–8 weeks. A full operations redesign covering multiple departments runs 8–16 weeks. We scope it precisely after the audit.",
        },
        {
          question: "Our team is resistant to changing how they work. How do you handle that?",
          answer:
            "We involve your team in the design process — not just the delivery. People accept change better when they helped design it and when the new tools genuinely make their work easier.",
        },
        {
          question: "What if we're using tools we can't replace?",
          answer:
            "We work with what you have. Most redesigns augment existing tools rather than replacing them — adding the integrations and automation layer that the tools themselves don't provide.",
        },
      ],
      cta: {
        title: "Ready to see how your operations could actually work?",
        subtitle:
          "Tell us where the friction is. We'll audit the situation and show you what's possible.",
        primaryCTA: { label: 'Start with an audit', href: '/studio/start-project' },
        ghostCTA: { label: 'Learn about our process', href: '/studio/process' },
        note: 'Audit report delivered within one week.',
      },
    },
  },
};

// ── Route handlers ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = SERVICES[params.slug];
  if (!service) return {};
  return service.metadata;
}

export default function StudioServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES[params.slug];
  if (!service) notFound();
  return <ServiceDetail content={service.content} />;
}
