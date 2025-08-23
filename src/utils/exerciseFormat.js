// Shared formatting helpers for exercise fields
// Keep framework-agnostic and mirror label variants used in ExerciseBadge.vue

export function isNum(v) {
  return typeof v === 'number' && Number.isFinite(v)
}

export function hasPlayers(min, max) {
  return isNum(min) || isNum(max)
}

export function formatPlayers(min, max, { variant = 'compact' } = {}) {
  const minVal = isNum(min) ? min : null
  const maxVal = isNum(max) ? max : null
  if (variant === 'detail') {
    if (minVal !== null && maxVal !== null) return (minVal === maxVal) ? `${minVal}` : `${minVal} - ${maxVal}`
    if (minVal !== null) return `${minVal} minimaal`
    if (maxVal !== null) return `${maxVal} maximaal`
    return ''
  }
  // compact
  if (minVal !== null && maxVal !== null) return (minVal === maxVal) ? `${minVal}` : `${minVal}-${maxVal}`
  if (minVal !== null) return `${minVal} min`
  if (maxVal !== null) return `${maxVal} max`
  return ''
}

export function hasDuration(d) {
  return isNum(d) && d > 0
}

export function formatDuration(d, { variant = 'compact' } = {}) {
  if (!hasDuration(d)) return ''
  return variant === 'detail' ? `${d} minuten` : `${d} min`
}

export function hasCourt(court) {
  return typeof court === 'string' && court.trim().length > 0
}

export function formatCourt(court, { variant = 'compact' } = {}) {
  const v = (court || '').toString().trim()
  if (!v) return ''
  const norm = v.toLowerCase()
  if (variant === 'detail') {
    if (norm === 'halfcourt' || norm === 'half court') return 'Half court'
    if (norm === 'fullcourt' || norm === 'full court') return 'Full court'
  } else {
    if (norm === 'halfcourt' || norm === 'half court') return 'Half'
    if (norm === 'fullcourt' || norm === 'full court') return 'Full'
  }
  return v
}

export function formatIntensity(i) {
  return isNum(i) ? `${i}/5` : ''
}

// Convenience helpers taking an exercise object
export function formatPlayersFromExercise(exercise, { variant = 'compact' } = {}) {
  return formatPlayers(exercise?.minPlayers, exercise?.maxPlayers, { variant })
}
export function formatDurationFromExercise(exercise, { variant = 'compact' } = {}) {
  return formatDuration(exercise?.duration, { variant })
}
export function formatCourtFromExercise(exercise, { variant = 'compact' } = {}) {
  return formatCourt(exercise?.court, { variant })
}
export function formatIntensityFromExercise(exercise) {
  return formatIntensity(exercise?.intensity)
}
