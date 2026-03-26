'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { fetchPipelineSnapshot, fetchAgentLastRuns, fetchAttentionItems } from './queries'

export interface KPIData {
  newLeads: number
  newLeadsDelta: number
  pendingReview: number
  activeProjects: number
  activeProjectsDelta: number
  activeAgents: number
  openTickets: number
  openTicketsDelta: number
  servicesClients: number
  venturesApps: number
}

export interface AgentStatus {
  id: string
  name: string
  role: string
  status: 'active' | 'delayed' | 'error' | 'idle'
  lastRunMinutes: number | null
  tasksToday: number
  color: string
}

export interface ApprovalItem {
  id: string
  agent_name: string
  action_type: string
  subject: string
  urgency: 'high' | 'medium' | 'low'
  confidence: number
  created_at: string
}

export interface AttentionItem {
  id: string
  type: 'ticket' | 'submission' | 'followup' | 'ventures' | 'sla'
  priority: 'red' | 'amber'
  description: string
  time: string
  href: string
}

export interface ActivityItem {
  id: string
  actor: string
  actor_type: 'human' | 'agent'
  action: string
  entity_type?: string
  entity_name?: string
  created_at: string
}

export interface PipelineBar {
  division: string
  color: string
  stages: { label: string; count: number; color: string }[]
  total: number
}

export interface DashboardData {
  kpi: KPIData
  agents: AgentStatus[]
  approvals: ApprovalItem[]
  attention: AttentionItem[]
  activity: ActivityItem[]
  pipeline: PipelineBar[]
  loading: boolean
  error: string | null
  usingMock: boolean
}

