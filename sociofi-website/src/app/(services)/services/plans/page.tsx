import PricingPlans, { type PricingPlansContent } from '@/templates/PricingPlans';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance Plans & Pricing — SocioFi Services',
  description:
    'Three fixed-price monthly plans from $499. 24/7 monitoring, security patches, bug fixes, and feature development for live software.',
};

const content: PricingPlansContent = {
  hero: {
    badge: 'Services · Plans',
    headline: 'Maintenance that fits your stage.',
    description:
      'Three fixed-price monthly plans. Monitoring and security at every tier. Bug fixes and feature work on the plans that need them. Cancel any time.',
    buttons: [
      { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
      { label: 'How it works', href: '/services/how-it-works', variant: 'ghost' },
    ],
  },

  showRecommender: true,

  plans: [
    {
      name: 'Essential',
      description: 'Monitoring, security patches, and bug fixes for applications that need a watchful eye.',
      price: '$499',
      period: '/mo',
      priceNote: 'Billed monthly. Cancel any time.',
      features: [
        '24/7 uptime monitoring',
        'Error rate and performance tracking',
        'Weekly dependency audits',
        'Critical patch deployment (24hr SLA)',
        'Monthly security batch patches',
        '2 bug fixes per month',
        '24-hour bug response SLA',
        'Monthly written report',
      ],
      cta: 'Get Essential',
      ctaHref: '/services/get-protected',
    },
    {
      name: 'Professional',
      badge: 'Most popular',
      description: 'Full maintenance plus feature development — for products actively growing post-launch.',
      price: '$999',
      period: '/mo',
      priceNote: 'Most clients run Professional for 6–12 months post-launch.',
      features: [
        'Everything in Essential',
        '4-hour incident response SLA',
        '5 bug fixes per month',
        'Feature development (up to 8 hrs/mo)',
        'Monthly 30-min video check-in',
        'Performance monitoring and optimisation',
        'Staging environment management',
        'Priority engineer assignment',
      ],
      cta: 'Get Professional',
      ctaHref: '/services/get-protected',
      featured: true,
    },
    {
      name: 'Enterprise',
      description: 'Dedicated engineering support for mission-critical products with strict uptime and compliance requirements.',
      price: 'Custom',
      period: '',
      priceNote: 'Scoped after a discovery call.',
      features: [
        'Everything in Professional',
        '1-hour incident response SLA',
        'Unlimited bug fixes',
        'Unlimited feature development',
        'Dedicated lead engineer',
        'Quarterly security audit + pentest',
        'Custom SLA with financial guarantees',
        'NDA and compliance documentation',
        'Multi-environment management',
      ],
      cta: 'Discuss Enterprise',
      ctaHref: '/services/get-protected',
    },
  ],

  comparisonHeaders: ['Feature', 'Essential', 'Professional', 'Enterprise'],
  comparisonHighlight: 2,
  comparisonRows: [
    { feature: 'Uptime monitoring', values: [true, true, true] },
    { feature: 'Error rate tracking', values: [true, true, true] },
    { feature: 'Security patches', values: [true, true, true] },
    { feature: 'Bug fixes per month', values: ['2', '5', 'Unlimited'] },
    { feature: 'Bug response SLA', values: ['24 hours', '4 hours', '1 hour'] },
    { feature: 'Feature development', values: [false, '8 hrs/mo', 'Unlimited'] },
    { feature: 'Monthly report', values: [true, true, true] },
    { feature: 'Video check-in', values: [false, true, true] },
    { feature: 'Dedicated engineer', values: [false, false, true] },
    { feature: 'Quarterly pentest', values: [false, false, true] },
    { feature: 'Custom SLA', values: [false, false, true] },
    { feature: 'NDA included', values: [false, false, true] },
  ],

  bundle: {
    label: 'Every plan includes',
    headline: 'No plan earns you the basics. Every plan gets them.',
    description:
      'These are non-negotiable at every tier. No upsells, no add-ons for the fundamentals.',
    items: [
      'Monthly written report — what was monitored, fixed, patched, and planned',
      'Dependency audits — weekly automated scans across your full stack',
      'Critical CVE response — patches deployed within 24 hours of publication',
      'Access security — encrypted credential storage, least-privilege access',
      'Month-to-month billing — cancel before your next billing date, no lock-in',
      'Handover document — everything we did, documented, if you cancel',
    ],
  },

  trustItems: [
    'Month-to-month. No lock-in.',
    'Monitoring live in 48 hours.',
    'Response time guaranteed in writing.',
    'Cancel before next billing date.',
  ],

  faqs: [
    {
      question: 'Can I change plans?',
      answer:
        'Yes. Upgrade or downgrade before your next billing date and the change takes effect on your next cycle. Upgrading mid-cycle is prorated — you pay only for the days on the new plan. Downgrading takes effect at the start of the next cycle.',
    },
    {
      question: 'What happens if I need more bug fixes than my plan includes?',
      answer:
        'Additional bug fixes outside your monthly allocation are scoped and priced individually at a fixed rate. We tell you the cost before we start. You approve it or decline — we do not bill for out-of-scope work without written authorisation.',
    },
    {
      question: 'Is there a setup fee?',
      answer:
        'No. Onboarding is included in the first month payment. The 48-hour onboarding process — dependency audit, monitoring setup, and baseline report — happens at no additional cost.',
    },
    {
      question: 'Do you support any tech stack?',
      answer:
        'We support the stacks we build with: Next.js, React, Node.js, Python, Go, PostgreSQL, Redis, and their common ecosystems. If your stack includes something outside this list, we assess it during onboarding and tell you honestly whether we can maintain it confidently.',
    },
    {
      question: 'What if my application is hosted on an unusual platform?',
      answer:
        'We work with all major cloud providers (AWS, GCP, Azure, DigitalOcean, Vercel, Railway, Render) and can adapt our monitoring setup to fit your infrastructure. Edge cases are discussed during onboarding before you commit.',
    },
  ],

  cta: {
    title: 'Start with the plan that fits. Upgrade as you grow.',
    subtitle: 'Month-to-month. Active monitoring in 48 hours. No lock-in.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'How it works', href: '/services/how-it-works' },
    note: 'No setup fee. Month-to-month. Cancel any time.',
  },
};

export default function ServicesPlansPage() {
  return <PricingPlans content={content} />;
}
