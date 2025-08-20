<template>
  <div class="flex items-center justify-center gap-2 select-none">
    <button
      class="px-3 h-9 rounded-md border border-gray-300 bg-white text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      :disabled="page <= 1"
      @click="goPrev"
      aria-label="Vorige pagina"
    >
      Vorige
    </button>

    <div class="flex items-center gap-1">
      <button
        v-for="p in pageCount"
        :key="p"
        class="px-3 h-9 rounded-md border text-sm"
        :class="p === page ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50'"
        @click="setPage(p)"
        :aria-current="p === page ? 'page' : 'false'"
      >
        {{ p }}
      </button>
    </div>

    <button
      class="px-3 h-9 rounded-md border border-gray-300 bg-white text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
