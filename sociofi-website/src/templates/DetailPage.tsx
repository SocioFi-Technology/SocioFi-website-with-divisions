import { ReactNode } from 'react';
import MetricBar, { type Metric } from '@/components/sections/MetricBar';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Card from '@/components/cards/Card';
import AnimatedGrid from '@/components/visual/AnimatedGrid';
import GradientOrbs from '@/components/visual/GradientOrbs';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface DetailMeta {
  category: string;
  title: string;
  subtitle?: string;
  date?: string;
  tags?: string[];
  client?: string;
  duration?: string;
}

export interface DetailSection {
  label?: string;
  headline?: string;
  body: ReactNode;
  visual?: ReactNode;
  /** Visual goes left (default) or right */
  visualSide?: 'left' | 'right';
}

export interface RelatedItem {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
}

export interface DetailPageContent {
  meta: DetailMeta;
  intro: string;
  sections?: DetailSection[];
  outcomes?: Metric[];
  related?: RelatedItem[];
  relatedLabel?: string;
  relatedTitle?: string;
  cta?: {
    title: string;
    subtitle?: string;
    primaryCTA?: { label: string; href: string };
    ghostCTA?: { label: string; href: string };
    note?: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function DetailPage({ content }: { content: DetailPageContent }) {
  const {
    meta, intro, sections = [], outcomes,
    related, relatedLabel = 'Explore more', relatedTitle = 'Related',
    cta,
  } = content;

  return (
    <>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header style={{
        position: 'relative',
        paddingTop: 'calc(var(--space-section) + 60px)',
        paddingBottom: 'var(--space-2xl)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}>
        <AnimatedGrid />
        <GradientOrbs variant="minimal" />

        <Container narrow>
          <ScrollReveal>
            {/* Breadcrumb category */}
            <p className="sec-label" style={{ marginBottom: 20 }}>
              {meta.category}
            </p>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: 'var(--text-primary)',
              marginBottom: meta.subtitle ? 16 : 28,
            }}>
              {meta.title}
            </h1>

            {meta.subtitle && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.15rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: 28,
                maxWidth: '56ch',
              }}>
                {meta.subtitle}
              </p>
            )}

            {/* Meta tags row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
            }}>
              {meta.date && <MetaChip>{meta.date}</MetaChip>}
              {meta.client && <MetaChip label="Client">{meta.client}</MetaChip>}
              {meta.duration && <MetaChip label="Duration">{meta.duration}</MetaChip>}
              {meta.tags?.map((tag) => (
                <span key={tag} className="badge badge-accent">{tag}</span>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </header>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-2xl)', background: 'var(--bg)' }}>
        <Container narrow>
          <ScrollReveal>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              borderLeft: '3px solid var(--division-accent)',
              paddingLeft: 24,
            }}>
              {intro}
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Narrative sections ───────────────────────────────────────────── */}
      {sections.map((sec, i) => {
        const isAlt = i % 2 === 1;
        const hasVisual = !!sec.visual;

        return (
          <section
            key={i}
            style={{
              paddingBlock: 'var(--space-section)',
              background: isAlt ? 'var(--bg-2)' : 'var(--bg)',
            }}
          >
            <Container>
              {hasVisual ? (
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-16"
                  style={{ alignItems: 'center' }}
                >
                  <ScrollReveal direction={sec.visualSide === 'left' ? 'left' : 'right'}>
                    <NarrativeText section={sec} />
                  </ScrollReveal>
                  <ScrollReveal direction={sec.visualSide === 'left' ? 'right' : 'left'}>
                    {sec.visual}
                  </ScrollReveal>
                </div>
              ) : (
                <Container narrow>
                  <ScrollReveal>
                    <NarrativeText section={sec} />
                  </ScrollReveal>
                </Container>
              )}
            </Container>
          </section>
        );
      })}

      {/* ── Outcomes / Metrics ───────────────────────────────────────────── */}
      {outcomes && outcomes.length > 0 && (
        <MetricBar metrics={outcomes} background />
      )}

      {/* ── Related items ────────────────────────────────────────────────── */}
      {related && related.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container>
            <ScrollReveal>
              <div style={{ marginBottom: 48 }}>
                <p className="sec-label">{relatedLabel}</p>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}>
                  {relatedTitle}
                </h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((item, i) => (
                <StaggerItem key={i}>
                  <Card
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    link={item.href}
                    linkText={item.linkText}
                    as="article"
                  />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      {cta && (
        <CTASection
          title={cta.title}
          subtitle={cta.subtitle}
          primaryCTA={cta.primaryCTA}
          ghostCTA={cta.ghostCTA}
          note={cta.note}
        />
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetaChip({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: '0.72rem',
      color: 'var(--text-muted)',
      padding: '5px 12px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-full)',
    }}>
      {label && (
        <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>{label}:</span>
      )}
      {children}
    </span>
  );
}

function NarrativeText({ section }: { section: DetailSection }) {
  return (
    <div>
      {section.label && <p className="sec-label">{section.label}</p>}
      {section.headline && (
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 2.5vw, 2rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          color: 'var(--text-primary)',
          marginBottom: 16,
        }}>
          {section.headline}
        </h2>
      )}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        lineHeight: 1.8,
        color: 'var(--text-secondary)',
      }}>
        {section.body}
      </div>
    </div>
  );
}
