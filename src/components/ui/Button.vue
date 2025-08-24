<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-modern focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed h-10',
      sizeClasses[size],
      colorClasses[color],
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <component v-if="icon" :is="icon" :class="computedIconClass" />
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
    iconClass: {
      type: String,
      default: ''
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
    computedIconClass() {
      return this.iconClass && this.iconClass.length ? this.iconClass : this.iconSizeClasses[this.size]
    },
    colorClasses() {
      return {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-green-500 text-white hover:bg-green-600',
        accent: 'bg-purple-500 text-white hover:bg-purple-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        warning: 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
      }
    }
  }
}
</script>

<style scoped>
</style>
