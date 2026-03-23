import { Submission as LegacySubmission, Ticket, Contact as LegacyContact, ActivityLog } from '@/lib/supabase/types';
import type { Submission, Contact, ContactActivity, PipelineEntry, CalendarEntry, AgentConfig, ApprovalItem, AgentRun, NewsletterIssue, NewsletterSubscriber, SubscriberList } from '@/lib/admin/types'

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const LEGACY_MOCK_CONTACTS: LegacyContact[] = [
  {
    id: 'c1', email: 'sarah@techcorp.io', name: 'Sarah Chen', company: 'TechCorp',
    phone: '+1 415 555 0123', role: 'CTO', source: 'organic',
    division_interest: ['studio'], tags: ['hot-lead', 'saas'],
    lifecycle_stage: 'qualified', created_at: daysAgo(2), updated_at: daysAgo(2),
  },
  {
    id: 'c2', email: 'james@founderhq.co', name: 'James Okafor', company: 'FounderHQ',
    phone: '+44 20 7946 0123', role: 'Founder', source: 'referral',
    division_interest: ['studio', 'services'], tags: ['founder'],
    lifecycle_stage: 'lead', created_at: daysAgo(5), updated_at: daysAgo(4),
  },
  {
    id: 'c3', email: 'priya@datasync.in', name: 'Priya Mehta', company: 'DataSync',
    phone: '+91 98200 12345', role: 'Product Manager', source: 'linkedin',
    division_interest: ['cloud'], tags: ['enterprise'],
    lifecycle_stage: 'opportunity', created_at: daysAgo(10), updated_at: daysAgo(8),
  },
  {
    id: 'c4', email: 'luca@venturelab.it', name: 'Luca Bianchi', company: 'VentureLab',
    source: 'direct', division_interest: ['ventures'],
    lifecycle_stage: 'lead', created_at: daysAgo(1), updated_at: daysAgo(1),
  },
  {
    id: 'c5', email: 'anna@ecomstore.de', name: 'Anna Müller', company: 'EcomStore',
    phone: '+49 30 12345678', role: 'Operations Lead', source: 'paid',
    division_interest: ['services', 'cloud'], tags: ['ecommerce'],
    lifecycle_stage: 'client', created_at: daysAgo(30), updated_at: daysAgo(2),
  },
];

export const LEGACY_MOCK_SUBMISSIONS: LegacySubmission[] = [
  {
    id: 's1', contact_id: 'c1', type: 'studio-project', division: 'studio',
    status: 'new', priority: 'high',
    data: {
      name: 'Sarah Chen', email: 'sarah@techcorp.io', company: 'TechCorp',
      description: 'Building a B2B SaaS dashboard with AI analytics and real-time reporting.',
      budget_range: '$5K–$15K', timeline: '6 weeks',
    },
    source_url: '/studio/start-project', utm_source: 'google', utm_medium: 'cpc',
    created_at: hoursAgo(2), updated_at: hoursAgo(2),
    contact: { id: 'c1', email: 'sarah@techcorp.io', name: 'Sarah Chen', company: 'TechCorp', lifecycle_stage: 'qualified', created_at: daysAgo(2), updated_at: daysAgo(2) },
  },
  {
    id: 's2', contact_id: 'c2', type: 'studio-rescue', division: 'studio',
    status: 'reviewed', priority: 'urgent',
    data: {
      name: 'James Okafor', email: 'james@founderhq.co',
      description: 'Our MVP was built by an offshore team — it works but we can\'t maintain it and it breaks weekly.',
      stack: 'React, Node, PostgreSQL on a shared host',
      budget_range: '$10K–$25K',
    },
    source_url: '/studio/services/rescue-ship',
    assigned_to: 'tm1',
    reviewed_at: hoursAgo(5),
    created_at: hoursAgo(8), updated_at: hoursAgo(5),
    contact: { id: 'c2', email: 'james@founderhq.co', name: 'James Okafor', company: 'FounderHQ', lifecycle_stage: 'lead', created_at: daysAgo(5), updated_at: daysAgo(4) },
  },
  {
    id: 's3', contact_id: 'c3', type: 'cloud-inquiry', division: 'cloud',
    status: 'in_progress', priority: 'normal',
    data: {
      name: 'Priya Mehta', email: 'priya@datasync.in',
      app_type: 'ML pipeline + REST API', current_host: 'AWS EC2 self-managed',
      team_size: '4 engineers', monthly_traffic: '~50K requests/day',
    },
    source_url: '/cloud',
    assigned_to: 'tm2',
    created_at: daysAgo(3), updated_at: daysAgo(1),
    contact: { id: 'c3', email: 'priya@datasync.in', name: 'Priya Mehta', company: 'DataSync', lifecycle_stage: 'opportunity', created_at: daysAgo(10), updated_at: daysAgo(8) },
  },
  {
    id: 's4', contact_id: 'c4', type: 'ventures-application', division: 'ventures',
    status: 'new', priority: 'normal',
    data: {
      startup_name: 'GreenLoop', stage: 'mvp', sector: 'Climate Tech',
      description: 'Carbon credit marketplace for SMEs.',
      monthly_revenue: '$0', team_size: '2',
    },
    source_url: '/ventures/apply',
    created_at: hoursAgo(1), updated_at: hoursAgo(1),
    contact: { id: 'c4', email: 'luca@venturelab.it', name: 'Luca Bianchi', lifecycle_stage: 'lead', created_at: daysAgo(1), updated_at: daysAgo(1) },
  },
  {
    id: 's5', contact_id: 'c5', type: 'services-upgrade', division: 'services',
    status: 'converted', priority: 'normal',
    data: {
      current_plan: 'Starter', requested_plan: 'Growth',
      reason: 'Needing faster response SLA for production incidents',
    },
    source_url: '/services/plans',
    assigned_to: 'tm1', reviewed_at: daysAgo(5),
    created_at: daysAgo(7), updated_at: daysAgo(5),
    contact: { id: 'c5', email: 'anna@ecomstore.de', name: 'Anna Müller', company: 'EcomStore', lifecycle_stage: 'client', created_at: daysAgo(30), updated_at: daysAgo(2) },
  },
  {
    id: 's6', contact_id: 'c1', type: 'academy-enroll', division: 'academy',
    status: 'new', priority: 'low',
    data: {
      course: 'AI-Assisted Product Development', format: 'cohort',
      cohort_date: '2026-04-15',
    },
    source_url: '/academy',
    created_at: hoursAgo(14), updated_at: hoursAgo(14),
    contact: { id: 'c1', email: 'sarah@techcorp.io', name: 'Sarah Chen', company: 'TechCorp', lifecycle_stage: 'qualified', created_at: daysAgo(2), updated_at: daysAgo(2) },
  },
  {
    id: 's7', contact_id: 'c3', type: 'agents-inquiry', division: 'agents',
    status: 'reviewed', priority: 'high',
    data: {
      name: 'Priya Mehta', email: 'priya@datasync.in',
      use_case: 'Automated data ingestion and transformation agents for our analytics pipeline',
      budget_range: '$3K/mo',
    },
    source_url: '/',
    assigned_to: 'tm2',
    created_at: daysAgo(4), updated_at: daysAgo(2),
    contact: { id: 'c3', email: 'priya@datasync.in', name: 'Priya Mehta', company: 'DataSync', lifecycle_stage: 'opportunity', created_at: daysAgo(10), updated_at: daysAgo(8) },
  },
  {
    id: 's8', contact_id: 'c2', type: 'contact-general', division: 'parent',
    status: 'closed', priority: 'low',
    data: {
      subject: 'Partnership opportunity', message: 'We\'d love to explore a reseller arrangement.',
    },
    source_url: '/contact',
    notes: 'Referred to Arifur directly.',
    created_at: daysAgo(6), updated_at: daysAgo(5),
    contact: { id: 'c2', email: 'james@founderhq.co', name: 'James Okafor', company: 'FounderHQ', lifecycle_stage: 'lead', created_at: daysAgo(5), updated_at: daysAgo(4) },
  },
];

export const LEGACY_MOCK_TICKETS: Ticket[] = [
  {
    id: 't1', contact_id: 'c5', plan: 'growth',
    type: 'incident', priority: 'p1', title: 'Production API returning 502s — auth service down',
    description: 'Started 20 minutes ago. Auth service appears unresponsive, all logins failing.',
    status: 'acknowledged',
    acknowledged_at: hoursAgo(0.3),
    sla_response_deadline: hoursAgo(-0.7),
    created_at: hoursAgo(1), updated_at: hoursAgo(0.3),
  },
  {
    id: 't2', contact_id: 'c5', plan: 'growth',
    type: 'bug', priority: 'p2', title: 'Checkout webhook failing intermittently',
    description: 'Stripe webhooks succeeding but order DB not updating ~15% of the time.',
    status: 'in_progress',
    sla_response_deadline: hoursAgo(-2),
    sla_met: true,
    created_at: daysAgo(1), updated_at: hoursAgo(3),
  },
  {
    id: 't3', contact_id: 'c3', plan: 'starter',
    type: 'question', priority: 'p3', title: 'How do I add a custom domain to my hosted app?',
    status: 'resolved',
    resolved_at: daysAgo(1), resolution_notes: 'Walked through DNS configuration on call.',
    sla_met: true,
    created_at: daysAgo(2), updated_at: daysAgo(1),
  },
  {
    id: 't4', contact_id: 'c5', plan: 'growth',
    type: 'feature', priority: 'p3', title: 'Add EU data residency for GDPR compliance',
    description: 'Need all PII stored in EU region before Q3.',
    status: 'open',
    created_at: daysAgo(5), updated_at: daysAgo(5),
  },
  {
    id: 't5', contact_id: 'c3', plan: 'starter',
    type: 'bug', priority: 'p2', title: 'Nightly backup job timing out on large datasets',
    status: 'open',
    sla_response_deadline: new Date(now + 2 * 3_600_000).toISOString(),
    created_at: hoursAgo(4), updated_at: hoursAgo(4),
  },
];

