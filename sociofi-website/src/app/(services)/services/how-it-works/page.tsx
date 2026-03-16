import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Eye, Shield, Calendar } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — SocioFi Services',
  description:
    'Onboarding takes 48 hours. We set up monitoring, run a baseline audit, and send your first report before your first monthly cycle starts.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Services · How It Works',
    headline: (
      <>
        Up and Running in{' '}
        <span className="gradient-text">48 Hours.</span>
      </>
    ),
    description:
      'Onboarding a maintenance client takes 48 hours. We request access, run a baseline audit, configure monitoring, and send you your first report — all before your first monthly cycle starts.',
    buttons: [
      { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
      { label: 'See plans', href: '/services/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Why maintenance matters',
    headline: 'A launched product is not a finished product.',
    description:
      'After launch, most founders assume the work is done. Dependencies age. Performance degrades. Bugs accumulate. Security vulnerabilities appear. Without a process, these compound into something expensive.',
    points: [
      'Dependencies fall 6–18 months behind current versions within a year of launch',
      'Production bugs go undetected for days without active monitoring',
      'Security patches released for known vulnerabilities go unapplied for months',
      'Performance regressions creep in unnoticed with every new feature',
    ],
  },

  capabilitiesLabel: 'What you get',
  capabilitiesTitle: 'Included in every plan.',
  capabilities: [
    {
      icon: <Eye size={22} aria-hidden="true" />,
      title: 'Active monitoring from day one',
      description:
        'Within 48 hours of onboarding, your application is under active monitoring — uptime checks, error rate tracking, and performance baselines. We see issues as they happen, not after your customers report them.',
    },
    {
      icon: <Shield size={22} aria-hidden="true" />,
      title: 'Security and patch management',
      description:
        'Your dependencies are audited on onboarding and scanned weekly thereafter. Critical patches are deployed within 24 hours. Monthly reports document everything that was patched and why.',
    },
    {
      icon: <Calendar size={22} aria-hidden="true" />,
      title: 'Monthly check-ins and reports',
      description:
        'Every month: a written report covering what was monitored, what was fixed, what was patched, and what is planned. A 30-minute video check-in is available on Professional and Enterprise plans.',
    },
  ],

  processLabel: 'The onboarding process',
  processTitle: 'Week one, and every week after.',
  process: [
    {
      title: '01. Sign up and onboard',
      description:
        'You complete the onboarding form at /services/get-protected. We review your stack, plan type, and access requirements. You receive an onboarding checklist within 4 hours of submission.',
      duration: '4 hours',
    },
    {
      title: '02. Access transfer',
      description:
        'We request the minimum access required: repository read access, hosting provider read access, and error tracking if available. You retain full control — we do not need write access beyond deployment automation.',
      duration: '1–2 hours',
    },
    {
      title: '03. Baseline audit',
      description:
        'We run a 24-hour baseline: dependency audit, performance benchmarks, error rate baseline, and security scan. This establishes your starting point and identifies any immediate issues.',
      duration: '24 hours',
    },
    {
      title: '04. Monitoring live',
      description:
        'Alerts configured, monitoring dashboards set up, and your first weekly digest scheduled. From this point, we are watching your production environment continuously and respond to incidents as they happen.',
      duration: 'Day 2',
    },
    {
      title: '05. Ongoing cycle',
      description:
        'Monthly: security patches, bug fix allocation, feature work (Professional/Enterprise), and a written report. Weekly: monitoring check-in. Immediate: critical incident escalation.',
      duration: 'Monthly',
    },
  ],

  caseStudy: {
    label: 'What onboarding looks like',
    headline: '48-hour onboarding uncovered 3 critical issues before we even started billing.',
    description:
      'During baseline setup for a new client, our dependency audit flagged an authentication library with a published CVE from 3 weeks prior — unpatched and unknown to the client. We patched it the same day. Two additional moderate-severity issues were added to the next month batch.',
    result: 'Critical CVE patched before first billing cycle.',
    resultLabel: 'Baseline audit outcome',
  },

  faqs: [
    {
      question: 'What access do you need?',
      answer:
        'At minimum: repository read access (so we can review code and pull dependency trees) and your hosting provider monitoring API. For active bug fixing and patching, we need deployment access — usually via a CI/CD integration. We document exactly what access we request and why before you grant anything.',
    },
    {
      question: 'How do you handle sensitive credentials?',
      answer:
        'All credentials are stored in an encrypted secrets manager. We follow the principle of least privilege — each team member has access only to what is required for their specific role. NDAs are available on request and are standard on Enterprise plans.',
    },
    {
      question: 'Can I cancel any time?',
      answer:
        'Yes. Plans are month-to-month with no lock-in. Cancel before your next billing date and you will not be charged for the following month. Your access is revoked, all credentials are deleted from our systems, and you receive a final handover document with everything we did while active.',
    },
  ],

  cta: {
    title: 'Start the 48-hour onboarding.',
    subtitle:
      'Complete the onboarding form and we will have your application under monitoring within two business days.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'See plans', href: '/services/plans' },
    note: 'Monitoring active within 48 hours. Month-to-month. No lock-in.',
  },
};

export default function HowItWorksPage() {
  return <ServiceDetail content={content} />;
}
