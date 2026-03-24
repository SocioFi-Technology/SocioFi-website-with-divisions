import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.academy;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Academy',
    template: '%s — SocioFi Academy',
  },
  description: 'Practical AI development courses for non-technical founders, business leaders, and teams. Learn to build with AI — or lead teams that do.',
  openGraph: {
    title: 'SocioFi Academy — Learn to Build with AI',
    description: 'Practical courses for founders, leaders, and teams. Understand AI development well enough to commission it, manage it, and build on it.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Academy' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': '#E8B84D' } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
