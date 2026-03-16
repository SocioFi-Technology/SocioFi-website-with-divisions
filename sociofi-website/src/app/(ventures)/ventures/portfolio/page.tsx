import type { Metadata } from 'next';
import GridListing from '@/templates/GridListing';
import type { GridListingContent } from '@/templates/GridListing';

export const metadata: Metadata = {
  title: 'Portfolio — SocioFi Ventures',
  description:
    'SocioFi Ventures portfolio companies: products co-built with domain-expert founders across manufacturing, logistics, fintech, and B2B SaaS.',
};

const content: GridListingContent = {
  hero: {
    badge: 'Ventures · Portfolio',
    headline: 'Products we built together.',
    description:
      'Co-built products with founders who brought deep industry knowledge. We brought the engineering team.',
  },

  categories: ['Manufacturing AI', 'Operations', 'Fintech', 'B2B SaaS'],

  pageSize: 9,

  items: [
    {
      type: 'portfolio',
      title: 'FabricxAI',
      description:
        '22-agent manufacturing intelligence platform for the garment industry. Demand forecasting, production scheduling, quality control, and supplier management.',
      tags: ['Manufacturing AI', 'Multi-agent', 'Next.js', 'PostgreSQL'],
      slug: 'fabricxai',
      client: 'Co-build · Equity deal',
      accentColor: '#6BA3E8',
      category: 'Manufacturing AI',
    },
    {
      type: 'portfolio',
      title: 'NEXUS ARIA',
      description:
        'Enterprise AI data analyst with 12 specialist agents. Plain-English queries answered from real enterprise databases across CRM, ERP, and finance.',
      tags: ['Enterprise AI', 'Data', 'Multi-agent', 'PostgreSQL'],
      slug: 'nexus-aria',
      client: 'Co-build · Equity deal',
      accentColor: '#6BA3E8',
      category: 'B2B SaaS',
    },
    {
      type: 'portfolio',
      title: 'Logistics Operations Platform',
      description:
        'Real-time operations dashboard tracking 200+ daily shipments across a mid-size logistics firm. Replaced a daily manual spreadsheet process used by 15 operations staff.',
      tags: ['Operations', 'Real-time', 'React', 'WebSockets'],
      slug: 'logistics-ops',
      client: 'Co-build · Revenue share',
      accentColor: '#4DBFA8',
      category: 'Operations',
    },
    {
      type: 'portfolio',
      title: 'Fintech Compliance Monitor',
      description:
        'Automated compliance monitoring and reporting for a fintech lender. Processes 500+ transactions daily against regulatory rules, flagging exceptions for human review.',
      tags: ['Fintech', 'Compliance', 'Automation', 'PostgreSQL'],
      slug: 'fintech-compliance',
      client: 'Co-build · Hybrid',
      accentColor: '#5BB5E0',
      category: 'Fintech',
    },
    {
      type: 'portfolio',
      title: 'Property Management Portal',
      description:
        'Client-facing portal for a property management company — maintenance requests, payment history, document storage — replacing a shared email inbox.',
      tags: ['B2B SaaS', 'Portal', 'Next.js', 'Auth'],
      slug: 'property-portal',
      client: 'Co-build · Equity deal',
      accentColor: '#72C4B2',
      category: 'Operations',
    },
    {
      type: 'portfolio',
      title: 'SME Lending Dashboard',
      description:
        'Internal risk assessment and portfolio management dashboard for a lending company. Tracks 200+ active loans, automates risk scoring, and generates compliance reports.',
      tags: ['Fintech', 'Internal tools', 'React', 'Charts'],
      slug: 'sme-lending',
      client: 'Co-build · Revenue share',
      accentColor: '#E8B84D',
      category: 'Fintech',
    },
  ],
};

export default function PortfolioPage() {
  return <GridListing content={content} />;
}
