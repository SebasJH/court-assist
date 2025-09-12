<template>
  <div class="training-card-item" @click="goToDetail" role="link" :aria-label="`Open ${training.name}`" :class="zClass">
    <div class="flex items-start gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div v-if="training.theme" class="mb-1">
              <span class="training-theme">{{ training.theme }}</span>
            </div>
            <h3 class="font-semibold text-gray-800 dark:text-gray-50 truncate">{{ training.name }}</h3>
          </div>
          <span v-if="hasDate()" class="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">{{ dateLabel() }}</span>
        </div>
        <div class="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2" :title="training.description">{{ training.description }}</div>
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <span v-if="isNum(training.duration)" class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-650 dark:text-gray-200">⏱️ {{ formatDuration(training.duration) }}</span>
          <span v-if="isNum(training.participants)" class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-650 dark:text-gray-200">👥 {{ training.participants }}</span>
        </div>
      </div>

      <!-- Actions menu -->
      <div class="ml-2 relative" @click.stop @mouseenter="liftEnter" @mouseleave="liftLeave">
        <button
          ref="menuButtonRef"
          type="button"
          class="menu dropdown-button w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer"
          aria-haspopup="menu"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-label="Acties"
          @click="toggleMenu"
        >
          <Ellipsis />
        </button>

        <div v-if="menuOpen" ref="menuRef" class="dropdown-menu fixed w-56 whitespace-nowrap border rounded-md shadow-lg flex flex-col z-[4000]" :style="menuStyle">
          <button @click="onEdit" class="dropdown-item">
            <Pencil class="w-fit h-4" />
            Wijzigen
          </button>
          <button @click="onDuplicate" class="dropdown-item">
            <Copy class="w-fit h-4" />
            Dupliceren
          </button>
          <button @click="onToggleFav" class="dropdown-item">
            <Star class="w-fit h-4" :class="training && training.favorite ? 'text-yellow-500' : ''" :fill="training && training.favorite ? 'currentColor' : 'none'" :stroke="'currentColor'" />
            <span>{{ (training && training.favorite) ? 'Verwijder uit favorieten' : 'Markeer als favoriet' }}</span>
          </button>
          <button @click="onDelete" class="dropdown-item dropdown-delete">
            <Trash class="w-fit h-4" />
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '../../store'
import { computeFixedMenuPosition } from '../../utils/menuPosition'

function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default {
  name: 'TrainingCard',
  emits: ['request-delete'],
  props: {
    training: { type: Object, required: true }
  },
  setup(props, { emit }){
    const router = useRouter()
    const menuOpen = ref(false)
    const menuRef = ref(null)
    const menuButtonRef = ref(null)
    const menuStyle = ref({ left: '0px', top: '0px' })

    // Lift the card while hovering menu area so dropdown stacks above neighbors
    const hoverCount = ref(0)
    function liftEnter(){ hoverCount.value++ }
    function liftLeave(){ hoverCount.value = Math.max(0, hoverCount.value - 1) }
    const zClass = computed(() => (menuOpen.value ? 'z-[2000]' : (hoverCount.value > 0 ? 'z-[1000]' : '')))

    function goToDetail(){
      try { router.push('/training/' + slugify(props.training.name)) } catch(_) {}
    }

    function computeMenuPosition(){
      try {
        const btn = menuButtonRef.value
        const menu = menuRef.value
        const pos = computeFixedMenuPosition(btn, menu, { margin: 8 })
        menuStyle.value = pos
      } catch (_) {
        menuStyle.value = { left: '0px', top: '0px' }
      }
    }

    function toggleMenu(){
      const willOpen = !menuOpen.value
      menuOpen.value = willOpen
      if (willOpen) {
        // Next tick-ish: compute after DOM paints
        setTimeout(computeMenuPosition, 0)
      }
    }
    function closeMenu(){ menuOpen.value = false }

    function handleClickOutside(event){
      const menuEl = menuRef.value
      const btnEl = menuButtonRef.value
      if ((menuEl && menuEl.contains(event.target)) || (btnEl && btnEl.contains(event.target))) return
      closeMenu()
    }

    function handleResizeOrScroll(){ if (menuOpen.value) computeMenuPosition() }

    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', handleResizeOrScroll)
      window.addEventListener('scroll', handleResizeOrScroll, true)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResizeOrScroll)
      window.removeEventListener('scroll', handleResizeOrScroll, true)
    })

    function isNum(v){ return typeof v === 'number' && Number.isFinite(v) }
    function formatDuration(min){
      const m = Number(min)
      if (!Number.isFinite(m) || m <= 0) return ''
      if (m < 60) return `${m} min`
      const h = Math.floor(m / 60)
      const r = m % 60
      if (r === 0) return `${h} ${h===1 ? 'uur' : 'uur'}`
      return `${h} ${h===1 ? 'uur' : 'uur'} en ${r} min`
    }

    function hasDate(){
      const t = props.training || {}
      return !!(t.date || t.trainingDate)
    }
    function dateLabel(){
      try {
        const t = props.training || {}
        // Prefer new schema: date (YYYY-MM-DD) parsed via numeric constructor to avoid TZ shifts
        if (t.date) {
          const parts = String(t.date).split('-').map(x => parseInt(x, 10))
          const y = parts[0], m = (parts[1] || 1) - 1, d0 = parts[2] || 1
          const d = new Date(y, m, d0)
          return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        }
        // Fallback to legacy trainingDate ISO (includes time) — show only date part on card
        if (t.trainingDate) {
          const d = new Date(t.trainingDate)
          if (!Number.isNaN(d.getTime())) {
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
          }
        }
        return ''
      } catch(_) { return '' }
    }

    function onEdit(){
      closeMenu()
      store.notify('Wijzigen van training (binnenkort beschikbaar)', 'info', 2500)
    }
    function onDuplicate(){
      closeMenu()
      try { store.duplicateTraining(props.training.id) } catch(_) {}
    }
    function onDelete(){
      closeMenu()
      try {
        emit('request-delete', { id: props.training?.id, name: props.training?.name })
      } catch(_) {}
    }

    function onToggleFav(){
      try { store.toggleTrainingFavorite(props.training.id) } catch(_) {}
      closeMenu()
    }

    return { menuOpen, menuRef, menuButtonRef, menuStyle, toggleMenu, onEdit, onDuplicate, onDelete, onToggleFav, goToDetail, isNum, formatDuration, hasDate, dateLabel }
  }
}
</script>

<style scoped>
.training-card-item { cursor: pointer; }
</style>
