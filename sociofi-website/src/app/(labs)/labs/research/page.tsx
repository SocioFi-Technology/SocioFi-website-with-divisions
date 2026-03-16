import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Brain, Zap, Code, Target } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Areas — SocioFi Labs',
  description:
    'Four active research streams: agent architecture, applied AI, developer tooling, and industry automation. Findings published openly.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Labs · Research',
    headline: (
      <>
        Four streams.{' '}
        <span className="gradient-text">One direction.</span>
      </>
    ),
    description:
      'Our research is not academic — it is grounded in real engineering problems we encounter building AI-native software. We publish what works, what does not, and why the distinction matters.',
    buttons: [
      { label: 'Latest articles', href: '/labs/blog', variant: 'primary' },
      { label: 'Active projects', href: '/labs/projects', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Why we publish',
    headline: 'Most AI research is too theoretical to apply.',
    description:
      'Academic papers are optimised for citations. Vendor blogs are optimised for sales. We optimise for utility — what can an engineer actually use on Monday morning?',
    points: [
      'Benchmarks that do not reflect production conditions mislead practitioners',
      'Failure modes are rarely documented — only successes get published',
      'Most "AI for software" content skips the engineering detail that makes it actually work',
      'The gap between research prototype and production system is rarely bridged in public writing',
    ],
  },

  capabilitiesLabel: 'Research streams',
  capabilitiesTitle: 'What we are working on.',
  capabilities: [
    {
      icon: <Brain size={22} aria-hidden="true" />,
      title: 'Agent Architecture',
      description:
        'How to build AI agents that are reliable, observable, and composable in production. Multi-agent coordination patterns, tool use reliability, memory and context management, and failure recovery without human intervention.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Applied AI',
      description:
        'Practical AI integration inside real software systems. Document intelligence pipelines, structured output extraction from unstructured inputs, semantic search with retrieval-augmented generation, and autonomous workflow execution.',
    },
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Developer Tooling',
      description:
        'Tools that make AI-native development faster and safer. Automated code review, targeted test generation, context-aware scaffolding, and deployment systems that understand what changed and why it matters.',
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Industry Automation',
      description:
        'Deep domain research in specific verticals: fintech compliance automation, legal document processing, logistics operations intelligence, and healthcare workflow orchestration. We pick hard problems in specific industries and publish the findings.',
    },
  ],

  processLabel: 'How we research',
  processTitle: 'Problem first. Publish always.',
  process: [
    {
      title: '01. Problem selection',
      description:
        'We pick problems we have actually hit — either in Studio projects or in our own internal tooling. If we needed to solve it, someone else probably does too.',
      duration: 'Ongoing',
    },
    {
      title: '02. Prototype and measure',
      description:
        'We build the smallest thing that tests our hypothesis. We measure it against real workloads, not synthetic benchmarks. We document both what works and what fails.',
      duration: '2–6 weeks',
    },
    {
      title: '03. Publish findings',
      description:
        'Results go on the Labs blog — methodology, measurements, and honest assessment. If it failed, we say so and explain why. If it worked, we explain what made it work.',
      duration: '1 week',
    },
    {
      title: '04. Open-source or productise',
      description:
        'Tools with broad applicability go open-source. Research that validates a product idea feeds into the Products division. Research that is too specific stays as published findings.',
      duration: 'Per output',
    },
  ],

  caseStudy: {
    label: 'Research to product',
    headline: 'Agent architecture research became NEXUS ARIA.',
    description:
      'Our multi-agent coordination research started as an internal experiment: could we build a reliable orchestration layer without custom infrastructure? After six months of prototyping, we had something worth productising. NEXUS ARIA is the result.',
    result: '3 products emerged from Labs research.',
    resultLabel: 'Labs → Products pipeline',
    href: '/labs/projects',
  },

  faqs: [
    {
      question: 'Can I collaborate on Labs research?',
      answer:
        'Yes — we occasionally bring in external engineers for specific research problems. If you are working on something in one of our research streams and want to collaborate, reach out via the Labs blog or contact page. We prefer collaborations that produce publishable findings.',
    },
    {
      question: 'How do you decide what to open-source?',
      answer:
        'If we built a tool to solve our own problem and it is not specific to our internal infrastructure, it goes open-source. We prioritise libraries and tooling over application code. Everything we release includes documentation and a working example.',
    },
    {
      question: 'Do you take on sponsored research?',
      answer:
        'Occasionally. Sponsored research must produce publishable findings — we do not do private-only research. The sponsor gets early access to findings and an acknowledgement in the publication. Independence of conclusions is non-negotiable.',
    },
  ],

  cta: {
    title: 'Follow the research.',
    subtitle: 'New findings, open-source releases, and technical deep dives on the Labs blog.',
    primaryCTA: { label: 'Read the blog', href: '/labs/blog' },
    ghostCTA: { label: 'Browse open source', href: '/labs/open-source' },
    note: 'Published when it is ready. No filler content.',
  },
};

export default function LabsResearchPage() {
  return <ServiceDetail content={content} />;
}
