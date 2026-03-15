function Section({ title, items, paragraph }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.88rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--rm-brand-2)',
        margin: '0 0 8px' }}>
        {title}
      </h3>
      {paragraph && (
        <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--rm-text)', fontSize: '0.9rem' }}>
          {paragraph}
        </p>
      )}
      {items && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: 4, color: 'var(--rm-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ScopeOfWorkTab({ data }) {
  if (!data) return <Skeleton />

  return (
    <div id="tab-sow" className="rm-fade-in" style={{
      border: '1px solid var(--rm-border)', borderRadius: 16,
      background: 'linear-gradient(120deg, rgba(255,255,255,0.95), rgba(255,247,234,0.92))',
      padding: '28px 32px',
    }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 4px' }}>
        {data.project_name}
      </h2>
      <p style={{ margin: '0 0 24px', color: 'var(--rm-muted)', fontSize: '0.82rem' }}>Scope of Work</p>

      <Section title="Overview" paragraph={data.overview} />
      <hr style={{ border: 'none', borderTop: '1px solid var(--rm-border)', margin: '16px 0' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        <Section title="Objectives"   items={data.objectives} />
        <Section title="Deliverables" items={data.deliverables} />
        <Section title="Exclusions"   items={data.exclusions} />
        <Section title="Assumptions"  items={data.assumptions} />
        <Section title="Constraints"  items={data.constraints} />
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ padding: 32 }}>
      {[200, 140, 160, 120].map((w, i) => (
        <div key={i} style={{
          height: 16, width: w, borderRadius: 8, marginBottom: 14,
          background: 'linear-gradient(90deg, var(--rm-border) 0%, rgba(255,255,255,0.6) 50%, var(--rm-border) 100%)',
          backgroundSize: '400px 100%',
        }} />
      ))}
    </div>
  )
}
