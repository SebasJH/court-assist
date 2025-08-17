<template>
  <aside class="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="text-xl font-bold text-blue-600">COURT ASSIST</div>
    </div>

    <!-- Navigatie -->
    <nav class="flex-1 flex-col p-4">
      <router-link
          to="/oefeningen"
          class="nav-link items-center gap-1"
          :class="$route.path.startsWith('/oefeningen') ? 'active' : ''"
      >
        <TrafficCone />
        Oefeningen
      </router-link>
      <router-link
          to="/trainingen"
          class="nav-link items-center gap-1"
          :class="$route.path.startsWith('/trainingen') ? 'active' : ''"
      >
        <Dumbbell />
        Trainingen
      </router-link>
      <a class="nav-link items-center gap-1">
        <ClipboardList />
        Plays
      </a>
      <a class="nav-link  items-center gap-1">
        <Repeat2 />
        Rotatieplanner
      </a>
    </nav>

    <!-- Footer -->
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
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
/* Hier kun je eventueel extra styling voor de sidebar zetten */
</style>
