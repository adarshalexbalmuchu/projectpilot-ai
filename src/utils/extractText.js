/**
 * Client-side text extraction for PDF, DOCX, and TXT files.
 * Uses pdfjs-dist, mammoth, and the native FileReader API.
 */

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'txt' || ext === 'md' || ext === 'log' || ext === 'csv') {
    return readAsText(file)
  }
  if (ext === 'pdf') {
    return extractFromPDF(file)
  }
  if (ext === 'docx') {
    return extractFromDOCX(file)
  }
  throw new Error(`Unsupported file type: .${ext}`)
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file, 'utf-8')
  })
}

async function extractFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  // Use the bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map((item) => item.str)
    pages.push(strings.join(' '))
  }

  return pages.join('\n\n').trim()
}

async function extractFromDOCX(file) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}
