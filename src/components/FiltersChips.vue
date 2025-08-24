<template>
  <!-- Root wrapper to receive classes/attrs from parent -->
  <div v-bind="$attrs">
    <!-- Search -->
    <span v-if="q && q.trim().length" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
      Zoek: "{{ q }}"
      <button class="hover:text-blue-900" @click="$emit('clear:search')" aria-label="Verwijder zoekopdracht">×</button>
    </span>
    <!-- Category -->
    <span v-if="category" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
      Categorie: {{ category }}
      <button class="hover:text-blue-900" @click="$emit('clear:category')" aria-label="Verwijder categorie">×</button>
    </span>
    <!-- Players -->
    <span v-if="players[0] !== defaultPlayers[0] || players[1] !== defaultPlayers[1]" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
      Spelers: {{ formatPlayers(players[0], players[1]) }}
      <button class="hover:text-blue-900" @click="$emit('clear:players')" aria-label="Reset spelers">×</button>
    </span>
    <!-- Intensity -->
    <span v-if="intensity[0] !== defaultIntensity[0] || intensity[1] !== defaultIntensity[1]" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
      Intensiteit: {{ formatIntensityRange(intensity[0], intensity[1]) }}
      <button class="hover:text-blue-900" @click="$emit('clear:intensity')" aria-label="Reset intensiteit">×</button>
    </span>
    <!-- Court -->
    <template v-if="Array.isArray(court) && court.length">
      <span v-for="c in court" :key="c" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
        Veld: {{ formatCourt(c) }}
        <button class="hover:text-blue-900" @click="$emit('clear:court', c)" :aria-label="'Verwijder veld ' + c">×</button>
      </span>
    </template>
    <!-- Materials -->
    <template v-if="Array.isArray(materials) && materials.length">
      <span v-for="m in materials" :key="m" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
        Materiaal: {{ m }}
        <button class="hover:text-blue-900" @click="$emit('clear:material', m)" :aria-label="'Verwijder materiaal ' + m">×</button>
      </span>
    </template>
    <!-- Favorites -->
    <span v-if="favorites" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
      Favorieten
      <button class="hover:text-blue-900" @click="$emit('clear:favorites')" aria-label="Verwijder favorieten filter">×</button>
    </span>
    <!-- Reset all -->
    <button class="text-sm h-8 px-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800" @click="$emit('reset')">Alles wissen</button>
  </div>
</template>

<script>
import { formatPlayers as fmtPlayers } from '../utils/exerciseFormat'
export default {
  name: 'FiltersChips',
  props: {
    q: { type: String, default: '' },
    category: { type: String, default: '' },
    players: { type: Array, default: () => [null, null] },
    intensity: { type: Array, default: () => [null, null] },
    court: { type: Array, default: () => [] },
    materials: { type: Array, default: () => [] },
    favorites: { type: Boolean, default: false },
    defaultPlayers: { type: Array, default: () => [null, null] },
    defaultIntensity: { type: Array, default: () => [null, null] }
  },
  emits: ['clear:search','clear:category','clear:players','clear:intensity','clear:court','clear:material','clear:favorites','reset'],
  methods: {
    formatCourt(c){
      const v = (c || '').toString().toLowerCase().trim().replace(/\s+/g, '')
      if (v === 'halfcourt') return 'Half court'
      if (v === 'fullcourt') return 'Full court'
      return c
    },
    formatPlayers(min, max){
      return fmtPlayers(min, max, { variant: 'compact' })
    },
    formatIntensityRange(min, max){
      const isNum = (v) => typeof v === 'number' && Number.isFinite(v)
      const lo = isNum(min) ? min : null
      const hi = isNum(max) ? max : null
      if (lo !== null && hi !== null) return (lo === hi) ? `${lo}` : `${lo}–${hi}`
      if (lo !== null) return `${lo} min`
      if (hi !== null) return `${hi} max`
      return ''
    }
  }
}
</script>

<style scoped>
</style>
