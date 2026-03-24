import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import { VenturesJsonLd } from '@/components/shared/JsonLd';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.ventures;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Ventures — Startup Co-Building',
    template: '%s — SocioFi Ventures',
  },
  description: 'We co-build with technical founders using equity and revenue-share partnerships. You bring the vision, we bring the full engineering team. Serious startups only.',
  keywords: [
    'startup co-building',
    'equity partnership startup',
    'tech co-founder for hire',
    'startup engineering partner',
    'equity-based software development',
    'startup CTO for hire',
    'co-founder Bangladesh',
    'SocioFi Ventures',
  ],
  openGraph: {
    title: 'SocioFi Ventures — Startup Co-Building',
    description: 'We co-build with technical founders using equity and revenue-share partnerships. You bring the vision, we bring the full engineering team.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/ventures',
    images: [{ url: '/ventures/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Ventures — Startup Co-Building' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Ventures — Startup Co-Building',
    description: 'Equity and revenue-share partnerships for serious startups. We bring the engineering team.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/ventures' },
};

export default function VenturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <VenturesJsonLd />
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
