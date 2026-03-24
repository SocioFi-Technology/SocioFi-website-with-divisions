import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.services;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Services — Ongoing Support & Maintenance',
    template: '%s — SocioFi Services',
  },
  description: 'Ongoing monitoring, bug fixes, security patches, and feature updates for live software. Guaranteed uptime, expert eyes on your product 24/7.',
  keywords: [
    'software maintenance service',
    'software support and maintenance',
    'bug fix service',
    'software monitoring',
    'security patches',
    'website maintenance',
    'app maintenance service',
    'SocioFi Services',
  ],
  openGraph: {
    title: 'SocioFi Services — Ongoing Support & Maintenance',
    description: 'Ongoing monitoring, bug fixes, security patches, and feature updates for live software. Guaranteed uptime, expert eyes 24/7.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/services',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Services — Ongoing Support & Maintenance' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Services — Ongoing Support & Maintenance',
    description: 'Your product stays healthy. Bug fixes, monitoring, security patches — all handled.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
