import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import { ProductsJsonLd } from '@/components/shared/JsonLd';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.products;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Products — AI-Powered Software Platforms',
    template: '%s — SocioFi Products',
  },
  description: 'Three ready-to-deploy AI platforms: FabricxAI for manufacturing intelligence, NEXUS ARIA for enterprise data analysis, and DevBridge for software delivery.',
  keywords: [
    'AI software products',
    'FabricxAI',
    'NEXUS ARIA',
    'DevBridge',
    'manufacturing AI software',
    'enterprise data analysis AI',
    'AI-powered platforms',
    'SocioFi Products',
  ],
  openGraph: {
    title: 'SocioFi Products — AI-Powered Software Platforms',
    description: 'Three ready-to-deploy AI platforms: FabricxAI for manufacturing intelligence, NEXUS ARIA for enterprise data, DevBridge for software delivery.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/products',
    images: [{ url: '/products/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Products — AI-Powered Software Platforms' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Products — AI-Powered Software Platforms',
    description: 'FabricxAI, NEXUS ARIA, DevBridge — real AI tools for real workflows.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/products' },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <ProductsJsonLd />
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
