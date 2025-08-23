<template>
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[5000] pointer-events-none" aria-live="polite" aria-atomic="true">
    <transition-group name="toast" tag="div" class="flex flex-col items-center gap-2">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="pointer-events-auto min-w-[280px] max-w-[90vw] rounded-xl px-4 py-3 shadow-glass glass-container border relative flex items-center justify-center"
      >
        <span :class="['absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full', dotClass(n.type)]"></span>
        <span class="block w-full text-sm font-medium text-gray-800 text-center">{{ n.message }}</span>
        <button
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          @click="remove(n.id)"
          aria-label="Sluiten"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import store from '../store.js'

export default {
  name: 'NotificationBar',
  computed: {
    notifications() {
      return store.state.notifications
    }
  },
  methods: {
    remove(id) {
      store.removeNotification(id)
    },
    dotClass(type) {
      switch (type) {
        case 'success': return 'bg-green-500'
        case 'error': return 'bg-red-500'
        case 'warning': return 'bg-yellow-400'
        case 'info':
        default:
          return 'bg-blue-500'
      }
    }
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 180ms ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
.toast-enter-to, .toast-leave-from { opacity: 1; transform: translateY(0) scale(1); }
</style>
