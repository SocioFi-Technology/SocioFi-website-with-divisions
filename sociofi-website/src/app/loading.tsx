export default function RootLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav skeleton */}
      <div style={{
        height: 72,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 16,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out infinite' }} />
        <div style={{ width: 140, height: 16, borderRadius: 6, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out infinite' }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 80, height: 32, borderRadius: 100, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out infinite' }} />
      </div>

      {/* Hero skeleton */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        gap: 20,
      }}>
        <div style={{ width: 120, height: 14, borderRadius: 6, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out infinite' }} />
        <div style={{ width: 'min(640px, 90vw)', height: 52, borderRadius: 10, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out 0.1s infinite' }} />
        <div style={{ width: 'min(480px, 80vw)', height: 52, borderRadius: 10, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out 0.15s infinite' }} />
        <div style={{ width: 'min(420px, 75vw)', height: 20, borderRadius: 6, background: 'var(--bg-3)', marginTop: 8, animation: 'skeleton-pulse 1.6s ease-in-out 0.2s infinite' }} />
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <div style={{ width: 140, height: 44, borderRadius: 100, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out 0.25s infinite' }} />
          <div style={{ width: 120, height: 44, borderRadius: 100, background: 'var(--bg-3)', animation: 'skeleton-pulse 1.6s ease-in-out 0.3s infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
