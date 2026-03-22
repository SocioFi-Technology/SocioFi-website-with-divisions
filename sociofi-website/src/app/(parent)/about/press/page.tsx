'use client';

import Container from '@/components/shared/Container';
import AboutSubNav from '@/components/about/AboutSubNav';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';



const BRAND_COLORS = [
  { name: 'Navy', hex: '#3A589E', desc: 'Primary brand color' },
  { name: 'Teal', hex: '#59A392', desc: 'Primary accent' },
  { name: 'Navy Deep', hex: '#2C4478', desc: 'Dark variant' },
  { name: 'Teal Light', hex: '#72C4B2', desc: 'Light accent' },
  { name: 'Teal Pale', hex: '#A3DFD2', desc: 'Pale accent' },
];

const DIVISION_COLORS = [
  { name: 'Studio', hex: '#72C4B2' },
  { name: 'Services', hex: '#4DBFA8' },
  { name: 'Labs', hex: '#7B6FE8' },
  { name: 'Products', hex: '#E8916F' },
  { name: 'Academy', hex: '#E8B84D' },
  { name: 'Ventures', hex: '#6BA3E8' },
  { name: 'Cloud', hex: '#5BB5E0' },
  { name: 'Agents', hex: '#8B5CF6' },
];

const KEY_FACTS = [
  { label: 'Founded', value: 'August 1, 2024' },
  { label: 'Headquarters', value: 'Dhaka, Bangladesh' },
  { label: 'Founders', value: 'Arifur Rahman (CEO), Kamrul Hasan (CTO)' },
  { label: 'Team', value: '2 human founders + 13 AI agents' },
  { label: 'Divisions', value: '8 (Studio, Agents, Services, Cloud, Labs, Products, Academy, Ventures)' },
  { label: 'AI agents deployed', value: '45+ across all systems' },
  { label: 'Live platforms', value: 'FabricxAI, NEXUS ARIA, DevBridge OS' },
  { label: 'Education background', value: 'Both founders — BUET (Bangladesh University of Engineering and Technology)' },
];

const BOILERPLATE = `SocioFi Technology is an AI-native software development company founded on August 1, 2024, by Arifur Rahman and Kamrul Hasan in Dhaka, Bangladesh. The company operates a hybrid model where 13 specialized AI agents handle operational work — lead processing, content creation, communications, monitoring, and analytics — while human founders make all final decisions.

SocioFi operates across eight divisions: Studio (custom software development), Agents (AI agent subscriptions), Services (maintenance and monitoring), Cloud (managed infrastructure), Labs (research and open source), Products (own platforms), Academy (education and training), and Ventures (equity co-build partnerships). The company has deployed 45+ AI agents in production across three live platforms: FabricxAI (22-agent manufacturing intelligence), NEXUS ARIA (13-agent GTM operations), and DevBridge OS (10-agent development pipeline).

SocioFi's approach — radical transparency about AI-native operations, fixed pricing published on the website, and full code ownership for clients — represents a new model for software development companies serving founders and SMBs globally.`;

const SHORT_BOILERPLATE = `SocioFi Technology is an AI-native software development company based in Dhaka, Bangladesh. Founded in 2024 by two BUET graduates, SocioFi deploys specialized AI agents alongside human founders to build, maintain, and host software for founders and small businesses globally. 45+ agents deployed across 8 divisions. Radically transparent about how it operates.`;

function CopyBox({ content, label }: { content: string; label: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        <button
          onClick={() => navigator.clipboard?.writeText(content)}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--teal)',
            letterSpacing: '0.06em', background: 'none', border: '1px solid var(--teal)',
            borderRadius: 'var(--radius-full)', padding: '3px 12px', cursor: 'pointer',
          }}
        >
          COPY
        </button>
      </div>
      <div style={{
        background: 'var(--code-bg)', border: '1px solid var(--code-border)',
        borderRadius: 'var(--radius-sm)', padding: '20px 24px',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap' }}>{content}</p>
      </div>
    </div>
  );
}

