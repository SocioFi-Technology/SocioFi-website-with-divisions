import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Code, Wrench, Gear, Lock, Target, GitBranch,
} from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rescue & Ship — SocioFi Studio',
  description:
    'Already started? We\'ll finish it. Codebase audit, bug triage, architecture cleanup, and deployment for projects that stalled — AI-generated code, freelancer handoffs, or DIY builds.',
  alternates: { canonical: '/studio/services/rescue-ship' },
  openGraph: {
    title: 'Rescue & Ship — SocioFi Studio',
    description:
      'Already started? We\'ll finish it. Codebase audit, bug triage, architecture cleanup, and deployment for projects that stalled.',
    url: '/studio/services/rescue-ship',
  },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'RESCUE & SHIP',
    headline: (
      <>
        Already Started?{' '}
        <span className="gradient-text">We&apos;ll Finish It.</span>
      </>
    ),
    description:
      "You started with AI tools or a freelancer and hit a wall. The code exists but won't deploy. Or it deploys but breaks constantly. Or the freelancer disappeared. We've seen every failure mode AI-generated code produces — and we know how to fix it.",
    buttons: [
      { label: 'Start a rescue', href: '/studio/start-project', variant: 'primary' },
      { label: 'See how it works', href: '/studio/process', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'What we find in 90% of rescues',
    headline: 'The code isn\'t broken. It\'s just unfinished.',
    description:
      "AI tools generate code fast — but they don't write error handling, security layers, or production-grade deployment configs. Freelancers disappear mid-project. DIY builds hit architecture walls. These are all fixable.",
    points: [
      'Missing error handling — code that crashes silently and gives users no feedback',
      'Security vulnerabilities — exposed credentials in Git history, SQL injection risks, no input validation',
      'No tests — fragile code that breaks when you touch any part of it',
      'Over-engineered architecture — 10 microservices where a single app would do',
      'Deployment blockers — works perfectly on localhost, fails completely in production',
    ],
  },

  capabilitiesLabel: 'What we do',
  capabilitiesTitle: 'A complete rescue, not a patch job.',
  capabilities: [
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Codebase Audit',
      description:
        'We read every file. We map the architecture, identify the failure modes, and produce a triage report before any work begins. You know exactly what you have.',
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Bug Triage & Fixing',
      description:
        'Prioritized by impact. We fix the critical path first — the things that block deployment or break the core user flow. Then secondary issues.',
    },
    {
      icon: <Gear size={22} aria-hidden="true" />,
      title: 'Architecture Cleanup',
      description:
        'Unnecessary complexity removed. Circular dependencies untangled. Proper separation of concerns established. Code you can actually maintain.',
    },
    {
      icon: <Wrench size={22} aria-hidden="true" />,
      title: 'Missing Feature Development',
      description:
        'If the previous build left features half-done or entirely missing, we complete them. New work follows the same standards as the cleanup.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Testing & QA',
      description:
        'Critical paths covered with automated tests. Manual QA pass before any deployment. You know what works before you ship it to real users.',
    },
    {
      icon: <Lock size={22} aria-hidden="true" />,
      title: 'Deployment',
      description:
        'Production infrastructure, environment configuration, CI/CD, and monitoring. The finish line — a live, stable product in the hands of real users.',
    },
  ],

  processLabel: 'The rescue process',
  processTitle: 'Audit first. Fix second. Ship third.',
  process: [
    {
      title: '01. Code audit',
      description:
        'We clone the repo and spend 1–2 days reading it completely. No assumptions, no shortcuts. We map what\'s there, what\'s broken, and what\'s missing.',
      duration: '1–2 days',
    },
    {
      title: '02. Triage report',
      description:
        'A written document: what\'s critical (blocks deployment), what\'s important (breaks features), what\'s optional (improvements). With a scope and price for fixing it all.',
      duration: '1 day',
    },
    {
      title: '03. Cleanup & fix',
      description:
        'We work through the triage list. You have repository access throughout — watch the progress in real commits, not status reports.',
      duration: '1–2 weeks',
    },
    {
      title: '04. Test & verify',
      description:
        'Automated tests on the critical path. Manual QA pass. We test against the scenarios that matter: real user flows, error states, edge cases.',
      duration: '2–3 days',
    },
    {
      title: '05. Deploy & handoff',
      description:
        'Deployed to production. Monitoring configured. Documentation written. Code and credentials transferred. 30 days post-launch support included.',
      duration: '30 days included',
    },
  ],

  caseStudy: {
    label: 'Rescue in practice',
    headline: 'An AI-generated SaaS. Six months of work. Couldn\'t deploy.',
    description:
      "A founder had 6 months of AI-assisted development and a codebase that would not pass any deployment check. We audited in 2 days, fixed the critical blockers in 10, and deployed a working product in 2 weeks.",
    result: 'Live in production — 2 weeks from audit',
    resultLabel: 'from nothing-deploys to shipped',
  },

  faqs: [
    {
      question: 'How bad can the code actually be?',
      answer:
        'Very bad. We\'ve seen private API credentials committed to public Git history. No authentication on admin routes. SQL queries built from raw user input. Broken dependencies that prevent the project from running at all. We fix it all.',
    },
    {
      question: 'Will you preserve my existing features?',
      answer:
        'Yes. The goal is to rescue, not rebuild. We keep what works and fix what doesn\'t. If a feature needs to be rebuilt to be safe or functional, we\'ll tell you explicitly and get your approval.',
    },
    {
      question: 'What if the code needs a full rewrite?',
      answer:
        'We\'ll tell you honestly after the audit. Sometimes rescuing is faster. Sometimes a targeted rewrite of the broken parts is faster. Occasionally a full rewrite is the only viable path. We\'ll quote all options so you can decide.',
    },
    {
      question: 'Is there a risk you can\'t rescue it?',
      answer:
        'Rarely. We haven\'t encountered code we couldn\'t improve significantly. If the audit reveals something truly unworkable, we\'ll tell you before charging for the fix phase — and recommend the fastest path forward.',
    },
    {
      question: 'Can this turn into ongoing support?',
      answer:
        'Only if you want it to. After the rescue, you can move to a monthly maintenance plan via SocioFi Services, or go fully independent. The code is yours either way.',
    },
  ],

  cta: {
    title: 'Ready to rescue your project?',
    subtitle:
      "Show us the codebase. We'll tell you what's wrong and what it costs to fix — before you commit to anything.",
    primaryCTA: { label: 'Start a rescue', href: '/studio/start-project' },
    ghostCTA: { label: 'See pricing', href: '/studio/pricing' },
    note: 'Free scoping call. Triage report included in proposal.',
  },
};

export default function RescueShipPage() {
  return <ServiceDetail content={content} />;
}
