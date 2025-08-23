<template>
  <header class="sticky top-0 z-20 glass-container border-b border-white/20">
    <div class="container mx-auto px-4 py-0 flex items-center min-h-[72px]">
      <div class="flex items-center justify-between gap-4 w-full">
        <!-- Lead content with mobile hamburger before the title -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <button
            v-if="!(hideHamburgerWhenBack && mobileBack)"
            type="button"
            class="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Menu"
            @click="openMobileSidebar"
          >
            <Menu class="w-5 h-5" />
          </button>
          <button
            v-if="mobileBack"
            type="button"
            class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Terug"
            title="Terug"
            @click="onMobileBack"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="min-w-0 flex-1">
            <slot name="lead">
              <h1 class="text-3xl font-bold text-gray-800 leading-tight">{{ title }}</h1>
            </slot>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 flex-shrink-0">
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
    mobileBackEmitOnly: { type: Boolean, default: false },
    hideHamburgerWhenBack: { type: Boolean, default: false }
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
