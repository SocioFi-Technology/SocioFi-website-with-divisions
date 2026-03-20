import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Chart, Users, Lock, Database, Layers, Gear,
} from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internal Tools — SocioFi Studio',
  description:
    'Replace the spreadsheets your team outgrew. Custom dashboards, admin panels, and workflow tools designed around how your team actually works. 2–4 weeks, starting at $3,000.',
  alternates: { canonical: '/studio/services/internal-tools' },
  openGraph: {
    title: 'Internal Tools — SocioFi Studio',
    description:
      'Replace the spreadsheets your team outgrew. Custom dashboards, admin panels, and workflow tools designed around how your team actually works.',
    url: '/studio/services/internal-tools',
  },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'INTERNAL TOOLS',
    headline: (
      <>
        Replace the Spreadsheets{' '}
        <span className="gradient-text">Your Team Outgrew.</span>
      </>
    ),
    description:
      "Your team has been managing critical operations in spreadsheets for years. It worked when you had 5 people. At 20, it's chaos. We build custom internal tools designed around how your team actually works — not how a generic SaaS vendor thinks you should work.",
    buttons: [
      { label: 'Build your tool', href: '/studio/start-project', variant: 'primary' },
      { label: 'See pricing', href: '/studio/pricing', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'What teams typically replace',
    headline: 'The spreadsheet is not the problem. The problem is what it represents.',
    description:
      "Spreadsheets become operations infrastructure. They hold inventory, track approvals, store customer data. The team has workarounds for the workarounds. The solution isn't a SaaS tool with 80% of what you need — it's a tool built for exactly what you do.",
    points: [
      'Spreadsheets tracking inventory that no one fully trusts because it\'s always slightly out of date',
      'Manual status reports compiled by hand every week from multiple sources',
      'Email-based approval chains with no visibility into what\'s waiting or where things stand',
      'Shared Google Docs used as a database because nothing else was set up',
      'Excel exports for reporting that someone has to format before sharing with leadership',
    ],
  },

  capabilitiesLabel: 'What we build',
  capabilitiesTitle: 'Exactly the tool your team needs. Nothing more.',
  capabilities: [
    {
      icon: <Chart size={22} aria-hidden="true" />,
      title: 'Custom Dashboards',
      description:
        'Real-time visibility into the metrics that matter for your operation. Built around your data, your KPIs, and how your team actually reads information.',
    },
    {
      icon: <Gear size={22} aria-hidden="true" />,
      title: 'Admin Panels',
      description:
        'Manage your product\'s data without writing SQL. Customer records, configuration, content, inventory — with proper access control and audit logging.',
    },
    {
      icon: <Layers size={22} aria-hidden="true" />,
      title: 'Reporting Tools',
      description:
        'Automated reports that generate themselves on a schedule. The weekly report that currently takes someone half a day becomes a link you share.',
    },
    {
      icon: <Database size={22} aria-hidden="true" />,
      title: 'Inventory Systems',
      description:
        'Real-time inventory tracking with history, low-stock alerts, supplier management, and the ability to connect to your existing order flow.',
    },
    {
      icon: <Users size={22} aria-hidden="true" />,
      title: 'Workflow Managers',
      description:
        'Structured approval flows, task assignment, status tracking. The email chain becomes a managed workflow with clear ownership and accountability.',
    },
    {
      icon: <Lock size={22} aria-hidden="true" />,
      title: 'Role-Based Access',
      description:
        'The right people see the right data. Granular permissions — view, edit, approve, admin — across every part of the tool. Audit logs for everything sensitive.',
    },
  ],

  processLabel: 'How internal tool projects work',
  processTitle: 'We learn your workflow before we write a line of code.',
  process: [
    {
      title: '01. Requirements workshop',
      description:
        'A working session with the people who will use the tool. We map the current process step by step, identify the pain points, and define exactly what a good tool would do.',
      duration: '2–4 hours',
    },
    {
      title: '02. UI/UX design',
      description:
        'Low-fidelity wireframes reviewed with your team before we build anything. The layout and workflows get approved — changes are easy at this stage, expensive later.',
      duration: '2–3 days',
    },
    {
      title: '03. Build & test',
      description:
        'We build with your team\'s feedback at every checkpoint. You see a working version early and often — not just at the end.',
      duration: '1–3 weeks',
    },
    {
      title: '04. Training & handoff',
      description:
        'A live walkthrough for your team. Written documentation for onboarding new people. Everything needed to own and use the tool without us.',
      duration: '1 day',
    },
  ],

  caseStudy: {
    label: 'Internal tools in practice',
    headline: 'A 40-person ops team. Three spreadsheets. One tool that replaced all of them.',
    description:
      'An operations team was tracking inventory, approvals, and supplier orders across three interlocked spreadsheets. We ran a 3-hour workshop, shipped a working prototype in a week, and launched the full tool 3 weeks later.',
    result: '12 hours per week recovered across the ops team',
    resultLabel: 'measured in the first month',
  },

  faqs: [
    {
      question: 'Can we use our existing data?',
      answer:
        'Yes. We import, clean, and connect your existing data sources as part of the build. Whether it\'s in spreadsheets, a database, or a SaaS export, we handle the migration.',
    },
    {
      question: 'What if our process changes after launch?',
      answer:
        'We build for change. Clean architecture means adding new fields, changing workflow steps, or adding a new report takes hours — not a new project. We document the codebase so your next engineer can pick it up easily.',
    },
    {
      question: 'Can multiple team members use it simultaneously?',
      answer:
        'Yes. Role-based access control is standard in every internal tool we build. Multiple concurrent users, different permission levels, and real-time data sync between sessions.',
    },
    {
      question: 'How do we train our team on the new tool?',
      answer:
        'We include a live training session and written documentation in every engagement. The documentation covers daily use, admin functions, and common troubleshooting.',
    },
    {
      question: 'Where is it hosted?',
      answer:
        'Your choice. SocioFi Cloud, your AWS or GCP account, or any infrastructure provider you prefer. We configure and deploy wherever makes sense for your team.',
    },
  ],

  cta: {
    title: 'Ready to replace the spreadsheets?',
    subtitle:
      "Tell us what your team is managing manually. We'll tell you what a real tool would look like and what it costs.",
    primaryCTA: { label: 'Build your tool', href: '/studio/start-project' },
    ghostCTA: { label: 'See pricing', href: '/studio/pricing' },
    note: 'Free requirements workshop. Fixed-price proposal within 2–3 days.',
  },
};

export default function InternalToolsPage() {
  return <ServiceDetail content={content} />;
}
