import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
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
