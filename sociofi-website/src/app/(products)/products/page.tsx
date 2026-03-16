import type { Metadata } from 'next';
import DivisionOverview, { type DivisionOverviewContent } from '@/templates/DivisionOverview';
import { Brain, Chart, Code, Target, GitBranch } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Products — SocioFi Technology',
  description:
    'Software we build, own, and run. Three platforms solving hard problems in manufacturing intelligence, enterprise data analysis, and software delivery.',
  openGraph: {
    title: 'Products — SocioFi Technology',
    description:
      'Software we build, own, and run. Three platforms solving hard problems in manufacturing intelligence, enterprise data analysis, and software delivery.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
};

const content: DivisionOverviewContent = {
  hero: {
    badge: 'Products · Our Software',
    headline: (
      <>
        Software We Build, <span className="gradient-text">Own, and Run.</span>
      </>
    ),
    description:
      "We don't just build software for clients. We build products of our own — platforms solving hard problems in manufacturing, enterprise data analysis, and software delivery itself.",
    buttons: [
      { label: 'View Products', href: '#products', variant: 'primary' },
      { label: 'See roadmap', href: '/products/roadmap', variant: 'ghost' },
    ],
  },

  metrics: [
    { numeric: 3, label: 'Products in production' },
    { numeric: 22, label: 'AI agents in FabricxAI' },
    { numeric: 12, label: 'Agents in NEXUS ARIA' },
    { numeric: 200, suffix: '+', label: 'Beta users served' },
  ],

  servicesLabel: 'Our products',
  servicesTitle: 'Three platforms. One philosophy.',
  services: [
    {
      title: 'FabricxAI',
      icon: <Brain size={28} />,
      description:
        '22-agent manufacturing intelligence platform for the garment industry. Demand forecasting, production scheduling, quality control, supplier management — in one system.',
      href: '/products/fabricxai',
      linkText: 'Explore FabricxAI',
    },
    {
      title: 'NEXUS ARIA',
      icon: <Chart size={28} />,
      description:
        'Enterprise AI data analyst with 12 specialist agents. Ask business questions in plain English, get answers backed by your actual data.',
      href: '/products/nexus-aria',
      linkText: 'Explore NEXUS ARIA',
    },
    {
      title: 'DevBridge OS',
      icon: <Code size={28} />,
      description:
        "The internal development platform powering SocioFi's delivery pipeline. AI-assisted code review, deployment automation, and quality gates — being packaged as a product.",
      href: '/products/devbridge',
      linkText: 'Explore DevBridge',
    },
  ],

  featuresLabel: 'Our philosophy',
  featuresTitle: 'Built to own, not just to ship',
  features: [
    {
      icon: <Target size={24} />,
      title: 'Vertical focus',
      description:
        'Each product solves a specific industry problem deeply — not a generic tool trying to be everything.',
    },
    {
      icon: <Brain size={24} />,
      title: 'Agent-native architecture',
      description:
        'Built from day one with multi-agent AI at the core. Not AI bolted on — AI as the foundation.',
    },
    {
      icon: <GitBranch size={24} />,
      title: 'Continuously evolved',
      description:
        'We use these products ourselves. Every product improvement is driven by real operational feedback, not roadmap theatre.',
    },
  ],

  featured: {
    label: 'Product spotlight',
    headline: 'FabricxAI: 22 agents running a garment factory',
    description:
      'The garment industry runs on spreadsheets and WhatsApp. FabricxAI replaces that with 22 coordinated AI agents covering every step from demand sensing to shipment — with a human oversight layer that actually makes sense.',
    href: '/products/fabricxai',
    cta: 'Explore FabricxAI',
  },

  cta: {
    title: 'Interested in early access?',
    subtitle:
      'NEXUS ARIA is accepting enterprise pilots. DevBridge is in private beta. Tell us what you\'re working on.',
    primaryCTA: { label: 'Get early access', href: '/products/nexus-aria/early-access' },
    ghostCTA: { label: 'See the roadmap', href: '/products/roadmap' },
  },
};

export default function ProductsPage() {
  return <DivisionOverview content={content} />;
}
