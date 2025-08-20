export const EXERCISE_CATEGORIES = [
  'Dribbelen',
  'Schieten',
  'Finishing',
  'Verdedigen',
  'Passen',
  'Rebounden',
  'Transition',
  'Conditie',
  'Warm up'
]

// Shared materials list (keep in sync with ExerciseForm options)
export const MATERIAL_OPTIONS = [
  'Pionnen',
  'Loopladder',
  'Hoepel',
  'Stoel',
  'Medicijnbal',
  'Weerstandsband',
  'Springtouw',
  'Pylobox',
  'Shotclock',
  'Reboundmachine'
]

// Normalize court values to one of: '', 'halfcourt', 'fullcourt'
export function normalizeCourt(val) {
  const v = (val || '').toString().toLowerCase().trim().replace(/\s+/g, '')
  if (v === 'halfcourt') return 'halfcourt'
  if (v === 'fullcourt') return 'fullcourt'
  return ''
}

// Backward compatibility (existing imports)
export const CATEGORIES = EXERCISE_CATEGORIES
