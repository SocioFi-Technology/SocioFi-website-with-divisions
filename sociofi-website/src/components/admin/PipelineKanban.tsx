'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PRIORITY_COLORS, type PipelineEntry } from '@/lib/admin/types'

// ── Helpers ───────────────────────────────────────────────────
function daysInStage(enteredAt: string): number {
  return Math.floor((Date.now() - new Date(enteredAt).getTime()) / 86400000)
}

function TimeInStage({ days, threshold }: { days: number; threshold: number }) {
  const color = days > threshold * 2 ? '#EF4444' : days > threshold ? '#E8B84D' : '#64748B'
  const label = days === 0 ? 'today' : days === 1 ? '1 day' : `${days} days`
  return <span style={{ color, fontSize: '0.65rem', fontFamily: "'Fira Code', monospace" }}>{label}</span>
}

// ── Pipeline Card ─────────────────────────────────────────────
function PipelineCard({
  entry, divisionColor, threshold, isDragging,
}: {
  entry: PipelineEntry
  divisionColor: string
  threshold: number
  isDragging?: boolean
}) {
  const days = daysInStage(entry.entered_at)
  const isOverdue = threshold > 0 && days > threshold
  const isUrgent = entry.priority === 'urgent'

  const borderColor = isUrgent ? '#EF4444' : isOverdue ? '#E8B84D' : divisionColor

  return (
    <div style={{
      background: '#12162A',
      border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.35)' : isOverdue ? 'rgba(232,184,77,0.35)' : 'rgba(255,255,255,0.06)'}`,
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: '10px',
      padding: '12px',
      cursor: 'grab',
      opacity: isDragging ? 0.5 : 1,
      transition: 'all 0.15s',
      userSelect: 'none',
      boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
    }}>
      {/* Name + company */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>
          {entry.contact_name}
        </div>
        {entry.company && (
          <div style={{ color: '#64748B', fontSize: '0.72rem', marginTop: '2px' }}>{entry.company}</div>
        )}
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <span style={{
          background: `${divisionColor}15`, color: divisionColor,
          fontSize: '0.62rem', padding: '1px 7px', borderRadius: '100px',
          border: `1px solid ${divisionColor}30`,
        }}>{entry.submission_type}</span>
        {(entry.priority === 'urgent' || entry.priority === 'high') && (
          <span style={{
            background: `${PRIORITY_COLORS[entry.priority]}15`,
            color: PRIORITY_COLORS[entry.priority],
            border: `1px solid ${PRIORITY_COLORS[entry.priority]}35`,
            fontSize: '0.62rem', padding: '1px 7px', borderRadius: '100px',
            fontFamily: "'Fira Code', monospace", textTransform: 'uppercase',
          }}>{entry.priority === 'urgent' ? 'URG' : 'HIGH'}</span>
        )}
        {entry.ai_score !== undefined && (
          <span style={{
            background: entry.ai_score >= 70 ? 'rgba(74,222,128,0.12)' : 'rgba(232,184,77,0.12)',
            color: entry.ai_score >= 70 ? '#4ade80' : '#E8B84D',
            fontSize: '0.62rem', padding: '1px 7px', borderRadius: '100px',
            fontFamily: "'Fira Code', monospace", fontWeight: 700,
          }}>{entry.ai_score}</span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Assigned */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {entry.assigned_to ? (
            <>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#3A589E,#59A392)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.5rem', color: 'white', fontWeight: 700,
              }}>
                {entry.assigned_to.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <span style={{ color: '#64748B', fontSize: '0.65rem' }}>{entry.assigned_to.split(' ')[0]}</span>
            </>
          ) : (
            <span style={{ color: '#EF4444', fontSize: '0.65rem' }}>Unassigned</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {entry.notes_count > 0 && (
            <span style={{ color: '#475569', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace" }}>
              {entry.notes_count} note{entry.notes_count !== 1 ? 's' : ''}
            </span>
          )}
          <TimeInStage days={daysInStage(entry.entered_at)} threshold={threshold} />
        </div>
      </div>
    </div>
  )
}

// ── Sortable Card wrapper ─────────────────────────────────────
function SortablePipelineCard({
  entry, divisionColor, threshold,
}: {
  entry: PipelineEntry
  divisionColor: string
  threshold: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
    data: { type: 'card', entry },
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PipelineCard entry={entry} divisionColor={divisionColor} threshold={threshold} isDragging={isDragging} />
    </div>
  )
}

// ── Column ────────────────────────────────────────────────────
function KanbanColumn({
  stage, entries, divisionColor, thresholds,
}: {
  stage: string
  entries: PipelineEntry[]
  divisionColor: string
  thresholds: Record<string, number>
  activeId: string | null
}) {
  const threshold = thresholds[stage] ?? 3
  const overdueCount = entries.filter(e => daysInStage(e.entered_at) > threshold).length

  return (
    <div style={{
      width: '240px',
      minWidth: '240px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      flexShrink: 0,
    }}>
      {/* Column header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 0 10px',
        borderBottom: `2px solid ${divisionColor}40`,
        marginBottom: '10px',
      }}>
        <span style={{ color: '#E2E8F0', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>{stage}</span>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {overdueCount > 0 && (
            <span style={{ background: 'rgba(232,184,77,0.15)', color: '#E8B84D', border: '1px solid rgba(232,184,77,0.3)', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '100px', fontFamily: "'Fira Code', monospace" }}>
              {overdueCount} late
            </span>
          )}
          <span style={{ background: `${divisionColor}20`, color: divisionColor, fontSize: '0.65rem', fontWeight: 700, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fira Code', monospace" }}>
            {entries.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
        <div
          data-stage={stage}
          style={{
            flex: 1,
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: entries.length === 0 ? '10px' : '2px 0',
            background: entries.length === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
            border: entries.length === 0 ? '1px dashed rgba(255,255,255,0.06)' : 'none',
            borderRadius: entries.length === 0 ? '8px' : '0',
          }}
        >
          {entries.map(entry => (
            <SortablePipelineCard
              key={entry.id}
              entry={entry}
              divisionColor={divisionColor}
              threshold={threshold}
            />
          ))}
          {entries.length === 0 && (
            <div style={{ color: '#2a3050', fontSize: '0.72rem', textAlign: 'center', padding: '20px 0' }}>Drop here</div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

// ── Main Kanban ───────────────────────────────────────────────
export interface PipelineKanbanProps {
  pipeline: string
  stages: string[]
  divisionColor: string
  thresholds?: Record<string, number>
  initialEntries?: PipelineEntry[]
}

export default function PipelineKanban({
  pipeline, stages, divisionColor, thresholds = {}, initialEntries = [],
}: PipelineKanbanProps) {
  const [entries, setEntries] = useState<PipelineEntry[]>(initialEntries)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const byStage = useCallback((stage: string) => entries.filter(e => e.stage === stage), [entries])
  const activeEntry = activeId ? entries.find(e => e.id === activeId) : null

  // pipeline is used for Supabase persistence (future)
  void pipeline

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeEntry = entries.find(e => e.id === active.id)
    if (!activeEntry) return

    // Determine target stage: over could be a card id or a stage container
    let targetStage: string | null = null

    // Check if dropped over a card in another stage
    const overEntry = entries.find(e => e.id === over.id)
    if (overEntry) {
      targetStage = overEntry.stage
    } else {
      // Dropped over the column container
      targetStage = String(over.id)
    }

    if (!targetStage || targetStage === activeEntry.stage) return

    // Optimistic update
    setEntries(prev => prev.map(e =>
      e.id === activeEntry.id
        ? { ...e, stage: targetStage!, entered_at: new Date().toISOString() }
        : e
    ))

    // TODO: persist to Supabase
    // await supabase.from('pipeline_entries').update({ stage: targetStage, entered_at: new Date().toISOString() }).eq('id', activeEntry.id)
    // await supabase.from('activity_log').insert({ actor: 'User', actor_type: 'human', action: `Moved ${activeEntry.contact_name} from ${activeEntry.stage} to ${targetStage}` })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{
        display: 'flex',
        gap: '20px',
        overflowX: 'auto',
        paddingBottom: '16px',
        paddingTop: '4px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${divisionColor}30 transparent`,
      }}>
        {stages.map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            entries={byStage(stage)}
            divisionColor={divisionColor}
            thresholds={thresholds}
            activeId={activeId}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeEntry && (
          <div style={{ transform: 'rotate(2deg)', filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.5))' }}>
            <PipelineCard
              entry={activeEntry}
              divisionColor={divisionColor}
              threshold={thresholds[activeEntry.stage] ?? 3}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
