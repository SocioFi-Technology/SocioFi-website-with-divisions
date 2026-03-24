import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.products;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Products',
    template: '%s — SocioFi Products',
  },
  description: 'Software we build, own, and run. Three AI-powered platforms — FabricxAI, NEXUS ARIA, and DevBridge — solving hard problems in manufacturing intelligence, enterprise data analysis, and software delivery.',
  openGraph: {
    title: 'SocioFi Products — AI-Powered Software Platforms',
    description: 'Three AI-powered platforms: FabricxAI, NEXUS ARIA, and DevBridge. Ready-to-deploy solutions for real workflows.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Products' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
