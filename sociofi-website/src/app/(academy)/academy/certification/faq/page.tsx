import type { Metadata } from 'next';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import Container from '@/components/shared/Container';
import ScrollReveal from '@/components/shared/ScrollReveal';
import AnimatedGrid from '@/components/visual/AnimatedGrid';

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'SCARL Certification FAQ — SocioFi Academy',
  description:
    'Common questions about the SCARL certification programme: eligibility, cost, timeline, technical review, and what the credential means for your career.',
  openGraph: {
    title: 'SCARL Certification FAQ — SocioFi Academy',
    description:
      'Common questions about the SCARL certification programme: eligibility, cost, timeline, technical review, and what the credential means for your career.',
    type: 'website',
    images: [{ url: '/og-image.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

// ── FAQ data ──────────────────────────────────────────────────────────────────

const faqs: FAQItem[] = [
  {
    question: 'Who is eligible for SCARL certification?',
    answer:
      'Anyone who has completed the prerequisite courses (AI-Native Development Fundamentals plus two electives) and submitted a qualifying capstone project. There are no restrictions based on employment, location, or formal education background.',
  },
  {
    question: 'What are the prerequisite courses?',
    answer:
      'AI-Native Development Fundamentals is required. You then need to complete at least two elective courses from the catalog. The electives can be any courses — we recommend choosing based on the domain your capstone project covers.',
  },
  {
    question: 'What is the capstone project?',
    answer:
      'A production AI system that you design, build, deploy, and document. We provide a specification with requirements and constraints — you implement it. The system must be deployed to live infrastructure and accessible during the technical review. Source code must be submitted one week before the review.',
  },
  {
    question: 'How does the technical review work?',
    answer:
      'The technical review is a 90-minute video call with a senior SocioFi engineer. It involves a live walkthrough of your deployed system and source code, followed by questions about your architectural decisions, trade-offs, and how you would approach changes to the requirements. You should be prepared to discuss any part of your implementation in detail.',
  },
  {
    question: "What happens if I don't pass the technical review?",
    answer:
      "Candidates who don't pass are given specific, written feedback on the areas that need improvement. You can resubmit an updated capstone project after 60 days. There's no limit on the number of attempts, and the review fee covers one attempt plus one resubmission.",
  },
  {
    question: 'How much does certification cost?',
    answer:
      'The technical review and certification fee is $499. This covers the 90-minute review session, written feedback regardless of outcome, and one resubmission if needed. Prerequisite course costs are separate — see individual course pages for pricing.',
  },
  {
    question: 'How long is the credential valid?',
    answer:
      "SCARL certification doesn't expire. The AI landscape changes quickly, but the credential reflects the competency you demonstrated at the time of certification — which is a real signal to employers. We're developing a renewal track for major AI architecture shifts.",
  },
  {
    question: 'Can my employer sponsor the certification?',
    answer:
      'Yes. We issue invoices for corporate-sponsored certifications and can run group cohorts for teams. For teams of 5 or more candidates, contact us for group pricing and cohort scheduling.',
  },
  {
    question: 'Is SCARL recognised by employers?',
    answer:
      "SCARL is a SocioFi credential — it's not an industry-standard certification like AWS or Google Cloud. What it does offer is verifiability (employers can check the registry) and a clear description of what the assessment involved, which gives it more signal value than typical completion certificates.",
  },
  {
    question: 'Where can I verify a SCARL credential?',
    answer:
      'The SCARL registry is publicly accessible. Certified candidates are listed by name and certification date. Candidates receive a shareable verification link they can include in their CV, LinkedIn profile, or portfolio.',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CertificationFAQPage() {
  return (
    <main>
      {/* Header */}
      <section
        style={{
          position: 'relative',
          background: 'var(--bg)',
          paddingTop: 'calc(var(--space-section) + 60px)',
          paddingBottom: 'var(--space-3xl)',
          overflow: 'hidden',
        }}
      >
        <AnimatedGrid />
        <Container>
          <ScrollReveal>
            <div
              className="sec-label"
              style={{ marginBottom: 16 }}
            >
              SCARL Certification
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 700,
                lineHeight: 1.12,
                color: 'var(--text-primary)',
                letterSpacing: '-0.025em',
                marginBottom: 20,
              }}
            >
              Certification FAQ
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                maxWidth: 560,
              }}
            >
              Common questions about eligibility, the assessment process, timeline, and what SCARL
              means for your career.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* FAQ */}
      <FAQAccordion
        items={faqs}
        accentColor="var(--academy, #E8B84D)"
        standalone
      />
    </main>
  );
}
