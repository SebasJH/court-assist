<template>
  <!-- Top controls: Favorites, Filters, Sort, View toggle, Search -->
  <div class="mb-4 flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3 md:justify-end">
    <div class="flex items-center gap-2 md:flex-wrap order-2 md:order-1">
      <!-- Favorites toggle -->
      <button
        class="inline-flex items-center gap-2 px-3 h-[42px] rounded-md border text-sm focus:outline-none"
        :class="favorites ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'"
        @click="$emit('update:favorites', !favorites)"
        :aria-pressed="favorites ? 'true' : 'false'"
        title="Toon alleen favorieten"
      >
        <Star :class="'w-4 h-4'" :fill="favorites ? 'currentColor' : 'none'" :stroke="'currentColor'" />
      </button>

      <!-- Filters button -->
      <button
        class="inline-flex items-center gap-2 px-3 h-[42px] rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm text-gray-800 focus:outline-none"
        :aria-pressed="showFilters ? 'true' : 'false'"
        @click="$emit('toggle-filters')"
        aria-controls="filters-title"
      >
        <Filter class="w-4 h-4" />
        <span>Filters</span>
      </button>

      <!-- Sort -->
      <SortButton
        :sortBy="sortBy"
        :sortDir="sortDir"
        @update:sortBy="$emit('update:sortBy', $event)"
        @update:sortDir="$emit('update:sortDir', $event)"
      />

      <!-- View toggle -->
      <div class="inline-flex rounded-md overflow-hidden border border-gray-300">
        <button
          type="button"
          class="inline-flex items-center justify-center px-3 h-[42px] text-sm font-medium focus:outline-none"
          :class="viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
          @click="$emit('update:viewMode', 'card')"
          :aria-pressed="viewMode === 'card' ? 'true' : 'false'"
          aria-label="Kaartweergave"
          title="Kaartweergave"
        >
          <LayoutGrid class="w-4 h-4" />
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center px-3 h-[42px] text-sm font-medium border-l border-gray-300 focus:outline-none"
          :class="viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
          @click="$emit('update:viewMode', 'list')"
          :aria-pressed="viewMode === 'list' ? 'true' : 'false'"
          aria-label="Lijstweergave"
          title="Lijstweergave"
        >
          <List class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="order-1 md:order-2 w-full md:w-auto">
      <div class="relative">
        <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          class="form-input w-full md:w-72 !pl-9 pr-3"
          :value="q"
          @input="$emit('update:q', $event.target && $event.target.value)"
          placeholder="Zoek oefeningen..."
          aria-label="Zoek oefeningen"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SortButton from '../SortButton.vue'
export default {
  name: 'ExercisesTopControls',
  components: { SortButton },
  props: {
    q: { type: String, default: '' },
    favorites: { type: Boolean, default: false },
    showFilters: { type: Boolean, default: false },
    sortBy: { type: String, default: 'dateCreated' },
    sortDir: { type: String, default: 'desc' },
    viewMode: { type: String, default: 'card' }
  },
  emits: ['update:q','update:favorites','toggle-filters','update:sortBy','update:sortDir','update:viewMode']
}
</script>

<style scoped>
</style>
