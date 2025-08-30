<template>
  <div class="">
    <div class="flex flex-col gap-y-2">

      <!-- Category -->
      <div class="py-3">
        <button
          type="button"
          class="form-label w-full items-center justify-between cursor-pointer select-none"
          :aria-expanded="open.category ? 'true' : 'false'"
          aria-controls="section-category"
          @click="toggle('category')"
        >
          <span>Categorieën</span>
          <svg class="w-5 h-5 ml-auto shrink-0 text-gray-500 dark:text-gray-100 transition-transform duration-200" :class="open.category ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <transition name="collapse">
          <div id="section-category" v-show="open.category" class="flex flex-wrap gap-2 overflow-hidden">
            <label
              v-for="c in categories"
              :key="c"
              class="inline-flex items-center gap-2 bg-gray-100 hover:bg-blue-100 text-gray-800 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 rounded-lg px-2 py-1.5 cursor-pointer select-none hover:shadow-sm transition-colors duration-150"
            >
            <input
              type="checkbox"
              class="form-checkbox w-4 h-4 "
              :checked="isCategorySelected(c)"
              @change="onToggleCategory(c, $event.target.checked)"
            />
            <span class="text-sm">{{ c }}</span>
          </label>
          </div>
        </transition>
      </div>

      <!-- Court -->
      <div class="py-3">
        <fieldset>
          <legend class="form-legend w-full p-0">
            <button
              type="button"
              class="w-full flex items-center justify-between cursor-pointer select-none text-inherit"
              :aria-expanded="open.court ? 'true' : 'false'"
              aria-controls="section-court"
              @click="toggle('court')"
            >
              <span>Veldtype</span>
              <svg class="ww-5 h-5 ml-auto shrink-0 text-gray-500 dark:text-gray-100 transition-transform duration-200" :class="open.court ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          <transition name="collapse">
                      <div id="section-court" v-show="open.court" class="flex flex-col gap-2 overflow-hidden">
            <label class="text-sm inline-flex items-center gap-2 select-none bg-gray-100 hover:bg-blue-100 text-gray-800 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 rounded-lg px-2 py-1.5 cursor-pointer hover:shadow-sm transition-colors duration-150">
              <input type="checkbox" class="form-checkbox w-4 h-4" :checked="isCourtSelected('halfcourt')" @change="onToggleCourt('halfcourt', $event.target.checked)" />
              <span>Half court</span>
            </label>
            <label class="text-sm inline-flex items-center gap-2 select-none bg-gray-100 hover:bg-blue-100 text-gray-800 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 rounded-lg px-2 py-1.5 cursor-pointer hover:shadow-sm transition-colors duration-150">
              <input type="checkbox" class="form-checkbox w-4 h-4" :checked="isCourtSelected('fullcourt')" @change="onToggleCourt('fullcourt', $event.target.checked)" />
              <span>Full court</span>
            </label>
          </div>
          </transition>
        </fieldset>
      </div>

      <!-- Players -->
      <div class="py-3">
        <fieldset>
          <legend class="form-legend w-full p-0">
            <button
              type="button"
              class="w-full flex items-center justify-between cursor-pointer select-none text-inherit"
              :aria-expanded="open.players ? 'true' : 'false'"
              aria-controls="section-players"
              @click="toggle('players')"
            >
              <span>Aantal spelers</span>
              <svg class="w-5 h-5 ml-auto shrink-0 text-gray-500 dark:text-gray-100 transition-transform duration-200" :class="open.players ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          <transition name="collapse">
                    <div id="section-players" v-show="open.players" class="overflow-hidden">
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
          </div>
          </transition>
        </fieldset>
      </div>

      <!-- Intensity -->
      <div class="py-3">
        <fieldset>
          <legend class="form-legend w-full p-0">
            <button
              type="button"
              class="w-full flex items-center justify-between cursor-pointer select-none text-inherit"
              :aria-expanded="open.intensity ? 'true' : 'false'"
              aria-controls="section-intensity"
              @click="toggle('intensity')"
            >
              <span>Intensiteit</span>
              <svg class="w-5 h-5 ml-auto shrink-0 text-gray-500 dark:text-gray-100 transition-transform duration-200" :class="open.intensity ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          <transition name="collapse">
                    <div id="section-intensity" v-show="open.intensity" class="overflow-hidden">
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
          </div>
          </transition>
        </fieldset>
      </div>

      <!-- Materials -->
      <div class="py-3">
        <fieldset>
          <legend class="form-legend w-full p-0">
            <button
              type="button"
              class="w-full flex items-center justify-between cursor-pointer select-none text-inherit"
              :aria-expanded="open.materials ? 'true' : 'false'"
              aria-controls="section-materials"
              @click="toggle('materials')"
            >
              <span>Materialen</span>
              <svg class="w-5 h-5 ml-auto shrink-0 text-gray-500 dark:text-gray-100 transition-transform duration-200" :class="open.materials ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </legend>
          <transition name="collapse">
                    <div id="section-materials" v-show="open.materials" class="flex flex-wrap gap-2 overflow-hidden">
            <label v-for="m in materialOptions" :key="m" class="inline-flex items-center gap-2 bg-gray-100 hover:bg-blue-100 text-gray-800 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 rounded-lg px-2 py-1.5 cursor-pointer select-none hover:shadow-sm transition-colors duration-150">
              <input type="checkbox" class="form-checkbox w-4 h-4" :checked="materials.includes(m)" @change="onToggleMaterial(m, $event.target.checked)" />
              <span class="text-sm">{{ m }}</span>
            </label>
          </div>
          </transition>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
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
    const open = reactive({ category: true, court: true, players: true, intensity: true, materials: true })
    function toggle(key){ if (Object.prototype.hasOwnProperty.call(open, key)) open[key] = !open[key] }
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
    return { open, toggle, onToggleMaterial, isCourtSelected, onToggleCourt, isCategorySelected, onToggleCategory }
  }
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 180ms ease, opacity 180ms ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 600px; /* enough for content */
  opacity: 1;
}
</style>
