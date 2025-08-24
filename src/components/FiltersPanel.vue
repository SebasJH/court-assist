<template>
  <div class="">
    <div class="grid grid-cols-1 gap-4">

      <!-- Category -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-700" for="filter-category">
          Categorieën
        </label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="c in categories"
            :key="c"
            class="inline-flex items-center gap-2 bg-gray-50 hover:bg-blue-100 text-gray-800 rounded px-2 py-1 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              class="form-checkbox w-4 h-4"
              :checked="isCategorySelected(c)"
              @change="onToggleCategory(c, $event.target.checked)"
            />
            <span class="text-sm">{{ c }}</span>
          </label>
        </div>
      </div>

      <!-- Court -->
      <div>
        <fieldset>
          <legend class="block text-sm text-gray-700 mb-2">Veldtype</legend>
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

      <!-- Players -->
      <div>
        <fieldset>
          <legend class="block text-sm text-gray-700 mb-2">Aantal spelers</legend>
          <RangeNumber
            idPrefix="players"
            :modelValue="players"
            :min="1"
            :max="50"
            :step="1"
            :attachedLabels="true"
            :allowEmpty="true"
            minLabel="min"
            maxLabel="max"
            @update:modelValue="$emit('update:players', $event)"
          />
        </fieldset>
      </div>

      <!-- Intensity -->
      <div>
        <fieldset>
          <legend class="block text-sm text-gray-700 mb-2">Intensiteit</legend>
          <RangeNumber
            idPrefix="intensity"
            :modelValue="intensity"
            :min="1"
            :max="5"
            :step="1"
            :attachedLabels="true"
            :allowEmpty="true"
            minLabel="min"
            maxLabel="max"
            @update:modelValue="$emit('update:intensity', $event)"
          />
        </fieldset>
      </div>

      <!-- Materials -->
      <div>
        <fieldset>
          <legend class="block text-sm text-gray-700 mb-2">Materialen</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="m in materialOptions" :key="m" class="inline-flex items-center gap-2 bg-gray-50 hover:bg-blue-100 text-gray-800 rounded px-2 py-1 cursor-pointer select-none">
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
  name: 'FiltersPanel',
  components: { RangeNumber },
  props: {
    categories: { type: Array, default: () => [] },
    category: { type: Array, default: () => [] },
    players: { type: Array, default: () => [null, null] },
    intensity: { type: Array, default: () => [null, null] },
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
    function isCategorySelected(cat){
      const arr = Array.isArray(props.category) ? props.category : []
      return arr.includes(cat)
    }
    function onToggleCategory(cat, checked){
      const set = new Set(Array.isArray(props.category) ? props.category : [])
      if (checked) set.add(cat); else set.delete(cat)
      emit('update:category', Array.from(set))
    }
    return { onToggleMaterial, isCourtSelected, onToggleCourt, isCategorySelected, onToggleCategory }
  }
}
</script>

<style scoped>
</style>
