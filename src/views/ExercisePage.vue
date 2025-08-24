<template>
  <PageHeader title="Oefeningen" :mobileBack="isSmallScreen && isSearching" :mobileBackEmitOnly="true"
              :hideHamburgerWhenBack="true" @mobile-back="closeHeaderSearch">
    <template #lead>
      <div class="flex items-center gap-3 min-w-0 w-full">
        <transition name="header-search" mode="out-in" @after-enter="onHeaderSearchAfterEnter">
          <div v-if="isSearching" key="search" class="relative w-full md:hidden">
            <Search class="w-4 h-4 !text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"/>
            <input
                ref="searchInputRef"
                class="form-input w-full !pl-9 !pr-10 !bg-white !border-gray-300 !text-gray-900 placeholder:text-gray-400 shadow-sm dark:!bg-neutral-900 dark:!border-neutral-700 dark:!text-gray-100 dark:placeholder:text-gray-400"
                :value="q"
                @input="e => q = (e && e.target ? e.target.value : '')"
                placeholder="Zoek oefeningen..."
                aria-label="Zoek oefeningen"
            />
            <button
                v-if="q && q.length"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700"
                aria-label="Zoekopdracht wissen"
                @click="clearHeaderSearch"
            >
              <X class="w-5 h-5"/>
            </button>
          </div>
          <h1 v-else key="title" class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-50 leading-tight truncate md:hidden">Oefeningen</h1>
        </transition>
        <h1 class="hidden md:block text-3xl font-bold text-gray-800 dark:text-gray-50 leading-tight truncate">Oefeningen</h1>
      </div>
    </template>
    <template #actions>
      <div class="relative flex items-center gap-2">
        <UiButton class="hidden md:inline-flex" color="primary" icon="Plus" @click="openForm()">Nieuwe oefening
        </UiButton>

        <!-- Mobile search toggle -->
        <button
            v-if="!(isSmallScreen && isSearching)"
            type="button"
            class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Zoeken"
            @click="openHeaderSearch"
        >
          <Search class="w-5 h-5"/>
        </button>

        <button
            v-if="!(isSmallScreen && isSearching)"
            ref="headerMenuBtnRef"
            type="button"
            class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-none transition-colors duration-200"
            aria-haspopup="menu"
            :aria-expanded="headerMenuOpen ? 'true' : 'false'"
            aria-label="Weergave opties"
            @click="headerMenuOpen = !headerMenuOpen"
        >
          <MoreVertical class="w-5 h-5"/>
        </button>

        <!-- Dropdown menu -->
        <div
            v-if="headerMenuOpen"
            ref="headerMenuRef"
            class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 dark:border-gray-600 shadow-lg border border-gray-200 rounded-md z-[4500]"
            role="menu"
            aria-label="Weergave"
        >
          <button
              class="w-full text-left px-3 h-10 text-sm flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-600"
              :class="viewMode === 'card' ? 'bg-blue-50 dark:bg-gray-600' : ''"
              role="menuitemradio"
              :aria-checked="viewMode === 'card' ? 'true' : 'false'"
              @click="selectView('card')"
          >
            <LayoutGrid class="w-4 h-4"/>
            Kaartweergave
          </button>
          <button
              class="w-full text-left px-3 h-10 text-sm flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-600"
              :class="viewMode === 'list' ? 'bg-blue-50 bg-gray-600' : ''"
              role="menuitemradio"
              :aria-checked="viewMode === 'list' ? 'true' : 'false'"
              @click="selectView('list')"
          >
            <List class="w-4 h-4"/>
            Lijstweergave
          </button>
        </div>
      </div>
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
        :showViewToggle="false"
        @update:q="val => q = val"
        @update:favorites="val => filter.favorites = val"
        @toggle-filters="showFilters = !showFilters"
        @update:sortBy="val => sortBy = val"
        @update:sortDir="val => sortDir = val"
        @update:viewMode="setViewMode"
    />

    <!-- Filters drawer (right side panel with overlay) -->
    <modal :open="showFilters" @close="showFilters = false" :drawer="true" side="right" drawerWidthClass="max-w-lg"
           contentPaddingClass="p-0" :hideDefaultClose="true">
      <div class="flex h-full flex-col">
        <div class="px-5 sm:px-10 pt-5 pb-4 border-b">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Filter class="w-5 h-5 text-gray-700"/>
              <h2 id="filters-title" class="text-lg font-semibold text-gray-800">Filters</h2>
            </div>
            <button
                type="button"
                class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Sluiten"
                title="Sluiten"
                @click="showFilters = false"
            >
              <X class="w-4 h-4"/>
            </button>
          </div>
        </div>
        <div class="px-5 sm:px-10 py-8 flex-1 overflow-y-auto">
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
        class="mb-4 flex flex-wrap gap-1 items-center"
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
        <transition-group name="exercise-list" tag="div"
                          class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
                          :css="!pageSwitching">
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
        <div class="bg-white rounded-lg shadow-md overflow-hidden">

          <div class="lg:min-w-[48rem]">
            <div
                class="hidden lg:flex items-center gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b bg-gray-0">
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
      <div class="bg-white dark:bg-neutral-900 border border-dashed border-gray-300 dark:border-neutral-700 rounded-xl p-10 text-center max-w-xl mx-auto">
        <div class="text-lg font-semibold text-gray-800 mb-2">
          {{ hasAny ? 'Er zijn geen oefeningen gevonden met dit filter' : 'Er zijn momenteel geen oefeningen' }}
        </div>
        <div class="text-sm text-gray-600 mb-6" v-if="hasAny && isFilterActive">
          Pas je zoekopdracht of filters aan, of verwijder de filters.
        </div>
        <div class="flex justify-center gap-3">
          <UiButton
              v-if="hasAny && isFilterActive"
              color="primary"
              @click="resetFilters"
          >Verwijder filters
          </UiButton>
          <UiButton
              v-else
              color="primary"
              @click="openForm()"
          >Maak een oefening aan
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <modal :open="showForm" @close="closeForm" contentPaddingClass="p-0" :hideDefaultClose="true">
      <exercise-form
          :key="formKey"
          :initial="editItem"
          :categories="categories"
          @close="closeForm"
          @save="onSave"
      />
    </modal>

    <!-- Delete confirm modal -->
    <modal :open="showDeleteModal" @close="cancelDelete" contentPaddingClass="p-0" :hideDefaultClose="true">
      <DeleteConfirm :name="deleteName" @cancel="cancelDelete" @confirm="confirmDelete"/>
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

  <!-- Mobile scroll-to-top button -->
  <UiButton
      :class="['md:hidden fixed safe-bottom-5 left-1/2 -translate-x-1/2 z-[3000] !p-0 w-12 h-12 shadow-lg', 'transition-opacity duration-200', { 'opacity-0 pointer-events-none': !showScrollTop }]"
      color="secondary"
      icon="ArrowUp"
      iconClass="w-6 h-6"
      aria-label="Naar boven"
      title="Naar boven"
      @click="scrollToTop"
  />

  <!-- Desktop scroll-to-top button (bottom-right) -->
  <UiButton
      :class="['hidden md:inline-flex fixed safe-bottom-5 right-5 z-[3000] !p-0 w-12 h-12 shadow-lg', 'transition-opacity duration-200', { 'opacity-0 pointer-events-none': !showScrollTop }]"
      color="primary"
      icon="ArrowUp"
      iconClass="w-6 h-6"
      aria-label="Naar boven"
      title="Naar boven"
      @click="scrollToTop"
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
import {EXERCISE_CATEGORIES, EXERCISE_MATERIALS, normalizeCourt} from '../constants'
import store from '../store'
import {ref, computed, watch, nextTick, onMounted, onBeforeUnmount} from 'vue'
import {useRoute} from 'vue-router'
import {ensureSampleExercises} from '../data/sampleExercises'
import UiButton from '../components/ui/Button.vue'

