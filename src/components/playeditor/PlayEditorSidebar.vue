<template>
  <div class="relative z-[200] w-64 shrink-0 bg-white dark:bg-gray-800 border-l dark:border-gray-600 p-4 space-y-5 select-none">
    <!-- Selection inspector -->
    <div v-if="selectedInfo" class="mb-4 space-y-2">
      <!-- Only the selected object name -->
      <div class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{{ selectedInfo.name }}</div>
      <!-- Player role + position controls -->
      <div v-if="selectedInfo.type==='player'" class="text-xs space-y-2">
        <!-- Role -->
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-gray-500">Rol</span>
          <div class="relative w-full" ref="roleWrap">
            <button type="button"
                    class="menu dropdown-button h-8 px-2 rounded-md flex items-center justify-between w-full border border-gray-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                    @click.stop="toggleRoleMenu">
              <span class="text-xs">{{ roleLabel }}</span>
              <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div v-if="roleMenuOpen"
                 :class="['dropdown-menu absolute top-full mt-2 w-40 border whitespace-nowrap rounded-md shadow-lg flex flex-col z-[3000]', 'right-0']">
              <button class="dropdown-item !pl-3" :class="isRoleActive('ball') ? 'bg-blue-50 dark:bg-gray-600/50' : ''" @click.stop="onSelectRole('ball')">
                <PlayerBadge role="ball" :label="posLabel" :draggable="false" :size="30" />
                Bal
              </button>
              <button class="dropdown-item !pl-3" :class="isRoleActive('offense') ? 'bg-blue-50 dark:bg-gray-600/50' : ''" @click.stop="onSelectRole('offense')">
                <PlayerBadge role="offense" :label="posLabel" :draggable="false" :size="30" />
                Aanval
              </button>
              <button class="dropdown-item !pl-3" :class="isRoleActive('defense') ? 'bg-blue-50 dark:bg-gray-600/50' : ''" @click.stop="onSelectRole('defense')">
                <PlayerBadge role="defense" :label="posLabel" :draggable="false" :size="30" />
                Verdediging
              </button>
            </div>
          </div>
        </div>
        <!-- Position -->
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-gray-500">Positie</span>
          <div class="relative w-full" ref="posWrap">
            <button type="button"
                    class="menu dropdown-button h-8 px-2 rounded-md flex items-center justify-between w-full border border-gray-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                    @click.stop="togglePosMenu">
              <span class="text-xs">{{ posLabel }}</span>
              <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div v-if="posMenuOpen"
                 :class="['dropdown-menu absolute top-full mt-2 w-48 border whitespace-nowrap rounded-md shadow-lg z-[3000] p-2 space-y-2', 'right-0']">
              <div class="grid grid-cols-5 gap-1">
                <button v-for="n in [1,2,3,4,5]" :key="'posn'+n" type="button"
                        class="text-xs px-2 py-1 border rounded bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500"
                        :class="isPosActive(String(n)) ? 'ring-1 ring-blue-500 bg-blue-50' : ''"
                        @click.stop="onSelectPos(String(n))">{{ n }}</button>
              </div>
              <div class="grid grid-cols-5 gap-1">
                <button v-for="p in ['PG','SG','SF','PF','C']" :key="'pos'+p" type="button"
                        class="text-xs px-2 py-1 border rounded bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500"
                        :class="isPosActive(p) ? 'ring-1 ring-blue-500 bg-blue-50' : ''"
                        @click.stop="onSelectPos(p)">{{ p }}</button>
              </div>
              <div>
                <input type="text" v-model="posInput"
                       @input="onPosInput"
                       @keydown.enter.prevent.stop="onApplyCustomPos"
                       @blur="onApplyCustomPos"
                       class="w-full border rounded px-2 h-8 text-xs bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                       :class="posTooLong ? 'border-red-500 focus:ring-red-500' : ''"
                       placeholder="?" />
                <p v-if="posTooLong" class="mt-1 text-[11px] text-red-600">Maximaal 2 tekens</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Coordinates -->
        <div class="flex items-center gap-2">
