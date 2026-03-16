import type { Metadata } from 'next';
import StoryPage from '@/templates/StoryPage';
import type { StoryPageContent } from '@/templates/StoryPage';
import { Target, Users, Check, Shield, Rocket, Heart } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'What We Look For — SocioFi Ventures',
  description:
    'SocioFi Ventures selection criteria: the founder profile, idea characteristics, and market conditions that make a co-build partnership work.',
};

const content: StoryPageContent = {
  hero: {
    badge: 'Ventures · Selection criteria',
    headline: (
      <>
        What makes a
        <br />
        <span className="gradient-text">great co-build partnership.</span>
      </>
    ),
    description:
      'We\'re selective about what we take on — not because of volume, but because co-builds require long-term alignment. Here\'s what we actually look for.',
    buttons: [
      { label: 'Apply now', href: '/ventures/apply', variant: 'primary' },
    ],
  },

  narrative: [
    {
      label: 'The founder',
      headline: 'Domain expertise we can\'t replicate.',
      body: (
        <>
          <p style={{ marginBottom: 16 }}>
            The one thing we can&apos;t provide is deep knowledge of your industry and market.
            We can build a logistics intelligence platform — we can&apos;t tell you why logistics
            operations managers make the decisions they do. That knowledge has to come from you.
          </p>
          <p>
            We look for founders who&apos;ve spent years in the problem space — not people
            who&apos;ve identified a market opportunity from the outside. The most successful
            co-builds we&apos;ve done involved founders who knew the failure modes of their
            industry better than we knew how to code.
          </p>
        </>
      ),
      stat: { value: '8/8', label: 'portfolio companies founded by domain experts' },
    },
    {
      label: 'The idea',
      headline: 'A real problem, not a solution looking for one.',
      body: (
        <>
          <p style={{ marginBottom: 16 }}>
            The best co-build pitches describe a problem in specific, observable terms:
            &ldquo;Our factory managers spend 3 hours every morning manually reconciling
            production schedules that change 4 times before lunch.&rdquo; Not: &ldquo;AI
            can transform manufacturing operations.&rdquo;
          </p>
          <p>
            We can validate product solutions. We can&apos;t validate whether the problem
            exists. If you can describe the problem in concrete operational terms and show
            that people currently pay money or time to work around it, we&apos;re interested.
          </p>
        </>
      ),
    },
    {
      label: 'The market',
      headline: 'Defensible access to early customers.',
      body: (
        <>
          <p style={{ marginBottom: 16 }}>
            We&apos;re not investing in ideas — we&apos;re co-building products. For that to
            work, we need to be able to talk to early customers during development, not after
            launch. Founders with existing relationships in the target industry give us that access.
          </p>
          <p>
            This doesn&apos;t mean you need a pre-signed letter of intent. It means you can
            introduce us to 3–5 potential early users who will give us real feedback during
            the build.
          </p>
        </>
      ),
    },
    {
      label: 'What rules you out',
      headline: 'Honest about what doesn\'t work.',
      body: (
        <ul
          style={{
            listStyle: 'disc',
            paddingLeft: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
          }}
        >
          <li>Ideas that require a large initial user base before they&apos;re useful (cold start problems)</li>
          <li>Consumer social products — we build B2B and B2B2C, not social networks</li>
          <li>Founders who want us to validate the idea for them — that&apos;s your job</li>
          <li>Products that are a thin wrapper around a single API with no defensible differentiation</li>
        </ul>
      ),
    },
  ],

  valuesLabel: 'What we value in founders',
  valuesTitle: 'Character over credentials',

  values: [
    {
      icon: <Target size={24} />,
      title: 'Specificity',
      description:
        'Founders who describe their problem in precise operational terms — not market opportunity slides.',
    },
    {
      icon: <Users size={24} />,
      title: 'Industry embeddedness',
      description:
        'Years in the industry, not months. People who know the politics, the workflows, and the informal systems.',
    },
    {
      icon: <Check size={24} />,
      title: 'Execution bias',
      description:
        'We don\'t want to debate ideas forever. We want to build, test, and learn — and we need founders with the same instinct.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Honest risk assessment',
      description:
        'Founders who know what can go wrong and have thought about it — not ones who can only pitch the upside.',
    },
    {
      icon: <Rocket size={24} />,
      title: 'Long-term thinking',
      description:
        'Co-builds are multi-year relationships. We look for founders who are thinking about building a lasting company, not a quick exit.',
    },
    {
      icon: <Heart size={24} />,
      title: 'The problem matters to them',
      description:
        'The founders we\'ve had the best results with care deeply about solving the problem — not just building a startup.',
    },
  ],

  cta: {
    title: 'Sound like you?',
    subtitle: 'Applications are reviewed personally. Tell us about your idea.',
    primaryCTA: { label: 'Apply to co-build', href: '/ventures/apply' },
    ghostCTA: { label: 'See how it works', href: '/ventures/how-it-works' },
  },
};

export default function WhatWeLookForPage() {
  return <StoryPage content={content} />;
}
