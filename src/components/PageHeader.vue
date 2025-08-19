<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-0 flex items-center" :class="tall ? 'min-h-[96px]' : 'min-h-[72px]'">
      <div class="flex items-center justify-between gap-3 w-full">
        <div class="flex items-center gap-3 min-w-0">
          <slot name="lead">
            <template v-if="backTo">
              <div class="flex items-center gap-2 min-w-0">
                <router-link :to="backTo" class="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
                  <ArrowLeft class="w-4 h-4 mr-1" />
                  {{ backLabel }}
                </router-link>
                <span class="text-gray-300 select-none" aria-hidden="true">/</span>
                <span class="text-xl md:text-2xl font-bold text-gray-800 leading-tight truncate">{{ title }}</span>
              </div>
            </template>
            <template v-else>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 leading-tight truncate">{{ title }}</h1>
            </template>
          </slot>
        </div>
        <div class="shrink-0">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    backTo: { type: String, default: null },
    backLabel: { type: String, default: 'Terug' },
    tall: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
</style>
