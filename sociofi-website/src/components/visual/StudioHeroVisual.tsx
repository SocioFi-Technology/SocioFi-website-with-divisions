'use client';
import { useEffect, useState, useRef } from 'react';

const CODE_LINES = [
  [{ t: 'const ', c: '#79B8FF' }, { t: 'agent', c: '#E1E4E8' }, { t: ' = new ', c: '#79B8FF' }, { t: 'AgentConfig', c: '#B392F0' }, { t: '({', c: '#E1E4E8' }],
  [{ t: '  model', c: '#9ECBFF' }, { t: ': ', c: '#E1E4E8' }, { t: '"advanced-ai-model"', c: '#9ECBFF' }, { t: ',', c: '#E1E4E8' }],
  [{ t: '  tools', c: '#9ECBFF' }, { t: ': [', c: '#E1E4E8' }, { t: 'searchWeb', c: '#B392F0' }, { t: ', ', c: '#E1E4E8' }, { t: 'editCode', c: '#B392F0' }, { t: '],', c: '#E1E4E8' }],
  [{ t: '  memory', c: '#9ECBFF' }, { t: ': ', c: '#E1E4E8' }, { t: 'true', c: '#79B8FF' }, { t: ',', c: '#E1E4E8' }],
  [{ t: '  maxSteps', c: '#9ECBFF' }, { t: ': ', c: '#E1E4E8' }, { t: '25', c: '#F8C555' }, { t: ',', c: '#E1E4E8' }],
  [{ t: '});', c: '#E1E4E8' }],
  [],
  [{ t: 'const ', c: '#79B8FF' }, { t: 'result', c: '#E1E4E8' }, { t: ' = await ', c: '#79B8FF' }, { t: 'agent', c: '#E1E4E8' }, { t: '.', c: '#E1E4E8' }, { t: 'run', c: '#B392F0' }, { t: '(prompt);', c: '#E1E4E8' }],
  [],
  [{ t: '// Reviewed. Deployed. Yours.', c: '#6A737D' }],
] as const;

const TERMINAL_LINES = [
  { text: '$ npm run build', color: '#72C4B2' },
  { text: '▸ Type checking...', color: '#7C8DB0' },
  { text: '▸ Tests: 47/47 passed ✓', color: '#72C4B2' },
  { text: '▸ Deploying to production...', color: '#7C8DB0' },
  { text: '✓ Live → app.yourdomain.com', color: '#72C4B2' },
];

type CodeToken = { t: string; c: string };
type CodeLine = readonly CodeToken[];

export default function StudioHeroVisual() {
  const [visibleCode, setVisibleCode] = useState(0);
  const [visibleTerminal, setVisibleTerminal] = useState(0);
  const [cursor, setCursor] = useState(true);
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReduced(true);
      setVisibleCode(CODE_LINES.length);
      setVisibleTerminal(TERMINAL_LINES.length);
      return;
    }

    const cursorTimer = setInterval(() => setCursor(v => !v), 530);

    let ci = 0;
    let ti = 0;

    function nextCode() {
      if (ci < CODE_LINES.length) {
        ci++;
        setVisibleCode(ci);
        timerRef.current = setTimeout(nextCode, 750);
      } else {
        timerRef.current = setTimeout(nextTerminal, 400);
      }
    }

    function nextTerminal() {
      if (ti < TERMINAL_LINES.length) {
        ti++;
        setVisibleTerminal(ti);
        timerRef.current = setTimeout(nextTerminal, 650);
      } else {
        timerRef.current = setTimeout(() => {
          ci = 0; ti = 0;
          setVisibleCode(0);
          setVisibleTerminal(0);
          timerRef.current = setTimeout(nextCode, 600);
        }, 3200);
      }
    }

    timerRef.current = setTimeout(nextCode, 500);
    return () => {
      clearInterval(cursorTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showCode = reduced ? CODE_LINES.length : visibleCode;
  const showTerm = reduced ? TERMINAL_LINES.length : visibleTerminal;

  return (
    <div
      role="img"
      aria-label="Animated code editor showing AI agent configuration"
      style={{
        background: 'rgba(13,13,30,0.96)',
        border: '1px solid rgba(114,196,178,0.18)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontSize: '0.8rem',
        lineHeight: 1.8,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(114,196,178,0.06)',
        userSelect: 'none',
      }}
    >
      {/* Editor title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(114,196,178,0.08)',
        flexShrink: 0,
      }}>
        {['#FF5F57','#FEBC2E','#28C840'].map(c => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />
        ))}
        <span style={{ marginLeft: 10, color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
          agent-config.ts
        </span>
        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem' }}>TypeScript</span>
      </div>

      {/* Code area */}
      <div style={{ flex: 1, padding: '14px 20px 10px', overflowY: 'auto', minHeight: 200, maxHeight: 240 }}>
        {(CODE_LINES as readonly CodeLine[]).slice(0, showCode).map((line, li) => (
          <div key={li} style={{ whiteSpace: 'pre', minHeight: '1.4em', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.68rem', width: 24, flexShrink: 0, textAlign: 'right', marginRight: 12, userSelect: 'none' }}>
              {li + 1}
            </span>
            {line.length === 0 ? (
              <span>&nbsp;</span>
            ) : (
              (line as readonly CodeToken[]).map((tok, ti_) => (
                <span key={ti_} style={{ color: tok.c }}>{tok.t}</span>
              ))
            )}
            {li === showCode - 1 && showCode < CODE_LINES.length && (
              <span aria-hidden="true" style={{
                display: 'inline-block', width: 2, height: '1em',
                background: '#72C4B2', verticalAlign: 'text-bottom',
                opacity: reduced ? 1 : cursor ? 1 : 0,
                transition: 'opacity 0.08s', marginLeft: 1, flexShrink: 0,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Terminal strip */}
      <div style={{
        background: 'rgba(0,0,0,0.55)',
        borderTop: '1px solid rgba(114,196,178,0.08)',
        padding: '10px 20px 14px',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: '0.62rem', color: 'rgba(114,196,178,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>
          Terminal
        </div>
        {TERMINAL_LINES.slice(0, showTerm).map((line, i) => (
          <div key={i} style={{ color: line.color, fontSize: '0.75rem', lineHeight: 1.65 }}>{line.text}</div>
        ))}
        {showTerm < TERMINAL_LINES.length && showCode >= CODE_LINES.length && (
          <span aria-hidden="true" style={{
            display: 'inline-block', width: 2, height: '0.85em',
            background: '#72C4B2', verticalAlign: 'text-bottom',
            opacity: cursor ? 1 : 0, transition: 'opacity 0.08s',
          }} />
        )}
      </div>
    </div>
  );
}