export default {
  components: {
    ExerciseCardItem,
    ExerciseListItem,
    ExerciseForm,
    Modal,
    PageHeader,
    FiltersPanel,
    ExercisesTopControls,
    DeleteConfirm,
    Pagination,
    FiltersChips,
    UiButton
  },
  setup() {
    // Sort state
    const sortBy = ref('dateCreated') // 'dateCreated' | 'name'
    const sortDir = ref('desc') // 'asc' | 'desc'
    // Backfill dateCreated for any pre-existing exercises missing it (defensive, non-destructive)
    store.state.exercises.forEach(e => {
      if (!e.dateCreated) e.dateCreated = new Date().toISOString()
    })
    const LS_FILTER_KEY = 'exerciseFilters'
    const LS_Q_KEY = 'exerciseQ'

    // Load persisted search query
    const q = ref((() => {
      try {
        return localStorage.getItem(LS_Q_KEY) || ''
      } catch (_) {
        return ''
      }
    })())
    const isSearching = ref(false)
    const searchInputRef = ref(null)

    function openHeaderSearch() {
      isSearching.value = true
      try {
        headerMenuOpen.value = false
      } catch (_) {
      }
      nextTick(() => {
        try {
          searchInputRef.value && searchInputRef.value.focus()
        } catch (_) {
        }
      })
    }

    function clearHeaderSearch() {
      q.value = ''
      nextTick(() => {
        try {
          const el = searchInputRef.value
          if (el && typeof el.focus === 'function') {
            el.focus()
            try {
              if (typeof el.setSelectionRange === 'function') el.setSelectionRange(el.value.length, el.value.length)
            } catch (_) {
            }
          }
        } catch (_) {
        }
      })
    }

    function closeHeaderSearch() {
      isSearching.value = false
    }

    function onHeaderSearchAfterEnter() {
      if (!isSearching.value) return
      nextTick(() => {
        try {
          searchInputRef.value && searchInputRef.value.focus()
        } catch (_) {}
      })
    }

    const route = useRoute()
    const isSmallScreen = ref(false)

    function updateSmallScreen() {
      try {
        isSmallScreen.value = (window.innerWidth || document.documentElement.clientWidth) < 768
      } catch (_) {
        isSmallScreen.value = false
      }
    }

    const filter = ref((() => {
      try {
        const raw = localStorage.getItem(LS_FILTER_KEY)
        if (!raw) return {category: [], players: [null, null], intensity: [null, null], favorites: false, court: [], materials: []}
        const obj = JSON.parse(raw) || {}
        const category = Array.isArray(obj.category) ? obj.category.filter(Boolean) : (typeof obj.category === 'string' && obj.category ? [obj.category] : [])
        let playersArr = Array.isArray(obj.players) && obj.players.length === 2 ? obj.players : [null, null]
        let p0 = (typeof playersArr[0] === 'number' && Number.isFinite(playersArr[0])) ? Math.max(1, Math.min(50, Number(playersArr[0]))) : null
        let p1 = (typeof playersArr[1] === 'number' && Number.isFinite(playersArr[1])) ? Math.max(1, Math.min(50, Number(playersArr[1]))) : null
        if (p0 !== null && p1 !== null && p0 > p1) { const t = p0; p0 = p1; p1 = t }
        const players = [p0, p1]
        let intArr = Array.isArray(obj.intensity) && obj.intensity.length === 2 ? obj.intensity : [null, null]
        let i0 = (typeof intArr[0] === 'number' && Number.isFinite(intArr[0])) ? Math.max(1, Math.min(5, Number(intArr[0]))) : null
        let i1 = (typeof intArr[1] === 'number' && Number.isFinite(intArr[1])) ? Math.max(1, Math.min(5, Number(intArr[1]))) : null
        if (i0 !== null && i1 !== null && i0 > i1) { const t = i0; i0 = i1; i1 = t }
        const intensity = [i0, i1]
        const favorites = !!obj.favorites
        const court = Array.isArray(obj.court) ? obj.court.filter(Boolean) : []
        const materials = Array.isArray(obj.materials) ? obj.materials.filter(Boolean) : []
        return {category, players, intensity, favorites, court, materials}
      } catch (_) {
        return {category: [], players: [null, null], intensity: [null, null], favorites: false, court: [], materials: []}
      }
    })())
    const showForm = ref(false)
    const editItem = ref(null)
    const formKey = ref(0)
    const showFilters = ref(false)
    const showDeleteModal = ref(false)

    // Header menu for view options
    const headerMenuOpen = ref(false)
    const headerMenuRef = ref(null)
    const headerMenuBtnRef = ref(null)

    function closeHeaderMenu() {
      headerMenuOpen.value = false
    }

    function selectView(mode) {
      setViewMode(mode);
      closeHeaderMenu()
    }

    function onDocKeydown(e) {
      if (e && e.key === 'Escape') closeHeaderMenu()
    }

    function onDocMousedown(e) {
      try {
        const m = headerMenuRef.value
        const b = headerMenuBtnRef.value
        const t = e && e.target
        if (!t) return
        if ((m && m.contains(t)) || (b && b.contains(t))) return
        closeHeaderMenu()
      } catch (_) {
      }
    }

    // View mode: 'card' (default) or 'list', persisted in localStorage
    const viewMode = ref((() => {
      try {
        return localStorage.getItem('exerciseView') === 'list' ? 'list' : 'card'
      } catch (_) {
        return 'card'
      }
    })())

    function setViewMode(mode) {
      if (mode !== 'card' && mode !== 'list') return
      viewMode.value = mode
      try {
        localStorage.setItem('exerciseView', mode)
      } catch (_) {
      }
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

    function onToggleFav(id) {
      store.toggleFavorite(id)
    }

    // Helper: kijkt of spelers-bereiken overlappen (houdt rekening met maxPlayers = null)
    function playersOverlap(ex, selMin, selMax) {
      const itemMin = typeof ex.minPlayers === 'number' ? ex.minPlayers : 1
      const itemMax = typeof ex.maxPlayers === 'number' ? ex.maxPlayers : Infinity
      return itemMin <= selMax && itemMax >= selMin
    }

    const filtered = computed(() => {
      const selPlayersMin = (typeof filter.value.players[0] === 'number' && Number.isFinite(filter.value.players[0])) ? filter.value.players[0] : 1
      const selPlayersMax = (typeof filter.value.players[1] === 'number' && Number.isFinite(filter.value.players[1])) ? filter.value.players[1] : Infinity
      const selIntMin = (typeof filter.value.intensity[0] === 'number' && Number.isFinite(filter.value.intensity[0])) ? filter.value.intensity[0] : 1
      const selIntMax = (typeof filter.value.intensity[1] === 'number' && Number.isFinite(filter.value.intensity[1])) ? filter.value.intensity[1] : Infinity
      const selFav = !!filter.value.favorites
      const selCourts = Array.isArray(filter.value.court)
          ? filter.value.court.map(c => normalizeCourt(c)).filter(Boolean)
          : []
      const selMaterials = Array.isArray(filter.value.materials) ? filter.value.materials : []
      const playersFilterActive = (typeof filter.value.players[0] === 'number' && Number.isFinite(filter.value.players[0])) || (typeof filter.value.players[1] === 'number' && Number.isFinite(filter.value.players[1]))
      const intensityFilterActive = (typeof filter.value.intensity[0] === 'number' && Number.isFinite(filter.value.intensity[0])) || (typeof filter.value.intensity[1] === 'number' && Number.isFinite(filter.value.intensity[1]))

      return store.state.exercises.filter(e => {
        // zoek op titel en beschrijving (geen fallback naar shortDescription)
        const searchable = `${e.name ?? ''} ${e.description ?? ''}`.toLowerCase()
        if (q.value && !searchable.includes(q.value.toLowerCase()))
          return false

        // favorieten
        if (selFav && !e.favorite) return false

        // categorie (meerdere selecties mogelijk; match als een van de gekozen categorieën voorkomt)
        const selCats = Array.isArray(filter.value.category) ? filter.value.category.filter(Boolean) : []
        if (selCats.length > 0) {
          const ecats = Array.isArray(e.category) ? e.category : (e.category ? [e.category] : [])
          const hasAny = ecats.some(c => selCats.includes(c))
          if (!hasAny) return false
        }

        // court type (checkboxes allow selecting one of both). If none selected, don't filter.
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

        // aantal spelers (range overlap) — exclude items without players when filter active
        if (playersFilterActive) {
          const hasItemPlayers = (typeof e.minPlayers === 'number' && Number.isFinite(e.minPlayers)) || (typeof e.maxPlayers === 'number' && Number.isFinite(e.maxPlayers))
          if (!hasItemPlayers) return false
        }
        if (!playersOverlap(e, selPlayersMin, selPlayersMax)) return false

        // intensiteit binnen bereik — exclude items without intensity when filter active
        const intensityVal = (typeof e.intensity === 'number' && Number.isFinite(e.intensity)) ? e.intensity : null
        if (intensityFilterActive) {
          if (intensityVal === null) return false
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
          const cmp = an.localeCompare(bn, 'nl', {sensitivity: 'base'})
          if (cmp !== 0) return cmp * m
          return ((a.id || 0) - (b.id || 0)) * m
        } else { // dateCreated
          const ad = new Date(a.dateCreated || 0).getTime() || 0
          const bd = new Date(b.dateCreated || 0).getTime() || 0
          if (ad === bd) return ((a.id || 0) - (b.id || 0)) * m
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
        setTimeout(() => {
          pageSwitching.value = false
        }, 0)
      })
    }

    function goPrev() {
      setPage(page.value - 1)
    }

    function goNext() {
      setPage(page.value + 1)
    }


    // Chip clear helpers
    function clearSearch() {
      q.value = ''
    }

    function clearCategory(kind) {
      if (typeof kind === 'string') {
        const arr = Array.isArray(filter.value.category) ? filter.value.category.slice() : []
        filter.value.category = arr.filter(v => v !== kind)
      } else {
        filter.value.category = []
      }
    }

    function clearPlayers() {
      filter.value.players = [null, null]
    }

    function clearIntensity() {
      filter.value.intensity = [null, null]
    }

    function clearCourt(kind) {
      const arr = Array.isArray(filter.value.court) ? filter.value.court.slice() : []
      filter.value.court = arr.filter(v => v !== kind)
    }

    function clearMaterial(m) {
      const arr = Array.isArray(filter.value.materials) ? filter.value.materials.slice() : []
      filter.value.materials = arr.filter(v => v !== m)
    }

    function clearFavorites() {
      filter.value.favorites = false
    }

    // Reset to first page when query, filters or sorting change
    watch([q, sortBy, sortDir], () => {
      page.value = 1
    })
    watch(filter, () => {
      page.value = 1
    }, {deep: true})

    // Persist search query to localStorage
    watch(q, (val) => {
      try {
        localStorage.setItem(LS_Q_KEY, val || '')
      } catch (_) {
      }
    })

    // Persist filters to localStorage (normalize before saving)
    watch(filter, (f) => {
      try {
        const p0 = (Array.isArray(f.players) && f.players.length === 2 && typeof f.players[0] === 'number' && Number.isFinite(f.players[0])) ? Math.max(1, Math.min(50, Number(f.players[0]))) : null
        const p1 = (Array.isArray(f.players) && f.players.length === 2 && typeof f.players[1] === 'number' && Number.isFinite(f.players[1])) ? Math.max(1, Math.min(50, Number(f.players[1]))) : null
        const i0 = (Array.isArray(f.intensity) && f.intensity.length === 2 && typeof f.intensity[0] === 'number' && Number.isFinite(f.intensity[0])) ? Math.max(1, Math.min(5, Number(f.intensity[0]))) : null
        const i1 = (Array.isArray(f.intensity) && f.intensity.length === 2 && typeof f.intensity[1] === 'number' && Number.isFinite(f.intensity[1])) ? Math.max(1, Math.min(5, Number(f.intensity[1]))) : null
        const snap = {
          category: Array.isArray(f.category) ? f.category.filter(Boolean) : (typeof f.category === 'string' && f.category ? [f.category] : []),
          players: [p0, p1],
          intensity: [i0, i1],
          favorites: !!f.favorites,
          court: Array.isArray(f.court) ? f.court.filter(Boolean) : [],
          materials: Array.isArray(f.materials) ? f.materials.filter(Boolean) : []
        }
        localStorage.setItem(LS_FILTER_KEY, JSON.stringify(snap))
      } catch (_) {
      }
    }, {deep: true})

    // Clamp current page when the sorted results length changes (e.g., delete/filter)
    watch(sorted, () => {
      if (page.value > pageCount.value) page.value = pageCount.value
      if (sorted.value.length === 0) page.value = 1
    })

    // Empty-state helpers
    const hasAny = computed(() => Array.isArray(store.state.exercises) && store.state.exercises.length > 0)

    const DEFAULT_PLAYERS = [null, null]
    const DEFAULT_INTENSITY = [null, null]

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
        category: [],
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
    const showScrollTop = ref(false)
    const scrollEl = ref(null)
    const lastScrollY = ref(0)
    let idleTimer = null
    let scrollTarget = null
    const IDLE_SHOW_MS = 1200
    const DELTA_THRESHOLD = 3
    const SCROLL_TOP_THRESHOLD = 60

    function getScrollY() {
      if (scrollEl.value && scrollEl.value !== window) {
        return scrollEl.value.scrollTop || 0
      }
      return window.pageYOffset || document.documentElement.scrollTop || 0
    }

    function scheduleShowOnIdle() {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null
      }
      idleTimer = setTimeout(() => {
        fabHidden.value = false;
        idleTimer = null
      }, IDLE_SHOW_MS)
    }

    function onScrollFab() {
      const y = getScrollY()
      // Toggle visibility for scroll-to-top button when scrolled beyond threshold
      showScrollTop.value = y > SCROLL_TOP_THRESHOLD

      const delta = y - lastScrollY.value
      if (Math.abs(delta) >= DELTA_THRESHOLD) {
        if (delta > 0) {
          // Scrolling down -> hide create FAB
          fabHidden.value = true
        } else if (delta < 0) {
          // Scrolling up -> show FAB immediately
          fabHidden.value = false
        }
        lastScrollY.value = y
      } else {
        lastScrollY.value = y
      }
      scheduleShowOnIdle()
    }

    onMounted(() => {
      // Initialize small-screen state and listen for viewport changes
      updateSmallScreen()
      window.addEventListener('resize', updateSmallScreen)

      // If navigated with focusSearch flag, open mobile search and focus input
      try {
        if (route && route.query && (route.query.focusSearch === '1' || route.query.focusSearch === 1 || route.query.focusSearch === true)) {
          isSearching.value = true
          nextTick(() => {
            try {
              searchInputRef.value && searchInputRef.value.focus()
            } catch (_) {
            }
          })
        }
      } catch (_) {
      }
      // Detect the scroll container used by the app shell (App.vue uses main.flex-1.overflow-auto)
      const el = document.querySelector('main.flex-1.overflow-auto')
      scrollEl.value = el || window
      scrollTarget = scrollEl.value === window ? window : scrollEl.value
      lastScrollY.value = getScrollY()
      // Initialize scroll-to-top visibility
      showScrollTop.value = lastScrollY.value > SCROLL_TOP_THRESHOLD
      scrollTarget.addEventListener('scroll', onScrollFab, {passive: true})

      // Header menu listeners
      document.addEventListener('mousedown', onDocMousedown)
      document.addEventListener('keydown', onDocKeydown)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateSmallScreen)
      if (scrollTarget) scrollTarget.removeEventListener('scroll', onScrollFab)
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null
      }
      document.removeEventListener('mousedown', onDocMousedown)
      document.removeEventListener('keydown', onDocKeydown)
    })

    function scrollToTop() {
      try {
        const y = getScrollY()
        if (y <= 0) return
        const target = scrollTarget || window
        if (typeof target.scrollTo === 'function') {
          target.scrollTo({top: 0, behavior: 'smooth'})
        } else {
          if (target === window) {
            document.documentElement.scrollTop = 0
            document.body && (document.body.scrollTop = 0)
          } else if (target && target.scrollTop != null) {
            target.scrollTop = 0
          }
        }
      } catch (_) {
        // Fallback to window scroll
        try {
          window.scrollTo(0, 0)
        } catch (_) {
        }
      }
    }

    return {
      q,
      // header mobile search
      isSearching,
      isSmallScreen,
      searchInputRef,
      openHeaderSearch,
      clearHeaderSearch,
      closeHeaderSearch,
      onHeaderSearchAfterEnter,
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
      // header view menu
      headerMenuOpen,
      headerMenuRef,
      headerMenuBtnRef,
      selectView,
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
      // mobile scroll UI
      fabHidden,
      showScrollTop,
      scrollToTop
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
/* Mobile header search transition */
.header-search-enter-active,
.header-search-leave-active { transition: all 200ms ease; }
.header-search-enter-from { opacity: 0; transform: translateX(8px); }
.header-search-enter-to { opacity: 1; transform: translateX(0); }
.header-search-leave-from { opacity: 1; transform: translateX(0); }
.header-search-leave-to { opacity: 0; transform: translateX(8px); }
</style>
