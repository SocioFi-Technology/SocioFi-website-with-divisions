export type Role = 'super_admin' | 'division_lead' | 'editor' | 'viewer';
export type Division = 'studio' | 'agents' | 'services' | 'cloud' | 'academy' | 'ventures' | 'labs' | 'parent';
export type SubmissionStatus = 'new' | 'reviewed' | 'in_progress' | 'converted' | 'closed' | 'archived';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type LifecycleStage = 'lead' | 'qualified' | 'opportunity' | 'client' | 'churned';
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';
export type TicketPriority = 'p1' | 'p2' | 'p3' | 'p4';
export type TicketStatus = 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';

export interface TeamMember {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  role: Role;
  divisions: Division[];
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  role?: string;
  source?: string;
  division_interest?: Division[];
  tags?: string[];
  lifecycle_stage: LifecycleStage;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  contact_id: string;
  type: string;
  division: Division;
  status: SubmissionStatus;
  priority: Priority;
  data: Record<string, unknown>;
  source_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  assigned_to?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  contact?: Contact;
  assignee?: TeamMember;
}

export interface PipelineEntry {
  id: string;
  contact_id: string;
  submission_id?: string;
  division: Division;
  stage: string;
  value_estimate?: number;
  probability?: number;
  expected_close?: string;
  assigned_to?: string;
  notes?: string;
  won_at?: string;
  lost_at?: string;
  lost_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown>;
  created_at: string;
  actor?: TeamMember;
}

export interface Content {
  id: string;
  type: string;
  division?: Division;
  title: string;
  slug?: string;
  body: Record<string, unknown>;
  status: ContentStatus;
  author_id?: string;
  published_at?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  lists: string[];
  confirmed: boolean;
  confirm_token?: string;
  confirmed_at?: string;
  unsubscribed: boolean;
  unsub_at?: string;
  source?: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  contact_id: string;
  course_id: string;
  course_title: string;
  type: string;
  status: string;
  price_paid?: number;
  payment_ref?: string;
  enrolled_at: string;
  completed_at?: string;
  certificate?: string;
}

export interface VenturesApplication {
  id: string;
  contact_id: string;
  startup_name: string;
  stage: string;
  sector?: string;
  pitch_deck_url?: string;
  data: Record<string, unknown>;
  status: string;
  reviewer_id?: string;
  reviewed_at?: string;
  decision_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  contact_id: string;
  plan?: string;
  type: string;
  priority: TicketPriority;
  title: string;
  description?: string;
  status: TicketStatus;
  assigned_to?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
  sla_response_deadline?: string;
  sla_met?: boolean;
  created_at: string;
  updated_at: string;
}
