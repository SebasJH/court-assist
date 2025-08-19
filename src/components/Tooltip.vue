<template>
  <!-- Tooltip wrapper: visibility controlled by parent .group hover -->
  <div
    ref="wrapRef"
    class="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity z-[9999]"
    :style="wrapperStyle"
  >
    <div ref="boxRef" class="relative drop-shadow-xl">
      <div class="bg-white border border-gray-200 rounded-lg p-3 break-words">
        <div class="text-sm font-semibold text-gray-800">{{ title }}</div>
        <div v-if="body" class="mt-1 text-xs text-gray-600">{{ body }}</div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

// Simple, reusable tooltip used on hover of a parent with class `group`.
// Now includes smart positioning that ensures the tooltip never leaves the viewport.
// Props: title (string), body (optional string). You can also pass extra content via default slot.
const props = defineProps({
  title: { type: String, required: true },
  body: { type: String, default: '' }
})

const wrapRef = ref(null)   // absolute wrapper (positioned relative to parent container)
const boxRef = ref(null)    // the visible tooltip box

const shiftX = ref(0)
const placeBelow = ref(false)
const baseWidthPx = 256 // desired tooltip width (~16rem)
const widthPx = ref(baseWidthPx)

function clamp(val, min, max) { return Math.min(Math.max(val, min), max) }

function measureAndPosition() {
  try {
    const wrap = wrapRef.value
    const box = boxRef.value
    if (!wrap || !box) return

    const viewportW = window.innerWidth || document.documentElement.clientWidth
    const viewportH = window.innerHeight || document.documentElement.clientHeight

    const margin = 8   // margin to viewport edges
    const gap = 8      // space between parent and tooltip

    // Clamp width to viewport (keep preferred baseWidthPx unless it doesn't fit)
    const allowed = Math.max(120, viewportW - margin * 2)
    widthPx.value = clamp(baseWidthPx, 120, allowed)

    // Parent area (the positioned ancestor, i.e., the badge container)
    const parentEl = wrap.offsetParent || wrap.parentElement || document.body
    const parentRect = parentEl.getBoundingClientRect()

    // Use preferred width for computations
    const boxW = widthPx.value
    const boxH = box.offsetHeight || 0

    // Horizontal: center on parent, then shift to keep in viewport
    const centerX = parentRect.left + parentRect.width / 2
    const leftIfCentered = centerX - boxW / 2
    const rightIfCentered = centerX + boxW / 2

    let dx = 0
    if (leftIfCentered < margin) dx = margin - leftIfCentered
    else if (rightIfCentered > viewportW - margin) dx = (viewportW - margin) - rightIfCentered
    shiftX.value = dx

    // Vertical placement: prefer above; flip to bottom if not enough space
    const spaceAbove = parentRect.top
    const spaceBelow = viewportH - parentRect.bottom
    placeBelow.value = boxH + gap > spaceAbove && spaceBelow >= spaceAbove
  } catch (_) {
    // best-effort: fall back to defaults
    shiftX.value = 0
    placeBelow.value = false
  }
}

const wrapperStyle = computed(() => {
  const gap = 8
  // Base: anchor horizontally at 50% of parent; vertical is dynamic (top 0 for above, top 100% for below)
  const base = {
    left: '50%',
    width: widthPx.value + 'px'
  }
  if (placeBelow.value) {
    return {
      ...base,
      top: '100%',
      transform: `translateX(calc(-50% + ${shiftX.value}px)) translateY(${gap}px)`
    }
  }
  return {
    ...base,
    top: '0px',
    transform: `translateX(calc(-50% + ${shiftX.value}px)) translateY(calc(-100% - ${gap}px))`
  }
})

function onResizeOrScroll() {
  measureAndPosition()
}

onMounted(() => {
  nextTick(() => measureAndPosition())
  window.addEventListener('resize', onResizeOrScroll)
  window.addEventListener('scroll', onResizeOrScroll, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResizeOrScroll)
  window.removeEventListener('scroll', onResizeOrScroll, true)
})

watch(() => [props.title, props.body], () => nextTick(() => measureAndPosition()))
</script>

<style scoped>
</style>
