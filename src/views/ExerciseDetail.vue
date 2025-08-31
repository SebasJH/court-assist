<template>
  <PageHeader :title="exercise ? exercise.name : 'Oefening'" :mobileBack="isSmallScreen" :hideHamburgerWhenBack="true">
    <template #lead>
      <div class="flex items-center gap-3 min-w-0">
        <!-- Desktop back button (chevron) -->
        <router-link
          to="/oefeningen"
          class="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600 flex-shrink-0"
          aria-label="Terug"
          title="Terug naar oefeningen"
        >
          <ChevronLeft class="w-5 h-5" />
        </router-link>
        <!-- Title only -->
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-50 leading-tight truncate">{{ exercise ? exercise.name : 'Oefening' }}</h1>
      </div>
    </template>
    <template #actions>

      <div v-if="exercise" class="relative flex items-center gap-2" ref="actionsRef">

        <!-- Menu button and dropdown -->
        <div class="relative">
          <button
            ref="menuButtonRef"
            type="button"
            class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600 transition-colors duration-200"
            aria-haspopup="menu"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            aria-label="Acties"
            @click="toggleMenu"
          >
            <MoreVertical class="w-5 h-5" />
          </button>
          <div v-if="menuOpen" ref="menuRef" class="dropdown-menu absolute top-full right-0 mt-2 w-64 whitespace-nowrap border rounded-md shadow-lg flex flex-col z-[4000]">
            <button @click="onEdit" class="dropdown-item">
              <Pencil class="w-fit h-4" />
              Wijzigen
            </button>
            <button @click="onDuplicate" class="dropdown-item">
              <Copy class="w-fit h-4" />
              Dupliceren
            </button>
            <button @click="onToggleFavFromMenu" class="dropdown-item">
              <Star class="w-fit h-4" :class="exercise && exercise.favorite ? 'text-yellow-500' : ''" :fill="exercise && exercise.favorite ? 'currentColor' : 'none'" :stroke="'currentColor'" />
              <span>{{ (exercise && exercise.favorite) ? 'Verwijder uit favorieten' : 'Markeer als favoriet' }}</span>
            </button>
            <button @click="onDelete" class="dropdown-item dropdown-delete">
              <Trash class="w-fit h-4" />
              Verwijderen
            </button>
          </div>
        </div>
      </div>
    </template>
  </PageHeader>

  <div class="container mx-auto px-4 py-6" v-if="exercise">

    <!-- Delete confirm modal -->
    <modal :open="showDeleteModal" @close="cancelDelete" contentPaddingClass="p-0">
          <template #title>Bevestig verwijderen</template>
      <DeleteConfirm :name="deleteName" @cancel="cancelDelete" @confirm="confirmDelete"/>
    </modal>


    <div class="exercise-detail grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div :class="showRightSidebar ? 'lg:col-span-2' : 'lg:col-span-3'">
        <div class="bg-white dark:bg-gray-750 rounded-lg shadow-md overflow-hidden">

          <!-- Meta: icon + categories -->
          <section class="p-6 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center gap-3 min-w-0">
              <component :is="exercise.icon || 'TrafficCone'" class="w-8 h-8 text-gray-700 dark:text-gray-100" />
              <div class="flex flex-wrap gap-1 text-xs">
                <span v-for="c in (Array.isArray(exercise.category)?exercise.category:(exercise.category?[exercise.category]:[]))" :key="c" class="exercise-category text-xs px-2 py-1 rounded-full whitespace-nowrap bg-blue-100 text-blue-800  dark:bg-blue-500/20 dark:text-blue-300">{{ c }}</span>
                <span v-if="(!exercise.category || (Array.isArray(exercise.category) && exercise.category.length===0))" class="text-gray-400">Geen categorie</span>
              </div>
            </div>
          </section>
          <!-- Beschrijving -->
          <section v-if="hasDescription" class="p-6">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Beschrijving</h2>
            </div>
            <div class="prose max-w-none text-gray-600 dark:text-gray-300" v-html="descriptionHtml"></div>
          </section>


          <!-- Uitvoering -->
          <section v-if="exercise.execution || exercise.howItWorks" class="p-6 border-t border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Uitvoering</h2>
            </div>
            <div class="prose max-w-none text-gray-600 dark:text-gray-300" v-html="exercise.execution || exercise.howItWorks"></div>
          </section>

          <!-- Images -->
          <section v-if="Array.isArray(exercise.diagrams) && exercise.diagrams.length" class="p-6 border-t border-gray-200 dark:border-gray-600">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-3">Afbeeldingen</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="(d, i) in exercise.diagrams" :key="i" class="border rounded-md overflow-hidden bg-gray-50">
                <div class="bg-white">
                  <img v-if="d && d.src" :src="d.src" alt="Diagram" class="w-full h-56 object-contain bg-white cursor-zoom-in" @click="openLightbox(i)"/>
                  <div v-else class="w-full h-56 flex items-center justify-center text-gray-400 text-sm bg-white">Geen afbeelding</div>
                </div>
                <div v-if="d && d.caption" class="px-3 py-2 text-sm text-gray-700 border-t"><div class="prose max-w-none" v-html="d.caption"></div></div>
              </div>
            </div>
          </section>

          <!-- Coaching punten -->
          <section v-if="exercise.coachingPoints || exercise.fullDescription" class="p-6 border-t border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Coaching punten</h2>
            </div>
            <div class="rounded-md border border-blue-200 bg-blue-100/60 dark:bg-blue-500/20 dark:text-blue-300  dark:border-blue-500/20 p-4">
              <div class="prose max-w-none" v-html="exercise.coachingPoints || exercise.fullDescription"></div>
            </div>
          </section>

          <!-- Variaties -->
          <section v-if="exercise.variations" class="p-6 border-t border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Variaties</h2>
            </div>
            <div class="prose max-w-none text-gray-600 dark:text-gray-300" v-html="exercise.variations"></div>
          </section>

          <!-- Notities -->
          <section class="p-6 border-t border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Notities</h2>
            </div>
            <div v-if="exercise.notes && exercise.notes.trim().length" class="prose max-w-none text-gray-600 dark:text-gray-300" v-html="exercise.notes"></div>
            <div v-else class="text-gray-500 text-sm">Nog geen notities. Klik op het potlood om toe te voegen.</div>
          </section>
        </div>
      </div>

      <div v-if="showRightSidebar" class="relative lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
        <div class="bg-white dark:bg-gray-750 rounded-lg shadow-md overflow-hidden order-2 lg:order-none p-6 space-y-6">
          <!-- Details -->
          <section v-if="hasAnyDetails">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Details</h2>
            </div>
            <div class="flex flex-row flex-wrap gap-1.5 text-gray-800">
              <!-- Players -->
              <div v-if="showPlayers" class="relative" ref="playersRef" @mouseenter="onEnterPlayers" @mouseleave="onLeavePlayers">
                <div class="exercise-badge">
                  <Users class="h-4 w-fit text-green-500 dark:text-green-300" />
                  <div>{{ playersLabel }}</div>
                </div>
              </div>

              <!-- Duration -->
              <div v-if="hasDuration" class="relative" ref="durationRef" @mouseenter="onEnterDuration" @mouseleave="onLeaveDuration">
                <div class="exercise-badge px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:shadow-sm transition-colors duration-150">
                  <TimerReset class="h-4 w-fit text-blue-500 dark:text-blue-300" />
                  <div>{{ exercise.duration }} min</div>
                </div>
              </div>

              <!-- Intensity -->
              <div v-if="typeof exercise.intensity === 'number'" class="relative" ref="intensityRef" @mouseenter="onEnterIntensity" @mouseleave="onLeaveIntensity">
                <div class="exercise-badge px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:shadow-sm transition-colors duration-150">
                  <Zap class="h-4 w-fit text-yellow-500 dark:text-yellow-300" />
                  <div>{{ exercise.intensity }}/5</div>
                </div>
              </div>

              <!-- Court -->
              <div v-if="hasCourt" class="relative" ref="courtRef" @mouseenter="onEnterCourt" @mouseleave="onLeaveCourt">
                <div class="exercise-badge px-2 py-1 rounded-lg text-sm flex items-center gap-1 hover:shadow-sm transition-colors duration-150">
                  <RectangleCircle class="h-4 w-fit text-red-500 dark:text-red-300" />
                  <div>{{ courtLabel }}</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Materialen -->
          <section v-if="exercise.materials && exercise.materials.length">
            <div class="text-sm font-medium text-gray-700 mb-2 inline-flex items-center gap-1">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Materialen</h2>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="m in exercise.materials" :key="m" class="px-2 py-1 rounded-lg text-sm bg-orange-50 text-orange-800 border border-orange-200">{{ m }}</span>
            </div>
          </section>

          <!-- Video -->
          <section v-if="exercise.video">
            <div class="text-sm font-medium text-gray-700 mb-2 inline-flex items-center gap-1">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Video</h2>
            </div>
            <div v-if="youtubeEmbedUrl" class="aspect-video rounded-md overflow-hidden border dark:border-gray-600 bg-black/5">
              <iframe :src="youtubeEmbedUrl" title="YouTube video" class="w-full h-full" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen></iframe>
            </div>
            <div v-else>
              <a :href="exercise.video" target="_blank" rel="noopener" class="text-blue-500 hover:underline">Bekijk video</a>
            </div>
          </section>
        </div>
      </div>
  </div>
  </div>

  <div v-else class="container mx-auto px-4 py-12 text-center text-gray-600">
    <p>Oefening niet gevonden.</p>
    <router-link to="/oefeningen" class="text-blue-500 hover:underline block mt-2">Terug</router-link>
  </div>

  <!-- Lightbox overlay -->
  <teleport to="body">
    <div v-if="lightboxOpen" class="fixed inset-0 z-[6000] bg-black/80 text-white flex flex-col">
      <!-- Top-right close -->
      <button class="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition transform hover:scale-105" aria-label="Sluiten" title="Sluiten" @click="closeLightbox">
        <X class="w-5 h-5" />
      </button>

      <!-- Image area -->
      <div class="py-4 flex-1 flex items-center justify-center relative select-none" @click.self="closeLightbox" :style="{ paddingBottom: lightboxCaptionPadding }">
        <!-- Prev -->
        <button v-if="hasMultipleImages" class="fixed top-1/2 -translate-y-1/2 transform left-3 md:left-6 z-10 inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30" aria-label="Vorige afbeelding" @click.stop="prevImage">
          <ChevronLeft class="w-6 h-6" />
        </button>

        <img v-if="currentDiagram && currentDiagram.src" :src="currentDiagram.src" alt="Diagram" class="max-w-[95vw] object-contain" :style="{ maxHeight: imageMaxHeight }" @click.stop @load="measureCaption" />

        <!-- Next -->
        <button v-if="hasMultipleImages" class="fixed top-1/2 -translate-y-1/2 transform right-3 md:right-6 z-10 inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30" aria-label="Volgende afbeelding" @click.stop="nextImage">
          <ChevronLeft class="w-6 h-6 rotate-180" />
        </button>
      </div>

      <!-- Caption (fixed at bottom, max 160px, scrollable with padding) -->
      <div v-if="currentDiagram && currentDiagram.caption" ref="captionEl" class="fixed max-h-[160px] bottom-0 left-0 right-0 w-full p-4 sm:p-5 md:p-6 bg-white text-black border-t border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div class="prose max-w-4xl mx-auto" v-html="currentDiagram.caption"></div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '../store'
