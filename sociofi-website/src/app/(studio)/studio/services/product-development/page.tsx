import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Code, Database, Lock, Rocket, Gear, Layers, Target,
} from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Development — SocioFi Studio',
  description:
    'Turn your idea into a live product. Full-stack web and mobile applications built from scratch — architecture, frontend, backend, database, auth, payments, deployment. MVP in 2–3 weeks.',
  alternates: { canonical: '/studio/services/product-development' },
  openGraph: {
    title: 'Product Development — SocioFi Studio',
    description:
      'Turn your idea into a live product. Full-stack web and mobile applications built from scratch — architecture, frontend, backend, database, auth, payments, deployment. MVP in 2–3 weeks.',
    url: '/studio/services/product-development',
  },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'PRODUCT DEVELOPMENT',
    headline: (
      <>
        Turn Your Idea Into{' '}
        <span className="gradient-text">a Live Product.</span>
      </>
    ),
    description:
      "We build full-stack web and mobile applications from scratch. SaaS platforms, customer portals, internal systems — architecture, frontend, backend, database, auth, payments, deployment. We handle the complete build so you can focus on the business.",
    buttons: [
      { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
      { label: 'See pricing', href: '/studio/pricing', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Who it\'s for',
    headline: 'You have the idea. The market. The vision. Not the team.',
    description:
      "Most people we work with have already tried to build this themselves — or with AI tools that got them 60% of the way there. The last 40% is where it breaks: deployment, auth, payments, edge cases, production monitoring. That\'s what we do.",
    points: [
      'Founders with a validated idea who need a real product, not a prototype',
      'Businesses launching a new customer-facing tool or platform',
      'Teams building internal systems that need to be production-grade from day one',
    ],
  },

  capabilitiesLabel: 'What\'s included',
  capabilitiesTitle: 'The complete build — nothing left for you to figure out.',
  capabilities: [
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Frontend Development',
      description:
        'Responsive, performant interfaces built with modern frameworks. Mobile-first, accessibility-compliant, and designed to handle real user load.',
    },
    {
      icon: <Gear size={22} aria-hidden="true" />,
      title: 'Backend API',
      description:
        'REST or GraphQL APIs with proper error handling, rate limiting, input validation, and structured logging. Built to scale, not just to demo.',
    },
    {
      icon: <Database size={22} aria-hidden="true" />,
      title: 'Database Design',
      description:
        'Schema design, migrations, indexing, and query optimization. We pick the right database for your workload — relational, document, or both.',
    },
    {
      icon: <Lock size={22} aria-hidden="true" />,
      title: 'Authentication & Authorization',
      description:
        'Secure auth from day one. Sessions, JWTs, OAuth providers, role-based access control. No bolted-on auth as an afterthought.',
    },
    {
      icon: <Layers size={22} aria-hidden="true" />,
      title: 'Payment Integration',
      description:
        'Stripe or equivalent — subscriptions, one-time charges, usage-based billing, refunds, and webhooks. Tested against edge cases before launch.',
    },
    {
      icon: <Rocket size={22} aria-hidden="true" />,
      title: 'Deployment & DevOps',
      description:
        'Production infrastructure, CI/CD pipeline, environment configuration, error monitoring, uptime alerts. Deployed and stable before we hand over the keys.',
    },
  ],

  processLabel: 'Service-specific process',
  processTitle: 'From discovery to launch.',
  process: [
    {
      title: '01. Discovery & scoping',
      description:
        'A 30-minute free call where we map what you\'re building, what it needs to do, and who it\'s for. We leave with a clear scope — not a wishlist.',
      duration: '30 minutes',
    },
    {
      title: '02. Architecture design',
      description:
        'Before any code is written, we design the system: data model, API structure, third-party dependencies, deployment target. This is the step most teams skip and regret later.',
      duration: '1–2 days',
    },
    {
      title: '03. AI-powered build',
      description:
        'Our engineers use AI tooling to accelerate development — components, tests, boilerplate. Every piece passes through a senior engineer before it enters the codebase. Fast output, human quality.',
      duration: '1–5 weeks',
    },
    {
      title: '04. Launch & handoff',
      description:
        'Deployed to production. Tested. Documented. You receive the codebase, infrastructure access, deployment docs, and 30 days of post-launch support.',
      duration: '30 days included',
    },
  ],

  caseStudy: {
    label: 'Product development in practice',
    headline: 'From blank repo to 10,000 active users in under 12 weeks.',
    description:
      'A founder came in with a clear product idea, no code, and a 6-week runway to prove it. We scoped it Monday, proposed Thursday, started the following week. MVP live in 3 weeks. Full product in 8.',
    result: '10,000 active users — 12 weeks from first call',
    resultLabel: 'measured outcome',
    href: '/studio/portfolio',
  },

  faqs: [
    {
      question: 'Do I need to provide a spec?',
      answer:
        'No. We\'ll write it together during scoping. Just bring the idea — the problem you\'re solving, who you\'re solving it for, and any constraints (budget, timeline, existing tools). We turn that into a spec.',
    },
    {
      question: 'What if I already have designs?',
      answer:
        'We\'ll use them. If you have Figma files, wireframes, or even rough sketches, we build from those. If you don\'t have designs, UI/UX is included in the build.',
    },
    {
      question: 'Do I own the code?',
      answer:
        '100%, from day one. You have repository access during the build. On delivery, all intellectual property transfers to you. No lock-in, no license fees, no dependency on us to keep running.',
    },
    {
      question: 'What if scope grows mid-project?',
      answer:
        'We tell you before doing any extra work. Every scope change gets a written assessment: what it adds, how long it takes, what it costs. You approve it or we don\'t do it.',
    },
    {
      question: 'Can I start small and expand later?',
      answer:
        'Yes. Most clients build an MVP first and expand once they\'ve validated it with real users. We architect for that from the start — clean foundations that don\'t need to be rewritten when you scale.',
    },
  ],

  cta: {
    title: 'Ready to build?',
    subtitle:
      "Tell us what you're building. We'll tell you what it takes, how long it takes, and what it costs — in a free 30-minute call.",
    primaryCTA: { label: 'Start a project', href: '/studio/start-project' },
    ghostCTA: { label: 'See our work', href: '/studio/portfolio' },
    note: 'Free scoping call. Fixed-price proposal within 2–3 days.',
  },
};

export default function ProductDevelopmentPage() {
  return <ServiceDetail content={content} />;
}
