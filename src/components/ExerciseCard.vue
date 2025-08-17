<template>
  <div class="exercise-card relative">
    <div class="flex flex-col gap-y-4 h-full">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          Image
        </div>

        <div class="flex-1">
          <div class="flex flex-col">
            <div class="text-lg font-bold text-gray-800">{{ exercise.name }}</div>
            <div class="exercise-category badge small">{{ exercise.category }}</div>
          </div>
        </div>

        <!-- Menu knop -->
        <div @click="toggleMenu" class="menu relative cursor-pointer">
          <Ellipsis />

          <div
              v-if="menuOpen"
              ref="menuRef"
              class="absolute left-5 top-5 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col z-10"
          >
            <button class="text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100" @click="$emit('edit', exercise)">
              <Pencil class="w-fit h-4"/>
              Wijzigen
            </button>
            <button class="text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100" @click="$emit('duplicate', exercise.id)">
              <Copy class="w-fit h-4"/>
              Dupliceren
            </button>
            <button class="border-t border-gray-200 text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100 text-red-500" @click="$emit('delete', exercise.id)">
              <Trash class="w-fit h-4"/>
              Verwijderen
            </button>
          </div>
        </div>

      </div>

      <div class="exercise-details h-full flex flex-col justify-between">
        <div class="text-sm text-gray-600">{{ exercise.short }}</div>
        <div class="flex flex-wrap items-center gap-x-1 mt-2">

          <div class="exercise-players bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <Users class="h-4 w-fit" />
            <div>
              {{ exercise.minPlayers }}<span v-if="exercise.maxPlayers">-{{ exercise.maxPlayers }}</span>
            </div>
          </div>

          <div class="exercise-duration bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <TimerReset class="h-4 w-fit" />
            <div>
              {{ exercise.minutes }}min
            </div>
          </div>

          <div class="exercise-intensity bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <Zap class="h-4 w-fit" />
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  exercise: { type: Object, required: true }
})

const menuOpen = ref(false)
const menuRef = ref(null)  // Ref naar de dropdown-container

function toggleMenu() {
  menuOpen.value = !menuOpen.value
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
