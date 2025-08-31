<template>
  <div class="flex h-full flex-col">
    <!-- Controls -->
    <div class="px-5 sm:px-10 pt-4 pb-3 flex items-center gap-3 border-b dark:border-gray-600">
      <div class="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 h-10">
        <button type="button" class="px-3 h-10 text-sm font-medium focus:outline-none"
                :class="court==='half' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'"
                @click="setCourt('half')">Half court</button>
        <button type="button" class="px-3 h-10 text-sm font-medium border-l border-gray-300 dark:border-gray-600 focus:outline-none"
                :class="court==='full' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'"
                @click="setCourt('full')">Full court</button>
      </div>
      <div class="flex items-center gap-2">
        <UiButton color="secondary" class="!py-1 !px-2" @click="addPlayer">+ Speler</UiButton>
        <UiButton color="secondary" class="!py-1 !px-2" :disabled="players.length===0" @click="removePlayer">- Speler</UiButton>
        <button type="button" class="text-sm text-gray-600 dark:text-gray-300 hover:underline" @click="resetPositions">Reset posities</button>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <UiButton color="cancel" @click="$emit('cancel')">Annuleren</UiButton>
        <UiButton color="primary" @click="saveAsImage">Opslaan als afbeelding</UiButton>
      </div>
    </div>

    <!-- Editor area -->
    <div class="flex-1 overflow-auto px-5 sm:px-10 py-5">
      <div class="mx-auto" :style="{maxWidth: canvasWidth + 'px'}">
        <div class="relative border rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" class="block w-full h-auto"></canvas>
          <!-- Overlay for dragging display (optional outlines) -->
          <div class="absolute inset-0" @mousedown="onPointerDown" @mousemove="onPointerMove" @mouseup="onPointerUp" @mouseleave="onPointerUp"
               @touchstart.prevent="onTouchStart" @touchmove.prevent="onTouchMove" @touchend.prevent="onTouchEnd"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import UiButton from '../ui/Button.vue'

