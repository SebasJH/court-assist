<template>
  <div class="exercise-card relative cursor-pointer" role="link" :aria-label="`Open ${exercise.name}`" @click="goToDetail" tabindex="0" @keydown.enter.prevent="goToDetail" :class="zClass">
    <div class="flex flex-col h-full">
      <div class="flex items-start gap-3">

        <!-- Icon -->
        <div class="bg-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-lg flex justify-center items-center relative">
          <div v-if="exercise.favorite" class="md:hidden absolute -top-1 -left-1 w-5 h-5 rounded-md bg-white shadow z-10 flex items-center justify-center pointer-events-none" aria-label="Favoriet" role="img">
            <Star class="w-3 h-3 text-yellow-500" :fill="'currentColor'" :stroke="'currentColor'"/>
          </div>
          <component
            v-if="exercise.icon || exercise.imageIcon"
            :is="exercise.icon || exercise.imageIcon"
            class="w-8 h-8 text-gray-700"
            :aria-label="`Icon ${exercise.icon || exercise.imageIcon}`"
          />
          <TrafficCone v-else class="w-8 h-8 text-gray-400" aria-label="Default icon" />
        </div>

        <!-- Title -->
        <div class="flex-1 min-w-0 pr-12 md:pr-[4.5rem]">
          <div class="text-lg font-bold text-gray-800 break-words">{{ exercise.name }}</div>

          <!-- Categories -->
          <div class="flex flex-wrap gap-1 mt-1">
            <span
                v-for="cat in exercise.category"
                :key="cat"
                class="exercise-category badge small bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap"
            >
              {{ cat }}
            </span>
          </div>

        </div>

        <!-- Actions -->
        <div class="absolute top-4 right-4 flex items-start gap-2" ref="controlsRef" @mouseenter="liftEnter" @mouseleave="liftLeave">
          <button
            class="star hidden md:inline-flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-9 h-9 cursor-pointer"
            :aria-pressed="exercise.favorite ? 'true' : 'false'"
            :title="exercise.favorite ? 'Verwijder uit favorieten' : 'Markeer als favoriet'"
            @click.stop="toggleFav"
          >
            <Star :class="exercise.favorite ? 'w-5 h-5 text-yellow-500' : 'w-5 h-5 '" :fill="exercise.favorite ? 'currentColor' : 'none'" :stroke="exercise.favorite ? 'currentColor' : 'currentColor'" />
          </button>

          <!-- Menu button wrapper is relative so dropdown anchors to the dots -->
          <div class="relative">
            <div
              class="menu w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              @click.stop="toggleMenu"
              ref="menuButtonRef"
            >
              <Ellipsis />
            </div>

            <div
              v-if="menuOpen"
              ref="menuRef"
              @click.stop
              :class="['absolute top-full mt-2 w-64 md:w-40 whitespace-nowrap bg-white border border-gray-200 rounded shadow-lg flex flex-col z-[3000]', alignRight ? 'right-0' : 'left-0']"
            >
              <button @click="onEdit" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
                <Pencil class="w-fit h-4" />
                Wijzigen
              </button>
              <button @click="onDuplicate" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
                <Copy class="w-fit h-4" />
                Dupliceren
              </button>
              <button @click="onToggleFavFromMenu" class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100 md:hidden">
                <Star class="w-fit h-4" :class="exercise.favorite ? 'text-yellow-500' : ''" :fill="exercise.favorite ? 'currentColor' : 'none'" :stroke="'currentColor'" />
                <span>{{ exercise.favorite ? 'Verwijder uit favorieten' : 'Markeer als favoriet' }}</span>
              </button>
              <button @click="onDelete" class="cursor-pointer border-t border-gray-200 text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100 text-red-500">
                <Trash class="w-fit h-4" />
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="exercise-details mt-6 flex-1 flex flex-col gap-y-4">

        <!-- Description -->
        <div class="flex-1 text-sm leading-relaxed text-gray-600">{{ exercise.description || exercise.shortDescription }}</div>

        <div class="mt-0 flex items-end justify-between gap-2">
          <div class="flex-1 min-w-0 flex flex-wrap items-center gap-y-1 gap-x-1.5">
            <!-- Players with tooltip -->
            <div v-if="showPlayers" class="relative" ref="playersRef" @mouseenter="onEnterPlayers" @mouseleave="onLeavePlayers">
              <div class="exercise-players bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-300 hover:shadow-sm transition-colors transition-shadow duration-150">
                <Users class="h-4 w-fit" />
                <div>{{ playersLabel }}</div>
              </div>
              <Tooltip :title="playersTooltip.title" :body="playersTooltip.body" :open="playersOpen" :anchor="playersRef" />
            </div>

            <!-- Duration with tooltip -->
            <div v-if="hasDuration" class="relative" ref="durationRef" @mouseenter="onEnterDuration" @mouseleave="onLeaveDuration">
              <div class="exercise-duration bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-300 hover:shadow-sm transition-colors transition-shadow duration-150">
                <TimerReset class="h-4 w-fit" />
                <div>{{ exercise.duration }} min</div>
              </div>
              <Tooltip :title="durationTooltip.title" :body="durationTooltip.body" :open="durationOpen" :anchor="durationRef" />
            </div>

            <!-- Intensity with tooltip -->
            <div v-if="typeof exercise.intensity === 'number'" class="relative" ref="intensityRef" @mouseenter="onEnterIntensity" @mouseleave="onLeaveIntensity">
              <div class="exercise-intensity bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-300 hover:shadow-sm transition-colors transition-shadow duration-150">
                <Zap class="h-4 w-fit" />
                <div>{{ exercise.intensity }}/5</div>
              </div>
              <Tooltip :title="intensityTooltip.title" :body="intensityTooltip.body" :open="intensityOpen" :anchor="intensityRef" />
            </div>

            <!-- Court with tooltip -->
            <div v-if="hasCourt" class="relative" ref="courtRef" @mouseenter="onEnterCourt" @mouseleave="onLeaveCourt">
              <div class="exercise-court bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-300 hover:shadow-sm transition-colors transition-shadow duration-150">
                <RectangleCircle class="h-4 w-fit" />
                <div>{{ courtLabel }}</div>
              </div>
              <Tooltip :title="courtTooltip.title" :body="courtTooltip.body" :open="courtOpen" :anchor="courtRef" />
            </div>
          </div>
          <router-link :to="`/oefening/${slug}`" class="shrink-0 self-end whitespace-nowrap text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium" @click.stop>Lees meer →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick, computed} from 'vue'
