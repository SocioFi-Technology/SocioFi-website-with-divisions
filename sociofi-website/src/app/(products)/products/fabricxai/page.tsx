import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Chart, Gear, Eye, Building, Target, Brain } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'FabricxAI — SocioFi Products',
  description:
    '22-agent manufacturing intelligence platform for the garment industry. Demand forecasting, production scheduling, quality control, and supplier management in one coordinated system.',
  openGraph: {
    title: 'FabricxAI — SocioFi Products',
    description:
      '22-agent manufacturing intelligence platform for the garment industry. Demand forecasting, production scheduling, quality control, and supplier management in one coordinated system.',
    type: 'website',
    images: ['/products/opengraph-image'],
  },
  twitter: { card: 'summary_large_image' },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Products · FabricxAI',
    headline: (
      <>
        Manufacturing intelligence for
        <br />
        the <span className="gradient-text">garment industry.</span>
      </>
    ),
    description:
      'The garment industry runs on spreadsheets, WhatsApp groups, and manual coordination. FabricxAI replaces that fragile stack with 22 coordinated AI agents — each a specialist, all working together.',
    buttons: [
      { label: 'Request a demo', href: '/products/fabricxai/contact', variant: 'primary' },
      { label: 'See all features', href: '/products/fabricxai/features', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The problem',
    headline: 'Garment manufacturing is a coordination nightmare',
    description:
      'Most factories juggle 6–8 disconnected systems — or worse, spreadsheets. Demand arrives. Planning starts over. By the time production begins, something is already wrong.',
    points: [
      "Demand signals live in email, WhatsApp, and buyer portals — nobody's reading all of them",
      'Production planning is manual, slow, and recalculates from scratch with every change',
      'Quality issues surface at final inspection — too late to prevent rework or delays',
      'Supplier lead times are tracked in spreadsheets that are always out of date',
      'No single view of where a production run actually stands right now',
    ],
  },

  capabilitiesLabel: 'What FabricxAI does',
  capabilitiesTitle: '22 agents. One platform.',
  capabilities: [
    {
      icon: <Chart size={24} />,
      title: 'Demand Intelligence',
      description:
        'Reads buyer orders, seasonal patterns, and market signals. Builds rolling 12-week demand forecasts that update automatically.',
    },
    {
      icon: <Gear size={24} />,
      title: 'Production Scheduling',
      description:
        'Converts demand forecasts into production plans. Allocates machines, workers, and materials. Flags conflicts before they become delays.',
    },
    {
      icon: <Eye size={24} />,
      title: 'Quality Control',
      description:
        'Monitors inline QC checkpoints. Identifies defect patterns early. Triggers rework before goods reach final inspection.',
    },
    {
      icon: <Building size={24} />,
      title: 'Supplier Management',
      description:
        'Tracks lead times, capacity, and performance across your supplier network. Proactively flags risks and suggests alternatives.',
    },
    {
      icon: <Target size={24} />,
      title: 'Delivery Tracking',
      description:
        'End-to-end visibility from order confirmation to shipment. Every stakeholder sees the same live status — no chasing, no guesswork.',
    },
    {
      icon: <Brain size={24} />,
      title: 'Human Oversight Layer',
      description:
        'Every agent decision is visible and overridable. Approvals, exceptions, and manual adjustments are built in — AI assists, humans decide.',
    },
  ],

  processLabel: 'How it works',
  processTitle: 'From data to decisions in minutes',
  process: [
    {
      title: 'Connect your systems',
      description:
        'We integrate FabricxAI with your existing ERP, buyer portals, and supplier systems. Most integrations are live within 2 weeks.',
    },
    {
      title: 'Agents learn your factory',
      description:
        'The system ingests historical production data, quality records, and supplier history. Baseline models are established in 4–6 weeks.',
    },
    {
      title: 'Start with one module',
      description:
        'We recommend starting with Demand Intelligence or Production Scheduling — the fastest to show ROI. Expand at your pace.',
    },
    {
      title: 'Full platform operation',
      description:
        'All 22 agents running in coordination. Your team gets a single dashboard — and AI that surfaces the right decision at the right time.',
    },
  ],

  caseStudy: {
    label: 'Early results',
    headline: 'Pilot factory: 34% reduction in late deliveries',
    description:
      "A mid-size garment manufacturer in Bangladesh ran a 12-week pilot with FabricxAI's demand and scheduling agents. Production plans that previously took 3 days to produce now update in minutes when buyer orders change.",
    result: '34%',
    resultLabel: 'reduction in late deliveries across the pilot period',
  },

  faqs: [
    {
      question: 'Is FabricxAI suitable for smaller factories?',
      answer:
        'Yes, with caveats. FabricxAI delivers the most value for factories processing 50+ orders per month with 3+ production lines. Smaller operations can use it, but the complexity-to-value ratio improves significantly at scale. We offer a pilot scope assessment before any commitment.',
    },
    {
      question: 'How long does implementation take?',
      answer:
        'Initial integration and first-module activation typically takes 4–8 weeks depending on your existing systems. Full platform deployment, with all 22 agents operational and calibrated to your data, takes 3–4 months. We run implementations alongside existing operations — no production shutdown required.',
    },
    {
      question: 'Does it require replacing our current software?',
      answer:
        'No. FabricxAI sits on top of your existing ERP, spreadsheets, and communication tools — reading from them and enriching them. We integrate rather than replace. Over time, some legacy tools become redundant, but that\'s your choice, not a requirement.',
    },
  ],

  cta: {
    title: 'See FabricxAI in your factory',
    subtitle:
      'We run 2-week scoped pilots for qualified manufacturers. Free for factories with 50+ monthly orders.',
    primaryCTA: { label: 'Request a demo', href: '/products/fabricxai/contact' },
    ghostCTA: { label: 'See all features', href: '/products/fabricxai/features' },
    note: 'Demo includes a live walkthrough with your own data.',
  },
};

export default function FabricxAIPage() {
  return <ServiceDetail content={content} />;
}
