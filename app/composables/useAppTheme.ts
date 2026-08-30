import { ref } from 'vue'

export type AppTheme = 'sistem' | 'acik' | 'koyu'

export const appTheme = ref<AppTheme>('sistem')

export function useAppTheme() {
  function applyTheme(theme: AppTheme) {
    appTheme.value = theme
    if (typeof window === 'undefined') return

    localStorage.setItem('appTheme', theme)

    const isDark =
      theme === 'koyu' ||
      (theme === 'sistem' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      document.documentElement.style.colorScheme = 'light'
    }
  }

  function initTheme() {
    if (typeof window === 'undefined') return
    const saved = (localStorage.getItem('appTheme') as AppTheme) || 'sistem'
    applyTheme(saved)

    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (appTheme.value === 'sistem') {
          applyTheme('sistem')
        }
      })
    } catch (e) {}
  }

  return {
    appTheme,
    applyTheme,
    initTheme
  }
}
