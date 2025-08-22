<template>
  <div class="flex h-screen bg-gray-50 relative">
    <NotificationBar />

    <!-- Desktop sidebar -->
    <div class="hidden xl:block">
      <Sidebar />
    </div>


    <main class="flex-1 overflow-auto">
      <router-view />
    </main>

    <!-- Mobile sidebar drawer -->
    <MobileSidebarDrawer
      :open="mobileSidebarOpen"
      @close="mobileSidebarOpen = false"
      side="left"
      drawerWidthClass="max-w-xs"
      contentPaddingClass="p-0"
    >
      <Sidebar />
    </MobileSidebarDrawer>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import NotificationBar from './components/NotificationBar.vue'
import MobileSidebarDrawer from './components/MobileSidebarDrawer.vue'

export default {
  name: 'App',
  components: { Sidebar, NotificationBar, MobileSidebarDrawer },
  data() {
    return {
      mobileSidebarOpen: false
    }
  },
  methods: {
    onOpenMobileSidebar() {
      this.mobileSidebarOpen = true
    },
    onCloseMobileSidebar() {
      this.mobileSidebarOpen = false
    }
  },
  mounted() {
    window.addEventListener('open-mobile-sidebar', this.onOpenMobileSidebar)
    window.addEventListener('close-mobile-sidebar', this.onCloseMobileSidebar)
  },
  unmounted() {
    window.removeEventListener('open-mobile-sidebar', this.onOpenMobileSidebar)
    window.removeEventListener('close-mobile-sidebar', this.onCloseMobileSidebar)
  }
}
</script>