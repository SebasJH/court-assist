<template>
  <div class="flex h-screen relative overflow-hidden">
    <!-- Modern animated background -->
<!--    <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-sky-50 to-rose-50 dark:hidden">-->
<!--      &lt;!&ndash; Animated background elements &ndash;&gt;-->
<!--      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>-->
<!--      <div class="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>-->
<!--      <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>-->
<!--    </div>-->

    <NotificationBar />

    <!-- Desktop sidebar -->
    <div class="hidden xl:block relative z-10">
      <Sidebar />
    </div>

    <main class="flex-1 overflow-auto relative z-10">
      <router-view />
    </main>

    <!-- Mobile sidebar drawer -->
    <MobileSidebarDrawer
      :open="mobileSidebarOpen"
      @close="mobileSidebarOpen = false"
    >
      <Sidebar />
    </MobileSidebarDrawer>
  </div>
</template>

<script>
import { Sidebar, NotificationBar, MobileSidebarDrawer } from './components'

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