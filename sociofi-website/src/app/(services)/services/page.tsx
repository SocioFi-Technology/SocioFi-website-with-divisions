import type { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: { absolute: 'SocioFi Services — Software Maintenance & Support Plans' },
  description: 'Ongoing software maintenance, monitoring, bug fixes, and security patches for live products. Guaranteed uptime and expert engineers watching your product 24/7.',
  alternates: { canonical: 'https://sociofitechnology.com/services' },
  openGraph: {
    title: 'SocioFi Services — Software Maintenance & Support Plans',
    description: 'Ongoing maintenance, monitoring, bug fixes, and security patches. Your product stays healthy with guaranteed uptime.',
    url: 'https://sociofitechnology.com/services',
    images: [{ url: '/services/opengraph-image', width: 1200, height: 630, alt: 'SocioFi Services' }],
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
