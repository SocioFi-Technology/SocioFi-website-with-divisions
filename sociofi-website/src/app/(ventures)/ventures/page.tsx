import type { Metadata } from 'next';
import DivisionOverview from '@/templates/DivisionOverview';
import type { DivisionOverviewContent } from '@/templates/DivisionOverview';
import { Briefcase, Chart, Layers, Code, Brain, Shield } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Ventures — SocioFi Technology',
  description:
    'SocioFi Ventures co-builds software products with founders through equity, revenue share, or hybrid arrangements. We bring the development team — you bring the idea and the market.',
};

const content: DivisionOverviewContent = {
  hero: {
    badge: 'Ventures · Co-Build with Us',
    headline: (
      <>
        We don&apos;t just build for you.
        <br />
        <span className="gradient-text">We build with you.</span>
      </>
    ),
    description:
      'Ventures partners with founders who have a product idea and market access but need a development team. We co-build the product in exchange for equity, revenue share, or a hybrid of both.',
    buttons: [
      { label: 'Apply to co-build', href: '/ventures/apply', variant: 'primary' },
      { label: 'See how it works', href: '/ventures/how-it-works', variant: 'ghost' },
    ],
  },

  metrics: [
    { numeric: 8, label: 'Portfolio companies' },
    { numeric: 3, label: 'Deal models available' },
    { numeric: 14, suffix: ' wks', label: 'Average time to MVP' },
    { numeric: 100, suffix: '%', label: 'Equity-free option available' },
  ],

  servicesLabel: 'Deal models',
  servicesTitle: 'Three ways to co-build',

  services: [
    {
      icon: <Briefcase size={28} />,
      title: 'Equity Deal',
      description:
        'We build your product in exchange for an equity stake. No upfront cost — we\'re aligned with your success from day one.',
      href: '/ventures/models/equity',
      linkText: 'How equity works',
    },
    {
      icon: <Chart size={28} />,
      title: 'Revenue Share',
      description:
        'We build in exchange for a percentage of revenue until a defined cap. Clean structure, no dilution, predictable terms.',
      href: '/ventures/models/revenue-share',
      linkText: 'How revenue share works',
    },
    {
      icon: <Layers size={28} />,
      title: 'Hybrid Model',
      description:
        'A reduced upfront fee combined with equity or revenue share. Shared investment, shared upside — for founders who want skin in the game on both sides.',
      href: '/ventures/models/hybrid',
      linkText: 'How hybrid works',
    },
  ],

  featuresLabel: 'What we bring',
  featuresTitle: 'More than just development',

  features: [
    {
      icon: <Code size={24} />,
      title: 'Full development team',
      description:
        'Senior engineers, AI specialists, and a dedicated lead — everything needed to take a product from concept to production.',
    },
    {
      icon: <Brain size={24} />,
      title: 'AI infrastructure',
      description:
        'Our AI agent stack is already built. We apply it to your product from day one — no starting from scratch on agent architecture.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Ongoing support',
      description:
        'We don\'t ship and disappear. Portfolio companies get ongoing maintenance, monitoring, and engineering support as part of every deal.',
    },
  ],

  featured: {
    label: 'Portfolio spotlight',
    headline: 'FabricxAI: from idea to 22 agents in 4 months',
    description:
      'A founder came to us with deep garment industry knowledge and a clear problem: factory coordination was broken. We co-built the product architecture, deployed the first agents, and continue as the engineering partner. FabricxAI is now in active deployment across multiple factories.',
    href: '/ventures/portfolio',
    cta: 'See the portfolio',
  },

  testimonials: [
    {
      quote:
        'I had the industry knowledge and the customer relationships. I didn\'t have a development team. Ventures gave me both — and structured the deal so I wasn\'t burning cash before we had revenue.',
      author: 'Founder, FabricxAI',
      role: 'CEO',
      company: 'Manufacturing AI',
    },
    {
      quote:
        'The difference between Ventures and a dev agency is that they\'re on the cap table. They answer emails on Sunday because it\'s their product too.',
      author: 'Portfolio founder',
      role: 'CEO',
      company: 'SaaS startup',
    },
  ],

  cta: {
    title: 'Ready to co-build?',
    subtitle:
      'Applications open. We review every submission personally — no automated filters.',
    primaryCTA: { label: 'Apply now', href: '/ventures/apply' },
    ghostCTA: { label: 'See what we look for', href: '/ventures/what-we-look-for' },
    note: 'Response within 5 business days.',
  },
};

export default function VenturesPage() {
  return <DivisionOverview content={content} />;
}
