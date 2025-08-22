<template>
  <PageHeader title="Oefeningen">
      <template #actions>
        <UiButton class="hidden md:inline-flex" color="primary" icon="Plus" @click="openForm()">Nieuwe oefening</UiButton>
      </template>
    </PageHeader>

    <div class="container mx-auto px-4 py-6">

    <!-- Top controls component -->
    <ExercisesTopControls
      :q="q"
      :favorites="filter.favorites"
      :showFilters="showFilters"
      :sortBy="sortBy"
      :sortDir="sortDir"
      :viewMode="viewMode"
      @update:q="val => q = val"
      @update:favorites="val => filter.favorites = val"
      @toggle-filters="showFilters = !showFilters"
      @update:sortBy="val => sortBy = val"
      @update:sortDir="val => sortDir = val"
      @update:viewMode="setViewMode"
    />

    <!-- Filters drawer (right side panel with overlay) -->
    <modal :open="showFilters" @close="showFilters = false" :drawer="true" side="right" drawerWidthClass="max-w-lg" contentPaddingClass="p-0">
      <div class="flex h-full flex-col">
        <div class="px-10 pt-5 pb-4 border-b">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Filter class="w-5 h-5 text-gray-700" />
              <h2 id="filters-title" class="text-lg font-semibold text-gray-800">Filters</h2>
            </div>
          </div>
        </div>
        <div class="px-10 py-8 flex-1 overflow-y-auto">
          <FiltersPanel
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
        <div class="px-5 py-4 border-t flex items-center justify-end gap-2">
          <UiButton color="secondary" @click="resetFilters">Alles wissen</UiButton>
          <UiButton color="primary" @click="showFilters = false">Toepassen</UiButton>
        </div>
      </div>
    </modal>

    <!-- Active filter chips -->
    <FiltersChips
      v-if="isFilterActive"
      class="mb-4 flex flex-wrap gap-2 items-center"
      :q="q"
      :category="filter.category"
      :players="filter.players"
      :intensity="filter.intensity"
      :court="filter.court"
      :materials="filter.materials"
      :favorites="filter.favorites"
      :defaultPlayers="DEFAULT_PLAYERS"
      :defaultIntensity="DEFAULT_INTENSITY"
      @clear:search="clearSearch"
      @clear:category="clearCategory"
      @clear:players="clearPlayers"
      @clear:intensity="clearIntensity"
      @clear:court="clearCourt"
      @clear:material="clearMaterial"
      @clear:favorites="clearFavorites"
      @reset="resetFilters"
    />

    <!-- Cards or Empty state -->
    <template v-if="sorted.length > 0">
      <template v-if="viewMode === 'card'">
        <transition-group name="exercise-list" tag="div" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6" :css="!pageSwitching">
          <ExerciseCardItem
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
          <div class="overflow-x-hidden lg:overflow-x-auto overflow-y-visible" role="region" aria-label="Lijstweergave, horizontaal scrollen indien nodig">
            <div class="lg:min-w-[48rem]">
              <div class="hidden lg:flex items-center gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b bg-gray-0">
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
          <UiButton
            v-if="hasAny && isFilterActive"
            color="secondary"
            @click="resetFilters"
          >Verwijder filters</UiButton>
          <UiButton
            v-else
            color="primary"
            @click="openForm()"
          >Maak een oefening aan</UiButton>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <modal :open="showForm" @close="closeForm" contentPaddingClass="p-0">
      <exercise-form
          :key="formKey"
          :initial="editItem"
          :categories="categories"
          @close="closeForm"
          @save="onSave"
      />
    </modal>

    <!-- Delete confirm modal -->
    <modal :open="showDeleteModal" @close="cancelDelete">
      <DeleteConfirm :name="deleteName" @cancel="cancelDelete" @confirm="confirmDelete" />
    </modal>
  </div>

  <!-- Mobile FAB: create exercise -->
  <UiButton
    :class="['md:hidden fixed safe-bottom-5 right-5 z-[3000] !p-0 w-14 h-14 shadow-xl', 'transition-opacity duration-300', { 'opacity-0 pointer-events-none': fabHidden }]"
    color="primary"
    icon="Plus"
    iconClass="w-7 h-7"
    aria-label="Nieuwe oefening"
    title="Nieuwe oefening"
    @click="openForm()"
  />

