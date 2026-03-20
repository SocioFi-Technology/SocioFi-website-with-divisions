export interface ServicesPlan {
  slug: 'essential' | 'growth' | 'scale';
  name: string;
  price: number;
  tagline: string;
  bestFor: string;
  customerRange: string;
  responseTime: { p1: string; p2: string; p3: string; p4: string };
  uptimeSLA: string;
  badge?: string;
  features: string[];
}

export interface AddOn {
  slug: string;
  name: string;
  price: string;
  description: string;
  applicablePlans: string[];
}

export const plans: ServicesPlan[] = [
  {
    slug: 'essential',
    name: 'Essential',
    price: 499,
    tagline: 'Monitoring + rapid response for teams that need a safety net.',
    bestFor: 'Solo founders and early-stage products with stable codebases.',
    customerRange: '100–2,000 monthly active users',
    responseTime: {
      p1: '4 hours',
      p2: '8 hours',
      p3: '24 hours',
      p4: '72 hours',
    },
    uptimeSLA: '99.9%',
    features: [
      '24/7 uptime + error-rate monitoring',
      'Monthly dependency & CVE security scan',
      'Up to 3 bug fixes per month',
      '2 hours of feature work per month',
      'Monthly written health report',
      'Shared Slack channel',
    ],
  },
  {
    slug: 'growth',
    name: 'Growth',
    price: 999,
    tagline: 'Full-coverage support for products with real traction.',
    bestFor: 'Growing startups and SMBs that cannot afford downtime.',
    customerRange: '2,000–20,000 monthly active users',
    responseTime: {
      p1: '1 hour',
      p2: '4 hours',
      p3: '8 hours',
      p4: '24 hours',
    },
    uptimeSLA: '99.95%',
    badge: 'MOST POPULAR',
    features: [
      'Everything in Essential',
      'Proactive performance profiling',
      'Weekly security patch deployment',
      'Up to 8 bug fixes per month',
      '4 hours of feature work per month',
      'Bi-weekly video sync with your team',
      'Dedicated Slack channel + named engineer',
      'Incident post-mortem after every P1',
    ],
  },
  {
    slug: 'scale',
    name: 'Scale',
    price: 1999,
    tagline: 'Dedicated engineering retainer for high-traffic production systems.',
    bestFor: 'Series A+ companies and high-traffic products where downtime = real money.',
    customerRange: '20,000+ monthly active users',
    responseTime: {
      p1: '15 minutes',
      p2: '1 hour',
      p3: '4 hours',
      p4: '8 hours',
    },
    uptimeSLA: '99.99%',
    features: [
      'Everything in Growth',
      'Unlimited bug fixes',
      '12 hours of feature work per month',
      'Quarterly architecture review',
      'Load testing + capacity planning',
      'Database optimization on request',
      'Dedicated senior engineer (named)',
      'Weekly written status report',
      'Emergency on-call coverage (24/7)',
    ],
  },
];

export const addOns: AddOn[] = [
  {
    slug: 'extra-feature-hours',
    name: 'Extra Feature Hours',
    price: '$120/hr',
    description:
      'Additional development hours beyond your plan allocation. Scoped, estimated, and approved before work begins.',
    applicablePlans: ['essential', 'growth', 'scale'],
  },
  {
    slug: '24-7-escalation',
    name: '24/7 Escalation Coverage',
    price: '$299/mo',
    description:
      'Extend Essential plan to include after-hours on-call coverage. A senior engineer is reachable by phone for P1 incidents any time.',
    applicablePlans: ['essential'],
  },
  {
    slug: 'agent-monitoring-pack',
    name: 'Agent Monitoring Pack',
    price: '$199/mo per agent',
    description:
      'Dedicated observability for AI agents in production — token usage tracking, failure loop detection, output quality monitoring, and auto-restart triggers.',
    applicablePlans: ['essential', 'growth', 'scale'],
  },
  {
    slug: 'quarterly-security-audit',
    name: 'Quarterly Security Audit',
    price: '$499/quarter',
    description:
      'Deep manual security review: dependency graph, auth flows, API surface, secrets management, and OWASP Top 10 checklist. Written report with remediation roadmap.',
    applicablePlans: ['essential', 'growth'],
  },
  {
    slug: 'performance-load-testing',
    name: 'Performance & Load Testing',
    price: '$299/test',
    description:
      'Simulate real traffic spikes — identify bottlenecks before your next launch or campaign. Full report with before/after metrics.',
    applicablePlans: ['essential', 'growth', 'scale'],
  },
  {
    slug: 'database-optimization',
    name: 'Database Optimization',
    price: '$399 one-time',
    description:
      'Query profiling, index analysis, schema review, and N+1 elimination. Documented improvements with before/after query times.',
    applicablePlans: ['essential', 'growth', 'scale'],
  },
];
