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
