<template>
  <aside :class="['glass-card border-r border-white/20 flex flex-col h-full xl:h-screen transition-all duration-300 ease-in-out', collapsed ? 'w-full xl:w-20' : 'w-full xl:w-64']">
    <!-- Header -->
    <SidebarHeader 
      :collapsed="collapsed" 
      @close-mobile="closeMobileSidebar"
      @toggle="toggleSidebar"
    />

    <!-- Navigatie -->
    <nav class="flex-1 flex-col p-4">
      <NavigationItem
        to="/oefeningen"
        icon="TrafficCone"
        label="Oefeningen"
        :is-active="$route.path.startsWith('/oefeningen') || $route.path.startsWith('/oefening')"
        :collapsed="collapsed"
        @click="onNavClick"
      />
      <NavigationItem
        to="/trainingen"
        icon="Dumbbell"
        label="Trainingen"
        :is-active="$route.path.startsWith('/trainingen')"
        :collapsed="collapsed"
        @click="onNavClick"
      />
      <NavigationLink
        icon="ClipboardList"
        label="Plays"
        :collapsed="collapsed"
        @click="onNavClick"
      />
      <NavigationLink
        icon="CalendarDays"
        label="Wedstrijden"
        :collapsed="collapsed"
        @click="onNavClick"
      />
      <NavigationLink
        icon="Shirt"
        label="Teams"
        :collapsed="collapsed"
        @click="onNavClick"
      />
      <NavigationLink
        icon="Repeat2"
        label="Rotatieplanner"
        :collapsed="collapsed"
        @click="onNavClick"
      />
    </nav>

    <!-- Footer -->
    <SidebarFooter 
      :collapsed="collapsed"
      @switch-sport="onSwitchSport"
    />
  </aside>
</template>

<script>
import SidebarHeader from './navigation/SidebarHeader.vue'
import SidebarFooter from './navigation/SidebarFooter.vue'
import NavigationItem from './navigation/NavigationItem.vue'
import NavigationLink from './navigation/NavigationLink.vue'

export default {
  name: 'Sidebar',
  components: { 
    SidebarHeader, 
    SidebarFooter, 
    NavigationItem, 
    NavigationLink 
  },
  data() {
    return {
      collapsed: false,
    }
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed
    },
    onNavClick() {
      // Close the mobile drawer when a navigation item is tapped
      window.dispatchEvent(new CustomEvent('close-mobile-sidebar'))
    },
    closeMobileSidebar() {
      // Explicit close button for mobile drawer
      window.dispatchEvent(new CustomEvent('close-mobile-sidebar'))
    },
    onSwitchSport() {
      // Handle sport switching
      console.log('Switch sport clicked')
    }
  }
}
</script>

<style scoped>
/* Extra optional smoothing for nav link height to avoid jump */
.nav-link { height: 44px; }
</style>
