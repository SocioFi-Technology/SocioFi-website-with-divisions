'use client'
/**
 * Reusable confirmation dialog for destructive actions.
 * Usage:
 *   <ConfirmDialog
 *     open={open}
 *     title="Delete submission?"
 *     description="This cannot be undone."
 *     confirmLabel="Delete"
 *     variant="danger"
 *     onConfirm={() => { ... }}
 *     onCancel={() => setOpen(false)}
 *   />
 */
import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const VARIANT_COLORS = {
  danger:  { btn: '#EF4444', hover: '#DC2626', glow: 'rgba(239,68,68,0.25)' },
  warning: { btn: '#E8B84D', hover: '#D4A43A', glow: 'rgba(232,184,77,0.25)' },
  default: { btn: '#59A392', hover: '#4A8A7E', glow: 'rgba(89,163,146,0.25)' },
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'danger', loading = false,
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)
  const c = VARIANT_COLORS[variant]

  // Focus confirm button and handle Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter' && !loading) onConfirm()
    }
    document.addEventListener('keydown', handler)
    setTimeout(() => confirmRef.current?.focus(), 50)
    return () => document.removeEventListener('keydown', handler)
  }, [open, loading, onCancel, onConfirm])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 8000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }}
      />
      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        style={{
          position: 'fixed', top: '50%', left: '50%', zIndex: 8001,
          transform: 'translate(-50%, -50%)',
          background: '#0F1320',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '28px 32px',
          width: '420px',
          maxWidth: 'calc(100vw - 32px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: `${c.btn}18`, border: `1px solid ${c.btn}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
        }}>
          {variant === 'danger' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.btn} strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          ) : variant === 'warning' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.btn} strokeWidth="2" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.btn} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
        </div>

        {/* Title */}
        <h3 id="confirm-title" style={{
          color: '#E2E8F0', fontSize: '1rem', fontWeight: 700,
          fontFamily: "'Syne', sans-serif", margin: '0 0 8px',
        }}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p style={{
            color: '#64748B', fontSize: '0.84rem',
            fontFamily: "'Outfit', sans-serif", lineHeight: 1.6, margin: '0 0 24px',
          }}>
            {description}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '9px 18px', borderRadius: '8px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94A3B8', fontSize: '0.84rem', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '9px 18px', borderRadius: '8px',
              background: c.btn, border: 'none',
              color: 'white', fontSize: '0.84rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: `0 4px 16px ${c.glow}`,
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {loading && (
              <div style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }} />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}
