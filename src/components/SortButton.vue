<template>
  <div class="relative" ref="containerRef">
    <button
      class="inline-flex items-center gap-2 px-3 h-10 text-sm rounded-md border border-gray-300 bg-white dark:bg-gray-700  border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-50 hover:bg-gray-50 hover:dark:bg-gray-600"
      @click="toggle"
    >
      <ArrowUpDown class="w-4 h-4" />
      <span>Sorteren</span>
    </button>

    <div
      v-if="open"
      ref="menuRef"
      :class="['absolute overflow-hidden top-full mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-[3000]', alignRight ? 'right-0' : 'left-0']"
      @click.stop
    >
      <div>
        <button
          class="w-full text-left px-4 h-10 text-sm"
          :class="isActive('dateCreated','desc') ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'"
          :aria-selected="isActive('dateCreated','desc') ? 'true' : 'false'"
          @click="setSort('dateCreated','desc')"
        >
          Nieuwste eerst
        </button>
        <button
          class="w-full text-left px-4 h-10 text-sm"
          :class="isActive('dateCreated','asc') ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'"
          :aria-selected="isActive('dateCreated','asc') ? 'true' : 'false'"
          @click="setSort('dateCreated','asc')"
        >
          Oudste eerst
        </button>
        <button
          class="w-full text-left px-4 h-10 text-sm"
          :class="isActive('name','asc') ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'"
          :aria-selected="isActive('name','asc') ? 'true' : 'false'"
          @click="setSort('name','asc')"
        >
          A tot Z
        </button>
        <button
          class="w-full text-left px-4 h-10 text-sm"
          :class="isActive('name','desc') ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'"
          :aria-selected="isActive('name','desc') ? 'true' : 'false'"
          @click="setSort('name','desc')"
        >
          Z tot A
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

export default {
  name: 'SortButton',
  props: {
    sortBy: { type: String, default: 'dateCreated' }, // 'dateCreated' | 'name'
    sortDir: { type: String, default: 'desc' } // 'asc' | 'desc'
  },
  emits: ['update:sortBy', 'update:sortDir'],
  setup(props, { emit }) {
    const open = ref(false)
    const menuRef = ref(null)
    const containerRef = ref(null)
    const alignRight = ref(false)

    function computeAlignment() {
      try {
        const btn = containerRef.value
        if (!btn) { alignRight.value = false; return }
        const rect = btn.getBoundingClientRect()
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth
        const measuredMenuWidth = menuRef.value?.offsetWidth || 256 // fallback to w-64
        const spaceRight = viewportWidth - rect.right
        const spaceLeft = rect.left
        // Default is left-0; flip to right if not enough space on the right and there is room on the left
        if (spaceRight < measuredMenuWidth && spaceLeft > measuredMenuWidth / 2) {
          alignRight.value = true
        } else {
          alignRight.value = false
        }
      } catch (e) {
        alignRight.value = false
      }
    }

    function toggle() {
      const willOpen = !open.value
      open.value = willOpen
      if (willOpen) nextTick(() => computeAlignment())
    }
    function setSort(by, dir) {
      emit('update:sortBy', by)
      emit('update:sortDir', dir)
      open.value = false
    }

    function isActive(by, dir) {
      return props.sortBy === by && props.sortDir === dir
    }

    function handleOutside(e) {
      const c = containerRef.value
      const m = menuRef.value
      if ((c && c.contains(e.target)) || (m && m.contains(e.target))) return
      open.value = false
    }

    function handleResizeOrScroll() {
      if (open.value) computeAlignment()
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleOutside)
      window.addEventListener('resize', handleResizeOrScroll)
      window.addEventListener('scroll', handleResizeOrScroll, true)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('resize', handleResizeOrScroll)
      window.removeEventListener('scroll', handleResizeOrScroll, true)
    })

    return { open, menuRef, containerRef, toggle, setSort, isActive, alignRight }
  }
}
</script>

<style scoped>
</style>
