<template>
  <section :class="['glass-card rounded-2xl shadow-glass transition-modern hover:shadow-modern', customClass]">
    <slot />
  </section>
</template>

<script>
export default {
  name: 'PageSection',
  props: {
    customClass: {
      type: String,
      default: ''
    }
  }
}
</script>
