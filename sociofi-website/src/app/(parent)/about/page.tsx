import StoryPage, { type StoryPageContent } from '@/templates/StoryPage';
import Logo, { LogoMark } from '@/components/shared/Logo';
import type { DivisionSlug } from '@/lib/divisions';
import { Brain, Shield, Target, Heart, Code } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — SocioFi Technology',
  description:
    'Two BUET graduates, one gap in the market. SocioFi Technology bridges the distance between AI-generated prototypes and production-ready software.',
};

// ── Divisions visual map (used as narrative visual) ───────────────────────────

const DIVISIONS: { name: string; slug: DivisionSlug; accent: string; verb: string; url: string }[] = [
  { name: 'Studio',   slug: 'studio',   accent: '#72C4B2', verb: 'Builds',     url: '/studio' },
  { name: 'Services', slug: 'services', accent: '#4DBFA8', verb: 'Maintains',  url: '/services' },
  { name: 'Labs',     slug: 'labs',     accent: '#7B6FE8', verb: 'Researches', url: '/labs' },
  { name: 'Products', slug: 'products', accent: '#E8916F', verb: 'Monetises',  url: '/products' },
  { name: 'Academy',  slug: 'academy',  accent: '#E8B84D', verb: 'Teaches',    url: '/academy' },
  { name: 'Ventures', slug: 'ventures', accent: '#6BA3E8', verb: 'Co-builds',  url: '/ventures' },
  { name: 'Cloud',    slug: 'cloud',    accent: '#5BB5E0', verb: 'Hosts',      url: '/cloud' },
  { name: 'Agents',   slug: 'agents',   accent: '#8B5CF6', verb: 'Automates',  url: '/aaas' },
];

function DivisionsMap() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '32px 24px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.66rem',
        fontWeight: 500,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: 20,
        textAlign: 'center',
      }}>
        Eight divisions. One company.
      </p>

      {/* Central hub */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Logo division="technology" size="sm" showWordmark href="/" />
      </div>

      {/* Division grid — 4 cols × 2 rows = 8 cells, no filler needed */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}>
        {DIVISIONS.map((div) => (
          <a
            key={div.slug}
            href={div.url}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 4px',
              background: `${div.accent}0E`,
              border: `1px solid ${div.accent}25`,
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            <LogoMark division={div.slug} size="sm" />
            <span style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '0.62rem', fontWeight: 600,
              color: 'var(--text-primary)', textAlign: 'center',
            }}>
              {div.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem', color: div.accent,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {div.verb}
            </span>
          </a>
        ))}
      </div>

      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.76rem',
        color: 'var(--text-muted)', textAlign: 'center',
        marginTop: 16, marginBottom: 0,
      }}>
        Each division is a specialist team — not generalists stretched thin
      </p>
    </div>
  );
}

// ── Page content ──────────────────────────────────────────────────────────────

