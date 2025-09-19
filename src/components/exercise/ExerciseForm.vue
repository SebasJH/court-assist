<template>
  <form class="flex h-full flex-col" @submit.prevent="save" novalidate>

    <div class="px-5 sm:px-10 py-5 flex-1 overflow-y-auto">
      <!-- Basis -->
      <div v-show="currentTab==='basis'" class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Name -->
        <div class="form-group col-span-4 md:col-span-3" ref="nameGroupRef">
          <label class="form-label">
            Naam
            <span class="text-red-500" aria-hidden="true">*</span>
            <span v-if="errors.name" class="ml-2 text-xs font-semibold text-red-500">{{ errors.name }}</span>
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
          <label class="form-label">
            Icoon
          </label>
          <IconPicker v-model="form.icon" :icons="placeholderIcons"/>
        </div>

        <!-- Description -->
        <div class="form-group col-span-4">
          <label class="form-label">
            Beschrijving
          </label>
          <RichTextEditor v-model="form.description" placeholder="Beschrijving" />
        </div>


        <!-- Exercise Categories -->
        <div class="form-group col-span-4">
          <label class="form-label">
            Categorieën
          </label>

          <div class="flex flex-wrap gap-2">
            <button
                v-for="c in categories"
                :key="c"
                type="button"
                @click="toggleCategory(c)"
                :class="form.category.includes(c)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-blue-100 text-gray-800 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50'"
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
        <div class="form-group col-span-4 md:col-span-4" ref="playersGroupRef">
          <label class="form-label">
            Aantal spelers
            <span v-if="errors.players" class="ml-2 text-xs font-semibold text-red-600">{{ errors.players }}</span>
          </label>
          <RangeNumber
            idPrefix="players"
            v-model="playersRange"
            :min="1"
            :max="50"
            :step="1"
            :attachedLabels="true"
            :allowEmpty="true"
          />
        </div>

        <!-- Intensity -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
            Intensiteit
          </label>
          <IntensitySelector v-model="form.intensity"/>
        </div>

        <!-- Duration -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
            Duur
          </label>
          <div class="flex">
            <input
                type="number"
                v-model="form.duration"
                min="1"
                class="form-input !rounded-r-none border-r-0 dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-50"
            />
            <div
                class="border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 border-l rounded-r-xl px-2 flex items-center text-gray-600 dark:text-gray-50 text-sm">
              minuten
            </div>
          </div>
        </div>

        <!-- Court -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
              Veldtype
          </label>
          <div class="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 h-10">
            <button
                type="button"
                class="px-3 h-10 text-sm font-medium focus:outline-none"
                :class="normalizedCourt === 'halfcourt' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'"
                @click="toggleCourt('halfcourt')"
                :aria-pressed="normalizedCourt === 'halfcourt' ? 'true' : 'false'"
            >Half court
            </button>
            <button
                type="button"
                class="px-3 h-10 text-sm font-medium border-l border-gray-300 dark:border-gray-600 focus:outline-none"
                :class="normalizedCourt === 'fullcourt' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'"
                @click="toggleCourt('fullcourt')"
                :aria-pressed="normalizedCourt === 'fullcourt' ? 'true' : 'false'"
            >Full court
            </button>
          </div>
          <button
              type="button"
              class="ml-3 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 underline"
              @click="form.court = ''"
              v-if="form.court"
          >Wissen
          </button>
        </div>

        <!-- Materials -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
            Materialen
          </label>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="m in materialOptions"
                :key="m"
                type="button"
                @click="toggleMaterial(m)"
                :class="form.materials.includes(m)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-blue-100 text-gray-800 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50'"
                class="px-2 py-1 rounded cursor-pointer"
            >
              {{ m }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tekst -->
      <div v-show="currentTab==='tekst'" class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Uitvoering (Execution) -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
            Uitvoering
          </label>
          <RichTextEditor v-model="form.execution" placeholder="Beschrijf de uitvoering van de oefening"/>
        </div>

        <!-- Coaching points -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
            Coaching punten
          </label>
          <RichTextEditor v-model="form.coachingPoints" placeholder="Coaching punten"/>
        </div>

        <!-- Variaties -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
            Variaties
          </label>
          <RichTextEditor v-model="form.variations" placeholder="Variaties of aanpassingen van de oefening"/>
        </div>

      </div>

      <!-- Media -->
      <div v-show="currentTab==='media'" class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- Video -->
        <div class="form-group col-span-4 md:col-span-4">
          <label class="form-label">
            Video link
          </label>
          <input v-model="form.video" placeholder="Video link" class="form-input"/>
        </div>

        <!-- Diagrams repeater -->
        <div class="form-group col-span-4">
          <div class="flex items-center justify-between mb-1">
            <label class="form-label">
              Afbeeldingen
            </label>
            <span class="text-xs text-gray-500">Sleep om de volgorde te wijzigen</span>
          </div>
          <div v-if="!form.diagrams || form.diagrams.length === 0"
               class="text-sm text-gray-500 border border-dashed border-gray-300 rounded-md p-8 text-center flex flex-col items-center justify-center gap-3">
            <div>Nog geen afbeeldingen. Klik op “Voeg afbeelding toe”.</div>
            <div>
              <UiButton color="primary" class="!py-1 !px-2" icon="Plus" @click="addDiagram">Voeg afbeelding toe</UiButton>
            </div>
          </div>
          <transition-group v-else name="diagram" :css="!disableDiagramAnim" tag="div" class="flex flex-col gap-3">
            <div
              v-for="(d, idx) in form.diagrams"
              :key="d.uid || idx"
              class="border rounded-md p-3 bg-gray-50 diagram-card"
              :aria-grabbed="dragIndex === idx ? 'true' : 'false'"
              @dragenter.prevent="onDragEnter(idx)"
              @dragover.prevent="onDragOver(idx, $event)"
              @drop.prevent="onDrop(idx)"
              @dragend="onDragEnd"
              :class="[
                (overIndex === idx && dragIndex !== idx) ? 'ring-2 ring-blue-300' : '',
                (dragIndex === idx) ? 'opacity-70' : ''
              ]"
            >
              <!-- Item header: drag handle + index + actions -->
              <div class="flex items-center justify-between mb-2">
                <div class="inline-flex items-center gap-2">
                  <!-- Drag handle -->
                  <div class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing select-none" draggable="true" @dragstart="onDragStart(idx, $event)" :title="'Sleep om te verplaatsen'" aria-label="Sleep om te verplaatsen">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <circle cx="7" cy="5" r="1.5"/>
                      <circle cx="13" cy="5" r="1.5"/>
                      <circle cx="7" cy="10" r="1.5"/>
                      <circle cx="13" cy="10" r="1.5"/>
                      <circle cx="7" cy="15" r="1.5"/>
                      <circle cx="13" cy="15" r="1.5"/>
                    </svg>
                  </div>
                  <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-sm font-semibold">{{ idx + 1 }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <button type="button" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600/50" @click="duplicateDiagram(idx)" aria-label="Dupliceren" title="Dupliceren">
                    <Copy class="w-4 h-4" />
                  </button>
                  <button type="button" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600/50 disabled:opacity-50" @click="moveDiagram(idx, -1)" :disabled="idx === 0" aria-label="Omhoog" title="Omhoog">
                    <ArrowUp class="w-4 h-4" />
                  </button>
                  <button type="button" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600/50 disabled:opacity-50" @click="moveDiagram(idx, 1)" :disabled="idx === form.diagrams.length - 1" aria-label="Omlaag" title="Omlaag">
                    <ArrowDown class="w-4 h-4" />
                  </button>
                  <button type="button" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-red-600 hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:border-gray-600 dark:hover:bg-gray-600/50" @click="removeDiagram(idx)" aria-label="Verwijderen" title="Verwijderen">
                    <Trash class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex flex-col md:flex-row gap-3">
                <div class="w-full md:w-64">
                  <div class="relative aspect-video bg-white border rounded flex items-center justify-center overflow-hidden select-none">
                    <img v-if="d.src" :src="d.src" alt="Diagram preview" class="w-full h-full object-contain"/>
                    <div v-else class="text-gray-400 text-sm">Geen afbeelding</div>
                    <button v-if="d.src" type="button" class="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-600 shadow border border-gray-300 dark:bg-gray-700/90 dark:text-gray-200 dark:hover:bg-gray-600/90 dark:border-gray-600" @click="clearDiagramImage(idx)" aria-label="Afbeelding verwijderen" title="Afbeelding verwijderen">
                      <Trash class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="mt-2 flex flex-wrap md:flex-nowrap items-center gap-2">
                    <!-- Hidden file input + trigger button with same styling as 'Teken diagram' -->
                    <input :ref="el => setFileInputRef(el, idx)" type="file" accept="image/*" class="hidden" @change="onPickDiagram($event, idx)"/>
                    <UiButton color="secondary" size="sm" icon="Image" @click="triggerPick(idx)">Afbeelding</UiButton>
                    <UiButton color="secondary" size="sm" icon="PencilRuler" @click="openPlayEditor(idx)">{{ playEditorStates[idx] ? 'Bewerken' : 'Creëer' }}</UiButton>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <label class="form-label mb-1">Bijschrift</label>
                  </div>
                  <RichTextEditor v-model="d.caption" placeholder="Beschrijf deze afbeelding"/>
                </div>
              </div>
            </div>
            <div class="pt-1 flex justify-center">
              <UiButton color="primary" class="!py-1 !px-2" icon="Plus" @click="addDiagram">Voeg afbeelding toe</UiButton>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div v-if="!hideFooterActions" class="px-5 sm:px-10 pt-5 border-t dark:border-gray-600 flex justify-end gap-3">
      <UiButton color="cancel" @click="$emit('close')">Annuleren</UiButton>
      <UiButton :color="isEdit ? 'primary' : 'success'" type="submit" class="btn-submit">
        {{ isEdit ? 'Opslaan' : 'Aanmaken' }}
      </UiButton>
    </div>

    <!-- Play editor modal -->
    <modal :open="showPlayEditor" @close="closePlayEditor" contentPaddingClass="p-0">
      <template #title>Diagram tekenen</template>
      <PlayEditor
        :initial="playEditorStates[playEditorIndex] || null"
        :suggestedCourt="normalizedCourt"
        @cancel="closePlayEditor"
        @save="onPlayEditorSave"
      />
    </modal>
  </form>
