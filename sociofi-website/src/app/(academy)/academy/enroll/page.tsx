'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.enr-page {
  min-height: 100vh;
  padding: 100px 0 80px;
  background: var(--bg);
}
.enr-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
}
.enr-header {
  margin-bottom: 40px;
}
.enr-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.enr-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.enr-title {
  font-family: ${F.h};
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 8px;
}
.enr-subtitle {
  font-family: ${F.b};
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ── Step Indicator ── */
.enr-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 32px;
}
.enr-step-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.enr-step-dot {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-family: ${F.m};
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--text-muted);
  transition: all 0.3s ease;
}
.enr-step-dot.active { background: ${A}; border-color: ${A}; color: #1a1a1a; }
.enr-step-dot.done { background: rgba(232,184,77,0.15); border-color: rgba(232,184,77,0.5); color: ${A}; }
.enr-step-label {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}
.enr-step-label.active { color: var(--text-primary); font-weight: 600; }
.enr-step-connector {
  width: 40px; height: 1px;
  background: var(--border);
  margin: 0 8px;
}

/* ── Two Column Layout ── */
.enr-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}
@media (max-width: 900px) { .enr-layout { grid-template-columns: 1fr; } }

/* ── Form Panel ── */
.enr-form-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px 28px;
}
.enr-form-section-title {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 20px;
  letter-spacing: -0.01em;
}
.enr-type-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}
.enr-type-tab {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.22s ease;
  text-align: center;
}
.enr-type-tab:hover { border-color: rgba(232,184,77,0.3); color: var(--text-primary); }
.enr-type-tab.active { border-color: ${A}; color: var(--text-primary); background: rgba(232,184,77,0.06); }

/* ── Course Grid ── */
.enr-course-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}
@media (max-width: 600px) { .enr-course-grid { grid-template-columns: 1fr; } }
.enr-course-option {
  position: relative;
}
.enr-course-input {
  position: absolute;
  opacity: 0;
  width: 0; height: 0;
}
.enr-course-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  background: var(--bg-2);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.22s ease;
}
.enr-course-input:checked + .enr-course-label {
  border-color: ${A};
  background: rgba(232,184,77,0.06);
}
.enr-course-label:hover { border-color: rgba(232,184,77,0.4); }
.enr-course-radio {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.22s ease;
  display: flex; align-items: center; justify-content: center;
}
.enr-course-input:checked + .enr-course-label .enr-course-radio {
  background: ${A};
  border-color: ${A};
}
.enr-course-info {}
.enr-course-price-sm {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 2px;
}
.enr-course-name-sm {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* ── Bundle Options ── */
.enr-bundle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.enr-bundle-option {
  position: relative;
}
.enr-bundle-input {
  position: absolute;
  opacity: 0;
  width: 0; height: 0;
}
.enr-bundle-label {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 16px;
  background: var(--bg-2);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.22s ease;
}
.enr-bundle-input:checked + .enr-bundle-label {
  border-color: ${A};
  background: rgba(232,184,77,0.06);
}
.enr-bundle-label:hover { border-color: rgba(232,184,77,0.4); }
.enr-bundle-radio {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  transition: all 0.22s ease;
}
.enr-bundle-input:checked + .enr-bundle-label .enr-bundle-radio {
  background: ${A};
  border-color: ${A};
}
.enr-bundle-info { flex: 1; }
.enr-bundle-name-sm {
  font-family: ${F.h};
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2px;
}
.enr-bundle-desc-sm {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.enr-bundle-price-sm {
  font-family: ${F.h};
  font-size: 1.1rem;
  font-weight: 800;
  color: ${A};
  flex-shrink: 0;
}
.enr-bundle-save-sm {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  display: block;
  text-align: right;
}

/* ── Continue Button ── */
.enr-continue-btn {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, ${A}, #d4a33a);
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 4px 20px rgba(232,184,77,0.3);
}
.enr-continue-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,184,77,0.4); }
.enr-continue-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

