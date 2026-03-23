export type Division = 'studio' | 'services' | 'labs' | 'products' | 'academy' | 'ventures' | 'cloud'
export type SubmissionStatus = 'new' | 'reviewed' | 'in_progress' | 'converted' | 'closed'
export type SubmissionPriority = 'urgent' | 'high' | 'normal' | 'low'
export type LifecycleStage = 'lead' | 'qualified' | 'opportunity' | 'client' | 'churned'

export const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2',
  services: '#4DBFA8',
  labs: '#A78BFA',
  products: '#E8916F',
  academy: '#E8B84D',
  ventures: '#6BA3E8',
  cloud: '#5BB5E0',
}

export const STATUS_COLORS: Record<SubmissionStatus, string> = {
  new: '#4ade80',
  reviewed: '#60a5fa',
  in_progress: '#E8B84D',
  converted: '#59A392',
  closed: '#64748B',
}

export const PRIORITY_COLORS: Record<SubmissionPriority, string> = {
  urgent: '#EF4444',
  high: '#E8916F',
  normal: '#59A392',
  low: '#64748B',
}

export const STAGE_COLORS: Record<LifecycleStage, string> = {
  lead: '#64748B',
  qualified: '#6BA3E8',
  opportunity: '#E8B84D',
  client: '#59A392',
  churned: '#EF4444',
}

export interface Submission {
  id: string
  status: SubmissionStatus
  priority: SubmissionPriority
  division: Division
  type: string
  contact_name: string
  contact_email: string
  contact_id?: string
  summary: string
  assigned_to?: string
  ai_score?: number
  created_at: string
  updated_at: string
  fields: Record<string, string | number | boolean | null>
  notes: Note[]
  tags: string[]
}

export interface Note {
  id: string
  author: string
  author_type: 'human' | 'agent'
  content: string
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  source: string
  stage: LifecycleStage
  tags: string[]
  score: number
  assigned_to?: string
  last_activity_at: string
  created_at: string
  division_interests: Division[]
}

export interface ContactActivity {
  id: string
  contact_id: string
  type: 'submission' | 'pipeline' | 'email' | 'note' | 'ticket' | 'enrollment'
  division?: Division
  description: string
  linked_entity?: string
  linked_href?: string
  created_at: string
  actor: string
}

export interface PipelineEntry {
  id: string
  pipeline: string
  stage: string
  contact_name: string
  contact_email: string
  contact_id?: string
  company?: string
  submission_type: string
  priority: SubmissionPriority
  assigned_to?: string
  ai_score?: number
  entered_at: string
  notes_count: number
}

export const STAGE_THRESHOLDS: Record<string, Record<string, number>> = {
  studio: { 'New': 2, 'Review': 5, 'Discovery Call': 3, 'Scoping': 5, 'Proposal Sent': 7, 'Negotiation': 5, 'Building': 30 },
  services: { 'New': 2, 'Review': 1, 'Audit Scheduled': 7, 'Active': 0 },
  ventures: { 'Received': 3, 'Screening': 7, 'Deep Review': 14 },
  academy: { 'Enrolled': 1, 'In Progress': 60 },
  cloud: { 'New': 2, 'Setup': 14 },
  agents: { 'New': 2, 'Consultation': 7 },
  labs: { 'Research': 0 },
  products: { 'Beta': 0 },
}

export const DIVISION_STAGES: Record<string, string[]> = {
  studio: ['New','Review','Discovery Call','Scoping','Proposal Sent','Negotiation','Accepted','Building','Launched','Maintenance','Won','Lost'],
  agents: ['New','Review','Consultation','Agent Selection','Integration','Testing','Deployed','Active','Churned','Lost'],
  services: ['New','Review','Audit Scheduled','Audit Done','Plan Recommended','Accepted','Onboarding','Active','Churned','Lost'],
  cloud: ['New','Review','Assessment','Recommendation','Accepted','Setup','Migration','Active','Churned','Lost'],
  ventures: ['Received','Screening','Deep Review','Interview Scheduled','Interview Done','Terms Drafting','Terms Sent','Negotiation','Accepted','Building','Launched','Portfolio','Rejected','Waitlisted'],
  academy: ['Enrolled','In Progress','Completed','Certified','Refunded'],
  labs: ['Idea','Research','Experiment','Building','Published','Archived'],
  products: ['Beta','Live','Maintenance','Deprecated'],
}

