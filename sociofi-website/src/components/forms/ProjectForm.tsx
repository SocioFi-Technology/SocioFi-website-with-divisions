'use client';

import { useState, useId } from 'react';
import Button from '@/components/shared/Button';

interface ProjectFormValues {
  name: string;
  email: string;
  company: string;
  budget: string;
  timeline: string;
  description: string;
}

interface ProjectFormErrors {
  name?: string;
  email?: string;
  description?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const BUDGET_OPTIONS = [
  { value: '', label: 'Select a budget range' },
  { value: 'under-2500', label: 'Under $2,500' },
  { value: '2500-5000', label: '$2,500 – $5,000' },
  { value: '5000-10000', label: '$5,000 – $10,000' },
  { value: '10000-25000', label: '$10,000 – $25,000' },
  { value: '25000-50000', label: '$25,000 – $50,000' },
  { value: '50000-plus', label: '$50,000+' },
  { value: 'not-sure', label: "Not sure yet — help me scope it" },
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'When do you need this?' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: 'flexible', label: "Flexible — quality over speed" },
];

function validate(values: ProjectFormValues): ProjectFormErrors {
  const errors: ProjectFormErrors = {};
  if (!values.name.trim()) errors.name = 'Your name is required.';
  if (!values.email.trim()) {
    errors.email = 'Your email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.description.trim()) {
    errors.description = 'Tell us about your project.';
  } else if (values.description.trim().length < 20) {
    errors.description = 'Please add a bit more detail (at least 20 characters).';
  }
  return errors;
}

const inputStyle = (hasError: boolean, focused: boolean, accent: string): React.CSSProperties => ({
  width: '100%',
  padding: '12px 16px',
  background: 'var(--bg-card)',
  border: `1.5px solid ${hasError ? '#E8916F' : focused ? accent : 'var(--border)'}`,
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
});

const selectStyle = (focused: boolean, accent: string): React.CSSProperties => ({
  ...inputStyle(false, focused, accent),
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237C8DB0' stroke-width='1.8' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 40,
});

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  accent: string;
  children: React.ReactNode;
}

function Field({ id, label, error, required, optional, accent, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          fontWeight: 500,
          color: error ? '#E8916F' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {label}
        {required && <span style={{ color: accent }} aria-hidden="true">*</span>}
        {optional && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            optional
          </span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: '#E8916F',
          margin: 0,
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

interface ProjectFormProps {
  accentColor?: string;
  className?: string;
}

export default function ProjectForm({ accentColor, className = '' }: ProjectFormProps) {
  const accent = accentColor ?? 'var(--division-accent, #59A392)';
  const uid = useId();

  const [values, setValues] = useState<ProjectFormValues>({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: '',
    description: '',
  });
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ProjectFormValues, boolean>>>({});
  const [focused, setFocused] = useState<keyof ProjectFormValues | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const set = (field: keyof ProjectFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues(v => ({ ...v, [field]: e.target.value }));
    if (touched[field]) {
      const errs = validate({ ...values, [field]: e.target.value });
      setErrors(prev => ({ ...prev, [field]: errs[field as keyof ProjectFormErrors] }));
    }
  };

  const blur = (field: keyof ProjectFormValues) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    setFocused(null);
    const errs = validate(values);
    setErrors(prev => ({ ...prev, [field]: errs[field as keyof ProjectFormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, description: true });
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, type: 'project' }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={className} style={{
        textAlign: 'center',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: `color-mix(in srgb, ${accent} 15%, transparent)`,
          border: `1.5px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" width={22} height={22}
            stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.2rem',
          fontWeight: 700, color: 'var(--text-primary)', margin: 0,
        }}>
          Request received
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
          lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0, maxWidth: '36ch',
        }}>
          We respond within 4 hours on business days. Expect a reply from a real engineer — not an autoresponder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id={`${uid}-name`} label="Your name" required accent={accent}
          error={touched.name ? errors.name : undefined}>
          <input
            id={`${uid}-name`} type="text" autoComplete="name"
            value={values.name} onChange={set('name')}
            onFocus={() => setFocused('name')} onBlur={blur('name')}
            style={inputStyle(!!touched.name && !!errors.name, focused === 'name', accent)}
            placeholder="Kamrul Hasan"
          />
        </Field>

        <Field id={`${uid}-email`} label="Work email" required accent={accent}
          error={touched.email ? errors.email : undefined}>
          <input
            id={`${uid}-email`} type="email" autoComplete="email"
            value={values.email} onChange={set('email')}
            onFocus={() => setFocused('email')} onBlur={blur('email')}
            style={inputStyle(!!touched.email && !!errors.email, focused === 'email', accent)}
            placeholder="you@company.com"
          />
        </Field>
      </div>

      {/* Company — optional */}
      <Field id={`${uid}-company`} label="Company" optional accent={accent}>
        <input
          id={`${uid}-company`} type="text" autoComplete="organization"
          value={values.company} onChange={set('company')}
          onFocus={() => setFocused('company')} onBlur={blur('company')}
          style={inputStyle(false, focused === 'company', accent)}
          placeholder="Your company or project name"
        />
      </Field>

      {/* Budget + Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id={`${uid}-budget`} label="Budget range" accent={accent}>
          <select
            id={`${uid}-budget`}
            value={values.budget} onChange={set('budget')}
            onFocus={() => setFocused('budget')} onBlur={blur('budget')}
            style={selectStyle(focused === 'budget', accent)}
          >
            {BUDGET_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>

        <Field id={`${uid}-timeline`} label="Timeline" accent={accent}>
          <select
            id={`${uid}-timeline`}
            value={values.timeline} onChange={set('timeline')}
            onFocus={() => setFocused('timeline')} onBlur={blur('timeline')}
            style={selectStyle(focused === 'timeline', accent)}
          >
            {TIMELINE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Project description */}
      <Field id={`${uid}-description`} label="Tell us about your project" required accent={accent}
        error={touched.description ? errors.description : undefined}>
        <textarea
          id={`${uid}-description`}
          rows={5} value={values.description} onChange={set('description')}
          onFocus={() => setFocused('description')} onBlur={blur('description')}
          style={{
            ...inputStyle(!!touched.description && !!errors.description, focused === 'description', accent),
            resize: 'vertical',
            minHeight: 130,
          }}
          placeholder="What are you building? What have you already built? What does done look like for you?"
        />
      </Field>

      {/* Error banner */}
      {status === 'error' && (
        <p role="alert" style={{
          fontFamily: 'var(--font-body)', fontSize: '0.88rem',
          color: '#E8916F', margin: 0,
          padding: '12px 16px',
          background: 'rgba(232,145,111,0.08)',
          border: '1px solid rgba(232,145,111,0.2)',
          borderRadius: 'var(--radius-sm)',
        }}>
          Something went wrong. Please try again or email us at hello@sociofi.tech
        </p>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === 'submitting'}
          className="w-full justify-center"
        >
          {status === 'submitting' ? 'Sending...' : 'Start a project'}
        </Button>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          color: 'var(--text-muted)', textAlign: 'center',
          letterSpacing: '0.04em',
        }}>
          We respond within 4 hours on business days. No commitment.
        </p>
      </div>
    </form>
  );
}
