'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number; // ms, default 4000
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
  dismiss: (id: string) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

// ── Individual toast item ──────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, { border: string; icon: string; bg: string }> = {
  success: {
    bg: 'rgba(89,163,146,0.10)',
    border: 'rgba(89,163,146,0.30)',
    icon: '#59A392',
  },
  error: {
    bg: 'rgba(232,145,111,0.10)',
    border: 'rgba(232,145,111,0.30)',
    icon: '#E8916F',
  },
  info: {
    bg: 'rgba(74,108,184,0.10)',
    border: 'rgba(74,108,184,0.30)',
    icon: '#4A6CB8',
  },
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const color = VARIANT_STYLES[variant].icon;
  if (variant === 'success') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { bg, border } = VARIANT_STYLES[toast.variant];
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    // Trigger enter animation
    const frame = requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);
    return () => {
      cancelAnimationFrame(frame);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 16px',
        background: `color-mix(in srgb, var(--bg-card) 95%, transparent)`,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${border}`,
        borderLeft: `3px solid ${border}`,
        borderRadius: 'var(--radius-sm)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
        maxWidth: 360,
        width: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        backgroundColor: bg,
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        <ToastIcon variant={toast.variant} />
      </div>
      <p style={{
        flex: 1,
        margin: 0,
        fontFamily: 'var(--font-body)',
        fontSize: '0.88rem',
        lineHeight: 1.55,
        color: 'var(--text-primary)',
      }}>
        {toast.message}
      </p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 4,
          marginTop: -1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts(prev => [...prev.slice(-4), { id, message, variant, duration }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Portal — fixed bottom-right */}
      <div
        aria-label="Notifications"
        style={{
          position: 'fixed',
          bottom: 88, // above the PILOT chat button (56px + gap)
          right: 24,
          zIndex: 9000,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-end',
          pointerEvents: toasts.length === 0 ? 'none' : 'auto',
        }}
      >
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
