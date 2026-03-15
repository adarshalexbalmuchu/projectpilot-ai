const STEPS = [
  { id: 'sow',   label: 'Scope of Work' },
  { id: 'wbs',   label: 'Work Breakdown' },
  { id: 'risk',  label: 'Risk Analysis' },
  { id: 'gantt', label: 'Gantt Chart' },
  { id: 'pert',  label: 'PERT Analysis' },
]

// status: 'idle' | 'running' | 'done' | 'error'
export default function AnalysisStepper({ statuses }) {
  return (
    <div style={{
      border: '1px solid var(--rm-border)',
      borderRadius: 16,
      background: 'linear-gradient(130deg, rgba(255,255,255,0.9), rgba(255,244,226,0.95))',
      padding: '20px 24px',
      marginBottom: 24,
    }}>
      <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, margin: '0 0 16px', fontSize: '0.9rem' }}>
        Analyzing project…
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {STEPS.map((step, i) => {
          const status = statuses[step.id] || 'idle'
          return <StepRow key={step.id} index={i} label={step.label} status={status} />
        })}
      </div>
    </div>
  )
}

function StepRow({ index, label, status }) {
  const icon = status === 'done'    ? '✓'
             : status === 'error'   ? '✕'
             : status === 'running' ? null
             : String(index + 1)

  const iconBg = status === 'done'    ? 'var(--rm-ok)'
               : status === 'error'   ? 'var(--rm-critical)'
               : status === 'running' ? 'var(--rm-brand-2)'
               : 'var(--rm-border)'

  const iconColor = status === 'idle' ? 'var(--rm-muted)' : '#fff'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 28, height: 28,
        borderRadius: '50%',
        background: iconBg,
        color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
        position: 'relative',
      }}>
        {status === 'running' ? (
          <div className="rm-spin" style={{
            width: 14, height: 14,
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: '#fff',
            borderRadius: '50%',
          }} />
        ) : icon}
      </div>
      <span style={{
        fontSize: '0.85rem',
        fontWeight: status === 'running' ? 600 : 400,
        color: status === 'idle' ? 'var(--rm-muted)' : 'var(--rm-text)',
      }}>
        {label}
        {status === 'running' && <span style={{ color: 'var(--rm-brand-2)', marginLeft: 6 }}>running…</span>}
        {status === 'error'   && <span style={{ color: 'var(--rm-critical)', marginLeft: 6 }}>failed</span>}
      </span>
    </div>
  )
}
