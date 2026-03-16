import ConversionForm, { type ConversionFormContent } from '@/templates/ConversionForm';
import { Building, Calendar, Check, Globe, Shield } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact FabricxAI — SocioFi Products',
  description:
    'Request a FabricxAI demo or pilot. We run 2-week scoped pilots for qualified garment manufacturers.',
};

const content: ConversionFormContent = {
  badge: 'FabricxAI · Contact sales',
  headline: 'Request a FabricxAI demo',
  description:
    "We run live demonstrations using data similar to your operation — not a pre-packaged script. Tell us about your factory and we'll design a demo that shows what FabricxAI does for your specific challenges.",
  formType: 'contact',
  formDefaultDivision: 'products',
  trustItems: [
    'Live demo using your operational context',
    'Pilot scope agreed before any commitment',
    'Implementation timeline confirmed upfront',
  ],
  sidebar: {
    headline: 'What to expect',
    points: [
      {
        icon: <Calendar size={18} aria-hidden="true" />,
        headline: '30-minute intro call',
        detail:
          'We learn about your factory, volume, current systems, and where the biggest pain points are.',
      },
      {
        icon: <Globe size={18} aria-hidden="true" />,
        headline: 'Tailored demo prepared',
        detail:
          'We prepare a demonstration scenario relevant to your factory size and challenge profile — not a generic walkthrough.',
      },
      {
        icon: <Building size={18} aria-hidden="true" />,
        headline: 'Live demonstration',
        detail:
          '60-minute live demo showing FabricxAI working with data that resembles your operation.',
      },
      {
        icon: <Check size={18} aria-hidden="true" />,
        headline: 'Pilot scoping',
        detail:
          'If the demo resonates, we scope a 2-week pilot — specific modules, specific KPIs, specific success criteria.',
      },
      {
        icon: <Shield size={18} aria-hidden="true" />,
        headline: 'NDA available',
        detail:
          'We sign NDAs before sharing your operational data or any proprietary process details.',
      },
    ],
    testimonial: {
      quote:
        "The demo used our actual product categories and factory structure. It felt like they'd already been inside our operation.",
      author: 'Operations Director',
      role: 'Mid-size garment manufacturer, Bangladesh',
    },
  },
};

export default function FabricxAIContactPage() {
  return <ConversionForm content={content} />;
}
