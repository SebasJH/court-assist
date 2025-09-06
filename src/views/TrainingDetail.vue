<template>
  <PageHeader :title="training ? training.name : 'Training'">
    <template #lead>
      <div class="flex items-center gap-3 min-w-0">
        <router-link
          to="/trainingen"
          class="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600 flex-shrink-0"
          aria-label="Terug"
          title="Terug naar trainingen"
        >
          <ChevronLeft class="w-5 h-5" />
        </router-link>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-50 leading-tight truncate">{{ training ? training.name : 'Training' }}</h1>
      </div>
    </template>
  </PageHeader>

  <div class="container mx-auto px-4 py-6" v-if="training">
    <div class="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="text-sm text-gray-500">Datum</div>
          <div class="text-base font-medium">{{ dateLabel }}</div>
        </div>
        <div v-if="training.theme">
          <div class="text-sm text-gray-500">Thema</div>
          <div class="text-base font-medium">{{ training.theme }}</div>
        </div>
        <div v-if="isNum(training.duration)">
          <div class="text-sm text-gray-500">Duur</div>
          <div class="text-base font-medium">{{ formatDuration(training.duration) }}</div>
        </div>
        <div v-if="isNum(training.participants)">
          <div class="text-sm text-gray-500">Deelnemers</div>
          <div class="text-base font-medium">{{ training.participants }}</div>
        </div>
      </div>

      <div class="mt-6">
        <div class="text-sm text-gray-500">Beschrijving</div>
        <p class="mt-1 text-gray-800 dark:text-gray-100">{{ training.description }}</p>
      </div>
    </div>
  </div>

  <div v-else class="container mx-auto px-4 py-12 text-center text-gray-600">
    <p>Training niet gevonden.</p>
    <router-link to="/trainingen" class="text-blue-500 hover:underline block mt-2">Terug</router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import store from '../store'
import PageHeader from '../components/PageHeader.vue'

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
const training = computed(() => {
  const slug = String(route.params.slug || '')
  return (store.state.trainings || []).find(t => slugify(t.name) === slug)
})

const dateLabel = computed(() => {
  try {
    const t = training.value || {}
    if (t.date) {
      const parts = String(t.date).split('-').map(x => parseInt(x, 10))
      const y = parts[0], m = (parts[1] || 1) - 1, d0 = parts[2] || 1
      const d = new Date(y, m, d0)
      const base = Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      const s = t.time && t.time.start
      const e = t.time && t.time.end
      if (s && e) return base ? `${base} ${s}–${e}` : `${s}–${e}`
      if (s) return base ? `${base} ${s}` : `${s}`
      return base
    }
    if (t.trainingDate) {
      const d = new Date(t.trainingDate)
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      }
    }
    return ''
  } catch (_) { return '' }
})

function isNum(v){ return typeof v === 'number' && Number.isFinite(v) }
function formatDuration(min){
  const m = Number(min)
  if (!Number.isFinite(m) || m <= 0) return ''
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  if (r === 0) return `${h} ${h===1 ? 'uur' : 'uur'}`
  return `${h} ${h===1 ? 'uur' : 'uur'} en ${r} min`
}
</script>

<style scoped>
</style>
