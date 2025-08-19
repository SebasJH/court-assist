<template>
  <div class="p-2">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Bevestig verwijderen</h3>
    <p class="text-gray-700 mb-6">Je staat op het punt "{{ name }}" te verwijderen, weet je dit zeker?</p>
    <div class="flex justify-end gap-3">
      <button class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50" @click="$emit('cancel')">Annuleer</button>
      <button class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" @click="$emit('confirm')">Verwijder</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirm',
  props: {
    name: { type: String, default: '' }
  },
  emits: ['cancel', 'confirm']
}
</script>
