<!-- components/Modal.vue -->
<template>
  <div v-if="visible" class="fixed inset-0 z-[4900]">
    <!-- Backdrop (no animation) -->
    <div 
      class="fixed inset-0 bg-black/20 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <!-- Drawer variant -->
    <template v-if="drawer">
      <div class="fixed inset-y-0" :class="side === 'right' ? 'right-0' : 'left-0'">
        <div
          :class="drawerPanelClass"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </template>

    <!-- Centered dialog variant -->
    <template v-else>
      <div class="fixed inset-0 flex min-h-full items-end sm:items-center justify-center p-4">
        <div
          :class="dialogPanelClass"
          @click.stop
        >
          <!-- Close button -->
          <button
            v-if="!hideDefaultClose"
            @click="$emit('close')"
            class="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full glass hover:glass-button transition-modern"
            aria-label="Sluiten"
          >
            <X class="w-4 h-4" />
          </button>

          <!-- Content -->
          <div class="relative" :class="contentPaddingClass">
            <slot />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    open: { type: Boolean, default: false },
    hideDefaultClose: { type: Boolean, default: false },
    drawer: { type: Boolean, default: false },
    side: { type: String, default: 'right' },
    drawerWidthClass: { type: String, default: 'w-full max-w-md sm:max-w-lg' },
    contentPaddingClass: { type: String, default: '' }
  },
  emits: ['close'],
  data() {
    return {
      visible: this.open,
      isClosing: false,
      closeTimer: null
    }
  },
  watch: {
    open(newVal) {
      this.clearTimer()
      if (newVal) {
        // Opening: show immediately and reset closing state
        this.visible = true
        this.isClosing = false
      } else {
        // Start closing animation (keep mounted until animation completes)
        if (!this.visible) return
        this.isClosing = true
        const duration = this.drawer ? 280 : 240
        this.closeTimer = setTimeout(() => {
          this.visible = false
          this.isClosing = false
          this.closeTimer = null
        }, duration)
      }
    }
  },
  computed: {
    drawerPanelClass() {
      const base = ['h-full w-full glass-card shadow-glass overflow-hidden', this.drawerWidthClass]
      const anim = this.isClosing
        ? (this.side === 'right' ? 'animate-slide-out-right' : 'animate-slide-out-left')
        : (this.side === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left')
      return [...base, anim]
    },
    dialogPanelClass() {
      const base = ['relative w-full sm:max-w-4xl glass-card rounded-t-2xl sm:rounded-2xl shadow-glass overflow-hidden sm:overflow-visible max-h-[85vh] sm:max-h-none']
      const anim = this.isClosing ? 'animate-dialog-out' : 'animate-dialog-in'
      return [...base, anim]
    }
  },
  methods: {
    clearTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
        this.closeTimer = null
      }
    }
  },
  beforeUnmount() {
    this.clearTimer()
  }
}
</script>

<style scoped>
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes slideOutRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
@keyframes slideOutLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
.animate-slide-in-right { animation: slideInRight 0.28s ease-out; }
.animate-slide-in-left { animation: slideInLeft 0.28s ease-out; }
.animate-slide-out-right { animation: slideOutRight 0.28s ease-in; }
.animate-slide-out-left { animation: slideOutLeft 0.28s ease-in; }

/* Dialog (non-drawer) responsive animations */
@keyframes dialogInMobile {
  from { transform: translateY(100%); opacity: 1; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes dialogOutMobile {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 1; }
}
@keyframes dialogInDesktop {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes dialogOutDesktop {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.96); opacity: 0; }
}
/* Default to mobile slide for small screens */
.animate-dialog-in { animation: dialogInMobile 0.24s ease-out; }
.animate-dialog-out { animation: dialogOutMobile 0.22s ease-in; }
/* On >= sm screens, switch to scale+fade */
@media (min-width: 640px) {
  .animate-dialog-in { animation: dialogInDesktop 0.24s ease-out; }
  .animate-dialog-out { animation: dialogOutDesktop 0.20s ease-in; }
}
</style>
