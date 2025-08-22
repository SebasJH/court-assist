<template>
  <div class="relative" :class="wrapperClass">
    <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      :type="type"
      class="form-input !pl-9 pr-3"
      :class="inputClass"
      :value="modelValue ?? ''"
      @input="$emit('update:modelValue', $event.target && $event.target.value)"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  inheritAttrs: true,
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    inputClass: { type: [String, Array, Object], default: 'w-64 md:w-72' },
    wrapperClass: { type: [String, Array, Object], default: '' },
    type: { type: String, default: 'search' }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
</style>