export const LEGACY_MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: 'a1', actor_id: 'tm1', action: 'submission.status_changed',
    entity_type: 'submission', entity_id: 's2',
    details: { from: 'new', to: 'reviewed' },
    created_at: hoursAgo(5),
  },
  {
    id: 'a2', actor_id: 'tm2', action: 'submission.assigned',
    entity_type: 'submission', entity_id: 's7',
    details: { assigned_to: 'tm2' },
    created_at: daysAgo(2),
  },
  {
    id: 'a3', actor_id: 'tm1', action: 'ticket.acknowledged',
    entity_type: 'ticket', entity_id: 't1',
    details: { priority: 'p1' },
    created_at: hoursAgo(0.3),
  },
  {
    id: 'a4', actor_id: 'tm2', action: 'contact.lifecycle_changed',
    entity_type: 'contact', entity_id: 'c3',
    details: { from: 'qualified', to: 'opportunity' },
    created_at: daysAgo(8),
  },
  {
    id: 'a5', actor_id: 'tm1', action: 'submission.status_changed',
    entity_type: 'submission', entity_id: 's5',
    details: { from: 'reviewed', to: 'converted' },
    created_at: daysAgo(5),
  },
];

export const MOCK_METRICS = {
  new_leads_7d: 24,
  new_leads_trend: +18,
  pending_review: 8,
  active_projects: 12,
  active_agents: 34,
  services_clients: 19,
  open_tickets: 5,
  ventures_apps: 3,
  revenue_mtd: 48_200,
  revenue_trend: +11,
  pipeline_value: 186_000,
};

export const MOCK_TEAM: { id: string; name: string; role: string; initials: string }[] = [
  { id: 'tm1', name: 'Arifur Rahman', role: 'super_admin', initials: 'AR' },
  { id: 'tm2', name: 'Kamrul Hasan', role: 'super_admin', initials: 'KH' },
];

// ── New CRM Mock Data ─────────────────────────────────────────────────────

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 's1', status: 'new', priority: 'urgent', division: 'studio', type: 'Product Build',
    contact_name: 'Sarah Chen', contact_email: 'sarah@nexalabs.io', contact_id: 'c1',
    summary: 'Need to build a SaaS MVP for inventory management — have wireframes and a budget of $30k',
    assigned_to: undefined, ai_score: 78, created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    fields: { budget: '$30,000', timeline: '3 months', stack_preference: 'React + Node', have_wireframes: true, company: 'NexaLabs' },
    notes: [{ id: 'n1', author: 'INTAKE', author_type: 'agent', content: 'High intent signal. Budget confirmed. Has wireframes. Recommend fast-track to proposal.', created_at: new Date(Date.now() - 1.5 * 3600000).toISOString() }],
    tags: ['mvp', 'saas', 'high-budget'],
  },
  {
    id: 's2', status: 'reviewed', priority: 'high', division: 'services', type: 'Monitoring Plan',
    contact_name: 'Marcus Webb', contact_email: 'marcus@techflow.io', contact_id: 'c2',
    summary: 'Running a production Node.js app with 5k daily users, need 24/7 uptime monitoring + alerting',
    assigned_to: 'Arifur Rahman', ai_score: 85, created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    fields: { app_type: 'Node.js API', daily_users: '5,000', current_uptime: '99.1%', primary_concern: 'Alerting + auto-restart' },
    notes: [], tags: ['monitoring', 'node', 'production'],
  },
  {
    id: 's3', status: 'in_progress', priority: 'high', division: 'studio', type: 'Rescue Ship',
    contact_name: 'Priya Sharma', contact_email: 'priya@buildfast.io', contact_id: 'c3',
    summary: 'AI-generated codebase that is broken in production — crashes on login and cannot deploy',
    assigned_to: 'Kamrul Hasan', ai_score: 91, created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    fields: { stack: 'Next.js + Prisma + PostgreSQL', error_type: 'Runtime crash', ai_tool_used: 'Cursor + Claude', has_tests: false },
    notes: [
      { id: 'n2', author: 'Kamrul Hasan', author_type: 'human', content: 'Identified root cause: Prisma client not initialized in serverless context. Estimating 2 days to fix.', created_at: new Date(Date.now() - 4 * 3600000).toISOString() },
    ],
    tags: ['rescue', 'nextjs', 'urgent'],
  },
  {
    id: 's4', status: 'new', priority: 'normal', division: 'academy', type: 'Course Enrollment',
    contact_name: 'David Kim', contact_email: 'david@kimdigital.co', contact_id: 'c4',
    summary: 'Interested in AI Development Bootcamp for a team of 8 non-technical product managers',
    assigned_to: undefined, ai_score: 62, created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    fields: { team_size: 8, role: 'Product Manager', experience_level: 'Non-technical', preferred_format: 'Workshop' },
    notes: [], tags: ['team-training', 'workshop'],
  },
  {
    id: 's5', status: 'converted', priority: 'normal', division: 'ventures', type: 'Startup Application',
    contact_name: 'Leila Novak', contact_email: 'leila@nanofi.io', contact_id: 'c5',
    summary: 'FinTech startup in pre-seed stage, looking for technical co-founder + equity partnership',
    assigned_to: 'Arifur Rahman', ai_score: 74, created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    fields: { stage: 'Pre-seed', sector: 'FinTech', revenue: '$0', team_size: 2, looking_for: 'Technical co-founder' },
    notes: [
      { id: 'n3', author: 'Arifur Rahman', author_type: 'human', content: 'Strong founding team. FinTech experience relevant. Moving to due diligence.', created_at: new Date(Date.now() - 20 * 3600000).toISOString() },
    ],
    tags: ['fintech', 'pre-seed', 'equity'],
  },
  {
    id: 's6', status: 'new', priority: 'low', division: 'cloud', type: 'Hosting Assessment',
    contact_name: 'Tom Okafor', contact_email: 'tom@scale99.io', contact_id: 'c6',
    summary: 'React + Django app currently on bare metal, needs managed hosting with auto-scaling',
    assigned_to: undefined, ai_score: 55, created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    fields: { current_host: 'Hetzner bare metal', stack: 'React + Django + PostgreSQL', monthly_traffic: '50k req/day' },
    notes: [], tags: ['cloud', 'django', 'migration'],
  },
  {
    id: 's7', status: 'reviewed', priority: 'high', division: 'products', type: 'Product Demo',
    contact_name: 'Ana Lima', contact_email: 'ana@productco.io', contact_id: 'c7',
    summary: 'Evaluating FabricxAI for internal design system automation across 12 product teams',
    assigned_to: 'Kamrul Hasan', ai_score: 88, created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    fields: { team_count: 12, design_tool: 'Figma', current_pain: 'Manual component mapping', budget: '$15k/yr' },
    notes: [], tags: ['fabricxai', 'enterprise', 'demo'],
  },
  {
    id: 's8', status: 'closed', priority: 'low', division: 'labs', type: 'Research Inquiry',
    contact_name: 'James Park', contact_email: 'james@researchlabs.io', contact_id: 'c8',
    summary: 'Academic research partnership inquiry for AI agent behavior study',
    assigned_to: undefined, ai_score: 38, created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    fields: { institution: 'MIT CSAIL', research_area: 'Multi-agent systems', funding: 'NSF Grant' },
    notes: [], tags: ['research', 'academic'],
  },
]

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Sarah Chen', email: 'sarah@nexalabs.io', company: 'NexaLabs', phone: '+1 415 555 0142', source: 'Studio Form', stage: 'opportunity', tags: ['mvp', 'saas', 'high-value'], score: 78, assigned_to: undefined, last_activity_at: new Date(Date.now() - 2 * 3600000).toISOString(), created_at: new Date(Date.now() - 2 * 3600000).toISOString(), division_interests: ['studio'] },
  { id: 'c2', name: 'Marcus Webb', email: 'marcus@techflow.io', company: 'TechFlow Inc', phone: '+44 20 7946 0958', source: 'Services Form', stage: 'qualified', tags: ['monitoring', 'node', 'production'], score: 85, assigned_to: 'Arifur Rahman', last_activity_at: new Date(Date.now() - 3 * 3600000).toISOString(), created_at: new Date(Date.now() - 5 * 3600000).toISOString(), division_interests: ['services'] },
  { id: 'c3', name: 'Priya Sharma', email: 'priya@buildfast.io', company: 'BuildFast', phone: '+91 98765 43210', source: 'Studio Form', stage: 'client', tags: ['rescue', 'nextjs'], score: 91, assigned_to: 'Kamrul Hasan', last_activity_at: new Date(Date.now() - 6 * 3600000).toISOString(), created_at: new Date(Date.now() - 24 * 3600000).toISOString(), division_interests: ['studio'] },
  { id: 'c4', name: 'David Kim', email: 'david@kimdigital.co', company: 'Kim Digital', phone: undefined, source: 'Academy Form', stage: 'lead', tags: ['team-training'], score: 62, assigned_to: undefined, last_activity_at: new Date(Date.now() - 8 * 3600000).toISOString(), created_at: new Date(Date.now() - 8 * 3600000).toISOString(), division_interests: ['academy'] },
  { id: 'c5', name: 'Leila Novak', email: 'leila@nanofi.io', company: 'NanoFi', phone: '+1 650 555 0177', source: 'Ventures Form', stage: 'client', tags: ['fintech', 'pre-seed'], score: 74, assigned_to: 'Arifur Rahman', last_activity_at: new Date(Date.now() - 12 * 3600000).toISOString(), created_at: new Date(Date.now() - 48 * 3600000).toISOString(), division_interests: ['ventures'] },
  { id: 'c6', name: 'Tom Okafor', email: 'tom@scale99.io', company: 'Scale99', phone: undefined, source: 'Cloud Form', stage: 'lead', tags: ['cloud', 'django'], score: 55, assigned_to: undefined, last_activity_at: new Date(Date.now() - 3 * 3600000).toISOString(), created_at: new Date(Date.now() - 3 * 3600000).toISOString(), division_interests: ['cloud'] },
  { id: 'c7', name: 'Ana Lima', email: 'ana@productco.io', company: 'ProductCo', phone: '+55 11 9999 8888', source: 'Products Form', stage: 'opportunity', tags: ['fabricxai', 'enterprise'], score: 88, assigned_to: 'Kamrul Hasan', last_activity_at: new Date(Date.now() - 2 * 3600000).toISOString(), created_at: new Date(Date.now() - 6 * 3600000).toISOString(), division_interests: ['products'] },
  { id: 'c8', name: 'James Park', email: 'james@researchlabs.io', company: 'MIT CSAIL', phone: undefined, source: 'Labs Form', stage: 'lead', tags: ['research'], score: 38, assigned_to: undefined, last_activity_at: new Date(Date.now() - 48 * 3600000).toISOString(), created_at: new Date(Date.now() - 72 * 3600000).toISOString(), division_interests: ['labs'] },
]

