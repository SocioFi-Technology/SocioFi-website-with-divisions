import GridListing, { type GridListingContent } from '@/templates/GridListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Projects — SocioFi Labs',
  description:
    'Projects currently under active development in SocioFi Labs. From multi-agent platforms to AI-native developer tools.',
};

const content: GridListingContent = {
  hero: {
    badge: 'Labs · Projects',
    headline: 'What we are building.',
    description:
      'Active projects across our research streams. Some are early experiments. Some are approaching product readiness. All are building toward something real.',
  },
  categories: ['Agent Systems', 'Developer Tools', 'Applied AI', 'Infrastructure'],
  pageSize: 9,
  items: [
    {
      type: 'portfolio',
      title: 'NEXUS ARIA — Multi-agent operations platform',
      description:
        'An orchestration layer for AI agents that handles tool use, retries, memory, and observability without requiring custom infrastructure per deployment. Currently in closed beta.',
      tags: ['Multi-agent', 'Orchestration', 'TypeScript', 'Observability'],
      slug: 'nexus-aria',
      client: 'SocioFi Labs',
      accentColor: '#7B6FE8',
      category: 'Agent Systems',
    },
    {
      type: 'portfolio',
      title: 'DevBridge OS — AI-native code review',
      description:
        'Open-source AI code review that integrates with existing PR workflows. Focuses on architectural issues and security patterns rather than style — the things linters miss.',
      tags: ['Code Review', 'AI', 'GitHub Actions', 'Open Source'],
      slug: 'devbridge-os',
      client: 'SocioFi Labs',
      accentColor: '#4DBFA8',
      category: 'Developer Tools',
    },
    {
      type: 'portfolio',
      title: 'FabricxAI Agent System — Design-to-code pipeline',
      description:
        'The agent architecture powering FabricxAI — a multi-step pipeline that converts Figma designs into production-ready React components with iterative refinement and human review hooks.',
      tags: ['Agents', 'Figma API', 'Code Generation', 'React'],
      slug: 'fabricxai-agent',
      client: 'SocioFi Labs',
      accentColor: '#E8916F',
      category: 'Agent Systems',
    },
    {
      type: 'portfolio',
      title: 'ContextRouter — Semantic context routing for RAG',
      description:
        'A lightweight library that routes queries to the most relevant context sources in multi-source RAG systems. Reduces hallucination by 40% in our internal benchmarks versus naive retrieval.',
      tags: ['RAG', 'Semantic Search', 'Python', 'Open Source'],
      slug: 'contextrouter',
      client: 'SocioFi Labs',
      accentColor: '#5BB5E0',
      category: 'Applied AI',
    },
    {
      type: 'portfolio',
      title: 'PatchSentry — Automated dependency security monitoring',
      description:
        'The internal tool behind our Services security patching workflow. Monitors CVE feeds, scores patch urgency, and generates staged deployment plans. Being open-sourced in Q2 2026.',
      tags: ['Security', 'CVE Monitoring', 'Node.js', 'Automation'],
      slug: 'patchsentry',
      client: 'SocioFi Labs',
      accentColor: '#E8B84D',
      category: 'Infrastructure',
    },
    {
      type: 'portfolio',
      title: 'DocIntel — Structured extraction from documents',
      description:
        'Extract structured data from PDFs, contracts, and forms with high accuracy. Handles scanned documents, multi-page layouts, and complex table structures. Used internally for client automations.',
      tags: ['Document AI', 'Extraction', 'Python', 'Applied AI'],
      slug: 'docintel',
      client: 'SocioFi Labs',
      accentColor: '#7B6FE8',
      category: 'Applied AI',
    },
  ],
};

export default function LabsProjectsPage() {
  return <GridListing content={content} />;
}
