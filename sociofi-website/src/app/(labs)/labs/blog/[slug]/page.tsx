import BlogPost, { type BlogPostContent } from '@/templates/BlogPost';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ── Static blog entries ──────────────────────────────────────────────────────

const posts: Record<string, BlogPostContent> = {
  'why-ai-generated-code-breaks-in-production': {
    title: 'Why AI-Generated Code Breaks in Production (And How to Prevent It)',
    date: '2026-03-10',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Engineering',
    readTime: '14 min read',
    lead:
      'AI coding tools generate code that passes tests and looks correct in development. Then it hits production and breaks in ways the tests never covered. After auditing dozens of AI-generated codebases, we have identified the failure patterns — and the review practices that catch them before they ship.',
    related: [
      {
        title: 'How We Review AI-Generated Code Before It Ships',
        category: 'Developer Tooling',
        date: '2026-01-15',
        readTime: '10 min read',
        href: '/labs/blog/how-we-review-ai-generated-code',
      },
      {
        title: 'Building Multi-Agent Systems That Actually Work',
        category: 'Agent Architecture',
        date: '2026-02-28',
        readTime: '16 min read',
        href: '/labs/blog/building-multi-agent-systems-that-actually-work',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'building-multi-agent-systems-that-actually-work': {
    title: 'Building Multi-Agent Systems That Actually Work',
    date: '2026-02-28',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Agent Architecture',
    readTime: '16 min read',
    lead:
      'Multi-agent architectures look elegant in diagrams. In production, they fail in ways that are difficult to debug, reproduce, and fix. These are the design patterns — and the antipatterns — we have identified after building several production multi-agent systems.',
    related: [
      {
        title: 'Context Window Management for Long-Running Agents',
        category: 'Agent Architecture',
        date: '2025-11-03',
        readTime: '11 min read',
        href: '/labs/blog/context-window-management-for-agents',
      },
      {
        title: 'Why AI-Generated Code Breaks in Production',
        category: 'Engineering',
        date: '2026-03-10',
        readTime: '14 min read',
        href: '/labs/blog/why-ai-generated-code-breaks-in-production',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'the-hidden-cost-of-skipping-monitoring': {
    title: 'The Hidden Cost of Skipping Monitoring',
    date: '2026-02-14',
    author: { name: 'Arifur Rahman', role: 'CEO, SocioFi' },
    category: 'Engineering',
    readTime: '8 min read',
    lead:
      'We analyzed 50 post-mortem reports from client incidents over two years. Seventy-eight percent of them had a monitoring gap at the root: something that was visible in metrics or logs, but nobody was watching. Here is what they missed and what it cost.',
    related: [
      {
        title: 'Why Dependency Updates Keep Getting Skipped',
        category: 'Engineering',
        date: '2025-11-18',
        readTime: '7 min read',
        href: '/labs/blog/dependency-updates-keep-getting-skipped',
      },
      {
        title: 'RAG in Production: What the Papers Do Not Tell You',
        category: 'Applied AI',
        date: '2026-01-30',
        readTime: '12 min read',
        href: '/labs/blog/rag-in-production',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'rag-in-production': {
    title: 'RAG in Production: What the Papers Do Not Tell You',
    date: '2026-01-30',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Applied AI',
    readTime: '12 min read',
    lead:
      'RAG research papers use clean, well-formatted corpora with consistent structure and controlled vocabulary. Real documents are messy, contradictory, and often poorly formatted. Moving from research to production changes almost everything about how RAG performs.',
    related: [
      {
        title: 'Structured Output Extraction: A Practical Guide',
        category: 'Applied AI',
        date: '2025-12-05',
        readTime: '9 min read',
        href: '/labs/blog/structured-output-extraction',
      },
      {
        title: 'Context Window Management for Long-Running Agents',
        category: 'Agent Architecture',
        date: '2025-11-03',
        readTime: '11 min read',
        href: '/labs/blog/context-window-management-for-agents',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'how-we-review-ai-generated-code': {
    title: 'How We Review AI-Generated Code Before It Ships',
    date: '2026-01-15',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Developer Tooling',
    readTime: '10 min read',
    lead:
      'Reviewing AI-generated code is not the same as reviewing human-written code. The failure modes are different. The places where errors hide are different. And the heuristics a reviewer needs to apply are different. Here is the process we use.',
    related: [
      {
        title: 'Why AI-Generated Code Breaks in Production',
        category: 'Engineering',
        date: '2026-03-10',
        readTime: '14 min read',
        href: '/labs/blog/why-ai-generated-code-breaks-in-production',
      },
      {
        title: 'Building Multi-Agent Systems That Actually Work',
        category: 'Agent Architecture',
        date: '2026-02-28',
        readTime: '16 min read',
        href: '/labs/blog/building-multi-agent-systems-that-actually-work',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'fintech-compliance-automation': {
    title: 'Fintech Compliance Automation: What We Learned After 6 Months',
    date: '2025-12-20',
    author: { name: 'Arifur Rahman', role: 'CEO, SocioFi' },
    category: 'Industry Automation',
    readTime: '14 min read',
    lead:
      'We spent six months building compliance automation systems for fintech clients. The technical problems were easier than we expected. The liability questions — who is responsible when the AI is wrong? — were much harder.',
    related: [
      {
        title: 'Structured Output Extraction: A Practical Guide',
        category: 'Applied AI',
        date: '2025-12-05',
        readTime: '9 min read',
        href: '/labs/blog/structured-output-extraction',
      },
      {
        title: 'RAG in Production: What the Papers Do Not Tell You',
        category: 'Applied AI',
        date: '2026-01-30',
        readTime: '12 min read',
        href: '/labs/blog/rag-in-production',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'structured-output-extraction': {
    title: 'Structured Output Extraction: A Practical Guide',
    date: '2025-12-05',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Applied AI',
    readTime: '9 min read',
    lead:
      'Getting consistent, schema-valid JSON out of a language model sounds trivial and is surprisingly hard. Schema design, retry strategies, confidence scoring, partial failure handling, and the edge cases that will trip you up in production.',
    related: [
      {
        title: 'RAG in Production: What the Papers Do Not Tell You',
        category: 'Applied AI',
        date: '2026-01-30',
        readTime: '12 min read',
        href: '/labs/blog/rag-in-production',
      },
      {
        title: 'Context Window Management for Long-Running Agents',
        category: 'Agent Architecture',
        date: '2025-11-03',
        readTime: '11 min read',
        href: '/labs/blog/context-window-management-for-agents',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'dependency-updates-keep-getting-skipped': {
    title: 'Why Dependency Updates Keep Getting Skipped (And What to Do About It)',
    date: '2025-11-18',
    author: { name: 'Arifur Rahman', role: 'CEO, SocioFi' },
    category: 'Engineering',
    readTime: '7 min read',
    lead:
      'We interviewed 20 development teams about their dependency update process. In almost every case, the answer was some variation of "we do it when something breaks." This is the process that actually works.',
    related: [
      {
        title: 'The Hidden Cost of Skipping Monitoring',
        category: 'Engineering',
        date: '2026-02-14',
        readTime: '8 min read',
        href: '/labs/blog/the-hidden-cost-of-skipping-monitoring',
      },
      {
        title: 'Fintech Compliance Automation: What We Learned After 6 Months',
        category: 'Industry Automation',
        date: '2025-12-20',
        readTime: '14 min read',
        href: '/labs/blog/fintech-compliance-automation',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
  'context-window-management-for-agents': {
    title: 'Context Window Management for Long-Running Agents',
    date: '2025-11-03',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Agent Architecture',
    readTime: '11 min read',
    lead:
      'Agents that run for more than a few turns start degrading in predictable ways: earlier instructions get displaced, tool call accuracy drops, and the agent starts making assumptions it should be asking about. These are the context management patterns that help.',
    related: [
      {
        title: 'Building Multi-Agent Systems That Actually Work',
        category: 'Agent Architecture',
        date: '2026-02-28',
        readTime: '16 min read',
        href: '/labs/blog/building-multi-agent-systems-that-actually-work',
      },
      {
        title: 'RAG in Production: What the Papers Do Not Tell You',
        category: 'Applied AI',
        date: '2026-01-30',
        readTime: '12 min read',
        href: '/labs/blog/rag-in-production',
      },
    ],
    newsletter: {
      headline: 'Get new articles when they publish.',
      description: 'No cadence commitment. Published when there is something worth saying.',
    },
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: `${post.title} — SocioFi Labs`,
    description: post.lead,
  };
}

const placeholder = (
  <p style={{
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    lineHeight: 1.8,
    color: 'var(--text-secondary)',
    marginBottom: 24,
  }}>
    The full article is being prepared for publication. Subscribe to the newsletter to be notified when it goes live — and to receive all future Labs writing.
  </p>
);

export default async function LabsBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return <BlogPost content={{ ...post, children: placeholder }} />;
}