export const MOCK_CONTACT_ACTIVITY: ContactActivity[] = [
  { id: 'a1', contact_id: 'c3', type: 'submission', division: 'studio', description: 'Submitted Rescue Ship form — Next.js production crash', linked_entity: 'Submission #s3', linked_href: '/admin/submissions', created_at: new Date(Date.now() - 24 * 3600000).toISOString(), actor: 'INTAKE' },
  { id: 'a2', contact_id: 'c3', type: 'email', division: 'studio', description: 'Welcome email sent — "We got your request, looking into it now"', linked_entity: 'Email #e1', created_at: new Date(Date.now() - 23 * 3600000).toISOString(), actor: 'HERALD' },
  { id: 'a3', contact_id: 'c3', type: 'pipeline', division: 'studio', description: 'Moved to In Progress — assigned to Kamrul Hasan', created_at: new Date(Date.now() - 20 * 3600000).toISOString(), actor: 'Kamrul Hasan' },
  { id: 'a4', contact_id: 'c3', type: 'note', description: 'Identified root cause: Prisma client not initialized in serverless context', created_at: new Date(Date.now() - 4 * 3600000).toISOString(), actor: 'Kamrul Hasan' },
]

export const MOCK_PIPELINE: Record<string, PipelineEntry[]> = {
  studio: [
    { id: 'p1', pipeline: 'studio', stage: 'New', contact_name: 'Sarah Chen', contact_email: 'sarah@nexalabs.io', contact_id: 'c1', company: 'NexaLabs', submission_type: 'Product Build', priority: 'urgent', assigned_to: undefined, ai_score: 78, entered_at: new Date(Date.now() - 2*3600000).toISOString(), notes_count: 1 },
    { id: 'p2', pipeline: 'studio', stage: 'Discovery Call', contact_name: 'Tom Okafor', contact_email: 'tom@scale99.io', contact_id: 'c6', company: 'Scale99', submission_type: 'Internal Tool', priority: 'normal', assigned_to: 'Arifur Rahman', ai_score: 65, entered_at: new Date(Date.now() - 3*86400000).toISOString(), notes_count: 2 },
    { id: 'p3', pipeline: 'studio', stage: 'Proposal Sent', contact_name: 'Marcus Webb', contact_email: 'marcus@techflow.io', contact_id: 'c2', company: 'TechFlow', submission_type: 'Product Build', priority: 'high', assigned_to: 'Kamrul Hasan', ai_score: 85, entered_at: new Date(Date.now() - 7*86400000).toISOString(), notes_count: 4 },
    { id: 'p4', pipeline: 'studio', stage: 'Building', contact_name: 'Priya Sharma', contact_email: 'priya@buildfast.io', contact_id: 'c3', company: 'BuildFast', submission_type: 'Rescue Ship', priority: 'high', assigned_to: 'Kamrul Hasan', ai_score: 91, entered_at: new Date(Date.now() - 5*86400000).toISOString(), notes_count: 6 },
    { id: 'p5', pipeline: 'studio', stage: 'Review', contact_name: 'Ana Lima', contact_email: 'ana@productco.io', company: 'ProductCo', submission_type: 'Consulting', priority: 'normal', assigned_to: 'Arifur Rahman', ai_score: 88, entered_at: new Date(Date.now() - 1*86400000).toISOString(), notes_count: 3 },
    { id: 'p6', pipeline: 'studio', stage: 'Launched', contact_name: 'David Kim', contact_email: 'david@kimdigital.co', company: 'Kim Digital', submission_type: 'Internal Tool', priority: 'normal', assigned_to: 'Kamrul Hasan', entered_at: new Date(Date.now() - 20*86400000).toISOString(), notes_count: 2 },
  ],
  services: [
    { id: 'ps1', pipeline: 'services', stage: 'New', contact_name: 'James Park', contact_email: 'james@researchlabs.io', company: 'MIT CSAIL', submission_type: 'Monitoring Plan', priority: 'normal', entered_at: new Date(Date.now() - 1*86400000).toISOString(), notes_count: 0 },
    { id: 'ps2', pipeline: 'services', stage: 'Audit Scheduled', contact_name: 'Leila Novak', contact_email: 'leila@nanofi.io', company: 'NanoFi', submission_type: 'Bug Fix', priority: 'high', assigned_to: 'Arifur Rahman', entered_at: new Date(Date.now() - 3*86400000).toISOString(), notes_count: 1 },
    { id: 'ps3', pipeline: 'services', stage: 'Active', contact_name: 'Marcus Webb', contact_email: 'marcus@techflow.io', company: 'TechFlow', submission_type: 'Monitoring Plan', priority: 'normal', assigned_to: 'Kamrul Hasan', ai_score: 85, entered_at: new Date(Date.now() - 30*86400000).toISOString(), notes_count: 8 },
  ],
  ventures: [
    { id: 'pv1', pipeline: 'ventures', stage: 'Received', contact_name: 'Tom Okafor', contact_email: 'tom@scale99.io', company: 'Scale99', submission_type: 'Startup Application', priority: 'normal', entered_at: new Date(Date.now() - 2*86400000).toISOString(), notes_count: 0 },
    { id: 'pv2', pipeline: 'ventures', stage: 'Screening', contact_name: 'Ana Lima', contact_email: 'ana@productco.io', company: 'ProductCo', submission_type: 'Equity Partnership', priority: 'high', assigned_to: 'Arifur Rahman', ai_score: 74, entered_at: new Date(Date.now() - 5*86400000).toISOString(), notes_count: 2 },
    { id: 'pv3', pipeline: 'ventures', stage: 'Portfolio', contact_name: 'Leila Novak', contact_email: 'leila@nanofi.io', company: 'NanoFi', submission_type: 'Startup Application', priority: 'normal', assigned_to: 'Arifur Rahman', ai_score: 80, entered_at: new Date(Date.now() - 45*86400000).toISOString(), notes_count: 12 },
  ],
  academy: [
    { id: 'pa1', pipeline: 'academy', stage: 'Enrolled', contact_name: 'David Kim', contact_email: 'david@kimdigital.co', company: 'Kim Digital', submission_type: 'Course Enrollment', priority: 'normal', entered_at: new Date(Date.now() - 0.5*86400000).toISOString(), notes_count: 0 },
    { id: 'pa2', pipeline: 'academy', stage: 'In Progress', contact_name: 'Sarah Chen', contact_email: 'sarah@nexalabs.io', company: 'NexaLabs', submission_type: 'Workshop', priority: 'normal', assigned_to: 'Arifur Rahman', entered_at: new Date(Date.now() - 14*86400000).toISOString(), notes_count: 1 },
    { id: 'pa3', pipeline: 'academy', stage: 'Certified', contact_name: 'James Park', contact_email: 'james@researchlabs.io', submission_type: 'Course Enrollment', priority: 'normal', entered_at: new Date(Date.now() - 60*86400000).toISOString(), notes_count: 0 },
  ],
  cloud: [
    { id: 'pc1', pipeline: 'cloud', stage: 'New', contact_name: 'Tom Okafor', contact_email: 'tom@scale99.io', company: 'Scale99', submission_type: 'Hosting Assessment', priority: 'normal', entered_at: new Date(Date.now() - 1*86400000).toISOString(), notes_count: 0 },
    { id: 'pc2', pipeline: 'cloud', stage: 'Assessment', contact_name: 'Marcus Webb', contact_email: 'marcus@techflow.io', company: 'TechFlow', submission_type: 'Migration', priority: 'high', assigned_to: 'Kamrul Hasan', entered_at: new Date(Date.now() - 4*86400000).toISOString(), notes_count: 3 },
    { id: 'pc3', pipeline: 'cloud', stage: 'Active', contact_name: 'Priya Sharma', contact_email: 'priya@buildfast.io', company: 'BuildFast', submission_type: 'Hosting Assessment', priority: 'normal', assigned_to: 'Kamrul Hasan', entered_at: new Date(Date.now() - 25*86400000).toISOString(), notes_count: 5 },
  ],
  agents: [
    { id: 'pag1', pipeline: 'agents', stage: 'New', contact_name: 'Ana Lima', contact_email: 'ana@productco.io', company: 'ProductCo', submission_type: 'Agent Deploy', priority: 'high', ai_score: 88, entered_at: new Date(Date.now() - 2*86400000).toISOString(), notes_count: 1 },
    { id: 'pag2', pipeline: 'agents', stage: 'Consultation', contact_name: 'Leila Novak', contact_email: 'leila@nanofi.io', company: 'NanoFi', submission_type: 'Agent Deploy', priority: 'normal', assigned_to: 'Arifur Rahman', entered_at: new Date(Date.now() - 6*86400000).toISOString(), notes_count: 2 },
    { id: 'pag3', pipeline: 'agents', stage: 'Deployed', contact_name: 'James Park', contact_email: 'james@researchlabs.io', company: 'MIT CSAIL', submission_type: 'Custom Integration', priority: 'normal', assigned_to: 'Kamrul Hasan', entered_at: new Date(Date.now() - 20*86400000).toISOString(), notes_count: 7 },
  ],
  labs: [
    { id: 'pl1', pipeline: 'labs', stage: 'Research', contact_name: 'Internal Team', contact_email: 'team@sociofi.tech', submission_type: 'Research Project', priority: 'normal', entered_at: new Date(Date.now() - 10*86400000).toISOString(), notes_count: 3 },
    { id: 'pl2', pipeline: 'labs', stage: 'Building', contact_name: 'Internal Team', contact_email: 'team@sociofi.tech', submission_type: 'Experiment', priority: 'normal', entered_at: new Date(Date.now() - 5*86400000).toISOString(), notes_count: 1 },
  ],
  products: [
    { id: 'pp1', pipeline: 'products', stage: 'Beta', contact_name: 'FabricxAI Users', contact_email: 'beta@sociofi.tech', submission_type: 'Beta Access', priority: 'normal', entered_at: new Date(Date.now() - 30*86400000).toISOString(), notes_count: 4 },
    { id: 'pp2', pipeline: 'products', stage: 'Live', contact_name: 'NEXUS ARIA', contact_email: 'product@sociofi.tech', submission_type: 'Product Launch', priority: 'normal', entered_at: new Date(Date.now() - 60*86400000).toISOString(), notes_count: 8 },
  ],
}