export const DIVISION_KPI_LABELS: Record<string, string[]> = {
  studio: ['New Leads','In Progress','Launched','Revenue (MTD)'],
  services: ['New Leads','Active Clients','Tickets Open','MRR'],
  ventures: ['Applications','In Review','Portfolio','Fund Deployed'],
  academy: ['Enrolled','Active Learners','Certified','Revenue (MTD)'],
  cloud: ['New Leads','Active','Incidents','MRR'],
  agents: ['New Leads','Active Deployments','Monitoring','Revenue (MTD)'],
  labs: ['Projects','In Research','Published','—'],
  products: ['Products','Beta Users','Live Users','MRR'],
}

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived'
export type ContentType = 'blog_post' | 'case_study' | 'testimonial' | 'faq' | 'course' | 'workshop' | 'agent_catalog' | 'experiment' | 'open_source'

export const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  draft: '#64748B',
  review: '#E8B84D',
  published: '#4ade80',
  archived: '#EF4444',
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  blog_post: 'Blog Post',
  case_study: 'Case Study',
  testimonial: 'Testimonial',
  faq: 'FAQ',
  course: 'Course',
  workshop: 'Workshop',
  agent_catalog: 'Agent Catalog',
  experiment: 'Experiment',
  open_source: 'Open Source',
}

export interface ContentItem {
  id: string
  status: ContentStatus
  type: ContentType
  title: string
  slug: string
  division?: string
  author: string
  author_type: 'human' | 'agent'
  edited_by?: string
  updated_at: string
  published_at?: string
  word_count?: number
  tags: string[]
  seo_title?: string
  seo_description?: string
  featured_image?: string
  metadata: Record<string, unknown>
  content_json?: Record<string, unknown>
}

export interface ContentVersion {
  id: string
  content_id: string
  version: number
  author: string
  author_type: 'human' | 'agent'
  note?: string
  created_at: string
  content_json: Record<string, unknown>
}

// ─── Content Calendar ────────────────────────────────────────────────────────

export type CalendarEntryStatus = 'planned' | 'in_progress' | 'review' | 'published' | 'missed'
export type CalendarContentType = 'blog_post' | 'case_study' | 'newsletter' | 'workshop' | 'video' | 'social' | 'email'

export interface CalendarEntry {
  id: string
  title: string
  content_type: CalendarContentType
  category: string
  division: string
  target_date: string           // 'YYYY-MM-DD'
  status: CalendarEntryStatus
  assignee: string              // 'scribe' | team member name
  priority: 'normal' | 'important'
  keywords: string[]
  outline?: string
  content_id?: string           // linked ContentItem once draft exists
  scribe_stage?: 'pending' | 'outline_ready' | 'draft_ready' | 'in_review'
  notes?: string
  created_at: string
  updated_at: string
}

export const CALENDAR_TYPE_COLORS: Record<CalendarContentType, string> = {
  blog_post:  '#59A392',
  case_study: '#E8916F',
  newsletter: '#7B6FE8',
  workshop:   '#E8B84D',
  video:      '#6BA3E8',
  social:     '#4DBFA8',
  email:      '#A78BFA',
}

export const CALENDAR_TYPE_LABELS: Record<CalendarContentType, string> = {
  blog_post:  'Blog',
  case_study: 'Case Study',
  newsletter: 'Newsletter',
  workshop:   'Workshop',
  video:      'Video',
  social:     'Social',
  email:      'Email',
}

export const CALENDAR_STATUS_COLORS: Record<CalendarEntryStatus, string> = {
  planned:     '#64748B',
  in_progress: '#E8B84D',
  review:      '#60a5fa',
  published:   '#4ade80',
  missed:      '#EF4444',
}

// ─── Media Library ────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'document' | 'video' | 'other'
export type MediaFolder = 'all' | 'blog' | 'portfolio' | 'agents' | 'courses' | 'logos' | 'general'

export interface MediaItem {
  id: string
  filename: string
  original_name: string
  public_url: string
  mime_type: string
  size_bytes: number
  media_type: MediaType
  folder: Exclude<MediaFolder, 'all'>
  alt_text?: string
  width?: number
  height?: number
  uploaded_by: string
  created_at: string
}

// ─── NEXUS Agent System ───────────────────────────────────────────────────────

export type AgentName =
  | 'INTAKE' | 'HERALD' | 'SCRIBE' | 'OVERSEER' | 'PATCHER'
  | 'ARCHITECT' | 'FORGE' | 'SENTINEL' | 'ATLAS' | 'CHRONICLE'
  | 'MENTOR' | 'SCOUT' | 'NEXUS'
  | 'SURVEYOR' | 'RELAY' | 'AUDITOR'

