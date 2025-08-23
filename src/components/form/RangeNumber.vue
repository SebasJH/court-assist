<template>
  <div class="grid grid-cols-2 gap-2">
    <!-- Min -->
    <div v-if="!attachedLabels" class="flex flex-col gap-1">
      <label class="text-xs text-gray-500" :for="`${idPrefix}-min`">{{ minLabel }}</label>
      <input
        :id="`${idPrefix}-min`"
        type="number"
        class="form-input"
        :value="currentMin"
        :min="min"
        :max="max"
        :step="step"
        @input="onMin($event.target.value)"
      />
    </div>
    <div v-else class="flex">
      <input
        :id="`${idPrefix}-min`"
        type="number"
        class="form-input !rounded-r-none border-r-0"
        :value="currentMin"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="minLabel"
        @input="onMin($event.target.value)"
      />
      <div class="bg-white/80 backdrop-blur-sm border border-gray-300 border-l-0 rounded-r-xl px-3 h-10 flex items-center text-gray-700 text-sm">
        {{ minLabel }}
      </div>
    </div>
    <!-- Max -->
    <div v-if="!attachedLabels" class="flex flex-col gap-1">
      <label class="text-xs text-gray-500" :for="`${idPrefix}-max`">{{ maxLabel }}</label>
      <input
        :id="`${idPrefix}-max`"
        type="number"
        class="form-input"
        :value="currentMax"
        :min="min"
        :max="max"
        :step="step"
        @input="onMax($event.target.value)"
      />
    </div>
    <div v-else class="flex">
      <input
        :id="`${idPrefix}-max`"
        type="number"
        class="form-input !rounded-r-none border-r-0"
        :value="currentMax"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="maxLabel"
        @input="onMax($event.target.value)"
      />
      <div class="bg-white/80 backdrop-blur-sm border border-gray-300 border-l-0 rounded-r-xl px-3 h-10 flex items-center text-gray-700 text-sm">
        {{ maxLabel }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'RangeNumber',
  props: {
    modelValue: { type: Array, default: () => [] },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, default: 1 },
    idPrefix: { type: String, default: 'range' },
    minLabel: { type: String, default: 'Min' },
    maxLabel: { type: String, default: 'Max' },
    attachedLabels: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }){
    const current = computed(() => {
      const mv = Array.isArray(props.modelValue) && props.modelValue.length === 2 ? props.modelValue : [props.min, props.max]
      const lo = typeof mv[0] === 'number' ? mv[0] : props.min
      const hi = typeof mv[1] === 'number' ? mv[1] : props.max
      return [Math.max(props.min, Math.min(props.max, lo)), Math.max(props.min, Math.min(props.max, hi))]
    })
    const currentMin = computed(() => current.value[0])
    const currentMax = computed(() => current.value[1])

    function clamp(n) {
      const v = Number.parseInt(n, 10)
      if (Number.isNaN(v)) return null
      return Math.max(props.min, Math.min(props.max, v))
    }
    function onMin(val){
      const newMin = clamp(val)
      if (newMin === null) return
      const newMax = Math.max(newMin, clamp(currentMax.value) ?? props.max)
      emit('update:modelValue', [newMin, newMax])
    }
    function onMax(val){
      const newMax = clamp(val)
      if (newMax === null) return
      const newMin = Math.min(clamp(currentMin.value) ?? props.min, newMax)
      emit('update:modelValue', [newMin, newMax])
    }

    return { currentMin, currentMax, onMin, onMax }
  }
}
</script>

<style scoped>
</style>