// ── CMS Mock Data ─────────────────────────────────────────────────────────────

import type { ContentItem, ContentVersion } from './types'

export const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'ct1', status: 'published', type: 'blog_post',
    title: 'Why AI Prototypes Break in Production',
    slug: 'why-ai-prototypes-break-in-production',
    division: 'studio', author: 'SCRIBE', author_type: 'agent', edited_by: 'Arifur Rahman',
    updated_at: new Date(Date.now() - 2*3600000).toISOString(),
    published_at: new Date(Date.now() - 1*86400000).toISOString(),
    word_count: 1240, tags: ['ai', 'development', 'debugging'],
    seo_title: 'Why AI Prototypes Break in Production — SocioFi',
    seo_description: 'Most AI-generated code looks great in demos but falls apart under real conditions. Here\'s what breaks and how to fix it.',
    metadata: { reading_time: 5 },
  },
  {
    id: 'ct2', status: 'draft', type: 'blog_post',
    title: 'The SocioFi Development Pipeline: How 10 AI Agents Build Software',
    slug: 'devbridge-pipeline-how-it-works',
    division: 'studio', author: 'SCRIBE', author_type: 'agent',
    updated_at: new Date(Date.now() - 5*3600000).toISOString(),
    word_count: 820, tags: ['devbridge', 'ai-agents', 'process'],
    metadata: { reading_time: 4 },
  },
  {
    id: 'ct3', status: 'review', type: 'case_study',
    title: 'From Broken Prototype to Production: Priya\'s Rescue Ship Story',
    slug: 'priya-rescue-ship-case-study',
    division: 'studio', author: 'SCRIBE', author_type: 'agent', edited_by: 'Kamrul Hasan',
    updated_at: new Date(Date.now() - 1*3600000).toISOString(),
    word_count: 980, tags: ['rescue', 'nextjs', 'case-study'],
    metadata: {},
  },
  {
    id: 'ct4', status: 'published', type: 'faq',
    title: 'How long does a typical project take?',
    slug: 'how-long-does-a-project-take',
    division: 'studio', author: 'Arifur Rahman', author_type: 'human',
    updated_at: new Date(Date.now() - 3*86400000).toISOString(),
    published_at: new Date(Date.now() - 3*86400000).toISOString(),
    word_count: 120, tags: ['faq', 'timeline'],
    metadata: { question: 'How long does a typical project take?', answer: 'Most projects take 4–12 weeks...', sort_order: 1 },
  },
  {
    id: 'ct5', status: 'draft', type: 'course',
    title: 'AI Development Bootcamp: Zero to Production',
    slug: 'ai-development-bootcamp',
    division: 'academy', author: 'Arifur Rahman', author_type: 'human',
    updated_at: new Date(Date.now() - 2*86400000).toISOString(),
    word_count: 2100, tags: ['bootcamp', 'ai', 'development'],
    metadata: { price: '$497', duration: '8 weeks', modules: 12 },
  },
  {
    id: 'ct6', status: 'published', type: 'testimonial',
    title: 'Sarah Chen — NexaLabs',
    slug: 'sarah-chen-nexalabs-testimonial',
    division: 'studio', author: 'Arifur Rahman', author_type: 'human',
    updated_at: new Date(Date.now() - 7*86400000).toISOString(),
    published_at: new Date(Date.now() - 7*86400000).toISOString(),
    word_count: 80, tags: ['testimonial', 'studio'],
    metadata: { rating: 5, company: 'NexaLabs', author_role: 'Founder' },
  },
]

export const MOCK_VERSIONS: ContentVersion[] = [
  { id: 'v1', content_id: 'ct1', version: 3, author: 'Arifur Rahman', author_type: 'human', note: 'Updated pricing section', created_at: new Date(Date.now() - 2*3600000).toISOString(), content_json: {} },
  { id: 'v2', content_id: 'ct1', version: 2, author: 'SCRIBE', author_type: 'agent', note: 'Added code examples', created_at: new Date(Date.now() - 1*86400000).toISOString(), content_json: {} },
  { id: 'v3', content_id: 'ct1', version: 1, author: 'SCRIBE', author_type: 'agent', note: 'Initial draft', created_at: new Date(Date.now() - 2*86400000).toISOString(), content_json: {} },
]

// ── Media Mock Data ───────────────────────────────────────────────────────────

