<template>
  <div class="rte-wrapper border border-gray-300 rounded-md bg-white">
    <!-- Toolbar -->
    <div class="rte-toolbar flex items-center gap-2 px-2 py-1 bg-gray-100 border-b border-gray-300 rounded-t-md">
      <button type="button" class="rte-btn" @mousedown.prevent @click="applyCmd('bold')" title="Vet">
        <strong>B</strong>
      </button>
      <button type="button" class="rte-btn" @mousedown.prevent @click="applyCmd('italic')" title="Cursief">
        <span class="italic">I</span>
      </button>
      <div class="h-5 w-px bg-gray-300 mx-1" aria-hidden="true"></div>
      <button type="button" class="rte-btn" @mousedown.prevent @click="applyCmd('insertUnorderedList')" title="Opsomming">• List</button>
      <button type="button" class="rte-btn" @mousedown.prevent @click="applyCmd('insertOrderedList')" title="Genummerd">1. List</button>
    </div>

    <!-- Editable area -->
    <div
      ref="editor"
      class="rte-editor w-full px-3 py-2 min-h-[8rem] focus:outline-none"
      :data-placeholder="placeholder"
      contenteditable="true"
      role="textbox"
      aria-multiline="true"
      @input="onInput"
      @focus="onFocus"
    ></div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'RichTextEditor',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editor = ref(null)
    let savedRange = null

    function saveSelection() {
      const sel = document.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const range = sel.getRangeAt(0)
      if (editor.value && editor.value.contains(range.commonAncestorContainer)) {
        savedRange = range
      }
    }

    function restoreSelection() {
      if (!savedRange) return
      const sel = document.getSelection()
      if (!sel) return
      sel.removeAllRanges()
      sel.addRange(savedRange)
    }

    function focusEditor() {
      if (editor.value) editor.value.focus()
    }

    function applyCmd(cmd) {
      // restore caret in editor where user last selected
      focusEditor()
      restoreSelection()
      try {
        document.execCommand(cmd, false)
        // sync after command
        onInput()
      } catch (e) {
        // execCommand is deprecated but works widely
      }
    }

    function onFocus() {
      // placeholder handling is CSS-based; nothing required here
    }

    function onInput() {
      if (!editor.value) return
      emit('update:modelValue', editor.value.innerHTML)
    }

    function onSelectionChange() {
      // Track selection only if inside our editor
      saveSelection()
    }

    onMounted(() => {
      if (editor.value) {
        editor.value.innerHTML = props.modelValue || ''
      }
      document.addEventListener('selectionchange', onSelectionChange)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('selectionchange', onSelectionChange)
    })

    // Update content when v-model changes from outside
    watch(() => props.modelValue, (val) => {
      if (!editor.value) return
      if (editor.value.innerHTML !== (val || '')) {
        editor.value.innerHTML = val || ''
      }
    })

    return { editor, applyCmd, onInput, onFocus }
  }
}
</script>

<style scoped>
.rte-btn {
  @apply px-2 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0;
}

/* Placeholder for empty contenteditable */
.rte-editor:empty:before {
  content: attr(data-placeholder);
  @apply text-gray-400;
}

/* Improve list appearance inside editor */
.rte-editor :deep(ul) {
  list-style-type: disc;
  @apply pl-5 my-2;
}
.rte-editor :deep(ol) {
  list-style-type: decimal;
  @apply pl-5 my-2;
}
.rte-editor :deep(li) {
  @apply my-1 leading-6;
}

/* Nested lists spacing */
.rte-editor :deep(li) ul,
.rte-editor :deep(li) ol {
  @apply mt-1;
}
</style>
