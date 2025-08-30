<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed h-10',
      sizeClasses[size],
      (outline ? outlineColorClasses[color] : colorClasses[color]),
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
      validator: (value) => ['primary', 'secondary', 'accent', 'danger', 'success', 'warning', 'cancel'].includes(value)
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
    },
    outline: {
      type: Boolean,
      default: false
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
        accent: 'bg-yellow-500 text-white hover:bg-yellow-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        warning: 'bg-yellow-500 text-gray-900 hover:bg-yellow-600',
        cancel: 'border border-gray-900 text-gray-900 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600'
      }
    },
    outlineColorClasses() {
      return {
        primary: 'border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-500/10',
        secondary: 'border border-green-500 text-green-500 bg-transparent hover:bg-green-50 dark:border-green-500 dark:text-green-300 dark:hover:bg-green-500/10',
        accent: 'border border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-50 dark:border-yellow-500 dark:text-yellow-300 dark:hover:bg-yellow-500/10',
        danger: 'border border-red-500 text-red-500 bg-transparent hover:bg-red-50 dark:border-red-500 dark:text-red-300 dark:hover:bg-red-500/10',
        success: 'border border-green-500 text-green-500 bg-transparent hover:bg-green-50 dark:border-green-500 dark:text-green-300 dark:hover:bg-green-500/10',
        warning: 'border border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-50 dark:border-yellow-500 dark:text-yellow-300 dark:hover:bg-yellow-500/10',
        cancel: 'border border-gray-900 text-gray-500 bg-transparent hover:bg-gray-100 dark:border-neutral-600 dark:text-gray-100 dark:hover:bg-neutral-800'
      }
    }
  }
}
</script>

<style scoped>
</style>
