'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const COURSES = [
  { slug:'ai-development-for-founders', name:'AI Development for Founders', audience:'founder', category:'ai-development', duration:'6 hours', price:149, tagline:'Understand how AI builds software', gradient:'linear-gradient(135deg,rgba(232,184,77,0.3),rgba(114,196,178,0.2))' },
  { slug:'how-to-spec-a-software-product', name:'How to Spec a Software Product', audience:'founder', category:'product-management', duration:'4 hours', price:79, tagline:'Write specs dev teams can build from', gradient:'linear-gradient(135deg,rgba(232,184,77,0.25),rgba(74,108,184,0.2))' },
  { slug:'from-idea-to-mvp', name:"From Idea to MVP: The Founder's Playbook", audience:'founder', category:'product-management', duration:'3 hours', price:59, tagline:'Fastest path from idea to working prototype', gradient:'linear-gradient(135deg,rgba(232,184,77,0.2),rgba(232,184,77,0.4))' },
  { slug:'understanding-ai-agents-for-business', name:'Understanding AI Agents for Business', audience:'founder', category:'ai-agents', duration:'4 hours', price:99, tagline:'What agents are, which processes they handle', gradient:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(232,184,77,0.25))' },
  { slug:'managing-ai-powered-development', name:'Managing AI-Powered Development', audience:'leader', category:'product-management', duration:'5 hours', price:129, tagline:'Lead teams that use AI development tools', gradient:'linear-gradient(135deg,rgba(232,184,77,0.2),rgba(77,191,168,0.2))' },
  { slug:'saas-to-aaas-transition', name:'The SaaS to AaaS Transition', audience:'leader', category:'business-strategy', duration:'3 hours', price:79, tagline:'What the shift means for your business', gradient:'linear-gradient(135deg,rgba(74,108,184,0.2),rgba(232,184,77,0.3))' },
  { slug:'build-vs-buy-vs-agent', name:'Build vs Buy vs Agent: The Decision Framework', audience:'leader', category:'business-strategy', duration:'2 hours', price:49, tagline:'Decision framework with real cost analysis', gradient:'linear-gradient(135deg,rgba(232,184,77,0.35),rgba(58,88,158,0.15))' },
  { slug:'technical-literacy-for-teams', name:'Technical Literacy for Non-Technical Teams', audience:'team', category:'ai-development', duration:'6 hours', price:149, tagline:'Software, APIs, databases, AI basics', gradient:'linear-gradient(135deg,rgba(77,191,168,0.2),rgba(232,184,77,0.25))' },
  { slug:'working-with-ai-agents', name:'Working with AI Agents in Your Organization', audience:'team', category:'ai-agents', duration:'3 hours', price:79, tagline:'Collaborate with AI agents at work', gradient:'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(232,184,77,0.2))' },
  { slug:'reading-technical-documentation', name:'Reading Technical Documentation (Without Panicking)', audience:'team', category:'product-management', duration:'2 hours', price:39, tagline:'Understand what developers write', gradient:'linear-gradient(135deg,rgba(232,184,77,0.15),rgba(91,181,224,0.2))' },
];

type CategoryConfig = {
  slug: string;
  label: string;
  title: string;
  description: string;
  relatedPaths: { label: string; href: string; note: string }[];
};

const CATEGORIES: Record<string, CategoryConfig> = {
  'ai-development': {
    slug: 'ai-development',
    label: 'AI Development',
    title: 'AI Development',
    description: 'Courses about how AI builds software, the hybrid human+AI model, and technical literacy.',
    relatedPaths: [
      { label: 'For Founders', href: '/academy/courses?audience=founder', note: 'Build your product faster' },
      { label: 'For Teams', href: '/academy/courses?audience=team', note: 'Upskill your whole organisation' },
    ],
  },
  'ai-agents': {
    slug: 'ai-agents',
    label: 'AI Agents',
    title: 'AI Agents',
    description: 'Courses about understanding, deploying, and working alongside AI agents.',
    relatedPaths: [
      { label: 'Business Strategy', href: '/academy/courses/category/business-strategy', note: 'Build vs buy vs agent decisions' },
      { label: 'For Leaders', href: '/academy/courses?audience=leader', note: 'Lead your org through AI adoption' },
    ],
  },
  'product-management': {
    slug: 'product-management',
    label: 'Product Management',
    title: 'Product Management',
    description: 'Courses about speccing products, managing development teams, and evaluating software.',
    relatedPaths: [
      { label: 'For Founders', href: '/academy/courses?audience=founder', note: 'From idea to shipped product' },
      { label: 'AI Development', href: '/academy/courses/category/ai-development', note: 'Understand what your team builds' },
    ],
  },
  'business-strategy': {
    slug: 'business-strategy',
    label: 'Business Strategy',
    title: 'Business Strategy',
    description: 'Courses about build vs buy decisions, the SaaS to AaaS transition, and digital transformation.',
    relatedPaths: [
      { label: 'For Leaders', href: '/academy/courses?audience=leader', note: 'All courses for business leaders' },
      { label: 'AI Agents', href: '/academy/courses/category/ai-agents', note: 'Understand the technology driving change' },
    ],
  },
};

