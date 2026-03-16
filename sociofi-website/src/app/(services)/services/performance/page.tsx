import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Chart, Database, Zap } from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Performance Optimisation — SocioFi Services',
  description:
    'Profiling, database tuning, caching, and CDN configuration. We measure before and after every change.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Services · Performance',
    headline: (
      <>
        Fast Products{' '}
        <span className="gradient-text">Retain More Customers.</span>
      </>
    ),
    description:
      'A 100ms improvement in response time can increase revenue by 1%. A 1-second delay reduces conversions by 7%. We profile your application, identify the real bottlenecks, and measure the improvement after every change.',
    buttons: [
      { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
      { label: 'See plans', href: '/services/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'The performance problem',
    headline: 'Slow is the most common reason users leave.',
    description:
      'Performance problems compound. A slow query becomes a slow page becomes a slow app becomes a churned customer. Most performance issues are invisible until they are severe.',
    points: [
      'Database queries that worked fine at 100 users fail at 10,000',
      'No performance baseline — impossible to know if you are improving or degrading',
      'Frontend bundle sizes that were fine at launch now block rendering',
      'No caching strategy — every request hits the database',
    ],
  },

  capabilitiesLabel: 'How we improve performance',
  capabilitiesTitle: 'Measure first. Optimise second.',
  capabilities: [
    {
      icon: <Chart size={22} aria-hidden="true" />,
      title: 'Profiling and baselining',
      description:
        'We establish a performance baseline before touching anything — P50, P95, and P99 response times, database query counts per request, frontend bundle sizes, and Time to First Byte. You cannot improve what you have not measured.',
    },
    {
      icon: <Database size={22} aria-hidden="true" />,
      title: 'Database and query optimisation',
      description:
        'Slow query identification, index analysis, N+1 query elimination, and connection pool tuning. Database performance is responsible for the majority of application slowdowns and is almost always fixable without infrastructure changes.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Caching and CDN',
      description:
        'Response caching, query result caching, static asset CDN configuration, and edge rendering where applicable. We implement caching layers that reduce database load and improve perceived performance without changing application logic.',
    },
  ],

  processLabel: 'Performance optimisation process',
  processTitle: 'Before and after. Always measured.',
  process: [
    {
      title: '01. Baseline audit',
      description:
        'We instrument your application and capture a performance baseline across all key user flows. Response times, database query counts, frontend bundle analysis, and server resource utilisation — documented before we change anything.',
      duration: '24–48 hours',
    },
    {
      title: '02. Bottleneck identification',
      description:
        'We analyse the baseline to identify the highest-impact improvements. Most applications have 3–5 changes that account for 80% of the performance gain. We prioritise ruthlessly.',
      duration: '4–8 hours',
    },
    {
      title: '03. Implement changes',
      description:
        'Changes deployed in order of impact, one at a time. Each change is tested in staging before production. We measure the impact of each individual change so you can see exactly what moved the needle.',
      duration: 'Per optimisation',
    },
    {
      title: '04. Verify and report',
      description:
        'After each sprint of optimisation, we produce a report: before vs after metrics, changes made, and observed improvement. The baseline captures the gains permanently.',
      duration: '2 hours',
    },
  ],

  caseStudy: {
    label: 'Performance in practice',
    headline: 'P95 response time down from 4.2s to 380ms on a fintech dashboard.',
    description:
      'A reporting dashboard was timing out under normal load. The baseline revealed 47 database queries on a single page load — the result of unchecked ORM lazy loading. We replaced the queries with 3 optimised joins, added a caching layer for read-heavy data, and deployed the change in a single deploy.',
    result: '91% latency reduction. Zero infrastructure cost increase.',
    resultLabel: 'Measured improvement',
  },

  faqs: [
    {
      question: 'How do you measure performance improvements?',
      answer:
        'We instrument your application before and after every change — P50, P95, and P99 response times, database query counts, Lighthouse scores for frontend changes, and server CPU/memory utilisation. You get a documented before-and-after for every optimisation we make.',
    },
    {
      question: 'Is performance optimisation included in all plans?',
      answer:
        'Performance monitoring (tracking and alerting on degradation) is included in all plans. Active performance optimisation work is included in the Professional and Enterprise plans. If you need a one-off performance sprint on an Essential plan, we scope and price it separately.',
    },
    {
      question: 'What if the performance issue requires infrastructure changes?',
      answer:
        'We scope infrastructure changes separately and present options — scaling vertically, switching to a managed service, or adding a caching layer — with cost/benefit analysis for each. We do not implement infrastructure changes without a clear written scope and your approval.',
    },
  ],

  cta: {
    title: 'Slow applications lose customers.',
    subtitle: 'Get a performance baseline and a prioritised improvement plan in 48 hours.',
    primaryCTA: { label: 'Get protected', href: '/services/get-protected' },
    ghostCTA: { label: 'See all plans', href: '/services/plans' },
    note: 'Performance baseline delivered within 48 hours of onboarding.',
  },
};

export default function PerformancePage() {
  return <ServiceDetail content={content} />;
}
