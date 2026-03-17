import DetailPage, { type DetailPageContent } from '@/templates/DetailPage';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ── Portfolio item data ───────────────────────────────────────────────────────

const ITEMS: Record<string, { metadata: Metadata; content: DetailPageContent }> = {

  'rescue-to-launch': {
    metadata: {
      title: 'Rescue to Launch: 10,000 users in 8 weeks — SocioFi Studio',
      description:
        'How we took a broken AI-generated prototype, rebuilt its architecture, added proper auth and payments, and launched to 10,000 active users in 8 weeks.',
    },
    content: {
      meta: {
        category: 'Studio · Case Study',
        title: 'From broken prototype to 10,000 active users in 8 weeks',
        subtitle:
          "A founder had a working demo — but it crashed under load, had no authentication, and couldn't connect to Stripe. We fixed all of it and launched in 8 weeks.",
        client: 'BuildFlow',
        duration: '8 weeks',
        tags: ['Rescue', 'Next.js', 'PostgreSQL', 'Stripe'],
      },
      intro:
        "Marcus came to us with a SaaS prototype he'd built using an AI coding platform over three months. The demo looked impressive. But when he tried to onboard his first paying users, the cracks appeared immediately. We took the project from broken prototype to a live, stable product — with 10,000 active users eight weeks after launch.",
      sections: [
        {
          label: 'The problem',
          headline: 'What the audit found',
          body: (
            <>
              <p style={{ margin: '0 0 16px' }}>
                Our 48-hour codebase audit identified six critical issues, any one of which would have caused serious problems after launch.
              </p>
              <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
                {[
                  'Authentication relied on client-side checks that could be bypassed in the browser console',
                  'The database schema had no relational integrity — deleting a user left orphaned records everywhere',
                  'Stripe was wired to test mode with hardcoded keys committed to the public repository',
                  'No error handling — any unhandled exception returned a 500 with a full stack trace to the client',
                  'The app had no deployment pipeline — the founder was manually copying files to a shared hosting account',
                  'Session tokens were stored in localStorage and never expired',
                ].map((item, i) => (
                  <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          label: 'The approach',
          headline: 'Rebuild what needed rebuilding. Keep what worked.',
          body: (
            <>
              <p style={{ margin: '0 0 16px' }}>
                Not everything needed to be replaced. The UI was well-designed. The core business logic was sound. The problem was in the infrastructure, authentication, and data layer.
              </p>
              <p style={{ margin: '0 0 16px' }}>
                We scoped a four-week rescue: new auth layer using NextAuth with proper server-side session management, database schema refactor with foreign key constraints and cascading deletes, Stripe integration rebuilt with proper webhook handling, error boundaries and logging, and a deployment pipeline on Vercel with staging and production environments.
              </p>
              <p style={{ margin: 0 }}>
                Weeks five and six were QA and load testing. We simulated 1,000 concurrent users before we let a single real one through. When we launched, the infrastructure held.
              </p>
            </>
          ),
        },
        {
          label: 'The result',
          headline: 'Launched. Stable. Growing.',
          body: (
            <p style={{ margin: 0 }}>
              BuildFlow launched publicly in week eight. The first week brought 800 signups from a Product Hunt post. By week twelve, they had 10,000 active users and had processed $47,000 in subscription revenue. There were zero critical post-launch bugs.
            </p>
          ),
        },
      ],
      outcomes: [
        { numeric: 8, label: 'Weeks from rescue start to launch' },
        { numeric: 10000, label: 'Active users within 12 weeks' },
        { numeric: 0, label: 'Critical post-launch bugs' },
        { numeric: 47, suffix: 'k', label: 'Dollars in subscription revenue, first 12 weeks' },
      ],
      related: [
        {
          title: 'Rescue & Ship',
          description:
            'Your AI-generated prototype is broken or stuck. We diagnose what went wrong, fix it, and get you to launch — usually in 2–4 weeks.',
          href: '/studio/services/rescue-ship',
          linkText: 'Learn more',
        },
        {
          title: 'For Founders',
          description:
            "You've built a prototype with AI tools. Now you need someone to make it production-ready. We're that team.",
          href: '/studio/solutions/for-founders',
          linkText: 'Learn more',
        },
        {
          title: 'Start a project',
          description:
            'Tell us what you need. We respond within 4 hours with an honest assessment and a clear path forward.',
          href: '/studio/start-project',
          linkText: 'Get in touch',
        },
      ],
      relatedLabel: 'Related services',
      relatedTitle: 'Working on something similar?',
      cta: {
        title: 'Is your prototype where BuildFlow was?',
        subtitle:
          'We audit codebases in 48 hours and give you a clear picture of what it would take to launch safely.',
        primaryCTA: { label: 'Get a codebase audit', href: '/studio/start-project' },
        ghostCTA: { label: 'See Rescue & Ship', href: '/studio/services/rescue-ship' },
        note: 'Audit completed within 48 hours. Fixed-scope rescue proposal follows.',
      },
    },
  },

  'fintech-dashboard': {
    metadata: {
      title: 'Fintech Operations Dashboard — SocioFi Studio',
      description:
        'How we replaced a business-critical Google Sheets workflow with a proper role-based internal dashboard for a lending company.',
    },
    content: {
      meta: {
        category: 'Studio · Case Study',
        title: 'Fintech operations dashboard: replacing critical spreadsheets',
        subtitle:
          'A lending company was running loan application review, risk assessment, and portfolio management in a shared Google Sheet. Twelve people. One wrong formula from a data disaster.',
        client: 'DataNest',
        duration: '6 weeks',
        tags: ['Internal Tools', 'React', 'PostgreSQL', 'Charts'],
      },
      intro:
        'DataNest was a fast-growing SME lending company with a genuine operational problem: their entire loan management workflow ran in a single shared Google Sheet. It worked — until it didn\'t. Version conflicts, accidental overwrites, no audit trail, no access controls. We built a proper internal dashboard in six weeks.',
      sections: [
        {
          label: 'The problem',
          headline: 'A business-critical process in a spreadsheet',
          body: (
            <p style={{ margin: 0 }}>
              Twelve people — loan officers, risk analysts, and operations managers — were sharing a single Google Sheet to manage 300+ active loan applications. There was no access control: anyone could see anyone else&apos;s notes. There was no audit trail: nobody could tell who changed what or when. Twice in the previous year, a formula error had corrupted data across multiple rows. The team had been talking about fixing it for 18 months.
            </p>
          ),
        },
        {
          label: 'The solution',
          headline: 'Role-based dashboard with real data integrity',
          body: (
            <>
              <p style={{ margin: '0 0 16px' }}>
                We built a React dashboard backed by PostgreSQL, with role-based access control so loan officers only see their own applications, risk analysts see what they need for review, and managers have full visibility with export capabilities.
              </p>
              <p style={{ margin: 0 }}>
                Every action is logged. Every status change, note, and decision has an author, a timestamp, and is immutable in the audit log. The data model was designed to handle the edge cases their spreadsheet had been papering over for years.
              </p>
            </>
          ),
        },
      ],
      outcomes: [
        { numeric: 6, label: 'Weeks from scoping call to live' },
        { numeric: 12, label: 'Team members onboarded at launch' },
        { numeric: 0, label: 'Data incidents since launch (vs 2 per year previously)' },
        { numeric: 300, suffix: '+', label: 'Active applications managed in the system' },
      ],
      related: [
        {
          title: 'Internal Tools',
          description:
            'The dashboard your team actually needs. Built for your exact workflow — not a generic template.',
          href: '/studio/solutions/for-smbs',
          linkText: 'Learn more',
        },
        {
          title: 'Start a project',
          description:
            'Tell us what your team needs. We scope internal tools in a single call and give you a fixed price.',
          href: '/studio/start-project',
          linkText: 'Get in touch',
        },
      ],
      relatedLabel: 'Related',
      relatedTitle: 'Similar needs?',
      cta: {
        title: 'Running something critical in a spreadsheet?',
        subtitle:
          'Tell us the workflow. We\'ll scope what a proper system looks like and what it would cost.',
        primaryCTA: { label: 'Discuss your project', href: '/studio/start-project' },
        ghostCTA: { label: 'Built for SMBs', href: '/studio/solutions/for-smbs' },
        note: 'Fixed-scope pricing. Usually 4–8 weeks to delivery.',
      },
    },
  },

  'ecommerce-replatform': {
    metadata: {
      title: 'E-commerce Replatform: 40,000 SKUs, 60% Faster — SocioFi Studio',
      description:
        'How we migrated a 6-year-old WooCommerce store to a modern Next.js storefront — 60% faster pages, 22% less cart abandonment, 85% lower hosting costs.',
    },
    content: {
      meta: {
        category: 'Studio · Case Study',
        title: 'E-commerce replatform: 40,000 SKUs, 60% faster',
        subtitle:
          'A 6-year-old WooCommerce store was slow, expensive to host, and painful to update. We migrated it to a modern stack without losing a single order during the transition.',
        client: 'RetailCo',
        duration: '10 weeks',
        tags: ['Product Development', 'Next.js', 'Shopify API', 'Performance'],
      },
      intro:
        "RetailCo had been running on WooCommerce since 2018. Six years of plugins, customisations, and legacy code had made the site slow (4.2s average page load), expensive to host ($800/month), and painful to update. We rebuilt it from scratch and migrated them over in 10 weeks.",
      sections: [
        {
          label: 'The challenge',
          headline: 'Migrate 40,000 SKUs without disruption',
          body: (
            <p style={{ margin: 0 }}>
              The hardest part of any replatform is the migration itself: 40,000 product SKUs, 8 years of order history, 50,000 customer accounts, and ongoing order processing that couldn&apos;t pause for a moment. We built and tested the new platform in parallel, ran a dark migration of the product catalog, and cut over with zero downtime during a low-traffic window.
            </p>
          ),
        },
        {
          label: 'The result',
          headline: 'Faster, cheaper, better',
          body: (
            <p style={{ margin: 0 }}>
              The new Next.js storefront loads in 1.7 seconds (down from 4.2). Hosting costs dropped from $800 to $120 per month. Cart abandonment fell by 22% in the first 60 days — attributable almost entirely to the speed improvement. The team can now push product updates and new pages without touching the codebase.
            </p>
          ),
        },
      ],
      outcomes: [
        { numeric: 60, suffix: '%', label: 'Reduction in page load time' },
        { numeric: 22, suffix: '%', label: 'Reduction in cart abandonment' },
        { numeric: 85, suffix: '%', label: 'Reduction in monthly hosting cost' },
        { numeric: 0, label: 'Orders lost during migration' },
      ],
      related: [
        {
          title: 'Product Development',
          description:
            'Building a full-stack product from scratch? We architect, build, and ship.',
          href: '/studio/services/product-development',
          linkText: 'Learn more',
        },
        {
          title: 'Start a project',
          description:
            'Tell us what you need to build or migrate. We scope clearly and give you a fixed price.',
          href: '/studio/start-project',
          linkText: 'Get in touch',
        },
      ],
      relatedLabel: 'Related',
      relatedTitle: 'Building something similar?',
      cta: {
        title: 'Is your tech stack holding you back?',
        subtitle:
          "Tell us what you're running and what's broken. We'll scope a migration or rebuild and tell you what it costs.",
        primaryCTA: { label: 'Discuss your project', href: '/studio/start-project' },
        ghostCTA: { label: 'See our work', href: '/studio/portfolio' },
        note: 'Free scoping call. Fixed-scope pricing.',
      },
    },
  },
};

// ── Route handlers ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(ITEMS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = ITEMS[slug];
  if (!item) return {};
  return item.metadata;
}

export default async function StudioPortfolioItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = ITEMS[slug];
  if (!item) notFound();
  return <DetailPage content={item.content} />;
}
