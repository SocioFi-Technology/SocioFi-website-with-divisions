import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.ventures;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Ventures',
    template: '%s — SocioFi Ventures',
  },
  description: 'We co-build with technical founders. Equity-based and revenue-share partnerships for serious startups — we bring the engineering, you bring the vision.',
  openGraph: {
    title: 'SocioFi Ventures — Startup Co-Building',
    description: 'We co-build with technical founders. Equity-based partnerships for serious startups.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Ventures' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function VenturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