const AUDIENCE_LABEL: Record<string, string> = { founder: 'For Founders', leader: 'For Leaders', team: 'For Teams' };

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.acc-hero {
  min-height: 44vh;
  display: flex;
  align-items: center;
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}
.acc-hero::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(232,184,77,0.05) 0%, transparent 70%);
  pointer-events: none;
}
.acc-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
.acc-label {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.acc-label::before {
  content: '';
  width: 16px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.acc-title {
  font-family: ${F.h};
  font-size: clamp(2rem,4vw,3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--text-primary);
  margin-bottom: 14px;
}
.acc-title span { color: ${A}; }
.acc-desc {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 520px;
}
.acc-courses-section {
  background: var(--bg-2);
  padding: 64px 0 80px;
  border-top: 1px solid var(--border);
}
.acc-count {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}
.acc-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 20px;
}
@media (max-width: 1024px) { .acc-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 640px) { .acc-grid { grid-template-columns: 1fr; } }
.acc-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.35s ease;
  position: relative;
}
.acc-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}
.acc-card:hover {
  transform: translateY(-4px);
  border-color: rgba(232,184,77,0.35);
  box-shadow: 0 10px 36px rgba(232,184,77,0.09);
}
.acc-card:hover::before { opacity: 1; }
.acc-thumb {
  height: 110px;
  position: relative;
}
.acc-price-badge {
  position: absolute;
  top: 10px; left: 10px;
  color: #fff;
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
.acc-dur-badge {
  position: absolute;
  top: 10px; right: 10px;
  background: rgba(232,184,77,0.92);
  color: #1a1a1a;
  font-family: ${F.m};
  font-size: 0.58rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 100px;
  letter-spacing: 0.04em;
}
.acc-dot {
  position: absolute;
  bottom: 10px; left: 10px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${A};
  animation: accPulse 2s ease-in-out infinite;
}
@keyframes accPulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.5; transform:scale(1.3); }
}
.acc-card-body { padding: 14px; }
.acc-aud-tag {
  font-family: ${F.m};
  font-size: 0.55rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 5px;
}
.acc-card-title {
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 5px;
}
.acc-card-tagline {
  font-family: ${F.b};
  font-size: 0.76rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 10px;
}
.acc-card-link {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-decoration: none;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.acc-card-link:hover { opacity: 0.75; }
.acc-explore-section {
  padding: 64px 0 80px;
  background: var(--bg);
  border-top: 1px solid var(--border);
}
.acc-section-label {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.acc-section-label::before {
  content: '';
  width: 16px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.acc-section-title {
  font-family: ${F.h};
  font-size: clamp(1.3rem,2.5vw,1.7rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 28px;
}
.acc-paths-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 14px;
  max-width: 600px;
}
@media (max-width: 640px) { .acc-paths-grid { grid-template-columns: 1fr; } }
.acc-path-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: all 0.25s ease;
}
.acc-path-card:hover { border-color: rgba(232,184,77,0.35); transform: translateY(-2px); }
.acc-path-label {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3px;
}
.acc-path-note {
  font-family: ${F.b};
  font-size: 0.73rem;
  color: var(--text-muted);
}
.acc-cta-row {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.acc-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 22px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.acc-cta-link:hover { opacity: 0.88; transform: translateY(-2px); }
.acc-cta-ghost {
  font-family: ${F.m};
  font-size: 0.68rem;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s ease;
}
.acc-cta-ghost:hover { color: ${A}; }
.acc-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  padding: 80px 32px;
}
`;

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const params = useParams();
  const cat = typeof params.category === 'string' ? params.category : Array.isArray(params.category) ? params.category[0] : '';

  const config = CATEGORIES[cat];
  if (!config) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="acc-not-found">
          <div style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Category not found</div>
          <Link href="/academy/courses" style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textDecoration: 'none', letterSpacing: '0.06em' }}>
            Browse all courses
          </Link>
        </div>
      </>
    );
  }

  const courses = COURSES.filter(c => c.category === cat);

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="acc-hero">
        <div className="acc-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            <div className="acc-label">{config.label}</div>
            <h1 className="acc-title"><span>{config.title}</span> Courses.</h1>
            <p className="acc-desc">{config.description}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Course Grid ── */}
      <section className="acc-courses-section">
        <div className="acc-inner">
          <div className="acc-count">{courses.length} course{courses.length !== 1 ? 's' : ''} in this category</div>
          <div className="acc-grid">
            {courses.map((c, i) => (
              <motion.div key={c.slug} className="acc-card"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.07 }}>
                <div className="acc-thumb" style={{ background: c.gradient, overflow: 'hidden' }}>
                  <img src={`/images/courses/${c.category}.svg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="acc-price-badge" style={{ zIndex: 1 }}>${c.price}</span>
                  <span className="acc-dur-badge" style={{ zIndex: 1 }}>{c.duration}</span>
                  <span className="acc-dot" style={{ zIndex: 1 }} />
                </div>
                <div className="acc-card-body">
                  <div className="acc-aud-tag">{AUDIENCE_LABEL[c.audience]}</div>
                  <div className="acc-card-title">{c.name}</div>
                  <div className="acc-card-tagline">{c.tagline}</div>
                  <Link href={`/academy/courses/${c.slug}`} className="acc-card-link">
                    View course <ArrowRight size={10} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Also Explore ── */}
      <section className="acc-explore-section">
        <div className="acc-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="acc-section-label">Also explore</div>
            <h2 className="acc-section-title">Related paths and topics</h2>
            <div className="acc-paths-grid">
              {config.relatedPaths.map((p, i) => (
                <Link key={i} href={p.href} className="acc-path-card">
                  <div>
                    <div className="acc-path-label">{p.label}</div>
                    <div className="acc-path-note">{p.note}</div>
                  </div>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
            <div className="acc-cta-row">
              <Link href="/academy/courses" className="acc-cta-link">See all 10 courses <ArrowRight size={13} /></Link>
              <Link href="/academy/free" className="acc-cta-ghost">Try a free lesson <ArrowRight size={11} /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