import PageHeader from '../components/PageHeader.vue'
import Modal from '../components/Modal.vue'
import DeleteConfirm from '../components/DeleteConfirm.vue'
import { isNum, hasPlayers, hasDuration as hasDurationField, hasCourt as hasCourtField, formatPlayersFromExercise, formatCourtFromExercise } from '../utils/exerciseFormat'

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

const isSmallScreen = ref(false)
function updateSmallScreen(){
  try { isSmallScreen.value = (window.innerWidth || document.documentElement.clientWidth) < 768 } catch(_) { isSmallScreen.value = false }
}

const exercise = computed(() => {
  const list = store.state.exercises
  const target = String(slug.value || '')
  return list.find(e => slugify(e.name) === target)
})

// Beschrijving helpers
const descriptionHtml = computed(() => (exercise.value?.description || exercise.value?.shortDescription || ''))
function stripHtmlLikeText(html) {
  try {
    return String(html || '')
      .replace(/<[^>]*>/g, ' ') // remove tags
      .replace(/&nbsp;|&#160;/g, ' ') // non-breaking spaces
      .replace(/&amp;/g, '&')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width chars
      .replace(/\s+/g, ' ') // collapse whitespace
      .trim()
  } catch (_) {
    return ''
  }
}
const hasDescription = computed(() => stripHtmlLikeText(descriptionHtml.value).length > 0)

// Badge tooltips and labels (match ExerciseCardItem)
const playersRef = ref(null)
const durationRef = ref(null)
const intensityRef = ref(null)
const courtRef = ref(null)

const playersOpen = ref(false)
const durationOpen = ref(false)
const intensityOpen = ref(false)
const courtOpen = ref(false)

function onEnterPlayers(){ playersOpen.value = true }
function onLeavePlayers(){ playersOpen.value = false }
function onEnterDuration(){ durationOpen.value = true }
function onLeaveDuration(){ durationOpen.value = false }
function onEnterIntensity(){ intensityOpen.value = true }
function onLeaveIntensity(){ intensityOpen.value = false }
function onEnterCourt(){ courtOpen.value = true }
function onLeaveCourt(){ courtOpen.value = false }

const showPlayers = computed(() => hasPlayers(exercise.value?.minPlayers, exercise.value?.maxPlayers))
const playersLabel = computed(() => formatPlayersFromExercise(exercise.value, { variant: 'compact' }))
const hasDuration = computed(() => hasDurationField(exercise.value?.duration))
const hasCourt = computed(() => hasCourtField(exercise.value?.court))
const courtLabel = computed(() => formatCourtFromExercise(exercise.value, { variant: 'compact' }))

// Sidebar visibility flags
const hasMaterials = computed(() => Array.isArray(exercise.value?.materials) && exercise.value.materials.length > 0)
const hasIntensityField = computed(() => typeof exercise.value?.intensity === 'number')
const hasAnyDetails = computed(() => showPlayers.value || hasDuration.value || hasIntensityField.value || hasCourt.value)
const hasVideo = computed(() => !!exercise.value?.video)
const showRightSidebar = computed(() => hasAnyDetails.value || hasMaterials.value || hasVideo.value)


const playersTooltip = computed(() => {
  const min = isNum(exercise.value?.minPlayers) ? exercise.value.minPlayers : null
  const max = isNum(exercise.value?.maxPlayers) ? exercise.value.maxPlayers : null
  let body = ''
  if (min !== null && max !== null) {
    body = `Geschikt voor ${min} tot ${max} spelers`
  } else if (min !== null) {
    body = `Minimaal ${min} spelers nodig`
  } else if (max !== null) {
    body = `Maximaal ${max} spelers`
  }
  return { title: 'Aantal spelers', body }
})
const durationTooltip = computed(() => {
  const d = (typeof exercise.value?.duration === 'number' && exercise.value.duration > 0)
    ? exercise.value.duration
    : ((typeof exercise.value?.minutes === 'number' && exercise.value.minutes > 0) ? exercise.value.minutes : null)
  return { title: 'Tijd van de oefening', body: d !== null ? `De oefening duurt gemiddeld ${d} minuten` : 'Aantal minuten dat de oefening duurt' }
})
const intensityTooltip = computed(() => ({
  title: 'Intensiteit',
  body: `Zwaarte van de oefening (1 = licht · 5 = zwaar) · Huidig: ${exercise.value?.intensity}/5`
}))
const courtTooltip = computed(() => {
  const v = courtLabel.value
  if (!v) return { title: 'Veldtype', body: 'Geen veldtype opgegeven' }
  return { title: 'Veldtype', body: v === 'Half' ? 'Half court' : (v === 'Full' ? 'Full court' : v) }
})

function extractYouTubeId(url) {
  try {
    const u = String(url || '')
    // Patterns: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID, youtube.com/embed/ID
    const short = u.match(/youtu\.be\/([\w-]{6,})/i)
    if (short && short[1]) return short[1]
    const watch = u.match(/[?&]v=([\w-]{6,})/i)
    if (watch && watch[1]) return watch[1]
    const shorts = u.match(/youtube\.com\/shorts\/([\w-]{6,})/i)
    if (shorts && shorts[1]) return shorts[1]
    const embed = u.match(/youtube\.com\/embed\/([\w-]{6,})/i)
    if (embed && embed[1]) return embed[1]
  } catch (_) {}
  return ''
}

const youtubeEmbedUrl = computed(() => {
  const id = extractYouTubeId(exercise.value?.video)
  return id ? `https://www.youtube.com/embed/${id}` : ''
})

// Lightbox state for diagrams
const lightboxOpen = ref(false)
const currentIndex = ref(0)
const currentDiagram = computed(() => {
  const arr = Array.isArray(exercise.value?.diagrams) ? exercise.value.diagrams : []
  const i = currentIndex.value
  const d = arr[i]
  return (d && d.src) ? d : null
})

const hasMultipleImages = computed(() => {
  const arr = Array.isArray(exercise.value?.diagrams) ? exercise.value.diagrams : []
  const count = arr.filter(d => d && d.src).length
  return count >= 2
})

function openLightbox(i) {
  try {
    const idx = Number.isInteger(i) ? i : 0
    currentIndex.value = Math.max(0, idx)
    lightboxOpen.value = true
  } catch (_) {
    lightboxOpen.value = true
  }
}
function closeLightbox() { lightboxOpen.value = false }

function nextImage() {
  const arr = Array.isArray(exercise.value?.diagrams) ? exercise.value.diagrams : []
  if (!arr.length) return
  let i = currentIndex.value
  for (let step = 0; step < arr.length; step++) {
    i = (i + 1) % arr.length
    if (arr[i] && arr[i].src) { currentIndex.value = i; break }
  }
}
function prevImage() {
  const arr = Array.isArray(exercise.value?.diagrams) ? exercise.value.diagrams : []
  if (!arr.length) return
  let i = currentIndex.value
  for (let step = 0; step < arr.length; step++) {
    i = (i - 1 + arr.length) % arr.length
    if (arr[i] && arr[i].src) { currentIndex.value = i; break }
  }
}

function onLightboxKeydown(e) {
  if (!lightboxOpen.value) return
  if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !hasMultipleImages.value) return
  if (e.key === 'ArrowRight') { e.preventDefault?.(); nextImage() }
  else if (e.key === 'ArrowLeft') { e.preventDefault?.(); prevImage() }
  else if (e.key === 'Escape') { e.preventDefault?.(); closeLightbox() }
}

