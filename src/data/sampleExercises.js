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
  },
  {
    name: 'Lay-up lijnen',
    icon: 'Medal',
    description: 'Klassieke warming-up waarbij spelers lay-ups doen vanaf beide kanten.',
    coachingPoints: 'Gebruik het bord, juiste hand, en goede pasrichting.',
    category: ['Warm up'],
    minPlayers: 6,
    maxPlayers: null,
    duration: 6,
    intensity: 2,
    court: 'Half Court',
    materials: [''],
    video: '',
    dateCreated: '2025-08-17T09:00:00.000Z',
    favorite: false
  },
  {
    name: 'Pick and Roll basis',
    icon: 'Eye',
    description: 'Aanvaller en screener oefenen de pick and roll situatie tegen verdedigers.',
    coachingPoints: 'Goede screen angle, roll naar de basket, spacing behouden.',
    category: ['Teamspel'],
    minPlayers: 4,
    maxPlayers: 8,
    duration: 12,
    intensity: 3,
    court: 'Half Court',
    materials: [],
    video: '',
    dateCreated: '2025-08-17T10:00:00.000Z',
    favorite: true
  },
  {
    name: 'Close-out drill',
    icon: 'Zap',
    description: 'Verdediger sprint naar de aanvaller en sluit uit met hand omhoog.',
    coachingPoints: 'Goede houding, controleer het tempo en blijf voor de aanvaller.',
    category: ['Verdedigen'],
    minPlayers: 2,
    maxPlayers: 10,
    duration: 7,
    intensity: 3,
    court: 'Half Court',
    materials: [],
    video: '',
    dateCreated: '2025-08-17T11:00:00.000Z',
    favorite: false
  },
  {
    name: 'Transition 3v2 / 2v1',
    icon: 'Activity',
    description: 'Snelle omschakel oefening waarbij teams in overtal en later ondertal aanvallen en verdedigen.',
    coachingPoints: 'Maak de juiste beslissing: passen of afmaken.',
    category: ['Transition', 'Conditie'],
    minPlayers: 5,
    maxPlayers: 10,
    duration: 12,
    intensity: 5,
    court: 'Full Court',
    materials: [],
    video: '',
    dateCreated: '2025-08-17T12:00:00.000Z',
    favorite: false
  },
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
