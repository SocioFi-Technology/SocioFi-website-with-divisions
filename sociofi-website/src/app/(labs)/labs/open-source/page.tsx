import GridListing, { type GridListingContent } from '@/templates/GridListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Source — SocioFi Labs',
  description:
    'Libraries, tools, and utilities released from SocioFi Labs research. Free to use, maintained, and documented.',
};

const content: GridListingContent = {
  hero: {
    badge: 'Labs · Open Source',
    headline: 'Built in the open.',
    description:
      'Every tool we release publicly comes from solving a real problem we hit ourselves. We maintain these because we use them — not as marketing.',
  },
  categories: ['AI / ML', 'Developer Tools', 'Infrastructure', 'Utilities'],
  pageSize: 9,
  items: [
    {
      type: 'open-source',
      title: 'context-router',
      description:
        'Semantic query routing for multi-source RAG systems. Routes queries to the most relevant context sources before retrieval, reducing irrelevant context and hallucination.',
      stars: '1.2k',
      language: 'Python',
      category: 'AI / ML',
      href: 'https://github.com/sociofi/context-router',
    },
    {
      type: 'open-source',
      title: 'devbridge-review',
      description:
        'AI code review GitHub Action. Runs on every PR and flags architectural issues, security anti-patterns, and missing test coverage — the things your linter does not catch.',
      stars: '890',
      language: 'TypeScript',
      category: 'Developer Tools',
      href: 'https://github.com/sociofi/devbridge-review',
    },
    {
      type: 'open-source',
      title: 'agent-harness',
      description:
        'Test harness for AI agents. Define expected tool call sequences, assert on outputs, and measure reliability across prompt variations. Built from our NEXUS ARIA testing infrastructure.',
      stars: '640',
      language: 'TypeScript',
      category: 'AI / ML',
      href: 'https://github.com/sociofi/agent-harness',
    },
    {
      type: 'open-source',
      title: 'patchsentry',
      description:
        'CVE monitoring and dependency patch management CLI. Monitors your package.json and requirements.txt against CVE feeds, scores urgency, and generates staged deployment plans.',
      stars: '420',
      language: 'Node.js',
      category: 'Infrastructure',
      href: 'https://github.com/sociofi/patchsentry',
    },
    {
      type: 'open-source',
      title: 'structured-extract',
      description:
        'Extract structured JSON from unstructured text with schema validation and retry logic. Wraps LLM calls with Zod schemas, automatic retries, and confidence scoring.',
      stars: '380',
      language: 'TypeScript',
      category: 'AI / ML',
      href: 'https://github.com/sociofi/structured-extract',
    },
    {
      type: 'open-source',
      title: 'deploy-diff',
      description:
        'Diff-aware deployment tool. Analyses what changed in a PR, assesses deployment risk, and recommends whether to deploy immediately, stage first, or wait for a maintenance window.',
      stars: '260',
      language: 'TypeScript',
      category: 'Developer Tools',
      href: 'https://github.com/sociofi/deploy-diff',
    },
    {
      type: 'open-source',
      title: 'llm-cache',
      description:
        'Semantic caching layer for LLM calls. Caches responses by semantic similarity rather than exact match — reduces API costs by 30–60% for applications with repeated query patterns.',
      stars: '210',
      language: 'Python',
      category: 'Infrastructure',
      href: 'https://github.com/sociofi/llm-cache',
    },
    {
      type: 'open-source',
      title: 'uptime-assert',
      description:
        'Uptime monitoring as code. Define your uptime checks in TypeScript alongside your application code. CI/CD integration, multi-region checks, and alert routing built in.',
      stars: '180',
      language: 'TypeScript',
      category: 'Infrastructure',
      href: 'https://github.com/sociofi/uptime-assert',
    },
  ],
};

export default function LabsOpenSourcePage() {
  return <GridListing content={content} />;
}
