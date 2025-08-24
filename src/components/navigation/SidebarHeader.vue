<template>
  <div class="p-4 border-b border-gray-200 dark:border-gray-600">
    <div class="flex items-center justify-between">
      <!-- Title fades/width-transitions for smoothness -->
      <div
        class="text-xl font-bold text-blue-500 transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden whitespace-nowrap"
        :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'"
        aria-hidden="true"
      >
        COURT ASSIST
      </div>
      <div class="ml-auto flex items-center gap-2">
        <button
          class="xl:hidden inline-flex justify-center items-center rounded-md w-10 h-10 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 dark:bg-transparent  dark:text-gray-50 transition-colors duration-200"
          title="Sluit menu"
          aria-label="Sluit menu"
          @click="$emit('close-mobile')"
        >
          <X :class="iconSizeClass" />
        </button>
        <button
          class="hidden xl:inline-flex rounded-md p-2 hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-600 dark:text-gray-50 transition-colors duration-200"
          :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="$emit('toggle')"
        >
          <ArrowRightToLine v-if="collapsed" :class="iconSizeClass" />
          <ArrowLeftToLine v-else :class="iconSizeClass" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarHeader',
  props: {
    collapsed: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close-mobile', 'toggle'],
  computed: {
    iconSizeClass() {
      return 'w-5 h-5'
    }
  }
}
</script>
