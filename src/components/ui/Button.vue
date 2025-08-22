<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    :aria-label="computedAriaLabel"
    @click="onClick"
  >
    <!-- Left icon -->
    <component
      v-if="icon && iconPosition === 'left'"
      :is="icon"
      :class="computedIconClass"
      aria-hidden="true"
    />

    <!-- Label -->
    <span v-if="$slots.default">
      <slot />
    </span>

    <!-- Right icon -->
    <component
      v-if="icon && iconPosition === 'right'"
      :is="icon"
      :class="computedIconClass"
      aria-hidden="true"
    />
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    color: { type: String, default: 'primary' }, // 'primary' | 'secondary' | 'accent' | 'danger'
    outline: { type: Boolean, default: false }, // outline style: border + text color, no bg
    icon: { type: String, default: '' }, // name of globally-registered icon component
    iconPosition: { type: String, default: 'left' }, // 'left' | 'right'
    iconClass: { type: String, default: 'w-4 h-4' }, // tailwind classes for icon size
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['click'],
  computed: {
    colorClass() {
      const suffix = this.outline ? '-outline' : ''
      switch (this.color) {
        case 'secondary':
          return `btn-secondary${suffix}`
        case 'accent':
          return `btn-accent${suffix}`
        case 'danger':
          return `btn-danger${suffix}`
        case 'primary':
        default:
          return `btn-primary${suffix}`
      }
    },
    classes() {
      // Match legacy .btn-* look by default; only add flex/gap when an icon is present
      const withIcon = !!this.icon
      const iconOnly = withIcon && !this.$slots.default
      return [
        this.colorClass,
        withIcon ? 'inline-flex items-center gap-2' : '',
        iconOnly ? 'justify-center' : '',
        this.disabled ? 'opacity-60 cursor-not-allowed' : ''
      ]
    },
    computedIconClass() {
      return this.iconClass || 'w-4 h-4'
    },
    computedAriaLabel() {
      // If icon-only (no default slot), rely on a provided aria-label attr; otherwise omit
      return this.$slots.default ? null : (this.$attrs && this.$attrs['aria-label'] ? this.$attrs['aria-label'] : null)
    }
  },
  methods: {
    onClick(e) {
      if (this.disabled) return
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>
</style>
