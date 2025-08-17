<template>
  <div class="exercise-card bg-white rounded-lg shadow-sm p-6 border border-[#E2E8F0] transition-shadow duration-200">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
        📷
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <div class="text-lg font-bold text-gray-800">{{exercise.name}}</div>
          <div class="badge small">{{exercise.category}}</div>
          <div class="ml-auto flex gap-2 items-center">
            <div class="text-sm text-gray-600">{{exercise.players}}p</div>
            <div class="text-sm text-gray-600">{{exercise.minutes}}min</div>
            <div class="text-sm text-gray-600">{{exercise.intensity}}/5</div>
            <div class="star cursor-pointer text-xl" @click.stop="$emit('toggle-fav', exercise.id)">
              {{exercise.favorite ? '⭐' : '☆'}}
            </div>
            <div class="menu cursor-pointer text-xl">⋯</div>
          </div>
        </div>
        <div class="text-sm text-gray-600">{{exercise.short}}</div>
      </div>
      <div class="flex flex-col gap-2">
        <button class="btn-secondary text-sm" @click="$emit('edit', exercise)">Wijzigen</button>
        <button class="btn-secondary text-sm" @click="$emit('duplicate', exercise.id)">Dupliceren</button>
        <button class="btn-secondary text-sm" @click="$emit('delete', exercise.id)">Verwijderen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'ExerciseCard',
  props:{ exercise:{type:Object, required:true} }
}
</script>

<style scoped>
.badge {
  @apply px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full;
}

.star:hover {
  @apply text-yellow-500;
}

.menu:hover {
  @apply text-gray-600;
}
</style>