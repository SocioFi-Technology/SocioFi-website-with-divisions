'use client';
import { useState } from 'react';

const NODES = [
  { id: 'arch',   label: 'Agent\nArchitecture', status: 'Active',     statusColor: '#7B6FE8', desc: 'Multi-agent coordination, tool use, memory systems',         x: '50%', y: '8%'  },
  { id: 'ai',     label: 'Applied\nAI',          status: 'Publishing', statusColor: '#E8B84D', desc: 'Document intelligence, semantic search, structured output', x: '88%', y: '44%' },
  { id: 'tools',  label: 'Developer\nTooling',   status: 'Active',     statusColor: '#7B6FE8', desc: 'Code review automation, test generation, scaffolding',      x: '50%', y: '80%' },
  { id: 'auto',   label: 'Industry\nAutomation', status: 'Planned',    statusColor: '#7C8DB0', desc: 'Fintech compliance, legal processing, supply chain',        x: '12%', y: '44%' },
];

const CONNECTIONS = [
  ['arch', 'ai'], ['arch', 'auto'], ['ai', 'tools'], ['auto', 'tools'],
];

export default function LabsResearchVisual() {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  return (
    <div
      style={{
        position: 'relative', width: '100%', aspectRatio: '4/3',
        background: 'rgba(10,10,24,0.97)',
        border: '1px solid rgba(123,111,232,0.18)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
      role="img"
      aria-label="Research stream node graph showing four active areas"
    >
      {/* SVG connection lines */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {CONNECTIONS.map(([a, b]) => {
          const na = nodeMap[a];
          const nb = nodeMap[b];
          const x1 = parseFloat(na.x);
          const y1 = parseFloat(na.y) + 8;
          const x2 = parseFloat(nb.x);
          const y2 = parseFloat(nb.y) + 8;
          const isHov = hovered === a || hovered === b;
          return (
            <line
              key={`${a}-${b}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isHov ? 'rgba(123,111,232,0.45)' : 'rgba(123,111,232,0.15)'}
              strokeWidth={isHov ? 0.6 : 0.35}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map(node => (
        <div
          key={node.id}
          style={{
            position: 'absolute',
            left: node.x, top: node.y,
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            zIndex: 2,
          }}
          onMouseEnter={() => setHovered(node.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Node circle */}
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: hovered === node.id
              ? `rgba(123,111,232,0.25)`
              : 'rgba(123,111,232,0.1)',
            border: `${hovered === node.id ? 2 : 1.5}px solid ${hovered === node.id ? 'rgba(123,111,232,0.8)' : 'rgba(123,111,232,0.35)'}`,
            boxShadow: hovered === node.id ? '0 0 20px rgba(123,111,232,0.25)' : 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, cursor: 'default',
            transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <span style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 600,
              fontSize: '0.62rem', color: 'rgba(255,255,255,0.8)',
              textAlign: 'center', lineHeight: 1.3, padding: '0 6px',
              whiteSpace: 'pre-line',
            }}>
              {node.label}
            </span>
          </div>
          {/* Status badge */}
          <span style={{
            fontFamily: '"Fira Code", monospace', fontSize: '0.55rem',
            color: node.statusColor,
            background: `${node.statusColor}18`,
            border: `1px solid ${node.statusColor}40`,
            borderRadius: 10, padding: '1px 7px',
          }}>
            {node.status}
          </span>
        </div>
      ))}

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          background: 'rgba(17,17,40,0.95)',
          border: '1px solid rgba(123,111,232,0.25)',
          borderRadius: 10, padding: '10px 14px',
          zIndex: 10,
        }}>
          <div style={{ fontFamily: '"Syne", sans-serif', fontWeight: 600, fontSize: '0.78rem', color: '#fff', marginBottom: 4 }}>
            {NODES.find(n => n.id === hovered)?.label.replace('\n', ' ')}
          </div>
          <div style={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
            {NODES.find(n => n.id === hovered)?.desc}
          </div>
        </div>
      )}

      {/* Footer counter */}
      <div style={{
        position: 'absolute', top: 12, left: 16,
        fontFamily: '"Fira Code", monospace', fontSize: '0.62rem',
        color: 'rgba(123,111,232,0.5)', letterSpacing: '0.08em',
      }}>
        3 active experiments
      </div>
    </div>
  );
}
