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
        <div class="relative w-full" ref="iconMenuContainerRef">
          <div class="flex w-full">
            <div
              class="px-3 py-2 h-[42px] border border-gray-300 rounded-l-lg bg-white flex items-center justify-center focus:outline-none focus:ring-0"
              :class="iconMenuOpen ? 'border-blue-500' : ''"
              :title="form.icon"
            >
              <component :is="form.icon" class="w-5 h-5 text-gray-700" />
            </div>
            <!-- Trailing bar to change icon -->
            <button
              type="button"
              class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-3 h-[42px] flex items-center justify-center flex-1 text-gray-700 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors focus:outline-none focus:ring-0"
              @click="toggleIconMenu"
            >
              Wijzigen
            </button>
          </div>
          <!-- Popover with all icons -->
          <div
            v-if="iconMenuOpen"
            ref="iconMenuRef"
            class="absolute z-20 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg w-56"
          >
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="icon in placeholderIcons"
                :key="icon"
                type="button"
                class="flex items-center justify-center border rounded p-2 transition-colors focus:outline-none focus:ring-0"
                :class="form.icon === icon ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 hover:bg-gray-50'"
                @click="selectIcon(icon)"
                :title="icon"
              >
                <component :is="icon" :class="form.icon === icon ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-700'" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="form-group col-span-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
        <textarea v-model="form.description" placeholder="Beschrijving" class="form-input h-24 resize-none"></textarea>
      </div>

      <!-- Categories -->
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

      <!-- Duration -->
      <div class="form-group col-span-4 md:col-span-2">
        <label class="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <TimerReset class="w-4 h-4"/>
          Duur
        </label>
        <div class="flex">
          <input
              type="number"
              v-model.number="form.duration"
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Coaching points</label>
        <textarea v-model="form.coachingPoints" class="form-input h-32 resize-none" placeholder="Coaching points"></textarea>
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
      <button type="submit" class="btn-primary btn-submit">Opslaan</button>
    </div>
  </form>
</template>

<script>
import {ref, reactive, watch, onMounted, onBeforeUnmount} from 'vue'
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
      description: '',
      coachingPoints: '',
      category: [],
      minPlayers: 1,
      maxPlayers: null,
      intensity: 3,
      materials: [],
      duration: 5,
      icon: 'TrafficCone',
      video: ''
    })

    const form = reactive(emptyForm())
    const imageToAdd = ref('') // legacy, reserved for future URL uploads (not used now)

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
      'Gauge',
      'Hourglass',
    ]

    // Icon menu (popover) state and handlers
    const iconMenuOpen = ref(false)
    const iconMenuRef = ref(null)
    const iconMenuContainerRef = ref(null)

    function toggleIconMenu() {
      iconMenuOpen.value = !iconMenuOpen.value
    }

    function selectIcon(icon) {
      form.icon = icon
      iconMenuOpen.value = false
    }

    function handleClickOutside(event) {
      const container = iconMenuContainerRef.value
      if (container && container.contains(event.target)) {
        return
      }
      iconMenuOpen.value = false
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClickOutside)
    })

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
        // Zorg ervoor dat alle velden correct worden ingesteld
        const formData = {
          id: v.id,
          name: v.name || '',
          description: v.description || v.shortDescription || v.short || '',
          coachingPoints: v.coachingPoints || v.fullDescription || v.full || '',
          category: Array.isArray(v.category) ? [...v.category] : (v.category ? [v.category] : []),
          minPlayers: v.minPlayers || 1,
          maxPlayers: v.maxPlayers || null,
          intensity: v.intensity || 3,
          materials: Array.isArray(v.materials) ? [...v.materials] : (v.materials ? [v.materials].flat().filter(Boolean) : []),
          duration: v.duration || v.minutes || 5,
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
      // form.materials is al de geselecteerde array

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
      materialOptions,
      save,
      categories: props.categories,
      toggleCategory,
      toggleMaterial,
      placeholderIcons,
      iconMenuOpen,
      iconMenuRef,
      iconMenuContainerRef,
      toggleIconMenu,
      selectIcon
    }
  }
}
</script>


<style scoped>

</style>
