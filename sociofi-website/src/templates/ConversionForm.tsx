import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal from '@/components/shared/ScrollReveal';
import TrustBar from '@/components/sections/TrustBar';
import ContactForm from '@/components/forms/ContactForm';
import ProjectForm from '@/components/forms/ProjectForm';
import dynamic from 'next/dynamic';

const AnimatedGrid = dynamic(() => import('@/components/visual/AnimatedGrid'), { ssr: false });
const GradientOrbs = dynamic(() => import('@/components/visual/GradientOrbs'), { ssr: false });

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface TrustPoint {
  icon?: React.ReactNode;
  headline: string;
  detail: string;
}

export interface ConversionFormContent {
  badge?: string;
  headline: string;
  description?: string;
  formDefaultDivision?: string;
  formType?: 'contact' | 'project';
  accentColor?: string;
  trustItems?: string[];
  sidebar: {
    headline?: string;
    points: TrustPoint[];
    testimonial?: {
      quote: string;
      author: string;
      role: string;
    };
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function ConversionForm({ content }: { content: ConversionFormContent }) {
  const { badge, headline, description, formDefaultDivision, formType = 'contact', sidebar, trustItems } = content;

  return (
    <>
      <section style={{
        position: 'relative',
        paddingBlock: 'var(--space-section)',
        background: 'var(--bg)',
        overflow: 'hidden',
        minHeight: '100vh',
      }}>
        <AnimatedGrid />
        <GradientOrbs variant="minimal" />

        <Container>
          {/* Section header */}
          <ScrollReveal>
            <SectionHeader
              label={badge ?? 'Get in touch'}
              title={headline}
              subtitle={description}
              centered
              className="mb-14"
            />
          </ScrollReveal>

          {/* 2-column layout: form + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* ── Form (60%) ───────────────────────────────────────────── */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="right">
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '40px 36px',
                }}>
                  {formType === 'project'
                    ? <ProjectForm />
                    : <ContactForm defaultDivision={formDefaultDivision} />
                  }
                </div>
              </ScrollReveal>
            </div>

            {/* ── Trust sidebar (40%) ──────────────────────────────────── */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <div style={{
                  position: 'sticky',
                  top: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                }}>
                  {sidebar.headline && (
                    <h3 style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                    }}>
                      {sidebar.headline}
                    </h3>
                  )}

                  {/* Trust points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {sidebar.points.map((point, i) => (
                      <TrustPoint key={i} point={point} />
                    ))}
                  </div>

                  {/* Testimonial */}
                  {sidebar.testimonial && (
                    <div style={{
                      padding: '24px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      position: 'relative',
                    }}>
                      {/* Top accent stripe */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, height: 2,
                        background: 'linear-gradient(90deg, var(--navy), var(--division-accent))',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                      }} aria-hidden="true" />

                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.92rem',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        marginBottom: 16,
                      }}>
                        &ldquo;{sidebar.testimonial.quote}&rdquo;
                      </p>
                      <div style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}>
                        {sidebar.testimonial.author}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginTop: 2,
                      }}>
                        {sidebar.testimonial.role}
                      </div>
                    </div>
                  )}

                  {/* Response time callout */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 18px',
                    background: 'color-mix(in srgb, var(--division-accent) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--division-accent) 15%, transparent)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#4ade80',
                      flexShrink: 0,
                    }} aria-hidden="true" />
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}>
                      We respond within <strong style={{ color: 'var(--text-primary)' }}>4 hours</strong> on business days.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </Container>
      </section>

      {/* TrustBar — before footer */}
      {trustItems && trustItems.length > 0 && (
        <TrustBar items={trustItems} />
      )}
    </>
  );
}

function TrustPoint({ point }: { point: TrustPoint }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      {point.icon ? (
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-sm)',
          background: 'color-mix(in srgb, var(--division-accent) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--division-accent) 20%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--division-accent)',
        }}>
          {point.icon}
        </div>
      ) : (
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--division-accent)',
          flexShrink: 0,
          marginTop: 7,
        }} aria-hidden="true" />
      )}
      <div>
        <div style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '0.92rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 3,
        }}>
          {point.headline}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
        }}>
          {point.detail}
        </div>
      </div>
    </div>
  );
}
