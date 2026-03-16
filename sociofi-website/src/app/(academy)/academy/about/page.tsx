import StoryPage, { type StoryPageContent } from '@/templates/StoryPage';
import type { Metadata } from 'next';
import { Rocket, Brain, Code, Users, Target, Check } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'About Academy — SocioFi Technology',
  description:
    "SocioFi Academy exists because building AI-native software requires skills that traditional computer science education doesn't cover. Learn our teaching philosophy.",
};

const content: StoryPageContent = {
  hero: {
    badge: 'Academy · About',
    headline: (
      <>
        Why we started
        <br />
        <span className="gradient-text">teaching this.</span>
      </>
    ),
    description:
      'We built software with AI systems before there were courses to teach it. What we learned the hard way became the Academy curriculum.',
    buttons: [
      { label: 'Browse courses', href: '/academy/courses', variant: 'primary' },
    ],
  },
  narrative: [
    {
      label: 'The gap we saw',
      headline: 'Great tutorials. No production knowledge.',
      body: (
        <>
          <p style={{ marginBottom: 16 }}>
            When we started building AI-native systems, we relied on official documentation,
            academic papers, and a lot of trial and error. The courses that existed taught you how
            to call APIs and string together demos. None of them told you what to do when the RAG
            pipeline returns hallucinations at 2am, or why your agent loop is burning through tokens
            without making progress.
          </p>
          <p>
            The gap between "can build a demo" and "can ship to production" was enormous — and
            nobody was teaching how to cross it.
          </p>
        </>
      ),
    },
    {
      label: 'What we built',
      headline: 'A curriculum from real failures.',
      body: (
        <>
          <p style={{ marginBottom: 16 }}>
            Every module in our curriculum started as a lesson we learned the hard way. Context
            window management for long-running agents. Evaluation frameworks that catch regressions.
            Deployment patterns that don't fall apart under real user load.
          </p>
          <p>
            The Academy doesn't teach AI for its own sake. It teaches AI as a tool for building
            software that actually works — deployed, maintained, improved over time.
          </p>
        </>
      ),
      stat: { value: '500+', label: 'students through the programme' },
    },
    {
      label: 'Our commitment',
      headline: 'Always taught by practitioners.',
      body: (
        <p>
          Every Academy instructor is a working engineer at SocioFi — someone who built the systems
          we teach. We don't hire educators to deliver our curriculum. When the curriculum changes,
          it's because production changed first.
        </p>
      ),
    },
  ],
  valuesLabel: 'Teaching principles',
  valuesTitle: 'What we believe about learning',
  values: [
    {
      icon: <Rocket size={24} />,
      title: 'Ship something real',
      description: 'Every course ends with a deployed project — not a certificate of completion.',
    },
    {
      icon: <Brain size={24} />,
      title: 'Understand the failure modes',
      description:
        'We spend as much time on what breaks and why as on what works.',
    },
    {
      icon: <Code size={24} />,
      title: 'Read the actual code',
      description: 'No black boxes. We look at what the frameworks actually do.',
    },
    {
      icon: <Users size={24} />,
      title: 'Learn with others',
      description:
        'Every cohort has a community channel. Questions asked out loud help everyone.',
    },
    {
      icon: <Target size={24} />,
      title: 'Specific over general',
      description:
        'A course on one topic taught well beats a survey course taught broadly.',
    },
    {
      icon: <Check size={24} />,
      title: 'Free first',
      description: "Every course's first module is free. Learn before you pay.",
    },
  ],
  cta: {
    title: 'See what we teach',
    subtitle: '',
    primaryCTA: { label: 'Browse courses', href: '/academy/courses' },
    ghostCTA: { label: 'Who this is for', href: '/academy/who-its-for' },
  },
};

export default function AcademyAboutPage() {
  return <StoryPage content={content} />;
}
