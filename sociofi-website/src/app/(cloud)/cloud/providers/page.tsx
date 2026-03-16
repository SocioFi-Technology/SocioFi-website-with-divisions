import type { Metadata } from 'next';
import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import { Globe, CloudIcon, Lightning, Rocket } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Providers \u2014 SocioFi Cloud',
  description:
    'SocioFi Cloud manages infrastructure on AWS, DigitalOcean, Hetzner, and Vercel. No lock-in \u2014 we work with your existing provider or recommend the best fit.',
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'Cloud \u00b7 Providers',
    headline: (
      <>
        We manage any cloud.
        <br />
        <span className="gradient-text">You choose the provider.</span>
      </>
    ),
    description:
      "SocioFi Cloud is provider-agnostic. We manage infrastructure on AWS, DigitalOcean, Hetzner, and Vercel \u2014 or on your existing cloud account. The management layer is identical regardless of where the servers run.",
    buttons: [
      { label: 'Get hosted', href: '/cloud/get-hosted', variant: 'primary' },
      { label: 'Compare plans', href: '/cloud/plans', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Why provider choice matters',
    headline: "One cloud doesn't fit every app.",
    description:
      "AWS is powerful but complex. DigitalOcean is straightforward but limited at scale. Hetzner is cost-efficient for predictable workloads. Vercel is ideal for frontend-heavy stacks. We match your app to the right provider \u2014 and manage it so the choice doesn't matter day to day.",
    points: [
      'AWS complexity often requires a dedicated DevOps engineer to navigate IAM, VPCs, security groups, and pricing \u2014 just to run a small app',
      'Hetzner offers 3\u20135x the compute for the same price as AWS, but requires more manual configuration work',
      "Vercel handles frontend deployments elegantly but isn't designed for stateful backends or custom infrastructure",
      'Lock-in is real \u2014 moving between providers without documentation and automation scripts means starting from scratch',
    ],
  },

  capabilitiesLabel: 'Supported providers',
  capabilitiesTitle: 'One management layer. Four providers.',
  capabilities: [
    {
      icon: <Globe size={24} />,
      title: 'Amazon Web Services (AWS)',
      description:
        'The most complete cloud platform. Ideal for complex architectures, high-scale systems, and teams with compliance requirements. We manage EC2, RDS, S3, CloudFront, and supporting services.',
    },
    {
      icon: <CloudIcon size={24} />,
      title: 'DigitalOcean',
      description:
        'Straightforward, predictable pricing with strong tooling for small and medium workloads. Droplets, Managed Databases, Spaces object storage \u2014 all managed by our team.',
    },
    {
      icon: <Lightning size={24} />,
      title: 'Hetzner Cloud',
      description:
        'Best price-to-performance ratio in Europe and North America. Ideal for compute-heavy workloads, batch processing, and teams optimizing for cost efficiency.',
    },
    {
      icon: <Rocket size={24} />,
      title: 'Vercel',
      description:
        "The right choice for Next.js and frontend-centric stacks. We manage deployments, environment configuration, team access, and integration with your backend services.",
    },
  ],

  processLabel: 'How we choose',
  processTitle: 'Right provider. Right fit.',
  process: [
    {
      title: 'Understand your requirements',
      description:
        'Traffic patterns, stack, compliance needs, budget, and geography \u2014 all factor into provider selection. We ask before we recommend.',
    },
    {
      title: 'Recommend the right provider',
      description:
        'Based on your requirements, we recommend the provider that gives you the best combination of performance, cost, and manageability.',
    },
    {
      title: 'Provision under your account',
      description:
        'We provision infrastructure under your own provider account \u2014 you own the billing relationship and have direct access. No lock-in to SocioFi.',
    },
    {
      title: 'Configure and harden',
      description:
        'Networking, security groups, SSL, backups, monitoring agents \u2014 all set up according to our managed baseline before your app goes live.',
    },
    {
      title: 'Ongoing management',
      description:
        'Once running, we manage it continuously \u2014 updates, scaling, incident response, and regular infrastructure reviews.',
    },
  ],

  faqs: [
    {
      question: 'Can I bring my existing provider account?',
      answer:
        'Yes \u2014 this is the most common setup. We add our management layer on top of your existing AWS, DigitalOcean, or Hetzner account. You keep the billing relationship with the provider. We handle everything else.',
    },
    {
      question: 'Can you migrate me from one provider to another?',
      answer:
        'Yes. We handle full migrations \u2014 infrastructure provisioning on the new provider, data migration, DNS cutover, and traffic validation \u2014 with zero downtime. Typical timeline is 2\u20135 days depending on complexity.',
    },
    {
      question: 'Do you support multi-cloud setups?',
      answer:
        'Yes, on the Enterprise plan. Running your backend on AWS and frontend on Vercel, for example, is a common configuration we manage as a single system.',
    },
    {
      question: 'What if I want to move away from SocioFi Cloud?',
      answer:
        'We provide full handover documentation: all infrastructure configurations, runbooks, access credentials, and architecture diagrams. Switching to another team or self-managing takes one week, not months.',
    },
  ],

  cta: {
    title: 'Any provider. Zero DevOps.',
    subtitle: 'We manage your infrastructure regardless of where it runs.',
    primaryCTA: { label: 'Get hosted', href: '/cloud/get-hosted' },
    ghostCTA: { label: 'See plans', href: '/cloud/plans' },
    note: 'Provider-agnostic. No lock-in.',
  },
};

export default function ProvidersPage() {
  return <ServiceDetail content={content} />;
}