export type AgentStatus = 'active' | 'idle' | 'running' | 'error' | 'paused'

export type ApprovalActionType =
  | 'send_email' | 'publish_content' | 'apply_patch' | 'deploy_feature'
  | 'send_report' | 'escalate_ticket' | 'create_content' | 'update_pipeline'
  | 'send_newsletter' | 'schedule_post'

export type ApprovalPriority = 'urgent' | 'high' | 'normal' | 'low'
export type ApprovalStatus = 'pending' | 'approved' | 'edited' | 'discarded' | 'snoozed'

export interface ApprovalItem {
  id: string
  agent: AgentName
  action: ApprovalActionType
  confidence: number              // 0-100
  priority: ApprovalPriority
  status: ApprovalStatus
  title: string
  context: string
  payload: Record<string, unknown>
  created_at: string
  snooze_until?: string
  decided_at?: string
  decided_by?: string
  edit_details?: Record<string, unknown>
  discard_reason?: string
}

export interface AgentConfig {
  name: AgentName
  label: string
  tagline: string
  status: AgentStatus
  last_run?: string
  success_rate: number            // 0-100
  tasks_week: number
  approvals_pending: number
  color: string
}

export interface AgentRun {
  id: string
  agent: AgentName
  trigger: 'auto' | 'manual' | 'webhook' | 'schedule'
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  started_at: string
  duration_ms?: number
  input_summary: string
  output_summary?: string
  error?: string
  approvals_created: number
}

export const AGENT_COLORS: Record<AgentName, string> = {
  INTAKE:    '#59A392',
  HERALD:    '#6BA3E8',
  SCRIBE:    '#7B6FE8',
  OVERSEER:  '#E8B84D',
  PATCHER:   '#E8916F',
  ARCHITECT: '#4DBFA8',
  FORGE:     '#72C4B2',
  SENTINEL:  '#EF4444',
  ATLAS:     '#5BB5E0',
  CHRONICLE: '#A78BFA',
  MENTOR:    '#F0D080',
  SCOUT:     '#94A3B8',
  NEXUS:     '#3A589E',
  SURVEYOR:  '#59A392',
  RELAY:     '#E8B84D',
  AUDITOR:   '#EF4444',
}

export const AGENT_STATUS_COLORS: Record<AgentStatus, string> = {
  active:  '#4ade80',
  idle:    '#94A3B8',
  running: '#E8B84D',
  error:   '#EF4444',
  paused:  '#64748B',
}

export const APPROVAL_PRIORITY_COLORS: Record<ApprovalPriority, string> = {
  urgent: '#EF4444',
  high:   '#E8916F',
  normal: '#59A392',
  low:    '#64748B',
}

// ─── Newsletter System ────────────────────────────────────────────────────────

export type NewsletterStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled'
export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced'

export const NEWSLETTER_STATUS_COLORS: Record<NewsletterStatus, string> = {
  draft:     '#64748B',
  scheduled: '#E8B84D',
  sent:      '#4ade80',
  cancelled: '#EF4444',
}

export interface CuratedPost {
  id: string
  post_id: string
  title: string
  excerpt: string
  url: string
  division: string
  image_url?: string
  order: number
}

export interface DivisionHighlight {
  division: string
  headline: string
  body: string
  cta_label: string
  cta_url: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
  order: number
}

export interface NewsletterIssue {
  id: string
  label: string               // e.g. "April 2026"
  month: number               // 0-indexed
  year: number
  status: NewsletterStatus
  subject_a: string
  subject_b?: string
  editorial: string           // opening paragraph HTML/text
  curated_posts: CuratedPost[]
  division_highlights: DivisionHighlight[]
  custom_sections: CustomSection[]
  list_ids: string[]          // subscriber list IDs
  recipient_count: number
  scheduled_at?: string
  sent_at?: string
  open_rate?: number
  click_rate?: number
  unsubscribes?: number
  prepared_by: 'curator' | 'human'
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  lists: string[]
  source: string
  status: SubscriberStatus
  subscribed_at: string
  last_opened?: string
  open_count: number
  click_count: number
  tags: string[]
}

export interface SubscriberList {
  id: string
  name: string
  description: string
  subscriber_count: number
  created_at: string
}

// ─── Ticket / WARDEN System ───────────────────────────────────────────────────

