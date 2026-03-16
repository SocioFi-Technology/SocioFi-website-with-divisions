import ConversionForm, { type ConversionFormContent } from '@/templates/ConversionForm';
import { Calendar, Check, Eye, Shield } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Protected — SocioFi Services',
  description:
    'Start your onboarding. We respond within 4 hours and have monitoring active within 48 hours.',
};

const content: ConversionFormContent = {
  badge: 'Services · Get Protected',
  headline: "Let's protect your software.",
  description:
    'Tell us about your application. We respond within 4 hours, confirm your plan, and have monitoring active within 48 hours.',
  formDefaultDivision: 'services',
  trustItems: [
    'Response within 4 hours',
    'Monitoring live in 48 hours',
    'Month-to-month billing',
    'No lock-in. Cancel any time.',
  ],
  sidebar: {
    headline: 'What happens after you submit',
    points: [
      {
        icon: <Calendar size={20} aria-hidden="true" />,
        headline: 'We respond within 4 hours',
        detail:
          'A real engineer reviews your submission and responds with a confirmation of your plan, the access we need, and next steps.',
      },
      {
        icon: <Check size={20} aria-hidden="true" />,
        headline: 'Access handover (1 hour)',
        detail:
          'We request read access to your repository and hosting provider. You retain full control — we only need what is necessary to monitor and maintain.',
      },
      {
        icon: <Eye size={20} aria-hidden="true" />,
        headline: 'Baseline audit (24 hours)',
        detail:
          'We run a dependency audit, performance baseline, and initial security scan. You receive a written summary of findings before your first monthly cycle begins.',
      },
      {
        icon: <Shield size={20} aria-hidden="true" />,
        headline: 'Monitoring live (48 hours)',
        detail:
          'Uptime checks, error tracking, and alert rules configured. From this point, we watch your production environment continuously and respond to incidents as they happen.',
      },
    ],
    testimonial: {
      quote:
        'I submitted the form on a Tuesday. By Thursday morning my application was under monitoring and they had already flagged a dependency with a known CVE. Worth every dollar.',
      author: 'David R.',
      role: 'Founder, PivotLab',
    },
  },
};

export default function GetProtectedPage() {
  return <ConversionForm content={content} />;
}
