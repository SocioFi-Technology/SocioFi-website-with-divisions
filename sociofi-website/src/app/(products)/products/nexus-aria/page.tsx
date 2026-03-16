import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Database, Chart, Target, Globe, Zap, Lock } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'NEXUS ARIA — SocioFi Products',
  description:
    'Enterprise AI data analyst with 12 specialist agents. Ask business questions in plain English and get answers backed by your actual data.',
  openGraph: {
    title: 'NEXUS ARIA — SocioFi Products',
    description:
      'Enterprise AI data analyst with 12 specialist agents. Ask business questions in plain English and get answers backed by your actual data.',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Products · NEXUS ARIA',
    headline: (
      <>
        Your enterprise data,
        <br />
        <span className="gradient-text">finally answerable.</span>
      </>
    ),
    description:
      'NEXUS ARIA is an AI data analyst with 12 specialist agents. Ask business questions in plain English. Get answers from your actual databases, CRM, ERP, and data warehouse — in seconds.',
    buttons: [
      { label: 'Request early access', href: '/products/nexus-aria/early-access', variant: 'primary' },
      { label: 'See all features', href: '/products/nexus-aria/features', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The problem',
    headline: 'Your data team is a bottleneck',
    description:
      'Every business question requires a ticket. Every ticket waits in a queue. By the time the answer arrives, the decision has already been made — on gut instinct.',
    points: [
      "Business leaders can't query databases — they wait days for simple reports",
      'Data teams spend 60% of their time answering the same questions in slightly different ways',
      'Self-serve BI tools require training most people never complete',
      "Dashboards show what was planned, not what's actually happening",
      'Connecting data across CRM, ERP, and finance requires specialist knowledge',
    ],
  },

  capabilitiesLabel: "ARIA's 12 agents",
  capabilitiesTitle: 'A specialist for every data domain',
  capabilities: [
    {
      icon: <Database size={24} />,
      title: 'Query Translator',
      description:
        'Converts plain-English questions into optimised SQL, executed against your actual databases. No SQL knowledge required.',
    },
    {
      icon: <Chart size={24} />,
      title: 'Insight Synthesiser',
      description:
        'Combines results from multiple data sources into a single coherent answer with supporting charts and context.',
    },
    {
      icon: <Target size={24} />,
      title: 'Anomaly Detector',
      description:
        'Continuously monitors key metrics for unexpected changes. Alerts the right person when something needs attention.',
    },
    {
      icon: <Globe size={24} />,
      title: 'Cross-System Connector',
      description:
        'Bridges CRM, ERP, finance, and marketing data. Agents that understand your full data landscape, not just one system.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Report Automator',
      description:
        'Learns which reports are generated repeatedly. Automates their production and distributes them on schedule.',
    },
    {
      icon: <Lock size={24} />,
      title: 'Access Controller',
      description:
        "Enforces row-level and field-level permissions. Analysts see what they're authorised to see — nothing more.",
    },
  ],

  processLabel: 'Getting started',
  processTitle: 'Live in your environment in 2 weeks',
  process: [
    {
      title: 'Connect your data sources',
      description:
        'ARIA integrates with your existing databases, CRM, ERP, and analytics tools via secure, read-only connectors.',
    },
    {
      title: 'Schema learning',
      description:
        'ARIA spends 3–5 days learning your data model, table relationships, and metric definitions. No manual mapping required.',
    },
    {
      title: 'Pilot with 5–10 users',
      description:
        'We start with a focused pilot group — typically finance, operations, or sales leadership. They train ARIA on real questions.',
    },
    {
      title: 'Enterprise rollout',
      description:
        'Once the pilot validates accuracy and value, we roll out to your full organisation with SSO, permissions, and onboarding support.',
    },
  ],

  caseStudy: {
    label: 'Early access result',
    headline: 'NEXARA: from 3-day reports to 40-second answers',
    description:
      "NEXUS ARIA's predecessor (NEXARA, built for a client) processed 200+ analyst queries per day across a 12-person operations team, eliminating a full-time analyst role that had been a queue bottleneck.",
    result: '40 sec',
    resultLabel: 'from question asked to answer received (was 3 business days)',
  },

  faqs: [
    {
      question: "How does ARIA handle data that's in multiple systems?",
      answer:
        "ARIA maintains a unified semantic layer — a map of how your data sources relate to each other. When you ask a cross-system question, ARIA's connector agents query each source, reconcile the data, and synthesise a single answer. You ask the question once; ARIA handles the joins.",
    },
    {
      question: 'What if ARIA gives a wrong answer?',
      answer:
        "ARIA shows its work. Every answer includes the query it ran, the source tables it touched, and a confidence indicator. Business users can see exactly what data was used. When users flag incorrect answers, ARIA learns from the correction and improves. We also run accuracy benchmarks during the pilot phase.",
    },
    {
      question: 'Is NEXUS ARIA available now?',
      answer:
        "NEXUS ARIA is currently in early access for enterprise teams. We're onboarding a limited number of pilot organisations with structured support. If you're interested, apply via the early access form — we'll assess fit and timeline during a 30-minute call.",
    },
  ],

  cta: {
    title: 'Join the early access programme',
    subtitle:
      'NEXUS ARIA is onboarding a limited number of enterprise pilots. Structured support included.',
    primaryCTA: { label: 'Apply for early access', href: '/products/nexus-aria/early-access' },
    ghostCTA: { label: 'See all features', href: '/products/nexus-aria/features' },
    note: '30-minute fit call. No commitment required.',
  },
};

export default function NexusAriaPage() {
  return <ServiceDetail content={content} />;
}
