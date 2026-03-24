/**
 * JsonLd — injects JSON-LD structured data into the page <head>.
 *
 * Root schemas (Organization, WebSite) are injected in app/layout.tsx.
 * Division schemas are injected in their respective layout.tsx files.
 * BreadcrumbJsonLd can be used on any page.
 */

const SITE_URL = 'https://sociofitechnology.com';

const PROVIDER = {
  '@type': 'Organization',
  name: 'SocioFi Technology',
  url: SITE_URL,
};

// ── Root schemas ──────────────────────────────────────────────────────────────

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SocioFi Technology',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'AI-agent-native software development company. Seven specialist divisions covering product development, maintenance, hosting, education, research, products, and startup ventures.',
    foundingDate: '2024',
    founders: [
      { '@type': 'Person', name: 'Arifur Rahman', jobTitle: 'CEO' },
      { '@type': 'Person', name: 'Kamrul Hasan', jobTitle: 'CTO' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@sociofitechnology.com',
    },
    sameAs: [],
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SocioFi Technology',
    url: SITE_URL,
    description:
      'AI-agent-native software development. From prototype to production-ready product.',
    publisher: { '@type': 'Organization', name: 'SocioFi Technology' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/labs/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

// ── Division schemas ──────────────────────────────────────────────────────────

/** Studio — ProfessionalService */
function studioSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'SocioFi Studio',
    description:
      'AI-accelerated custom software development. From prototype to production in weeks, with expert engineers who own the outcome.',
    url: `${SITE_URL}/studio`,
    provider: PROVIDER,
    areaServed: 'Worldwide',
    serviceType: 'Custom Software Development',
    offers: {
      '@type': 'Offer',
      description: 'Custom software development from prototype to production',
      url: `${SITE_URL}/studio/pricing`,
    },
  };
}

/** Services — Service */
function servicesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'SocioFi Services — Software Maintenance & Support',
    description:
      'Ongoing monitoring, bug fixes, security patches, and feature updates for live software. Guaranteed uptime, expert engineers watching your product 24/7.',
    url: `${SITE_URL}/services`,
    provider: PROVIDER,
    areaServed: 'Worldwide',
    serviceType: 'Software Maintenance and Support',
    offers: {
      '@type': 'Offer',
      description: 'Monthly software maintenance and support plans',
      url: `${SITE_URL}/services/plans`,
    },
  };
}

/** Labs — ResearchOrganization */
function labsSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: 'SocioFi Labs',
    description:
      'Open research into AI-native development. Tools, techniques, and hard-won lessons from building real software with AI agents in production.',
    url: `${SITE_URL}/labs`,
    parentOrganization: PROVIDER,
    knowsAbout: [
      'AI-native software development',
      'Large language model engineering',
      'AI agent systems',
      'Software delivery automation',
    ],
  };
}

/** Products — ItemList of SoftwareApplication */
function productsSchema() {
  const products = [
    {
      name: 'FabricxAI',
      description:
        'AI-powered manufacturing intelligence platform. Real-time visibility, defect detection, and production optimization.',
      url: `${SITE_URL}/products/fabricxai`,
      applicationCategory: 'BusinessApplication',
    },
    {
      name: 'NEXUS ARIA',
      description:
        'Enterprise data analysis AI. Connect your data sources and get instant answers, reports, and forecasts.',
      url: `${SITE_URL}/products/nexus-aria`,
      applicationCategory: 'BusinessApplication',
    },
    {
      name: 'DevBridge',
      description:
        'AI-driven software delivery platform. Automates the path from requirements to deployed, tested code.',
      url: `${SITE_URL}/products/devbridge`,
      applicationCategory: 'DeveloperApplication',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SocioFi Products',
    description: 'AI-powered software platforms built by SocioFi Technology.',
    url: `${SITE_URL}/products`,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: p.name,
        description: p.description,
        url: p.url,
        applicationCategory: p.applicationCategory,
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', url: p.url },
        author: PROVIDER,
      },
    })),
  };
}