import type { MediaItem } from './types'

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'm1', filename: 'hero-banner.webp', original_name: 'hero-banner.webp',
    public_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    mime_type: 'image/webp', size_bytes: 245000, media_type: 'image',
    folder: 'blog', alt_text: 'Circuit board close-up', width: 800, height: 600,
    uploaded_by: 'Arifur Rahman', created_at: new Date(Date.now() - 2*86400000).toISOString(),
  },
  {
    id: 'm2', filename: 'devbridge-diagram.png', original_name: 'devbridge-diagram.png',
    public_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    mime_type: 'image/png', size_bytes: 189000, media_type: 'image',
    folder: 'blog', alt_text: 'Development pipeline diagram', width: 1200, height: 800,
    uploaded_by: 'Kamrul Hasan', created_at: new Date(Date.now() - 3*86400000).toISOString(),
  },
  {
    id: 'm3', filename: 'sarah-chen-portrait.jpg', original_name: 'sarah-chen-portrait.jpg',
    public_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
    mime_type: 'image/jpeg', size_bytes: 98000, media_type: 'image',
    folder: 'portfolio', alt_text: 'Sarah Chen, NexaLabs founder', width: 400, height: 400,
    uploaded_by: 'Arifur Rahman', created_at: new Date(Date.now() - 5*86400000).toISOString(),
  },
  {
    id: 'm4', filename: 'sociofi-logo-dark.svg', original_name: 'sociofi-logo-dark.svg',
    public_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
    mime_type: 'image/svg+xml', size_bytes: 4200, media_type: 'image',
    folder: 'logos', alt_text: 'SocioFi Technology logo dark variant', width: 200, height: 60,
    uploaded_by: 'Arifur Rahman', created_at: new Date(Date.now() - 10*86400000).toISOString(),
  },
  {
    id: 'm5', filename: 'intake-agent-cover.webp', original_name: 'intake-agent-cover.webp',
    public_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    mime_type: 'image/webp', size_bytes: 312000, media_type: 'image',
    folder: 'agents', alt_text: 'AI agent visualization', width: 800, height: 500,
    uploaded_by: 'SCRIBE', created_at: new Date(Date.now() - 1*86400000).toISOString(),
  },
  {
    id: 'm6', filename: 'ai-bootcamp-cover.jpg', original_name: 'ai-bootcamp-cover.jpg',
    public_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    mime_type: 'image/jpeg', size_bytes: 201000, media_type: 'image',
    folder: 'courses', alt_text: 'AI development bootcamp course cover', width: 1200, height: 675,
    uploaded_by: 'Arifur Rahman', created_at: new Date(Date.now() - 7*86400000).toISOString(),
  },
  {
    id: 'm7', filename: 'case-study-priya.webp', original_name: 'case-study-priya.webp',
    public_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    mime_type: 'image/webp', size_bytes: 178000, media_type: 'image',
    folder: 'portfolio', alt_text: 'Priya Sharma case study hero image', width: 800, height: 500,
    uploaded_by: 'Kamrul Hasan', created_at: new Date(Date.now() - 4*86400000).toISOString(),
  },
  {
    id: 'm8', filename: 'onboarding-guide.pdf', original_name: 'Client Onboarding Guide v2.pdf',
    public_url: '#',
    mime_type: 'application/pdf', size_bytes: 1240000, media_type: 'document',
    folder: 'general', alt_text: undefined,
    uploaded_by: 'Arifur Rahman', created_at: new Date(Date.now() - 14*86400000).toISOString(),
  },
  {
    id: 'm9', filename: 'pricing-sheet.pdf', original_name: 'SocioFi Pricing Sheet Q1 2026.pdf',
    public_url: '#',
    mime_type: 'application/pdf', size_bytes: 456000, media_type: 'document',
    folder: 'general', alt_text: undefined,
    uploaded_by: 'Arifur Rahman', created_at: new Date(Date.now() - 6*86400000).toISOString(),
  },
  {
    id: 'm10', filename: 'studio-hero.webp', original_name: 'studio-hero.webp',
    public_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    mime_type: 'image/webp', size_bytes: 267000, media_type: 'image',
    folder: 'blog', alt_text: 'Developer at laptop — Studio division hero', width: 800, height: 533,
    uploaded_by: 'SCRIBE', created_at: new Date(Date.now() - 8*86400000).toISOString(),
  },
]

// ─── Content Calendar Mock Data ───────────────────────────────────────────────
// Current month = March 2026 (per project date)

const d = (day: number) => `2026-03-${String(day).padStart(2, '0')}`
const ts = (day: number) => new Date(`2026-03-${String(day).padStart(2, '0')}T10:00:00Z`).toISOString()

export const MOCK_CALENDAR_ENTRIES: CalendarEntry[] = [
  {
    id: 'cal1',
    title: 'Why AI-built apps fail in production',
    content_type: 'blog_post',
    category: 'Engineering',
    division: 'studio',
    target_date: d(3),
    status: 'published',
    assignee: 'scribe',
    priority: 'important',
    keywords: ['AI', 'production', 'debugging', 'founders'],
    outline: '1. The gap between prototype and product\n2. Common failure points\n3. How human oversight fixes it',
    content_id: 'cnt-001',
    scribe_stage: 'in_review',
    created_at: ts(1), updated_at: ts(3),
  },
  {
    id: 'cal2',
    title: 'Studio client case study: NexaLabs',
    content_type: 'case_study',
    category: 'Portfolio',
    division: 'studio',
    target_date: d(5),
    status: 'published',
    assignee: 'Kamrul Hasan',
    priority: 'important',
    keywords: ['case study', 'SaaS', 'product development'],
    created_at: ts(1), updated_at: ts(5),
  },
  {
    id: 'cal3',
    title: 'March newsletter: Q2 preview',
    content_type: 'newsletter',
    category: 'Company',
    division: 'studio',
    target_date: d(7),
    status: 'published',
    assignee: 'scribe',
    priority: 'normal',
    keywords: ['newsletter', 'Q2', 'updates'],
    scribe_stage: 'in_review',
    created_at: ts(2), updated_at: ts(6),
  },
  {
    id: 'cal4',
    title: 'The founder\'s guide to shipping fast',
    content_type: 'blog_post',
    category: 'Founders',
    division: 'studio',
    target_date: d(10),
    status: 'published',
    assignee: 'scribe',
    priority: 'normal',
    keywords: ['founders', 'shipping', 'MVP', 'speed'],
    scribe_stage: 'draft_ready',
    created_at: ts(4), updated_at: ts(8),
  },
  {
    id: 'cal5',
    title: 'Understanding managed hosting SLAs',
    content_type: 'blog_post',
    category: 'Cloud',
    division: 'cloud',
    target_date: d(12),
    status: 'review',
    assignee: 'scribe',
    priority: 'normal',
    keywords: ['cloud', 'SLA', 'uptime', 'hosting'],
    scribe_stage: 'draft_ready',
    created_at: ts(5), updated_at: ts(10),
  },
  {
    id: 'cal6',
    title: 'DataSync cloud migration case study',
    content_type: 'case_study',
    category: 'Cloud',
    division: 'cloud',
    target_date: d(14),
    status: 'in_progress',
    assignee: 'Arifur Rahman',
    priority: 'important',
    keywords: ['cloud migration', 'AWS', 'case study'],
    created_at: ts(6), updated_at: ts(12),
  },
  {
    id: 'cal7',
    title: 'Building autonomous AI agents in 2026',
    content_type: 'blog_post',
    category: 'AI',
    division: 'labs',
    target_date: d(17),
    status: 'in_progress',
    assignee: 'scribe',
    priority: 'important',
    keywords: ['AI agents', 'autonomous', 'LLM', 'agentic'],
    scribe_stage: 'outline_ready',
    outline: '1. What autonomous agents can do today\n2. Architecture patterns\n3. SocioFi NEXUS system\n4. Future outlook',
    created_at: ts(7), updated_at: ts(15),
  },
  {
    id: 'cal8',
    title: 'AI bootcamp Q2 cohort — now open',
    content_type: 'newsletter',
    category: 'Academy',
    division: 'academy',
    target_date: d(18),
    status: 'planned',
    assignee: 'scribe',
    priority: 'important',
    keywords: ['bootcamp', 'AI', 'Q2', 'enrolment'],
    scribe_stage: 'pending',
    created_at: ts(8), updated_at: ts(8),
  },
  {
    id: 'cal9',
    title: 'Ventures portfolio spotlight: NexaLabs',
    content_type: 'case_study',
    category: 'Ventures',
    division: 'ventures',
    target_date: d(20),
    status: 'planned',
    assignee: 'Arifur Rahman',
    priority: 'normal',
    keywords: ['ventures', 'portfolio', 'startup', 'spotlight'],
    created_at: ts(9), updated_at: ts(9),
  },
  {
    id: 'cal10',
    title: 'React Native vs Flutter in 2026',
    content_type: 'blog_post',
    category: 'Engineering',
    division: 'studio',
    target_date: d(22),
    status: 'planned',
    assignee: 'scribe',
    priority: 'normal',
    keywords: ['React Native', 'Flutter', 'mobile', '2026'],
    scribe_stage: 'pending',
    created_at: ts(10), updated_at: ts(10),
  },
  {
    id: 'cal11',
    title: 'Free AI tools workshop — April session',
    content_type: 'workshop',
    category: 'Academy',
    division: 'academy',
    target_date: d(25),
    status: 'planned',
    assignee: 'Kamrul Hasan',
    priority: 'important',
    keywords: ['workshop', 'AI tools', 'free', 'April'],
    created_at: ts(11), updated_at: ts(11),
  },
  {
    id: 'cal12',
    title: 'SocioFi Cloud vs AWS self-managed',
    content_type: 'blog_post',
    category: 'Cloud',
    division: 'cloud',
    target_date: d(27),
    status: 'planned',
    assignee: 'scribe',
    priority: 'normal',
    keywords: ['cloud', 'AWS', 'comparison', 'managed hosting'],
    scribe_stage: 'pending',
    created_at: ts(12), updated_at: ts(12),
  },
  {
    id: 'cal13',
    title: 'Open source AI utilities release',
    content_type: 'blog_post',
    category: 'Open Source',
    division: 'labs',
    target_date: d(29),
    status: 'planned',
    assignee: 'Kamrul Hasan',
    priority: 'normal',
    keywords: ['open source', 'GitHub', 'AI utilities'],
    created_at: ts(13), updated_at: ts(13),
  },
  {
    id: 'cal14',
    title: 'April content plan preview',
    content_type: 'email',
    category: 'Company',
    division: 'studio',
    target_date: d(31),
    status: 'planned',
    assignee: 'scribe',
    priority: 'normal',
    keywords: ['email', 'April', 'content plan'],
    scribe_stage: 'pending',
    created_at: ts(14), updated_at: ts(14),
  },
]

