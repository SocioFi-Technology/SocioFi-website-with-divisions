import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import { AgentsJsonLd } from '@/components/shared/JsonLd';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.agents;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Agents — AI Agent Systems',
    template: '%s — SocioFi Agents',
  },
  description: 'Subscribe to individual AI agents — each built for one specific task. 16 agents across sales, support, operations, data, and documents. Deploy in days, not months.',
  keywords: [
    'AI agents subscription',
    'AI automation tools',
    'business AI agents',
    'AI workflows',
    'AI agent for sales',
    'AI agent for customer support',
    'AI agent for operations',
    'subscribe to AI agents',
    'SocioFi Agents',
  ],
  openGraph: {
    title: 'SocioFi Agents — AI Agent Systems',
    description: 'Subscribe to individual AI agents — each built for one specific task. 16 agents across sales, support, operations, data, and documents. Deploy in days.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/agents',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Agents — AI Agent Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Agents — AI Agent Systems',
    description: '16 AI agents. One specific task each. Subscribe monthly, deploy in days.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/agents' },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <AgentsJsonLd />
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
