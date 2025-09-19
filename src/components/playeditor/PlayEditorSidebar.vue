<template>
  <div class="relative z-[200] w-48 shrink-0 bg-white dark:bg-gray-800 border-l dark:border-gray-600 p-2 space-y-2 select-none">
    <!-- Selection inspector -->
    <div v-if="selectedInfo" class="mb-4 space-y-2">
      <!-- Only the selected object name -->
      <div class="text-xs text-gray-800 dark:text-gray-100 font-medium">{{ selectedInfo.name }}</div>
      <!-- Player role selection -->
      <div v-if="selectedInfo.type==='player'" class="text-xs">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-gray-500">Rol:</span>
          <div class="relative w-full">
            <button type="button"
                    class="menu dropdown-button h-8 px-2 rounded-md flex items-center justify-between w-full border border-gray-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                    @click.stop="roleMenuOpen = !roleMenuOpen">
              <span class="text-xs">{{ roleLabel }}</span>
              <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div v-if="roleMenuOpen"
                 :class="['dropdown-menu absolute top-full mt-2 w-40 border whitespace-nowrap rounded-md shadow-lg flex flex-col z-[3000]', 'right-0']">
              <button class="dropdown-item" @click.stop="onSelectRole('ball')">Bal</button>
              <button class="dropdown-item" @click.stop="onSelectRole('offense')">Aanval</button>
              <button class="dropdown-item" @click.stop="onSelectRole('defense')">Verdediging</button>
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
        <UiButton color="danger" size="sm" :customClass="'w-full h-8 text-xs'" @click="$emit('delete-selected')">Object verwijderen</UiButton>
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
    <div class="grid grid-cols-5 gap-1">
      <button v-for="n in 5" :key="'p'+n" type="button" class="tool-btn !px-0" @click="$emit('quick-add-player', n)" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','player'+n, ev)">{{ n }}</button>
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
  emits: ['set-arrow-shape','delete-selected','set-tool','tool-drag-start','quick-add-player','set-player-role'],
  data(){
    return { roleMenuOpen: false }
  },
  computed: {
    roleLabel(){
      const r = (this.selectedInfo && (this.selectedInfo.role || 'offense')) || 'offense'
      const code = (r === 'bal' ? 'ball' : r === 'aanval' ? 'offense' : r === 'verdediging' ? 'defense' : r)
      if (code === 'ball') return 'Bal'
      if (code === 'defense') return 'Verdediging'
      return 'Aanval'
    }
  },
  methods: {
    onSelectRole(v){
      this.roleMenuOpen = false
      this.$emit('set-player-role', v)
    }
  },
  watch: {
    selectedInfo(){ this.roleMenuOpen = false }
  }
}
</script>

<style scoped>
.tool-btn {
  @apply text-xs px-2 py-1.5 border rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600;
  cursor: all-scroll;
}
</style>
