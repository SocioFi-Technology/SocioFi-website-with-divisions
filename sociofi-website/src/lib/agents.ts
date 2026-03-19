/* ═══════════════════════════════════════════════════════════════════════
   SOCIOFI AGENTS — Data Layer
   16 agents across 5 categories
   ═══════════════════════════════════════════════════════════════════════ */

export type AgentCategory = 'operations' | 'sales' | 'support' | 'data' | 'documents';

export interface Integration {
  name: string;
  icon: string; // emoji fallback or icon key
}

export interface AgentFAQ {
  q: string;
  a: string;
}

export interface Agent {
  slug: string;
  name: string;
  category: AgentCategory;
  tagline: string;
  description: string;
  price: number;
  capabilities: { title: string; detail: string }[];
  integrations: Integration[];
  setupDays: string;
  useCases: string[];
  faq: AgentFAQ[];
  relatedAgents: string[];
}

export const CATEGORY_META: Record<AgentCategory, { label: string; description: string; icon: string; color: string }> = {
  operations: {
    label: 'Operations',
    description: 'Reports, inventory, compliance, meeting summaries',
    icon: 'chart',
    color: '#8B5CF6',
  },
  sales: {
    label: 'Sales',
    description: 'Lead qualification, proposals, CRM updates',
    icon: 'target',
    color: '#8B5CF6',
  },
  support: {
    label: 'Support',
    description: 'Customer service, ticket triage, review responses',
    icon: 'headset',
    color: '#8B5CF6',
  },
  data: {
    label: 'Data',
    description: 'Processing, cleaning, email triage, social monitoring',
    icon: 'database',
    color: '#8B5CF6',
  },
  documents: {
    label: 'Documents',
    description: 'Contracts, invoices, summaries, extraction',
    icon: 'file',
    color: '#8B5CF6',
  },
};

