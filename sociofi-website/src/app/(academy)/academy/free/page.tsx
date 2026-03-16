import GridListing, { type GridListingContent } from '@/templates/GridListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Resources — SocioFi Academy',
  description:
    'Free guides, tutorials, templates, and tools for AI-native software development. No account required.',
};

const content: GridListingContent = {
  hero: {
    badge: 'Academy · Free resources',
    headline: 'Free to use. No strings.',
    description:
      "Guides, templates, and tools we've released publicly. No account required, no email gate — just useful material.",
  },
  categories: ['Guides', 'Templates', 'Tools', 'Articles'],
  pageSize: 12,
  items: [
    {
      type: 'blog',
      title: 'RAG Architecture Decision Guide',
      description:
        'A practical decision framework for choosing between RAG architectures, embedding models, and retrieval strategies for your specific use case.',
      date: '2026-02-15',
      readTime: '12 min read',
      category: 'Guides',
      href: '/academy/free/rag-architecture-guide',
    },
    {
      type: 'blog',
      title: 'AI Project Scope Template',
      description:
        'The template we use to scope AI feature development with clients. Define success criteria, evaluation metrics, and failure modes before writing code.',
      date: '2026-01-28',
      readTime: 'Template',
      category: 'Templates',
      href: '/academy/free/ai-project-scope-template',
    },
    {
      type: 'blog',
      title: 'Production AI Checklist',
      description:
        '34-point checklist for deploying AI-native systems to production. Security, monitoring, cost controls, evaluation, and incident response.',
      date: '2026-01-10',
      readTime: 'Checklist',
      category: 'Tools',
      href: '/academy/free/production-ai-checklist',
    },
    {
      type: 'blog',
      title: 'Why AI-Generated Code Breaks in Production',
      description:
        'The 7 failure patterns we see in AI-generated code before it reaches production, and the review practices that catch them.',
      date: '2026-03-10',
      readTime: '14 min read',
      category: 'Articles',
      href: '/labs/blog/why-ai-generated-code-breaks-in-production',
    },
    {
      type: 'blog',
      title: 'Agent Loop Design Patterns',
      description:
        'Common patterns for structuring AI agent execution loops: when to use each, the tradeoffs, and the failure modes to design around.',
      date: '2025-12-20',
      readTime: '10 min read',
      category: 'Guides',
      href: '/academy/free/agent-loop-patterns',
    },
    {
      type: 'blog',
      title: 'Evaluation Framework Starter Kit',
      description:
        'A starter kit for building an evaluation framework for LLM-based systems. Ground truth dataset structure, metric definitions, and test runner code.',
      date: '2025-11-30',
      readTime: 'Template + code',
      category: 'Templates',
      href: '/academy/free/evaluation-framework',
    },
    {
      type: 'blog',
      title: 'Context Window Budget Calculator',
      description:
        'Spreadsheet tool for calculating token costs and context window allocations for multi-turn conversation systems and long-running agents.',
      date: '2025-11-15',
      readTime: 'Tool',
      category: 'Tools',
      href: '/academy/free/context-budget-calculator',
    },
    {
      type: 'blog',
      title: "The Founder's AI Development Glossary",
      description:
        'Plain-English definitions of AI development terms that non-technical founders need to understand when working with engineering teams.',
      date: '2026-02-01',
      readTime: 'Reference',
      category: 'Guides',
      href: '/academy/free/founders-ai-glossary',
    },
    {
      type: 'blog',
      title: 'Prompt Version Control Guide',
      description:
        'How to version, test, and manage prompts in production systems — the practices that prevent silent regressions when you update a prompt.',
      date: '2025-12-05',
      readTime: '8 min read',
      category: 'Guides',
      href: '/academy/free/prompt-version-control',
    },
    {
      type: 'blog',
      title: 'RAG Debugging Playbook',
      description:
        'Step-by-step diagnostic process for the 8 most common RAG failure modes. Each pattern includes how to detect it, what causes it, and how to fix it.',
      date: '2026-01-20',
      readTime: '20 min read',
      category: 'Guides',
      href: '/academy/free/rag-debugging-playbook',
    },
  ],
};

export default function AcademyFreePage() {
  return <GridListing content={content} />;
}
