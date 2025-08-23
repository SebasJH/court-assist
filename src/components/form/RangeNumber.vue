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
    attachedLabels: { type: Boolean, default: false },
    allowEmpty: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }){
    function clamp(n) {
      const v = Number.parseInt(n, 10)
      if (Number.isNaN(v)) return null
      return Math.max(props.min, Math.min(props.max, v))
    }

    const currentMin = computed(() => {
      const mv = Array.isArray(props.modelValue) && props.modelValue.length === 2 ? props.modelValue : (props.allowEmpty ? [null, null] : [props.min, props.max])
      const lo = mv[0]
      if (props.allowEmpty && (lo === null || typeof lo !== 'number' || !Number.isFinite(lo))) return ''
      const n = typeof lo === 'number' ? lo : props.min
      return Math.max(props.min, Math.min(props.max, n))
    })
    const currentMax = computed(() => {
      const mv = Array.isArray(props.modelValue) && props.modelValue.length === 2 ? props.modelValue : (props.allowEmpty ? [null, null] : [props.min, props.max])
      const hi = mv[1]
      if (props.allowEmpty && (hi === null || typeof hi !== 'number' || !Number.isFinite(hi))) return ''
      const n = typeof hi === 'number' ? hi : props.max
      return Math.max(props.min, Math.min(props.max, n))
    })

    function onMin(val){
      if (props.allowEmpty && (val === '' || val === null)) {
        const mv = Array.isArray(props.modelValue) && props.modelValue.length === 2 ? props.modelValue : [null, null]
        emit('update:modelValue', [null, (typeof mv[1] === 'number' && Number.isFinite(mv[1])) ? mv[1] : null])
        return
      }
      const newMin = clamp(val)
      if (newMin === null) return
      const mv = Array.isArray(props.modelValue) && props.modelValue.length === 2 ? props.modelValue : [null, null]
      const curMax = (typeof mv[1] === 'number' && Number.isFinite(mv[1])) ? Math.max(props.min, Math.min(props.max, mv[1])) : null
      const newMax = props.allowEmpty ? curMax : (curMax === null ? null : Math.max(newMin, curMax))
      emit('update:modelValue', [newMin, newMax])
    }
    function onMax(val){
      if (props.allowEmpty && (val === '' || val === null)) {
        const mv = Array.isArray(props.modelValue) && props.modelValue.length === 2 ? props.modelValue : [null, null]
        emit('update:modelValue', [(typeof mv[0] === 'number' && Number.isFinite(mv[0])) ? mv[0] : null, null])
        return
      }
      const newMax = clamp(val)
      if (newMax === null) return
      const mv = Array.isArray(props.modelValue) && props.modelValue.length === 2 ? props.modelValue : [null, null]
      const curMin = (typeof mv[0] === 'number' && Number.isFinite(mv[0])) ? Math.max(props.min, Math.min(props.max, mv[0])) : null
      const newMin = props.allowEmpty ? curMin : (curMin === null ? null : Math.min(curMin, newMax))
      emit('update:modelValue', [newMin, newMax])
    }

    return { currentMin, currentMax, onMin, onMax }
  }
}
</script>

<style scoped>
</style>