export const agents: Agent[] = [
  // ── OPERATIONS ──────────────────────────────────────────────────────
  {
    slug: 'report-generator',
    name: 'Report Generator',
    category: 'operations',
    tagline: 'Auto-generates formatted business reports on schedule',
    description:
      'Auto-generates formatted business reports on schedule — daily, weekly, monthly. Sales reports, financial summaries, inventory snapshots, performance dashboards. Define the format once, agent handles everything after.',
    price: 199,
    capabilities: [
      { title: 'Scheduled Generation', detail: 'Runs daily, weekly, or monthly on the schedule you set — zero manual effort.' },
      { title: 'Multi-Source Data', detail: 'Pulls from databases, spreadsheets, CRM, analytics platforms simultaneously.' },
      { title: 'Custom Formatting', detail: 'Generates reports in your format — PDF, spreadsheet, or dashboard view.' },
      { title: 'Auto-Distribution', detail: 'Sends completed reports to the right people automatically via email or Slack.' },
      { title: 'Historical Comparison', detail: 'Includes period-over-period trends and highlights without extra configuration.' },
    ],
    integrations: [
      { name: 'Google Sheets', icon: 'sheets' },
      { name: 'HubSpot', icon: 'hubspot' },
      { name: 'Salesforce', icon: 'salesforce' },
      { name: 'QuickBooks', icon: 'quickbooks' },
      { name: 'Airtable', icon: 'airtable' },
      { name: 'Databases', icon: 'database' },
    ],
    setupDays: '3-5 business days',
    useCases: ['Weekly sales summaries emailed to the leadership team', 'Monthly financial snapshots auto-sent to investors', 'Daily inventory reports for warehouse managers'],
    faq: [
      { q: 'How often can reports run?', a: 'Any frequency — hourly, daily, weekly, monthly, or on a custom cron schedule.' },
      { q: 'Can I get reports in different formats?', a: 'Yes — PDF, Excel, Google Sheets, Notion pages, or Slack messages.' },
      { q: 'What if my data source isn\'t listed?', a: 'We build custom connectors. Describe your source and we\'ll scope it.' },
    ],
    relatedAgents: ['inventory-monitor', 'data-processor', 'crm-updater'],
  },
  {
    slug: 'inventory-monitor',
    name: 'Inventory Monitor',
    category: 'operations',
    tagline: 'Tracks stock levels, alerts on reorder points, syncs counts',
    description:
      'Tracks stock levels across warehouses and channels. Alerts on reorder points. Generates replenishment recommendations. Flags slow-moving stock. Syncs counts across platforms automatically.',
    price: 199,
    capabilities: [
      { title: 'Real-Time Stock Tracking', detail: 'Monitors inventory levels across all locations and sales channels continuously.' },
      { title: 'Reorder Alerts', detail: 'Sends alerts when stock hits reorder thresholds — before you run out.' },
      { title: 'Replenishment Recommendations', detail: 'Generates purchase order suggestions based on sales velocity and lead times.' },
      { title: 'Slow-Mover Flags', detail: 'Identifies products that aren\'t moving so you can act before they become a problem.' },
      { title: 'Cross-Platform Sync', detail: 'Keeps stock counts consistent across your store, warehouse, and ERP systems.' },
    ],
    integrations: [
      { name: 'Shopify', icon: 'shopify' },
      { name: 'WooCommerce', icon: 'woocommerce' },
      { name: 'Google Sheets', icon: 'sheets' },
      { name: 'Airtable', icon: 'airtable' },
      { name: 'ERP Systems', icon: 'erp' },
    ],
    setupDays: '3-5 business days',
    useCases: ['E-commerce stores with 100+ SKUs', 'Multi-warehouse distributors', 'Retailers syncing online and offline stock'],
    faq: [
      { q: 'How many SKUs can it handle?', a: 'We\'ve run it on catalogs with 50,000+ SKUs. Scales with your data.' },
      { q: 'Does it place purchase orders automatically?', a: 'It can draft them for your approval, or auto-submit if you configure that gate.' },
    ],
    relatedAgents: ['report-generator', 'data-processor'],
  },
  {
    slug: 'compliance-checker',
    name: 'Compliance Checker',
    category: 'operations',
    tagline: 'Reviews documents against regulatory requirements, flags issues',
    description:
      'Reviews documents against regulatory requirements. Flags non-compliant sections. Suggests corrections. Maintains audit trails. Tracks regulation updates so your documents stay current.',
    price: 349,
    capabilities: [
      { title: 'Document Review', detail: 'Reads contracts, policies, and procedures against your regulatory framework.' },
      { title: 'Non-Compliance Flagging', detail: 'Highlights specific sections that don\'t meet requirements with clear explanations.' },
      { title: 'Correction Suggestions', detail: 'Proposes compliant language alternatives for flagged sections.' },
      { title: 'Audit Trail', detail: 'Maintains a complete log of every review, flag, and correction for audits.' },
      { title: 'Regulation Updates', detail: 'Monitors regulatory feeds and alerts you when rules that affect your documents change.' },
    ],
    integrations: [
      { name: 'Google Drive', icon: 'drive' },
      { name: 'SharePoint', icon: 'sharepoint' },
      { name: 'Dropbox', icon: 'dropbox' },
      { name: 'Email', icon: 'email' },
      { name: 'Document Storage', icon: 'database' },
    ],
    setupDays: '5-7 business days',
    useCases: ['Financial services document review', 'Healthcare policy compliance', 'Legal contract pre-review'],
    faq: [
      { q: 'Which regulations does it know?', a: 'We configure it for your specific framework — GDPR, HIPAA, SOC 2, ISO, or custom.' },
      { q: 'Is this a replacement for a lawyer?', a: 'No. It\'s a first-pass reviewer that flags issues so your legal team focuses on what matters.' },
    ],
    relatedAgents: ['contract-analyzer', 'document-processor'],
  },
  {
    slug: 'meeting-summarizer',
    name: 'Meeting Summarizer',
    category: 'operations',
    tagline: 'Generates structured meeting summaries with action items automatically',
    description:
      'Joins virtual meetings or processes recordings. Generates structured summaries with action items, decisions, and follow-ups. Distributes to participants automatically right after the call ends.',
    price: 149,
    capabilities: [
      { title: 'Live Meeting Processing', detail: 'Joins Zoom, Meet, or Teams calls directly to capture everything in real time.' },
      { title: 'Structured Summaries', detail: 'Outputs clean summaries: context, decisions made, action items, and owners.' },
      { title: 'Action Item Extraction', detail: 'Identifies every commitment made in the meeting with the person responsible.' },
      { title: 'Auto-Distribution', detail: 'Sends the summary to all participants and relevant stakeholders immediately after.' },
      { title: 'Follow-Up Tracking', detail: 'Optional: creates follow-up tasks in your project management tool.' },
    ],
    integrations: [
      { name: 'Zoom', icon: 'zoom' },
      { name: 'Google Meet', icon: 'meet' },
      { name: 'Microsoft Teams', icon: 'teams' },
      { name: 'Calendar', icon: 'calendar' },
      { name: 'Slack', icon: 'slack' },
    ],
    setupDays: '2-3 business days',
    useCases: ['Teams with back-to-back meetings', 'Remote companies needing async documentation', 'Client calls requiring written records'],
    faq: [
      { q: 'Does the bot show up in the meeting?', a: 'Yes, as a named participant. All attendees can see it\'s recording.' },
      { q: 'Can it handle recordings I upload?', a: 'Yes — upload the audio or video file and it processes within minutes.' },
    ],
    relatedAgents: ['report-generator', 'email-triage'],
  },

  // ── SALES ────────────────────────────────────────────────────────────
  {
    slug: 'lead-qualifier',
    name: 'Lead Qualifier',
    category: 'sales',
    tagline: 'Scores, enriches, and routes incoming leads automatically',
    description:
      'Reviews incoming leads against your criteria. Scores them on fit and intent. Enriches with publicly available data. Routes hot leads to sales immediately. Nurtures cold leads with automated follow-ups.',
    price: 249,
    capabilities: [
      { title: 'Fit Scoring', detail: 'Scores every lead against your ICP criteria — company size, industry, role, signals.' },
      { title: 'Lead Enrichment', detail: 'Adds publicly available context: company info, LinkedIn presence, recent news.' },
      { title: 'Hot Lead Routing', detail: 'Sends high-score leads to your sales team in seconds, not hours.' },
      { title: 'Cold Lead Nurturing', detail: 'Enrolls low-score leads in automated follow-up sequences.' },
      { title: 'CRM Sync', detail: 'Logs every action in your CRM so your team has full context.' },
    ],
    integrations: [
      { name: 'HubSpot', icon: 'hubspot' },
      { name: 'Salesforce', icon: 'salesforce' },
      { name: 'Pipedrive', icon: 'pipedrive' },
      { name: 'LinkedIn', icon: 'linkedin' },
      { name: 'Web Forms', icon: 'forms' },
      { name: 'Email', icon: 'email' },
    ],
    setupDays: '3-5 business days',
    useCases: ['SaaS companies with high inbound volume', 'B2B sales teams spending too much time on bad leads', 'Agencies qualifying project inquiries'],
    faq: [
      { q: 'How does it know what a good lead looks like?', a: 'You describe your ICP in plain English. We configure the scoring criteria from that.' },
      { q: 'Can it send follow-up emails automatically?', a: 'Yes, with your approval on the templates and tone beforehand.' },
    ],
    relatedAgents: ['crm-updater', 'proposal-drafter', 'email-triage'],
  },
  {
    slug: 'proposal-drafter',
    name: 'Proposal Drafter',
    category: 'sales',
    tagline: 'Generates first-draft proposals from project briefs in your format',
    description:
      'Takes project briefs or client requirements and generates first-draft proposals in your brand format. Includes scope, timeline, and pricing from your templates. Reduces proposal turnaround from days to hours.',
    price: 249,
    capabilities: [
      { title: 'Brief-to-Proposal', detail: 'Reads project briefs, emails, or meeting notes and drafts a structured proposal.' },
      { title: 'Template Matching', detail: 'Uses your existing proposal templates so output is already in your format.' },
      { title: 'Scope Generation', detail: 'Breaks the project into deliverables with effort estimates based on your history.' },
      { title: 'Pricing Population', detail: 'Fills in pricing from your rate card or pricing matrix.' },
      { title: 'CRM Attachment', detail: 'Saves the draft to the correct deal in your CRM automatically.' },
    ],
    integrations: [
      { name: 'Google Docs', icon: 'docs' },
      { name: 'HubSpot', icon: 'hubspot' },
      { name: 'Pipedrive', icon: 'pipedrive' },
      { name: 'Email', icon: 'email' },
      { name: 'Templates', icon: 'file' },
    ],
    setupDays: '3-5 business days',
    useCases: ['Agencies sending 10+ proposals per month', 'Consultants standardizing their pitch process', 'Service businesses with complex scopes'],
    faq: [
      { q: 'Do I still review the draft?', a: 'Yes, always. The agent drafts — you refine and send. It saves 80% of the writing time.' },
      { q: 'What if each proposal is completely custom?', a: 'That\'s when it shines. The more variable your proposals, the more time it saves.' },
    ],
    relatedAgents: ['lead-qualifier', 'crm-updater'],
  },
  {
    slug: 'crm-updater',
    name: 'CRM Updater',
    category: 'sales',
    tagline: 'Keeps your CRM clean — logs notes, updates stages, deduplicates',
    description:
      'Keeps your CRM clean and current. Logs call notes, updates deal stages, fills missing contact info, deduplicates records, and flags stale deals. The admin work your sales team skips.',
    price: 199,
    capabilities: [
      { title: 'Call Note Logging', detail: 'Reads meeting summaries and call notes, logs them to the correct CRM record.' },
      { title: 'Deal Stage Updates', detail: 'Updates deal stages based on email signals, meeting outcomes, and activity.' },
      { title: 'Contact Enrichment', detail: 'Fills missing fields using publicly available data — company, title, phone.' },
      { title: 'Deduplication', detail: 'Finds and merges duplicate contacts and companies before they compound.' },
      { title: 'Stale Deal Flagging', detail: 'Alerts your team when a deal has had no activity beyond your threshold.' },
    ],
    integrations: [
      { name: 'HubSpot', icon: 'hubspot' },
      { name: 'Salesforce', icon: 'salesforce' },
      { name: 'Pipedrive', icon: 'pipedrive' },
      { name: 'Freshsales', icon: 'freshsales' },
      { name: 'Email', icon: 'email' },
      { name: 'Calendar', icon: 'calendar' },
    ],
    setupDays: '3-5 business days',
    useCases: ['Sales teams whose CRM data is always out of date', 'Companies inheriting messy CRM from previous team', 'Agencies managing many client relationships'],
    faq: [
      { q: 'Will it accidentally overwrite good data?', a: 'No. It only fills empty fields or adds new notes. It doesn\'t overwrite existing values.' },
    ],
    relatedAgents: ['lead-qualifier', 'report-generator'],
  },

  // ── SUPPORT ──────────────────────────────────────────────────────────
  {
    slug: 'customer-service',
    name: 'Customer Service Agent',
    category: 'support',
    tagline: 'Handles first-line customer inquiries 24/7 across all channels',
    description:
      'Handles first-line customer inquiries across email, chat, and ticketing systems. Answers common questions from your knowledge base. Routes complex issues to the right human. Responds in seconds, 24/7. Learns from every interaction.',
    price: 299,
    capabilities: [
      { title: '24/7 First Response', detail: 'Responds to customer inquiries in seconds — day, night, weekends, holidays.' },
      { title: 'Knowledge Base Answers', detail: 'Answers questions from your documentation, FAQs, and past tickets.' },
      { title: 'Smart Routing', detail: 'Identifies complex or sensitive issues and routes to the right human team member.' },
      { title: 'Multi-Channel Coverage', detail: 'Works across email, live chat, ticketing, and social media simultaneously.' },
      { title: 'Continuous Learning', detail: 'Gets smarter over time as it learns which answers work for your customers.' },
    ],
    integrations: [
      { name: 'Zendesk', icon: 'zendesk' },
      { name: 'Freshdesk', icon: 'freshdesk' },
      { name: 'Intercom', icon: 'intercom' },
      { name: 'Email', icon: 'email' },
      { name: 'Live Chat', icon: 'chat' },
      { name: 'Slack', icon: 'slack' },
    ],
    setupDays: '5-7 business days',
    useCases: ['SaaS products with growing support volume', 'E-commerce stores with high order inquiry volume', 'Businesses tired of answering the same questions repeatedly'],
    faq: [
      { q: 'Will customers know it\'s an AI?', a: 'You decide — we can disclose it upfront or have it introduce itself as your team assistant.' },
      { q: 'What if it doesn\'t know the answer?', a: 'It routes to a human immediately with full context of the conversation.' },
    ],
    relatedAgents: ['ticket-triage', 'review-responder'],
  },
  {
    slug: 'ticket-triage',
    name: 'Ticket Triage Agent',
    category: 'support',
    tagline: 'Categorizes, prioritizes, and routes support tickets automatically',
    description:
      'Reads incoming support tickets. Categorizes by type, urgency, and team. Assigns priority level. Routes to the correct department. Suggests resolution from past similar tickets. Reduces first-response time by 80%.',
    price: 199,
    capabilities: [
      { title: 'Smart Categorization', detail: 'Reads ticket content and assigns category, type, and team automatically.' },
      { title: 'Priority Assignment', detail: 'Scores urgency based on sentiment, keywords, and customer tier.' },
      { title: 'Department Routing', detail: 'Routes each ticket to the team best equipped to resolve it.' },
      { title: 'Resolution Suggestions', detail: 'Surfaces similar past tickets and their solutions to speed up resolution.' },
      { title: 'SLA Tracking', detail: 'Flags tickets approaching SLA breach before they become a problem.' },
    ],
    integrations: [
      { name: 'Zendesk', icon: 'zendesk' },
      { name: 'Freshdesk', icon: 'freshdesk' },
      { name: 'Jira Service Desk', icon: 'jira' },
      { name: 'Linear', icon: 'linear' },
      { name: 'Email', icon: 'email' },
    ],
    setupDays: '3-5 business days',
    useCases: ['Support teams with 50+ tickets per day', 'Companies with tickets going to the wrong team', 'SaaS products with mixed technical and billing inquiries'],
    faq: [
      { q: 'How does it learn our priority levels?', a: 'We configure it using your existing escalation rules and historical ticket patterns.' },
    ],
    relatedAgents: ['customer-service', 'email-triage'],
  },
  {
    slug: 'review-responder',
    name: 'Review Responder',
    category: 'support',
    tagline: 'Drafts on-brand responses to customer reviews across platforms',
    description:
      'Monitors customer reviews across platforms. Drafts thoughtful, on-brand responses. Flags negative reviews for human attention. Tracks sentiment trends over time so you see patterns before they become crises.',
    price: 179,
    capabilities: [
      { title: 'Multi-Platform Monitoring', detail: 'Watches Google, Trustpilot, G2, Capterra, and social media for new reviews.' },
      { title: 'On-Brand Response Drafts', detail: 'Writes responses in your brand voice — warm, professional, not robotic.' },
      { title: 'Negative Review Escalation', detail: 'Flags 1-2 star reviews immediately for human review before any response goes out.' },
      { title: 'Sentiment Tracking', detail: 'Reports on sentiment trends over time so you spot patterns early.' },
      { title: 'Response Queue', detail: 'Organizes all pending responses in a single dashboard for quick approval and publish.' },
    ],
    integrations: [
      { name: 'Google Reviews', icon: 'google' },
      { name: 'Trustpilot', icon: 'trustpilot' },
      { name: 'G2', icon: 'g2' },
      { name: 'Capterra', icon: 'capterra' },
      { name: 'Social Media', icon: 'social' },
    ],
    setupDays: '2-3 business days',
    useCases: ['Businesses getting 20+ reviews per month', 'SaaS products on G2 and Capterra', 'Local businesses managing Google reviews'],
    faq: [
      { q: 'Does it respond automatically or do I approve first?', a: 'Your choice. Most clients approve responses in a queue; some let positive reviews auto-publish.' },
    ],
    relatedAgents: ['customer-service', 'social-listener'],
  },

  // ── DATA ─────────────────────────────────────────────────────────────
  {
    slug: 'data-processor',
    name: 'Data Processor',
    category: 'data',
    tagline: 'Cleans, transforms, and loads data from any source automatically',
    description:
      'Ingests data from multiple sources — spreadsheets, emails, forms, APIs — cleans it, transforms it, validates against your rules, and loads it where it needs to go. Hours of manual data entry done in minutes.',
    price: 249,
    capabilities: [
      { title: 'Multi-Source Ingestion', detail: 'Reads from spreadsheets, email attachments, web forms, APIs, and databases.' },
      { title: 'Cleaning & Standardization', detail: 'Fixes formatting inconsistencies, fills blanks, removes duplicates, standardizes values.' },
      { title: 'Validation Rules', detail: 'Checks data against your business rules before loading — flags exceptions for review.' },
      { title: 'Data Loading', detail: 'Pushes clean data to your database, CRM, spreadsheet, or API destination.' },
      { title: 'Error Reporting', detail: 'Produces a clear report of every row it changed, flagged, or rejected.' },
    ],
    integrations: [
      { name: 'Google Sheets', icon: 'sheets' },
      { name: 'Airtable', icon: 'airtable' },
      { name: 'Email', icon: 'email' },
      { name: 'CSV/Excel', icon: 'excel' },
      { name: 'APIs', icon: 'api' },
      { name: 'Databases', icon: 'database' },
    ],
    setupDays: '3-5 business days',
    useCases: ['Finance teams manually entering invoice data', 'Operations teams reconciling data across multiple tools', 'Businesses migrating data between platforms'],
    faq: [
      { q: 'Can it handle messy, inconsistent data?', a: 'That\'s specifically what it\'s built for. The messier the source, the more value it delivers.' },
    ],
    relatedAgents: ['report-generator', 'document-processor', 'inventory-monitor'],
  },
  {
    slug: 'email-triage',
    name: 'Email Triage Agent',
    category: 'data',
    tagline: 'Reads, categorizes, drafts replies, and routes your inbox intelligently',
    description:
      'Reads incoming emails, understands the intent, categorizes by topic and urgency, drafts responses to routine inquiries, flags urgent messages, routes everything else to the right person. Your inbox, managed intelligently.',
    price: 199,
    capabilities: [
      { title: 'Intent Understanding', detail: 'Reads every email and identifies what the sender needs — not just keywords.' },
      { title: 'Priority Sorting', detail: 'Separates urgent, important, and routine emails so you see the right ones first.' },
      { title: 'Draft Responses', detail: 'Writes first-draft replies to routine inquiries in your voice for your approval.' },
      { title: 'Smart Routing', detail: 'Forwards emails to the right team member based on topic and responsibility.' },
      { title: 'Shared Inbox Management', detail: 'Works across shared team inboxes — support@, info@, sales@ — not just personal.' },
    ],
    integrations: [
      { name: 'Gmail', icon: 'gmail' },
      { name: 'Outlook', icon: 'outlook' },
      { name: 'Shared Inboxes', icon: 'email' },
      { name: 'Slack', icon: 'slack' },
    ],
    setupDays: '2-3 business days',
    useCases: ['Founders spending 2+ hours per day on email', 'Teams managing high-volume shared inboxes', 'Customer-facing teams with repetitive inquiries'],
    faq: [
      { q: 'Does it read personal emails?', a: 'Only the inboxes you explicitly connect. You control access completely.' },
      { q: 'Will it accidentally send a draft?', a: 'No. Every draft sits in your approval queue until you send it manually.' },
    ],
    relatedAgents: ['customer-service', 'ticket-triage', 'meeting-summarizer'],
  },
  {
    slug: 'social-listener',
    name: 'Social Listener',
    category: 'data',
    tagline: 'Monitors brand mentions and sentiment across social platforms',
    description:
      'Monitors brand mentions, competitor activity, and industry keywords across social media and news. Summarizes daily sentiment. Alerts on spikes (positive or negative). Generates weekly trend reports.',
    price: 199,
    capabilities: [
      { title: 'Brand Mention Tracking', detail: 'Catches every mention of your brand, products, and key people across platforms.' },
      { title: 'Competitor Monitoring', detail: 'Tracks what people are saying about competitors — opportunities and threats.' },
      { title: 'Sentiment Analysis', detail: 'Scores each mention positive, negative, or neutral with confidence levels.' },
      { title: 'Spike Alerts', detail: 'Notifies your team immediately when mention volume spikes — good or bad.' },
      { title: 'Weekly Reports', detail: 'Sends a structured weekly summary: volume, sentiment trends, key themes, notable posts.' },
    ],
    integrations: [
      { name: 'Twitter/X', icon: 'twitter' },
      { name: 'LinkedIn', icon: 'linkedin' },
      { name: 'Reddit', icon: 'reddit' },
      { name: 'Google News', icon: 'google' },
      { name: 'RSS Feeds', icon: 'rss' },
    ],
    setupDays: '2-3 business days',
    useCases: ['Brands running PR campaigns', 'Companies monitoring competitor product launches', 'SaaS products tracking community sentiment'],
    faq: [
      { q: 'How far back does it go?', a: 'Historical data varies by platform. From setup day forward, it tracks everything.' },
    ],
    relatedAgents: ['review-responder', 'report-generator'],
  },

  // ── DOCUMENTS ────────────────────────────────────────────────────────
  {
    slug: 'document-processor',
    name: 'Document Processor',
    category: 'documents',
    tagline: 'Extracts structured data from contracts, invoices, and forms',
    description:
      'Reads contracts, invoices, applications, and forms. Extracts structured data (names, amounts, dates, terms). Validates against your rules. Flags exceptions. Files everything in the correct location automatically.',
    price: 199,
    capabilities: [
      { title: 'Intelligent Extraction', detail: 'Pulls key fields from any document type — names, amounts, dates, terms, parties.' },
      { title: 'OCR Processing', detail: 'Reads scanned documents and images — not just digital text.' },
      { title: 'Validation Rules', detail: 'Checks extracted data against your business rules and flags anomalies.' },
      { title: 'Auto-Filing', detail: 'Saves processed documents to the correct folder based on type, client, or date.' },
      { title: 'Structured Output', detail: 'Exports clean, structured data to your database, spreadsheet, or CRM.' },
    ],
    integrations: [
      { name: 'Google Drive', icon: 'drive' },
      { name: 'SharePoint', icon: 'sharepoint' },
      { name: 'Email', icon: 'email' },
      { name: 'PDF/Word', icon: 'file' },
      { name: 'Airtable', icon: 'airtable' },
    ],
    setupDays: '3-5 business days',
    useCases: ['Finance teams processing hundreds of invoices monthly', 'HR teams extracting data from applications', 'Legal teams parsing contract terms into databases'],
    faq: [
      { q: 'Can it read handwritten forms?', a: 'Printed handwriting, yes. Cursive is hit-or-miss — we\'ll test with your samples first.' },
    ],
    relatedAgents: ['contract-analyzer', 'compliance-checker', 'data-processor'],
  },
  {
    slug: 'contract-analyzer',
    name: 'Contract Analyzer',
    category: 'documents',
    tagline: 'Reviews contracts for key terms, risks, and deadlines',
    description:
      'Reviews contracts for key terms, obligations, risks, and deadlines. Compares against your standard terms. Highlights deviations. Generates summary reports. Tracks renewal dates automatically.',
    price: 299,
    capabilities: [
      { title: 'Term Extraction', detail: 'Identifies all key terms: payment, delivery, liability, IP, termination, renewals.' },
      { title: 'Risk Flagging', detail: 'Compares against your standard terms and highlights unfavorable deviations.' },
      { title: 'Obligation Tracking', detail: 'Lists every commitment made by each party with deadlines.' },
      { title: 'Summary Reports', detail: 'Generates a plain-English summary of any contract in 2 minutes.' },
      { title: 'Renewal Alerts', detail: 'Tracks auto-renewal and expiry dates and alerts you 60-30-14 days before.' },
    ],
    integrations: [
      { name: 'DocuSign', icon: 'docusign' },
      { name: 'Google Drive', icon: 'drive' },
      { name: 'PDF/Word', icon: 'file' },
      { name: 'Email', icon: 'email' },
      { name: 'Airtable', icon: 'airtable' },
    ],
    setupDays: '3-5 business days',
    useCases: ['Businesses reviewing vendor contracts before signing', 'Legal teams doing pre-review before sending to lawyers', 'Companies tracking large contract portfolios'],
    faq: [
      { q: 'Is this a replacement for legal counsel?', a: 'No. It\'s a first-pass reviewer that flags issues so your lawyer can focus on what matters.' },
      { q: 'What contract types does it handle?', a: 'Service agreements, NDAs, vendor contracts, employment agreements, SaaS terms — most commercial contracts.' },
    ],
    relatedAgents: ['document-processor', 'compliance-checker'],
  },
  {
    slug: 'content-summarizer',
    name: 'Content Summarizer',
    category: 'documents',
    tagline: 'Generates executive summaries from long documents in minutes',
    description:
      'Ingests long documents, reports, research papers, or meeting transcripts. Generates executive summaries at the length you specify. Extracts key points, decisions, and action items automatically.',
    price: 149,
    capabilities: [
      { title: 'Multi-Format Input', detail: 'Reads PDFs, Word docs, Google Docs, web pages, and plain text.' },
      { title: 'Length Control', detail: 'Generates summaries at the exact length you want — 3 bullets, 1 page, 500 words.' },
      { title: 'Key Point Extraction', detail: 'Pulls out the most important facts, decisions, and recommendations.' },
      { title: 'Action Item Detection', detail: 'Identifies any tasks, follow-ups, or next steps mentioned in the document.' },
      { title: 'Batch Processing', detail: 'Summarizes multiple documents in a single run — useful for research review.' },
    ],
    integrations: [
      { name: 'Google Docs', icon: 'docs' },
      { name: 'PDF/Word', icon: 'file' },
      { name: 'Email', icon: 'email' },
      { name: 'URLs', icon: 'globe' },
      { name: 'Uploaded Files', icon: 'upload' },
    ],
    setupDays: '2-3 business days',
    useCases: ['Executives who need to read 10 reports per week', 'Research teams reviewing large volumes of papers', 'Teams documenting decisions from meeting transcripts'],
    faq: [
      { q: 'What\'s the maximum document length?', a: 'We\'ve processed 500-page reports. No practical limit for most business documents.' },
    ],
    relatedAgents: ['meeting-summarizer', 'document-processor'],
  },
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find(a => a.slug === slug);
}

export function getAgentsByCategory(category: AgentCategory): Agent[] {
  return agents.filter(a => a.category === category);
}

export const CATEGORY_ORDER: AgentCategory[] = ['operations', 'sales', 'support', 'data', 'documents'];
