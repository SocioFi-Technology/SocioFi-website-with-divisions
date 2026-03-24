'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const A = 'var(--division-accent, #E8B84D)';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const QUIZ_QUESTIONS = [
  {
    question: "What's your role?",
    options: ['Founder / CEO', 'Business Leader', 'Team Member', 'Other'],
  },
  {
    question: "What's your main goal?",
    options: ['Build a product', 'Manage AI projects', 'Deploy agents', 'Understand AI'],
  },
  {
    question: 'How much time do you have?',
    options: ['A few hours', 'A full day', 'A week', 'Ongoing'],
  },
];

const QUIZ_RESULTS: Record<string, { course: string; slug: string; price: number; path: string }> = {
  '0-0': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '0-1': { course: 'From Idea to MVP', slug: 'from-idea-to-mvp', price: 59, path: 'Founder Path' },
  '0-2': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '0-3': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '1-0': { course: 'Managing AI-Powered Development', slug: 'managing-ai-powered-development', price: 129, path: 'Leader Path' },
  '1-1': { course: 'Managing AI-Powered Development', slug: 'managing-ai-powered-development', price: 129, path: 'Leader Path' },
  '1-2': { course: 'Understanding AI Agents for Business', slug: 'understanding-ai-agents-for-business', price: 99, path: 'Leader Path' },
  '1-3': { course: 'SaaS to AaaS Transition', slug: 'saas-to-aaas-transition', price: 79, path: 'Leader Path' },
  '2-0': { course: 'Technical Literacy for Non-Technical Teams', slug: 'technical-literacy-for-teams', price: 149, path: 'Team Path' },
  '2-1': { course: 'Working with AI Agents', slug: 'working-with-ai-agents', price: 79, path: 'Team Path' },
  '2-2': { course: 'Working with AI Agents', slug: 'working-with-ai-agents', price: 79, path: 'Team Path' },
  '2-3': { course: 'Technical Literacy for Non-Technical Teams', slug: 'technical-literacy-for-teams', price: 149, path: 'Team Path' },
  '3-0': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '3-1': { course: 'How to Spec a Software Product', slug: 'how-to-spec-a-software-product', price: 79, path: 'Founder Path' },
  '3-2': { course: 'Reading Technical Documentation', slug: 'reading-technical-documentation', price: 39, path: 'Team Path' },
  '3-3': { course: 'Build vs. Buy vs. Agent', slug: 'build-vs-buy-vs-agent', price: 49, path: 'Leader Path' },
};

function getQuizResult(answers: number[]): { course: string; slug: string; price: number; path: string } {
  if (answers.length < 2) return QUIZ_RESULTS['0-0'];
  const key = `${answers[0]}-${answers[1]}`;
  return QUIZ_RESULTS[key] ?? QUIZ_RESULTS['0-0'];
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function LearningPathQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  function pickOption(idx: number) {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 300);
    } else {
      setTimeout(() => setDone(true), 300);
    }
  }

  function reset() {
    setCurrentQ(0);
    setAnswers([]);
    setDone(false);
  }

  const result = done ? getQuizResult(answers) : null;

  return (
    <div className="quiz-panel">
      <div className="quiz-progress">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} className={`quiz-step${i <= currentQ || done ? ' done' : ''}`} />
        ))}
      </div>

      {!done ? (
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
          </p>
          <h3 style={{ fontFamily: F.h, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
            {QUIZ_QUESTIONS[currentQ].question}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option${answers[currentQ] === i ? ' selected' : ''}`}
                onClick={() => pickOption(i)}
              >
                <span className="quiz-dot" />
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <p style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Your recommendation
          </p>
          <h3 style={{ fontFamily: F.h, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            {result!.course}
          </h3>
          <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            Path: {result!.path}
          </p>
          <p style={{ fontFamily: F.m, fontSize: '0.9rem', fontWeight: 700, color: A, marginBottom: 28 }}>
            ${result!.price}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/academy/courses/${result!.slug}`} className="btn-amber" style={{ fontSize: '0.84rem', padding: '11px 22px' }}>
              Enroll Now <IconArrowRight size={14} />
            </Link>
            <button onClick={reset} className="btn-ghost" style={{ fontSize: '0.84rem', padding: '11px 22px' }}>
              Retake Quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
