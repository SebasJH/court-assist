// src/data/sampleExercises.js
// Centralized sample exercises and a helper to seed the store when empty.

export const SAMPLE_EXERCISES = [
    {
        name: '5 Spot shooting',
        icon: 'Target',
        category: ['Schieten'],
        description: "Schietoefening waarbij spelers vanaf 5 vaste spots rond de basket schieten: Hoek links, 45 graden links, Top van de key, 45 graden rechts, Hoek rechts.",
        execution: "<ol><li>Speler dribbelt door 6 pylonen en schiet vanaf de aangewezen spot.</li><li>Volgende speler begint zodra er geschoten is.</li></ol>",
        coachingPoints: "<ul><li>Goede balans en voetenwerk</li><li>Schiet in een vloeiende beweging</li><li>Follow-through vasthouden</li></ul>",
        variations: "Laat spelers direct na het schot hun eigen rebound pakken. Voeg eventueel een verdediger toe voor extra druk.",
        notes: "Goed als schiet warming-up en voor voetwerk.",
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
        category: ['Verdedigen', 'Conditie'],
        description: "Intensieve 1 tegen 1 oefening waarbij de aanvaller probeert te scoren en de verdediger dit probeert te voorkomen.",
        execution: "<ol><li>Start bovenaan de bucket of vanaf de zijlijn.</li><li>Aanvaller krijgt 1-2 dribbels om te scoren.</li><li>Verdediger probeert te stoppen zonder fouten.</li></ol>",
        coachingPoints: "<ul><li>Verdediger: blijf laag en actief.</li><li>Aanvaller: gebruik schijnbewegingen.</li><li>Beide: werk op hoge intensiteit.</li></ul>",
        variations: "Geef de aanvaller maximaal 5 seconden. Start oefening vanaf verschillende spots zoals baseline, wing, of top.",
        notes: "Zeer geschikt voor conditie en verdedigingsfundamentals.",
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
        category: ['Conditie', 'Warm up'],
        description: "Oefening gericht op rebounds, snelle outlet passes en lay-ups in transitie, om snelheid en teamcoördinatie te verbeteren.",
        execution: "<ol><li>Een speler neemt een rebound.</li><li>De speler passt de bal naar een teamgenoot in de outlet positie.</li><li>De rebounder rent achter de bal aan richting de basket.</li><li>De speler ontvangt de bal van de outlet en maakt een lay-up.</li><li>Herhaal dit met de volgende speler.</li></ol>",
        coachingPoints: "<ul><li>Focus op snelle, nauwkeurige outlet passes.</li><li>Run achter de bal aan met volle snelheid.</li><li>Communiceer duidelijk tijdens de transitie.</li><li>Zorg voor een gecontroleerde maar snelle lay-up.</li></ul>",
        variations: "Laat spelers direct press-defense spelen na het schot. Stel een tijdslimiet in voor extra druk.",
        notes: "Zeer effectief voor conditie en als warming-up.",
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
        category: ['Warm up'],
        description: "Klassieke warming-up drill waarbij spelers lay-ups doen vanaf beide kanten van de basket.",
        execution: "<ol><li>De ene rij passt naar de andere rij.</li><li>Speler maakt lay-up en sluit achteraan in de tegenovergestelde rij aan.</li></ol>",
        coachingPoints: "<ul><li>Gebruik altijd het bord.</li><li>Juiste hand en pasrichting.</li><li>Tempo hoog houden.</li></ul>",
        variations: "Alleen linkerkant lay-ups. Reverse lay-ups of euro-steps toevoegen.",
        notes: "Perfect voor warming-up en timing.",
        minPlayers: 6,
        maxPlayers: null,
        duration: 6,
        intensity: 2,
        court: 'Half Court',
        materials: [],
        video: 'https://www.youtube.com/watch?v=vZtY4vag8M4',
        dateCreated: '2025-08-17T09:00:00.000Z',
        favorite: false
    },
    {
        name: 'Pick and Roll basis',
        icon: 'Eye',
        category: ['Teamspel'],
        description: "Oefening gericht op de basisprincipes van pick and roll in aanvalssituaties.",
        execution: "<ol><li>Aanvaller dribbelt richting screener.</li><li>Screener zet een screen.</li><li>Aanvaller gebruikt het screen en beslist: schieten, passen of driven.</li></ol>",
        coachingPoints: "<ul><li>Goede screen angle plaatsen.</li><li>Screener moet direct naar de basket rollen.</li><li>Spacing behouden met de andere spelers.</li></ul>",
        variations: "Verdediger toevoegen voor realistischere situatie. Pick and pop in plaats van roll.",
        notes: "Belangrijk onderdeel van teamspel.",
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
        category: ['Verdedigen', 'Voetenwerk'],
        description: "Verdedigingsdrill waarbij de verdediger leert een aanvaller te sluiten met de juiste houding en intensiteit.",
        execution: "<ol><li>Coach passt bal naar aanvaller.</li><li>Verdediger sprint van baseline naar aanvaller en sluit uit.</li><li>Na de close-out wordt er 1v1 gespeeld.</li></ol>",
        coachingPoints: "<ul><li>Hand omhoog tijdens het sluiten.</li><li>Tempo controleren, niet te wild.</li><li>Blijf voor de aanvaller.</li></ul>",
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
        category: ['Transitie', 'Conditie'],
        description: "Snelle omschakeloefening waarbij teams leren beslissen in overtal situaties en daarna ondertal verdedigen.",
        execution: "Start met 3 aanvallers vs 2 verdedigers. Na de aanval volgt direct 2v1 terug. Teams roteren per aanval.",
        coachingPoints: "<ul><li>Maak snel de juiste beslissing: passen of afmaken.</li><li>Verdediger: kies een aanvaller en forceer moeilijke pass.</li><li>Hoge intensiteit vereist.</li></ul>",
        variations: "Start met 4v3. Beperk aantal passen.",
        notes: "Perfect voor transitie en conditietraining.",
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
        SAMPLE_EXERCISES.forEach(ex => store.addExercise({...ex}, {silent: true}))
    } catch (_) {
        // no-op if store API differs
    }
}