// Lightbox caption measurement and dynamic sizing
const captionEl = ref(null)
const captionHeight = ref(0)

function measureCaption() {
  try {
    const el = captionEl.value
    const h = el ? Math.round(el.getBoundingClientRect().height) : 0
    captionHeight.value = Number.isFinite(h) ? Math.max(0, h) : 0
  } catch (_) {
    captionHeight.value = 0
  }
}

const CAPTION_GAP = 16
const lightboxCaptionPadding = computed(() => (captionHeight.value > 0 ? `${captionHeight.value + CAPTION_GAP}px` : '0px'))
const imageMaxHeight = computed(() => `calc(100vh - ${Math.max(0, captionHeight.value + CAPTION_GAP)}px - 16px)`) // 16px = top padding (py-4)

watch([lightboxOpen, currentDiagram], async ([open]) => {
  if (open) {
    await nextTick()
    measureCaption()
  } else {
    captionHeight.value = 0
  }
})

// Measure on resize as well
function onWindowResizeMeasure() {
  if (!lightboxOpen.value) return
  measureCaption()
}


// Edit modal state
// Removed modal edit state in favor of dedicated edit page
const formTab = ref('basis')
const showDeleteModal = ref(false)

// Edit specific sections state

// Notes editing state
const showEditNotes = ref(false)
const notesDraft = ref('')

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

