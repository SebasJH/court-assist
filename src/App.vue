<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div class="p-6 border-b border-gray-200">
        <div class="text-xl font-bold text-blue-600">COURT ASSIST</div>
      </div>
      
      <nav class="flex-1 flex-col p-4">
        <router-link 
          to="/oefeningen" 
          class="nav-link" 
          :class="$route.path.startsWith('/oefeningen') ? 'active' : ''"
        >
          Oefeningen
        </router-link>
        <router-link 
          to="/trainingen" 
          class="nav-link" 
          :class="$route.path.startsWith('/trainingen') ? 'active' : ''"
        >
          Trainingen
        </router-link>
        <a class="nav-link">Plays</a>
        <a class="nav-link">Rotatieplanner</a>
      </nav>
      
      <div class="p-4 border-t border-gray-200">
        <button class="w-full mb-3 btn-secondary text-sm">Switch sport</button>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-medium">
            SH
          </div>
          <div class="text-sm font-medium text-gray-700">Sebas Hartman</div>
        </div>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style scoped>
.nav-link {
  @apply block w-full px-4 py-3 text-gray-600 rounded-lg mb-2 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800;
}

.nav-link.active {
  @apply bg-blue-50 text-blue-700 font-medium;
}
</style>