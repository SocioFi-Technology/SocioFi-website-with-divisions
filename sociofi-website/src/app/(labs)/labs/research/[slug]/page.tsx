import BlogPost, { type BlogPostContent } from '@/templates/BlogPost';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// ── Static research entries ──────────────────────────────────────────────────

const researchBody = (
  <>
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '1rem',
      lineHeight: 1.8,
      color: 'var(--text-secondary)',
      marginBottom: 24,
    }}>
      This research is actively being developed. Full findings will be published on the Labs blog
      when the work reaches a publishable state. Subscribe to the newsletter to be notified when
      new research goes live.
    </p>
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '1rem',
      lineHeight: 1.8,
      color: 'var(--text-secondary)',
    }}>
      In the meantime, related findings are available in the articles linked below.
    </p>
  </>
);

const research: Record<string, BlogPostContent> = {
  'agent-architecture': {
    title: 'Agent Architecture: Building AI Systems That Fail Gracefully',
    date: '2026-02-14',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Agent Architecture',
    readTime: '18 min read',
    lead:
      'Most AI agent systems work perfectly in demos and break under real workloads. The failure modes are predictable — and preventable — if you design for them from the start.',
    children: researchBody,
    related: [
      {
        title: 'Applied AI: When RAG Works and When It Does Not',
        category: 'Applied AI',
        date: '2026-01-20',
        readTime: '12 min read',
        href: '/labs/research/applied-ai',
      },
      {
        title: 'Developer Tooling: AI Code Review That Engineers Actually Use',
        category: 'Developer Tooling',
        date: '2025-12-08',
        readTime: '10 min read',
        href: '/labs/research/developer-tooling',
      },
    ],
    newsletter: {
      headline: 'Get new research when it publishes.',
      description: 'No filler. Published when there is something worth saying.',
    },
  },
  'applied-ai': {
    title: 'Applied AI: When RAG Works and When It Does Not',
    date: '2026-01-20',
    author: { name: 'Arifur Rahman', role: 'CEO, SocioFi' },
    category: 'Applied AI',
    readTime: '12 min read',
    lead:
      'Retrieval-augmented generation is the most practical AI architecture for most software products. It is also the most misunderstood. This is what we have learned after building a dozen production RAG systems.',
    children: researchBody,
    related: [
      {
        title: 'Agent Architecture: Building AI Systems That Fail Gracefully',
        category: 'Agent Architecture',
        date: '2026-02-14',
        readTime: '18 min read',
        href: '/labs/research/agent-architecture',
      },
      {
        title: 'Industry Automation: Fintech Compliance at Scale',
        category: 'Industry Automation',
        date: '2025-11-15',
        readTime: '14 min read',
        href: '/labs/research/industry-automation',
      },
    ],
    newsletter: {
      headline: 'Get new research when it publishes.',
      description: 'No filler. Published when there is something worth saying.',
    },
  },
  'developer-tooling': {
    title: 'Developer Tooling: AI Code Review That Engineers Actually Use',
    date: '2025-12-08',
    author: { name: 'Kamrul Hasan', role: 'CTO, SocioFi' },
    category: 'Developer Tooling',
    readTime: '10 min read',
    lead:
      'AI code review tools have an adoption problem: engineers ignore them after the first week. We spent three months figuring out why — and what a code review tool needs to do differently to actually get used.',
    children: researchBody,
    related: [
      {
        title: 'Agent Architecture: Building AI Systems That Fail Gracefully',
        category: 'Agent Architecture',
        date: '2026-02-14',
        readTime: '18 min read',
        href: '/labs/research/agent-architecture',
      },
      {
        title: 'Applied AI: When RAG Works and When It Does Not',
        category: 'Applied AI',
        date: '2026-01-20',
        readTime: '12 min read',
        href: '/labs/research/applied-ai',
      },
    ],
    newsletter: {
      headline: 'Get new research when it publishes.',
      description: 'No filler. Published when there is something worth saying.',
    },
  },
  'industry-automation': {
    title: 'Industry Automation: Fintech Compliance at Scale',
    date: '2025-11-15',
    author: { name: 'Arifur Rahman', role: 'CEO, SocioFi' },
    category: 'Industry Automation',
    readTime: '14 min read',
    lead:
      'Compliance automation in fintech sounds simple until you encounter the edge cases: ambiguous regulations, jurisdiction conflicts, and the liability question of what happens when the AI is wrong.',
    children: researchBody,
    related: [
      {
        title: 'Applied AI: When RAG Works and When It Does Not',
        category: 'Applied AI',
        date: '2026-01-20',
        readTime: '12 min read',
        href: '/labs/research/applied-ai',
      },
      {
        title: 'Agent Architecture: Building AI Systems That Fail Gracefully',
        category: 'Agent Architecture',
        date: '2026-02-14',
        readTime: '18 min read',
        href: '/labs/research/agent-architecture',
      },
    ],
    newsletter: {
      headline: 'Get new research when it publishes.',
      description: 'No filler. Published when there is something worth saying.',
    },
  },
};

export function generateStaticParams() {
  return Object.keys(research).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = research[slug];
  if (!post) return {};
  return {
    title: `${post.title} — SocioFi Labs`,
    description: post.lead,
  };
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = research[slug];
  if (!post) notFound();

  return <BlogPost content={post} />;
}
