import type { Metadata } from 'next';
import AgentsPageClient from './AgentsPageClient';

export const metadata: Metadata = {
  title: { absolute: 'SocioFi Agents — Subscribe to AI Agents for Business' },
  description: 'Browse 16 AI agents — each built for one specific task. Subscribe monthly, deploy into sales, support, operations, data, or document workflows in days.',
  alternates: { canonical: 'https://sociofitechnology.com/agents' },
  openGraph: {
    title: 'SocioFi Agents — Subscribe to AI Agents for Business',
    description: 'Browse 16 AI agents, each built for one task. Subscribe monthly, deploy in days.',
    url: 'https://sociofitechnology.com/agents',
    images: [{ url: '/agents/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Agents' }],
  },
};

export default function AgentsPage() {
  return <AgentsPageClient />;
}
