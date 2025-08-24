<template>
  <div v-if="visible" class="bg-gray-50 px-2 py-1 rounded-lg text-sm flex items-center w-fit gap-1">
    <component :is="icon" class="w-4 h-4" />
    <div>{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isNum, hasPlayers, hasDuration as hasDurationField, hasCourt as hasCourtField, formatPlayersFromExercise, formatDurationFromExercise, formatIntensityFromExercise, formatCourtFromExercise } from '../../utils/exerciseFormat'

const props = defineProps({
  exercise: { type: Object, required: true },
  kind: { type: String, required: true }, // 'players' | 'duration' | 'intensity' | 'court'
  variant: { type: String, default: 'compact' } // 'compact' | 'detail'
})

const icon = computed(() => {
  switch (props.kind) {
    case 'players': return 'Users'
    case 'duration': return 'TimerReset'
    case 'intensity': return 'Zap'
    case 'court': return 'RectangleCircle'
    default: return 'span'
  }
})

const visible = computed(() => {
  switch (props.kind) {
    case 'players': return hasPlayers(props.exercise?.minPlayers, props.exercise?.maxPlayers)
    case 'duration': return hasDurationField(props.exercise?.duration)
    case 'intensity': return isNum(props.exercise?.intensity)
    case 'court': return hasCourtField(props.exercise?.court)
    default: return false
  }
})

const label = computed(() => {
  switch (props.kind) {
    case 'players':
      return formatPlayersFromExercise(props.exercise, { variant: props.variant })
    case 'duration':
      return formatDurationFromExercise(props.exercise, { variant: props.variant })
    case 'intensity':
      return formatIntensityFromExercise(props.exercise)
    case 'court':
      return formatCourtFromExercise(props.exercise, { variant: props.variant })
    default:
      return ''
  }
})
</script>

<style scoped>
</style>