// ─── NEXUS Agent System Mock Data ─────────────────────────────────────────────

export const MOCK_AGENT_CONFIGS: AgentConfig[] = [
  { name: 'NEXUS',     label: 'NEXUS',     tagline: 'Master orchestrator — coordinates all agents', status: 'active',  last_run: hoursAgo(0.5),  success_rate: 99, tasks_week: 127, approvals_pending: 0,  color: '#3A589E' },
  { name: 'INTAKE',    label: 'INTAKE',    tagline: 'Qualifies leads and processes form submissions',  status: 'active',  last_run: hoursAgo(0.2),  success_rate: 96, tasks_week: 43,  approvals_pending: 2,  color: '#59A392' },
  { name: 'HERALD',    label: 'HERALD',    tagline: 'Personalized email outreach and follow-ups',      status: 'running', last_run: hoursAgo(0.1),  success_rate: 94, tasks_week: 31,  approvals_pending: 3,  color: '#6BA3E8' },
  { name: 'SCRIBE',    label: 'SCRIBE',    tagline: 'Content creation — blog posts and case studies',  status: 'idle',    last_run: hoursAgo(4),    success_rate: 88, tasks_week: 8,   approvals_pending: 2,  color: '#7B6FE8' },
  { name: 'OVERSEER',  label: 'OVERSEER',  tagline: 'Client app monitoring and incident detection',    status: 'active',  last_run: hoursAgo(0.05), success_rate: 99, tasks_week: 204, approvals_pending: 1,  color: '#E8B84D' },
  { name: 'PATCHER',   label: 'PATCHER',   tagline: 'Automated bug fixes and dependency updates',      status: 'idle',    last_run: hoursAgo(12),   success_rate: 91, tasks_week: 14,  approvals_pending: 1,  color: '#E8916F' },
  { name: 'ARCHITECT', label: 'ARCHITECT', tagline: 'System design reviews and architecture checks',   status: 'idle',    last_run: daysAgo(1),     success_rate: 97, tasks_week: 5,   approvals_pending: 0,  color: '#4DBFA8' },
  { name: 'FORGE',     label: 'FORGE',     tagline: 'Feature development and code generation',         status: 'running', last_run: hoursAgo(1),    success_rate: 89, tasks_week: 19,  approvals_pending: 2,  color: '#72C4B2' },
  { name: 'SENTINEL',  label: 'SENTINEL',  tagline: 'Security scanning and vulnerability monitoring',  status: 'active',  last_run: hoursAgo(0.3),  success_rate: 99, tasks_week: 56,  approvals_pending: 0,  color: '#EF4444' },
  { name: 'ATLAS',     label: 'ATLAS',     tagline: 'Cloud infrastructure provisioning and scaling',   status: 'idle',    last_run: daysAgo(2),     success_rate: 98, tasks_week: 7,   approvals_pending: 0,  color: '#5BB5E0' },
  { name: 'CHRONICLE', label: 'CHRONICLE', tagline: 'Analytics, reporting and performance summaries',  status: 'active',  last_run: hoursAgo(2),    success_rate: 95, tasks_week: 22,  approvals_pending: 1,  color: '#A78BFA' },
  { name: 'MENTOR',    label: 'MENTOR',    tagline: 'Academy content creation and course updates',     status: 'idle',    last_run: daysAgo(3),     success_rate: 92, tasks_week: 4,   approvals_pending: 0,  color: '#F0D080' },
  { name: 'SCOUT',     label: 'SCOUT',     tagline: 'Research, competitive intelligence and trends',   status: 'paused',  last_run: daysAgo(5),     success_rate: 87, tasks_week: 2,   approvals_pending: 0,  color: '#94A3B8' },
]

export const MOCK_APPROVAL_ITEMS: ApprovalItem[] = [
  // HERALD — email approvals
  {
    id: 'appr-001', agent: 'HERALD', action: 'send_email', confidence: 94, priority: 'normal',
    status: 'pending', title: 'Welcome email to Sarah Chen',
    context: 'New Studio/Rescue inquiry, AI score 78, mentioned deployment issues — personalized response crafted',
    payload: {
      to: 'sarah@techcorp.io', to_name: 'Sarah Chen',
      subject: 'Welcome, Sarah — Let\'s Talk About Your Deployment Issue',
      html: `<p>Hi Sarah,</p>
<p>Thanks for reaching out to SocioFi. I read through your message about the deployment challenges you're running into — this is genuinely one of the most common problems we see with AI-built apps, and it's absolutely fixable.</p>
<p>Here's the honest picture: the code your AI tool generated is probably quite solid. What's usually missing is the scaffolding around it — proper environment configs, CI/CD, error handling, and someone who knows how to debug at 2am when something breaks.</p>
<p>That's exactly where our Studio team comes in. We'd love to get on a quick 30-minute call to understand your stack and see if we can help.</p>
<p><a href="https://sociofi.co/studio/start-project">Book a free intro call →</a></p>
<p>— Arifur</p>`,
      division: 'studio', submission_id: 's1',
    },
    created_at: hoursAgo(1),
  },
  {
    id: 'appr-002', agent: 'HERALD', action: 'send_email', confidence: 87, priority: 'high',
    status: 'pending', title: 'Follow-up: James Okafor (Rescue inquiry)',
    context: 'Rescue inquiry, 3 days no response, AI score 82 — sending gentle follow-up',
    payload: {
      to: 'james@founderhq.co', to_name: 'James Okafor',
      subject: 'Quick follow-up — your rescue project',
      html: `<p>Hey James,</p>
<p>Following up on your Rescue Ship inquiry from a few days ago. I know things get busy.</p>
<p>Your situation — an offshore-built app that works but breaks weekly — is one we've helped fix dozens of times. We can usually stabilize it within 2 weeks and have a clear maintenance plan in place.</p>
<p>Happy to hop on a 20-minute call this week if that works.</p>
<p>— Kamrul</p>`,
      division: 'studio', submission_id: 's2',
    },
    created_at: hoursAgo(2),
  },
  {
    id: 'appr-003', agent: 'HERALD', action: 'send_newsletter', confidence: 91, priority: 'normal',
    status: 'pending', title: 'March newsletter to 847 subscribers',
    context: 'Monthly newsletter — SCRIBE drafted, HERALD ready to send via Resend',
    payload: {
      list: 'main_subscribers', count: 847,
      subject: 'SocioFi March Update: New Studio Projects + Labs Research Drop',
      preview_text: 'What we shipped, what we learned, and what\'s coming in April.',
      html: `<h2>March Update from SocioFi</h2>
<p>It's been a busy month. Here's what the team has been up to…</p>
<h3>Studio shipped 3 new products</h3>
<p>InboxFlow (AI email management), DataSync dashboard upgrade, and a fintech prototype for a Dhaka-based startup…</p>
<h3>Labs published new research</h3>
<p>Our deep-dive into autonomous agent memory systems went live. 1,200 reads in the first 48 hours…</p>`,
    },
    created_at: hoursAgo(3),
  },
  // SCRIBE — content approvals
  {
    id: 'appr-004', agent: 'SCRIBE', action: 'publish_content', confidence: 88, priority: 'normal',
    status: 'pending', title: 'Blog: "Why AI-Generated Code Needs Human Review"',
    context: 'Scheduled content from March 10 calendar entry · Labs division · Written on-time',
    payload: {
      content_type: 'blog_post', division: 'labs', category: 'AI Development',
      word_count: 1847, reading_time: 10,
      slug: '/labs/blog/why-ai-generated-code-needs-human-review',
      excerpt: 'AI coding tools have gotten remarkably good at generating syntactically correct code. But there\'s a growing gap between "it runs" and "it\'s production-ready." Here\'s what human engineers catch that AI tools miss.',
      preview: `AI coding tools have gotten remarkably good. You describe what you want, and within seconds you have a working function, a complete component, sometimes an entire module.

But here's what we've learned after helping dozens of founders take AI-built prototypes into production: **the code running on your laptop is not the same problem as the code running in production**.

The gap between "it works on my machine" and "it works for 10,000 users at 3am on a Tuesday" is where most AI-built apps fall apart. Not because the AI wrote bad code — but because production environments surface assumptions that development environments hide.

**What AI tools miss (and humans catch):**

1. **Race conditions under load** — AI writes correct single-threaded logic. Production introduces concurrency. An AI tool won't anticipate that your payment webhook handler might be called 50 times simultaneously.

2. **Secret management** — AI-generated code often includes hardcoded credentials, .env examples in the wrong place, or insecure defaults. We fix these before every deployment.`,
    },
    created_at: hoursAgo(5),
  },
  {
    id: 'appr-005', agent: 'SCRIBE', action: 'publish_content', confidence: 82, priority: 'normal',
    status: 'pending', title: 'Case Study: DataSync Cloud Migration',
    context: 'Calendar entry cal6 · 5 days past target date · Cloud division · Awaiting review',
    payload: {
      content_type: 'case_study', division: 'cloud', category: 'Portfolio',
      word_count: 1240, reading_time: 7,
      slug: '/cloud/case-studies/datasync-migration',
      excerpt: 'How DataSync cut their AWS bill by 40% and eliminated 3 weekly incidents by moving to SocioFi managed cloud.',
      preview: `DataSync came to us managing their own AWS infrastructure — three EC2 instances, an RDS cluster, and a custom-built monitoring setup that required a dedicated engineer 8 hours a week just to maintain.

The situation wasn't unusual. Their ML pipeline was solid. Their API was well-designed. But their infrastructure had grown organically, and every month brought new surprises: an unexpected bill spike, a 2am incident, a dependency that broke during a routine update.

**What we did:**
In week one, we conducted a full infrastructure audit. We found 14 configuration issues that were costing money or creating risk. The biggest: they were running oversized instances for predictable, low-variance workloads.`,
    },
    created_at: hoursAgo(8),
  },
  // OVERSEER — monitoring approval
  {
    id: 'appr-006', agent: 'OVERSEER', action: 'escalate_ticket', confidence: 96, priority: 'high',
    status: 'pending', title: 'Escalate: InboxFlow API latency spike (P2)',
    context: 'p95 latency jumped from 180ms to 2.3s over 15 min · Likely DB connection pool exhaustion',
    payload: {
      client: 'InboxFlow', incident_id: 'INC-2247',
      metric: 'API p95 latency', current: '2.3s', baseline: '180ms',
      root_cause_hypothesis: 'PostgreSQL connection pool exhaustion (current: 98/100 connections)',
      suggested_action: 'Scale connection pool to 200, investigate long-running queries',
      notify: ['sarah@techcorp.io'],
    },
    created_at: hoursAgo(0.3),
  },
  // PATCHER — patch approval
  {
    id: 'appr-007', agent: 'PATCHER', action: 'apply_patch', confidence: 93, priority: 'normal',
    status: 'pending', title: 'Dependency update: next@14.2.21 → 15.1.4',
    context: 'Security patch + performance improvements · Tested on staging · No breaking changes detected',
    payload: {
      package: 'next', from: '14.2.21', to: '15.1.4',
      affected_projects: ['InboxFlow', 'DataSync Dashboard'],
      test_result: 'pass', staging_url: 'https://staging.sociofi.co',
      breaking_changes: [],
      release_notes_summary: 'Security fix for CVE-2026-1234, ~12% reduction in build times',
    },
    created_at: hoursAgo(6),
  },
  // CHRONICLE — report approval
  {
    id: 'appr-008', agent: 'CHRONICLE', action: 'send_report', confidence: 97, priority: 'normal',
    status: 'pending', title: 'Weekly performance report to Arifur',
    context: 'Automated Monday morning report — covers all divisions, key metrics, flags',
    payload: {
      to: 'arifur@sociofi.co', report_type: 'weekly_performance',
      period: 'March 17–23, 2026',
      highlights: ['Studio: 3 new leads, 1 project launched', 'Services: 0 SLA breaches', 'SCRIBE: 2 posts queued for review', 'Academy: 14 new enrolments'],
    },
    created_at: hoursAgo(0.5),
  },
  // FORGE — feature deployment
  {
    id: 'appr-009', agent: 'FORGE', action: 'deploy_feature', confidence: 85, priority: 'high',
    status: 'pending', title: 'Deploy: InboxFlow smart-reply feature to staging',
    context: 'Feature complete · Unit tests pass (98%) · E2E tests pass · Ready for staging review',
    payload: {
      project: 'InboxFlow', feature: 'Smart Reply Suggestions',
      branch: 'feature/smart-replies-v2',
      test_coverage: 98, e2e_pass: true,
      staging_url: 'https://staging.inboxflow.app/smart-replies',
      pr_url: 'https://github.com/sociofi/inboxflow/pull/142',
      estimated_impact: 'Reduces reply time by ~65% for common email types',
    },
    created_at: hoursAgo(1),
  },
  // Already decided items (for history)
  {
    id: 'appr-010', agent: 'HERALD', action: 'send_email', confidence: 92, priority: 'normal',
    status: 'approved', title: 'Onboarding email to Priya Mehta',
    context: 'Cloud inquiry — approved and sent',
    payload: { to: 'priya@datasync.in', to_name: 'Priya Mehta', subject: 'Welcome to SocioFi Cloud assessment', html: '…' },
    created_at: daysAgo(1), decided_at: daysAgo(1), decided_by: 'Arifur Rahman',
  },
  {
    id: 'appr-011', agent: 'SCRIBE', action: 'publish_content', confidence: 79, priority: 'normal',
    status: 'edited', title: 'Blog: "Founder\'s guide to shipping fast"',
    context: 'Edited before publishing — intro rewritten, CTA added',
    payload: { content_type: 'blog_post', division: 'studio', word_count: 1340 },
    created_at: daysAgo(2), decided_at: daysAgo(2), decided_by: 'Kamrul Hasan',
    edit_details: { changed_sections: ['introduction', 'conclusion'], added_cta: true },
  },
]

