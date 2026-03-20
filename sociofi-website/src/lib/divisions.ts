export type DivisionSlug =
  | 'technology'
  | 'studio'
  | 'services'
  | 'labs'
  | 'products'
  | 'academy'
  | 'ventures'
  | 'cloud'
  | 'agents';

export type LogoModifier =
  | 'none'
  | 'corner-brackets'
  | 'signal-arcs'
  | 'particle-dots'
  | 'stacked-diamonds'
  | 'open-book'
  | 'ascending-branch'
  | 'stacked-lines'
  | 'agent-node-network';

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavLink {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

export interface DivisionCTA {
  label: string;
  href: string;
}

export interface Division {
  name: string;
  slug: DivisionSlug;
  accent: string;
  accentLight: string;
  accentDark: string;
  subtitle: string;
  description: string;
  navLinks: NavLink[];
  cta: DivisionCTA | null;
  modifier: LogoModifier;
  url: string;
}

export const divisions: Record<DivisionSlug, Division> = {
  technology: {
    name: 'SocioFi Technology',
    slug: 'technology',
    accent: '#4A6CB8',
    accentLight: '#6B8CD4',
    accentDark: '#2C4478',
    subtitle: 'AI-Native Development',
    description: 'AI-agent-native software development. We build what you imagine.',
    modifier: 'none',
    cta: null,
    url: '/',
    navLinks: [
      { label: 'Agents', href: '/agents', dropdown: [
        { label: 'Browse Catalog', href: '/agents/catalog', description: 'All 16 agents — subscribe and deploy' },
        { label: 'How It Works', href: '/agents/how-it-works', description: 'Our 4-phase agent deployment process' },
        { label: 'Custom Agents', href: '/agents/custom', description: 'Custom agent pipelines for your business' },
        { label: 'Pricing', href: '/agents/pricing', description: 'Monthly subscription plans' },
      ]},
      { label: 'Studio', href: '/studio', dropdown: [
        { label: 'Product Development', href: '/studio/services/product-development', description: 'Full-stack apps, built with AI' },
        { label: 'AI Agent Systems', href: '/studio/services/ai-agent-systems', description: 'Custom agent pipelines, deployed' },
        { label: 'Rescue & Ship', href: '/studio/services/rescue-ship', description: 'Fix broken builds and get to launch' },
        { label: 'Portfolio', href: '/studio/portfolio', description: "Work we've shipped" },
        { label: 'Process', href: '/studio/process', description: 'How we build' },
        { label: 'Pricing', href: '/studio/pricing', description: 'Transparent fixed packages' },
      ]},
      { label: 'Services', href: '/services', dropdown: [
        { label: 'How It Works', href: '/services/how-it-works', description: 'Our ongoing support model' },
        { label: 'Plans', href: '/services/plans', description: 'Monthly retainer plans' },
        { label: 'Monitoring', href: '/services/monitoring', description: '24/7 uptime and performance' },
        { label: 'Security', href: '/services/security', description: 'Vulnerability patches and audits' },
      ]},
      { label: 'Labs', href: '/labs', dropdown: [
        { label: 'Research', href: '/labs/research', description: "What we're exploring" },
        { label: 'Open Source', href: '/labs/open-source', description: "Tools we've released" },
        { label: 'Blog', href: '/labs/blog', description: 'Technical writing' },
      ]},
      { label: 'Products', href: '/products', dropdown: [
        { label: 'FabricxAI', href: '/products/fabricxai', description: 'AI workflow automation' },
        { label: 'NEXUS ARIA', href: '/products/nexus-aria', description: 'Conversational AI platform' },
        { label: 'DevBridge', href: '/products/devbridge', description: 'No-code to production bridge' },
      ]},
      { label: 'Academy', href: '/academy', dropdown: [
        { label: 'Courses', href: '/academy/courses', description: 'Self-paced learning paths' },
        { label: 'Workshops', href: '/academy/workshops', description: 'Live, hands-on sessions' },
        { label: 'Free Resources', href: '/academy/free', description: 'Start learning today' },
      ]},
      { label: 'Ventures', href: '/ventures' },
      { label: 'Cloud', href: '/cloud' },
      { label: 'About', href: '/about' },
    ],
  },

  studio: {
    name: 'SocioFi Studio',
    slug: 'studio',
    accent: '#72C4B2',
    accentLight: '#A3DFD2',
    accentDark: '#4E9B8C',
    subtitle: 'Software Development',
    description: 'Custom software development — AI-accelerated, human-quality. From prototype to production.',
    modifier: 'corner-brackets',
    cta: { label: 'Start a Project', href: '/studio/start-project' },
    url: '/studio',
    navLinks: [
      { label: 'Services', href: '/studio/services', dropdown: [
        { label: 'AI Agent Systems', href: '/studio/services/ai-agent-systems', description: 'Custom agent pipelines for your business' },
        { label: 'Product Development', href: '/studio/services/product-development', description: 'From idea to scaled product' },
        { label: 'Rescue & Ship', href: '/studio/services/rescue-ship', description: 'Already started? We take it from here' },
        { label: 'Automation & Integration', href: '/studio/services/automation-integration', description: 'Stop doing manually what software can do' },
        { label: 'Internal Tools', href: '/studio/services/internal-tools', description: 'The dashboard your team actually needs' },
        { label: 'Architecture Consulting', href: '/studio/services/architecture-consulting', description: 'Get the architecture right before you build' },
        { label: 'Maintenance & Support', href: '/studio/services/maintenance-support', description: 'Keep your live product running' },
      ]},
      { label: 'Solutions', href: '/studio/solutions', dropdown: [
        { label: 'For Founders', href: '/studio/solutions/for-founders', description: 'Prototype → production, fast' },
        { label: 'For SMBs', href: '/studio/solutions/for-smbs', description: 'Internal tools and automation' },
        { label: 'For Enterprise', href: '/studio/solutions/for-enterprises', description: 'Ship without a dev team' },
      ]},
      { label: 'Portfolio', href: '/studio/portfolio' },
      { label: 'Process', href: '/studio/process' },
      { label: 'Pricing', href: '/studio/pricing' },
    ],
  },

  services: {
    name: 'SocioFi Services',
    slug: 'services',
    accent: '#4DBFA8',
    accentLight: '#7DD4C0',
    accentDark: '#329880',
    subtitle: 'Ongoing Support & Maintenance',
    description: 'Ongoing monitoring, support, and maintenance for live software. Your product stays healthy.',
    modifier: 'signal-arcs',
    cta: { label: 'Get Protected', href: '/services/get-protected' },
    url: '/services',
    navLinks: [
      { label: 'How It Works', href: '/services/how-it-works' },
      { label: 'Plans', href: '/services/plans', dropdown: [
        { label: 'Starter Plan', href: '/services/plans#starter', description: 'Essential monitoring and fixes' },
        { label: 'Growth Plan', href: '/services/plans#growth', description: 'Full-coverage support' },
        { label: 'Scale Plan', href: '/services/plans#scale', description: 'Dedicated engineering retainer' },
      ]},
      { label: 'Monitoring', href: '/services/monitoring' },
      { label: 'Security', href: '/services/security' },
      { label: 'Bug Fixes', href: '/services/bug-fixes' },
      { label: 'Feature Updates', href: '/services/feature-updates' },
      { label: 'Performance', href: '/services/performance' },
    ],
  },

  labs: {
    name: 'SocioFi Labs',
    slug: 'labs',
    accent: '#7B6FE8',
    accentLight: '#A59BF0',
    accentDark: '#5A4FC8',
    subtitle: 'Research & Open Source',
    description: 'Where we experiment, publish, and release. Open research into AI-native development.',
    modifier: 'particle-dots',
    cta: null,
    url: '/labs',
    navLinks: [
      { label: 'Research', href: '/labs/research' },
      { label: 'Projects', href: '/labs/projects' },
      { label: 'Open Source', href: '/labs/open-source' },
      { label: 'Blog', href: '/labs/blog' },
    ],
  },

  products: {
    name: 'SocioFi Products',
    slug: 'products',
    accent: '#E8916F',
    accentLight: '#F0B49A',
    accentDark: '#C8694A',
    subtitle: 'AI-Powered Products',
    description: 'Ready-to-deploy AI-powered products. Real tools for real workflows.',
    modifier: 'stacked-diamonds',
    cta: { label: 'View Products', href: '/products' },
    url: '/products',
    navLinks: [
      { label: 'FabricxAI', href: '/products/fabricxai', dropdown: [
        { label: 'Overview', href: '/products/fabricxai', description: 'AI workflow automation platform' },
        { label: 'Features', href: '/products/fabricxai/features', description: 'What FabricxAI can do' },
        { label: 'Pricing', href: '/products/fabricxai/pricing', description: 'Plans and seats' },
      ]},
      { label: 'NEXUS ARIA', href: '/products/nexus-aria', dropdown: [
        { label: 'Overview', href: '/products/nexus-aria', description: 'Conversational AI for your product' },
        { label: 'Features', href: '/products/nexus-aria/features', description: 'Capabilities and integrations' },
        { label: 'Pricing', href: '/products/nexus-aria/pricing', description: 'Plans and seats' },
      ]},
      { label: 'DevBridge', href: '/products/devbridge', dropdown: [
        { label: 'Overview', href: '/products/devbridge', description: 'No-code to production bridge' },
        { label: 'Features', href: '/products/devbridge/features', description: 'What DevBridge unlocks' },
        { label: 'Pricing', href: '/products/devbridge/pricing', description: 'Plans and seats' },
      ]},
    ],
  },

  academy: {
    name: 'SocioFi Academy',
    slug: 'academy',
    accent: '#E8B84D',
    accentLight: '#F0D080',
    accentDark: '#C8940A',
    subtitle: 'Learning & Training',
    description: 'Learn to build with AI — from prototype to production. Courses for non-technical founders.',
    modifier: 'open-book',
    cta: { label: 'Browse Courses', href: '/academy/courses' },
    url: '/academy',
    navLinks: [
      { label: 'Courses', href: '/academy/courses', dropdown: [
        { label: 'All Courses', href: '/academy/courses', description: 'Browse the full catalog' },
        { label: 'AI Native Fundamentals', href: '/academy/courses/ai-native-fundamentals', description: 'Build with modern AI tools' },
        { label: 'Prototype to Production', href: '/academy/courses/prototype-to-production', description: 'Go from code to live product' },
        { label: 'Multi-Agent Design', href: '/academy/courses/multi-agent-design', description: 'Architect agent systems' },
      ]},
      { label: 'Workshops', href: '/academy/workshops' },
      { label: 'Corporate Training', href: '/academy/corporate' },
      { label: 'Certification', href: '/academy/certification' },
      { label: 'Free Resources', href: '/academy/free' },
    ],
  },

  ventures: {
    name: 'SocioFi Ventures',
    slug: 'ventures',
    accent: '#6BA3E8',
    accentLight: '#9BC0F0',
    accentDark: '#4580C8',
    subtitle: 'Startup Co-Building',
    description: 'We co-build with technical founders. Equity-based partnerships for serious startups.',
    modifier: 'ascending-branch',
    cta: { label: 'Apply', href: '/ventures/apply' },
    url: '/ventures',
    navLinks: [
      { label: 'How It Works', href: '/ventures/how-it-works' },
      { label: 'Portfolio', href: '/ventures/portfolio' },
      { label: 'Apply', href: '/ventures/apply' },
      { label: 'FAQ', href: '/ventures/faq' },
    ],
  },

  cloud: {
    name: 'SocioFi Cloud',
    slug: 'cloud',
    accent: '#5BB5E0',
    accentLight: '#8CD0F0',
    accentDark: '#3890C0',
    subtitle: 'Managed Cloud Hosting',
    description: 'Managed cloud hosting — no DevOps required. We handle infrastructure so you handle product.',
    modifier: 'stacked-lines',
    cta: { label: 'Get Hosted', href: '/cloud/get-hosted' },
    url: '/cloud',
    navLinks: [
      { label: 'Features', href: '/cloud/features' },
      { label: 'Security', href: '/cloud/security' },
      { label: 'Providers', href: '/cloud/providers' },
      { label: 'Plans', href: '/cloud/plans' },
      { label: 'Migration', href: '/cloud/migration' },
    ],
  },

  agents: {
    name: 'SocioFi Agents',
    slug: 'agents',
    accent: '#8B5CF6',
    accentLight: '#A78BFA',
    accentDark: '#6D28D9',
    subtitle: 'AI Agent Systems',
    description: 'Individual AI agents — each built for one specific task — subscribed monthly, deployed into your operations.',
    modifier: 'agent-node-network',
    cta: { label: 'Browse Catalog', href: '/agents/catalog' },
    url: '/agents',
    navLinks: [
      { label: 'Catalog', href: '/agents/catalog', dropdown: [
        { label: 'All Agents', href: '/agents/catalog', description: 'Browse all 16 agents' },
        { label: 'Operations', href: '/agents/categories/operations', description: 'Reports, inventory, compliance' },
        { label: 'Sales', href: '/agents/categories/sales', description: 'Lead qualification, proposals, CRM' },
        { label: 'Support', href: '/agents/categories/support', description: 'Customer service, ticket triage' },
        { label: 'Data', href: '/agents/categories/data', description: 'Processing, cleaning, email triage' },
        { label: 'Documents', href: '/agents/categories/documents', description: 'Contracts, invoices, summaries' },
      ]},
      { label: 'How It Works', href: '/agents/how-it-works' },
      { label: 'Custom Agents', href: '/agents/custom' },
      { label: 'Pricing', href: '/agents/pricing' },
      { label: 'Case Studies', href: '/agents/case-studies' },
    ],
  },
};

export const divisionList = Object.values(divisions).filter(
  (d): d is Division => d.slug !== 'technology'
);

export function getDivision(slug: DivisionSlug | string): Division {
  return divisions[slug as DivisionSlug] ?? divisions.technology;
}
