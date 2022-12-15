<template>
  <div class="vue-command__query">
    <slot name="prompt">
      <span
        v-if="!hidePrompt"
        class="vue-command__query-prompt">
        {{ prompt }}
      </span>
    </slot>

    <input
      ref="queryRef"
      v-model="query"
      class="vue-command__query-input"
      :disabled="isDisabled"
      :placeholder="placeholder"
      autocapitalize="none"
      autocorrect="off"
      type="text"
      @click="setCursorPosition($refs.queryRef.selectionStart)"
      @input="setQuery($event.target.value)"
      @keyup.enter.exact="dispatch($event.target.value)" />
  </div>
</template>

<script setup>
import { defineEmits, ref, onMounted, watch, inject, defineExpose } from 'vue'

const emits = defineEmits(['dispatch'])

const terminal = inject('terminal')
const setCursorPosition = inject('setCursorPosition')
const setQuery = inject('setQuery')
const hidePrompt = inject('hidePrompt')
const prompt = inject('prompt')

const isDisabled = ref(false)
const placeholder = ref('')
const query = ref('')
const queryRef = ref(null)

const focus = () => {
  queryRef.value.focus()
}

const dispatch = query => {
  isDisabled.value = true
  emits('dispatch', query)
}

onMounted(() => {
  focus()

  const helpText = inject('helpText')
  const helpTimeout = inject('helpTimeout')
  const showHelp = inject('showHelp')

  if (showHelp && !isDisabled.value) {
    const timeout = setTimeout(() => {
      placeholder.value = helpText
    }, helpTimeout)

    const unwatchIsDisabled = watch(isDisabled, () => {
      clearTimeout(timeout)
      unwatchIsDisabled()
    })
  }
})

const unwatchQuery = watch(query, () => {
  setCursorPosition(queryRef.value.selectionStart)
})
// Apply given cursor position to actual cursor position
const unwatchTerminalCursorPosition = watch(() => terminal.value.cursorPosition, cursorPosition => {
  queryRef.value.setSelectionRange(cursorPosition, cursorPosition)
})
// To allow user to mutate query from outside not only from a history component
const unwatchTerminalQuery = watch(() => terminal.value.query, newQuery => {
  if (!isDisabled.value) {
    query.value = newQuery
  }
})
const unwatchIsDisabled = watch(isDisabled, () => {
  unwatchTerminalQuery()
  unwatchQuery()
  unwatchTerminalCursorPosition()
  placeholder.value = ''
  unwatchIsDisabled()
})

defineExpose({
  focus
})
</script>

<style lang="scss">
.vue-command {
  .vue-command__query {
    display: flex;
  }

  .vue-command__query-input {
    background: none;
    border: none;
    outline: none;
    flex: 1;
    width: 100%;
    font-family: monospace;
    font-size: 1rem;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .vue-command__query-prompt {
    margin-right: 0.25rem;
  }
}
</style>
