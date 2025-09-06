// src/data/sampleTrainings.js
// Sample trainings and a helper to seed the store when empty.

export const SAMPLE_TRAININGS = [
  {
    name: 'Training 1',
    date: '2025-09-01',
    time: { start: '18:30', end: '20:00' },
    theme: 'Warming-up & Schieten',
    team: 'U16',
    duration: 90,
    participants: 12,
    exercisesCount: 6,
    description: 'Intro training met focus op warming-up, basis dribbel en schietoefeningen. Korte teambuilding aan het einde.',
    dateCreated: '2025-08-25T10:00:00.000Z'
  },
  {
    name: 'Training 2',
    date: '2025-09-08',
    time: { start: '18:30', end: '20:05' },
    theme: 'Verdediging',
    team: 'U16',
    duration: 95,
    participants: 14,
    exercisesCount: 7,
    description: 'Focus op close-out, 1v1 en teamrebound principes. Eindigen met 4v4 box-out wedstrijd.',
    dateCreated: '2025-08-26T10:00:00.000Z'
  },
  {
    name: 'Training 3',
    date: '2025-09-15',
    time: { start: '18:30', end: '20:10' },
    theme: 'Transitie',
    team: 'U16',
    duration: 100,
    participants: 13,
    exercisesCount: 5,
    description: 'Hoge intensiteit transitie-oefeningen (3v2/2v1) en snelheid. Cooling down met core stability.',
    dateCreated: '2025-08-27T10:00:00.000Z'
  },
  {
    name: 'Training 4',
    date: '2025-09-22',
    time: { start: '18:30', end: '20:10' },
    theme: 'Aanval',
    team: 'U16',
    duration: 100,
    participants: 12,
    exercisesCount: 6,
    description: 'Basisprincipes pick & roll: angles, spacing en reads. Afsluiten met 5v5 focus op P&R variaties.',
    dateCreated: '2025-08-28T10:00:00.000Z'
  }
]

export function ensureSampleTrainings(store) {
  try {
    if (!store || !store.state || !Array.isArray(store.state.trainings)) return
    if (store.state.trainings.length > 0) return
    SAMPLE_TRAININGS.forEach(t => store.addTraining({ ...t }, { silent: true }))
  } catch (_) {
    // ignore if store API differs
  }
}
