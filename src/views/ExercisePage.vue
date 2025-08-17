<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-8">
      <div class="text-3xl font-bold text-gray-800">Oefeningen</div>
      <div class="controls">
        <button class="btn-primary" @click="openForm()">+ Nieuwe oefening</button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input class="form-input" v-model="q" placeholder="Zoek oefeningen..." />
        <select v-model="filter.category" class="form-input">
          <option value="">Alle categorieën</option>
          <option v-for="c in categories" :key="c" :value="c">{{c}}</option>
        </select>
        <select v-model.number="filter.players" class="form-input">
          <option value="0">Aantal spelers</option>
          <option v-for="n in [1,2,3,4,5,6,7,8,9,10]" :key="n" :value="n">{{n}}</option>
        </select>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Intensiteit ≤</label>
          <input type="range" v-model.number="filter.intensity" min="1" max="5" class="flex-1" />
          <span class="text-sm font-medium text-gray-800 w-8">{{filter.intensity || '5'}}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

    <modal v-if="showForm" @close="closeForm">
      <exercise-form
          :initial="editItem"
          :categories="categories"
          @close="closeForm"
          @save="onSave"
      />
    </modal>
  </div>
</template>

<script>
import ExerciseCard from '../components/ExerciseCard.vue'
import ExerciseForm from '../components/ExerciseForm.vue'
import Modal from '../components/Modal.vue'
import store from '../store'
import { ref, computed } from 'vue'

export default {
  components: { ExerciseCard, ExerciseForm, Modal },
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

    // Sample data if empty
    if (store.state.exercises.length === 0) {
      store.addExercise({
        name: 'Spot shooting 45',
        short: 'Dribbel door 6 pylonen',
        full: 'Volledige uitleg...',
        category: 'Schieten',
        minPlayers: 2,       // minimum aantal spelers
        maxPlayers: 4,       // maximum aantal spelers
        intensity: 3,
        minutes: 5,
        images: [],
        video: ''
      })

      store.addExercise({
        name: '1v1 verdediging',
        short: '1 tegen 1 oefening',
        full: 'Volledige uitleg...',
        category: 'Verdedigen',
        minPlayers: 2,       // minimum aantal spelers
        maxPlayers: null,    // optioneel, geen max
        intensity: 4,
        minutes: 6,
        images: [],
        video: ''
      })
    }


    return { q, filter:filter.value, categories, filtered, openForm, showForm, editItem, closeForm, onSave, onDelete, onDuplicate, onToggleFav }
  }
}
</script>

<style scoped>

</style>