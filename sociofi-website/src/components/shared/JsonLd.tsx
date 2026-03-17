/**
 * JsonLd — injects JSON-LD structured data into the page <head>.
 * Used for Organization, WebSite, and BreadcrumbList schemas.
 */

const SITE_URL = 'https://sociofi.tech';

// ── Schema types ──────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface JsonLdProps {
  type: 'organization' | 'website' | 'breadcrumb';
  breadcrumbs?: BreadcrumbItem[];
}

// ── JSON-LD data builders ─────────────────────────────────────────────────────

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
      email: 'hello@sociofi.tech',
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
    publisher: {
      '@type': 'Organization',
      name: 'SocioFi Technology',
    },
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function JsonLd({ type, breadcrumbs }: JsonLdProps) {
  let schema: object;

  switch (type) {
    case 'organization':
      schema = organizationSchema();
      break;
    case 'website':
      schema = websiteSchema();
      break;
    case 'breadcrumb':
      if (!breadcrumbs || breadcrumbs.length === 0) return null;
      schema = breadcrumbSchema(breadcrumbs);
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export function OrganizationJsonLd() {
  return <JsonLd type="organization" />;
}

export function WebsiteJsonLd() {
  return <JsonLd type="website" />;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return <JsonLd type="breadcrumb" breadcrumbs={items} />;
}