export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4'
export type TicketStatus = 'open' | 'acknowledged' | 'in_progress' | 'testing' | 'resolved' | 'closed'
export type TicketType = 'bug' | 'feature' | 'security' | 'performance' | 'incident'
export type ServicePlan = 'starter' | 'growth' | 'scale' | 'enterprise'

export const TICKET_PRIORITY_COLORS: Record<TicketPriority, string> = {
  P1: '#EF4444',
  P2: '#E8B84D',
  P3: '#94A3B8',
  P4: '#475569',
}

export const TICKET_TYPE_COLORS: Record<TicketType, string> = {
  bug:         '#EF4444',
  feature:     '#6BA3E8',
  security:    '#E8B84D',
  performance: '#59A392',
  incident:    '#EF4444',
}

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  open:         '#64748B',
  acknowledged: '#6BA3E8',
  in_progress:  '#E8B84D',
  testing:      '#A78BFA',
  resolved:     '#4ade80',
  closed:       '#334155',
}

// SLA hours: [response, resolution] per priority
export const SLA_HOURS: Record<TicketPriority, [number, number]> = {
  P1: [1,   4],
  P2: [4,   24],
  P3: [8,   72],
  P4: [24,  168],
}

export const PLAN_COLORS: Record<ServicePlan, string> = {
  starter:    '#64748B',
  growth:     '#59A392',
  scale:      '#6BA3E8',
  enterprise: '#A78BFA',
}

export interface TicketTimelineEntry {
  id: string
  actor: string
  actor_type: 'human' | 'agent'
  content: string
  created_at: string
}

export interface TicketAttachment {
  id: string
  filename: string
  size_bytes: number
  uploaded_by: string
  created_at: string
  url: string
}

export interface WardenSimilarTicket {
  id: string
  title: string
  resolved_at: string
  resolution_notes: string
}

export interface WardenClassification {
  type: TicketType
  priority: TicketPriority
  routing_reason: string
  suggested_resolution: string
  similar_tickets: WardenSimilarTicket[]
}

export interface ServiceTicket {
  id: string
  priority: TicketPriority
  status: TicketStatus
  type: TicketType
  title: string
  description: string
  client_name: string
  client_email: string
  client_company?: string
  plan: ServicePlan
  assigned_to?: string
  sla_response_deadline: string
  sla_resolution_deadline: string
  sla_response_met?: boolean
  sla_resolution_met?: boolean
  created_at: string
  updated_at: string
  acknowledged_at?: string
  started_at?: string
  resolved_at?: string
  closed_at?: string
  resolution_notes?: string
  prevention_notes?: string
  tags: string[]
  timeline: TicketTimelineEntry[]
  attachments: TicketAttachment[]
  warden: WardenClassification
}

// ─── Ventures Application System ─────────────────────────────────────────────

export type ApplicationStatus = 'pending' | 'interview' | 'accepted' | 'rejected' | 'waitlisted'
export type ValidationStatus  = 'paying' | 'waitlist' | 'conversations' | 'none'
export type CommitmentLevel   = 'full_time' | 'part_time' | 'transitioning'
export type PartnershipModel  = 'equity' | 'revenue_share' | 'hybrid'
export type ReviewDecision    = 'accept' | 'reject' | 'waitlist' | 'interview'

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending:    '#64748B',
  interview:  '#6BA3E8',
  accepted:   '#4ade80',
  rejected:   '#EF4444',
  waitlisted: '#E8B84D',
}

export const VALIDATION_COLORS: Record<ValidationStatus, string> = {
  paying:        '#4ade80',
  waitlist:      '#72C4B2',
  conversations: '#E8B84D',
  none:          '#EF4444',
}

export const COMMITMENT_LABELS: Record<CommitmentLevel, string> = {
  full_time:    'Full-time',
  part_time:    'Part-time',
  transitioning: 'Transitioning to full-time',
}

export const PARTNERSHIP_LABELS: Record<PartnershipModel, string> = {
  equity:        'Equity stake',
  revenue_share: 'Revenue share',
  hybrid:        'Hybrid (equity + revenue share)',
}

export interface ApplicationAttachment {
  id: string
  filename: string
  size_bytes: number
  type: 'pitch_deck' | 'financial_model' | 'prototype' | 'other'
  url: string
}

export interface ApplicationScores {
  founder_market_fit:    number  // 1–5, step 0.5
  demand_validation:     number
  revenue_model_clarity: number
  technical_feasibility: number
  founder_commitment:    number
}

export interface ApplicationScoreNotes {
  founder_market_fit?:    string
  demand_validation?:     string
  revenue_model_clarity?: string
  technical_feasibility?: string
  founder_commitment?:    string
}

