<template>
  <PageHeader title="Trainingen" />

  <div class="container mx-auto px-4 py-6">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="library bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm font-medium text-gray-700">Bibliotheek</div>
          <div class="text-sm text-gray-500">Sleep oefeningen naar rechts</div>
        </div>

        <div class="flex flex-col gap-3">
          <div v-for="ex in exercises" :key="ex.id" class="exercise-card cursor-move" draggable="true" @dragstart="onDragStart(ex, $event)">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">📷</div>
              <div class="flex-1">
                <div class="font-bold text-gray-800">{{ex.name}}</div>
                <div class="text-sm text-gray-600">{{ ex.description || ex.shortDescription }}</div>
              </div>
              <div class="text-sm font-medium text-gray-700">{{ex.duration}}m</div>
            </div>
          </div>
        </div>
      </div>

      <div class="program bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <strong class="text-gray-700">Training: </strong>
            <input v-model="programName" placeholder="Naam training" class="form-input w-48" />
          </div>
          <div class="text-sm font-medium text-gray-700">Totale tijd: {{totalDuration}} min</div>
        </div>

        <!-- Program list with HTML5 DnD drop support -->
        <div class="min-h-32" @dragover.prevent @drop="onDrop">
          <div v-for="(element, index) in program" :key="element.id" class="p-3 bg-gray-50 rounded-lg mb-2">
            <div class="flex items-center justify-between">
              <div class="flex-1 text-gray-800">{{index+1}}. {{element.name}}</div>
              <div class="text-sm font-medium text-gray-600 mr-3">{{element.duration}}m</div>
              <button @click="removeAt(index)" class="text-red-500 hover:text-red-700 font-bold">×</button>
            </div>
            <div class="mt-2 flex items-center gap-1.5 flex-wrap">
              <ExerciseBadge :exercise="element" kind="players" />
              <ExerciseBadge :exercise="element" kind="duration" />
              <ExerciseBadge :exercise="element" kind="court" />
              <ExerciseBadge :exercise="element" kind="intensity" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button class="btn-primary" @click="saveProgram">Opslaan</button>
          <button class="btn-secondary" @click="program.splice(0)">Leegmaken</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store'
import { ref, computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import ExerciseBadge from '../components/ExerciseBadge.vue'
import { ensureSampleExercises } from '../data/sampleExercises'
import { hasPlayers, formatPlayersFromExercise, hasDuration as hasDurationField, hasCourt as hasCourtField, formatCourtFromExercise } from '../utils/exerciseFormat'

export default {
  components: { PageHeader, ExerciseBadge },
  setup(){
    // Ensure sample data exists even if user lands here first
    ensureSampleExercises(store)
    const exercises = store.state.exercises
    const program = ref([])
    const programName = ref('Nieuwe training')

    const draggingId = ref(null)

    function onDragStart(ex, evt){
      draggingId.value = ex.id
      if (evt && evt.dataTransfer) {
        try { evt.dataTransfer.setData('text/plain', String(ex.id)) } catch(_) {}
      }
    }

    function onDrop(evt){
      let id = draggingId.value
      if (evt && evt.dataTransfer) {
        const data = evt.dataTransfer.getData('text/plain')
        if (data) id = Number(data)
      }
      const added = exercises.find(e => e.id === Number(id))
      if (!added) return
      const copy = { ...added }
      program.value.push(copy)
      draggingId.value = null
    }

    function removeAt(i){ program.value.splice(i,1) }

    const totalDuration = computed(()=> program.value.reduce((s,e)=>s + (Number(e.duration)||0), 0))

    function saveProgram(){
      alert(`Training "${programName.value}" opgeslagen met ${program.value.length} oefeningen (${totalDuration.value} min)`)
    }

    // Helpers for showing details per exercise in the program
    function isNum(v){ return typeof v === 'number' && !Number.isNaN(v) }
    function showPlayersFor(ex){
      if (!ex) return false
      return hasPlayers(ex.minPlayers, ex.maxPlayers)
    }
    function playersLabelFor(ex){
      if (!ex) return ''
      return formatPlayersFromExercise(ex, { variant: 'compact' })
    }
    function hasDurationFor(ex){
      return hasDurationField(ex?.duration)
    }
    function hasCourtFor(ex){
      return hasCourtField(ex?.court)
    }
    function courtLabelFor(ex){
      return formatCourtFromExercise(ex, { variant: 'compact' })
    }

    return { exercises, program, programName, totalDuration, removeAt, onDragStart, onDrop,
      showPlayersFor, playersLabelFor, hasDurationFor, hasCourtFor, courtLabelFor }
  }
}
</script>

<style scoped>

</style>