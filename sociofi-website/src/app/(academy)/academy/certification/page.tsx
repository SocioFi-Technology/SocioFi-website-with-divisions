import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Layers, Code, Rocket, Shield } from '@/lib/icons';

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'SCARL Certification — SocioFi Academy',
  description:
    "SCARL is SocioFi's structured certification programme for AI-native software development. Earn a credential that demonstrates production-level competency.",
  openGraph: {
    title: 'SCARL Certification — SocioFi Academy',
    description:
      "SCARL is SocioFi's structured certification programme for AI-native software development. Earn a credential that demonstrates production-level competency.",
    type: 'website',
    images: [{ url: '/og-image.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

// ── Content ───────────────────────────────────────────────────────────────────

const content: ServiceDetailContent = {
  hero: {
    badge: 'Academy · SCARL Certification',
    headline: (
      <>
        A credential that proves
        <br />
        <span className="gradient-text">production competency.</span>
      </>
    ),
    description:
      'SCARL (SocioFi Certified AI-Ready Level) is a structured assessment and certification programme. Not a completion certificate — a competency credential earned through demonstrated project work and technical review.',
    buttons: [
      { label: 'Start the path', href: '/academy/courses', variant: 'primary' },
      { label: 'Read the FAQ', href: '/academy/certification/faq', variant: 'ghost' },
    ],
  },
  problem: {
    label: 'The problem with AI credentials',
    headline: "Completion certificates don't prove competency",
    description:
      "Most AI credentials certify that you watched the videos. SCARL certifies that you can build.",
    points: [
      'Completion certificates prove attendance — not understanding or capability',
      'No standardised bar means the same credential means different things from different providers',
      "Employers and clients can't verify what a certificate-holder actually knows",
      "Credentials that don't require project work don't prepare you for project work",
    ],
  },
  capabilitiesLabel: 'What SCARL assesses',
  capabilitiesTitle: 'Four competency domains',
  capabilities: [
    {
      icon: <Layers size={24} />,
      title: 'Architecture & Design',
      description:
        'Selecting appropriate AI architectures for given problems, designing system components, and identifying architectural failure modes.',
    },
    {
      icon: <Code size={24} />,
      title: 'Implementation',
      description:
        'Building RAG systems, agent loops, and evaluation frameworks that work correctly under real conditions.',
    },
    {
      icon: <Rocket size={24} />,
      title: 'Production Operations',
      description:
        'Deploying, monitoring, debugging, and maintaining AI-native systems in production environments.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Quality & Evaluation',
      description:
        'Designing evaluation frameworks, building ground truth datasets, and maintaining quality as systems evolve.',
    },
  ],
  processLabel: 'The certification path',
  processTitle: 'Four stages to SCARL certification',
  process: [
    {
      title: 'Complete prerequisite courses',
      description:
        'SCARL requires completion of AI-Native Development Fundamentals plus at least two elective courses from the catalog.',
    },
    {
      title: 'Build your capstone project',
      description:
        'A real production AI system — designed, built, deployed, and documented by you. Specifications are provided; implementation is yours.',
    },
    {
      title: 'Technical review',
      description:
        'A 90-minute technical review with a SocioFi engineer. Live code walkthrough, architecture discussion, and Q&A on your design decisions.',
    },
    {
      title: 'Certification awarded',
      description:
        'Candidates who pass the technical review receive SCARL certification — with a verifiable credential and a listing in the SCARL registry.',
    },
  ],
  caseStudy: {
    label: 'First SCARL cohort',
    headline: '12 candidates. 9 certified. All hired or promoted within 6 months.',
    description:
      'The first SCARL cohort ran in late 2025. Of the 12 candidates who completed the capstone and entered the technical review, 9 passed. Within 6 months, all 9 had either been promoted to senior roles or secured positions specifically citing the credential.',
    result: '9/12',
    resultLabel: 'passed the technical review in the first cohort',
  },
  faqs: [
    {
      question: 'How is SCARL different from other AI certifications?',
      answer:
        "SCARL requires building and deploying a real project — not multiple choice questions or video completion tracking. The technical review involves live discussion of your actual code with a practising engineer. There's no shortcut: you either demonstrate production competency or you don't pass.",
    },
    {
      question: 'How long does the certification path take?',
      answer:
        'Most candidates complete the prerequisite courses and capstone project in 4–6 months, working a few hours per week alongside their existing job. The technical review is scheduled after the capstone is complete — typically within 2 weeks of submission.',
    },
    {
      question: 'What does the credential prove to employers?',
      answer:
        "SCARL certification is verifiable — employers can check the registry. It proves that the candidate built and deployed a production AI system to a specification, and explained their design decisions to an experienced AI engineer under review conditions. It's a stronger signal than any completion certificate.",
    },
  ],
  cta: {
    title: 'Start the SCARL path',
    subtitle:
      'Begin with AI-Native Development Fundamentals — the first prerequisite course.',
    primaryCTA: { label: 'Start the path', href: '/academy/courses/ai-native-fundamentals' },
    ghostCTA: { label: 'Read the FAQ', href: '/academy/certification/faq' },
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CertificationPage() {
  return <ServiceDetail content={content} />;
}