export interface VenturesApplication {
  id: string
  status: ApplicationStatus
  submitted_at: string
  decision_due: string   // submitted_at + 7 days

  // Step 1 — Founder Profile
  founder_name:       string
  founder_email:      string
  founder_bio:        string
  founder_linkedin:   string
  founder_commitment: CommitmentLevel

  // Step 2 — Product
  product_name:        string
  product_description: string
  problem_statement:   string
  target_customer:     string
  revenue_model:       string
  validation_status:   ValidationStatus
  validation_details:  string

  // Step 3 — Partnership
  prior_attempts:    string
  preferred_model:   PartnershipModel
  growth_plan:       string

  // Step 4 — Additional
  additional_context?: string
  attachments:         ApplicationAttachment[]

  // Reviewer scoring (may be partially filled)
  scores?:      ApplicationScores
  score_notes?: ApplicationScoreNotes
  weighted_score?: number  // cached computed value

  // Decision
  decision?:        ReviewDecision
  decision_reason?: string
  decision_at?:     string
  decision_by?:     string

  // Accepted deal terms
  deal_model?:             PartnershipModel
  equity_percent?:         number
  vesting_schedule?:       string
  revenue_share_percent?:  number
  revenue_share_cap?:      string
  revenue_share_duration?: string
  upfront_amount?:         number

  // HERALD draft created on rejection
  rejection_email_id?: string
}

// ─── Academy System ───────────────────────────────────────────────────────────

export type CourseAudience    = 'founders' | 'leaders' | 'teams' | 'developers' | 'all'
export type CourseFormat      = 'self_paced' | 'cohort' | 'workshop' | 'live'
export type EnrollmentStatus  = 'active' | 'completed' | 'paused' | 'cancelled' | 'refunded'
export type WorkshopFormat    = 'virtual' | 'in_person' | 'hybrid'
export type SCARLWeekStatus   = 'not_started' | 'in_progress' | 'completed' | 'missed'

export const AUDIENCE_COLORS: Record<CourseAudience, string> = {
  founders:   '#E8916F',
  leaders:    '#6BA3E8',
  teams:      '#4DBFA8',
  developers: '#7B6FE8',
  all:        '#64748B',
}

export const AUDIENCE_LABELS: Record<CourseAudience, string> = {
  founders:   'Founders',
  leaders:    'Leaders',
  teams:      'Teams',
  developers: 'Developers',
  all:        'All Audiences',
}

export const ENROLLMENT_STATUS_COLORS: Record<EnrollmentStatus, string> = {
  active:    '#4ade80',
  completed: '#6BA3E8',
  paused:    '#E8B84D',
  cancelled: '#64748B',
  refunded:  '#EF4444',
}

export interface CourseLesson {
  id: string
  title: string
  duration_min: number
  type: 'video' | 'reading' | 'quiz' | 'exercise'
}

export interface CourseModule {
  id: string
  title: string
  order: number
  lessons: CourseLesson[]
  total_duration_min: number
}

export interface Course {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  audience: CourseAudience
  format: CourseFormat
  price_usd: number
  stripe_price_id?: string
  description: string
  outcomes: string[]
  prerequisites?: string
  instructor_name: string
  instructor_bio?: string
  modules: CourseModule[]
  total_duration_min: number
  enrollment_count: number
  completion_rate: number   // 0-100
  avg_rating?: number
  created_at: string
  updated_at: string
  published_at?: string
  tags: string[]
  is_free: boolean
  thumbnail_url?: string
  mentor_drafted?: boolean
}

