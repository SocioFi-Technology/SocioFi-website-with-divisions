import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Target, Lock, Database, GitBranch, Layers, Gear,
} from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Architecture Consulting — SocioFi Studio',
  description:
    'Design before you build. The right architecture saves months. Written architecture review, technology recommendations, scalability analysis, and implementation roadmap. 3–5 business days, from $1,500.',
  alternates: { canonical: '/studio/services/architecture-consulting' },
  openGraph: {
    title: 'Architecture Consulting — SocioFi Studio',
    description:
      'Design before you build. The right architecture saves months. Written architecture review, technology recommendations, scalability analysis, and implementation roadmap.',
    url: '/studio/services/architecture-consulting',
  },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'ARCHITECTURE CONSULTING',
    headline: (
      <>
        Design Before{' '}
        <span className="gradient-text">You Build.</span>
      </>
    ),
    description:
      "The most expensive mistake in software is building on the wrong foundation. Before you commit to a build — or a rewrite — let our engineers review, analyze, and design the architecture that will actually hold up.",
    buttons: [
      { label: 'Book a consult', href: '/studio/start-project', variant: 'primary' },
      { label: 'See pricing', href: '/studio/pricing', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'What good architecture prevents',
    headline: 'The problems that come from skipping the architecture step.',
    description:
      "Most software projects don't fail at launch — they fail at scale. Or six months after launch when a security audit finds what was baked in from the start. These are the patterns we see repeatedly:",
    points: [
      'Rewriting the data model at 10,000 users because it was designed for 100',
      'Security vulnerabilities that were architectural, not just code bugs',
      'Database bottlenecks that can\'t be solved without a structural change',
      'Vendor lock-in that makes migration prohibitively expensive',
      'Maintenance nightmares where touching one part breaks three others',
    ],
  },

  capabilitiesLabel: 'Deliverables',
  capabilitiesTitle: 'What you receive at the end of an engagement.',
  capabilities: [
    {
      icon: <Layers size={22} aria-hidden="true" />,
      title: 'Architecture Review Report',
      description:
        'A written analysis of your current or proposed architecture. What works, what won\'t, and why. 8–15 pages with diagrams and specific recommendations.',
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Technology Recommendations',
      description:
        'A justified technology stack recommendation with reasoning. Not "use this because it\'s popular" — because it fits your scale, team, and requirements.',
    },
    {
      icon: <Database size={22} aria-hidden="true" />,
      title: 'Scalability Analysis',
      description:
        'Where does the architecture break down at 10x, 100x current load? Specific bottlenecks identified, with the structural changes required to address them.',
    },
    {
      icon: <Lock size={22} aria-hidden="true" />,
      title: 'Security Assessment',
      description:
        'Authentication flows, authorization model, data exposure surface, dependency vulnerabilities. High-risk issues prioritized with remediation steps.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Migration Strategy',
      description:
        'If you\'re considering a rewrite or platform migration, a step-by-step strategy that minimizes downtime and risk. With a clear decision on whether migration is worth it.',
    },
    {
      icon: <Gear size={22} aria-hidden="true" />,
      title: 'Implementation Roadmap',
      description:
        'A prioritized, phased plan for acting on the recommendations. What to do first, what to defer, and roughly what each phase costs in time and effort.',
    },
  ],

  processLabel: 'How consulting engagements work',
  processTitle: 'Discovery, deep review, written recommendations.',
  process: [
    {
      title: '01. Discovery call',
      description:
        'A 60-minute call with your technical lead or founder. We map what you\'re building, where you are, what decisions are already made, and what the biggest unknowns are.',
      duration: '60 minutes',
    },
    {
      title: '02. Deep review',
      description:
        'With read-only access to your codebase (or your documentation and diagrams if you prefer), we spend 2–3 days analyzing the architecture against your requirements and scale goals.',
      duration: '2–3 days',
    },
    {
      title: '03. Written recommendations',
      description:
        'A written report with diagrams, analysis, and a prioritized roadmap. Delivered within 3–5 business days of the discovery call. We walk through it together in a follow-up session.',
      duration: '1–2 days',
    },
  ],

  caseStudy: {
    label: 'Consulting in practice',
    headline: 'A $40k rewrite avoided by a $1,500 architecture review.',
    description:
      "A startup was two weeks into planning a full rewrite of their data layer. We spent 3 days reviewing the existing architecture and proposed an incremental migration path. The rewrite was unnecessary — the bottleneck was two specific query patterns.",
    result: '$40,000+ in development costs avoided',
    resultLabel: 'estimated against proposed rewrite',
  },

  faqs: [
    {
      question: 'Is this a code review?',
      answer:
        'No. It\'s an architecture and strategy review. We look at structure, not syntax. We\'re not checking if your variable names are good — we\'re checking if your data model will hold up, your security model is sound, and your tech choices fit your trajectory.',
    },
    {
      question: 'Do you need access to our code?',
      answer:
        'Read-only access to the codebase is preferred — it gives us the most accurate picture. We can also work from architectural documentation, diagrams, and a technical conversation if you prefer not to share the codebase.',
    },
    {
      question: 'Can this turn into a build?',
      answer:
        'Yes. Many architecture consulting engagements lead directly into a Product Development or Rescue & Ship engagement. The consulting report becomes the spec. You also have the option to take the report and build with your own team.',
    },
    {
      question: 'What format is the deliverable?',
      answer:
        'A written report, 8–15 pages depending on scope, with architecture diagrams, a prioritized list of findings, and an implementation roadmap. Delivered as a PDF and as a shared document for commenting.',
    },
  ],

  cta: {
    title: 'Design it right before you build it.',
    subtitle:
      "Book a discovery call. We'll assess whether an architecture review makes sense for your situation — honestly, not as a sales pitch.",
    primaryCTA: { label: 'Book a consult', href: '/studio/start-project' },
    ghostCTA: { label: 'See pricing', href: '/studio/pricing' },
    note: 'Free discovery call. Report delivered within 3–5 business days.',
  },
};

export default function ArchitectureConsultingPage() {
  return <ServiceDetail content={content} />;
}
