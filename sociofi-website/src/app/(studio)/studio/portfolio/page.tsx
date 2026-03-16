import GridListing, { type GridListingContent } from '@/templates/GridListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — SocioFi Studio',
  description:
    'Projects we have scoped, built, and shipped. Real products for founders, SMEs, and teams — from MVPs to full-scale applications.',
};

const content: GridListingContent = {
  hero: {
    badge: 'Studio · Portfolio',
    headline: 'Work we have shipped',
    description:
      'Real projects. Real clients. From broken prototypes rescued and relaunched, to MVPs built from scratch, to internal tools that replaced months of manual work.',
  },
  categories: ['Products', 'Rescue', 'Internal Tools', 'Automation', 'AI'],
  pageSize: 9,
  items: [
    {
      type: 'portfolio',
      title: 'FabricxAI — AI-powered design-to-code platform',
      description:
        "Built the full product from zero: AI that converts Figma designs into production-ready React components, with a real-time preview, component library export, and team collaboration features.",
      tags: ['Next.js', 'AI', 'Figma API', 'React'],
      slug: 'fabricxai',
      client: 'FabricxAI',
      accentColor: '#7B6FE8',
      category: 'Products',
    },
    {
      type: 'portfolio',
      title: 'NEXARA — AI operations platform for SMBs',
      description:
        "End-to-end build of a multi-module SaaS: AI inbox triage, automated workflow builder, CRM with deal scoring, and a reporting dashboard. Launched to 200 beta users in 6 weeks.",
      tags: ['Next.js', 'PostgreSQL', 'AI', 'Stripe'],
      slug: 'nexara',
      client: 'NEXARA',
      accentColor: '#4DBFA8',
      category: 'AI',
    },
    {
      type: 'portfolio',
      title: 'From broken prototype to 10,000 active users',
      description:
        "A founder's AI-generated demo had no auth, no Stripe, and crashed under load. We rebuilt the architecture, added payments, deployed to production. 10,000 users within 8 weeks of launch.",
      tags: ['Next.js', 'PostgreSQL', 'Stripe', 'Vercel'],
      slug: 'rescue-to-launch',
      client: 'BuildFlow',
      accentColor: '#72C4B2',
      category: 'Rescue',
    },
    {
      type: 'portfolio',
      title: 'Fintech dashboard for SME lending',
      description:
        "An internal dashboard for a lending company to track applications, assess risk, and manage client portfolios — replacing a fragile Google Sheets setup used by 12 people.",
      tags: ['React', 'Node.js', 'PostgreSQL', 'Charts'],
      slug: 'fintech-dashboard',
      client: 'DataNest',
      accentColor: '#5BB5E0',
      category: 'Internal Tools',
    },
    {
      type: 'portfolio',
      title: 'E-commerce platform replatform',
      description:
        "Migrated a 6-year-old WooCommerce store with 40,000 SKUs to a modern Next.js storefront. 60% faster page loads, 22% reduction in cart abandonment.",
      tags: ['Next.js', 'Shopify API', 'Redis', 'Vercel'],
      slug: 'ecommerce-replatform',
      client: 'RetailCo',
      accentColor: '#E8916F',
      category: 'Products',
    },
    {
      type: 'portfolio',
      title: 'AI document analysis for legal teams',
      description:
        "A contract review tool that extracts key clauses, flags non-standard terms, and generates plain-English summaries. First-review time reduced from 4 hours to 20 minutes.",
      tags: ['AI', 'RAG', 'PDF parsing', 'React'],
      slug: 'legal-ai-review',
      client: 'LegalTech Firm',
      accentColor: '#7B6FE8',
      category: 'AI',
    },
    {
      type: 'portfolio',
      title: 'CRM-to-billing integration',
      description:
        "Bidirectional sync between Salesforce and Xero for a professional services firm. Eliminated 8 hours of manual data entry per week.",
      tags: ['Salesforce API', 'Xero API', 'Node.js', 'Webhooks'],
      slug: 'crm-billing-integration',
      client: 'Professional Services Group',
      accentColor: '#4DBFA8',
      category: 'Automation',
    },
    {
      type: 'portfolio',
      title: 'SaaS MVP: team scheduling platform',
      description:
        "Full-stack MVP built in 5 weeks. Authentication, calendar integrations, team management, Stripe subscriptions, and production deployment.",
      tags: ['Next.js', 'TypeScript', 'Stripe', 'Google Calendar API'],
      slug: 'scheduling-saas-mvp',
      client: 'Independent Founder',
      accentColor: '#72C4B2',
      category: 'Products',
    },
    {
      type: 'portfolio',
      title: 'Client portal for property management',
      description:
        "A client-facing portal where tenants submit maintenance requests, track status, view payment history, and download documents — replacing a shared email inbox.",
      tags: ['Next.js', 'PostgreSQL', 'Auth', 'File uploads'],
      slug: 'property-client-portal',
      client: 'Property Group',
      accentColor: '#E8B84D',
      category: 'Internal Tools',
    },
    {
      type: 'portfolio',
      title: 'Automated invoice processing pipeline',
      description:
        "Ingests supplier invoices by email, extracts line items using AI, matches to purchase orders, and flags discrepancies. Processing time: from 15 minutes to 90 seconds.",
      tags: ['AI', 'Email parsing', 'PostgreSQL', 'Python'],
      slug: 'invoice-processing-ai',
      client: 'Operations Team',
      accentColor: '#7B6FE8',
      category: 'AI',
    },
    {
      type: 'portfolio',
      title: 'Real-time logistics operations dashboard',
      description:
        "Visibility across 200+ daily shipments — tracking status, exception alerts, carrier performance, and SLA compliance. Replaced a daily manual spreadsheet report.",
      tags: ['React', 'WebSockets', 'PostgreSQL', 'Recharts'],
      slug: 'logistics-operations-dashboard',
      client: 'Logistics Firm',
      accentColor: '#5BB5E0',
      category: 'Internal Tools',
    },
  ],
};

export default function StudioPortfolioPage() {
  return <GridListing content={content} />;
}
