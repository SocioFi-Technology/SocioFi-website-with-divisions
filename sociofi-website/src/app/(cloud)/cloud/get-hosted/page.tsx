import type { Metadata } from 'next';
import ConversionForm, { type ConversionFormContent } from '@/templates/ConversionForm';
import { Calendar, Gear, Rocket, Shield, Check } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Get Hosted \u2014 SocioFi Cloud',
  description:
    "Tell us about your app. We'll have a managed hosting plan configured and ready within 24 hours.",
};

const content: ConversionFormContent = {
  badge: 'Cloud \u00b7 Get Hosted',
  headline: "Let's get your app hosted.",
  description:
    "Tell us what you're running. We'll respond with a specific hosting plan and have your environment configured within 24 hours.",
  formDefaultDivision: 'cloud',
  formType: 'contact',
  trustItems: [
    'Response within 4 hours',
    'Hosting plan configured in 24 hours',
    'No setup fee',
    'Cancel anytime with 30 days notice',
  ],
  sidebar: {
    headline: 'What happens next',
    points: [
      {
        icon: <Calendar size={20} />,
        headline: 'We respond within 4 hours',
        detail:
          'A real engineer reads your submission and replies with an honest assessment of your hosting requirements and a recommended plan.',
      },
      {
        icon: <Gear size={20} />,
        headline: 'Infrastructure scoped within 24 hours',
        detail:
          'Based on your app, stack, and traffic requirements, we configure the hosting environment \u2014 server sizing, database, storage, CDN, monitoring.',
      },
      {
        icon: <Rocket size={20} />,
        headline: 'Live in 24 hours',
        detail:
          'Your environment is provisioned, hardened, and ready for your first deployment \u2014 usually within one business day of your first response.',
      },
      {
        icon: <Shield size={20} />,
        headline: 'Security from day one',
        detail:
          'Firewall, SSL, backups, monitoring, and security patching \u2014 all active before your app goes live. No manual setup on your part.',
      },
      {
        icon: <Check size={20} />,
        headline: 'Ongoing management',
        detail:
          'After launch, we handle updates, incidents, scaling, and maintenance. Your app runs \u2014 you build features.',
      },
    ],
    testimonial: {
      quote:
        "We were spending half our engineering time on infrastructure. After moving to SocioFi Cloud, that time went to zero. The app is more stable than it's ever been.",
      author: 'Michael T.',
      role: 'CTO, LogisticsOps',
    },
  },
};

export default function GetHostedPage() {
  return <ConversionForm content={content} />;
}
