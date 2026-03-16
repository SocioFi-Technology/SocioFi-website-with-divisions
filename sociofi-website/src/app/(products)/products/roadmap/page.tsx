import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';
import AnimatedGrid from '@/components/visual/AnimatedGrid';

export const metadata: Metadata = {
  title: 'Product Roadmap — SocioFi Products',
  description:
    'SocioFi Products roadmap: FabricxAI expansion, NEXUS ARIA enterprise launch, and DevBridge OS private beta — through 2026 and beyond.',
};

// ── Types ─────────────────────────────────────────────────────────────────────

type ItemStatus = 'live' | 'progress' | 'planned';

interface RoadmapItem {
  label: string;
  status: ItemStatus;
  eta?: string;
}

interface ProductRoadmap {
  name: string;
  statusLabel: string;
  items: RoadmapItem[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ItemStatus, { color: string; label: string }> = {
  live: { color: '#4ade80', label: 'Live' },
  progress: { color: '#E8916F', label: 'In Progress' },
  planned: { color: 'var(--text-muted)', label: 'Planned' },
};

const roadmaps: ProductRoadmap[] = [
  {
    name: 'FabricxAI',
    statusLabel: 'Live — active customers',
    items: [
      { label: 'Demand Intelligence module', status: 'live' },
      { label: 'Production Scheduling module', status: 'live' },
      { label: 'Quality Control module', status: 'live' },
      { label: 'Supplier Management module', status: 'progress', eta: 'Q2 2026' },
      { label: 'Delivery Tracking module', status: 'progress', eta: 'Q2 2026' },
      { label: 'Multi-facility support', status: 'planned', eta: 'Q3 2026' },
      { label: 'API access & webhooks', status: 'planned', eta: 'Q3 2026' },
      { label: 'Mobile operations app', status: 'planned', eta: 'Q4 2026' },
    ],
  },
  {
    name: 'NEXUS ARIA',
    statusLabel: 'Early access — limited pilots',
    items: [
      { label: 'Query Translator + Schema Navigator', status: 'live' },
      { label: 'Cross-System Synthesiser', status: 'live' },
      { label: 'Anomaly Detector', status: 'progress', eta: 'Q2 2026' },
      { label: 'Report Automator', status: 'progress', eta: 'Q2 2026' },
      { label: 'Trend Analyser', status: 'planned', eta: 'Q3 2026' },
      { label: 'Enterprise SSO + RBAC', status: 'planned', eta: 'Q3 2026' },
      { label: 'Slack / Teams integration', status: 'planned', eta: 'Q4 2026' },
      { label: 'Self-hosted deployment option', status: 'planned', eta: '2027' },
    ],
  },
  {
    name: 'DevBridge OS',
    statusLabel: 'Internal — beta opening Q3 2026',
    items: [
      { label: 'AI Code Review', status: 'live' },
      { label: 'Quality Gates', status: 'live' },
      { label: 'Deployment Automation', status: 'live' },
      { label: 'Engineering Metrics dashboard', status: 'progress' },
      { label: 'Multi-team support', status: 'progress' },
      { label: 'Private beta launch', status: 'planned', eta: 'Q3 2026' },
      { label: 'External installer + docs', status: 'planned', eta: 'Q3 2026' },
      { label: 'General availability', status: 'planned', eta: '2027' },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: ItemStatus }) {
  const { color } = STATUS_CONFIG[status];
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        marginTop: 6,
      }}
    />
  );
}

function RoadmapItemRow({ item }: { item: RoadmapItem }) {
  const { color, label } = STATUS_CONFIG[item.status];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        paddingBlock: 10,
        borderBottom: '1px solid var(--border)',
      }}
    >
      <StatusDot status={item.status} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: item.status === 'planned' ? 'var(--text-muted)' : 'var(--text-primary)',
            lineHeight: 1.5,
          }}
        >
          {item.label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {item.eta && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
            }}
          >
            {item.eta}
          </span>
        )}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.64rem',
            fontWeight: 500,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function ProductColumn({ product }: { product: ProductRoadmap }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--division-accent, #E8916F) 4%, transparent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--division-accent, #E8916F)',
              flexShrink: 0,
            }}
          />
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.05rem',
              fontWeight: 400,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {product.name}
          </h3>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {product.statusLabel}
        </p>
      </div>

      {/* Items */}
      <div style={{ padding: '8px 28px 20px' }}>
        {product.items.map((item, i) => (
          <RoadmapItemRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
          overflow: 'hidden',
        }}
      >
        <AnimatedGrid />

        <Container>
          <ScrollReveal>
            <div style={{ maxWidth: 680 }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: 'var(--division-accent, #E8916F)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: 20,
                    height: 1.5,
                    background: 'var(--division-accent, #E8916F)',
                  }}
                />
                Products · Roadmap
              </p>

              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 400,
                  lineHeight: 1.12,
                  letterSpacing: '-0.025em',
                  color: 'var(--text-primary)',
                  marginBottom: 20,
                }}
              >
                Where we&apos;re building next
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  maxWidth: '56ch',
                }}
              >
                Three products. Active development. Here&apos;s what&apos;s shipping, what&apos;s
                coming, and what&apos;s planned.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Roadmap grid ──────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Roadmap"
              title="Three products. One direction."
              subtitle="Each product is in active development. Status updates reflect the current build cycle."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {roadmaps.map((product) => (
              <StaggerItem key={product.name}>
                <ProductColumn product={product} />
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Status legend */}
          <ScrollReveal>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 24,
                justifyContent: 'center',
                marginTop: 48,
                paddingTop: 32,
                borderTop: '1px solid var(--border)',
              }}
            >
              {(Object.entries(STATUS_CONFIG) as [ItemStatus, typeof STATUS_CONFIG[ItemStatus]][]).map(
                ([, cfg]) => (
                  <div
                    key={cfg.label}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: cfg.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                )
              )}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <CTASection
        title="Want to influence what we build?"
        subtitle="Early access and beta teams directly shape the roadmap. Register your interest and get a seat at the table."
        primaryCTA={{ label: 'NEXUS ARIA early access', href: '/products/nexus-aria/early-access' }}
        ghostCTA={{ label: 'DevBridge beta interest', href: '/products/devbridge/interest' }}
      />
    </>
  );
}
