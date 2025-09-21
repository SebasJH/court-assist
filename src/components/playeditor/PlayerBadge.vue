<template>
  <button
    type="button"
    :class="buttonClass"
    :draggable="draggable"
    @click="$emit('click', $event)"
    @dragstart="$emit('dragstart', $event)"
    :aria-label="ariaLabel"
  >
    <svg :width="size" :height="size" :viewBox="svgViewBox" aria-hidden="true">
      <template v-if="role === 'ball'">
        <g fill="none" stroke="#454F5B">
          <circle :r="circleRadius" stroke-width="2" />
        </g>
        <text
          text-anchor="middle"
          dominant-baseline="middle"
          alignment-baseline="middle"
          dy="0.05em"
          fill="#111"
          :style="{ font: fontSpec, userSelect: 'none' }"
        >{{ displayLabel }}</text>
      </template>
      <template v-else-if="role === 'defense'">
        <!-- Center the combined X + small label as a single text element -->
        <text
          text-anchor="middle"
          dominant-baseline="middle"
          alignment-baseline="middle"
          dy="0.05em"
          fill="#111"
        >
          <tspan :style="{ font: defenseXFontSpec, userSelect: 'none' }">X</tspan>
          <!-- small label slightly to the bottom-right of X, but keep the whole group centered -->
          <tspan :style="{ font: defenseSmallFontSpec, userSelect: 'none' }" dx="1" dy="1.5">{{ displayLabel }}</tspan>
        </text>
      </template>
      <template v-else>
        <text
          text-anchor="middle"
          dominant-baseline="middle"
          alignment-baseline="middle"
          dy="0.05em"
          fill="#111"
          :style="{ font: fontSpec, userSelect: 'none' }"
        >{{ displayLabel }}</text>
      </template>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'PlayerBadge',
  props: {
    role: { type: String, default: 'offense' }, // 'ball' | 'offense' | 'defense'
    label: { type: [String, Number], default: '?' },
    size: { type: Number, default: 30 },
    draggable: { type: Boolean, default: true },
  },
  emits: ['click', 'dragstart'],
  computed: {
    displayLabel() {
      // For defense, we render X separately; here we only return the label itself
      return String(this.label ?? '?');
    },
    // Use consistent viewBox; for circle, center at 0,0 with radius ~ (size/2 - 2)
    svgViewBox() {
      // Use the same viewBox for all roles to keep font scale identical
      return '-15 -15 30 30';
    },
    circleRadius() {
      // close to original look
      return 13.5;
    },
    fontSpec() {
      // Consistent typography across roles and labels (non-defense main label)
      const len = this.displayLabel.length;
      const fontSize = len >= 2 ? 12 : 14; // unify across roles
      return `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system`;
    },
    defenseXFontSpec() {
      // Large X centered
      return `600 14px ui-sans-serif, system-ui, -apple-system`;
    },
    defenseSmallFontSpec() {
      // Smaller subscript-like label for defense number/text
      const len = this.displayLabel.length;
      const fontSize = len >= 2 ? 8 : 9;
      return `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system`;
    },
    defenseSmallX() {
      // Position the small label to the bottom-right area within viewBox -15..15
      // Tuned visually to sit near the bottom-right of the X
      return 6.5;
    },
    defenseSmallY() {
      // SVG y increases downward; put it slightly below center
      return 7.5;
    },
    buttonClass() {
      const cursor = this.draggable ? 'cursor-move' : 'cursor-pointer';
      const base = `inline-flex items-center justify-center w-[30px] h-[30px] select-none ${cursor}`;
      if (this.role === 'ball') {
        return base + ' rounded';
      }
      // Offense/Defense: rounded rectangle (4px), subtle border and white background (exact rgb(196,205,213))
      return base + ' rounded border border-[rgb(196,205,213)] bg-white dark:border-gray-500 dark:bg-gray-600/40';
    },
    ariaLabel() {
      const roleLabel = this.role === 'ball' ? 'bal' : this.role === 'offense' ? 'aanval' : 'verdediging';
      return `Speler ${roleLabel} ${this.label}`;
    }
  }
}
</script>

<style scoped>
/* No additional styles; relying on Tailwind classes for consistency */
</style>
