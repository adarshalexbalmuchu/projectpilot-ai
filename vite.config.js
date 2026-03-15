import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/projectpilot-ai/',
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
})
