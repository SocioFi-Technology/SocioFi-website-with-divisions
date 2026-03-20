export interface CloudPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  badge?: string;
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface CloudAddOn {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export interface CloudProvider {
  id: string;
  name: string;
  shortName: string;
  regions: number;
  speciality: string;
  badge?: string;
}

export const CLOUD_PLANS: CloudPlan[] = [
  {
    id: 'launch',
    name: 'Launch',
    price: 149,
    period: 'month',
    description: 'For founders shipping their first product',
    specs: [
      { label: 'vCPU', value: '2 cores' },
      { label: 'RAM', value: '4 GB' },
      { label: 'Storage', value: '50 GB SSD' },
      { label: 'Bandwidth', value: '1 TB/mo' },
    ],
    features: [
      'Managed deployment pipeline',
      'Automatic SSL certificates',
      'Daily backups (7-day retention)',
      'Basic monitoring & alerts',
      'Email support (48h response)',
      '99.9% uptime SLA',
    ],
    cta: 'Get Hosted',
    highlighted: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 349,
    period: 'month',
    badge: 'Most Popular',
    description: 'For growing products with real traffic',
    specs: [
      { label: 'vCPU', value: '4 cores' },
      { label: 'RAM', value: '16 GB' },
      { label: 'Storage', value: '200 GB NVMe' },
      { label: 'Bandwidth', value: '5 TB/mo' },
    ],
    features: [
      'Everything in Launch',
      'Auto-scaling (up to 8 cores)',
      'Hourly backups (30-day retention)',
      'Full observability stack',
      'Priority support (4h response)',
      'Zero-downtime deployments',
      '99.95% uptime SLA',
      'CDN integration',
    ],
    cta: 'Get Hosted',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 799,
    period: 'month',
    description: 'For production systems that cannot fail',
    specs: [
      { label: 'vCPU', value: '16 cores' },
      { label: 'RAM', value: '64 GB' },
      { label: 'Storage', value: '1 TB NVMe' },
      { label: 'Bandwidth', value: 'Unlimited' },
    ],
    features: [
      'Everything in Professional',
      'Unlimited auto-scaling',
      'Continuous backups (90-day retention)',
      'Dedicated account engineer',
      '24/7 phone + Slack support',
      'Multi-region redundancy',
      '99.99% uptime SLA',
      'Custom infrastructure config',
      'Compliance-ready (SOC2/GDPR)',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export const CLOUD_ADDONS: CloudAddOn[] = [
  { id: 'extra-storage', name: 'Extra Storage', price: 20, unit: '100 GB/mo', description: 'Additional SSD storage blocks' },
  { id: 'extra-bandwidth', name: 'Extra Bandwidth', price: 15, unit: '1 TB/mo', description: 'Beyond your plan allowance' },
  { id: 'db-managed', name: 'Managed Database', price: 79, unit: 'instance/mo', description: 'Postgres or MySQL, fully managed' },
  { id: 'redis', name: 'Managed Redis', price: 39, unit: 'instance/mo', description: 'In-memory cache and queue' },
  { id: 'search', name: 'Search Service', price: 59, unit: 'instance/mo', description: 'Elasticsearch-compatible full-text search' },
  { id: 'cdn', name: 'Global CDN', price: 29, unit: 'mo', description: 'Edge caching in 40+ locations' },
];

export const CLOUD_PROVIDERS: CloudProvider[] = [
  { id: 'aws', name: 'Amazon Web Services', shortName: 'AWS', regions: 34, speciality: 'Largest ecosystem, maximum compatibility', badge: 'Default' },
  { id: 'gcp', name: 'Google Cloud Platform', shortName: 'GCP', regions: 40, speciality: 'Best for ML workloads and global networking' },
  { id: 'azure', name: 'Microsoft Azure', shortName: 'Azure', regions: 60, speciality: 'Ideal for Microsoft stack and enterprise compliance' },
  { id: 'do', name: 'DigitalOcean', shortName: 'DO', regions: 15, speciality: 'Simple pricing, developer-friendly, cost-effective' },
  { id: 'hetzner', name: 'Hetzner Cloud', shortName: 'Hetzner', regions: 6, speciality: 'Best price-to-performance ratio in Europe' },
];
