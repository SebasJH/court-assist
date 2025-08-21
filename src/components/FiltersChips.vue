<template>
  <!-- Root wrapper to receive classes/attrs from parent -->
  <div v-bind="$attrs">
    <!-- Search -->
    <span v-if="q && q.trim().length" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8">
      Zoek: "{{ q }}"
      <button class="hover:text-blue-900" @click="$emit('clear:search')" aria-label="Verwijder zoekopdracht">×</button>
    </span>
    <!-- Category -->
    <span v-if="category" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8">
      Categorie: {{ category }}
      <button class="hover:text-blue-900" @click="$emit('clear:category')" aria-label="Verwijder categorie">×</button>
    </span>
    <!-- Players -->
    <span v-if="players[0] !== defaultPlayers[0] || players[1] !== defaultPlayers[1]" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8">
      Spelers: {{ players[0] }}–{{ players[1] }}
      <button class="hover:text-blue-900" @click="$emit('clear:players')" aria-label="Reset spelers">×</button>
    </span>
    <!-- Intensity -->
    <span v-if="intensity[0] !== defaultIntensity[0] || intensity[1] !== defaultIntensity[1]" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8">
      Intensiteit: {{ intensity[0] }}–{{ intensity[1] }}
      <button class="hover:text-blue-900" @click="$emit('clear:intensity')" aria-label="Reset intensiteit">×</button>
    </span>
    <!-- Court -->
    <template v-if="Array.isArray(court) && court.length">
      <span v-for="c in court" :key="c" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8">
        Veld: {{ formatCourt(c) }}
        <button class="hover:text-blue-900" @click="$emit('clear:court', c)" :aria-label="'Verwijder veld ' + c">×</button>
      </span>
    </template>
    <!-- Materials -->
    <template v-if="Array.isArray(materials) && materials.length">
      <span v-for="m in materials" :key="m" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8">
        Materiaal: {{ m }}
        <button class="hover:text-blue-900" @click="$emit('clear:material', m)" :aria-label="'Verwijder materiaal ' + m">×</button>
      </span>
    </template>
    <!-- Favorites -->
    <span v-if="favorites" class="inline-flex items-center gap-2 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-full pl-3 pr-2 h-8">
      Favorieten
      <button class="hover:text-blue-900" @click="$emit('clear:favorites')" aria-label="Verwijder favorieten filter">×</button>
    </span>
    <!-- Reset all -->
    <button class="text-sm h-8 px-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50" @click="$emit('reset')">Alles wissen</button>
  </div>
</template>

<script>
export default {
  name: 'FiltersChips',
  props: {
    q: { type: String, default: '' },
    category: { type: String, default: '' },
    players: { type: Array, default: () => [1, 20] },
    intensity: { type: Array, default: () => [1, 5] },
    court: { type: Array, default: () => [] },
    materials: { type: Array, default: () => [] },
    favorites: { type: Boolean, default: false },
    defaultPlayers: { type: Array, default: () => [1, 20] },
    defaultIntensity: { type: Array, default: () => [1, 5] }
  },
  emits: ['clear:search','clear:category','clear:players','clear:intensity','clear:court','clear:material','clear:favorites','reset'],
  methods: {
    formatCourt(c){
      const v = (c || '').toString().toLowerCase().trim().replace(/\s+/g, '')
      if (v === 'halfcourt') return 'Half court'
      if (v === 'fullcourt') return 'Full court'
      return c
    }
  }
}
</script>

<style scoped>
</style>
