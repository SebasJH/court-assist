<template>
  <div class="p-4 border-t border-gray-200">
    <UiButton v-if="!collapsed" color="secondary" class="w-full mb-3 text-sm" @click="$emit('switch-sport')">
      Switch sport
    </UiButton>

    <!-- Profile -->
    <div class="flex items-center justify-center cursor-pointer select-none" :class="collapsed ? '' : 'gap-3'" @click="$emit('open-settings')" role="button" aria-label="Open instellingen">
      <div class="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-medium">
        {{ userInitials }}
      </div>
      <div
        class="text-sm font-medium text-gray-700 transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden whitespace-nowrap"
        :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
      >
        {{ userName }}
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '../ui/Button.vue'

export default {
  name: 'SidebarFooter',
  components: { UiButton },
  props: {
    collapsed: {
      type: Boolean,
      required: true
    },
    userInitials: {
      type: String,
      default: 'SH'
    },
    userName: {
      type: String,
      default: 'Sebas Hartman'
    }
  },
  emits: ['switch-sport', 'open-settings']
}
</script>
