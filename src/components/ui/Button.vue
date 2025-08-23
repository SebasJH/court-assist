<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-modern focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      colorClasses[color],
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <component v-if="icon" :is="icon" :class="iconSizeClasses[size]" />
    <slot />
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent', 'danger', 'success', 'warning'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    icon: {
      type: [String, Object],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  computed: {
    sizeClasses() {
      return {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
      }
    },
    iconSizeClasses() {
      return {
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6'
      }
    },
    colorClasses() {
      return {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-modern',
        secondary: 'glass text-gray-800 border border-white/30 hover:border-white/50 shadow-glass hover:shadow-modern',
        accent: 'bg-purple-600 text-white hover:bg-purple-700 shadow-modern',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-modern',
        success: 'bg-green-600 text-white hover:bg-green-700 shadow-modern',
        warning: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-modern'
      }
    }
  }
}
</script>

<style scoped>
</style>
