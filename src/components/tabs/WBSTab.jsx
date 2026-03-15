import { useState } from 'react'

const LEVEL_COLORS = ['#1a1e23', '#0a7c8d', '#ea5b2f', '#228b4e']
const LEVEL_BG     = ['rgba(26,30,35,0.08)', 'rgba(10,124,141,0.08)', 'rgba(234,91,47,0.08)', 'rgba(34,139,78,0.08)']

function WBSNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 1)
  const hasChildren = node.children && node.children.length > 0
  const color  = LEVEL_COLORS[Math.min(depth, LEVEL_COLORS.length - 1)]
  const bgColor = LEVEL_BG[Math.min(depth, LEVEL_BG.length - 1)]

  return (
    <div style={{ marginLeft: depth * 20, marginBottom: 4 }}>
      <div
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 10,
          background: bgColor,
          border: `1px solid ${color}22`,
          cursor: hasChildren ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        {hasChildren && (
          <span style={{ width: 16, textAlign: 'center', color, fontWeight: 700, fontSize: '0.8rem' }}>
            {expanded ? '▾' : '▸'}
          </span>
        )}
        {!hasChildren && <span style={{ width: 16 }} />}

        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: depth === 0 ? 700 : 500,
          fontSize: depth === 0 ? '0.9rem' : '0.85rem', color }}>
          <span style={{ opacity: 0.55, marginRight: 6 }}>{node.id}</span>
          {node.name}
        </span>
        {node.duration_days != null && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--rm-muted)',
            background: 'rgba(255,255,255,0.7)', borderRadius: 999,
            padding: '1px 8px', border: '1px solid var(--rm-border)',
          }}>
            {node.duration_days}d
          </span>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <WBSNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function WBSTab({ data }) {
  if (!data) return <Skeleton />

  return (
    <div id="tab-wbs" className="rm-fade-in" style={{
      border: '1px solid var(--rm-border)', borderRadius: 16,
      background: 'rgba(255,253,247,0.95)', padding: '28px 32px',
    }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.3rem', margin: '0 0 4px' }}>
        Work Breakdown Structure
      </h2>
      <p style={{ margin: '0 0 20px', color: 'var(--rm-muted)', fontSize: '0.82rem' }}>{data.project_name}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(data.wbs || []).map((node) => (
          <WBSNode key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ padding: 32 }}>
      {[80, 160, 140, 120, 180, 100].map((w, i) => (
        <div key={i} style={{
          height: 14, width: `${w}px`, borderRadius: 8, marginBottom: 12,
          marginLeft: i % 2 === 0 ? 0 : 20,
          background: 'var(--rm-border)',
        }} />
      ))}
    </div>
  )
}
