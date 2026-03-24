import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.academy;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Academy — Learn to Build with AI',
    template: '%s — SocioFi Academy',
  },
  description: 'Practical AI development courses for non-technical founders, business leaders, and teams. Learn to build, manage, and ship AI-powered products — no coding required.',
  keywords: [
    'AI development courses',
    'learn AI for non-technical founders',
    'AI product development training',
    'online AI courses',
    'AI business courses',
    'non-technical founder courses',
    'AI learning platform',
    'SocioFi Academy',
  ],
  openGraph: {
    title: 'SocioFi Academy — Learn to Build with AI',
    description: 'Practical AI development courses for non-technical founders and business leaders. Learn to build, manage, and ship AI-powered products.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/academy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Academy — Learn to Build with AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Academy — Learn to Build with AI',
    description: 'From idea to product. Practical AI courses for founders, leaders, and teams.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/academy' },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
