/**
 * 3x3 SVG Risk Matrix heatmap (Probability vs Impact).
 */
const LEVELS = ['Low', 'Medium', 'High']

const CELL_COLORS = {
  'High-High':     '#a32020',
  'High-Medium':   '#d84a1b',
  'High-Low':      '#dc8b00',
  'Medium-High':   '#d84a1b',
  'Medium-Medium': '#dc8b00',
  'Medium-Low':    '#228b4e',
  'Low-High':      '#dc8b00',
  'Low-Medium':    '#228b4e',
  'Low-Low':       '#228b4e',
}

export default function RiskMatrix({ risks = [] }) {
  const W = 300, H = 260
  const cellW = 80, cellH = 70
  const padL = 60, padT = 30

  // Count risks per cell
  const counts = {}
  risks.forEach((r) => {
    const key = `${r.probability}-${r.impact}`
    counts[key] = (counts[key] || 0) + 1
  })

  return (
    <div style={{ overflow: 'auto' }}>
      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
        {/* Y-axis label */}
        <text x={12} y={H / 2} transform={`rotate(-90, 12, ${H / 2})`}
          fontSize={11} fill="var(--rm-muted)" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif">
          Probability
        </text>
        {/* X-axis label */}
        <text x={padL + 1.5 * cellW} y={H - 4}
          fontSize={11} fill="var(--rm-muted)" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif">
          Impact
        </text>

        {/* Column headers */}
        {LEVELS.map((lvl, ci) => (
          <text key={ci} x={padL + ci * cellW + cellW / 2} y={padT - 8}
            fontSize={10} fill="var(--rm-muted)" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif">
            {lvl}
          </text>
        ))}

        {/* Row headers + cells */}
        {[...LEVELS].reverse().map((prob, ri) => (
          <g key={ri}>
            <text x={padL - 6} y={padT + ri * cellH + cellH / 2 + 4}
              fontSize={10} fill="var(--rm-muted)" textAnchor="end" fontFamily="IBM Plex Sans, sans-serif">
              {prob}
            </text>
            {LEVELS.map((imp, ci) => {
              const key = `${prob}-${imp}`
              const color = CELL_COLORS[key] || '#ccc'
              const count = counts[key] || 0
              return (
                <g key={ci}>
                  <rect
                    x={padL + ci * cellW} y={padT + ri * cellH}
                    width={cellW - 2} height={cellH - 2}
                    rx={6} fill={color} fillOpacity={0.25}
                    stroke={color} strokeOpacity={0.6} strokeWidth={1}
                  />
                  {count > 0 && (
                    <>
                      <circle
                        cx={padL + ci * cellW + cellW / 2}
                        cy={padT + ri * cellH + cellH / 2}
                        r={14} fill={color}
                      />
                      <text
                        x={padL + ci * cellW + cellW / 2}
                        y={padT + ri * cellH + cellH / 2 + 5}
                        fontSize={13} fill="#fff" fontWeight="700"
                        textAnchor="middle" fontFamily="Sora, sans-serif">
                        {count}
                      </text>
                    </>
                  )}
                </g>
              )
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}
