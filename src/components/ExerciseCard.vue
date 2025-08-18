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
            <div class="flex flex-wrap gap-1 mt-1">
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

        <div class="relative">
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
              class="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col z-10"
          >
            <button
                @click="$emit('edit', exercise)"
                class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
              <Pencil class="w-fit h-4"/>
              Wijzigen
            </button>
            <button
                @click="$emit('duplicate', exercise.id)"
                class="cursor-pointer text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100">
              <Copy class="w-fit h-4"/>
              Dupliceren
            </button>
            <button
                @click="$emit('delete', exercise.id)"
                class="cursor-pointer border-t border-gray-200 text-sm flex items-center gap-x-2 w-full text-left font-medium px-4 py-2 hover:bg-gray-100 text-red-500">
              <Trash class="w-fit h-4"/>
              Verwijderen
            </button>
          </div>
        </div>
      </div>


      <div class="exercise-details h-full flex flex-col justify-between">
        <div class="text-sm text-gray-600">{{ exercise.shortDescription }}</div>
        <div class="flex flex-wrap items-center gap-x-1 mt-2">

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
import {ref, onMounted, onBeforeUnmount} from 'vue'

defineProps({
  exercise: {type: Object, required: true}
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
