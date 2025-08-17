<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar />

    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: { Sidebar }
}
</script>