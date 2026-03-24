import type { Metadata } from 'next';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import PILOTChat from '@/components/shared/PILOTChat';
import { divisions } from '@/lib/divisions';

const division = divisions.labs;

export const metadata: Metadata = {
  title: {
    default: 'SocioFi Labs — AI Research & Open Source',
    template: '%s — SocioFi Labs',
  },
  description: 'Open research into AI-native development. Tools, techniques, and hard-won lessons from building real software with AI agents in production — published openly.',
  keywords: [
    'AI development research',
    'AI engineering blog',
    'open source AI tools',
    'AI-native development',
    'AI software research',
    'machine learning engineering',
    'AI development articles',
    'SocioFi Labs',
  ],
  openGraph: {
    title: 'SocioFi Labs — AI Research & Open Source',
    description: 'Open research into AI-native development. Tools, techniques, and hard-won lessons from building real software with AI agents in production.',
    siteName: 'SocioFi Technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sociofitechnology.com/labs',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Labs — AI Research & Open Source' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sociofitech',
    creator: '@sociofitech',
    title: 'SocioFi Labs — AI Research & Open Source',
    description: 'Hard-won lessons from building real software with AI agents in production.',
  },
  alternates: { canonical: 'https://sociofitechnology.com/labs' },
};

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--division-accent': division.accent } as React.CSSProperties}>
      <Nav division={division} />
      {children}
      <Footer division={division} />
      <PILOTChat division={division} />
    </div>
  );
}
