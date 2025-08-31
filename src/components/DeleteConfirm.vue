<template>
  <div class="flex h-full flex-col">

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
