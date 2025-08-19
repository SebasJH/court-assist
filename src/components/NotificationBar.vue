<template>
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
    <transition-group name="toast" tag="div" class="flex flex-col gap-2 items-center">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="relative pointer-events-auto min-w-[260px] max-w-[90vw] md:max-w-md rounded-lg shadow-lg px-4 pr-10 py-3 text-white flex items-center min-h-[44px]"
        :class="typeClass(n.type)"
        role="status"
        aria-live="polite"
      >
        <div class="w-full text-center text-sm font-medium">{{ n.message }}</div>
        <button class="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" aria-label="Sluiten" @click="close(n.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import store from '../store'

const notifications = computed(() => store.state.notifications)

function typeClass(type) {
  switch (type) {
    case 'error':
      return 'bg-red-600'
    case 'info':
      return 'bg-blue-600'
    default:
      return 'bg-green-600'
  }
}

function close(id) {
  store.removeNotification(id)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 180ms ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.toast-enter-to, .toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
