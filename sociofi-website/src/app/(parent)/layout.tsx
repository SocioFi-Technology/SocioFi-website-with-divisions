import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.technology;

// Reinforce OG defaults for all (parent) brand routes (about, contact, blog, etc.).
// Title inherits from root layout template: '%s — SocioFi Technology'.
export const metadata: Metadata = {
  keywords: [
    'SocioFi Technology',
    'AI software development company',
    'software development Bangladesh',
    'AI-native development',
    'software for non-technical founders',
    'AI engineering team',
    'tech startup partner',
  ],
  openGraph: {
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Technology' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech', creator: '@sociofitech' },
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
