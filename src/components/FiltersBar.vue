<template>
  <div class="">
    <!-- Row 1: Category + Court -->
    <div class="grid grid-cols-1 gap-4">
      <!-- Categorie -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600" for="filter-category">Categorie</label>
        <select id="filter-category" :value="category" @change="$emit('update:category', $event.target.value)" class="form-input">
          <option value="">Alle categorieën</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- Veldtype -->
      <div>
        <fieldset>
          <legend class="block text-sm text-gray-600 mb-2">Veldtype</legend>
          <div class="flex flex-col gap-2">
            <label class="inline-flex items-center gap-2 text-sm text-gray-800 select-none">
              <input type="checkbox" class="form-checkbox w-4 h-4" :checked="isCourtSelected('halfcourt')" @change="onToggleCourt('halfcourt', $event.target.checked)" />
              <span>Half court</span>
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-gray-800 select-none">
              <input type="checkbox" class="form-checkbox w-4 h-4" :checked="isCourtSelected('fullcourt')" @change="onToggleCourt('fullcourt', $event.target.checked)" />
              <span>Full court</span>
            </label>
          </div>
        </fieldset>
      </div>

      <!-- Aantal spelers -->
      <div>
        <fieldset class="flex flex-col gap-2">
          <legend class="text-sm text-gray-600">Aantal spelers</legend>
          <RangeNumber
            idPrefix="players"
            :modelValue="players"
            :min="1"
            :max="20"
            :step="1"
            minLabel="Min"
            maxLabel="Max"
            @update:modelValue="$emit('update:players', $event)"
          />
        </fieldset>
      </div>

      <!-- Intensiteit -->
      <div>
        <fieldset class="flex flex-col gap-2">
          <legend class="text-sm text-gray-600">Intensiteit</legend>
          <RangeNumber
            idPrefix="intensity"
            :modelValue="intensity"
            :min="1"
            :max="5"
            :step="1"
            minLabel="Min"
            maxLabel="Max"
            @update:modelValue="$emit('update:intensity', $event)"
          />
        </fieldset>
      </div>

      <!-- Materialen (full width) -->
      <div>
        <fieldset>
          <legend class="block text-sm text-gray-600 mb-2">Materialen</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="m in materialOptions" :key="m" class="inline-flex items-center gap-2 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded px-2 py-1 cursor-pointer select-none">
              <input type="checkbox" class="form-checkbox w-4 h-4" :checked="materials.includes(m)" @change="onToggleMaterial(m, $event.target.checked)" />
              <span class="text-sm">{{ m }}</span>
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import RangeNumber from './form/RangeNumber.vue'
import { normalizeCourt } from '../constants'
export default {
  name: 'FiltersBar',
  components: { RangeNumber },
  props: {
    categories: { type: Array, default: () => [] },
    category: { type: String, default: '' },
    players: { type: Array, default: () => [1, 20] },
    intensity: { type: Array, default: () => [1, 5] },
    court: { type: Array, default: () => [] },
    materials: { type: Array, default: () => [] },
    materialOptions: { type: Array, default: () => [] }
  },
  emits: [
    'update:category',
    'update:players',
    'update:intensity',
    'update:court',
    'update:materials'
  ],
  setup(props, { emit }){
    function onToggleMaterial(m, checked){
      const set = new Set(props.materials)
      if (checked) set.add(m); else set.delete(m)
      emit('update:materials', Array.from(set))
    }
    function isCourtSelected(kind){
      const arr = Array.isArray(props.court) ? props.court : []
      return arr.map(v => normalizeCourt(v)).includes(kind)
    }
    function onToggleCourt(kind, checked){
      const set = new Set((Array.isArray(props.court) ? props.court : []).map(v => normalizeCourt(v)))
      if (checked) set.add(kind); else set.delete(kind)
      emit('update:court', Array.from(set))
    }
    return { onToggleMaterial, isCourtSelected, onToggleCourt }
  }
}
</script>

<style scoped>
</style>
