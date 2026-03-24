import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Technology — AI-Agent-Native Software Development';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Technology',
      tagline: 'AI-Native Development',
      description: 'Seven divisions. One mission — intelligent software where AI agents build and humans architect.',
      accent: '#4A6CB8',
    }),
    { ...size },
  );
}
