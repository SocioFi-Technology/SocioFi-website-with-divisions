import HomePageClient from './HomePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'SocioFi Technology — AI-Native Software Development' },
  description:
    'Seven specialized divisions. One mission: intelligent software where AI agents handle the heavy lifting and human engineers architect everything else.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'SocioFi Technology — AI-Native Software Development',
    description: 'Seven specialized divisions. One mission: intelligent software where AI agents handle the heavy lifting and human engineers architect everything else.',
    url: '/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
