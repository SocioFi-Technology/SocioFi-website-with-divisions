'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import CTASection from '@/components/shared/CTASection';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import AnimatedGrid from '@/components/visual/AnimatedGrid';
import Button from '@/components/shared/Button';
import { ArrowRight, Brain, Code, Shield, Rocket, Zap, Target, Layers, GitBranch } from '@/lib/icons';

// ── Comparison data ───────────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  { saas: 'Software you log into', aaas: 'Agents that act for you' },
  { saas: 'You do the work, software stores it', aaas: 'Agents execute workflows end-to-end' },
  { saas: 'Notifications you act on manually', aaas: 'Agents act on triggers automatically' },
  { saas: 'Dashboards you interpret', aaas: 'Agents that generate insights and respond' },
  { saas: 'Integrations you manually trigger', aaas: 'Agents that coordinate systems continuously' },
  { saas: 'Teams to manage the software', aaas: 'Agents that self-monitor and self-correct' },
];

// ── What an agent system is ───────────────────────────────────────────────────

const AGENT_LAYERS = [
  {
    icon: <Brain size={22} aria-hidden="true" />,
    label: 'Perception Layer',
    title: 'Agents that see',
    desc: 'Ingesting data from APIs, emails, databases, documents, and third-party tools. Continuously. Automatically.',
  },
  {
    icon: <Layers size={22} aria-hidden="true" />,
    label: 'Reasoning Layer',
    title: 'Agents that think',
    desc: 'Classifying, prioritizing, deciding. Structured reasoning over your actual business data and rules.',
  },
  {
    icon: <Zap size={22} aria-hidden="true" />,
    label: 'Action Layer',
    title: 'Agents that do',
    desc: 'Writing emails, updating records, triggering workflows, escalating edge cases to humans — in real time.',
  },
  {
    icon: <GitBranch size={22} aria-hidden="true" />,
    label: 'Coordination Layer',
    title: 'Agents that orchestrate',
    desc: 'Multi-agent pipelines where specialized sub-agents hand off tasks — like an autonomous team working in parallel.',
  },
];

// ── Proof: real agent systems ─────────────────────────────────────────────────

const PROOF_SYSTEMS = [
  {
    name: 'FabricxAI',
    accent: '#E8916F',
    agents: 22,
    description:
      'Our AI workflow automation platform runs 22 coordinated agents handling ingestion, classification, routing, transformation, and reporting. Human oversight is exception-based, not routine.',
    outcomes: ['82% reduction in manual processing', '10× faster cycle times', 'Zero routine human intervention'],
    href: '/products/fabricxai',
  },
  {
    name: 'NEXARA',
    accent: '#7B6FE8',
    agents: 13,
    description:
      'A conversational intelligence platform with 13 specialized agents — intent classification, context retrieval, response generation, quality review, escalation management, and post-conversation follow-up.',
    outcomes: ['3 second average response time', '91% resolution without escalation', 'Fully customizable agent roles'],
    href: '/products/nexus-aria',
  },
  {
    name: 'Dev Pipeline',
    accent: '#72C4B2',
    agents: 10,
    description:
      'The pipeline SocioFi uses internally to build client software: spec parsing, architecture planning, code generation, human review, automated testing, security scanning, and deployment — coordinated across 10 agents.',
    outcomes: ['5× faster than traditional dev', 'Human architects review every decision', 'Deployed to production in weeks'],
    href: '/studio/services/ai-agent-systems',
  },
];

// ── Build process ─────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    num: '01',
    label: 'Discovery',
    title: 'Map your workflows',
    desc: 'We identify the repetitive, rule-based, or data-heavy work your team does today. These are your agent candidates.',
  },
  {
    num: '02',
    label: 'Architecture',
    title: 'Design the agent system',
    desc: 'Our engineers define the agent roles, data flows, decision logic, human handoff points, and monitoring hooks.',
  },
  {
    num: '03',
    label: 'Build & Test',
    title: 'Build with your real data',
    desc: 'We build agents against your actual systems — not demos. Test in staging with your real inputs and edge cases.',
  },
  {
    num: '04',
    label: 'Deploy & Operate',
    title: 'Live and monitored',
    desc: 'Agents go live in your environment. SocioFi Services monitors performance, catches errors, and handles updates.',
  },
];

// ── Who it's for ──────────────────────────────────────────────────────────────

