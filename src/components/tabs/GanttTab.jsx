/**
 * Gantt chart rendered with a custom SVG renderer.
 * Falls back gracefully if data is missing.
 */

const PHASE_COLORS = [
  '#ea5b2f', '#0a7c8d', '#228b4e', '#dc8b00', '#7c3aed', '#d84a1b',
]

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export default function GanttTab({ data }) {
  if (!data) return <Skeleton />

  const tasks = data.tasks || []
  if (tasks.length === 0) return <Empty />

  const totalDays = data.total_duration_days || Math.max(...tasks.map(t => t.end_day))
  const startDate = data.start_date || new Date().toISOString().split('T')[0]

  // Collect unique phases
  const phases = [...new Set(tasks.map(t => t.phase || 'General'))]
  const phaseColor = Object.fromEntries(phases.map((p, i) => [p, PHASE_COLORS[i % PHASE_COLORS.length]]))

  const ROW_H = 36
  const PAD_L = 160
  const PAD_T = 30
  const BAR_H = 22
  const CHART_W = Math.min(900, Math.max(600, totalDays * 6))
  const SVG_H = PAD_T + tasks.length * ROW_H + 40

  // Day tick interval
  const tickInterval = totalDays <= 30 ? 5 : totalDays <= 90 ? 10 : 20

  return (
    <div id="tab-gantt" className="rm-fade-in" style={{
      border: '1px solid var(--rm-border)', borderRadius: 16,
      background: 'rgba(255,253,247,0.95)', padding: '24px', overflow: 'auto',
    }}>
      <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 4px' }}>
        Gantt Chart
      </h2>
      <p style={{ margin: '0 0 16px', color: 'var(--rm-muted)', fontSize: '0.82rem' }}>
        Project start: {startDate} · Total: {totalDays} days
      </p>

      {/* Phase legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {phases.map(p => (
          <span key={p} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.78rem', color: 'var(--rm-muted)',
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: phaseColor[p], display: 'inline-block' }} />
            {p}
          </span>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <svg width={PAD_L + CHART_W + 20} height={SVG_H} style={{ display: 'block', fontFamily: 'IBM Plex Sans, sans-serif' }}>
          {/* Day grid lines + labels */}
          {Array.from({ length: Math.floor(totalDays / tickInterval) + 1 }, (_, i) => i * tickInterval).map(day => {
            const x = PAD_L + (day / totalDays) * CHART_W
            return (
              <g key={day}>
                <line x1={x} y1={PAD_T} x2={x} y2={SVG_H - 20} stroke="rgba(0,0,0,0.07)" strokeWidth={1} />
                <text x={x} y={PAD_T - 6} fontSize={9} fill="var(--rm-muted)" textAnchor="middle">
                  {day === 0 ? 'Day 0' : addDays(startDate, day)}
                </text>
              </g>
            )
          })}

          {/* Tasks */}
          {tasks.map((task, i) => {
            const y = PAD_T + i * ROW_H
            const barX = PAD_L + (task.start_day / totalDays) * CHART_W
            const barW = Math.max(4, ((task.end_day - task.start_day) / totalDays) * CHART_W)
            const color = phaseColor[task.phase || 'General'] || PHASE_COLORS[0]

            return (
              <g key={task.id}>
                {/* Row label */}
                <text x={PAD_L - 8} y={y + ROW_H / 2 + 4} fontSize={11} fill="var(--rm-text)" textAnchor="end">
                  {task.name.length > 22 ? task.name.slice(0, 21) + '…' : task.name}
                </text>
                {/* Row bg */}
                <rect x={PAD_L} y={y + 2} width={CHART_W} height={ROW_H - 4} fill={i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'} />
                {/* Bar */}
                <rect x={barX} y={y + (ROW_H - BAR_H) / 2} width={barW} height={BAR_H}
                  rx={5} fill={color} fillOpacity={0.85} />
                {/* Duration label inside bar */}
                {barW > 30 && (
                  <text x={barX + barW / 2} y={y + ROW_H / 2 + 4}
                    fontSize={10} fill="#fff" fontWeight={600} textAnchor="middle">
                    {task.duration_days}d
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function Skeleton() {
  return <div style={{ padding: 32, color: 'var(--rm-muted)' }}>Loading Gantt chart…</div>
}

function Empty() {
  return <div style={{ padding: 32, color: 'var(--rm-muted)' }}>No tasks found in Gantt data.</div>
}
