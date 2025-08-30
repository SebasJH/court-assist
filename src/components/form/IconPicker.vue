<template>
  <div class="relative w-full" ref="containerRef">
    <div class="flex w-full">
      <div
        class="px-3 py-2 h-10 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 flex items-center justify-center focus:outline-none focus:ring-0"
        :class="open ? 'border-blue-500' : ''"
        :title="modelValue"
      >
        <component :is="modelValue" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </div>
      <button
        type="button"
        class="bg-gray-100 dark:bg-gray-600/40 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-xl px-3 h-10 flex items-center justify-center flex-1 text-gray-700 dark:text-gray-100 text-sm hover:bg-blue-50 dark:hover:bg-gray-500/50 hover:text-blue-700 transition-colors focus:outline-none focus:ring-0"
        @click="toggle"
      >
        Wijzigen
      </button>
    </div>

    <div
      v-if="open"
      ref="menuRef"
      class="absolute right-0 z-20 mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg w-60"
    >
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="icon in icons"
          :key="icon"
          type="button"
          class="flex items-center h-10 w-10 justify-center border rounded p-2 transition-colors focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-200"
          :class="modelValue === icon ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'"
          @click="select(icon)"
          :title="icon"
        >
          <component :is="icon" :class="modelValue === icon ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-700 dark:text-gray-200'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'IconPicker',
  props: {
    modelValue: { type: String, required: true },
    icons: { type: Array, default: () => [] }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const open = ref(false)
    const menuRef = ref(null)
    const containerRef = ref(null)

    function toggle() {
      open.value = !open.value
    }
    function select(icon) {
      emit('update:modelValue', icon)
      open.value = false
    }
    function handleClickOutside(event) {
      const container = containerRef.value
      if (container && container.contains(event.target)) return
      open.value = false
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClickOutside)
    })

    return { open, menuRef, containerRef, toggle, select }
  }
}
</script>

<style scoped>
</style>
