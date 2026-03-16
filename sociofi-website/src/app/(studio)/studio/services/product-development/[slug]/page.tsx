import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Rocket, Code, Shield, Globe, Brain, Wrench, Layers, Database } from '@/lib/icons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ── Deep-dive data map ─────────────────────────────────────────────────────────

const PAGES: Record<string, { metadata: Metadata; content: DeepDiveContent }> = {

  'mvp': {
    metadata: {
      title: 'MVP Sprint — SocioFi Studio',
      description:
        'A validated, deployed MVP in 3–6 weeks. Tight scope, real infrastructure, something actual users can interact with — not just a demo.',
    },
    content: {
      hero: {
        badge: 'Studio · Product Development · MVP',
        headline: (
          <>
            A Real MVP.{' '}
            <span className="gradient-text">In 3–6 Weeks.</span>
          </>
        ),
        description:
          "Not a demo. Not a clickable mockup. A deployed, testable product with real users on real infrastructure — built tight, shipped fast, designed to validate your core hypothesis.",
        buttons: [
          { label: 'Start an MVP Sprint', href: '/studio/start-project', variant: 'primary' },
          { label: 'See MVP pricing', href: '/studio/pricing', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Rocket size={22} aria-hidden="true" />,
          title: "You have an idea and need to validate it fast",
          description:
            "You know what problem you're solving. You have a hypothesis about the solution. You need something real to put in front of users — not another month of planning.",
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: "You've prototyped with AI tools and need it to actually work",
          description:
            "You built something with an AI coding platform. It works in demos. Now you need it to work for real users, with real auth, real payments, and real infrastructure.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: "You need something to show investors or early customers",
          description:
            "A landing page isn't enough anymore. You need a working product to close your first customers or support your fundraising conversation.",
        },
      ],
      useCasesLabel: 'When to use this',
      useCasesTitle: 'This is the right choice if...',
      deliverable: {
        label: "What you'll get",
        headline: 'A deployed product you own completely',
        description:
          'At the end of a Sprint, you have a real product — not a deliverable that needs another team to take it live. Everything is set up, documented, and handed over.',
        items: [
          { label: 'Deployed application', detail: 'live at your domain, on infrastructure you own' },
          { label: 'Authentication system', detail: 'secure login, password reset, session management' },
          { label: 'Core feature set', detail: 'scoped to the minimum that validates your hypothesis' },
          { label: 'Payment integration', detail: 'if revenue is part of the validation' },
          { label: 'Error monitoring', detail: 'you see when something breaks before users complain' },
          { label: 'Source code & repository', detail: 'yours to keep, modify, and hand to anyone' },
          { label: 'Deployment documentation', detail: 'how to update, how to scale, how to debug' },
          { label: '30-day post-launch support', detail: 'included — bugs and unexpected behaviour fixed at no extra charge' },
        ],
      },
      timeline: {
        duration: '3–6 weeks',
        price: 'From $4,500',
        note: "Final price is determined by scope in the proposal. We give you a specific number — not a range — before you commit.",
      },
      faqs: [
        {
          question: "What's the difference between an MVP Sprint and full product development?",
          answer:
            "An MVP Sprint is scoped aggressively to the minimum that validates your core hypothesis. Full product development is for more complete products with multiple user flows and more complex requirements. If you're not sure which you need, tell us what you're building and we'll tell you which fits.",
        },
        {
          question: "What if I want to add features after launch?",
          answer:
            "That's the plan. The Sprint gets you to market. After you've validated with real users, we scope a Phase 2 — now informed by what you actually learned. You're not locked into a roadmap before you know what users want.",
        },
        {
          question: "Can you build an MVP on top of an AI-generated prototype?",
          answer:
            "Yes. We review what you have, keep what's usable, fix what isn't, and build the rest. Our Rescue & Ship service is designed for exactly this — sometimes it's faster than starting from scratch.",
        },
        {
          question: "Do I need to provide designs?",
          answer:
            "No — we design as we build. We use functional, clean design patterns that look professional and convert well. If you have brand guidelines or existing designs, we follow them.",
        },
      ],
      cta: {
        title: 'What are you trying to validate?',
        subtitle:
          "Tell us your core hypothesis and what you've built so far. We'll tell you what the smallest version looks like.",
        primaryCTA: { label: 'Book a scoping call', href: '/studio/start-project' },
        ghostCTA: { label: 'See MVP pricing', href: '/studio/pricing' },
        note: 'Free 30-minute call. No commitment.',
      },
    },
  },

  'saas': {
    metadata: {
      title: 'SaaS Development — SocioFi Studio',
      description:
        'Build a software-as-a-service product with subscription billing, multi-tenant architecture, and the infrastructure to grow from 10 to 10,000 customers.',
    },
    content: {
      hero: {
        badge: 'Studio · Product Development · SaaS',
        headline: (
          <>
            Build a SaaS Product{' '}
            <span className="gradient-text">That Scales.</span>
          </>
        ),
        description:
          "SaaS products have specific requirements that general web development doesn't address: multi-tenant data architecture, subscription billing, usage limits, customer portals, and the infrastructure to serve thousands of concurrent users. We've built this stack before.",
        buttons: [
          { label: 'Start a SaaS project', href: '/studio/start-project', variant: 'primary' },
          { label: 'See our work', href: '/studio/portfolio', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Layers size={22} aria-hidden="true" />,
          title: "You're building a product for multiple customers",
          description:
            "You need one codebase that serves many customers — each with their own data, their own users, their own settings. Multi-tenancy done correctly from the start.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: "You need subscription billing and account management",
          description:
            "Stripe subscriptions, trial periods, plan upgrades and downgrades, invoices, usage limits. Revenue infrastructure that handles the full billing lifecycle.",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: "You want to add AI capabilities to your product",
          description:
            "Document processing, smart search, workflow automation, AI-generated content. SaaS products are increasingly expected to have AI features — we build them in from the start.",
        },
      ],
      useCasesLabel: 'When this fits',
      useCasesTitle: 'SaaS is the right model if...',
      deliverable: {
        label: "What you'll get",
        headline: 'A complete SaaS foundation',
        description:
          'The infrastructure, patterns, and components that every SaaS product needs — built correctly so you can focus on what makes your product unique.',
        items: [
          { label: 'Multi-tenant architecture', detail: 'data isolated per customer, scalable from day one' },
          { label: 'Authentication & authorisation', detail: 'login, SSO, role-based access, team management' },
          { label: 'Subscription billing', detail: 'Stripe integration, plan management, billing portal' },
          { label: 'Customer dashboard', detail: 'account settings, usage, billing history' },
          { label: 'Admin panel', detail: 'manage customers, subscriptions, and product data' },
          { label: 'Email system', detail: 'transactional emails, notifications, onboarding sequences' },
          { label: 'API', detail: 'for integrations, webhooks, and future platform features' },
          { label: 'Monitoring & alerting', detail: 'uptime, errors, performance, and cost tracking' },
        ],
      },
      timeline: {
        duration: '8–16 weeks',
        price: 'From $12,000',
        note: 'Scope determines the final price. A focused SaaS product with core features runs 8–12 weeks. A more complete product with advanced features runs 12–16 weeks.',
      },
      faqs: [
        {
          question: "How do you handle data isolation between customers?",
          answer:
            "We design multi-tenancy at the database level — either row-level security with tenant identifiers, or separate database schemas per tenant, depending on your compliance requirements and scale expectations. We make this decision with you during architecture design.",
        },
        {
          question: "Can you build a marketplace or two-sided platform?",
          answer:
            "Yes. Two-sided platforms have additional complexity — payments, matching logic, review systems — that we scope carefully. Tell us what you're building and we'll assess the right approach.",
        },
        {
          question: "What does the Stripe integration cover?",
          answer:
            "Subscriptions, one-time payments, trials, plan changes, cancellations, refunds, disputes, tax handling, invoices, and the billing portal. We handle the full lifecycle including the edge cases.",
        },
        {
          question: "Can you add AI features to the SaaS product?",
          answer:
            "Yes — and we recommend designing for them from the start. AI features require specific infrastructure (vector databases, streaming responses, cost controls) that are much cheaper to design in than to retrofit.",
        },
      ],
      cta: {
        title: "Building a SaaS product?",
        subtitle:
          "Tell us what it does, who it's for, and what you've built so far. We'll scope the build and give you a clear timeline and price.",
        primaryCTA: { label: 'Start a SaaS project', href: '/studio/start-project' },
        ghostCTA: { label: 'See our portfolio', href: '/studio/portfolio' },
        note: 'Free scoping call. Written proposal within 48 hours.',
      },
    },
  },

  'web-app': {
    metadata: {
      title: 'Web Application Development — SocioFi Studio',
      description:
        'Full-stack web applications built for your specific use case. Custom workflows, complex data models, and the integrations your users need.',
    },
    content: {
      hero: {
        badge: 'Studio · Product Development · Web App',
        headline: (
          <>
            A Web Application Built for{' '}
            <span className="gradient-text">How You Actually Work.</span>
          </>
        ),
        description:
          "Off-the-shelf software isn't built for your use case. We build web applications designed around your specific workflows, your data model, and your users — not a generic template that sort of fits.",
        buttons: [
          { label: 'Discuss your application', href: '/studio/start-project', variant: 'primary' },
          { label: 'See portfolio', href: '/studio/portfolio', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: "You have complex data that needs a proper application",
          description:
            "Your business manages relationships, processes, or workflows that are too complex for a spreadsheet but too specific for off-the-shelf software.",
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: "You need control over your data and infrastructure",
          description:
            "You can't use a third-party SaaS because of compliance, data sovereignty, or the need for deep customisation. You need software you own.",
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: "You're replacing a manual process or legacy system",
          description:
            "Your team currently uses spreadsheets, email chains, or legacy software that doesn't integrate with anything. You need a modern replacement.",
        },
      ],
      useCasesLabel: 'When this fits',
      useCasesTitle: 'A custom web app is the right choice if...',
      deliverable: {
        label: "What you'll get",
        headline: 'A web application your team will actually use',
        description:
          'We build to the spec we agreed — no more, no less. Every feature is designed around real workflows, not theoretical use cases.',
        items: [
          { label: 'Custom data model', detail: 'designed around your actual business entities and relationships' },
          { label: 'Role-based access control', detail: 'different users see and can do different things' },
          { label: 'Workflow engine', detail: 'multi-step processes, approvals, status management' },
          { label: 'Reporting & exports', detail: 'the data views and exports your team needs' },
          { label: 'Third-party integrations', detail: 'connected to the tools your business already uses' },
          { label: 'Responsive design', detail: 'works on desktop and mobile without a separate mobile app' },
          { label: 'Source code & hosting', detail: 'you own everything — no vendor lock-in' },
          { label: 'Documentation', detail: 'how the application works, how to maintain it, how to extend it' },
        ],
      },
      timeline: {
        duration: '6–16 weeks',
        price: 'From $8,000',
        note: "Timeline and price depend on complexity. We give you a specific quote — not a range — after the scoping call.",
      },
      faqs: [
        {
          question: "What technologies do you use?",
          answer:
            "For most web applications: Next.js (React) for the frontend, Node.js or Python for the backend, PostgreSQL for the database. We choose the right tool for the job — not the trendy one.",
        },
        {
          question: "Can you integrate with our existing systems?",
          answer:
            "Yes. We connect to your existing databases, APIs, and third-party services. We document what we find and recommend the cleanest integration approach.",
        },
        {
          question: "What if our requirements change during the build?",
          answer:
            "Scope changes are handled in writing. We assess the impact on timeline and price and get your approval before actioning anything. No surprise invoices.",
        },
        {
          question: "How do you handle data migration from our current system?",
          answer:
            "We scope data migration as part of the project. We write and test the migration scripts in staging before running them on production data. No manual copy-paste.",
        },
      ],
      cta: {
        title: "Tell us what you need to build.",
        subtitle:
          "Describe the use case, the users, and what the current solution looks like. We'll scope the application and give you a clear proposal.",
        primaryCTA: { label: 'Discuss your application', href: '/studio/start-project' },
        ghostCTA: { label: 'See our work', href: '/studio/portfolio' },
        note: 'Free scoping call. Written proposal within 48 hours.',
      },
    },
  },
};

// ── Route handlers ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return page.metadata;
}

export default async function ProductDevelopmentDeepDivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return <DeepDive content={page.content} />;
}
