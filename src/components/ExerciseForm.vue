<template>
  <div class="training-form">
    <h3 class="text-xl font-bold text-gray-800 mb-4">{{initial ? 'Wijzig oefening' : 'Nieuwe oefening'}}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="form-group">
        <input v-model="form.name" placeholder="Naam" class="form-input" />
      </div>
      <div class="form-group">
        <input v-model="form.category" placeholder="Categorie" class="form-input" />
      </div>
      <div class="form-group">
        <input v-model="form.short" placeholder="Korte uitleg" class="form-input" />
      </div>
      <div class="form-group">
        <input type="number" v-model.number="form.players" placeholder="Aantal spelers" class="form-input" />
      </div>
      <div class="form-group">
        <input type="number" v-model.number="form.intensity" placeholder="Intensiteit 1-5" min="1" max="5" class="form-input" />
      </div>
      <div class="form-group">
        <input type="number" v-model.number="form.minutes" placeholder="Duur (min)" class="form-input" />
      </div>
      <div class="form-group">
        <input v-model="form.video" placeholder="Video link (optioneel)" class="form-input" />
      </div>
      <div class="form-group">
        <input v-model="imageToAdd" placeholder="Afbeeldings URL toevoegen" class="form-input" />
      </div>
    </div>
    <div class="form-group">
      <textarea v-model="form.full" class="form-input h-32 resize-none" placeholder="Volledige uitleg"></textarea>
    </div>
    <div class="flex gap-3 mt-6">
      <button class="btn-submit" @click="save">Opslaan</button>
      <button class="btn-secondary" @click="$emit('close')">Annuleren</button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import store from '../store'

export default {
  props:{ initial:{type:Object,default:null} },
  setup(props, { emit }){
    const form = reactive({ id:null, name:'', short:'', full:'', category:'', players:1, intensity:3, minutes:5, images:[], video:'' })
    const imageToAdd = ref('')

    watch(()=>props.initial, (v)=>{
      if (v){ Object.assign(form, v) }
      else{ Object.assign(form, { id:null, name:'', short:'', full:'', category:'', players:1, intensity:3, minutes:5, images:[], video:'' }) }
    }, { immediate:true })

    function save(){
      const payload = { ...form }
      if (payload.id) store.updateExercise(payload.id, payload)
      else store.addExercise(payload)
      emit('save', payload)
    }

    return { form, imageToAdd, save }
  }
}
</script>

<style scoped>

</style>