<!--          <span class="text-[10px] text-gray-500">Coördinaten</span>-->
          <div class="flex items-center gap-2 w-full">
            <label class="flex items-center gap-1 text-[10px] text-gray-500">
              X
              <input type="number" step="1" min="-30" max="30" v-model="coordsX"
                     @input="onCoordInput('x')" @blur="onCoordBlur('x')"
                     class="w-20 border rounded px-2 h-8 text-xs bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100" />
            </label>
            <label class="flex items-center gap-1 text-[10px] text-gray-500">
              Y
              <input type="number" step="1" min="-30" max="30" v-model="coordsY"
                     @input="onCoordInput('y')" @blur="onCoordBlur('y')"
                     class="w-20 border rounded px-2 h-8 text-xs bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100" />
            </label>
          </div>
        </div>
        <!-- Color -->
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-gray-500">Kleur</span>
          <div class="relative w-full" ref="colorWrap">
            <button type="button"
                    class="menu dropdown-button h-8 px-2 rounded-md flex items-center justify-between w-full border border-gray-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                    @click.stop="toggleColorMenu">
              <span class="inline-flex items-center gap-2">
                <span class="inline-block w-4 h-4 rounded-sm border border-gray-300" :style="{ backgroundColor: (selectedInfo && selectedInfo.color) ? selectedInfo.color : '#111' }"></span>
                <span class="text-xs">Kies kleur</span>
              </span>
              <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div v-if="colorMenuOpen"
                 :class="['dropdown-menu absolute top-full mt-2 w-48 border whitespace-nowrap rounded-md shadow-lg z-[3000] p-2', 'right-0']">
              <div class="grid grid-cols-6 gap-2">
                <button v-for="col in colorOptions" :key="'col'+col" type="button"
                        :aria-label="'Kies kleur ' + col"
                        class="w-6 h-6 rounded-sm border flex items-center justify-center"
                        :class="isColorActive(col) ? 'ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-500'"
                        :style="{ backgroundColor: col }"
                        @click.stop="onSelectColor(col)">
                  <span v-if="isColorActive(col)" class="block w-3 h-3 rounded-sm bg-white/90"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Arrow shape options only when a line is selected -->
      <div v-if="selectedInfo.type==='line'" class="mt-2">
        <div class="text-[10px] text-gray-500">Arrow shape</div>
        <div class="mt-1 grid grid-cols-2 gap-1">
          <button type="button" class="tool-btn" @click="$emit('set-arrow-shape','straight')">Straight</button>
          <button type="button" class="tool-btn" @click="$emit('set-arrow-shape','curve')">Curve</button>
          <button type="button" class="tool-btn" @click="$emit('set-arrow-shape','zigzag')">Zig zag</button>
          <button type="button" class="tool-btn" @click="$emit('set-arrow-shape','curvedZigzag')">Curved zig zag</button>
        </div>
      </div>
      <div class="mt-2">
        <UiButton color="danger" size="sm" :customClass="'w-full'" @click="$emit('delete-selected')">{{ deleteLabel }}</UiButton>
      </div>
    </div>
    <div :class="['text-[11px] font-semibold text-gray-500 uppercase tracking-wide', selectedInfo ? 'border-t border-gray-200 dark:border-gray-600 pt-3 mt-1' : '']">Acties toevoegen</div>
    <div class="grid grid-cols-2 gap-2">
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','dribble')" @click="$emit('set-tool','dribble')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','dribble', ev)">Dribble</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','pass')" @click="$emit('set-tool','pass')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','pass', ev)">Pass</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','cut')" @click="$emit('set-tool','cut')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','cut', ev)">Cut</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','screen')" @click="$emit('set-tool','screen')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','screen', ev)">Screen</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','shoot')" @click="$emit('set-tool','shoot')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','shoot', ev)">Shoot</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','handoff')" @click="$emit('set-tool','handoff')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','handoff', ev)">Handoff</button>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-600 pt-3 mt-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Spelers toevoegen</div>
    <div class="space-y-1 mt-2">
      <!-- Row 1: Bal -->
      <div class="grid grid-cols-6 gap-1">
        <PlayerBadge
          v-for="n in 5"
          :key="'pb-ball-'+n"
          role="ball"
          :label="n"
          :draggable="true"
          @click="$emit('quick-add-player', { n, role: 'ball' })"
          @dragstart="(ev)=>$emit('tool-drag-start','ball:'+n, ev)"
        />
        <PlayerBadge
          role="ball"
          label="?"
          :draggable="true"
          @click="$emit('quick-add-player', { n: '?', role: 'ball' })"
          @dragstart="(ev)=>$emit('tool-drag-start','ball:?', ev)"
        />
      </div>
      <!-- Row 2: Aanval -->
      <div class="grid grid-cols-6 gap-1">
        <PlayerBadge
          v-for="n in 5"
          :key="'pb-off-'+n"
          role="offense"
          :label="n"
          :draggable="true"
          @click="$emit('quick-add-player', { n, role: 'offense' })"
          @dragstart="(ev)=>$emit('tool-drag-start','offense:'+n, ev)"
        />
        <PlayerBadge
          role="offense"
          label="?"
          :draggable="true"
          @click="$emit('quick-add-player', { n: '?', role: 'offense' })"
          @dragstart="(ev)=>$emit('tool-drag-start','offense:?', ev)"
        />
      </div>
      <!-- Row 3: Verdediging -->
      <div class="grid grid-cols-6 gap-1">
        <PlayerBadge
          v-for="n in 5"
          :key="'pb-def-'+n"
          role="defense"
          :label="n"
          :draggable="true"
          @click="$emit('quick-add-player', { n, role: 'defense' })"
          @dragstart="(ev)=>$emit('tool-drag-start','defense:'+n, ev)"
        />
        <PlayerBadge
          role="defense"
          label="?"
          :draggable="true"
          @click="$emit('quick-add-player', { n: '?', role: 'defense' })"
          @dragstart="(ev)=>$emit('tool-drag-start','defense:?', ev)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '../ui/Button.vue'
