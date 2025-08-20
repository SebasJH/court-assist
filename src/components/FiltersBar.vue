<template>
  <div class="bg-white rounded-xl shadow-md border border-[#E2E8F0] p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Category select -->
      <select :value="category" @change="$emit('update:category', $event.target.value)" class="form-input">
        <option value="">Alle categorieën</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>

      <!-- Players slider -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600">Aantal spelers</label>
        <Slider
          :modelValue="players"
          @update:modelValue="$emit('update:players', $event)"
          :min="1"
          :max="20"
          :step="1"
          :lazy="true"
          :merge="false"
        />
        <div class="text-sm text-gray-800">van {{ players[0] }} tot {{ players[1] }}</div>
      </div>

      <!-- Intensity slider -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-600">Intensiteit</label>
        <Slider
          :modelValue="intensity"
          @update:modelValue="$emit('update:intensity', $event)"
          :min="1"
          :max="5"
          :step="1"
          :lazy="true"
          :merge="false"
        />
        <div class="text-sm text-gray-800">van {{ intensity[0] }} tot {{ intensity[1] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FiltersBar',
  props: {
    categories: { type: Array, default: () => [] },
    category: { type: String, default: '' },
    players: { type: Array, default: () => [1, 20] },
    intensity: { type: Array, default: () => [1, 5] }
  },
  emits: [
    'update:category',
    'update:players',
    'update:intensity'
  ]
}
</script>

<style scoped>
</style>
