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

// Shared materials list for exercises
export const EXERCISE_MATERIALS = [
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
