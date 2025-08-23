<template>
  <router-link
    :to="to"
    class="nav-link items-center transition-all duration-300 ease-in-out"
    :class="[
      isActive ? 'active' : '',
      collapsed ? 'justify-center px-0 py-3 gap-0' : 'gap-2 px-4 py-3'
    ]"
    @click="$emit('click')"
  >
    <TrafficCone v-if="icon === 'TrafficCone'" class="w-5 h-5" />
    <Dumbbell v-else-if="icon === 'Dumbbell'" class="w-5 h-5" />
    <ClipboardList v-else-if="icon === 'ClipboardList'" class="w-5 h-5" />
    <CalendarDays v-else-if="icon === 'CalendarDays'" class="w-5 h-5" />
    <Shirt v-else-if="icon === 'Shirt'" class="w-5 h-5" />
    <Repeat2 v-else-if="icon === 'Repeat2'" class="w-5 h-5" />
    <span :class="textClass">{{ label }}</span>
  </router-link>
</template>

<script>
export default {
  name: 'NavigationItem',
  props: {
    to: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    textClass() {
      return [
        'transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap inline-block',
        this.collapsed ? 'opacity-0 w-0 scale-95' : 'opacity-100 w-[160px] scale-100'
      ]
    }
  }
}
</script>

<style scoped>
.nav-link { height: 44px; }
</style>
