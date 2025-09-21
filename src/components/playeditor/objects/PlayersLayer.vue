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
      <!-- Circle around label when role is 'ball' -->
      <circle v-if="(p.role || 'offense')==='ball'" :cx="0" :cy="0" r="20.5" fill="none" :stroke="p.color || '#111'" stroke-width="2.5" pointer-events="none" />
      <!-- Defense: show X with small label at bottom-right -->
      <template v-if="(p.role || 'offense')==='defense'">
        <text text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="0.05em" :dx="-6" :fill="p.color || '#111'" style="font-weight: 700; font-size: 28px; font-family: ui-sans-serif, system-ui, -apple-system; user-select: none; -webkit-user-select: none; -ms-user-select: none; pointer-events: none;">X</text>
        <text :x="5" :y="10" text-anchor="start" dominant-baseline="alphabetic" :fill="p.color || '#111'"
              :style="{
                fontWeight: 700,
                fontSize: ((((p.pos != null && p.pos !== '') ? String(p.pos) : '?').slice(0,2).length >= 2) ? '10px' : '12px'),
                fontFamily: 'ui-sans-serif, system-ui, -apple-system',
                userSelect: 'none'
              }"
        >{{ ((p.pos != null && p.pos !== '') ? String(p.pos) : '?').slice(0,2) }}</text>
      </template>
      <template v-else>
        <!-- Offense and Ball: big label in the center -->
        <text text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" dy="0.05em" :fill="p.color || '#111'"
              :style="{
                fontWeight: 700,
                fontSize: ((((p.pos != null && p.pos !== '') ? String(p.pos) : '?').slice(0,2).length >= 2) ? '22px' : '28px'),
                fontFamily: 'ui-sans-serif, system-ui, -apple-system',
                userSelect: 'none'
              }"
        >{{ ((p.pos != null && p.pos !== '') ? String(p.pos) : '?').slice(0,2) }}</text>
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
