<template>
  <PageHeader :title="exercise ? exercise.name : 'Oefening'" back-to="/oefeningen" back-label="Oefeningen" tall>
    <template #lead>
      <div class="flex items-center gap-3 min-w-0">
        <router-link to="/oefeningen" class="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
          <ArrowLeft class="w-4 h-4 mr-1" />
          Oefeningen
        </router-link>
        <span class="text-gray-300 select-none" aria-hidden="true">/</span>
        <div class="flex items-center gap-3 min-w-0">
          <div class="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center">
            <component :is="exercise?.icon || exercise?.imageIcon || 'TrafficCone'" class="w-6 h-6 text-gray-700" />
          </div>
          <div class="min-w-0">
            <div class="text-xl md:text-2xl font-bold text-gray-800 leading-tight truncate">{{ exercise ? exercise.name : 'Oefening' }}</div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="cat in (exercise?.category || [])" :key="cat" class="badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{{ cat }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #actions>

      <div v-if="exercise" class="relative flex items-center gap-2" ref="actionsRef">
        
        <!-- Favorite toggle -->
        <button
          class="star flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-10 h-10 cursor-pointer"
          :aria-pressed="exercise.favorite ? 'true' : 'false'"
          :title="exercise.favorite ? 'Verwijder uit favorieten' : 'Markeer als favoriet'"
          @click.stop="toggleFav"
        >
          <Star :class="exercise.favorite ? 'w-5 h-5 text-yellow-500' : 'w-5 h-5 '" :fill="exercise.favorite ? 'currentColor' : 'none'" :stroke="exercise.favorite ? 'currentColor' : 'currentColor'" />
        </button>
        
        <!-- Menu button and dropdown -->
        <div class="relative">
          <div class="menu w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer" @click="toggleMenu" ref="menuButtonRef">
            <Ellipsis />
          </div>
          <div v-if="menuOpen" ref="menuRef" class="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg flex flex-col z-[4000]">
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
    </template>
  </PageHeader>

  <div class="container mx-auto px-4 py-6" v-if="exercise">
    <!-- Edit modal -->
    <modal v-if="showForm" @close="closeForm">
      <exercise-form
        :initial="exercise"
        :categories="categories"
        @close="closeForm"
        @save="onSave"
      />
    </modal>

    <!-- Delete confirm modal -->
    <modal v-if="showDeleteModal" @close="cancelDelete">
      <DeleteConfirm :name="exercise.name" @cancel="cancelDelete" @confirm="confirmDelete" />
    </modal>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Beschrijving</h2>
          <p class="text-gray-700 leading-relaxed">{{ exercise.description || exercise.shortDescription }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Coaching punten</h2>
          <div class="prose max-w-none" v-html="exercise.coachingPoints || exercise.fullDescription"></div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Details</h2>
          <div class="flex flex-col gap-1.5  text-gray-800">
            <div v-if="showPlayers" class="bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center w-fit gap-1">
              <Users class="w-4 h-4" />
              <div>{{ playersLabel }}</div>
            </div>
            <div v-if="hasDuration" class="bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center w-fit gap-1">
              <TimerReset class="w-4 h-4" />
              <div>{{ exercise.duration }} minuten</div>
            </div>
            <div v-if="hasCourt" class="bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center w-fit gap-1">
              <Dribbble class="w-4 h-4" />
              <div>{{ courtLabel }}</div>
            </div>
            <div class="bg-gray-200 px-2 py-1 rounded-lg text-sm flex items-center w-fit gap-1">
              <Zap class="w-4 h-4" />
              <div>{{ exercise.intensity }}/5</div>
            </div>
          </div>

          <div v-if="exercise.materials && exercise.materials.length" class="mt-4">
            <div class="text-sm font-medium text-gray-700 mb-1">Materialen</div>
            <ul class="list-disc pl-5 text-gray-700">
              <li v-for="m in exercise.materials" :key="m">{{ m }}</li>
            </ul>
          </div>

          <div v-if="exercise.video" class="mt-4">
            <div class="text-sm font-medium text-gray-700 mb-1">Video</div>
            <a :href="exercise.video" target="_blank" rel="noopener" class="text-blue-600 hover:underline">Bekijk video</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-12 text-center text-gray-600">
    <p>Oefening niet gevonden.</p>
    <router-link to="/oefeningen" class="text-blue-600 hover:underline block mt-2">Terug</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '../store'
import PageHeader from '../components/PageHeader.vue'
import Modal from '../components/Modal.vue'
import ExerciseForm from '../components/ExerciseForm.vue'
import DeleteConfirm from '../components/DeleteConfirm.vue'
import { EXERCISE_CATEGORIES } from '../constants'

function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug)

