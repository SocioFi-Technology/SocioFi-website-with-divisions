import AudienceLanding, { type AudienceLandingContent } from '@/templates/AudienceLanding';
import type { Metadata } from 'next';
import { Code, Brain, Shield, Users, Star, Book } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Who Academy Is For — SocioFi Technology',
  description:
    'SocioFi Academy is built for developers, founders, and engineering teams who want to build AI-native software — not just use AI tools.',
};

const content: AudienceLandingContent = {
  hero: {
    badge: 'Academy · Who this is for',
    headline: (
      <>
        Built for the people
        <br />
        <span className="gradient-text">actually building this stuff.</span>
      </>
    ),
    description:
      "Academy isn't for everyone, and we don't pretend it is. It's for people who are already building — or seriously trying to build — AI-native software systems.",
    buttons: [
      { label: 'Browse courses', href: '/academy/courses', variant: 'primary' },
      { label: 'See free resources', href: '/academy/free', variant: 'ghost' },
    ],
  },
  painPoints: {
    label: 'Who this is for',
    title: "You're here because one of these is true",
    points: [
      {
        title: "You're a developer who wants to build with AI seriously",
        description:
          "You've used AI coding tools but want to understand how to architect, deploy, and maintain AI-native systems — not just use autocomplete.",
      },
      {
        title: "You're a founder who built something with AI tools",
        description:
          'You have a working prototype — maybe built with an AI coding platform — but it breaks in ways you can\'t debug. You need the production knowledge you\'re missing.',
      },
      {
        title: 'You lead an engineering team going AI-native',
        description:
          'Your team needs to upskill on AI integration, agent architecture, and evaluation frameworks. You want structured training, not YouTube rabbit holes.',
      },
      {
        title: "You're changing careers toward AI development",
        description:
          'You have a software background and want to specialise. You need structured, credentialed learning — not a collection of disconnected tutorials.',
      },
    ],
    closing:
      "If you're building production software and you want to do it better with AI — this is for you.",
  },
  processLabel: 'Your learning path',
  processTitle: 'From first module to production deployment',
  process: [
    {
      title: 'Pick your starting point',
      description:
        'Browse the course catalog or take the 3-question quiz to get a course recommendation based on your background and goals.',
    },
    {
      title: 'Work through the curriculum',
      description:
        'Self-paced courses, live workshops, or a combination. Every module has a project component — theory without practice isn\'t our thing.',
    },
    {
      title: 'Build and deploy',
      description:
        "Every course ends with a deployed project. You leave with working code in production, not just a certificate.",
    },
    {
      title: 'Join the cohort community',
      description:
        'Enrolled students get access to the community channel — active engineers working through the same problems you are.',
    },
  ],
  deliverablesLabel: 'What you leave with',
  deliverablesTitle: 'Outcomes, not credentials',
  deliverables: [
    {
      icon: <Code size={24} />,
      title: 'Production-ready code',
      description: 'A real project, deployed and running, that you built during the course.',
    },
    {
      icon: <Brain size={24} />,
      title: 'Architecture knowledge',
      description:
        'Mental models for RAG systems, agent design, evaluation frameworks, and deployment patterns.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Debug confidence',
      description:
        'The ability to diagnose and fix the failure modes that AI-native systems encounter in production.',
    },
    {
      icon: <Users size={24} />,
      title: 'Peer community',
      description: 'Ongoing access to a community of engineers working on the same class of problems.',
    },
    {
      icon: <Star size={24} />,
      title: 'SCARL certification path',
      description:
        "Completed courses count toward SCARL certification — SocioFi's recognised credential for AI-native development.",
    },
    {
      icon: <Book size={24} />,
      title: 'Lifetime course access',
      description:
        'Course materials, project templates, and updates — accessible permanently after enrollment.',
    },
  ],
  testimonials: [
    {
      quote:
        "I wasn't sure whether this was for me — I had some ML background but no production AI experience. Turns out that's exactly the right starting point.",
      author: 'Daniel R.',
      role: 'ML Engineer',
      company: 'Career transition',
    },
    {
      quote:
        'I enrolled my whole engineering team. Within 6 weeks they had working knowledge of RAG systems and had deployed their first internal AI tool.',
      author: 'CTO',
      role: 'SaaS company, 25 engineers',
      company: 'Corporate training client',
    },
  ],
  metrics: [
    { numeric: 500, suffix: '+', label: 'Students enrolled' },
    { numeric: 94, suffix: '%', label: 'Completion rate' },
    { numeric: 4, label: 'Average hours per week' },
    { numeric: 12, label: 'Courses available' },
  ],
  faqs: [
    {
      question: 'Do I need a computer science degree?',
      answer:
        "No. Academy courses assume you can write code — any language, any level of experience beyond beginner. We don't assume ML or AI background. The AI-Native Development Fundamentals course is specifically designed for developers who are new to the AI-native stack.",
    },
    {
      question: 'How much time does a course take?',
      answer:
        "Typical self-paced courses run 15–25 hours of material. Most students spread this over 4–6 weeks, working a few hours per week. There's no deadline, so you can go faster or slower based on your schedule.",
    },
    {
      question: 'Can my company pay for this?',
      answer:
        'Yes. We issue invoices for corporate enrollment and have a bulk-seat programme for teams of 5 or more. For teams of 10+, we recommend the Corporate Training option — a custom programme designed specifically for your team and delivered live.',
    },
  ],
  cta: {
    title: 'Find the right starting point',
    subtitle: "Not sure where to start? Browse the catalog — every first module is free.",
    primaryCTA: { label: 'Browse all courses', href: '/academy/courses' },
    ghostCTA: { label: 'Talk to us', href: '/contact' },
    note: 'First module of every course is free. No payment needed to start.',
  },
};

export default function AcademyWhoItsForPage() {
  return <AudienceLanding content={content} />;
}
