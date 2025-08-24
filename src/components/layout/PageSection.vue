<template>
  <section :class="['rounded-2xl', customClass]">
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
