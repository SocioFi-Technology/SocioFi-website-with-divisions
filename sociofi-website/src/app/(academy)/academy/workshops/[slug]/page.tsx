import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DetailPage, { type DetailPageContent } from '@/templates/DetailPage';

// ── Static workshop data ──────────────────────────────────────────────────────

const workshops: Record<string, DetailPageContent> = {
  'deploy-first-ai-feature': {
    meta: {
      category: 'Academy · Workshops',
      title: 'Deploy Your First AI Feature',
      subtitle: 'One day. Walk in with an idea, leave with a deployed AI feature.',
      tags: ['Beginner', 'Live', 'Remote'],
      duration: '1 day · Remote',
    },
    intro:
      'A hands-on build day with live instruction throughout. You bring the idea — an AI feature you want to add to an existing project, or a standalone proof of concept. We guide you through architecture, implementation, and deployment in a single session.',
    sections: [
      {
        label: 'What happens on the day',
        headline: 'Four sessions. One deployed feature.',
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
              Session 1 (1hr): Architecture and scoping — you present your idea, we help you
              design it
            </li>
            <li>
              Session 2 (2hr): Build session 1 — core implementation with live instructor support
            </li>
            <li>Session 3 (2hr): Build session 2 — integration and deployment</li>
            <li>Session 4 (1hr): Review, Q&amp;A, and next steps</li>
          </ul>
        ),
      },
      {
        label: 'Who should attend',
        headline: 'Developers who want to stop planning and start shipping.',
        body: (
          <p>
            Bring a laptop and a feature idea. You should be comfortable writing code in at least
            one backend language. No AI experience needed — the instructor will help you scope
            appropriately for your experience level.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 1, label: 'Deployed feature' },
      { numeric: 6, suffix: ' hrs', label: 'Live instruction' },
      { numeric: 10, label: 'Max group size' },
    ],
    cta: {
      title: 'Book your place',
      subtitle:
        'Sessions run quarterly. Small groups — maximum 10 participants.',
      primaryCTA: { label: 'See upcoming dates', href: '/academy/workshops' },
      note: 'Remote only. All time zones accommodated.',
    },
  },

  'agent-architecture-sprint': {
    meta: {
      category: 'Academy · Workshops',
      title: 'Agent Architecture Design Sprint',
      subtitle:
        'Two days. Design, prototype, and validate your multi-agent system architecture.',
      tags: ['Intermediate', 'Live', 'Architecture', 'Remote'],
      duration: '2 days · Remote',
    },
    intro:
      'A structured 2-day sprint for teams or individuals who need to design a multi-agent system. You leave with an architecture document, a working prototype, and confidence in the design decisions you\'ve made.',
    sections: [
      {
        label: 'Sprint structure',
        headline: 'Design, build, validate.',
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
              Day 1 morning: Requirements analysis and architecture patterns — which pattern fits
              your system
            </li>
            <li>
              Day 1 afternoon: Architecture document — responsibilities, interfaces, and failure
              modes
            </li>
            <li>
              Day 2 morning: Prototype build — coordinator agent plus one worker agent implemented
            </li>
            <li>
              Day 2 afternoon: Review, stress testing, and documentation finalisation
            </li>
          </ul>
        ),
      },
      {
        label: 'Prerequisites',
        headline: 'Experience with single-agent systems required.',
        body: (
          <p>
            You should have built and deployed at least one simple AI agent before attending. The
            Multi-Agent System Design course covers the same ground in self-paced format if you want
            preparation.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 1, label: 'Architecture document' },
      { numeric: 1, label: 'Working prototype' },
      { numeric: 2, suffix: ' days', label: 'Duration' },
    ],
    cta: {
      title: 'Join the next cohort',
      primaryCTA: { label: 'See upcoming dates', href: '/academy/workshops' },
      note: 'Maximum 8 participants. Remote only.',
    },
  },

  'production-debugging-sprint': {
    meta: {
      category: 'Academy · Workshops',
      title: 'Production Debugging Sprint',
      subtitle:
        'Bring your broken AI system. We\'ll diagnose it live and teach you the patterns in the process.',
      tags: ['Intermediate', 'Live', 'Debugging', 'Remote'],
      duration: '1 day · Remote',
    },
    intro:
      'The most practical workshop we run. Participants bring real AI systems that are behaving unexpectedly. We diagnose them live, in front of the group — and use each diagnosis as a teaching moment for the failure pattern it represents.',
    sections: [
      {
        label: 'Format',
        headline: 'Live diagnosis. Real systems.',
        body: (
          <>
            <p style={{ marginBottom: 16 }}>
              Half the day is group instruction on the 8 most common AI system failure modes and
              how to diagnose them. The other half is live diagnosis of participant systems — you
              describe the symptom, we trace it together.
            </p>
            <p>
              Previous participants have arrived with hallucinating RAG systems, runaway agent
              loops, context overflow failures, and evaluation metrics that were measuring the wrong
              thing.
            </p>
          </>
        ),
      },
      {
        label: 'What to bring',
        headline: 'A system with a problem you can\'t solve.',
        body: (
          <p>
            Bring a description of your system (architecture overview is fine), the failure
            behaviour you&apos;re seeing, and anything you&apos;ve already tried. You don&apos;t
            need to share code — description-level diagnosis is usually sufficient.
          </p>
        ),
      },
    ],
    outcomes: [
      { numeric: 8, label: 'Failure patterns covered' },
      { numeric: 1, label: 'Your system diagnosed' },
      { numeric: 12, label: 'Max group size' },
    ],
    cta: {
      title: 'Book your place',
      primaryCTA: { label: 'See upcoming dates', href: '/academy/workshops' },
      note: 'Limited to 12 participants. Bring a real problem.',
    },
  },
};

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return [
    'deploy-first-ai-feature',
    'agent-architecture-sprint',
    'production-debugging-sprint',
  ].map((slug) => ({ slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = workshops[slug];
  if (!workshop) return { title: 'Workshop not found — SocioFi Academy' };
  return {
    title: `${workshop.meta.title} — SocioFi Academy`,
    description: workshop.meta.subtitle ?? workshop.intro,
    openGraph: {
      title: `${workshop.meta.title} — SocioFi Academy`,
      description: workshop.meta.subtitle ?? workshop.intro,
      type: 'website',
      images: [{ url: '/og-image.png' }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = workshops[slug];
  if (!workshop) notFound();
  return <DetailPage content={workshop} />;
}
