import type { Metadata } from 'next';
import LabsPageClient from './LabsPageClient';

export const metadata: Metadata = {
  title: { absolute: 'SocioFi Labs — AI Development Research & Open Source Projects' },
  description: 'Open research, experiments, and tools from building real AI-native software in production. Articles, open-source projects, and research streams published openly.',
  alternates: { canonical: 'https://sociofitechnology.com/labs' },
  openGraph: {
    title: 'SocioFi Labs — AI Development Research & Open Source Projects',
    description: 'Open research and tools from building AI-native software in production. Published openly for the community.',
    url: 'https://sociofitechnology.com/labs',
    images: [{ url: '/labs/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Labs' }],
  },
};

export default function LabsPage() {
  return <LabsPageClient />;
}
