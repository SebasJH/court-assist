<!-- components/Modal.vue -->
<template>
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="$emit('close')"
  >
    <!-- Scrollbare content -->
    <div
        class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        role="dialog"
        aria-modal="true"
    >
      <button
          class="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Sluiten"
          @click="$emit('close')"
      >
        <X />
      </button>

      <slot />
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],
  mounted() {
    this._onKey = (e) => {
      if (e.key === 'Escape') this.$emit('close')
    }
    window.addEventListener('keydown', this._onKey)
  },
  unmounted() {
    window.removeEventListener('keydown', this._onKey)
  }
}
</script>
