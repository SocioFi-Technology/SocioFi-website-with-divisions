import { ImageResponse } from 'next/og';
import { ogTemplate } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'SocioFi Agents — AI Agent Systems';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      divisionName: 'SocioFi Agents',
      tagline: 'AI Agent Systems',
      description: '16 agents across sales, support, ops, data, and documents. Subscribe monthly, deploy in days.',
      accent: '#8B5CF6',
    }),
    { ...size },
  );
}