const AUDIENCES = [
  {
    accent: '#8B5CF6',
    title: 'Founders with AI prototypes',
    pain: "You've built an AI demo but it doesn't actually do anything reliably.",
    gain: "We turn your prototype into a production agent system with proper error handling, monitoring, and real integration.",
  },
  {
    accent: '#A78BFA',
    title: 'Operations teams drowning in manual work',
    pain: 'Your team spends hours on data entry, routing, formatting, and chasing approvals.',
    gain: 'We build agent pipelines that eliminate the routine work and escalate only the exceptions.',
  },
  {
    accent: '#6D28D9',
    title: 'SMBs without a dev team',
    pain: "You know AI can automate this — but you don't have engineers to build or maintain agent systems.",
    gain: 'SocioFi is your AI engineering team. We design, build, and keep your agent systems running.',
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function AaaSPageClient() {
  return (
    <>
      {/* ═════════════════════════════════════════════════════════════════
          HERO
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--bg)',
        paddingTop: 'calc(var(--space-section) + 40px)',
        paddingBottom: 'var(--space-section)',
      }}>
        <AnimatedGrid />

        {/* Background orbs */}
        <div aria-hidden="true" style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          top: '-10%', left: '-5%',
          opacity: 0.6, filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)',
          bottom: '-10%', right: '-5%',
          opacity: 0.6, filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <Container>
          <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem', fontWeight: 500,
                color: 'var(--division-accent)',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                marginBottom: 36,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--division-accent)', display: 'inline-block',
                }} />
                Agent-as-a-Service · AaaS
              </div>

              <h1 style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}>
                Software used to store data.<br />
                <span className="gradient-text">Now it acts on it.</span>
              </h1>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.12rem)',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                maxWidth: 600,
                marginInline: 'auto',
                marginBottom: 44,
              }}>
                AaaS — Agent-as-a-Service — is the next layer of the software stack. Instead of tools your team uses, you get agent systems that work for you. SocioFi builds them.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button href="/studio/services/ai-agent-systems" variant="primary" size="lg">
                  Build Your Agent System
                </Button>
                <Button href="#how-we-build" variant="ghost" size="lg">
                  See How It Works
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SAAS VS AAAS
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="The transition"
              title={<>From software you use<br />to agents that <span className="gradient-text">work for you</span></>}
              subtitle="Every function that runs on SaaS today is a candidate for AaaS. The tools don't change — what changes is whether a human or an agent runs them."
              centered
              className="mb-16"
            />
          </ScrollReveal>

          <ScrollReveal>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              maxWidth: 900,
              marginInline: 'auto',
            }}>
              {/* Header row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                background: 'var(--bg-3)',
              }}>
                <div style={{
                  padding: '16px 28px',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 500,
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em',
                  borderRight: '1px solid var(--border)',
                }}>
                  SaaS — What you do today
                </div>
                <div style={{
                  padding: '16px 28px',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 500,
                  color: 'var(--division-accent)', textTransform: 'uppercase', letterSpacing: '0.12em',
                }}>
                  AaaS — What agents do instead
                </div>
              </div>

              {/* Comparison rows */}
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <div style={{
                    padding: '16px 28px',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    color: 'var(--text-muted)', lineHeight: 1.5,
                    borderRight: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>—</span>
                    {row.saas}
                  </div>
                  <div style={{
                    padding: '16px 28px',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    color: 'var(--text-primary)', lineHeight: 1.5,
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: i % 2 === 0 ? 'transparent' : 'rgba(139,92,246,0.03)',
                  }}>
                    <span style={{ color: 'var(--division-accent)', flexShrink: 0 }}>›</span>
                    {row.aaas}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          WHAT AN AGENT SYSTEM IS
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="What we build"
              title={<>Agent systems are not chatbots.<br /><span className="gradient-text">They are infrastructure.</span></>}
              subtitle="A real agent system has multiple layers working together. SocioFi architects, builds, and operates all of them."
              centered
              className="mb-16"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AGENT_LAYERS.map((layer) => (
              <StaggerItem key={layer.label}>
                <div className="card" style={{ padding: '32px 28px', height: '100%' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--division-accent)', marginBottom: 20,
                  }}>
                    {layer.icon}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500,
                    color: 'var(--division-accent)', textTransform: 'uppercase', letterSpacing: '0.12em',
                    marginBottom: 8,
                  }}>
                    {layer.label}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-headline)', fontSize: '1.1rem', fontWeight: 600,
                    color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.01em',
                  }}>
                    {layer.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                  }}>
                    {layer.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          PROOF: REAL SYSTEMS WE'VE BUILT
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Proof"
              title={<>We don't sell AaaS.<br /><span className="gradient-text">We run it.</span></>}
              subtitle="These aren't case studies from other agencies. These are agent systems we built and operate ourselves — for our own products and our clients."
              centered
              className="mb-16"
            />
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {PROOF_SYSTEMS.map((sys, i) => (
              <ScrollReveal key={sys.name} delay={i * 0.1}>
                <div className="card proof-grid" style={{
                  padding: '36px 32px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 40,
                  alignItems: 'start',
                }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800,
                        color: sys.accent, letterSpacing: '-0.03em', lineHeight: 1,
                      }}>
                        {sys.agents}
                      </div>
                      <div>
                        <div style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500,
                          color: sys.accent, textTransform: 'uppercase', letterSpacing: '0.1em',
                        }}>
                          {sys.name}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}>
                          agents in production
                        </div>
                      </div>
                    </div>

                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.92rem', lineHeight: 1.7,
                      color: 'var(--text-secondary)', marginBottom: 24,
                    }}>
                      {sys.description}
                    </p>

                    <Link
                      href={sys.href}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontFamily: 'var(--font-headline)', fontSize: '0.84rem', fontWeight: 600,
                        color: sys.accent, textDecoration: 'none',
                      }}
                    >
                      Learn more
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>

                  <div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: 14,
                    }}>
                      Outcomes
                    </div>
                    {sys.outcomes.map((outcome) => (
                      <div key={outcome} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border)',
                        fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                        color: 'var(--text-primary)', lineHeight: 1.5,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: sys.accent, flexShrink: 0,
                          marginTop: 6,
                        }} />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          HOW WE BUILD
      ═════════════════════════════════════════════════════════════════ */}
      <section id="how-we-build" style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)', scrollMarginTop: 80 }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Our process"
              title={<>From workflow to<br /><span className="gradient-text">working agent system</span></>}
              subtitle="Four phases. Real engineering. No demos that don't ship."
              centered
              className="mb-16"
            />
          </ScrollReveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            position: 'relative',
          }}
            className="process-grid"
          >
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1}>
                <div style={{
                  position: 'relative',
                  padding: '28px 24px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800,
                    color: 'var(--border-hover)', letterSpacing: '-0.04em', lineHeight: 1,
                    marginBottom: 16,
                  }}>
                    {step.num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.64rem', fontWeight: 500,
                    color: 'var(--division-accent)', textTransform: 'uppercase', letterSpacing: '0.12em',
                    marginBottom: 8,
                  }}>
                    {step.label}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 600,
                    color: 'var(--text-primary)', letterSpacing: '-0.01em',
                    marginBottom: 10,
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.84rem', lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                  }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          WHO IT'S FOR
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Who it's for"
              title="AaaS is for businesses that are done doing things manually"
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIENCES.map((audience) => (
              <StaggerItem key={audience.title}>
                <div className="card" style={{ padding: '32px 28px', height: '100%' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-headline)', fontSize: '1.05rem', fontWeight: 600,
                    color: 'var(--text-primary)', letterSpacing: '-0.01em',
                    marginBottom: 20,
                  }}>
                    {audience.title}
                  </h3>

                  <div style={{
                    padding: '14px 16px',
                    background: 'var(--bg-3)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 12,
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: 6,
                    }}>
                      The problem
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                    }}>
                      {audience.pain}
                    </p>
                  </div>

                  <div style={{
                    padding: '14px 16px',
                    background: `${audience.accent}0D`,
                    border: `1px solid ${audience.accent}22`,
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500,
                      color: audience.accent, textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: 6,
                    }}>
                      What AaaS gives you
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.86rem', lineHeight: 1.6,
                      color: 'var(--text-primary)',
                    }}>
                      {audience.gain}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          CTA
      ═════════════════════════════════════════════════════════════════ */}
      <CTASection
        title="Ready to move from SaaS to AaaS?"
        subtitle="Book a free call. We'll map your workflows, identify the right agent candidates, and show you what a production system looks like."
        primaryCTA={{ label: 'Book Your Free Call', href: '/contact' }}
        ghostCTA={{ label: 'See AI Agent Systems', href: '/studio/services/ai-agent-systems' }}
        note="No obligation. Response within 24 hours."
      />
    </>
  );
}
