'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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

const AUDIENCE_FILTERS = [
  { key: 'all', label: 'All', count: 10 },
  { key: 'founder', label: 'For Founders', count: 4 },
  { key: 'leader', label: 'For Leaders', count: 3 },
  { key: 'team', label: 'For Teams', count: 3 },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All Topics' },
  { key: 'ai-development', label: 'AI Development' },
  { key: 'ai-agents', label: 'AI Agents' },
  { key: 'product-management', label: 'Product Management' },
  { key: 'business-strategy', label: 'Business Strategy' },
];

const BUNDLES = [
  { title: 'Founder Bundle', desc: '4 courses for solo founders and entrepreneurs', count: 4, price: 299, original: 386, savings: 23, badge: null },
  { title: 'Leader Bundle', desc: '3 courses for managers and team leads', count: 3, price: 199, original: 257, savings: 23, badge: null },
  { title: 'Team Bundle', desc: '3 courses for non-technical teams', count: 3, price: 199, original: 267, savings: 25, badge: null, perPerson: true },
  { title: 'Complete Academy', desc: 'All 10 courses. Every path. Maximum value.', count: 10, price: 599, original: 911, savings: 34, badge: 'BEST VALUE' },
];

const AUDIENCE_LABEL: Record<string, string> = {
  founder: 'For Founders',
  leader: 'For Leaders',
  team: 'For Teams',
};

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.ac-catalog-hero {
  min-height: 50vh;
  display: flex;
  align-items: center;
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
}
.ac-catalog-hero::before {
  content: '';
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(232,184,77,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.ac-hero-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ac-hero-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.ac-hero-title {
  font-family: ${F.h};
  font-size: clamp(2rem,4vw,3rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.ac-hero-sub {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 560px;
}
.ac-filter-bar {
  position: sticky;
  top: 80px;
  z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: blur(16px) saturate(1.5);
  border-bottom: 1px solid var(--border);
  padding: 0 0 1px;
}
.ac-filter-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 32px 0;
}
.ac-audience-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.ac-audience-tab {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-muted);
}
.ac-audience-tab:hover { color: ${A}; }
.ac-audience-tab.active {
  background: ${A};
  color: #1a1a1a;
}
.ac-category-chips {
  display: flex;
  gap: 6px;
  padding-bottom: 12px;
  flex-wrap: wrap;
}
.ac-category-chip {
  font-family: ${F.m};
  font-size: 0.62rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 100px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.ac-category-chip:hover { color: ${A}; border-color: rgba(232,184,77,0.3); }
.ac-category-chip.active { color: ${A}; border-color: ${A}; background: rgba(232,184,77,0.08); }
.ac-grid-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}
.ac-results-count {
  font-family: ${F.m};
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}
.ac-course-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 20px;
}
@media (max-width: 1024px) { .ac-course-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 640px) { .ac-course-grid { grid-template-columns: 1fr; } }
.ac-course-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.35s ease;
  cursor: pointer;
  position: relative;
}
.ac-course-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.4));
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 1;
}
.ac-course-card:hover {
  transform: translateY(-4px);
  border-color: rgba(232,184,77,0.4);
  box-shadow: 0 12px 40px rgba(232,184,77,0.1);
}
.ac-course-card:hover::before { opacity: 1; }
.ac-course-thumb {
  height: 120px;
  position: relative;
}
.ac-duration-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(232,184,77,0.92);
  color: #1a1a1a;
  font-family: ${F.m};
  font-size: 0.6rem;
  padding: 3px 8px;
  border-radius: 100px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.ac-price-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
