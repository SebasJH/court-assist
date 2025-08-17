<template>
  <div class="form-modal">
    <h3>{{initial ? 'Wijzig oefening' : 'Nieuwe oefening'}}</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
      <input v-model="form.name" placeholder="Naam" />
      <input v-model="form.category" placeholder="Categorie" />
      <input v-model="form.short" placeholder="Korte uitleg" />
      <input type="number" v-model.number="form.players" placeholder="Aantal spelers" />
      <input type="number" v-model.number="form.intensity" placeholder="Intensiteit 1-5" min="1" max="5" />
      <input type="number" v-model.number="form.minutes" placeholder="Duur (min)" />
      <input v-model="form.video" placeholder="Video link (optioneel)" />
      <input v-model="imageToAdd" placeholder="Afbeeldings URL toevoegen" />
    </div>
    <textarea v-model="form.full" style="width:100%;height:120px;margin-top:10px" placeholder="Volledige uitleg"></textarea>
    <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
      <button class="btn" @click="save">Opslaan</button>
      <button @click="$emit('close')">Annuleren</button>
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