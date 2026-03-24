import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.services;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Services',
    template: '%s — SocioFi Services',
  },
  description: 'Ongoing monitoring, bug fixes, security patches, and feature updates for live software. Your product stays healthy — guaranteed uptime, expert eyes 24/7.',
  openGraph: {
    title: 'SocioFi Services — Ongoing Software Support & Maintenance',
    description: 'Ongoing monitoring, bug fixes, security patches, and feature updates for live software.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Services' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': '#4DBFA8' } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
