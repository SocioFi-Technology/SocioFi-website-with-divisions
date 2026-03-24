import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Cloud — Managed Cloud Hosting';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Cloud',
      tagline: 'Managed Cloud Hosting',
      description: 'No DevOps required. We handle infrastructure, uptime, and security.',
      accent: '#5BB5E0',
    }),
    { ...size },
  );
}
