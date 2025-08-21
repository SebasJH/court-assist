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

    <!-- Edit description modal -->
    <modal v-if="showEditDescription" @close="closeEditDescription">
      <div class="px-5 pt-5 pb-3 border-b">
        <h3 class="text-lg font-semibold text-gray-800">Beschrijving bewerken</h3>
      </div>
      <div class="p-5">
        <label class="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
        <textarea v-model="descDraft" class="form-input h-40 w-full resize-none" placeholder="Beschrijving"></textarea>
      </div>
      <div class="px-5 py-4 border-t  flex justify-end gap-2">
        <button class="btn-secondary" @click="closeEditDescription">Annuleren</button>
        <button class="btn-primary" @click="saveEditDescription">Opslaan</button>
      </div>
    </modal>

    <!-- Edit details modal -->
    <modal v-if="showEditDetails" @close="closeEditDetails">
      <div class="px-5 pt-5 pb-3 border-b">
        <h3 class="text-lg font-semibold text-gray-800">Details bewerken</h3>
      </div>
      <div class="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Players -->
        <div class="form-group col-span-4 md:col-span-2">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"><Users class="w-4 h-4" /> Aantal spelers</label>
          <RangeNumber
            idPrefix="details-players"
            :modelValue="[(typeof detailsDraft.minPlayers === 'number' ? detailsDraft.minPlayers : 1), (typeof detailsDraft.maxPlayers === 'number' ? detailsDraft.maxPlayers : 20)]"
            :min="1"
            :max="20"
            :step="1"
            :attachedLabels="true"
            minLabel="min"
            maxLabel="max"
            @update:modelValue="([lo, hi]) => { detailsDraft.minPlayers = lo; detailsDraft.maxPlayers = hi }"
          />
        </div>
        <!-- Duration -->
        <div class="form-group col-span-4 md:col-span-2">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"><TimerReset class="w-4 h-4" /> Duur</label>
          <div class="flex">
            <input type="number" v-model.number="detailsDraft.duration" min="1" class="form-input !rounded-r-none border-r-0" aria-label="Duur" />
            <div class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center text-gray-600 text-sm">minuten</div>
          </div>
        </div>
        <!-- Intensity -->
        <div class="form-group col-span-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"><span class="inline-flex items-center gap-1"><Zap class="w-4 h-4" /> Intensiteit</span></label>
          <IntensitySelector v-model="detailsDraft.intensity" />
        </div>
        <!-- Court -->
        <div class="form-group col-span-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"><span class="inline-flex items-center gap-1"><RectangleCircle class="w-4 h-4" /> Veld</span></label>
          <div class="inline-flex rounded-md overflow-hidden border border-gray-300">
            <button type="button" class="px-3 py-2 text-sm font-medium focus:outline-none" :class="detailsDraft.courtNorm === 'halfcourt' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'" @click="toggleCourt('halfcourt')">Half court</button>
            <button type="button" class="px-3 py-2 text-sm font-medium border-l border-gray-300 focus:outline-none" :class="detailsDraft.courtNorm === 'fullcourt' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'" @click="toggleCourt('fullcourt')">Full court</button>
          </div>
          <button v-if="detailsDraft.courtNorm" type="button" class="ml-3 text-sm text-gray-600 hover:text-gray-800 underline" @click="toggleCourt('')">Wissen</button>
        </div>
        <!-- Materials -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="block text-sm font-medium text-gray-700 mb-1 inline-flex items-center gap-1"><TrafficCone class="w-4 h-4" /> Materialen</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="m in materialOptions" :key="m" type="button" @click="toggleMaterial(m)" :class="detailsDraft.materials.includes(m) ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100 text-gray-800'" class="px-2 py-1 rounded cursor-pointer text-sm">
              {{ m }}
            </button>
          </div>
        </div>
      </div>
      <div class="px-5 py-4 border-t  flex justify-end gap-2">
        <button class="btn-secondary" @click="closeEditDetails">Annuleren</button>
        <button class="btn-primary" @click="saveEditDetails">Opslaan</button>
      </div>
    </modal>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-semibold text-gray-800">Beschrijving</h2>
            <button class="text-gray-500 hover:text-gray-700" @click="openEditDescription" aria-label="Beschrijving bewerken">
              <Pencil class="w-4 h-4" />
            </button>
          </div>
          <p class="text-gray-700 leading-relaxed">{{ exercise.description || exercise.shortDescription }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Coaching punten</h2>
          <div class="prose max-w-none" v-html="exercise.coachingPoints || exercise.fullDescription"></div>
        </div>

        <div v-if="exercise.howItWorks" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">How it works</h2>
          <div class="prose max-w-none" v-html="exercise.howItWorks"></div>
        </div>

        <div v-if="exercise.purpose" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Purpose</h2>
          <div class="prose max-w-none" v-html="exercise.purpose"></div>
        </div>

        <div v-if="Array.isArray(exercise.diagrams) && exercise.diagrams.length" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Diagrams</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="(d, i) in exercise.diagrams" :key="i" class="border rounded-md overflow-hidden bg-gray-50">
              <div class="bg-white">
                <img v-if="d && d.src" :src="d.src" alt="Diagram" class="w-full h-56 object-contain bg-white"/>
                <div v-else class="w-full h-56 flex items-center justify-center text-gray-400 text-sm bg-white">Geen afbeelding</div>
              </div>
              <div v-if="d && d.caption" class="px-3 py-2 text-sm text-gray-700 border-t">{{ d.caption }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold text-gray-800">Details</h2>
            <button class="text-gray-500 hover:text-gray-700" @click="openEditDetails" aria-label="Details bewerken">
              <Pencil class="w-4 h-4" />
            </button>
          </div>
          <div class="flex flex-col gap-1.5  text-gray-800">
            <ExerciseBadge :exercise="exercise" kind="players" variant="detail" />
            <ExerciseBadge :exercise="exercise" kind="duration" variant="detail" />
            <ExerciseBadge :exercise="exercise" kind="court" variant="detail" />
            <ExerciseBadge :exercise="exercise" kind="intensity" variant="detail" />
          </div>

          <div v-if="exercise.materials && exercise.materials.length" class="mt-4">
            <div class="text-sm font-medium text-gray-700 mb-1 inline-flex items-center gap-1">
              <TrafficCone class="w-4 h-4" />
              Materialen
            </div>
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
import ExerciseBadge from '../components/ExerciseBadge.vue'
import IntensitySelector from '../components/form/IntensitySelector.vue'
import RangeNumber from '../components/form/RangeNumber.vue'
import { EXERCISE_CATEGORIES, EXERCISE_MATERIALS } from '../constants'

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
const materialOptions = EXERCISE_MATERIALS

// Edit specific sections state
const showEditDescription = ref(false)
const descDraft = ref('')

function openEditDescription() {
  const current = exercise.value
  descDraft.value = (current?.description || current?.shortDescription || '')
  showEditDescription.value = true
}
function closeEditDescription() { showEditDescription.value = false }
function saveEditDescription() {
  if (!exercise.value) return closeEditDescription()
  const payload = { id: exercise.value.id, description: String(descDraft.value || '') }
  store.updateExercise(exercise.value.id, payload)
  closeEditDescription()
}

const showEditDetails = ref(false)
const detailsDraft = ref({
  minPlayers: null,
  maxPlayers: null,
  duration: null,
  intensity: null,
  courtNorm: '',
  materials: []
})

function normalizeCourtLocal(val){
  const v = (val || '').toString().toLowerCase().trim().replace(/\s+/g, '')
  if (v === 'halfcourt') return 'halfcourt'
  if (v === 'fullcourt') return 'fullcourt'
  return ''
}

function openEditDetails(){
  const cur = exercise.value || {}
  detailsDraft.value = {
    minPlayers: (typeof cur.minPlayers === 'number') ? cur.minPlayers : null,
    maxPlayers: (typeof cur.maxPlayers === 'number') ? cur.maxPlayers : null,
    duration: (typeof cur.duration === 'number') ? cur.duration : null,
    intensity: (typeof cur.intensity === 'number') ? cur.intensity : null,
    courtNorm: normalizeCourtLocal(cur.court || ''),
    materials: Array.isArray(cur.materials) ? [...cur.materials] : []
  }
  showEditDetails.value = true
}
function closeEditDetails(){ showEditDetails.value = false }

function toggleCourt(kind){
  const k = String(kind || '').toLowerCase().trim()
  if (!k) { detailsDraft.value.courtNorm = ''; return }
  detailsDraft.value.courtNorm = (detailsDraft.value.courtNorm === k) ? '' : k
}
function toggleMaterial(m){
  const arr = Array.isArray(detailsDraft.value.materials) ? detailsDraft.value.materials : []
  const idx = arr.indexOf(m)
  if (idx > -1) arr.splice(idx, 1); else arr.push(m)
  detailsDraft.value.materials = [...arr]
}

function clamp(n, min, max){
  const v = Number.parseInt(n, 10)
  if (!Number.isFinite(v)) return null
  return Math.max(min, Math.min(max, v))
}

function saveEditDetails(){
  if (!exercise.value) return closeEditDetails()
  const d = detailsDraft.value
  let minP = (typeof d.minPlayers === 'number') ? clamp(d.minPlayers, 1, 20) : null
  let maxP = (typeof d.maxPlayers === 'number') ? clamp(d.maxPlayers, 1, 20) : null
  if (minP !== null && maxP !== null && maxP < minP) maxP = minP
  const dur = (typeof d.duration === 'number') ? Math.max(1, Math.floor(d.duration)) : null
  const inten = (typeof d.intensity === 'number') ? clamp(d.intensity, 1, 5) : null
  const courtNorm = d.courtNorm === 'halfcourt' ? 'half court' : (d.courtNorm === 'fullcourt' ? 'full court' : '')
  const materials = Array.isArray(d.materials) ? d.materials.slice() : []
  const payload = {
    id: exercise.value.id,
    minPlayers: minP,
    maxPlayers: maxP,
    duration: Number.isFinite(dur) ? dur : null,
    intensity: inten,
    court: courtNorm,
    materials
  }
  store.updateExercise(exercise.value.id, payload)
  closeEditDetails()
}

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
