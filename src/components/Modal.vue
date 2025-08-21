<!-- components/Modal.vue -->
<template>
  <div
      class="fixed inset-0 z-[5000] flex bg-black/50"
      :class="overlayClass"
      @mousedown="onOverlayMouseDown"
      @click="onOverlayClick"
  >
    <!-- Scrollbare content -->
    <div
        ref="modalContent"
        class="relative bg-white shadow-xl overflow-y-auto"
        :class="contentClass"
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
  props: {
    maxWidthClass: { type: String, default: 'max-w-3xl' },
    // Drawer mode (right/left side panel)
    drawer: { type: Boolean, default: false },
    side: { type: String, default: 'right' },
    drawerWidthClass: { type: String, default: 'max-w-md' }
  },
  emits: ['close'],
  data() {
    return {
      mouseStartedOnOverlay: false
    }
  },
  computed: {
    overlayClass() {
      if (!this.drawer) return 'items-center justify-center'
      // stretch vertically and align to side
      return this.side === 'left' ? 'items-stretch justify-start' : 'items-stretch justify-end'
    },
    contentClass() {
      if (!this.drawer) {
        return `rounded-2xl w-full ${this.maxWidthClass} max-h-[90vh] p-6`
      }
      return `h-full w-full ${this.drawerWidthClass} p-6`
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

