<template>
  <div class="vue-command__query">
    <slot name="prompt">
      <span
        v-if="!hidePrompt"
        class="vue-command__query__prompt">
        {{ prompt }}
      </span>
    </slot>

    <input
      ref="queryRef"
      v-model="query"
      class="vue-command__query__input"
      :disabled="isOutdated"
      :placeholder="placeholder"
      autocapitalize="none"
      autocorrect="off"
      type="text"
      @click="setCursorPosition($refs.queryRef.selectionStart)"
      @input="setQuery($event.target.value)"
      @keyup.enter.exact="submit($event.target.value)" />
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watch,
  inject,
  defineExpose
} from 'vue'

const dispatch = inject('dispatch')
const hidePrompt = inject('hidePrompt')
const setCursorPosition = inject('setCursorPosition')
const setQuery = inject('setQuery')
const terminal = inject('terminal')
const prompt = inject('prompt')

const isOutdated = ref(false)
const placeholder = ref('')
const query = ref('')
const queryRef = ref(null)

const focus = () => {
  queryRef.value.focus()
}

// Deactivates this query and dispatches it to execute the command
const submit = () => {
  isOutdated.value = true
  dispatch(query.value)
}

// Apply given cursor position to actual cursor position
const unwatchQuery = watch(query, () => {
  setCursorPosition(queryRef.value.selectionStart)
})
const unwatchTerminalCursorPosition = watch(() => terminal.value.cursorPosition, cursorPosition => {
  queryRef.value.setSelectionRange(cursorPosition, cursorPosition)
})
// This allows to mutate the query from outside the component and not only as a
// history entry
const unwatchTerminalQuery = watch(() => terminal.value.query, queryValue => {
  query.value = queryValue
})
const unwatchIsDisabled = watch(isOutdated, () => {
  unwatchTerminalQuery()
  unwatchQuery()
  unwatchTerminalCursorPosition()
  unwatchIsDisabled()
  placeholder.value = ''
})

onMounted(() => {
  focus()

  const helpText = inject('helpText')
  const helpTimeout = inject('helpTimeout')
  const showHelp = inject('showHelp')

  // Show help and disable watcher
  if (showHelp && !isOutdated.value) {
    const timeout = setTimeout(() => {
      placeholder.value = helpText
    }, helpTimeout)

    const unwatchIsDisabled = watch(isOutdated, () => {
      clearTimeout(timeout)
      unwatchIsDisabled()
    })
  }
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

  .vue-command__query__input {
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

  .vue-command__query__prompt {
    margin-right: 0.25rem;
  }
}
</style>