// ── Mock data (used when Supabase tables don't have data yet) ──
function getMockData(): Omit<DashboardData, 'loading' | 'error' | 'usingMock'> {
  return {
    kpi: {
      newLeads: 12, newLeadsDelta: 3,
      pendingReview: 6,
      activeProjects: 8, activeProjectsDelta: 1,
      activeAgents: 10,
      openTickets: 7, openTicketsDelta: -2,
      servicesClients: 24,
      venturesApps: 4,
    },
    agents: [
      { id: 'intake', name: 'INTAKE', role: 'Lead Classifier', status: 'active', lastRunMinutes: 3, tasksToday: 14, color: '#72C4B2' },
      { id: 'scribe', name: 'SCRIBE', role: 'Content Writer', status: 'active', lastRunMinutes: 8, tasksToday: 6, color: '#7B6FE8' },
      { id: 'herald', name: 'HERALD', role: 'Email Drafter', status: 'active', lastRunMinutes: 12, tasksToday: 9, color: '#5BB5E0' },
      { id: 'warden', name: 'WARDEN', role: 'Ticket Triage', status: 'active', lastRunMinutes: 5, tasksToday: 11, color: '#E8916F' },
      { id: 'compass', name: 'COMPASS', role: 'Router', status: 'active', lastRunMinutes: 2, tasksToday: 22, color: '#4DBFA8' },
      { id: 'chronicle', name: 'CHRONICLE', role: 'Activity Logger', status: 'active', lastRunMinutes: 1, tasksToday: 47, color: '#6BA3E8' },
      { id: 'sentinel', name: 'SENTINEL', role: 'SLA Monitor', status: 'delayed', lastRunMinutes: 28, tasksToday: 8, color: '#E8B84D' },
      { id: 'broker', name: 'BROKER', role: 'Proposal Builder', status: 'active', lastRunMinutes: 19, tasksToday: 3, color: '#A78BFA' },
      { id: 'atlas', name: 'ATLAS', role: 'Portfolio Builder', status: 'idle', lastRunMinutes: null, tasksToday: 0, color: '#72C4B2' },
      { id: 'mirror', name: 'MIRROR', role: 'Content Mirror', status: 'active', lastRunMinutes: 7, tasksToday: 5, color: '#E8916F' },
      { id: 'beacon', name: 'BEACON', role: 'Notify & Alert', status: 'error', lastRunMinutes: 45, tasksToday: 2, color: '#EF4444' },
      { id: 'forge', name: 'FORGE', role: 'Code Generator', status: 'active', lastRunMinutes: 15, tasksToday: 4, color: '#7B6FE8' },
      { id: 'nexus', name: 'NEXUS', role: 'Orchestrator', status: 'active', lastRunMinutes: 1, tasksToday: 87, color: '#59A392' },
    ],
    approvals: [
      { id: '1', agent_name: 'HERALD', action_type: 'email_draft', subject: 'Welcome email → Sarah Chen (Studio/Rescue)', urgency: 'high', confidence: 91, created_at: new Date(Date.now() - 2 * 60000).toISOString() },
      { id: '2', agent_name: 'SCRIBE', action_type: 'blog_draft', subject: 'Blog post: "Why AI prototypes break in production"', urgency: 'medium', confidence: 84, created_at: new Date(Date.now() - 18 * 60000).toISOString() },
      { id: '3', agent_name: 'BROKER', action_type: 'proposal_draft', subject: 'Proposal → Marcus Webb (SaaS MVP)', urgency: 'high', confidence: 88, created_at: new Date(Date.now() - 35 * 60000).toISOString() },
      { id: '4', agent_name: 'HERALD', action_type: 'email_draft', subject: 'Follow-up #3 → TechFlow Inc (dormant 14d)', urgency: 'low', confidence: 76, created_at: new Date(Date.now() - 55 * 60000).toISOString() },
      { id: '5', agent_name: 'COMPASS', action_type: 'routing_decision', subject: 'Route Priya Sharma → Services/Monitoring', urgency: 'medium', confidence: 93, created_at: new Date(Date.now() - 70 * 60000).toISOString() },
    ],
    attention: [
      { id: '1', type: 'ticket', priority: 'red', description: 'P1 ticket #41 — Production build failing for client (3hrs unacknowledged)', time: '3h ago', href: '/admin/tickets' },
      { id: '2', type: 'sla', priority: 'red', description: 'SLA deadline in 1h 40min — ticket #45 (Feature Request / Academy)', time: '1h 40m left', href: '/admin/tickets' },
      { id: '3', type: 'submission', priority: 'amber', description: 'Submission from David Kim (Ventures/Apply) pending 26hrs', time: '26h ago', href: '/admin/submissions' },
      { id: '4', type: 'followup', priority: 'amber', description: 'Follow-up overdue: TechFlow Inc — last contacted 14 days ago', time: '14d ago', href: '/admin/contacts' },
      { id: '5', type: 'ventures', priority: 'amber', description: 'Ventures application from NanoFi — response deadline in 2 days', time: '2d left', href: '/admin/submissions' },
    ],
    activity: [
      { id: '1', actor: 'INTAKE', actor_type: 'agent', action: 'Classified lead Sarah Chen as Studio/Rescue (score: 78)', entity_type: 'submission', entity_name: 'Sarah Chen', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
      { id: '2', actor: 'Arifur Rahman', actor_type: 'human', action: 'Approved welcome email for Sarah Chen', entity_type: 'approval', entity_name: 'welcome_email', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
      { id: '3', actor: 'WARDEN', actor_type: 'agent', action: 'Triaged ticket #45 as P2/Bug, assigned to Kamrul', entity_type: 'ticket', entity_name: '#45', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
      { id: '4', actor: 'HERALD', actor_type: 'agent', action: 'Drafted follow-up email for TechFlow Inc (pending approval)', entity_type: 'email', entity_name: 'TechFlow', created_at: new Date(Date.now() - 22 * 60000).toISOString() },
      { id: '5', actor: 'Kamrul Hasan', actor_type: 'human', action: 'Updated ticket #41 status to In Progress', entity_type: 'ticket', entity_name: '#41', created_at: new Date(Date.now() - 35 * 60000).toISOString() },
      { id: '6', actor: 'COMPASS', actor_type: 'agent', action: 'Routed Priya Sharma to Services/Monitoring', entity_type: 'contact', entity_name: 'Priya Sharma', created_at: new Date(Date.now() - 45 * 60000).toISOString() },
      { id: '7', actor: 'BROKER', actor_type: 'agent', action: 'Generated proposal for Marcus Webb (SaaS MVP) — awaiting approval', entity_type: 'proposal', entity_name: 'Marcus Webb', created_at: new Date(Date.now() - 58 * 60000).toISOString() },
      { id: '8', actor: 'SENTINEL', actor_type: 'agent', action: 'SLA warning triggered for ticket #45 (2h remaining)', entity_type: 'ticket', entity_name: '#45', created_at: new Date(Date.now() - 75 * 60000).toISOString() },
      { id: '9', actor: 'INTAKE', actor_type: 'agent', action: 'New lead classified: Marcus Webb → Studio/MVP (score: 82)', entity_type: 'submission', entity_name: 'Marcus Webb', created_at: new Date(Date.now() - 90 * 60000).toISOString() },
      { id: '10', actor: 'Arifur Rahman', actor_type: 'human', action: 'Created new ticket #48 from Slack message', entity_type: 'ticket', entity_name: '#48', created_at: new Date(Date.now() - 110 * 60000).toISOString() },
    ],
    pipeline: [
      { division: 'Studio', color: '#72C4B2', total: 15, stages: [
        { label: 'New', count: 5, color: '#1e3a35' },
        { label: 'Proposal', count: 3, color: '#2a5048' },
        { label: 'Review', count: 2, color: '#367060' },
        { label: 'Building', count: 4, color: '#459078' },
        { label: 'Launched', count: 1, color: '#72C4B2' },
      ]},
      { division: 'Services', color: '#4DBFA8', total: 31, stages: [
        { label: 'Trial', count: 8, color: '#1a3d35' },
        { label: 'Onboarding', count: 7, color: '#24574c' },
        { label: 'Active', count: 12, color: '#2e7062' },
        { label: 'Renewal', count: 4, color: '#4DBFA8' },
      ]},
      { division: 'Academy', color: '#E8B84D', total: 18, stages: [
        { label: 'Enrolled', count: 10, color: '#3d2e0f' },
        { label: 'Active', count: 6, color: '#7a5c1e' },
        { label: 'Certified', count: 2, color: '#E8B84D' },
      ]},
      { division: 'Ventures', color: '#6BA3E8', total: 12, stages: [
        { label: 'Applied', count: 5, color: '#1a2d4a' },
        { label: 'Screening', count: 3, color: '#253f68' },
        { label: 'Due Diligence', count: 2, color: '#305086' },
        { label: 'Portfolio', count: 2, color: '#6BA3E8' },
      ]},
      { division: 'Cloud', color: '#5BB5E0', total: 9, stages: [
        { label: 'Onboarding', count: 3, color: '#1a3040' },
        { label: 'Active', count: 5, color: '#5BB5E0' },
        { label: 'Scaling', count: 1, color: '#8ccfee' },
      ]},
      { division: 'Labs', color: '#A78BFA', total: 5, stages: [
        { label: 'Research', count: 3, color: '#2d2460' },
        { label: 'Building', count: 2, color: '#A78BFA' },
      ]},
      { division: 'Products', color: '#E8916F', total: 7, stages: [
        { label: 'Beta', count: 4, color: '#4a2418' },
        { label: 'Live', count: 3, color: '#E8916F' },
      ]},
    ],
  }
}

export function useDashboardData() {
  const [usingMock, setUsingMock] = useState(false)
  const [data, setData] = useState<DashboardData>({
    ...getMockData(),
    loading: true,
    error: null,
    usingMock: false,
  })

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient()

      // Try fetching real data; fall through to mock on any error
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const prevPeriodStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

      const [
        { count: newLeads },
        { count: newLeadsPrev },
        { count: pendingReview },
        { count: activeProjects },
        { count: activeProjectsPrev },
        { count: activeAgents },
        { count: openTickets },
        { count: openTicketsPrev },
        { count: servicesClients },
        { count: venturesApps },
        { data: approvals },
        { data: activity },
      ] = await Promise.all([
        supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'new').gte('created_at', sevenDaysAgo),
        supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'new').gte('created_at', prevPeriodStart).lt('created_at', sevenDaysAgo),
        supabase.from('approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('pipeline_entries').select('*', { count: 'exact', head: true }).eq('pipeline', 'studio').in('stage', ['in_progress', 'review']),
        supabase.from('pipeline_entries').select('*', { count: 'exact', head: true }).eq('pipeline', 'studio').in('stage', ['in_progress', 'review']).lt('created_at', sevenDaysAgo),
        supabase.from('agent_deployments').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).not('status', 'in', '("resolved","closed")'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).not('status', 'in', '("resolved","closed")').lt('created_at', sevenDaysAgo),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('lifecycle_stage', 'client').contains('tags', ['services']),
        supabase.from('ventures_applications').select('*', { count: 'exact', head: true }).eq('decision', 'pending'),
        supabase.from('approval_queue').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(15),
      ])

      // Fetch pipeline, agents, and attention items in parallel
      const [pipelineSnapshot, agentLastRuns, attentionItems] = await Promise.all([
        fetchPipelineSnapshot().catch(() => ({} as Record<string, Record<string, number>>)),
        fetchAgentLastRuns().catch(() => ({} as Record<string, { lastRun: string; tasks: number; hasError: boolean }>)),
        fetchAttentionItems().catch(() => [] as Awaited<ReturnType<typeof fetchAttentionItems>>),
      ])

      const mock = getMockData()

      // Build pipeline bars from real data (fall back to mock if empty)
      const DIVISION_ACCENT: Record<string, string> = {
        studio: '#72C4B2', services: '#4DBFA8', labs: '#A78BFA',
        products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8', cloud: '#5BB5E0',
      }
      const pipelineBars: PipelineBar[] = Object.entries(pipelineSnapshot).map(([div, stages]) => {
        const color = DIVISION_ACCENT[div] ?? '#59A392'
        const stageEntries = Object.entries(stages).map(([label, count]) => ({ label, count, color }))
        return { division: div.charAt(0).toUpperCase() + div.slice(1), color, stages: stageEntries, total: stageEntries.reduce((s, e) => s + e.count, 0) }
      })

      // Build agent statuses from real agent_runs data
      const agentStatuses: AgentStatus[] = mock.agents.map(a => {
        const run = agentLastRuns[a.id.toUpperCase()] ?? agentLastRuns[a.name]
        if (!run) return a
        const minutesSince = Math.floor((Date.now() - new Date(run.lastRun).getTime()) / 60000)
        return {
          ...a,
          lastRunMinutes: minutesSince,
          tasksToday: run.tasks,
          status: run.hasError ? 'error' : minutesSince > 30 ? 'delayed' : 'active',
        }
      })

      setUsingMock(false)
      setData(prev => ({
        ...prev,
        kpi: {
          newLeads: newLeads ?? 0,
          newLeadsDelta: newLeads != null && newLeadsPrev != null ? newLeads - newLeadsPrev : 0,
          pendingReview: pendingReview ?? 0,
          activeProjects: activeProjects ?? 0,
          activeProjectsDelta: activeProjects != null && activeProjectsPrev != null ? activeProjects - activeProjectsPrev : 0,
          activeAgents: activeAgents ?? agentStatuses.filter(a => a.status === 'active').length,
          openTickets: openTickets ?? 0,
          openTicketsDelta: openTickets != null && openTicketsPrev != null ? openTickets - openTicketsPrev : 0,
          servicesClients: servicesClients ?? 0,
          venturesApps: venturesApps ?? 0,
        },
        approvals: (approvals ?? []) as ApprovalItem[],
        activity: (activity ?? []) as ActivityItem[],
        pipeline: pipelineBars.length ? pipelineBars : mock.pipeline,
        agents: agentStatuses,
        attention: attentionItems.length ? attentionItems : [],
        loading: false,
        error: null,
        usingMock: false,
      }))
    } catch {
      setUsingMock(true)
      setData(prev => ({ ...prev, loading: false, usingMock: true }))
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const addActivity = useCallback((item: ActivityItem) => {
    setData(prev => ({ ...prev, activity: [item, ...prev.activity.slice(0, 14)] }))
  }, [])

  const updateKPI = useCallback((updates: Partial<KPIData>) => {
    setData(prev => ({ ...prev, kpi: { ...prev.kpi, ...updates } }))
  }, [])

  return { data: { ...data, usingMock }, addActivity, updateKPI, refetch: fetchData }
}
