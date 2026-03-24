import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Ventures — Startup Co-Building';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Ventures',
      tagline: 'Startup Co-Building',
      description: 'Equity and revenue-share partnerships. We bring the engineering team.',
      accent: '#6BA3E8',
    }),
    { ...size },
  );
}
