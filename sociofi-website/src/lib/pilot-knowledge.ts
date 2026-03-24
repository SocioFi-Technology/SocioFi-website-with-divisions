// src/lib/pilot-knowledge.ts
// ── PILOT Client-Side Knowledge Engine ────────────────────────────────────────
// Zero API calls. All SocioFi knowledge hardcoded here.
// Responses are matched client-side by keyword scoring.

export interface PilotQuickAction {
  label: string;
  action?: 'navigate' | 'message';
  url?: string;
}

export interface PilotResponse {
  message: string;
  quickActions: PilotQuickAction[];
}

interface Intent {
  id: string;
  keywords: string[];        // ANY of these words in input triggers this
  boost?: string[];          // EXTRA score if these are also present
  divisions?: string[];      // Only for these division slugs (undefined = all)
  message: string;
  quickActions: PilotQuickAction[];
}

// ── Knowledge Base ─────────────────────────────────────────────────────────────

const INTENTS: Intent[] = [

  // ── Identity & Company ──────────────────────────────────────────────────────

  {
    id: 'what-is-sociofi',
    keywords: ['what is sociofi', 'who are you', 'tell me about sociofi', 'what do you do', 'about sociofi', 'what does sociofi do', 'company', 'about you'],
    message: `SocioFi Technology is an AI-agent-native software development company. AI agents handle the heavy lifting of development — expert human engineers architect, review, debug, and keep everything running.\n\nWe exist for people who know AI can build software but lack the technical team to take it to production: deployment, security, databases, maintenance, scaling.\n\n**7 divisions:** Studio (build), Services (maintain), Cloud (host), Academy (learn), Ventures (equity-for-dev), Products (our own software), and Labs (research).`,
    quickActions: [
      { label: 'Build something', action: 'navigate', url: '/studio' },
      { label: 'Maintain my app', action: 'navigate', url: '/services' },
      { label: 'All divisions', action: 'message' },
      { label: 'Talk to the team', action: 'message' },
    ],
  },

  {
    id: 'founders',
    keywords: ['founder', 'founders', 'who built', 'who made', 'team', 'arifur', 'kamrul', 'buet', 'ceo', 'cto'],
    message: `SocioFi was founded by **Arifur Rahman** (CEO) and **Kamrul Hasan** (CTO), both graduates of BUET — Bangladesh's top engineering university. They're based in Dhaka, Bangladesh, serving clients globally.\n\nWant to talk to them directly? I can connect you.`,
    quickActions: [
      { label: 'Talk to the team', action: 'message' },
      { label: 'Book a free call', action: 'navigate', url: '/contact' },
    ],
  },

  {
    id: 'location',
    keywords: ['where are you', 'location', 'based', 'dhaka', 'bangladesh', 'timezone', 'country', 'remote'],
    message: `SocioFi is based in **Dhaka, Bangladesh** and serves clients globally. The team works across timezone overlaps — if you're in Europe, the Americas, or Southeast Asia, there's a window that works.\n\nCost-effectiveness is a feature: being in Dhaka means we're typically 3–5× cheaper than equivalent agencies in the US or UK, with no compromise on quality.`,
    quickActions: [
      { label: 'Book a free call', action: 'navigate', url: '/contact' },
      { label: 'View pricing', action: 'message' },
    ],
  },

  // ── All Divisions Overview ───────────────────────────────────────────────────

  {
    id: 'all-divisions',
    keywords: ['all divisions', 'all services', 'everything you offer', 'what divisions', 'list divisions', 'overview'],
    message: `Here's how SocioFi is structured:\n\n- **Studio** — Custom software, AI systems, MVPs, automation. From $2,500.\n- **Services** — Managed maintenance, monitoring, bug fixes. From $499/mo.\n- **Cloud** — Managed hosting & infrastructure. From $99/mo.\n- **Academy** — Courses & training for non-technical founders. From $49.\n- **Ventures** — We build your product in exchange for equity. Zero cash required.\n- **Products** — Our own AI software: FabricxAI, NEXUS ARIA, DevBridge.\n- **Labs** — Research, open source, technical writing.`,
    quickActions: [
      { label: 'I want to build', action: 'navigate', url: '/studio' },
      { label: 'I need maintenance', action: 'navigate', url: '/services' },
      { label: 'I want to learn', action: 'navigate', url: '/academy' },
      { label: 'I have a startup idea', action: 'navigate', url: '/ventures' },
    ],
  },

  // ── Studio ──────────────────────────────────────────────────────────────────

  {
    id: 'studio-rescue',
    keywords: ['rescue', 'broken', 'stuck', 'prototype', 'ai prototype', 'fix my app', 'not working', 'chatgpt built', 'ai built', 'ai-built', 'cursor', 'lovable', 'bolt', 'v0'],
    message: `That's exactly what **Rescue & Ship** is for. We take AI-generated or broken prototypes and turn them into production-ready software.\n\nCommon issues we fix: deployment failures, database problems, authentication gaps, performance issues, security holes, and code that works locally but nowhere else.\n\n**Timeline:** 2–6 weeks. **Starting from:** $2,500. You keep 100% of the code and full ownership.`,
    quickActions: [
      { label: 'Start a rescue project', action: 'navigate', url: '/studio/start-project' },
      { label: 'What does it include?', action: 'message' },
      { label: 'See Studio pricing', action: 'message' },
    ],
  },

  {
    id: 'studio-mvp',
    keywords: ['mvp', 'minimum viable product', 'idea to product', 'build my idea', 'startup build', 'launch product', 'fast track', 'quick build', '2 weeks', '4 weeks'],
    message: `Our **MVP Fast-Track** takes you from idea to live product in 2–4 weeks.\n\n**Starting from $2,500.** Includes:\n- Human-reviewed AI-native development\n- Full deployment to production\n- 100% code ownership\n- 30-day free bug fixes post-launch\n- 30-day free Services Essential plan\n\nIf your MVP needs to scale later, Studio's Growth Retainer ($4,500/mo) or Dedicated Team continues the work.`,
    quickActions: [
      { label: 'Start my MVP', action: 'navigate', url: '/studio/start-project' },
      { label: 'See Studio pricing', action: 'message' },
      { label: 'What about Ventures?', action: 'navigate', url: '/ventures' },
    ],
  },

  {
    id: 'studio-ai-systems',
    keywords: ['ai agent', 'ai system', 'rag', 'automation', 'workflow automation', 'multi-agent', 'ai pipeline', 'ai integration', 'decision engine'],
    message: `Studio's **AI Systems Development** service builds exactly that — AI agents, RAG systems, multi-agent orchestration, workflow automation, and decision engines.\n\nWe've built our own 10-agent development pipeline internally (that's how Studio projects move so fast), so we understand the architecture deeply.\n\n**Timeline:** 2–6 weeks. **Starting from:** $2,500.`,
    quickActions: [
      { label: 'Discuss my AI project', action: 'navigate', url: '/studio/start-project' },
      { label: 'See all Studio services', action: 'navigate', url: '/studio' },
    ],
  },

  {
    id: 'studio-internal-tools',
    keywords: ['internal tool', 'dashboard', 'admin panel', 'reporting', 'internal', 'team tool', 'crm', 'erp', 'portal'],
    message: `Studio builds **internal tools and dashboards** — admin panels, team portals, ERP/CRM systems, reporting dashboards, and anything your team uses internally.\n\nThese typically take 2–4 weeks and start from $2,500. We deliver the full codebase — no vendor lock-in.`,
    quickActions: [
      { label: 'Start a project', action: 'navigate', url: '/studio/start-project' },
      { label: 'See pricing', action: 'message' },
    ],
  },

  {
    id: 'studio-pricing',
    keywords: ['studio price', 'studio cost', 'how much to build', 'development cost', 'project cost', 'build cost', 'how much does it cost', 'pricing studio'],
    boost: ['build', 'develop', 'app', 'software', 'studio'],
    message: `Studio pricing:\n\n- **Project-Based** — Fixed scope, fixed price. From $2,500. Timeline 2–8 weeks.\n- **MVP Fast-Track** — Idea to live product in 2–4 weeks. From $2,500. Includes 30-day free Services Essential.\n- **Growth Retainer** — $4,500/month, 40+ hours, dedicated lead, weekly calls.\n- **Dedicated Team** — Custom pricing, minimum 3 months.\n\nEvery project includes: full deployment, 100% code ownership, human-reviewed code, 30-day post-launch bug fixes, and plain-English communication throughout.`,
    quickActions: [
      { label: 'Start a project', action: 'navigate', url: '/studio/start-project' },
      { label: 'Book a free call', action: 'navigate', url: '/contact' },
      { label: 'Talk to a human', action: 'message' },
    ],
  },

  {
    id: 'studio-overview',
    keywords: ['studio', 'build software', 'custom software', 'web app', 'mobile app', 'saas', 'build an app', 'develop', 'development', 'software development'],
    message: `**SocioFi Studio** builds custom software, AI systems, automation, internal tools, and production-ready MVPs using an AI-native development process.\n\n6 service areas:\n- Custom Software Development (web apps, SaaS, portals)\n- AI Systems Development (agents, RAG, automation)\n- Product Engineering (MVP to Scale + Rescue & Ship)\n- Workflow Automation\n- Internal Tools & Dashboards\n- Architecture Consulting\n\nProjects start from **$2,500** and typically take **2–8 weeks**.`,
    quickActions: [
      { label: 'Start a project', action: 'navigate', url: '/studio/start-project' },
      { label: 'See Studio pricing', action: 'message' },
      { label: 'View Studio', action: 'navigate', url: '/studio' },
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────────

  {
    id: 'services-pricing',
    keywords: ['services price', 'services cost', 'maintenance cost', 'maintenance price', 'how much maintenance', 'plan cost', 'how much is services'],
    message: `Services plans:\n\n- **Essential** — $499/month. 24/7 monitoring, weekly security scans, 8hr bug fixes, email support, next-business-day response.\n- **Growth** (most popular) — $1,499/month. Everything in Essential + performance monitoring, quarterly security audit, 20hr bug fixes, 10hr features, 4-hour response, email + Slack + weekly call.\n- **Scale** — Custom pricing. Unlimited fixes, dedicated engineer, 1-hour 24/7 response, monthly optimization, custom dashboards.\n\nAll plans: no lock-in, 30-day notice to cancel, 100% code ownership.`,
    quickActions: [
      { label: 'Get protected', action: 'navigate', url: '/services/get-protected' },
      { label: 'Compare plans', action: 'navigate', url: '/services/plans' },
      { label: 'Talk to a human', action: 'message' },
    ],
  },

  {
    id: 'services-overview',
    keywords: ['maintain', 'maintenance', 'managed', 'keep running', 'support', 'operations', 'monitoring', 'uptime', 'bug fix', 'security patch', 'services'],
    message: `**SocioFi Services** is a managed operations layer — not a support desk. AI monitoring + human engineering keeps your software running 24/7.\n\n6 capabilities: 24/7 Monitoring & Alerting, Security & Patching, Bug Fixes & Incident Response, Feature Updates, Performance Optimization, and a Dedicated Support Contact.\n\nServices accepts software built by anyone — agencies, freelancers, AI tools, or internal teams. You don't have to have built with Studio.\n\nPlans from **$499/month**.`,
    quickActions: [
      { label: 'See plans & pricing', action: 'message' },
      { label: 'Get protected', action: 'navigate', url: '/services/get-protected' },
      { label: 'How onboarding works', action: 'message' },
    ],
  },

  {
    id: 'services-onboarding',
    keywords: ['onboarding', 'getting started services', 'how does services work', 'setup', 'start services'],
    message: `Services onboarding takes about a week:\n\n- **Day 1–2:** Codebase review — we read your code and understand your stack.\n- **Day 3–5:** Monitoring setup — alerts, dashboards, health checks configured.\n- **Day 5–7:** First security scan — vulnerabilities identified and prioritised.\n- **Week 2+:** Ongoing operations begin — you stop worrying about it.\n\nEvery Studio project gets a **30-day free Essential plan** to start.`,
    quickActions: [
      { label: 'Get protected', action: 'navigate', url: '/services/get-protected' },
      { label: 'See plans', action: 'message' },
    ],
  },

  // ── Cloud ────────────────────────────────────────────────────────────────────

  {
    id: 'cloud-pricing',
    keywords: ['cloud price', 'cloud cost', 'hosting cost', 'hosting price', 'how much hosting', 'cloud plans', 'server cost'],
    message: `Cloud plans (management fee — hosting is passed through at cost, no markup):\n\n- **Starter** — $99/month. 1 app, production only, manual deploy trigger, daily backups, email support.\n- **Growth** — $299/month. Up to 3 apps, staging + production, automated CI/CD, auto-scaling, 4-hour response.\n- **Scale** — $599/month. Unlimited apps, dev + staging + prod, preview deploys, geo-redundant backups, 1-hour response.\n\n**Bundles with Services:** Essential + Starter $598/mo, Growth + Growth $1,798/mo.`,
    quickActions: [
      { label: 'Get hosted', action: 'navigate', url: '/cloud/get-hosted' },
      { label: 'Compare plans', action: 'navigate', url: '/cloud' },
    ],
  },

  {
    id: 'cloud-overview',
    keywords: ['host', 'hosting', 'server', 'deploy', 'deployment', 'infrastructure', 'devops', 'ci/cd', 'aws', 'digitalocean', 'hetzner', 'vercel hosting', 'cloud'],
    message: `**SocioFi Cloud** handles your infrastructure so you don't have to — servers, databases, CDN, DNS, SSL, deployments, scaling, backups, and disaster recovery.\n\nWe're provider-agnostic: AWS, DigitalOcean, Hetzner, Vercel, Railway, Render. We recommend the cheapest option that fits your requirements.\n\nCloud plans from **$99/month**. Hosting cost is passed through at cost — no markup.\n\nEvery Studio project includes deployment setup in the project fee. The monthly Cloud fee starts after launch.`,
    quickActions: [
      { label: 'See Cloud pricing', action: 'message' },
      { label: 'Get hosted', action: 'navigate', url: '/cloud/get-hosted' },
      { label: 'View Cloud', action: 'navigate', url: '/cloud' },
    ],
  },

  // ── Academy ──────────────────────────────────────────────────────────────────

  {
    id: 'academy-pricing',
    keywords: ['academy price', 'course price', 'course cost', 'how much course', 'training cost', 'how much learn', 'certification cost', 'scarl price'],
    message: `Academy pricing:\n\n- **Self-Paced Courses** — $49–$299. Titles include: AI Development for Founders ($149), How to Spec a Software Product ($79), Evaluating AI-Built Software ($99), Technical Due Diligence ($199), and more.\n- **Live Workshops** — $199–$499 per seat. Half-day and full-day formats, 2–4 sessions/month.\n- **Corporate Training** — $2,000–$15,000. Custom programs for organisations, on-site or remote.\n- **SCARL Certification** — $799–$1,499. 6-week program: self-paced + live sessions + capstone reviewed by SocioFi engineers.\n\nFree resources: "AI Development in 30 Minutes" mini-course (email-gated), templates, webinar archive.`,
    quickActions: [
      { label: 'Browse courses', action: 'navigate', url: '/academy/courses' },
      { label: 'Start free mini-course', action: 'navigate', url: '/academy/free' },
      { label: 'Corporate training', action: 'message' },
    ],
  },

  {
    id: 'academy-free',
    keywords: ['free course', 'free resource', 'free learning', 'free mini', 'no cost', 'free template', 'free webinar'],
    message: `Academy has several free resources:\n\n- **"AI Development in 30 Minutes"** mini-course — email-gated, instant access.\n- **Product Spec Template** — the same format SocioFi uses internally.\n- **Vendor Evaluation Checklist** — for evaluating dev agencies and freelancers.\n- **Automation Audit Template** — identify what to automate first.\n- **Webinar archive** — past sessions on AI development for non-technical founders.\n\nAll free. No credit card.`,
    quickActions: [
      { label: 'Get free resources', action: 'navigate', url: '/academy/free' },
      { label: 'Browse paid courses', action: 'navigate', url: '/academy/courses' },
    ],
  },

  {
    id: 'academy-certification',
    keywords: ['certification', 'certificate', 'scarl', 'certified', 'credential', 'accreditation'],
    message: `The **SCARL Certification** (SocioFi Certified AI-Ready Leader) is a 6-week program that teaches technical literacy for business leaders and founders.\n\n**Format:** Self-paced modules + live sessions + capstone project reviewed by SocioFi engineers.\n**Price:** $799–$1,499.\n**Outcome:** You'll be able to spec software, evaluate AI tools, communicate with dev teams, and make informed technical decisions — without writing code.\n\n15–25% of SCARL graduates eventually engage Studio or Services.`,
    quickActions: [
      { label: 'Learn about SCARL', action: 'navigate', url: '/academy/certification' },
      { label: 'Browse all courses', action: 'navigate', url: '/academy/courses' },
    ],
  },

  {
    id: 'academy-overview',
    keywords: ['learn', 'course', 'training', 'education', 'academy', 'workshop', 'non-technical', 'founder learning', 'ai literacy', 'technical literacy'],
    message: `**SocioFi Academy** teaches non-technical founders and business leaders to work confidently with AI and development teams. Not a coding bootcamp — it's about technical literacy and decision-making.\n\n4 formats:\n- **Self-paced courses** ($49–$299) — 4–6 hours each\n- **Live workshops** ($199–$499) — half-day and full-day\n- **Corporate training** ($2,000–$15,000) — custom programmes\n- **SCARL Certification** ($799–$1,499) — 6-week credentialed programme\n\nFree mini-course available instantly.`,
    quickActions: [
      { label: 'Start free mini-course', action: 'navigate', url: '/academy/free' },
      { label: 'Browse courses', action: 'navigate', url: '/academy/courses' },
      { label: 'See pricing', action: 'message' },
    ],
  },

  // ── Ventures ─────────────────────────────────────────────────────────────────

  {
    id: 'ventures-models',
    keywords: ['equity model', 'revenue share', 'hybrid model', 'model a', 'model b', 'model c', 'how much equity', 'deal structure'],
    message: `Ventures offers three deal models:\n\n- **Model A (Pure Equity)** — 10–20% equity, zero cash, 4-year vesting, 1-year cliff. MVP only (2–4 weeks). Best for pre-revenue founders.\n- **Model B (Revenue Share)** — 5–15% of gross revenue until 3–5× cap or 5 years. Best for near-term revenue products.\n- **Model C (Hybrid)** — Most common. 30–50% reduced Studio fee + 5–10% equity or revenue share. Partial cost recovery + upside.\n\nAll models: MVP scope only, founder owns 100% IP, 60-day free Services Essential, quarterly architecture reviews.`,
    quickActions: [
      { label: 'Apply to Ventures', action: 'navigate', url: '/ventures/apply' },
      { label: 'Am I eligible?', action: 'message' },
    ],
  },

  {
    id: 'ventures-eligibility',
    keywords: ['eligible', 'qualify', 'criteria', 'requirements', 'do i qualify', 'who can apply', 'selection'],
    divisions: ['ventures'],
    message: `Ventures selects 4–8 companies per year. Applications are scored on:\n\n- **Founder Quality** (30%) — commitment, domain expertise, coachability\n- **Market Validation** (25%) — evidence people want this\n- **Product-Market Fit** (20%) — clear problem + solution match\n- **Technical Feasibility** (15%) — buildable in 4–8 weeks\n- **Strategic Alignment** (10%) — fits SocioFi's strengths\n\n**Requirements:** Full-time commitment, evidence of market demand, clear scope that fits an MVP. No lock-in on future development (you can hire anyone to scale).`,
    quickActions: [
      { label: 'Apply now', action: 'navigate', url: '/ventures/apply' },
      { label: 'See deal models', action: 'message' },
    ],
  },

  {
    id: 'ventures-overview',
    keywords: ['ventures', 'equity', 'no money', 'no budget', 'no cash', 'invest', 'swap equity', 'build for equity', 'pre-revenue', 'startup no budget'],
    message: `**SocioFi Ventures** invests engineering time — not money. We build your product in exchange for equity, revenue share, or a hybrid of both. Zero cash required from you.\n\nWe take **4–8 companies per year**, so selection is competitive. The process: Apply → Review (3–5 days) → Call (30 min) → Proposal (1 week) → Build (4–8 weeks).\n\nYou own 100% of the IP. We own a stake in the upside. Everyone's incentives are aligned.`,
    quickActions: [
      { label: 'See deal models', action: 'message' },
      { label: 'Apply to Ventures', action: 'navigate', url: '/ventures/apply' },
      { label: 'Am I eligible?', action: 'message' },
    ],
  },

  // ── Products ─────────────────────────────────────────────────────────────────

  {
    id: 'products-fabricx',
    keywords: ['fabricx', 'garment', 'manufacturing', 'factory', 'textile', 'production tracking', 'quality control', 'supply chain'],
    message: `**FabricxAI** is a 22-agent manufacturing intelligence platform built for the garment industry. It handles quality control, production tracking, supply chain visibility, and analytics.\n\nStatus: **In Development** (partnership stage). Pricing model will be SaaS per-factory.\n\nIf you're in garment manufacturing and want early access or a partnership conversation, reach out directly.`,
    quickActions: [
      { label: 'Express interest', action: 'message' },
      { label: 'View all products', action: 'navigate', url: '/products' },
    ],
  },

  {
    id: 'products-nexus',
    keywords: ['nexus', 'nexus aria', 'aria', 'data analyst', 'analytics', 'ai analyst', 'business intelligence', 'report generation'],
    message: `**NEXUS ARIA** is an enterprise AI data analyst — 12 specialist agents plus SCRIBE personalisation. It analyses your business data and generates role-personalised reports for different stakeholders.\n\nStatus: **PRD Complete, Pre-MVP**. SaaS subscription model.\n\nIf you want to be notified when it launches or discuss early access, I can pass your details along.`,
    quickActions: [
      { label: 'Request early access', action: 'message' },
      { label: 'View all products', action: 'navigate', url: '/products' },
    ],
  },

  {
    id: 'products-devbridge',
    keywords: ['devbridge', 'dev bridge', 'development os', 'agent orchestration', 'project intelligence'],
    message: `**DevBridge OS** is an operating system for AI-native development — project intelligence, agent orchestration, and skill management.\n\nStatus: **Concept Stage**. Earliest timeline 6–12 months. Built from lessons running Studio's own 10-agent dev pipeline.\n\nInterested in following the build? I can note your details.`,
    quickActions: [
      { label: 'Join the waitlist', action: 'message' },
      { label: 'View all products', action: 'navigate', url: '/products' },
    ],
  },

  {
    id: 'products-overview',
    keywords: ['products', 'your products', 'own products', 'sociofi products', 'software products', 'saas products'],
    message: `SocioFi builds and owns three products:\n\n- **FabricxAI** — 22-agent manufacturing intelligence for the garment industry. In Development.\n- **NEXUS ARIA** — Enterprise AI data analyst with 12 specialist agents. Pre-MVP.\n- **DevBridge OS** — Operating system for AI-native development teams. Concept stage.\n\nAll built using the same AI-native process Studio uses for clients.`,
    quickActions: [
      { label: 'FabricxAI', action: 'message' },
      { label: 'NEXUS ARIA', action: 'message' },
      { label: 'DevBridge OS', action: 'message' },
      { label: 'View Products', action: 'navigate', url: '/products' },
    ],
  },

  // ── Labs ─────────────────────────────────────────────────────────────────────

  {
    id: 'labs-overview',
    keywords: ['labs', 'research', 'open source', 'github', 'blog', 'technical writing', 'experiments', 'what are you researching'],
    message: `**SocioFi Labs** is the research and open-source arm. No client work — purely exploration and publishing.\n\nResearch areas:\n- AI Agent Architecture\n- AI-Native Development Methodology\n- Component & Pattern Libraries\n- Autonomous Monitoring & Self-Healing\n\nKey projects: **10-Agent Dev Pipeline** (powers Studio), **MIRROR Component Library**, **HAMMER Prompt Templates**.\n\nPublishes 2–4 blog posts/month and one open-source release per quarter. All under MIT license.`,
    quickActions: [
      { label: 'Follow on GitHub', action: 'navigate', url: '/labs' },
      { label: 'Read the blog', action: 'navigate', url: '/labs/blog' },
    ],
  },

  // ── Objections ───────────────────────────────────────────────────────────────

  {
    id: 'objection-expensive',
    keywords: ['too expensive', 'too costly', 'cheaper', 'cheaper alternative', 'lower price', 'reduce cost', 'can you do it cheaper', 'affordable'],
    message: `Totally fair to question. Here's a comparison:\n\n- **Freelancers:** $5,000–$15,000 for a basic project, often no deployment or maintenance.\n- **Agencies:** $50,000–$200,000 for the same scope.\n- **Full-time hire:** $80,000–$150,000/year before benefits.\n- **SocioFi Studio:** From **$2,500**, full deployment, 100% code ownership, 30-day bug fix coverage.\n\nWe're 3–5× cheaper than comparable agencies because we're based in Dhaka. The engineering quality is the same — we just don't charge Manhattan rates.`,
    quickActions: [
      { label: 'See Studio pricing', action: 'message' },
      { label: 'Start a project', action: 'navigate', url: '/studio/start-project' },
    ],
  },

  {
    id: 'objection-trust',
    keywords: ['can i trust', 'how do i know', 'proof', 'track record', 'portfolio', 'examples', 'case studies', 'experience', 'reviews'],
    message: `Good question to ask. A few things:\n\n- **100% code ownership** — you can have any engineer review what we build, anytime.\n- **Free code review** before you commit — we'll review your existing codebase or a spec for free.\n- **30-day full refund** if we can't deliver what was scoped.\n- **Portfolio** — you can see our work at /studio/portfolio.\n\nWe're also transparent about the AI-native process: AI agents do the heavy lifting, humans architect and review. We never pretend otherwise.`,
    quickActions: [
      { label: 'View portfolio', action: 'navigate', url: '/studio/portfolio' },
      { label: 'Book a free call', action: 'navigate', url: '/contact' },
      { label: 'Request free code review', action: 'message' },
    ],
  },

  {
    id: 'objection-ai-tools',
    keywords: ['why not use ai myself', 'i can use chatgpt', 'i use cursor', 'i have ai tools', 'just use ai', 'build myself'],
    message: `You absolutely should try AI tools — they're remarkable for prototyping. That's not a debate.\n\nWhat SocioFi handles is the **30% AI can't do alone**:\n- Deployment, hosting, domain, SSL\n- Database design and security\n- Authentication systems\n- Performance under real traffic\n- Bug fixes when things break at 2am\n- Maintenance and ongoing updates\n\nMost people who come to Studio already built something with AI tools. They hit a wall at "how do I actually launch this thing."`,
    quickActions: [
      { label: 'Rescue my prototype', action: 'navigate', url: '/studio/start-project' },
      { label: 'Learn more', action: 'navigate', url: '/studio' },
    ],
  },

  // ── Contact & Handoff ────────────────────────────────────────────────────────

  {
    id: 'contact',
    keywords: ['contact', 'email', 'phone', 'call', 'talk to someone', 'talk to a human', 'speak to someone', 'real person', 'connect me', 'reach out', 'get in touch', 'book a call'],
    message: `You can reach the SocioFi team directly:\n\n- **Email:** hello@sociofitechnology.com\n- **Phone:** +880 1743-036425\n- **Book a free call:** /contact\n\nOr I can collect your details right now and have the right person reach out to you with the full context of what we've discussed.`,
    quickActions: [
      { label: 'Leave my details', action: 'message' },
      { label: 'Book a call', action: 'navigate', url: '/contact' },
    ],
  },

  // ── Pricing (Generic) ────────────────────────────────────────────────────────

  {
    id: 'pricing-generic',
    keywords: ['pricing', 'price', 'cost', 'how much', 'rates', 'fees', 'charges'],
    message: `Pricing depends on what you need:\n\n- **Build something** (Studio) — From $2,500 per project\n- **Maintain your app** (Services) — From $499/month\n- **Host your app** (Cloud) — From $99/month\n- **Learn** (Academy) — From $49 per course\n- **Equity-for-dev** (Ventures) — Zero cash\n\nWhich are you looking for?`,
    quickActions: [
      { label: 'Studio pricing', action: 'message' },
      { label: 'Services pricing', action: 'message' },
      { label: 'Cloud pricing', action: 'message' },
      { label: 'Academy pricing', action: 'message' },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────────────

  {
    id: 'fallback',
    keywords: [],
    message: `I want to make sure I give you the right answer — could you tell me a bit more about what you're looking for? For example:\n\n- Are you looking to **build** something?\n- Do you need **maintenance** for existing software?\n- Are you interested in **learning** about AI development?\n- Do you have a **startup idea** but no dev budget?\n\nOr if it's easier, email **hello@sociofitechnology.com** and a real person will respond within 4 hours on business days.`,
    quickActions: [
      { label: 'Build something', action: 'navigate', url: '/studio' },
      { label: 'Maintain my app', action: 'navigate', url: '/services' },
      { label: 'Learn about AI dev', action: 'navigate', url: '/academy' },
      { label: 'Talk to a human', action: 'message' },
    ],
  },
];

// ── Matcher ────────────────────────────────────────────────────────────────────

export function matchIntent(input: string, division: string): PilotResponse {
  const text = input.toLowerCase().trim();

  let bestIntent: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    // Skip if division-restricted and doesn't match
    if (intent.divisions && !intent.divisions.includes(division)) continue;

    let score = 0;

    // Check primary keywords
    for (const kw of intent.keywords) {
      if (text.includes(kw)) {
        // Longer keyword matches score higher (more specific)
        score += kw.split(' ').length * 2;
      }
    }

    // Boost keywords add 1 point each
    if (score > 0 && intent.boost) {
      for (const bw of intent.boost) {
        if (text.includes(bw)) score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  const matched = bestScore > 0 ? bestIntent! : INTENTS.find(i => i.id === 'fallback')!;

  return {
    message: matched.message,
    quickActions: matched.quickActions,
  };
}
