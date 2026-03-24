import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Products — AI-Powered Software Platforms';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Products',
      tagline: 'AI-Powered Products',
      description: 'FabricxAI, NEXUS ARIA, DevBridge — real tools for real workflows.',
      accent: '#E8916F',
    }),
    { ...size },
  );
}
