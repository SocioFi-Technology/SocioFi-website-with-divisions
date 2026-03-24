import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Academy — Learn to Build with AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Academy',
      tagline: 'Learning & Training',
      description: 'Practical AI development courses for founders, leaders, and teams.',
      accent: '#E8B84D',
    }),
    { ...size },
  );
}
