'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/shared/Container';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { ChevronDown } from '@/lib/icons';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  accentColor?: string;
  /** Show section wrapper with padding, or render bare */
  standalone?: boolean;
  className?: string;
}

export default function FAQAccordion({
  items,
  accentColor,
  standalone = true,
  className = '',
}: FAQAccordionProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const accent = accentColor ?? 'var(--division-accent)';

  // Group by category
  const grouped: Record<string, (FAQItem & { key: string })[]> = {};
  items.forEach((item, i) => {
    const cat = item.category ?? '__default__';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ ...item, key: `${cat}-${i}` });
  });

  const categories = Object.keys(grouped);
  const hasCategories = categories.length > 1 || categories[0] !== '__default__';

  const itemsEl = (
    <div className={standalone ? '' : className}>
      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: hasCategories ? 'var(--space-2xl)' : 0 }}>
          {hasCategories && cat !== '__default__' && (
            <ScrollReveal>
              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: accent,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span aria-hidden="true" style={{
                  display: 'inline-block',
                  width: 20, height: 1.5,
                  background: accent, flexShrink: 0,
                }} />
                {cat}
              </h3>
            </ScrollReveal>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {grouped[cat].map((item) => {
              const isOpen = openKey === item.key;
              return (
                <ScrollReveal key={item.key}>
                  <div
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${isOpen ? accent + '40' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      transition: 'border-color 0.25s',
                    }}
                  >
                    {/* Question row */}
                    <button
                      onClick={() => setOpenKey(isOpen ? null : item.key)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: isOpen ? accent : 'var(--text-primary)',
                        lineHeight: 1.4,
                        transition: 'color 0.2s',
                        textAlign: 'left',
                      }}>
                        {item.question}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          color: isOpen ? accent : 'var(--text-muted)',
                          flexShrink: 0,
                          display: 'flex',
                        }}
                        aria-hidden="true"
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </button>

                    {/* Answer — smooth height via AnimatePresence */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '0 24px 24px' }}>
                            <div style={{
                              paddingTop: 16,
                              borderTop: '1px solid var(--border)',
                            }}>
                              <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.95rem',
                                lineHeight: 1.75,
                                color: 'var(--text-secondary)',
                                margin: 0,
                              }}>
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (!standalone) return itemsEl;

  return (
    <section className={className} style={{ paddingBlock: 'var(--space-section)' }}>
      <Container narrow>
        {itemsEl}
      </Container>
    </section>
  );
}
