import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Studio — Custom Software Development';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Studio',
      tagline: 'Custom Software Development',
      description: 'AI-accelerated. Human-quality. From prototype to production in weeks.',
      accent: '#72C4B2',
    }),
    { ...size },
  );
}
