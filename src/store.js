import { reactive, computed } from 'vue'

const state = reactive({
    exercises: [],
    trainings: [],
    nextId: 1,
    nextTrainingId: 1,
    notifications: []
})

// Migration: backfill dateCreated for existing exercises without it
// This ensures previously created exercises (before dateCreated was introduced) get a timestamp
state.exercises.forEach(e => {
    if (!e.dateCreated) e.dateCreated = new Date().toISOString()
})

function addExercise(payload, options = {}) {
    const icon = payload.icon ?? payload.imageIcon ?? 'TrafficCone'
    const { imageIcon, dateCreated, ...rest } = payload
    const e = { id: state.nextId++, favorite: false, icon, dateCreated: dateCreated ?? new Date().toISOString(), ...rest }
    state.exercises.unshift(e)
    if (!options.silent) notify('Oefening aangemaakt', 'success', 2500)
    return e
}

function updateExercise(id, updates, options = {}) {
    const e = state.exercises.find(x => x.id === id)
    if (!e) return
    
    // Map legacy imageIcon to icon if provided
    const mapped = { ...updates }
    if (mapped.imageIcon && !mapped.icon) {
        mapped.icon = mapped.imageIcon
    }
    delete mapped.imageIcon
    
    // Behoud de favorite status en id, en update alleen de gewenste velden
    const { favorite, id: updateId, dateCreated: _ignoredDate, ...updateData } = mapped
    
    // Sla de originele id op
    const originalId = e.id
    
    // Update alleen de gewenste velden, niet de id en niet dateCreated
    Object.assign(e, updateData)
    
    // Herstel de originele id als deze is overschreven
    if (e.id !== originalId) {
        e.id = originalId
    }
    
    // Controleer of de favorite status is behouden
    if (e.favorite === undefined) {
        e.favorite = false
    }
    if (!options.silent) notify('Oefening opgeslagen', 'success', 2500)
}


function deleteExercise(id, options = {}) {
    const idx = state.exercises.findIndex(x => x.id === id)
    if (idx !== -1) state.exercises.splice(idx, 1)
    if (!options.silent) notify('Oefening verwijderd', 'error', 2500)
}

function duplicateExercise(id, options = {}) {
    const orig = state.exercises.find(x => x.id === id)
    if (!orig) return
    const copy = { ...orig, id: state.nextId++, name: orig.name + ' (kopie)', favorite: false, dateCreated: new Date().toISOString() }
    state.exercises.unshift(copy)
    if (!options.silent) notify('Oefening gedupliceerd', 'info', 2500)
}

function duplicateTraining(id, options = {}) {
    const orig = state.trainings.find(x => x.id === id)
    if (!orig) return
    const copy = { ...orig, id: state.nextTrainingId++, name: (orig.name || 'Training') + ' (kopie)', favorite: false, dateCreated: new Date().toISOString() }
    state.trainings.unshift(copy)
    if (!options.silent) notify('Training gedupliceerd', 'info', 2500)
}

function toggleFavorite(id) {
    const e = state.exercises.find(x => x.id === id)
    if (e) e.favorite = !e.favorite
}

function removeNotification(id) {
    const idx = state.notifications.findIndex(n => n.id === id)
    if (idx !== -1) state.notifications.splice(idx, 1)
}

function notify(message, type = 'success', timeout = 2500) {
    const id = Math.round(Date.now() + Math.random() * 1000)
    const n = { id, message, type }
    state.notifications.push(n)
    if (timeout && timeout > 0) {
        setTimeout(() => removeNotification(id), timeout)
    }
    return id
}

// Trainings CRUD
function addTraining(payload, options = {}) {
    const { dateCreated, ...rest } = payload || {}
    const favorite = typeof rest.favorite === 'boolean' ? rest.favorite : false
    const t = { id: state.nextTrainingId++, favorite, dateCreated: dateCreated ?? new Date().toISOString(), ...rest }
    state.trainings.unshift(t)
    if (!options.silent) notify('Training aangemaakt', 'success', 2500)
    return t
}
function updateTraining(id, updates, options = {}) {
    const t = state.trainings.find(x => x.id === id)
    if (!t) return
    const { id: _ignore, dateCreated: _ignoredDate, ...rest } = updates || {}
    const originalId = t.id
    Object.assign(t, rest)
    if (t.id !== originalId) t.id = originalId
    if (!options.silent) notify('Training opgeslagen', 'success', 2500)
}
function deleteTraining(id, options = {}) {
    const idx = state.trainings.findIndex(x => x.id === id)
    if (idx !== -1) state.trainings.splice(idx, 1)
    if (!options.silent) notify('Training verwijderd', 'error', 2500)
}

function toggleTrainingFavorite(id) {
    const t = state.trainings.find(x => x.id === id)
    if (t) t.favorite = !t.favorite
}

export default {
    state,
    addExercise,
    updateExercise,
    deleteExercise,
    duplicateExercise,
    toggleFavorite,
    addTraining,
    updateTraining,
    deleteTraining,
    duplicateTraining,
    toggleTrainingFavorite,
    notify,
    removeNotification
}