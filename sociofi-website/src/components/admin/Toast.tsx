'use client'
/**
 * Global toast notification system for the admin panel.
 * Usage:
 *   const { toast } = useToast()
 *   toast.success('Email sent')
 *   toast.error('Failed to save')
 *   toast.info('Saved draft')
 */
import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration: number
}

interface ToastContextValue {
  toast: {
    success: (message: string, duration?: number) => void
    error:   (message: string, duration?: number) => void
    info:    (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
  }
}

// ── Context ────────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  toast: {
    success: () => {},
    error:   () => {},
    info:    () => {},
    warning: () => {},
  },
})

export function useToast() {
  return useContext(ToastContext)
}

// ── Single Toast ───────────────────────────────────────────────────────────────

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string; dot: string }> = {
  success: { bg: '#0A1F1A', border: '#4ade8040', icon: '#4ade80', dot: '#4ade80' },
  error:   { bg: '#1F0A0A', border: '#EF444440', icon: '#EF4444', dot: '#EF4444' },
  info:    { bg: '#0A0F1F', border: '#59A39240', icon: '#59A392', dot: '#59A392' },
  warning: { bg: '#1F1800', border: '#E8B84D40', icon: '#E8B84D', dot: '#E8B84D' },
}

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const c = TOAST_COLORS[item.type]

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 10)
    // Start fade-out before removal
    const t2 = setTimeout(() => setVisible(false), item.duration - 300)
    const t3 = setTimeout(() => onDismiss(item.id), item.duration)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [item.id, item.duration, onDismiss])

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(() => onDismiss(item.id), 300) }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        maxWidth: '360px',
        minWidth: '260px',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
        pointerEvents: 'auto',
      }}
    >
      {/* Icon dot */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: `${c.dot}18`, border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.icon, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
      }}>
        {TOAST_ICONS[item.type]}
      </div>
      {/* Message */}
      <span style={{
        color: '#E2E8F0', fontSize: '0.84rem',
        fontFamily: "'Outfit', sans-serif", lineHeight: 1.4, flex: 1,
      }}>
        {item.message}
      </span>
      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: '2px', background: c.dot, borderRadius: '0 0 10px 10px',
        animation: `toast-progress ${item.duration}ms linear forwards`,
      }} />
    </div>
  )
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = `toast-${++counterRef.current}`
    setToasts(prev => [...prev.slice(-4), { id, type, message, duration }])
  }, [])

  const toast = {
    success: (m: string, d?: number) => add('success', m, d),
    error:   (m: string, d?: number) => add('error',   m, d),
    info:    (m: string, d?: number) => add('info',    m, d),
    warning: (m: string, d?: number) => add('warning', m, d),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      {children}
      {/* Toast container — bottom-right, above everything */}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '10px',
        alignItems: 'flex-end', pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
