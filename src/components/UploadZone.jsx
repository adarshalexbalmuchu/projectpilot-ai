import { useRef, useState } from 'react'
import { extractText } from '../utils/extractText.js'

const ACCEPTED = '.pdf,.docx,.txt,.md,.csv,.log'
const ACCEPT_LABEL = 'PDF, DOCX, TXT, MD'

export default function UploadZone({ onExtracted }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(file) {
    setError(null)
    setLoading(true)
    try {
      const text = await extractText(file)
      if (!text.trim()) throw new Error('No text could be extracted from this file.')
      onExtracted(text, file.name)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function onInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--rm-brand)' : 'rgba(10,124,141,0.38)'}`,
          borderRadius: 14,
          background: dragging ? 'rgba(234,91,47,0.06)' : 'rgba(10,124,141,0.04)',
          padding: '40px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <input ref={inputRef} type="file" accept={ACCEPTED} onChange={onInputChange} style={{ display: 'none' }} />
        {loading ? (
          <div style={{ color: 'var(--rm-brand-2)' }}>
            <div className="rm-spin" style={{ display: 'inline-block', width: 28, height: 28, border: '3px solid var(--rm-border)', borderTopColor: 'var(--rm-brand-2)', borderRadius: '50%' }} />
            <p style={{ marginTop: 12, color: 'var(--rm-muted)' }}>Extracting text…</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
            <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, margin: '0 0 4px', color: 'var(--rm-text)' }}>
              Drop your file here or <span style={{ color: 'var(--rm-brand-2)', textDecoration: 'underline' }}>browse</span>
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--rm-muted)' }}>Supports {ACCEPT_LABEL}</p>
          </>
        )}
      </div>
      {error && (
        <p style={{ color: 'var(--rm-high)', marginTop: 8, fontSize: '0.85rem' }}>⚠ {error}</p>
      )}
    </div>
  )
}
