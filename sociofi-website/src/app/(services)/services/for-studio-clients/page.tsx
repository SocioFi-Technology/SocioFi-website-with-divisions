import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Code, GitBranch, Shield } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Studio Clients — SocioFi Services',
  description:
    'Built with SocioFi Studio? Seamless transition to ongoing maintenance. No re-onboarding. The engineer who built it maintains it.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Services · Studio Clients',
    headline: (
      <>
        You Built It With Studio.{' '}
        <span className="gradient-text">We Keep It Running.</span>
      </>
    ),
    description:
      "Every SocioFi Studio project ships with a 30-day post-launch support window. After that, you can move to a monthly Services plan — or go fully independent. The code is yours either way.",
    buttons: [
      { label: 'See Services plans', href: '/services/plans', variant: 'primary' },
      { label: 'How it works', href: '/services/how-it-works', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The handoff problem',
    headline: 'Most agencies hand over code and disappear.',
    description:
      'You get the repository, the deployment docs, and a good luck. What you do not get is someone who knows the codebase, understands the architecture decisions, and can fix things when they break. We do not do that.',
    points: [
      'New engineers take weeks to understand an unfamiliar codebase',
      'Architecture decisions made during the build are undocumented',
      'The first incident after handoff takes 3x longer to fix than it should',
      'Dependencies start aging from day one of launch',
    ],
  },

  capabilitiesLabel: 'Why Studio clients are different',
  capabilitiesTitle: 'We already know your codebase.',
  capabilities: [
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'No onboarding cold start',
      description:
        'We built it. We know every architectural decision, every third-party integration, every edge case we worked around. When something breaks, we do not spend 4 hours reading the codebase — we already know where to look.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Continuity of decisions',
      description:
        'The engineer who built your product can maintain it. No knowledge transfer, no tribal knowledge locked in a head, no questions about why things were built a certain way. The reasoning behind every decision is available to the team maintaining it.',
    },
    {
      icon: <Shield size={22} aria-hidden="true" />,
      title: 'Built to our standards, maintained to our standards',
      description:
        'We built your codebase with monitoring hooks, structured error handling, and deployment automation in place. Maintenance is easier because we built with maintenance in mind — not as an afterthought.',
    },
  ],

  processLabel: 'The Studio to Services handoff',
  processTitle: 'Day 31 and beyond.',
  process: [
    {
      title: '01. 30-day window ends',
      description:
        'Your SocioFi Studio project includes 30 days of post-launch bug fixes at no charge. On day 30, you decide: move to a Services plan, go independent, or extend the support window.',
      duration: 'Day 30',
    },
    {
      title: '02. Services plan selection',
      description:
        'If you continue with Services, we confirm your plan — Essential, Professional, or Enterprise — and switch from project-mode to maintenance-mode. No new onboarding required. Monitoring is already active.',
      duration: '1 hour',
    },
    {
      title: '03. Seamless continuation',
      description:
        'The repository, the deployment pipeline, the monitoring setup — all carry over. Your Services engineer is the same team that built the product. Nothing changes except the billing model.',
      duration: 'Immediate',
    },
    {
      title: '04. Ongoing maintenance',
      description:
        'Monthly security patches, bug fixes per your plan allocation, and feature development if you are on Professional or Enterprise. Monthly reports track everything we do.',
      duration: 'Monthly',
    },
  ],

  caseStudy: {
    label: 'Studio to Services in practice',
    headline: 'From Studio handoff to 12 months of active maintenance.',
    description:
      'A founder who built their SaaS with SocioFi Studio moved to a Professional Services plan at day 31. Over the next 12 months: 4 critical patches applied, 28 bugs fixed, 11 feature additions scoped and shipped. The same lead engineer who built the product maintained it throughout.',
    result: '99.97% uptime over 12 months.',
    resultLabel: 'Production reliability',
  },

  faqs: [
    {
      question: 'Do Studio clients get a discount on Services?',
      answer:
        'Studio clients get priority onboarding — we are already set up, so the 48-hour baseline period is usually much faster. Pricing is the same as standard Services plans. The advantage is continuity, not a price cut.',
    },
    {
      question: 'What if I want to move to my own engineering team?',
      answer:
        'That is completely fine — that is why the code is yours. When you are ready to bring the product in-house, we produce a comprehensive handover: codebase documentation, architecture decision records, deployment runbooks, and a walkthrough session with your new team. We make sure the transition is smooth.',
    },
    {
      question: 'Can I skip the 30-day window and start Services immediately?',
      answer:
        'Yes. If you know you want ongoing maintenance from launch, we can switch to a Services plan on launch day. The 30-day post-launch bug fixes are folded into your first month. You do not pay twice for the same period of coverage.',
    },
  ],

  cta: {
    title: 'Built with Studio. Ready for Services.',
    subtitle:
      'Seamless transition from project mode to ongoing maintenance. No re-onboarding. No cold start.',
    primaryCTA: { label: 'See Services plans', href: '/services/plans' },
    ghostCTA: { label: 'How it works', href: '/services/how-it-works' },
    note: 'Priority onboarding for all Studio clients.',
  },
};

export default function ForStudioClientsPage() {
  return <ServiceDetail content={content} />;
}
