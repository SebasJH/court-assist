<template>
  <div
    class="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
    role="link"
    :aria-label="`Open ${training.name}`"
    tabindex="0"
    @click="goToDetail"
    @keydown.enter.prevent="goToDetail"
  >
    <div class="min-w-0">
      <div class="font-medium text-gray-800 dark:text-gray-100 truncate">{{ training.name }}</div>
      <div class="text-sm text-gray-500 dark:text-gray-300 truncate">{{ training.theme || 'Geen thema' }}</div>
    </div>
    <div class="flex items-center gap-3 flex-shrink-0 text-sm text-gray-600 dark:text-gray-200">
      <span v-if="hasDate()">{{ dateTimeLabel() }}</span>
      <span v-if="isNum(training.duration)">⏱️ {{ formatDuration(training.duration) }}</span>
      <span v-if="isNum(training.participants)">👥 {{ training.participants }}</span>

      <!-- Menu -->
      <div class="relative" @click.stop>
        <button
          ref="menuButtonRef"
          type="button"
          class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-650 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          aria-haspopup="menu"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-label="Acties"
          @click="toggleMenu"
        >
          <MoreVertical class="w-4 h-4" />
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
  name: 'TrainingListItem',
  emits: ['request-delete'],
  props: { training: { type: Object, required: true } },
  setup(props, { emit }){
    const router = useRouter()
    const menuOpen = ref(false)
    const menuRef = ref(null)
    const menuButtonRef = ref(null)
    const menuStyle = ref({ left: '0px', top: '0px' })

    function goToDetail(){
      try { router.push('/training/' + slugify(props.training.name)) } catch(_) {}
    }

    function toggleMenu(){
      const willOpen = !menuOpen.value
      menuOpen.value = willOpen
      if (willOpen) setTimeout(computeMenuPosition, 0)
    }
    function closeMenu(){ menuOpen.value = false }

    function handleClickOutside(event){
      const menuEl = menuRef.value
      const btnEl = menuButtonRef.value
      if ((menuEl && menuEl.contains(event.target)) || (btnEl && btnEl.contains(event.target))) return
      closeMenu()
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
    function formatDate(iso){
      try {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return ''
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      } catch(_) { return '' }
    }
    function hasDate(){
      const t = props.training || {}
      return !!(t.date || t.trainingDate)
    }
    function dateTimeLabel(){
      try {
        const t = props.training || {}
        if (t.date) {
          const parts = String(t.date).split('-').map(x => parseInt(x, 10))
          const y = parts[0], m = (parts[1] || 1) - 1, d0 = parts[2] || 1
          const d = new Date(y, m, d0)
          const base = Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
          const s = t.time && t.time.start
          const e = t.time && t.time.end
          if (s && e) return base ? `${base} ${s}–${e}` : `${s}–${e}`
          if (s) return base ? `${base} ${s}` : `${s}`
          return base
        }
        if (t.trainingDate) {
          const d = new Date(t.trainingDate)
          if (!Number.isNaN(d.getTime())) {
            return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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

    return { menuOpen, menuRef, menuButtonRef, menuStyle, toggleMenu, onEdit, onDuplicate, onDelete, onToggleFav, goToDetail, isNum, formatDuration, formatDate, hasDate, dateTimeLabel }
  }
}
</script>

<style scoped>
</style>
