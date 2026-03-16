import type { Metadata } from 'next';
import PricingPlans, { type PricingPlansContent } from '@/templates/PricingPlans';

export const metadata: Metadata = {
  title: 'Plans — SocioFi Cloud',
  description:
    'Managed cloud hosting from $99/month. Three tiers — Starter, Professional, and Enterprise. No DevOps required.',
};

const content: PricingPlansContent = {
  hero: {
    badge: 'Cloud · Plans',
    headline: 'Managed hosting that scales with you.',
    description:
      'Fixed monthly pricing. Full infrastructure management. No surprise bills for the things your app needs to survive.',
    buttons: [
      { label: 'Get hosted', href: '/cloud/get-hosted', variant: 'primary' },
      {
        label: "See what's included",
        href: '/cloud/features',
        variant: 'ghost',
      },
    ],
  },

  plans: [
    {
      name: 'Starter',
      description:
        'For small apps and MVPs. Production-grade hosting without the complexity.',
      price: '$99',
      period: '/mo',
      priceNote: 'Billed monthly. Cancel anytime.',
      features: [
        '1 application',
        'Up to 2 vCPUs / 4GB RAM',
        'SSL certificates (auto-renewed)',
        'Daily backups (7-day retention)',
        'Uptime monitoring (1-min intervals)',
        'Basic performance dashboard',
        'CDN for static assets',
        'Zero-downtime deployments',
        'Email alerting',
        'Response within 4 business hours',
      ],
      cta: 'Get started',
      ctaHref: '/cloud/get-hosted',
    },
    {
      name: 'Professional',
      badge: 'Most popular',
      description:
        'For production SaaS apps with real traffic and uptime requirements.',
      price: '$299',
      period: '/mo',
      priceNote: 'Billed monthly. Includes all Starter features.',
      features: [
        'Up to 3 applications',
        'Up to 8 vCPUs / 16GB RAM',
        'Everything in Starter',
        'Daily backups (30-day retention)',
        'Advanced monitoring + error tracking',
        'Staging environment included',
        'Auto-scaling policies',
        'Private networking',
        'Slack/PagerDuty alerting',
        'Response within 1 hour',
        'Monthly infrastructure review call',
      ],
      cta: 'Get started',
      ctaHref: '/cloud/get-hosted',
      featured: true,
    },
    {
      name: 'Enterprise',
      description:
        'For high-traffic systems, compliance requirements, or dedicated infrastructure.',
      price: '$599',
      period: '/mo',
      priceNote: 'Custom pricing available for larger setups.',
      features: [
        'Unlimited applications',
        'Custom server sizing',
        'Everything in Professional',
        'Daily backups (90-day retention)',
        'Compliance support (SOC 2, HIPAA ready)',
        'Custom private networking',
        'Multi-region deployment',
        'Dedicated account engineer',
        'SLA: 99.9% uptime guarantee',
        'Response within 15 minutes',
        'Quarterly architecture review',
      ],
      cta: 'Contact us',
      ctaHref: '/cloud/get-hosted',
    },
  ],

  comparisonHeaders: ['Feature', 'Starter', 'Professional', 'Enterprise'],
  comparisonHighlight: 2,

  comparisonRows: [
    { feature: 'Applications', values: ['1', 'Up to 3', 'Unlimited'] },
    { feature: 'SSL certificates', values: [true, true, true] },
    { feature: 'Daily backups', values: ['7 days', '30 days', '90 days'] },
    { feature: 'Uptime monitoring', values: [true, true, true] },
    { feature: 'CDN', values: [true, true, true] },
    { feature: 'Staging environment', values: [false, true, true] },
    { feature: 'Auto-scaling', values: [false, true, true] },
    { feature: 'Private networking', values: [false, true, true] },
    { feature: 'Multi-region', values: [false, false, true] },
    { feature: 'Compliance support', values: [false, false, true] },
    { feature: 'Uptime SLA', values: ['99.5%', '99.9%', '99.9%'] },
    {
      feature: 'Support response',
      values: ['4 hours', '1 hour', '15 min'],
    },
    { feature: 'Dedicated engineer', values: [false, false, true] },
  ],

  bundle: {
    label: 'Every plan includes',
    headline: "No tier earns you production basics. Every plan includes them.",
    description:
      "SSL, backups, monitoring, CDN, zero-downtime deploys — these aren't premium features. They're the floor.",
    items: [
      'SSL/TLS certificates — auto-renewed, zero-downtime rotation',
      'Managed reverse proxy — Nginx or Caddy, fully configured',
      'Daily encrypted backups — automatic, off-site, tested',
      'Uptime monitoring — 1-minute check intervals with instant alerting',
      'CDN for static assets — global edge distribution included',
      'Zero-downtime deployments — blue/green or rolling strategy, always',
    ],
    cta: 'Get hosted',
    ctaHref: '/cloud/get-hosted',
  },

  trustItems: [
    'Fixed monthly pricing. No surprise bills.',
    'Full infrastructure management included.',
    '24-hour setup. No DevOps required.',
    'Cancel anytime with 30-day notice.',
  ],

  faqs: [
    {
      question: 'Can I host on my existing cloud account?',
      answer:
        'Yes. We can manage infrastructure provisioned under your own AWS, DigitalOcean, Hetzner, or Vercel account. You keep the billing relationship with the provider — we add our management layer on top. This is common for clients who already have credits or existing accounts.',
    },
    {
      question: "What's not included in the monthly fee?",
      answer:
        "The cloud provider's server costs are separate — they go directly to your provider account. Our fee covers the management layer: configuration, monitoring, incident response, backups, and engineering time. We'll give you a clear estimate of expected provider costs during onboarding.",
    },
    {
      question: 'Do you support custom stacks?',
      answer:
        'Yes. Node.js, Python, Ruby, Go, PHP, Java — and frameworks like Next.js, Django, Rails, Laravel. Databases: PostgreSQL, MySQL, MongoDB, Redis. If your stack runs on Linux, we can manage it.',
    },
    {
      question: 'What happens if I want to cancel?',
      answer:
        '30-day notice to cancel. We provide full handover documentation — infrastructure configs, runbooks, access credentials — so you or another team can take over without disruption. Nothing is locked in.',
    },
    {
      question: 'Is there a setup fee?',
      answer:
        "No setup fee. Setup time and initial configuration is included in the first month's fee. You're up and running before your second invoice.",
    },
  ],

  cta: {
    title: 'Not sure which plan fits?',
    subtitle:
      "Tell us about your app — traffic, stack, requirements. We'll recommend the right plan.",
    primaryCTA: { label: 'Talk to us', href: '/cloud/get-hosted' },
    ghostCTA: { label: "See what's included", href: '/cloud/features' },
    note: 'No setup fee. 24-hour onboarding.',
  },
};

export default function PlansPage() {
  return <PricingPlans content={content} />;
}