/* ── Step 2 - Account + Payment ── */
.enr-form-divider {
  height: 1px;
  background: var(--border);
  margin: 24px 0;
}
.enr-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.enr-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px) { .enr-field-grid { grid-template-columns: 1fr; } }
.enr-field-label {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.enr-field-input {
  padding: 12px 16px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-primary);
  font-family: ${F.b};
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.22s ease;
  width: 100%;
  box-sizing: border-box;
}
.enr-field-input:focus {
  border-color: rgba(232,184,77,0.5);
  box-shadow: 0 0 0 3px rgba(232,184,77,0.07);
}
.enr-payment-box {
  padding: 20px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 20px;
}
.enr-payment-label {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.enr-payment-placeholder {
  height: 44px;
  background: var(--bg-card);
  border: 1.5px dashed var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-muted);
}
.enr-order-summary {
  background: rgba(232,184,77,0.05);
  border: 1px solid rgba(232,184,77,0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}
.enr-order-title {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.enr-order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  padding: 6px 0;
  border-bottom: 1px solid rgba(232,184,77,0.12);
}
.enr-order-item:last-child { border-bottom: none; }
.enr-order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  padding-top: 10px;
  margin-top: 4px;
}
.enr-order-total-price {
  color: ${A};
}
.enr-guarantee-note {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.enr-back-btn {
  background: none;
  border: none;
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  cursor: pointer;
  text-decoration: underline;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0;
  margin-top: 12px;
}
.enr-back-btn:hover { color: ${A}; }

/* ── Success State ── */
.enr-success {
  text-align: center;
  padding: 48px 32px;
}
.enr-success-icon {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 2px solid rgba(232,184,77,0.4);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  color: ${A};
}
.enr-success-title {
  font-family: ${F.h};
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}
.enr-success-sub {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
  max-width: 400px;
  margin: 0 auto 28px;
}
.enr-success-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: ${A};
  text-decoration: none;
}
.enr-success-link:hover { opacity: 0.8; }

