import { useState } from 'react'

export default function TextPreview({ text, fileName }) {
  const [open, setOpen] = useState(false)
  if (!text) return null

  const words = text.trim().split(/\s+/).length
  const chars = text.length
  const preview = text.slice(0, 1200) + (text.length > 1200 ? '…' : '')

  return (
    <div style={{
      border: '1px solid var(--rm-border)',
      borderRadius: 14,
      background: 'rgba(255,255,255,0.75)',
      overflow: 'hidden',
      marginTop: 12,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          color: 'var(--rm-text)',
          fontSize: '0.9rem',
        }}
      >
        <span>📄 {fileName || 'Extracted Text'}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 400, fontSize: '0.78rem', color: 'var(--rm-muted)' }}>
            {words.toLocaleString()} words · {chars.toLocaleString()} chars
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--rm-muted)' }}>{open ? '▲' : '▼'}</span>
        </span>
      </button>
      {open && (
        <pre style={{
          margin: 0,
          padding: '0 16px 16px',
          fontSize: '0.78rem',
          color: 'var(--rm-muted)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 260,
          overflowY: 'auto',
          fontFamily: 'IBM Plex Sans, sans-serif',
        }}>
          {preview}
        </pre>
      )}
    </div>
  )
}
