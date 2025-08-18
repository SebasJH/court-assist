<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-8">
      <div class="text-3xl font-bold text-gray-800">Oefeningen</div>
      <div class="controls">
        <button class="btn-primary" @click="openForm()">+ Nieuwe oefening</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input class="form-input" v-model="q" placeholder="Zoek oefeningen..." />

        <select v-model="filter.category" class="form-input">
          <option value="">Alle categorieën</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>

        <!-- Aantal spelers slider -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600">Aantal spelers</label>
          <Slider
              v-model="filter.players"
              :min="1"
              :max="20"
              :step="1"
              :lazy="true"
              :merge="false"
          />
          <div class="text-sm text-gray-800">
            van {{ filter.players[0] }} tot {{ filter.players[1] }}
          </div>
        </div>

        <!-- Intensiteit slider -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600">Intensiteit</label>
          <Slider
              v-model="filter.intensity"
              :min="1"
              :max="5"
              :step="1"
              :lazy="true"
              :merge="false"
          />
          <div class="text-sm text-gray-800">
            van {{ filter.intensity[0] }} tot {{ filter.intensity[1] }}
          </div>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <transition-group name="exercise-list" tag="div" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <exercise-card
          v-for="ex in filtered"
          :key="ex.id"
          :exercise="ex"
          @edit="openForm(ex)"
          @delete="onDelete"
          @duplicate="onDuplicate"
          @toggle-fav="onToggleFav"
      />
    </transition-group>

    <!-- Modal -->
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
    // Backfill dateCreated for any pre-existing exercises missing it (defensive, non-destructive)
    store.state.exercises.forEach(e => { if (!e.dateCreated) e.dateCreated = new Date().toISOString() })
    const q = ref('')
    const filter = ref({
      category: '',
      players: [1, 20],
      intensity: [1, 5],
    })
    const showForm = ref(false)
    const editItem = ref(null)

    const categories = ['Dribbelen', 'Schieten', 'Finishing', 'Verdedigen', 'Passen', 'Rebounden', 'Transition', 'Conditie', 'Warm up']

    function openForm(item = null) {
      editItem.value = item
      showForm.value = true
    }
    function closeForm() {
      editItem.value = null
      showForm.value = false
    }

    function onSave(payload) {
      if (payload.id) {
        store.updateExercise(payload.id, payload)
      } else {
        store.addExercise(payload)
      }
      closeForm()
    }

    function onDelete(id) { if (confirm('Weet je het zeker?')) store.deleteExercise(id) }
    function onDuplicate(id) { store.duplicateExercise(id) }
    function onToggleFav(id) { store.toggleFavorite(id) }

    // Helper: kijkt of spelers-bereiken overlappen (houdt rekening met maxPlayers = null)
    function playersOverlap(ex, selMin, selMax) {
      const itemMin = typeof ex.minPlayers === 'number' ? ex.minPlayers : 1
      const itemMax = typeof ex.maxPlayers === 'number' ? ex.maxPlayers : Infinity
      return itemMin <= selMax && itemMax >= selMin
    }

    const filtered = computed(() => {
      const selPlayersMin = filter.value.players[0]
      const selPlayersMax = filter.value.players[1]
      const selIntMin = filter.value.intensity[0]
      const selIntMax = filter.value.intensity[1]

      return store.state.exercises.filter(e => {
        // zoek op naam/beschrijving (met fallback voor oude data)
        const searchable = `${e.name ?? ''} ${e.description ?? e.shortDescription ?? ''}`.toLowerCase()
        if (q.value && !searchable.includes(q.value.toLowerCase()))
          return false

        // categorie (nu array)
        if (filter.value.category && !e.category.includes(filter.value.category)) return false

        // aantal spelers (range overlap)
        if (!playersOverlap(e, selPlayersMin, selPlayersMax)) return false

        // intensiteit binnen bereik
        const intensity = typeof e.intensity === 'number' ? e.intensity : 0
        if (intensity < selIntMin || intensity > selIntMax) return false

        return true
      })
    })

    // Sample data als store leeg is (category als array)
    if (store.state.exercises.length === 0) {
      store.addExercise({
        name: 'Spot shooting 45',
        icon: 'Target',
        description: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
        coachingPoints: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
        category: ['Schieten'],
        minPlayers: 4,
        maxPlayers: 10,
        duration: 5,
        intensity: 2,
        materials: [],
        video: '',
        dateCreated: '2025-08-16T20:00:00.000Z',
        favorite: true
      })
      store.addExercise({
        name: '1v1 verdediging',
        icon: 'Shield',
        description: '1 tegen 1 oefening waarbij de aanvaller probeert te scoren en de verdediger probeert te voorkomen dat er wordt gescoord.',
        coachingPoints: '1 tegen 1 oefening waarbij de aanvaller probeert te scoren en de verdediger probeert te voorkomen dat er wordt gescoord.',
        category: ['Verdedigen', 'Conditie'],
        minPlayers: 2,
        maxPlayers: null,
        duration: 8,
        intensity: 4,
        materials: [],
        video: '',
        dateCreated: '2025-08-16T21:00:00.000Z',
        favorite: false
      })
      store.addExercise({
        name: 'Sheridan Drill',
        icon: 'Gauge',
        description: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
        coachingPoints: 'Dribbel door 6 pylonen en schiet daarna op de basket vanaf 45 graden.',
        category: ['Conditie', 'Warm up'],
        minPlayers: 8,
        maxPlayers: 15,
        duration: 10,
        intensity: 4,
        materials: [],
        video: '',
        dateCreated: '2025-08-16T22:00:00.000Z',
        favorite: false
      })
    }

    return {
      q,
      filter,
      categories,
      filtered,
      openForm,
      showForm,
      editItem,
      closeForm,
      onSave,
      onDelete,
      onDuplicate,
      onToggleFav
    }
  }
}
</script>

<style scoped>
/* Smooth movement for reordering and insertion */
.exercise-list-move {
  transition: transform 220ms ease, opacity 220ms ease;
}
/* Enter animation for new items */
.exercise-list-enter-active {
  transition: transform 220ms ease, opacity 220ms ease;
}
.exercise-list-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
.exercise-list-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
/* Optional leave animation (e.g., on delete) */
.exercise-list-leave-active {
  transition: transform 180ms ease, opacity 180ms ease;
  position: absolute; /* avoid layout gap during leave */
}
.exercise-list-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.exercise-list-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
