<template>
  <div
    class="exercise-list-item flex items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
    role="link"
    :aria-label="`Open ${exercise.name}`"
    tabindex="0"
    @click="goToDetail"
    @keydown.enter.prevent="goToDetail"
  >
    <!-- Icon -->
    <div class="bg-gray-100 w-12 h-12 rounded-lg flex justify-center items-center shrink-0">
      <component
        v-if="exercise.icon || exercise.imageIcon"
        :is="exercise.icon || exercise.imageIcon"
        class="w-6 h-6 text-gray-700"
        :aria-label="`Icon ${exercise.icon || exercise.imageIcon}`"
      />
      <TrafficCone v-else class="w-6 h-6 text-gray-400" aria-label="Default icon" />
    </div>

    <!-- Main: name + categories -->
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-gray-800 truncate">{{ exercise.name }}</div>
      <div class="flex flex-wrap gap-1 mt-0.5">
        <span
          v-for="cat in exercise.category"
          :key="cat"
          class="badge small bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
        >{{ cat }}</span>
      </div>
    </div>

    <!-- Players -->
    <div class="w-28 text-sm text-gray-700 tabular-nums truncate" :title="playersLabel">{{ playersLabel }}</div>
    <!-- Duration -->
    <div class="w-28 text-sm text-gray-700 tabular-nums truncate">{{ durationLabel }}</div>
    <!-- Court -->
    <div class="w-28 text-sm text-gray-700 truncate">{{ courtLabel }}</div>
    <!-- Intensity -->
    <div class="w-28 text-sm text-gray-700 tabular-nums truncate">{{ intensityLabel }}</div>

    <!-- Actions -->
    <div class="w-20 flex items-center justify-end gap-2 shrink-0" ref="actionsRef" @mouseenter="liftEnter" @mouseleave="liftLeave" @click.stop>
      <button
        class="flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-8 h-8 cursor-pointer"
        :aria-pressed="exercise.favorite ? 'true' : 'false'"
        :title="exercise.favorite ? 'Verwijder uit favorieten' : 'Markeer als favoriet'"
        @click.stop="toggleFav"
      >
        <Star :class="exercise.favorite ? 'w-4 h-4 text-yellow-500' : 'w-4 h-4'" :fill="exercise.favorite ? 'currentColor' : 'none'" :stroke="exercise.favorite ? 'currentColor' : 'currentColor'" />
      </button>

      <div class="relative">
        <div
          class="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          @click.stop="toggleMenu"
          ref="menuButtonRef"
        >
          <Ellipsis />
        </div>
        <div
          v-if="menuOpen"
          ref="menuRef"
          @click.stop
          :class="['absolute top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col z-[3000]', alignRight ? 'right-0' : 'left-0']"
        >
          <button @click="onEdit" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
            <Pencil class="w-fit h-4" />
            Wijzigen
          </button>
          <button @click="onDuplicate" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
            <Copy class="w-fit h-4" />
            Dupliceren
          </button>
          <button @click="onDelete" class="cursor-pointer border-t border-gray-200 text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100 text-red-500">
            <Trash class="w-fit h-4" />
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['edit','duplicate','delete','toggle-fav'])
const props = defineProps({ exercise: { type: Object, required: true } })

const router = useRouter()
function goToDetail(){
  if (!props.exercise) return
  const slug = String(props.exercise?.name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  router.push(`/oefening/${slug}`)
}

function isNum(v){ return typeof v === 'number' && Number.isFinite(v) }
const minPlayersVal = computed(() => isNum(props.exercise?.minPlayers) ? props.exercise.minPlayers : null)
const maxPlayersVal = computed(() => isNum(props.exercise?.maxPlayers) ? props.exercise.maxPlayers : null)
const playersLabel = computed(() => {
  const min = minPlayersVal.value
  const max = maxPlayersVal.value
  if (min !== null && max !== null) return `${min}-${max}`
  if (min !== null) return `${min} min`
  if (max !== null) return `${max} max`
  return ''
})
const durationLabel = computed(() => {
  const d = props.exercise?.duration
  return isNum(d) && d > 0 ? `${d} min` : ''
})
const courtLabel = computed(() => {
  const v = (props.exercise?.court || '').toString().trim()
  if (!v) return ''
  const norm = v.toLowerCase()
  if (norm === 'halfcourt' || norm === 'half court') return 'Half'
  if (norm === 'fullcourt' || norm === 'full court') return 'Full'
  return v
})
const intensityLabel = computed(() => {
  const i = props.exercise?.intensity
  return isNum(i) ? `${i}/5` : ''
})

function toggleFav(){ emit('toggle-fav', props.exercise.id) }

// Menu handling copied/simplified from card
const menuOpen = ref(false)
const menuRef = ref(null)
const menuButtonRef = ref(null)
const alignRight = ref(false)
const hoverCount = ref(0)
function liftEnter(){ hoverCount.value++ }
function liftLeave(){ hoverCount.value = Math.max(0, hoverCount.value - 1) }

function computeMenuAlignment(){
  try {
    const btn = menuButtonRef.value
    if (!btn) { alignRight.value = false; return }
    const rect = btn.getBoundingClientRect()
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth
    const measuredMenuWidth = menuRef.value?.offsetWidth || 160
    const spaceRight = viewportWidth - rect.right
    const spaceLeft = rect.left
    if (spaceRight < measuredMenuWidth && spaceLeft > measuredMenuWidth / 2) {
      alignRight.value = true
    } else {
      alignRight.value = false
    }
  } catch(e) {
    alignRight.value = false
  }
}
function toggleMenu(){ const next = !menuOpen.value; menuOpen.value = next; if (next) nextTick(() => computeMenuAlignment()) }
function closeMenu(){ menuOpen.value = false }
function handleClickOutside(event){
  const menuEl = menuRef.value
  const btnEl = menuButtonRef.value
  if ((menuEl && menuEl.contains(event.target)) || (btnEl && btnEl.contains(event.target))) return
  menuOpen.value = false
}
function handleResizeOrScroll(){ if (menuOpen.value) computeMenuAlignment() }

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('resize', handleResizeOrScroll)
  window.addEventListener('scroll', handleResizeOrScroll, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', handleResizeOrScroll)
  window.removeEventListener('scroll', handleResizeOrScroll, true)
})

function onEdit(){ closeMenu(); emit('edit', props.exercise) }
function onDuplicate(){ closeMenu(); emit('duplicate', props.exercise.id) }
function onDelete(){ closeMenu(); emit('delete', props.exercise.id) }
</script>

<style scoped>
</style>