</template>

<script>
import {ref, reactive, watch, computed, nextTick, onBeforeUnmount, onMounted} from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import store from '../../store'
import RichTextEditor from '../form/RichTextEditor.vue'
import IconPicker from '../form/IconPicker.vue'
import IntensitySelector from '../form/IntensitySelector.vue'
import RangeNumber from '../form/RangeNumber.vue'
import {EXERCISE_MATERIALS} from '../../constants'
import UiButton from '../ui/Button.vue'
import Modal from '../Modal.vue'
import PlayEditor from '../diagram/PlayEditor.vue'

export default {
  components: {
    RichTextEditor,
    IconPicker,
    IntensitySelector,
    UiButton,
    RangeNumber,
    Modal,
    PlayEditor
  },
  props: {
    initial: {type: Object, default: null},
    categories: {type: Array, default: () => []},
    currentTab: {type: String, default: 'basis'},
    hideFooterActions: { type: Boolean, default: false }
  },
  emits: ['save','close','update:currentTab'],
  setup(props, {emit, expose}) {
    const router = useRouter()
    const route = useRoute()
    const emptyForm = () => ({
      id: null,
      name: '',
      description: '',
      goal: '',
      execution: '',
      coachingPoints: '',
      variations: '',
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

    // Tabs state controlled by parent via prop
    const currentTab = computed({
      get(){ return props.currentTab || 'basis' },
      set(val){ emit('update:currentTab', val) }
    })

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
          goal: v.goal || v.purpose || '',
          execution: v.execution || v.howItWorks || '',
          coachingPoints: v.coachingPoints || v.fullDescription || v.full || '',
          variations: v.variations || '',
          category: Array.isArray(v.category) ? [...v.category] : (v.category ? [v.category] : []),
          minPlayers: (typeof v.minPlayers === 'number') ? v.minPlayers : null,
          maxPlayers: (typeof v.maxPlayers === 'number') ? Math.min(50, v.maxPlayers) : null,
          intensity: (typeof v.intensity === 'number') ? v.intensity : null,
          court: v.court || '',
          materials: Array.isArray(v.materials) ? [...v.materials] : (v.materials ? [v.materials].flat().filter(Boolean) : []),
          duration: (typeof v.duration === 'number' ? v.duration : (typeof v.minutes === 'number' ? v.minutes : null)),
          icon: v.icon || v.imageIcon || 'TrafficCone',
          video: v.video || '',
          diagrams: Array.isArray(v.diagrams) ? v.diagrams.map(d => ({ uid: d.uid || genUid(), src: d.src || '', caption: d.caption || ''})) : []
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
    function genUid(){
      try { return 'd' + Math.random().toString(36).slice(2) + Date.now().toString(36) } catch(_) { return String(Date.now()) }
    }
    function addDiagram() {
      if (!Array.isArray(form.diagrams)) form.diagrams = []
      form.diagrams.push({ uid: genUid(), src: '', caption: '' })
      // Keep editor states aligned
      try {
        const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
        states.push(null)
        playEditorStates.value = states
      } catch(_) {}
    }

    function removeDiagram(idx) {
      if (!Array.isArray(form.diagrams)) return
      if (idx < 0 || idx >= form.diagrams.length) return
      form.diagrams.splice(idx, 1)
      // Keep editor states aligned
      try {
        const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
        if (idx >= 0 && idx < states.length) {
          states.splice(idx, 1)
          playEditorStates.value = states
        }
      } catch(_) {}
    }

    function moveDiagram(idx, delta) {
      if (!Array.isArray(form.diagrams)) return
      const to = idx + delta
      if (to < 0 || to >= form.diagrams.length) return
      const item = form.diagrams[idx]
      form.diagrams.splice(idx, 1)
      form.diagrams.splice(to, 0, item)
      // Move corresponding state as well
      try {
        const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
        if (idx >= 0 && idx < states.length) {
          const sItem = states[idx]
          states.splice(idx, 1)
          states.splice(to, 0, sItem)
          playEditorStates.value = states
        }
      } catch(_) {}
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
        if (!form.diagrams[idx]) form.diagrams[idx] = { uid: genUid(), src: '', caption: '' }
        if (!form.diagrams[idx].uid) form.diagrams[idx].uid = genUid()
        form.diagrams[idx].src = url
        // Clear any PlayEditor state for this index, since it's now an uploaded image
        try {
          const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
          states[idx] = null
          playEditorStates.value = states
        } catch(_) {}
        // Reset the file input to allow uploading the same file again if needed
        try {
          const map = fileInputs.value || {}
          const inp = map[idx]
          if (inp) inp.value = ''
        } catch(_) {}
      }
      reader.readAsDataURL(file)
    }

    function clearDiagramImage(idx) {
      if (!Array.isArray(form.diagrams)) return
      if (!form.diagrams[idx]) return
      form.diagrams[idx].src = ''
      // Also clear any PlayEditor state for this diagram
      try {
        const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
        states[idx] = null
        playEditorStates.value = states
      } catch(_) {}
      // Reset file input if present
      try {
        const map = fileInputs.value || {}
        const inp = map[idx]
        if (inp) inp.value = ''
      } catch(_) {}
    }

    // File input refs per diagram index
    const fileInputs = ref({})
    function setFileInputRef(el, idx) {
      if (el) {
        const map = fileInputs.value || {}
        map[idx] = el
        fileInputs.value = map
      }
    }
    function triggerPick(idx) {
      const elMap = fileInputs.value || {}
      const el = elMap[idx]
      if (el && typeof el.click === 'function') {
        try { el.click() } catch (_) {}
      }
    }

    // In-app Play Editor modal state and handlers
    const showPlayEditor = ref(false)
    const playEditorIndex = ref(-1)
    const playEditorStates = ref([]) // store serialized editor states by index for re-editing
    // Suppress one-time diagram transition when returning from Play Editor
    const disableDiagramAnim = ref(false)

    // Draft persistence across Play Editor route
    function draftKey(){
      try {
        const mode = (props.initial && props.initial.id) ? 'edit' : 'new'
        const slug = route && route.params && route.params.slug ? String(route.params.slug) : 'new'
        return `exercise_draft_${mode}_${slug}`
      } catch(_) { return 'exercise_draft_new' }
    }
    function saveDraft(){
      try {
        const plainForm = JSON.parse(JSON.stringify(form))
        const data = {
          form: plainForm,
          currentTab: (currentTab && currentTab.value) ? String(currentTab.value) : 'basis',
          playEditorStates: Array.isArray(playEditorStates.value) ? playEditorStates.value : [],
          initialSnapshot: initialSnapshot && initialSnapshot.value ? JSON.parse(JSON.stringify(initialSnapshot.value)) : null
        }
        sessionStorage.setItem(draftKey(), JSON.stringify(data))
      } catch(_) {}
    }
    function restoreDraft(){
      try {
        const raw = sessionStorage.getItem(draftKey())
        if (!raw) return false
        const data = JSON.parse(raw)
        if (data && data.form && typeof data.form === 'object') {
          Object.assign(form, data.form)
        }
        if (data && typeof data.currentTab === 'string') {
          try { currentTab.value = data.currentTab } catch(_) {}
        }
        if (data && Array.isArray(data.playEditorStates)) {
          playEditorStates.value = data.playEditorStates
        }
        if (data && data.initialSnapshot) {
          try { initialSnapshot.value = JSON.parse(JSON.stringify(data.initialSnapshot)) } catch(_) { initialSnapshot.value = data.initialSnapshot }
        }
        return true
      } catch(_) { return false }
    }
    function clearDraft(){
      try { sessionStorage.removeItem(draftKey()) } catch(_) {}
    }

    function openPlayEditor(idx){
      try {
        // Persist current draft before navigating away
        try { saveDraft() } catch(_) {}
        const token = genUid()
        const curTab = (currentTab && currentTab.value) ? String(currentTab.value) : 'basis'
        const from = (route && (route.fullPath || route.path)) ? String(route.fullPath || route.path) : '/oefeningen'
        const state = Array.isArray(playEditorStates.value) ? (playEditorStates.value[idx] || null) : null
        const ctx = { token, idx, from, tab: curTab, initialState: state }
        try { sessionStorage.setItem('playEditor_ctx', JSON.stringify(ctx)) } catch(_) {}
        router.push('/play-editor')
      } catch (_) {}
    }
    function closePlayEditor(){
      showPlayEditor.value = false
      playEditorIndex.value = -1
    }
    function onPlayEditorSave(payload){
      try {
        const { dataUrl, state } = payload || {}
        const idx = playEditorIndex.value
        if (idx >= 0) {
          if (!Array.isArray(form.diagrams)) form.diagrams = []
          if (!form.diagrams[idx]) form.diagrams[idx] = { src: '', caption: '' }
          if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
            form.diagrams[idx].src = dataUrl
          }
          const states = Array.isArray(playEditorStates.value) ? playEditorStates.value : []
          states[idx] = state || null
          playEditorStates.value = states
        }
      } finally {
        closePlayEditor()
      }
    }

    // Drag & drop reorder state and handlers for diagrams
    const dragIndex = ref(-1)
    const overIndex = ref(-1)
    const dragImageEl = ref(null)

    function onDragStart(idx, ev){
      dragIndex.value = idx
      overIndex.value = -1
      try { ev.dataTransfer && ev.dataTransfer.setData('text/plain', String(idx)) } catch(_) {}
      try { ev.dataTransfer && (ev.dataTransfer.effectAllowed = 'move') } catch(_) {}
      // Create a custom drag image from the whole card, so it follows the cursor
      try {
        const target = ev && ev.target
        const card = target && typeof target.closest === 'function' ? target.closest('.diagram-card') : null
        if (card) {
          const clone = card.cloneNode(true)
          // Match size and make it invisible to hit-testing
          clone.style.width = card.offsetWidth + 'px'
          clone.style.height = card.offsetHeight + 'px'
          clone.style.position = 'absolute'
          clone.style.top = '-9999px'
          clone.style.left = '-9999px'
          clone.style.pointerEvents = 'none'
          clone.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)'
          document.body.appendChild(clone)
          dragImageEl.value = clone
          if (ev.dataTransfer && typeof ev.dataTransfer.setDragImage === 'function') {
            ev.dataTransfer.setDragImage(clone, 16, 16)
          }
        }
      } catch (_) {}
    }
    function onDragEnter(idx){
      if (idx === dragIndex.value) return
      // Only mark the current hover index for visual feedback; do not reorder here to avoid jumpiness
      overIndex.value = idx
    }
    function onDragOver(idx, ev){
      if (!Array.isArray(form.diagrams)) return
      const from = dragIndex.value
      if (from === -1 || idx === -1 || idx === from) return

      // Compute pointer position relative to hovered card
      let card = ev && (ev.currentTarget || (ev.target && typeof ev.target.closest === 'function' ? ev.target.closest('.diagram-card') : null))
      if (!card || typeof card.getBoundingClientRect !== 'function') return
      const rect = card.getBoundingClientRect()
      const y = ev.clientY - rect.top
      const topThreshold = rect.height * 0.45
      const bottomThreshold = rect.height * 0.55

      // Update hover highlight
      overIndex.value = idx

      // Only reorder when dragging direction matches threshold crossing to reduce flicker
      if (from < idx) {
        // dragging downwards: wait until pointer passes the bottom threshold of the hovered card
        if (y <= bottomThreshold) return
      } else {
        // dragging upwards: wait until pointer passes the top threshold of the hovered card
        if (y >= topThreshold) return
      }

      const arr = form.diagrams.slice()
      const [item] = arr.splice(from, 1)
      let to = idx
      // Clamp destination within bounds
      to = Math.max(0, Math.min(arr.length, to))
      arr.splice(to, 0, item)
      form.diagrams = arr
      // Reorder corresponding PlayEditor states to keep indices aligned
      try {
        const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
        if (from >= 0 && from < states.length) {
          const [sItem] = states.splice(from, 1)
          states.splice(to, 0, sItem)
          playEditorStates.value = states
        }
      } catch(_) {}
      dragIndex.value = to
    }
    function onDrop(idx){
      // Reordering is handled during dragover threshold checks; clear state on drop
      dragIndex.value = -1
      overIndex.value = -1
    }
    function onDragEnd(){
      // Cleanup any drag image clone
      try {
        const el = dragImageEl && dragImageEl.value
        if (el && el.parentNode) el.parentNode.removeChild(el)
      } catch (_) {}
      if (dragImageEl) dragImageEl.value = null
      dragIndex.value = -1
      overIndex.value = -1
    }

    function duplicateDiagram(idx){
      if (!Array.isArray(form.diagrams)) return
      const item = form.diagrams[idx]
      if (!item) return
      const copy = { uid: genUid(), src: item.src || '', caption: item.caption || '' }
      const arr = form.diagrams.slice()
      arr.splice(idx + 1, 0, copy)
      form.diagrams = arr
      // Duplicate corresponding PlayEditor state to maintain editability status
      try {
        const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
        const sItem = (idx >= 0 && idx < states.length) ? states[idx] : null
        states.splice(idx + 1, 0, sItem || null)
        playEditorStates.value = states
      } catch(_) {}
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

    const ignoreGuard = ref(false)

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

      // Clear any persisted draft as we're saving now
      try { clearDraft() } catch(_) {}
      // Suppress unsaved-change guards during the save flow
      ignoreGuard.value = true
      emit('save', saveData)
    }

    // Normalization helper used for dirty-checking and saving equivalence
    function buildNormalized() {
      const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
      const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
      const cappedMin = (typeof min === 'number') ? Math.max(1, Math.min(50, min)) : null
      const cappedMax = (typeof max === 'number') ? Math.min(50, max) : null
      const saveData = { ...form }
      if (Array.isArray(saveData.diagrams)) {
        saveData.diagrams = saveData.diagrams.map(d => ({ src: d.src || '', caption: d.caption || '' }))
      }
      saveData.minPlayers = cappedMin
      saveData.maxPlayers = cappedMax
      const dur = parseInt(form.duration, 10)
      saveData.duration = (Number.isFinite(dur) && dur > 0) ? dur : null
      if (props.initial && props.initial.id) {
        saveData.id = props.initial.id
      } else {
        delete saveData.id
      }
      return saveData
    }

    const initialSnapshot = ref(null)
    nextTick(() => {
      try {
        // Only initialize if not already restored from a persisted draft
        if (!initialSnapshot.value) {
          initialSnapshot.value = JSON.parse(JSON.stringify(buildNormalized()))
        }
      } catch (_) {
        initialSnapshot.value = initialSnapshot.value || null
      }
    })

    function isDirty() {
      try {
        const cur = JSON.stringify(buildNormalized())
        const init = JSON.stringify(initialSnapshot.value)
        return cur !== init
      } catch (_) { return false }
    }

    const dirtyFlag = computed(() => isDirty())

    function onBeforeUnload(e){
      try {
        if (ignoreGuard.value) return
        if (!dirtyFlag.value) return
        e.preventDefault()
        e.returnValue = ''
      } catch(_) {}
    }

    onBeforeRouteLeave((to, from, next) => {
      try {
        // If we're in a controlled save flow, do not prompt
        if (ignoreGuard.value) { next(); return }
        // Allow navigation to Play Editor without prompting
        const destPath = (to && (to.fullPath || to.path)) ? String(to.fullPath || to.path) : ''
        if (destPath && destPath.startsWith('/play-editor')) { next(); return }
        if (!dirtyFlag.value) { next(); return }
        const ok = window.confirm('Je hebt onopgeslagen wijzigingen in de oefening. Weet je zeker dat je deze pagina wilt verlaten?')
        if (ok) next(); else next(false)
      } catch(_) { next() }
    })

    // Expose methods so parents (like ExerciseEdit page) can trigger actions
    expose({ save, isDirty, clearDraft, applyPlayEditorResultIfAny })

    const isEdit = computed(() => !!(props.initial && props.initial.id))

    onBeforeUnmount(() => {
      if (maxCapTimer) clearTimeout(maxCapTimer)
      try { window.removeEventListener('beforeunload', onBeforeUnload) } catch(_) {}
    })

    const playersRange = computed({
      get(){
        const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
        const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
        return [min, max]
      },
      set([min, max]){
        form.minPlayers = (min === '' || min === null) ? null : Number(min)
        form.maxPlayers = (max === '' || max === null) ? null : Number(max)
      }
    })

    function applyPlayEditorResultIfAny(){
      try {
        const rawRes = sessionStorage.getItem('playEditor_result')
        const rawCtx = sessionStorage.getItem('playEditor_ctx')
        const res = rawRes ? JSON.parse(rawRes) : null
        const ctx = rawCtx ? JSON.parse(rawCtx) : null
        if (!res || typeof res.idx !== 'number') return
        const idx = res.idx
        if (idx < 0 || idx > 1000) return
        if (!Array.isArray(form.diagrams)) form.diagrams = []
        if (!form.diagrams[idx]) form.diagrams[idx] = { uid: genUid(), src: '', caption: '' }
        if (!form.diagrams[idx].uid) form.diagrams[idx].uid = genUid()
        if (typeof res.dataUrl === 'string' && res.dataUrl.startsWith('data:image/')) {
          form.diagrams[idx].src = res.dataUrl
        }
        const states = Array.isArray(playEditorStates.value) ? playEditorStates.value.slice() : []
        states[idx] = res.state || (ctx && ctx.initialState ? ctx.initialState : null)
        playEditorStates.value = states
        // Clear the stored data so it won't re-apply
        try { sessionStorage.removeItem('playEditor_result') } catch(_) {}
        try { sessionStorage.removeItem('playEditor_ctx') } catch(_) {}
        // Switch to Media tab to make it visible (optional). Keep current tab if ctx.tab exists.
        try {
          // Always switch to Media tab after returning from Play Editor
          currentTab.value = 'media'
        } catch(_) {}
      } catch(_) {}
    }

    onMounted(() => {
      try { restoreDraft() } catch(_) {}
      // One-time suppression of diagram animation when returning from Play Editor
      try {
        const flag = sessionStorage.getItem('playEditor_returnToMedia')
        if (flag === '1') {
          disableDiagramAnim.value = true
          try { sessionStorage.removeItem('playEditor_returnToMedia') } catch(_) {}
          // Reset after first render cycle so future interactions animate normally
          nextTick(() => setTimeout(() => { disableDiagramAnim.value = false }, 0))
        }
      } catch(_) {}
      try { setTimeout(applyPlayEditorResultIfAny, 0) } catch(_) {}
      try { window.addEventListener('beforeunload', onBeforeUnload) } catch(_) {}
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
      clearDiagramImage,
      duplicateDiagram,
      setFileInputRef,
      triggerPick,
      // drag & drop
      dragIndex,
      overIndex,
      onDragStart,
      onDragEnter,
      onDragOver,
      onDrop,
      onDragEnd,
      // play editor modal
      showPlayEditor,
      playEditorIndex,
      playEditorStates,
      openPlayEditor,
      closePlayEditor,
      onPlayEditorSave,
      placeholderIcons,
      isEdit,
      normalizedCourt,
      // validation state and refs
      errors,
      nameInputRef,
      nameGroupRef,
      playersGroupRef,
      maxPlayersInputRef,
      showMaxCapTip,
      playersRange,
      disableDiagramAnim
    }
  }
}
</script>

<style scoped>
/* Smooth movement for diagrams reordering */
.diagram-move {
  transition: transform 220ms ease, opacity 220ms ease;
}
.diagram-enter-active,
.diagram-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.diagram-enter-from,
.diagram-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.diagram-enter-to,
.diagram-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
