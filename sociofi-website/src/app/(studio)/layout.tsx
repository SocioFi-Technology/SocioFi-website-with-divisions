import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.studio;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Studio',
    template: '%s — SocioFi Studio',
  },
  description: 'Custom software development — AI-accelerated, human-quality. From prototype to production in weeks, with expert engineers who own the outcome.',
  openGraph: {
    title: 'SocioFi Studio — Custom Software Development',
    description: 'Custom software development — AI-accelerated, human-quality. From prototype to production in weeks.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Studio' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
