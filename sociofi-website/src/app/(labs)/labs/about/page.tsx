import StoryPage, { type StoryPageContent } from '@/templates/StoryPage';
import { Brain, Globe, GitBranch, Target, Zap, Code } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Labs — SocioFi',
  description:
    'SocioFi Labs is our R&D division. We research, prototype, and publish in public — and we release what we build.',
};

const content: StoryPageContent = {
  hero: {
    badge: 'Labs · About',
    headline: (
      <>
        Research done in public.{' '}
        <span className="gradient-text">Released to the world.</span>
      </>
    ),
    description:
      'SocioFi Labs is the part of the company that does not have to ship a product on a deadline. We research what is coming, prototype things before they are mainstream, and publish what we learn — including the failures.',
    buttons: [
      { label: 'Read the blog', href: '/labs/blog', variant: 'primary' },
      { label: 'Browse open source', href: '/labs/open-source', variant: 'ghost' },
    ],
  },

  narrative: [
    {
      label: 'Why Labs exists',
      headline: 'The Studio builds what clients need today. Labs builds what they will need in two years.',
      body: (
        <>
          <p>
            SocioFi Studio operates on client timelines. Every project has a scope, a deadline, and a budget.
            That is the right model for building software that ships — but it is not a good model for exploring ideas
            that might take six months to validate.
          </p>
          <p>
            Labs has no client timeline. We pick problems that matter, prototype aggressively, and publish what we find.
            When a Labs experiment validates something useful, it either becomes an open-source release, a Studio capability,
            or a product.
          </p>
        </>
      ),
      stat: { value: '3', label: 'Products launched from Labs research' },
    },
    {
      label: 'Publishing strategy',
      headline: 'We publish failures as often as successes.',
      body: (
        <>
          <p>
            Most technical blogs publish results that work. We try to publish both: the things that worked, the things
            that did not, and — most importantly — why. A documented failure is more useful than an undocumented success
            if it saves another engineer from repeating the same mistake.
          </p>
          <p>
            We do not publish on a schedule. We publish when we have something worth saying. The Labs newsletter goes out
            when a new article is ready — usually every two to three weeks, sometimes more, sometimes less.
          </p>
        </>
      ),
      visualSide: 'left',
      stat: { value: '100+', label: 'Technical articles published' },
    },
    {
      label: 'Open source',
      headline: 'If we built it to solve our own problem, someone else probably needs it.',
      body: (
        <>
          <p>
            Every open-source release from Labs started as internal tooling. We do not build open-source libraries as
            marketing — we release things we actually use and maintain because we have to use them. If we stop
            maintaining something, we say so clearly and archive it.
          </p>
          <p>
            Our open-source repositories include documentation, working examples, and honest notes on limitations.
            We do not release alpha-quality code without labelling it as such.
          </p>
        </>
      ),
      stat: { value: '12+', label: 'Open-source repositories' },
    },
  ],

  valuesLabel: 'How we work',
  valuesTitle: 'Research principles.',
  values: [
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Problem-first',
      description:
        'We start with real engineering problems — either ones we hit ourselves or ones we see consistently in client work. We do not do research for its own sake.',
    },
    {
      icon: <Globe size={22} aria-hidden="true" />,
      title: 'Published openly',
      description:
        'Research that is not published did not happen. Every meaningful experiment produces a written output — methodology, results, and honest assessment of what worked and what did not.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Released if useful',
      description:
        'Tools and libraries with broad applicability go open-source. We maintain what we release, document it properly, and do not abandon it without notice.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Production-grounded',
      description:
        'Every benchmark, every measurement, every claim is verified against real workloads — not synthetic test cases. We note when something only works in controlled conditions.',
    },
    {
      icon: <Brain size={22} aria-hidden="true" />,
      title: 'Honest about limitations',
      description:
        'We document failure modes alongside successes. If something only works in specific conditions, we say so. We do not overclaim.',
    },
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Engineering-focused',
      description:
        'Our audience is engineers who need to build things. We write at the level of detail that makes our findings actually applicable — not at the level of abstraction that makes them safe to publish.',
    },
  ],

  teamLabel: 'The team',
  teamTitle: 'Built by engineers who write.',
  teamSubtitle:
    'Labs is run by the core SocioFi engineering team alongside rotating contributors from Studio projects.',
  team: [
    {
      name: 'Kamrul Hasan',
      role: 'CTO & Labs Lead',
      bio: 'BUET graduate. Leads agent architecture and developer tooling research. Primary author on most technical articles.',
    },
    {
      name: 'Arifur Rahman',
      role: 'CEO & Applied AI Research',
      bio: 'BUET graduate. Leads applied AI and industry automation research. Writes on the business and liability implications of AI systems.',
    },
  ],

  cta: {
    title: 'Follow the work.',
    subtitle:
      'Subscribe to the Labs newsletter for new research, open-source releases, and technical writing.',
    primaryCTA: { label: 'Read the blog', href: '/labs/blog' },
    ghostCTA: { label: 'Browse open source', href: '/labs/open-source' },
    note: 'Published when it is ready. No filler content.',
  },
};

export default function LabsAboutPage() {
  return <StoryPage content={content} />;
}
