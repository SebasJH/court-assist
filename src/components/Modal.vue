<!-- components/Modal.vue -->
<template>
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @mousedown="onOverlayMouseDown"
      @click="onOverlayClick"
  >
    <!-- Scrollbare content -->
    <div
        ref="modalContent"
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
  data() {
    return {
      mouseStartedOnOverlay: false
    }
  },
  methods: {
    onOverlayMouseDown(e) {
      // Flag zetten als klik begon op overlay
      this.mouseStartedOnOverlay = e.target === e.currentTarget
    },
    onOverlayClick(e) {
      // Alleen sluiten als klik begon en eindigde op overlay
      if (e.target === e.currentTarget && this.mouseStartedOnOverlay) {
        this.$emit('close')
      }
      // Reset flag
      this.mouseStartedOnOverlay = false
    },
    onKeyDown(e) {
      if (e.key === 'Escape') this.$emit('close')
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeyDown)
  },
  unmounted() {
    window.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