import { useRouter } from 'vue-router'
import Tooltip from '../Tooltip.vue'
import { isNum, hasPlayers, hasDuration as hasDurationField, hasCourt as hasCourtField, formatPlayersFromExercise, formatCourtFromExercise } from '../../utils/exerciseFormat'

const emit = defineEmits(['edit','duplicate','delete','toggle-fav'])

const props = defineProps({
  exercise: {type: Object, required: true}
})

const menuOpen = ref(false)
const menuRef = ref(null)  // Ref naar de dropdown-container
const menuButtonRef = ref(null)
const alignRight = ref(false)

// Lift the card when interacting so its menus/tooltips stack above neighbors
const hoverCount = ref(0)
function liftEnter() { hoverCount.value++ }
function liftLeave() { hoverCount.value = Math.max(0, hoverCount.value - 1) }
const zClass = computed(() => (menuOpen.value ? 'z-[2000]' : (hoverCount.value > 0 ? 'z-[1000]' : '')))

// Tooltip anchors and visibility (teleported tooltips)
const playersRef = ref(null)
const durationRef = ref(null)
const intensityRef = ref(null)
const courtRef = ref(null)

const playersOpen = ref(false)
const durationOpen = ref(false)
const intensityOpen = ref(false)
const courtOpen = ref(false)

function onEnterPlayers(){ playersOpen.value = true; liftEnter() }
function onLeavePlayers(){ playersOpen.value = false; liftLeave() }
function onEnterDuration(){ durationOpen.value = true; liftEnter() }
function onLeaveDuration(){ durationOpen.value = false; liftLeave() }
function onEnterIntensity(){ intensityOpen.value = true; liftEnter() }
function onLeaveIntensity(){ intensityOpen.value = false; liftLeave() }
function onEnterCourt(){ courtOpen.value = true; liftEnter() }
function onLeaveCourt(){ courtOpen.value = false; liftLeave() }

