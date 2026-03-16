import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Shield, Lock, Eye } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Patches & Vulnerability Management — SocioFi Services',
  description:
    'Dependency audits, CVE scanning, and patch deployment on a schedule. Keep your stack current before attackers exploit what you missed.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Services · Security',
    headline: (
      <>
        Patched Before{' '}
        <span className="gradient-text">You Are Exploited.</span>
      </>
    ),
    description:
      "The most common security breaches do not use sophisticated exploits. They use outdated dependencies and known vulnerabilities that were patched months ago. We keep your stack current.",
    buttons: [
      { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
      { label: 'See plans', href: '/services/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The vulnerability window',
    headline: 'Every unpatched dependency is an open door.',
    description:
      'Most security incidents are preventable. They exploit vulnerabilities that had a patch available — sometimes for months. The issue is not the patch, it is the process for applying it.',
    points: [
      'Dependency update backlogs accumulate for months without a dedicated process',
      'CVE disclosures happen daily — manual tracking is not scalable',
      'Applying patches without testing breaks production',
      'No visibility into what is actually vulnerable',
    ],
  },

  capabilitiesLabel: 'How we keep you secure',
  capabilitiesTitle: 'Patching as a process, not a panic.',
  capabilities: [
    {
      icon: <Shield size={22} aria-hidden="true" />,
      title: 'Dependency auditing',
      description:
        'Weekly automated scans across all package dependencies — frontend, backend, and infrastructure. We track CVE disclosures, severity ratings, and patch availability. You get a clear picture of your exposure.',
    },
    {
      icon: <Lock size={22} aria-hidden="true" />,
      title: 'Patch management',
      description:
        'Critical patches deployed within 24 hours of CVE publication. Non-critical updates batched monthly. Every patch goes through staging first — we do not push untested changes to production.',
    },
    {
      icon: <Eye size={22} aria-hidden="true" />,
      title: 'Security monitoring',
      description:
        'Anomalous access patterns, failed authentication spikes, unusual API usage, and suspicious request patterns — all monitored continuously. We catch intrusion attempts early and document them.',
    },
  ],

  processLabel: 'The patching process',
  processTitle: 'No unplanned production changes.',
  process: [
    {
      title: '01. Initial audit',
      description:
        'We run a full dependency audit across your stack and produce a vulnerability report: severity, affected package, available patch, and recommended action. You see exactly where you stand.',
      duration: '48 hours',
    },
    {
      title: '02. Patch schedule agreed',
      description:
        'We categorise findings into critical (24-hour patch) and routine (monthly batch). You approve the schedule. Nothing gets deployed to production without your awareness.',
      duration: '1 hour',
    },
    {
      title: '03. Staged deployment',
      description:
        'Every patch goes through your staging environment first. We verify functionality, run your test suite, and confirm no regressions before the production push.',
      duration: 'Per patch',
    },
    {
      title: '04. Ongoing monitoring',
      description:
        'CVE feeds monitored continuously. New vulnerabilities get assessed within 24 hours. You receive a monthly security summary with everything patched, everything monitored, and anything requiring your attention.',
      duration: 'Ongoing',
    },
  ],

  caseStudy: {
    label: 'Security in practice',
    headline: 'Patched a critical auth bypass two days before public disclosure.',
    description:
      "A dependency in a client's authentication layer had a critical CVE pending public disclosure. Our automated scanning flagged it the day the advisory was published privately. We had the patch tested and deployed before the CVE was publicly searchable.",
    result: 'Zero exposure window.',
    resultLabel: 'The outcome',
  },

  faqs: [
    {
      question: 'Do you do penetration testing?',
      answer:
        'Penetration testing is available on Enterprise plans and as a standalone service. It is scoped separately — a proper pentest is a dedicated engagement, not a monthly checkbox. We can recommend it and execute it when the timing makes sense for your product.',
    },
    {
      question: 'What frameworks and languages do you support?',
      answer:
        'We support any framework with a maintained package registry: Node.js, Python, Ruby, Go, PHP, and all major frontend frameworks. Our tooling adapts to your stack — we are not locked into one language or ecosystem.',
    },
    {
      question: 'What if a patch breaks something?',
      answer:
        'That is what staging is for. We never push directly to production. If a patch causes regressions in staging, we investigate the conflict, find a safe path (pinned version, alternative patch, or workaround), and only deploy when we are confident it is safe.',
    },
  ],

  cta: {
    title: 'Close the vulnerability window.',
    subtitle: 'A dependency audit in 48 hours. Ongoing patching from there.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'See all plans', href: '/services/plans' },
    note: 'Initial audit completed within 48 hours of onboarding.',
  },
};

export default function SecurityPage() {
  return <ServiceDetail content={content} />;
}
