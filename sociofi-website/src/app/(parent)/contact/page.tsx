import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import AnimatedGrid from '@/components/visual/AnimatedGrid';
import GradientOrbs from '@/components/visual/GradientOrbs';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ContactForm from '@/components/forms/ContactForm';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import TrustBar from '@/components/sections/TrustBar';

export const metadata: Metadata = {
  title: 'Contact — SocioFi Technology',
  description:
    "No pitch. No pressure. Just a conversation with an engineer who can actually help. Tell us what you're building.",
};

const faqItems: FAQItem[] = [
  {
    question: 'How quickly do you respond?',
    answer:
      'Within 4 hours on business days — usually faster. You hear from an actual engineer, not an automated acknowledgement.',
  },
  {
    question: "What if I'm not sure which division I need?",
    answer:
      "Tell us what you're trying to do and we'll point you in the right direction. That's what the intro call is for.",
  },
  {
    question: "Do you work with projects at any stage?",
    answer:
      "Yes — from 'I have an idea and no code' to 'I have code that's broken in production.' We've seen every stage and helped at every stage.",
  },
  {
    question: 'How do you price projects?',
    answer:
      "Fixed scope, fixed price. We scope your project carefully before we write a line of code, then give you a number. No hourly billing, no surprise invoices.",
  },
  {
    question: 'Are you based in Bangladesh? Do you work with international clients?',
    answer:
      "We're based in Dhaka, Bangladesh — and most of our clients are outside Bangladesh. We work with founders and teams in Europe, the Middle East, North America, and Southeast Asia.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Main section ──────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        paddingTop: 'calc(var(--space-section) + 40px)',
        paddingBottom: 'var(--space-section)',
        background: 'var(--bg)',
        overflow: 'hidden',
        minHeight: '100vh',
      }}>
        <AnimatedGrid />
        <GradientOrbs variant="minimal" />

        <Container>
          {/* Header */}
          <ScrollReveal>
            <div style={{ maxWidth: 600, marginBottom: 64 }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem', fontWeight: 500,
                color: 'var(--teal)', textTransform: 'uppercase',
                letterSpacing: '0.12em', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
                Get in touch
              </p>
              <h1 style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.08,
                color: 'var(--text-primary)', marginBottom: 20,
              }}>
                No Pitch. No Pressure.<br />Just a Conversation.
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem', lineHeight: 1.75,
                color: 'var(--text-secondary)', margin: 0,
              }}>
                Fill in the form and a real engineer reviews it within 4 hours. No automated sales sequence, no SDR handoff — just a direct reply from someone who can actually help.
              </p>
            </div>
          </ScrollReveal>

          {/* 2-column layout */}
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
                  <ContactForm />
                </div>
              </ScrollReveal>
            </div>

            {/* ── Right sidebar (40%) ──────────────────────────────────── */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <div style={{ position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* Book a Free Call card */}
                  <div style={{
                    padding: '28px 24px',
                    background: 'linear-gradient(135deg, var(--navy-deep) 0%, rgba(89,163,146,0.15) 100%)',
                    border: '1px solid rgba(89,163,146,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div aria-hidden="true" style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                      background: 'linear-gradient(90deg, var(--navy), var(--teal))',
                    }} />
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.66rem',
                      color: 'var(--teal-light)', textTransform: 'uppercase',
                      letterSpacing: '0.12em', marginBottom: 10,
                    }}>
                      Prefer to talk?
                    </p>
                    <h3 style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.1rem', fontWeight: 400,
                      letterSpacing: '-0.01em', color: 'var(--text-primary)',
                      marginBottom: 10,
                    }}>
                      Book a Free Intro Call
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem', lineHeight: 1.65,
                      color: 'var(--text-secondary)', marginBottom: 20,
                    }}>
                      30 minutes. No slides. We ask about your project, you ask about us. You leave with a clear path forward — or a honest &ldquo;not a fit&rdquo; if we&apos;re not the right team.
                    </p>
                    <a
                      href="https://cal.com/sociofi"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px',
                        background: 'var(--teal)',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.88rem', fontWeight: 600,
                        color: 'white', textDecoration: 'none',
                      }}
                    >
                      Pick a time
                      <svg viewBox="0 0 24 24" fill="none" width={14} height={14} stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>

                  {/* Email direct */}
                  <div style={{
                    padding: '20px 22px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                      background: 'rgba(89,163,146,0.1)',
                      border: '1px solid rgba(89,163,146,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" width={18} height={18} stroke="var(--teal)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 7l10 7 10-7" />
                      </svg>
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.82rem', fontWeight: 600,
                        color: 'var(--text-primary)', marginBottom: 2,
                      }}>
                        Email us directly
                      </div>
                      <a
                        href="mailto:hello@sociofi.tech"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem', color: 'var(--teal)',
                          textDecoration: 'none',
                        }}
                      >
                        hello@sociofi.tech
                      </a>
                    </div>
                  </div>

                  {/* What happens next */}
                  <div style={{
                    padding: '22px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', flexDirection: 'column', gap: 16,
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.88rem', fontWeight: 600,
                      color: 'var(--text-primary)', margin: 0,
                    }}>
                      What happens after you submit
                    </p>
                    {[
                      { n: '01', text: 'A senior engineer reads your message and thinks about your specific situation.' },
                      { n: '02', text: 'We reply with a few clarifying questions or straight to scheduling a call.' },
                      { n: '03', text: 'You get a fixed-scope proposal. You decide — no pressure either way.' },
                    ].map((step) => (
                      <div key={step.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.66rem', fontWeight: 600,
                          color: 'var(--teal)',
                          flexShrink: 0, marginTop: 1,
                        }}>
                          {step.n}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.82rem', lineHeight: 1.6,
                          color: 'var(--text-secondary)',
                        }}>
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Response time indicator */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 18px',
                    background: 'color-mix(in srgb, var(--teal) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--teal) 15%, transparent)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#4ade80', flexShrink: 0,
                    }} aria-hidden="true" />
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0,
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

      {/* ── FAQ section ───────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 'var(--space-section)', paddingInline: 32 }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              color: 'var(--teal)', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <span style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
              FAQ
            </p>
            <h2 style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 400, letterSpacing: '-0.02em',
              color: 'var(--text-primary)', margin: 0,
            }}>
              Quick answers
            </h2>
          </div>
        </ScrollReveal>
      </div>
      <FAQAccordion items={faqItems} standalone />

      {/* TrustBar — before footer */}
      <TrustBar items={[
        'Response within 4 hours',
        'Engineer-first — no SDR handoffs',
        'Fixed-scope pricing',
        'Based in Dhaka, working globally',
      ]} />
    </>
  );
}
