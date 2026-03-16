'use client';

import { useState, useId } from 'react';
import Button from '@/components/shared/Button';
import { divisionList } from '@/lib/divisions';

interface FormValues {
  name: string;
  email: string;
  division: string;
  message: string;
  source: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Your name is required.';
  if (!values.email.trim()) {
    errors.email = 'Your email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.message.trim()) {
    errors.message = 'Tell us about your project.';
  } else if (values.message.trim().length < 20) {
    errors.message = 'Please add a bit more detail (at least 20 characters).';
  }
  return errors;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  accentColor: string;
  children: React.ReactNode;
}

function Field({ id, label, error, required, accentColor, children }: FieldProps) {
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
          gap: 4,
        }}
      >
        {label}
        {required && (
          <span style={{ color: accentColor }} aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: '#E8916F',
            margin: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
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
  boxSizing: 'border-box',
});

interface ContactFormProps {
  accentColor?: string;
  /** Pre-select a division */
  defaultDivision?: string;
  className?: string;
}

export default function ContactForm({
  accentColor,
  defaultDivision = '',
  className = '',
}: ContactFormProps) {
  const accent = accentColor ?? 'var(--division-accent, #59A392)';
  const uid = useId();

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    division: defaultDivision,
    message: '',
    source: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [focused, setFocused] = useState<keyof FormValues | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const set = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues(v => ({ ...v, [field]: e.target.value }));
    if (touched[field]) {
      const errs = validate({ ...values, [field]: e.target.value });
      setErrors(prev => ({ ...prev, [field]: errs[field as keyof FormErrors] }));
    }
  };

  const blur = (field: keyof FormValues) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    setFocused(null);
    const errs = validate(values);
    setErrors(prev => ({ ...prev, [field]: errs[field as keyof FormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      // Replace with Formspree endpoint or Next.js API route
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div
        className={className}
        style={{
          textAlign: 'center',
          padding: '48px 32px',
          background: 'var(--bg-card)',
          border: `1px solid ${accent}33`,
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
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
          Message received
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
          lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0, maxWidth: '36ch',
        }}>
          We respond within 4 hours on business days. One of our team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          id={`${uid}-name`} label="Your name"
          error={touched.name ? errors.name : undefined}
          required accentColor={accent}
        >
          <input
            id={`${uid}-name`} type="text" autoComplete="name"
            value={values.name} onChange={set('name')}
            onFocus={() => setFocused('name')} onBlur={blur('name')}
            style={inputStyle(!!touched.name && !!errors.name, focused === 'name', accent)}
            placeholder="Kamrul Hasan"
          />
        </Field>

        <Field
          id={`${uid}-email`} label="Work email"
          error={touched.email ? errors.email : undefined}
          required accentColor={accent}
        >
          <input
            id={`${uid}-email`} type="email" autoComplete="email"
            value={values.email} onChange={set('email')}
            onFocus={() => setFocused('email')} onBlur={blur('email')}
            style={inputStyle(!!touched.email && !!errors.email, focused === 'email', accent)}
            placeholder="you@company.com"
          />
        </Field>
      </div>

      {/* Division */}
      <Field id={`${uid}-division`} label="Which division fits best?" accentColor={accent}>
        <select
          id={`${uid}-division`}
          value={values.division} onChange={set('division')}
          onFocus={() => setFocused('division')} onBlur={blur('division')}
          style={{
            ...inputStyle(false, focused === 'division', accent),
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237C8DB0' stroke-width='1.8' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
            paddingRight: 40,
          }}
        >
          <option value="">Not sure — help me figure it out</option>
          {divisionList.map(d => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </Field>

      {/* Message */}
      <Field
        id={`${uid}-message`} label="Tell us about your project"
        error={touched.message ? errors.message : undefined}
        required accentColor={accent}
      >
        <textarea
          id={`${uid}-message`}
          rows={5} value={values.message} onChange={set('message')}
          onFocus={() => setFocused('message')} onBlur={blur('message')}
          style={{
            ...inputStyle(!!touched.message && !!errors.message, focused === 'message', accent),
            resize: 'vertical',
            minHeight: 120,
          }}
          placeholder="What are you building? Where are you stuck? What does done look like?"
        />
      </Field>

      {/* Source — optional */}
      <Field id={`${uid}-source`} label="How did you hear about us?" accentColor={accent}>
        <input
          id={`${uid}-source`} type="text"
          value={values.source} onChange={set('source')}
          onFocus={() => setFocused('source')} onBlur={blur('source')}
          style={inputStyle(false, focused === 'source', accent)}
          placeholder="Twitter, a friend, Google..."
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
          Something went wrong. Please try again or email us directly.
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
          {status === 'submitting' ? 'Sending...' : 'Send message'}
        </Button>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          color: 'var(--text-muted)', textAlign: 'center',
          letterSpacing: '0.04em',
        }}>
          We respond within 4 hours on business days.
        </p>
      </div>
    </form>
  );
}