/* ── Trust Sidebar ── */
.enr-sidebar {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.enr-trust-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}
.enr-trust-title {
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.enr-trust-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.enr-trust-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
.enr-trust-check {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(232,184,77,0.1);
  border: 1px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  color: ${A};
}
.enr-social-proof {
  font-family: ${F.h};
  font-size: 1.5rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 4px;
}
.enr-social-proof-sub {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.enr-testimonial-mini {
  padding: 14px;
  background: var(--bg-2);
  border-radius: 10px;
  margin-bottom: 10px;
}
.enr-testimonial-mini:last-child { margin-bottom: 0; }
.enr-testimonial-quote-sm {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 8px;
}
.enr-testimonial-author-sm {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.enr-security-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.enr-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: ${F.m};
  font-size: 0.58rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.enr-badge svg { color: ${A}; }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function Check({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Shield({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function Lock({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function Star({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={A}
      stroke={A} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const COURSES = [
  { slug: 'from-idea-to-mvp', name: "From Idea to MVP", price: 59 },
  { slug: 'how-to-spec-a-software-product', name: 'How to Spec a Software Product', price: 79 },
  { slug: 'ai-development-for-founders', name: 'AI Development for Founders', price: 149 },
  { slug: 'understanding-ai-agents-for-business', name: 'Understanding AI Agents for Business', price: 99 },
  { slug: 'managing-ai-powered-development', name: 'Managing AI-Powered Development', price: 129 },
  { slug: 'saas-to-aaas-transition', name: 'The SaaS to AaaS Transition', price: 79 },
  { slug: 'build-vs-buy-vs-agent', name: 'Build vs Buy vs Agent', price: 49 },
  { slug: 'technical-literacy-for-teams', name: 'Technical Literacy for Non-Technical Teams', price: 149 },
  { slug: 'working-with-ai-agents', name: 'Working with AI Agents in Your Organization', price: 79 },
  { slug: 'reading-technical-documentation', name: 'Reading Technical Documentation', price: 39 },
];

const BUNDLES = [
  { slug: 'founder', name: 'Founder Bundle', desc: '4 courses for founders', price: 299, original: 386, save: 23 },
  { slug: 'leader', name: 'Leader Bundle', desc: '3 courses for leaders', price: 199, original: 257, save: 23 },
  { slug: 'team', name: 'Team Bundle', desc: '3 courses for teams', price: 199, original: 267, save: 25 },
  { slug: 'complete', name: 'Complete Academy', desc: 'All 10 courses', price: 599, original: 911, save: 34 },
];

const TRUST_ITEMS = [
  'Lifetime access — no expiration, revisit anytime',
  'Certificate of completion included',
  'Access to learner community',
  '30-day money-back guarantee, no questions asked',
];

const TESTIMONIALS = [
  { q: '"Finally understood what my devs were actually doing. Worth every penny."', author: 'Founder, SaaS startup' },
  { q: '"Best $199 I\'ve spent on professional development this year."', author: 'Operations Manager, logistics company' },
];

// ── Enrollment Form Inner Component ──────────────────────────────────────────
function EnrollmentFormInner() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get('course');
  const bundleParam = searchParams.get('bundle');

  const [selectionType, setSelectionType] = useState<'course' | 'bundle'>(bundleParam ? 'bundle' : 'course');
  const [selectedCourse, setSelectedCourse] = useState<string>(courseParam || '');
  const [selectedBundle, setSelectedBundle] = useState<string>(bundleParam || '');
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');

  useEffect(() => {
    if (bundleParam) { setSelectionType('bundle'); setSelectedBundle(bundleParam); }
    else if (courseParam) { setSelectionType('course'); setSelectedCourse(courseParam); }
  }, [bundleParam, courseParam]);

  const selectedCourseData = COURSES.find(c => c.slug === selectedCourse);
  const selectedBundleData = BUNDLES.find(b => b.slug === selectedBundle);
  const hasSelection = selectionType === 'course' ? !!selectedCourse : !!selectedBundle;
  const orderName = selectionType === 'course' ? selectedCourseData?.name : selectedBundleData?.name;
  const orderPrice = selectionType === 'course' ? selectedCourseData?.price : selectedBundleData?.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !accountEmail.trim()) return;
    setLoading(true);
    setSubmitError('');
    try {
      const courseSlug = selectionType === 'course'
        ? selectedCourse
        : `bundle-${selectedBundle}`;
      const res = await fetch('/api/academy/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: accountName,
          email: accountEmail,
          course: courseSlug,
          format: selectionType,
          source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });
      if (!res.ok) throw new Error('Enrollment failed');
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="enr-form-panel">
        <motion.div className="enr-success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="enr-success-icon">
            <Check size={26} />
          </div>
          <div className="enr-success-title">You're enrolled!</div>
          <p className="enr-success-sub">Check your email for access instructions. You'll have lifetime access to your course materials within a few minutes.</p>
          <Link href="/academy/courses" className="enr-success-link">
            Browse more courses <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="enr-form-panel">
      {/* Step Indicator */}
      <div className="enr-steps">
        <div className="enr-step-item">
          <div className={`enr-step-dot${step === 1 ? ' active' : ' done'}`}>{step > 1 ? <Check size={9} /> : '1'}</div>
          <span className={`enr-step-label${step === 1 ? ' active' : ''}`}>Choose</span>
        </div>
        <div className="enr-step-connector" />
        <div className="enr-step-item">
          <div className={`enr-step-dot${step === 2 ? ' active' : ''}`}>2</div>
          <span className={`enr-step-label${step === 2 ? ' active' : ''}`}>Checkout</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.28 }}>
            {/* Type Selector */}
            <div className="enr-form-section-title">What would you like to enroll in?</div>
            <div className="enr-type-tabs">
              <button className={`enr-type-tab${selectionType === 'course' ? ' active' : ''}`} onClick={() => setSelectionType('course')}>
                Individual Course
              </button>
              <button className={`enr-type-tab${selectionType === 'bundle' ? ' active' : ''}`} onClick={() => setSelectionType('bundle')}>
                Bundle (Save 23–34%)
              </button>
            </div>

            <AnimatePresence mode="wait">
              {selectionType === 'course' && (
                <motion.div key="courses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                  <div className="enr-course-grid">
                    {COURSES.map(c => (
                      <div key={c.slug} className="enr-course-option">
                        <input
                          type="radio" name="course" id={`c-${c.slug}`}
                          className="enr-course-input"
                          value={c.slug}
                          checked={selectedCourse === c.slug}
                          onChange={() => setSelectedCourse(c.slug)}
                        />
                        <label htmlFor={`c-${c.slug}`} className="enr-course-label">
                          <div className="enr-course-radio" />
                          <div className="enr-course-info">
                            <div className="enr-course-price-sm">${c.price}</div>
                            <div className="enr-course-name-sm">{c.name}</div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {selectionType === 'bundle' && (
                <motion.div key="bundles" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                  <div className="enr-bundle-list">
                    {BUNDLES.map(b => (
                      <div key={b.slug} className="enr-bundle-option">
                        <input
                          type="radio" name="bundle" id={`b-${b.slug}`}
                          className="enr-bundle-input"
                          value={b.slug}
                          checked={selectedBundle === b.slug}
                          onChange={() => setSelectedBundle(b.slug)}
                        />
                        <label htmlFor={`b-${b.slug}`} className="enr-bundle-label">
                          <div className="enr-bundle-radio" />
                          <div className="enr-bundle-info">
                            <div className="enr-bundle-name-sm">{b.name}</div>
                            <div className="enr-bundle-desc-sm">{b.desc}</div>
                          </div>
                          <div>
                            <div className="enr-bundle-price-sm">${b.price}</div>
                            <span className="enr-bundle-save-sm">Save {b.save}%</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="enr-continue-btn"
              disabled={!hasSelection}
              onClick={() => setStep(2)}
            >
              Continue to Checkout <ArrowRight size={14} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.28 }}>
            <div className="enr-form-section-title">Create your account</div>
            <form onSubmit={handleSubmit}>
              <div className="enr-field-grid">
                <div className="enr-field-group">
                  <label className="enr-field-label">Full name</label>
                  <input
                    type="text"
                    className="enr-field-input"
                    placeholder="Your name"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="enr-field-group">
                  <label className="enr-field-label">Email address</label>
                  <input
                    type="email"
                    className="enr-field-input"
                    placeholder="you@email.com"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="enr-form-divider" />
              <div className="enr-form-section-title">Payment</div>

              <div className="enr-order-summary">
                <div className="enr-order-title">Order summary</div>
                <div className="enr-order-item">
                  <span>{orderName}</span>
                  <span style={{ fontFamily: F.h, fontWeight: 700, color: A }}>${orderPrice}</span>
                </div>
                <div className="enr-order-total">
                  <span>Total</span>
                  <span className="enr-order-total-price">${orderPrice}</span>
                </div>
              </div>

              <div className="enr-payment-box">
                <div className="enr-payment-label">Card details</div>
                <div className="enr-payment-placeholder">
                  <Lock size={14} />
                  <span>Stripe secure payment form</span>
                </div>
              </div>

              {submitError && (
                <p style={{ color: '#F87171', fontSize: '0.85rem', marginBottom: 12, lineHeight: 1.5 }}>
                  {submitError}
                </p>
              )}

              <button type="submit" className="enr-continue-btn" disabled={loading}>
                {loading ? 'Processing...' : <><span>Complete Enrollment</span> <ArrowRight size={14} /></>}
              </button>

              <p className="enr-guarantee-note">
                <Shield size={12} />
                30-day money-back guarantee. No questions asked.
              </p>
            </form>
            <button className="enr-back-btn" onClick={() => setStep(1)}>← Back to course selection</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Trust Sidebar ─────────────────────────────────────────────────────────────
function TrustSidebar() {
  return (
    <div className="enr-sidebar">
      {/* Includes */}
      <div className="enr-trust-card">
        <div className="enr-trust-title">Every enrollment includes</div>
        <div className="enr-trust-list">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="enr-trust-item">
              <div className="enr-trust-check"><Check size={9} /></div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="enr-trust-card">
        <div className="enr-social-proof">500+</div>
        <div className="enr-social-proof-sub">learners enrolled</div>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="enr-testimonial-mini">
            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
              {[...Array(5)].map((_, j) => <Star key={j} size={11} />)}
            </div>
            <p className="enr-testimonial-quote-sm">{t.q}</p>
            <div className="enr-testimonial-author-sm">{t.author}</div>
          </div>
        ))}
      </div>

      {/* Security Badges */}
      <div className="enr-trust-card">
        <div className="enr-security-badges">
          <div className="enr-badge"><Lock size={11} /> SSL Secured</div>
          <div className="enr-badge"><Shield size={11} /> Stripe</div>
          <div className="enr-badge"><Check size={11} /> 30-day guarantee</div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EnrollPage() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="enr-page">
        <div className="enr-inner">
          <motion.div className="enr-header"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
            <div className="enr-label">Enrollment</div>
            <h1 className="enr-title">Start learning today.</h1>
            <p className="enr-subtitle">Select a course or bundle, create an account, and get instant access.</p>
          </motion.div>

          <div className="enr-layout">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
              <Suspense fallback={
                <div className="enr-form-panel" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: F.b, fontSize: '0.85rem' }}>
                  Loading...
                </div>
              }>
                <EnrollmentFormInner />
              </Suspense>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
              <TrustSidebar />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
