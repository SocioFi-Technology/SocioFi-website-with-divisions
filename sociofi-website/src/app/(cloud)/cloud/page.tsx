import type { Metadata } from 'next';
import CloudPageClient from './CloudPageClient';

export const metadata: Metadata = {
  title: { absolute: 'SocioFi Cloud — Managed Cloud Hosting, No DevOps Required' },
  description: 'Fully managed cloud hosting for startups and growing products. We handle infrastructure, uptime, security, and scaling — your team focuses on building.',
  alternates: { canonical: 'https://sociofitechnology.com/cloud' },
  openGraph: {
    title: 'SocioFi Cloud — Managed Cloud Hosting, No DevOps Required',
    description: 'Fully managed cloud hosting. We handle infrastructure, uptime, and security so your team focuses on building.',
    url: 'https://sociofitechnology.com/cloud',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SocioFi Cloud' }],
  },
};

export default function CloudPage() {
  return <CloudPageClient />;
}
