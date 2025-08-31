<!-- components/Modal.vue -->
<template>
  <teleport to="body">
    <div
          v-if="visible"
          class="fixed inset-0 z-[5000] flex bg-black/30 dark:bg-black/60"
          :class="overlayClass"
          @mousedown="onOverlayMouseDown"
          @click="onOverlayClick"
      >
        <!-- Scrollbare content -->
        <transition :name="drawer ? (side === 'left' ? 'drawer-left' : 'drawer-right') : 'modal-bottom'" appear>
          <div
              v-show="open"
              ref="modalContent"
              class="relative bg-white dark:bg-gray-750 shadow-xl overflow-y-auto modal-panel"
              :class="contentClass"
              role="dialog"
              aria-modal="true"
          >

            <div class="flex h-full flex-col">
              <div class="modal-sticky-header" :class="hasTabs ? 'pt-5 pb-0 border-b-0' : 'pt-5 pb-4'">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                    <slot name="title">Titel</slot>
                  </h3>
                  <button
                    type="button"
                    class="close-modal-button"
                    aria-label="Sluiten"
                    @click="emitCancel"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="$slots.tabs" class="mt-4 -mb-px overflow-x-auto">
                  <slot name="tabs" />
                </div>
              </div>

              <div class="flex-1">
                <slot />
              </div>
            </div>
          </div>
        </transition>
      </div>
  </teleport>
</template>

<script>
export default {
  props: {
    open: { type: Boolean, default: false },
    maxWidthClass: { type: String, default: 'max-w-3xl' },
    // Drawer mode (right/left side panel)
    drawer: { type: Boolean, default: false },
    side: { type: String, default: 'right' },
    drawerWidthClass: { type: String, default: 'max-w-md' },
    contentPaddingClass: { type: String, default: 'p-8' },
    hasTabs: { type: Boolean, default: false },
    // Deprecated: kept for backward compatibility, no longer used
    hideDefaultClose: { type: Boolean, default: false }
  },
  emits: ['close','cancel'],
  data() {
    return {
      mouseStartedOnOverlay: false,
      visible: this.open,
      closeTimer: null
    }
  },
  computed: {
    overlayClass() {
      if (!this.drawer) return 'items-end md:items-center justify-center'
      // stretch vertically and align to side
      return this.side === 'left' ? 'items-stretch justify-start' : 'items-stretch justify-end'
    },
    contentClass() {
      if (!this.drawer) {
        return `rounded-t-2xl md:rounded-2xl w-full ${this.maxWidthClass} max-h-[90vh] ${this.contentPaddingClass} pb-safe-6`
      }
      return `h-full w-full ${this.drawerWidthClass} ${this.contentPaddingClass}`
    }
  },
  watch: {
    open(newVal) {
      if (newVal) {
        // Opening: ensure overlay/container is visible immediately
        this.clearTimer()
        this.visible = true
      } else {
        // Closing: keep visible until leave animation completes (match 260ms drawer leave)
        if (!this.visible) return
        this.clearTimer()
        const duration = 260
        this.closeTimer = setTimeout(() => {
          this.visible = false
          this.closeTimer = null
        }, duration)
      }
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
    },
    emitCancel() {
      // Emit both for compatibility: new 'cancel' and legacy 'close'
      this.$emit('cancel')
      this.$emit('close')
    },
    clearTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
        this.closeTimer = null
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeyDown)
  },
  unmounted() {
    window.removeEventListener('keydown', this.onKeyDown)
    this.clearTimer()
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

/* Mobile-first bottom slide for non-drawer modals */
.modal-bottom-enter-active,
.modal-bottom-leave-active {
  transition: transform 260ms ease, opacity 260ms ease;
}
.modal-bottom-enter-from,
.modal-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0.9;
}
.modal-bottom-enter-to,
.modal-bottom-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* Desktop (md+) override: keep centered subtle zoom like before */
@media (min-width: 768px) {
  .modal-bottom-enter-active,
  .modal-bottom-leave-active {
    transition: transform 220ms ease, opacity 220ms ease;
  }
  .modal-bottom-enter-from,
  .modal-bottom-leave-to {
    transform: translateY(-8px) scale(0.98);
    opacity: 0;
  }
  .modal-bottom-enter-to,
  .modal-bottom-leave-from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
