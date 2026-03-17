'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import CTASection from '@/components/shared/CTASection';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import MetricBar from '@/components/sections/MetricBar';
import LogoMarquee from '@/components/sections/LogoMarquee';
import TestimonialCard from '@/components/cards/TestimonialCard';
import AnimatedGrid from '@/components/visual/AnimatedGrid';
import Button from '@/components/shared/Button';
import { ArrowRight, Brain, Code, Shield, Rocket, Book, CloudIcon, Zap } from '@/lib/icons';
import { divisionList, type LogoModifier } from '@/lib/divisions';

// ── CSS injected into <head> for keyframe animations ─────────────────────────

const SHIMMER_CSS = `
  @keyframes hero-shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  .hero-shimmer {
    background: linear-gradient(
      90deg,
      #4A6CB8 0%,
      #72C4B2 25%,
      #A3DFD2 50%,
      #72C4B2 75%,
      #4A6CB8 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: hero-shimmer 4s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-shimmer { animation: none; }
  }
`;

// ── Division one-liners ───────────────────────────────────────────────────────

const DIVISION_COPY: Record<string, string> = {
  agents:   'Autonomous agent systems that act on your data. Not software you use — infrastructure that works for you.',
  studio:   'Custom AI-native software. From idea to production in weeks.',
  services: 'Ongoing maintenance, monitoring, and support for live products.',
  labs:     'Research, experimentation, and open-source contributions.',
  products: 'Our own AI-powered products: FabricxAI, NEXUS ARIA, DevBridge.',
  academy:  'Learn to build with AI. Courses, workshops, and certification.',
  ventures: 'We co-build with founders. Equity, revenue share, or hybrid deals.',
  cloud:    'Managed hosting and infrastructure. You build, we run.',
};

// ── Logo mark — single 48×48 SVG matching Logo.tsx exactly ───────────────────