/** Academy — EducationalOrganization */
function academySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'SocioFi Academy',
    description:
      'Practical AI development courses for non-technical founders, business leaders, and teams. Learn to build, manage, and ship AI-powered products.',
    url: `${SITE_URL}/academy`,
    parentOrganization: PROVIDER,
    offers: {
      '@type': 'Offer',
      description: 'Online AI development courses and workshops',
      url: `${SITE_URL}/academy/courses`,
      category: 'Online Course',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Development Courses',
      url: `${SITE_URL}/academy/courses`,
    },
  };
}

/** Ventures — Organization (investment/co-building) */
function venturesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SocioFi Ventures',
    description:
      'Equity-based and revenue-share co-building partnerships for technical founders. We bring the full engineering team; you keep control and ownership.',
    url: `${SITE_URL}/ventures`,
    parentOrganization: PROVIDER,
    areaServed: 'Worldwide',
    knowsAbout: [
      'Startup co-building',
      'Equity partnerships',
      'Technical co-founding',
      'Software startup development',
    ],
  };
}

/** Cloud — Service */
function cloudSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'SocioFi Cloud — Managed Cloud Hosting',
    description:
      'Fully managed cloud hosting with no DevOps required. We handle infrastructure, uptime, scaling, and security.',
    url: `${SITE_URL}/cloud`,
    provider: PROVIDER,
    areaServed: 'Worldwide',
    serviceType: 'Managed Cloud Hosting',
    offers: {
      '@type': 'Offer',
      description: 'Monthly managed cloud hosting plans',
      url: `${SITE_URL}/cloud/plans`,
    },
  };
}

/** Agents — ItemList of Product (AI agents) */
function agentsSchema() {
  const categories = [
    { name: 'Sales Agents', url: `${SITE_URL}/agents/categories/sales` },
    { name: 'Support Agents', url: `${SITE_URL}/agents/categories/support` },
    { name: 'Operations Agents', url: `${SITE_URL}/agents/categories/operations` },
    { name: 'Data Agents', url: `${SITE_URL}/agents/categories/data` },
    { name: 'Document Agents', url: `${SITE_URL}/agents/categories/documents` },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SocioFi Agents — AI Agent Catalog',
    description:
      'Subscribe to individual AI agents — each built for one specific task. 16 agents across sales, support, operations, data, and documents.',
    url: `${SITE_URL}/agents/catalog`,
    numberOfItems: 16,
    itemListElement: categories.map((cat, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: cat.name,
        url: cat.url,
        brand: PROVIDER,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/agents/pricing`,
        },
      },
    })),
  };
}

// ── Renderer ──────────────────────────────────────────────────────────────────

function Ld({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  href: string;
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function OrganizationJsonLd()  { return <Ld schema={organizationSchema()} />; }
export function WebsiteJsonLd()       { return <Ld schema={websiteSchema()} />; }
export function StudioJsonLd()        { return <Ld schema={studioSchema()} />; }
export function ServicesJsonLd()      { return <Ld schema={servicesSchema()} />; }
export function LabsJsonLd()          { return <Ld schema={labsSchema()} />; }
export function ProductsJsonLd()      { return <Ld schema={productsSchema()} />; }
export function AcademyJsonLd()       { return <Ld schema={academySchema()} />; }
export function VenturesJsonLd()      { return <Ld schema={venturesSchema()} />; }
export function CloudJsonLd()         { return <Ld schema={cloudSchema()} />; }
export function AgentsJsonLd()        { return <Ld schema={agentsSchema()} />; }

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;
  return <Ld schema={breadcrumbSchema(items)} />;
}

/** @deprecated Use the named exports above instead */
export default function JsonLd({
  type,
  breadcrumbs,
}: {
  type: 'organization' | 'website' | 'breadcrumb';
  breadcrumbs?: BreadcrumbItem[];
}) {
  if (type === 'organization') return <OrganizationJsonLd />;
  if (type === 'website')      return <WebsiteJsonLd />;
  if (type === 'breadcrumb' && breadcrumbs) return <BreadcrumbJsonLd items={breadcrumbs} />;
  return null;
}
