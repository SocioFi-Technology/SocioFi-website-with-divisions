'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  headline: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .faq-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); min-height: 100vh; font-family: ${F.body}; }

  /* Hero */
  .faq-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .faq-hero-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 2; }
  .faq-glow { position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse at center, ${A}0E 0%, transparent 70%); pointer-events: none; }
  .faq-label { display: flex; align-items: center; justify-content: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; }
  .faq-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .faq-h1 { font-family: ${F.headline}; font-size: clamp(2.4rem, 4.5vw, 3.6rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .faq-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #8E9FC4); max-width: 520px; margin: 0 auto; }

  /* Section */
  .faq-section { padding: 100px 32px; }
  .faq-section-alt { background: var(--bg-2, #111128); }
  .faq-container { max-width: 820px; margin: 0 auto; }

  /* Category */
  .faq-cat-label { font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
  .faq-cat-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .faq-cat-h2 { font-family: ${F.headline}; font-size: 1.4rem; font-weight: 700; color: var(--text-primary, #fff); letter-spacing: -0.02em; margin-bottom: 6px; }
  .faq-cat-count { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); margin-bottom: 28px; }

  /* Accordion */
  .faq-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 72px; }
  .faq-item { border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 12px; background: var(--bg-card, #13132B); overflow: hidden; transition: border-color 0.3s; }
  .faq-item.open { border-color: ${A}25; }
  .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; cursor: pointer; background: none; border: none; text-align: left; gap: 16px; }
  .faq-btn:hover .faq-q { color: ${A}; }
  .faq-q { font-family: ${F.headline}; font-size: 0.97rem; font-weight: 600; color: var(--text-primary, #fff); line-height: 1.35; transition: color 0.2s; }
  .faq-icon { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--border, rgba(91,181,224,0.15)); display: flex; align-items: center; justify-content: center; color: ${A}; flex-shrink: 0; transition: all 0.3s; }
  .faq-item.open .faq-icon { background: ${A}18; border-color: ${A}30; }
  .faq-answer { padding: 0 24px 20px; }
  .faq-a { font-size: 0.92rem; line-height: 1.72; color: var(--text-secondary, #8E9FC4); }

  /* CTA */
  .faq-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2, #111128), ${A}08); text-align: center; }
  .faq-cta-h2 { font-family: ${F.headline}; font-size: clamp(2rem, 3.5vw, 2.6rem); font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 16px; letter-spacing: -0.025em; }
  .faq-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #8E9FC4); max-width: 420px; margin: 0 auto 36px; line-height: 1.7; }
  .faq-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .faq-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .faq-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(91,181,224,0.3); }
  .faq-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .faq-btn-ghost:hover { border-color: ${A}; color: ${A}; }
`;

const FAQS = [
  {
    category: 'Getting Started',
    count: 6,
    items: [
      {
        q: 'What exactly does "managed infrastructure" mean?',
        a: 'We handle all the technical infrastructure between your code and your customers: servers, databases, deployments, SSL, CDN, backups, scaling, monitoring, and security. You never touch a terminal.',
      },
      {
        q: 'Do I need any technical knowledge to use Cloud?',
        a: 'No. You tell us what your product does. We handle everything infrastructure-related. You focus on your product.',
      },
      {
        q: 'How long does setup take?',
        a: '24–48 hours for most products. More complex setups — multi-region deployments, large database migrations — may take 3–5 business days.',
      },
      {
        q: 'Can I use Cloud without Studio?',
        a: "Yes. We can host any product, not just ones built by Studio. We'll do a brief audit of your existing codebase to understand the infrastructure requirements.",
      },
      {
        q: 'Does Cloud work with any tech stack?',
        a: 'We support all major web frameworks, backend languages, and databases — Node.js, Python, Go, Ruby, PHP, PostgreSQL, MySQL, MongoDB, Redis, and more. Ask us if you have something specific.',
      },
      {
        q: "What if my product is already live somewhere?",
        a: "We migrate you. Start with an infrastructure audit at /cloud/audit — we'll assess your current setup and map out the migration path.",
      },
    ],
  },
  {
    category: 'Providers',
    count: 4,
    items: [
      {
        q: 'Which provider do you use?',
        a: 'We recommend based on your product. DigitalOcean for most clients — it covers 70% of use cases at lower cost. AWS for enterprise workloads, compliance requirements, or when you genuinely need AWS-specific services. Vercel for Next.js frontends. Railway for fast launches and containers. Hetzner for cost optimization or EU data residency requirements.',
      },
      {
        q: 'Can I choose my own provider?',
        a: 'Yes. If you have strong reasons for a specific provider — compliance, existing credits, team familiarity — we work with it.',
      },
      {
        q: 'Do you mark up the hosting cost?',
        a: "No. Never. You see the exact price the provider charges. Our revenue comes entirely from the management fee. This is a point of principle for us — we recommend the right provider for you, not the one that benefits us.",
      },
      {
        q: 'Can I switch providers later?',
        a: "Yes. We've migrated clients between providers when their needs changed. It's scoped as a migration project.",
      },
    ],
  },
  {
    category: 'Pricing & Billing',
    count: 6,
    items: [
      {
        q: 'What are the two line items on my invoice?',
        a: 'Hosting pass-through (the exact price the cloud provider charges, down to the cent) and the SocioFi management fee. Nothing else.',
      },
      {
        q: 'Can I change plans?',
        a: 'Yes. Upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades take effect at the next billing cycle.',
      },
      {
        q: 'Is there a setup fee?',
        a: 'No setup fee for clients starting on Professional or Enterprise. The Launch plan has a $99 one-time setup fee.',
      },
      {
        q: 'Do you offer annual billing discounts?',
        a: "No. Monthly billing only. We don't want to lock you in. If you stay, it's because the service is worth it.",
      },
      {
        q: 'What if I cancel?',
        a: "Your infrastructure keeps running — we don't touch it. We hand over all access credentials, infrastructure configuration, and documentation. Everything is yours.",
      },
      {
        q: 'Are there overage charges?',
        a: 'No overage charges on our management fee. Your hosting cost may increase if you use significantly more resources — but that increase is charged by the provider at actual cost, not marked up.',
      },
    ],
  },
  {
    category: 'Security',
    count: 4,
    items: [
      {
        q: 'How do you handle security patches?',
        a: 'Critical patches within 24 hours. Regular updates within 48 hours. We monitor CVE databases and apply OS-level and dependency patches proactively.',
      },
      {
        q: 'Do you have access to my data?',
        a: 'Our engineers have infrastructure-level access as needed to do their job. We sign confidentiality agreements with all clients. We do not access application-level data — your customer data is yours.',
      },
      {
        q: 'Is my infrastructure isolated from other clients?',
        a: 'Yes. Each client gets isolated infrastructure with its own VPC (Virtual Private Cloud). Your servers are not shared with other clients.',
      },
      {
        q: "What happens if there's a security breach?",
        a: 'Immediate notification, isolation of affected infrastructure, investigation, and remediation. You receive a full incident report with timeline, root cause, and remediation steps.',
      },
    ],
  },
  {
    category: 'Migration',
    count: 4,
    items: [
      {
        q: 'Can you migrate from Heroku?',
        a: "Yes. It's one of the most common migrations we do. We have a tested playbook for Heroku to DigitalOcean migrations.",
      },
      {
        q: 'How long does migration take?',
        a: '5–7 business days for most products. Complex migrations with large databases or multiple services may take up to 2 weeks.',
      },
      {
        q: 'Will there be downtime during migration?',
        a: "No. We use a parallel-build approach — your new infrastructure runs alongside your existing setup. The actual cutover is a DNS switch, typically completed in under 5 minutes with zero application downtime.",
      },
      {
        q: "What's the migration cost?",
        a: '$499–3,999 depending on complexity. The full migration fee is credited back across your first 3 months of Cloud management.',
      },
    ],
  },
  {
    category: 'Scaling',
    count: 3,
    items: [
      {
        q: 'How do you know when to scale?',
        a: 'We monitor CPU utilization, memory usage, response time trends, database query performance, and traffic patterns continuously. We recommend scaling before you hit limits, not after.',
      },
      {
        q: 'How fast can you scale?',
        a: 'Vertical scaling (larger server): same day. Horizontal scaling (more servers): 1–4 hours for provisioning and configuration. Auto-scaling on Enterprise plans responds in seconds.',
      },
      {
        q: 'Does scaling require downtime?',
        a: "Vertical scaling may require a brief server restart, typically under 2 minutes. We schedule these during your lowest-traffic window. Horizontal scaling adds capacity with no downtime at all.",
      },
    ],
  },
  {
    category: 'Integration with Services',
    count: 3,
    items: [
      {
        q: 'Do I need Cloud AND Services?',
        a: 'They serve different layers. Cloud handles infrastructure — the servers, networking, databases. Services handles your application code — bug fixes, feature updates, monitoring your app logic. Many clients use both. You can use either independently.',
      },
      {
        q: "If Studio built my product, do I automatically get Cloud?",
        a: 'Cloud deployment and configuration are included in the Studio project handoff. Ongoing management is a separate monthly plan that you opt into.',
      },
      {
        q: 'How does Cloud monitoring integrate with Services monitoring?',
        a: 'Cloud monitors the infrastructure layer — server health, resource usage, uptime. Services monitors the application layer — error rates, performance, broken functionality. Our teams coordinate directly when an incident occurs at either layer.',
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="faq-q">{q}</span>
        <span className="faq-icon">
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex' }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="faq-answer">
              <p className="faq-a">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

export default function CloudFaqPage() {
  return (
    <main className="faq-wrap">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-glow" />
        <div className="faq-hero-inner">
          <Reveal>
            <div className="faq-label">FAQ</div>
            <h1 className="faq-h1">Questions About SocioFi Cloud.</h1>
            <p className="faq-sub">Everything you want to know about managed infrastructure.</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ categories */}
      <section className="faq-section">
        <div className="faq-container">
          {FAQS.map((cat, ci) => (
            <Reveal key={cat.category} delay={ci * 0.04}>
              <div>
                <div className="faq-cat-label">{cat.category}</div>
                <h2 className="faq-cat-h2">{cat.category}</h2>
                <div className="faq-cat-count">{cat.count} questions</div>
                <div className="faq-list">
                  {cat.items.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="faq-cta">
        <Reveal>
          <div className="faq-label" style={{ justifyContent: 'center', display: 'flex' }}>Still have questions?</div>
          <h2 className="faq-cta-h2">Still have questions? Talk to us.</h2>
          <p className="faq-cta-sub">We&rsquo;re happy to walk through your specific situation before you commit to anything.</p>
          <div className="faq-btns">
            <Link href="/contact" className="faq-btn-primary">
              Talk to us
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/cloud/get-hosted" className="faq-btn-ghost">Get Hosted</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
