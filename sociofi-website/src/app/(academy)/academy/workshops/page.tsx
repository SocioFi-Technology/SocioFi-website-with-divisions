import GridListing, { type GridListingContent } from '@/templates/GridListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workshops — SocioFi Academy',
  description:
    'Intensive live workshops on AI-native development topics. Small groups, expert instruction, real-time Q&A. Remote and in-person options.',
};

const content: GridListingContent = {
  hero: {
    badge: 'Academy · Workshops',
    headline: 'Intensive learning. Live instruction.',
    description:
      'Small-group workshops with real-time instruction, live Q&A, and a project you complete during the session. Remote and in-person options each quarter.',
  },
  categories: ['Development', 'Architecture', 'For Teams', 'For Founders'],
  pageSize: 9,
  items: [
    {
      type: 'course',
      title: 'Deploy Your First AI Feature',
      description:
        'One day. Walk in with an idea, leave with a deployed AI feature. Hands-on build session with live instruction throughout.',
      duration: '1 day',
      level: 'Beginner · Remote',
      price: '$199',
      category: 'Development',
    },
    {
      type: 'course',
      title: 'Agent Architecture Design Sprint',
      description:
        '2-day intensive on multi-agent system design. Teams leave with an architecture document and a working prototype of their target system.',
      duration: '2 days',
      level: 'Intermediate · Remote',
      price: '$499',
      category: 'Architecture',
    },
    {
      type: 'course',
      title: 'RAG System Build Day',
      description:
        'Full-day workshop: implement a complete RAG pipeline from scratch, covering chunking, embedding, retrieval, re-ranking, and evaluation.',
      duration: '1 day',
      level: 'Intermediate · Remote',
      price: '$249',
      category: 'Development',
    },
    {
      type: 'course',
      title: 'AI for Technical Leaders',
      description:
        'Half-day session for engineering managers and CTOs. How to evaluate AI development proposals, architect AI-native systems, and lead teams through the transition.',
      duration: 'Half day',
      level: 'Leadership · Remote',
      price: '$349',
      category: 'For Teams',
    },
    {
      type: 'course',
      title: 'Production Debugging Sprint',
      description:
        "Hands-on debugging session. Bring your broken AI system — we'll diagnose it live and teach the diagnostic patterns in the process.",
      duration: '1 day',
      level: 'Intermediate · Remote',
      price: '$299',
      category: 'Development',
    },
    {
      type: 'course',
      title: 'AI for Non-Technical Founders — Live',
      description:
        'Half-day live version of the self-paced course. Interactive Q&A, group discussion, and a direct line to an experienced AI engineer.',
      duration: 'Half day',
      level: 'Beginner · Remote',
      price: '$149',
      category: 'For Founders',
    },
    {
      type: 'course',
      title: 'Team AI Upskill Workshop',
      description:
        'Custom 2-day programme for engineering teams of 5–20. Curriculum tailored to your stack, your current AI usage, and your target capability level.',
      duration: '2 days',
      level: 'Intermediate · In-person / Remote',
      price: 'From $3,500',
      category: 'For Teams',
    },
    {
      type: 'course',
      title: 'Prompt Engineering Workshop',
      description:
        'Full-day systematic prompt engineering session. Design, test, version, and evaluate prompts for production systems.',
      duration: '1 day',
      level: 'Beginner · Remote',
      price: '$199',
      category: 'Development',
    },
  ],
};

export default function AcademyWorkshopsPage() {
  return <GridListing content={content} />;
}
