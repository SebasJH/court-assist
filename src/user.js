// Simple user profile persistence in localStorage
const USER_KEY = 'user_profile'

export function computeInitials(name) {
  try {
    const s = String(name || '').trim()
    if (!s) return 'SH'
    const parts = s.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    // Single word: take first two letters if available
    const w = parts[0]
    return (w.slice(0, 2)).toUpperCase()
  } catch (_) {
    return 'SH'
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) {
      const obj = JSON.parse(raw) || {}
      const name = typeof obj.name === 'string' ? obj.name : 'Sebas Hartman'
      const email = typeof obj.email === 'string' ? obj.email : ''
      const initials = typeof obj.initials === 'string' && obj.initials.trim() ? obj.initials.trim().toUpperCase() : computeInitials(name)
      return { name, email, initials }
    }
  } catch (_) {}
  // Defaults
  return { name: 'Sebas Hartman', email: '', initials: 'SH' }
}

export function setUser(user) {
  try {
    const name = String(user?.name || '').trim() || 'Sebas Hartman'
    const email = String(user?.email || '').trim()
    const initialsRaw = String(user?.initials || '').trim()
    const initials = initialsRaw ? initialsRaw.toUpperCase() : computeInitials(name)
    const payload = { name, email, initials }
    localStorage.setItem(USER_KEY, JSON.stringify(payload))
    return payload
  } catch (e) {
    // fallback: do nothing
    return getUser()
  }
}
