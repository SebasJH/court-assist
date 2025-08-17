<template>
  <div>
    <div class="header"><div class="title">Trainingen</div></div>

    <div class="training-shell">
      <div class="library">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div class="small">Bibliotheek</div>
          <div class="small">Sleep oefeningen naar rechts</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px">
          <div v-for="ex in exercises" :key="ex.id" class="card" draggable="true" @dragstart="onDragStart(ex)">
            <div style="width:48px;height:48px;border-radius:8px;background:#f3f6f8;display:flex;align-items:center;justify-content:center">📷</div>
            <div style="flex:1">
              <div style="font-weight:700">{{ex.name}}</div>
              <div class="small">{{ex.short}}</div>
            </div>
            <div class="small">{{ex.minutes}}m</div>
          </div>
        </div>
      </div>

      <div class="program">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div><strong>Training: </strong><input v-model="programName" placeholder="Naam training"/></div>
          <div class="duration">Totale tijd: {{totalMinutes}} min</div>
        </div>

        <draggable v-model="program" group="exercises" item-key="id" class="list" @add="onAdd">
          <template #item="{element, index}">
            <div class="row">
              <div style="flex:1">{{index+1}}. {{element.name}}</div>
              <div>{{element.minutes}}m</div>
              <button @click="removeAt(index)">x</button>
            </div>
          </template>
        </draggable>

        <div style="margin-top:10px;display:flex;gap:10px;align-items:center">
          <button class="btn" @click="saveProgram">Opslaan</button>
          <button @click="program.splice(0)">Leegmaken</button>
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