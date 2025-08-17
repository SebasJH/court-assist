<template>
  <form class="training-form" @submit.prevent="save">

    <h3 class="text-xl font-bold text-gray-800 mb-4">
      {{ initial ? 'Wijzig oefening' : 'Nieuwe oefening' }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Naam</label>
        <input v-model="form.name" placeholder="Naam" class="form-input"/>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
        <select v-model="form.category" class="form-input">
          <option disabled value="">Kies categorie...</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="form-group md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Korte uitleg</label>
        <input v-model="form.short" placeholder="Korte uitleg" class="form-input"/>
      </div>

      <div class="form-group">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <Users class="w-4 h-4"/>
          Aantal spelers
        </label>
        <div class="flex gap-2">
          <input
              type="number"
              v-model.number="form.minPlayers"
              min="1"
              placeholder="Min spelers"
              class="form-input"
              required
          />
          <input
              type="number"
              v-model.number="form.maxPlayers"
              :min="form.minPlayers"
              placeholder="Max spelers (optioneel)"
              class="form-input"
          />
        </div>
      </div>


      <div class="form-group">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <Zap class="w-4 h-4"/>
          Intensiteit
        </label>

        <div class="flex items-center gap-3">
          <input
              type="range"
              v-model.number="form.intensity"
              min="1"
              max="5"
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-yellow-500 focus:outline-none"
          />
          <span class="text-sm text-gray-700 font-medium w-6 text-center">
            {{ form.intensity }}
          </span>
        </div>
      </div>


      <div class="form-group">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <TimerReset class="w-4 h-4"/>
          Duur (min)
        </label>
        <input
            type="number"
            v-model.number="form.minutes"
            min="1"
            placeholder="Duur (min)"
            class="form-input"
        />
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Video link</label>
        <input v-model="form.video" placeholder="Video link" class="form-input"/>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">Afbeeldings-URL toevoegen</label>
        <input v-model="imageToAdd" placeholder="Afbeeldings URL" class="form-input"/>
      </div>
    </div>

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
    categories: {type: Array, default: () => []} // 👈 categorieën meegeven
  },
  setup(props, {emit}) {
    const emptyForm = () => ({
      id: null,
      name: '',
      short: '',
      full: '',
      category: '',
      minPlayers: 1,
      maxPlayers: null,
      intensity: 3,
      minutes: 5,
      images: [],
      video: ''
    })

    const form = reactive(emptyForm())
    const imageToAdd = ref('')

    // Wanneer je iets opent om te editen, of nieuwe oefening maakt
    watch(() => props.initial, (v) => {
      if (v) {
        Object.assign(form, v)
      } else {
        Object.assign(form, emptyForm())
      }
    }, {immediate: true})

    function save() {
      const payload = {...form}

      // basis validatie
      if (!payload.name) {
        alert('Naam is verplicht')
        return
      }
      if (!payload.category) {
        alert('Categorie is verplicht')
        return
      }

      if (payload.maxPlayers && payload.maxPlayers < payload.minPlayers) {
        alert('Max spelers mag niet kleiner zijn dan minimale spelers')
        return
      }


      if (payload.id) {
        store.updateExercise(payload.id, payload)
      } else {
        store.addExercise(payload)
      }

      emit('save', payload)
    }

    return {
      form,
      imageToAdd,
      save,
      categories: props.categories // 👈 beschikbaar in template
    }
  }
}
</script>


<style scoped>

</style>