import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Code, GitBranch, Layers } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feature Updates & Development — SocioFi Services',
  description:
    'Scoped feature additions to your existing product. Branch-based development, migration-safe changes, no regressions.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Services · Feature Updates',
    headline: (
      <>
        Your Product Keeps Growing.{' '}
        <span className="gradient-text">Without Breaking.</span>
      </>
    ),
    description:
      'Adding features to a live product is different from building from scratch. The existing architecture, the existing users, and the existing data all have to be respected. We add to what works without touching what does not.',
    buttons: [
      { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
      { label: 'See plans', href: '/services/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The growth problem',
    headline: 'New features break existing ones if you rush them.',
    description:
      'Most post-launch feature requests seem simple until an engineer opens the codebase and discovers how tightly coupled everything is. We scope before we touch.',
    points: [
      'New integrations clash with existing data models',
      'Rushed feature work introduces regressions in core flows',
      'Schema changes break existing functionality without a migration plan',
      'New code written without understanding existing patterns',
    ],
  },

  capabilitiesLabel: 'How we add features',
  capabilitiesTitle: 'Scope first. Build second.',
  capabilities: [
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Scoped additions',
      description:
        'Every feature request gets a written scope before we write code: what we are building, how it interacts with existing systems, what the risks are, and how long it will take. You approve the scope before we start.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Branch-based development',
      description:
        'Feature work happens in isolated branches. We develop and test against a staging environment that mirrors production. Nothing reaches your users until it has been reviewed and signed off.',
    },
    {
      icon: <Layers size={22} aria-hidden="true" />,
      title: 'Migration-safe changes',
      description:
        'Database schema changes, API version updates, and data migrations are handled with rollback plans. We do not make breaking changes without a clear path to undo them if something goes wrong.',
    },
  ],

  processLabel: 'Feature development process',
  processTitle: 'No surprises. No regressions.',
  process: [
    {
      title: '01. Scope the request',
      description:
        'You describe what you want. We investigate the codebase, assess impact on existing functionality, write a brief scope doc, and give you a time estimate. You approve before we write a line of code.',
      duration: '1–2 days',
    },
    {
      title: '02. Build in isolation',
      description:
        'Development happens in a feature branch with full access to your repository. We follow existing patterns and naming conventions — new code reads like it belongs.',
      duration: 'Per scope',
    },
    {
      title: '03. Staging review',
      description:
        'The feature is deployed to staging for your review. You test it, give feedback, and request revisions. We iterate until it matches your expectations.',
      duration: '1–3 days',
    },
    {
      title: '04. Production deploy',
      description:
        'Production deployment at a time that minimises user disruption. If a migration is required, we run it in a maintenance window with a tested rollback path.',
      duration: '1 hour',
    },
  ],

  caseStudy: {
    label: 'Feature work in practice',
    headline: 'Added multi-currency support to a live payments platform without downtime.',
    description:
      'A fintech client needed multi-currency support added to an existing Stripe integration. We scoped the schema changes, built a backwards-compatible migration, and deployed in a 20-minute maintenance window. Zero payment disruptions during the transition.',
    result: '4 new markets opened within 2 weeks.',
    resultLabel: 'Business impact',
  },

  faqs: [
    {
      question: 'How are feature requests scoped?',
      answer:
        'You describe the feature in plain language. We investigate the codebase and write a scope document: what we will build, what we will not build, how it interacts with existing systems, and a time estimate. The scope is fixed before we start — no scope creep mid-build.',
    },
    {
      question: 'Can you add features to any tech stack?',
      answer:
        'We work with the stacks we build with: Next.js, React, Node.js, Python, PostgreSQL, and their ecosystems. If your product is built on something else, we assess it during onboarding. We will not take on feature work on a codebase we cannot maintain confidently.',
    },
    {
      question: 'Is feature development included in all plans?',
      answer:
        'Feature development is included in the Professional and Enterprise plans. Essential covers monitoring, security, and bug fixes only. If you need occasional feature work on an Essential plan, we scope it as a standalone addition at a fixed price.',
    },
  ],

  cta: {
    title: 'Grow your product without growing your risk.',
    subtitle: 'Scoped feature development on your existing codebase. No regressions guaranteed.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'See plans', href: '/services/plans' },
    note: 'Feature work available on Professional and Enterprise plans.',
  },
};

export default function FeatureUpdatesPage() {
  return <ServiceDetail content={content} />;
}
