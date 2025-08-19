<template>
  <form class="training-form" @submit.prevent="save">

    <h3 class="text-xl font-bold text-gray-800 mb-4">
      {{ initial ? 'Wijzig oefening' : 'Nieuwe oefening' }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      
      <!-- Name -->
      <div class="form-group col-span-1 md:col-span-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Naam <span class="text-red-500" aria-hidden="true">*</span>
        </label>
        <input v-model="form.name" placeholder="Naam" class="form-input" required aria-required="true"/>
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
          Categorieën (oefeningen)
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
      <div class="form-group col-span-4 md:col-span-2">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <Users class="w-4 h-4"/>
          Aantal spelers
        </label>
        <div class="flex gap-x-2">

          <!-- Min players -->
          <div class="flex w-full">
            <input
                type="number"
                v-model.number="form.minPlayers"
                min="1"
                class="form-input !rounded-r-none border-r-0"
            />
            <div
                class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center text-gray-600 text-sm">
              min
            </div>
          </div>

          <!-- Max players -->
          <div class="flex w-full ml-2">
            <input
                type="number"
                v-model.number="form.maxPlayers"
                :min="(typeof form.minPlayers === 'number') ? form.minPlayers : null"
                class="form-input !rounded-r-none border-r-0"
            />
            <div
                class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center text-gray-600 text-sm">
              max
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
            :class="form.court === 'halfcourt' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
            @click="toggleCourt('halfcourt')"
            :aria-pressed="form.court === 'halfcourt' ? 'true' : 'false'"
          >Half court</button>
          <button
            type="button"
            class="px-3 py-2 text-sm font-medium border-l border-gray-300 focus:outline-none"
            :class="form.court === 'full court' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
            @click="toggleCourt('full court')"
            :aria-pressed="form.court === 'full court' ? 'true' : 'false'"
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
import {ref, reactive, watch, computed} from 'vue'
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
          maxPlayers: (typeof v.maxPlayers === 'number') ? v.maxPlayers : null,
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

    // Toggle court knop (deselecteer indien opnieuw geklikt)
    function toggleCourt(val) {
      form.court = (form.court === val) ? '' : val
    }

    function save() {
      if (!form.name) {
        alert('Naam is verplicht')
        return
      }

      const min = (typeof form.minPlayers === 'number') ? form.minPlayers : null
      const max = (typeof form.maxPlayers === 'number') ? form.maxPlayers : null
      if (min !== null && max !== null && max < min) {
        alert('Max spelers mag niet kleiner zijn dan minimale spelers')
        return
      }

      // Zorg ervoor dat de id correct wordt meegestuurd
      const saveData = { ...form }
      // Normaliseer spelers en duur waarden
      saveData.minPlayers = (typeof min === 'number') ? min : null
      saveData.maxPlayers = (typeof max === 'number') ? max : null
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

    return {
      form,
      materialOptions,
      save,
      categories: props.categories,
      toggleCategory,
      toggleMaterial,
      toggleCourt,
      placeholderIcons,
      isEdit
    }
  }
}
</script>


<style scoped>

</style>