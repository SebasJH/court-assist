<template>
  <div v-if="visible" class="bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center w-fit gap-1">
    <component :is="icon" class="w-4 h-4" />
    <div>{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  exercise: { type: Object, required: true },
  kind: { type: String, required: true }, // 'players' | 'duration' | 'intensity' | 'court'
  variant: { type: String, default: 'compact' } // 'compact' | 'detail'
})

function isNum(v){ return typeof v === 'number' && Number.isFinite(v) }

const minPlayers = computed(() => isNum(props.exercise?.minPlayers) ? props.exercise.minPlayers : null)
const maxPlayers = computed(() => isNum(props.exercise?.maxPlayers) ? props.exercise.maxPlayers : null)
const hasDuration = computed(() => isNum(props.exercise?.duration) && props.exercise.duration > 0)
const hasCourt = computed(() => typeof props.exercise?.court === 'string' && props.exercise.court.trim().length > 0)

const icon = computed(() => {
  switch (props.kind) {
    case 'players': return 'Users'
    case 'duration': return 'TimerReset'
    case 'intensity': return 'Zap'
    case 'court': return 'Dribbble'
    default: return 'span'
  }
})

const visible = computed(() => {
  switch (props.kind) {
    case 'players': return minPlayers.value !== null || maxPlayers.value !== null
    case 'duration': return hasDuration.value
    case 'intensity': return typeof props.exercise?.intensity === 'number'
    case 'court': return hasCourt.value
    default: return false
  }
})

const courtLabel = computed(() => {
  const v = (props.exercise?.court || '').toString().trim()
  if (!v) return ''
  const norm = v.toLowerCase()
  if (props.variant === 'detail') {
    if (norm === 'halfcourt' || norm === 'half court') return 'Half court'
    if (norm === 'fullcourt' || norm === 'full court') return 'Full court'
  } else {
    if (norm === 'halfcourt' || norm === 'half court') return 'Half'
    if (norm === 'fullcourt' || norm === 'full court') return 'Full'
  }
  return v
})

const label = computed(() => {
  switch (props.kind) {
    case 'players': {
      const min = minPlayers.value
      const max = maxPlayers.value
      if (props.variant === 'detail') {
        if (min !== null && max !== null) return `${min} - ${max}`
        if (min !== null) return `${min} minimaal`
        if (max !== null) return `${max} maximaal`
        return ''
      }
      // compact
      if (min !== null && max !== null) return `${min}-${max}`
      if (min !== null) return `${min} min`
      if (max !== null) return `${max} max`
      return ''
    }
    case 'duration': {
      const d = props.exercise?.duration
      if (!isNum(d) || d <= 0) return ''
      return props.variant === 'detail' ? `${d} minuten` : `${d} min`
    }
    case 'intensity': {
      const i = props.exercise?.intensity
      return isNum(i) ? `${i}/5` : ''
    }
    case 'court': {
      return courtLabel.value
    }
    default:
      return ''
  }
})
</script>

<style scoped>
</style>
