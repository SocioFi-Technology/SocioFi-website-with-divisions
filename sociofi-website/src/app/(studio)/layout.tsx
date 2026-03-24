import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { StudioJsonLd } from '@/components/shared/JsonLd';
import { divisions } from '@/lib/divisions';

const division = divisions.studio;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Studio — Custom Software Development',
    template: '%s — SocioFi Studio',
  },
  description: 'AI-accelerated custom software development — human-quality output, weeks not months. Expert engineers who own your outcome from prototype to production.',
  keywords: [
    'custom software development',
    'AI-accelerated software development',
    'hire software engineers',
    'software development company Bangladesh',
    'prototype to production',
    'MVP development',
    'software development for startups',
    'SocioFi Studio',
  ],
  openGraph: {
    title: 'SocioFi Studio — Custom Software Development',
    description: 'AI-accelerated custom software development. From prototype to production in weeks, with expert engineers who own the outcome.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/studio',
    images: [{ url: '/studio/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Studio — Custom Software Development' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Studio — Custom Software Development',
    description: 'AI builds. Humans architect. You ship. Prototype to production in weeks.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/studio' },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <StudioJsonLd />
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
