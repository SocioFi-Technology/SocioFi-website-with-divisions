'use client';

import { useState, useId } from 'react';
import Button from '@/components/shared/Button';

interface FormValues {
  startup_name: string;
  name: string;
  email: string;
  website: string;
  stage: string;
  industry: string;
  problem: string;
  ai_role: string;
  looking_for: string;
  funding: string;
  team_size: string;
}

interface FormErrors {
  startup_name?: string;
  name?: string;
  email?: string;
  stage?: string;
  industry?: string;
  problem?: string;
  ai_role?: string;
  looking_for?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.startup_name.trim()) errors.startup_name = 'Startup name is required.';
  if (!values.name.trim()) errors.name = 'Your name is required.';

  if (!values.email.trim()) {
    errors.email = 'Your email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.stage) errors.stage = 'Please select your stage.';
  if (!values.industry.trim()) errors.industry = 'Industry is required.';

  if (!values.problem.trim()) {
    errors.problem = 'Please describe the problem you are solving.';
  } else if (values.problem.trim().length < 50) {
    errors.problem = 'Please add more detail (at least 50 characters).';
  }

  if (!values.ai_role.trim()) {
    errors.ai_role = 'Please describe how AI is core to your product.';
  } else if (values.ai_role.trim().length < 50) {
    errors.ai_role = 'Please add more detail (at least 50 characters).';
  }

  if (!values.looking_for) errors.looking_for = 'Please select what you are looking for.';

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

const selectStyle = (hasError: boolean, focused: boolean, accent: string): React.CSSProperties => ({
  ...inputStyle(hasError, focused, accent),
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237C8DB0' stroke-width='1.8' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 40,
});

interface ApplicationFormProps {
  accentColor?: string;
  className?: string;
}

export default function ApplicationForm({
  accentColor,
  className = '',
}: ApplicationFormProps) {
  const accent = accentColor ?? 'var(--division-accent, #6BA3E8)';
  const uid = useId();

  const [values, setValues] = useState<FormValues>({
    startup_name: '',
    name: '',
    email: '',
    website: '',
    stage: '',
    industry: '',
    problem: '',
    ai_role: '',
    looking_for: '',
    funding: '',
    team_size: '',
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
    setTouched(
      Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
    );
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/ventures/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startup_name: values.startup_name,
          name: values.name,
          email: values.email,
          website: values.website || undefined,
          stage: values.stage,
          sector: values.industry,
          description: values.problem,
          ask: values.looking_for,
          funding: values.funding || undefined,
          team_size: values.team_size || undefined,
          ai_role: values.ai_role,
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
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
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: `color-mix(in srgb, ${accent} 15%, transparent)`,
            border: `1.5px solid ${accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width={22}
            height={22}
            stroke={accent}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1.2rem',
            fontWeight: 400,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Application received
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: 0,
            maxWidth: '40ch',
          }}
        >
          We review every application and will be in touch within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* Startup name + Your name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          id={`${uid}-startup_name`}
          label="Startup name"
          error={touched.startup_name ? errors.startup_name : undefined}
          required
          accentColor={accent}
        >
          <input
            id={`${uid}-startup_name`}
            type="text"
            value={values.startup_name}
            onChange={set('startup_name')}
            onFocus={() => setFocused('startup_name')}
            onBlur={blur('startup_name')}
            style={inputStyle(!!touched.startup_name && !!errors.startup_name, focused === 'startup_name', accent)}
            placeholder="Acme AI"
          />
        </Field>

        <Field
          id={`${uid}-name`}
          label="Your name"
          error={touched.name ? errors.name : undefined}
          required
          accentColor={accent}
        >
          <input
            id={`${uid}-name`}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={set('name')}
            onFocus={() => setFocused('name')}
            onBlur={blur('name')}
            style={inputStyle(!!touched.name && !!errors.name, focused === 'name', accent)}
            placeholder="Your full name"
          />
        </Field>
      </div>

      {/* Email + Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          id={`${uid}-email`}
          label="Email"
          error={touched.email ? errors.email : undefined}
          required
          accentColor={accent}
        >
          <input
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set('email')}
            onFocus={() => setFocused('email')}
            onBlur={blur('email')}
            style={inputStyle(!!touched.email && !!errors.email, focused === 'email', accent)}
            placeholder="you@startup.com"
          />
        </Field>

        <Field
          id={`${uid}-website`}
          label="Website"
          accentColor={accent}
        >
          <input
            id={`${uid}-website`}
            type="url"
            value={values.website}
            onChange={set('website')}
            onFocus={() => setFocused('website')}
            onBlur={blur('website')}
            style={inputStyle(false, focused === 'website', accent)}
            placeholder="https://yourstartup.com"
          />
        </Field>
      </div>

      {/* Stage + Industry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          id={`${uid}-stage`}
          label="Stage"
          error={touched.stage ? errors.stage : undefined}
          required
          accentColor={accent}
        >
          <select
            id={`${uid}-stage`}
            value={values.stage}
            onChange={set('stage')}
            onFocus={() => setFocused('stage')}
            onBlur={blur('stage')}
            style={selectStyle(!!touched.stage && !!errors.stage, focused === 'stage', accent)}
          >
            <option value="">Select your stage</option>
            <option value="Idea / Pre-product">Idea / Pre-product</option>
            <option value="MVP / Beta">MVP / Beta</option>
            <option value="Launched / Revenue">Launched / Revenue</option>
            <option value="Growth Stage">Growth Stage</option>
          </select>
        </Field>

        <Field
          id={`${uid}-industry`}
          label="Industry"
          error={touched.industry ? errors.industry : undefined}
          required
          accentColor={accent}
        >
          <input
            id={`${uid}-industry`}
            type="text"
            value={values.industry}
            onChange={set('industry')}
            onFocus={() => setFocused('industry')}
            onBlur={blur('industry')}
            style={inputStyle(!!touched.industry && !!errors.industry, focused === 'industry', accent)}
            placeholder="e.g. Healthcare, Fintech, EdTech"
          />
        </Field>
      </div>

      {/* Problem */}
      <Field
        id={`${uid}-problem`}
        label="The problem you're solving"
        error={touched.problem ? errors.problem : undefined}
        required
        accentColor={accent}
      >
        <textarea
          id={`${uid}-problem`}
          rows={4}
          value={values.problem}
          onChange={set('problem')}
          onFocus={() => setFocused('problem')}
          onBlur={blur('problem')}
          style={{
            ...inputStyle(!!touched.problem && !!errors.problem, focused === 'problem', accent),
            resize: 'vertical',
            minHeight: 100,
          }}
          placeholder="What problem exists today, and why does it matter to your target customer?"
        />
      </Field>

      {/* AI's role */}
      <Field
        id={`${uid}-ai_role`}
        label="AI's role in your product"
        error={touched.ai_role ? errors.ai_role : undefined}
        required
        accentColor={accent}
      >
        <textarea
          id={`${uid}-ai_role`}
          rows={4}
          value={values.ai_role}
          onChange={set('ai_role')}
          onFocus={() => setFocused('ai_role')}
          onBlur={blur('ai_role')}
          style={{
            ...inputStyle(!!touched.ai_role && !!errors.ai_role, focused === 'ai_role', accent),
            resize: 'vertical',
            minHeight: 100,
          }}
          placeholder="How is AI core to what you're building — not just a feature, but central to the product's value?"
        />
      </Field>

      {/* Looking for + Funding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          id={`${uid}-looking_for`}
          label="What you're looking for from SocioFi Ventures"
          error={touched.looking_for ? errors.looking_for : undefined}
          required
          accentColor={accent}
        >
          <select
            id={`${uid}-looking_for`}
            value={values.looking_for}
            onChange={set('looking_for')}
            onFocus={() => setFocused('looking_for')}
            onBlur={blur('looking_for')}
            style={selectStyle(!!touched.looking_for && !!errors.looking_for, focused === 'looking_for', accent)}
          >
            <option value="">Select what you need</option>
            <option value="Investment">Investment</option>
            <option value="Technical partnership">Technical partnership</option>
            <option value="Both">Both</option>
          </select>
        </Field>

        <Field
          id={`${uid}-funding`}
          label="Funding raised to date"
          accentColor={accent}
        >
          <select
            id={`${uid}-funding`}
            value={values.funding}
            onChange={set('funding')}
            onFocus={() => setFocused('funding')}
            onBlur={blur('funding')}
            style={selectStyle(false, focused === 'funding', accent)}
          >
            <option value="">Select an option</option>
            <option value="Bootstrapped">Bootstrapped</option>
            <option value="Pre-seed (<$500K)">Pre-seed (&lt;$500K)</option>
            <option value="Seed ($500K–$2M)">Seed ($500K–$2M)</option>
            <option value="Series A+">Series A+</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </Field>
      </div>

      {/* Team size */}
      <Field
        id={`${uid}-team_size`}
        label="Team size"
        accentColor={accent}
      >
        <select
          id={`${uid}-team_size`}
          value={values.team_size}
          onChange={set('team_size')}
          onFocus={() => setFocused('team_size')}
          onBlur={blur('team_size')}
          style={selectStyle(false, focused === 'team_size', accent)}
        >
          <option value="">Select team size</option>
          <option value="Just me">Just me</option>
          <option value="2-5">2–5</option>
          <option value="6-15">6–15</option>
          <option value="16+">16+</option>
        </select>
      </Field>

      {/* Error banner */}
      {status === 'error' && (
        <p
          role="alert"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: '#E8916F',
            margin: 0,
            padding: '12px 16px',
            background: 'rgba(232,145,111,0.08)',
            border: '1px solid rgba(232,145,111,0.2)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
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
          {status === 'submitting' ? 'Submitting...' : 'Submit application'}
        </Button>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          We review every application and respond within 5 business days.
        </p>
      </div>
    </form>
  );
}
