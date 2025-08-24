<template>
  <aside :class="['bg-white dark:bg-gray-700 border-r border-white/20 dark:border-gray-700/20 flex flex-col h-full xl:h-screen transition-all duration-300 ease-in-out', collapsed ? 'w-full xl:w-20' : 'w-full xl:w-64']">
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
      :user-initials="user.initials"
      :user-name="user.name"
      @switch-sport="onSwitchSport"
      @open-settings="openSettings"
    />

    <!-- Settings Modal -->
    <modal :open="showSettings" @close="closeSettings" contentPaddingClass="p-0" :hideDefaultClose="true">
      <Settings @close="closeSettings" @save="onSettingsSaved" />
    </modal>
  </aside>
</template>

<script>
import SidebarHeader from './navigation/SidebarHeader.vue'
import SidebarFooter from './navigation/SidebarFooter.vue'
import NavigationItem from './navigation/NavigationItem.vue'
import NavigationLink from './navigation/NavigationLink.vue'
import Modal from './Modal.vue'
import Settings from './Settings.vue'
import { getUser } from '../user'

export default {
  name: 'Sidebar',
  components: { 
    SidebarHeader, 
    SidebarFooter, 
    NavigationItem, 
    NavigationLink,
    Modal,
    Settings
  },
  data() {
    const user = getUser()
    return {
      collapsed: false,
      showSettings: false,
      user
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
    },
    openSettings() {
      // Refresh current user display; Settings handles its own state
      this.user = getUser()
      this.showSettings = true
    },
    closeSettings() {
      this.showSettings = false
    },
    onSettingsSaved() {
      // Refresh sidebar user display after saving in Settings component
      this.user = getUser()
    }
  }
}
</script>

<style scoped>
</style>