function openEditNotes() {
  const current = exercise.value
  notesDraft.value = (current?.notes || '')
  showEditNotes.value = true
}
function closeEditNotes() { showEditNotes.value = false }
function saveEditNotes() {
  if (!exercise.value) return closeEditNotes()
  const payload = { id: exercise.value.id, notes: String(notesDraft.value || '') }
  store.updateExercise(exercise.value.id, payload)
  closeEditNotes()
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


function openEditDetails(){
  const cur = exercise.value || {}
  detailsDraft.value = {
    minPlayers: (typeof cur.minPlayers === 'number') ? cur.minPlayers : null,
    maxPlayers: (typeof cur.maxPlayers === 'number') ? cur.maxPlayers : null,
    duration: (typeof cur.duration === 'number') ? cur.duration : null,
    intensity: (typeof cur.intensity === 'number') ? cur.intensity : null,
    courtNorm: normalizeCourt(cur.court || ''),
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
  try {
    const s = String(slug.value || '')
    const q = (formTab && formTab.value) ? `?tab=${formTab.value}` : ''
    const sep = q ? '&' : '?'
    router.push(`/oefening/${s}/bewerken${q}${sep}from=detail`)
  } catch (_) {
    // no-op fallback
  }
}
function openEditText() {
  try { formTab.value = 'tekst' } catch (_) {}
  openForm()
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
  // Initialize small-screen state and listen for viewport changes
  updateSmallScreen()
  window.addEventListener('resize', updateSmallScreen)
  window.addEventListener('resize', onWindowResizeMeasure)
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('keydown', onLightboxKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSmallScreen)
  window.removeEventListener('resize', onWindowResizeMeasure)
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('keydown', onLightboxKeydown)
})

function toggleFav() {
  if (!exercise.value) return
  store.toggleFavorite(exercise.value.id)
}
function onToggleFavFromMenu() {
  toggleFav()
  menuOpen.value = false
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
.badge {
  @apply w-fit px-2 py-1 text-xs font-medium rounded-full;
}
.prose :deep(ul) {
  list-style: disc; padding-left: 1.25rem;
}
.prose :deep(ol) {
  list-style: decimal; padding-left: 1.25rem;
}

</style>
