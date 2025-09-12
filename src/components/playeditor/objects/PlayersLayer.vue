<template>
  <g>
    <g v-for="p in players" :key="'p'+p.id" :transform="'translate(' + (p.x*width) + ',' + (p.y*height) + ')'">
      <circle :cx="0" :cy="0" r="18" :fill="p.color || '#2563eb'" />
      <text text-anchor="middle" dominant-baseline="middle" fill="#fff" style="font: bold 14px ui-sans-serif, system-ui, -apple-system;">{{ p.number || '?' }}</text>
    </g>
  </g>
</template>

<script>
export default {
  name: 'PlayersLayer',
  props: {
    players: { type: Array, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  }
}
</script>
