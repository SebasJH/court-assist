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
        <button
          class="inline-flex items-center gap-2 px-3 h-[42px] rounded-md border text-sm focus:outline-none"
          :class="filter.favorites ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'"
          @click="filter.favorites = !filter.favorites"
          :aria-pressed="filter.favorites ? 'true' : 'false'"
          title="Toon alleen favorieten"
        >
          <Star :class="filter.favorites ? 'w-4 h-4' : 'w-4 h-4'" :fill="filter.favorites ? 'currentColor' : 'none'" :stroke="'currentColor'" />
          <span>Favorieten</span>
        </button>
        <!-- View toggle -->
        <div class="inline-flex rounded-md overflow-hidden border border-gray-300">
          <button type="button" class="inline-flex items-center justify-center px-3 h-[42px] text-sm font-medium focus:outline-none" :class="viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'" @click="setViewMode('card')" :aria-pressed="viewMode === 'card' ? 'true' : 'false'" aria-label="Kaartweergave" title="Kaartweergave"><LayoutGrid class="w-4 h-4" /></button>
          <button type="button" class="inline-flex items-center justify-center px-3 h-[42px] text-sm font-medium border-l border-gray-300 focus:outline-none" :class="viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'" @click="setViewMode('list')" :aria-pressed="viewMode === 'list' ? 'true' : 'false'" aria-label="Lijstweergave" title="Lijstweergave"><List class="w-4 h-4" /></button>
        </div>
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
        :court="filter.court"
        @update:court="val => filter.court = val"
        :materials="filter.materials"
        @update:materials="val => filter.materials = val"
        :materialOptions="materialOptions"
      />
    </div>

    <!-- Cards or Empty state -->
    <template v-if="sorted.length > 0">
      <template v-if="viewMode === 'card'">
        <transition-group name="exercise-list" tag="div" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" :css="!pageSwitching">
          <exercise-card
              v-for="ex in pageItems"
              :key="ex.id"
              :exercise="ex"
              @edit="openForm(ex)"
              @delete="onDelete"
              @duplicate="onDuplicate"
              @toggle-fav="onToggleFav"
          />
        </transition-group>
      </template>
      <template v-else>
        <div class="bg-white rounded-lg shadow-md">
          <div class="overflow-x-auto overflow-y-visible" role="region" aria-label="Lijstweergave, horizontaal scrollen indien nodig">
            <div class="min-w-[48rem]">
              <div class="hidden md:flex items-center gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b bg-gray-50">
                <div class="w-12"></div>
                <div class="flex-1">Oefening</div>
                <div class="w-28">Spelers</div>
                <div class="w-28">Duur</div>
                <div class="w-28">Veld</div>
                <div class="w-28">Intensiteit</div>
                <div class="w-20"></div>
              </div>
              <div>
                <ExerciseListItem
                  v-for="ex in pageItems"
                  :key="ex.id"
                  :exercise="ex"
                  @edit="openForm(ex)"
                  @delete="onDelete"
                  @duplicate="onDuplicate"
                  @toggle-fav="onToggleFav"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <Pagination
        v-if="pageCount > 1"
        class="mt-6"
        :page="page"
        :pageCount="pageCount"
        @update:page="setPage"
      />
    </template>
    <div v-else class="py-20">
      <div class="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center max-w-xl mx-auto">
        <div class="text-lg font-semibold text-gray-800 mb-2">
          {{ hasAny ? 'Er zijn geen oefeningen gevonden met dit filter' : 'Er zijn momenteel geen oefeningen' }}
        </div>
        <div class="text-sm text-gray-600 mb-6" v-if="hasAny && isFilterActive">
          Pas je zoekopdracht of filters aan, of verwijder de filters.
        </div>
        <div class="flex justify-center gap-3">
          <button
            v-if="hasAny && isFilterActive"
            class="btn-secondary"
            @click="resetFilters"
          >Verwijder filters</button>
          <button
            v-else
            class="btn-primary"
            @click="openForm()"
          >Maak een oefening aan</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <modal v-if="showForm" @close="closeForm">
      <exercise-form
          :initial="editItem"
          :categories="categories"
          @close="closeForm"
          @save="onSave"
      />
    </modal>

    <!-- Delete confirm modal -->
    <modal v-if="showDeleteModal" @close="cancelDelete">
      <DeleteConfirm :name="deleteName" @cancel="cancelDelete" @confirm="confirmDelete" />
    </modal>
  </div>
