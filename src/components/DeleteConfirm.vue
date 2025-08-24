<template>
  <div class="flex h-full flex-col">
    <!-- Sticky header -->
    <div class="sticky top-0 z-[1] bg-white dark:bg-gray-700 px-5 sm:px-10 pt-5 pb-4 border-b dark:bg-gray-600">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          Bevestig verwijderen
        </h3>
        <button
          type="button"
          class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600"
          aria-label="Sluiten"
          @click="$emit('cancel')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 sm:px-10 pt-5 flex-1">
      <p class="text-gray-700 dark:text-gray-50 mb-6">Je staat op het punt "{{ name }}" te verwijderen, weet je dit zeker?</p>
      <div class="flex justify-end gap-3">
        <UiButton color="cancel" @click="$emit('cancel')">Annuleer</UiButton>
        <UiButton color="danger" @click="$emit('confirm')">Verwijder</UiButton>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from './ui/Button.vue'
export default {
  name: 'DeleteConfirm',
  components: { UiButton },
  props: {
    name: { type: String, default: '' }
  },
  emits: ['cancel', 'confirm']
}
</script>
