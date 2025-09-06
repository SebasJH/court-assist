<template>
  <PageHeader title="Trainingen" :mobileBack="isSmallScreen && isSearching" :mobileBackEmitOnly="true"
              :hideHamburgerWhenBack="true" :hideActionsOnMobile="isSmallScreen && isSearching" @mobile-back="closeHeaderSearch">
    <template #lead>
      <div class="flex items-center gap-3 min-w-0 w-full">
        <transition name="header-search" mode="out-in" @after-enter="onHeaderSearchAfterEnter">
          <div v-if="isSearching" key="search" class="relative w-full md:hidden">
            <Search class="w-4 h-4 !text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"/>
            <input
                ref="searchInputRef"
                class="form-input !rounded-md w-full !pl-9 !pr-10 !bg-white !border-gray-300 !text-gray-900 placeholder:text-gray-400 shadow-sm dark:!bg-gray-600/40 dark:!border-gray-600 dark:!text-gray-50 dark:placeholder:text-gray-400"
                :value="q"
                @input="e => q = (e && e.target ? e.target.value : '')"
                placeholder="Zoek trainingen..."
                aria-label="Zoek trainingen"
            />
            <button
                v-if="q && q.length"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-50 "
                aria-label="Zoekopdracht wissen"
                @click="clearHeaderSearch"
            >
              <X class="w-5 h-5"/>
            </button>
          </div>
          <h1 v-else key="title" class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-50 leading-tight truncate md:hidden">Trainingen</h1>
        </transition>
        <h1 class="hidden md:block text-3xl font-bold text-gray-800 dark:text-gray-50 leading-tight truncate">Trainingen</h1>
      </div>
    </template>
    <template #actions>
      <div class="relative flex items-center gap-2" ref="actionsRef">
        <UiButton class="hidden md:inline-flex" color="primary" icon="Plus" @click="onNewTraining">Nieuwe training</UiButton>

        <!-- Mobile search toggle -->
        <button
            v-if="!(isSmallScreen && isSearching)"
            type="button"
            class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600 transition-colors duration-200"
            aria-label="Zoeken"
            @click="openHeaderSearch"
        >
          <Search class="w-5 h-5"/>
        </button>

        <button
          v-if="!(isSmallScreen && isSearching)"
          ref="headerMenuBtnRef"
          type="button"
          class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600 transition-colors duration-200"
          aria-haspopup="menu"
          :aria-expanded="headerMenuOpen ? 'true' : 'false'"
          aria-label="Weergave opties"
          @click="toggleHeaderMenu"
        >
          <MoreVertical class="w-5 h-5" />
        </button>
        <div v-if="headerMenuOpen" ref="headerMenuRef" class="dropdown-menu absolute top-full right-0 mt-2 w-48 whitespace-nowrap border rounded-md shadow-lg flex flex-col z-[4000]">
          <button class="dropdown-item" :class="viewMode==='grid' ? 'bg-blue-50 dark:bg-gray-600' : ''" role="menuitemradio" :aria-checked="viewMode==='grid' ? 'true' : 'false'" @click="selectView('grid')">
            <LayoutGrid class="w-fit h-4" />
            Kaartweergave
          </button>
          <button class="dropdown-item" :class="viewMode==='list' ? 'bg-blue-50 dark:bg-gray-600' : ''" role="menuitemradio" :aria-checked="viewMode==='list' ? 'true' : 'false'" @click="selectView('list')">
            <List class="w-fit h-4" />
            Lijstweergave
          </button>
        </div>
      </div>
    </template>
  </PageHeader>

  <PageContainer>
    <!-- Delete confirm modal -->
    <modal :open="showDeleteModal" @close="cancelDelete" contentPaddingClass="p-0">
      <template #title>Bevestig verwijderen</template>
      <DeleteConfirm :name="deleteName" @cancel="cancelDelete" @confirm="confirmDelete" />
    </modal>

    <!-- Top controls row with results count -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <ExercisesTopControls
        class="!mb-0 flex-1 order-1 md:order-2"
        :q="q"
        :favorites="favorites"
        :showFilters="showFilters"
        :sortBy="sortBy"
        :sortDir="sortDir"
        :viewMode="viewMode"
        :showViewToggle="false"
        :searchPlaceholder="'Zoek trainingen...'"
        :searchAriaLabel="'Zoek trainingen'"
        @update:q="val => q = val"
        @update:favorites="val => favorites = val"
        @toggle-filters="showFilters = !showFilters"
        @update:sortBy="val => sortBy = val"
        @update:sortDir="val => sortDir = val"
      />
      <div class="text-sm text-gray-600 dark:text-gray-300 shrink-0 order-2 md:order-1 ml-auto md:ml-0">
        <span class="font-medium">{{ filteredTrainings.length }}</span> {{ filteredTrainings.length === 1 ? 'training' : 'trainingen' }} gevonden
      </div>
    </div>

    <!-- Trainings list -->
    <div class="mt-4">
      <div v-if="viewMode==='grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TrainingCard v-for="t in filteredTrainings" :key="t.id" :training="t" @request-delete="openDeleteFromItem" />
      </div>

      <div v-else class="divide-y border rounded-md dark:border-gray-600">
        <TrainingListItem v-for="t in filteredTrainings" :key="t.id" :training="t" @request-delete="openDeleteFromItem" />
      </div>

      <div v-if="filteredTrainings.length === 0" class="text-sm text-gray-500 mt-4">Geen trainingen gevonden.</div>
    </div>
  </PageContainer>
