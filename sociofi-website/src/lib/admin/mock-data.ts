import { Submission as LegacySubmission, Ticket, Contact as LegacyContact, ActivityLog } from '@/lib/supabase/types';
import type { Submission, Contact, ContactActivity, PipelineEntry } from '@/lib/admin/types'

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
