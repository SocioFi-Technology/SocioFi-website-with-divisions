import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Brain, Chart, Users } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS ARIA Features — SocioFi Products',
  description:
    "Feature breakdown of NEXUS ARIA's 12 specialist AI agents: query translation, anomaly detection, cross-system data connectivity, and automated reporting.",
};

const content: DeepDiveContent = {
  hero: {
    badge: 'NEXUS ARIA · Features',
    headline: (
      <>
        12 specialists. <span className="gradient-text">Your entire data estate answered.</span>
      </>
    ),
    description:
      'Each ARIA agent handles a distinct layer of enterprise data intelligence — from raw query translation to cross-system synthesis to automated distribution.',
    buttons: [
      { label: 'Apply for early access', href: '/products/nexus-aria/early-access', variant: 'primary' },
      { label: 'Back to NEXUS ARIA', href: '/products/nexus-aria', variant: 'ghost' },
    ],
  },

  useCasesLabel: 'Who ARIA is built for',
  useCasesTitle: 'Enterprise teams with data questions that take too long',
  useCases: [
    {
      icon: <Chart size={24} aria-hidden="true" />,
      title: 'Finance & operations teams',
      description:
        'Monthly close reporting, variance analysis, and operational KPIs answered in real time — without waiting for data analyst capacity.',
    },
    {
      icon: <Users size={24} aria-hidden="true" />,
      title: 'Sales & revenue teams',
      description:
        'Pipeline analysis, forecast accuracy, and cohort performance answered directly from CRM and billing data, in plain English.',
    },
    {
      icon: <Brain size={24} aria-hidden="true" />,
      title: 'Executive & leadership teams',
      description:
        "Business performance questions answered in seconds, not days. ARIA surfaces what's changing, what's at risk, and what needs attention.",
    },
  ],

  deliverable: {
    label: "ARIA's agent roster",
    headline: '12 agents, each a specialist',
    description:
      "ARIA's agents are not general-purpose. Each has a specific data domain and a specific set of capabilities within that domain.",
    items: [
      {
        label: 'Query Translator',
        detail: 'Natural language → SQL, executed against your databases',
      },
      {
        label: 'Schema Navigator',
        detail: 'Understands your table relationships and metric definitions',
      },
      {
        label: 'Cross-System Synthesiser',
        detail: 'Joins data across CRM, ERP, finance, and marketing',
      },
      {
        label: 'Anomaly Detector',
        detail: 'Continuous monitoring for unexpected metric changes',
      },
      {
        label: 'Report Automator',
        detail: 'Learns and automates recurring report generation',
      },
      {
        label: 'Trend Analyser',
        detail: 'Identifies patterns across time series and cohort data',
      },
      {
        label: 'Access Controller',
        detail: 'Row-level and field-level permission enforcement',
      },
      {
        label: 'Explanation Generator',
        detail: 'Plain-English summaries with supporting evidence',
      },
    ],
  },

  timeline: {
    duration: '2 weeks to first answers',
    note: 'Schema learning takes 3–5 days. First accurate responses are typically within 2 weeks of connection.',
  },

  faqs: [
    {
      question: 'What data sources does ARIA connect to?',
      answer:
        'ARIA currently supports PostgreSQL, MySQL, Snowflake, BigQuery, Redshift, Salesforce, HubSpot, and REST APIs with standard JSON schemas. Additional connectors are built on request as part of the onboarding scope. Read-only connections are used for all data sources — ARIA never writes to your systems.',
    },
    {
      question: "How accurate are ARIA's answers?",
      answer:
        "During our internal benchmarking, ARIA answers 89% of business questions correctly on the first attempt, rising to 97% after a 4-week learning period with user feedback. Accuracy is measured against human-verified ground truth queries for each customer's data model. We report accuracy metrics transparently as part of the pilot review.",
    },
    {
      question: 'How is this different from our existing BI tool?',
      answer:
        "BI tools require someone to build and maintain the dashboards. ARIA answers questions that haven't been anticipated. The difference is: BI shows you what was designed to be shown; ARIA answers what you actually need to know. They're complementary — ARIA is for exploration and answering novel questions; dashboards are for regular monitoring.",
    },
  ],

  cta: {
    title: 'Apply for early access',
    subtitle:
      "We're onboarding a limited number of enterprise pilots with structured support included.",
    primaryCTA: { label: 'Apply for early access', href: '/products/nexus-aria/early-access' },
    ghostCTA: { label: 'Back to NEXUS ARIA', href: '/products/nexus-aria' },
  },
};

export default function NexusAriaFeaturesPage() {
  return <DeepDive content={content} />;
}