</template>

<script>
import ExerciseCardItem from '../components/exercise/ExerciseCardItem.vue'
import ExerciseListItem from '../components/exercise/ExerciseListItem.vue'
import ExerciseForm from '../components/exercise/ExerciseForm.vue'
import Modal from '../components/Modal.vue'
import PageHeader from '../components/PageHeader.vue'
import FiltersPanel from '../components/FiltersPanel.vue'
import ExercisesTopControls from '../components/exercise/ExercisesTopControls.vue'
import DeleteConfirm from '../components/DeleteConfirm.vue'
import Pagination from '../components/Pagination.vue'
import FiltersChips from '../components/FiltersChips.vue'
import { EXERCISE_CATEGORIES, EXERCISE_MATERIALS, normalizeCourt } from '../constants'
import store from '../store'
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { ensureSampleExercises } from '../data/sampleExercises'
import UiButton from '../components/ui/Button.vue'

export default {
  components: { ExerciseCardItem, ExerciseListItem, ExerciseForm, Modal, PageHeader, FiltersPanel, ExercisesTopControls, DeleteConfirm, Pagination, FiltersChips, UiButton },
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
    const formKey = ref(0)
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
      formKey.value++
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

    // Pagination
    const pageSize = 12
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


    // Chip clear helpers
    function clearSearch(){ q.value = '' }
    function clearCategory(){ filter.value.category = '' }
    function clearPlayers(){ filter.value.players = [1, 20] }
    function clearIntensity(){ filter.value.intensity = [1, 5] }
    function clearCourt(kind){
      const arr = Array.isArray(filter.value.court) ? filter.value.court.slice() : []
      filter.value.court = arr.filter(v => v !== kind)
    }
    function clearMaterial(m){
      const arr = Array.isArray(filter.value.materials) ? filter.value.materials.slice() : []
      filter.value.materials = arr.filter(v => v !== m)
    }
    function clearFavorites(){ filter.value.favorites = false }

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

    // Mobile FAB visibility control on scroll (hide on scroll down, show on scroll up or after 2s idle)
    const fabHidden = ref(false)
    const scrollEl = ref(null)
    const lastScrollY = ref(0)
    let idleTimer = null
    let scrollTarget = null
    const IDLE_SHOW_MS = 1200
    const DELTA_THRESHOLD = 3

    function getScrollY() {
      if (scrollEl.value && scrollEl.value !== window) {
        return scrollEl.value.scrollTop || 0
      }
      return window.pageYOffset || document.documentElement.scrollTop || 0
    }

    function scheduleShowOnIdle() {
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
      idleTimer = setTimeout(() => { fabHidden.value = false; idleTimer = null }, IDLE_SHOW_MS)
    }

    function onScrollFab() {
      const y = getScrollY()
      const delta = y - lastScrollY.value
      if (Math.abs(delta) >= DELTA_THRESHOLD) {
        if (delta > 0) {
          // Scrolling down -> hide
          fabHidden.value = true
        } else if (delta < 0) {
          // Scrolling up -> show immediately
          fabHidden.value = false
        }
        lastScrollY.value = y
      } else {
        lastScrollY.value = y
      }
      scheduleShowOnIdle()
    }

    onMounted(() => {
      // Detect the scroll container used by the app shell (App.vue uses main.flex-1.overflow-auto)
      const el = document.querySelector('main.flex-1.overflow-auto')
      scrollEl.value = el || window
      scrollTarget = scrollEl.value === window ? window : scrollEl.value
      lastScrollY.value = getScrollY()
      scrollTarget.addEventListener('scroll', onScrollFab, { passive: true })
    })
    onBeforeUnmount(() => {
      if (scrollTarget) scrollTarget.removeEventListener('scroll', onScrollFab)
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
    })

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
      formKey,
      closeForm,
      onSave,
      onDelete,
      onDuplicate,
      onToggleFav,
      showFilters,
      // chips helpers
      clearSearch,
      clearCategory,
      clearPlayers,
      clearIntensity,
      clearCourt,
      clearMaterial,
      clearFavorites,
      // delete modal
      showDeleteModal,
      deleteName,
      cancelDelete,
      confirmDelete,
      // constants for chips
      DEFAULT_PLAYERS,
      DEFAULT_INTENSITY,
      // mobile FAB state
      fabHidden
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
