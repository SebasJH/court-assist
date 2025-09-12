<template>
  <div class="flex h-full flex-col">
    <!-- Editor area -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden px-0 sm:px-0 py-0">
      <div class="w-full h-full">
        <div class="relative flex h-full min-w-0">
          <div class="relative flex-1 min-w-0 flex items-center justify-center h-full" ref="leftPane">
            <div class="relative overflow-hidden max-w-full" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
              <!-- Court HTML injected -->
              <div ref="courtContainer" class="block w-full h-full z-0"></div>
              <!-- SVG overlay for objects (actions & players) -->
              <svg ref="svgRef" class="absolute inset-0 block z-[100] w-full h-full" :viewBox="'0 0 ' + canvasWidth + ' ' + canvasHeight" width="100%" height="100%"
                   @mousedown="onPointerDown" @mousemove="onPointerMove" @mouseup="onPointerUp" @mouseleave="onPointerUp"
                   @touchstart.prevent="onTouchStart" @touchmove.prevent="onTouchMove" @touchend.prevent="onTouchEnd"
                   @dragover.prevent @drop.prevent="onCanvasDrop">
                <defs>
                <!-- Arrow marker (triangle) -->
                <marker id="arrow_marker" markerWidth="7" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon fill="#333" points="0 0, 7 4, 0 8 0.5 4" />
                </marker>
                <!-- Screen marker (thin rectangle) -->
                <marker id="screen_marker" markerWidth="2" markerHeight="13" refX="1" refY="6.5" orient="auto" markerUnits="userSpaceOnUse">
                  <polygon fill="#333" points="0 0, 1 0, 1 13, 0 13" />
                </marker>
                <!-- Shot marker (circle + crosshair) -->
                <marker id="shot_marker" markerWidth="13" markerHeight="39" refX="6.5" refY="6.5" orient="auto" markerUnits="userSpaceOnUse">
                  <g stroke="#333" stroke-width="1" fill="none">
                    <circle r="4.55" cx="6.5" cy="6.5" />
                    <path d="M 13 6.5 L 8.45 6.5" />
                    <path d="M 0 6.5 L 4.55 6.5" />
                    <path d="M 6.5 0 L 6.5 4.55" />
                    <path d="M 6.5 13 L 6.5 8.45" />
                  </g>
                </marker>
              </defs>

              <!-- Actions as SVG paths -->
              <g>
                <path v-for="(l, idx) in lines" :key="'ln'+idx"
                      :d="pathD(l)"
                      :stroke="'#333'"
                      fill="none"
                      :stroke-width="3"
                      stroke-linecap="round"
                      :stroke-dasharray="dashFor(l)"
                      :marker-end="markerEndFor(l)" />

                <!-- Selection handles for selected line -->
                <template v-if="selectedLineIndex>=0 && lines[selectedLineIndex]">
                  <circle v-if="handlePos('start')" :cx="handlePos('start').x" :cy="handlePos('start').y" r="6" fill="#0a84ff" stroke="white" stroke-width="2" />
                  <circle v-if="handlePos('mid')" :cx="handlePos('mid').x" :cy="handlePos('mid').y" r="6" fill="#0a84ff" stroke="white" stroke-width="2" />
                  <circle v-if="handlePos('end')" :cx="handlePos('end').x" :cy="handlePos('end').y" r="6" fill="#0a84ff" stroke="white" stroke-width="2" />
                </template>
              </g>

              <!-- Players as SVG -->
              <PlayersLayer :players="players" :width="canvasWidth" :height="canvasHeight" />
            </svg>
            </div>
          </div>
          <!-- Right sidebar tools (outside the field, not overlay) -->
          <PlayEditorSidebar
            :selectedInfo="selectedInfo"
            :arrowShape="arrowShape"
            :tool="tool"
            @set-arrow-shape="setArrowShape"
            @delete-selected="deleteSelected"
            @set-tool="setTool"
            @tool-drag-start="onToolDragStart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import UiButton from '../ui/Button.vue'
import PlayersLayer from '../playeditor/objects/PlayersLayer.vue'
import PlayEditorSidebar from '../playeditor/PlayEditorSidebar.vue'
import halfCourtSvg from '../../assets/courts/halfcourt.svg?raw'
import fullCourtHtmlRaw from '../fullcourt.html?raw'