function computeMenuAlignment() {
  try {
    const btn = menuButtonRef.value
    if (!btn) { alignRight.value = false; return }
    const rect = btn.getBoundingClientRect()
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth
    const measuredMenuWidth = menuRef.value?.offsetWidth || 160 // w-40 = 10rem fallback
    const spaceRight = viewportWidth - rect.right
    const spaceLeft = rect.left
    // Default is left-0; flip to right if not enough space on the right and there is room on the left
    if (spaceRight < measuredMenuWidth && spaceLeft > measuredMenuWidth / 2) {
      alignRight.value = true
    } else {
      alignRight.value = false
    }
  } catch (e) {
    alignRight.value = false
  }
}

function toggleMenu() {
  const next = !menuOpen.value
  menuOpen.value = next
  if (next) nextTick(() => computeMenuAlignment())
}

function closeMenu() {
  menuOpen.value = false
}

function onEdit() {
  closeMenu()
  emit('edit', props.exercise)
}

function onDuplicate() {
  closeMenu()
  emit('duplicate', props.exercise.id)
}

function onDelete() {
  closeMenu()
  emit('delete', props.exercise.id)
}

// Klik buiten menu detecteren
function handleClickOutside(event) {
  // Close if clicking outside both the dropdown and the menu button
  const menuEl = menuRef.value
  const btnEl = menuButtonRef.value
  if (
    (menuEl && menuEl.contains(event.target)) ||
    (btnEl && btnEl.contains(event.target))
  ) {
    return
  }
  menuOpen.value = false
}

function handleResizeOrScroll() {
  if (menuOpen.value) computeMenuAlignment()
}

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

const slug = computed(() => {
  const name = props.exercise?.name || ''
  return String(name)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
})

function toggleFav() {
  emit('toggle-fav', props.exercise.id)
}
function onToggleFavFromMenu() {
  toggleFav()
  closeMenu()
}

const showPlayers = computed(() => hasPlayers(props.exercise?.minPlayers, props.exercise?.maxPlayers))
const playersLabel = computed(() => formatPlayersFromExercise(props.exercise, { variant: 'compact' }))
const hasDuration = computed(() => hasDurationField(props.exercise?.duration))
const hasCourt = computed(() => hasCourtField(props.exercise?.court))
const courtLabel = computed(() => formatCourtFromExercise(props.exercise, { variant: 'compact' }))

// Tooltip texts
const playersTooltip = computed(() => {
  const min = isNum(props.exercise?.minPlayers) ? props.exercise.minPlayers : null
  const max = isNum(props.exercise?.maxPlayers) ? props.exercise.maxPlayers : null
  let body = ''
  if (min !== null && max !== null) {
    body = `Geschikt voor ${min} tot ${max} spelers`
  } else if (min !== null) {
    body = `Minimaal ${min} spelers nodig`
  } else if (max !== null) {
    body = `Maximaal ${max} spelers`
  }
  return {
    title: 'Aantal spelers',
    body
  }
})
const durationTooltip = computed(() => {
  const d = (typeof props.exercise?.duration === 'number' && props.exercise.duration > 0)
    ? props.exercise.duration
    : ((typeof props.exercise?.minutes === 'number' && props.exercise.minutes > 0) ? props.exercise.minutes : null)
  return {
    title: 'Tijd van de oefening',
    body: d !== null ? `De oefening duurt gemiddeld ${d} minuten` : 'Aantal minuten dat de oefening duurt'
  }
})
const intensityTooltip = computed(() => ({
  title: 'Intensiteit',
  body: `Zwaarte van de oefening (1 = licht · 5 = zwaar) · Huidig: ${props.exercise?.intensity}/5`
}))
const courtTooltip = computed(() => {
  const v = courtLabel.value
  if (!v) return { title: 'Veldtype', body: 'Geen veldtype opgegeven' }
  return {
    title: 'Veldtype',
    body: `Deze oefening is ontworpen voor ${v.toLowerCase()} court`
  }
})

const router = useRouter()
function goToDetail() {
  if (!props.exercise) return
  router.push(`/oefening/${slug.value}`)
}

</script>


<style scoped>

</style>
