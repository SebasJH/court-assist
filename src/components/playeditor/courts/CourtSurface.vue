<template>
  <div class="relative" :style="{ width: width + 'px', height: height + 'px' }">
    <div ref="container" class="block w-full h-full"></div>
    <slot />
  </div>
</template>

<script>
import { ref, watch, onMounted, defineComponent } from 'vue'

export default defineComponent({
  name: 'CourtSurface',
  props: {
    html: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  setup(props, { expose }){
    const container = ref(null)

    function inject(){
      try {
        const el = container.value
        if (!el) return
        if (el.__html !== props.html) {
          el.innerHTML = props.html || ''
          el.__html = props.html || ''
        }
        const svg = el.querySelector && el.querySelector('svg')
        if (svg) {
          svg.setAttribute('width', String(props.width || 0))
          svg.setAttribute('height', String(props.height || 0))
          svg.style.width = (props.width || 0) + 'px'
          svg.style.height = (props.height || 0) + 'px'
          svg.style.display = 'block'
        }
      } catch (_) {}
    }

    watch(() => [props.html, props.width, props.height], inject, { immediate: true })
    onMounted(inject)

    function getSvgEl(){
      try {
        const el = container.value
        return el ? el.querySelector('svg') : null
      } catch (_) { return null }
    }

    expose({ getSvgEl })

    return { container }
  }
})
</script>
