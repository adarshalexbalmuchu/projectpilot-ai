/**
 * Export helpers: PDF (jsPDF + html2canvas), DOCX, CSV, clipboard JSON.
 */

export async function exportAllAsPDF(tabIds, projectName = 'Project') {
  const { default: jsPDF } = await import('jspdf')
  const { default: html2canvas } = await import('html2canvas')

  const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < tabIds.length; i++) {
    const el = document.getElementById(tabIds[i])
    if (!el) continue

    const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, backgroundColor: '#fffdf7' })
    const imgData = canvas.toDataURL('image/jpeg', 0.85)
    const imgH = (canvas.height * pageW) / canvas.width

    if (i > 0) pdf.addPage()

    if (imgH <= pageH) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH)
    } else {
      // Tall content: slice into pages
      let yOffset = 0
      while (yOffset < imgH) {
        if (yOffset > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, pageW, imgH)
        yOffset += pageH
      }
    }
  }

  pdf.save(`riskmind_${projectName.replace(/\s+/g, '_').toLowerCase()}_analysis.pdf`)
}

export async function exportSoWAsDOCX(sow) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx')

  const makeHeading = (text) =>
    new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } })

  const makeBullet = (text) =>
    new Paragraph({ text: `• ${text}`, spacing: { after: 80 }, indent: { left: 360 } })

  const makeBody = (text) =>
    new Paragraph({ children: [new TextRun({ text, size: 24 })], spacing: { after: 120 } })

  const sections = [
    new Paragraph({
      text: sow.project_name || 'Scope of Work',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    makeHeading('Overview'),
    makeBody(sow.overview || ''),
    makeHeading('Objectives'),
    ...(sow.objectives || []).map(makeBullet),
    makeHeading('Deliverables'),
    ...(sow.deliverables || []).map(makeBullet),
    makeHeading('Exclusions'),
    ...(sow.exclusions || []).map(makeBullet),
    makeHeading('Assumptions'),
    ...(sow.assumptions || []).map(makeBullet),
    makeHeading('Constraints'),
    ...(sow.constraints || []).map(makeBullet),
  ]

  const doc = new Document({ sections: [{ children: sections }] })
  const blob = await Packer.toBlob(doc)
  triggerDownload(blob, 'riskmind_scope_of_work.docx')
}

export function exportRisksAsCSV(risks) {
  if (!risks || risks.length === 0) return
  const headers = ['ID', 'Category', 'Title', 'Description', 'Probability', 'Impact', 'Risk Score', 'Mitigation', 'Contingency', 'Owner']
  const rows = risks.map((r) => [
    r.id, r.category, r.title, r.description,
    r.probability, r.impact, r.risk_score,
    r.mitigation, r.contingency, r.owner,
  ].map(csvCell).join(','))

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, 'riskmind_risk_register.csv')
}

export function copyRawJSON(analysisData) {
  const json = JSON.stringify(analysisData, null, 2)
  navigator.clipboard.writeText(json)
}

function csvCell(val) {
  const s = String(val ?? '').replace(/"/g, '""')
  return /[,"\n]/.test(s) ? `"${s}"` : s
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
