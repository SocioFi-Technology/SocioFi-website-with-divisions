import DivisionOverview, { type DivisionOverviewContent } from '@/templates/DivisionOverview';
import { Eye, Shield, Wrench, Rocket, Zap, Lightning, Calendar, Chart } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ongoing Software Maintenance — SocioFi Services',
  description:
    '24/7 monitoring, security patches, bug fixes, and feature updates for live software. Three plans from $499/month. Response time guaranteed.',
};

const content: DivisionOverviewContent = {
  hero: {
    badge: 'Services · Ongoing Maintenance',
    headline: (
      <>
        Your Software Is Live.{' '}
        <span className="gradient-text">We Keep It That Way.</span>
      </>
    ),
    description:
      'Most software breaks silently. Dependencies go out of date. Performance degrades. Security vulnerabilities appear. We watch your production systems around the clock so you do not have to.',
    buttons: [
      { label: 'See plans', href: '/services/plans', variant: 'primary' },
      { label: 'How it works', href: '/services/how-it-works', variant: 'ghost' },
    ],
  },

  metrics: [
    { numeric: 99.9, suffix: '%', decimals: 1, label: 'Uptime SLA' },
    { numeric: 4, prefix: '<', suffix: 'hr', label: 'Incident response' },
    { numeric: 24, suffix: '/7', label: 'Monitoring coverage' },
    { numeric: 30, suffix: ' days', label: 'Bug fix guarantee' },
  ],

  servicesLabel: 'What is included',
  servicesTitle: 'Every plan. Every client. Always on.',
  services: [
    {
      icon: <Eye size={22} aria-hidden="true" />,
      title: 'Monitoring & Alerting',
      description:
        'Real-time uptime checks, error rate tracking, and performance monitoring. We know when something goes wrong before your customers do. Alerts go to you and to us.',
      href: '/services/monitoring',
      linkText: 'Learn more',
    },
    {
      icon: <Shield size={22} aria-hidden="true" />,
      title: 'Security Patches',
      description:
        'Dependency audits, CVE scanning, and patch deployment — on a schedule, not when there is already a breach. We keep your stack current so attackers do not exploit what you missed.',
      href: '/services/security',
      linkText: 'Learn more',
    },
    {
      icon: <Wrench size={22} aria-hidden="true" />,
      title: 'Bug Fixes',
      description:
        'Priority triage, root cause analysis, and fixes deployed to staging before production. Every bug fix comes with a brief post-mortem so the same issue does not come back.',
      href: '/services/bug-fixes',
      linkText: 'Learn more',
    },
    {
      icon: <Rocket size={22} aria-hidden="true" />,
      title: 'Feature Updates',
      description:
        'Scoped additions to your existing product — new integrations, new pages, new workflows. We build on top of the existing architecture without breaking what already works.',
      href: '/services/feature-updates',
      linkText: 'Learn more',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Performance Optimization',
      description:
        'Profiling, database tuning, caching layers, and CDN configuration. We measure before and after — every change ships with documented improvements.',
      href: '/services/performance',
      linkText: 'Learn more',
    },
    {
      icon: <Lightning size={22} aria-hidden="true" />,
      title: 'Incident Response',
      description:
        'When production goes down, we respond. 24/7 coverage on Professional and Enterprise plans. We diagnose, patch, and restore — then document what happened and why.',
      href: '/services/how-it-works',
      linkText: 'How we respond',
    },
  ],

  featuresLabel: 'Why maintenance clients stay',
  featuresTitle: 'Reactive support is not enough.',
  features: [
    {
      icon: <Eye size={22} aria-hidden="true" />,
      title: 'We catch it before you do',
      description:
        'Continuous monitoring means we see errors, slow queries, and anomalies the moment they happen. Most issues get fixed before a single user notices or files a report.',
    },
    {
      icon: <Calendar size={22} aria-hidden="true" />,
      title: 'Guaranteed response times',
      description:
        'Every plan has a defined SLA. Essential: 24-hour response. Professional: 4-hour response. Enterprise: 1-hour. You get the commitment in writing before you pay.',
    },
    {
      icon: <Chart size={22} aria-hidden="true" />,
      title: 'Monthly reports, no surprises',
      description:
        'Every month: a written summary of incidents handled, patches applied, performance metrics, and planned work. You always know exactly what we did and what is coming next.',
    },
  ],

  featured: {
    label: 'Pricing that makes sense',
    headline: 'Fixed monthly rate. No hourly surprises.',
    description:
      'Three plans starting at $499/month. Each covers a specific scope of ongoing work — monitoring, security, bug fixes, and optionally feature development. You know exactly what you are paying and what you are getting.',
    href: '/services/plans',
    cta: 'See all plans',
  },

  testimonials: [
    {
      quote:
        'We had a memory leak that was slowly killing our server every 3 days. SocioFi caught it on day two of monitoring, diagnosed it in an hour, and deployed the fix the same day. We did not even know it was happening.',
      author: 'Marcus T.',
      role: 'Founder',
      company: 'TaskBridge',
    },
    {
      quote:
        'The monthly reports are genuinely useful — not just a summary of what we already knew. They flag things we would never have thought to look at. Three months in and our P95 response time is down 40%.',
      author: 'Sarah K.',
      role: 'CTO',
      company: 'LoopDesk',
    },
  ],

  cta: {
    title: 'Your software needs someone watching it.',
    subtitle:
      'Every week without monitoring is a week where something breaks silently. Get protected today.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'See plans', href: '/services/plans' },
    note: 'Setup in 48 hours. Month-to-month. Cancel anytime.',
  },
};

export default function ServicesPage() {
  return <DivisionOverview content={content} />;
}
