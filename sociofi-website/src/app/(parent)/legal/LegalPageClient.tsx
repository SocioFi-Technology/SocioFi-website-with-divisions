'use client';

import { useState } from 'react';
import Container from '@/components/shared/Container';
import AnimatedGrid from '@/components/visual/AnimatedGrid';

const LAST_UPDATED = 'March 2026';

// ── Section content ───────────────────────────────────────────────────────────

interface Section { heading: string; body: string[] }

const TERMS: Section[] = [
  {
    heading: 'Agreement to these terms',
    body: [
      "By accessing or using SocioFi Technology's website, services, or products, you agree to these Terms of Service. If you don't agree, please don't use our services.",
      "The specific scope, deliverables, and commercial terms for each engagement are defined in your service agreement or statement of work — which takes precedence over these general terms.",
    ],
  },
  {
    heading: 'What we provide',
    body: [
      "SocioFi Technology provides software development, maintenance, hosting, education, research, and related services through seven specialist divisions: Studio, Services, Labs, Products, Academy, Ventures, and Cloud.",
      "The nature and scope of what we deliver is always defined in writing before work begins. We don't start building until you've approved a clear scope.",
    ],
  },
  {
    heading: 'Intellectual property',
    body: [
      "All intellectual property developed specifically for you — and fully paid for — is transferred to you on delivery. Source code, designs, documentation: yours.",
      "Our internal frameworks, libraries, tooling, workflows, and methodologies remain the property of SocioFi Technology. We may use them to serve you and other clients.",
      "You grant us permission to reference your project (without disclosing confidential details) in our portfolio and marketing, unless your agreement says otherwise.",
    ],
  },
  {
    heading: 'Payment and pricing',
    body: [
      "We price by fixed scope, not by the hour. Your agreement will specify the total price, payment schedule, and what's included. We don't add fees after the fact.",
      "Invoices are due within the timeframe specified in your agreement. Late payment may result in work being paused until the balance is cleared.",
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      "You agree not to use our services for any unlawful purpose, to build tools intended for illegal activity, to attempt to gain unauthorised access to our systems, or to engage in conduct that could harm our team or other clients.",
      "We may terminate services for breach of these terms, extended non-payment, or conduct we reasonably determine is harmful.",
    ],
  },
  {
    heading: 'Liability',
    body: [
      "We deliver work with care and professional skill. However, our liability is limited to the value of the specific engagement in which any issue arose. We are not liable for indirect, consequential, or incidental damages.",
      "We are not responsible for issues arising from third-party services, infrastructure, or code that you provided to us.",
    ],
  },
  {
    heading: 'Governing law',
    body: [
      "These terms are governed by the laws of Bangladesh. Disputes that cannot be resolved informally will be referred to binding arbitration in Dhaka, Bangladesh.",
    ],
  },
];

const PRIVACY: Section[] = [
  {
    heading: 'What we collect',
    body: [
      "When you use our contact form, book a call, or sign up for our newsletter: your name, email address, and any information you voluntarily provide about your project.",
      "When you visit our website: standard server logs (IP address, browser type, pages visited). We use privacy-preserving analytics — no advertising trackers.",
      "When you become a client: additional information needed to deliver your project and process payments (company details, billing address).",
    ],
  },
  {
    heading: 'How we use it',
    body: [
      "To respond to your enquiry and deliver the services you've engaged us for. Nothing else.",
      "To send you our newsletter if you subscribed. You can unsubscribe at any time via the link in any email.",
      "To improve our services. We look at aggregate usage patterns — never individual behaviour.",
      "We do not sell your data. We do not share it with advertisers. We do not use it for any purpose other than serving you.",
    ],
  },
  {
    heading: 'Third-party services',
    body: [
      "We use a small number of third-party tools to operate our business: a CRM for project management, a payment processor for invoicing, and an email provider for communication. These are disclosed in our service agreements.",
      "Our website uses Plausible Analytics — a privacy-preserving analytics tool that does not use cookies and does not track individuals.",
    ],
  },
  {
    heading: 'Data retention',
    body: [
      "We keep client data for as long as the engagement requires and for a reasonable period afterward for compliance purposes. Contact enquiries that don't convert to projects are deleted after 12 months.",
      "You may request deletion of your personal data at any time by emailing hello@sociofi.tech.",
    ],
  },
  {
    heading: 'Your rights',
    body: [
      "You have the right to access the personal data we hold about you, correct inaccurate data, request deletion, and object to how we use it.",
      "To exercise any of these rights, email hello@sociofi.tech. We respond within 14 days.",
    ],
  },
  {
    heading: 'Cookies',
    body: [
      "We use only essential cookies necessary to make the website work. We do not use advertising cookies, tracking cookies, or third-party analytics cookies.",
      "Our analytics provider (Plausible) is cookieless — it does not identify individuals or persist any data on your device.",
    ],
  },
  {
    heading: 'Contact',
    body: [
      "Questions about how we handle your data: hello@sociofi.tech or write to SocioFi Technology, Dhaka, Bangladesh.",
    ],
  },
];

