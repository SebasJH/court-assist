<template>
  <div class="p-2">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Bevestig verwijderen</h3>
    <p class="text-gray-700 mb-6">Je staat op het punt "{{ name }}" te verwijderen, weet je dit zeker?</p>
    <div class="flex justify-end gap-3">
      <UiButton color="secondary" outline @click="$emit('cancel')">Annuleer</UiButton>
      <UiButton color="danger" @click="$emit('confirm')">Verwijder</UiButton>
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
