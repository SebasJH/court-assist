<template>
  <div class="relative z-[200] w-48 bg-white dark:bg-gray-800 border-l dark:border-gray-600 p-2 space-y-2 select-none">
    <!-- Selection inspector -->
    <div v-if="selectedInfo" class="mb-1">
      <div class="text-[11px] font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Geselecteerd</div>
      <div class="mt-1 text-xs text-gray-800 dark:text-gray-100 font-medium">{{ selectedInfo.name }}</div>
      <!-- Arrow shape options only when a line is selected -->
      <div v-if="selectedInfo.type==='line'" class="mt-2">
        <div class="text-[10px] text-gray-500">Arrow shape</div>
        <div class="mt-1 grid grid-cols-2 gap-1">
          <button type="button" class="tool-btn" :class="arrowShape==='straight' ? 'tool-active' : ''" @click="$emit('set-arrow-shape','straight')">Straight</button>
          <button type="button" class="tool-btn" :class="arrowShape==='curve' ? 'tool-active' : ''" @click="$emit('set-arrow-shape','curve')">Curve</button>
          <button type="button" class="tool-btn" :class="arrowShape==='zigzag' ? 'tool-active' : ''" @click="$emit('set-arrow-shape','zigzag')">Zig zag</button>
          <button type="button" class="tool-btn" :class="arrowShape==='curvedZigzag' ? 'tool-active' : ''" @click="$emit('set-arrow-shape','curvedZigzag')">Curved zig zag</button>
        </div>
      </div>
      <div class="mt-2">
        <button type="button" class="tool-btn w-full !text-red-600 dark:!text-red-400" @click="$emit('delete-selected')">Object verwijderen</button>
      </div>
    </div>
    <div class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Add actions</div>
    <div class="grid grid-cols-2 gap-2">
      <button type="button" class="tool-btn" :class="tool==='dribble' ? 'tool-active' : ''" @mousedown.prevent.stop="$emit('set-tool','dribble')" @click="$emit('set-tool','dribble')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','dribble', ev)">Dribble</button>
      <button type="button" class="tool-btn" :class="tool==='pass' ? 'tool-active' : ''" @mousedown.prevent.stop="$emit('set-tool','pass')" @click="$emit('set-tool','pass')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','pass', ev)">Pass</button>
      <button type="button" class="tool-btn" :class="tool==='cut' ? 'tool-active' : ''" @mousedown.prevent.stop="$emit('set-tool','cut')" @click="$emit('set-tool','cut')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','cut', ev)">Cut</button>
      <button type="button" class="tool-btn" :class="tool==='screen' ? 'tool-active' : ''" @mousedown.prevent.stop="$emit('set-tool','screen')" @click="$emit('set-tool','screen')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','screen', ev)">Screen</button>
      <button type="button" class="tool-btn" :class="tool==='shoot' ? 'tool-active' : ''" @mousedown.prevent.stop="$emit('set-tool','shoot')" @click="$emit('set-tool','shoot')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','shoot', ev)">Shoot</button>
      <button type="button" class="tool-btn" :class="tool==='handoff' ? 'tool-active' : ''" @mousedown.prevent.stop="$emit('set-tool','handoff')" @click="$emit('set-tool','handoff')" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','handoff', ev)">Handoff</button>
    </div>
    <div class="pt-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Add player</div>
    <div class="grid grid-cols-5 gap-1">
      <button v-for="n in 5" :key="'p'+n" type="button" class="tool-btn !px-0" :class="tool==='player'+n ? 'tool-active' : ''" @mousedown.prevent.stop="$emit('set-tool','player'+n)" @click="$emit('set-tool','player'+n)" draggable="true" @dragstart="(ev)=>$emit('tool-drag-start','player'+n, ev)">{{ n }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayEditorSidebar',
  props: {
    selectedInfo: { type: Object, default: null },
    arrowShape: { type: String, default: 'straight' },
    tool: { type: String, default: '' }
  },
  emits: ['set-arrow-shape','delete-selected','set-tool','tool-drag-start']
}
</script>

<style scoped>
.tool-btn{ @apply text-xs px-2 py-1.5 border rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600; }
.tool-active{ @apply bg-blue-500 text-white hover:bg-blue-600; }
</style>
