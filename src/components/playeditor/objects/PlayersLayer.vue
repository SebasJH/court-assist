<template>
  <g>
    <g v-for="p in players" :key="'p'+p.id" class="pe-player" :transform="'translate(' + (p.x*width) + ',' + (p.y*height) + ')'">
      <!-- Invisible hit area to keep the same interaction size -->
      <rect x="-22" y="-22" width="44" height="44" fill="transparent" pointer-events="all" />
      <!-- Selected background highlight (slightly translucent white) -->
      <rect v-if="selectedId === p.id" x="-22" y="-22" width="44" height="44" rx="4" ry="4" fill="rgba(255,255,255,0.35)" pointer-events="none" />
      <!-- Selection indicator: animated dashed rectangle (not round) -->
      <rect v-if="selectedId === p.id" x="-22" y="-22" width="44" height="44" rx="4" ry="4" fill="none" stroke="#000" stroke-width="1.5" class="marching-ants" pointer-events="none" />
      <!-- Player rendering by role -->
      <!-- Circle around number when role is 'ball' -->
      <circle v-if="(p.role || 'offense')==='ball'" :cx="0" :cy="0" r="20.5" fill="none" stroke="#111" stroke-width="2.5" pointer-events="none" />
      <!-- Defense: show X with small number at bottom-right -->
      <template v-if="(p.role || 'offense')==='defense'">
        <text text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="0.05em" fill="#111" style="font: bold 28px ui-sans-serif, system-ui, -apple-system; user-select: none; -webkit-user-select: none; -ms-user-select: none; pointer-events: none;">X</text>
        <text :x="10" :y="10" text-anchor="start" dominant-baseline="alphabetic" fill="#111" style="font: bold 12px ui-sans-serif, system-ui, -apple-system; user-select: none; -webkit-user-select: none; -ms-user-select: none; pointer-events: none;">{{ p.number || '?' }}</text>
      </template>
      <template v-else>
        <!-- Aanval and Bal: big number in the center -->
        <text text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="0.05em" fill="#111" style="font: bold 28px ui-sans-serif, system-ui, -apple-system; user-select: none; -webkit-user-select: none; -ms-user-select: none; pointer-events: none;">{{ p.number || '?' }}</text>
      </template>
    </g>
  </g>
</template>

<script>
export default {
  name: 'PlayersLayer',
  props: {
    players: { type: Array, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    selectedId: { type: [Number, String, null], default: null }
  }
}
</script>

<style scoped>
@keyframes ants {
  to { stroke-dashoffset: -7; }
}
.marching-ants {
  stroke-dasharray: 4 3;
  animation: ants 2.6s linear infinite;
}
</style>
