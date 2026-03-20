'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const A = '#7B6FE8';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  .team-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .team-hero { padding: 148px 0 100px; position: relative; overflow: hidden; }
  .team-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .team-hero-orb { position: absolute; border-radius: 50%; filter: blur(120px); }
  .team-hero-orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(123,111,232,0.07) 0%, transparent 70%); top: -150px; right: 0; }
  .team-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; position: relative; }
  .team-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 28px; }
  .team-hero-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .team-hero-h1 { font-family: ${F.h}; font-size: clamp(2.4rem, 4vw, 3.4rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary); margin: 0 0 24px; max-width: 640px; }
  .team-hero-accent { background: linear-gradient(135deg, #5548B0, ${A}, #9D94F0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .team-hero-sub { font-family: ${F.b}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary); max-width: 560px; margin: 0; }

  /* Section */
  .team-section { padding: 100px 0; }
  .team-section-alt { background: var(--bg-2); }
  .team-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .team-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 14px; }
  .team-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .team-section-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 16px; }
  .team-section-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 640px; margin: 0 0 56px; }

  /* Profile cards */
  .team-profiles { display: flex; flex-direction: column; gap: 40px; }
  .team-profile { display: grid; grid-template-columns: 240px 1fr; gap: 56px; align-items: start; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 48px; transition: border-color 0.3s; }
  .team-profile:hover { border-color: rgba(123,111,232,0.2); }
  .team-profile-left { display: flex; flex-direction: column; align-items: flex-start; }
  .team-profile-avatar { width: 96px; height: 96px; border-radius: var(--radius-lg); background: linear-gradient(135deg, rgba(123,111,232,0.2), rgba(85,72,176,0.3)); border: 1px solid rgba(123,111,232,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .team-profile-initials { font-family: ${F.h}; font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #5548B0, ${A}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.04em; }
  .team-profile-name { font-family: ${F.h}; font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px; letter-spacing: -0.02em; }
  .team-profile-role { font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; color: ${A}; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 20px; }
  .team-profile-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .team-profile-tag { font-family: ${F.m}; font-size: 0.65rem; padding: 3px 9px; border-radius: 100px; background: rgba(123,111,232,0.08); color: var(--text-muted); border: 1px solid rgba(123,111,232,0.12); }
  .team-profile-right { flex: 1; }
  .team-profile-quote { font-family: ${F.h}; font-size: 1.2rem; font-weight: 700; color: var(--text-primary); line-height: 1.45; letter-spacing: -0.02em; margin: 0 0 24px; border-left: 3px solid ${A}; padding-left: 20px; }
  .team-profile-bio { font-family: ${F.b}; font-size: 0.95rem; line-height: 1.75; color: var(--text-secondary); margin: 0 0 28px; }
  .team-profile-writes-label { font-family: ${F.m}; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
  .team-profile-topics { display: flex; gap: 8px; flex-wrap: wrap; }
  .team-profile-topic { font-family: ${F.b}; font-size: 0.8rem; padding: 5px 12px; border-radius: 100px; background: var(--bg-2); border: 1px solid var(--border); color: var(--text-secondary); transition: all 0.2s; cursor: default; }
  .team-profile-topic:hover { border-color: rgba(123,111,232,0.25); color: ${A}; }
  .team-profile-edu { display: flex; align-items: center; gap: 8px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); font-family: ${F.b}; font-size: 0.82rem; color: var(--text-muted); }
  .team-profile-edu-badge { font-family: ${F.m}; font-size: 0.65rem; padding: 2px 8px; border-radius: 100px; background: rgba(72,196,150,0.1); color: #48C496; border: 1px solid rgba(72,196,150,0.2); }

  /* Contributors note */
  .team-contrib-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 40px 48px; position: relative; overflow: hidden; }
  .team-contrib-glow { position: absolute; width: 400px; height: 200px; background: radial-gradient(ellipse, rgba(123,111,232,0.06) 0%, transparent 70%); top: 50%; right: -50px; transform: translateY(-50%); pointer-events: none; }
  .team-contrib-title { font-family: ${F.h}; font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 14px; letter-spacing: -0.02em; position: relative; }
  .team-contrib-desc { font-family: ${F.b}; font-size: 0.95rem; line-height: 1.75; color: var(--text-secondary); margin: 0; max-width: 640px; position: relative; }
  .team-contrib-count { font-family: ${F.h}; font-size: 2.4rem; font-weight: 800; color: ${A}; letter-spacing: -0.05em; line-height: 1; margin-bottom: 6px; }

  /* Open to section */
  .team-open-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
  .team-open-card { padding: 28px 32px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); transition: border-color 0.3s; }
  .team-open-card:hover { border-color: rgba(123,111,232,0.2); }
  .team-open-type { font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 10px; }
  .team-open-title { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; }
  .team-open-desc { font-family: ${F.b}; font-size: 0.85rem; line-height: 1.65; color: var(--text-secondary); margin: 0; }

  /* CTA */
  .team-cta { text-align: center; padding: 80px 0 0; }
  .team-cta-title { font-family: ${F.h}; font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0 0 12px; letter-spacing: -0.02em; }
  .team-cta-sub { font-family: ${F.b}; font-size: 0.95rem; color: var(--text-secondary); margin: 0 0 28px; line-height: 1.7; }
  .team-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, #5548B0, ${A}); border: none; cursor: pointer; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 20px rgba(123,111,232,0.4); }
  .team-btn-primary:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 32px rgba(123,111,232,0.55); }
  .team-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); background: transparent; border: 1.5px solid var(--border); cursor: pointer; text-decoration: none; transition: all 0.25s; }
  .team-btn-ghost:hover { border-color: ${A}; color: ${A}; }
  .team-cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  @media (max-width: 768px) {
    .team-hero { padding: 120px 0 80px; }
    .team-container { padding: 0 20px; }
    .team-section { padding: 72px 0; }
    .team-profile { grid-template-columns: 1fr; gap: 32px; padding: 32px; }
    .team-open-grid { grid-template-columns: 1fr; }
    .team-contrib-box { padding: 28px; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    initials: 'AR',
    name: 'Arifur Rahman',
    role: 'CEO & Applied AI Research',
    quote: '"I\'ve been debugging AI-generated code since before it was cool."',
    bio: `Arifur co-founded SocioFi Technology after recognising a gap between what AI coding tools could generate and what it took to ship those outputs as production software. At Labs, he leads applied AI research — focused on where AI systems fail in real-world use and what it takes to make them reliable enough to trust with consequential tasks.

His research interests are practical rather than theoretical: he cares about the question "does this work in production?" more than "does this work in a benchmark?" He writes about agent reliability, industry automation, and the liability and ethical dimensions of deploying autonomous software systems.`,
    tags: ['Agent reliability', 'Applied AI', 'Industry automation', 'Liability in AI'],
    writes: ['AI agent failure modes', 'Automation thresholds by industry', 'What production-ready AI actually means', 'The human-in-the-loop problem'],
    edu: 'BUET · Computer Science & Engineering',
  },
  {
    initials: 'KH',
    name: 'Kamrul Hasan',
    role: 'CTO & Labs Lead',
    quote: '"Good research starts with admitting you don\'t know the answer yet."',
    bio: `Kamrul leads developer tooling and system architecture research at Labs. As CTO, he is responsible for the technical direction of every system SocioFi builds — but Labs is where he gets to explore questions without a client deadline attached.

His research focuses on the engineering problems that come with running AI in production at scale: how to make agent pipelines observable, how to handle failures gracefully, and how to build developer tooling that makes working with AI-generated code less painful. He is the primary author of most technical articles published on the Labs blog, and the architect of the reference architecture documented on this site.`,
    tags: ['Developer tooling', 'System architecture', 'Observability', 'AI pipelines'],
    writes: ['Production AI architecture patterns', 'Developer tooling for AI-native teams', 'Observability in agent systems', 'Spec-to-code pipeline engineering'],
    edu: 'BUET · Computer Science & Engineering',
  },
];

