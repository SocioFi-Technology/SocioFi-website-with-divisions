import HubRouter, { type HubRouterContent } from '@/templates/HubRouter';
import { Code, Wrench, Zap } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — SocioFi Studio',
  description:
    'SocioFi Studio builds full products, internal tools, and automation systems. Fixed scope, fixed price, production-ready — delivered in weeks.',
  alternates: { canonical: '/studio/services' },
  openGraph: {
    title: 'Services — SocioFi Studio',
    description:
      'SocioFi Studio builds full products, internal tools, and automation systems. Fixed scope, fixed price, production-ready — delivered in weeks.',
    url: '/studio/services',
  },
};

const content: HubRouterContent = {
  hero: {
    badge: 'Studio · Services',
    headline: 'What we build for you',
    description:
      "Three service lines. Each one solves a different problem — but all are built the same way: AI-accelerated development, human-reviewed quality, fixed price.",
    buttons: [
      { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
      { label: 'See pricing', href: '/studio/pricing', variant: 'ghost' },
    ],
  },
  gridMode: 'cards',
  gridLabel: 'Choose your service',
  gridTitle: 'Three ways we build software',
  cards: [
    {
      label: 'Product Development',
      headline: "From idea to launched product — in weeks, not months.",
      description:
        "Full-stack applications built with AI assistance, reviewed by senior engineers. You get a production-ready product with clean code, proper documentation, and 30 days of post-launch support.",
      href: '/studio/services/product-development',
      cta: 'Explore Product Development',
      accent: '#72C4B2',
      icon: <Code size={22} aria-hidden="true" />,
    },
    {
      label: 'Internal Tools',
      headline: "Custom dashboards, portals, and ops software — built around your workflow.",
      description:
        "Your business runs on spreadsheets and manual processes. We replace them with purpose-built internal tools that automate the repetitive parts and give your team visibility.",
      href: '/studio/services/internal-tools',
      cta: 'Explore Internal Tools',
      accent: '#72C4B2',
      icon: <Wrench size={22} aria-hidden="true" />,
    },
    {
      label: 'Automation & Integration',
      headline: "Connect your stack. Eliminate the manual work.",
      description:
        "APIs, webhooks, workflow automation, and system integrations. We build the plumbing that makes your existing tools talk to each other — and eliminates the hours of copy-paste between them.",
      href: '/studio/services/automation-integration',
      cta: 'Explore Automation',
      accent: '#72C4B2',
      icon: <Zap size={22} aria-hidden="true" />,
    },
  ],
  flow: {
    label: 'How every project works',
    headline: "Same process across all three service lines",
    steps: [
      {
        title: 'Scoping call (30 min)',
        description:
          "A senior engineer reviews your situation and gives you an honest scope — what it takes, how long, what it costs. You leave with a clear picture.",
      },
      {
        title: 'Fixed proposal',
        description:
          "Deliverables, timeline, and price in writing. We don't start until you've signed off. No surprises.",
      },
      {
        title: 'Build with visibility',
        description:
          "One-week build cycles. You review real progress at each checkpoint. A shared board shows exactly where things stand.",
      },
      {
        title: 'Launch and handover',
        description:
          "Deployed to production. Code, credentials, and docs handed to you. 30 days post-launch support included.",
      },
    ],
  },
  cta: {
    title: "Not sure which service fits?",
    subtitle:
      "Describe what you're trying to build. We'll tell you honestly which path makes sense — and what it would cost.",
    primaryCTA: { label: 'Start a project', href: '/studio/start-project' },
    ghostCTA: { label: 'See our work', href: '/studio/portfolio' },
    note: 'Free scoping call. No commitment.',
  },
};

export default function StudioServicesPage() {
  return <HubRouter content={content} />;
}
