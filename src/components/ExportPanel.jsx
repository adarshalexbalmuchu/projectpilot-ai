import { useState } from 'react'
import { exportAllAsPDF, exportSoWAsDOCX, exportRisksAsCSV, copyRawJSON } from '../utils/exportHelpers.js'

const TAB_IDS = ['tab-sow', 'tab-wbs', 'tab-risk', 'tab-gantt', 'tab-pert']

export default function ExportPanel({ analysisData }) {
  const [copying, setCopying] = useState(false)
  const [exporting, setExporting] = useState(false)

  if (!analysisData) return null

  const projectName = analysisData.sow?.project_name || 'Project'

  async function handlePDF() {
    setExporting(true)
    try {
      await exportAllAsPDF(TAB_IDS, projectName)
    } catch (e) {
      alert('PDF export failed: ' + e.message)
    } finally {
      setExporting(false)
    }
  }

  function handleDOCX() {
    if (analysisData.sow) exportSoWAsDOCX(analysisData.sow)
  }

  function handleCSV() {
    if (analysisData.risk) exportRisksAsCSV(analysisData.risk.risks)
  }

  async function handleCopy() {
    setCopying(true)
    copyRawJSON(analysisData)
    setTimeout(() => setCopying(false), 1500)
  }

  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 10,
      background: 'rgba(255,253,247,0.92)', backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--rm-border)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
    }}>
      <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.82rem',
        color: 'var(--rm-muted)', marginRight: 4 }}>Export:</span>

      <ExportBtn onClick={handlePDF} disabled={exporting} primary>
        {exporting ? '⏳ Generating…' : '📄 All as PDF'}
      </ExportBtn>

      <ExportBtn onClick={handleDOCX} disabled={!analysisData.sow}>
        📝 SoW as DOCX
      </ExportBtn>

      <ExportBtn onClick={handleCSV} disabled={!analysisData.risk}>
        📊 Risks as CSV
      </ExportBtn>

      <ExportBtn onClick={handleCopy}>
        {copying ? '✓ Copied!' : '📋 Copy JSON'}
      </ExportBtn>
    </div>
  )
}

function ExportBtn({ children, onClick, disabled, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '7px 16px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: primary ? 'none' : '1px solid var(--rm-border)',
        background: primary
          ? 'linear-gradient(135deg, var(--rm-brand), #f2742a)'
          : 'rgba(255,254,249,0.9)',
        color: primary ? '#fff' : 'var(--rm-text)',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  )
}