const exercise = computed(() => {
  const list = store.state.exercises
  const target = String(slug.value || '')
  return list.find(e => slugify(e.name) === target)
})

// Players and duration display logic
const minPlayersVal = computed(() => (typeof exercise.value?.minPlayers === 'number') ? exercise.value.minPlayers : null)
const maxPlayersVal = computed(() => (typeof exercise.value?.maxPlayers === 'number') ? exercise.value.maxPlayers : null)
const showPlayers = computed(() => minPlayersVal.value !== null || maxPlayersVal.value !== null)
const playersLabel = computed(() => {
  const min = minPlayersVal.value
  const max = maxPlayersVal.value
  if (min !== null && max !== null) return `${min} - ${max}`
  if (min !== null) return `${min} minimaal`
  if (max !== null) return `${max} maximaal`
  return ''
})
const hasDuration = computed(() => typeof exercise.value?.duration === 'number' && exercise.value.duration > 0)
const hasCourt = computed(() => typeof exercise.value?.court === 'string' && exercise.value.court.trim().length > 0)
const courtLabel = computed(() => {
  const v = (exercise.value?.court || '').toString().trim()
  if (!v) return ''
  const norm = v.toLowerCase()
  if (norm === 'halfcourt' || norm === 'half court') return 'Half court'
  if (norm === 'fullcourt' || norm === 'full court') return 'Full court'
  return v
})

// Edit modal state
const showForm = ref(false)
const showDeleteModal = ref(false)
const categories = EXERCISE_CATEGORIES

function openForm() {
  showForm.value = true
}
function closeForm() {
  showForm.value = false
}

function onSave(payload) {
  if (payload.id) {
    store.updateExercise(payload.id, payload)
  } else if (exercise.value) {
    // Fallback: if no id, treat as update of current exercise
    store.updateExercise(exercise.value.id, payload)
  }
  closeForm()
}

// Header actions: favorite + menu
const menuOpen = ref(false)
const menuRef = ref(null)
const menuButtonRef = ref(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function onEdit() {
  menuOpen.value = false
  openForm()
}

function handleClickOutside(event) {
  const menuEl = menuRef.value
  const btnEl = menuButtonRef.value
  if ((menuEl && menuEl.contains(event.target)) || (btnEl && btnEl.contains(event.target))) return
  menuOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function toggleFav() {
  if (!exercise.value) return
  store.toggleFavorite(exercise.value.id)
}

function onDuplicate() {
  if (!exercise.value) return
  store.duplicateExercise(exercise.value.id)
  menuOpen.value = false
}

function onDelete() {
  if (!exercise.value) return
  showDeleteModal.value = true
  menuOpen.value = false
}

function cancelDelete() {
  showDeleteModal.value = false
}

function confirmDelete() {
  if (!exercise.value) {
    showDeleteModal.value = false
    return
  }
  store.deleteExercise(exercise.value.id)
  showDeleteModal.value = false
  router.push('/oefeningen')
}
</script>

<style scoped>
.badge { @apply w-fit px-2 py-1 text-xs font-medium rounded-full; }
.prose :deep(ul) { list-style: disc; padding-left: 1.25rem; }
.prose :deep(ol) { list-style: decimal; padding-left: 1.25rem; }
</style>
