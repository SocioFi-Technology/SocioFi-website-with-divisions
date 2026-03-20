'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Types ───────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1
  name: string;
  email: string;
  company: string;
  role: string;
  source: string;
  // Step 2
  needs: string[];
  description: string;
  // Step 3
  existingCode: string;
  budget: string;
  timeline: string;
  communication: string;
  // Step 4
  notes: string;
}

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.sp-page { overflow-x: hidden; background: var(--bg); min-height: 100vh; }

.sec-label {
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
.sec-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}

.gradient-text {
  background: linear-gradient(135deg, #4A6CB8 0%, ${A} 50%, #A3DFD2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (forced-colors: active) { .gradient-text { -webkit-text-fill-color: unset; } }

/* Progress bar */
.sp-progress-track {
  width: 100%;
  height: 3px;
  background: var(--border);
  border-radius: 100px;
  overflow: hidden;
}
.sp-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3A589E, ${A});
  border-radius: 100px;
  transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
}

/* Form layout */
.sp-layout {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 48px;
  align-items: start;
}
@media (max-width: 1024px) {
  .sp-layout { grid-template-columns: 1fr; gap: 32px; }
}

/* Form card */
.sp-form-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 40px;
}
@media (max-width: 768px) {
  .sp-form-card { padding: 24px; }
}

/* Inputs */
.sp-label {
  display: block;
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.sp-optional {
  font-family: ${F.b};
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
  margin-left: 6px;
}
.sp-input {
  width: 100%;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-primary);
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}
.sp-input:focus { border-color: ${A}; }
.sp-input::placeholder { color: var(--text-muted); }

.sp-textarea {
  width: 100%;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-primary);
  transition: border-color 0.2s;
  outline: none;
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;
  line-height: 1.6;
}
.sp-textarea:focus { border-color: ${A}; }
.sp-textarea::placeholder { color: var(--text-muted); }

.sp-select {
  width: 100%;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-primary);
  transition: border-color 0.2s;
  outline: none;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
}
.sp-select:focus { border-color: ${A}; }

.sp-field { margin-bottom: 20px; }

/* Radio buttons */
.sp-radio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
@media (max-width: 600px) {
  .sp-radio-grid { grid-template-columns: 1fr; }
}
.sp-radio-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  user-select: none;
}
.sp-radio-pill:hover { border-color: ${A}44; color: var(--text-primary); }
.sp-radio-pill.selected {
  border-color: ${A};
  color: var(--text-primary);
  background: ${A}11;
}
.sp-radio-dot {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s;
}
.sp-radio-pill.selected .sp-radio-dot {
  border-color: ${A};
  background: ${A};
}

/* Pills row (for budget/timeline/communication) */
.sp-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sp-pill {
  padding: 8px 18px;
  border-radius: 100px;
  border: 1.5px solid var(--border);
  background: var(--bg);
  font-family: ${F.b};
  font-size: 0.84rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  user-select: none;
  white-space: nowrap;
}
.sp-pill:hover { border-color: ${A}44; color: var(--text-primary); }
.sp-pill.selected {
  border-color: ${A};
  color: ${A};
  background: ${A}11;
}

/* Checkbox cards */
.sp-check-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
.sp-check-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  user-select: none;
}
.sp-check-card:hover { border-color: ${A}44; color: var(--text-primary); }
.sp-check-card.selected {
  border-color: ${A};
  color: var(--text-primary);
  background: ${A}08;
}
.sp-checkbox {
  width: 18px; height: 18px;
  border-radius: 4px;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s, background 0.2s;
}
.sp-check-card.selected .sp-checkbox {
  border-color: ${A};
  background: ${A};
}

/* Navigation buttons */
.sp-nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #3A589E, ${A});
  color: #fff;
  border: none; border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 32px rgba(58,88,158,0.5); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: var(--text-secondary);
  border: 1.5px solid var(--border); border-radius: 100px;
  font-family: ${F.h}; font-size: 0.88rem; font-weight: 600;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover { border-color: ${A}; color: var(--text-primary); }

/* Summary cards */
.sp-summary-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.sp-summary-label {
  font-family: ${F.m};
  font-size: 0.7rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}
.sp-summary-value {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-primary);
  line-height: 1.5;
}
.sp-edit-btn {
  background: none; border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  border-radius: 6px;
  transition: color 0.2s;
}
.sp-edit-btn:hover { color: ${A}; }

