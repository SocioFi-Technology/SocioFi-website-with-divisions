import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Building, Globe, Users } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FabricxAI Features — SocioFi Products',
  description:
    "Detailed breakdown of FabricxAI's 22 AI agents: demand intelligence, production scheduling, quality control, supplier management, and delivery tracking.",
};

const content: DeepDiveContent = {
  hero: {
    badge: 'FabricxAI · Features',
    headline: (
      <>
        22 agents. <span className="gradient-text">Every manufacturing problem covered.</span>
      </>
    ),
    description:
      "Each of FabricxAI's 22 agents is a specialist. Together, they cover every critical workflow from demand forecasting to final shipment.",
    buttons: [
      { label: 'Request a demo', href: '/products/fabricxai/contact', variant: 'primary' },
      { label: 'Back to FabricxAI', href: '/products/fabricxai', variant: 'ghost' },
    ],
  },

  useCasesLabel: 'Industry applications',
  useCasesTitle: 'Built for the garment industry',
  useCases: [
    {
      icon: <Building size={24} aria-hidden="true" />,
      title: 'Large manufacturers',
      description:
        'Operations running 10+ production lines across multiple facilities. FabricxAI coordinates planning and visibility across the full factory network.',
    },
    {
      icon: <Globe size={24} aria-hidden="true" />,
      title: 'Export-focused factories',
      description:
        "Factories supplying international brands with strict delivery SLAs. FabricxAI's delivery tracking and supplier management modules are designed for complex, multi-tier supply chains.",
    },
    {
      icon: <Users size={24} aria-hidden="true" />,
      title: 'Growing mid-size operations',
      description:
        'Factories at 50–500 workers scaling beyond what spreadsheets can manage. FabricxAI grows with you — start with one module, expand as you grow.',
    },
  ],

  deliverable: {
    label: 'Feature modules',
    headline: 'Five production-ready modules',
    description:
      "FabricxAI is modular. Activate what you need now, expand when you're ready.",
    items: [
      {
        label: 'Demand Intelligence',
        detail: '12-week rolling forecasts updated automatically from buyer signals',
      },
      {
        label: 'Production Scheduling',
        detail: 'Capacity-aware plans that rebalance when orders change',
      },
      {
        label: 'Quality Control',
        detail: 'Inline checkpoint monitoring with defect pattern detection',
      },
      {
        label: 'Supplier Management',
        detail: 'Lead time tracking, capacity monitoring, and risk alerts',
      },
      {
        label: 'Delivery Tracking',
        detail: 'End-to-end shipment visibility for all stakeholders',
      },
      {
        label: 'Human Oversight Dashboard',
        detail: 'Every agent decision visible and overridable',
      },
      {
        label: 'ERP Integration Layer',
        detail: 'Read/write connectors for major garment industry ERPs',
      },
      {
        label: 'Analytics & Reporting',
        detail: 'Operational KPIs, agent performance metrics, executive summaries',
      },
    ],
  },

  timeline: {
    duration: '4–8 weeks to first value',
    note: 'Pilot scope is agreed before implementation. You activate the module that delivers fastest ROI first.',
  },

  faqs: [
    {
      question: 'How do the 22 agents coordinate with each other?',
      answer:
        'Each agent has a defined responsibility and communicates with adjacent agents via a shared data layer. When the Demand Intelligence agent updates a forecast, it triggers a rescheduling event for the Production Scheduling agent, which in turn updates capacity requirements for the Supplier Management agent. The coordination is automatic, auditable, and interruptible at any point.',
    },
    {
      question: 'Can we use FabricxAI with our existing ERP?',
      answer:
        'Yes. FabricxAI has integration connectors for the most common garment industry ERPs including ApparelMagic, FastReact, BlueCherry, and SAP Business One. For ERPs not on this list, we build custom connectors as part of the implementation scope. Most integrations take 1–2 weeks.',
    },
    {
      question: 'What happens when an agent makes a wrong decision?',
      answer:
        'Every agent decision above a configurable confidence threshold requires human approval before execution. Below-threshold decisions are executed automatically but remain fully auditable. Operators can override any decision at any time. The override rate is tracked — high override rates on any agent trigger a recalibration review.',
    },
  ],

  cta: {
    title: 'See FabricxAI in action',
    subtitle:
      'We run live demonstrations using data similar to your operation — not a pre-packaged script.',
    primaryCTA: { label: 'Request a demo', href: '/products/fabricxai/contact' },
    ghostCTA: { label: 'Back to FabricxAI', href: '/products/fabricxai' },
  },
};

export default function FabricxAIFeaturesPage() {
  return <DeepDive content={content} />;
}
