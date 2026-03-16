import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Target,
  Book,
  Users,
  Code,
  Chart,
  Shield,
} from '@/lib/icons';

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Corporate Training — SocioFi Academy',
  description:
    'Custom AI development training for engineering teams. We design the curriculum around your stack, your use cases, and your target capability level.',
  openGraph: {
    title: 'Corporate Training — SocioFi Academy',
    description:
      'Custom AI development training for engineering teams. We design the curriculum around your stack, your use cases, and your target capability level.',
    type: 'website',
    images: [{ url: '/og-image.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

// ── Content ───────────────────────────────────────────────────────────────────

const content: ServiceDetailContent = {
  hero: {
    badge: 'Academy · Corporate training',
    headline: (
      <>
        AI training built for
        <br />
        <span className="gradient-text">your engineering team.</span>
      </>
    ),
    description:
      'Off-the-shelf AI courses don\'t cover your stack, your use cases, or your team\'s specific gaps. Corporate training starts with a capability assessment and ends with a curriculum your team actually completes.',
    buttons: [
      { label: 'Talk to us', href: '/contact', variant: 'primary' },
      { label: 'Browse courses', href: '/academy/courses', variant: 'ghost' },
    ],
  },
  problem: {
    label: 'The problem with generic AI training',
    headline: 'Your team is different. Generic courses aren\'t.',
    description:
      'Most corporate AI training delivers the same content to everyone, evaluates nobody, and produces certificates that don\'t translate to capability. We don\'t do that.',
    points: [
      'Generic courses teach tools your team doesn\'t use and skip the ones they do',
      'No capability assessment means covering what people already know and skipping what they need',
      'Completion certificates aren\'t proof of production readiness',
      'Off-the-shelf content goes stale quickly as the AI landscape shifts',
      'No follow-up means capability regression within weeks of the training',
    ],
  },
  capabilitiesLabel: 'What we deliver',
  capabilitiesTitle: 'Custom training that transfers',
  capabilities: [
    {
      icon: <Target size={24} />,
      title: 'Capability assessment',
      description:
        'We assess your team\'s current AI development capability before designing the curriculum. No time wasted on what they already know.',
    },
    {
      icon: <Book size={24} />,
      title: 'Custom curriculum design',
      description:
        'The programme is built around your stack, your use cases, and your target capability level — not a generic AI survey course.',
    },
    {
      icon: <Users size={24} />,
      title: 'Live delivery',
      description:
        'Delivered by SocioFi engineers who build AI systems for production. Not trainers reading slides — practitioners explaining what they actually do.',
    },
    {
      icon: <Code size={24} />,
      title: 'Hands-on projects',
      description:
        'Your team builds something relevant to your business during the training. Not toy examples — real features in your real tech stack.',
    },
    {
      icon: <Chart size={24} />,
      title: 'Outcome measurement',
      description:
        'We measure capability before and after. You see what changed — not just that people attended.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Post-training support',
      description:
        'Teams get 30 days of async support after delivery. Questions that come up during real implementation get answered.',
    },
  ],
  processLabel: 'How it works',
  processTitle: 'From brief to delivery in 3–4 weeks',
  process: [
    {
      title: 'Discovery call',
      description:
        'We understand your team\'s current capability, your tech stack, the use cases you\'re targeting, and the outcomes you need.',
    },
    {
      title: 'Curriculum design',
      description:
        'We design the programme — modules, projects, timing, and delivery format. You review and approve before we build.',
    },
    {
      title: 'Delivery',
      description:
        'Typically 2–3 days of live instruction plus project work. Remote or in-person. Cohorts up to 20 engineers.',
    },
    {
      title: 'Measurement and support',
      description:
        'Post-training capability measurement plus 30 days of async support while your team applies what they learned.',
    },
  ],
  caseStudy: {
    label: 'Recent engagement',
    headline: 'Fintech team: zero to production RAG in 3 weeks',
    description:
      'A 12-person engineering team at a fintech company had no AI development experience. After a 2-day custom training programme focused on RAG systems for document processing, the team deployed their first production AI feature 3 weeks later.',
    result: '3 weeks',
    resultLabel: 'from no AI experience to first production AI feature',
  },
  faqs: [
    {
      question: 'What\'s the minimum team size?',
      answer:
        'We work with teams of 5 or more. For teams of 2–4, we recommend enrolling individuals in the relevant self-paced courses rather than commissioning a custom programme — the economics work out better.',
    },
    {
      question: 'How long does it take to design a custom programme?',
      answer:
        'Discovery to delivery typically takes 3–4 weeks. The discovery call is 60 minutes. Curriculum design and review takes about a week. Delivery is typically 2–3 days. We can move faster for time-sensitive situations.',
    },
    {
      question: 'Can you deliver in our office?',
      answer:
        'Yes. In-person delivery is available for teams in Dhaka, and for other locations with sufficient lead time and travel accommodation. Remote delivery via video conference is available globally and works well for teams up to 20 people.',
    },
  ],
  cta: {
    title: 'Design your team\'s training programme',
    subtitle:
      'Discovery call is free. Curriculum proposal within 5 business days.',
    primaryCTA: { label: 'Book discovery call', href: '/contact' },
    note: 'Remote delivery available globally. In-person in Dhaka.',
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CorporateTrainingPage() {
  return <ServiceDetail content={content} />;
}
