// Simple theme manager for light/dark mode
const THEME_KEY = 'theme'

function applyTheme(theme) {
  try {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
      theme = 'light'
    }
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch (_) {}
  } catch (_) {}
}

function getSavedTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'dark' || t === 'light') return t
  } catch (_) {}
  return null
}

function getPreferredTheme() {
  // Default to light; optionally respect system preference on first visit
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch (_) {}
  return 'light'
}

export function initTheme() {
  const saved = getSavedTheme()
  const theme = saved || getPreferredTheme()
  applyTheme(theme)
}

export function setTheme(theme) {
  applyTheme(theme === 'dark' ? 'dark' : 'light')
}

export function getTheme() {
  const saved = getSavedTheme()
  if (saved) return saved
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function toggleTheme() {
  const cur = getTheme()
  setTheme(cur === 'dark' ? 'light' : 'dark')
}
