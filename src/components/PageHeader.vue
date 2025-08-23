<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-[4000]">
    <div class="container mx-auto px-4 py-0 flex items-center" :class="tall ? 'min-h-[96px]' : 'min-h-[72px]'">
      <div class="flex items-center justify-between gap-3 w-full">
        <div class="flex items-center gap-3 min-w-0">
          <button
            v-if="mobileBack"
            type="button"
            class="xl:hidden inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Terug"
            @click="onMobileBack"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <button
            v-else
            type="button"
            class="xl:hidden inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Menu"
            @click="openMobileSidebar"
          >
            <Menu class="w-5 h-5" />
          </button>
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
  emits: ['mobile-back'],
  props: {
    title: { type: String, required: true },
    backTo: { type: String, default: null },
    backLabel: { type: String, default: 'Terug' },
    tall: { type: Boolean, default: false },
    mobileBack: { type: Boolean, default: false },
    mobileBackEmitOnly: { type: Boolean, default: false }
  },
  methods: {
    openMobileSidebar() {
      // Dispatch a global event to let App.vue open the mobile sidebar drawer
      window.dispatchEvent(new CustomEvent('open-mobile-sidebar'))
    },
    onMobileBack() {
      // Allow parent to handle back action (e.g., close search) when desired
      this.$emit('mobile-back')
      if (this.mobileBackEmitOnly) return
      if (this.$router && this.$router.back) {
        this.$router.back()
      } else {
        window.history.back()
      }
    }
  }
}
</script>

<style scoped>
</style>