import PlayerBadge from './PlayerBadge.vue'
export default {
  name: 'PlayEditorSidebar',
  components: { UiButton, PlayerBadge },
  props: {
    selectedInfo: { type: Object, default: null },
    arrowShape: { type: String, default: 'straight' },
    tool: { type: String, default: '' }
  },
  emits: ['set-arrow-shape','delete-selected','set-tool','tool-drag-start','quick-add-player','set-player-role','set-player-position','set-player-color','set-player-coordinates'],
  data(){
    return { roleMenuOpen: false, posMenuOpen: false, colorMenuOpen: false, posInput: '', posTooLong: false, coordsX: '', coordsY: '', lastValidCoords: { x: 0, y: 0 } }
  },
  computed: {
    colorOptions(){
      // Exact requested palette in order:
      // zwart, paars, donkerblauw, lichtblauw, lichtgroen, donkergroen,
      // geel, oranje, rood, lichtgrijs, donkergrijs, wit
      return [
        '#000000', // zwart
        '#7C3AED', // paars
        '#1D4ED8', // donkerblauw
        '#60A5FA', // lichtblauw
        '#86EFAC', // lichtgroen
        '#059669', // donkergroen
        '#FACC15', // geel
        '#F59E0B', // oranje
        '#EF4444', // rood
        '#D1D5DB', // lichtgrijs
        '#4B5563', // donkergrijs
        '#FFFFFF'  // wit
      ]
    },
    roleLabel(){
      const r = (this.selectedInfo && (this.selectedInfo.role || 'offense')) || 'offense'
      const code = (r === 'bal' ? 'ball' : r === 'aanval' ? 'offense' : r === 'verdediging' ? 'defense' : r)
      if (code === 'ball') return 'Bal'
      if (code === 'defense') return 'Verdediging'
      return 'Aanval'
    },
    currentRole(){
      const r = (this.selectedInfo && (this.selectedInfo.role || 'offense')) || 'offense'
      const code = (r === 'bal' ? 'ball' : r === 'aanval' ? 'offense' : r === 'verdediging' ? 'defense' : r)
      return code
    },
    posLabel(){
      const p = (this.selectedInfo && (this.selectedInfo.pos || '')) || ''
      return String(p || '').slice(0,2) || '?' 
    },
    deleteLabel(){
      if (!this.selectedInfo) return 'Object verwijderen'
      return this.selectedInfo.type === 'player' ? 'Verwijder speler' : (this.selectedInfo.type === 'line' ? 'Verwijder actie' : 'Object verwijderen')
    }
  },
  methods: {
    round2(n){ const x = Number(n); if (!isFinite(x)) return 0; return Math.round(x*100)/100 },
    clampSigned(v){ return Math.max(-30, Math.min(30, Number(v))) },
    onCoordInput(which){
      try {
        const valStr = which === 'x' ? this.coordsX : this.coordsY
        // Allow partial input without forcing
        if (valStr === '' || valStr === '-' || valStr === '.' || valStr === '-.') {
          return
        }
        const num = Number(valStr)
        if (!isFinite(num)) {
          return
        }
        const clamped = this.clampSigned(num)
        // Save last valid numeric value
        if (which === 'x') this.lastValidCoords.x = this.round2(clamped)
        else this.lastValidCoords.y = this.round2(clamped)
        // Emit live update using last valid values
        this.$emit('set-player-coordinates', { x: this.lastValidCoords.x, y: this.lastValidCoords.y })
      } catch(_) {}
    },
    onCoordBlur(which){
      try {
        const parseAndFormat = (s, fallback) => {
          const n = Number(s)
          if (!isFinite(n)) return fallback.toFixed(2)
          const cl = this.round2(this.clampSigned(n))
          return cl.toFixed(2)
        }
        this.coordsX = parseAndFormat(this.coordsX, this.lastValidCoords.x)
        this.coordsY = parseAndFormat(this.coordsY, this.lastValidCoords.y)
        // Update lastValid with formatted values
        this.lastValidCoords = { x: Number(this.coordsX), y: Number(this.coordsY) }
        this.$emit('set-player-coordinates', { x: this.lastValidCoords.x, y: this.lastValidCoords.y })
      } catch(_) {}
    },
    isColorActive(col){
      const cur = (this.selectedInfo && this.selectedInfo.color) ? String(this.selectedInfo.color).toLowerCase() : '#111'
      return String(col || '').toLowerCase() === cur
    },
    toggleRoleMenu(){
      this.roleMenuOpen = !this.roleMenuOpen
      if (this.roleMenuOpen) {
        this.posMenuOpen = false
        this.colorMenuOpen = false
      }
    },
    onSelectRole(v){
      this.roleMenuOpen = false
      this.$emit('set-player-role', v)
    },
    togglePosMenu(){
      this.posMenuOpen = !this.posMenuOpen
      if (this.posMenuOpen) {
        this.roleMenuOpen = false
        this.colorMenuOpen = false
        const raw = (this.selectedInfo && this.selectedInfo.pos != null) ? String(this.selectedInfo.pos) : ''
        this.posInput = (raw === '' || raw === '?') ? '' : raw
        this.posTooLong = false
      }
    },
    toggleColorMenu(){
      this.colorMenuOpen = !this.colorMenuOpen
      if (this.colorMenuOpen) {
        this.roleMenuOpen = false
        this.posMenuOpen = false
      }
    },
    onSelectColor(col){
      // Do not close the menu on click; only update the color
      this.$emit('set-player-color', col)
    },
    isRoleActive(code){
      return String(this.currentRole || '').toLowerCase() === String(code || '').toLowerCase()
    },
    isPosActive(v){
      const cur = String(this.posLabel || '').toUpperCase()
      return cur === String(v || '').toUpperCase()
    },
    onSelectPos(v){
      // Keep menu open when selecting preset values
      this.$emit('set-player-position', String(v).slice(0,2))
    },
    onPosInput(){
      if (typeof this.posInput !== 'string') this.posInput = ''
      const raw = this.posInput
      this.posTooLong = (raw.length > 2)
      if (this.posTooLong) {
        // Prevent more than 2 characters but show error feedback
        this.posInput = raw.slice(0,2)
      }
      // Emit current value (can be empty to indicate placeholder)
      this.$emit('set-player-position', this.posInput)
    },
    onApplyCustomPos(){
      const raw = (typeof this.posInput === 'string') ? this.posInput : ''
      const val = raw.slice(0,2)
      this.posMenuOpen = false
      this.posTooLong = false
      // Do not coerce empty to '?'; keep it empty and rely on placeholder/UI to show '?'
      this.$emit('set-player-position', val)
    },
    onDocClick(e){
      try {
        const roleEl = this.$refs.roleWrap
        const posEl = this.$refs.posWrap
        const colorEl = this.$refs.colorWrap
        const target = e && (e.target || e.srcElement)
        if (this.roleMenuOpen) {
          const insideRole = roleEl && roleEl.contains && target && roleEl.contains(target)
          if (!insideRole) this.roleMenuOpen = false
        }
        if (this.posMenuOpen) {
          const insidePos = posEl && posEl.contains && target && posEl.contains(target)
          if (!insidePos) this.posMenuOpen = false
        }
        if (this.colorMenuOpen) {
          const insideColor = colorEl && colorEl.contains && target && colorEl.contains(target)
          if (!insideColor) this.colorMenuOpen = false
        }
      } catch(_) {}
    }
  },
  mounted(){
    try { document.addEventListener('mousedown', this.onDocClick, true) } catch(_) {}
  },
  beforeUnmount(){
    try { document.removeEventListener('mousedown', this.onDocClick, true) } catch(_) {}
  },
  watch: {
    selectedInfo: {
      handler(newVal, oldVal){
        // Compute a stable key for the selected target (type + id/index)
        const key = newVal ? (newVal.type + ':' + (newVal.type === 'player' ? newVal.id : (newVal.index != null ? newVal.index : ''))) : ''
        const prevKey = this.lastSelKey || ''
        // Close menus only when the selected target actually changed
        if (key !== prevKey) {
          this.roleMenuOpen = false
          this.posMenuOpen = false
        }
        // Keep posInput in sync with current value (preserve case) and reset error state
        this.posInput = (newVal && newVal.pos != null) ? String(newVal.pos) : ''
        this.posTooLong = false
        // Sync coordinates inputs from selected info (rounded to 2 decimals)
        const cx = (newVal && newVal.coordinates && typeof newVal.coordinates.x === 'number') ? newVal.coordinates.x : 0
        const cy = (newVal && newVal.coordinates && typeof newVal.coordinates.y === 'number') ? newVal.coordinates.y : 0
        this.coordsX = (Math.round(cx * 100) / 100).toFixed(2)
        this.coordsY = (Math.round(cy * 100) / 100).toFixed(2)
        this.lastValidCoords = { x: Number(this.coordsX), y: Number(this.coordsY) }
        this.lastSelKey = key
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.tool-btn {
  @apply text-xs px-2 py-1.5 border rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600;
  cursor: all-scroll;
}
</style>
