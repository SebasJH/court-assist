<template>
  <div class="relative z-[200] w-64 shrink-0 bg-white dark:bg-gray-800 border-l dark:border-gray-600 p-4 space-y-3 select-none">
    <!-- Selection inspector -->
    <div v-if="selectedInfo" class="mb-4 space-y-2">
      <!-- Only the selected object name -->
      <div class="text-xs text-gray-800 dark:text-gray-100 font-medium">{{ selectedInfo.name }}</div>
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
                <span class="inline-flex items-center justify-center w-8 h-8 rounded">
                  <svg width="32" height="32" viewBox="-22 -22 44 44" aria-hidden="true">
                    <g fill="none" stroke="#111">
                      <circle r="20.5" stroke-width="2.5" />
                    </g>
                    <text text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="0.05em" fill="#111"
                          :style="{ font: ((posLabel && posLabel.length >= 2) ? '700 20px ' : '700 24px ') + 'ui-sans-serif, system-ui, -apple-system', userSelect:'none' }">
                      {{ posLabel }}
                    </text>
                  </svg>
                </span>
                Bal
              </button>
              <button class="dropdown-item !pl-3" :class="isRoleActive('offense') ? 'bg-blue-50 dark:bg-gray-600/50' : ''" @click.stop="onSelectRole('offense')">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-200 bg-white dark:border-gray-500 dark:bg-gray-600/40">
                  <svg width="32" height="32" viewBox="-22 -22 44 44" aria-hidden="true">
                    <text text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="0.05em" fill="#111"
                          :style="{ font: ((posLabel && posLabel.length >= 2) ? '700 20px ' : '700 24px ') + 'ui-sans-serif, system-ui, -apple-system', userSelect:'none' }">
                      {{ posLabel }}
                    </text>
                  </svg>
                </span>
                Aanval
              </button>
              <button class="dropdown-item !pl-3" :class="isRoleActive('defense') ? 'bg-blue-50 dark:bg-gray-600/50' : ''" @click.stop="onSelectRole('defense')">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-200 bg-white dark:border-gray-500 dark:bg-gray-600/40">
                  <svg width="32" height="32" viewBox="-22 -22 44 44" aria-hidden="true">
                    <text text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="0.05em" :dx="-6" fill="#111" style="font: 700 22px ui-sans-serif, system-ui, -apple-system; user-select: none;">X</text>
                    <text :x="5" :y="10" text-anchor="start" dominant-baseline="alphabetic" fill="#111"
                          :style="{ font: ((posLabel && posLabel.length >= 2) ? '700 12px ' : '700 13px ') + 'ui-sans-serif, system-ui, -apple-system', userSelect:'none' }">
                      {{ posLabel }}
                    </text>
                  </svg>
                </span>
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
                       maxlength="2"
                       class="w-full border rounded px-2 h-8 text-xs bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                       :placeholder="posLabel" />
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
        <UiButton color="danger" size="sm" :customClass="'w-full h-8 text-xs'" @click="$emit('delete-selected')">{{ deleteLabel }}</UiButton>
      </div>
    </div>
    <div class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Acties toevoegen</div>
    <div class="grid grid-cols-2 gap-2">
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','dribble')" @click="$emit('set-tool','dribble')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','dribble', ev)">Dribble</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','pass')" @click="$emit('set-tool','pass')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','pass', ev)">Pass</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','cut')" @click="$emit('set-tool','cut')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','cut', ev)">Cut</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','screen')" @click="$emit('set-tool','screen')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','screen', ev)">Screen</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','shoot')" @click="$emit('set-tool','shoot')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','shoot', ev)">Shoot</button>
      <button type="button" class="tool-btn" @mousedown.prevent.stop="$emit('set-tool','handoff')" @click="$emit('set-tool','handoff')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','handoff', ev)">Handoff</button>
    </div>
    <div class="pt-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Spelers toevoegen</div>
    <div class="grid grid-cols-6 gap-1">
      <button v-for="n in 5" :key="'p'+n" type="button" class="tool-btn !px-0" @click="$emit('quick-add-player', n)" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','player'+n, ev)">{{ n }}</button>
      <button type="button" class="tool-btn !px-0" @click="$emit('quick-add-player', '?')">?</button>
    </div>
  </div>
</template>

<script>
import UiButton from '../ui/Button.vue'
export default {
  name: 'PlayEditorSidebar',
  components: { UiButton },
  props: {
    selectedInfo: { type: Object, default: null },
    arrowShape: { type: String, default: 'straight' },
    tool: { type: String, default: '' }
  },
  emits: ['set-arrow-shape','delete-selected','set-tool','tool-drag-start','quick-add-player','set-player-role','set-player-position'],
  data(){
    return { roleMenuOpen: false, posMenuOpen: false, posInput: '' }
  },
  computed: {
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
    toggleRoleMenu(){
      this.roleMenuOpen = !this.roleMenuOpen
      if (this.roleMenuOpen) this.posMenuOpen = false
    },
    onSelectRole(v){
      this.roleMenuOpen = false
      this.$emit('set-player-role', v)
    },
    togglePosMenu(){
      this.posMenuOpen = !this.posMenuOpen
      if (this.posMenuOpen) {
        this.roleMenuOpen = false
        this.posInput = this.posLabel
      }
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
      this.posInput = this.posInput.toUpperCase().slice(0,2)
      // Live update position while typing (no need to press Enter)
      this.$emit('set-player-position', this.posInput)
    },
    onApplyCustomPos(){
      const val = (this.posInput || '').toUpperCase().slice(0,2)
      this.posMenuOpen = false
      if (val) this.$emit('set-player-position', val)
    },
    onDocClick(e){
      try {
        const roleEl = this.$refs.roleWrap
        const posEl = this.$refs.posWrap
        const target = e && (e.target || e.srcElement)
        if (this.roleMenuOpen) {
          const insideRole = roleEl && roleEl.contains && target && roleEl.contains(target)
          if (!insideRole) this.roleMenuOpen = false
        }
        if (this.posMenuOpen) {
          const insidePos = posEl && posEl.contains && target && posEl.contains(target)
          if (!insidePos) this.posMenuOpen = false
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
        // Keep posInput in sync with current value
        this.posInput = (newVal && newVal.pos) ? String(newVal.pos).slice(0,2) : ''
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
