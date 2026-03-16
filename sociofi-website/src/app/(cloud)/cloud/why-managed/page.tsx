import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Rocket,
  Shield,
  Globe,
  Lightning,
  Database,
  GitBranch,
} from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Why Managed Hosting — SocioFi Cloud',
  description:
    "Running your own servers costs more than you think — not in money, but in time, focus, and incidents. Here's what managed hosting actually buys you.",
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Cloud · Why Managed',
    headline: (
      <>
        Self-hosting is a
        <br />
        <span className="gradient-text">full-time job.</span>
      </>
    ),
    description:
      "Every hour you spend configuring servers, debugging deploys, and responding to outages is an hour you're not building product. Managed hosting isn't a luxury — it's a focus multiplier.",
    buttons: [
      { label: 'Get started', href: '/cloud/get-hosted', variant: 'primary' },
      { label: 'See plans', href: '/cloud/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The real cost of DIY',
    headline: 'Most founders underestimate what self-hosting actually costs.',
    description:
      "It's not just the server bill. It's the time, the expertise, the 2am incidents, and the slow accumulation of configuration debt.",
    points: [
      'Every new server needs configured: firewall, SSL, reverse proxy, environment variables, monitoring agents, backup cron jobs — before your app runs a single request',
      'Outages happen at the worst times. Without monitoring and on-call processes, your first alert is a customer complaint',
      'Security patching is a continuous job — unpatched servers are the most common attack vector for small companies',
      'Scaling manually under load is high-stakes and time-consuming — you\'re debugging infrastructure instead of shipping features',
    ],
  },

  capabilitiesLabel: 'What you get back',
  capabilitiesTitle: 'Time, focus, and sleep.',

  capabilities: [
    {
      icon: <Rocket size={28} color="var(--division-accent)" />,
      title: 'Zero infrastructure setup',
      description:
        'We configure your hosting environment from scratch — OS, networking, SSL, CDN, reverse proxy, env management. You deploy code, we handle everything underneath.',
    },
    {
      icon: <Shield size={28} color="var(--division-accent)" />,
      title: 'Proactive security management',
      description:
        "Automated vulnerability scanning, firewall rule updates, dependency patching, and intrusion detection — all managed. You don't hear about most threats because we stop them before they matter.",
    },
    {
      icon: <Globe size={28} color="var(--division-accent)" />,
      title: '24/7 incident response',
      description:
        "Our team monitors your infrastructure around the clock. When something breaks, we respond — not you. Most incidents are resolved before your users notice.",
    },
    {
      icon: <Lightning size={28} color="var(--division-accent)" />,
      title: 'Scaling without firefighting',
      description:
        'Traffic spikes, deployment rollouts, database migrations — handled without you needing to understand load balancers or autoscaling groups.',
    },
    {
      icon: <Database size={28} color="var(--division-accent)" />,
      title: 'Backup and recovery confidence',
      description:
        'Daily encrypted backups, point-in-time restore, and tested recovery procedures. You know exactly what happens when the worst case occurs.',
    },
    {
      icon: <GitBranch size={28} color="var(--division-accent)" />,
      title: 'Clean migration from anywhere',
      description:
        'Already hosting somewhere messy? We migrate your app, database, and storage with zero downtime. No disruption to live users.',
    },
  ],

  processLabel: 'What managed hosting replaces',
  processTitle: 'One team. All of this.',

  process: [
    {
      title: 'Infrastructure provisioning',
      description:
        'Server setup, OS hardening, networking, firewall rules, SSL certificates, reverse proxy configuration — done once, maintained continuously.',
    },
    {
      title: 'Deployment pipeline',
      description:
        'CI/CD configuration, staging environment, production deploy process, rollback procedures — set up and documented for your team.',
    },
    {
      title: 'Monitoring and alerting',
      description:
        'Uptime checks, performance dashboards, error rate tracking, latency monitoring, on-call alert routing — all active from day one.',
    },
    {
      title: 'Security operations',
      description:
        'Vulnerability scanning, dependency updates, access control reviews, intrusion detection — run on schedule, not reactively.',
    },
    {
      title: 'Backup and recovery',
      description:
        'Daily encrypted backups, retention policies, tested restore procedures, documented recovery playbooks.',
    },
    {
      title: 'Incident response',
      description:
        '24/7 on-call coverage, runbooks for common failures, escalation procedures, post-incident reports — so failures get resolved and don\'t repeat.',
    },
  ],

  caseStudy: {
    label: 'Before and after',
    headline: 'From 3-hour outages to zero infrastructure incidents in 90 days.',
    description:
      'A SaaS founder was spending 12 hours a week on infrastructure — deploys, patches, debugging. We took over the full stack. In 90 days: zero outages, deploy time cut from 45 minutes to 4 minutes, and the founder shipped 3 new features.',
    result: '12 hrs/week',
    resultLabel: 'engineering time recovered',
  },

  faqs: [
    {
      question: 'What does managed hosting actually include?',
      answer:
        'Everything between your code repository and your users: server configuration, SSL, CDN, reverse proxy, monitoring, backups, security patching, scaling policies, and incident response. You push code. We handle the rest.',
    },
    {
      question: 'Can I still access my own servers?',
      answer:
        "Yes. You have full SSH access and repository access throughout. We manage the infrastructure but you own it — nothing is locked away. If you ever want to take it over yourself, we hand over full documentation.",
    },
    {
      question: 'What if I already have a hosting setup?',
      answer:
        "We audit what you have, identify what's missing or misconfigured, and either clean it up or migrate it to a properly managed environment. Most migrations take 2–5 days with zero downtime.",
    },
    {
      question: 'How is this different from Heroku or Railway?',
      answer:
        'Platform-as-a-service tools are great for simple apps. When you need custom infrastructure, database tuning, private networking, compliance requirements, or more control than a platform allows, managed cloud is the right layer. We handle the complexity that PaaS tools abstract away — or leave unconfigured.',
    },
  ],

  cta: {
    title: 'Stop managing servers.',
    subtitle: 'Tell us about your app. We set up managed hosting in 24 hours.',
    primaryCTA: { label: 'Get hosted', href: '/cloud/get-hosted' },
    ghostCTA: { label: 'Compare plans', href: '/cloud/plans' },
    note: '24-hour setup. No DevOps required.',
  },
};

export default function WhyManagedPage() {
  return <ServiceDetail content={content} />;
}
