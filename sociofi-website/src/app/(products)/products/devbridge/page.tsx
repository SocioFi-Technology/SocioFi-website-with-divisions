import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Eye, Shield, Rocket, GitBranch, Chart, Users } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'DevBridge OS — SocioFi Products',
  description:
    "The internal development platform powering SocioFi's delivery pipeline. AI-assisted code review, deployment automation, and quality gates — being packaged as a standalone product.",
  openGraph: {
    title: 'DevBridge OS — SocioFi Products',
    description:
      "The internal development platform powering SocioFi's delivery pipeline. AI-assisted code review, deployment automation, and quality gates — being packaged as a standalone product.",
    type: 'website',
    images: ['/products/opengraph-image'],
  },
  twitter: { card: 'summary_large_image' },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Products · DevBridge OS',
    headline: (
      <>
        The platform that runs
        <br />
        <span className="gradient-text">SocioFi&apos;s delivery.</span>
      </>
    ),
    description:
      "DevBridge OS is the internal platform we built to run our own delivery pipeline. AI-assisted code review, automated deployment gates, and quality enforcement — now being packaged for teams that build like we do.",
    buttons: [
      { label: 'Register interest', href: '/products/devbridge/interest', variant: 'primary' },
      { label: 'See the roadmap', href: '/products/roadmap', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Why we built it',
    headline: 'Engineering teams waste half their time on process overhead',
    description:
      "Code review backlogs. Manual deployment checks. Inconsistent quality gates. These aren't engineering problems — they're coordination problems. DevBridge automates the coordination so engineers can focus on the code.",
    points: [
      'Code review queues block deployments for days at a time',
      'Quality standards drift as teams scale — nobody enforces the same bar',
      'Deployment pipelines are fragile, undocumented, and different per project',
      'Engineers context-switch between delivery work and process administration constantly',
      'Onboarding a new engineer to the delivery process takes weeks, not days',
    ],
  },

  capabilitiesLabel: 'Core capabilities',
  capabilitiesTitle: 'What DevBridge automates',
  capabilities: [
    {
      icon: <Eye size={24} />,
      title: 'AI Code Review',
      description:
        'Automated first-pass review on every PR. Security issues, performance antipatterns, and style violations flagged before a human reviews.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Quality Gates',
      description:
        'Configurable deployment gates enforce coverage thresholds, dependency audits, and build health — blocking bad deploys before they happen.',
    },
    {
      icon: <Rocket size={24} />,
      title: 'Deployment Automation',
      description:
        'Standardised deployment pipelines across projects. One configuration, consistent behaviour — no more per-project shell scripts.',
    },
    {
      icon: <GitBranch size={24} />,
      title: 'Branch Intelligence',
      description:
        'Tracks branch health, merge conflicts, and PR age across all active projects. Surfaces bottlenecks before they become blockers.',
    },
    {
      icon: <Chart size={24} />,
      title: 'Engineering Metrics',
      description:
        'DORA metrics, cycle time, review latency, and deployment frequency — measured automatically without instrumentation overhead.',
    },
    {
      icon: <Users size={24} />,
      title: 'Team Onboarding',
      description:
        'New engineers get a documented delivery environment from day one. Runbooks, conventions, and tools configured automatically.',
    },
  ],

  processLabel: 'Current status',
  processTitle: 'From internal tool to product',
  process: [
    {
      title: "Built for SocioFi's delivery",
      description:
        'DevBridge OS started as our internal tooling — assembled over 18 months of real delivery work across dozens of projects.',
    },
    {
      title: 'Validated at scale',
      description:
        'Every SocioFi project currently runs through DevBridge pipelines. The tooling handles 50+ active branches and 20+ concurrent projects.',
    },
    {
      title: 'Productisation in progress',
      description:
        'We\'re packaging DevBridge as a standalone product — multi-tenant support, installer, documentation, and support model.',
    },
    {
      title: 'Private beta opening soon',
      description:
        "We're selecting a small group of engineering teams to pilot DevBridge in external environments. Register your interest to be considered.",
    },
  ],

  caseStudy: {
    label: 'Internal results',
    headline: '50% reduction in deployment incidents since DevBridge deployment',
    description:
      'Since standardising all SocioFi projects on DevBridge pipelines in mid-2025, deployment incidents have dropped by 50% and average PR review time has fallen from 2.4 days to 6 hours.',
    result: '50%',
    resultLabel: 'fewer deployment incidents across all active SocioFi projects',
  },

  faqs: [
    {
      question: 'When will DevBridge be available externally?',
      answer:
        "We're targeting a private beta for external teams in Q3 2026. The beta will include a limited number of engineering teams working directly with us to validate the product outside our own environment. Register your interest to be notified and considered for the beta.",
    },
    {
      question: 'What tech stack does DevBridge support?',
      answer:
        'DevBridge currently has native support for Node.js/TypeScript and Python projects deployed to Vercel, AWS, and Fly.io. Support for Go, Rust, and additional deployment targets is planned for the beta release. The core quality gate and metrics system is language-agnostic.',
    },
    {
      question: 'Is this a CI/CD replacement?',
      answer:
        "No. DevBridge sits alongside your existing CI/CD (GitHub Actions, GitLab CI, etc.) and adds the intelligence layer — AI review, quality gates, and metrics — on top. It's not a pipeline runner; it's a delivery intelligence system that makes your existing pipeline smarter.",
    },
  ],

  cta: {
    title: 'Register interest in DevBridge OS',
    subtitle: "Private beta opening Q3 2026. We're selecting teams now.",
    primaryCTA: { label: 'Register interest', href: '/products/devbridge/interest' },
    ghostCTA: { label: 'See roadmap', href: '/products/roadmap' },
    note: "No commitment. We'll contact you when spots open.",
  },
};

export default function DevBridgePage() {
  return <ServiceDetail content={content} />;
}
