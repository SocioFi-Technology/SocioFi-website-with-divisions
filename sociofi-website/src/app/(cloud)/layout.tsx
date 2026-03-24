import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.cloud;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Cloud',
    template: '%s — SocioFi Cloud',
  },
  description: 'Managed cloud hosting — no DevOps required. We handle infrastructure, uptime, scaling, and security so your team can focus entirely on product.',
  openGraph: {
    title: 'SocioFi Cloud — Managed Cloud Hosting',
    description: 'Managed cloud hosting — no DevOps required. We handle infrastructure so you handle product.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Cloud' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function CloudLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': '#5BB5E0' } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
