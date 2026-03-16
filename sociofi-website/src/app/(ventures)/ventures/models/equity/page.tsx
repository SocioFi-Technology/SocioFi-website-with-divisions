import type { Metadata } from 'next';
import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Rocket, Target, Users } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Equity Co-Build Model — SocioFi Ventures',
  description:
    'Build your product with no upfront cost. SocioFi takes an equity stake in exchange for the full development team, AI infrastructure, and ongoing engineering support.',
};

const content: DeepDiveContent = {
  hero: {
    badge: 'Ventures · Equity model',
    headline: (
      <>
        Full development team.
        <br />
        <span className="gradient-text">No upfront cost.</span>
      </>
    ),
    description:
      "We build your product in exchange for an equity stake. No development invoices — we're invested in your success because we're on the cap table.",
    buttons: [
      { label: 'Apply for this model', href: '/ventures/apply', variant: 'primary' },
      { label: 'Compare all models', href: '/ventures/how-it-works', variant: 'ghost' },
    ],
  },

  useCasesLabel: 'Best suited for',
  useCasesTitle: 'Who the equity model works best for',

  useCases: [
    {
      icon: <Rocket size={24} />,
      title: 'Pre-revenue founders',
      description:
        'You have the idea, the market knowledge, and the drive — but not the cash to hire a development team. Equity deals make the build possible without burning savings.',
    },
    {
      icon: <Target size={24} />,
      title: 'High-conviction markets',
      description:
        "You're confident enough in the market opportunity to give up a piece of the upside. Equity deals require founders who believe they're building something valuable.",
    },
    {
      icon: <Users size={24} />,
      title: 'Founders who want a long-term partner',
      description:
        "Equity means we're in this together for the long run — not a vendor relationship. Best for founders who want an engineering partner, not just a build service.",
    },
  ],

  deliverable: {
    label: 'What you get',
    headline: 'A development team on your cap table',
    description:
      'The equity model includes everything in the standard co-build — plus the alignment that comes from us having real skin in the game.',
    items: [
      {
        label: 'Full-stack development team',
        detail: 'senior engineers + AI specialists + dedicated lead',
      },
      {
        label: 'AI agent infrastructure',
        detail: 'pre-built multi-agent stack applied to your product',
      },
      {
        label: 'MVP to production',
        detail: 'typically 8–16 weeks from kick-off to launched product',
      },
      {
        label: 'Ongoing maintenance',
        detail: 'monitoring, security, and engineering support included',
      },
      {
        label: 'Founder coaching',
        detail: 'direct access to SocioFi CEO/CTO on product and fundraising strategy',
      },
      {
        label: 'Buyout provision',
        detail: 'defined buyout price set at signing — no surprises later',
      },
    ],
  },

  timeline: {
    duration: '8–16 weeks to MVP',
    note: 'Equity stake typically 15–30%, negotiated per deal based on scope and stage.',
  },

  faqs: [
    {
      question: 'How is the equity percentage determined?',
      answer:
        "We look at the scope of the build, the current stage of the idea (pre-MVP vs. post-validation), whether there's any cash component, and the overall risk profile of the market. Typical range is 15–30% for a pure equity deal. This is always negotiated — we don't apply a formula.",
    },
    {
      question: 'What happens to the equity if we pivot?',
      answer:
        "Pivots within the same general problem space are treated as evolution, not breach. We renegotiate terms if the scope change is significant. Pivots to a completely different market would trigger a renegotiation of the full deal structure. We've been through pivots with portfolio companies — the goal is always to find a structure that keeps the partnership working.",
    },
    {
      question: 'Do you take board seats?',
      answer:
        "We don't take board seats as a standard condition. For equity stakes above 20%, we typically negotiate observer rights — the right to attend board meetings without voting. We've found this gives us enough visibility without the governance overhead of a formal seat.",
    },
  ],

  cta: {
    title: 'Apply for the equity model',
    subtitle: "Tell us about your idea and we'll assess fit within 5 business days.",
    primaryCTA: { label: 'Apply now', href: '/ventures/apply' },
    note: 'No automated filters. Every application read by a human.',
  },
};

export default function EquityModelPage() {
  return <DeepDive content={content} />;
}
