'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const A = '#5BB5E0';
const F = {
  headline: "var(--font-display, 'Syne', sans-serif)",
  body: "var(--font-body, 'Outfit', sans-serif)",
  mono: "var(--font-mono, 'Fira Code', monospace)",
};

const STYLES = `
  .cs-page {
    background: var(--bg, #0C0C1D);
    color: var(--text-primary, #fff);
    min-height: 100vh;
    font-family: ${F.body};
  }

  /* ── Hero ── */
  .cs-hero {
    padding: 160px 32px 120px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cs-hero-inner {
    max-width: 760px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  .cs-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: ${F.mono};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 24px;
  }
  .cs-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cs-h1 {
    font-family: ${F.headline};
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary, #fff);
    margin-bottom: 24px;
  }
  .cs-sub {
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary, #7C8DB0);
    max-width: 600px;
    margin: 0 auto;
  }
  .cs-hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
  }

  /* ── Sections ── */
  .cs-section {
    padding: 100px 32px;
  }
  .cs-section-alt {
    background: var(--bg-2, #111128);
  }
  .cs-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .cs-sec-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: ${F.mono};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 14px;
  }
  .cs-sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cs-sec-h2 {
    font-family: ${F.headline};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary, #fff);
    margin-bottom: 16px;
    text-align: center;
  }
  .cs-sec-desc {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary, #7C8DB0);
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
  }

  /* ── Security Cards Grid ── */
  .cs-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 56px;
  }
  @media (max-width: 768px) {
    .cs-cards-grid { grid-template-columns: 1fr; }
  }
  .cs-card {
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 20px;
    padding: 32px;
    position: relative;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  .cs-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--navy, #3A589E), ${A});
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cs-card:hover {
    border-color: ${A}30;
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .cs-card:hover::before {
    opacity: 1;
  }
  .cs-card-num {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: ${A}18;
    border: 1px solid ${A}30;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${F.mono};
    font-size: 0.8rem;
    font-weight: 600;
    color: ${A};
    margin-bottom: 20px;
    flex-shrink: 0;
  }
  .cs-card-title {
    font-family: ${F.headline};
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-primary, #fff);
    margin-bottom: 16px;
    letter-spacing: -0.01em;
  }
  .cs-bullets {
    list-style: none;
    padding: 0;
    margin: 0 0 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .cs-bullet {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-secondary, #7C8DB0);
  }
  .cs-bullet-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
    flex-shrink: 0;
    margin-top: 7px;
  }
  .cs-card-note {
    font-family: ${F.mono};
    font-size: 0.72rem;
    color: ${A};
    padding: 10px 14px;
    background: ${A}10;
    border-radius: 8px;
    border-left: 2px solid ${A};
  }

  /* ── Quote ── */
  .cs-quote-wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px;
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 24px;
    position: relative;
  }
  .cs-quote-mark {
    position: absolute;
    top: 24px;
    left: 32px;
    font-family: ${F.headline};
    font-size: 6rem;
    font-weight: 800;
    line-height: 1;
    color: ${A};
    opacity: 0.12;
    pointer-events: none;
  }
  .cs-quote-text {
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--text-secondary, #7C8DB0);
    font-style: italic;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }
  .cs-quote-attr {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cs-quote-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--navy, #3A589E), ${A});
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${F.headline};
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .cs-quote-name {
    font-family: ${F.headline};
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary, #fff);
  }
  .cs-quote-role {
    font-family: ${F.mono};
    font-size: 0.72rem;
    color: ${A};
    margin-top: 2px;
  }

  /* ── Layers Diagram ── */
  .cs-layers {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 740px;
    margin: 48px auto 0;
  }
  .cs-layer {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 22px 28px;
    border-radius: 12px;
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .cs-layer:hover {
    border-color: ${A}30;
    transform: translateX(6px);
  }
  .cs-layer-bar {
    width: 4px;
    height: 40px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cs-layer-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cs-layer-info {
    flex: 1;
  }
  .cs-layer-name {
    font-family: ${F.headline};
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary, #fff);
    margin-bottom: 4px;
  }
  .cs-layer-desc {
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-secondary, #7C8DB0);
  }
  .cs-layer-label {
    font-family: ${F.mono};
    font-size: 0.68rem;
    color: var(--text-muted, #4A5578);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .cs-layers-note {
    text-align: center;
    margin-top: 24px;
    font-size: 0.9rem;
    color: var(--text-secondary, #7C8DB0);
    line-height: 1.6;
  }

  /* ── CTA ── */
  .cs-cta-section {
    padding: 100px 32px;
    position: relative;
    overflow: hidden;
  }
  .cs-cta-inner {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
  }
  .cs-cta-h2 {
    font-family: ${F.headline};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary, #fff);
    margin-bottom: 16px;
  }
  .cs-cta-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary, #7C8DB0);
    margin-bottom: 36px;
  }
  .cs-cta-btns {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .cs-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: linear-gradient(135deg, var(--navy, #3A589E), ${A});
    color: #fff;
    border-radius: 100px;
    font-family: ${F.headline};
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    letter-spacing: -0.01em;
  }
  .cs-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(91,181,224,0.3);
  }
  .cs-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border: 1.5px solid var(--border, rgba(91,181,224,0.15));
    color: var(--text-primary, #fff);
    border-radius: 100px;
    font-family: ${F.headline};
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    letter-spacing: -0.01em;
    background: transparent;
  }
  .cs-btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }
  .cs-cta-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
`;

