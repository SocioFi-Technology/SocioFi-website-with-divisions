import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import { CloudJsonLd } from '@/components/shared/JsonLd';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.cloud;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Cloud — Managed Cloud Hosting',
    template: '%s — SocioFi Cloud',
  },
  description: 'Managed cloud hosting with no DevOps required. We handle infrastructure, uptime, scaling, and security so your team can focus entirely on building your product.',
  keywords: [
    'managed cloud hosting',
    'no DevOps hosting',
    'cloud infrastructure management',
    'managed hosting service',
    'cloud hosting for startups',
    'serverless hosting',
    'fully managed hosting',
    'SocioFi Cloud',
  ],
  openGraph: {
    title: 'SocioFi Cloud — Managed Cloud Hosting',
    description: 'Managed cloud hosting with no DevOps required. We handle infrastructure, uptime, scaling, and security so your team focuses on product.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/cloud',
    images: [{ url: '/cloud/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Cloud — Managed Cloud Hosting' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Cloud — Managed Cloud Hosting',
    description: 'No DevOps required. We handle cloud infrastructure so you handle product.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/cloud' },
};

export default function CloudLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <CloudJsonLd />
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
