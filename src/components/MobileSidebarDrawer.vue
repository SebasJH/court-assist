<template>
  <div v-if="visible" class="fixed inset-0 z-40 xl:hidden">
    <!-- Backdrop (no animation) -->
    <div 
      class="fixed inset-0 bg-black/20 backdrop-blur-sm"
      @click="onBackdropClick"
    ></div>

    <!-- Drawer (animate only the panel) -->
    <div class="fixed inset-y-0 left-0 w-full max-w-xs">
      <div :class="panelClass">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileSidebarDrawer',
  props: {
    open: { type: Boolean, default: false }
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
      if (newVal) {
        // Opening
        this.clearTimer()
        this.visible = true
        this.isClosing = false
      } else {
        // Start closing animation
        if (!this.visible) return
        this.isClosing = true
        this.clearTimer()
        this.closeTimer = setTimeout(() => {
          this.visible = false
          this.closeTimer = null
        }, 280)
      }
    }
  },
  computed: {
    panelClass() {
      return [
        'h-full glass-card shadow-glass overflow-hidden',
        this.isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'
      ]
    }
  },
  methods: {
    onBackdropClick() {
      this.$emit('close')
    },
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
@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes slideOutLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
.animate-slide-in-left { animation: slideInLeft 0.28s ease-out; }
.animate-slide-out-left { animation: slideOutLeft 0.28s ease-in; }
</style>
