import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      colors: {
        brand: {
          dark: '#0F223D',       // 85% Corporate Dominant: Deep Navy
          navy: '#003057',       // Corporate Midnight Navy
          primary: '#0F223D',    // Primary Brand
          surface: '#F8FAFC',    // Standard Background
          card: '#FFFFFF',       // Card Surface
          border: '#E2E8F0',     // Unified Border
          text: '#0F172A',       // Primary Text
          muted: '#64748B',      // Secondary Text
          accent: '#1EAE4C',     // Focused Accent: Growth / Action Green
          'accent-hover': '#188C3D',
        }
      }
    }
  }
}
