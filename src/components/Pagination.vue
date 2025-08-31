<template>
  <div class="flex items-center justify-center gap-2 select-none">
    <button
      class="px-3 h-9 rounded-md border bg-white hover:bg-gray-50 border-gray-300 text-gray-800  dark:bg-gray-700 hover:dark:bg-gray-600  dark:border-gray-700 dark:text-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="page <= 1"
      @click="goPrev"
      aria-label="Vorige pagina"
    >
      Vorige
    </button>

    <!-- Mobile: compact indicator -->
    <div class="md:hidden text-sm text-gray-600 dark:text-gray-50 px-2">
      Pagina {{ page }} / {{ pageCount }}
    </div>

    <!-- Desktop (md+): numeric buttons -->
    <div class="hidden md:flex items-center gap-1">
      <button
        v-for="p in pageCount"
        :key="p"
        class="px-3 h-9 rounded-md border text-sm"
        :class="p === page ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800  dark:bg-gray-700 hover:dark:bg-gray-600  dark:border-gray-700 dark:text-gray-50'"
        @click="setPage(p)"
        :aria-current="p === page ? 'page' : 'false'"
      >
        {{ p }}
      </button>
    </div>

    <button
      class="px-3 h-9 rounded-md border bg-white hover:bg-gray-50 border-gray-300 text-gray-800  dark:bg-gray-700 hover:dark:bg-gray-600  dark:border-gray-700 dark:text-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="page >= pageCount"
      @click="goNext"
      aria-label="Volgende pagina"
    >
      Volgende
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    page: { type: Number, required: true },
    pageCount: { type: Number, required: true }
  },
  emits: ['update:page'],
  setup(props, { emit }) {
    function setPage(p) {
      const pc = Math.max(1, Number(props.pageCount) || 1)
      const np = Math.max(1, Math.min(pc, Number(p) || 1))
      if (np !== props.page) emit('update:page', np)
    }
    function goPrev() { setPage(props.page - 1) }
    function goNext() { setPage(props.page + 1) }

    return { setPage, goPrev, goNext }
  }
}
</script>

<style scoped>
</style>
