import { Submission, Ticket, Contact, ActivityLog } from '@/lib/supabase/types';

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const MOCK_CONTACTS: Contact[] = [
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

export const MOCK_SUBMISSIONS: Submission[] = [
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

export const MOCK_TICKETS: Ticket[] = [
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

export const MOCK_ACTIVITY: ActivityLog[] = [
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
