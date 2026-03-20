'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  headline: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .cmp-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); min-height: 100vh; font-family: ${F.body}; }

  /* Hero */
  .cmp-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .cmp-hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 2; }
  .cmp-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 700px; height: 500px; background: radial-gradient(ellipse at center, ${A}10 0%, transparent 70%); pointer-events: none; }
  .cmp-label { display: flex; align-items: center; justify-content: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; }
  .cmp-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .cmp-h1 { font-family: ${F.headline}; font-size: clamp(2.4rem, 4.5vw, 3.6rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .cmp-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #8E9FC4); max-width: 540px; margin: 0 auto 40px; }
  .cmp-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .cmp-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .cmp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(91,181,224,0.3); }
  .cmp-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .cmp-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* Shared section */
  .cmp-section { padding: 100px 32px; }
  .cmp-section-alt { background: var(--bg-2, #111128); }
  .cmp-container { max-width: 1160px; margin: 0 auto; }
  .cmp-container-narrow { max-width: 860px; margin: 0 auto; }
  .cmp-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .cmp-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .cmp-sec-label.center { justify-content: center; }
  .cmp-sec-h2 { font-family: ${F.headline}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .cmp-sec-desc { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary, #8E9FC4); max-width: 560px; }
  .cmp-centered { text-align: center; }
  .cmp-centered .cmp-sec-desc { margin: 0 auto; }

  /* Main comparison table */
  .cmp-table-wrap { overflow-x: auto; margin-top: 56px; border-radius: 16px; border: 1px solid var(--border, rgba(91,181,224,0.08)); }
  .cmp-table { width: 100%; border-collapse: collapse; min-width: 900px; }
  .cmp-table th { padding: 16px 18px; text-align: left; font-family: ${F.headline}; font-size: 0.85rem; font-weight: 700; color: var(--text-primary, #fff); background: var(--bg-card, #13132B); border-bottom: 1px solid var(--border, rgba(91,181,224,0.08)); white-space: nowrap; }
  .cmp-table th.hl { color: ${A}; background: ${A}10; border-bottom-color: ${A}20; }
  .cmp-table td { padding: 13px 18px; font-size: 0.86rem; line-height: 1.5; color: var(--text-secondary, #8E9FC4); border-bottom: 1px solid var(--border, rgba(91,181,224,0.06)); vertical-align: middle; }
  .cmp-table td.aspect { font-family: ${F.headline}; font-size: 0.88rem; font-weight: 600; color: var(--text-primary, #fff); white-space: nowrap; }
  .cmp-table td.hl { background: ${A}06; color: var(--text-primary, #fff); font-weight: 500; }
  .cmp-table td.win { color: ${A}; font-weight: 600; }
  .cmp-table tr:last-child td { border-bottom: none; }
  .cmp-table tr:hover td { background: var(--bg-card-hover, #181840); }
  .cmp-table tr:hover td.hl { background: ${A}10; }

  /* When NOT to use */
  .cmp-honest-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
  @media(max-width: 900px) { .cmp-honest-grid { grid-template-columns: 1fr; } }
  .cmp-honest-card { padding: 28px 32px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); position: relative; }
  .cmp-honest-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.06); border-radius: 16px 16px 0 0; }
  .cmp-honest-num { font-family: ${F.mono}; font-size: 0.65rem; font-weight: 600; color: var(--text-muted, #4A5578); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
  .cmp-honest-title { font-family: ${F.headline}; font-size: 1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 10px; line-height: 1.3; }
  .cmp-honest-body { font-size: 0.88rem; line-height: 1.65; color: var(--text-secondary, #8E9FC4); }

  /* PaaS deep-dive */
  .cmp-vs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 48px; }
  @media(max-width: 768px) { .cmp-vs-grid { grid-template-columns: 1fr; } }
  .cmp-vs-card { padding: 32px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); transition: all 0.3s; }
  .cmp-vs-card.us { border-color: ${A}30; background: linear-gradient(160deg, ${A}08, var(--bg-card, #13132B)); }
  .cmp-vs-card:hover { transform: translateY(-4px); border-color: ${A}25; }
  .cmp-vs-tag { display: inline-block; font-family: ${F.mono}; font-size: 0.65rem; padding: 4px 10px; border-radius: 100px; background: ${A}18; color: ${A}; margin-bottom: 16px; letter-spacing: 0.06em; font-weight: 600; text-transform: uppercase; }
  .cmp-vs-tag.neutral { background: rgba(255,255,255,0.05); color: var(--text-muted, #4A5578); }
  .cmp-vs-name { font-family: ${F.headline}; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .cmp-vs-wins { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .cmp-vs-win { display: flex; align-items: flex-start; gap: 9px; font-size: 0.88rem; color: var(--text-secondary, #8E9FC4); line-height: 1.55; }
  .cmp-vs-win svg { flex-shrink: 0; margin-top: 2px; }

  /* Honest take callout */
  .cmp-take { padding: 48px; border-radius: 20px; background: var(--bg-card, #13132B); border: 1px solid ${A}20; max-width: 780px; margin: 56px auto 0; position: relative; overflow: hidden; }
  .cmp-take::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); }
  .cmp-take-label { font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px; }
  .cmp-take-quote { font-family: ${F.headline}; font-size: clamp(1.15rem, 2.2vw, 1.45rem); font-weight: 600; color: var(--text-primary, #fff); line-height: 1.4; letter-spacing: -0.02em; margin-bottom: 16px; }
  .cmp-take-body { font-size: 0.95rem; line-height: 1.72; color: var(--text-secondary, #8E9FC4); }

  /* CTA */
  .cmp-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2, #111128), ${A}08); text-align: center; }
  .cmp-cta-h2 { font-family: ${F.headline}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 16px; letter-spacing: -0.025em; }
  .cmp-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #8E9FC4); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
`;

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

const CheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MinusIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const TABLE_ROWS = [
  { aspect: 'Monthly cost', diy: '$0 (your time)', paas: '$50–500 (plus markup)', other: '$200–1,000 (with markup)', devops: '$6K–12K salary', us: '$149–799 (no markup)' },
  { aspect: 'Hosting markup', diy: 'None', paas: 'Built-in', other: '50–300%', devops: 'None', us: 'Zero' },
  { aspect: 'Setup time', diy: 'Days–weeks', paas: 'Hours', other: 'Hours', devops: 'Weeks (hiring)', us: 'Hours' },
  { aspect: 'Expertise needed', diy: 'Very high', paas: 'Low', other: 'Low', devops: 'Their expertise', us: 'None' },
  { aspect: 'Knows your app', diy: 'You do', paas: 'Usually not', other: 'Usually not', devops: 'Maybe', us: 'Built it or audited' },
  { aspect: 'Scales with you', diy: 'If you learn', paas: 'Limited', other: 'Depends', devops: "If they're good", us: 'Always' },
  { aspect: 'Provider choice', diy: 'Full', paas: 'Limited', other: 'Often locked', devops: 'Depends', us: '5 options, you choose' },
];

const NOT_FOR_US = [
  {
    num: '01',
    title: 'You have an in-house DevOps engineer.',
    body: "If you have someone on staff whose full-time job is infrastructure, you probably don't need us. That person can manage it.",
  },
  {
    num: '02',
    title: "You're running a purely static site.",
    body: "GitHub Pages or Netlify free tier is fine. You don't need managed infrastructure for a landing page or documentation site.",
  },
  {
    num: '03',
    title: "Your product is already on Vercel and you like it.",
    body: "Vercel's managed platform handles most of what we'd do for simple Next.js apps. If it's working, there's no reason to switch.",
  },
];

const VS_CARDS = [
  {
    us: true,
    tag: 'SocioFi Cloud',
    name: 'Full managed infrastructure',
    wins: [
      'Provider choice — not locked to one platform',
      'Zero hosting markup — you pay the provider directly',
      'We know your codebase — built it or audited it',
      'Full infrastructure control and configuration',
      'Scales to any complexity, any traffic level',
    ],
  },
  {
    us: false,
    tag: 'Heroku / Render / Railway',
    name: 'PaaS platforms',
    wins: [
      'Easier to start with for very simple apps',
      'Higher cost at scale due to built-in markup',
      'Locked to their platform and constraints',
      'Limited configuration for complex backends',
    ],
  },
];

export default function ComparePage() {
  return (
    <main className="cmp-wrap">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="cmp-hero">
        <div className="cmp-glow" />
        <div className="cmp-hero-inner">
          <Reveal>
            <div className="cmp-label">Compare</div>
            <h1 className="cmp-h1">SocioFi Cloud vs. Your Other Options.</h1>
            <p className="cmp-sub">There are several ways to handle infrastructure. Here&rsquo;s an honest comparison.</p>
            <div className="cmp-btns">
              <Link href="/cloud/plans" className="cmp-btn-primary">
                See our pricing <ArrowRight />
              </Link>
              <Link href="/cloud/get-hosted" className="cmp-btn-ghost">Get Hosted</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main comparison table */}
      <section className="cmp-section cmp-section-alt">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-sec-label">Side by side</div>
            <h2 className="cmp-sec-h2">Five options. One honest table.</h2>
            <p className="cmp-sec-desc">Every realistic way to handle infrastructure for a non-technical founder, compared directly.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Self-Managed (DIY)</th>
                    <th>PaaS (Heroku/Render)</th>
                    <th>Other Managed Hosting</th>
                    <th>DevOps Engineer</th>
                    <th className="hl">SocioFi Cloud</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.aspect}>
                      <td className="aspect">{row.aspect}</td>
                      <td>{row.diy}</td>
                      <td>{row.paas}</td>
                      <td>{row.other}</td>
                      <td>{row.devops}</td>
                      <td className="hl win">{row.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* When NOT to use */}
      <section className="cmp-section">
        <div className="cmp-container-narrow">
          <Reveal>
            <div className="cmp-centered">
              <div className="cmp-sec-label center">Honest transparency</div>
              <h2 className="cmp-sec-h2">When SocioFi Cloud isn&rsquo;t the right choice.</h2>
              <p className="cmp-sec-desc" style={{ margin: '0 auto' }}>We&rsquo;d rather tell you this upfront than have you sign up for something you don&rsquo;t need.</p>
            </div>
          </Reveal>
          <div className="cmp-honest-grid">
            {NOT_FOR_US.map((item, i) => (
              <Reveal key={item.num} delay={i * 0.1}>
                <div className="cmp-honest-card">
                  <div className="cmp-honest-num">{item.num}</div>
                  <div className="cmp-honest-title">{item.title}</div>
                  <p className="cmp-honest-body">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* vs PaaS deep-dive */}
      <section className="cmp-section cmp-section-alt">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-centered">
              <div className="cmp-sec-label center">vs. Heroku · Render · Railway</div>
              <h2 className="cmp-sec-h2">PaaS platforms vs. managed infrastructure.</h2>
              <p className="cmp-sec-desc" style={{ margin: '0 auto' }}>These platforms have their place. Here&rsquo;s an honest breakdown of where each fits.</p>
            </div>
          </Reveal>
          <div className="cmp-vs-grid">
            {VS_CARDS.map((card, i) => (
              <Reveal key={card.tag} delay={i * 0.1}>
                <div className={`cmp-vs-card${card.us ? ' us' : ''}`}>
                  <div className={`cmp-vs-tag${card.us ? '' : ' neutral'}`}>{card.tag}</div>
                  <div className="cmp-vs-name">{card.name}</div>
                  <ul className="cmp-vs-wins">
                    {card.wins.map((w) => (
                      <li key={w} className="cmp-vs-win">
                        {card.us ? <CheckIcon /> : <MinusIcon />}
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="cmp-take">
              <div className="cmp-take-label">Our honest take</div>
              <div className="cmp-take-quote">"For very simple products that fit entirely within Heroku or Render&rsquo;s constraints, those platforms are fine."</div>
              <p className="cmp-take-body">
                When you outgrow them — and most products do — Cloud is ready. The moment you need a persistent background worker, a managed database with tuning, private networking between services, or a human who actually knows your infrastructure at 2am, PaaS platforms start showing their limits. That&rsquo;s where we come in.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="cmp-cta">
        <Reveal>
          <div className="cmp-sec-label" style={{ justifyContent: 'center', display: 'flex' }}>Ready to switch?</div>
          <h2 className="cmp-cta-h2">See what managed actually costs.</h2>
          <p className="cmp-cta-sub">Transparent plans, no DevOps required, 48-hour setup. No surprises.</p>
          <div className="cmp-btns">
            <Link href="/cloud/plans" className="cmp-btn-primary">
              See our pricing <ArrowRight />
            </Link>
            <Link href="/cloud/get-hosted" className="cmp-btn-ghost">Get Hosted</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
