'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MOCK_CONTACTS, MOCK_CONTACT_ACTIVITY, MOCK_SUBMISSIONS } from '@/lib/admin/mock-data'
import { DIVISION_COLORS, STAGE_COLORS, type Contact, type LifecycleStage } from '@/lib/admin/types'

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const LIFECYCLE_STAGES: LifecycleStage[] = ['lead', 'qualified', 'opportunity', 'client', 'churned']
const TEAM_MEMBERS = ['Arifur Rahman', 'Kamrul Hasan']

type Tab = 'history' | 'submissions' | 'emails' | 'tickets' | 'enrollments'

const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  submission: '#72C4B2',
  pipeline: '#6BA3E8',
  email: '#5BB5E0',
  note: '#94A3B8',
  ticket: '#E8916F',
  enrollment: '#E8B84D',
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  submission: 'FORM',
  pipeline: 'PIPELINE',
  email: 'EMAIL',
  note: 'NOTE',
  ticket: 'TICKET',
  enrollment: 'ENROLL',
}

// ── InlineEdit defined outside to avoid nested-component hook warnings ──
interface InlineEditProps {
  field: keyof Contact
  value: string
  editingField: string | null
  setEditingField: (f: string | null) => void
  onSave: (field: keyof Contact, value: string) => void
}

