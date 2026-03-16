import GridListing, { type GridListingContent } from '@/templates/GridListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses — SocioFi Academy',
  description:
    'Browse SocioFi Academy courses: AI-native development, RAG systems, multi-agent design, production debugging, and more. Self-paced with lifetime access.',
};

const content: GridListingContent = {
  hero: {
    badge: 'Academy · Courses',
    headline: 'Learn to build. Actually build.',
    description:
      'Self-paced courses built around real projects. Start free, enroll when ready, deploy before you finish.',
  },
  categories: ['Foundations', 'RAG & Retrieval', 'Agent Systems', 'Production', 'For Founders'],
  pageSize: 9,
  items: [
    {
      type: 'course',
      title: 'AI-Native Development Fundamentals',
      description:
        'The complete starting point. Architecture patterns, RAG implementation, agent basics, deployment, and evaluation — built around a project you ship.',
      duration: '22 hours',
      level: 'Intermediate',
      price: '$299',
      category: 'Foundations',
    },
    {
      type: 'course',
      title: 'Building Production RAG Systems',
      description:
        'Beyond hello-world retrieval. Chunking strategies, embedding selection, re-ranking, hallucination mitigation, and evaluation frameworks for real-world use.',
      duration: '18 hours',
      level: 'Intermediate',
      price: '$249',
      category: 'RAG & Retrieval',
    },
    {
      type: 'course',
      title: 'Multi-Agent System Design',
      description:
        'Designing agent networks that work in production: coordination patterns, tool design, context management, failure recovery, and cost control.',
      duration: '24 hours',
      level: 'Advanced',
      price: '$349',
      category: 'Agent Systems',
    },
    {
      type: 'course',
      title: 'From Prototype to Production',
      description:
        'For founders and developers who built something with AI tools and now need to make it production-ready. Auth, deployment, monitoring, and maintenance.',
      duration: '16 hours',
      level: 'Intermediate',
      price: '$249',
      category: 'For Founders',
    },
    {
      type: 'course',
      title: 'AI Code Review & Quality Assurance',
      description:
        'How to review AI-generated code, the failure patterns to look for, and the quality gates that catch them before they reach production.',
      duration: '14 hours',
      level: 'Intermediate',
      price: '$199',
      category: 'Production',
    },
    {
      type: 'course',
      title: 'Prompt Engineering for Engineers',
      description:
        'Not the hype version. Systematic prompt design, testing, versioning, and evaluation — for engineers building systems that use LLMs.',
      duration: '10 hours',
      level: 'Beginner',
      price: '$149',
      category: 'Foundations',
    },
    {
      type: 'course',
      title: 'Context Window Management',
      description:
        'The technical foundations of how language models process context, and the practical patterns for managing long-running tasks within token constraints.',
      duration: '12 hours',
      level: 'Advanced',
      price: '$199',
      category: 'Agent Systems',
    },
    {
      type: 'course',
      title: 'AI System Evaluation Frameworks',
      description:
        "How to measure whether your AI system is doing what it's supposed to do. Ground truth datasets, evaluation metrics, regression testing, and monitoring.",
      duration: '15 hours',
      level: 'Intermediate',
      price: '$229',
      category: 'Production',
    },
    {
      type: 'course',
      title: 'Building Internal AI Tools',
      description:
        'Practical course for teams building AI-powered internal tools: dashboards, document processing, workflow automation, and data analysis — without building a startup.',
      duration: '14 hours',
      level: 'Beginner',
      price: '$149',
      category: 'For Founders',
    },
    {
      type: 'course',
      title: 'LLM Fine-Tuning in Practice',
      description:
        "When to fine-tune, when not to, how to prepare training data, evaluate fine-tuned models, and deploy them without breaking your inference costs.",
      duration: '20 hours',
      level: 'Advanced',
      price: '$299',
      category: 'Foundations',
    },
    {
      type: 'course',
      title: 'Debugging AI Systems',
      description:
        "A practitioner's guide to diagnosing AI-native system failures: tracing, logging, replay testing, and the specific failure modes that AI introduces.",
      duration: '12 hours',
      level: 'Intermediate',
      price: '$179',
      category: 'Production',
    },
    {
      type: 'course',
      title: 'AI for Non-Technical Founders',
      description:
        "What founders need to understand about AI development: what it can and can't do, how to spec AI features, how to evaluate what your team builds.",
      duration: '8 hours',
      level: 'Beginner',
      price: '$99',
      category: 'For Founders',
    },
  ],
};

export default function AcademyCoursesPage() {
  return <GridListing content={content} />;
}
