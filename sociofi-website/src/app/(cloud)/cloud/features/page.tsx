import type { Metadata } from 'next';
import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Shield, Globe, Database } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Features — SocioFi Cloud',
  description:
    'Everything included in every SocioFi Cloud plan. No add-ons for the basics.',
};

const content: DeepDiveContent = {
  hero: {
    badge: 'Cloud · Features',
    headline: (
      <>
        Everything your app needs
        <br />
        <span className="gradient-text">to run in production.</span>
      </>
    ),
    description:
      'Every Cloud plan includes the full stack of production infrastructure — not a subset. No add-ons for SSL. No extra charges for backups. No premium tier for monitoring.',
    buttons: [
      { label: 'See plans', href: '/cloud/plans', variant: 'primary' },
      { label: 'Get started', href: '/cloud/get-hosted', variant: 'ghost' },
    ],
  },

  useCasesLabel: "What's included",
  useCasesTitle: 'The full production stack.',

  useCases: [
    {
      icon: <Shield size={28} color="var(--division-accent)" />,
      title: 'Infrastructure security',
      description:
        'Firewall, SSL/TLS, intrusion detection, vulnerability scanning, and security patching — all configured and maintained.',
    },
    {
      icon: <Globe size={28} color="var(--division-accent)" />,
      title: 'Observability',
      description:
        'Uptime monitoring, performance metrics, error rate dashboards, latency tracking, and alert routing — all active.',
    },
    {
      icon: <Database size={28} color="var(--division-accent)" />,
      title: 'Data protection',
      description:
        'Daily encrypted backups, point-in-time recovery, configurable retention, and tested restore procedures.',
    },
  ],

  deliverable: {
    label: 'In every plan',
    headline: 'No tier-gating on production essentials.',
    description:
      "We don't charge more for the things your app needs to stay alive. These come standard on every plan.",
    items: [
      {
        label: 'SSL/TLS certificates',
        detail: 'Auto-renewed, zero downtime rotation',
      },
      {
        label: 'Managed reverse proxy',
        detail: 'Nginx or Caddy, configured for your stack',
      },
      {
        label: 'Daily encrypted backups',
        detail: '7-day retention on Starter, 30-day on Professional+',
      },
      {
        label: 'Uptime monitoring',
        detail: '1-minute check intervals, instant alerts',
      },
      {
        label: 'Performance dashboards',
        detail: 'CPU, memory, latency, error rates',
      },
      {
        label: 'Security patching',
        detail: 'OS and runtime patches applied within 24h of release',
      },
      {
        label: 'CDN configuration',
        detail: 'Static assets served from edge, globally',
      },
      {
        label: 'Zero-downtime deployments',
        detail: 'Blue/green or rolling deploy strategy',
      },
    ],
  },

  timeline: {
    duration: '24-hour setup',
    price: 'From $99/mo',
    note: 'Setup is included in the first month. No infrastructure configuration fees.',
  },

  faqs: [
    {
      question: 'Do I need to configure anything myself?',
      answer:
        'No. We handle the full setup — server provisioning, SSL, reverse proxy, CDN, monitoring agents, backup jobs, and deploy pipelines. You provide your codebase and we do everything else.',
    },
    {
      question: 'What happens when my app needs more resources?',
      answer:
        'We handle scaling — either vertically (larger server) or horizontally (load balancer + multiple instances). You tell us about expected traffic changes and we configure in advance. Emergency scaling is handled by our team, not by you.',
    },
    {
      question: 'Can I add services later (database, Redis, S3)?',
      answer:
        "Yes. Managed databases, Redis instances, and object storage can be added to any plan. These are scoped and priced when you need them — you don't pay for infrastructure you're not using.",
    },
  ],

  cta: {
    title: 'Every feature. Every plan.',
    subtitle:
      'Get hosted with full production infrastructure included from day one.',
    primaryCTA: { label: 'See plans', href: '/cloud/plans' },
    ghostCTA: { label: 'Get hosted', href: '/cloud/get-hosted' },
    note: 'Setup in 24 hours. No DevOps required.',
  },
};

export default function FeaturesPage() {
  return <DeepDive content={content} />;
}
