/**
 * Shared OG image template for all SocioFi divisions.
 * Used by each division's opengraph-image.tsx via Next.js ImageResponse.
 *
 * Output: 1200 × 630 PNG, rendered at edge runtime.
 */

export interface OgConfig {
  divisionName: string;   // e.g. "SocioFi Studio"
  tagline: string;        // e.g. "Custom Software Development"
  description: string;    // short, 80-100 chars
  accent: string;         // hex e.g. "#72C4B2"
}

/** Returns the JSX tree passed to ImageResponse */
export function ogTemplate({ divisionName, tagline, description, accent }: OgConfig) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0C0C1D',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Accent glow top-left ── */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -80,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />
      {/* ── Accent glow bottom-right ── */}
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          right: -60,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, #3A589E55 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* ── Top accent bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, #3A589E, ${accent})`,
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 72px',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 'auto',
          }}
        >
          {/* Double-chevron mark */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 9L18 18L8 27" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 9L28 18L18 27" stroke="#3A589E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            SocioFi
          </span>
          <span
            style={{
              color: accent,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginLeft: 4,
              paddingTop: 2,
            }}
          >
            TECHNOLOGY
          </span>
        </div>

        {/* Division heading area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {/* Section label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 24,
                height: 2,
                background: accent,
              }}
            />
            <span
              style={{
                color: accent,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {tagline}
            </span>
          </div>

          {/* Division name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
            }}
          >
            {divisionName}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: '#7C8DB0',
              letterSpacing: '-0.01em',
              lineHeight: 1.5,
              maxWidth: 760,
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              color: '#4A5578',
              fontSize: 16,
              letterSpacing: '0.04em',
            }}
          >
            sociofitechnology.com
          </span>
          <div
            style={{
              display: 'flex',
              gap: 8,
            }}
          >
            {[accent, '#3A589E', '#59A392'].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: c,
                  opacity: 1 - i * 0.25,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
