import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Wrench, Lock, Gear, GitBranch, Database, Target,
} from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance Handoff — SocioFi Studio',
  description:
    'We\'ll take over from here. Professional codebase audit, documentation, monitoring setup, security scan, and transition to ongoing maintenance. 1–2 weeks, starting at $2,000.',
  alternates: { canonical: '/studio/services/maintenance-handoff' },
  openGraph: {
    title: 'Maintenance Handoff — SocioFi Studio',
    description:
      'We\'ll take over from here. Professional codebase audit, documentation, monitoring setup, security scan, and transition to ongoing maintenance.',
    url: '/studio/services/maintenance-handoff',
  },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'MAINTENANCE HANDOFF',
    headline: (
      <>
        We\'ll Take Over{' '}
        <span className="gradient-text">From Here.</span>
      </>
    ),
    description:
      "You have live software that needs professional ongoing maintenance. Maybe it was built by a previous team, or by AI tools, or by a freelancer who's gone. We audit the codebase, document everything, set up monitoring, and transition to a professional maintenance plan.",
    buttons: [
      { label: 'Start the handoff', href: '/studio/start-project', variant: 'primary' },
      { label: 'See ongoing plans', href: '/services/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Who it\'s for',
    headline: 'Live software without the team that built it.',
    description:
      "Plenty of businesses are running software that no longer has a dedicated owner. The original developer is gone, the freelancer moved on, or the AI-generated codebase was never fully understood. The product still works — until it doesn't.",
    points: [
      'Software built by a previous engineering team with no documentation or handoff',
      'Products where the only person who knew how it worked is no longer available',
      'Codebases running on outdated dependencies that nobody wants to touch',
      'Founders spending mental energy on code they don\'t want to think about',
    ],
  },

  capabilitiesLabel: 'What we do',
  capabilitiesTitle: 'Six steps from unknown codebase to professional oversight.',
  capabilities: [
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Codebase Audit',
      description:
        'We read everything. Every file, every dependency, every deployment configuration. We produce a condition report — what\'s solid, what\'s fragile, what are the landmines — before any transition begins.',
    },
    {
      icon: <Database size={22} aria-hidden="true" />,
      title: 'Documentation',
      description:
        'Architecture overview, deployment procedures, environment configuration, known quirks. Everything that currently lives only in someone\'s head — or nowhere — gets written down.',
    },
    {
      icon: <Gear size={22} aria-hidden="true" />,
      title: 'Monitoring Setup',
      description:
        'Error tracking, uptime monitoring, performance alerts. Configured with sensible thresholds so you know about a problem before your users do.',
    },
    {
      icon: <Lock size={22} aria-hidden="true" />,
      title: 'Security Scan',
      description:
        'Dependency vulnerability audit, credential exposure check, common misconfiguration patterns. Critical issues flagged and patched during the handoff period.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Dependency Updates',
      description:
        'Stop running 3-year-old packages with known vulnerabilities. We update dependencies systematically, testing after each batch to catch regressions.',
    },
    {
      icon: <Wrench size={22} aria-hidden="true" />,
      title: 'Transition to Services',
      description:
        'After the audit, ongoing maintenance transfers to SocioFi Services — the same company, a division built specifically for ongoing work. Same team, different engagement model.',
    },
  ],

  processLabel: 'How the handoff works',
  processTitle: 'Audit, stabilize, hand over — in 1–2 weeks.',
  process: [
    {
      title: '01. Codebase access',
      description:
        'You grant read access to the repository and infrastructure. We begin the audit immediately — no waiting for onboarding paperwork.',
      duration: '1 day',
    },
    {
      title: '02. Condition report',
      description:
        'An honest assessment of what we found: what\'s working, what\'s fragile, what\'s actively dangerous. Delivered before any billing for fixes begins.',
      duration: '2–3 days',
    },
    {
      title: '03. Stabilization',
      description:
        'Critical fixes, dependency updates, security patches, and monitoring setup. The codebase moves from "unknown" to "understood and stable."',
      duration: '3–7 days',
    },
    {
      title: '04. Documentation & transition',
      description:
        'Written documentation, runbooks, and a briefing call. The transition to ongoing maintenance completes. Nothing is a mystery anymore.',
      duration: '1–2 days',
    },
  ],

  caseStudy: {
    label: 'Handoff in practice',
    headline: 'An inherited codebase. No docs. Three mystery environment variables.',
    description:
      "A founder acquired a SaaS product with no documentation, no original developer, and three environment variables that nobody knew the purpose of. We audited in 3 days, documented everything, resolved the credential mystery, and moved the product onto a stable maintenance plan.",
    result: 'From undocumented legacy to maintained product — 10 days',
    resultLabel: 'total handoff timeline',
  },

  faqs: [
    {
      question: 'What\'s the difference between this and SocioFi Services?',
      answer:
        'This is the one-time transition engagement. We audit, stabilize, document, and set up monitoring — all the work that needs to happen before ongoing maintenance can begin. SocioFi Services is the ongoing monthly plan that follows. Think of this as the onboarding for maintenance.',
    },
    {
      question: 'Do we have to use SocioFi Services after the handoff?',
      answer:
        'No. We hand you everything — the audited codebase, the documentation, the monitoring setup, all credentials. You can take it to any team or go fully independent. The handoff is complete and unconditional.',
    },
    {
      question: 'What if the code is in terrible condition?',
      answer:
        'We\'ll tell you. The condition report is honest about the severity. We give you an assessment before you commit to any fix work — so you know what you\'re dealing with and can decide how much to address.',
    },
    {
      question: 'How long does monitoring setup take?',
      answer:
        'Typically 1–2 days. We use standard tools — Sentry for error tracking, Uptime Robot or Better Uptime for availability monitoring — and configure alerts around thresholds that make sense for your product.',
    },
  ],

  cta: {
    title: 'Ready to hand it over?',
    subtitle:
      "Tell us about the software. We'll tell you what the handoff involves and what it costs — before you commit to anything.",
    primaryCTA: { label: 'Start the handoff', href: '/studio/start-project' },
    ghostCTA: { label: 'See ongoing plans', href: '/services/plans' },
    note: 'Free assessment call. Condition report delivered within 3 days.',
  },
};

export default function MaintenanceHandoffPage() {
  return <ServiceDetail content={content} />;
}
