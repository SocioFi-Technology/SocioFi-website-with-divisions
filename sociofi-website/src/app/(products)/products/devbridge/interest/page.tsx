import ConversionForm, { type ConversionFormContent } from '@/templates/ConversionForm';
import { Check, GitBranch, Rocket, Shield, Users } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevBridge OS Interest — SocioFi Products',
  description:
    'Register your interest in DevBridge OS private beta. AI-assisted code review, deployment automation, and engineering metrics for development teams.',
};

const content: ConversionFormContent = {
  badge: 'DevBridge OS · Register interest',
  headline: 'Register interest in DevBridge OS',
  description:
    "DevBridge OS private beta opens Q3 2026. We're selecting engineering teams now. Tell us about your team and delivery setup — we'll get in touch when spots are confirmed.",
  formType: 'contact',
  formDefaultDivision: 'products',
  trustItems: [
    'Private beta opens Q3 2026',
    'No commitment to register',
    'Beta teams get priority support and pricing',
  ],
  sidebar: {
    headline: 'What beta teams get',
    points: [
      {
        icon: <Rocket size={18} aria-hidden="true" />,
        headline: 'First access',
        detail:
          'Beta teams get access before general availability — with direct input into the feature roadmap.',
      },
      {
        icon: <Users size={18} aria-hidden="true" />,
        headline: 'Dedicated setup support',
        detail:
          'We personally onboard each beta team. No self-serve docs and a waiting queue — we work with you directly.',
      },
      {
        icon: <Shield size={18} aria-hidden="true" />,
        headline: 'Beta pricing locked in',
        detail:
          'Teams that participate in the private beta lock in a discounted rate that persists after general availability.',
      },
      {
        icon: <GitBranch size={18} aria-hidden="true" />,
        headline: 'Roadmap influence',
        detail:
          'Beta teams have direct access to the product team. Your integration use cases and workflow requirements shape what we build next.',
      },
      {
        icon: <Check size={18} aria-hidden="true" />,
        headline: 'No commitment required',
        detail:
          "Registering interest doesn't commit you to anything. We'll reach out when beta spots are confirmed with full details.",
      },
    ],
  },
};

export default function DevBridgeInterestPage() {
  return <ConversionForm content={content} />;
}