/* Trust sidebar */
.sp-sidebar {
  position: sticky;
  top: 100px;
}
.sp-trust-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  margin-bottom: 16px;
}
.sp-trust-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.sp-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
.sp-trust-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: ${A}18;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: ${A};
}
.sp-test-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  margin-bottom: 16px;
}
.sp-quote-mark {
  font-family: ${F.h};
  font-size: 3rem;
  line-height: 0.5;
  color: ${A};
  margin-bottom: 12px;
  display: block;
}

/* Success state */
.sp-success {
  text-align: center;
  padding: 60px 40px;
}
.sp-step-num {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: ${A}22;
  border: 1.5px solid ${A}44;
  display: flex; align-items: center; justify-content: center;
  font-family: ${F.m};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${A};
  flex-shrink: 0;
}
.sp-next-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  text-align: left;
}
.sp-next-step:last-child { border-bottom: none; }

/* Required field indicator */
.sp-required { color: #E8916F; margin-left: 2px; }

/* Error state */
.sp-error {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: #E8916F;
  margin-top: 6px;
}
`;

// ── Reveal component ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── SVG Icons ───────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="11" height="9" viewBox="0 0 11 9" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 4.5L4 7.5L10 1.5"/>
  </svg>
);
const ArrowRightIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const ArrowLeftIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
const EditIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const ShieldIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ClockIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const LockIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const HeartIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const CalendarIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const CheckCircleIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ── Form data ────────────────────────────────────────────────────────────────
const NEEDS_OPTIONS = [
  'Build a new product from scratch',
  'Fix / finish an existing project',
  'Build internal tools',
  'Automate workflows',
  'Architecture review / consulting',
  'Ongoing development',
  "Not sure yet — help me figure it out",
];
const ROLES = ['Founder', 'Business Owner', 'Team Lead', 'Other'];
const SOURCES = [
  { value: '', label: 'Select one...' },
  { value: 'google', label: 'Google / Search' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'referral', label: 'Referral from someone' },
  { value: 'github', label: 'GitHub' },
  { value: 'other', label: 'Other' },
];
const BUDGETS = ['Under $5K', '$5K–$10K', '$10K–$20K', '$20K+', 'Not sure'];
const TIMELINES = ['ASAP', '2–4 weeks', '1–2 months', 'Flexible', 'Not sure'];
const COMMUNICATIONS = ['Slack', 'Email', 'Video calls', 'WhatsApp'];
const EXISTING_CODE = ['Yes', 'No', 'Sort of'];

const TRUST_ITEMS = [
  { icon: <HeartIcon size={16} />, label: 'No commitment', text: 'This is just the start of a conversation.' },
  { icon: <ClockIcon size={16} />, label: 'We respond within 4 hours', text: 'On business days. Usually faster.' },
  { icon: <LockIcon size={16} />, label: 'Everything is confidential', text: "We won't share what you tell us." },
  { icon: <ShieldIcon size={16} />, label: "We'll be honest", text: "If we're not the right fit, we'll say so." },
];

const TESTIMONIALS = [
  { quote: "Fixed price, no surprises. They scoped it clearly, hit every milestone, and the code is clean.", author: "Priya D.", role: "Founder, InboxFlow" },
  { quote: "I'm not technical and never felt lost. They explained every decision in plain English.", author: "David K.", role: "Founder" },
  { quote: "Delivered in 3 weeks. The automation pays for itself every month.", author: "Sarah M.", role: "Operations Director" },
];

// ── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Step {step} of {total}
        </span>
        <span style={{ fontFamily: F.b, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {Math.round((step / total) * 100)}% complete
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {['About You', 'Your Project', 'Details', 'Confirm'].map((label, i) => (
          <div key={i} style={{
            flex: 1,
            fontFamily: F.b,
            fontSize: '0.72rem',
            color: i + 1 === step ? A : i + 1 < step ? 'var(--text-secondary)' : 'var(--text-muted)',
            fontWeight: i + 1 === step ? 600 : 400,
            textAlign: 'center',
            paddingTop: 6,
            borderTop: `2px solid ${i + 1 <= step ? A : 'var(--border)'}`,
            transition: 'color 0.3s, border-color 0.3s',
          }}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Radio pill component ─────────────────────────────────────────────────────
function RadioPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div className={`sp-radio-pill${selected ? ' selected' : ''}`} onClick={onClick} role="radio" aria-checked={selected} tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}>
      <div className="sp-radio-dot">
        {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
      </div>
      <span>{label}</span>
    </div>
  );
}

// ── Pill component ───────────────────────────────────────────────────────────
function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div className={`sp-pill${selected ? ' selected' : ''}`} onClick={onClick} role="radio" aria-checked={selected} tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}>
      {label}
    </div>
  );
}

// ── Main page component ──────────────────────────────────────────────────────
export default function StartProjectPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    name: '', email: '', company: '', role: '', source: '',
    needs: [], description: '',
    existingCode: '', budget: '', timeline: '', communication: '',
    notes: '',
  });

  const set = (field: keyof FormData) => (val: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const toggleNeed = (val: string) => {
    const next = form.needs.includes(val)
      ? form.needs.filter(n => n !== val)
      : [...form.needs, val];
    set('needs')(next);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = 'Name is required';
      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 4));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const back = () => {
    setStep(s => Math.max(s - 1, 1));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const stepTitle: Record<number, string> = {
    1: 'Tell us about yourself.',
    2: 'What do you need to build?',
    3: 'A few more details.',
    4: 'Review and confirm.',
  };

  return (
    <main className="sp-page">
      <style>{STYLES}</style>

      {/* Hero */}
      <section style={{
        padding: '120px 0 80px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orb */}
        <div style={{
          position: 'absolute', top: '-200px', right: '-200px',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${A}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">Start a Project</div>
            <h1 style={{
              fontFamily: F.h,
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              maxWidth: 700,
              marginBottom: 20,
            }}>
              Tell Us What You&apos;re Building.{' '}
              <span className="gradient-text">We&apos;ll Take It From Here.</span>
            </h1>
            <p style={{
              fontFamily: F.b,
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              maxWidth: 520,
              lineHeight: 1.7,
            }}>
              Fill in what you can. Skip what you can&apos;t. We&apos;ll figure the rest out together on a call.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section style={{ padding: '0 0 120px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div className="sp-layout">

            {/* Form */}
            <Reveal>
              <div ref={formRef} className="sp-form-card">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="sp-success"
                    >
                      <div style={{ color: A, marginBottom: 20 }}>
                        <CheckCircleIcon size={48} />
                      </div>
                      <h2 style={{
                        fontFamily: F.h, fontSize: '1.6rem', fontWeight: 700,
                        letterSpacing: '-0.025em', color: 'var(--text-primary)',
                        marginBottom: 12,
                      }}>
                        Got it. We&apos;re reviewing your project now.
                      </h2>
                      <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 460, margin: '0 auto 40px' }}>
                        We&apos;ll review this within 4 hours on business days and get back to you with next steps.
                      </p>

                      <div style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '28px',
                        textAlign: 'left',
                        marginBottom: 32,
                      }}>
                        <p style={{ fontFamily: F.h, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>What happens next:</p>
                        {[
                          'We review your request (within 4 hours)',
                          'A SocioFi engineer reaches out to schedule a call',
                          'We discuss your project and give you an honest assessment',
                        ].map((item, i) => (
                          <div key={i} className="sp-next-step">
                            <div className="sp-step-num">{i + 1}</div>
                            <p style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', paddingTop: 6 }}>{item}</p>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/studio/process" className="btn-ghost">Our Process</Link>
                        <Link href="/studio/portfolio" className="btn-ghost">View Portfolio</Link>
                        <Link href="/studio/faq" className="btn-ghost">FAQ</Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`step-${step}`}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <StepIndicator step={step} total={4} />
                      <h2 style={{
                        fontFamily: F.h, fontSize: '1.25rem', fontWeight: 700,
                        letterSpacing: '-0.02em', color: 'var(--text-primary)',
                        marginBottom: 24,
                      }}>
                        {stepTitle[step]}
                      </h2>

                      {/* ── Step 1 ────────────────────────────────── */}
                      {step === 1 && (
                        <div>
                          <div className="sp-field">
                            <label className="sp-label" htmlFor="sp-name">Your name <span className="sp-required">*</span></label>
                            <input id="sp-name" className="sp-input" type="text" placeholder="Your full name"
                              value={form.name} onChange={e => set('name')(e.target.value)} autoComplete="name" />
                            {errors.name && <div className="sp-error">{errors.name}</div>}
                          </div>
                          <div className="sp-field">
                            <label className="sp-label" htmlFor="sp-email">Email address <span className="sp-required">*</span></label>
                            <input id="sp-email" className="sp-input" type="email" placeholder="you@company.com"
                              value={form.email} onChange={e => set('email')(e.target.value)} autoComplete="email" />
                            {errors.email && <div className="sp-error">{errors.email}</div>}
                          </div>
                          <div className="sp-field">
                            <label className="sp-label" htmlFor="sp-company">Company name <span className="sp-optional">optional</span></label>
                            <input id="sp-company" className="sp-input" type="text" placeholder="Your company or project name"
                              value={form.company} onChange={e => set('company')(e.target.value)} autoComplete="organization" />
                          </div>
                          <div className="sp-field">
                            <label className="sp-label">Your role</label>
                            <div className="sp-radio-grid">
                              {ROLES.map(role => (
                                <RadioPill key={role} label={role} selected={form.role === role} onClick={() => set('role')(role)} />
                              ))}
                            </div>
                          </div>
                          <div className="sp-field">
                            <label className="sp-label" htmlFor="sp-source">How did you hear about us? <span className="sp-optional">optional</span></label>
                            <div style={{ position: 'relative' }}>
                              <select id="sp-source" className="sp-select" value={form.source} onChange={e => set('source')(e.target.value)}>
                                {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                              </select>
                              <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Step 2 ────────────────────────────────── */}
                      {step === 2 && (
                        <div>
                          <div className="sp-field">
                            <label className="sp-label">What do you need? <span className="sp-optional">select all that apply</span></label>
                            <div className="sp-check-grid">
                              {NEEDS_OPTIONS.map(opt => {
                                const sel = form.needs.includes(opt);
                                return (
                                  <div key={opt} className={`sp-check-card${sel ? ' selected' : ''}`} onClick={() => toggleNeed(opt)}
                                    role="checkbox" aria-checked={sel} tabIndex={0}
                                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleNeed(opt)}>
                                    <div className="sp-checkbox">{sel && <CheckIcon />}</div>
                                    <span>{opt}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="sp-field" style={{ marginBottom: 0 }}>
                            <label className="sp-label" htmlFor="sp-desc">Describe the project <span className="sp-optional">optional</span></label>
                            <textarea id="sp-desc" className="sp-textarea"
                              placeholder="Don't worry about technical details. Tell us the business problem you're solving."
                              value={form.description} onChange={e => set('description')(e.target.value)} />
                          </div>
                        </div>
                      )}

                      {/* ── Step 3 ────────────────────────────────── */}
                      {step === 3 && (
                        <div>
                          <div className="sp-field">
                            <label className="sp-label">Do you have an existing codebase?</label>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              {EXISTING_CODE.map(opt => (
                                <Pill key={opt} label={opt} selected={form.existingCode === opt} onClick={() => set('existingCode')(opt)} />
                              ))}
                            </div>
                          </div>
                          <div className="sp-field">
                            <label className="sp-label">Budget range</label>
                            <div className="sp-pills-row">
                              {BUDGETS.map(opt => (
                                <Pill key={opt} label={opt} selected={form.budget === opt} onClick={() => set('budget')(opt)} />
                              ))}
                            </div>
                          </div>
                          <div className="sp-field">
                            <label className="sp-label">Ideal timeline</label>
                            <div className="sp-pills-row">
                              {TIMELINES.map(opt => (
                                <Pill key={opt} label={opt} selected={form.timeline === opt} onClick={() => set('timeline')(opt)} />
                              ))}
                            </div>
                          </div>
                          <div className="sp-field" style={{ marginBottom: 0 }}>
                            <label className="sp-label">Preferred communication</label>
                            <div className="sp-pills-row">
                              {COMMUNICATIONS.map(opt => (
                                <Pill key={opt} label={opt} selected={form.communication === opt} onClick={() => set('communication')(opt)} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── Step 4 ────────────────────────────────── */}
                      {step === 4 && (
                        <div>
                          <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                            Review your answers. Click the edit icon to go back and change anything.
                          </p>

                          {/* About You summary */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontFamily: F.m, fontSize: '0.65rem', fontWeight: 600, color: A, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>About You</div>
                            <div className="sp-summary-card">
                              <div>
                                <div className="sp-summary-label">Name</div>
                                <div className="sp-summary-value">{form.name || '—'}</div>
                              </div>
                              <button className="sp-edit-btn" onClick={() => setStep(1)} aria-label="Edit about you"><EditIcon /></button>
                            </div>
                            <div className="sp-summary-card">
                              <div>
                                <div className="sp-summary-label">Email</div>
                                <div className="sp-summary-value">{form.email || '—'}</div>
                              </div>
                            </div>
                            {form.company && (
                              <div className="sp-summary-card">
                                <div>
                                  <div className="sp-summary-label">Company</div>
                                  <div className="sp-summary-value">{form.company}</div>
                                </div>
                              </div>
                            )}
                            {form.role && (
                              <div className="sp-summary-card">
                                <div>
                                  <div className="sp-summary-label">Role</div>
                                  <div className="sp-summary-value">{form.role}</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Project summary */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontFamily: F.m, fontSize: '0.65rem', fontWeight: 600, color: A, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Project</div>
                            <div className="sp-summary-card">
                              <div style={{ flex: 1 }}>
                                <div className="sp-summary-label">Needs</div>
                                <div className="sp-summary-value">
                                  {form.needs.length > 0 ? form.needs.join(', ') : '—'}
                                </div>
                              </div>
                              <button className="sp-edit-btn" onClick={() => setStep(2)} aria-label="Edit project details"><EditIcon /></button>
                            </div>
                            {form.description && (
                              <div className="sp-summary-card">
                                <div style={{ flex: 1 }}>
                                  <div className="sp-summary-label">Description</div>
                                  <div className="sp-summary-value" style={{ maxWidth: '100%', wordBreak: 'break-word' }}>{form.description}</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Details summary */}
                          <div style={{ marginBottom: 24 }}>
                            <div style={{ fontFamily: F.m, fontSize: '0.65rem', fontWeight: 600, color: A, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Details</div>
                            {[
                              { label: 'Existing codebase', value: form.existingCode },
                              { label: 'Budget', value: form.budget },
                              { label: 'Timeline', value: form.timeline },
                              { label: 'Communication', value: form.communication },
                            ].filter(i => i.value).map(item => (
                              <div key={item.label} className="sp-summary-card">
                                <div>
                                  <div className="sp-summary-label">{item.label}</div>
                                  <div className="sp-summary-value">{item.value}</div>
                                </div>
                                <button className="sp-edit-btn" onClick={() => setStep(3)} aria-label={`Edit ${item.label}`}><EditIcon /></button>
                              </div>
                            ))}
                          </div>

                          {/* Additional notes */}
                          <div className="sp-field">
                            <label className="sp-label" htmlFor="sp-notes">Anything else we should know? <span className="sp-optional">optional</span></label>
                            <textarea id="sp-notes" className="sp-textarea"
                              placeholder="Any constraints, timing requirements, or context that would help us..."
                              value={form.notes} onChange={e => set('notes')(e.target.value)} style={{ minHeight: 90 }} />
                          </div>

                          {/* Submit note */}
                          <p style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, marginBottom: 0, lineHeight: 1.6 }}>
                            We&apos;ll review this within 4 hours on business days and get back to you with next steps.
                          </p>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="sp-nav-row">
                        {step > 1 ? (
                          <button className="btn-ghost" onClick={back}>
                            <ArrowLeftIcon size={16} /> Back
                          </button>
                        ) : (
                          <span />
                        )}
                        {step < 4 ? (
                          <button className="btn-primary" onClick={next}>
                            Continue <ArrowRightIcon size={16} />
                          </button>
                        ) : (
                          <button className="btn-primary" onClick={handleSubmit}>
                            Send Project Request <ArrowRightIcon size={16} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            {/* Sidebar */}
            <div className="sp-sidebar">
              <Reveal delay={0.15}>
                <div className="sp-trust-card">
                  <p style={{ fontFamily: F.h, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-0.01em' }}>
                    A few things to know:
                  </p>
                  {TRUST_ITEMS.map((item, i) => (
                    <div key={i} className="sp-trust-item">
                      <div className="sp-trust-icon">{item.icon}</div>
                      <div>
                        <div style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} delay={0.2 + i * 0.08}>
                  <div className="sp-test-card">
                    <span className="sp-quote-mark">&ldquo;</span>
                    <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
                      {t.quote}
                    </p>
                    <div style={{ fontFamily: F.h, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.author}</div>
                    <div style={{ fontFamily: F.b, fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.4}>
                <div className="sp-trust-card" style={{ textAlign: 'center' }}>
                  <div style={{ color: A, marginBottom: 12 }}><CalendarIcon size={22} /></div>
                  <p style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Prefer to just talk?
                  </p>
                  <p style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
                    Skip the form and book a free 30-minute call directly.
                  </p>
                  <Link href="/contact" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600,
                    color: A, textDecoration: 'none',
                  }}>
                    Book a call <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
