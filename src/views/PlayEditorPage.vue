<template>
  <div class="h-full flex flex-col">
    <div ref="headerRef" class="px-5 sm:px-10 pt-4 pb-3 flex items-center gap-3 border-b dark:border-gray-600 bg-white dark:bg-gray-800">
      <button
        type="button"
        @click="goBack"
        class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600 flex-shrink-0"
        aria-label="Terug"
        title="Terug"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-50">Play Editor</h1>
      <div class="ml-auto flex items-center gap-2">
        <UiButton color="primary" @click="saveFromPage">Opslaan</UiButton>
        <!-- Ellipsis menu -->
        <div class="relative" ref="menuRef">
          <button type="button" @click="menuOpen = !menuOpen" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-600/40 dark:text-gray-300 dark:hover:bg-gray-500/50 dark:border-gray-600 transition-colors duration-200" aria-haspopup="menu" :aria-expanded="menuOpen ? 'true' : 'false'" aria-label="Meer opties">
            <MoreVertical class="w-5 h-5" />
          </button>
          <div v-if="menuOpen" class="dropdown-menu absolute top-full right-0 mt-2 w-44 whitespace-nowrap border rounded-md shadow-lg flex flex-col z-[4000]">
            <button type="button" class="dropdown-item flex items-center justify-between" @click="chooseCourt('half')">
              <span>Half court</span>
              <span v-if="currentCourt==='half'" aria-hidden="true">✓</span>
            </button>
            <button type="button" class="dropdown-item flex items-center justify-between" @click="chooseCourt('full')">
              <span>Full court</span>
              <span v-if="currentCourt==='full'" aria-hidden="true">✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0" :style="{ height: availableHeight + 'px' }">
      <PlayEditor ref="editor" :initial="initialState" :suggestedCourt="''" :showTools="true" @save="onEditorSave" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import PlayEditor from '../components/diagram/PlayEditor.vue'
import UiButton from '../components/ui/Button.vue'

export default {
  name: 'PlayEditorPage',
  components: { PlayEditor, UiButton },
  setup(){
    const editor = ref(null)
    const initialState = ref(null)
    const ctx = ref(null)
    const router = useRouter()

    // Height of editor area = 100vh - header height
    const headerRef = ref(null)
    const availableHeight = ref(0)
    let headerRO = null
    function updateAvailableHeight(){
      try {
        const vh = window.innerHeight || document.documentElement.clientHeight || 0
        const headerEl = headerRef.value
        const hh = headerEl && typeof headerEl.getBoundingClientRect === 'function' ? (headerEl.getBoundingClientRect().height || 0) : 0
        const h = Math.max(0, Math.floor(vh - hh))
        if (Math.abs(h - availableHeight.value) > 0.5) availableHeight.value = h
      } catch(_) { availableHeight.value = 0 }
    }

    const menuOpen = ref(false)
    const menuRef = ref(null)
    const currentCourt = ref('half')
    function chooseCourt(kind){
      try { if (editor.value && typeof editor.value.setCourt === 'function') editor.value.setCourt(kind) } catch(_) {}
      currentCourt.value = (kind === 'full' ? 'full' : 'half')
      menuOpen.value = false
    }

    function onDocClick(ev){
      try {
        if (!menuOpen.value) return
        const root = menuRef.value
        if (!root) { menuOpen.value = false; return }
        const t = ev.target
        if (root === t || (root.contains && root.contains(t))) return
        menuOpen.value = false
      } catch(_) { menuOpen.value = false }
    }

    onMounted(() => {
      try {
        const raw = sessionStorage.getItem('playEditor_ctx')
        ctx.value = raw ? JSON.parse(raw) : null
        initialState.value = ctx.value && ctx.value.initialState ? ctx.value.initialState : null
        // Initialize current court from initial state if present
        try {
          const ic = ctx.value && ctx.value.initialState && ctx.value.initialState.court ? String(ctx.value.initialState.court) : ''
          if (ic === 'full' || ic === 'half') currentCourt.value = ic
        } catch(_) {}
        // After editor mounts, sync currentCourt from child for safety
        nextTick(() => {
          try {
            const c = editor.value && editor.value.court ? String(editor.value.court) : ''
            if (c === 'full' || c === 'half') currentCourt.value = c
          } catch(_) {}
        })
      } catch(_) {}
      // Setup header observer and initial sizing
      try {
        if (headerRef.value && typeof ResizeObserver !== 'undefined') {
          headerRO = new ResizeObserver(() => updateAvailableHeight())
          headerRO.observe(headerRef.value)
        }
      } catch(_) {}
      try { window.addEventListener('resize', updateAvailableHeight) } catch(_) {}
      try { updateAvailableHeight() } catch(_) {}
      try { document.addEventListener('click', onDocClick, true) } catch(_) {}
      try { window.addEventListener('beforeunload', onBeforeUnload) } catch(_) {}
    })
    onBeforeUnmount(() => {
      try { document.removeEventListener('click', onDocClick, true) } catch(_) {}
      try { window.removeEventListener('resize', updateAvailableHeight) } catch(_) {}
      try { if (headerRO && headerRef.value) { headerRO.disconnect(); headerRO = null } } catch(_) {}
      try { window.removeEventListener('beforeunload', onBeforeUnload) } catch(_) {}
    })

    const ignoreGuard = ref(false)

    function saveFromPage(){
      ignoreGuard.value = true
      if (editor.value && typeof editor.value.saveAsImage === 'function') {
        try { editor.value.saveAsImage() } catch (_) {}
      }
      // After save, we navigate back in onEditorSave; keep guard disabled
    }

    function onBeforeUnload(e){
      try {
        if (ignoreGuard.value) return
        const dirty = editor.value && typeof editor.value.isDirty === 'function' ? editor.value.isDirty() : false
        if (dirty) {
          e.preventDefault()
          e.returnValue = ''
        }
      } catch(_) {}
    }

    onBeforeRouteLeave((to, from, next) => {
      try {
        if (ignoreGuard.value) { next(); return }
        const dirty = editor.value && typeof editor.value.isDirty === 'function' ? editor.value.isDirty() : false
        if (!dirty) { next(); return }
        const ok = window.confirm('Je hebt onopgeslagen wijzigingen in het diagram. Weet je zeker dat je deze pagina wilt verlaten?')
        if (ok) next(); else next(false)
      } catch(_) { next() }
    })

    function goBack(){
      try {
        // Set a flag so ExerciseEdit can switch to media tab on return without adding history entries
        try { sessionStorage.setItem('playEditor_returnToMedia', '1') } catch(_) {}
        router.back()
      } catch(_) {
        try { router.push('/oefeningen') } catch(__) {}
      }
    }

    function onEditorSave(payload){
      try {
        const result = {
          token: ctx.value && ctx.value.token ? ctx.value.token : null,
          idx: ctx.value && typeof ctx.value.idx === 'number' ? ctx.value.idx : null,
          dataUrl: payload && payload.dataUrl,
          state: payload && payload.state,
          ts: Date.now()
        }
        try { sessionStorage.setItem('playEditor_result', JSON.stringify(result)) } catch(_) {}
      } finally {
        goBack()
      }
    }

    return { editor, initialState, saveFromPage, onEditorSave, goBack, menuOpen, menuRef, chooseCourt, currentCourt, headerRef, availableHeight }
  }
}
</script>
