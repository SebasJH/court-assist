<template>
  <div class="bg-white rounded-xl shadow-md border border-[#E2E8F0] p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Category select -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600">Categorie</label>
        <select :value="category" @change="$emit('update:category', $event.target.value)" class="form-input">
          <option value="">Alle categorieën</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- Players slider -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600">Aantal spelers</label>
        <Slider
          :modelValue="players"
          @update:modelValue="$emit('update:players', $event)"
          :min="1"
          :max="20"
          :step="1"
          :lazy="true"
          :merge="false"
        />
        <div class="text-sm text-gray-800">van {{ players[0] }} tot {{ players[1] }}</div>
      </div>

      <!-- Intensity slider -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600">Intensiteit</label>
        <Slider
          :modelValue="intensity"
          @update:modelValue="$emit('update:intensity', $event)"
          :min="1"
          :max="5"
          :step="1"
          :lazy="true"
          :merge="false"
        />
        <div class="text-sm text-gray-800">van {{ intensity[0] }} tot {{ intensity[1] }}</div>
      </div>

    </div>

    <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Court type -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600">Veldtype</label>
        <div class="flex items-center gap-3 h-[42px]">
          <label class="inline-flex items-center gap-2 text-sm text-gray-800 select-none">
            <input type="checkbox" class="form-checkbox w-4 h-4" :checked="isCourtSelected('halfcourt')" @change="onToggleCourt('halfcourt', $event.target.checked)" />
            <span>Half court</span>
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-gray-800 select-none">
            <input type="checkbox" class="form-checkbox w-4 h-4" :checked="isCourtSelected('fullcourt')" @change="onToggleCourt('fullcourt', $event.target.checked)" />
            <span>Full court</span>
          </label>
        </div>
      </div>

      <!-- Materials checkboxes -->
      <div class="md:col-span-3">
        <label class="block text-sm text-gray-600 mb-2">Materialen</label>
        <div class="flex flex-wrap gap-2">
          <label v-for="m in materialOptions" :key="m" class="inline-flex items-center gap-2 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded px-2 py-1 cursor-pointer select-none">
            <input type="checkbox" class="form-checkbox w-4 h-4" :checked="materials.includes(m)" @change="onToggleMaterial(m, $event.target.checked)" />
            <span class="text-sm">{{ m }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { normalizeCourt } from '../constants'
export default {
  name: 'FiltersBar',
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
    return { onToggleMaterial, isCourtSelected, onToggleCourt, normalizeCourt }
  }
}
</script>

<style scoped>
</style>
