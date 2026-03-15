import { useEffect, useRef } from 'react'

export default function PERTTab({ data }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!data || !containerRef.current) return

    const nodes = data.nodes || []
    const edges = data.edges || []
    const criticalSet = new Set(data.critical_path || [])

    // Build mermaid LR flowchart
    const lines = ['flowchart LR']

    nodes.forEach((n) => {
      const label = `"${n.name}\\nET: ${(+n.expected_time).toFixed(1)}d"`
      if (n.is_critical || criticalSet.has(n.id)) {
        lines.push(`  ${safeId(n.id)}[${label}]:::critical`)
      } else {
        lines.push(`  ${safeId(n.id)}[${label}]`)
      }
    })

    edges.forEach((e) => {
      const fromCrit = criticalSet.has(e.from)
      const toCrit   = criticalSet.has(e.to)
      const arrow    = (fromCrit && toCrit) ? '-->' : '-->'
      lines.push(`  ${safeId(e.from)} ${arrow} ${safeId(e.to)}`)
    })

    lines.push('  classDef critical fill:#a32020,color:#fff,stroke:#a32020')

    const diagramDef = lines.join('\n')

    async function render() {
      const mermaid = (await import('mermaid')).default
      mermaid.initialize({ startOnLoad: false, theme: 'base',
        themeVariables: { primaryColor: '#fff7eb', primaryBorderColor: '#f0dcc3',
          primaryTextColor: '#1a1e23', edgeLabelBackground: '#fffdf7' } })

      try {
        const { svg } = await mermaid.render('pert-diagram', diagramDef)
        containerRef.current.innerHTML = svg
      } catch (e) {
        containerRef.current.innerHTML = `<pre style="color:var(--rm-high);font-size:0.8rem">${e.message}</pre>`
      }
    }

    render()
  }, [data])

  if (!data) return <Skeleton />

  const totalVariance = (data.nodes || [])
    .filter(n => (data.critical_path || []).includes(n.id))
    .reduce((sum, n) => sum + (n.variance || 0), 0)

  return (
    <div id="tab-pert" className="rm-fade-in">
      {/* Network diagram */}
      <div style={{
        border: '1px solid var(--rm-border)', borderRadius: 16,
        background: 'rgba(255,253,247,0.95)', padding: 24, marginBottom: 20,
      }}>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 16px' }}>
          PERT Network Diagram
        </h2>
        <div ref={containerRef} style={{ overflowX: 'auto' }} />
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <MetricCard label="Critical Path Duration" value={`${data.critical_path_duration} days`} />
        <MetricCard label="Critical Path Steps"    value={`${(data.critical_path || []).length} nodes`} />
        <MetricCard label="Path Variance"          value={totalVariance.toFixed(2)} />
        <MetricCard label="Std Deviation"          value={Math.sqrt(totalVariance).toFixed(2) + ' days'} />
      </div>

      {/* Critical path list */}
      {data.critical_path && data.critical_path.length > 0 && (
        <div style={{
          marginTop: 20, border: '1px solid var(--rm-border)', borderRadius: 16,
          background: 'rgba(255,253,247,0.95)', padding: 20,
        }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 12px' }}>
            Critical Path Sequence
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            {data.critical_path.map((nodeId, i) => {
              const node = (data.nodes || []).find(n => n.id === nodeId)
              return (
                <span key={nodeId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: '#a32020', color: '#fff', padding: '4px 12px',
                    borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
                  }}>
                    {node?.name || nodeId}
                    {node && <span style={{ opacity: 0.75, marginLeft: 6 }}>({node.expected_time?.toFixed(1)}d)</span>}
                  </span>
                  {i < data.critical_path.length - 1 && (
                    <span style={{ color: 'var(--rm-muted)' }}>→</span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div style={{
      border: '1px solid var(--rm-border)', borderRadius: 14,
      background: 'linear-gradient(180deg, #fffef9, #fff7ea)',
      padding: '16px 18px',
    }}>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em',
        color: 'var(--rm-muted)', fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.3rem' }}>{value}</div>
    </div>
  )
}

function Skeleton() {
  return <div style={{ padding: 32, color: 'var(--rm-muted)' }}>Loading PERT analysis…</div>
}

function safeId(id) {
  return String(id).replace(/[^a-zA-Z0-9_]/g, '_')
}
