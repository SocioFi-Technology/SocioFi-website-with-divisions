import type { Metadata } from 'next';
import VenturesPageClient from './VenturesPageClient';

export const metadata: Metadata = {
  title: { absolute: 'SocioFi Ventures — Co-Build Your Startup with a Full Engineering Team' },
  description: 'Equity and revenue-share partnerships for technical founders. We become your engineering team — architecture, development, deployment, and maintenance — while you keep control.',
  alternates: { canonical: 'https://sociofitechnology.com/ventures' },
  openGraph: {
    title: 'SocioFi Ventures — Co-Build Your Startup with a Full Engineering Team',
    description: 'Equity and revenue-share partnerships. We become your engineering team while you keep control.',
    url: 'https://sociofitechnology.com/ventures',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Ventures' }],
  },
};

export default function VenturesPage() {
  return <VenturesPageClient />;
}