export interface Workshop {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  format: WorkshopFormat
  price_usd: number
  description: string
  instructor_name: string
  date: string          // ISO date string
  time: string          // "14:00 UTC"
  duration_min: number
  max_seats: number
  registered_count: number
  waitlist_count: number
  recording_url?: string
  location?: string      // for in-person
  meeting_url?: string   // for virtual
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CourseEnrollment {
  id: string
  student_name: string
  student_email: string
  course_id?: string
  course_title?: string
  workshop_id?: string
  workshop_title?: string
  type: 'course' | 'workshop'
  enrolled_at: string
  status: EnrollmentStatus
  progress_percent: number   // 0–100
  last_activity_at?: string
  completed_at?: string
  payment_status: 'paid' | 'free' | 'refunded' | 'pending'
  payment_amount_usd: number
  certificate_issued?: boolean
}

export interface SCARLParticipant {
  id: string
  name: string
  email: string
  company?: string
  role: string
  week_progress: SCARLWeekStatus[]  // array of 6: one per week
  assessment_scores: (number | null)[]  // 0–100 per week, null if not taken
  overall_score?: number
  status: 'active' | 'graduated' | 'dropped'
}

export interface SCARLCohort {
  id: string
  name: string          // e.g. "Cohort 1 — Q2 2026"
  quarter: string       // "Q2 2026"
  status: 'upcoming' | 'active' | 'completed'
  start_date: string
  end_date: string
  current_week: number  // 1-6
  max_participants: number
  participants: SCARLParticipant[]
  description: string
}

// ─── Agent Deployment System ──────────────────────────────────────────────────

export type DeploymentStatus = 'active' | 'paused' | 'error' | 'pending_setup' | 'archived'
export type OversightLevel   = 'strict' | 'moderate' | 'autonomous'
export type RunStatus        = 'success' | 'failed' | 'pending_review' | 'running' | 'cancelled'
export type ConnectorStatus  = 'connected' | 'failed' | 'not_configured'
export type ConnectorType    = 'gmail' | 'hubspot' | 'slack' | 'notion' | 'airtable' | 'stripe' | 'github' | 'linear' | 'jira' | 'webhook' | 'zapier' | 'google_sheets' | 'intercom' | 'salesforce' | 'postgres' | 'supabase'

export const DEPLOYMENT_STATUS_COLORS: Record<DeploymentStatus, string> = {
  active:        '#4ade80',
  paused:        '#E8B84D',
  error:         '#EF4444',
  pending_setup: '#6BA3E8',
  archived:      '#475569',
}

export const RUN_STATUS_COLORS: Record<RunStatus, string> = {
  success:        '#4ade80',
  failed:         '#EF4444',
  pending_review: '#E8B84D',
  running:        '#6BA3E8',
  cancelled:      '#475569',
}

export const OVERSIGHT_LABELS: Record<OversightLevel, string> = {
  strict:     'Strict — all outputs require human approval',
  moderate:   'Moderate — approve flagged outputs only',
  autonomous: 'Autonomous — runs without human review',
}

export const CONNECTOR_ICONS: Record<ConnectorType, string> = {
  gmail:        'G',
  hubspot:      'H',
  slack:        'S',
  notion:       'N',
  airtable:     'A',
  stripe:       '$',
  github:       'GH',
  linear:       'L',
  jira:         'J',
  webhook:      'WH',
  zapier:       'Z',
  google_sheets:'GS',
  intercom:     'IC',
  salesforce:   'SF',
  postgres:     'PG',
  supabase:     'SB',
}

export interface DeploymentConnector {
  id: string
  type: ConnectorType
  label: string
  status: ConnectorStatus
  last_checked_at?: string
  error_message?: string
  config_summary: string
}

export interface AgentRunEntry {
  id: string
  deployment_id: string
  status: RunStatus
  trigger: 'scheduled' | 'manual' | 'webhook'
  started_at: string
  completed_at?: string
  duration_ms?: number
  tokens_used?: number
  input_summary: string
  output_summary?: string
  output_full?: string
  error_message?: string
  was_overridden?: boolean
  override_reason?: string
}

export interface AgentDeployment {
  id: string
  client_name: string
  client_email: string
  client_company?: string
  client_plan: 'starter' | 'growth' | 'scale' | 'enterprise'
  agent_name: AgentName
  agent_label: string
  status: DeploymentStatus
  health_score: number
  oversight: OversightLevel
  created_at: string
  activated_at?: string
  last_run_at?: string
  next_run_at?: string
  schedule_cron: string
  schedule_human: string
  connectors: DeploymentConnector[]
  custom_rules: Record<string, string | number | boolean>
  output_emails: string[]
  output_slack_webhook?: string
  output_format: 'email' | 'slack' | 'notion' | 'airtable' | 'webhook'
  run_history: AgentRunEntry[]
  success_rate: number
  avg_duration_ms: number
  drift_score: number
  override_rate: number
  total_runs_30d: number
}

export interface AgentCatalogItem {
  name: AgentName
  label: string
  description: string
  category: 'content' | 'pipeline' | 'monitoring' | 'communication' | 'analytics' | 'development'
  required_connectors: ConnectorType[]
  optional_connectors: ConnectorType[]
  custom_rule_schema: Record<string, { type: 'string' | 'number' | 'boolean' | 'select', label: string, options?: string[], default?: string | number | boolean }>
  example_output: string
  typical_schedule: string
}
