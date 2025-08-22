<!-- components/Modal.vue -->
<template>
  <transition name="modal-overlay-fade" appear>
    <div
        class="fixed inset-0 z-[5000] flex bg-black/50"
        :class="overlayClass"
        @mousedown="onOverlayMouseDown"
        @click="onOverlayClick"
    >
      <!-- Scrollbare content -->
      <transition :name="drawer ? (side === 'left' ? 'drawer-left' : 'drawer-right') : 'modal-zoom'" appear>
        <div
            ref="modalContent"
            class="relative bg-white shadow-xl overflow-y-auto modal-panel"
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
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    maxWidthClass: { type: String, default: 'max-w-3xl' },
    // Drawer mode (right/left side panel)
    drawer: { type: Boolean, default: false },
    side: { type: String, default: 'right' },
    drawerWidthClass: { type: String, default: 'max-w-md' },
    contentPaddingClass: { type: String, default: 'p-6' }
  },
  emits: ['close'],
  data() {
    return {
      mouseStartedOnOverlay: false
    }
  },
  computed: {
    overlayClass() {
      if (!this.drawer) return 'items-end xl:items-center justify-center'
      // stretch vertically and align to side
      return this.side === 'left' ? 'items-stretch justify-start' : 'items-stretch justify-end'
    },
    contentClass() {
      if (!this.drawer) {
        return `rounded-none xl:rounded-2xl w-full ${this.maxWidthClass} max-h-[90vh] ${this.contentPaddingClass}`
      }
      return `h-full w-full ${this.drawerWidthClass} ${this.contentPaddingClass}`
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



<style scoped>
/* Overlay fade */
.modal-overlay-fade-enter-active,
.modal-overlay-fade-leave-active {
  transition: opacity 200ms ease;
}
.modal-overlay-fade-enter-from,
.modal-overlay-fade-leave-to {
  opacity: 0;
}

/* Drawer slide (right/left) */
.drawer-right-enter-active,
.drawer-right-leave-active,
.drawer-left-enter-active,
.drawer-left-leave-active {
  transition: transform 260ms ease, opacity 260ms ease;
}
.drawer-right-enter-from,
.drawer-right-leave-to {
  transform: translateX(100%);
  opacity: 0.9;
}
.drawer-right-enter-to,
.drawer-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.drawer-left-enter-from,
.drawer-left-leave-to {
  transform: translateX(-100%);
  opacity: 0.9;
}
.drawer-left-enter-to,
.drawer-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Centered modal subtle zoom */
.modal-zoom-enter-active,
.modal-zoom-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}
.modal-zoom-enter-from,
.modal-zoom-leave-to {
  transform: translateY(-8px) scale(0.98);
  opacity: 0;
}
.modal-zoom-enter-to,
.modal-zoom-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}
</style>