</template>

<script>
import ExerciseCard from '../components/ExerciseCard.vue'
import ExerciseListItem from '../components/ExerciseListItem.vue'
import ExerciseForm from '../components/ExerciseForm.vue'
import Modal from '../components/Modal.vue'
import PageHeader from '../components/PageHeader.vue'
import FiltersBar from '../components/FiltersBar.vue'
import SortButton from '../components/SortButton.vue'
import DeleteConfirm from '../components/DeleteConfirm.vue'
import Pagination from '../components/Pagination.vue'
import { EXERCISE_CATEGORIES, EXERCISE_MATERIALS, normalizeCourt } from '../constants'
import store from '../store'
import { ref, computed, watch, nextTick } from 'vue'
import { ensureSampleExercises } from '../data/sampleExercises'

export default {
  components: { ExerciseCard, ExerciseListItem, ExerciseForm, Modal, PageHeader, FiltersBar, SortButton, DeleteConfirm, Pagination },
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
      favorites: false,
      court: [],
      materials: []
    })
    const showForm = ref(false)
    const editItem = ref(null)
    const showFilters = ref(false)
    const showDeleteModal = ref(false)

    // View mode: 'card' (default) or 'list', persisted in localStorage
    const viewMode = ref((() => {
      try { return localStorage.getItem('exerciseView') === 'list' ? 'list' : 'card' } catch(_) { return 'card' }
    })())
    function setViewMode(mode){
      if (mode !== 'card' && mode !== 'list') return
      viewMode.value = mode
      try { localStorage.setItem('exerciseView', mode) } catch(_) {}
    }
    const pendingDeleteId = ref(null)
    const deleteName = computed(() => {
      const id = pendingDeleteId.value
      const e = store.state.exercises.find(x => x.id === id)
      return e ? e.name : ''
    })

    const categories = EXERCISE_CATEGORIES
    const materialOptions = EXERCISE_MATERIALS

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

    function onDelete(id) {
      pendingDeleteId.value = id
      showDeleteModal.value = true
    }
    function cancelDelete() {
      pendingDeleteId.value = null
      showDeleteModal.value = false
    }
    function confirmDelete() {
      const id = pendingDeleteId.value
      if (id != null) {
        store.deleteExercise(id)
      }
      pendingDeleteId.value = null
      showDeleteModal.value = false
    }
    function onDuplicate(id) {
      store.duplicateExercise(id)
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
      const selFav = !!filter.value.favorites
      const selCourts = Array.isArray(filter.value.court)
        ? filter.value.court.map(c => normalizeCourt(c)).filter(Boolean)
        : []
      const selMaterials = Array.isArray(filter.value.materials) ? filter.value.materials : []

      return store.state.exercises.filter(e => {
        // zoek op titel en beschrijving (geen fallback naar shortDescription)
        const searchable = `${e.name ?? ''} ${e.description ?? ''}`.toLowerCase()
        if (q.value && !searchable.includes(q.value.toLowerCase()))
          return false

        // favorieten
        if (selFav && !e.favorite) return false

        // categorie (nu array)
        if (filter.value.category && !e.category.includes(filter.value.category)) return false

        // court type (checkboxes allow selecting one or both). If none selected, don't filter.
        if (selCourts.length > 0) {
          const ec = normalizeCourt(e.court)
          // If both options are selected, include all (also those with empty court)
          if (selCourts.length === 1) {
            if (!selCourts.includes(ec)) return false
          }
        }

        // materialen (vereist alle geselecteerde materialen aanwezig)
        if (selMaterials.length > 0) {
          const em = Array.isArray(e.materials) ? e.materials : []
          for (const m of selMaterials) {
            if (!em.includes(m)) return false
          }
        }

        // aantal spelers (range overlap)
        if (!playersOverlap(e, selPlayersMin, selPlayersMax)) return false

        // intensiteit binnen bereik (oefeningen zonder intensiteit blijven zichtbaar)
        const intensityVal = typeof e.intensity === 'number' ? e.intensity : null
        if (intensityVal !== null) {
          if (intensityVal < selIntMin || intensityVal > selIntMax) return false
        }

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

    // Pagination (page size = 2 for testing)
    const pageSize = 6
    const pageSwitching = ref(false)
    const page = ref(1)
    const pageCount = computed(() => {
      const total = sorted.value.length
      return Math.max(1, Math.ceil(total / pageSize))
    })
    const pageItems = computed(() => {
      const start = (page.value - 1) * pageSize
      const end = start + pageSize
      return sorted.value.slice(start, end)
    })

    function setPage(p) {
      const pc = pageCount.value
      const np = Math.max(1, Math.min(pc, Number(p) || 1))
      if (np === page.value) return
      pageSwitching.value = true
      page.value = np
      nextTick(() => {
        // ensure DOM has swapped items before re-enabling transitions
        setTimeout(() => { pageSwitching.value = false }, 0)
      })
    }
    function goPrev() { setPage(page.value - 1) }
    function goNext() { setPage(page.value + 1) }

    // Reset to first page when query, filters or sorting change
    watch([q, sortBy, sortDir], () => { page.value = 1 })
    watch(filter, () => { page.value = 1 }, { deep: true })

    // Clamp current page when the sorted results length changes (e.g., delete/filter)
    watch(sorted, () => {
      if (page.value > pageCount.value) page.value = pageCount.value
      if (sorted.value.length === 0) page.value = 1
    })

    // Empty-state helpers
    const hasAny = computed(() => Array.isArray(store.state.exercises) && store.state.exercises.length > 0)

    const DEFAULT_PLAYERS = [1, 20]
    const DEFAULT_INTENSITY = [1, 5]

    const isFilterActive = computed(() => {
      const f = filter.value
      const playersActive = f.players[0] !== DEFAULT_PLAYERS[0] || f.players[1] !== DEFAULT_PLAYERS[1]
      const intensityActive = f.intensity[0] !== DEFAULT_INTENSITY[0] || f.intensity[1] !== DEFAULT_INTENSITY[1]
      const favoritesActive = !!f.favorites
      const courtActive = Array.isArray(f.court) && f.court.length > 0
      const materialsActive = Array.isArray(f.materials) && f.materials.length > 0
      return (q.value && q.value.trim().length > 0) || (f.category && f.category.length > 0) || playersActive || intensityActive || favoritesActive || courtActive || materialsActive
    })

    function resetFilters() {
      q.value = ''
      filter.value = {
        category: '',
        players: [...DEFAULT_PLAYERS],
        intensity: [...DEFAULT_INTENSITY],
        favorites: false,
        court: [],
        materials: []
      }
    }

    // Sample data als store leeg is (categorieën als array) — verplaatst naar aparte module
    ensureSampleExercises(store)

    return {
      q,
      filter,
      categories,
      materialOptions,
      filtered,
      sorted,
      hasAny,
      isFilterActive,
      resetFilters,
      // pagination
      page,
      pageCount,
      pageItems,
      pageSwitching,
      setPage,
      goPrev,
      goNext,
      // sort UI
      sortBy,
      sortDir,
      // view mode
      viewMode,
      setViewMode,
      openForm,
      showForm,
      editItem,
      closeForm,
      onSave,
      onDelete,
      onDuplicate,
      onToggleFav,
      showFilters,
      // delete modal
      showDeleteModal,
      deleteName,
      cancelDelete,
      confirmDelete
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
