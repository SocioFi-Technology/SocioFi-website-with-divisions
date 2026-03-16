import BlogListing, { type BlogListingContent } from '@/templates/BlogListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Labs Blog — SocioFi',
  description:
    'Technical writing from SocioFi Labs. AI agent architecture, applied ML engineering, developer tooling, and honest assessments of what works in production.',
};

const content: BlogListingContent = {
  label: 'From the lab',
  title: 'Technical writing.',
  categories: ['Agent Architecture', 'Applied AI', 'Developer Tooling', 'Industry Automation', 'Engineering'],
  featured: {
    title: 'Why AI-Generated Code Breaks in Production (And How to Prevent It)',
    excerpt:
      'AI coding tools generate code that passes tests and looks correct. Then it hits production and breaks in ways the tests never covered. After auditing dozens of AI-generated codebases, we have identified the patterns.',
    category: 'Engineering',
    date: '2026-03-10',
    readTime: '14 min read',
    href: '/labs/blog/why-ai-generated-code-breaks-in-production',
    accentColor: '#7B6FE8',
    author: 'Kamrul Hasan',
  },
  posts: [
    {
      title: 'Building Multi-Agent Systems That Actually Work',
      excerpt:
        'Multi-agent architectures look elegant in diagrams and unpredictable in production. These are the design patterns that make the difference between a demo and a reliable system.',
      category: 'Agent Architecture',
      date: '2026-02-28',
      readTime: '16 min read',
      href: '/labs/blog/building-multi-agent-systems-that-actually-work',
      accentColor: '#7B6FE8',
      author: 'Kamrul Hasan',
    },
    {
      title: 'The Hidden Cost of Skipping Monitoring',
      excerpt:
        'We analyzed 50 post-mortem reports from client incidents. 78% of them had a monitoring gap at the root. Here is what they missed and what it cost.',
      category: 'Engineering',
      date: '2026-02-14',
      readTime: '8 min read',
      href: '/labs/blog/the-hidden-cost-of-skipping-monitoring',
      accentColor: '#4DBFA8',
      author: 'Arifur Rahman',
    },
    {
      title: 'RAG in Production: What the Papers Do Not Tell You',
      excerpt:
        'Retrieval-augmented generation research uses clean, well-formatted corpora. Real documents are messy. Here is what changes when you move from research to production.',
      category: 'Applied AI',
      date: '2026-01-30',
      readTime: '12 min read',
      href: '/labs/blog/rag-in-production',
      accentColor: '#7B6FE8',
      author: 'Kamrul Hasan',
    },
    {
      title: 'How We Review AI-Generated Code Before It Ships',
      excerpt:
        'Our code review process for AI-generated output is different from reviewing human-written code. The failure modes are different, and the review heuristics have to be different too.',
      category: 'Developer Tooling',
      date: '2026-01-15',
      readTime: '10 min read',
      href: '/labs/blog/how-we-review-ai-generated-code',
      accentColor: '#4DBFA8',
      author: 'Kamrul Hasan',
    },
    {
      title: 'Fintech Compliance Automation: What We Learned After 6 Months',
      excerpt:
        'We spent six months automating compliance workflows for fintech clients. The technical problems were easier than expected. The liability questions were harder.',
      category: 'Industry Automation',
      date: '2025-12-20',
      readTime: '14 min read',
      href: '/labs/blog/fintech-compliance-automation',
      accentColor: '#E8B84D',
      author: 'Arifur Rahman',
    },
    {
      title: 'Structured Output Extraction: A Practical Guide',
      excerpt:
        'Getting consistent JSON out of an LLM sounds trivial and is surprisingly hard. Schemas, retry strategies, confidence scoring, and handling partial failures.',
      category: 'Applied AI',
      date: '2025-12-05',
      readTime: '9 min read',
      href: '/labs/blog/structured-output-extraction',
      accentColor: '#7B6FE8',
      author: 'Kamrul Hasan',
    },
    {
      title: 'Why Dependency Updates Keep Getting Skipped (And What to Do About It)',
      excerpt:
        'We interviewed 20 development teams about their dependency update process. The answer was almost always the same: "we do it when something breaks." Here is a better model.',
      category: 'Engineering',
      date: '2025-11-18',
      readTime: '7 min read',
      href: '/labs/blog/dependency-updates-keep-getting-skipped',
      accentColor: '#4DBFA8',
      author: 'Arifur Rahman',
    },
    {
      title: 'Context Window Management for Long-Running Agents',
      excerpt:
        'Agents that run for more than a few turns start degrading. Context fills up, earlier instructions get truncated, and the output quality drops. These are the patterns that help.',
      category: 'Agent Architecture',
      date: '2025-11-03',
      readTime: '11 min read',
      href: '/labs/blog/context-window-management-for-agents',
      accentColor: '#7B6FE8',
      author: 'Kamrul Hasan',
    },
  ],
  newsletter: {
    headline: 'Get new articles when they publish.',
    description:
      'No cadence commitment. We publish when we have something worth saying — usually every 2–3 weeks.',
  },
};

export default function LabsBlogPage() {
  return <BlogListing content={content} />;
}