// ── SVG Icons ────────────────────────────────────────────────────────────────
function IconShield({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconLock({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconKey({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2L11.5 11.5M15.5 7.5l2 2M18 5l2 2" />
    </svg>
  );
}

function IconServer({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function IconDatabase({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function IconEye({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCloud({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function IconArrowRight({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const SECURITY_LAYERS = [
  {
    num: '01',
    title: 'Network Security',
    bullets: [
      'VPC isolation — each client\'s infrastructure is isolated',
      'Firewall rules — only necessary ports open',
      'DDoS mitigation through CloudFlare / AWS Shield',
      'Rate limiting on all public endpoints',
    ],
    note: 'Your traffic never touches another client\'s server',
  },
  {
    num: '02',
    title: 'Access Control',
    bullets: [
      'SSH key-only access (no passwords)',
      'Two-factor authentication for all admin access',
      'Principle of least privilege — only assigned engineers have access',
      'Access logs maintained and auditable',
      'Key rotation every 90 days',
    ],
    note: null,
  },
  {
    num: '03',
    title: 'OS & Server Patching',
    bullets: [
      'Security updates applied within 48 hours',
      'Critical patches within 24 hours',
      'Automatic schedule for non-breaking patches',
      'Tested in staging before production (Professional/Enterprise)',
    ],
    note: null,
  },
  {
    num: '04',
    title: 'Encryption',
    bullets: [
      'Data encrypted in transit (TLS 1.3)',
      'Data encrypted at rest (AES-256)',
      'Database connections encrypted',
      'Backup files encrypted',
    ],
    note: null,
  },
  {
    num: '05',
    title: 'Backup Security',
    bullets: [
      'Backups stored in separate region from primary',
      'Backup files encrypted at rest',
      'Access restricted to authorized engineers',
      'Quarterly restore tests to verify backup integrity',
    ],
    note: null,
  },
  {
    num: '06',
    title: 'Secrets Management',
    bullets: [
      'Environment variables encrypted at rest',
      'Secrets never committed to code repositories',
      'Rotation reminders for API keys and credentials',
      'Access audit trail for all secret reads',
    ],
    note: null,
  },
  {
    num: '07',
    title: 'Monitoring & Detection',
    bullets: [
      'Intrusion detection on all servers',
      'Unusual login attempt alerts',
      'Traffic anomaly detection',
      'File integrity monitoring (Enterprise)',
    ],
    note: null,
  },
  {
    num: '08',
    title: 'Compliance',
    bullets: [
      'SOC 2 Type II preparation (on roadmap)',
      'GDPR-ready: EU data residency available via Hetzner',
      'Data processing agreements available',
      'Security documentation maintained for your audits',
    ],
    note: null,
  },
];

const DIAGRAM_LAYERS = [
  {
    label: 'Layer 1 — Cloud',
    name: 'Infrastructure Security',
    desc: 'Firewalls, OS patches, encryption, access control',
    color: A,
    iconEl: <IconServer size={18} color={A} />,
  },
  {
    label: 'Layer 2 — Services',
    name: 'Application Security',
    desc: 'Code vulnerabilities, dependency patches, auth',
    color: '#4DBFA8',
    iconEl: <IconShield size={18} color="#4DBFA8" />,
  },
  {
    label: 'Layer 3 — Agents',
    name: 'Data Security',
    desc: 'Agent data handling, privacy, data isolation',
    color: '#7B6FE8',
    iconEl: <IconDatabase size={18} color="#7B6FE8" />,
  },
];

// ── Animated Card ─────────────────────────────────────────────────────────────
function SecurityCard({ card, index }: { card: typeof SECURITY_LAYERS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="cs-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="cs-card-num">{card.num}</div>
      <div className="cs-card-title">{card.title}</div>
      <ul className="cs-bullets">
        {card.bullets.map((b, i) => (
          <li key={i} className="cs-bullet">
            <span className="cs-bullet-dot" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {card.note && (
        <div className="cs-card-note">{card.note}</div>
      )}
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CloudSecurityPage() {
  const quoteRef = useRef(null);
  const diagramRef = useRef(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: '-80px' });
  const diagramInView = useInView(diagramRef, { once: true, margin: '-80px' });

  return (
    <>
      <style>{STYLES}</style>
      <div className="cs-page">

        {/* ── Hero ── */}
        <section className="cs-hero">
          {/* Orbs */}
          <div className="cs-hero-orb" style={{ width: 600, height: 600, background: `${A}18`, top: -200, left: '50%', transform: 'translateX(-50%)' }} />
          <div className="cs-hero-orb" style={{ width: 300, height: 300, background: '#7B6FE830', top: 100, right: '10%' }} />

          <div className="cs-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cs-label">Infrastructure Security</div>
            </motion.div>

            <motion.h1
              className="cs-h1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Security Starts at the Foundation.
            </motion.h1>

            <motion.p
              className="cs-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Before your application security, before your data encryption — there&apos;s infrastructure security. Firewalls, access control, OS patching, DDoS protection. We handle all of it.
            </motion.p>
          </div>
        </section>

        {/* ── 8 Security Layers ── */}
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-cards-grid">
              {SECURITY_LAYERS.map((card, i) => (
                <SecurityCard key={card.num} card={card} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTO Quote ── */}
        <section className="cs-section cs-section-alt">
          <div className="cs-container">
            <motion.div
              ref={quoteRef}
              className="cs-quote-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={quoteInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cs-quote-mark">&ldquo;</div>
              <p className="cs-quote-text">
                Infrastructure security is the part most founders don&apos;t think about because they can&apos;t see it. There&apos;s no UI for &ldquo;is my firewall configured correctly?&rdquo; That&apos;s exactly why it needs a professional. One misconfigured security group and your database is exposed to the internet. We&apos;ve seen it happen. To other companies&apos; clients.
              </p>
              <div className="cs-quote-attr">
                <div className="cs-quote-avatar">KH</div>
                <div>
                  <div className="cs-quote-name">Kamrul Hasan</div>
                  <div className="cs-quote-role">CTO, SocioFi Technology</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Three-Layer Security Diagram ── */}
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-sec-label" style={{ justifyContent: 'center' }}>Security Architecture</div>
            <h2 className="cs-sec-h2">Three layers of security. Each handled by specialists.</h2>
            <p className="cs-sec-desc">Each layer is independently important. Together, they cover everything.</p>

            <motion.div
              ref={diagramRef}
              className="cs-layers"
              initial={{ opacity: 0, y: 30 }}
              animate={diagramInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {DIAGRAM_LAYERS.map((layer, i) => (
                <motion.div
                  key={i}
                  className="cs-layer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={diagramInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="cs-layer-bar" style={{ background: layer.color }} />
                  <div className="cs-layer-icon" style={{ background: `${layer.color}18` }}>
                    {layer.iconEl}
                  </div>
                  <div className="cs-layer-info">
                    <div className="cs-layer-label">{layer.label}</div>
                    <div className="cs-layer-name">{layer.name}</div>
                    <div className="cs-layer-desc">{layer.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cs-cta-section cs-section-alt">
          <div className="cs-cta-orb" style={{ width: 500, height: 500, background: `${A}15`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          <div className="cs-cta-inner">
            <div className="cs-sec-label" style={{ justifyContent: 'center' }}>Get Protected</div>
            <h2 className="cs-cta-h2">Want to know if your current infrastructure is secure?</h2>
            <p className="cs-cta-desc">We audit your existing setup and give you a plain-language report on what&apos;s exposed, what&apos;s at risk, and what needs to be fixed.</p>
            <div className="cs-cta-btns">
              <Link href="/cloud/audit" className="cs-btn-primary">
                Get an Infrastructure Audit
                <IconArrowRight size={16} color="#fff" />
              </Link>
              <Link href="/cloud/plans" className="cs-btn-ghost">
                See Security Across Plans
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
