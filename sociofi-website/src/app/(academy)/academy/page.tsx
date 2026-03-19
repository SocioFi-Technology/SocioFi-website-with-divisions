import DivisionOverview, { type DivisionOverviewContent } from '@/templates/DivisionOverview';
import AcademyHeroVisual from '@/components/visual/AcademyHeroVisual';
import type { Metadata } from 'next';
import { Play, Calendar, Building, Star, Rocket, Brain, Users } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Academy — SocioFi Technology',
  description:
    'Learn to build AI-native software systems. Self-paced courses, live workshops, corporate training, and SCARL certification for developers, founders, and teams.',
};

const content: DivisionOverviewContent = {
  hero: {
    badge: 'Academy · Learn to Build with AI',
    headline: (
      <>
        Learn to Build
        <br />
        <span className="gradient-text">Intelligent Software Systems.</span>
      </>
    ),
    description:
      'Practical, production-focused education for developers and founders who want to build AI-native software — not just use it.',
    buttons: [
      { label: 'Browse courses', href: '/academy/courses', variant: 'primary' },
      { label: 'Free resources', href: '/academy/free', variant: 'ghost' },
    ],
    rightContent: <AcademyHeroVisual />,
  },
  metrics: [
    { numeric: 12, label: 'Courses available' },
    { numeric: 4, label: 'Live workshops per quarter' },
    { numeric: 500, suffix: '+', label: 'Students enrolled' },
    { numeric: 94, suffix: '%', label: 'Completion rate' },
  ],
  servicesLabel: 'How we teach',
  servicesTitle: 'Four ways to learn',
  services: [
    {
      icon: <Play size={28} />,
      title: 'Self-Paced Courses',
      description:
        'Structured curriculum built around real projects. Work through at your own speed — no deadlines, lifetime access, community support.',
      href: '/academy/courses',
      linkText: 'Browse courses',
    },
    {
      icon: <Calendar size={28} />,
      title: 'Live Workshops',
      description:
        'Intensive 1–2 day sessions covering specific skills. Small groups, live instruction, real-time Q&A. Remote and in-person options.',
      href: '/academy/workshops',
      linkText: 'See workshops',
    },
    {
      icon: <Building size={28} />,
      title: 'Corporate Training',
      description:
        'Custom curriculum delivered to your engineering team. We design the programme around your stack, your use cases, your goals.',
      href: '/academy/corporate',
      linkText: 'Explore corporate',
    },
    {
      icon: <Star size={28} />,
      title: 'SCARL Certification',
      description:
        "SocioFi's structured assessment and certification programme for AI-native development. Earn a credential that demonstrates real competency.",
      href: '/academy/certification',
      linkText: 'Learn about SCARL',
    },
  ],
  featuresLabel: 'Our approach',
  featuresTitle: 'Taught by engineers, not educators',
  features: [
    {
      icon: <Rocket size={24} />,
      title: 'Built around real projects',
      description:
        'Every course and workshop is structured around a project you ship — not toy examples or synthetic datasets.',
    },
    {
      icon: <Brain size={24} />,
      title: 'Production-first thinking',
      description:
        "We teach what breaks in production, what scales, and what doesn't. Academic understanding of AI isn't the goal — usable skills are.",
    },
    {
      icon: <Users size={24} />,
      title: 'Taught by practitioners',
      description:
        "Every instructor has shipped AI-native software to production. You're learning from the engineers who do this work, not theorists.",
    },
  ],
  featured: {
    label: 'Flagship course',
    headline: 'AI-Native Development Fundamentals',
    description:
      'The starting point for developers entering the AI-native stack. Architecture patterns, RAG implementation, agent design, deployment, and evaluation — taught through a project you build from scratch and deploy to production.',
    href: '/academy/courses/ai-native-fundamentals',
    cta: 'Explore this course',
  },
  testimonials: [
    {
      quote:
        "I'd been watching AI coding tools evolve for a year but didn't know how to use them for anything beyond autocomplete. This course changed that completely.",
      author: 'James K.',
      role: 'Software Engineer',
      company: 'Self-enrolled',
    },
    {
      quote:
        "The production focus is what sets this apart. I've done other AI courses — they all stop before deployment. This one doesn't.",
      author: 'Priya S.',
      role: 'Full-Stack Developer',
      company: 'Growth-stage startup',
    },
  ],
  cta: {
    title: 'Start learning today',
    subtitle: 'First module of every course is free. No account required to preview.',
    primaryCTA: { label: 'Browse all courses', href: '/academy/courses' },
    ghostCTA: { label: 'Free resources', href: '/academy/free' },
  },
  divisionVariant: 'academy',
};

export default function AcademyPage() {
  return <DivisionOverview content={content} />;
}
