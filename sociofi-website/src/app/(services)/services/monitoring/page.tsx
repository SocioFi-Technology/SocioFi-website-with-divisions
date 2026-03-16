import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Eye, Zap, Database } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monitoring & Alerting — SocioFi Services',
  description:
    'Real-time uptime checks, error rate tracking, and performance monitoring for live software. Know before your users do.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Services · Monitoring',
    headline: (
      <>
        Know Before{' '}
        <span className="gradient-text">Your Users Do.</span>
      </>
    ),
    description:
      'If your server goes down and you find out from a customer support email, that is already too late. We set up comprehensive monitoring across your stack — uptime, errors, performance, and anomalies — and alert you the moment something changes.',
    buttons: [
      { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
      { label: 'See plans', href: '/services/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The silent failure problem',
    headline: 'Most production issues go undetected for hours.',
    description:
      'Without active monitoring, you rely on customers to tell you when something breaks. By the time a user reports an error, they have usually already left.',
    points: [
      'No visibility into error rates or exception counts',
      'Database slowdowns go unnoticed until the app grinds to a halt',
      'Downtime only discovered through customer complaints',
      'Security incidents invisible until damage is done',
    ],
  },

  capabilitiesLabel: 'What we monitor',
  capabilitiesTitle: 'Full-stack visibility. Not just uptime.',
  capabilities: [
    {
      icon: <Eye size={22} aria-hidden="true" />,
      title: 'Uptime & availability',
      description:
        'HTTP checks every 60 seconds from multiple regions. Immediate alert on any failure. We track uptime percentage, response time trends, and historical availability — all included in your monthly report.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Error rate & exceptions',
      description:
        'Application-level error tracking captures every unhandled exception, stack trace, and user session context. We triage the alerts and fix the high-priority ones before they become patterns.',
    },
    {
      icon: <Database size={22} aria-hidden="true" />,
      title: 'Infrastructure & logs',
      description:
        'Server resource utilization, database query performance, cache hit rates, and log aggregation. We watch for anomalies — sudden CPU spikes, slow queries, unusual traffic patterns — in real time.',
    },
  ],

  processLabel: 'Getting started',
  processTitle: 'Live in 48 hours.',
  process: [
    {
      title: '01. Access handover',
      description:
        'We request read access to your hosting provider, deployment logs, and error tracking setup. You retain full control — we only need what is necessary to monitor.',
      duration: '1 hour',
    },
    {
      title: '02. Baseline capture',
      description:
        'We run a 24-hour baseline to understand your normal traffic patterns, error rates, and response times. This calibrates our alerting thresholds so we do not false-alarm on normal spikes.',
      duration: '24 hours',
    },
    {
      title: '03. Alerts configured',
      description:
        'Alert rules set up for uptime, error rate, response time, and custom application metrics. We route critical alerts to on-call and send daily digests to you.',
      duration: '2 hours',
    },
    {
      title: '04. Monitoring live',
      description:
        'Your stack is now under active monitoring. Weekly check-ins, monthly reports, and immediate escalation on anything that crosses the threshold.',
      duration: 'Ongoing',
    },
  ],

  caseStudy: {
    label: 'Monitoring in action',
    headline: 'Caught a database connection leak 4 hours before peak traffic.',
    description:
      "A SaaS client's connection pool was slowly exhausting — a pattern invisible without monitoring. We spotted the anomaly during a routine check, identified a leaked connection in a background job, and deployed a fix three hours before their morning traffic peak.",
    result: 'Zero downtime. Zero users affected.',
    resultLabel: 'The outcome',
  },

  faqs: [
    {
      question: 'What does your monitoring stack look like?',
      answer:
        'We use a combination of synthetic uptime checks, APM instrumentation, and log aggregation — the specific tooling adapts to your stack. We can work with existing infrastructure (Sentry, Datadog, etc.) or set up our own. You own all the configuration.',
    },
    {
      question: 'Do I get notified for every alert?',
      answer:
        'No — we triage first. Minor anomalies are logged and reviewed in the weekly check-in. Critical issues (downtime, error rate spikes, security events) trigger immediate notification to you and to us. You control the escalation policy.',
    },
    {
      question: 'What if I already have some monitoring in place?',
      answer:
        'We build on what exists. If you already have Sentry for error tracking, we plug into it rather than replacing it. We fill the gaps — infrastructure monitoring, log aggregation, performance baselines — rather than duplicating what is already working.',
    },
  ],

  cta: {
    title: 'Stop finding out from your customers.',
    subtitle: 'Get real-time visibility across your stack in 48 hours.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'See all plans', href: '/services/plans' },
    note: 'Monitoring active within 48 hours of onboarding.',
  },
};

export default function MonitoringPage() {
  return <ServiceDetail content={content} />;
}
