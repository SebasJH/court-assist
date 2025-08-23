<template>
  <div class="flex h-full flex-col">
    <!-- Sticky header -->
    <div class="sticky top-0 z-[1] bg-white/80 backdrop-blur-sm px-5 sm:px-10 pt-5 pb-4 border-b">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-xl font-bold text-gray-800">
          Bevestig verwijderen
        </h3>
        <button
          type="button"
          class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label="Sluiten"
          @click="$emit('cancel')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-5 sm:px-10 pt-5 flex-1">
      <p class="text-gray-700 mb-6">Je staat op het punt "{{ name }}" te verwijderen, weet je dit zeker?</p>
      <div class="flex justify-end gap-3">
        <UiButton color="secondary" @click="$emit('cancel')">Annuleer</UiButton>
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
