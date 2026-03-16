import HubRouter, { type HubRouterContent } from '@/templates/HubRouter';
import { Rocket, Users, Building } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions — SocioFi Studio',
  description:
    'SocioFi Studio builds software for founders, small businesses, and enterprise teams. Find the right path for your situation.',
};

const content: HubRouterContent = {
  hero: {
    badge: 'Studio · Solutions',
    headline: 'Who are we building for?',
    description:
      "SocioFi Studio works with founders, SMBs, and enterprise teams. The problems are different — the commitment to quality is the same.",
    buttons: [
      { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
    ],
  },
  gridMode: 'cards',
  gridLabel: 'Choose your path',
  gridTitle: 'We build differently for different situations',
  cards: [
    {
      label: 'Founders',
      headline: "You built a prototype. We make it production-ready.",
      description:
        "The gap between 'AI can build this' and 'it actually works' is where most founders get stuck. We close that gap — fast, at a fixed price, with code you own.",
      href: '/studio/solutions/for-founders',
      cta: 'Built for founders',
      accent: '#72C4B2',
      icon: <Rocket size={22} aria-hidden="true" />,
    },
    {
      label: 'Small & medium businesses',
      headline: "Your business needs software. You don't need a dev team.",
      description:
        "Internal dashboards, customer portals, workflow automation, system integrations. We build what your business needs to operate — without the overhead of in-house engineers.",
      href: '/studio/solutions/for-smbs',
      cta: 'Built for SMBs',
      accent: '#72C4B2',
      icon: <Users size={22} aria-hidden="true" />,
    },
    {
      label: 'Enterprise teams',
      headline: "Innovation speed. Without enterprise risk.",
      description:
        "Your IT backlog is 18 months long. We act as a dedicated external team — with the compliance, security, and process rigour your organisation demands. Delivered in weeks.",
      href: '/studio/solutions/for-enterprises',
      cta: 'Built for enterprise',
      accent: '#72C4B2',
      icon: <Building size={22} aria-hidden="true" />,
    },
  ],
  flow: {
    label: 'The Studio process',
    headline: "How every project works — regardless of size",
    steps: [
      {
        title: 'Scoping call (30 min)',
        description:
          "A senior engineer reviews your situation and gives you an honest assessment. You leave knowing exactly what it would take.",
      },
      {
        title: 'Fixed proposal',
        description:
          "Deliverables, timeline, price — in writing. We don't start until you've approved the scope.",
      },
      {
        title: 'Build with visibility',
        description:
          "1-week cycles. Real progress at each checkpoint. A shared project board so you always know where things stand.",
      },
      {
        title: 'Launch and handover',
        description:
          "Deployed to production. Code, credentials, and documentation handed to you. 30 days post-launch support included.",
      },
    ],
  },
  cta: {
    title: "Not sure which path fits?",
    subtitle:
      "Tell us what you're building. We'll point you in the right direction — and give you an honest answer if we're not the right fit.",
    primaryCTA: { label: 'Start a project', href: '/studio/start-project' },
    ghostCTA: { label: 'See our work', href: '/studio/portfolio' },
    note: 'Free scoping call. No commitment.',
  },
};

export default function StudioSolutionsPage() {
  return <HubRouter content={content} />;
}
