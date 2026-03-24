import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Services — Ongoing Support & Maintenance';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Services',
      tagline: 'Ongoing Support & Maintenance',
      description: 'Bug fixes, monitoring, security patches. Your product stays healthy.',
      accent: '#4DBFA8',
    }),
    { ...size },
  );
}
