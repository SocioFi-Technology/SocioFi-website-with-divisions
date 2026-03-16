import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Zap, Globe, Database, Code, Brain, Wrench, Shield, Gear } from '@/lib/icons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ── Deep-dive data map ─────────────────────────────────────────────────────────

const PAGES: Record<string, { metadata: Metadata; content: DeepDiveContent }> = {

  'workflow': {
    metadata: {
      title: 'Workflow Automation — SocioFi Studio',
      description:
        'Automate the manual steps in your business processes. Trigger-based workflows that run without human intervention — reliably, at any volume.',
    },
    content: {
      hero: {
        badge: 'Studio · Automation · Workflow',
        headline: (
          <>
            Workflows That Run{' '}
            <span className="gradient-text">Without You.</span>
          </>
        ),
        description:
          "Every time a human does the same task in the same order — that's a workflow waiting to be automated. We map the process, build the automation, and deploy it so it runs reliably without anyone managing it.",
        buttons: [
          { label: 'Automate a workflow', href: '/studio/start-project', variant: 'primary' },
          { label: 'See automation examples', href: '/studio/services/automation-integration', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: "New customer or order triggers a chain of actions",
          description:
            "Customer signs up → CRM updated, welcome email sent, account provisioned, sales team notified. Every step automatic, every time.",
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: "Approval workflows that currently rely on email chains",
          description:
            "Request submitted → assigned to reviewer → approved or rejected → requester notified → downstream action triggered. Without a single email.",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: "Documents that need processing and routing",
          description:
            "Invoice arrives → data extracted → matched to purchase order → approved and filed. Or: contract received → key clauses extracted → summary emailed to reviewer.",
        },
      ],
      useCasesLabel: 'What we automate',
      useCasesTitle: 'Common workflow patterns',
      deliverable: {
        label: "What you'll get",
        headline: 'A running automation with monitoring and documentation',
        description:
          "We don't just build the happy path. Every automation includes error handling, logging, alerting, and documentation — so you know what it does and what to check when it fails.",
        items: [
          { label: 'Documented workflow specification', detail: 'every trigger, step, and branch in writing before we build' },
          { label: 'Trigger configuration', detail: 'webhook, schedule, event, or API call — whatever starts the workflow' },
          { label: 'Step logic & conditions', detail: 'branching, loops, parallel steps, conditional actions' },
          { label: 'Error handling & retries', detail: 'failed steps are caught, logged, and retried where appropriate' },
          { label: 'Alerting', detail: 'you get notified when something fails and needs attention' },
          { label: 'Logging', detail: 'every run is logged — you can audit what happened and when' },
          { label: 'Handover documentation', detail: 'how to modify, monitor, and extend the automation' },
        ],
      },
      timeline: {
        duration: '1–3 weeks',
        price: 'From $1,500',
        note: 'Simple automations (3–5 steps, single system) run 1 week. Complex multi-system workflows run 2–3 weeks. We quote based on the specific workflow after a 30-minute discovery call.',
      },
      faqs: [
        {
          question: "What triggers can you work with?",
          answer:
            "Webhooks (from any system that sends them), scheduled timers, API calls, file uploads, database events, and form submissions. If a system can emit an event, we can trigger from it.",
        },
        {
          question: "What platforms do you build automations on?",
          answer:
            "We write custom code — not just drag-and-drop tools. For some use cases, a tool like n8n or Zapier is the right answer. For others, custom code is more reliable, cheaper to run, and more maintainable. We recommend the right approach for your situation.",
        },
        {
          question: "What happens when a workflow fails partway through?",
          answer:
            "We design for partial failures. Depending on the steps, we implement idempotent operations (safe to retry), rollback logic, or manual intervention alerts. We tell you exactly how failure is handled during specification.",
        },
        {
          question: "How do we modify the workflow after it's built?",
          answer:
            "We document the workflow clearly and write it in a way that's straightforward to change. If you need ongoing modifications, our maintenance plans cover this.",
        },
      ],
      cta: {
        title: "What process should you stop doing manually?",
        subtitle:
          "Describe the workflow — what starts it, what happens, and what the output is. We'll tell you how to automate it.",
        primaryCTA: { label: 'Describe your workflow', href: '/studio/start-project' },
        ghostCTA: { label: 'See automation examples', href: '/studio/portfolio' },
        note: 'Fixed-scope pricing. No hourly billing.',
      },
    },
  },

  'api-integration': {
    metadata: {
      title: 'API Integration — SocioFi Studio',
      description:
        'Connect your systems and tools. Payment processors, CRMs, data sources, communication platforms — integrated properly, including the edge cases.',
    },
    content: {
      hero: {
        badge: 'Studio · Automation · API Integration',
        headline: (
          <>
            Connect Your Systems.{' '}
            <span className="gradient-text">All of Them.</span>
          </>
        ),
        description:
          "Your tools don't talk to each other. Data moves between them manually, or not at all. We build the integrations that connect your systems — payment processors, CRMs, communication platforms, data providers — and handle all the edge cases the documentation doesn't mention.",
        buttons: [
          { label: 'Connect my systems', href: '/studio/start-project', variant: 'primary' },
          { label: 'See integration types', href: '/studio/services/automation-integration', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: "Payment processing — the full lifecycle",
          description:
            "Stripe, Paddle, LemonSqueezy. Not just the checkout flow — subscriptions, upgrades, downgrades, refunds, disputes, tax handling, and the webhooks that power all of it.",
        },
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: "CRM and data sync",
          description:
            "Salesforce, HubSpot, Notion, Airtable. Bidirectional sync with conflict resolution, field mapping, and handling for records that exist in one system but not the other.",
        },
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: "Authentication and identity",
          description:
            "OAuth providers, SSO via SAML or OIDC, social login, multi-factor authentication. Including the session management, token refresh, and permission scope logic.",
        },
      ],
      useCasesLabel: 'Integration types',
      useCasesTitle: 'What we connect',
      deliverable: {
        label: "What you'll get",
        headline: 'A production-grade integration with full edge case coverage',
        description:
          'Most integration tutorials only show the happy path. We build the edge cases — failed webhooks, expired tokens, partial data, rate limiting — because production traffic always finds them.',
        items: [
          { label: 'Integration specification', detail: 'all data flows, error states, and edge cases documented before build' },
          { label: 'Sandbox implementation & testing', detail: 'built against test environments first, covering all failure modes' },
          { label: 'Webhook handling', detail: 'signature verification, idempotency, retry logic' },
          { label: 'Rate limit handling', detail: 'request queuing, exponential backoff, burst management' },
          { label: 'Error logging & alerting', detail: 'failed calls logged, critical errors alerted' },
          { label: 'Token management', detail: 'OAuth refresh flows, expiry handling, scope management' },
          { label: 'Integration documentation', detail: 'architecture diagram, error handling guide, troubleshooting notes' },
        ],
      },
      timeline: {
        duration: '1–2 weeks per integration',
        price: 'From $2,000',
        note: 'Simple integrations (one data flow, well-documented API) run 3–5 days. Complex integrations with bidirectional sync and many edge cases run 1–2 weeks. We scope per integration.',
      },
      faqs: [
        {
          question: "Can you integrate with APIs that have poor documentation?",
          answer:
            "Yes — it takes longer and costs more. We use traffic inspection, community research, and direct testing to fill in documentation gaps. We tell you upfront if an API is going to be significantly harder than normal.",
        },
        {
          question: "What if the third-party API changes after you've integrated it?",
          answer:
            "If you're on a maintenance plan, we monitor for API changes and handle breaking updates as part of the service. If not, we scope the update as a new piece of work.",
        },
        {
          question: "We're using Zapier/Make already. Why would we need custom integration work?",
          answer:
            "No-code tools handle the straightforward cases well. They struggle with complex data transformations, high volumes, error recovery, and edge cases. If your Zapier workflow is breaking or can't do what you need, custom code is usually the answer.",
        },
        {
          question: "How do you handle credentials and secrets?",
          answer:
            "API keys, OAuth tokens, and credentials are stored in environment variables or a secrets manager — never in source code. We document the secrets your system needs and how to rotate them.",
        },
      ],
      cta: {
        title: "What do you need to connect?",
        subtitle:
          "Tell us the systems and the data flow. We'll scope the integration work clearly.",
        primaryCTA: { label: 'Describe the integration', href: '/studio/start-project' },
        ghostCTA: { label: 'See our work', href: '/studio/portfolio' },
        note: 'Fixed-scope pricing. No hourly surprises.',
      },
    },
  },

  'data-sync': {
    metadata: {
      title: 'Data Sync & Pipelines — SocioFi Studio',
      description:
        'Keep data consistent across your systems without manual exports or imports. Event-triggered or scheduled pipelines with conflict resolution built in.',
    },
    content: {
      hero: {
        badge: 'Studio · Automation · Data Sync',
        headline: (
          <>
            Your Data,{' '}
            <span className="gradient-text">Consistent Everywhere.</span>
          </>
        ),
        description:
          "Data that lives in multiple places and has to be manually reconciled is a liability — it's always slightly wrong and someone's job is to keep it in sync. We build data pipelines that do this automatically, reliably, and without the errors that come with manual processes.",
        buttons: [
          { label: 'Fix my data sync', href: '/studio/start-project', variant: 'primary' },
          { label: 'See automation options', href: '/studio/services/automation-integration', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: "Customer data across CRM, billing, and product",
          description:
            "A customer's plan changes in Stripe → their record updates in the CRM → their feature access updates in the product. All automatic, all consistent.",
        },
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: "Reporting that requires data from multiple systems",
          description:
            "Revenue from Stripe, customers from the CRM, usage from the product — combined into a single data store that powers your dashboards without manual exports.",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: "Migrating data from one system to another",
          description:
            "Moving from one CRM to another, consolidating databases, or onboarding historical data into a new system. One-time migration with validation at every step.",
        },
      ],
      useCasesLabel: 'When you need this',
      useCasesTitle: 'Data sync is the right answer if...',
      deliverable: {
        label: "What you'll get",
        headline: 'A data pipeline that keeps your systems in sync',
        description:
          'We design, build, and deploy the pipeline with conflict resolution, error handling, and monitoring. Your data is consistent without anyone managing the process.',
        items: [
          { label: 'Data flow specification', detail: 'what moves, in which direction, on what trigger or schedule' },
          { label: 'Schema mapping', detail: 'field-by-field mapping with type conversion and validation' },
          { label: 'Conflict resolution logic', detail: 'which system wins when the same record is updated in both' },
          { label: 'Error handling', detail: 'failed syncs logged and retried, unresolvable conflicts flagged for review' },
          { label: 'Monitoring dashboard', detail: 'sync status, last run, error rate, records processed' },
          { label: 'Backfill capability', detail: 'ability to re-sync historical data if needed' },
          { label: 'Documentation', detail: 'how the pipeline works, how to add new fields, how to debug' },
        ],
      },
      timeline: {
        duration: '1–3 weeks',
        price: 'From $2,500',
        note: "Simple one-directional syncs between well-documented systems run 1 week. Complex bidirectional syncs with conflict resolution run 2–3 weeks.",
      },
      faqs: [
        {
          question: "What if the two systems have different data models?",
          answer:
            "We design the transformation logic explicitly — field mapping, type conversion, normalisation, and handling for fields that exist in one system but not the other. This is where we spend most of the specification time.",
        },
        {
          question: "How do you handle records that are updated in both systems at the same time?",
          answer:
            "We design the conflict resolution policy with you before building — typically: last write wins, one system is authoritative, or flagged for manual review. The policy depends on the data type and business rules.",
        },
        {
          question: "Can you build a one-time migration instead of ongoing sync?",
          answer:
            "Yes. Data migrations are scoped separately. We write the migration scripts, run them in staging against a copy of your production data, validate the results, and only then run against production.",
        },
        {
          question: "How real-time does the sync need to be?",
          answer:
            "Depends on the use case. Event-driven syncs (via webhooks) can be near real-time. Batch syncs can run every 5 minutes, hourly, or daily. We design the frequency based on your actual requirements.",
        },
      ],
      cta: {
        title: "Where is your data inconsistent?",
        subtitle:
          "Tell us which systems need to stay in sync and what goes wrong when they don't. We'll design the pipeline.",
        primaryCTA: { label: 'Describe the sync', href: '/studio/start-project' },
        ghostCTA: { label: 'See automation options', href: '/studio/services/automation-integration' },
        note: 'Fixed-scope pricing. Written spec before we build.',
      },
    },
  },
};

// ── Route handlers ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];
  if (!page) return {};
  return page.metadata;
}

export default function AutomationDeepDivePage({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];
  if (!page) notFound();
  return <DeepDive content={page.content} />;
}
