<template>
  <div class="exercise-card relative">
    <div class="flex flex-col gap-y-5 h-full">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <component
            v-if="exercise.icon || exercise.imageIcon"
            :is="exercise.icon || exercise.imageIcon"
            class="w-8 h-8 text-gray-700"
            :aria-label="`Icon ${exercise.icon || exercise.imageIcon}`"
          />
          <TrafficCone v-else class="w-8 h-8 text-gray-400" aria-label="Default icon" />
        </div>

        <div class="flex-1 pr-8">
          <div class="flex flex-col">
            <div class="text-lg font-bold text-gray-800 break-words">{{ exercise.name }}</div>
            <div class="flex flex-wrap gap-2 mt-1">
              <span
                  v-for="cat in exercise.category"
                  :key="cat"
                  class="exercise-category badge small bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                {{ cat }}
              </span>
            </div>

          </div>
        </div>

        <div class="absolute top-4 right-4" ref="menuContainer">
          <!-- Menu button -->
          <div
              class="menu flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-10 h-10 cursor-pointer"
              @click="toggleMenu"
          >
            <Ellipsis/>
          </div>

          <!-- Dropdown -->
          <div
              v-if="menuOpen"
              ref="menuRef"
              :class="['absolute mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col z-10', alignRight ? 'right-0' : 'left-0']"
          >
            <button
                @click="onEdit"
                class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
              <Pencil class="w-fit h-4"/>
              Wijzigen
            </button>
            <button
                @click="onDuplicate"
                class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
              <Copy class="w-fit h-4"/>
              Dupliceren
            </button>
            <button
                @click="onDelete"
                class="cursor-pointer border-t border-gray-200 text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100 text-red-500">
              <Trash class="w-fit h-4"/>
              Verwijderen
            </button>
          </div>
        </div>
      </div>


      <div class="exercise-details h-full flex flex-col justify-between">
        <div class="text-sm leading-relaxed text-gray-600">{{ exercise.description || exercise.shortDescription }}</div>
        <div class="flex flex-wrap items-center gap-x-1.5 mt-2">

          <div class="exercise-players bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <Users class="h-4 w-fit"/>
            <div>
              {{ exercise.minPlayers }}<span v-if="exercise.maxPlayers">-{{ exercise.maxPlayers }}</span>
            </div>
          </div>

          <div class="exercise-duration bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <TimerReset class="h-4 w-fit"/>
            <div>
              {{ exercise.duration }}min
            </div>
          </div>

          <div class="exercise-intensity bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <Zap class="h-4 w-fit"/>
            <div>
              {{ exercise.intensity }}/5
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from 'vue'

const emit = defineEmits(['edit','duplicate','delete'])

const props = defineProps({
  exercise: {type: Object, required: true}
})

const menuOpen = ref(false)
const menuRef = ref(null)  // Ref naar de dropdown-container
const menuContainer = ref(null)
const alignRight = ref(false)

function computeMenuAlignment() {
  try {
    const cont = menuContainer.value
    if (!cont) return
    const rect = cont.getBoundingClientRect()
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth
    const approxMenuWidth = 200 // w-40 (~160px) + padding/shadow safety
    const spaceRight = viewportWidth - rect.right
    const spaceLeft = rect.left
    // If not enough space on the right, align to right (open leftwards)
    if (spaceRight < approxMenuWidth && spaceLeft > approxMenuWidth / 2) {
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
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>


<style scoped>

</style>
