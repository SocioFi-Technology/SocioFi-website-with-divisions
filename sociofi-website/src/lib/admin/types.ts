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
