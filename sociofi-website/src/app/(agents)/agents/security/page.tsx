'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .sec-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .sec-container { max-width:1100px; margin:0 auto; padding:0 32px; }
  .sec-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .sec-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .sec-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .sec-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .sec-page { padding:80px 0; display:flex; flex-direction:column; gap:48px; }
  .sec-block { border-left:3px solid ${A}; padding-left:28px; }
  .sec-block-title { font-family:${F.h}; font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; display:flex; align-items:center; gap:10px; }
  .sec-block-icon { font-size:1.2rem; }
  .sec-block-body { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); line-height:1.7; }
  .sec-block-list { list-style:none; padding:0; margin:12px 0 0; display:flex; flex-direction:column; gap:8px; }
  .sec-block-list li { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:8px; line-height:1.6; }
  .sec-block-list li::before { content:'→'; color:${A}; flex-shrink:0; font-weight:700; }
  .sec-block-tag { display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.25); font-family:${F.m}; font-size:0.66rem; color:${A}; letter-spacing:0.08em; margin-left:8px; }
  .sec-compliance { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; }
  @media(max-width:600px) { .sec-compliance { grid-template-columns:1fr; } }
  .sec-comp-item { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:18px 20px; }
  .sec-comp-name { font-family:${F.h}; font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .sec-comp-status { font-family:${F.m}; font-size:0.66rem; letter-spacing:0.08em; }
  .sec-comp-desc { font-family:${F.b}; font-size:0.8rem; color:var(--text-secondary); line-height:1.5; margin-top:6px; }
  .sec-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .sec-btn-ghost:hover { border-color:${A}; color:${A}; }
  .sec-badge-green { background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); color:#22C55E; }
  .sec-badge-amber { background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:#F59E0B; }
`;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

const BLOCKS = [
  {
    icon: '🔐',
    title: 'Encryption',
    body: 'All data is encrypted in transit and at rest using industry-standard algorithms.',
    items: [
      'TLS 1.3 for all data in transit — between your systems, our agents, and our infrastructure.',
      'AES-256 encryption at rest for all stored data, credentials, and logs.',
      'Cryptographic key rotation on a quarterly schedule.',
      'No sensitive data (credentials, PII) is ever logged in plain text.',
    ],
  },
  {
    icon: '🏢',
    title: 'Infrastructure',
    body: 'Your agents run on SocioFi\'s own managed infrastructure — not shared public cloud services.',
    items: [
      'Hosted on SocioFi Cloud — our own managed infrastructure with physical separation.',
      'Agent workloads are isolated in containerized environments per client.',
      'No cross-tenant data sharing or shared execution environments.',
      'Infrastructure located in ISO 27001-certified data centers.',
    ],
  },
  {
    icon: '👥',
    title: 'Access Controls',
    body: 'Granular role-based access so only the right people see agent data and outputs.',
    items: [
      'Role-based access control (RBAC) at the organization and agent level.',
      'Each team member sees only the agents and outputs you authorize.',
      'Full audit log of every access event — who saw what and when.',
      'API access via scoped tokens with configurable permissions and expiry.',
    ],
  },
  {
    icon: '📋',
    title: 'Data Handling Policy',
    body: 'Clear rules for what data we process, how we store it, and how long we keep it.',
    items: [
      'We process only the data required for agent tasks to function.',
      'No data is used to train our models or shared with third parties.',
      'You own all data processed by your agents at all times.',
      'Data processing agreements (DPA) available for all clients.',
    ],
  },
  {
    icon: '⚠️',
    title: 'Incident Response',
    body: 'When something goes wrong, you\'ll know fast and we\'ll act immediately.',
    items: [
      'Automated monitoring detects anomalies in agent behavior within minutes.',
      'Incident response initiated within 4 hours of confirmed security event.',
      'Clients notified within 24 hours of any incident affecting their data.',
      'Post-incident root cause analysis and remediation report within 5 business days.',
    ],
  },
  {
    icon: '🗑',
    title: 'Data Deletion Policy',
    body: 'When you cancel, your data is fully deleted — not archived, not retained.',
    items: [
      'All client data deleted within 30 days of subscription cancellation.',
      'Deletion covers: inputs, outputs, logs, credentials, and configuration.',
      'Deletion confirmation report available upon request.',
      'Early deletion available on request before the 30-day window.',
    ],
  },
];

const COMPLIANCE = [
  { name: 'SOC 2 Type II', status: 'IN PROGRESS', badge: 'sec-badge-amber', desc: 'Audit in progress. Completion target: Q4 2026. We operate against SOC 2 controls today.' },
  { name: 'GDPR', status: 'READY', badge: 'sec-badge-green', desc: 'GDPR-ready operations. DPA available. EU data processing supported.' },
  { name: 'ISO 27001', status: 'HOSTED ON CERTIFIED DC', badge: 'sec-badge-green', desc: 'Our hosting infrastructure is in ISO 27001-certified data centers.' },
  { name: 'HIPAA', status: 'ON ROADMAP', badge: 'sec-badge-amber', desc: 'BAA available for healthcare clients. Full HIPAA compliance roadmap in progress.' },
];

export default function SecurityPage() {
  return (
    <>
      <style>{STYLES}</style>

      <section className="sec-hero">
        <div className="sec-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="sec-label">Security</div>
          </motion.div>
          <motion.h1 className="sec-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Your Data Stays Yours.
          </motion.h1>
          <motion.p className="sec-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Full transparency on how we protect your data — encryption, access controls, hosting, compliance, and what happens if something goes wrong.
          </motion.p>
        </div>
      </section>

      <div className="sec-container">
        <div className="sec-page">
          {BLOCKS.map((block, i) => (
            <Reveal key={block.title} delay={i * 0.06}>
              <div className="sec-block">
                <div className="sec-block-title">
                  <span className="sec-block-icon">{block.icon}</span>
                  {block.title}
                </div>
                <div className="sec-block-body">{block.body}</div>
                <ul className="sec-block-list">
                  {block.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Compliance */}
          <Reveal>
            <div className="sec-block">
              <div className="sec-block-title">
                <span className="sec-block-icon">📜</span>
                Compliance Roadmap
              </div>
              <div className="sec-block-body">Our current compliance status and roadmap. We publish this openly — no marketing language.</div>
              <div className="sec-compliance">
                {COMPLIANCE.map(c => (
                  <div key={c.name} className="sec-comp-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div className="sec-comp-name">{c.name}</div>
                      <span className={`sec-comp-status ${c.badge}`} style={{ fontFamily: F.m, fontSize: '0.62rem', padding: '2px 8px', borderRadius: 100, letterSpacing: '0.08em' }}>{c.status}</span>
                    </div>
                    <div className="sec-comp-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', paddingBottom: 40 }}>
              <Link href="/agents/enterprise" className="sec-btn-ghost">Enterprise security options →</Link>
              <Link href="/agents/deploy" className="sec-btn-ghost">Request a DPA</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
