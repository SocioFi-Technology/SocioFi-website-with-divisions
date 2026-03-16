import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Database, GitBranch, Globe, Shield } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Migration \u2014 SocioFi Cloud',
  description:
    'Moving your app to SocioFi Cloud. Zero-downtime migrations from shared hosting, DIY servers, or any cloud provider. Handled end to end.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Cloud \u00b7 Migration',
    headline: (
      <>
        Move your app.
        <br />
        <span className="gradient-text">Keep it running.</span>
      </>
    ),
    description:
      'Migrating hosting is high-stakes work. Get it wrong and users notice. We handle the full migration \u2014 infrastructure provisioning, data transfer, DNS cutover, and validation \u2014 with zero downtime and a tested rollback at every step.',
    buttons: [
      { label: 'Start migration', href: '/cloud/get-hosted', variant: 'primary' },
      { label: 'See plans', href: '/cloud/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Why migrations go wrong',
    headline: 'Most downtime happens during migration.',
    description:
      "Hosting migrations fail in predictable ways: undocumented dependencies, DNS TTL miscalculation, database sync issues, environment variable mismatches. We've seen all of them. Our migration process is designed to prevent them.",
    points: [
      'DNS changes without pre-lowered TTLs cause 12\u201348 hours of split traffic and cache poisoning',
      'Database migrations without a live sync window result in data loss or version conflicts during cutover',
      'Missing environment variables and secrets only surface after go-live, during error-prone manual discovery',
      'No rollback plan means a failed migration becomes an incident with no safe exit',
    ],
  },

  capabilitiesLabel: 'Migration coverage',
  capabilitiesTitle: 'We move everything.',
  capabilities: [
    {
      icon: <Database size={24} />,
      title: 'Database migration',
      description:
        'We migrate PostgreSQL, MySQL, MongoDB, and Redis \u2014 with a live replication window to ensure zero data loss during cutover. Point-in-time restore available if anything surfaces post-migration.',
    },
    {
      icon: <GitBranch size={24} />,
      title: 'Codebase and deployment setup',
      description:
        'We configure CI/CD pipelines, environment variables, build processes, and deploy scripts on the new infrastructure before any traffic moves.',
    },
    {
      icon: <Globe size={24} />,
      title: 'DNS cutover management',
      description:
        'TTLs lowered 48 hours in advance. DNS changes made with a validation window. Traffic validated on new infrastructure before old environment is retired.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Rollback capability',
      description:
        'Old infrastructure stays live until we confirm the new environment is stable. Rollback is a single DNS change \u2014 never a rebuild from scratch.',
    },
  ],

  processLabel: 'Migration process',
  processTitle: 'Seven steps. Zero downtime.',
  process: [
    {
      title: 'Discovery and audit',
      description:
        'We inventory your current setup: server configuration, databases, storage, environment variables, third-party integrations, and any undocumented dependencies.',
      duration: 'Day 1',
    },
    {
      title: 'Target environment provisioning',
      description:
        'New infrastructure configured on the target provider \u2014 identical to your requirements, hardened and tested before any data moves.',
      duration: 'Days 1\u20132',
    },
    {
      title: 'Data migration and sync',
      description:
        'Database and file storage migrated with live replication to keep source and target in sync during the cutover window.',
      duration: 'Days 2\u20133',
    },
    {
      title: 'Application deployment',
      description:
        'Your codebase deployed and validated on the new environment. All integrations, environment variables, and third-party connections verified.',
      duration: 'Day 3',
    },
    {
      title: 'DNS TTL reduction',
      description:
        'DNS TTLs lowered to 60 seconds 48 hours before cutover \u2014 ensures fast propagation when we make the switch.',
      duration: 'Day 3',
    },
    {
      title: 'Traffic cutover and validation',
      description:
        'DNS updated. Traffic routed to new environment. Monitoring active. Old environment kept live for 24 hours as rollback option.',
      duration: 'Day 4\u20135',
    },
    {
      title: 'Old environment retirement',
      description:
        'Once new environment is confirmed stable, old infrastructure decommissioned and documented.',
      duration: 'Day 5\u20137',
    },
  ],

  caseStudy: {
    label: 'Migration example',
    headline: 'From a self-managed VPS to fully managed infrastructure in 5 days.',
    description:
      "A SaaS team was running on an unmonitored VPS with no backups. We migrated their Next.js app, PostgreSQL database, and file storage to DigitalOcean with a proper managed setup. No downtime. Zero data loss. Monitoring live on day one.",
    result: '0 minutes',
    resultLabel: 'downtime during migration',
  },

  faqs: [
    {
      question: 'How long does a migration take?',
      answer:
        'Typically 3\u20137 days depending on database size, number of services, and DNS propagation time. Simple app migrations (one service, small database) can be done in 2 days. Complex multi-service migrations take up to 2 weeks.',
    },
    {
      question: "Can you migrate while we're still getting traffic?",
      answer:
        "Yes \u2014 this is the only way we do it. We don't schedule maintenance windows. Database replication keeps source and target in sync until cutover. Users don't experience downtime.",
    },
    {
      question: 'What if something breaks after the migration?',
      answer:
        'Old infrastructure stays live for 24 hours after cutover. If a critical issue surfaces, rollback is a single DNS change \u2014 under 5 minutes. Post-migration support is included for 30 days.',
    },
    {
      question: "We're on shared hosting with no SSH access. Can you still migrate us?",
      answer:
        "Yes. We've migrated from cPanel, Plesk, and other control panel environments. We export databases via phpMyAdmin or database dumps, transfer files via FTP/SFTP, and reconstruct the environment on properly managed infrastructure.",
    },
  ],

  cta: {
    title: 'Move your app. Keep it running.',
    subtitle:
      "Tell us where you're hosted and what you're running. We'll scope the migration and give you a timeline.",
    primaryCTA: { label: 'Start a migration', href: '/cloud/get-hosted' },
    ghostCTA: { label: 'See plans', href: '/cloud/plans' },
    note: 'Zero-downtime migration. Rollback included.',
  },
};

export default function MigrationPage() {
  return <ServiceDetail content={content} />;
}
