import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.labs;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Labs',
    template: '%s — SocioFi Labs',
  },
  description: 'Where we experiment, publish, and release. Open research into AI-native development — tools, techniques, and hard-won lessons from building in production.',
  openGraph: {
    title: 'SocioFi Labs — Research & Open Source',
    description: 'Where we experiment, publish, and release. Open research into AI-native development.',
    siteName: 'SocioFi Technology',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Labs' }],
  },
  twitter: { card: 'summary_large_image', site: '@sociofitech' },
};

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': '#7B6FE8' } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
