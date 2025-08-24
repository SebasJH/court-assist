<template>
  <teleport to="body">
    <div
      v-if="open && anchorEl"
      ref="wrapRef"
      class="pointer-events-none fixed z-[4000]"
      :style="wrapperStyle"
    >
      <div ref="boxRef" class="relative drop-shadow-xl">
        <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 break-words">
          <div class="text-sm font-semibold text-gray-800 dark:text-blue-400">{{ title }}</div>
          <div v-if="body" class="mt-1 text-xs text-gray-600 dark:text-gray-50">{{ body }}</div>
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

// Tooltip rendered to document.body via Teleport so it escapes card stacking contexts.
// Props: title (string), body (string), open (boolean), anchor (HTMLElement or ref-unwrapped element)
const props = defineProps({
  title: { type: String, required: true },
  body: { type: String, default: '' },
  open: { type: Boolean, default: false },
  anchor: { type: Object, default: null }
})

const wrapRef = ref(null)
const boxRef = ref(null)

const anchorEl = computed(() => {
  const a = props.anchor
  if (!a) return null
  // Support passing a Vue ref or a raw element
  if (typeof a === 'object' && a !== null && 'value' in a) return a.value
  return a
})

const baseWidthPx = 256 // desired tooltip width (~16rem)
const widthPx = ref(baseWidthPx)

const leftPx = ref(0)
const topPx = ref(0)
const placeBelow = ref(false)

function clamp(val, min, max) { return Math.min(Math.max(val, min), max) }

function measureAndPosition() {
  try {
    const box = boxRef.value
    const anchor = anchorEl.value
    if (!box || !anchor) return

    const viewportW = window.innerWidth || document.documentElement.clientWidth
    const viewportH = window.innerHeight || document.documentElement.clientHeight

    const margin = 8   // margin to viewport edges
    const gap = 8      // space between anchor and tooltip

    // Clamp width to viewport (keep preferred baseWidthPx unless it doesn't fit)
    const allowed = Math.max(120, viewportW - margin * 2)
    widthPx.value = clamp(baseWidthPx, 120, allowed)

    const rect = anchor.getBoundingClientRect()

    // Use preferred width for horizontal positioning
    const boxW = widthPx.value

    // Temporarily ensure content renders to measure height
    const boxH = box.offsetHeight || 0

    // Horizontal: center on anchor, clamp to viewport
    const centeredLeft = rect.left + rect.width / 2 - boxW / 2
    leftPx.value = clamp(centeredLeft, margin, viewportW - margin - boxW)

    // Vertical placement: prefer above, flip to bottom if insufficient space
    const spaceAbove = rect.top
    const spaceBelow = viewportH - rect.bottom
    placeBelow.value = boxH + gap > spaceAbove && spaceBelow >= spaceAbove

    topPx.value = placeBelow.value
      ? (rect.bottom + gap)
      : Math.max(margin, rect.top - gap - boxH)
  } catch (_) {
    // noop
  }
}

const wrapperStyle = computed(() => ({
  left: leftPx.value + 'px',
  top: topPx.value + 'px',
  width: widthPx.value + 'px'
}))

function onResizeOrScroll() {
  if (props.open) measureAndPosition()
}

onMounted(() => {
  if (props.open) nextTick(() => measureAndPosition())
  window.addEventListener('resize', onResizeOrScroll)
  window.addEventListener('scroll', onResizeOrScroll, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResizeOrScroll)
  window.removeEventListener('scroll', onResizeOrScroll, true)
})

watch(() => [props.title, props.body], () => props.open && nextTick(() => measureAndPosition()))
watch(() => props.open, (v) => { if (v) nextTick(() => measureAndPosition()) })
watch(() => props.anchor, () => props.open && nextTick(() => measureAndPosition()))
</script>

<style scoped>
</style>
