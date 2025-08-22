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
    <div class="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex justify-center items-center shrink-0">
      <component
        v-if="exercise.icon || exercise.imageIcon"
        :is="exercise.icon || exercise.imageIcon"
        class="w-6 h-6 text-gray-700"
        :aria-label="`Icon ${exercise.icon || exercise.imageIcon}`"
      />
      <TrafficCone v-else class="w-6 h-6 text-gray-400" aria-label="Default icon" />
    </div>

    <!-- Main: name + categories + mobile details -->
    <div class="flex-1 min-w-0">
      <div class="text-base font-semibold text-gray-800 leading-tight title-2line md:truncate">{{ exercise.name }}</div>
      <div class="flex flex-wrap gap-1 mt-0.5">
        <span
          v-for="cat in exercise.category"
          :key="cat"
          class="badge small bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
        >{{ cat }}</span>
      </div>
      <!-- Mobile-only compact details -->
      <div class="lg:hidden mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-700">
        <div v-if="showPlayers" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100">
          <Users class="w-3.5 h-3.5" />
          <span>{{ playersLabel }}</span>
        </div>
        <div v-if="hasDuration" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100">
          <TimerReset class="w-3.5 h-3.5" />
          <span>{{ durationLabel }}</span>
        </div>
        <div v-if="hasCourt" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100">
          <RectangleCircle class="w-3.5 h-3.5" />
          <span>{{ courtLabel }}</span>
        </div>
        <div v-if="showIntensity" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100">
          <Zap class="w-3.5 h-3.5" />
          <span>{{ intensityLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Players -->
    <div class="hidden lg:block w-28 text-sm text-gray-700 tabular-nums truncate" :title="playersLabel">{{ playersLabel }}</div>
    <!-- Duration -->
    <div class="hidden lg:block w-28 text-sm text-gray-700 tabular-nums truncate">{{ durationLabel }}</div>
    <!-- Court -->
    <div class="hidden lg:block w-28 text-sm text-gray-700 truncate">{{ courtLabel }}</div>
    <!-- Intensity -->
    <div class="hidden lg:block w-28 text-sm text-gray-700 tabular-nums truncate">{{ intensityLabel }}</div>

    <!-- Actions -->
    <div class="flex md:w-16 md:w-20 items-center justify-end gap-2 shrink-0" ref="actionsRef" @mouseenter="liftEnter" @mouseleave="liftLeave" @click.stop>
      <button
        class="hidden sm:inline-flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-8 h-8 cursor-pointer"
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
          :class="['fixed w-64 sm:w-40 whitespace-nowrap bg-white border border-gray-200 rounded shadow-lg flex flex-col z-[3000]']"
          :style="menuStyle"
        >
          <button @click="onEdit" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
            <Pencil class="w-fit h-4" />
            Wijzigen
          </button>
          <button @click="onDuplicate" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
            <Copy class="w-fit h-4" />
            Dupliceren
          </button>
          <button @click="onToggleFavFromMenu" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100 sm:hidden">
            <Star class="w-fit h-4" :class="exercise && exercise.favorite ? 'text-yellow-500' : ''" :fill="exercise && exercise.favorite ? 'currentColor' : 'none'" :stroke="'currentColor'" />
            <span>{{ (exercise && exercise.favorite) ? 'Verwijder uit favorieten' : 'Markeer als favoriet' }}</span>
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
import { formatPlayersFromExercise, formatDurationFromExercise, formatCourtFromExercise, formatIntensityFromExercise, hasPlayers as hasPlayersField, hasDuration as hasDurationField, hasCourt as hasCourtField } from '../../utils/exerciseFormat'

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

const playersLabel = computed(() => formatPlayersFromExercise(props.exercise, { variant: 'compact' }))
const durationLabel = computed(() => formatDurationFromExercise(props.exercise, { variant: 'compact' }))
const courtLabel = computed(() => formatCourtFromExercise(props.exercise, { variant: 'compact' }))
const intensityLabel = computed(() => formatIntensityFromExercise(props.exercise))

// Mobile chips visibility
const showPlayers = computed(() => hasPlayersField(props.exercise?.minPlayers, props.exercise?.maxPlayers))
const hasDuration = computed(() => hasDurationField(props.exercise?.duration))
const hasCourt = computed(() => hasCourtField(props.exercise?.court))
const showIntensity = computed(() => typeof props.exercise?.intensity === 'number')

function toggleFav(){ emit('toggle-fav', props.exercise.id) }

// Menu handling copied/simplified from card
const menuOpen = ref(false)
const menuRef = ref(null)
const menuButtonRef = ref(null)
const alignRight = ref(false)
const menuStyle = ref({ left: '0px', top: '0px' })
const hoverCount = ref(0)
function liftEnter(){ hoverCount.value++ }
function liftLeave(){ hoverCount.value = Math.max(0, hoverCount.value - 1) }

function computeMenuAlignment(){
  try {
    const btn = menuButtonRef.value
    if (!btn) { alignRight.value = false; return }
    const rect = btn.getBoundingClientRect()
    const vw = window.innerWidth || document.documentElement.clientWidth
    const vh = window.innerHeight || document.documentElement.clientHeight
    const menuEl = menuRef.value
    const menuW = (menuEl && menuEl.offsetWidth) || 160
    const menuH = (menuEl && menuEl.offsetHeight) || 160
    const gap = 8

    // Horizontal placement
    const spaceRight = vw - rect.right
    const spaceLeft = rect.left
    let left = rect.left
    if (spaceRight < menuW && spaceLeft > menuW / 2) {
      alignRight.value = true
      left = rect.right - menuW
    } else {
      alignRight.value = false
      left = rect.left
    }

    // Vertical placement
    const spaceBelow = vh - rect.bottom
    let top = rect.bottom + gap
    if (spaceBelow < menuH && rect.top > menuH + gap) {
      top = rect.top - menuH - gap
    }

    // Clamp within viewport
    left = Math.min(Math.max(8, left), vw - menuW - 8)
    top = Math.min(Math.max(8, top), vh - menuH - 8)

    menuStyle.value = { left: left + 'px', top: top + 'px' }
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
function onToggleFavFromMenu(){ toggleFav(); closeMenu() }
</script>

<style scoped>
/* 2-line clamp for the exercise title on small screens; md+ uses single-line truncate via utility */
.title-2line {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
