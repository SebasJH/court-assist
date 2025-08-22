<template>
  <div class="flex h-screen bg-gray-50 relative">
    <NotificationBar />

    <!-- Desktop sidebar -->
    <div class="hidden md:block">
      <Sidebar />
    </div>


    <main class="flex-1 overflow-auto">
      <router-view />
    </main>

    <!-- Mobile sidebar drawer -->
    <Modal
      v-if="mobileSidebarOpen"
      @close="mobileSidebarOpen = false"
      :drawer="true"
      side="left"
      drawerWidthClass="max-w-xs"
      contentPaddingClass="p-0"
    >
      <Sidebar />
    </Modal>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import NotificationBar from './components/NotificationBar.vue'
import Modal from './components/Modal.vue'

export default {
  name: 'App',
  components: { Sidebar, NotificationBar, Modal },
  data() {
    return {
      mobileSidebarOpen: false
    }
  },
  methods: {
    onOpenMobileSidebar() {
      this.mobileSidebarOpen = true
    }
  },
  mounted() {
    window.addEventListener('open-mobile-sidebar', this.onOpenMobileSidebar)
  },
  unmounted() {
    window.removeEventListener('open-mobile-sidebar', this.onOpenMobileSidebar)
  }
}
</script>