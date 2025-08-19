<template>
  <div class="exercise-card relative cursor-pointer" role="link" :aria-label="`Open ${exercise.name}`" @click="goToDetail" tabindex="0" @keydown.enter.prevent="goToDetail" :class="menuOpen ? 'z-50' : ''">
    <div class="flex flex-col h-full">
      <div class="flex items-start gap-3">

        <!-- Icon -->
        <div class="bg-gray-100 w-16 h-16 rounded-lg flex justify-center items-center">
          <component
            v-if="exercise.icon || exercise.imageIcon"
            :is="exercise.icon || exercise.imageIcon"
            class="w-8 h-8 text-gray-700"
            :aria-label="`Icon ${exercise.icon || exercise.imageIcon}`"
          />
          <TrafficCone v-else class="w-8 h-8 text-gray-400" aria-label="Default icon" />
        </div>

        <!-- Content: title -->
        <div class="flex-1 min-w-0 pr-18">
          <div class="text-lg font-bold text-gray-800 break-words">{{ exercise.name }}</div>

          <!-- Categories -->
          <div class="flex flex-wrap gap-1.5 mt-1">
            <span
                v-for="cat in exercise.category"
                :key="cat"
                class="exercise-category badge small bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {{ cat }}
            </span>
          </div>

        </div>

        <!-- Controls back in corner -->
        <div class="absolute top-4 right-4 flex items-start gap-2" ref="controlsRef">
          <button
            class="star flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-9 h-9 cursor-pointer"
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
              :class="['absolute top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col z-50', alignRight ? 'right-0' : 'left-0']"
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



      <!-- Details -->
      <div class="exercise-details mt-6 h-full flex flex-col gap-y-4">

        <!-- Description -->
        <div class="flex-1 text-sm leading-relaxed text-gray-600">{{ exercise.description || exercise.shortDescription }}</div>

        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex flex-wrap items-center gap-x-1.5">
            <div class="exercise-players bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
              <Users class="h-4 w-fit" />
              <div>
                {{ exercise.minPlayers }}<span v-if="exercise.maxPlayers">-{{ exercise.maxPlayers }}</span>
              </div>
            </div>
            <div class="exercise-duration bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
              <TimerReset class="h-4 w-fit" />
              <div>{{ exercise.duration }}min</div>
            </div>
            <div class="exercise-intensity bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
              <Zap class="h-4 w-fit" />
              <div>{{ exercise.intensity }}/5</div>
            </div>
          </div>
          <router-link :to="`/oefening/${slug}`" class="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium" @click.stop>Lees meer →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick, computed} from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['edit','duplicate','delete','toggle-fav'])

const props = defineProps({
  exercise: {type: Object, required: true}
})

const menuOpen = ref(false)
const menuRef = ref(null)  // Ref naar de dropdown-container
const menuButtonRef = ref(null)
const alignRight = ref(false)

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

const router = useRouter()
function goToDetail() {
  if (!props.exercise) return
  router.push(`/oefening/${slug.value}`)
}

</script>


<style scoped>

</style>
