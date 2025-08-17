<template>
  <div>
    <div class="header">
      <div class="title">Oefeningen</div>
      <div class="controls">
        <button class="btn" @click="openForm()">+ Nieuwe oefening</button>
      </div>
    </div>

    <div class="filter-bar">
      <input class="search" v-model="q" placeholder="Zoek oefeningen..." />
      <select v-model="filter.category">
        <option value="">Alle categorieën</option>
        <option v-for="c in categories" :key="c" :value="c">{{c}}</option>
      </select>
      <select v-model.number="filter.players">
        <option value="0">Aantal spelers</option>
        <option v-for="n in [1,2,3,4,5,6,7,8,9,10]" :key="n" :value="n">{{n}}</option>
      </select>
      <label class="small">Intensiteit <=
        <input type="range" v-model.number="filter.intensity" min="1" max="5" />
        {{filter.intensity || '5'}}
      </label>
    </div>

    <div class="grid">
      <exercise-card
          v-for="ex in filtered"
          :key="ex.id"
          :exercise="ex"
          @edit="openForm(ex)"
          @delete="onDelete"
          @duplicate="onDuplicate"
          @toggle-fav="onToggleFav"
      />
    </div>

    <exercise-form v-if="showForm" :initial="editItem" @close="closeForm" @save="onSave" />
  </div>
</template>

<script>
import ExerciseCard from '../components/ExerciseCard.vue'
import ExerciseForm from '../components/ExerciseForm.vue'
import store from '../store'
import { ref, computed } from 'vue'

export default {
  components: { ExerciseCard, ExerciseForm },
  setup() {
    const q = ref('')
    const filter = ref({ category: '', players: 0, intensity: 5 })
    const showForm = ref(false)
    const editItem = ref(null)

    const categories = ['Dribbelen','Schieten','Finishing','Verdedigen','Passen']

    function openForm(item=null){ editItem.value = item; showForm.value = true }
    function closeForm(){ editItem.value = null; showForm.value = false }

    function onSave(payload){
      if (payload.id) store.updateExercise(payload.id, payload)
      else store.addExercise(payload)
      closeForm()
    }

    function onDelete(id){ if (confirm('Weet je het zeker?')) store.deleteExercise(id) }
    function onDuplicate(id){ store.duplicateExercise(id) }
    function onToggleFav(id){ store.toggleFavorite(id) }

    const filtered = computed(()=>{
      return store.state.exercises.filter(e=>{
        if (q.value && !(`${e.name} ${e.short}`.toLowerCase()).includes(q.value.toLowerCase())) return false
        if (filter.value.category && e.category !== filter.value.category) return false
        if (filter.value.players && e.players !== filter.value.players) return false
        if (filter.value.intensity && e.intensity > filter.value.intensity) return false
        return true
      })
    })

    // seed some sample data if empty
    if (store.state.exercises.length===0){
      store.addExercise({ name:'Spot shooting 45', short:'Dribbel door 6 pylonen', full:'Volledige uitleg...','category':'Schieten', players:4, intensity:3, minutes:5, images:[], video:'' })
      store.addExercise({ name:'1v1 verdediging', short:'1 tegen 1 oefening', full:'Volledige uitleg...','category':'Verdedigen', players:2, intensity:4, minutes:6, images:[], video:'' })
    }

    return { q, filter:filter.value, categories, filtered, openForm, showForm, editItem, closeForm, onSave, onDelete, onDuplicate, onToggleFav }
  }
}
</script>