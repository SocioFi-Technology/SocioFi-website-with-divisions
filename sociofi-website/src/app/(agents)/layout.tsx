import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.agents;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Agents',
    template: '%s — SocioFi Agents',
  },
  description: 'Subscribe to individual AI agents — each built for one specific task. Deploy into your operations in days, not months. 16 agents across sales, support, operations, data, and documents.',
  openGraph: {
    title: 'SocioFi Agents — AI Agent Systems',
    description: 'Individual AI agents built for one specific task. Subscribe monthly, deploy into your operations in days.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Agents' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
