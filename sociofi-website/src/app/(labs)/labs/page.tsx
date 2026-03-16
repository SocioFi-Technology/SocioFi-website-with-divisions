import DivisionOverview, { type DivisionOverviewContent } from '@/templates/DivisionOverview';
import ParticleField from '@/components/visual/ParticleField';
import { Brain, Code, Zap, Target, GitBranch, Globe } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SocioFi Labs — Research & Experimentation',
  description:
    'Where we push the boundaries of AI-native development. Research into agent architecture, applied AI, developer tooling, and industry automation.',
};

const content: DivisionOverviewContent = {
  hero: {
    badge: 'Labs · Research & Experimentation',
    headline: (
      <>
        Where We Push{' '}
        <span className="gradient-text">the Boundaries.</span>
      </>
    ),
    description:
      'SocioFi Labs is our R&D arm. We research what is coming, build experimental systems before they are mainstream, publish what we learn, and release tools the wider community can use.',
    buttons: [
      { label: 'Research areas', href: '/labs/research', variant: 'primary' },
      { label: 'Open source', href: '/labs/open-source', variant: 'ghost' },
    ],
    rightContent: (
      <div style={{ height: 400, borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <ParticleField color="#7B6FE8" count={80} speed={0.35} connectDist={120} />
      </div>
    ),
  },

  metrics: [
    { numeric: 4, label: 'Active research streams' },
    { numeric: 12, suffix: '+', label: 'Open-source repos' },
    { numeric: 3, label: 'Products spawned from Labs' },
    { numeric: 100, suffix: '+', label: 'Technical articles' },
  ],

  servicesLabel: 'Research streams',
  servicesTitle: 'Four areas. One question: what is next?',
  services: [
    {
      icon: <Brain size={22} aria-hidden="true" />,
      title: 'Agent Architecture',
      description:
        'How do you build AI agents that are reliable, observable, and composable? We research multi-agent coordination, tool use, memory systems, and failure recovery in production contexts.',
      href: '/labs/research/agent-architecture',
      linkText: 'Read research',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Applied AI',
      description:
        'Not what AI can theoretically do — what it can practically do inside real software. Document intelligence, structured output extraction, semantic search, and autonomous workflow execution.',
      href: '/labs/research/applied-ai',
      linkText: 'Read research',
    },
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Developer Tooling',
      description:
        'Tools that make AI-native development faster, safer, and more reproducible. Code review automation, test generation, context-aware scaffolding, and deployment intelligence.',
      href: '/labs/research/developer-tooling',
      linkText: 'Read research',
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Industry Automation',
      description:
        'Where AI meets specific industries: fintech compliance, legal document processing, operations orchestration, and supply chain intelligence. We pick hard problems and publish what we find.',
      href: '/labs/research/industry-automation',
      linkText: 'Read research',
    },
  ],

  featuresLabel: 'What Labs produces',
  featuresTitle: 'Research that ships.',
  features: [
    {
      icon: <Globe size={22} aria-hidden="true" />,
      title: 'Published research',
      description:
        'Every research stream produces written findings — methodology, results, and honest assessments of what did not work. We publish to the Labs blog and share with the broader community.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Open-source releases',
      description:
        'Tools and libraries that come out of our research go open-source. If we built something useful to solve our own problems, it is likely useful to others.',
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Products',
      description:
        'The most successful experiments become SocioFi products. NEXUS ARIA, DevBridge, and FabricxAI all started as Labs research projects before becoming products.',
    },
  ],

  featured: {
    label: 'Current project',
    headline: 'NEXUS ARIA — Multi-agent operations platform.',
    description:
      'NEXUS ARIA emerged from our research into multi-agent coordination. It started as an experiment: could we build a reliable orchestration layer for AI agents that handles tool use, retries, and observability without requiring custom infrastructure for every deployment? The answer is shipping.',
    href: '/labs/projects',
    cta: 'See active projects',
  },

  testimonials: [
    {
      quote:
        'The Labs blog is the most technically honest writing about AI development I have found. They publish failures as often as successes. That is rare.',
      author: 'Ravi S.',
      role: 'Staff Engineer',
      company: 'FieldOps',
    },
    {
      quote:
        'We adopted their open-source context routing library six months ago. Saved us three weeks of work and the documentation is exceptional.',
      author: 'Mei L.',
      role: 'AI Platform Lead',
      company: 'Logibridge',
    },
  ],

  cta: {
    title: 'Follow the research.',
    subtitle:
      'Subscribe to the Labs newsletter for new findings, open-source releases, and technical deep dives — published when there is something worth saying.',
    primaryCTA: { label: 'Read the blog', href: '/labs/blog' },
    ghostCTA: { label: 'Browse open source', href: '/labs/open-source' },
    note: 'No cadence commitment. Published when it is ready.',
  },
};

export default function LabsPage() {
  return <DivisionOverview content={content} />;
}
