import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Code, GitBranch, Rocket } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "How We Build — SocioFi Studio",
  description:
    "Here's exactly what happens when you work with SocioFi Studio. A clear 5-step process from free call to ongoing support — no surprises, no ambiguity.",
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Studio · Process',
    headline: (
      <>
        Here is Exactly What Happens{' '}
        <span className="gradient-text">When You Work With Us.</span>
      </>
    ),
    description:
      "Most agencies are vague about how they work until you have signed. We are not. This is the exact sequence of every Studio project — from first call to live product in your hands.",
    buttons: [
      { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
      { label: 'See pricing', href: '/studio/pricing', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Our commitments to you',
    headline: 'You own everything. We explain everything.',
    description:
      "Four things that never change, regardless of project size or complexity.",
    points: [
      'Full code ownership transferred on delivery — no lock-in, no hostage code',
      'Plain English throughout — no jargon, no technical smoke and mirrors',
      'Cancel after the proposal with no penalty — nothing starts until you say go',
      'Your data stays yours — no third-party access, NDA available on request',
    ],
  },

  capabilitiesLabel: 'How long will it take?',
  capabilitiesTitle: 'Timeline depends on scope — not on us.',
  capabilities: [
    {
      icon: <Rocket size={22} aria-hidden="true" />,
      title: 'Simple MVP — 1 to 2 weeks',
      description:
        "A focused product with one core workflow: auth, one main feature, deployed. Ideal for idea validation before investing in a full build. Examples: landing page with waitlist, basic SaaS prototype, simple booking tool.",
    },
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Standard product — 2 to 4 weeks',
      description:
        "A complete product with multiple user flows, third-party integrations, and a production-ready deployment. Examples: full SaaS MVP, internal dashboard, customer-facing portal with payments.",
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Complex system — 4 to 8 weeks',
      description:
        "Multi-tenant architecture, advanced data models, AI features, or high-volume infrastructure. Examples: multi-tenant SaaS, AI-powered document processing, large-scale data pipeline with custom analytics.",
    },
  ],

  processLabel: 'The 5 steps',
  processTitle: 'Free call to live product.',

  process: [
    {
      title: '01. Free call',
      description:
        "A 30-minute conversation with a real engineer. You tell us what you are building and where you are stuck. We tell you honestly whether we are a good fit and what it might cost. No sales pitch.",
      duration: '30 minutes',
    },
    {
      title: '02. Proposal and plan',
      description:
        "Within 2–3 days of the call: a written proposal with a specific scope, specific price, and specific timeline. Not ranges. You review it, ask questions, revise it with us. Nothing starts until you approve it in writing.",
      duration: '2–3 days',
    },
    {
      title: '03. Build phase',
      description:
        "Work begins. You have repository access from day one — watch commits as they happen. We push to a staging environment weekly so you can see real progress, not status slides. Your lead engineer is directly reachable.",
      duration: '1–4 weeks',
    },
    {
      title: '04. Review and launch',
      description:
        "When the build matches the agreed spec, we walk through the product together. You test it. We document it. Source code, deployment docs, and everything you need to run it independently — all transferred to you.",
      duration: '1 week',
    },
    {
      title: '05. Ongoing support',
      description:
        "Every project includes 30 days of post-launch bug fixes at no extra charge. After that, you can move to a monthly maintenance plan or go fully independent. The code is yours either way.",
      duration: '30 days included',
    },
  ],

  caseStudy: {
    label: 'Process in practice',
    headline: 'Free call on Monday. Proposal by Wednesday. Live in 6 weeks.',
    description:
      "A founder had a prototype with no auth, no payments, and crashed under load. We took the call on Monday, sent the proposal on Wednesday, started the following Monday, and launched to real users six weeks later.",
    result: '10,000 active users within 12 weeks. Zero critical post-launch bugs.',
    resultLabel: 'The outcome',
    href: '/studio/portfolio/rescue-to-launch',
  },

  faqs: [
    {
      question: 'How do you hit fast timelines without cutting corners?',
      answer:
        "AI tooling generates components, tests, and boilerplate at speed — what used to take four weeks of human writing now takes one. But every piece of AI-generated code passes through a senior engineer before it enters the codebase. We catch architectural mistakes, security issues, and edge cases that AI misses. Fast output, human quality.",
    },
    {
      question: 'Is the code you deliver production-ready?',
      answer:
        "Yes. We deploy to real infrastructure with error monitoring, automated update pipelines, and security hardening from day one. AI-generated prototypes break in production. The code we hand over does not. You receive a fully deployed application, not a local prototype that still needs DevOps work.",
    },
    {
      question: 'What happens if my requirements change mid-project?',
      answer:
        "Scope changes are handled in writing. We assess the impact on timeline and price, tell you the number, and get your approval before we do anything. No surprise invoices — ever. Small changes within original scope are absorbed where possible.",
    },
    {
      question: 'How often will I hear from you during the build?',
      answer:
        "Weekly written updates at minimum — what was completed, what is next, anything that needs your input. You also have direct repository access so you can see commits as they happen. If anything changes on timeline or scope, we tell you immediately.",
    },
    {
      question: 'Can I talk to a real engineer, not a project manager?',
      answer:
        "Yes. You work directly with your lead engineer throughout. No account manager layer. The person writing your code is the person answering your questions.",
    },
    {
      question: 'What does code ownership mean exactly?',
      answer:
        "The source code, repository, and all intellectual property transfer to you on delivery. We retain no rights to your product. You can hand the code to any other team, open-source it, sell it — it is entirely yours.",
    },
    {
      question: 'Is there an NDA available?',
      answer:
        "Yes. We sign NDAs for any project that involves sensitive business logic, proprietary data, or confidential product plans. Just mention it during the free call and we will include it before any project details are shared.",
    },
  ],

  cta: {
    title: 'Ready to start?',
    subtitle:
      "Book the free call. It takes 30 minutes and you will leave knowing exactly what your project costs and how long it takes.",
    primaryCTA: { label: 'Book a free call', href: '/studio/start-project' },
    ghostCTA: { label: 'See pricing', href: '/studio/pricing' },
    note: 'Free 30-minute call. Proposal within 2–3 days. No commitment.',
  },
};

export default function StudioProcessPage() {
  return <ServiceDetail content={content} />;
}
