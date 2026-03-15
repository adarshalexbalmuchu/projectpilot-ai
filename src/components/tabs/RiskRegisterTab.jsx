import { useState } from 'react'
import RiskMatrix from '../RiskMatrix.jsx'

const SCORE_COLOR = (s) => s >= 7 ? '#a32020' : s >= 4 ? '#dc8b00' : '#228b4e'
const SCORE_BG    = (s) => s >= 7 ? 'rgba(163,32,32,0.12)' : s >= 4 ? 'rgba(220,139,0,0.12)' : 'rgba(34,139,78,0.12)'

const SORT_KEYS = ['risk_score', 'category', 'probability', 'impact']

export default function RiskRegisterTab({ data }) {
  const [sortKey, setSortKey] = useState('risk_score')
  const [sortDir, setSortDir] = useState('desc')

  if (!data) return <Skeleton />

  const risks = [...(data.risks || [])].sort((a, b) => {
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const thStyle = (key) => ({
    padding: '10px 12px', textAlign: 'left', cursor: 'pointer', userSelect: 'none',
    fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.75rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fff3df', color: '#2b2b2b', whiteSpace: 'nowrap',
    borderBottom: '2px solid var(--rm-border)',
  })

  return (
    <div id="tab-risk" className="rm-fade-in">
      {/* Risk Matrix */}
      <div style={{
        border: '1px solid var(--rm-border)', borderRadius: 16,
        background: 'rgba(255,253,247,0.95)', padding: '24px',
        marginBottom: 20,
      }}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 16px' }}>
          Risk Matrix
        </h3>
        <RiskMatrix risks={risks} />
      </div>

      {/* Table */}
      <div style={{
        border: '1px solid var(--rm-border)', borderRadius: 16,
        background: 'rgba(255,253,247,0.95)', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr>
                {['id','category','title','probability','impact','risk_score','owner'].map((k) => (
                  <th key={k} style={thStyle(k)} onClick={() => toggleSort(k)}>
                    {k.replace('_',' ').replace(/\b\w/g, c => c.toUpperCase())}
                    {sortKey === k && <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                ))}
                <th style={{ ...thStyle('mitigation'), cursor: 'default' }}>Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,244,226,0.4)' }}>
                  <td style={{ padding: '10px 12px', color: 'var(--rm-muted)', fontWeight: 600 }}>{r.id}</td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{r.category}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, minWidth: 160 }}>{r.title}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <ProbImpBadge val={r.probability} />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <ProbImpBadge val={r.impact} />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block', minWidth: 28, padding: '2px 8px', borderRadius: 999,
                      fontWeight: 700, fontSize: '0.82rem',
                      color: SCORE_COLOR(r.risk_score), background: SCORE_BG(r.risk_score),
                    }}>
                      {r.risk_score}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: 'var(--rm-muted)' }}>{r.owner}</td>
                  <td style={{ padding: '10px 12px', fontSize: '0.82rem', minWidth: 200 }}>{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProbImpBadge({ val }) {
  const color = val === 'High' ? 'var(--rm-high)' : val === 'Medium' ? 'var(--rm-warn)' : 'var(--rm-ok)'
  return (
    <span style={{ fontWeight: 600, fontSize: '0.8rem', color }}>{val}</span>
  )
}

function Skeleton() {
  return <div style={{ padding: 32, color: 'var(--rm-muted)' }}>Loading risk register…</div>
}
