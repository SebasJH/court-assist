// src/data/sampleExercises.js
// Centralized sample exercises and a helper to seed the store when empty.

export const SAMPLE_EXERCISES = [
  {
    name: 'Spot shooting 45',
    icon: 'Target',
    description: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
    coachingPoints: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
    category: ['Schieten'],
    minPlayers: 4,
    maxPlayers: 10,
    duration: 5,
    intensity: 2,
    court: '',
    materials: [],
    video: '',
    dateCreated: '2025-08-16T20:00:00.000Z',
    favorite: true
  },
  {
    name: '1v1 verdediging',
    icon: 'Shield',
    description: '1 tegen 1 oefening waarbij de aanvaller probeert te scoren en de verdediger probeert te voorkomen dat er wordt gescoord.',
    coachingPoints: '1 tegen 1 oefening waarbij de aanvaller probeert te scoren en de verdediger probeert te voorkomen dat er wordt gescoord.',
    category: ['Verdedigen', 'Conditie'],
    minPlayers: 2,
    maxPlayers: null,
    duration: 8,
    intensity: 4,
    court: 'Half Court',
    materials: [],
    video: '',
    dateCreated: '2025-08-16T21:00:00.000Z',
    favorite: false
  },
  {
    name: 'Sheridan Drill',
    icon: 'Gauge',
    description: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
    coachingPoints: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
    category: ['Conditie', 'Warm up'],
    minPlayers: 8,
    maxPlayers: 15,
    duration: 10,
    intensity: 4,
    court: 'Full Court',
    materials: [],
    video: '',
    dateCreated: '2025-08-16T22:00:00.000Z',
    favorite: false
  }
]

export function ensureSampleExercises(store) {
  try {
    if (!store || !store.state || !Array.isArray(store.state.exercises)) return
    if (store.state.exercises.length > 0) return
    SAMPLE_EXERCISES.forEach(ex => store.addExercise({ ...ex }, { silent: true }))
  } catch (_) {
    // no-op if store API differs
  }
}
