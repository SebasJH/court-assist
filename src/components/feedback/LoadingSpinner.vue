<template>
  <div :class="['flex items-center justify-center', sizeClasses[size], customClass]">
    <div class="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" :class="spinnerSizeClasses[size]"></div>
    <span v-if="text" class="ml-2 text-gray-600">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    text: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    sizeClasses() {
      return {
        sm: 'py-2',
        md: 'py-4',
        lg: 'py-8',
        xl: 'py-12'
      }
    },
    spinnerSizeClasses() {
      return {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
      }
    }
  }
}
</script>
