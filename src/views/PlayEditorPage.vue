<template>
  <div class="h-full flex flex-col">
    <div class="px-5 sm:px-10 pt-4 pb-3 flex items-center gap-3 border-b dark:border-gray-600 bg-white dark:bg-gray-800">
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
      </div>
    </div>
    <div class="flex-1 min-h-0">
      <PlayEditor ref="editor" :initial="initialState" :suggestedCourt="''" @save="onEditorSave" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

    onMounted(() => {
      try {
        const raw = sessionStorage.getItem('playEditor_ctx')
        ctx.value = raw ? JSON.parse(raw) : null
        initialState.value = ctx.value && ctx.value.initialState ? ctx.value.initialState : null
      } catch(_) {}
    })

    function saveFromPage(){
      if (editor.value && typeof editor.value.saveAsImage === 'function') {
        try { editor.value.saveAsImage() } catch (_) {}
      }
    }

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

    return { editor, initialState, saveFromPage, onEditorSave, goBack }
  }
}
</script>
