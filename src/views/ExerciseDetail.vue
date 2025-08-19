<template>
  <div class="container mx-auto px-4 py-6" v-if="exercise">
    <div class="mb-6 flex items-center gap-3">
      <div class="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center">
        <component :is="exercise.icon || exercise.imageIcon || 'TrafficCone'" class="w-8 h-8 text-gray-700" />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-gray-800 break-words">{{ exercise.name }}</h1>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-for="cat in exercise.category" :key="cat" class="badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{{ cat }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Beschrijving</h2>
          <p class="text-gray-700 leading-relaxed">{{ exercise.description || exercise.shortDescription }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Coaching punten</h2>
          <div class="prose max-w-none" v-html="exercise.coachingPoints || exercise.fullDescription"></div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Details</h2>
          <div class="flex flex-col gap-2 text-gray-800">
            <div class="flex items-center gap-2"><Users class="w-4 h-4" /> <span>Spelers: {{ exercise.minPlayers }}<span v-if="exercise.maxPlayers">-{{ exercise.maxPlayers }}</span></span></div>
            <div class="flex items-center gap-2"><TimerReset class="w-4 h-4" /> <span>Duur: {{ exercise.duration }} min</span></div>
            <div class="flex items-center gap-2"><Zap class="w-4 h-4" /> <span>Intensiteit: {{ exercise.intensity }}/5</span></div>
          </div>

          <div v-if="exercise.materials && exercise.materials.length" class="mt-4">
            <div class="text-sm font-medium text-gray-700 mb-1">Materialen</div>
            <ul class="list-disc pl-5 text-gray-700">
              <li v-for="m in exercise.materials" :key="m">{{ m }}</li>
            </ul>
          </div>

          <div v-if="exercise.video" class="mt-4">
            <div class="text-sm font-medium text-gray-700 mb-1">Video</div>
            <a :href="exercise.video" target="_blank" rel="noopener" class="text-blue-600 hover:underline">Bekijk video</a>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <router-link to="/oefeningen" class="text-blue-600 hover:underline inline-flex items-center gap-1"><ArrowLeftToLine class="w-4 h-4" /> Terug naar oefeningen</router-link>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-12 text-center text-gray-600">
    <p>Oefening niet gevonden.</p>
    <router-link to="/oefeningen" class="text-blue-600 hover:underline block mt-2">Terug</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import store from '../store'

function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const route = useRoute()
const slug = computed(() => route.params.slug)

const exercise = computed(() => {
  const list = store.state.exercises
  const target = String(slug.value || '')
  return list.find(e => slugify(e.name) === target)
})
</script>

<style scoped>
.badge { @apply w-fit px-2 py-1 text-xs font-medium rounded-full; }
.prose :deep(ul) { list-style: disc; padding-left: 1.25rem; }
.prose :deep(ol) { list-style: decimal; padding-left: 1.25rem; }
</style>
