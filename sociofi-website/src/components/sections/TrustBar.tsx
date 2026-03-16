import Container from '@/components/shared/Container';
import { Check } from '@/lib/icons';

interface TrustBarProps {
  items: string[];
  className?: string;
  accentColor?: string;
}

export default function TrustBar({
  items,
  className = '',
  accentColor,
}: TrustBarProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  return (
    <div
      className={className}
      style={{
        paddingBlock: 20,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 32px',
          }}
        >
          {items.map((item) => (
            <div
              key={item}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', color: accent, flexShrink: 0 }}
                aria-hidden="true"
              >
                <Check size={14} />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
