<template>
  <g>
    <g v-for="p in players" :key="'p'+p.id" class="pe-player" :transform="'translate(' + (p.x*width) + ',' + (p.y*height) + ')'">
      <!-- Invisible hit area to keep the same interaction size -->
      <circle :cx="0" :cy="0" r="18" fill="transparent" />
      <!-- Selection indicator ring -->
      <circle v-if="selectedId === p.id" :cx="0" :cy="0" r="20" fill="none" stroke="#0a84ff" stroke-width="3" />
      <!-- Player number -->
      <text text-anchor="middle" dominant-baseline="middle" fill="#111" style="font: bold 28px ui-sans-serif, system-ui, -apple-system; user-select: none; -webkit-user-select: none; -ms-user-select: none; pointer-events: none;">{{ p.number || '?' }}</text>
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