function InlineEdit({ field, value, editingField, setEditingField, onSave }: InlineEditProps) {
  const [v, setV] = useState(value)

  if (editingField === (field as string)) {
    return (
      <div style={{ display: 'flex', gap: '6px' }}>
        <input value={v} onChange={e => setV(e.target.value)} autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter') onSave(field, v)
            if (e.key === 'Escape') setEditingField(null)
          }}
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(89,163,146,0.4)', borderRadius: '6px', color: '#E2E8F0', fontSize: '0.85rem', padding: '5px 10px', outline: 'none', fontFamily: "'Outfit', sans-serif" }} />
        <button onClick={() => onSave(field, v)} style={{ background: 'rgba(89,163,146,0.2)', border: 'none', borderRadius: '5px', color: '#59A392', cursor: 'pointer', padding: '0 10px', fontSize: '0.8rem' }}>Save</button>
        <button onClick={() => setEditingField(null)} style={{ background: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '5px', color: '#64748B', cursor: 'pointer', padding: '0 8px', fontSize: '0.8rem' }}>Cancel</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ color: value ? '#E2E8F0' : '#475569', fontSize: '0.85rem' }}>
        {value || 'Not set'}
      </span>
      <button
        onClick={() => { setV(value); setEditingField(field as string) }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', opacity: 0.6, padding: '0' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>
  )
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [contact, setContact] = useState<Contact | null>(MOCK_CONTACTS.find(c => c.id === id) ?? null)
  const [activeTab, setActiveTab] = useState<Tab>('history')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')

  const activity = MOCK_CONTACT_ACTIVITY.filter(a => a.contact_id === id)
  const contactSubmissions = MOCK_SUBMISSIONS.filter(s => s.contact_id === id)

  if (!contact) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
        <div style={{ fontSize: '1rem', marginBottom: '8px' }}>Contact not found</div>
        <button onClick={() => router.push('/admin/contacts')} style={{ color: '#59A392', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
          Back to Contacts
        </button>
      </div>
    )
  }

  const stageColor = STAGE_COLORS[contact.stage]

  const updateField = (field: keyof Contact, value: string) => {
    setContact(prev => prev ? { ...prev, [field]: value } : prev)
    setEditingField(null)
  }

  const updateStage = (value: LifecycleStage) => {
    setContact(prev => prev ? { ...prev, stage: value } : prev)
  }

  const updateAssigned = (value: string) => {
    setContact(prev => prev ? { ...prev, assigned_to: value || undefined } : prev)
  }

  const updateTags = (tags: string[]) => {
    setContact(prev => prev ? { ...prev, tags } : prev)
  }

  return (
    <div>
      {/* Back nav */}
      <button onClick={() => router.push('/admin/contacts')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '20px', padding: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Contacts
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

        {/* Left — History */}
        <div>
          {/* Header */}
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #3A589E, #59A392)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#E2E8F0', fontSize: '1.3rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: '0 0 4px', letterSpacing: '-0.02em' }}>{contact.name}</h2>
                <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '8px' }}>{contact.email}{contact.company ? ` · ${contact.company}` : ''}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: `${stageColor}18`, color: stageColor, border: `1px solid ${stageColor}40`, fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', textTransform: 'capitalize' }}>{contact.stage}</span>
                  {contact.division_interests.map(d => (
                    <span key={d} style={{ background: `${DIVISION_COLORS[d]}15`, color: DIVISION_COLORS[d], border: `1px solid ${DIVISION_COLORS[d]}30`, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', textTransform: 'capitalize' }}>{d}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'Add Note', color: '#59A392' },
                  { label: 'Send Email', color: '#5BB5E0' },
                  { label: 'Create Ticket', color: '#E8916F' },
                ].map(btn => (
                  <button key={btn.label} style={{ background: `${btn.color}15`, color: btn.color, border: `1px solid ${btn.color}35`, borderRadius: '7px', padding: '7px 12px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap' }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#12162A', borderRadius: '10px', padding: '6px', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
            {(['history', 'submissions', 'emails', 'tickets', 'enrollments'] as Tab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ background: activeTab === tab ? 'rgba(89,163,146,0.15)' : 'transparent', color: activeTab === tab ? '#59A392' : '#64748B', border: 'none', borderRadius: '7px', padding: '6px 14px', fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize', fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s', fontWeight: activeTab === tab ? 600 : 400 }}>
                {tab}{tab === 'submissions' ? ` (${contactSubmissions.length})` : tab === 'history' ? ` (${activity.length})` : ''}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'history' && (
            <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>— Complete Interaction Timeline</div>
              {activity.length === 0 ? (
                <div style={{ color: '#475569', fontSize: '0.85rem', padding: '20px 0', textAlign: 'center' }}>No activity recorded yet</div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '19px', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  {activity.map(a => {
                    const typeColor = ACTIVITY_TYPE_COLORS[a.type] ?? '#59A392'
                    return (
                      <div key={a.id} style={{ display: 'flex', gap: '14px', marginBottom: '20px', position: 'relative' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `${typeColor}20`, border: `1px solid ${typeColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                          <span style={{ color: typeColor, fontSize: '0.55rem', fontWeight: 700, fontFamily: "'Fira Code', monospace", letterSpacing: '0.04em' }}>{ACTIVITY_TYPE_LABELS[a.type]}</span>
                        </div>
                        <div style={{ flex: 1, paddingTop: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <div style={{ color: '#E2E8F0', fontSize: '0.82rem' }}>
                              <span style={{ color: a.actor.toUpperCase() === a.actor ? '#59A392' : '#E2E8F0', fontWeight: 600 }}>{a.actor}</span>
                              {' — '}{a.description}
                            </div>
                            <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap', marginLeft: '12px' }}>{relativeTime(a.created_at)}</span>
                          </div>
                          {a.division && (
                            <span style={{ background: `${DIVISION_COLORS[a.division]}15`, color: DIVISION_COLORS[a.division], fontSize: '0.65rem', padding: '1px 7px', borderRadius: '100px', textTransform: 'capitalize' }}>{a.division}</span>
                          )}
                          {a.linked_entity && (
                            <span style={{ color: '#64748B', fontSize: '0.72rem', marginLeft: '8px' }}>{a.linked_entity}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
              {contactSubmissions.length === 0 ? (
                <div style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>No submissions from this contact</div>
              ) : (
                contactSubmissions.map(s => (
                  <Link key={s.id} href="/admin/submissions"
                    style={{ display: 'block', padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 500 }}>{s.type}</span>
                      <span style={{ color: '#64748B', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace" }}>{relativeTime(s.created_at)}</span>
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginBottom: '8px' }}>{s.summary.slice(0, 100)}{s.summary.length > 100 ? '...' : ''}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: `${DIVISION_COLORS[s.division]}15`, color: DIVISION_COLORS[s.division], border: `1px solid ${DIVISION_COLORS[s.division]}30`, fontSize: '0.65rem', padding: '1px 7px', borderRadius: '100px', textTransform: 'capitalize' }}>{s.division}</span>
                      {s.ai_score !== undefined && (
                        <span style={{ color: s.ai_score >= 70 ? '#4ade80' : s.ai_score >= 40 ? '#E8B84D' : '#EF4444', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace" }}>Score: {s.ai_score}</span>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {(activeTab === 'emails' || activeTab === 'tickets' || activeTab === 'enrollments') && (
            <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
              <div style={{ color: '#475569', fontSize: '0.85rem' }}>No {activeTab} data yet</div>
            </div>
          )}
        </div>

        {/* Right — Profile sidebar */}
        <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', position: 'sticky', top: '80px' }}>
          <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>— Profile</div>

          {/* Score */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Lead Score</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${contact.score}%`, height: '100%', background: contact.score >= 70 ? '#4ade80' : contact.score >= 40 ? '#E8B84D' : '#EF4444', borderRadius: '2px' }} />
              </div>
              <span style={{ color: contact.score >= 70 ? '#4ade80' : '#E8B84D', fontSize: '0.9rem', fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>{contact.score}</span>
            </div>
          </div>

          {/* Profile fields */}
          {([
            { field: 'name' as keyof Contact, label: 'Full Name' },
            { field: 'email' as keyof Contact, label: 'Email' },
            { field: 'company' as keyof Contact, label: 'Company' },
            { field: 'phone' as keyof Contact, label: 'Phone' },
          ]).map(({ field, label }) => (
            <div key={String(field)} style={{ marginBottom: '12px' }}>
              <div style={{ color: '#475569', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
              <InlineEdit
                field={field}
                value={String(contact[field] ?? '')}
                editingField={editingField}
                setEditingField={setEditingField}
                onSave={updateField}
              />
            </div>
          ))}

          {/* Lifecycle stage */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: '#475569', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Lifecycle Stage</div>
            <select value={contact.stage} onChange={e => updateStage(e.target.value as LifecycleStage)}
              style={{ width: '100%', background: `${stageColor}18`, color: stageColor, border: `1px solid ${stageColor}40`, borderRadius: '7px', padding: '7px 10px', fontSize: '0.82rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif", textTransform: 'capitalize' }}>
              {LIFECYCLE_STAGES.map(s => (
                <option key={s} value={s} style={{ background: '#12162A', color: '#E2E8F0', textTransform: 'capitalize' }}>{s}</option>
              ))}
            </select>
          </div>

          {/* Assigned to */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: '#475569', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Assigned To</div>
            <select value={contact.assigned_to ?? ''} onChange={e => updateAssigned(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', color: contact.assigned_to ? '#E2E8F0' : '#EF4444', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '7px 10px', fontSize: '0.82rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
              <option value="" style={{ background: '#12162A' }}>Unassigned</option>
              {TEAM_MEMBERS.map(m => (
                <option key={m} value={m} style={{ background: '#12162A' }}>{m}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: '#475569', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {contact.tags.map(tag => (
                <span key={tag} style={{ background: 'rgba(89,163,146,0.1)', color: '#59A392', border: '1px solid rgba(89,163,146,0.25)', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {tag}
                  <button
                    onClick={() => updateTags(contact.tags.filter(t => t !== tag))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0', lineHeight: 1, fontSize: '0.9rem' }}>
                    x
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newTag.trim()) {
                    updateTags([...contact.tags, newTag.trim()])
                    setNewTag('')
                  }
                }}
                placeholder="Add tag..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#E2E8F0', fontSize: '0.78rem', padding: '5px 10px', outline: 'none', fontFamily: "'Outfit', sans-serif" }}
              />
              <button
                onClick={() => { if (newTag.trim()) { updateTags([...contact.tags, newTag.trim()]); setNewTag('') } }}
                style={{ background: 'rgba(89,163,146,0.15)', border: '1px solid rgba(89,163,146,0.3)', borderRadius: '6px', color: '#59A392', cursor: 'pointer', padding: '0 10px', fontSize: '0.8rem' }}>
                +
              </button>
            </div>
          </div>

          {/* Source + dates */}
          <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#475569', fontSize: '0.72rem' }}>Source</span>
            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{contact.source}</span>
          </div>
          <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#475569', fontSize: '0.72rem' }}>Created</span>
            <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace" }}>{relativeTime(contact.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
