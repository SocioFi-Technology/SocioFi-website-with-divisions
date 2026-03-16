import type { Metadata } from 'next';
import ConversionForm, { type ConversionFormContent } from '@/templates/ConversionForm';
import { Calendar, Check, Briefcase, Shield, Users } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Apply to Co-Build — SocioFi Ventures',
  description:
    'Apply to co-build your product with SocioFi Ventures. Equity, revenue share, and hybrid deal structures available. Every application reviewed personally.',
};

const content: ConversionFormContent = {
  badge: 'Ventures · Apply',
  headline: 'Apply to co-build with Ventures',
  description:
    "We review every application personally — no automated filters, no pitch deck required. Tell us what you're building and why you're the person to build it.",
  formType: 'contact',
  formDefaultDivision: 'ventures',
  trustItems: [
    'Every application reviewed personally',
    'Response within 5 business days',
    'No pitch deck or deck required to apply',
  ],
  sidebar: {
    headline: 'What happens after you apply',
    points: [
      {
        icon: <Calendar size={18} />,
        headline: 'We read it carefully',
        detail:
          "Every application is read by a person. We're looking for the match between your domain expertise and the idea — not grammar or slide design.",
      },
      {
        icon: <Check size={18} />,
        headline: 'Response within 5 days',
        detail:
          "We reply to every application — yes, no, or 'let's talk more'. You'll never be left wondering if it arrived.",
      },
      {
        icon: <Users size={18} />,
        headline: 'Founder call (if interested)',
        detail:
          "A 60-minute conversation with SocioFi's CEO or CTO. We want to understand the problem, the market, and you — not just the pitch.",
      },
      {
        icon: <Briefcase size={18} />,
        headline: 'Term sheet within 1 week',
        detail:
          "If there's mutual interest after the call, we issue a term sheet within 5 business days. Deal structure, scope, and milestones in writing.",
      },
      {
        icon: <Shield size={18} />,
        headline: 'NDA on request',
        detail:
          "We're happy to sign an NDA before you share sensitive details about your idea or market.",
      },
    ],
    testimonial: {
      quote:
        "I applied with a 3-paragraph description of the problem I was solving. No deck, no financial model. We had a call 4 days later.",
      author: 'Portfolio founder',
      role: 'Co-build partner',
    },
  },
};

export default function ApplyPage() {
  return <ConversionForm content={content} />;
}