const OPEN_TO = [
  {
    type: 'Research collaboration',
    title: 'Working on a related problem?',
    desc: 'We occasionally partner with external researchers on specific experiments — particularly around agent reliability, evaluation methodology, and AI system failure modes. We can offer access to real workload data, engineering time, and co-authorship on published findings.',
  },
  {
    type: 'Academic connections',
    title: 'University and institutional researchers',
    desc: 'We have a strong interest in connecting with researchers at universities working on AI reliability, software engineering automation, and human-AI collaboration. If you are looking for an industry partner for a research collaboration or dataset access, reach out.',
  },
  {
    type: 'Independent researchers',
    title: 'Independent technical writers and researchers',
    desc: 'If you write or research in the areas we cover — AI systems, software engineering, developer tooling — we are open to guest contributions to the Labs blog, co-authorship, and collaborative experiments.',
  },
  {
    type: 'Domain experts',
    title: 'Domain knowledge contributors',
    desc: 'Some of our research touches industries we do not have deep expertise in. We occasionally bring in domain experts — healthcare, finance, logistics — to evaluate AI system behaviour in their context.',
  },
];

// ─── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <div className="team-page">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="team-hero">
        <div className="team-hero-bg">
          <div className="team-hero-orb team-hero-orb-1" />
        </div>
        <div className="team-hero-inner">
          <Reveal>
            <div className="team-hero-badge">Labs · Team</div>
            <h1 className="team-hero-h1">
              The team behind{' '}
              <span className="team-hero-accent">the research.</span>
            </h1>
            <p className="team-hero-sub">
              Labs is run by SocioFi&rsquo;s founding team with rotating contributions from across the
              engineering organisation. Everyone who ships production AI systems also contributes to
              understanding them better.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Core team ── */}
      <section className="team-section team-section-alt">
        <div className="team-container">
          <Reveal>
            <div className="team-sec-label">Core team</div>
            <h2 className="team-section-title">Two founders, both researchers.</h2>
            <p className="team-section-sub">
              SocioFi was founded by two BUET engineers who believe the best technical research happens when
              the people doing the research are also the ones building and maintaining production systems.
            </p>
          </Reveal>
          <div className="team-profiles">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="team-profile">
                  <div className="team-profile-left">
                    <div className="team-profile-avatar">
                      <span className="team-profile-initials">{member.initials}</span>
                    </div>
                    <div className="team-profile-name">{member.name}</div>
                    <div className="team-profile-role">{member.role}</div>
                    <div className="team-profile-tags">
                      {member.tags.map((tag) => (
                        <span key={tag} className="team-profile-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="team-profile-edu">
                      <span className="team-profile-edu-badge">Alumni</span>
                      {member.edu}
                    </div>
                  </div>
                  <div className="team-profile-right">
                    <p className="team-profile-quote">{member.quote}</p>
                    <p className="team-profile-bio">{member.bio}</p>
                    <div className="team-profile-writes-label">Writes about</div>
                    <div className="team-profile-topics">
                      {member.writes.map((topic) => (
                        <span key={topic} className="team-profile-topic">{topic}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contributors ── */}
      <section className="team-section">
        <div className="team-container">
          <Reveal>
            <div className="team-sec-label">Research contributors</div>
            <h2 className="team-section-title">Research is a team sport.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="team-contrib-box">
              <div className="team-contrib-glow" />
              <div className="team-contrib-count">14+</div>
              <div className="team-contrib-title">Engineers who have contributed to published research</div>
              <p className="team-contrib-desc">
                Labs research draws on the collective experience of every engineer at SocioFi. We rotate
                contributors across research streams to maintain diverse perspectives — the engineer who spent
                six months on a client&rsquo;s legacy codebase brings different insight to an observability
                experiment than the one who just shipped a new AI pipeline.
                <br /><br />
                Contributors are credited in every article and research note they contribute to.
                Research credit counts toward performance evaluation. We do not have a two-tier system
                where Labs is the &ldquo;real&rdquo; engineering and Studio is the &ldquo;day job&rdquo; —
                both matter, and the best Labs research comes from engineers who are actively building.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Open to ── */}
      <section className="team-section team-section-alt">
        <div className="team-container">
          <Reveal>
            <div className="team-sec-label">External research</div>
            <h2 className="team-section-title">Open to collaboration.</h2>
            <p className="team-section-sub">
              We occasionally work with external researchers on specific experiments. We are selective
              — we only partner on problems that are directly relevant to what we are building — but when
              the fit is right, we commit properly.
            </p>
          </Reveal>
          <div className="team-open-grid">
            {OPEN_TO.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="team-open-card">
                  <div className="team-open-type">{item.type}</div>
                  <div className="team-open-title">{item.title}</div>
                  <p className="team-open-desc">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="team-cta">
              <div className="team-cta-title">Interested in collaborating?</div>
              <p className="team-cta-sub">
                Send us a note with your research context. We respond to every genuine inquiry,
                even if the answer is &ldquo;not right now.&rdquo;
              </p>
              <div className="team-cta-buttons">
                <Link href="/contact" className="team-btn-primary">
                  Start a conversation
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/labs/contribute" className="team-btn-ghost">
                  Contribution guidelines
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
