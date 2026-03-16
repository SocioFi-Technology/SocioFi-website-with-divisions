import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DetailPage, { type DetailPageContent } from '@/templates/DetailPage';

// ── Static course data ────────────────────────────────────────────────────────

const courses: Record<string, DetailPageContent> = {
  'ai-native-fundamentals': {
    meta: {
      category: 'Academy · Foundations',
      title: 'AI-Native Development Fundamentals',
      subtitle:
        'The complete starting point for developers who want to build production AI systems from scratch.',
      tags: ['Foundations', 'RAG', 'Agents', 'Production'],
      duration: '22 hours · Self-paced',
    },
    intro:
      'This course is the starting point we wish had existed when we began building AI-native systems. It covers everything from architecture decisions to deployment — built around a project you complete and ship before the final module.',
    sections: [
      {
        label: 'What you build',
        headline: 'One project. Deployed to production.',
        body: (
          <>
            <p style={{ marginBottom: 16 }}>
              The course is structured around a single project: an AI-native document intelligence
              system. By the time you finish, you will have built and deployed a system that ingests
              documents, chunks and embeds them, retrieves relevant content, generates answers, and
              evaluates its own outputs.
            </p>
            <p>
              This isn&apos;t a toy. It handles real documents, runs on real infrastructure, and has
              the monitoring and evaluation hooks that production systems need.
            </p>
          </>
        ),
      },
      {
        label: 'Curriculum',
        headline: 'Five modules, one deployed system.',
        body: (
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <li>Module 1: AI-native architecture patterns and when to use them (free)</li>
            <li>Module 2: RAG implementation — chunking, embedding, and retrieval</li>
            <li>Module 3: Agent design — tools, loops, and failure recovery</li>
            <li>Module 4: Deployment — infrastructure, monitoring, and alerting</li>
            <li>Module 5: Evaluation — ground truth, metrics, and regression testing</li>
          </ul>
        ),
      },
      {
        label: 'Who this is for',
        headline: 'Intermediate developers new to AI-native systems.',
        body: (
          <p>
            You need to be comfortable writing code — any backend language works. No ML or AI
            background required. This course treats AI systems as software engineering problems and
            teaches them the same way.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 22, suffix: ' hrs', label: 'Course length' },
      { numeric: 5, label: 'Project modules' },
      { numeric: 1, label: 'Deployed project' },
      { numeric: 94, suffix: '%', label: 'Completion rate' },
    ],
    related: [
      {
        title: 'Building Production RAG Systems',
        description: 'Go deeper on the retrieval layer.',
        href: '/academy/courses/production-rag-systems',
        linkText: 'View course',
      },
      {
        title: 'Multi-Agent System Design',
        description: 'Next step after mastering the foundations.',
        href: '/academy/courses/multi-agent-design',
        linkText: 'View course',
      },
    ],
    cta: {
      title: 'Enroll in AI-Native Fundamentals',
      subtitle: 'First module is free — no payment required to start.',
      primaryCTA: { label: 'Start free', href: '/academy/courses' },
      note: 'Lifetime access. Self-paced.',
    },
  },

  'production-rag-systems': {
    meta: {
      category: 'Academy · RAG & Retrieval',
      title: 'Building Production RAG Systems',
      subtitle:
        'Beyond hello-world retrieval. The techniques that make RAG work under real production conditions.',
      tags: ['RAG', 'Retrieval', 'Production', 'Evaluation'],
      duration: '18 hours · Self-paced',
    },
    intro:
      'Most RAG tutorials get you to a working demo in 30 minutes. This course picks up where they leave off — the point where the system is deployed but starts failing in ways the tutorial didn\'t cover.',
    sections: [
      {
        label: 'What this covers',
        headline: 'The techniques that actually matter in production.',
        body: (
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <li>Chunking strategies: fixed-size, semantic, structural — when each one breaks</li>
            <li>Embedding model selection and the tradeoffs nobody explains</li>
            <li>Re-ranking: when it helps, when it hurts, and how to measure it</li>
            <li>Hallucination mitigation: attribution, grounding, and refusal logic</li>
            <li>
              Evaluation: building a ground truth dataset and running regression tests
            </li>
          </ul>
        ),
      },
      {
        label: 'Prerequisites',
        headline: 'You should have built a basic RAG system already.',
        body: (
          <p>
            This course assumes you&apos;ve implemented a basic RAG pipeline before. If you
            haven&apos;t, start with AI-Native Development Fundamentals — Module 2 covers RAG from
            scratch.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 18, suffix: ' hrs', label: 'Course length' },
      { numeric: 6, label: 'Production techniques' },
      { numeric: 1, label: 'Evaluation framework built' },
    ],
    related: [
      {
        title: 'AI System Evaluation Frameworks',
        description: 'Deep dive on measuring AI system quality.',
        href: '/academy/courses/ai-system-evaluation',
        linkText: 'View course',
      },
      {
        title: 'Multi-Agent System Design',
        description: 'Extend beyond single-turn retrieval.',
        href: '/academy/courses/multi-agent-design',
        linkText: 'View course',
      },
    ],
    cta: {
      title: 'Enroll in Production RAG Systems',
      primaryCTA: { label: 'Enroll now', href: '/academy/courses' },
      note: 'Self-paced. Lifetime access.',
    },
  },

  'multi-agent-design': {
    meta: {
      category: 'Academy · Agent Systems',
      title: 'Multi-Agent System Design',
      subtitle:
        'Design and build agent networks that work in production — not just in demos.',
      tags: ['Agents', 'Architecture', 'Advanced', 'Production'],
      duration: '24 hours · Self-paced',
    },
    intro:
      'Multi-agent systems look elegant in architecture diagrams. In production, they fail in ways that are hard to debug, expensive to trace, and difficult to reproduce. This course teaches you to design around those failure modes from the start.',
    sections: [
      {
        label: 'What you learn',
        headline: 'Architecture patterns for real agent systems.',
        body: (
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <li>
              Coordination patterns: orchestrator-worker, peer networks, hierarchical systems
            </li>
            <li>Tool design: interface contracts, error handling, and idempotency</li>
            <li>
              Context management: token budgets, summarisation, and memory patterns
            </li>
            <li>
              Failure recovery: retry logic, fallbacks, and circuit breakers for agents
            </li>
            <li>Cost control: preventing runaway loops and unexpected token burn</li>
          </ul>
        ),
      },
      {
        label: 'Level',
        headline: 'Advanced course — prerequisites required.',
        body: (
          <p>
            You should have solid experience with single-agent systems before taking this course.
            AI-Native Development Fundamentals (Module 3) or equivalent practical experience is the
            prerequisite.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 24, suffix: ' hrs', label: 'Course length' },
      { numeric: 5, label: 'Architecture patterns covered' },
      { numeric: 1, label: 'Multi-agent system deployed' },
    ],
    related: [
      {
        title: 'Context Window Management',
        description: 'The technical foundation for long-running agents.',
        href: '/academy/courses/context-window-management',
        linkText: 'View course',
      },
      {
        title: 'AI System Evaluation Frameworks',
        description: 'How to evaluate complex agent behaviour.',
        href: '/academy/courses/ai-system-evaluation',
        linkText: 'View course',
      },
    ],
    cta: {
      title: 'Enroll in Multi-Agent Design',
      primaryCTA: { label: 'Enroll now', href: '/academy/courses' },
      note: 'Advanced. Prerequisites recommended.',
    },
  },

  'prototype-to-production': {
    meta: {
      category: 'Academy · For Founders',
      title: 'From Prototype to Production',
      subtitle:
        'For founders and developers who built something with AI tools and now need to make it real.',
      tags: ['Production', 'Founders', 'Deployment', 'Intermediate'],
      duration: '16 hours · Self-paced',
    },
    intro:
      'You have working code. It does something useful. But it crashes under load, doesn\'t have auth, isn\'t monitored, and you\'re not sure it\'ll hold up when real users arrive. This course fills that gap.',
    sections: [
      {
        label: 'What this covers',
        headline: 'The five things AI-generated prototypes are always missing.',
        body: (
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <li>Authentication and user management — done properly</li>
            <li>Production infrastructure — hosting, SSL, CDN, environment config</li>
            <li>Error handling and monitoring — knowing when things break</li>
            <li>Performance under load — what breaks first and how to fix it</li>
            <li>Maintenance patterns — keeping it running after you ship it</li>
          </ul>
        ),
      },
      {
        label: 'Who this is for',
        headline: 'Founders and non-traditional developers.',
        body: (
          <p>
            This course is explicitly designed for people who built something with AI coding tools
            and now need to take it further. You don&apos;t need a CS degree. You need working code
            and the will to ship it properly.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 16, suffix: ' hrs', label: 'Course length' },
      { numeric: 5, label: 'Production gaps addressed' },
      { numeric: 1, label: 'Production-ready deployment' },
    ],
    related: [
      {
        title: 'AI-Native Development Fundamentals',
        description: 'The full-stack starting point.',
        href: '/academy/courses/ai-native-fundamentals',
        linkText: 'View course',
      },
      {
        title: 'AI Code Review & Quality Assurance',
        description: 'Review what you built before it ships.',
        href: '/academy/courses/ai-code-review',
        linkText: 'View course',
      },
    ],
    cta: {
      title: 'Enroll now',
      primaryCTA: { label: 'Enroll now', href: '/academy/courses' },
      note: 'Self-paced. Lifetime access.',
    },
  },

  'ai-code-review': {
    meta: {
      category: 'Academy · Production',
      title: 'AI Code Review & Quality Assurance',
      subtitle:
        'How to review AI-generated code, the failure patterns to look for, and the gates that catch them.',
      tags: ['Code Review', 'Quality', 'Production', 'Intermediate'],
      duration: '14 hours · Self-paced',
    },
    intro:
      'AI coding tools write a lot of code quickly. Not all of it is good. This course teaches the review practices that catch the specific failure patterns AI-generated code introduces — before they reach production.',
    sections: [
      {
        label: 'Core content',
        headline: 'The 7 failure patterns in AI-generated code.',
        body: (
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <li>
              Missing error handling — the most common pattern and why AI skips it
            </li>
            <li>Hardcoded credentials and insecure defaults</li>
            <li>N+1 queries and database performance anti-patterns</li>
            <li>Missing input validation at system boundaries</li>
            <li>Incorrect concurrency and race condition patterns</li>
            <li>
              Over-engineered abstractions that break when requirements change
            </li>
            <li>Shallow test coverage that passes but misses real failures</li>
          </ul>
        ),
      },
      {
        label: 'Format',
        headline: 'Review real AI-generated code in every module.',
        body: (
          <p>
            Each module includes real code review exercises using AI-generated code samples. You
            practise identifying the failure patterns before the module explains what to look for.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 14, suffix: ' hrs', label: 'Course length' },
      { numeric: 7, label: 'Failure patterns covered' },
      { numeric: 50, suffix: '+', label: 'Code review exercises' },
    ],
    related: [
      {
        title: 'From Prototype to Production',
        description: 'Apply review skills to your own codebase.',
        href: '/academy/courses/prototype-to-production',
        linkText: 'View course',
      },
      {
        title: 'AI System Evaluation Frameworks',
        description: 'Formal evaluation for AI-native systems.',
        href: '/academy/courses/ai-system-evaluation',
        linkText: 'View course',
      },
    ],
    cta: {
      title: 'Enroll in AI Code Review',
      primaryCTA: { label: 'Enroll now', href: '/academy/courses' },
      note: 'Self-paced. Lifetime access.',
    },
  },
};

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return [
    'ai-native-fundamentals',
    'production-rag-systems',
    'multi-agent-design',
    'prototype-to-production',
    'ai-code-review',
  ].map((slug) => ({ slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = courses[slug];
  if (!course) return { title: 'Course not found — SocioFi Academy' };
  return {
    title: `${course.meta.title} — SocioFi Academy`,
    description: course.meta.subtitle ?? course.intro,
    openGraph: {
      title: `${course.meta.title} — SocioFi Academy`,
      description: course.meta.subtitle ?? course.intro,
      type: 'website',
      images: [{ url: '/og-image.png' }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses[slug];
  if (!course) notFound();
  return <DetailPage content={course} />;
}
