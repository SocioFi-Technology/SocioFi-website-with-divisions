import type { Metadata } from 'next';
import DivisionOverview, { type DivisionOverviewContent } from '@/templates/DivisionOverview';
import CloudHeroVisual from '@/components/visual/CloudHeroVisual';
import {
  CloudIcon,
  Lightning,
  Shield,
  Database,
  Eye,
  GitBranch,
} from '@/lib/icons';

export const metadata: Metadata = {
  title: 'SocioFi Cloud — Managed Hosting & Infrastructure',
  description:
    'Production-grade managed hosting without a DevOps team. SocioFi Cloud handles your infrastructure — servers, SSL, backups, monitoring, scaling — so you can focus on building product.',
};

const content: DivisionOverviewContent = {
  hero: {
    badge: 'Cloud · Managed Hosting & Infrastructure',
    headline: (
      <>
        You Build the Software.
        <br />
        <span className="gradient-text">We Run the Infrastructure.</span>
      </>
    ),
    description:
      'Your application deserves production-grade hosting — without a DevOps team. SocioFi Cloud manages the infrastructure so you can focus entirely on building product.',
    buttons: [
      { label: 'Get hosted', href: '/cloud/get-hosted', variant: 'primary' },
      { label: 'See plans', href: '/cloud/plans', variant: 'ghost' },
    ],
    rightContent: <CloudHeroVisual />,
  },

  metrics: [
    { label: 'Uptime guarantee', numeric: 99.9, suffix: '%', decimals: 1 },
    { label: 'Providers supported', numeric: 4 },
    { label: 'Migration handled', numeric: 100, suffix: '%' },
    { label: 'Setup time', numeric: 24, suffix: 'h' },
  ],

  servicesLabel: 'What we manage',
  servicesTitle: 'The full production stack, handled.',

  services: [
    {
      icon: <CloudIcon size={28} color="var(--division-accent)" />,
      title: 'Managed Hosting',
      description:
        'Fully configured servers, reverse proxies, SSL, CDN — all set up and maintained by us. You deploy code. We handle everything else.',
    },
    {
      icon: <Lightning size={28} color="var(--division-accent)" />,
      title: 'Auto-Scaling',
      description:
        "Traffic spikes don't crash your app. Horizontal scaling policies configured and monitored — your app handles load without you touching a server.",
    },
    {
      icon: <Shield size={28} color="var(--division-accent)" />,
      title: 'Security Hardening',
      description:
        'Firewall rules, intrusion detection, automated vulnerability scanning, and patching. Your infrastructure stays locked down.',
    },
    {
      icon: <Database size={28} color="var(--division-accent)" />,
      title: 'Automated Backups',
      description:
        'Daily encrypted backups with point-in-time recovery. Retention policies configured. Data loss is not something you think about.',
    },
    {
      icon: <Eye size={28} color="var(--division-accent)" />,
      title: '24/7 Monitoring',
      description:
        'Uptime checks, performance metrics, error rates, latency — all tracked. Alerts sent before users notice. Incidents handled by our team.',
    },
    {
      icon: <GitBranch size={28} color="var(--division-accent)" />,
      title: 'Managed Migrations',
      description:
        'Moving from shared hosting, a different provider, or a tangled deployment? We migrate your app with zero downtime and full rollback capability.',
    },
  ],

  featuresLabel: 'Why SocioFi Cloud',
  featuresTitle: 'Infrastructure management done right.',

  features: [
    {
      title: 'No DevOps hire needed',
      description:
        'We replace an entire infrastructure team for a fraction of the cost. One managed plan covers everything from server provisioning to incident response.',
    },
    {
      title: 'Provider-agnostic',
      description:
        'We manage AWS, DigitalOcean, Hetzner, and Vercel — or your existing cloud account. No lock-in. Pick the provider that fits your budget.',
    },
    {
      title: 'Migration included',
      description:
        'Move from anywhere with zero downtime and full support. We audit your existing setup, plan the migration, and execute it without disrupting live users.',
    },
  ],

  featured: {
    label: 'Provider-agnostic',
    headline: 'We work with AWS, DigitalOcean, Hetzner, and Vercel.',
    description:
      'No lock-in. We pick the provider that fits your budget and requirements — or run on your existing cloud account. You own the infrastructure, we manage it.',
    cta: 'Compare providers',
    href: '/cloud/providers',
  },

  cta: {
    title: 'Ready to stop managing servers?',
    subtitle:
      "Tell us about your app. We'll have a hosting plan ready within 24 hours.",
    primaryCTA: { label: 'Get hosted', href: '/cloud/get-hosted' },
    ghostCTA: { label: 'See plans', href: '/cloud/plans' },
    note: 'Setup in 24 hours. No DevOps required.',
  },
  divisionVariant: 'cloud',
};

export default function CloudPage() {
  return <DivisionOverview content={content} />;
}
