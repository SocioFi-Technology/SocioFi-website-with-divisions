'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#4DBFA8';

const STYLES = `
  .svc-sec-page {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* ── Hero ── */
  .svc-sec-hero {
    padding: 160px 32px 100px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .svc-sec-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 700px 500px at 50% 0%, rgba(77,191,168,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 400px 300px at 80% 70%, rgba(58,88,158,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .svc-sec-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .svc-sec-label::before,
  .svc-sec-label::after {
    content: '';
    width: 24px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .svc-sec-label.left-align {
    justify-content: flex-start;
  }
  .svc-sec-label.left-align::after { display: none; }
  .svc-sec-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin-bottom: 24px;
    max-width: 880px;
    margin-left: auto;
    margin-right: auto;
  }
  .svc-sec-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 620px;
    margin: 0 auto 48px;
  }
  .svc-sec-hero-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .svc-sec-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: linear-gradient(135deg, var(--navy) 0%, ${A} 100%);
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 100px;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(77,191,168,0.3);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
  }
  .svc-sec-btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(77,191,168,0.45);
  }
  .svc-sec-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 100px;
    border: 1.5px solid var(--border);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .svc-sec-btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  /* ── Sections ── */
  .svc-sec-section {
    padding: 100px 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-sec-section-alt {
    background: var(--bg-2);
    padding: 100px 32px;
  }
  .svc-sec-section-alt-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-sec-section-header { margin-bottom: 56px; }
  .svc-sec-section-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-sec-section-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 560px;
  }

  /* ── Security Practices Grid ── */
  .svc-sec-practices-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 1024px) { .svc-sec-practices-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .svc-sec-practices-grid { grid-template-columns: 1fr; } }
  .svc-sec-practice-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s var(--ease), transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
  }
  .svc-sec-practice-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--navy), ${A});
    opacity: 0;
    transition: opacity 0.3s;
  }
  .svc-sec-practice-card:hover {
    border-color: rgba(77,191,168,0.2);
    transform: translateY(-5px);
    box-shadow: var(--card-hover-shadow);
  }
  .svc-sec-practice-card:hover::before { opacity: 1; }
  .svc-sec-practice-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(77,191,168,0.08);
    border: 1px solid rgba(77,191,168,0.15);
    border-radius: var(--radius-sm);
    margin-bottom: 20px;
    color: ${A};
  }
  .svc-sec-practice-number {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${A};
    margin-bottom: 8px;
  }
  .svc-sec-practice-title {
    font-family: var(--font-headline);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 14px;
    letter-spacing: -0.01em;
  }
  .svc-sec-practice-desc {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  .svc-sec-practice-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .svc-sec-tag {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    padding: 4px 10px;
    border-radius: 100px;
    background: rgba(77,191,168,0.07);
    border: 1px solid rgba(77,191,168,0.15);
    color: ${A};
    letter-spacing: 0.04em;
  }

  /* ── CTO Quote ── */
  .svc-sec-quote-section {
    padding: 80px 32px;
    background: var(--bg-3);
    position: relative;
    overflow: hidden;
  }
  .svc-sec-quote-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(77,191,168,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
  .svc-sec-quote-inner {
    max-width: 860px;
    margin: 0 auto;
    position: relative;
  }
  .svc-sec-quote-mark {
    font-size: 6rem;
    line-height: 0.7;
    color: ${A};
    opacity: 0.2;
    margin-bottom: 16px;
    display: block;
    font-family: Georgia, serif;
    font-weight: 700;
  }
  .svc-sec-quote-text {
    font-family: var(--font-headline);
    font-size: clamp(1.2rem, 2.5vw, 1.6rem);
    font-weight: 600;
    line-height: 1.5;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    margin-bottom: 32px;
    font-style: italic;
  }
  .svc-sec-quote-attr {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .svc-sec-quote-attr-line {
    width: 32px;
    height: 1.5px;
    background: ${A};
    flex-shrink: 0;
  }
  .svc-sec-quote-name {
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .svc-sec-quote-role {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 2px;
    font-family: var(--font-mono);
    letter-spacing: 0.03em;
  }

  /* ── Security by Plan Table ── */
  .svc-sec-plan-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .svc-sec-plan-table thead tr { background: var(--bg-card); }
  .svc-sec-plan-table th {
    padding: 20px 28px;
    text-align: left;
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
  }
  .svc-sec-plan-table th:first-child {
    width: 220px;
    color: var(--text-muted);
    font-weight: 400;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .svc-sec-plan-table td {
    padding: 18px 28px;
    font-size: 0.88rem;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border);
    line-height: 1.55;
    vertical-align: top;
  }
  .svc-sec-plan-table tr:last-child td { border-bottom: none; }
  .svc-sec-plan-table td:first-child {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-weight: 500;
  }
  .svc-sec-plan-table .highlight { color: ${A}; font-weight: 500; }
  .svc-sec-plan-table .scale-cell { color: var(--text-primary); }
  @media (max-width: 768px) {
    .svc-sec-plan-table { font-size: 0.82rem; }
    .svc-sec-plan-table th, .svc-sec-plan-table td { padding: 14px 16px; }
  }

  /* ── CTA ── */
  .svc-sec-cta {
    padding: 100px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: var(--bg-2);
  }
  .svc-sec-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 800px 400px at 50% 50%, rgba(77,191,168,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .svc-sec-cta-inner { position: relative; max-width: 680px; margin: 0 auto; }
  .svc-sec-cta h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-sec-cta p {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 40px;
  }
  .svc-sec-cta-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  @keyframes svcPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.15); }
  }
`;

