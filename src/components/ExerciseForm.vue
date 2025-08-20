<template>
  <form class="training-form" @submit.prevent="save" novalidate>

    <h3 class="text-xl font-bold text-gray-800 mb-4">
      {{ initial ? 'Wijzig oefening' : 'Nieuwe oefening' }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      
      <!-- Name -->
      <div class="form-group col-span-1 md:col-span-3" ref="nameGroupRef">
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
      <div class="form-group col-span-1 md:col-span-1">
        <label class="block text-sm font-medium text-gray-700 mb-1">Icoon</label>
        <IconPicker v-model="form.icon" :icons="placeholderIcons" />
      </div>

      <!-- Description -->
      <div class="form-group col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
        <textarea v-model="form.description" placeholder="Beschrijving" class="form-input h-24 resize-none"></textarea>
      </div>

      <!-- Exercise Categories -->
      <div class="form-group col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
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
              : 'bg-gray-100 hover:bg-blue-100 text-gray-800'"
              class="px-2 py-1 rounded cursor-pointer"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <!-- Section: Details -->
      <div class="col-span-4 border-t pt-3 mt-1 text-xs uppercase tracking-wide text-gray-500">Details</div>

      <!-- Amount of players -->
      <div class="form-group col-span-4 md:col-span-2" ref="playersGroupRef">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <Users class="w-4 h-4"/>
          Aantal spelers
          <span v-if="errors.players" class="ml-2 text-xs font-semibold text-red-600">{{ errors.players }}</span>
        </label>
        <div class="flex gap-x-2">

          <!-- Min players -->
          <div class="flex w-full">
            <input
                type="number"
                v-model.number="form.minPlayers"
                min="1"
                :max="20"
                :class="['form-input !rounded-r-none border-r-0', errors.players ? '!border-red-500 focus:!border-red-500 !ring-1 !ring-red-500 focus:!ring-red-500' : '']"
                :aria-invalid="errors.players ? 'true' : 'false'"
            />
            <div
                class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center text-gray-600 text-sm">
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
                :max="20"
                :class="['form-input !rounded-r-none border-r-0', errors.players ? '!border-red-500 focus:!border-red-500 !ring-1 !ring-red-500 focus:!ring-red-500' : '']"
                :aria-invalid="errors.players ? 'true' : 'false'"
            />
            <div
                class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center text-gray-600 text-sm">
              max
            </div>
            <!-- Ephemeral tip for max cap -->
            <div v-if="showMaxCapTip" class="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-3 -translate-y-full z-10 w-64 max-w-[18rem]">
              <div class="relative drop-shadow-xl">
                <div class="bg-white border border-gray-200 rounded-lg p-2">
                  <div class="text-xs text-gray-700">Je kunt maximaal 20 invullen. Laat het veld leeg als je geen limiet wilt.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Duration -->
      <div class="form-group col-span-4 md:col-span-2">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <TimerReset class="w-4 h-4"/>
          Duur
        </label>
        <div class="flex">
          <input
              type="number"
              v-model="form.duration"
              min="1"
              class="form-input !rounded-r-none !border-r-0"
          />
          <div
              class="bg-gray-100 border border-gray-300 border-l rounded-r-lg px-2 flex items-center text-gray-600 text-sm">
            minuten
          </div>
        </div>
      </div>

      <!-- Intensity -->
      <div class="form-group col-span-4 md:col-span-4">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <Zap class="w-4 h-4"/>
          Intensiteit
        </label>

        <div class="flex flex-col gap-2">
          <Slider
              v-model="form.intensity"
              :min="1"
              :max="5"
              :step="1"
              :lazy="true"
              :merge="false"
          />
          <div class="text-sm text-gray-800">{{ form.intensity }}</div>
        </div>
      </div>

      <!-- Court -->
      <div class="form-group col-span-4 md:col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Veld</label>
        <div class="inline-flex rounded-md overflow-hidden border border-gray-300">
          <button
            type="button"
            class="px-3 py-2 text-sm font-medium focus:outline-none"
            :class="normalizedCourt === 'halfcourt' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
            @click="toggleCourt('halfcourt')"
            :aria-pressed="normalizedCourt === 'halfcourt' ? 'true' : 'false'"
          >Half court</button>
          <button
            type="button"
            class="px-3 py-2 text-sm font-medium border-l border-gray-300 focus:outline-none"
            :class="normalizedCourt === 'fullcourt' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
            @click="toggleCourt('fullcourt')"
            :aria-pressed="normalizedCourt === 'fullcourt' ? 'true' : 'false'"
          >Full court</button>
        </div>
        <button
          type="button"
          class="ml-3 text-sm text-gray-600 hover:text-gray-800 underline"
          @click="form.court = ''"
          v-if="form.court"
        >Wissen</button>
      </div>

      <!-- Materials -->
      <div class="form-group col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
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

      <!-- Coaching points -->
      <div class="form-group col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Coaching punten</label>
        <RichTextEditor v-model="form.coachingPoints" placeholder="Coaching punten" />
      </div>

      <!-- Section: Media -->
      <div class="col-span-4 border-t pt-3 mt-1 text-xs uppercase tracking-wide text-gray-500">Media</div>

      <!-- Video -->
      <div class="form-group col-span-4 md:col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Video link</label>
        <input v-model="form.video" placeholder="Video link" class="form-input"/>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 mt-6 justify-end">
      <button type="button" class="btn-secondary" @click="$emit('close')">Annuleren</button>
      <button
        type="submit"
        :class="isEdit ? 'btn-primary btn-submit' : 'btn-accent btn-submit'"
      >{{ isEdit ? 'Opslaan' : 'Aanmaken' }}</button>
    </div>
  </form>
</template>

<script>
import {ref, reactive, watch, computed, nextTick, onBeforeUnmount} from 'vue'
import store from '../store'
import RichTextEditor from './RichTextEditor.vue'
import IconPicker from './IconPicker.vue'

export default {
  components: { RichTextEditor, IconPicker },
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
      category: [],
      minPlayers: null,
      maxPlayers: null,
      intensity: 3,
      court: '',
      materials: [],
      duration: null,
      icon: 'TrafficCone',
      video: ''
    })

    const form = reactive(emptyForm())

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

    const materialOptions = [
      'Pionnen',
      'Loopladder',
      'Hoepel',
      'Stoel',
      'Medicijnbal',
      'Weerstandsband',
      'Springtouw',
      'Pylobox',
      'Shotclock',
      'Reboundmachine'
    ]

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
          maxPlayers: (typeof v.maxPlayers === 'number') ? Math.min(20, v.maxPlayers) : null,
          intensity: v.intensity || 3,
          court: v.court || '',
          materials: Array.isArray(v.materials) ? [...v.materials] : (v.materials ? [v.materials].flat().filter(Boolean) : []),
          duration: (typeof v.duration === 'number' ? v.duration : (typeof v.minutes === 'number' ? v.minutes : null)),
          icon: v.icon || v.imageIcon || 'TrafficCone',
          video: v.video || ''
        }
        Object.assign(form, formData)
      } else {
        Object.assign(form, emptyForm())
      }
    }, { immediate: true })

    // Clear errors as user types and clamp inputs to valid bounds
    watch(() => form.name, (v) => { if (v && errors.name) errors.name = '' })
    // Clamp minPlayers to [1..20] while allowing null
    watch(() => form.minPlayers, (v) => {
      if (typeof v === 'number') {
        if (v > 20) form.minPlayers = 20
        else if (v < 1) form.minPlayers = 1
      }
    })
    // Clamp maxPlayers to [1..20] while allowing null and show ephemeral tip if user tries > 20
    watch(() => form.maxPlayers, (v) => {
      if (typeof v === 'number') {
        if (v > 20) {
          const el = maxPlayersInputRef.value
          // Only show the tip when the user is actively editing this field
          if (el && document.activeElement === el) {
            if (maxCapTimer) clearTimeout(maxCapTimer)
            showMaxCapTip.value = true
            maxCapTimer = setTimeout(() => { showMaxCapTip.value = false }, 2000)
          }
          form.maxPlayers = 20
        } else if (v < 1) {
          form.maxPlayers = 1
        }
      }
    })
    // Clear players relation error when no longer invalid
    watch(() => [form.minPlayers, form.maxPlayers], () => {
      const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
      const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
      const cappedMax = (typeof max === 'number') ? Math.min(20, max) : null
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
      const cappedMax = (typeof max === 'number') ? Math.min(20, max) : null
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
        try { target.scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch(_) { target.scrollIntoView() }
      }
      if (errors.name && nameInputRef.value && typeof nameInputRef.value.focus === 'function') {
        nameInputRef.value.focus()
      }
    }

    function save() {
      if (!validate()) {
        scrollToFirstError()
        return
      }

      const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
      const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
      const cappedMin = (typeof min === 'number') ? Math.max(1, Math.min(20, min)) : null
      const cappedMax = (typeof max === 'number') ? Math.min(20, max) : null

      // Zorg ervoor dat de id correct wordt meegestuurd
      const saveData = { ...form }
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
      materialOptions,
      save,
      categories: props.categories,
      toggleCategory,
      toggleMaterial,
      toggleCourt,
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