export const MOCK_AGENT_RUNS: AgentRun[] = [
  { id: 'run-001', agent: 'INTAKE',    trigger: 'webhook',   status: 'completed', started_at: hoursAgo(0.2),  duration_ms: 1240,  input_summary: 'New Studio form submission from Sarah Chen', output_summary: 'Lead qualified (score: 78), contact created, HERALD triggered', approvals_created: 1 },
  { id: 'run-002', agent: 'HERALD',    trigger: 'auto',      status: 'running',   started_at: hoursAgo(0.1),  input_summary: 'Send welcome email to Sarah Chen (submission s1)',   approvals_created: 1 },
  { id: 'run-003', agent: 'OVERSEER',  trigger: 'schedule',  status: 'completed', started_at: hoursAgo(0.05), duration_ms: 340,   input_summary: 'Monitor InboxFlow API — 5-min health check', output_summary: 'Latency spike detected — p95: 2.3s (baseline: 180ms)', approvals_created: 1 },
  { id: 'run-004', agent: 'NEXUS',     trigger: 'schedule',  status: 'completed', started_at: hoursAgo(0.5),  duration_ms: 2100,  input_summary: 'Morning orchestration — routing tasks to agents', output_summary: 'OVERSEER, HERALD, CHRONICLE tasks dispatched', approvals_created: 0 },
  { id: 'run-005', agent: 'SCRIBE',    trigger: 'schedule',  status: 'completed', started_at: hoursAgo(5),    duration_ms: 42000, input_summary: 'Write blog post: "Why AI-Generated Code Needs Human Review"', output_summary: '1,847 words drafted, queued for approval', approvals_created: 1 },
  { id: 'run-006', agent: 'FORGE',     trigger: 'manual',    status: 'running',   started_at: hoursAgo(1),    input_summary: 'Build InboxFlow smart-reply feature v2',  approvals_created: 1 },
  { id: 'run-007', agent: 'SENTINEL',  trigger: 'schedule',  status: 'completed', started_at: hoursAgo(0.3),  duration_ms: 8200,  input_summary: 'Daily security scan — all client projects', output_summary: 'No vulnerabilities detected. Dependency audit: 2 minor updates available', approvals_created: 0 },
  { id: 'run-008', agent: 'CHRONICLE', trigger: 'schedule',  status: 'completed', started_at: hoursAgo(2),    duration_ms: 5400,  input_summary: 'Generate weekly performance report (March 17-23)', output_summary: 'Report generated — 4 KPI cards, 3 flags, 2 recommendations', approvals_created: 1 },
  { id: 'run-009', agent: 'PATCHER',   trigger: 'auto',      status: 'completed', started_at: hoursAgo(12),   duration_ms: 18000, input_summary: 'Check and apply next.js security updates', output_summary: 'next 14.2.21 → 15.1.4 tested on staging. Awaiting approval.', approvals_created: 1 },
  { id: 'run-010', agent: 'INTAKE',    trigger: 'webhook',   status: 'failed',    started_at: hoursAgo(8),    duration_ms: 320,   input_summary: 'Process Ventures application submission', output_summary: undefined, error: 'ventures_pipeline table not found in Supabase', approvals_created: 0 },
  { id: 'run-011', agent: 'HERALD',    trigger: 'auto',      status: 'completed', started_at: daysAgo(1),     duration_ms: 2800,  input_summary: 'Send onboarding email to Priya Mehta (cloud inquiry)', output_summary: 'Email sent via Resend. Open tracked at 09:14.', approvals_created: 1 },
  { id: 'run-012', agent: 'SCRIBE',    trigger: 'schedule',  status: 'completed', started_at: daysAgo(2),     duration_ms: 38000, input_summary: 'Write blog post: Founder\'s guide to shipping fast', output_summary: '1,340 words drafted, approved with edits, published', approvals_created: 1 },
]

// ─── Newsletter Mock Data ─────────────────────────────────────────────────────

export const MOCK_SUBSCRIBER_LISTS: SubscriberList[] = [
  { id: 'list-general',  name: 'General',  description: 'Main subscriber list — all updates', subscriber_count: 847, created_at: daysAgo(365) },
  { id: 'list-labs',     name: 'Labs',     description: 'Technical research and experiments',   subscriber_count: 312, created_at: daysAgo(180) },
  { id: 'list-academy',  name: 'Academy',  description: 'Course and workshop announcements',    subscriber_count: 524, created_at: daysAgo(240) },
  { id: 'list-founders', name: 'Founders', description: 'Solo founders and entrepreneurs',      subscriber_count: 418, created_at: daysAgo(120) },
]