function divisionModifier(modifier: LogoModifier, accent: string) {
  switch (modifier) {
    case 'corner-brackets': // Studio — crosshair with ring
      return (
        <>
          <line x1="38" y1="14" x2="38" y2="34" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="34" y1="24" x2="42" y2="24" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="38" cy="24" r="3.5" stroke={accent} strokeWidth="1.5" fill="none" />
          <circle cx="38" cy="24" r="1.2" fill={accent} />
        </>
      );
    case 'signal-arcs': // Services
      return (
        <>
          <circle cx="35" cy="24" r="1.5" fill={accent} />
          <path d="M35 24 A4 4 0 0 1 39 20" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M34 24 A7 7 0 0 1 41 17" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M33 24 A10 10 0 0 1 43 14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
        </>
      );
    case 'particle-dots': // Labs
      return (
        <>
          <circle cx="38" cy="14" r="2.5" fill={accent} />
          <circle cx="42" cy="22" r="1.8" fill={accent} opacity="0.8" />
          <circle cx="38" cy="30" r="2" fill={accent} opacity="0.6" />
          <circle cx="43" cy="32" r="1.2" fill={accent} opacity="0.4" />
        </>
      );
    case 'stacked-diamonds': // Products
      return (
        <>
          <path d="M38 16 L42 20 L38 24 L34 20Z" stroke={accent} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
          <path d="M38 20 L42 24 L38 28 L34 24Z" stroke={accent} strokeWidth="1.4" fill="none" strokeLinejoin="round" opacity="0.65" />
          <path d="M38 24 L42 28 L38 32 L34 28Z" stroke={accent} strokeWidth="1.4" fill="none" strokeLinejoin="round" opacity="0.35" />
        </>
      );
    case 'open-book': // Academy — open book + rays + tip dots
      return (
        <>
          <path d="M39 12 L32 15 L33 25 L39 25 Z" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={`${accent}14`} opacity="0.9" />
          <path d="M39 12 L46 15 L45 25 L39 25 Z" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={`${accent}0C`} opacity="0.75" />
          <line x1="39" y1="12" x2="39" y2="25" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <line x1="33.5" y1="18" x2="37.5" y2="17.5" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
          <line x1="34" y1="21.5" x2="37.5" y2="21.5" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.25" />
          <line x1="40.5" y1="17.5" x2="44.5" y2="18" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.35" />
          <line x1="40.5" y1="21.5" x2="44.5" y2="21.5" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />
          <line x1="39" y1="12" x2="39" y2="5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          <line x1="36" y1="13.5" x2="32" y2="7" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
          <line x1="42" y1="13.5" x2="46" y2="7" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
          <circle cx="39" cy="4" r="2" fill={accent} opacity="0.9" />
          <circle cx="31" cy="6" r="1.5" fill={accent} opacity="0.5" />
          <circle cx="47" cy="6" r="1.5" fill={accent} opacity="0.4" />
          <circle cx="32" cy="24" r="2.5" fill={accent} opacity="0.3" />
        </>
      );
    case 'ascending-branch': // Ventures
      return (
        <>
          <path d="M38 38 L38 16" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M38 28 L28 18" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M38 22 L46 14" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          <circle cx="38" cy="38" r="2" fill={accent} />
          <circle cx="28" cy="18" r="1.6" fill={accent} opacity="0.7" />
          <circle cx="46" cy="14" r="1.4" fill={accent} opacity="0.5" />
        </>
      );
    case 'stacked-lines': // Cloud
      return (
        <>
          <line x1="33" y1="17" x2="44" y2="17" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="33" y1="23" x2="42" y2="23" stroke={accent} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          <line x1="33" y1="29" x2="39" y2="29" stroke={accent} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
          <path d="M45 14 L45 20" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 17 L45 14 L48 17" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'agent-node-network': // Agents — hexagon orchestrator + satellite nodes
      return (
        <>
          <line x1="32" y1="24" x2="33" y2="18" stroke={accent} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1.5 2.5" opacity="0.3" />
          <circle cx="38" cy="18" r="9" stroke={accent} strokeWidth="0.8" fill="none" strokeDasharray="2 4" opacity="0.15" />
          <line x1="32" y1="30" x2="35.5" y2="22.3" stroke={accent} strokeWidth="0.9" strokeLinecap="round" strokeDasharray="1.5 3" opacity="0.28" />
          <line x1="44" y1="26" x2="43" y2="18" stroke={accent} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
          <line x1="38" y1="9" x2="40.5" y2="13.7" stroke={accent} strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5 2.5" opacity="0.55" />
          <path d="M43 18 L40.5 22.3 L35.5 22.3 L33 18 L35.5 13.7 L40.5 13.7 Z" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" fill={`${accent}18`} opacity="0.9" />
          <circle cx="38" cy="18" r="1.5" fill={accent} opacity="0.7" />
          <circle cx="38" cy="18" r="4" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.25" />
          <circle cx="38" cy="9" r="2.5" fill={accent} opacity="0.88" />
          <circle cx="38" cy="9" r="4.5" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.2" />
          <circle cx="44" cy="26" r="1.8" fill={accent} opacity="0.62" />
          <circle cx="44" cy="26" r="3.5" stroke={accent} strokeWidth="0.7" fill="none" opacity="0.15" />
          <circle cx="32" cy="30" r="1.4" fill={accent} opacity="0.42" />
          <circle cx="32" cy="24" r="2" fill={accent} opacity="0.16" />
        </>
      );
    default:
      return null;
  }
}

/** Single 48×48 SVG mark — matches Logo.tsx exactly */
function DivisionLogoMark({
  modifier,
  accent,
  size = 56,
}: {
  modifier: LogoModifier;
  accent: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Left chevron — navy, shifted left for division modifier room */}
      <path d="M10 12 L22 24 L10 36" stroke="#4A6CB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right chevron — division accent, shifted left */}
      <path d="M20 12 L32 24 L20 36" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Division modifier */}
      {divisionModifier(modifier, accent)}
    </svg>
  );
}

// ── Floating card data ────────────────────────────────────────────────────────

const FLOATING_CARDS = [
  { icon: <Brain  size={13} aria-hidden="true" />, label: 'AI Agent Build',    top: '22%',  left: '3%',  phase: 0 },
  { icon: <Code   size={13} aria-hidden="true" />, label: 'Human Review',      bottom: '28%', left: '5%', phase: 1 },
  { icon: <Rocket size={13} aria-hidden="true" />, label: 'Ship in Weeks',     top: '18%',  right: '3%', phase: 2 },
  { icon: <Shield size={13} aria-hidden="true" />, label: 'Production-Ready',  bottom: '22%', right: '5%', phase: 3 },
];

// ── Testimonial data ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "I had an AI-built prototype that wouldn't deploy. SocioFi rebuilt the architecture, fixed the issues, and launched it in three weeks. It's been running in production for six months without a single incident.",
    author: 'Marcus T.',
    role: 'Founder',
    company: 'PropTech Startup',
  },
  {
    quote: "We needed someone who could understand our non-technical requirements and actually write the code. SocioFi Studio did both, and the result is better than anything a traditional agency could deliver.",
    author: 'Layla A.',
    role: 'Operations Lead',
    company: 'E-Commerce Co.',
  },
  {
    quote: "Our app was going down twice a week before SocioFi Cloud. Since migrating, we've had 99.97% uptime and noticeably faster response times. The monitoring setup alone was worth it.",
    author: 'Dominic F.',
    role: 'CTO',
    company: 'B2B SaaS',
  },
];

