// src/data/sampleExercises.js
// Centralized sample exercises and a helper to seed the store when empty.

export const SAMPLE_EXERCISES = [
  {
    name: '5 Spot shooting',
    icon: 'Target',
    description: "Schietoefening waarbij spelers vanaf 5 vaste spots rond de basket schieten: Hoek links, 45 graden links, Top van de key, 45 graden rechts, Hoek rechts.",
    coachingPoints: "Goede balans en voetenwerk. Schiet in een vloeiende beweging. Follow-through vasthouden.",
    execution: "Speler dribbelt door 6 pylonen en schiet vanaf de aangewezen spot. Volgende speler begint zodra er geschoten is.",
    variations: "Laat spelers direct na het schot hun eigen rebound pakken. Voeg eventueel een verdediger toe voor extra druk.",
    notes: "Goed als schiet warming-up en voor voetwerk.",
    category: ['Schieten'],
    minPlayers: 2,
    maxPlayers: 3,
    duration: 5,
    intensity: 2,
    court: '',
    materials: [],
    video: 'https://www.youtube.com/watch?v=u-eeORGpMb0',
    dateCreated: '2025-08-16T20:00:00.000Z',
    favorite: true
  },
  {
    name: '1v1 Lane Drill',
    icon: 'Shield',
    description: "Intensieve 1 tegen 1 oefening waarbij de aanvaller probeert te scoren en de verdediger dit probeert te voorkomen.",
    coachingPoints: "Verdediger: blijf laag en actief. Aanvaller: gebruik schijnbewegingen. Beide: werk op hoge intensiteit.",
    execution: "Start bovenaan de bucket of vanaf de zijlijn. Aanvaller krijgt 1-2 dribbels om te scoren. Verdediger probeert te stoppen zonder fouten.",
    variations: "Geef de aanvaller maximaal 5 seconden. Start oefening vanaf verschillende spots zoals baseline, wing, of top.",
    notes: "Zeer geschikt voor conditie en verdedigingsfundamentals.",
    category: ['Verdedigen', 'Conditie'],
    minPlayers: 2,
    maxPlayers: null,
    duration: 8,
    intensity: 5,
    court: 'Full Court',
    materials: [],
    video: 'https://www.youtube.com/watch?v=XKtmMJeufNU',
    dateCreated: '2025-08-16T21:00:00.000Z',
    favorite: false
  },
  {
    name: 'Sheridan Drill',
    icon: 'Gauge',
    description: "Conditionele dribbel- en schietoefening over het hele veld.",
    coachingPoints: "Dribbel gecontroleerd door de pylonen. Schiet met balans en focus. Houd het tempo hoog.",
    execution: "Speler start baseline, dribbelt door 6 pylonen en schiet vanaf 45 graden. Volgende speler start zodra de vorige geschoten heeft.",
    variations: "Laat spelers direct press-defense spelen na het schot. Stel een tijdslimiet in voor extra druk.",
    notes: "Zeer effectief voor conditie en als warming-up.",
    category: ['Conditie', 'Warm up'],
    minPlayers: 8,
    maxPlayers: 15,
    duration: 10,
    intensity: 4,
    court: 'Full Court',
    materials: [],
    video: 'https://www.youtube.com/shorts/qLq1Jbmmz-Q',
    dateCreated: '2025-08-16T22:00:00.000Z',
    favorite: false
  },
  {
    name: 'Lay-up lijnen',
    icon: 'Medal',
    description: "Klassieke warming-up drill waarbij spelers lay-ups doen vanaf beide kanten van de basket.",
    coachingPoints: "Gebruik altijd het bord. Juiste hand en pasrichting. Tempo hoog houden.",
    execution: "De ene rij passt naar de andere rij. Speler maakt lay-up en sluit achteraan in de tegenovergestelde rij aan.",
    variations: "Alleen linkerkant lay-ups. Reverse lay-ups of euro-steps toevoegen.",
    notes: "Perfect voor warming-up en timing.",
    category: ['Warm up'],
    minPlayers: 6,
    maxPlayers: null,
    duration: 6,
    intensity: 2,
    court: 'Half Court',
    materials: [''],
    video: 'https://www.youtube.com/watch?v=vZtY4vag8M4',
    dateCreated: '2025-08-17T09:00:00.000Z',
    favorite: false
  },
  {
    name: 'Pick and Roll basis',
    icon: 'Eye',
    description: "Oefening gericht op de basisprincipes van pick and roll in aanvalssituaties.",
    coachingPoints: "Goede screen angle plaatsen. Screener moet direct naar de basket rollen. Spacing behouden met de andere spelers.",
    execution: "Aanvaller dribbelt richting screener. Screener zet een screen. Aanvaller gebruikt het screen en beslist: schieten, passen of drijven.",
    variations: "Verdediger toevoegen voor realistischere situatie. Pick and pop in plaats van roll.",
    notes: "Belangrijk onderdeel van teamspel.",
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
    description: "Verdedigingsdrill waarbij de verdediger leert een aanvaller te sluiten met de juiste houding en intensiteit.",
    coachingPoints: "Hand omhoog tijdens het sluiten. Tempo controleren, niet te wild. Blijf voor de aanvaller.",
    execution: "Coach passt bal naar aanvaller. Verdediger sprint van baseline naar aanvaller en sluit uit. Na de close-out wordt er 1v1 gespeeld.",
    variations: "Met meerdere aanvallers tegelijk. Close-out op verschillende posities.",
    notes: "Essentieel voor defensieve fundamentals.",
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
    description: "Snelle omschakeloefening waarbij teams leren beslissen in overtal situaties en daarna ondertal verdedigen.",
    coachingPoints: "Maak snel de juiste beslissing: passen of afmaken. Verdediger: kies een aanvaller en forceer moeilijke pass. Hoge intensiteit vereist.",
    execution: "Start met 3 aanvallers vs 2 verdedigers. Na de aanval volgt direct 2v1 terug. Teams roteren per aanval.",
    variations: "Start met 4v3. Beperk aantal passen.",
    notes: "Perfect voor transitie en conditietraining.",
    category: ['Transitie', 'Conditie'],
    minPlayers: 5,
    maxPlayers: 10,
    duration: 12,
    intensity: 5,
    court: 'Full Court',
    materials: [],
    video: 'https://www.youtube.com/watch?v=oYQUjUB23H8',
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
