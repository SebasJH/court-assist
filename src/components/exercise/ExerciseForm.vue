<template>
  <form class="flex h-full flex-col" @submit.prevent="save" novalidate>

    <div class="sticky top-0 z-10 bg-white backdrop-blur-sm px-5 sm:px-10 pt-5 pb-0 border-b">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-xl font-bold text-gray-800">
          {{ initial ? 'Wijzig oefening' : 'Nieuwe oefening' }}
        </h3>
        <button
          type="button"
          class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label="Sluiten"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="mt-4 -mb-px overflow-x-auto">
        <div role="tablist" class="inline-flex items-center gap-2 border-b border-gray-200">
          <button type="button" role="tab" :aria-selected="currentTab==='basis' ? 'true' : 'false'"
                  @click="currentTab='basis'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="currentTab==='basis' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'">
            Basis
          </button>
          <button type="button" role="tab" :aria-selected="currentTab==='details' ? 'true' : 'false'"
                  @click="currentTab='details'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="currentTab==='details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'">
            Details
          </button>
          <button type="button" role="tab" :aria-selected="currentTab==='tekst' ? 'true' : 'false'"
                  @click="currentTab='tekst'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="currentTab==='tekst' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'">
            Tekst
          </button>
          <button type="button" role="tab" :aria-selected="currentTab==='media' ? 'true' : 'false'"
                  @click="currentTab='media'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="currentTab==='media' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'">
            Media
          </button>
        </div>
      </div>
    </div>

    <div class="px-5 sm:px-10 py-5 flex-1 overflow-y-auto">
      <!-- Basis -->
      <div v-show="currentTab==='basis'" class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Name -->
        <div class="form-group col-span-4 md:col-span-3" ref="nameGroupRef">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Naam <span class="text-red-500" aria-hidden="true">*</span>
            <span v-if="errors.name" class="ml-2 text-xs font-semibold text-red-600">{{ errors.name }}</span>
          </label>
          <input
              ref="nameInputRef"
              v-model="form.name"
              placeholder="Naam"
              class="form-input"
              :class="errors.name ? '!border-red-500 focus:!border-red-500 !ring-1 !ring-red-500 focus:!ring-red-500' : ''"
              aria-required="true"
              :aria-invalid="errors.name ? 'true' : 'false'"
          />
        </div>

        <!-- Icon -->
        <div class="form-group col-span-4 md:col-span-1">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Shapes class="w-4 h-4"/> Icoon
          </label>
          <IconPicker v-model="form.icon" :icons="placeholderIcons"/>
        </div>

        <!-- Description -->
        <div class="form-group col-span-4">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Text class="w-4 h-4"/> Beschrijving
          </label>
          <textarea v-model="form.description" placeholder="Beschrijving"
                    class="form-input h-24 resize-none"></textarea>
        </div>

        <!-- Exercise Categories -->
        <div class="form-group col-span-4">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Tag class="w-4 h-4"/> Categorieën
          </label>

          <div class="flex flex-wrap gap-2">
            <button
                v-for="c in categories"
                :key="c"
                type="button"
                @click="toggleCategory(c)"
                :class="form.category.includes(c)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-blue-100 text-gray-800'"
                class="px-2 py-1 rounded cursor-pointer"
            >
              {{ c }}
            </button>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div v-show="currentTab==='details'" class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Amount of players -->
        <div class="form-group col-span-4 md:col-span-2" ref="playersGroupRef">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Users class="w-4 h-4"/> Aantal spelers
            <span v-if="errors.players" class="ml-2 text-xs font-semibold text-red-600">{{ errors.players }}</span>
          </label>
          <div class="flex gap-x-2">

            <!-- Min players -->
            <div class="flex w-full">
              <input
                  type="number"
                  v-model.number="form.minPlayers"
                  min="1"
                  :max="50"
                  :class="['form-input !rounded-r-none border-r-0', errors.players ? '!border-red-500 focus:!border-red-500 !ring-1 !ring-red-500 focus:!ring-red-500' : '']"
                  :aria-invalid="errors.players ? 'true' : 'false'"
              />
              <div
                  class="border border-gray-300 border-l-0 rounded-r-xl px-2 flex items-center text-gray-600 text-sm">
                min
              </div>
            </div>

            <!-- Max players -->
            <div class="relative flex w-full ml-2">
              <input
                  ref="maxPlayersInputRef"
                  type="number"
                  v-model.number="form.maxPlayers"
                  :min="(typeof form.minPlayers === 'number') ? form.minPlayers : null"
                  :max="50"
                  :class="['form-input !rounded-r-none border-r-0', errors.players ? '!border-red-500 focus:!border-red-500 !ring-1 !ring-red-500 focus:!ring-red-500' : '']"
                  :aria-invalid="errors.players ? 'true' : 'false'"
              />
              <div
                  class="border border-gray-300 border-l-0 rounded-r-xl px-2 flex items-center text-gray-600 text-sm">
                max
              </div>
              <!-- Ephemeral tip for max cap -->
              <div v-if="showMaxCapTip"
                   class="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-64 max-w-[18rem]">
                <div class="relative drop-shadow-xl">
                  <div class="bg-white border border-gray-200 rounded-lg p-2">
                    <div class="text-xs text-gray-700">
                      Je kunt maximaal 50 invullen. Laat het veld leeg als je geen limiet wilt.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Intensity -->
        <div class="form-group col-span-4 md:col-span-2">
          <label class="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <Zap class="w-4 h-4"/>
            Intensiteit
          </label>
          <IntensitySelector v-model="form.intensity"/>
        </div>

        <!-- Duration -->
        <div class="form-group col-span-4 md:col-span-2">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <TimerReset class="w-4 h-4"/> Duur
          </label>
          <div class="flex">
            <input
                type="number"
                v-model="form.duration"
                min="1"
                class="form-input !rounded-r-none !border-r-0"
            />
            <div
                class="border border-gray-300 border-l rounded-r-xl px-2 flex items-center text-gray-600 text-sm">
              minuten
            </div>
          </div>
        </div>

        <!-- Court -->
        <div class="form-group col-span-4 md:col-span-2">
          <label class="flex text-sm font-medium text-gray-700 mb-1">
            <span class="inline-flex items-center gap-1">
              <RectangleCircle class="w-4 h-4"/> Veldtype
            </span>
          </label>
          <div class="inline-flex rounded-md overflow-hidden border border-gray-300 h-10">
            <button
                type="button"
                class="px-3 h-10 text-sm font-medium focus:outline-none"
                :class="normalizedCourt === 'halfcourt' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
                @click="toggleCourt('halfcourt')"
                :aria-pressed="normalizedCourt === 'halfcourt' ? 'true' : 'false'"
            >Half court
            </button>
            <button
                type="button"
                class="px-3 h-10 text-sm font-medium border-l border-gray-300 focus:outline-none"
                :class="normalizedCourt === 'fullcourt' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
                @click="toggleCourt('fullcourt')"
                :aria-pressed="normalizedCourt === 'fullcourt' ? 'true' : 'false'"
            >Full court
            </button>
          </div>
          <button
              type="button"
              class="ml-3 text-sm text-gray-600 hover:text-gray-800 underline"
              @click="form.court = ''"
              v-if="form.court"
          >Wissen
          </button>
        </div>

        <!-- Materials -->
        <div class="form-group col-span-4">
          <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <TrafficCone class="w-4 h-4"/>
            Materialen
          </label>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="m in materialOptions"
                :key="m"
                type="button"
                @click="toggleMaterial(m)"
                :class="form.materials.includes(m)
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 hover:bg-green-100 text-gray-800'"
                class="px-2 py-1 rounded cursor-pointer"
            >
              {{ m }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tekst -->
      <div v-show="currentTab==='tekst'" class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Coaching points -->
        <div class="form-group col-span-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Coaching punten</label>
          <RichTextEditor v-model="form.coachingPoints" placeholder="Coaching punten"/>
        </div>

        <!-- How it works -->
        <div class="form-group col-span-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">How it works</label>
          <RichTextEditor v-model="form.howItWorks" placeholder="Uitleg van de uitvoering"/>
        </div>

        <!-- Purpose -->
        <div class="form-group col-span-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <RichTextEditor v-model="form.purpose" placeholder="Doel van de oefening"/>
        </div>

      </div>

      <!-- Media -->
      <div v-show="currentTab==='media'" class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Video -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Video link</label>
          <input v-model="form.video" placeholder="Video link" class="form-input"/>
        </div>

        <!-- Diagrams repeater -->
        <div class="form-group col-span-4">
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700">Diagrams</label>
            <UiButton color="secondary" class="!py-1 !px-2" @click="addDiagram">+ Voeg diagram toe</UiButton>
          </div>
          <div v-if="!form.diagrams || form.diagrams.length === 0"
               class="text-sm text-gray-500 border border-dashed border-gray-300 rounded-md p-4">
            Nog geen diagrams. Klik op “Voeg diagram toe”.
          </div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="(d, idx) in form.diagrams" :key="idx" class="border rounded-md p-3 bg-gray-50">
              <div class="flex flex-col md:flex-row gap-3">
                <div class="w-full md:w-48">
                  <div class="aspect-video bg-white border rounded flex items-center justify-center overflow-hidden">
                    <img v-if="d.src" :src="d.src" alt="Diagram preview" class="w-full h-full object-contain"/>
                    <div v-else class="text-gray-400 text-sm">Geen afbeelding</div>
                  </div>
                  <div class="mt-2 flex items-center gap-2">
                    <label class="btn-secondary !py-1 !px-2 cursor-pointer">
                      Kies afbeelding
                      <input type="file" accept="image/*" class="hidden" @change="onPickDiagram($event, idx)"/>
                    </label>
                    <button type="button" class="text-sm text-red-600 hover:underline" @click="removeDiagram(idx)">
                      Verwijderen
                    </button>
                  </div>
                </div>
                <div class="flex-1">
                  <label class="block text-sm text-gray-700 mb-1">Bijschrift</label>
                  <input v-model="d.caption" class="form-input" placeholder="Beschrijf dit diagram"/>
                  <div class="mt-3 flex gap-2">
                    <UiButton color="secondary" class="!py-1 !px-2" @click="moveDiagram(idx, -1)" :disabled="idx === 0">
                      Omhoog
                    </UiButton>
                    <UiButton color="secondary" class="!py-1 !px-2" @click="moveDiagram(idx, 1)"
                              :disabled="idx === form.diagrams.length - 1">Omlaag
                    </UiButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="px-5 sm:px-10 pt-5 border-t flex justify-end gap-3">
      <UiButton color="secondary" outline @click="$emit('close')">Annuleren</UiButton>
      <UiButton :color="isEdit ? 'primary' : 'success'" type="submit" class="btn-submit">
        {{ isEdit ? 'Opslaan' : 'Aanmaken' }}
      </UiButton>
    </div>
  </form>
</template>

<script>
import {ref, reactive, watch, computed, nextTick, onBeforeUnmount} from 'vue'
import store from '../../store'
import RichTextEditor from '../form/RichTextEditor.vue'
import IconPicker from '../form/IconPicker.vue'
import IntensitySelector from '../form/IntensitySelector.vue'
import {EXERCISE_MATERIALS} from '../../constants'
import UiButton from '../ui/Button.vue'

export default {
  components: {
    RichTextEditor,
    IconPicker,
    IntensitySelector,
    UiButton
  },
  props: {
    initial: {type: Object, default: null},
    categories: {type: Array, default: () => []}
  },
  setup(props, {emit}) {
    const emptyForm = () => ({
      id: null,
      name: '',
      description: '',
      coachingPoints: '',
      howItWorks: '',
      purpose: '',
      diagrams: [],
      category: [],
      minPlayers: null,
      maxPlayers: null,
      intensity: null,
      court: '',
      materials: [],
      duration: null,
      icon: 'TrafficCone',
      video: ''
    })

    const form = reactive(emptyForm())

    // Tabs state
    const currentTab = ref('basis')

    // Validation state and refs
    const errors = reactive({
      name: '',
      players: ''
    })
    const nameInputRef = ref(null)
    const nameGroupRef = ref(null)
    const playersGroupRef = ref(null)
    const maxPlayersInputRef = ref(null)
    const showMaxCapTip = ref(false)
    let maxCapTimer = null

    // Normalize court for reliable UI comparisons (e.g., 'Full court' vs 'fullcourt')
    const normalizedCourt = computed(() => {
      const v = (form.court || '').toString().toLowerCase().trim().replace(/\s+/g, '')
      if (v === 'halfcourt') return 'halfcourt'
      if (v === 'fullcourt') return 'fullcourt'
      return v
    })


    const placeholderIcons = [
      'TrafficCone',
      'Shield',
      'Target',
      'BicepsFlexed',
      'Dumbbell',
      'Crown',
      'Medal',
      'Trophy',
      'Shirt',
      'Eye',
      'Speech',
      'Activity',
      'Gauge',
      'Hourglass',
    ]

    // Gebruik gedeelde materialenlijst uit constants
    const materialOptions = EXERCISE_MATERIALS

    // Als initial wordt meegegeven, zet dit in het formulier
    watch(() => props.initial, (v) => {
      if (v) {
        const formData = {
          id: v.id,
          name: v.name || '',
          description: v.description || v.shortDescription || v.short || '',
          coachingPoints: v.coachingPoints || v.fullDescription || v.full || '',
          category: Array.isArray(v.category) ? [...v.category] : (v.category ? [v.category] : []),
          minPlayers: (typeof v.minPlayers === 'number') ? v.minPlayers : null,
          maxPlayers: (typeof v.maxPlayers === 'number') ? Math.min(50, v.maxPlayers) : null,
          intensity: (typeof v.intensity === 'number') ? v.intensity : null,
          court: v.court || '',
          materials: Array.isArray(v.materials) ? [...v.materials] : (v.materials ? [v.materials].flat().filter(Boolean) : []),
          duration: (typeof v.duration === 'number' ? v.duration : (typeof v.minutes === 'number' ? v.minutes : null)),
          icon: v.icon || v.imageIcon || 'TrafficCone',
          video: v.video || '',
          howItWorks: v.howItWorks || '',
          purpose: v.purpose || '',
          diagrams: Array.isArray(v.diagrams) ? v.diagrams.map(d => ({src: d.src || '', caption: d.caption || ''})) : []
        }
        Object.assign(form, formData)
      } else {
        Object.assign(form, emptyForm())
      }
    }, {immediate: true})

    // Clear errors as user types and clamp inputs to valid bounds
    watch(() => form.name, (v) => {
      if (v && errors.name) errors.name = ''
    })
    // Clamp minPlayers to [1..50] while allowing null
    watch(() => form.minPlayers, (v) => {
      if (typeof v === 'number') {
        if (v > 50) form.minPlayers = 50
        else if (v < 1) form.minPlayers = 1
      }
    })
    // Clamp maxPlayers to [1..50] while allowing null and show ephemeral tip if user tries > 50
    watch(() => form.maxPlayers, (v) => {
      if (typeof v === 'number') {
        if (v > 50) {
          const el = maxPlayersInputRef.value
          // Only show the tip when the user is actively editing this field
          if (el && document.activeElement === el) {
            if (maxCapTimer) clearTimeout(maxCapTimer)
            showMaxCapTip.value = true
            maxCapTimer = setTimeout(() => {
              showMaxCapTip.value = false
            }, 2000)
          }
          form.maxPlayers = 50
        } else if (v < 1) {
          form.maxPlayers = 1
        }
      }
    })
    // Clear players relation error when no longer invalid
    watch(() => [form.minPlayers, form.maxPlayers], () => {
      const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
      const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
      const cappedMax = (typeof max === 'number') ? Math.min(50, max) : null
      if (!(min !== null && cappedMax !== null && cappedMax < min)) {
        if (errors.players) errors.players = ''
      }
    })

    // Toggle categorie aan/uit
    function toggleCategory(c) {
      const index = form.category.indexOf(c)
      if (index > -1) {
        form.category.splice(index, 1) // verwijderen
      } else {
        form.category.push(c) // toevoegen
      }
    }

    // Toggle materiaal aan/uit
    function toggleMaterial(m) {
      const idx = form.materials.indexOf(m)
      if (idx > -1) {
        form.materials.splice(idx, 1)
      } else {
        form.materials.push(m)
      }
    }

    // Toggle intensiteit 1..5; klik op dezelfde waarde deselecteert
    function toggleIntensity(val) {
      const n = Number(val)
      if (!Number.isFinite(n)) return
      form.intensity = (form.intensity === n) ? null : n
    }

    // Toggle court knop (deselecteer indien opnieuw geklikt), using normalized comparison
    function toggleCourt(val) {
      const normVal = String(val || '').toLowerCase().trim().replace(/\s+/g, '')
      const isActive = normalizedCourt.value === normVal
      if (isActive) {
        form.court = ''
      } else {
        // Save canonical labels with a space for readability
        form.court = normVal === 'halfcourt' ? 'half court' : (normVal === 'fullcourt' ? 'full court' : val)
      }
    }

    // Diagrams helpers
    function addDiagram() {
      if (!Array.isArray(form.diagrams)) form.diagrams = []
      form.diagrams.push({src: '', caption: ''})
    }

    function removeDiagram(idx) {
      if (!Array.isArray(form.diagrams)) return
      if (idx < 0 || idx >= form.diagrams.length) return
      form.diagrams.splice(idx, 1)
    }

    function moveDiagram(idx, delta) {
      if (!Array.isArray(form.diagrams)) return
      const to = idx + delta
      if (to < 0 || to >= form.diagrams.length) return
      const item = form.diagrams[idx]
      form.diagrams.splice(idx, 1)
      form.diagrams.splice(to, 0, item)
    }

    function onPickDiagram(event, idx) {
      const files = event?.target?.files
      if (!files || !files[0]) return
      const file = files[0]
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        const url = String(reader.result || '')
        if (!Array.isArray(form.diagrams)) form.diagrams = []
        if (!form.diagrams[idx]) form.diagrams[idx] = {src: '', caption: ''}
        form.diagrams[idx].src = url
      }
      reader.readAsDataURL(file)
    }

    function validate() {
      // reset
      errors.name = ''
      errors.players = ''

      // Name required
      if (!form.name || String(form.name).trim().length === 0) {
        errors.name = 'Naam is verplicht'
      }

      // Players min/max relation
      const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
      const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
      const cappedMax = (typeof max === 'number') ? Math.min(50, max) : null
      if (min !== null && cappedMax !== null && cappedMax < min) {
        errors.players = 'Maximaal aantal mag niet lager zijn dan minimaal aantal'
      }

      return !errors.name && !errors.players
    }

    async function scrollToFirstError() {
      await nextTick()
      let target = null
      if (errors.name && nameGroupRef.value) target = nameGroupRef.value
      else if (errors.players && playersGroupRef.value) target = playersGroupRef.value
      if (target && typeof target.scrollIntoView === 'function') {
        try {
          target.scrollIntoView({behavior: 'smooth', block: 'center'})
        } catch (_) {
          target.scrollIntoView()
        }
      }
      if (errors.name && nameInputRef.value && typeof nameInputRef.value.focus === 'function') {
        nameInputRef.value.focus()
      }
    }

    function save() {
      if (!validate()) {
        // Switch to the relevant tab before scrolling to the first error
        if (errors.name) currentTab.value = 'basis'
        else if (errors.players) currentTab.value = 'details'
        nextTick(() => scrollToFirstError())
        return
      }

      const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
      const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
      const cappedMin = (typeof min === 'number') ? Math.max(1, Math.min(50, min)) : null
      const cappedMax = (typeof max === 'number') ? Math.min(50, max) : null

      // Zorg ervoor dat de id correct wordt meegestuurd
      const saveData = {...form}
      // Shallow clone diagrams to avoid reactive refs leakage
      if (Array.isArray(saveData.diagrams)) {
        saveData.diagrams = saveData.diagrams.map(d => ({src: d.src || '', caption: d.caption || ''}))
      }
      // Normaliseer spelers en duur waarden
      saveData.minPlayers = cappedMin
      saveData.maxPlayers = cappedMax
      const dur = parseInt(form.duration, 10)
      saveData.duration = (Number.isFinite(dur) && dur > 0) ? dur : null

      if (props.initial && props.initial.id) {
        saveData.id = props.initial.id
      } else {
        // Als er geen initial is, verwijder de id zodat er een nieuwe wordt aangemaakt
        delete saveData.id
      }

      emit('save', saveData)
    }

    const isEdit = computed(() => !!(props.initial && props.initial.id))

    onBeforeUnmount(() => {
      if (maxCapTimer) clearTimeout(maxCapTimer)
    })

    return {
      form,
      currentTab,
      materialOptions,
      save,
      categories: props.categories,
      toggleCategory,
      toggleMaterial,
      toggleIntensity,
      toggleCourt,
      // diagrams
      addDiagram,
      removeDiagram,
      moveDiagram,
      onPickDiagram,
      placeholderIcons,
      isEdit,
      normalizedCourt,
      // validation state and refs
      errors,
      nameInputRef,
      nameGroupRef,
      playersGroupRef,
      maxPlayersInputRef,
      showMaxCapTip
    }
  }
}
</script>

<style scoped>
</style>
