<template>
  <transition name="msd-overlay-fade" appear>
    <div
      v-show="open"
      class="fixed inset-0 z-[5000] flex bg-black/50 items-stretch justify-start xl:hidden"
      @mousedown="onOverlayMouseDown"
      @click="onOverlayClick"
      role="presentation"
    >
      <transition name="msd-drawer-left" appear>
        <div
          v-show="open"
          ref="panel"
          class="relative bg-white shadow-xl overflow-y-auto h-full w-full"
          :class="[drawerWidthClass, contentPaddingClass]"
          role="dialog"
          aria-modal="true"
        >
          <slot />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MobileSidebarDrawer',
  props: {
    open: { type: Boolean, default: false },
    // side kept for future extensibility; only 'left' is used for the mobile menu
    side: { type: String, default: 'left' },
    drawerWidthClass: { type: String, default: 'max-w-xs' },
    contentPaddingClass: { type: String, default: 'p-0' }
  },
  emits: ['close'],
  data() {
    return { mouseStartedOnOverlay: false }
  },
  methods: {
    onOverlayMouseDown(e) {
      this.mouseStartedOnOverlay = e.target === e.currentTarget
    },
    onOverlayClick(e) {
      if (e.target === e.currentTarget && this.mouseStartedOnOverlay) {
        this.$emit('close')
      }
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
.msd-overlay-fade-enter-active,
.msd-overlay-fade-leave-active {
  transition: opacity 200ms ease;
}
.msd-overlay-fade-enter-from,
.msd-overlay-fade-leave-to {
  opacity: 0;
}

/* Drawer slide from left */
.msd-drawer-left-enter-active,
.msd-drawer-left-leave-active {
  transition: transform 260ms ease, opacity 260ms ease;
}
.msd-drawer-left-enter-from,
.msd-drawer-left-leave-to {
  transform: translateX(-100%);
  opacity: 0.9;
}
.msd-drawer-left-enter-to,
.msd-drawer-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
