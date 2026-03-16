import type { Metadata } from 'next';
import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Chart, Building, Rocket } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Revenue Share Co-Build Model — SocioFi Ventures',
  description:
    'Build your product with no upfront cost and no equity dilution. SocioFi takes a percentage of revenue until a defined cap in exchange for the full development team.',
};

const content: DeepDiveContent = {
  hero: {
    badge: 'Ventures · Revenue share model',
    headline: (
      <>
        No upfront cost.
        <br />
        <span className="gradient-text">No equity dilution.</span>
      </>
    ),
    description:
      'We build in exchange for a percentage of revenue until a defined cap is reached. You keep full ownership of your company — we share in the revenue while it grows.',
    buttons: [
      { label: 'Apply for this model', href: '/ventures/apply', variant: 'primary' },
      { label: 'Compare all models', href: '/ventures/how-it-works', variant: 'ghost' },
    ],
  },

  useCasesLabel: 'Best suited for',
  useCasesTitle: 'Who revenue share works best for',

  useCases: [
    {
      icon: <Chart size={24} />,
      title: 'Founders who want to keep ownership',
      description:
        "Revenue share preserves your cap table entirely. If you're building toward a fundraising round where equity dilution is sensitive, revenue share keeps your ownership intact.",
    },
    {
      icon: <Building size={24} />,
      title: 'Products with clear revenue trajectories',
      description:
        "Revenue share works best when both parties can model reasonable revenue projections — B2B SaaS, marketplace commission structures, and subscription products are ideal.",
    },
    {
      icon: <Rocket size={24} />,
      title: 'Founders with some runway',
      description:
        'Revenue share starts paying back once revenue starts — which requires the product to actually launch. Works best when the founder can sustain the period between launch and meaningful revenue.',
    },
  ],

  deliverable: {
    label: 'What you get',
    headline: 'Full ownership. Full team.',
    description:
      'Same development team and scope as equity deals — but you keep 100% of the equity in exchange for sharing revenue until the agreed cap.',
    items: [
      {
        label: 'Full-stack development team',
        detail: 'same team as equity deal — no difference in scope or quality',
      },
      {
        label: 'AI agent infrastructure',
        detail: 'pre-built multi-agent stack applied to your product',
      },
      {
        label: 'MVP to production',
        detail: 'same timeline as equity model — 8–16 weeks typical',
      },
      {
        label: 'Revenue share percentage',
        detail: 'typically 10–20% of gross revenue',
      },
      {
        label: 'Defined revenue cap',
        detail: '1.5–2.5× the equivalent development cost',
      },
      {
        label: 'Cap reached = arrangement ends',
        detail: 'once the cap is hit, the revenue share stops permanently',
      },
    ],
  },

  timeline: {
    duration: '8–16 weeks to MVP',
    note: 'Revenue share typically 10–20% until a cap of 1.5–2.5× the equivalent development cost.',
  },

  faqs: [
    {
      question: 'How is the revenue share percentage and cap set?',
      answer:
        'We model the expected development cost and use that as the baseline. The cap is set at 1.5–2.5× that equivalent cost — the range depends on the risk profile and timeline to revenue. The percentage is set to reach the cap within a reasonable timeframe under conservative revenue projections, typically 3–5 years.',
    },
    {
      question: 'What counts as revenue for the share calculation?',
      answer:
        'Gross revenue from the product we co-build — invoiced amounts before expenses. If you launch multiple products or expand into new lines, we agree upfront on attribution. Refunds and chargebacks are deducted.',
    },
    {
      question: "What if revenue is slow to arrive?",
      answer:
        "The revenue share clock doesn't start until revenue starts — there's no minimum payment obligation during the development phase. If revenue is materially below projections for 12+ consecutive months post-launch, we have a renegotiation trigger built into the agreement.",
    },
  ],

  cta: {
    title: 'Apply for the revenue share model',
    subtitle: "Keep your equity. Share the revenue until we're whole.",
    primaryCTA: { label: 'Apply now', href: '/ventures/apply' },
    note: 'Response within 5 business days.',
  },
};

export default function RevenueShareModelPage() {
  return <DeepDive content={content} />;
}