export default function PressPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(89,163,146,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <Container>
          <ScrollReveal>
            <p className="sec-label">Press & Media</p>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20, maxWidth: 700 }}>
              Press Kit & Brand Assets
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 580, marginBottom: 28 }}>
              Everything you need to write about SocioFi Technology. Brand assets, boilerplate copy, key facts, and media contact.
            </p>
            <a
              href="mailto:press@sociofitechnology.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--teal)',
                border: '1px solid var(--teal)', borderRadius: 'var(--radius-full)',
                padding: '10px 22px', textDecoration: 'none', letterSpacing: '0.06em',
              }}
            >
              press@sociofitechnology.com
            </a>
          </ScrollReveal>
        </Container>
      </section>

      <AboutSubNav active="/about/press" />

      {/* ── Key Facts ────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Key Facts" title="Company at a Glance" className="mb-10" />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 2 }}>
            {KEY_FACTS.map((fact, i) => (
              <ScrollReveal key={i} delay={i * 0.04}>
                <div style={{
                  padding: '18px 24px',
                  background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-2)',
                  border: '1px solid var(--border)',
                }}>
                  <dt style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{fact.label}</dt>
                  <dd style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0 }}>{fact.value}</dd>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Boilerplate ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Company Copy" title="Boilerplate Text" subtitle="Use these exactly as written. Approved for press and media use." className="mb-10" />
          </ScrollReveal>
          <ScrollReveal>
            <CopyBox content={BOILERPLATE} label="Full boilerplate (3 paragraphs)" />
            <CopyBox content={SHORT_BOILERPLATE} label="Short boilerplate (2 sentences)" />
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Brand Colors ─────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Brand Colors" title="Color System" className="mb-10" />
          </ScrollReveal>

          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Primary Brand Colors</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <StaggerChildren>
              {BRAND_COLORS.map((c) => (
                <StaggerItem key={c.hex}>
                  <div style={{ width: 160 }}>
                    <div style={{ width: '100%', height: 80, background: c.hex, borderRadius: 'var(--radius-sm)', marginBottom: 10 }} />
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0 0 2px' }}>{c.name}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', margin: '0 0 2px' }}>{c.hex}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>{c.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Division Accent Colors</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {DIVISION_COLORS.map((c) => (
                <div key={c.hex} style={{ width: 120 }}>
                  <div style={{ width: '100%', height: 48, background: c.hex, borderRadius: 'var(--radius-sm)', marginBottom: 8 }} />
                  <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)', margin: '0 0 2px' }}>{c.name}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>{c.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Typography ───────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Typography" title="Brand Fonts" className="mb-10" />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'Syne', role: 'Display / Headlines', sample: 'Aa', desc: 'Used for all headings, display text, and UI labels requiring high visual weight.' },
              { name: 'Outfit', role: 'Body / UI', sample: 'Aa', desc: 'Used for all body text, descriptions, navigation, and interface copy.' },
              { name: 'Fira Code', role: 'Monospace / Code', sample: 'Aa', desc: 'Used for section labels, badges, code blocks, and technical identifiers.' },
            ].map((font) => (
              <ScrollReveal key={font.name}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '28px 28px' }}>
                  <div style={{ fontFamily: font.name === 'Fira Code' ? 'var(--font-mono)' : font.name === 'Outfit' ? 'var(--font-body)' : 'var(--font-headline)', fontSize: '3rem', color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1 }}>{font.sample}</div>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>{font.name}</h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--teal)', letterSpacing: '0.06em', margin: '0 0 12px' }}>{font.role.toUpperCase()}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>{font.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Usage Guidelines ─────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader label="Guidelines" title="Logo & Brand Usage" className="mb-10" />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 860, marginInline: 'auto' }}>
            {[
              { label: 'Minimum size', rule: '120px width for horizontal lockup, 32px for the mark alone.' },
              { label: 'Clear space', rule: 'Maintain minimum clear space of 1× the mark\'s height on all sides.' },
              { label: 'Backgrounds', rule: 'Use navy/dark version on light backgrounds, white version on dark or colored backgrounds.' },
              { label: 'Don\'t modify', rule: 'Do not stretch, rotate, recolor, or add effects to the logo. Use provided files only.' },
              { label: 'Don\'t place on clutter', rule: 'Avoid placing the logo over busy imagery or low-contrast backgrounds.' },
              { label: 'Division logos', rule: 'Division logos use the same lockup with a division-specific accent color. Do not mix division colors with the wrong division.' },
            ].map((g, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{g.label}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{g.rule}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Media Contact ─────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 80, background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <div style={{ maxWidth: 560, marginInline: 'auto', textAlign: 'center' }}>
              <p className="sec-label" style={{ justifyContent: 'center' }}>Media Contact</p>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 'clamp(1.6rem, 3vw, 2rem)', color: 'var(--text-primary)', marginBottom: 16 }}>Get in Touch</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 28 }}>
                For press inquiries, interview requests, or media assets not listed here, contact us directly. We respond within 24 hours.
              </p>
              <a
                href="mailto:press@sociofitechnology.com"
                style={{
                  display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.84rem',
                  color: 'var(--teal)', textDecoration: 'none',
                  borderBottom: '1px solid var(--teal)', paddingBottom: 2, letterSpacing: '0.04em',
                }}
              >
                press@sociofitechnology.com
              </a>
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Response time</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>Within 24 hours</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Primary contact</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>Arifur Rahman, CEO</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Time zone</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>BST (GMT+6)</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
