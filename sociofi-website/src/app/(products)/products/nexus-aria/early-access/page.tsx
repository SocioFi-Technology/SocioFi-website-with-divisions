import ConversionForm, { type ConversionFormContent } from '@/templates/ConversionForm';
import { Brain, Calendar, Check, Database, Shield } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS ARIA Early Access — SocioFi Products',
  description:
    "Apply for early access to NEXUS ARIA enterprise AI data analyst. Limited pilot spots available with structured onboarding support.",
};

const content: ConversionFormContent = {
  badge: 'NEXUS ARIA · Early access',
  headline: 'Apply for NEXUS ARIA early access',
  description:
    "We're onboarding a limited number of enterprise organisations into NEXUS ARIA's pilot programme. Each pilot comes with dedicated onboarding support and a structured accuracy validation process.",
  formType: 'contact',
  formDefaultDivision: 'products',
  trustItems: [
    'Limited pilot spots — apply early',
    'Dedicated onboarding support included',
    'No commitment required after fit call',
  ],
  sidebar: {
    headline: 'What the pilot includes',
    points: [
      {
        icon: <Calendar size={18} aria-hidden="true" />,
        headline: '30-minute fit call',
        detail:
          'We assess whether your data environment and use case is a good match for the current ARIA capability set.',
      },
      {
        icon: <Database size={18} aria-hidden="true" />,
        headline: 'Secure connection setup',
        detail:
          'Read-only connectors configured to your data sources. Typically 2–3 days for standard database connections.',
      },
      {
        icon: <Brain size={18} aria-hidden="true" />,
        headline: 'Schema learning period',
        detail:
          "ARIA spends 3–5 days learning your data model before responding to queries. This is not a slow start — it's what makes answers accurate.",
      },
      {
        icon: <Check size={18} aria-hidden="true" />,
        headline: 'Accuracy validation',
        detail:
          'We run a structured benchmark of 50 business questions against human-verified ground truth. You see exactly how accurate ARIA is on your data.',
      },
      {
        icon: <Shield size={18} aria-hidden="true" />,
        headline: 'Data security commitment',
        detail:
          'Read-only access. Data processed in your cloud region. Full DPA and security review documentation provided.',
      },
    ],
    testimonial: {
      quote:
        "The accuracy benchmarking process was what convinced us. We didn't have to take their word for it — we could see the numbers.",
      author: 'Head of Analytics',
      role: 'Enterprise pilot participant',
    },
  },
};

export default function NexusAriaEarlyAccessPage() {
  return <ConversionForm content={content} />;
}
