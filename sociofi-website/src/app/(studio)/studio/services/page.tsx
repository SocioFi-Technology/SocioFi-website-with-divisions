import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Code, Wrench, Zap, Rocket, Gear, GitBranch,
  Users, Layers, Database, Lock, Target, Brain,
} from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — SocioFi Studio',
  description:
    'From MVPs to full products. From automation to ongoing support. Every Studio service built with AI speed, backed by human engineering oversight.',
  alternates: { canonical: '/studio/services' },
  openGraph: {
    title: 'Services — SocioFi Studio',
    description:
      'From MVPs to full products. From automation to ongoing support. Every Studio service built with AI speed, backed by human engineering oversight.',
    url: '/studio/services',
  },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'WHAT WE BUILD',
    headline: (
      <>
        From MVPs to Full Products.{' '}
        <span className="gradient-text">From Automation to Ongoing Support.</span>
      </>
    ),
    description:
      'Every service built with AI speed, backed by human engineering oversight.',
    buttons: [
      { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
      { label: 'See pricing', href: '/studio/pricing', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Who this is for',
    headline: 'You built something. Now you need it to actually work.',
    description:
      "Whether you're starting from zero or rescuing something that stalled, SocioFi Studio covers the full build lifecycle — from first line of code to production monitoring.",
    points: [
      'Solo founders who prototyped with AI tools but can\'t get to production',
      'Teams drowning in manual processes that should be automated',
      'Businesses running on spreadsheets that outgrew them months ago',
      'Products built by a previous team that need professional oversight to continue',
    ],
  },

  capabilitiesLabel: 'Six service lines',
  capabilitiesTitle: 'Pick the one that fits where you are.',
  capabilities: [
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Product Development — from $3,000',
      description:
        'Idea to live product in weeks. Full-stack applications: SaaS platforms, customer portals, internal systems. We handle architecture, frontend, backend, database, auth, payments, and deployment. MVP in 2–3 weeks. Full product in 4–6 weeks.',
    },
    {
      icon: <Wrench size={22} aria-hidden="true" />,
      title: 'Rescue & Ship — from $2,000',
      description:
        'Already started? We\'ll finish it. Codebase audit, bug triage, architecture cleanup, missing feature development, testing, and deployment. Works for AI-generated code that won\'t deploy, freelancer projects that stalled, and DIY builds that hit a wall. 1–3 weeks.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Automation & Integration — from $2,500',
      description:
        'Connect your tools. Stop copying data manually. We build the API connections, data pipelines, and workflow automation that eliminate hours of manual work per week. 1–4 weeks.',
    },
    {
      icon: <Layers size={22} aria-hidden="true" />,
      title: 'Internal Tools — from $3,000',
      description:
        'Replace the spreadsheets your team outgrew. Custom dashboards, admin panels, and workflow tools designed around how your team actually works — not how a generic SaaS vendor thinks you should. 2–4 weeks.',
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Architecture Consulting — from $1,500',
      description:
        'Design before you build. The right architecture saves months. The wrong one costs them. We review, analyze, and produce a written roadmap — before you commit to a build or a rewrite. 3–5 business days.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Maintenance Handoff — from $2,000',
      description:
        'We\'ll take over from here. Codebase audit, documentation, monitoring setup, security scan, dependency updates, and transition to a professional maintenance plan. 1–2 weeks for the audit, then ongoing via SocioFi Services.',
    },
  ],

  processLabel: 'How every project works',
  processTitle: 'Same process across all six service lines.',
  process: [
    {
      title: 'Free scoping call',
      description:
        'A 30-minute conversation with a real engineer. You describe the situation. We tell you honestly which service fits, what it takes, and what it costs.',
      duration: '30 minutes',
    },
    {
      title: 'Fixed proposal',
      description:
        'Deliverables, timeline, and price in writing. Nothing starts until you\'ve approved it. No scope creep, no surprise invoices.',
      duration: '2–3 days',
    },
    {
      title: 'Build with visibility',
      description:
        'Weekly check-ins, shared progress board, direct engineer access. You see real progress — not status slides.',
      duration: '1–6 weeks',
    },
    {
      title: 'Launch and handover',
      description:
        'Deployed to production. Code, credentials, and documentation transferred to you. 30 days post-launch support included.',
      duration: '30 days included',
    },
  ],

  faqs: [
    {
      question: 'Which service should I choose?',
      answer:
        'Most clients figure this out in the free call. But a quick rule: if you have an idea and no code, that\'s Product Development. If you have code that doesn\'t work, that\'s Rescue & Ship. If your team does repetitive manual work, that\'s Automation. If you\'re running on spreadsheets, that\'s Internal Tools. If you\'re about to build something big, start with Architecture Consulting.',
    },
    {
      question: 'Can I combine services?',
      answer:
        'Yes. A common path: Architecture Consulting → Product Development → Maintenance Handoff. We scope each phase separately so you only commit to what you\'ve approved.',
    },
    {
      question: 'What does the timeline actually depend on?',
      answer:
        'Scope complexity, third-party API dependencies, and your review turnaround. We\'ll give you a specific estimate in the proposal — not a range. If anything changes the timeline, you hear about it immediately.',
    },
    {
      question: 'What if I need ongoing support after the project?',
      answer:
        'The Maintenance Handoff service transitions your product to SocioFi Services — our division built for ongoing monthly maintenance. Or you can go fully independent. The code is yours either way.',
    },
    {
      question: 'Is there a minimum project size?',
      answer:
        'Architecture Consulting starts at $1,500 for a 3–5 day engagement. All other services start at $2,000. If your scope is smaller, we\'ll tell you honestly in the call.',
    },
  ],

  cta: {
    title: 'Not sure which service fits?',
    subtitle:
      'Most clients start with a conversation, not a service page. Book a free 30-minute call — we\'ll figure it out together.',
    primaryCTA: { label: 'Book a free 30-minute call', href: '/studio/start-project' },
    ghostCTA: { label: 'See our work', href: '/studio/portfolio' },
    note: 'Free scoping call. Proposal within 2–3 days. No commitment.',
  },
};

export default function StudioServicesPage() {
  return <ServiceDetail content={content} />;
}
