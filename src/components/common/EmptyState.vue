<template>
  <div class="text-center py-12">
    <div class="mx-auto w-24 h-24 text-gray-300 mb-4">
      <component :is="icon" class="w-full h-full" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-6">{{ description }}</p>
    <slot name="action">
      <UiButton v-if="actionText" :color="actionColor" @click="$emit('action')">
        {{ actionText }}
      </UiButton>
    </slot>
  </div>
</template>

<script>
import UiButton from '../ui/Button.vue'

export default {
  name: 'EmptyState',
  components: { UiButton },
  props: {
    icon: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      default: ''
    },
    actionColor: {
      type: String,
      default: 'primary'
    }
  },
  emits: ['action']
}
</script>
