import ServiceDetail, { type ServiceDetailContent } from '@/templates/ServiceDetail';
import {
  Zap, Gear, Database, GitBranch, Globe, Code,
} from '@/lib/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Automation & Integration — SocioFi Studio',
  description:
    'Connect your tools. Stop copying data manually. We build API connections, data pipelines, and workflow automation that eliminate hours of manual work per week.',
  alternates: { canonical: '/studio/services/automation-integration' },
  openGraph: {
    title: 'Automation & Integration — SocioFi Studio',
    description:
      'Connect your tools. Stop copying data manually. We build API connections, data pipelines, and workflow automation that eliminate hours of manual work per week.',
    url: '/studio/services/automation-integration',
  },
};

const content: ServiceDetailContent = {
  hero: {
    badge: 'AUTOMATION & INTEGRATION',
    headline: (
      <>
        Stop Doing Manually{' '}
        <span className="gradient-text">What Software Can Do.</span>
      </>
    ),
    description:
      "Most businesses have 5–15 software tools that don't talk to each other. Your team manually copies data between them. We build the connections and automation that eliminates that work — so your team does the high-value things only humans can do.",
    buttons: [
      { label: 'Start automating', href: '/studio/start-project', variant: 'primary' },
      { label: 'See how it works', href: '/studio/process', variant: 'ghost' },
    ],
  },

  problem: {
    label: 'Who it\'s for',
    headline: 'Your team is working hard. On things that shouldn\'t require a human.',
    description:
      "The manual work is usually invisible until you count it. One hour per person per day copying between systems is 250 hours per year per person. We eliminate the hours that machines should own.",
    points: [
      'Businesses where customer data lives in 3+ disconnected tools',
      'Teams that copy-paste between CRM, spreadsheets, and billing every week',
      'Operations managers whose reporting takes a full day to compile',
      'Companies where onboarding or offboarding involves a checklist of manual steps',
    ],
  },

  capabilitiesLabel: 'What we build',
  capabilitiesTitle: 'The connections your tools should have had from the start.',
  capabilities: [
    {
      icon: <Code size={22} aria-hidden="true" />,
      title: 'API Development',
      description:
        'Custom APIs that connect your internal systems or expose your data to external tools. Built with proper authentication, rate limiting, and documentation.',
    },
    {
      icon: <Gear size={22} aria-hidden="true" />,
      title: 'Workflow Design',
      description:
        'We map your current manual process, identify every step a human shouldn\'t need to do, and design the automated version. Then we build it.',
    },
    {
      icon: <Database size={22} aria-hidden="true" />,
      title: 'Data Pipelines',
      description:
        'Reliable pipelines that move, transform, and sync data between systems on a schedule or in real time. With error handling and alerting built in.',
    },
    {
      icon: <Globe size={22} aria-hidden="true" />,
      title: 'System Integration',
      description:
        'Connect the tools you already use: Slack, HubSpot, Notion, Google Sheets, Salesforce, QuickBooks, Stripe, and custom internal systems.',
    },
    {
      icon: <Zap size={22} aria-hidden="true" />,
      title: 'Error Handling',
      description:
        'Automation fails silently in most implementations. We build retry logic, failure alerts, and audit logs so you know when something goes wrong — before your team discovers it manually.',
    },
    {
      icon: <GitBranch size={22} aria-hidden="true" />,
      title: 'Monitoring',
      description:
        'Dashboard visibility into all automated workflows. Runtime metrics, success rates, failure logs, and alerting. You see everything that\'s running.',
    },
  ],

  processLabel: 'How automation projects work',
  processTitle: 'Map first. Build second. Monitor always.',
  process: [
    {
      title: '01. Workflow mapping',
      description:
        'We spend time understanding your current process in detail — every step, every tool, every handoff point. We find the automation opportunities you haven\'t noticed yet.',
      duration: '1–2 days',
    },
    {
      title: '02. Integration design',
      description:
        'A written design of the automated workflow: what triggers it, what it does, how errors are handled, what the monitoring looks like. You approve before we build.',
      duration: '1–2 days',
    },
    {
      title: '03. Build & test',
      description:
        'We build, connect, and test every integration against real data. Edge cases, error states, and failure conditions are tested before anything goes live.',
      duration: '1–3 weeks',
    },
    {
      title: '04. Deploy & monitor',
      description:
        'Live in production with monitoring configured from day one. We watch the first week of runs together to catch anything unexpected.',
      duration: '30 days included',
    },
  ],

  faqs: [
    {
      question: 'What tools do you integrate?',
      answer:
        'Any tool with an API. Common ones: Slack, HubSpot, Notion, Google Sheets, Salesforce, QuickBooks, Stripe, Airtable, Jira, Intercom, and custom databases. If it has an API, we can connect it.',
    },
    {
      question: 'What if a tool changes its API?',
      answer:
        'We build with error handling and alerting. If an API changes and breaks an integration, the monitoring catches it immediately and alerts you. Updating the integration is straightforward.',
    },
    {
      question: 'Do I need to know what to automate?',
      answer:
        'No. We\'ll map your workflows and find the automation opportunities. Some clients come in with a specific request. Others say "our team spends too much time on admin" and we identify where the hours are going.',
    },
    {
      question: 'What\'s the typical ROI?',
      answer:
        'Most clients see the automation pay for itself within 1–3 months from time saved. A $2,500 integration that saves 5 hours per week across a team pays back in under 2 months at a modest hourly rate.',
    },
    {
      question: 'Can you add AI to automation workflows?',
      answer:
        'Yes. We integrate AI capabilities where they add genuine value — document classification, content generation, data extraction from unstructured text, intelligent routing. Not as a gimmick, but where it replaces real manual judgment work.',
    },
  ],

  cta: {
    title: 'Ready to eliminate the manual work?',
    subtitle:
      "Tell us what your team spends time on that should be automatic. We'll tell you what it takes to build it.",
    primaryCTA: { label: 'Start automating', href: '/studio/start-project' },
    ghostCTA: { label: 'See pricing', href: '/studio/pricing' },
    note: 'Free workflow mapping call. Fixed-price proposal within 2–3 days.',
  },
};

export default function AutomationIntegrationPage() {
  return <ServiceDetail content={content} />;
}
