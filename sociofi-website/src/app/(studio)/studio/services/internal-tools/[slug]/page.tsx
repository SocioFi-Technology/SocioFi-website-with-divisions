import DeepDive, { type DeepDiveContent } from '@/templates/DeepDive';
import { Layers, Shield, Zap, Database, Code, Globe, Brain, Wrench } from '@/lib/icons';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// ── Deep-dive data map ─────────────────────────────────────────────────────────

const PAGES: Record<string, { metadata: Metadata; content: DeepDiveContent }> = {

  'dashboards': {
    metadata: {
      title: 'Operational Dashboards — SocioFi Studio',
      description:
        'Real-time operational dashboards that show your team the metrics they actually need — built around your data sources and your business logic.',
    },
    content: {
      hero: {
        badge: 'Studio · Internal Tools · Dashboards',
        headline: (
          <>
            See Your Business{' '}
            <span className="gradient-text">In Real Time.</span>
          </>
        ),
        description:
          "Most businesses manage operations from a patchwork of spreadsheets, tool dashboards, and gut feeling. We build operational dashboards that pull from your real data sources and show the numbers your team actually needs — updated in real time, without manual exports.",
        buttons: [
          { label: 'Build my dashboard', href: '/studio/start-project', variant: 'primary' },
          { label: 'See internal tools options', href: '/studio/services/internal-tools', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Layers size={22} aria-hidden="true" />,
          title: "Operations dashboard for a customer-facing product",
          description:
            "New signups, active users, revenue, support ticket volume, uptime status. The numbers your team checks every morning — in one place, always current.",
        },
        {
          icon: <Database size={22} aria-hidden="true" />,
          title: "Management reporting that currently takes hours to produce",
          description:
            "Revenue by product line, conversion rates, team utilisation, cost per acquisition. Reports that should be a click but currently require a day of spreadsheet work.",
        },
        {
          icon: <Globe size={22} aria-hidden="true" />,
          title: "Customer health scoring and account monitoring",
          description:
            "Usage trends, engagement drops, renewal risk, NPS scores — aggregated per customer so your team knows who needs attention before they churn.",
        },
      ],
      useCasesLabel: 'What we build',
      useCasesTitle: 'Dashboard types',
      deliverable: {
        label: "What you'll get",
        headline: 'A live dashboard connected to your actual data',
        description:
          'Not a mock-up and not a template. A custom dashboard connected to your real data sources, showing the metrics you defined, updating on the schedule that matches your business.',
        items: [
          { label: 'Metrics specification', detail: 'every number defined — source, calculation, refresh rate' },
          { label: 'Data connectors', detail: 'connected to your databases, APIs, and third-party tools' },
          { label: 'Real-time or scheduled refresh', detail: 'live updates or periodic pulls depending on the data source' },
          { label: 'Role-based views', detail: 'executives see summaries, operators see details, admins see everything' },
          { label: 'Filters & drill-down', detail: 'filter by date, product, customer, team — and drill into the numbers that look unusual' },
          { label: 'Export capability', detail: 'export to CSV or PDF for board packs and stakeholder reports' },
          { label: 'Alerting', detail: 'get notified when a metric crosses a threshold you define' },
        ],
      },
      timeline: {
        duration: '2–4 weeks',
        price: 'From $3,500',
        note: 'A focused dashboard with 2–3 data sources runs 2 weeks. A multi-source operational dashboard with complex metrics and role-based views runs 3–4 weeks.',
      },
      faqs: [
        {
          question: "Can you connect to our existing databases and tools?",
          answer:
            "Yes. We connect to PostgreSQL, MySQL, MongoDB, BigQuery, Salesforce, HubSpot, Stripe, and most systems with an API or direct database access. We document what access we need before starting.",
        },
        {
          question: "Can we edit the dashboard ourselves after it's built?",
          answer:
            "Yes — we build dashboards to be manageable by your team. For frequently changing metric definitions, we can build an admin interface. For structural changes, we can scope that as a maintenance task.",
        },
        {
          question: "What if our data is inconsistent or messy?",
          answer:
            "This is common. We assess data quality as part of the specification phase and design the transformation logic to produce reliable numbers. If the source data has fundamental issues, we flag them and recommend fixes.",
        },
        {
          question: "Why not just use a tool like Metabase or Looker?",
          answer:
            "Those tools are great for straightforward analytics. They struggle when your metrics require complex business logic, your data lives in unusual places, or you need tight integration with your existing application.",
        },
      ],
      cta: {
        title: "What does your team check every morning?",
        subtitle:
          "Tell us the metrics, the data sources, and who needs to see what. We'll build the dashboard.",
        primaryCTA: { label: 'Describe my dashboard', href: '/studio/start-project' },
        ghostCTA: { label: 'See internal tools options', href: '/studio/services/internal-tools' },
        note: 'Fixed scope. You approve the metric spec before we build.',
      },
    },
  },

  'admin-panels': {
    metadata: {
      title: 'Admin Panels — SocioFi Studio',
      description:
        'Custom admin panels for managing your product data, users, content, and configuration — built around your actual workflows, not a generic interface.',
    },
    content: {
      hero: {
        badge: 'Studio · Internal Tools · Admin Panels',
        headline: (
          <>
            Manage Your Product{' '}
            <span className="gradient-text">The Right Way.</span>
          </>
        ),
        description:
          "Every product needs an admin interface. Most end up with a raw database editor, a poorly configured third-party tool, or something built quickly that nobody wants to touch. We build purpose-built admin panels that match how your team actually manages the product.",
        buttons: [
          { label: 'Build my admin panel', href: '/studio/start-project', variant: 'primary' },
          { label: 'See internal tools options', href: '/studio/services/internal-tools', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Shield size={22} aria-hidden="true" />,
          title: "User and account management",
          description:
            "View and edit user accounts, manage subscriptions, reset passwords, handle support tickets, apply credits. Everything your customer success team needs in one interface.",
        },
        {
          icon: <Code size={22} aria-hidden="true" />,
          title: "Content and product data management",
          description:
            "Manage the data that powers your product — without giving non-technical staff access to the database. With validation, approval workflows, and audit trails.",
        },
        {
          icon: <Wrench size={22} aria-hidden="true" />,
          title: "Configuration and feature flags",
          description:
            "Control which features are enabled for which customers, set system-wide configuration values, and manage rollouts — without deploying code.",
        },
      ],
      useCasesLabel: 'What we build',
      useCasesTitle: 'Admin panel types',
      deliverable: {
        label: "What you'll get",
        headline: 'An admin panel your team will actually trust',
        description:
          "An admin panel that's fast, accurate, and hard to break accidentally. Built with the validation and audit logging that a production system requires.",
        items: [
          { label: 'Data management interface', detail: 'CRUD operations on your product data, with validation and confirmation' },
          { label: 'Search and filtering', detail: 'find any record quickly, filter by any relevant attribute' },
          { label: 'Role-based access', detail: 'different staff see and can do different things — granular permissions' },
          { label: 'Audit log', detail: 'every change recorded with timestamp and actor — critical for support and compliance' },
          { label: 'Bulk operations', detail: 'actions on multiple records at once where appropriate' },
          { label: 'Integration with your product', detail: 'reads from and writes to the same database your product uses' },
          { label: 'Documentation', detail: 'how to use it, how to extend it, and what each permission level can do' },
        ],
      },
      timeline: {
        duration: '2–5 weeks',
        price: 'From $4,000',
        note: 'A focused admin panel covering 2–3 entity types runs 2–3 weeks. A comprehensive admin interface with complex permissions and workflows runs 4–5 weeks.',
      },
      faqs: [
        {
          question: "Why not use an off-the-shelf admin tool like Forest Admin or Retool?",
          answer:
            "Those tools work well for simple use cases. They struggle when your data model is complex, your workflows have specific requirements, or you need tight security control. We'll tell you honestly if an off-the-shelf tool would serve you better.",
        },
        {
          question: "How do you handle the admin panel's own authentication?",
          answer:
            "We implement secure authentication separate from your product's user auth — with MFA available, IP allowlisting if required, and session management designed for internal users.",
        },
        {
          question: "Can support staff use this without training?",
          answer:
            "We design admin interfaces for the people who'll use them daily. Clear labels, confirmation dialogs for destructive actions, helpful error messages. We test the interface with representative tasks before handover.",
        },
        {
          question: "What if we need the admin panel to trigger actions in other systems?",
          answer:
            "We integrate those actions into the panel — send an email, trigger a refund, update a CRM record, provision a resource. We scope each action as part of the specification.",
        },
      ],
      cta: {
        title: "How do your team manage your product today?",
        subtitle:
          "Tell us what they need to do and what's currently painful. We'll design an admin interface that fixes it.",
        primaryCTA: { label: 'Build my admin panel', href: '/studio/start-project' },
        ghostCTA: { label: 'See internal tools options', href: '/studio/services/internal-tools' },
        note: 'Fixed scope. You approve the spec before we build.',
      },
    },
  },

  'workflow-tools': {
    metadata: {
      title: 'Workflow Tools — SocioFi Studio',
      description:
        'Custom workflow tools for multi-step processes — approvals, reviews, handoffs. Built for how your team actually moves work through your organisation.',
    },
    content: {
      hero: {
        badge: 'Studio · Internal Tools · Workflow Tools',
        headline: (
          <>
            Work That Moves{' '}
            <span className="gradient-text">Without Getting Stuck.</span>
          </>
        ),
        description:
          "Every business has processes that require multiple people, multiple steps, and things happening in the right order. When those processes live in email or spreadsheets, things get missed, approvals get delayed, and nobody can see where anything is. We build the tools that make your processes visible and manageable.",
        buttons: [
          { label: 'Build my workflow tool', href: '/studio/start-project', variant: 'primary' },
          { label: 'See internal tools options', href: '/studio/services/internal-tools', variant: 'ghost' },
        ],
      },
      useCases: [
        {
          icon: <Zap size={22} aria-hidden="true" />,
          title: "Approval workflows with accountability",
          description:
            "Budget requests, content approvals, contract sign-offs, purchase orders. A clear record of who reviewed what, who approved, and when — without email chains.",
        },
        {
          icon: <Layers size={22} aria-hidden="true" />,
          title: "Handoff-based processes",
          description:
            "Customer onboarding, order fulfilment, service delivery. Work moves from person to person in a defined sequence — each step clearly owned, tracked, and acknowledged.",
        },
        {
          icon: <Brain size={22} aria-hidden="true" />,
          title: "Review and quality control processes",
          description:
            "Design reviews, compliance checks, code reviews, editorial workflows. Structured review processes that collect feedback, manage revisions, and track sign-off.",
        },
      ],
      useCasesLabel: 'What we build',
      useCasesTitle: 'Workflow tool types',
      deliverable: {
        label: "What you'll get",
        headline: 'A workflow tool that matches how you actually work',
        description:
          'We design the tool around your actual process — not a generic template. Every step, every notification, every permission level is specified before we build it.',
        items: [
          { label: 'Process specification', detail: 'every step, actor, trigger, and condition documented and approved' },
          { label: 'Task management interface', detail: 'clear view of what needs doing, what is in progress, and what is done' },
          { label: 'Notifications', detail: 'email or in-app notifications when something needs attention' },
          { label: 'Status tracking', detail: 'anyone can see where any item is in the process at any time' },
          { label: 'Audit trail', detail: 'every action logged with timestamp and actor' },
          { label: 'Escalation rules', detail: 'if a step is overdue, the right person gets notified automatically' },
          { label: 'Reporting', detail: 'cycle time, bottleneck identification, volume over time' },
        ],
      },
      timeline: {
        duration: '3–6 weeks',
        price: 'From $5,000',
        note: 'A single-process workflow tool runs 3–4 weeks. A multi-process tool with complex routing and integrations runs 5–6 weeks.',
      },
      faqs: [
        {
          question: "Why not use a tool like Monday.com, Asana, or Jira?",
          answer:
            "Those tools work well for project management. They often don't fit business processes well — the fields, statuses, and routing rules don't match how your work actually flows. Custom tools let you build the exact process you have, not adapt your process to what the tool supports.",
        },
        {
          question: "Can the workflow tool integrate with our other systems?",
          answer:
            "Yes — we build integrations to the systems your workflow touches. A purchase order tool connects to your accounting system. An onboarding tool connects to your CRM and provisioning system. We scope each integration as part of the project.",
        },
        {
          question: "How do you handle processes that have exceptions and edge cases?",
          answer:
            "We design for the common path first, then work through the exceptions systematically. Some exceptions can be handled automatically; some need a human decision. We design both types into the tool.",
        },
        {
          question: "Can we modify the workflow after it's built?",
          answer:
            "For simple configuration changes (adding a step, changing a notification), yes. For structural workflow changes, we scope a small change request. We design the tool to make common modifications straightforward.",
        },
      ],
      cta: {
        title: "Which process should stop living in email?",
        subtitle:
          "Walk us through the steps. We'll build a tool that makes it visible, trackable, and manageable.",
        primaryCTA: { label: 'Describe my process', href: '/studio/start-project' },
        ghostCTA: { label: 'See internal tools options', href: '/studio/services/internal-tools' },
        note: 'Fixed scope. Process specification approved before build.',
      },
    },
  },
};

// ── Route handlers ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return page.metadata;
}

export default async function InternalToolsDeepDivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return <DeepDive content={page.content} />;
}
