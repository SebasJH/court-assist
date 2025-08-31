<template>
  <PageHeader :title="pageTitle">
    <template #lead>
      <div class="flex items-center gap-3 min-w-0 w-full">
        <button
          type="button"
          class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600"
          aria-label="Terug"
          title="Terug"
          @click="goBack"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-50 leading-tight truncate">
          {{ pageTitle }}
        </h1>
      </div>
    </template>
    <template #actions>
      <UiButton :color="isEditMode ? 'primary' : 'success'" @click="triggerSave">
        {{ isEditMode ? 'Opslaan' : 'Aanmaken' }}
      </UiButton>
    </template>
  </PageHeader>

  <div class="container mx-auto px-4 py-6">
    <div class="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
      <!-- Tabs header (keeping the same tab logic) -->
      <div class="px-5 sm:px-10 pt-5">
        <div role="tablist" class="inline-flex items-center gap-2 border-b border-gray-200 dark:border-gray-600">
          <button type="button" role="tab" :aria-selected="formTab==='basis' ? 'true' : 'false'"
                  @click="formTab='basis'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="formTab==='basis' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'">
            Basis
          </button>
          <button type="button" role="tab" :aria-selected="formTab==='details' ? 'true' : 'false'"
                  @click="formTab='details'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="formTab==='details' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'">
            Details
          </button>
          <button type="button" role="tab" :aria-selected="formTab==='tekst' ? 'true' : 'false'"
                  @click="formTab='tekst'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="formTab==='tekst' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'">
            Tekst
          </button>
          <button type="button" role="tab" :aria-selected="formTab==='media' ? 'true' : 'false'"
                  @click="formTab='media'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="formTab==='media' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'">
            Media
          </button>
        </div>
      </div>

      <!-- Form content -->
      <exercise-form
          ref="formRef"
          v-if="!isEditMode || initialExercise"
          class="block"
          :key="formKey"
          :initial="initialExercise"
          :categories="categories"
          v-model:currentTab="formTab"
          :hideFooterActions="true"
          @save="onSave"
      />
    </div>

    <!-- Not found state for edit mode -->
    <div v-if="isEditMode && !initialExercise" class="mt-6 text-center text-gray-600 dark:text-gray-200">
      <p>Oefening niet gevonden.</p>
      <router-link to="/oefeningen" class="text-blue-600 hover:underline block mt-2">Terug</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import ExerciseForm from '../components/exercise/ExerciseForm.vue'
import UiButton from '../components/ui/Button.vue'
import { EXERCISE_CATEGORIES } from '../constants'
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
const router = useRouter()

const categories = EXERCISE_CATEGORIES
const formTab = ref('basis')
const formKey = ref(0)
const formRef = ref(null)

function normalizeTab(t){
  const v = String(t || '').toLowerCase()
  return ['basis','details','tekst','media'].includes(v) ? v : 'basis'
}

// Initialize tab from query if provided
try { formTab.value = normalizeTab(route.query.tab) } catch(_) {}

const isEditMode = computed(() => !!route.params.slug)

const initialExercise = computed(() => {
  if (!isEditMode.value) return null
  const list = store.state.exercises
  const target = String(route.params.slug || '')
  return list.find(e => slugify(e.name) === target)
})

const pageTitle = computed(() => isEditMode.value ? 'Wijzig oefening' : 'Nieuwe oefening')

function goBack() {
  try { router.back() } catch (_) { router.push('/oefeningen') }
}

function triggerSave() {
  try {
    formRef.value && typeof formRef.value.save === 'function' ? formRef.value.save() : null
  } catch (_) {}
}

function onSave(payload) {
  if (payload.id) {
    store.updateExercise(payload.id, payload)
    const cur = initialExercise.value
    const name = (payload && payload.name) ? payload.name : (cur ? cur.name : '')
    const s = slugify(name)
    router.push(`/oefening/${s}`)
  } else {
    const created = store.addExercise(payload)
    const name = (created && created.name) ? created.name : (payload.name || '')
    const s = slugify(name)
    router.push(`/oefening/${s}`)
  }
}

watch(() => route.fullPath, () => { formKey.value++ })
watch(() => route.query.tab, (t) => { try { formTab.value = normalizeTab(t) } catch(_) {} })
</script>
