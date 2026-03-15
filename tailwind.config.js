/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        ibm: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        brand: '#ea5b2f',
        'brand-2': '#0a7c8d',
        'rm-bg-a': '#f7f7ef',
        'rm-bg-b': '#fff4e6',
        'rm-surface': '#fffdf7',
        'rm-border': '#f0dcc3',
        'rm-text': '#1a1e23',
        'rm-muted': '#4f4337',
        'rm-ok': '#228b4e',
        'rm-warn': '#dc8b00',
        'rm-high': '#d84a1b',
        'rm-critical': '#a32020',
      },
    },
  },
  plugins: [],
}
