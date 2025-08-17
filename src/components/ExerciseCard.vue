<template>
  <div class="card">
    <div style="width:64px;height:64px;border-radius:8px;background:#f3f6f8;display:flex;align-items:center;justify-content:center">📷</div>
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="font-weight:700">{{exercise.name}}</div>
        <div class="badge small">{{exercise.category}}</div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
          <div class="small">{{exercise.players}}p</div>
          <div class="small">{{exercise.minutes}}min</div>
          <div class="small">{{exercise.intensity}}/5</div>
          <div class="star" @click.stop="$emit('toggle-fav', exercise.id)">{{exercise.favorite ? '⭐' : '☆'}}</div>
          <div class="menu">⋯
            <div style="position:relative">
              <!-- simple dropdown -->
            </div>
          </div>
        </div>
      </div>
      <div class="small" style="margin-top:8px">{{exercise.short}}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="small" @click="$emit('edit', exercise)">Wijzigen</button>
      <button class="small" @click="$emit('duplicate', exercise.id)">Dupliceren</button>
      <button class="small" @click="$emit('delete', exercise.id)">Verwijderen</button>
    </div>
  </div>
</template>

<script>
export default {
  name:'ExerciseCard',
  props:{ exercise:{type:Object, required:true} }
}
</script>