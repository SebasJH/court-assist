<template>
  <PageHeader title="Oefeningen">
      <template #actions>
        <button class="btn-primary" @click="openForm()">+ Nieuwe oefening</button>
      </template>
    </PageHeader>

    <div class="container mx-auto px-4 py-6">

    <!-- Top controls: Filter toggle, Sort button, Search -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-end items-end">
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 px-3 h-[42px] rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm text-gray-800 focus:outline-none"
          :aria-pressed="showFilters ? 'true' : 'false'"
          @click="showFilters = !showFilters"
        >
          <Filter class="w-4 h-4" />
          <span>Filters</span>
        </button>
        <SortButton :sortBy="sortBy" :sortDir="sortDir" @update:sortBy="val => sortBy = val" @update:sortDir="val => sortDir = val" />
      </div>
      <div>
        <div class="relative">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            class="form-input w-64 md:w-72 !pl-9 pr-3"
            :value="q"
            @input="q = $event.target.value"
            placeholder="Zoek oefeningen..."
            aria-label="Zoek oefeningen"
          />
        </div>
      </div>
    </div>

    <!-- Filters bar (collapsible with animation without display:none) -->
    <div class="filters-collapsible" :class="{ 'is-open': showFilters }" :aria-hidden="!showFilters">
      <FiltersBar
        :categories="categories"
        :category="filter.category"
        @update:category="val => filter.category = val"
        :players="filter.players"
        @update:players="val => filter.players = val"
        :intensity="filter.intensity"
        @update:intensity="val => filter.intensity = val"
      />
    </div>

    <!-- Cards -->
    <transition-group name="exercise-list" tag="div" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <exercise-card
          v-for="ex in sorted"
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
import PageHeader from '../components/PageHeader.vue'
import FiltersBar from '../components/FiltersBar.vue'
import SortButton from '../components/SortButton.vue'
import store from '../store'
import { ref, computed } from 'vue'

export default {
  components: { ExerciseCard, ExerciseForm, Modal, PageHeader, FiltersBar, SortButton },
  setup() {
    // Sort state
    const sortBy = ref('dateCreated') // 'dateCreated' | 'name'
    const sortDir = ref('desc') // 'asc' | 'desc'
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
    const showFilters = ref(false)

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
      store.notify('Oefening opgeslagen', 'success', 2500)
    }

    function onDelete(id) {
      if (confirm('Weet je het zeker?')) {
        store.deleteExercise(id)
        store.notify('Oefening succesvol verwijderd', 'error', 2500)
      }
    }
    function onDuplicate(id) {
      store.duplicateExercise(id)
      store.notify('Oefening gedupliceerd', 'success', 2500)
    }
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

    const sorted = computed(() => {
      const arr = filtered.value.slice()
      const by = sortBy.value
      const dir = sortDir.value
      const m = dir === 'asc' ? 1 : -1
      return arr.sort((a, b) => {
        if (by === 'name') {
          const an = (a.name || '').toString().toLowerCase()
          const bn = (b.name || '').toString().toLowerCase()
          const cmp = an.localeCompare(bn, 'nl', { sensitivity: 'base' })
          if (cmp !== 0) return cmp * m
          return ((a.id||0) - (b.id||0)) * m
        } else { // dateCreated
          const ad = new Date(a.dateCreated || 0).getTime() || 0
          const bd = new Date(b.dateCreated || 0).getTime() || 0
          if (ad === bd) return ((a.id||0) - (b.id||0)) * m
          return (ad - bd) * m
        }
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
      sorted,
      // sort UI
      sortBy,
      sortDir,
      openForm,
      showForm,
      editItem,
      closeForm,
      onSave,
      onDelete,
      onDuplicate,
      onToggleFav,
      showFilters
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
.filters-collapsible { overflow: hidden; max-height: 0; opacity: 0; transform: translateY(-4px); transition: max-height 220ms ease, opacity 220ms ease, transform 220ms ease; }
.filters-collapsible.is-open { max-height: 1000px; opacity: 1; transform: translateY(0); }
</style>
