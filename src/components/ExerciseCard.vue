<template>
  <div class="exercise-card">

    <div class="flex flex-col gap-y-4">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          Image
        </div>

        <div class="flex-1">
          <div class="flex flex-col">
            <div class="text-lg font-bold text-gray-800">{{ exercise.name }}</div>
            <div class="exercise-category badge small">{{ exercise.category }}</div>
          </div>
        </div>

        <div class="menu cursor-pointer">
          <Ellipsis/>
        </div>
      </div>



      <div class="exercise-details ">
        <div class="text-sm text-gray-600">{{ exercise.short }}</div>

        <div class="flex flex-wrap items-center gap-x-1 mt-1">
          <div class="exercise-players text-sm text-gray-600 flex items-center gap-1">
            <Users class="w-4 h-4" />
            {{ exercise.players }}p
          </div>

          <div class="exercise-duration text-sm text-gray-600 flex items-center gap-1">
            <TimerReset class="w-4 h-4" />
            {{ exercise.minutes }}min
          </div>

          <div class="exercise-intensity text-sm text-gray-600 flex items-center gap-1">
            <Zap class="w-4 h-4" />
            {{ exercise.intensity }}/5
          </div>
        </div>
      </div>

    </div>


    <!--      <div class="flex flex-col gap-2">-->
    <!--        <button class="btn-secondary text-sm" @click="$emit('edit', exercise)">Wijzigen</button>-->
    <!--        <button class="btn-secondary text-sm" @click="$emit('duplicate', exercise.id)">Dupliceren</button>-->
    <!--        <button class="btn-secondary text-sm" @click="$emit('delete', exercise.id)">Verwijderen</button>-->
    <!--      </div>-->



<!--    <div class="ml-auto flex gap-2 items-center">-->

<!--      <div class="star cursor-pointer text-xl" @click.stop="$emit('toggle-fav', exercise.id)">-->
<!--        {{ exercise.favorite ? '⭐' : '☆' }}-->
<!--      </div>-->

<!--    </div>-->
  </div>
</template>

<script setup>
  defineProps({
    exercise: {
      type: Object,
      required: true
    }
  })
</script>

<style scoped>

</style>