export default {
  name: 'PlayEditor',
  components: { UiButton, PlayersLayer, PlayEditorSidebar },
  props: {
    // Optional initial state to resume editing later
    initial: { type: Object, default: null },
    // Suggest a court from parent (e.g., from exercise.court)
    suggestedCourt: { type: String, default: '' }
  },
  emits: ['save','cancel'],
  setup(props, { emit }) {
    // Derived selection info for inspector
    const selectedInfo = computed(() => {
      // Line selected
      if (selectedLineIndex.value >= 0) {
        const L = lines[selectedLineIndex.value]
        if (!L) return null
        const map = { pass: 'Pass', dribble: 'Dribble', screen: 'Screen', cut: 'Cut', shoot: 'Shoot', handoff: 'Handoff' }
        return { type: 'line', name: map[L.type] || 'Actie', index: selectedLineIndex.value }
      }
      // Player selected
      if (selectedPlayerId.value) {
        const p = players.find(pp => pp.id === selectedPlayerId.value)
        if (p) return { type: 'player', name: 'Speler ' + (p.number ?? ''), id: p.id }
      }
      return null
    })

    function deleteSelected(){
      // Delete selected line or selected player
      if (selectedLineIndex.value >= 0) {
        lines.splice(selectedLineIndex.value, 1)
        selectedLineIndex.value = -1
        activeHandle.value = null
        redraw()
        return
      }
      if (selectedPlayerId.value) {
        const idx = players.findIndex(p => p.id === selectedPlayerId.value)
        if (idx >= 0) {
          players.splice(idx, 1)
          selectedPlayerId.value = null
          redraw()
          return
        }
      }
      // Fallback: if dragging a player but not explicitly selected
      if (draggingId.value) {
        const idx = players.findIndex(p => p.id === draggingId.value)
        if (idx >= 0) {
          players.splice(idx, 1)
          draggingId.value = null
          redraw()
        }
      }
    }
    const courtContainer = ref(null)
    const svgRef = ref(null)
    const playableBounds = ref({ minX: 0, minY: 0, maxX: 1, maxY: 1 })

    function updatePlayableBounds(){
      try {
        const container = courtContainer.value
        const overlay = svgRef.value
        if (!container || !overlay || typeof overlay.getBoundingClientRect !== 'function') {
          playableBounds.value = { minX: 0, minY: 0, maxX: 1, maxY: 1 }
          return
        }
        const svg = container.querySelector && container.querySelector('svg')
        const bg = svg && svg.querySelector ? svg.querySelector('#editor_court_bg') : null
        const overlayRect = overlay.getBoundingClientRect()
        let minX = 0, minY = 0, maxX = 1, maxY = 1
        if (bg && typeof bg.getBoundingClientRect === 'function') {
          const bgRect = bg.getBoundingClientRect()
          const nx1 = (bgRect.left - overlayRect.left) / overlayRect.width
          const ny1 = (bgRect.top - overlayRect.top) / overlayRect.height
          const nx2 = (bgRect.right - overlayRect.left) / overlayRect.width
          const ny2 = (bgRect.bottom - overlayRect.top) / overlayRect.height
          minX = Math.max(0, Math.min(1, Math.min(nx1, nx2)))
          maxX = Math.max(0, Math.min(1, Math.max(nx1, nx2)))
          minY = Math.max(0, Math.min(1, Math.min(ny1, ny2)))
          maxY = Math.max(0, Math.min(1, Math.max(ny1, ny2)))
        } else if (svg && typeof svg.getBoundingClientRect === 'function') {
          // Fallback: use root svg rect projected into overlay space
          const svgr = svg.getBoundingClientRect()
          const nx1 = (svgr.left - overlayRect.left) / overlayRect.width
          const ny1 = (svgr.top - overlayRect.top) / overlayRect.height
          const nx2 = (svgr.right - overlayRect.left) / overlayRect.width
          const ny2 = (svgr.bottom - overlayRect.top) / overlayRect.height
          minX = Math.max(0, Math.min(1, Math.min(nx1, nx2)))
          maxX = Math.max(0, Math.min(1, Math.max(nx1, nx2)))
          minY = Math.max(0, Math.min(1, Math.min(ny1, ny2)))
          maxY = Math.max(0, Math.min(1, Math.max(ny1, ny2)))
        }
        // Expand slightly to allow placing centers on the white boundary lines
        const eps = 0.003
        minX = Math.max(0, minX - eps)
        minY = Math.max(0, minY - eps)
        maxX = Math.min(1, maxX + eps)
        maxY = Math.min(1, maxY + eps)
        if (maxX > minX + 0.002 && maxY > minY + 0.002) {
          playableBounds.value = { minX, minY, maxX, maxY }
        } else {
          playableBounds.value = { minX: 0, minY: 0, maxX: 1, maxY: 1 }
        }
      } catch (_) {
        playableBounds.value = { minX: 0, minY: 0, maxX: 1, maxY: 1 }
      }
    }

    function clampXY(x, y){
      try {
        const b = playableBounds.value || { minX: 0, minY: 0, maxX: 1, maxY: 1 }
        const cx = Math.max(b.minX, Math.min(b.maxX, x))
        const cy = Math.max(b.minY, Math.min(b.maxY, y))
        return { x: cx, y: cy }
      } catch(_) { return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) } }
    }

    const court = ref('half') // 'half' | 'full'
    function normalizeSuggestedCourt(v){
      const s = String(v||'').toLowerCase().replace(/\s+/g,'')
      if (s === 'full' || s === 'fullcourt') return 'full'
      if (s === 'half' || s === 'halfcourt') return 'half'
      return 'half'
    }

    const players = reactive([]) // [{id, x, y, number, color}]; x,y in [0..1] normalized
    let nextId = 1

    // Arrow shape selection for new/selected lines
    const arrowShape = ref('straight') // 'straight' | 'curve' | 'zigzag' | 'curvedZigzag'
    function setArrowShape(shape){
      const allowed = ['straight','curve','zigzag','curvedZigzag']
      const s = allowed.includes(shape) ? shape : 'straight'
      if (selectedLineIndex.value >= 0 && lines[selectedLineIndex.value]) {
        lines[selectedLineIndex.value].shape = s
        redraw()
      } else {
        arrowShape.value = s
      }
    }

    // Default aspect ratios (fallbacks); will be updated from injected SVG viewBox
    const DEFAULT_HALF_RATIO = 800/450 // width/height for half court fallback
    const DEFAULT_FULL_RATIO = 50/94
    const currentRatio = ref(DEFAULT_HALF_RATIO)

    const leftPane = ref(null)
    const editorWidth = ref(900)
    const editorHeight = ref(600)

    // Compute size to fit inside available width/height, prioritizing height (no vertical scroll)
    const canvasSize = computed(() => {
      const availW = Math.max(0, Math.floor(editorWidth.value || 0))
      const availH = Math.max(0, Math.floor(editorHeight.value || 0))
      const ratio = Math.max(0.01, Number(currentRatio.value) || (court.value === 'half' ? DEFAULT_HALF_RATIO : DEFAULT_FULL_RATIO)) // width / height
      if (availW <= 0 || availH <= 0) return { w: 0, h: 0 }
      // Height-first fit: occupy full available height, but clamp width to available width to avoid horizontal scroll
      let h = availH
      let w = Math.round(h * ratio)
      if (w > availW) {
        w = availW
        h = Math.round(w / ratio)
      }
      return { w, h }
    })

    const canvasWidth = computed(() => canvasSize.value.w)
    const canvasHeight = computed(() => canvasSize.value.h)
    // Wrapper width no longer constrains; keep for compatibility if referenced (unused in template)
    const wrapperWidth = computed(() => canvasWidth.value + 192)

    function setCourt(kind){ court.value = (kind === 'full') ? 'full' : 'half'; redraw() }

    // Cache and extractor for full-court SVG from the provided HTML file
    let fullCourtSvgCache = ''
    function getFullCourtSvg(){
      if (fullCourtSvgCache) return fullCourtSvgCache
      try {
        const div = document.createElement('div')
        div.innerHTML = fullCourtHtmlRaw
        const svg = div.querySelector('svg')
        fullCourtSvgCache = svg ? svg.outerHTML : fullCourtHtmlRaw
      } catch (_) {
        fullCourtSvgCache = fullCourtHtmlRaw
      }
      return fullCourtSvgCache
    }

    function renderCourt(){
      try {
        const el = courtContainer.value
        if (!el) return
        // Inject correct HTML once or when switching
        const html = (court.value === 'full') ? getFullCourtSvg() : halfCourtSvg
        // Only replace when different to avoid losing any internal state unnecessarily
        if (el.__current !== (court.value || '')) {
          el.innerHTML = html
          el.__current = court.value || ''
        }
        // Ensure sizing: set explicit pixel size on the top-level SVG if found
        const svg = el.querySelector('svg') || null
        if (svg) {
          svg.setAttribute('width', String(canvasWidth.value))
          svg.setAttribute('height', String(canvasHeight.value))
          // Make sure it does not overflow and fits container
          svg.style.width = canvasWidth.value + 'px'
          svg.style.height = canvasHeight.value + 'px'
          svg.style.display = 'block'
          // Remove any decorative visuals that extend beyond the box and could misalign with overlay
          try { svg.style.boxShadow = 'none'; } catch(_) {}
          try { svg.style.borderRadius = '0px'; } catch(_) {}
          // Update aspect ratio using the best available method
          let ratioFromSvg = 0
          // Compute ratio from viewBox with sensible fallbacks
          try {
            // 1) Use viewBox on the top-level SVG
            const vb = svg.getAttribute('viewBox')
            if (vb) {
              const parts = vb.trim().split(/\s+/)
              if (parts.length === 4) {
                const vw = parseFloat(parts[2])
                const vh = parseFloat(parts[3])
                if (isFinite(vw) && isFinite(vh) && vh > 0) {
                  ratioFromSvg = Math.max(0.01, vw / vh)
                }
              }
            }
          } catch(_) {}
          if (!ratioFromSvg) {
            try {
              // 2) Fallback to nested first child SVG viewBox, if present
              const inner = svg.querySelector && svg.querySelector('svg')
              const ivb = inner && inner.getAttribute ? inner.getAttribute('viewBox') : null
              if (ivb) {
                const parts = ivb.trim().split(/\s+/)
                if (parts.length === 4) {
                  const vw = parseFloat(parts[2])
                  const vh = parseFloat(parts[3])
                  if (isFinite(vw) && isFinite(vh) && vh > 0) {
                    ratioFromSvg = Math.max(0.01, vw / vh)
                  }
                }
              }
            } catch(_) {}
          }
          currentRatio.value = ratioFromSvg || ((court.value === 'half') ? DEFAULT_HALF_RATIO : DEFAULT_FULL_RATIO)
        } else {
          // No SVG found; use defaults per court
          currentRatio.value = (court.value === 'half') ? DEFAULT_HALF_RATIO : DEFAULT_FULL_RATIO
        }
        // Also constrain wrapper div height to overlay alignment
        el.style.width = canvasWidth.value + 'px'
        el.style.height = canvasHeight.value + 'px'
        el.style.position = 'relative'
        // keep wrapper size as set by Vue binding to avoid conflicts
        const wrapper = el.parentElement
        if (wrapper) {
          // no-op: wrapper width/height are controlled by template :style
        }
        // update playable bounds after sizes are applied
        updatePlayableBounds()
      } catch (_) {}
    }

    function addPlayer() {
      const id = nextId++
      const number = players.length + 1
      players.push({ id, x: 0.5, y: 0.5, number, color: '#2563eb' }) // blue-600
      redraw()
    }
    function removePlayer(){ if (players.length>0) { players.pop(); redraw() } }
    function resetPositions(){ players.forEach(p => { p.x = 0.5; p.y = 0.5 }) ; redraw() }

    // Tools and objects
    const tool = ref('') // '' | 'player1'..'player5' | 'pass' | 'dribble' | 'screen' | 'cut' | 'shoot' | 'handoff'
    const lines = reactive([]) // [{type:'pass'|'dribble'|'screen'|'cut'|'shoot'|'handoff', shape:'straight'|'curve'|'zigzag'|'curvedZigzag', x1,y1,xm,ym,x2,y2}]

    function setTool(t){ tool.value = t }

    // Dragging state
    const draggingId = ref(null)
    const dragOffset = ref({ dx: 0, dy: 0 })
    const drawing = ref(null) // temp {type, x1,y1}
    const selectedLineIndex = ref(-1)
    const activeHandle = ref(null) // 'start' | 'mid' | 'end' | 'line' | null
    const lineDragOffset = ref({ dx: 0, dy: 0 })
    const selectedPlayerId = ref(null)

    function getCanvasPoint(evt) {
      const svg = svgRef.value
      const host = (svg && typeof svg.getBoundingClientRect === 'function') ? svg : (courtContainer.value || svg)
      const rect = host.getBoundingClientRect()
      const clientX = evt.clientX
      const clientY = evt.clientY
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height
      return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
    }

    function pickPlayerAt(normX, normY) {
      // hit-test normalized, consider radius in normalized units
      const rPx = 18 // visual radius in px
      const rx = rPx / canvasWidth.value
      const ry = rPx / canvasHeight.value
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
      // default: clear line selection; may set again below
      selectedLineIndex.value = -1
      activeHandle.value = null
      // selection/drag players or lines
      // 1) check line handles first
      const hit = pickLineHandle(x, y)
      if (hit) {
        selectedLineIndex.value = hit.index
        activeHandle.value = hit.handle
        selectedPlayerId.value = null
        if (hit.handle === 'line') {
          const L = lines[hit.index]
          lineDragOffset.value = { dx: x - L.x1, dy: y - L.y1 }
        }
        redraw()
        return
      }
      // 2) then players
      const p = pickPlayerAt(x, y)
      if (p) {
        draggingId.value = p.id
        dragOffset.value = { dx: x - p.x, dy: y - p.y }
        selectedLineIndex.value = -1
        activeHandle.value = null
        selectedPlayerId.value = p.id
        return
      }
      // 3) empty area: if a tool is selected, create object by click-to-place (single-shot) and clear tool
      if (/^player[1-5]$/.test(tool.value)) {
        const id = nextId++
        const number = Number(tool.value.replace('player','')) || (players.length + 1)
        const cl = clampXY(x, y)
        players.push({ id, x: cl.x, y: cl.y, number, color: '#2563eb' })
        selectedPlayerId.value = id
        tool.value = ''
        redraw()
        return
      }
      if (['pass','dribble','screen','cut','shoot','handoff'].includes(tool.value)) {
        const dx = 0.1, dy = 0
        const x2 = Math.min(1, x + dx), y2 = Math.min(1, y + dy)
        const xm = (x + x2) / 2, ym = (y + y2) / 2
        lines.push({ type: tool.value, shape: arrowShape.value, x1: x, y1: y, xm, ym, x2, y2 })
        selectedLineIndex.value = lines.length - 1
        activeHandle.value = 'end'
        tool.value = ''
        redraw()
        return
      }
      // 4) no tool -> clear selection
      selectedLineIndex.value = -1
      activeHandle.value = null
      selectedPlayerId.value = null
      redraw()
    }
    function onPointerMove(e){
      const { x, y } = getCanvasPoint(e)
      // moving line handles
      if (selectedLineIndex.value >= 0 && activeHandle.value) {
        const L = lines[selectedLineIndex.value]
        if (!L) return
        if (activeHandle.value === 'start') {
          L.x1 = Math.max(0, Math.min(1, x)); L.y1 = Math.max(0, Math.min(1, y))
        } else if (activeHandle.value === 'mid') {
          L.xm = Math.max(0, Math.min(1, x)); L.ym = Math.max(0, Math.min(1, y))
        } else if (activeHandle.value === 'end') {
          L.x2 = Math.max(0, Math.min(1, x)); L.y2 = Math.max(0, Math.min(1, y))
        } else if (activeHandle.value === 'line') {
          const dxm = x - lineDragOffset.value.dx - L.x1
          const dym = y - lineDragOffset.value.dy - L.y1
          L.x1 += dxm; L.y1 += dym; L.x2 += dxm; L.y2 += dym
          if (typeof L.xm === 'number' && typeof L.ym === 'number') {
            L.xm += dxm; L.ym += dym
          }
          // clamp all points
          L.x1 = Math.max(0, Math.min(1, L.x1)); L.y1 = Math.max(0, Math.min(1, L.y1))
          L.x2 = Math.max(0, Math.min(1, L.x2)); L.y2 = Math.max(0, Math.min(1, L.y2))
          if (typeof L.xm === 'number' && typeof L.ym === 'number') {
            L.xm = Math.max(0, Math.min(1, L.xm)); L.ym = Math.max(0, Math.min(1, L.ym))
          }
          lineDragOffset.value = { dx: x - L.x1, dy: y - L.y1 }
        }
        redraw()
        return
      }
      if (!draggingId.value) return
      const p = players.find(pp => pp.id === draggingId.value)
      if (!p) return
      const cl = clampXY(x - dragOffset.value.dx, y - dragOffset.value.dy)
      p.x = cl.x
      p.y = cl.y
      redraw()
    }
    function onPointerUp(e){
      draggingId.value = null
      activeHandle.value = null
    }

    // Touch helpers
    function firstTouch(ev){ return (ev.touches && ev.touches[0]) ? ev.touches[0] : (ev.changedTouches && ev.changedTouches[0]) }
    function onTouchStart(ev){ const t = firstTouch(ev); if (!t) return; onPointerDown(t) }
    function onTouchMove(ev){ const t = firstTouch(ev); if (!t) return; onPointerMove(t) }
    function onTouchEnd(){ onPointerUp() }

    // Drag & drop from sidebar
    function onToolDragStart(kind, ev){
      try {
        const dt = ev && ev.dataTransfer
        if (dt) { dt.setData('text/plain', kind); dt.effectAllowed = 'copy' }
      } catch(_) {}
    }
    function onCanvasDrop(ev){
      try {
        const kind = (ev.dataTransfer && ev.dataTransfer.getData('text/plain')) || ''
        const { x, y } = getCanvasPoint(ev)
        if (/^player[1-5]$/.test(kind)) {
          const id = nextId++
          const number = Number(kind.replace('player','')) || (players.length + 1)
          const cl = clampXY(x, y)
          players.push({ id, x: cl.x, y: cl.y, number, color: '#2563eb' })
          redraw()
        } else if (['pass','dribble','screen','cut','shoot','handoff'].includes(kind)) {
          // when dropping a line tool, create a short line to the right with a movable middle point
          const dx = 0.1, dy = 0
          const x2 = Math.min(1, x + dx), y2 = Math.min(1, y + dy)
          const xm = (x + x2) / 2, ym = (y + y2) / 2
          lines.push({ type: kind, shape: arrowShape.value, x1: x, y1: y, xm, ym, x2, y2 })
          selectedLineIndex.value = lines.length - 1
          activeHandle.value = 'end'
          redraw()
        }
      } catch(_) {}
    }

    function drawCourtHalf(c) {
      const w = c.canvas.width, h = c.canvas.height
      c.clearRect(0,0,w,h)
      // wood-like background to mimic SVG
      c.fillStyle = '#f0e1cd'
      c.fillRect(0,0,w,h)
      // outer boundary
      c.strokeStyle = '#fff'
      c.lineWidth = 3
      const margin = 8
      c.strokeRect(margin, margin, w - margin*2, h - margin*2)

      // Geometry for top basket half-court (basket at top center)
      const rimX = w / 2
      const rimY = 60
      const backboardY = 40
      const backboardHalf = 30

      // Backboard (horizontal)
      c.beginPath()
      c.moveTo(rimX - backboardHalf, backboardY)
      c.lineTo(rimX + backboardHalf, backboardY)
      c.stroke()
      // Rim
      c.beginPath(); c.arc(rimX, rimY, 9, 0, Math.PI*2); c.stroke()

      // Lane / Paint (rectangle extending downward from near top)
      const laneDepth = 160
      const laneWidth = 160
      c.strokeRect(rimX - laneWidth/2, margin + (backboardY - margin), laneWidth, laneDepth - (margin - 8))

      // Free-throw semicircle (opening downward)
      const ftCenterY = 160
      const ftRadius = 60
      c.beginPath(); c.arc(rimX, ftCenterY, ftRadius, 0, Math.PI, false); c.stroke()

      // Restricted area under basket (small semicircle opening downward)
      const raRadius = 40
      c.beginPath(); c.arc(rimX, rimY, raRadius, 0, Math.PI, false); c.stroke()

      // Three-point: corner straight lines down from top + arc around rim
      const cornerY = 230 // distance from baseline (top)
      const cornerPadding = 40
      // Corner straight lines (from top corners downward)
      c.beginPath(); c.moveTo(margin + cornerPadding, cornerY); c.lineTo(w - margin - cornerPadding, cornerY); c.stroke()
      // Arc centered at rim between intersections with the horizontal corner line
      const tpRadius = 220
      // Compute angles where arc intersects the cornerY line
      const dy = cornerY - rimY
      const clamped = Math.max(-1, Math.min(1, dy / tpRadius))
      const theta = Math.acos(clamped)
      const a1 = Math.PI + theta
      const a2 = Math.PI - theta
      c.beginPath(); c.arc(rimX, rimY, tpRadius, a1, a2, true); c.stroke()
    }

    function drawCourtFull(c){
      const w = c.canvas.width, h = c.canvas.height
      c.clearRect(0,0,w,h)
      c.fillStyle = '#f0e1cd'
      c.fillRect(0,0,w,h)
      c.strokeStyle = '#fff'
      c.lineWidth = 3
      const margin = 8
      c.strokeRect(margin, margin, w - margin*2, h - margin*2)

      // Center line and circle (horizontal center line)
      c.beginPath(); c.moveTo(margin, h/2); c.lineTo(w - margin, h/2); c.stroke()
      c.beginPath(); c.arc(w/2, h/2, 50, 0, Math.PI*2); c.stroke()

      // Top basket half
      ;(function(){
        const rimX = w/2, rimY = 60
        const backboardY = 40, backboardHalf = 30
        // Backboard (horizontal)
        c.beginPath(); c.moveTo(rimX - backboardHalf, backboardY); c.lineTo(rimX + backboardHalf, backboardY); c.stroke()
        // Rim
        c.beginPath(); c.arc(rimX, rimY, 9, 0, Math.PI*2); c.stroke()
        // Lane
        const laneDepth = 160, laneWidth = 160
        c.strokeRect(rimX - laneWidth/2, margin + (backboardY - margin), laneWidth, laneDepth - (margin - 8))
        // Free-throw semi (opening downward)
        const ftCenterY = 160
        const ftRadius = 60
        c.beginPath(); c.arc(rimX, ftCenterY, ftRadius, 0, Math.PI, false); c.stroke()
        // Restricted area (downward)
        const raRadius = 40
        c.beginPath(); c.arc(rimX, rimY, raRadius, 0, Math.PI, false); c.stroke()
        // Three-point: left/right straight segments and arc
        const cornerY = 230
        const cornerPadding = 40
        c.beginPath(); c.moveTo(margin + cornerPadding, cornerY); c.lineTo(w - margin - cornerPadding, cornerY); c.stroke()
        const tpRadius = 220
        const dy = cornerY - rimY
        const clamped = Math.max(-1, Math.min(1, dy / tpRadius))
        const theta = Math.acos(clamped)
        const a1 = Math.PI + theta
        const a2 = Math.PI - theta
        c.beginPath(); c.arc(rimX, rimY, tpRadius, a1, a2, true); c.stroke()
      })()

      // Bottom basket half
      ;(function(){
        const rimX = w/2, rimY = h - 60
        const backboardY = h - 40, backboardHalf = 30
        // Backboard (horizontal)
        c.beginPath(); c.moveTo(rimX - backboardHalf, backboardY); c.lineTo(rimX + backboardHalf, backboardY); c.stroke()
        // Rim
        c.beginPath(); c.arc(rimX, rimY, 9, 0, Math.PI*2); c.stroke()
        // Lane (extending upward toward center)
        const laneDepth = 160, laneWidth = 160
        c.strokeRect(rimX - laneWidth/2, h - margin - laneDepth - (margin - 8), laneWidth, laneDepth - (margin - 8))
        // Free-throw semi (opening upward)
        const ftCenterY = h - 160
        const ftRadius = 60
        c.beginPath(); c.arc(rimX, ftCenterY, ftRadius, Math.PI, 0, false); c.stroke()
        // Restricted area (upward)
        const raRadius = 40
        c.beginPath(); c.arc(rimX, rimY, raRadius, Math.PI, 0, false); c.stroke()
        // Three-point straight line above baseline and arc
        const cornerY = h - 230
        const cornerPadding = 40
        c.beginPath(); c.moveTo(margin + cornerPadding, cornerY); c.lineTo(w - margin - cornerPadding, cornerY); c.stroke()
        const tpRadius = 220
        const dy = rimY - cornerY
        const clamped = Math.max(-1, Math.min(1, dy / tpRadius))
        const theta = Math.acos(clamped)
        const a1 = 0 + theta
        const a2 = 0 - theta
        c.beginPath(); c.arc(rimX, rimY, tpRadius, a2, a1, false); c.stroke()
      })()
    }

    // SVG-like markers via Canvas: emulate markers for arrow, screen, and shot per TheHoopsGeek style
    function drawLine(c, line){
      const w = c.canvas.width, h = c.canvas.height
      const x1 = line.x1 * w, y1 = line.y1 * h
      const x2 = line.x2 * w, y2 = line.y2 * h
      const xm = (line.xm != null ? line.xm : (line.x1 + line.x2)/2) * w
      const ym = (line.ym != null ? line.ym : (line.y1 + line.y2)/2) * h
      c.save()
      c.lineWidth = 3
      c.lineCap = 'round'
      c.strokeStyle = '#111827'
      c.fillStyle = '#111827'
      const shape = line.shape || 'straight'
      if (line.type === 'pass' || line.type === 'handoff' || line.type === 'shoot') {
        c.setLineDash([10, 8])
      } else if (line.type === 'dribble' && shape !== 'curvedZigzag') {
        // zigzag: draw polyline of small zigs between start and end (ignore middle for dribble)
        const dx = x2 - x1, dy = y2 - y1, dist = Math.hypot(dx, dy)
        const seg = 14
        const steps = Math.max(2, Math.floor(dist / seg))
        const ux = dx / steps, uy = dy / steps
        c.beginPath()
        c.moveTo(x1, y1)
        for (let i=1;i<=steps;i++){
          const px = x1 + ux * i
          const py = y1 + uy * i
          const offset = (i % 2 === 0) ? 6 : -6
          const nx = -uy, ny = ux
          c.lineTo(px + nx*offset, py + ny*offset)
        }
        c.stroke()
        // arrow head at end
        drawArrowHead(c, x2, y2, Math.atan2(dy, dx))
        c.restore()
        return
      }
      // draw according to shape
      let angle = Math.atan2(y2 - ym, x2 - xm)
      if (shape === 'straight') {
        c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke()
        angle = Math.atan2(y2 - y1, x2 - x1)
      } else if (shape === 'curve') {
        c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(xm, ym, x2, y2); c.stroke()
        // tangent of quadratic at t=1 equals P2 - control
        angle = Math.atan2(y2 - ym, x2 - xm)
      } else if (shape === 'zigzag') {
        // zigzag along two straight segments using midpoint
        drawZigZagPolyline(c, [ [x1,y1], [xm,ym], [x2,y2] ])
        angle = Math.atan2(y2 - ym, x2 - xm)
      } else if (shape === 'curvedZigzag') {
        // zigzag along a quadratic curve sampled into points
        const pts = sampleQuadratic([x1,y1],[xm,ym],[x2,y2], 24)
        drawZigZagAlongPoints(c, pts)
        // estimate tangent using last two points
        const n = pts.length; angle = Math.atan2(pts[n-1][1]-pts[n-2][1], pts[n-1][0]-pts[n-2][0])
      } else {
        // fallback straight
        c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke()
        angle = Math.atan2(y2 - y1, x2 - x1)
      }
      if (line.type === 'screen') {
        // screen marker: small vertical rectangle marker at end similar to SVG marker
        const mW = 2, mH = 13
        c.save()
        c.translate(x2, y2)
        c.rotate(angle)
        c.fillRect(-mW, -mH/2, mW, mH)
        c.restore()
      } else if (line.type === 'shoot') {
        // shot marker: circle with crosshair at end
        c.save()
        c.translate(x2, y2)
        c.strokeStyle = '#111827'
        c.lineWidth = 1
        c.beginPath(); c.arc(0, 0, 9, 0, Math.PI*2); c.stroke()
        c.beginPath(); c.moveTo(-9, 0); c.lineTo(-3, 0); c.stroke()
        c.beginPath(); c.moveTo(3, 0); c.lineTo(9, 0); c.stroke()
        c.beginPath(); c.moveTo(0, -9); c.lineTo(0, -3); c.stroke()
        c.beginPath(); c.moveTo(0, 3); c.lineTo(0, 9); c.stroke()
        c.restore()
      } else {
        // normal arrow head
        drawArrowHead(c, x2, y2, angle)
      }
      c.restore()
    }
    function sampleQuadratic(p0, p1, p2, steps){
      const pts = []
      const n = Math.max(4, steps||16)
      for (let i=0;i<=n;i++){
        const t = i/n
        const x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0]
        const y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1]
        pts.push([x,y])
      }
      return pts
    }
    function drawZigZagPolyline(c, points){
      // Draw zigzag along multiple straight segments
      const segLen = 14, offsetAmp = 6
      c.beginPath()
      c.moveTo(points[0][0], points[0][1])
      let toggle = 1
      for (let si=0; si<points.length-1; si++){
        const [sx,sy] = points[si]
        const [ex,ey] = points[si+1]
        const dx = ex - sx, dy = ey - sy
        const dist = Math.hypot(dx, dy)
        const steps = Math.max(1, Math.floor(dist / segLen))
        const ux = dx / steps, uy = dy / steps
        for (let i=1;i<=steps;i++){
          const px = sx + ux * i
          const py = sy + uy * i
          const nx = -uy, ny = ux
          const off = offsetAmp * (toggle)
          c.lineTo(px + nx*off, py + ny*off)
          toggle = -toggle
        }
      }
      c.stroke()
    }
    function drawZigZagAlongPoints(c, pts){
      const offsetAmp = 6
      c.beginPath(); c.moveTo(pts[0][0], pts[0][1])
      let toggle = 1
      for (let i=1;i<pts.length;i++){
        const x = pts[i][0], y = pts[i][1]
        const px = pts[i-1][0], py = pts[i-1][1]
        const dx = x - px, dy = y - py
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy/len, ny = dx/len
        c.lineTo(x + nx*(offsetAmp*toggle), y + ny*(offsetAmp*toggle))
        toggle = -toggle
      }
      c.stroke()
    }
    function drawArrowHead(c, x, y, angle){
      const size = 10
      c.beginPath()
      c.moveTo(x, y)
      c.lineTo(x - Math.cos(angle - Math.PI/6)*size, y - Math.sin(angle - Math.PI/6)*size)
      c.moveTo(x, y)
      c.lineTo(x - Math.cos(angle + Math.PI/6)*size, y - Math.sin(angle + Math.PI/6)*size)
      c.stroke()
    }

    // SVG helpers to build path data and marker styles
    function dashFor(line){
      if (!line) return ''
      return (line.type === 'pass' || line.type === 'handoff' || line.type === 'shoot') ? '10 8' : ''
    }
    function markerEndFor(line){
      if (!line) return null
      if (line.type === 'screen') return 'url(#screen_marker)'
      if (line.type === 'shoot') return 'url(#shot_marker)'
      return 'url(#arrow_marker)'
    }
    function pathD(line){
      const w = canvasWidth.value
      const h = canvasHeight.value
      const x1 = line.x1 * w, y1 = line.y1 * h
      const x2 = line.x2 * w, y2 = line.y2 * h
      const xm = (line.xm != null ? line.xm : (line.x1 + line.x2)/2) * w
      const ym = (line.ym != null ? line.ym : (line.y1 + line.y2)/2) * h
      const shape = line.shape || 'straight'
      if (line.type === 'dribble' && (shape === 'straight')) {
        // straight zigzag path approximated by polyline points
        const pts = zigzagPoints([[x1,y1],[x2,y2]])
        return pointsToPath(pts)
      }
      if (line.type === 'dribble' && (shape === 'curvedZigzag' || shape === 'curve')) {
        const pts = sampleQuadratic([x1,y1],[xm,ym],[x2,y2], 24)
        const zpts = zigzagAlongPoints(pts)
        return pointsToPath(zpts)
      }
      if (shape === 'straight') return `M ${x1} ${y1} L ${x2} ${y2}`
      if (shape === 'curve') return `M ${x1} ${y1} Q ${xm} ${ym} ${x2} ${y2}`
      if (shape === 'zigzag') {
        const pts = zigzagPoints([[x1,y1],[xm,ym],[x2,y2]])
        return pointsToPath(pts)
      }
      if (shape === 'curvedZigzag') {
        const pts = sampleQuadratic([x1,y1],[xm,ym],[x2,y2], 24)
        const zpts = zigzagAlongPoints(pts)
        return pointsToPath(zpts)
      }
      return `M ${x1} ${y1} L ${x2} ${y2}`
    }
    function pointsToPath(pts){
      if (!pts || !pts.length) return ''
      let d = `M ${pts[0][0]} ${pts[0][1]}`
      for (let i=1;i<pts.length;i++) d += ` L ${pts[i][0]} ${pts[i][1]}`
      return d
    }
    function zigzagPoints(segments){
      const segLen = 14, offsetAmp = 6
      const pts = []
      let start = segments[0]
      pts.push([start[0], start[1]])
      let toggle = 1
      for (let si=0; si<segments.length-1; si++){
        const [sx,sy] = segments[si]
        const [ex,ey] = segments[si+1]
        const dx = ex - sx, dy = ey - sy
        const dist = Math.hypot(dx, dy)
        const steps = Math.max(1, Math.floor(dist / segLen))
        const ux = dx / steps, uy = dy / steps
        for (let i=1;i<=steps;i++){
          const px = sx + ux * i
          const py = sy + uy * i
          const nx = -uy, ny = ux
          const off = offsetAmp * (toggle)
          pts.push([px + nx*off, py + ny*off])
          toggle = -toggle
        }
      }
      return pts
    }
    function zigzagAlongPoints(pts){
      const offsetAmp = 6
      const out = []
      if (!pts || !pts.length) return out
      out.push([pts[0][0], pts[0][1]])
      let toggle = 1
      for (let i=1;i<pts.length;i++){
        const x = pts[i][0], y = pts[i][1]
        const px = pts[i-1][0], py = pts[i-1][1]
        const dx = x - px, dy = y - py
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy/len, ny = dx/len
        out.push([x + nx*(offsetAmp*toggle), y + ny*(offsetAmp*toggle)])
        toggle = -toggle
      }
      return out
    }
    function handlePos(kind){
      const i = selectedLineIndex.value
      if (i < 0) return null
      const L = lines[i]
      const w = canvasWidth.value, h = canvasHeight.value
      if (kind === 'start') return { x: L.x1 * w, y: L.y1 * h }
      if (kind === 'end') return { x: L.x2 * w, y: L.y2 * h }
      const shape = L.shape || 'straight'
      if (shape === 'straight') return null
      return { x: (L.xm != null ? L.xm : (L.x1+L.x2)/2) * w, y: (L.ym != null ? L.ym : (L.y1+L.y2)/2) * h }
    }

    function drawLineHandles(c, line){
      const w = c.canvas.width, h = c.canvas.height
      const x1 = line.x1 * w, y1 = line.y1 * h
      const x2 = line.x2 * w, y2 = line.y2 * h
      const xm = (line.xm != null ? line.xm : (line.x1 + line.x2)/2) * w
      const ym = (line.ym != null ? line.ym : (line.y1 + line.y2)/2) * h
      c.save()
      c.fillStyle = '#2563eb'
      const s = 8
      c.fillRect(x1 - s/2, y1 - s/2, s, s)
      if ((line.shape || 'straight') !== 'straight') {
        c.fillRect(xm - s/2, ym - s/2, s, s)
      }
      c.fillRect(x2 - s/2, y2 - s/2, s, s)
      c.restore()
    }

    function pickLineHandle(nx, ny){
      // nx,ny are normalized
      if (!lines.length) return null
      const px = nx * canvasWidth.value
      const py = ny * canvasHeight.value
      const handleRadius = 10
      // check from topmost line
      for (let i = lines.length - 1; i >= 0; i--) {
        const L = lines[i]
        const x1 = L.x1 * canvasWidth.value
        const y1 = L.y1 * canvasHeight.value
        const x2 = L.x2 * canvasWidth.value
        const y2 = L.y2 * canvasHeight.value
        const xm = (L.xm != null ? L.xm : (L.x1 + L.x2)/2) * canvasWidth.value
        const ym = (L.ym != null ? L.ym : (L.y1 + L.y2)/2) * canvasHeight.value
        const shape = L.shape || 'straight'
        // handle hits
        if (Math.hypot(px - x1, py - y1) <= handleRadius) return { index: i, handle: 'start' }
        if (shape !== 'straight' && Math.hypot(px - xm, py - ym) <= handleRadius) return { index: i, handle: 'mid' }
        if (Math.hypot(px - x2, py - y2) <= handleRadius) return { index: i, handle: 'end' }
        // segment hits
        if (shape === 'straight') {
          const dist = pointToSegmentDistance(px, py, x1, y1, x2, y2)
          if (dist <= 8) return { index: i, handle: 'line' }
        } else {
          const dist1 = pointToSegmentDistance(px, py, x1, y1, xm, ym)
          const dist2 = pointToSegmentDistance(px, py, xm, ym, x2, y2)
          if (Math.min(dist1, dist2) <= 8) return { index: i, handle: 'line' }
        }
      }
      return null
    }
    function pointToSegmentDistance(px, py, x1, y1, x2, y2){
      const dx = x2 - x1, dy = y2 - y1
      if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1)
      let t = ((px - x1)*dx + (py - y1)*dy) / (dx*dx + dy*dy)
      t = Math.max(0, Math.min(1, t))
      const xx = x1 + t*dx, yy = y1 + t*dy
      return Math.hypot(px - xx, py - yy)
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
      // No-op refresh for now; overlay SVG binds to reactive data.
      // Ensure court HTML is present and sized correctly.
      renderCourt()
    }

    function drawTempLine(){ /* no-op: live preview is via SVG overlay */ }

    async function saveAsImage(){
      try {
        // Compose export by rasterizing the injected court SVG + overlay vectors to a canvas
        const exportCanvas = document.createElement('canvas')
        exportCanvas.width = canvasWidth.value
        exportCanvas.height = canvasHeight.value
        const ec = exportCanvas.getContext('2d')

        // 1) Draw the new court background by converting the injected SVG element to a blob URL
        const container = courtContainer.value
        const svg = container ? container.querySelector('svg') : null
        if (svg) {
          // Clone the top-level SVG so we can safely serialize
          const cloned = svg.cloneNode(true)
          cloned.setAttribute('width', String(canvasWidth.value))
          cloned.setAttribute('height', String(canvasHeight.value))
          // Ensure inline styles applied
          const svgText = new XMLSerializer().serializeToString(cloned)
          const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(svgBlob)
          await new Promise((resolve) => {
            const img = new Image()
            img.onload = () => { try { ec.drawImage(img, 0, 0, exportCanvas.width, exportCanvas.height) } catch(_) {} URL.revokeObjectURL(url); resolve() }
            img.onerror = () => { URL.revokeObjectURL(url); resolve() }
            img.src = url
          })
        } else {
          // Fallback to simple background color if SVG not found
          ec.fillStyle = '#f0e1cd'
          ec.fillRect(0,0,exportCanvas.width, exportCanvas.height)
        }

        // 2) Draw lines and players on top to match the on-screen overlay
        lines.forEach(l => drawLine(ec, l))
        drawPlayers(ec)

        const url = exportCanvas.toDataURL('image/png')
        emit('save', { dataUrl: url, state: serializeState() })
      } catch (e) {
        // noop
      }
    }

    function serializeState(){
      return { court: court.value, players: players.map(p => ({ id: p.id, x: p.x, y: p.y, number: p.number, color: p.color })), lines: lines.map(l => ({...l})) }
    }
    function loadState(obj){
      try {
        players.splice(0, players.length)
        lines.splice(0, lines.length)
        nextId = 1
        if (obj && Array.isArray(obj.players)) {
          obj.players.forEach((p, idx) => {
            const id = p.id || (nextId++)
            players.push({ id, x: Number(p.x)||0.5, y: Number(p.y)||0.5, number: p.number || (idx+1), color: p.color || '#2563eb' })
          })
          nextId = Math.max(nextId, players.length + 1)
        }
        if (obj && Array.isArray(obj.lines)) {
          obj.lines.forEach(l => {
            if (l && l.type && ['pass','dribble','screen','cut','shoot','handoff'].includes(l.type)) {
              const x1 = Number(l.x1)||0, y1 = Number(l.y1)||0
              const x2 = Number(l.x2)||0, y2 = Number(l.y2)||0
              const hasMid = typeof l.xm === 'number' && typeof l.ym === 'number'
              const xm = hasMid ? Number(l.xm) : (x1 + x2) / 2
              const ym = hasMid ? Number(l.ym) : (y1 + y2) / 2
              const shape = l.shape || 'straight'
              lines.push({ type: l.type, shape, x1, y1, xm, ym, x2, y2 })
            }
          })
        }
        if (obj && (obj.court === 'half' || obj.court === 'full')) court.value = obj.court
      } catch (_) {}
      redraw()
    }

    onMounted(() => {
      try {
        setCourt(normalizeSuggestedCourt(props.suggestedCourt || (props.initial && props.initial.court)))
        if (props.initial) loadState(props.initial)
        else {
          players.splice(0, players.length)
          for (let i=0;i<5;i++) players.push({ id: nextId++, x: 0.3 + i*0.08, y: 0.6, number: i+1, color: '#2563eb' })
        }
        // Measure available width using ResizeObserver
        try {
          const el = leftPane.value
          const ro = new ResizeObserver(() => {
            try {
              const rect = el && typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : null
              const w = rect ? rect.width : null
              const h = rect ? rect.height : null
              let changed = false
              if (w && Math.abs(w - editorWidth.value) > 0.5) { editorWidth.value = w; changed = true }
              if (h && Math.abs(h - editorHeight.value) > 0.5) { editorHeight.value = h; changed = true }
              if (changed) renderCourt()
            } catch(_) {}
          })
          if (el) {
            ro.observe(el)
            // store observer on element for cleanup
            el.__ro = ro
            // initialize size
            const rect = el.getBoundingClientRect()
            if (rect) {
              if (rect.width) editorWidth.value = rect.width
              if (rect.height) editorHeight.value = rect.height
            }
          }
        } catch(_) {}
        renderCourt()
      } catch (_) {}
      window.addEventListener('resize', renderCourt)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', renderCourt)
      try { const el = leftPane.value; if (el && el.__ro) { el.__ro.disconnect(); el.__ro = null } } catch(_) {}
    })

    watch(() => court.value, () => renderCourt())

    // Keep arrowShape UI in sync with selected line's shape
    watch(() => selectedLineIndex.value, (i) => {
      try {
        if (i >= 0 && lines[i]) {
          arrowShape.value = lines[i].shape || 'straight'
        }
      } catch (_) {}
    })

    return {
      courtContainer,
      svgRef,
      leftPane,
      court,
      players,
      tool,
      setTool,
      arrowShape,
      setArrowShape,
      canvasWidth,
      canvasHeight,
      wrapperWidth,
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
      onToolDragStart,
      onCanvasDrop,
      saveAsImage,
      selectedInfo,
      deleteSelected,
      // SVG helpers
      pathD,
      markerEndFor,
      dashFor,
      handlePos
    }
  }
}
</script>

<style scoped>
.tool-btn{ @apply text-xs px-2 py-1.5 border rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600; }
.tool-active{ @apply bg-blue-500 text-white hover:bg-blue-600; }
</style>