const content: StoryPageContent = {
  hero: {
    badge: 'Our story',
    headline: 'Why We Started This and What We Believe',
    description:
      "Two BUET engineers. One gap nobody was filling. A conviction that the distance between an AI-generated prototype and a production-ready product shouldn't be this hard to cross.",
    buttons: [
      { label: 'Work with us', href: '/studio/start-project', variant: 'primary' },
      { label: 'Meet the founders', href: '#team', variant: 'ghost' },
    ],
  },

  narrative: [
    {
      label: 'Origin — Dhaka, Bangladesh, 2022',
      headline: 'Two engineers who saw the same gap everywhere they looked',
      body: (
        <>
          <p style={{ margin: '0 0 20px' }}>
            Arifur Rahman and Kamrul Hasan met at BUET — Bangladesh University of Engineering and Technology — and spent years building real software for companies across three continents. They understood production systems deeply: how databases fail under load, how deployments silently corrupt data, how security vulnerabilities hide in plain sight for months.
          </p>
          <p style={{ margin: '0 0 20px' }}>
            Then AI coding tools arrived. And they watched something remarkable happen: non-technical founders started building things that genuinely worked. A solo founder could prototype a product in a weekend. A small business owner could describe an internal tool and have something running by Monday.
          </p>
          <p style={{ margin: 0 }}>
            But then those same people hit a wall. The prototype worked locally. Production was another story. Who handles deployment? Who debugs the race condition at 2am? Who keeps it from getting compromised? Who maintains it six months later when the generated code starts breaking in ways nobody predicted? That gap — between &ldquo;it works on my machine&rdquo; and &ldquo;production-ready product&rdquo; — is exactly where SocioFi Technology was born.
          </p>
        </>
      ),
      stat: { value: '2022', label: 'Founded in Dhaka, Bangladesh' },
    },
    {
      label: 'Our structure',
      headline: 'Eight specialist divisions. One company.',
      body: (
        <>
          <p style={{ margin: '0 0 20px' }}>
            We built SocioFi Technology with eight divisions because the problems our customers face don&apos;t fit in one box. Studio builds. Services maintains. Labs researches. Products ships. Academy teaches. Ventures co-builds. Cloud hosts. Agents automates.
          </p>
          <p style={{ margin: '0 0 20px' }}>
            Each division is staffed with engineers who do that one thing every day — not generalists stretched across everything. You always deal with a specialist, never someone learning on your project.
          </p>
          <p style={{ margin: 0 }}>
            We work with clients globally from our base in Dhaka. Our timezone means we&apos;re awake when your European launch goes live, and still online when your American users find the bug.
          </p>
        </>
      ),
      visual: <DivisionsMap />,
      visualSide: 'right',
      stat: { value: '8', label: 'Specialist divisions' },
    },
    {
      label: 'How we work',
      headline: 'AI builds. Humans architect. You scale.',
      body: (
        <>
          <p style={{ margin: '0 0 20px' }}>
            We built a workflow where AI coding agents handle the bulk of implementation — writing code, running tests, generating boilerplate — while our senior engineers do what humans are actually better at: architecture decisions, security audits, debugging production failures, and understanding your business well enough to make the right tradeoffs.
          </p>
          <p style={{ margin: 0 }}>
            The result is a team that moves at AI speed with human judgment. A real product in weeks, not months. At a price that works for a founder or small team, not just a company with a million-dollar engineering budget.
          </p>
        </>
      ),
      stat: { value: '5×', label: 'Faster than traditional development' },
    },
  ],

  valuesLabel: 'What we believe',
  valuesTitle: 'Five things we actually stand behind',
  values: [
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'We say what things cost',
      description:
        'No discovery calls that end in a surprise quote. No scope that quietly expands. Fixed price, clear scope, real timeline — before we write a single line.',
    },
    {
      icon: <Brain size={22} aria-hidden="true" />,
      title: 'We explain in plain English',
      description:
        "If you can't understand our update, we wrote it wrong. We talk to you like the smart, non-technical person you are. No jargon, no mystery.",
    },
    {
      icon: <Shield size={22} aria-hidden="true" />,
      title: 'We build things that work',
      description:
        "Not demos. Not prototypes dressed up as products. Working software — production-hardened, security-reviewed, load-tested, and monitored.",
    },
    {
      icon: <Target size={22} aria-hidden="true" />,
      title: 'Your code is yours',
      description:
        "Full source code, full IP transfer, full repo access. No lock-in, no licence fees, no hostage code. We hand it over and you own it completely.",
    },
    {
      icon: <Heart size={22} aria-hidden="true" />,
      title: "We tell you when AI isn't the answer",
      description:
        "AI is a powerful tool. Sometimes the right one; sometimes it isn't. We'll tell you honestly — even if that means recommending the simpler, cheaper path.",
    },
  ],

  teamLabel: 'The founders',
  teamTitle: 'Built by engineers who have been on your side of the table',
  teamSubtitle:
    "Two BUET graduates who've seen hundreds of projects stuck in the gap — and built a company to fix it. Based in Dhaka, Bangladesh. Working globally.",
  team: [
    {
      name: 'Arifur Rahman',
      role: 'Chief Executive Officer',
      bio: 'BUET graduate with a decade building software across three continents. Runs SocioFi with an obsession for clear pricing, plain communication, and products that actually ship.',
    },
    {
      name: 'Kamrul Hasan',
      role: 'Chief Technology Officer',
      bio: 'BUET graduate and systems architect. Designed the AI-human development workflow that powers every division. Believes production-ready is the only standard worth holding.',
    },
    {
      name: "We're growing",
      role: 'Open roles across all divisions',
      bio: "If you're a senior engineer who believes in moving fast without cutting corners — we'd like to talk. View our open positions.",
    },
  ],

  cta: {
    title: "Let's build something real together",
    subtitle:
      "Tell us what you're working on. We'll tell you exactly how we'd approach it, what it would cost, and when it would be done.",
    primaryCTA: { label: 'Start a project', href: '/studio/start-project' },
    ghostCTA: { label: 'See open roles', href: '/careers' },
    note: 'Free consultation. No pressure. Based in Dhaka — working globally.',
  },
};

export default function AboutPage() {
  return <StoryPage content={content} />;
}
