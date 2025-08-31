<template>
  <div class="flex h-full flex-col">

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
            <label class="form-label">Naam</label>
            <input v-model="draft.name" @input="onDraftNameInput" class="form-input" placeholder="Je naam" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="form-label">Initialen</label>
              <input v-model="draft.initials" @input="onDraftInitialsInput" class="form-input" placeholder="BV" />
            </div>
            <div>
              <label class="form-label">E-mail (optioneel)</label>
              <input v-model="draft.email" class="form-input" placeholder="naam@voorbeeld.nl" />
            </div>
          </div>
        </div>
      </div>

      <!-- Weergave -->
      <div class="form-group" v-show="currentTab==='weergave'">
        <label class="form-label block mb-2">Thema</label>
        <div class="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 h-10">
          <button type="button"
                  class="px-3 h-10 text-sm font-medium focus:outline-none"
                  :class="theme === 'light' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-750 hover:bg-blue-50 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200'"
                  @click="selectTheme('light')">Licht</button>
          <button type="button"
                  class="px-3 h-10 text-sm font-medium border-l border-gray-300 dark:border-gray-600 focus:outline-none"
                  :class="theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-750 hover:bg-blue-50 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200'"
                  @click="selectTheme('dark')">Donker</button>
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
  props: {
    currentTab: { type: String, default: 'profiel' }
  },
  emits: ['close', 'save', 'update:currentTab'],
  data() {
    const user = getUser()
    return {
      theme: getTheme(),
      draft: { name: user.name, email: user.email, initials: user.initials },
      initialsManual: false
    }
  },
  methods: {
    setTab(tab){ this.$emit('update:currentTab', tab) },
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
