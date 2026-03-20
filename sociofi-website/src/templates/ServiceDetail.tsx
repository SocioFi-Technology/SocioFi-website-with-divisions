import { ReactNode } from 'react';
import Hero, { type HeroButton } from '@/components/sections/Hero';
import ProcessTimeline, { type TimelineStep } from '@/components/sections/ProcessTimeline';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Card from '@/components/cards/Card';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface ServiceCapability {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface CaseStudyPreview {
  label?: string;
  headline: string;
  description: string;
  result: string;
  resultLabel?: string;
  href?: string;
}

export interface ServiceDetailContent {
  hero: {
    badge?: string;
    headline: ReactNode;
    description: string;
    buttons?: HeroButton[];
  };
  problem: {
    label?: string;
    headline: string;
    description: string;
    points?: string[];
  };
  capabilities: ServiceCapability[];
  capabilitiesLabel?: string;
  capabilitiesTitle?: string;
  process: TimelineStep[];
  processLabel?: string;
  processTitle?: string;
  caseStudy?: CaseStudyPreview;
  faqs?: FAQItem[];
  cta: {
    title: string;
    subtitle?: string;
    primaryCTA?: { label: string; href: string };
    ghostCTA?: { label: string; href: string };
    note?: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function ServiceDetail({ content }: { content: ServiceDetailContent }) {
  const {
    hero, problem, capabilities,
    capabilitiesLabel = 'Capabilities',
    capabilitiesTitle = 'What we deliver',
    process,
    processLabel = 'How it works',
    processTitle = 'A clear path to done',
    caseStudy, faqs, cta,
  } = content;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Hero
        badge={hero.badge}
        headline={hero.headline}
        description={hero.description}
        buttons={hero.buttons}
        layout="centered"
        showGrid
        showOrbs
      />

      {/* ── Problem statement ────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container narrow>
          <ScrollReveal>
            <SectionHeader
              label={problem.label ?? 'The problem'}
              title={problem.headline}
              subtitle={problem.description}
              className="mb-10"
            />
          </ScrollReveal>

          {problem.points && problem.points.length > 0 && (
            <StaggerChildren className="flex flex-col gap-3">
              {problem.points.map((point, i) => (
                <StaggerItem key={i}>
                  <div style={{
                    display: 'flex',
                    gap: 14,
                    padding: '16px 20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(232,145,111,0.1)',
                      border: '1.5px solid rgba(232,145,111,0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" width={12} height={12}
                        stroke="#E8916F" strokeWidth={2} strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </span>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {point}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </Container>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label={capabilitiesLabel}
              title={capabilitiesTitle}
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap, i) => (
              <StaggerItem key={i}>
                <Card
                  title={cap.title}
                  description={cap.description}
                  icon={cap.icon}
                  as="article"
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ── Process timeline ─────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16" style={{ alignItems: 'start' }}>
            <ScrollReveal direction="right">
              <SectionHeader
                label={processLabel}
                title={processTitle}
                className="mb-8"
              />
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
              }}>
                We keep things transparent. You always know where your project stands.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <ProcessTimeline steps={process} />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── Case study preview ───────────────────────────────────────────── */}
      {caseStudy && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container narrow>
            <ScrollReveal>
              <div style={{
                padding: '48px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Accent top stripe */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, var(--navy), var(--division-accent))',
                }} aria-hidden="true" />

                <p className="sec-label">{caseStudy.label ?? 'Case study'}</p>
                <h3 style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                }}>
                  {caseStudy.headline}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  marginBottom: 28,
                  maxWidth: '60ch',
                }}>
                  {caseStudy.description}
                </p>

                {/* Result callout */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 20px',
                  background: 'color-mix(in srgb, var(--division-accent) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--division-accent) 20%, transparent)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: caseStudy.href ? 28 : 0,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    letterSpacing: '-0.03em',
                    color: 'var(--division-accent)',
                  }}>
                    {caseStudy.result}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                  }}>
                    {caseStudy.resultLabel ?? 'measured outcome'}
                  </span>
                </div>

                {caseStudy.href && (
                  <div>
                    <a
                      href={caseStudy.href}
                      className="hover-arrow"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--division-accent)',
                      }}
                    >
                      Read the full case study
                      <svg viewBox="0 0 24 24" fill="none" width={16} height={16}
                        stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                        strokeLinejoin="round" className="arrow-icon" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <>
          <div style={{ paddingTop: 'var(--space-section)', paddingInline: 32 }}>
            <ScrollReveal>
              <SectionHeader
                label="FAQ"
                title="Common questions"
                centered
                className="mb-0"
              />
            </ScrollReveal>
          </div>
          <FAQAccordion items={faqs} standalone />
        </>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CTASection
        title={cta.title}
        subtitle={cta.subtitle}
        primaryCTA={cta.primaryCTA}
        ghostCTA={cta.ghostCTA}
        note={cta.note}
      />
    </>
  );
}
