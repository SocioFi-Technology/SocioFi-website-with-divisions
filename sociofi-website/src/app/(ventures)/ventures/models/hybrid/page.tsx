import type { Metadata } from 'next';
import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Target, Shield, Users } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Hybrid Co-Build Model — SocioFi Ventures',
  description:
    'A reduced upfront fee combined with equity or revenue share. Shared investment from both sides — for founders who want skin in the game on both sides of the deal.',
};

const content: DeepDiveContent = {
  hero: {
    badge: 'Ventures · Hybrid model',
    headline: (
      <>
        Shared investment.
        <br />
        <span className="gradient-text">Shared upside.</span>
      </>
    ),
    description:
      'A reduced upfront fee combined with equity or revenue share. Both parties have financial skin in the game from day one — which tends to produce better products.',
    buttons: [
      { label: 'Apply for this model', href: '/ventures/apply', variant: 'primary' },
      { label: 'Compare all models', href: '/ventures/how-it-works', variant: 'ghost' },
    ],
  },

  useCasesLabel: 'Best suited for',
  useCasesTitle: 'Who the hybrid model works best for',

  useCases: [
    {
      icon: <Target size={24} />,
      title: 'Founders with some capital',
      description:
        "You have meaningful savings or a small funding round — enough to contribute to the build cost but not enough to hire a full team outright.",
    },
    {
      icon: <Shield size={24} />,
      title: 'Founders who want lower equity dilution',
      description:
        'The upfront cash component reduces the equity or revenue share component. More cash upfront means less give-up in the long run.',
    },
    {
      icon: <Users size={24} />,
      title: 'Higher-risk or novel ideas',
      description:
        "For ideas that are harder to model or carry more market uncertainty, hybrid deals let us share the downside risk more fairly — we're not taking all the risk on a pure equity basis.",
    },
  ],

  deliverable: {
    label: 'What you get',
    headline: 'Flexible structure. Same team.',
    description:
      'Hybrid deals are configured per engagement. The general structure is a reduced upfront fee covering a portion of development cost, combined with either equity or revenue share for the remainder.',
    items: [
      {
        label: 'Reduced upfront fee',
        detail: 'typically 30–60% of equivalent development cost',
      },
      {
        label: 'Equity component',
        detail: 'typically 5–15% (lower than pure equity deal)',
      },
      {
        label: 'Or revenue share component',
        detail: 'typically 5–10% until a reduced cap',
      },
      {
        label: 'Full development team and scope',
        detail: 'same team and deliverables as other models',
      },
      {
        label: 'Terms negotiated per deal',
        detail: 'cash/equity split adjusted to fit your situation',
      },
    ],
  },

  timeline: {
    duration: '8–16 weeks to MVP',
    note: 'The cash and equity components are negotiated upfront. The more cash, the less equity — and vice versa.',
  },

  faqs: [
    {
      question: 'How do you decide the cash/equity split?',
      answer:
        "We start from the equivalent development cost and work backwards. How much can the founder reasonably contribute upfront? That determines the cash component. The equity or revenue share is then sized to compensate for the remainder. We aim for a structure that feels fair to both parties under multiple scenarios — not just the optimistic one.",
    },
    {
      question: 'Is the hybrid model available for all project sizes?',
      answer:
        "Yes. The minimum project size for any Ventures deal — including hybrid — is an MVP of meaningful scope (minimum 3 months of development). Below that threshold, the economics of a co-build structure don't work. Smaller builds are better served by Studio's standard project delivery.",
    },
    {
      question: 'Can we renegotiate the split later?',
      answer:
        'The split is fixed at signing. What can be renegotiated are the terms of the equity or revenue share component if circumstances change materially — for example, a significant pivot or acquisition conversation. The cash component is paid and not revisited.',
    },
  ],

  cta: {
    title: 'Apply for the hybrid model',
    subtitle: "Contribute what you can. We'll structure the rest as equity or revenue share.",
    primaryCTA: { label: 'Apply now', href: '/ventures/apply' },
    note: "We'll propose a structure based on your situation.",
  },
};

export default function HybridModelPage() {
  return <DeepDive content={content} />;
}
