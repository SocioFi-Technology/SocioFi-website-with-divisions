import PricingPlans, { type PricingPlansContent } from '@/templates/PricingPlans';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — SocioFi Studio',
  description:
    "Fixed-scope, fixed-price software development. Three packages from $2,500 to custom enterprise. No hourly billing, no surprise invoices.",
};

const content: PricingPlansContent = {
  hero: {
    badge: 'Studio · Pricing',
    headline: 'Honest pricing. No surprises.',
    description:
      "Every project starts with a scoping call and ends with a written proposal — a specific price for a specific scope. You know exactly what you're getting before you commit.",
    buttons: [
      { label: 'Book a scoping call', href: '/studio/start-project', variant: 'primary' },
      { label: 'See our work', href: '/studio/portfolio', variant: 'ghost' },
    ],
  },

  plans: [
    {
      name: 'Starter',
      description: 'For MVPs & First Products — a working product with real infrastructure, ready for real users.',
      price: 'From $2,500',
      period: '',
      priceNote: 'Fixed price. Scoped before you commit.',
      features: [
        'MVP or targeted feature build',
        'Up to 3 core user flows',
        'Authentication and user accounts',
        'Deployed to production infrastructure',
        'Source code and repository transfer',
        'Deployment documentation',
        '14-day post-launch support',
        'Single revision round',
      ],
      cta: 'Start a project',
      ctaHref: '/studio/start-project',
    },
    {
      name: 'Growth',
      badge: 'Most popular',
      description: 'For Serious Products — full-stack development plus ongoing maintenance in one predictable monthly engagement.',
      price: 'From $5,000',
      period: '/mo',
      priceNote: 'Development + maintenance. Most engagements run 2–4 months.',
      features: [
        'Full-stack product or SaaS foundation',
        'Unlimited user flows within scope',
        'Authentication, roles, and permissions',
        'Third-party integrations (Stripe, APIs)',
        'Admin panel or internal dashboard',
        'Error monitoring and alerting',
        'Staging and production environments',
        'Source code and repository transfer',
        'Full deployment documentation',
        '30-day post-launch support',
        'Two revision rounds',
      ],
      cta: 'Start a project',
      ctaHref: '/studio/start-project',
      featured: true,
    },
    {
      name: 'Scale',
      description: 'For Bigger Ambitions — complex systems, dedicated engineering, and the architecture to support serious growth.',
      price: 'Custom',
      period: '',
      priceNote: 'Scoped and priced after a detailed discovery call.',
      features: [
        'Everything in Growth',
        'Multi-tenant architecture',
        'Complex data models and migrations',
        'Advanced AI feature integration',
        'Custom reporting and analytics',
        'Enterprise SSO and compliance support',
        'Architecture consulting included',
        'Dedicated lead engineer',
        '90-day post-launch support',
        'Ongoing retainer option available',
        'Priority scheduling',
      ],
      cta: 'Discuss your project',
      ctaHref: '/studio/start-project',
    },
  ],

  comparisonHeaders: ['Feature', 'Starter', 'Growth', 'Scale'],
  comparisonHighlight: 2,
  comparisonRows: [
    { feature: 'Fixed price', values: [true, true, true] },
    { feature: 'Core user flows', values: ['Up to 3', 'Unlimited', 'Unlimited'] },
    { feature: 'Authentication', values: [true, true, true] },
    { feature: 'Third-party integrations', values: [false, true, true] },
    { feature: 'Admin panel', values: [false, true, true] },
    { feature: 'Staging environment', values: [false, true, true] },
    { feature: 'Error monitoring', values: [false, true, true] },
    { feature: 'Multi-tenant architecture', values: [false, false, true] },
    { feature: 'AI feature integration', values: [false, 'Optional', true] },
    { feature: 'Architecture consulting', values: [false, false, true] },
    { feature: 'Post-launch support', values: ['14 days', '30 days', '90 days'] },
    { feature: 'Revision rounds', values: ['1', '2', 'Unlimited'] },
    { feature: 'Dedicated engineer', values: [false, false, true] },
  ],

  bundle: {
    label: 'Every plan includes',
    headline: 'No tier earns you the basics. Every project gets them.',
    description:
      "Regardless of budget or tier, these are non-negotiable. We don't charge extra for quality fundamentals.",
    items: [
      'Human code review — every line reviewed by a senior engineer before it ships',
      'Production deployment — fully configured hosting, SSL, CDN, and environment setup',
      'Hosting setup — infrastructure provisioned, connected, and documented',
      '30-day post-launch bug fixes — free fixes for anything that doesn\'t match the agreed spec',
      'Source code ownership — repository and all IP transferred to you on delivery',
      'Written documentation — deployment docs and handover notes included with every project',
    ],
    cta: 'Start a project',
    ctaHref: '/studio/start-project',
  },

  trustItems: [
    'Fixed scope. Fixed price. No billing surprises.',
    'Written proposal before you commit.',
    'Code ownership transferred on delivery.',
    '30-day post-launch support included.',
  ],

  faqs: [
    {
      question: 'Can I switch plans or tiers mid-project?',
      answer:
        "Yes. If your requirements grow beyond the original scope, we write up the change, price it, and you approve it before we proceed. You can move from Starter to Growth scope — or from Growth to Scale — at any point. Nothing changes without your written sign-off and a revised proposal.",
    },
    {
      question: 'Do you charge hourly?',
      answer:
        "No. Every project is fixed price for a fixed scope. Hourly billing misaligns incentives — it rewards slowness. Fixed price means we build efficiently and you're protected from runaway costs. You'll know the exact number before a single line of code is written.",
    },
    {
      question: 'Is there a refund policy?',
      answer:
        "You can cancel after receiving the proposal — before work starts — with no penalty and no payment due. Once the build phase begins, payments are tied to milestone completions. We don't issue refunds for completed milestones, but if we miss something in the agreed spec we fix it at no extra charge.",
    },
    {
      question: 'Can you run multiple projects simultaneously?',
      answer:
        "Yes, with scheduling. We assign a dedicated lead engineer to each project, so running two projects at once means two separate engineers — not one engineer split between two clients. Availability depends on current capacity. Mention this during the scoping call and we will confirm what's possible.",
    },
    {
      question: "Why 'from' pricing? What determines the final price?",
      answer:
        "Scope. A Starter project with a simple data model and two integrations costs less than one with a complex workflow and five integrations. The 'from' price is a floor — we've never gone below it. Your final price is determined in the scoping call and stated precisely in the written proposal.",
    },
    {
      question: 'What does post-launch support cover?',
      answer:
        "Bugs and unexpected behaviour discovered after launch — things that weren't apparent during QA. If something works differently than the agreed spec, we fix it at no charge within the support window. Post-launch support does not cover new features or scope additions — those are new projects.",
    },
    {
      question: 'What if I need ongoing engineering after the project ends?',
      answer:
        "We offer ongoing maintenance and support through our Services division. Monthly retainers cover updates, monitoring, security patches, and small feature additions. Alternatively, your source code is fully documented so you can hand it to any engineer.",
    },
  ],

  cta: {
    title: "Not sure which tier fits?",
    subtitle:
      "Tell us what you're building. We'll tell you where it lands and give you a specific number — not a range.",
    primaryCTA: { label: 'Book a free scoping call', href: '/studio/start-project' },
    ghostCTA: { label: 'See how we work', href: '/studio/process' },
    note: 'Free 30-minute call. Written proposal within 48 hours.',
  },
};

export default function StudioPricingPage() {
  return <PricingPlans content={content} />;
}
