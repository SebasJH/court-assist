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
      @switch-sport="onSwitchSport"
      @open-settings="openSettings"
    />

    <!-- Settings Modal -->
    <modal :open="showSettings" @close="closeSettings" contentPaddingClass="p-0" :hideDefaultClose="true">
      <div class="sticky top-0 z-[1] bg-white dark:bg-gray-700 backdrop-blur-sm px-5 sm:px-10 pt-5 pb-4 border-b border-gray-200/70 dark:border-gray-600">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Instellingen</h3>
          <button
              type="button"
              class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-gray-600/40 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-label="Sluiten"
              @click="closeSettings"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div class="px-5 sm:px-10 py-5">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Thema</label>
          <div class="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 h-10">
            <button type="button"
                    class="px-3 h-10 text-sm font-medium focus:outline-none"
                    :class="theme === 'light' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200'"
                    @click="selectTheme('light')">Light</button>
            <button type="button"
                    class="px-3 h-10 text-sm font-medium border-l border-gray-300 dark:border-gray-600 focus:outline-none"
                    :class="theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200'"
                    @click="selectTheme('dark')">Dark</button>
          </div>
        </div>
      </div>
    </modal>
  </aside>
</template>

<script>
import SidebarHeader from './navigation/SidebarHeader.vue'
import SidebarFooter from './navigation/SidebarFooter.vue'
import NavigationItem from './navigation/NavigationItem.vue'
import NavigationLink from './navigation/NavigationLink.vue'
import Modal from './Modal.vue'
import { getTheme, setTheme } from '../theme'

export default {
  name: 'Sidebar',
  components: { 
    SidebarHeader, 
    SidebarFooter, 
    NavigationItem, 
    NavigationLink,
    Modal
  },
  data() {
    return {
      collapsed: false,
      showSettings: false,
      theme: getTheme()
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
      this.showSettings = true
    },
    closeSettings() {
      this.showSettings = false
    },
    selectTheme(mode) {
      this.theme = mode === 'dark' ? 'dark' : 'light'
      setTheme(this.theme)
    }
  }
}
</script>

<style scoped>
</style>
