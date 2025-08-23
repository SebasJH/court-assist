<template>
  <section :class="['bg-white rounded-lg shadow-md p-6', customClass]">
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