export default {
  name: 'PlayEditor',
  components: { UiButton },
  props: {
    // Optional initial state to resume editing later
    initial: { type: Object, default: null },
    // Suggest a court from parent (e.g., from exercise.court)
    suggestedCourt: { type: String, default: '' }
  },
  emits: ['save','cancel'],
  setup(props, { emit }) {
    const canvasRef = ref(null)
    const ctx = ref(null)

    const court = ref('half') // 'half' | 'full'
    function normalizeSuggestedCourt(v){
      const s = String(v||'').toLowerCase().replace(/\s+/g,'')
      if (s === 'full' || s === 'fullcourt') return 'full'
      if (s === 'half' || s === 'halfcourt') return 'half'
      return 'half'
    }

    const players = reactive([]) // [{id, x, y, number, color}]; x,y in [0..1] normalized
    let nextId = 1

    const HALF_RATIO = 800/450 // width/height for half court suggested canvas size
    const FULL_RATIO = 800/900

    const canvasWidth = computed(() => 900) // fixed width for crisp export
    const canvasHeight = computed(() => court.value === 'half' ? Math.round(canvasWidth.value / (HALF_RATIO)) : Math.round(canvasWidth.value / (FULL_RATIO)))

    function setCourt(kind){ court.value = (kind === 'full') ? 'full' : 'half'; redraw() }

    function addPlayer() {
      const id = nextId++
      const number = players.length + 1
      players.push({ id, x: 0.5, y: 0.5, number, color: '#2563eb' }) // blue-600
      redraw()
    }
    function removePlayer(){ if (players.length>0) { players.pop(); redraw() } }
    function resetPositions(){ players.forEach(p => { p.x = 0.5; p.y = 0.5 }) ; redraw() }

    // Dragging state
    const draggingId = ref(null)
    const dragOffset = ref({ dx: 0, dy: 0 })

    function getCanvasPoint(evt) {
      const canvas = canvasRef.value
      const rect = canvas.getBoundingClientRect()
      const clientX = evt.clientX
      const clientY = evt.clientY
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height
      return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
    }

    function pickPlayerAt(normX, normY) {
      // hit-test normalized, consider radius in normalized units
      const rPx = 18 // visual radius in px
      const rx = rPx / canvasRef.value.width
      const ry = rPx / canvasRef.value.height
      // find topmost (last) player containing point
      for (let i = players.length - 1; i >= 0; i--) {
        const p = players[i]
        const dx = (normX - p.x)
        const dy = (normY - p.y)
        if ((dx*dx) / (rx*rx) + (dy*dy) / (ry*ry) <= 1) return p
      }
      return null
    }

    function onPointerDown(e){
      const { x, y } = getCanvasPoint(e)
      const p = pickPlayerAt(x, y)
      if (p) {
        draggingId.value = p.id
        dragOffset.value = { dx: x - p.x, dy: y - p.y }
      }
    }
    function onPointerMove(e){
      if (!draggingId.value) return
      const { x, y } = getCanvasPoint(e)
      const p = players.find(pp => pp.id === draggingId.value)
      if (!p) return
      p.x = Math.max(0, Math.min(1, x - dragOffset.value.dx))
      p.y = Math.max(0, Math.min(1, y - dragOffset.value.dy))
      redraw()
    }
    function onPointerUp(){ draggingId.value = null }

    // Touch helpers
    function firstTouch(ev){ return (ev.touches && ev.touches[0]) ? ev.touches[0] : (ev.changedTouches && ev.changedTouches[0]) }
    function onTouchStart(ev){ const t = firstTouch(ev); if (!t) return; onPointerDown(t) }
    function onTouchMove(ev){ const t = firstTouch(ev); if (!t) return; onPointerMove(t) }
    function onTouchEnd(){ onPointerUp() }

    function drawCourtHalf(c) {
      const w = c.canvas.width, h = c.canvas.height
      c.clearRect(0,0,w,h)
      // background
      c.fillStyle = '#f8fafc' // slate-50
      c.fillRect(0,0,w,h)
      // outer lines
      c.strokeStyle = '#111827' // gray-900
      c.lineWidth = 3
      c.strokeRect(8, 8, w-16, h-16)
      // hoop (right side)
      const rimX = w - 60, rimY = h/2
      c.beginPath(); c.arc(rimX, rimY, 9, 0, Math.PI*2); c.stroke()
      // paint area (key)
      c.strokeRect(w-160, h/2 - 80, 152, 160)
      // free-throw circle
      c.beginPath(); c.arc(w-160, h/2, 60, Math.PI*1.5, Math.PI*0.5, true); c.stroke()
      // three-point arc (rough)
      c.beginPath(); c.moveTo(w-30, 40); c.lineTo(w-30, h-40); c.stroke()
    }

    function drawCourtFull(c){
      const w = c.canvas.width, h = c.canvas.height
      c.clearRect(0,0,w,h)
      c.fillStyle = '#f8fafc'
      c.fillRect(0,0,w,h)
      c.strokeStyle = '#111827'
      c.lineWidth = 3
      c.strokeRect(8, 8, w-16, h-16)
      // center line
      c.beginPath(); c.moveTo(w/2, 8); c.lineTo(w/2, h-8); c.stroke()
      // center circle
      c.beginPath(); c.arc(w/2, h/2, 50, 0, Math.PI*2); c.stroke()
      // hoops
      const leftRimX = 60, rightRimX = w - 60, rimY = h/2
      c.beginPath(); c.arc(leftRimX, rimY, 9, 0, Math.PI*2); c.stroke()
      c.beginPath(); c.arc(rightRimX, rimY, 9, 0, Math.PI*2); c.stroke()
      // keys
      c.strokeRect(8, h/2 - 80, 152, 160)
      c.strokeRect(w-160, h/2 - 80, 152, 160)
    }

    function drawPlayers(c){
      const w = c.canvas.width, h = c.canvas.height
      players.forEach(p => {
        const x = p.x * w
        const y = p.y * h
        // shadow
        c.beginPath(); c.fillStyle = 'rgba(0,0,0,0.08)'; c.arc(x+1.5, y+1.5, 18, 0, Math.PI*2); c.fill()
        // circle
        c.beginPath(); c.fillStyle = p.color || '#2563eb'; c.arc(x, y, 18, 0, Math.PI*2); c.fill()
        // number
        c.fillStyle = '#ffffff'; c.font = 'bold 14px ui-sans-serif, system-ui, -apple-system'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(String(p.number || '?'), x, y)
      })
    }

    function redraw(){
      if (!ctx.value) return
      if (court.value === 'half') {
        drawCourtHalf(ctx.value)
      } else {
        drawCourtFull(ctx.value)
      }
      drawPlayers(ctx.value)
    }

    function saveAsImage(){
      try {
        const url = canvasRef.value.toDataURL('image/png')
        emit('save', { dataUrl: url, state: serializeState() })
      } catch (e) {
        // noop
      }
    }

    function serializeState(){
      return { court: court.value, players: players.map(p => ({ id: p.id, x: p.x, y: p.y, number: p.number, color: p.color })) }
    }
    function loadState(obj){
      try {
        players.splice(0, players.length)
        nextId = 1
        if (obj && Array.isArray(obj.players)) {
          obj.players.forEach((p, idx) => {
            const id = p.id || (nextId++)
            players.push({ id, x: Number(p.x)||0.5, y: Number(p.y)||0.5, number: p.number || (idx+1), color: p.color || '#2563eb' })
          })
          nextId = Math.max(nextId, players.length + 1)
        }
        if (obj && (obj.court === 'half' || obj.court === 'full')) court.value = obj.court
      } catch (_) {}
      redraw()
    }

    onMounted(() => {
      try {
        const c = canvasRef.value
        ctx.value = c.getContext('2d')
        setCourt(normalizeSuggestedCourt(props.suggestedCourt || (props.initial && props.initial.court)))
        if (props.initial) loadState(props.initial)
        else { players.splice(0, players.length); for (let i=0;i<5;i++) players.push({ id: nextId++, x: 0.3 + i*0.08, y: 0.6, number: i+1, color: '#2563eb' }) }
        redraw()
      } catch (_) {}
      window.addEventListener('resize', redraw)
    })
    onBeforeUnmount(() => { window.removeEventListener('resize', redraw) })

    watch(() => court.value, () => redraw())

    return {
      canvasRef,
      court,
      players,
      canvasWidth,
      canvasHeight,
      setCourt,
      addPlayer,
      removePlayer,
      resetPositions,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      saveAsImage
    }
  }
}
</script>

<style scoped>
</style>
