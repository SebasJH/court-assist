<template>
  <div class="flex items-center">
    <div class="inline-flex rounded-md overflow-hidden border border-gray-300 h-[42px]">
      <button
        type="button"
        class="px-3 h-[42px] text-sm font-medium focus:outline-none"
        :class="value === 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
        @click="set(1)"
        :aria-pressed="value === 1 ? 'true' : 'false'"
      >1</button>
      <button
        type="button"
        class="px-3 h-[42px] text-sm font-medium border-l border-gray-300 focus:outline-none"
        :class="value === 2 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
        @click="set(2)"
        :aria-pressed="value === 2 ? 'true' : 'false'"
      >2</button>
      <button
        type="button"
        class="px-3 h-[42px] text-sm font-medium border-l border-gray-300 focus:outline-none"
        :class="value === 3 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
        @click="set(3)"
        :aria-pressed="value === 3 ? 'true' : 'false'"
      >3</button>
      <button
        type="button"
        class="px-3 h-[42px] text-sm font-medium border-l border-gray-300 focus:outline-none"
        :class="value === 4 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
        @click="set(4)"
        :aria-pressed="value === 4 ? 'true' : 'false'"
      >4</button>
      <button
        type="button"
        class="px-3 h-[42px] text-sm font-medium border-l border-gray-300 focus:outline-none"
        :class="value === 5 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-50 text-gray-800'"
        @click="set(5)"
        :aria-pressed="value === 5 ? 'true' : 'false'"
      >5</button>
    </div>
    <button
      v-if="typeof value === 'number'"
      type="button"
      class="ml-3 text-sm text-gray-600 hover:text-gray-800 underline"
      @click="clear"
    >Wissen</button>
  </div>
</template>

<script>
export default {
  name: 'IntensitySelector',
  props: { modelValue: { type: [Number, null], default: null } },
  emits: ['update:modelValue'],
  computed: {
    value(){ return typeof this.modelValue === 'number' ? this.modelValue : null }
  },
  methods: {
    set(n){
      const v = Number(n)
      if (!Number.isFinite(v)) return
      this.$emit('update:modelValue', this.value === v ? null : v)
    },
    clear(){ this.$emit('update:modelValue', null) }
  }
}
</script>

<style scoped>
</style>