.ac-available-dot {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${A};
  animation: acPulse 2s ease-in-out infinite;
}
@keyframes acPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}
.ac-course-body { padding: 16px; }
.ac-audience-tag {
  font-family: ${F.m};
  font-size: 0.55rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 6px;
}
.ac-course-title {
  font-family: ${F.h};
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.ac-course-tagline {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}
.ac-enroll-link {
  font-family: ${F.m};
  font-size: 0.68rem;
  color: ${A};
  letter-spacing: 0.06em;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}
.ac-enroll-link:hover { opacity: 0.75; }
.ac-bundles-section {
  background: var(--bg-2);
  padding: 80px 0;
  border-top: 1px solid var(--border);
}
.ac-bundles-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.ac-section-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ac-section-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.ac-section-title {
  font-family: ${F.h};
  font-size: clamp(1.6rem,3vw,2.2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 40px;
}
.ac-bundles-grid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 16px;
}
@media (max-width: 1024px) { .ac-bundles-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 640px) { .ac-bundles-grid { grid-template-columns: 1fr; } }
.ac-bundle-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  transition: all 0.35s ease;
}
.ac-bundle-card:hover {
  border-color: rgba(232,184,77,0.35);
  box-shadow: 0 8px 32px rgba(232,184,77,0.08);
  transform: translateY(-3px);
}
.ac-bundle-card.best {
  border-color: rgba(232,184,77,0.4);
  background: linear-gradient(135deg, var(--bg-card), rgba(232,184,77,0.04));
}
.ac-bundle-badge {
  position: absolute;
  top: -10px;
  right: 16px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.m};
  font-size: 0.58rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 100px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ac-bundle-count {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.ac-bundle-title {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.ac-bundle-desc {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
}
.ac-bundle-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}
.ac-bundle-price {
  font-family: ${F.h};
  font-size: 1.5rem;
  font-weight: 800;
  color: ${A};
}
.ac-bundle-original {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: line-through;
}
.ac-bundle-savings {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.ac-bundle-cta {
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: rgba(232,184,77,0.1);
  border: 1px solid rgba(232,184,77,0.3);
  border-radius: 8px;
  color: ${A};
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.ac-bundle-card.best .ac-bundle-cta {
  background: ${A};
  border-color: ${A};
  color: #1a1a1a;
}
.ac-bundle-cta:hover {
  background: ${A};
  border-color: ${A};
  color: #1a1a1a;
}
.ac-bottom-cta {
  background: var(--bg);
  padding: 80px 0;
  text-align: center;
}
.ac-bottom-cta-inner {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 32px;
}
.ac-cta-title {
  font-family: ${F.h};
  font-size: clamp(1.5rem,3vw,2rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 12px;
}
.ac-cta-sub {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}
.ac-cta-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.ac-cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.ac-cta-btn-primary:hover { opacity: 0.88; transform: translateY(-2px); }
.ac-cta-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1.5px solid var(--border);
  color: var(--text-secondary);
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.ac-cta-btn-ghost:hover { border-color: rgba(232,184,77,0.4); color: ${A}; }
.ac-no-results {
  grid-column: 1/-1;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-family: ${F.b};
  font-size: 0.9rem;
}
`;

// ── SVG Icons ────────────────────────────────────────────────────────────────
function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course }: { course: typeof COURSES[0] }) {
  return (
    <motion.div layout className="ac-course-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
      <div className="ac-course-thumb" style={{ background: course.gradient, position: 'relative', overflow: 'hidden' }}>
        <img src={`/images/courses/${course.category}.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <span className="ac-price-badge" style={{ position: 'relative', zIndex: 1 }}>${course.price}</span>
        <span className="ac-duration-badge" style={{ zIndex: 1 }}>{course.duration}</span>
        <span className="ac-available-dot" style={{ zIndex: 1 }} />
      </div>
      <div className="ac-course-body">
        <div className="ac-audience-tag">{AUDIENCE_LABEL[course.audience]}</div>
        <div className="ac-course-title">{course.name}</div>
        <div className="ac-course-tagline">{course.tagline}</div>
        <Link href={`/academy/courses/${course.slug}`} className="ac-enroll-link">
          Enroll now <ArrowRight size={10} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CourseCatalogPage() {
  const [activeAudience, setActiveAudience] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = COURSES.filter(c => {
    const audMatch = activeAudience === 'all' || c.audience === activeAudience;
    const catMatch = activeCategory === 'all' || c.category === activeCategory;
    return audMatch && catMatch;
  });

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="ac-catalog-hero">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="ac-hero-label">Course Catalog</div>
            <h1 className="ac-hero-title">10 Courses. 3 Paths.<br />Pick What You Need.</h1>
            <p className="ac-hero-sub">Every course is self-paced, lifetime access, no coding required. Learn at your speed. Come back anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="ac-filter-bar">
        <div className="ac-filter-inner">
          <div className="ac-audience-tabs">
            {AUDIENCE_FILTERS.map(f => (
              <button key={f.key} className={`ac-audience-tab${activeAudience === f.key ? ' active' : ''}`} onClick={() => setActiveAudience(f.key)}>
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <div className="ac-category-chips">
            {CATEGORY_FILTERS.map(f => (
              <button key={f.key} className={`ac-category-chip${activeCategory === f.key ? ' active' : ''}`} onClick={() => setActiveCategory(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Course Grid ── */}
      <div className="ac-grid-section">
        <div className="ac-results-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</div>
        <motion.div className="ac-course-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map(c => <CourseCard key={c.slug} course={c} />)
            ) : (
              <motion.div key="no-results" className="ac-no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                No courses match those filters. Try a different combination.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Bundle Section ── */}
      <section className="ac-bundles-section">
        <div className="ac-bundles-inner">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="ac-section-label">Save more</div>
            <h2 className="ac-section-title">Save with Bundles</h2>
          </motion.div>
          <div className="ac-bundles-grid">
            {BUNDLES.map((b, i) => (
              <motion.div key={b.title} className={`ac-bundle-card${b.badge ? ' best' : ''}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                {b.badge && <span className="ac-bundle-badge">{b.badge}</span>}
                <div className="ac-bundle-count">{b.count} courses</div>
                <div className="ac-bundle-title">{b.title}</div>
                <div className="ac-bundle-desc">{b.desc}</div>
                <div className="ac-bundle-pricing">
                  <span className="ac-bundle-price">${b.price}</span>
                  <span className="ac-bundle-original">${b.original}</span>
                </div>
                <div className="ac-bundle-savings">Save {b.savings}%{(b as typeof b & { perPerson?: boolean }).perPerson ? ' · per person' : ''}</div>
                <Link href="/academy/courses" className="ac-bundle-cta">Get Bundle</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="ac-bottom-cta">
        <div className="ac-bottom-cta-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="ac-cta-title">Not sure where to start?</h2>
            <p className="ac-cta-sub">All courses start from $39. Lifetime access.</p>
            <div className="ac-cta-buttons">
              <Link href="/academy/paths" className="ac-cta-btn-primary">Take the Path Finder <ArrowRight size={14} /></Link>
              <Link href="/academy/free" className="ac-cta-btn-ghost">Try something free <ArrowRight size={14} /></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