// ── Latest content ────────────────────────────────────────────────────────────

const LATEST = [
  {
    type: 'Engineering',
    accent: 'var(--teal)',
    title: 'Why 80% of AI-generated prototypes never make it to production',
    excerpt: 'AI tools accelerate the first 80%. The last 20% — deployment, security, observability — is where most prototypes get stuck.',
    cta: 'Read article',
    href: '/blog/why-ai-prototypes-fail-production',
  },
  {
    type: 'Case Study',
    accent: '#72C4B2',
    title: 'From broken prototype to 10,000 MAU — in 8 weeks',
    excerpt: "A founder came to us with a prototype that couldn't handle concurrent users. We rebuilt the data layer, deployed properly, and watched it scale.",
    cta: 'View case study',
    href: '/studio/portfolio',
  },
  {
    type: 'Product Update',
    accent: '#E8916F',
    title: 'NEXUS ARIA 2.0: multi-modal input and custom fine-tuning',
    excerpt: 'Our conversational AI platform now supports voice, image analysis, and domain-specific fine-tuning — all through a single API.',
    cta: "See what's new",
    href: '/products/nexus-aria',
  },
];

// ── Magnetic Card ─────────────────────────────────────────────────────────────

function MagneticCard({ children }: { children: React.ReactNode }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setRot({ x: -cy * 4, y: cx * 4 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      style={{ transformStyle: 'preserve-3d', perspective: 800, height: '100%' }}
    >
      {children}
    </motion.div>
  );
}

// ── Homepage ──────────────────────────────────────────────────────────────────

export default function HomePageClient() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      <style>{SHIMMER_CSS}</style>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg)',
        }}
      >
        <AnimatedGrid />

        {/* Parallax orbs */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, var(--navy) 0%, transparent 70%)',
            top: '-15%', left: '-8%',
            opacity: 'var(--glow-opacity)', filter: 'blur(60px)',
            y: orb1Y,
          }}
        />
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)',
            bottom: '-20%', right: '-5%',
            opacity: 'var(--glow-opacity)', filter: 'blur(60px)',
            y: orb2Y,
          }}
        />
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute', width: 380, height: 380, borderRadius: '50%',
            background: 'radial-gradient(circle, #7B6FE8 0%, transparent 70%)',
            top: '35%', right: '18%',
            opacity: 'var(--glow-opacity)', filter: 'blur(60px)',
            y: orb3Y,
          }}
        />

        {/* Noise texture */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: 'var(--noise-opacity)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating glassmorphic cards */}
        {FLOATING_CARDS.map((card, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute', zIndex: 1, display: 'none',
              top: card.top, bottom: card.bottom, left: card.left, right: card.right,
            }}
            className="lg:block"
            animate={{ y: i % 2 === 0 ? [0, -12, 0] : [-6, 6, -6] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              backdropFilter: 'blur(12px)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem', fontWeight: 500,
              color: 'var(--text-secondary)', whiteSpace: 'nowrap',
            }}>
              <span style={{ color: 'var(--teal-light)' }}>{card.icon}</span>
              {card.label}
            </div>
          </motion.div>
        ))}

        {/* Hero content — centered, vertically */}
        <div
          style={{
            position: 'relative', zIndex: 2, flex: 1,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center',
            paddingTop: 'calc(var(--space-section) + 60px)',
            paddingBottom: 'var(--space-4xl)',
          }}
        >
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem', fontWeight: 500,
                color: 'var(--teal-light)',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                marginBottom: 36,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--teal-light)', display: 'inline-block',
                }} />
                Agent-as-a-Service · AaaS
              </div>

              {/* H1 */}
              <h1 style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                fontWeight: 400,
                letterSpacing: '-0.035em',
                lineHeight: 1.06,
                marginBottom: 28,
              }}>
                <span style={{ display: 'block', color: 'var(--text-primary)' }}>
                  Intelligent Systems.
                </span>
                <span className="hero-shimmer">
                  Autonomous Results.
                </span>
              </h1>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                maxWidth: 560,
                marginInline: 'auto',
                marginBottom: 44,
              }}>
                The world is moving from SaaS to AaaS — software that doesn't just store data, it acts on it. Seven specialized divisions. One mission: build intelligent agent systems your business actually runs on.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex', gap: 12, justifyContent: 'center',
                flexWrap: 'wrap', marginBottom: 0,
              }}>
                <Button href="#divisions" variant="primary" size="lg">
                  Explore Our Divisions
                </Button>
                <Button href="/contact" variant="ghost" size="lg">
                  Book a Free Call
                </Button>
              </div>
            </motion.div>
          </Container>
        </div>

        {/* MetricBar pinned at hero bottom */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <MetricBar
            metrics={[
              { numeric: 50, suffix: '+', label: 'Projects Shipped' },
              { numeric: 7,  label: 'Specialist Divisions' },
              { numeric: 5,  suffix: '×', label: 'Faster Than Traditional Dev' },
              { numeric: 100, suffix: '%', label: 'Code Ownership' },
            ]}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DIVISION CARDS
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="divisions"
        style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)', scrollMarginTop: 80 }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Seven divisions"
              title={<>One company. <span className="gradient-text">Complete coverage.</span></>}
              subtitle="Whether you need custom software, ongoing maintenance, AI products, training, or cloud infrastructure — SocioFi Technology has a division for you."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }}
            className="grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4"
          >
            {divisionList.map((div, i) => (
              <div key={div.slug} style={{ gridColumn: i === 0 ? 'span 2' : undefined }}>
                <ScrollReveal delay={i * 0.07}>
                  <MagneticCard>
                    <Link href={div.url} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
                      <article
                        className="card"
                        style={{
                          padding: i === 0 ? '40px 36px' : '28px 24px',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Accent top strip */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                          background: div.accent,
                        }} />

                        {/* Corner glow */}
                        <div aria-hidden="true" style={{
                          position: 'absolute', top: '-30%', right: '-10%',
                          width: 180, height: 180, borderRadius: '50%',
                          background: `radial-gradient(circle, ${div.accent}22 0%, transparent 70%)`,
                          pointerEvents: 'none',
                        }} />

                        {/* Division logo mark */}
                        <div style={{ marginBottom: 20 }}>
                          <DivisionLogoMark
                            modifier={div.modifier}
                            accent={div.accent}
                            size={i === 0 ? 64 : 52}
                          />
                        </div>

                        {/* Division name */}
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.66rem', fontWeight: 500,
                          color: div.accent,
                          textTransform: 'uppercase', letterSpacing: '0.12em',
                          marginBottom: 8,
                        }}>
                          {div.name}
                        </div>

                        {/* Subtitle */}
                        <h3 style={{
                          fontFamily: 'var(--font-headline)',
                          fontSize: i === 0 ? '1.3rem' : '1.05rem',
                          fontWeight: 600, letterSpacing: '-0.01em',
                          color: 'var(--text-primary)', lineHeight: 1.25,
                          marginBottom: 10,
                        }}>
                          {div.subtitle}
                        </h3>

                        {/* One-liner */}
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.84rem', lineHeight: 1.65,
                          color: 'var(--text-secondary)',
                          margin: '0 0 20px',
                          flex: 1,
                        }}>
                          {DIVISION_COPY[div.slug]}
                        </p>

                        {/* Explore link */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          fontFamily: 'var(--font-headline)',
                          fontSize: '0.82rem', fontWeight: 600,
                          color: div.accent, marginTop: 'auto',
                        }}>
                          Explore {div.name.replace('SocioFi ', '')}
                          <ArrowRight size={14} aria-hidden="true" />
                        </div>
                      </article>
                    </Link>
                  </MagneticCard>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          AAAS — THE SHIFT
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="The Shift"
              title={<>Software is becoming AaaS.<br /><span className="gradient-text">Are you ready?</span></>}
              subtitle="SaaS gave businesses software to use. AaaS gives businesses agents that work. The shift is happening now — and it changes everything about how companies operate."
              centered
              className="mb-16"
            />
          </ScrollReveal>

          {/* SaaS vs AaaS comparison */}
          <ScrollReveal>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: 0,
              maxWidth: 860,
              marginInline: 'auto',
              marginBottom: 64,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
            className="aaas-compare-grid"
            >
              {/* SaaS column */}
              <div style={{ padding: '32px 28px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500,
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em',
                  marginBottom: 16,
                }}>
                  SaaS Era
                </div>
                {[
                  'Software you log into',
                  'You do the work, software stores it',
                  'Notifications you have to act on',
                  'Dashboards you have to read',
                  'Automations you have to trigger',
                  'Updates you have to apply',
                ].map((item) => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                    fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                    color: 'var(--text-muted)', lineHeight: 1.5,
                  }}>
                    <span style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }}>—</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{
                width: 1,
                background: 'linear-gradient(180deg, transparent 0%, var(--border-hover) 20%, var(--teal) 50%, var(--border-hover) 80%, transparent 100%)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--teal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  color: 'var(--teal)', fontWeight: 600,
                  zIndex: 1,
                }}>
                  vs
                </div>
              </div>

              {/* AaaS column */}
              <div style={{ padding: '32px 28px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500,
                  color: 'var(--teal-light)', textTransform: 'uppercase', letterSpacing: '0.12em',
                  marginBottom: 16,
                }}>
                  AaaS Era
                </div>
                {[
                  'Agent systems that act for you',
                  'Agents do the work, humans review',
                  'Agents take action on triggers automatically',
                  'Agents generate insights and act on them',
                  'Agents that execute workflows end-to-end',
                  'Agents that self-update and self-correct',
                ].map((item) => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                    fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                    color: 'var(--text-primary)', lineHeight: 1.5,
                  }}>
                    <span style={{ color: 'var(--teal)', marginTop: 2, flexShrink: 0 }}>›</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* 3 proof cards */}
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: 'FabricxAI',
                accent: '#E8916F',
                agentCount: 22,
                stat: '22 agents',
                title: 'Workflow automation, end-to-end',
                desc: 'FabricxAI runs 22 coordinated agents that ingest, classify, route, process, and report — without a human in the loop for routine work.',
              },
              {
                label: 'NEXARA',
                accent: '#7B6FE8',
                agentCount: 13,
                stat: '13 agents',
                title: 'Conversational intelligence layer',
                desc: 'NEXARA deploys 13 specialized agents handling intent classification, context retrieval, response generation, escalation, and follow-up.',
              },
              {
                label: 'Dev Pipeline',
                accent: '#72C4B2',
                agentCount: 10,
                stat: '10 agents',
                title: 'Our own build system, agentified',
                desc: 'The pipeline we use to build client software runs 10 agents: spec parsing, code generation, review, testing, security scan, and deploy.',
              },
            ].map((card) => (
              <StaggerItem key={card.label}>
                <article className="card" style={{
                  padding: '28px 24px', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: card.accent,
                  }} />
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 16,
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500,
                      color: card.accent, textTransform: 'uppercase', letterSpacing: '0.12em',
                    }}>
                      {card.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800,
                      color: card.accent, letterSpacing: '-0.02em',
                    }}>
                      {card.stat}
                    </div>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-headline)', fontSize: '1rem', fontWeight: 600,
                    color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 10,
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.84rem', lineHeight: 1.65,
                    color: 'var(--text-secondary)', flex: 1,
                  }}>
                    {card.desc}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <ScrollReveal>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Button href="/aaas" variant="ghost" size="md">
                Learn about AaaS
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SOCIAL PROOF
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Trusted by builders"
              title="What our customers say"
              centered
              className="mb-12"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {TESTIMONIALS.map((t, i) => (
              <StaggerItem key={i}>
                <TestimonialCard
                  quote={t.quote}
                  author={t.author}
                  role={t.role}
                  company={t.company}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>

          <ScrollReveal>
            <LogoMarquee />
          </ScrollReveal>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LATEST FROM SOCIOFI TECHNOLOGY
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Latest"
              title="From SocioFi Technology"
              centered
              className="mb-12"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LATEST.map((item, i) => (
              <StaggerItem key={i}>
                <Link href={item.href} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
                  <article
                    className="card"
                    style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem', fontWeight: 500,
                      color: item.accent, textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: 12,
                    }}>
                      {item.type}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em',
                      lineHeight: 1.35, color: 'var(--text-primary)',
                      marginBottom: 10, flex: 1,
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem', lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      margin: '0 0 20px',
                    }}>
                      {item.excerpt}
                    </p>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.8rem', fontWeight: 600,
                      color: item.accent, marginTop: 'auto',
                    }}>
                      {item.cta}
                      <ArrowRight size={13} aria-hidden="true" />
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <CTASection
        title="Ready to Build Something Intelligent?"
        subtitle="Book a free 30-minute call. Tell us what you need. We'll point you to the right division."
        primaryCTA={{ label: 'Book Your Free Call', href: '/contact' }}
        ghostCTA={{ label: 'Explore Divisions', href: '#divisions' }}
        note="No obligation. Response within 24 hours."
      />
    </>
  );
}
