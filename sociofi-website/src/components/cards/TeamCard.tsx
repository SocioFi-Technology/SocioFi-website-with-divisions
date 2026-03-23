interface TeamCardProps {
  name: string;
  role: string;
  bio?: string;
}

/** Returns two-letter initials from a name */
function initials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TeamCard({ name, role, bio }: TeamCardProps) {
  const isOpenRole = name.toLowerCase().includes('maybe') || name.toLowerCase().includes('you,');

  return (
    <div
      className="card"
      style={{
        padding: '28px 24px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: isOpenRole
            ? 'linear-gradient(135deg,rgba(89,163,146,0.15),rgba(89,163,146,0.3))'
            : 'linear-gradient(135deg,rgba(58,88,158,0.25),rgba(89,163,146,0.25))',
          border: `1.5px solid ${isOpenRole ? 'rgba(89,163,146,0.35)' : 'rgba(58,88,158,0.4)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: isOpenRole ? 'var(--teal-light)' : 'var(--navy-bright)',
            letterSpacing: '-0.02em',
          }}
        >
          {isOpenRole ? '?' : initials(name)}
        </span>
      </div>

      {/* Name & role */}
      <div style={{ minWidth: 0 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.25,
            wordBreak: 'break-word',
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            fontWeight: 500,
            color: 'var(--division-accent, var(--teal))',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '6px 0 0',
            lineHeight: 1.4,
          }}
        >
          {role}
        </p>
      </div>

      {/* Bio */}
      {bio && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: 0,
            wordBreak: 'break-word',
          }}
        >
          {bio}
        </p>
      )}
    </div>
  );
}
