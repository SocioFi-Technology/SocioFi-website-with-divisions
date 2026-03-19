import DivisionOverview, { type DivisionOverviewContent } from '@/templates/DivisionOverview';
import StudioHeroVisual from '@/components/visual/StudioHeroVisual';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SocioFi Studio — Custom Software Development',
  description:
    'AI agents build. Human engineers architect. You ship. Custom software development — from prototype to production, fixed scope, fixed price.',
};

const content: DivisionOverviewContent = {
  hero: {
    badge: 'SOCIOFI STUDIO',
    headline: (
      <>
        AI Agents Build. Human Engineers Architect.{' '}
        <span className="gradient-text">You Ship.</span>
      </>
    ),
    description:
      'You know what you want to build. You know AI can build it. What you need is a team that makes sure it actually works — architecturally sound, securely deployed, and running when real users show up.',
    buttons: [
      { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
      { label: 'See our work', href: '/studio/portfolio', variant: 'ghost' },
    ],
    rightContent: <StudioHeroVisual />,
  },

  metrics: [
    { label: 'Projects shipped', numeric: 50, suffix: '+' },
    { label: 'Average weeks to launch', numeric: 4, suffix: '' },
    { label: 'Post-launch critical bugs', numeric: 0, suffix: '' },
    { label: 'Code ownership transfer', numeric: 100, suffix: '%' },
  ],

  servicesLabel: 'What we do',
  servicesTitle: 'Six ways we build your software',
  services: [
    {
      title: 'Product Development',
      description:
        'From idea to scaled product. Full-stack applications, mobile apps, SaaS products — built with proper architecture, deployed to real infrastructure.',
      href: '/studio/services/product-development',
      linkText: 'Learn more',
    },
    {
      title: 'Rescue & Ship',
      description:
        'Already started with AI tools and hit a wall? We audit what you have, fix what is broken, and get you to launch — usually in 2–4 weeks.',
      href: '/studio/services/rescue-ship',
      linkText: 'Learn more',
    },
    {
      title: 'Automation & Integration',
      description:
        'Stop doing manually what software can do. We connect your tools, automate your workflows, and build the integrations that give your team their time back.',
      href: '/studio/services/automation-integration',
      linkText: 'Learn more',
    },
    {
      title: 'Internal Tools',
      description:
        'The dashboard your team actually needs. Custom internal software designed around how your business works — not a generic template.',
      href: '/studio/services/internal-tools',
      linkText: 'Learn more',
    },
    {
      title: 'Architecture Consulting',
      description:
        'Get the architecture right before you build. Technical review and written recommendations from senior engineers — in one week.',
      href: '/studio/services/architecture-consulting',
      linkText: 'Learn more',
    },
    {
      title: 'Maintenance & Support',
      description:
        'Your product is live. Now keep it that way. Ongoing engineering support so your product stays running, secure, and improving.',
      href: '/studio/services/maintenance-support',
      linkText: 'Learn more',
    },
  ],

  featuresLabel: 'Why Studio',
  featuresTitle: 'Built differently from day one',
  features: [
    {
      title: 'AI builds, engineers review',
      description:
        "Every line of code goes through our engineering review process. AI handles the output volume; humans handle the quality. Fast timelines without the bugs.",
    },
    {
      title: 'Fixed scope, fixed price',
      description:
        "We scope your project carefully before writing a single line of code. You know exactly what you're getting, when you're getting it, and what it costs.",
    },
    {
      title: 'You own everything',
      description:
        'Source code, IP, repositories — all transferred to you on delivery. No vendor lock-in, no hostage code. Your product is yours to keep.',
    },
    {
      title: 'Production-ready from the start',
      description:
        'We deploy to real infrastructure — not a localhost demo. Automatic update pipelines, error monitoring, security hardening. All included.',
    },
    {
      title: 'Clear communication',
      description:
        'Weekly check-ins, a shared project board, and a direct line to your lead engineer. You always know exactly where your project stands.',
    },
    {
      title: 'Post-launch support',
      description:
        'Every project includes 30 days of post-launch support. Something breaks after go-live? We fix it — no extra charge.',
    },
  ],

  featured: {
    label: 'Case study',
    headline: 'From broken prototype to 10,000 active users in 8 weeks',
    description:
      "A founder had a working demo built with an AI coding platform — but it crashed under load, had no authentication, and couldn't connect to Stripe. We rebuilt the architecture, added proper auth and payments, deployed to managed infrastructure, and launched. Eight weeks later: 10,000 users.",
    cta: 'Read the full story',
    href: '/studio/portfolio/rescue-to-launch',
  },

  testimonials: [
    {
      quote:
        "I had a working demo but it wasn't production-ready. SocioFi took what I built and made it real. We launched in 6 weeks and I haven't had a single critical bug since.",
      author: 'Marcus T.',
      role: 'Founder',
      company: 'BuildFlow',
    },
    {
      quote:
        'Fixed scope, fixed price — no surprises. They scoped the project clearly, hit every milestone, and the code they delivered is clean enough that I can hand it to another team.',
      author: 'Layla A.',
      role: 'Head of Product',
      company: 'DataNest',
    },
    {
      quote:
        'We had three developers leave mid-project and a deadline in 4 weeks. SocioFi stepped in, understood the codebase overnight, and shipped on time. Genuinely impressive.',
      author: 'Dominic F.',
      role: 'CTO',
      company: 'ShiftOps',
    },
  ],

  cta: {
    title: "Ready to build something that lasts?",
    subtitle:
      "Tell us what you're building. We'll tell you what it takes, what it costs, and when we can ship it.",
    primaryCTA: { label: 'Start a Project', href: '/studio/start-project' },
    ghostCTA: { label: 'Browse our work', href: '/studio/portfolio' },
    note: 'Free scoping call. No commitment.',
  },
  divisionVariant: 'studio',
};

export default function StudioPage() {
  return <DivisionOverview content={content} />;
}
