<template>
  <div class="flex h-full flex-col">
    <!-- Sticky header with tabs -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-700 dark:border-gray-600 backdrop-blur-sm px-5 sm:px-10 pt-5 pb-0 border-b">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Instellingen
        </h3>
        <button
          type="button"
          class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300  bg-white text-gray-700  hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-none"
          aria-label="Sluiten"
          @click="$emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Tabs under header in sticky area -->
      <div class="mt-4 -mb-px overflow-x-auto">
        <div role="tablist" class="inline-flex items-center gap-2 border-b border-gray-200 dark:border-gray-600">
          <button type="button" role="tab" :aria-selected="currentTab==='profiel' ? 'true' : 'false'"
                  @click="currentTab='profiel'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="currentTab==='profiel' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'">
            Profiel
          </button>
          <button type="button" role="tab" :aria-selected="currentTab==='weergave' ? 'true' : 'false'"
                  @click="currentTab='weergave'"
                  class="px-3 py-2 text-sm font-medium border-b-2"
                  :class="currentTab==='weergave' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'">
            Weergave
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 sm:px-10 py-5 flex-1 overflow-y-auto space-y-6">
      <!-- Profiel -->
      <div v-show="currentTab==='profiel'">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-semibold">{{ draft.initials || 'SH' }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Profielinstellingen</div>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Naam</label>
            <input v-model="draft.name" @input="onDraftNameInput" class="form-input" placeholder="Je naam" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Initialen</label>
              <input v-model="draft.initials" @input="onDraftInitialsInput" class="form-input" placeholder="BV" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">E-mail (optioneel)</label>
              <input v-model="draft.email" class="form-input" placeholder="naam@voorbeeld.nl" />
            </div>
          </div>
        </div>
      </div>

      <!-- Weergave -->
      <div class="form-group" v-show="currentTab==='weergave'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Thema</label>
        <div class="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 h-10">
          <button type="button"
                  class="px-3 h-10 text-sm font-medium focus:outline-none"
                  :class="theme === 'light' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200'"
                  @click="selectTheme('light')">Light</button>
          <button type="button"
                  class="px-3 h-10 text-sm font-medium border-l border-gray-300 dark:border-gray-600 focus:outline-none"
                  :class="theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200'"
                  @click="selectTheme('dark')">Dark</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-5 sm:px-10 pt-5 border-t flex justify-end gap-3 dark:border-gray-600">
      <UiButton color="cancel" @click="$emit('close')">Annuleren</UiButton>
      <UiButton color="primary" @click="save">Opslaan</UiButton>
    </div>
  </div>
</template>

<script>
import UiButton from './ui/Button.vue'
import { getTheme, setTheme } from '../theme'
import { getUser, setUser, computeInitials } from '../user'

export default {
  name: 'Settings',
  components: { UiButton },
  emits: ['close', 'save'],
  data() {
    const user = getUser()
    return {
      currentTab: 'profiel',
      theme: getTheme(),
      draft: { name: user.name, email: user.email, initials: user.initials },
      initialsManual: false
    }
  },
  methods: {
    selectTheme(mode) {
      this.theme = mode === 'dark' ? 'dark' : 'light'
      setTheme(this.theme)
    },
    onDraftNameInput() {
      if (!this.initialsManual) {
        this.draft.initials = computeInitials(this.draft.name)
      }
    },
    onDraftInitialsInput() {
      this.initialsManual = true
      this.draft.initials = String(this.draft.initials || '').toUpperCase()
    },
    save() {
      // Persist profile and theme
      setUser({ ...this.draft })
      setTheme(this.theme)
      this.$emit('save')
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
</style>
