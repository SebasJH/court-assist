import { reactive, computed } from 'vue'

const state = reactive({
    exercises: [],
    nextId: 1
})

function addExercise(payload) {
    const icon = payload.icon ?? payload.imageIcon ?? 'TrafficCone'
    const { imageIcon, ...rest } = payload
    const e = { id: state.nextId++, favorite: false, icon, ...rest }
    state.exercises.unshift(e)
    return e
}

function updateExercise(id, updates) {
    const e = state.exercises.find(x => x.id === id)
    if (!e) return
    
    // Map legacy imageIcon to icon if provided
    const mapped = { ...updates }
    if (mapped.imageIcon && !mapped.icon) {
        mapped.icon = mapped.imageIcon
    }
    delete mapped.imageIcon
    
    // Behoud de favorite status en id, en update alleen de gewenste velden
    const { favorite, id: updateId, ...updateData } = mapped
    
    // Sla de originele id op
    const originalId = e.id
    
    // Update alleen de gewenste velden, niet de id
    Object.assign(e, updateData)
    
    // Herstel de originele id als deze is overschreven
    if (e.id !== originalId) {
        e.id = originalId
    }
    
    // Controleer of de favorite status is behouden
    if (e.favorite === undefined) {
        e.favorite = false
    }
}


function deleteExercise(id) {
    const idx = state.exercises.findIndex(x => x.id === id)
    if (idx !== -1) state.exercises.splice(idx, 1)
}

function duplicateExercise(id) {
    const orig = state.exercises.find(x => x.id === id)
    if (!orig) return
    const copy = { ...orig, id: state.nextId++, name: orig.name + ' (copy)', favorite: false }
    state.exercises.unshift(copy)
}

function toggleFavorite(id) {
    const e = state.exercises.find(x => x.id === id)
    if (e) e.favorite = !e.favorite
}

export default {
    state,
    addExercise,
    updateExercise,
    deleteExercise,
    duplicateExercise,
    toggleFavorite
}