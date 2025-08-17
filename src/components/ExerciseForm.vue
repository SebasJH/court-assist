<template>
  <form class="training-form" @submit.prevent="save">

    <h3 class="text-xl font-bold text-gray-800 mb-4">
      {{ initial ? 'Wijzig oefening' : 'Nieuwe oefening' }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">


      <!-- Naam -->
      <div class="form-group col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Naam</label>
        <input v-model="form.name" placeholder="Naam" class="form-input"/>
      </div>


      <!-- Categories -->
      <div class="form-group col-span-2">
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

      <!-- Short description -->
      <div class="form-group md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Korte uitleg</label>
        <input v-model="form.short" placeholder="Korte uitleg" class="form-input"/>
      </div>

      <!-- Amount of players -->
      <div class="form-group">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <Users class="w-4 h-4"/>
          Aantal spelers
        </label>
        <div class="flex">

          <!-- Min players -->
          <div class="flex">
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
          <div class="flex ml-2">
            <input
                type="number"
                v-model.number="form.maxPlayers"
                :min="form.minPlayers"
                class="form-input !rounded-r-none border-r-0"
            />
            <div
                class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center text-gray-600 text-sm">
              max
            </div>
          </div>
        </div>
      </div>

      <!-- Intensity -->

      <div class="form-group">
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


      <!-- Duration -->
      <div class="form-group">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <TimerReset class="w-4 h-4"/>
          Duur
        </label>
        <div class="flex">
          <input
              type="number"
              v-model.number="form.minutes"
              min="1"
              class="form-input !rounded-r-none !border-r-0"
          />
          <div
              class="bg-gray-100 border border-gray-300 border-l rounded-r-lg px-2 flex items-center text-gray-600 text-sm">
            minuten
          </div>
        </div>
      </div>

      <!-- Video -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Video link</label>
        <input v-model="form.video" placeholder="Video link" class="form-input"/>
      </div>

      <!-- Image -->
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Afbeeldings-URL toevoegen</label>
        <input v-model="imageToAdd" placeholder="Afbeeldings URL" class="form-input"/>
      </div>
    </div>

    <!-- Full description -->
    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700 mb-1">Volledige uitleg</label>
      <textarea v-model="form.full" class="form-input h-32 resize-none" placeholder="Volledige uitleg"></textarea>
    </div>

    <div class="flex gap-3 mt-6 justify-end">
      <button type="button" class="btn-secondary" @click="$emit('close')">Annuleren</button>
      <button type="submit" class="btn-primary btn-submit">Opslaan</button>
    </div>
  </form>
</template>

<script>
import {ref, reactive, watch} from 'vue'
import store from '../store'

export default {
  props: {
    initial: {type: Object, default: null},
    categories: {type: Array, default: () => []}
  },
  setup(props, {emit}) {
    const emptyForm = () => ({
      id: null,
      name: '',
      short: '',
      full: '',
      category: [],
      minPlayers: 1,
      maxPlayers: null,
      intensity: 3,
      minutes: 5,
      images: [],
      video: ''
    })

    const form = reactive(emptyForm())
    const imageToAdd = ref('')

    // Als initial wordt meegegeven, zet dit in het formulier
    watch(() => props.initial, (v) => {
      if (v) {
        // Zorg ervoor dat alle velden correct worden ingesteld
        const formData = {
          id: v.id,
          name: v.name || '',
          short: v.short || '',
          full: v.full || '',
          category: Array.isArray(v.category) ? [...v.category] : (v.category ? [v.category] : []),
          minPlayers: v.minPlayers || 1,
          maxPlayers: v.maxPlayers || null,
          intensity: v.intensity || 3,
          minutes: v.minutes || 5,
          images: v.images ? [...v.images] : [],
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

    function save() {
      if (!form.name) {
        alert('Naam is verplicht')
        return
      }

      if (form.maxPlayers && form.maxPlayers < form.minPlayers) {
        alert('Max spelers mag niet kleiner zijn dan minimale spelers')
        return
      }

      // Zorg ervoor dat de id correct wordt meegestuurd
      const saveData = { ...form }
      if (props.initial && props.initial.id) {
        saveData.id = props.initial.id
      } else {
        // Als er geen initial is, verwijder de id zodat er een nieuwe wordt aangemaakt
        delete saveData.id
      }
      
      emit('save', saveData)
    }


    return {
      form,
      imageToAdd,
      save,
      categories: props.categories,
      toggleCategory
    }
  }
}
</script>


<style scoped>

</style>