const TABS = [
  { id: 'terms',   label: 'Terms of Service', sections: TERMS },
  { id: 'privacy', label: 'Privacy Policy',   sections: PRIVACY },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function LegalPageClient() {
  const [active, setActive] = useState<'terms' | 'privacy'>('terms');
  const current = TABS.find((t) => t.id === active)!;

  return (
    <>
      {/* Header */}
      <header style={{
        position: 'relative',
        paddingTop: 'calc(var(--space-section) + 60px)',
        paddingBottom: 'var(--space-2xl)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}>
        <AnimatedGrid />
        <Container narrow>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--text-muted)', textTransform: 'uppercase',
            letterSpacing: '0.12em', marginBottom: 16,
          }}>
            Legal
          </p>
          <h1 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.08,
            color: 'var(--text-primary)', marginBottom: 16,
          }}>
            Legal Documents
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            lineHeight: 1.75, color: 'var(--text-secondary)',
            marginBottom: 32, maxWidth: '56ch',
          }}>
            We try to write legal documents in plain English. If something is unclear, email us at{' '}
            <a href="mailto:hello@sociofi.tech" style={{ color: 'var(--teal)', textDecoration: 'none' }}>
              hello@sociofi.tech
            </a>.
          </p>

          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 8 }} role="tablist" aria-label="Legal documents">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active === tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  padding: '9px 22px',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${active === tab.id ? 'var(--teal)' : 'var(--border)'}`,
                  background: active === tab.id
                    ? 'color-mix(in srgb, var(--teal) 10%, transparent)'
                    : 'transparent',
                  fontFamily: 'var(--font-headline)',
                  fontSize: '0.88rem', fontWeight: 600,
                  color: active === tab.id ? 'var(--teal)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </header>

      {/* Content */}
      <section style={{
        paddingBlock: 'var(--space-section)',
        background: 'var(--bg)',
      }}>
        <Container>
          <div className="legal-layout" style={{ alignItems: 'start' }}>

            {/* Sticky nav (desktop) / static nav (mobile) */}
            <nav className="legal-nav" aria-label="Document sections">
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.66rem',
                color: 'var(--text-muted)', textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: 14,
              }}>
                {current.label}
              </p>
              <ul className="legal-nav-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 4 }}>
                {current.sections.map((sec) => (
                  <li key={sec.heading}>
                    <a
                      href={`#${sec.heading.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                        lineHeight: 1.5, color: 'var(--text-muted)',
                        textDecoration: 'none', padding: '4px 0',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {sec.heading}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="legal-nav-updated" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.66rem',
                color: 'var(--text-muted)', marginTop: 28,
                letterSpacing: '0.06em',
              }}>
                Last updated: {LAST_UPDATED}
              </p>
            </nav>

            <style>{`
              .legal-layout {
                display: grid;
                grid-template-columns: 1fr 3fr;
                gap: 64px;
              }
              .legal-nav {
                position: sticky;
                top: 100px;
                background: var(--bg);
              }
              .legal-nav-list {
                flex-direction: column;
              }
              @media (max-width: 1024px) {
                .legal-layout {
                  grid-template-columns: 1fr;
                  gap: 32px;
                }
                .legal-nav {
                  position: static;
                  background: var(--bg-card);
                  border: 1px solid var(--border);
                  border-radius: var(--radius-md);
                  padding: 20px 24px;
                }
                .legal-nav-list {
                  flex-direction: row !important;
                  flex-wrap: wrap;
                  gap: 0 !important;
                }
                .legal-nav-list li a {
                  padding: 4px 12px !important;
                  font-size: 0.78rem !important;
                  border-radius: var(--radius-full);
                  border: 1px solid var(--border);
                  margin: 3px 0;
                }
                .legal-nav-updated {
                  display: none;
                }
              }
            `}</style>

            {/* Article body */}
            <article
              style={{ display: 'flex', flexDirection: 'column', gap: 48 }}
            >
              {current.sections.map((sec) => {
                const id = sec.heading.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                return (
                  <div key={sec.heading} id={id}>
                    <h2 style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                      fontWeight: 400, letterSpacing: '-0.015em',
                      color: 'var(--text-primary)',
                      marginBottom: 16,
                      paddingBottom: 12,
                      borderBottom: '1px solid var(--border)',
                    }}>
                      {sec.heading}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {sec.body.map((para, i) => (
                        <p key={i} style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.97rem', lineHeight: 1.8,
                          color: 'var(--text-secondary)', margin: 0,
                        }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Contact footer */}
              <div style={{
                padding: '24px 28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                marginTop: 16,
              }}>
                <p style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '0.95rem', fontWeight: 600,
                  color: 'var(--text-primary)', marginBottom: 8,
                }}>
                  Questions about these documents?
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem', lineHeight: 1.7,
                  color: 'var(--text-secondary)', margin: 0,
                }}>
                  Email{' '}
                  <a href="mailto:hello@sociofi.tech" style={{ color: 'var(--teal)', textDecoration: 'none' }}>
                    hello@sociofi.tech
                  </a>
                  {' '}— we respond in plain English within 24 hours.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
