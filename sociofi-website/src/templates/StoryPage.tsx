import { ReactNode } from 'react';
import Hero, { type HeroButton } from '@/components/sections/Hero';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Card from '@/components/cards/Card';
import TeamCard from '@/components/cards/TeamCard';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface NarrativeSection {
  label?: string;
  headline: string;
  body: ReactNode;
  visual?: ReactNode;
  /** Visual position: right (default) or left */
  visualSide?: 'left' | 'right';
  stat?: { value: string; label: string };
}

export interface Value {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
}

export interface StoryPageContent {
  hero: {
    badge?: string;
    headline: ReactNode;
    description: string;
    buttons?: HeroButton[];
  };
  narrative: NarrativeSection[];
  values?: Value[];
  valuesLabel?: string;
  valuesTitle?: string;
  team?: TeamMember[];
  teamLabel?: string;
  teamTitle?: string;
  teamSubtitle?: string;
  cta: {
    title: string;
    subtitle?: string;
    primaryCTA?: { label: string; href: string };
    ghostCTA?: { label: string; href: string };
    note?: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function StoryPage({ content }: { content: StoryPageContent }) {
  const {
    hero, narrative,
    values, valuesLabel = 'What drives us', valuesTitle = 'Our principles',
    team, teamLabel = 'The team', teamTitle = 'Built by people who care',
    teamSubtitle, cta,
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

      {/* ── Narrative sections ───────────────────────────────────────────── */}
      {narrative.map((section, i) => {
        const isAlt = i % 2 === 1;
        const hasVisual = !!section.visual;
        const visualOnLeft = section.visualSide === 'left';

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
                  {/* Swap order based on visualSide */}
                  {visualOnLeft ? (
                    <>
                      <ScrollReveal direction="right">
                        {section.visual}
                      </ScrollReveal>
                      <ScrollReveal direction="left">
                        <NarrativeContent section={section} />
                      </ScrollReveal>
                    </>
                  ) : (
                    <>
                      <ScrollReveal direction="right">
                        <NarrativeContent section={section} />
                      </ScrollReveal>
                      <ScrollReveal direction="left">
                        {section.visual}
                      </ScrollReveal>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ maxWidth: 720, marginInline: 'auto' }}>
                  <ScrollReveal>
                    <NarrativeContent section={section} />
                  </ScrollReveal>
                </div>
              )}
            </Container>
          </section>
        );
      })}

      {/* ── Values grid ──────────────────────────────────────────────────── */}
      {values && values.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label={valuesLabel}
                title={valuesTitle}
                centered
                className="mb-14"
              />
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((val, i) => (
                <StaggerItem key={i}>
                  <Card
                    title={val.title}
                    description={val.description}
                    icon={val.icon}
                    as="article"
                  />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      {team && team.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label={teamLabel}
                title={teamTitle}
                subtitle={teamSubtitle}
                centered
                className="mb-14"
              />
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {team.map((member, i) => (
                <StaggerItem key={i}>
                  <TeamCard
                    name={member.name}
                    role={member.role}
                    bio={member.bio}
                  />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
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

// ── Sub-component ─────────────────────────────────────────────────────────────

function NarrativeContent({ section }: { section: NarrativeSection }) {
  return (
    <div>
      {section.label && <p className="sec-label">{section.label}</p>}
      <h2 style={{
        fontFamily: 'var(--font-headline)',
        fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        color: 'var(--text-primary)',
        marginBottom: 20,
      }}>
        {section.headline}
      </h2>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1.05rem',
        lineHeight: 1.8,
        color: 'var(--text-secondary)',
      }}>
        {section.body}
      </div>
      {section.stat && (
        <div style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '2.4rem',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            color: 'var(--division-accent)',
          }}>
            {section.stat.value}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {section.stat.label}
          </span>
        </div>
      )}
    </div>
  );
}
