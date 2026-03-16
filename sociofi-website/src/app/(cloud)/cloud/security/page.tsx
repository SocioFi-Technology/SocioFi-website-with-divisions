import type { Metadata } from 'next';
import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Shield, Lock, Eye } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Security \u2014 SocioFi Cloud',
  description:
    'How SocioFi Cloud secures your infrastructure. Firewall management, vulnerability scanning, patching, and compliance readiness.',
};

const content: DeepDiveContent = {
  hero: {
    badge: 'Cloud \u00b7 Security',
    headline: (
      <>
        Your infrastructure,
        <br />
        <span className="gradient-text">locked down.</span>
      </>
    ),
    description:
      "Security isn't an add-on. Every SocioFi Cloud environment runs with hardened server configuration, continuous vulnerability scanning, and automated patching \u2014 from day one.",
    buttons: [
      { label: 'Get hosted', href: '/cloud/get-hosted', variant: 'primary' },
      { label: 'See plans', href: '/cloud/plans', variant: 'ghost' },
    ],
  },

  useCasesLabel: 'Security layers',
  useCasesTitle: 'Defense in depth, by default.',
  useCases: [
    {
      icon: <Shield size={24} />,
      title: 'Network security',
      description:
        'Firewall rules configured to deny by default. Only required ports open. Private networking between services. DDoS protection at the edge.',
    },
    {
      icon: <Lock size={24} />,
      title: 'Application security',
      description:
        'Environment variables encrypted at rest. Secrets management handled outside your codebase. TLS on all connections, internal and external.',
    },
    {
      icon: <Eye size={24} />,
      title: 'Continuous monitoring',
      description:
        'Intrusion detection, anomaly alerts, failed authentication tracking, and unusual traffic patterns \u2014 monitored and flagged in real time.',
    },
  ],

  deliverable: {
    label: 'Security operations',
    headline: 'Patched, scanned, and hardened \u2014 continuously.',
    description:
      "Security work is ongoing, not a one-time setup. Here's what runs on every managed environment.",
    items: [
      { label: 'OS and runtime patching', detail: 'Applied within 24h of security release' },
      { label: 'Firewall rule management', detail: 'Deny-by-default, reviewed on change' },
      { label: 'SSL/TLS certificate rotation', detail: 'Auto-renewed, zero-downtime' },
      { label: 'Vulnerability scanning', detail: 'Weekly scans, findings reported and resolved' },
      { label: 'Access control audit', detail: 'SSH keys rotated, unused access revoked' },
      { label: 'Secrets management', detail: 'No credentials in codebase or environment history' },
      { label: 'Incident response', detail: 'Security events escalated and resolved within SLA' },
    ],
  },

  timeline: {
    duration: 'Continuous',
    price: 'Included in every plan',
    note: 'Security operations are not an add-on. Every managed environment runs the same security baseline regardless of plan tier.',
  },

  faqs: [
    {
      question: 'Are you SOC 2 or HIPAA compliant?',
      answer:
        "Our Enterprise plan includes compliance-ready infrastructure configurations that align with SOC 2 and HIPAA requirements. We don't issue compliance certifications ourselves \u2014 those belong to your organization \u2014 but we configure and document the infrastructure controls that auditors need to see.",
    },
    {
      question: 'What happens when a vulnerability is discovered?',
      answer:
        'We track CVEs and security advisories for every runtime and OS we manage. When a critical vulnerability is published, we patch affected environments within 24 hours. You receive a notification with what was patched and when \u2014 no action required on your part.',
    },
    {
      question: 'Who has access to my servers?',
      answer:
        'Only our on-call engineers, using SSH keys tied to named individuals. Access is logged. Keys are rotated on engineer offboarding. You have full visibility into who has access and can request an access log at any time.',
    },
  ],

  cta: {
    title: 'Security included. No extra charge.',
    subtitle:
      'Every SocioFi Cloud environment runs with a full security baseline \u2014 from day one.',
    primaryCTA: { label: 'Get hosted', href: '/cloud/get-hosted' },
    ghostCTA: { label: 'See plans', href: '/cloud/plans' },
  },
};

export default function SecurityPage() {
  return <DeepDive content={content} />;
}
