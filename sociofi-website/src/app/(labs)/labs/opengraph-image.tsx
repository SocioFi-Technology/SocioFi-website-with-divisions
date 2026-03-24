import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Labs — AI Research & Open Source';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Labs',
      tagline: 'Research & Open Source',
      description: 'Hard-won lessons from building AI-native software in production.',
      accent: '#7B6FE8',
    }),
    { ...size },
  );
}
