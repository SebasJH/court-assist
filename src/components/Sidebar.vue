<template>
  <aside :class="['bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out', collapsed ? 'w-20' : 'w-64']">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <!-- Title fades/width-transitions for smoothness -->
        <div
          class="text-xl font-bold text-blue-600 transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden whitespace-nowrap"
          :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'"
          aria-hidden="true"
        >
          COURT ASSIST
        </div>
        <button
          class="ml-auto rounded-md p-2 hover:bg-gray-100 text-gray-600 transition-colors duration-200"
          :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggleSidebar"
        >
          <ArrowRightToLine v-if="collapsed" :class="iconSizeClass" />
          <ArrowLeftToLine v-else :class="iconSizeClass" />
        </button>
      </div>
    </div>

    <!-- Navigatie -->
    <nav class="flex-1 flex-col p-4">
      <router-link
          to="/oefeningen"
          class="nav-link items-center transition-all duration-300 ease-in-out"
          :class="[
            ($route.path.startsWith('/oefeningen') || $route.path.startsWith('/oefening')) ? 'active' : '',
            collapsed ? 'justify-center px-0 py-3 gap-0' : 'gap-2 px-4 py-3'
          ]"
      >
        <TrafficCone :class="iconSizeClass" />
        <span :class="textClass">Oefeningen</span>
      </router-link>
      <router-link
          to="/trainingen"
          class="nav-link items-center transition-all duration-300 ease-in-out"
          :class="[
            $route.path.startsWith('/trainingen') ? 'active' : '',
            collapsed ? 'justify-center px-0 py-3 gap-0' : 'gap-2 px-4 py-3'
          ]"
      >
        <Dumbbell :class="iconSizeClass" />
        <span :class="textClass">Trainingen</span>
      </router-link>
      <a class="nav-link items-center transition-all duration-300 ease-in-out" :class="collapsed ? 'justify-center px-0 py-3 gap-0' : 'gap-2 px-4 py-3'">
        <ClipboardList :class="iconSizeClass" />
        <span :class="textClass">Plays</span>
      </a>
      <a class="nav-link items-center transition-all duration-300 ease-in-out" :class="collapsed ? 'justify-center px-0 py-3 gap-0' : 'gap-2 px-4 py-3'">
        <CalendarDays :class="iconSizeClass" />
        <span :class="textClass">Wedstrijden</span>
      </a>
      <a class="nav-link items-center transition-all duration-300 ease-in-out" :class="collapsed ? 'justify-center px-0 py-3 gap-0' : 'gap-2 px-4 py-3'">
        <Shirt :class="iconSizeClass" />
        <span :class="textClass">Teams</span>
      </a>
      <a class="nav-link items-center transition-all duration-300 ease-in-out" :class="collapsed ? 'justify-center px-0 py-3 gap-0' : 'gap-2 px-4 py-3'">
        <Repeat2 :class="iconSizeClass" />
        <span :class="textClass">Rotatieplanner</span>
      </a>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200">
      <button v-if="!collapsed" class="w-full mb-3 btn-secondary text-sm">Switch sport</button>

      <!-- Profile -->
      <div class="flex items-center justify-center" :class="collapsed ? '' : 'gap-3'">
        <div class="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-medium">
          SH
        </div>
        <div
          class="text-sm font-medium text-gray-700 transition-[opacity,max-width] duration-300 ease-in-out overflow-hidden whitespace-nowrap"
          :class="collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[160px]'"
        >
          Sebas Hartman
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      collapsed: false,
    }
  },
  computed: {
    iconSizeClass() {
      // Keep icon size constant to avoid layout shift during sidebar toggle
      return 'w-5 h-5'
    },
    textClass() {
      // Smoothly hide/show label text with uniform width to keep timing consistent across items
      return [
        'transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap inline-block',
        this.collapsed ? 'opacity-0 w-0 scale-95' : 'opacity-100 w-[160px] scale-100'
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style scoped>
/* Extra optional smoothing for nav link height to avoid jump */
.nav-link { height: 44px; }
</style>
