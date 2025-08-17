<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-8">
      <div class="text-3xl font-bold text-gray-800">Trainingen</div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="library bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm font-medium text-gray-700">Bibliotheek</div>
          <div class="text-sm text-gray-500">Sleep oefeningen naar rechts</div>
        </div>

        <div class="flex flex-col gap-3">
          <div v-for="ex in exercises" :key="ex.id" class="exercise-card cursor-move" draggable="true" @dragstart="onDragStart(ex)">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">📷</div>
              <div class="flex-1">
                <div class="font-bold text-gray-800">{{ex.name}}</div>
                <div class="text-sm text-gray-600">{{ex.short}}</div>
              </div>
              <div class="text-sm font-medium text-gray-700">{{ex.minutes}}m</div>
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
          <div class="text-sm font-medium text-gray-700">Totale tijd: {{totalMinutes}} min</div>
        </div>

        <draggable v-model="program" group="exercises" item-key="id" class="min-h-32">
          <template #item="{element, index}">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div class="flex-1 text-gray-800">{{index+1}}. {{element.name}}</div>
              <div class="text-sm font-medium text-gray-600 mr-3">{{element.minutes}}m</div>
              <button @click="removeAt(index)" class="text-red-500 hover:text-red-700 font-bold">×</button>
            </div>
          </template>
        </draggable>

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
import draggable from 'vuedraggable'
import { ref, computed } from 'vue'

export default {
  components:{draggable},
  setup(){
    const exercises = store.state.exercises
    const program = ref([])
    const programName = ref('Nieuwe training')

    function onDragStart(ex){
      // using HTML5 drag/drop is not strictly necessary with vuedraggable, but we keep it simple
    }

    function onAdd(evt){
      // when added from outside, evt.item is the element; ensure it's a shallow copy
      const added = evt.item.__draggable_context.element
      // make sure we don't keep reference to store element (so edits later don't affect library)
      const copy = { ...added }
      program.value.splice(evt.newIndex, 1, copy) // replace with copy
    }

    function removeAt(i){ program.value.splice(i,1) }

    const totalMinutes = computed(()=> program.value.reduce((s,e)=>s + (Number(e.minutes)||0), 0))

    function saveProgram(){
      alert(`Training "${programName.value}" opgeslagen met ${program.value.length} oefeningen (${totalMinutes.value} min)`)
    }

    return { exercises, program, programName, totalMinutes, removeAt, onDragStart, onAdd, saveProgram }
  }
}
</script>

<style scoped>
.form-input {
  @apply px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200;
}

.exercise-card {
  @apply bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200;
}
</style>