import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Brain, Layers, Zap, Shield, GitBranch, Target } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'AI Agent Systems — SocioFi Studio',
  description:
    'Custom AI agent pipelines built for your business. Multi-agent workflows that handle perception, reasoning, action, and coordination — deployed to production, not just demoed.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Studio · AI Agent Systems',
    headline: (
      <>
        Agent pipelines that{' '}
        <span className="gradient-text">actually ship.</span>
      </>
    ),
    description:
      "You've seen AI demos. You want an agent system that runs your real workflows in production — with proper architecture, error handling, monitoring, and a human escalation path when needed.",
    buttons: [
      { label: 'Start a project', href: '/studio/start-project', variant: 'primary' },
      { label: 'See how AaaS works', href: '/aaas', variant: 'ghost' },
    ],
  },
  problem: {
    label: 'The gap',
    headline: 'Most AI demos never become real systems.',
    description:
      "A prototype that works in a notebook is not an agent system. Real production agents need architecture that handles failures, data pipelines that don't break, monitoring that catches drift, and handoff points where humans stay in control. That's the gap most teams can't cross.",
    points: [
      'Prompt chaining is not an agent architecture — it falls apart at scale and under edge cases',
      'LLM calls without observability mean you cannot debug failures when they happen',
      'No human-in-the-loop design means agents make expensive mistakes with no recovery',
      'Building without orchestration means agents compete for resources and produce inconsistent results',
    ],
  },
  capabilities: [
    {
      icon: <Brain size={22} aria-hidden="true" />,
      title: 'Multi-agent pipeline architecture',
      description:
        'We design coordinated agent systems where specialized agents handle perception, classification, reasoning, action, and escalation — each with clear responsibilities and handoff protocols.',
    },
    {
      icon: <Layers size={22} aria-hidden="true" />,
      title: 'Workflow automation end-to-end',
      description:
        'From data ingestion through to output delivery — we build the full pipeline, not just the AI layer. Your workflows run without human intervention for routine cases.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Real-time action and integration',
      description:
        'Agents that connect to your actual systems: CRMs, databases, APIs, communication tools. They read, decide, write, and notify — in your environment, not a sandbox.',
    },
    {
      icon: <Shield size={22} aria-hidden="true" />,
      title: 'Human-in-the-loop design',
      description:
        'Every agent system includes explicit escalation paths. Agents handle the routine; humans handle the exceptions. We design where that line is — and how it stays reliable.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Orchestration and state management',
      description:
        'Multi-step workflows with memory, retry logic, parallel execution, and consistent state across agent hops. Built on proven orchestration patterns — not ad-hoc prompt chains.',
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Observability and monitoring',
      description:
        'Every agent decision is logged. Every API call is traced. Dashboards that show you what agents are doing, where they fail, and how performance changes over time.',
    },
  ],
  process: [
    {
      title: 'Workflow discovery',
      description:
        'We map your actual workflows — where humans spend time, where decisions are repetitive, where data moves between systems. These are your agent candidates.',
      duration: 'Week 1',
    },
    {
      title: 'Agent architecture design',
      description:
        'Our engineers define agent roles, data flows, decision logic, orchestration strategy, error handling, and human escalation points. Nothing is left to prompt engineering.',
      duration: 'Week 2',
    },
    {
      title: 'Build against real data',
      description:
        'We build and test with your actual data sources — not mock data. Edge cases get handled in staging before anything goes live.',
      duration: 'Weeks 3–6',
    },
    {
      title: 'Staged deployment',
      description:
        'Agents go live gradually — starting with low-risk workflows and expanding as confidence is established. Full observability from day one.',
      duration: 'Week 7',
    },
    {
      title: 'Ongoing operation',
      description:
        'SocioFi Services monitors your agent system, catches performance drift, applies updates, and handles any issues that arise. You focus on the outputs, not the infrastructure.',
      duration: 'Ongoing',
    },
  ],
  processLabel: 'Our approach',
  processTitle: 'How we build agent systems',
  caseStudy: {
    label: 'In practice',
    headline: 'FabricxAI: 22 agents, zero routine human work',
    description:
      'FabricxAI is our own workflow automation platform. It runs 22 coordinated agents handling data ingestion, classification, priority routing, transformation, approval workflows, and reporting. Routine work runs without human intervention. Exceptions escalate to the right person, with full context.',
    result: '82% reduction in manual processing — 10× faster cycle time — 22 agents in production',
    resultLabel: 'Production outcomes',
    href: '/products/fabricxai',
  },
  cta: {
    title: 'Ready to build your agent system?',
    subtitle:
      "Book a free call. We'll map your workflows, identify the right agent candidates, and show you what a production system looks like.",
    primaryCTA: { label: 'Start a Project', href: '/studio/start-project' },
    ghostCTA: { label: 'Learn about AaaS', href: '/aaas' },
    note: 'No obligation. Response within 24 hours.',
  },
  faqs: [
    {
      question: 'How is this different from using an AI tool like Zapier or Make?',
      answer: "Tools like Zapier run rules-based automation — if X, then Y. Agent systems make decisions, handle ambiguity, adapt to context, and coordinate across multiple steps. They're fundamentally different in capability and architecture.",
    },
    {
      question: 'Do I need existing software infrastructure for an agent system?',
      answer: "Not necessarily. We can build on top of your existing systems, or help you set up the infrastructure needed. We've built agent systems that connect to spreadsheets, databases, CRMs, APIs, email, and custom internal tools.",
    },
    {
      question: 'How do you ensure agents don\'t make expensive mistakes?',
      answer: 'Every system we build includes human-in-the-loop checkpoints for high-stakes decisions, confidence thresholds that trigger escalation, comprehensive logging, and staged rollout. Agents operate within defined boundaries.',
    },
    {
      question: 'What does ongoing maintenance look like?',
      answer: 'Agent systems need monitoring and tuning — model behavior can drift, APIs change, and edge cases appear over time. SocioFi Services handles this as an ongoing retainer so your system stays reliable.',
    },
    {
      question: 'How long does it take to build an agent system?',
      answer: 'A focused single-workflow agent system can go from discovery to production in 4-8 weeks. Complex multi-agent pipelines handling diverse workflows typically take 3-4 months. We work in phases so you see working agents early.',
    },
  ],
};

export default function AIAgentSystemsPage() {
  return <ServiceDetail content={content} />;
}