const PRACTICES = [
  {
    num: '01',
    title: 'Vulnerability Scanning',
    desc: 'Weekly automated scans across all package dependencies — frontend, backend, and infrastructure. We cross-reference findings against live CVE databases, verify severity with human eyes, and filter false positives before anything hits your inbox.',
    tags: ['Weekly automated', 'CVE databases', 'Human verified'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Patch Management',
    desc: 'Patches deployed on a severity-driven schedule. Critical vulnerabilities patched within 24 hours. High-severity within 72 hours. Medium-severity in the next scheduled maintenance window. Every patch goes through staging first — no untested changes to production, even under pressure.',
    tags: ['Critical: <24hrs', 'High: <72hrs', 'Staging-first'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Access Control',
    desc: 'Principle of least privilege applied to all service accounts and team access. SSH keys rotated every 90 days. Two-factor authentication required for all administrative access. Access logs reviewed regularly for anomalous patterns.',
    tags: ['Least privilege', '90-day key rotation', '2FA required'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Backup & Recovery',
    desc: 'Daily automated backups for Essential and Growth plans; hourly for Scale. Backup restoration is tested quarterly — we verify your data can actually be recovered, not just stored. Disaster recovery runbooks maintained and updated for your specific stack.',
    tags: ['Daily backups', 'Tested quarterly', 'DR runbooks'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
  {
    num: '05',
    title: 'SSL/TLS Management',
    desc: "Daily certificate validity checks across all your domains. Alerts triggered at 30 days to expiry, with auto-renewal configured where the hosting provider supports it. TLS configuration hardened to target an A+ SSL Labs rating — weak ciphers and outdated protocol versions removed.",
    tags: ['Daily checks', '30-day alerts', 'A+ target grade'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Compliance Readiness',
    desc: 'Security documentation, access logs, and audit trails maintained to support SOC 2 Type II preparation. GDPR-appropriate data handling practices applied throughout. HIPAA-relevant controls available on Scale plan. We document our practices so your compliance conversations are easier.',
    tags: ['SOC 2 prep', 'GDPR practices', 'HIPAA on Scale'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

const PLAN_ROWS = [
  { feature: 'Vulnerability Scanning', essential: 'Monthly automated scan', growth: 'Weekly automated scan', scale: 'Continuous + deep monthly scan' },
  { feature: 'Critical Patch SLA', essential: '72 hours', growth: '24 hours', scale: 'Immediate (same-day)' },
  { feature: 'High Severity Patch SLA', essential: 'Next maintenance window', growth: '72 hours', scale: '24 hours' },
  { feature: 'Backup Frequency', essential: 'Daily', growth: 'Daily', scale: 'Hourly' },
  { feature: 'Backup Retention', essential: '7 days', growth: '30 days', scale: '90 days' },
  { feature: 'SSL Management', essential: 'Daily checks + alerts', growth: 'Daily checks + auto-renewal', scale: 'Auto-renewal + A+ hardening' },
  { feature: 'Access Log Review', essential: 'Monthly', growth: 'Weekly', scale: 'Continuous monitoring' },
  { feature: 'Compliance Documentation', essential: 'Basic security summary', growth: 'Monthly security report', scale: 'Full audit trail + compliance readiness' },
];

export default function SecurityPage() {
  const practicesRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const practicesInView = useInView(practicesRef, { once: true, amount: 0.1 });
  const quoteInView = useInView(quoteRef, { once: true, amount: 0.3 });
  const tableInView = useInView(tableRef, { once: true, amount: 0.1 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.1 });

  return (
    <main className="svc-sec-page">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="svc-sec-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-sec-label">Security</div>
          <h1 className="svc-sec-h1">
            Your Software, Protected Against<br />What's Coming.
          </h1>
          <p className="svc-sec-subtitle">
            New vulnerabilities are published every day. Dependency packages go outdated every week.
            Attackers don't take weekends off — and neither does our security practice.
          </p>
          <div className="svc-sec-hero-btns">
            <Link href="/services/get-protected" className="svc-sec-btn-primary">
              Get Protected
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/plans" className="svc-sec-btn-ghost">
              See Plans
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── 6 SECURITY PRACTICES ── */}
      <section className="svc-sec-section" ref={practicesRef}>
        <div className="svc-sec-section-header">
          <div className="svc-sec-label left-align">Security Practice</div>
          <h2 className="svc-sec-section-h2">Six practices. Applied continuously.</h2>
          <p className="svc-sec-section-desc">
            Security isn't a one-time audit. These six practices run in parallel, continuously,
            on every active Services client's software.
          </p>
        </div>
        <div className="svc-sec-practices-grid">
          {PRACTICES.map((p, i) => (
            <motion.div
              key={p.num}
              className="svc-sec-practice-card"
              initial={{ opacity: 0, y: 24 }}
              animate={practicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="svc-sec-practice-icon">{p.icon}</div>
              <div className="svc-sec-practice-number">{p.num}</div>
              <div className="svc-sec-practice-title">{p.title}</div>
              <div className="svc-sec-practice-desc">{p.desc}</div>
              <div className="svc-sec-practice-tags">
                {p.tags.map((tag) => (
                  <span key={tag} className="svc-sec-tag">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTO QUOTE ── */}
      <section className="svc-sec-quote-section" ref={quoteRef}>
        <motion.div
          className="svc-sec-quote-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="svc-sec-quote-mark" aria-hidden="true">"</span>
          <blockquote className="svc-sec-quote-text">
            Security isn't a feature you add — it's a practice you maintain. The difference between a secure
            product and a vulnerable one is usually 3–6 months of neglected patches. That's exactly the gap
            Services fills.
          </blockquote>
          <div className="svc-sec-quote-attr">
            <div className="svc-sec-quote-attr-line" aria-hidden="true" />
            <div>
              <div className="svc-sec-quote-name">Kamrul Hasan</div>
              <div className="svc-sec-quote-role">CTO, SocioFi Technology</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── SECURITY BY PLAN ── */}
      <section className="svc-sec-section" ref={tableRef}>
        <div className="svc-sec-section-header">
          <div className="svc-sec-label left-align">Security by Plan</div>
          <h2 className="svc-sec-section-h2">What you get at each tier.</h2>
          <p className="svc-sec-section-desc">
            Every plan includes active security practices. Higher tiers add frequency, speed, and depth.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <table className="svc-sec-plan-table" aria-label="Security features by plan">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Essential</th>
                <th scope="col">Growth</th>
                <th scope="col">Scale</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_ROWS.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  <td>{row.essential}</td>
                  <td className="highlight">{row.growth}</td>
                  <td className="scale-cell">{row.scale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-sec-cta" ref={ctaRef}>
        <motion.div
          className="svc-sec-cta-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-sec-label">How secure are you right now?</div>
          <h2>Most vulnerabilities are fixable. The question is whether you know they're there.</h2>
          <p>
            We run an initial security audit within 48 hours of onboarding. You'll know exactly where
            your exposure is — and we'll have a plan to close it.
          </p>
          <div className="svc-sec-cta-btns">
            <Link href="/services/get-protected" className="svc-sec-btn-primary">
              Get a Security Audit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/plans" className="svc-sec-btn-ghost">
              See Plans
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