export const MOCK_NEWSLETTER_ISSUES: NewsletterIssue[] = [
  // Current draft — April 2026, CURATOR-prepared
  {
    id: 'nl-apr-2026',
    label: 'April 2026', month: 3, year: 2026,
    status: 'draft',
    subject_a: 'SocioFi April: 3 launches, a free AI workshop, and what we\'re building next',
    subject_b: 'What we shipped in March (and what\'s coming in April)',
    editorial: `March was our busiest month yet. Three new client products shipped to production, our Labs team published research on autonomous agent memory systems that got 1,200 reads in 48 hours, and we opened enrolments for our AI Engineering Bootcamp.

The pattern we keep seeing: founders and teams who've built something solid with AI tools — but hit a wall when it's time to go live. That's exactly the gap we exist to fill. If you know someone in that situation, send them our way.

Here's what happened this month, and what we're building toward in April.`,
    curated_posts: [
      { id: 'cp1', post_id: 'blog-001', title: 'Why AI-Generated Code Needs Human Review', excerpt: 'AI coding tools have gotten remarkably good at generating syntactically correct code. But there\'s a growing gap between "it runs" and "it\'s production-ready."', url: '/labs/blog/why-ai-generated-code-needs-human-review', division: 'labs', order: 0 },
      { id: 'cp2', post_id: 'blog-002', title: 'The Founder\'s Guide to Shipping Fast', excerpt: 'Speed matters more than perfection in early-stage products. Here\'s how to move fast without breaking the things that actually matter.', url: '/studio/blog/founders-guide-shipping-fast', division: 'studio', order: 1 },
      { id: 'cp3', post_id: 'blog-003', title: 'Managed Cloud vs DIY AWS: The Real Numbers', excerpt: 'We ran the numbers on 12 client projects. The results surprised us — and they might surprise you too.', url: '/cloud/blog/managed-vs-diy-aws', division: 'cloud', order: 2 },
    ],
    division_highlights: [
      { division: 'studio', headline: 'Studio shipped 3 products in March', body: 'InboxFlow, DataSync dashboard v2, and a fintech prototype for a Dhaka-based startup — all in production.', cta_label: 'See our portfolio', cta_url: '/studio/portfolio' },
      { division: 'academy', headline: 'AI Bootcamp Q2 enrolments are open', body: '8-week intensive covering AI-native development, deployment, and architecture. Limited to 24 seats.', cta_label: 'Apply now', cta_url: '/academy/courses/ai-bootcamp' },
      { division: 'labs', headline: 'New research: autonomous agent memory', body: 'Our deep-dive into how AI agents store, retrieve, and act on long-term context — published and free to read.', cta_label: 'Read the research', cta_url: '/labs/research/agent-memory' },
    ],
    custom_sections: [],
    list_ids: ['list-general'],
    recipient_count: 847,
    prepared_by: 'curator',
    created_at: daysAgo(3), updated_at: hoursAgo(2),
  },

  // March 2026 — sent
  {
    id: 'nl-mar-2026',
    label: 'March 2026', month: 2, year: 2026,
    status: 'sent',
    subject_a: 'SocioFi March: New AI tools research + Studio project openings',
    editorial: `February was a month of building. Our Studio team onboarded three new projects, Labs released a new experiment, and we started accepting applications for our next Academy cohort.`,
    curated_posts: [
      { id: 'cp4', post_id: 'blog-004', title: 'Building Autonomous AI Agents in 2026', excerpt: 'The landscape of AI agent architectures has shifted dramatically. Here\'s what we\'ve learned building NEXUS.', url: '/labs/blog/autonomous-agents-2026', division: 'labs', order: 0 },
      { id: 'cp5', post_id: 'blog-005', title: 'Understanding Managed Hosting SLAs', excerpt: 'What "99.9% uptime" actually means, and what to ask your hosting provider before you sign anything.', url: '/cloud/blog/managed-hosting-slas', division: 'cloud', order: 1 },
    ],
    division_highlights: [
      { division: 'studio', headline: '2 new project slots open in April', body: 'We\'re taking on two new builds in April. Preference for founders with an existing prototype.', cta_label: 'Start a project', cta_url: '/studio/start-project' },
    ],
    custom_sections: [],
    list_ids: ['list-general'],
    recipient_count: 821,
    sent_at: new Date(2026, 1, 28).toISOString(),
    open_rate: 38.4, click_rate: 12.1, unsubscribes: 4,
    prepared_by: 'curator',
    created_at: daysAgo(32), updated_at: daysAgo(30),
  },

  // February 2026 — sent
  {
    id: 'nl-feb-2026',
    label: 'February 2026', month: 1, year: 2026,
    status: 'sent',
    subject_a: 'SocioFi February: What we launched + free AI workshop this month',
    editorial: 'January was our strongest month for new Studio inquiries yet. Here\'s what happened and what\'s coming.',
    curated_posts: [],
    division_highlights: [],
    custom_sections: [],
    list_ids: ['list-general'],
    recipient_count: 790,
    sent_at: new Date(2026, 0, 31).toISOString(),
    open_rate: 41.2, click_rate: 14.7, unsubscribes: 6,
    prepared_by: 'human',
    created_at: daysAgo(62), updated_at: daysAgo(60),
  },

  // January 2026 — sent
  {
    id: 'nl-jan-2026',
    label: 'January 2026', month: 0, year: 2026,
    status: 'sent',
    subject_a: '2025 in review + what SocioFi is building in 2026',
    editorial: 'We\'re kicking off 2026 with a clear picture of where we\'re headed.',
    curated_posts: [],
    division_highlights: [],
    custom_sections: [],
    list_ids: ['list-general'],
    recipient_count: 753,
    sent_at: new Date(2025, 11, 31).toISOString(),
    open_rate: 44.8, click_rate: 16.2, unsubscribes: 3,
    prepared_by: 'human',
    created_at: daysAgo(92), updated_at: daysAgo(90),
  },
]

export const MOCK_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: 'sub-001', email: 'sarah@techcorp.io',    name: 'Sarah Chen',    lists: ['list-general','list-founders'], source: 'organic',  status: 'active',       subscribed_at: daysAgo(45),  last_opened: daysAgo(2),  open_count: 8,  click_count: 3, tags: ['hot-lead','saas'] },
  { id: 'sub-002', email: 'james@founderhq.co',   name: 'James Okafor', lists: ['list-general','list-founders'], source: 'referral', status: 'active',       subscribed_at: daysAgo(60),  last_opened: daysAgo(5),  open_count: 6,  click_count: 2, tags: ['founder'] },
  { id: 'sub-003', email: 'priya@datasync.in',    name: 'Priya Mehta',  lists: ['list-general'],                 source: 'linkedin', status: 'active',       subscribed_at: daysAgo(90),  last_opened: daysAgo(30), open_count: 3,  click_count: 1, tags: ['enterprise'] },
  { id: 'sub-004', email: 'luca@venturelab.it',   name: 'Luca Bianchi', lists: ['list-general','list-founders'], source: 'direct',   status: 'active',       subscribed_at: daysAgo(12),  last_opened: daysAgo(1),  open_count: 2,  click_count: 1, tags: [] },
  { id: 'sub-005', email: 'anna@ecomstore.de',    name: 'Anna Müller',  lists: ['list-general'],                 source: 'paid',     status: 'active',       subscribed_at: daysAgo(120), last_opened: daysAgo(60), open_count: 2,  click_count: 0, tags: ['ecommerce'] },
  { id: 'sub-006', email: 'dev@hackertown.io',    name: undefined,      lists: ['list-labs'],                    source: 'organic',  status: 'active',       subscribed_at: daysAgo(30),  last_opened: daysAgo(3),  open_count: 4,  click_count: 5, tags: ['developer'] },
  { id: 'sub-007', email: 'ming@aibuilders.sg',   name: 'Ming Zhao',    lists: ['list-academy','list-general'],  source: 'academy',  status: 'active',       subscribed_at: daysAgo(20),  last_opened: daysAgo(7),  open_count: 3,  click_count: 2, tags: ['student'] },
  { id: 'sub-008', email: 'old@startup.com',      name: undefined,      lists: ['list-general'],                 source: 'organic',  status: 'unsubscribed', subscribed_at: daysAgo(200), last_opened: daysAgo(180),open_count: 1,  click_count: 0, tags: [] },
  { id: 'sub-009', email: 'bounce@fakeemail.xyz', name: undefined,      lists: ['list-general'],                 source: 'import',   status: 'bounced',      subscribed_at: daysAgo(10),  last_opened: undefined,    open_count: 0,  click_count: 0, tags: [] },
  { id: 'sub-010', email: 'rafi@dhaka.tech',      name: 'Rafiqul Islam', lists: ['list-general','list-labs'],   source: 'organic',  status: 'active',       subscribed_at: daysAgo(5),   last_opened: daysAgo(1),  open_count: 2,  click_count: 1, tags: ['local'] },
]
