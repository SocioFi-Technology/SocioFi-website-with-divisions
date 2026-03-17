'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { ArrowRight } from '@/lib/icons';

// ── Question tree ──────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'stage',
    text: 'Where is your software right now?',
    options: [
      { label: 'Just launched or about to launch', value: 'new' },
      { label: 'Running, but I worry about it', value: 'live' },
      { label: 'Breaking down — I need help now', value: 'broken' },
    ],
  },
  {
    id: 'team',
    text: 'Do you have any technical resources?',
    options: [
      { label: 'No — I have no dev team at all', value: 'none' },
      { label: 'Part-time or freelance only', value: 'part' },
      { label: 'Small in-house team, stretched thin', value: 'team' },
    ],
  },
  {
    id: 'risk',
    text: 'What happens if the site goes down?',
    options: [
      { label: 'Annoying, but manageable', value: 'low' },
      { label: 'We lose customers and revenue', value: 'medium' },
      { label: 'Catastrophic — every minute costs money', value: 'high' },
    ],
  },
];

// ── Plan recommendations ───────────────────────────────────────────────────────

type Answers = Record<string, string>;

function getRecommendation(answers: Answers): {
  plan: string;
  accent: string;
  price: string;
  why: string;
  href: string;
} {
  const { stage, team, risk } = answers;

  if (risk === 'high' || (stage === 'broken' && team === 'none')) {
    return {
      plan: 'Guardian',
      accent: '#E8916F',
      price: '$999/month',
      why: 'You need 24/7 monitoring, guaranteed response times, and someone who treats your software like their own. Guardian is built for critical systems where downtime directly costs money.',
      href: '/services/plans',
    };
  }

  if (
    risk === 'medium' ||
    (stage === 'live' && team !== 'team') ||
    (stage === 'broken' && team === 'part')
  ) {
    return {
      plan: 'Shield',
      accent: '#4DBFA8',
      price: '$499/month',
      why: "Shield covers the essentials without enterprise pricing. Monitoring, security patches, bug fixes, and a 4-hour response window. Most early-stage products start here — it's the right fit when you're actively growing.",
      href: '/services/plans',
    };
  }

  return {
    plan: 'Watchpost',
    accent: '#72C4B2',
    price: '$199/month',
    why: "You're in good shape but want peace of mind. Watchpost monitors uptime, applies security patches, and gives you a monthly health report. Enough coverage to sleep at night without over-engineering your support.",
    href: '/services/plans',
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PlanRecommender() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const currentQ = QUESTIONS[step];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const recommendation = done ? getRecommendation(answers) : null;

  return (
    <div style={{
      maxWidth: 680,
      marginInline: 'auto',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      {/* Progress bar */}
      {!done && (
        <div style={{ height: 3, background: 'var(--bg-3)' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / QUESTIONS.length) * 100}%`,
            background: 'var(--division-accent)',
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      )}

      <div style={{ padding: '36px 40px' }}>
        {!done ? (
          <>
            {/* Step counter */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500,
              color: 'var(--division-accent)', textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: 16,
            }}>
              Question {step + 1} of {QUESTIONS.length}
            </div>

            {/* Question */}
            <h3 style={{
              fontFamily: 'var(--font-headline)', fontSize: '1.2rem', fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.3,
              marginBottom: 28,
            }}>
              {currentQ.text}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentQ.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--division-accent)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--division-accent)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                  }}
                >
                  {opt.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          </>
        ) : recommendation && (
          <>
            {/* Result */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 500,
              color: recommendation.accent, textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: 8,
            }}>
              Recommended plan
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
              <h3 style={{
                fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 700,
                color: recommendation.accent, letterSpacing: '-0.025em', lineHeight: 1,
              }}>
                {recommendation.plan}
              </h3>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '1rem',
                color: 'var(--text-secondary)',
              }}>
                {recommendation.price}
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7,
              color: 'var(--text-secondary)', marginBottom: 32,
            }}>
              {recommendation.why}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button href={recommendation.href} variant="primary" size="md">
                See {recommendation.plan} plan details
              </Button>
              <button
                onClick={reset}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                  color: 'var(--text-muted)', textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Start over
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