</template>

<script>
import store from '../store'
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { PageHeader, PageContainer, ExercisesTopControls, UiButton, Modal, DeleteConfirm } from '../components'
import { ensureSampleTrainings } from '../data/sampleTrainings'
import TrainingCard from '../components/training/TrainingCard.vue'
import TrainingListItem from '../components/training/TrainingListItem.vue'

export default {
  components: { 
    PageHeader, 
    PageContainer, 
    ExercisesTopControls,
    UiButton,
    Modal,
    DeleteConfirm,
    TrainingCard,
    TrainingListItem
  },
  setup(){
    // Seed trainings demo data if empty
    ensureSampleTrainings(store)

    const trainings = store.state.trainings

    // Delete confirm modal state
    const showDeleteModal = ref(false)
    const deleteId = ref(null)
    const deleteName = ref('')

    // Header menu state
    const headerMenuOpen = ref(false)
    const headerMenuRef = ref(null)
    const headerMenuBtnRef = ref(null)
    const actionsRef = ref(null)

    function toggleHeaderMenu(){ headerMenuOpen.value = !headerMenuOpen.value }
    function handleClickOutside(event){
      const menuEl = headerMenuRef.value
      const btnEl = headerMenuBtnRef.value
      if ((menuEl && menuEl.contains(event.target)) || (btnEl && btnEl.contains(event.target))) return
      headerMenuOpen.value = false
    }

    // Mobile/small-screen detection for header search/back button
    const isSmallScreen = ref(false)
    function updateSmallScreen(){
      try { isSmallScreen.value = (window.innerWidth || document.documentElement.clientWidth) < 768 } catch(_) { isSmallScreen.value = false }
    }

    // Header search animation state/handlers
    const isSearching = ref(false)
    const searchInputRef = ref(null)
    function openHeaderSearch(){
      isSearching.value = true
      try { headerMenuOpen.value = false } catch(_) {}
      nextTick(() => { try { searchInputRef.value && searchInputRef.value.focus() } catch(_) {} })
    }
    function clearHeaderSearch(){
      q.value = ''
      nextTick(() => {
        try {
          const el = searchInputRef.value
          if (el && typeof el.focus === 'function') {
            el.focus()
            try { if (typeof el.setSelectionRange === 'function') el.setSelectionRange(el.value.length, el.value.length) } catch(_) {}
          }
        } catch(_) {}
      })
    }
    function closeHeaderSearch(){ isSearching.value = false }
    function onHeaderSearchAfterEnter(){
      if (!isSearching.value) return
      nextTick(() => { try { searchInputRef.value && searchInputRef.value.focus() } catch(_) {} })
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', updateSmallScreen)
      updateSmallScreen()
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', updateSmallScreen)
    })

    // View mode persistence
    const viewMode = ref(localStorage.getItem('training_viewMode') || 'grid')
    watch(viewMode, (m)=>{ try { localStorage.setItem('training_viewMode', m) } catch(_) {} })
    function selectView(mode){ viewMode.value = mode; headerMenuOpen.value = false }

    // Top controls state
    const q = ref('')
    const favorites = ref(false)
    const showFilters = ref(false) // placeholder hook
    const sortBy = ref('dateCreated') // 'dateCreated' | 'name'
    const sortDir = ref('desc') // 'asc' | 'desc'

    function slugify(str) {
      return String(str || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    const filteredTrainings = computed(() => {
      const query = (q.value || '').toLowerCase().trim()
      const favOnly = !!favorites.value
      let list = (trainings || []).filter(t => {
        if (favOnly && !t.favorite) return false
        if (!query) return true
        const h = (s) => (s || '').toString().toLowerCase()
        return h(t.name).includes(query) || h(t.description).includes(query) || h(t.theme).includes(query)
      })
      // sort
      const by = sortBy.value
      const dir = sortDir.value === 'asc' ? 1 : -1
      list = list.slice().sort((a,b) => {
        if (by === 'name') {
          const an = (a.name || '').toString().toLowerCase()
          const bn = (b.name || '').toString().toLowerCase()
          if (an < bn) return -1 * dir
          if (an > bn) return 1 * dir
          return 0
        }
        // dateCreated fallback
        const ad = a.dateCreated ? new Date(a.dateCreated).getTime() : 0
        const bd = b.dateCreated ? new Date(b.dateCreated).getTime() : 0
        return (ad - bd) * (dir)
      })
      return list
    })

    function isNum(v){ return typeof v === 'number' && Number.isFinite(v) }
    function formatDuration(min){
      const m = Number(min)
      if (!Number.isFinite(m) || m <= 0) return ''
      if (m < 60) return `${m} min`
      const h = Math.floor(m / 60)
      const r = m % 60
      if (r === 0) return `${h} ${h===1 ? 'uur' : 'uur'}`
      return `${h} ${h===1 ? 'uur' : 'uur'} en ${r} min`
    }
    function formatDate(iso){
      try {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return ''
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      } catch(_) { return '' }
    }

    function openDeleteFromItem(payload){
      try {
        deleteId.value = payload && payload.id != null ? payload.id : null
        deleteName.value = (payload && payload.name) ? String(payload.name) : ''
        showDeleteModal.value = true
      } catch(_) {
        showDeleteModal.value = true
      }
    }
    function cancelDelete(){
      showDeleteModal.value = false
    }
    function confirmDelete(){
      try {
        const id = deleteId.value
        if (id != null) {
          store.deleteTraining(id)
        }
      } catch(_) {}
      showDeleteModal.value = false
      deleteId.value = null
      deleteName.value = ''
    }

    function onNewTraining(){
      // Placeholder action until a TrainingEdit form exists
      store.notify('Nieuwe training aanmaken (binnenkort)', 'info', 2500)
    }

    return { 
      // header menu
      headerMenuOpen, headerMenuRef, headerMenuBtnRef, toggleHeaderMenu, selectView,
      // header search + responsive
      isSmallScreen, isSearching, searchInputRef, openHeaderSearch, clearHeaderSearch, closeHeaderSearch, onHeaderSearchAfterEnter,
      actionsRef,
      // top controls
      q, favorites, showFilters, sortBy, sortDir,
      // list + view
      viewMode, filteredTrainings, slugify, isNum, formatDuration, formatDate,
      // delete modal
      showDeleteModal, deleteName, openDeleteFromItem, cancelDelete, confirmDelete,
      // actions
      onNewTraining,
    }
  }
}
</script>

<style scoped>
.header-search-enter-active, .header-search-leave-active { transition: all 200ms ease; }
.header-search-enter-from { opacity: 0; transform: translateX(8px); }
.header-search-enter-to { opacity: 1; transform: translateX(0); }
.header-search-leave-from { opacity: 1; transform: translateX(0); }
.header-search-leave-to { opacity: 0; transform: translateX(8px); }
</style>