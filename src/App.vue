<template>
  <div class="flex h-screen bg-gray-50">
    <NotificationBar />
    <Sidebar />

    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import NotificationBar from './components/NotificationBar.vue'

export default {
  name: 'App',
  components: { Sidebar, NotificationBar }
}
</script>