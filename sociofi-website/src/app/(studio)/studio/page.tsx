import type { Metadata } from 'next';
import StudioPageClient from './StudioPageClient';

export const metadata: Metadata = {
  title: { absolute: 'SocioFi Studio — Custom Software Development' },
  description: 'AI-accelerated custom software development for founders and businesses. From prototype to production in weeks — expert engineers who own your outcome start to finish.',
  alternates: { canonical: 'https://sociofitechnology.com/studio' },
  openGraph: {
    title: 'SocioFi Studio — Custom Software Development',
    description: 'AI-accelerated custom software. From prototype to production in weeks, with engineers who own your outcome.',
    url: 'https://sociofitechnology.com/studio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Studio' }],
  },
};

export default function StudioPage() {
  return <StudioPageClient />;
}
