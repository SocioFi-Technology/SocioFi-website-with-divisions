import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Target, Wrench, Check } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bug Fixes & Root Cause Analysis — SocioFi Services',
  description:
    'Priority bug triage, root cause analysis, and fixes deployed to staging before production. Every fix includes a post-mortem.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Services · Bug Fixes',
    headline: (
      <>
        Fixed Fast.{' '}
        <span className="gradient-text">Root Cause Found.</span>
      </>
    ),
    description:
      'The worst bugs are the ones that come back. We do not just patch the symptom — we diagnose the root cause, document why it happened, and make sure the same issue cannot recur.',
    buttons: [
      { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
      { label: 'See plans', href: '/services/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The recurring bug problem',
    headline: 'Fixing bugs without root cause analysis is just delaying them.',
    description:
      'A surface-level fix gets the error count to zero. A root cause fix keeps it there. Most teams under pressure choose speed over depth. We choose both.',
    points: [
      'Same bug reappears in a different form weeks later',
      'No documentation of what caused the issue or how it was resolved',
      'Fixes applied directly to production without testing',
      'No regression coverage added after the fix',
    ],
  },

  capabilitiesLabel: 'How we fix bugs',
  capabilitiesTitle: 'Diagnose. Fix. Prevent.',
  capabilities: [
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Triage and prioritisation',
      description:
        'Every bug report gets assessed for severity, scope, and business impact. Critical issues (data loss, auth failures, payment errors) get same-day attention. Non-critical issues are batched by priority and resolved within the plan SLA.',
    },
    {
      icon: <Wrench size={22} aria-hidden="true" />,
      title: 'Root cause analysis',
      description:
        'We reproduce the issue in a local environment, trace it to the source, and understand why it happened — not just where the error occurs. Every fix is accompanied by a brief written explanation of the root cause.',
    },
    {
      icon: <Check size={22} aria-hidden="true" />,
      title: 'Test and deploy',
      description:
        'Fixes go through your staging environment before production. We add a regression test where feasible so the same bug cannot pass silently in future. Production deployments are coordinated with you.',
    },
  ],

  processLabel: 'Bug fix process',
  processTitle: 'From report to resolved.',
  process: [
    {
      title: '01. Report received',
      description:
        'You report the bug via our shared channel. We acknowledge within the SLA window, classify severity, and assign an engineer.',
      duration: 'Per SLA',
    },
    {
      title: '02. Diagnose',
      description:
        'We reproduce the issue, trace the stack, and identify the root cause. We document our findings before writing a line of fix code.',
      duration: '1–4 hours',
    },
    {
      title: '03. Fix and test',
      description:
        'The fix is written, tested locally, and deployed to staging. We verify the original issue is resolved and check for regressions in adjacent functionality.',
      duration: '2–8 hours',
    },
    {
      title: '04. Deploy and document',
      description:
        'Production deployment with your confirmation. We add a brief post-mortem to the shared log: root cause, fix applied, prevention measures. The record is yours to keep.',
      duration: '1 hour',
    },
  ],

  caseStudy: {
    label: 'Bug fix in practice',
    headline: 'A race condition in the payment flow that refunded customers twice.',
    description:
      "A fintech client was seeing intermittent double-refunds under high concurrency. The error was invisible in logs — it only appeared in Stripe's webhook timeline. We traced it to a race condition in the webhook handler, added idempotency keys, and fixed the root cause.",
    result: '$14,000 in erroneous refunds stopped.',
    resultLabel: 'Financial impact prevented',
  },

  faqs: [
    {
      question: 'How many bug fixes are included in each plan?',
      answer:
        "Essential includes 2 bug fixes per month. Professional includes 5. Enterprise is unlimited. A 'bug fix' covers a single reported issue — a complex issue that requires investigation and multiple code changes still counts as one fix. If you need more fixes than your plan includes, we scope the additional work and price it separately.",
    },
    {
      question: 'What if the bug is in a third-party library?',
      answer:
        'We diagnose it, document it, and find a workaround. If the upstream library has a fix available, we apply it. If not, we implement a patch or alternative approach that prevents the bug from affecting your users. We do not wait for upstream maintainers to fix problems that are affecting your production system.',
    },
    {
      question: 'Do you write tests when fixing bugs?',
      answer:
        'Yes, where feasible. After diagnosing a bug, we add a failing test that reproduces it before writing the fix. This makes the fix verifiable and prevents regression. We do not add test coverage for the entire codebase — only targeted coverage for the specific issue.',
    },
  ],

  cta: {
    title: 'Bugs happen. How fast they get fixed is the variable.',
    subtitle: 'Get guaranteed response times and root cause analysis on every issue.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'See plans', href: '/services/plans' },
    note: 'Response within 4 hours on Professional and Enterprise plans.',
  },
};

export default function BugFixesPage() {
  return <ServiceDetail content={content} />;
}
