import StoryPage, { type StoryPageContent } from '@/templates/StoryPage';
import { Brain, Shield, Target, Rocket, Heart, Code } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers — SocioFi Technology',
  description:
    "We're small and growing. Every hire changes the culture and the work. If you want to build AI-native software with people who care about quality — let's talk.",
};

// ── Open roles visual ─────────────────────────────────────────────────────────

interface Role {
  title: string;
  division: string;
  accent: string;
  type: string;
  location: string;
}

const ROLES: Role[] = [
  {
    title: 'Senior Full-Stack Engineer',
    division: 'Studio',
    accent: '#72C4B2',
    type: 'Full-time',
    location: 'Remote (BD timezone preferred)',
  },
  {
    title: 'DevOps & Infrastructure Engineer',
    division: 'Cloud',
    accent: '#5BB5E0',
    type: 'Full-time',
    location: 'Remote',
  },
  {
    title: 'AI Integration Engineer',
    division: 'Labs',
    accent: '#7B6FE8',
    type: 'Full-time / Contract',
    location: 'Remote',
  },
  {
    title: 'Technical Content Writer',
    division: 'Academy',
    accent: '#E8B84D',
    type: 'Part-time / Contract',
    location: 'Remote',
  },
];

function OpenRoles() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.66rem',
        color: 'var(--text-muted)', textTransform: 'uppercase',
        letterSpacing: '0.12em', marginBottom: 4,
      }}>
        Current openings
      </p>
      {ROLES.map((role) => (
        <a
          key={role.title}
          href="/contact"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, padding: '16px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            borderLeft: `3px solid ${role.accent}`,
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '0.95rem', fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.01em',
              marginBottom: 4,
            }}>
              {role.title}
            </div>
            <div style={{
              display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.66rem',
                color: role.accent, textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {role.division}
              </span>
              <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                color: 'var(--text-secondary)',
              }}>
                {role.type}
              </span>
              <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}>
                {role.location}
              </span>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" width={16} height={16}
            stroke="var(--text-muted)" strokeWidth={1.8} strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      ))}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.82rem',
        color: 'var(--text-muted)', marginTop: 4,
      }}>
        Don&apos;t see your role? Send us a message anyway — we hire for people, not just positions.
      </p>
    </div>
  );
}

// ── Page content ──────────────────────────────────────────────────────────────

const content: StoryPageContent = {
  hero: {
    badge: 'Careers',
    headline: "We're Small and Growing. Every Hire Matters.",
    description:
      "We don't hire to fill seats. We hire because there's real work that needs someone exceptional. If you want to build AI-native software with people who care deeply about quality — read on.",
    buttons: [
      { label: 'See open roles', href: '#roles', variant: 'primary' },
      { label: 'Talk to us', href: '/contact', variant: 'ghost' },
    ],
  },

  narrative: [
    {
      label: 'How we work',
      headline: "Small team. High trust. Real autonomy.",
      body: (
        <>
          <p style={{ margin: '0 0 20px' }}>
            SocioFi Technology is a lean, remote-first team based out of Dhaka, Bangladesh. We don&apos;t have layers of management. We don&apos;t have long approval chains. Engineers here make real decisions about architecture, tooling, and how problems get solved.
          </p>
          <p style={{ margin: '0 0 20px' }}>
            The work is varied and technically interesting. One week you&apos;re architecting a data pipeline for a fintech startup. The next you&apos;re debugging why an AI-generated component breaks under concurrent load. You don&apos;t get pigeonholed.
          </p>
          <p style={{ margin: 0 }}>
            We work asynchronously across time zones but maintain a synchronous culture within the core team. Decisions are made in writing. Code is reviewed seriously. Standards are high — and we&apos;d rather move at the right pace than the fast pace.
          </p>
        </>
      ),
    },
    {
      label: 'Open roles',
      headline: "What we're looking for right now",
      body: (
        <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
          We hire senior people who are self-directed. We don&apos;t have the bandwidth to manage someone who needs managing. If you&apos;re the kind of engineer who sees a problem and fixes it without being asked — you&apos;ll thrive here.
        </p>
      ),
      visual: <OpenRoles />,
      visualSide: 'right',
    },
  ],

  valuesLabel: 'Our culture',
  valuesTitle: "What working here is actually like",
  values: [
    {
      icon: <Brain size={22} aria-hidden="true" />,
      title: 'You own your work',
      description:
        "When you take on a project, it's yours. You decide how to approach it. You're accountable for the outcome. We give you the context and the autonomy.",
    },
    {
      icon: <Shield size={22} aria-hidden="true" />,
      title: 'Quality is non-negotiable',
      description:
        "We don't ship things we're not proud of. We don't cut corners to hit an artificial deadline. We do the work right — and we give the time to do it right.",
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: "Be honest, even when it's uncomfortable",
      description:
        "If you see a problem, say so. If an estimate is wrong, say so. We can handle bad news. We can't handle surprises three weeks later.",
    },
    {
      icon: <Rocket size={22} aria-hidden="true" />,
      title: 'AI is a tool, not a shortcut',
      description:
        "We use AI coding agents heavily. We also know when not to. Every line that goes into a customer's product has been reviewed by a human who understands it.",
    },
    {
      icon: <Heart size={22} aria-hidden="true" />,
      title: 'Treat customers like partners',
      description:
        "Our customers are non-technical and trusting us completely. That's a responsibility. We answer questions, explain decisions, and never leave someone feeling confused.",
    },
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'Remote-first, Bangladesh-rooted',
      description:
        "We're based in Dhaka and proud of it. Our team is spread across time zones but grounded in a shared culture: direct, warm, technically excellent.",
    },
  ],

  teamLabel: 'The team',
  teamTitle: "Who you'd be working with",
  teamSubtitle: 'A small group of senior engineers who take the work seriously and each other genuinely.',
  team: [
    {
      name: 'Arifur Rahman',
      role: 'Chief Executive Officer',
      bio: 'BUET graduate. Sets the direction and culture. Obsessed with clear communication and products that actually ship.',
    },
    {
      name: 'Kamrul Hasan',
      role: 'Chief Technology Officer',
      bio: 'BUET graduate. Designed our AI-human development workflow. Reviews architecture and sets the technical bar.',
    },
    {
      name: "You, maybe?",
      role: 'Open roles across all divisions',
      bio: "If you're a senior engineer who moves fast, writes clearly, and cares about craft — send us a message.",
    },
  ],

  cta: {
    title: "Interested? Let's have a conversation.",
    subtitle:
      "No formal application process. Send us an email with who you are, what you've built, and why you want to work here. We reply to everything.",
    primaryCTA: { label: 'Send us a message', href: '/contact' },
    ghostCTA: { label: 'Learn about SocioFi', href: '/about' },
    note: 'hello@sociofitechnology.com — or use the contact form.',
  },
};

export default function CareersPage() {
  return <StoryPage content={content} />;
}
