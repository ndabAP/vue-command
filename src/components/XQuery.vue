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
      @keyup.enter.exact="dispatch($event.target.value)"
      @keydown.arrow-down.exact="forwardHistory"
      @keydown.arrow-up.exact="backwardHistory"
      @keydown.tab.exact="autocomplete" />
  </div>
</template>

<script setup>
// TODO: Stop watchers
import { defineProps, defineEmits, ref, onMounted, watch, inject, computed, defineComponent, nextTick } from 'vue'
import isEmpty from 'lodash.isempty'

const emits = defineEmits(['dispatch'])

const terminal = inject('terminal')
const setCursorPosition = inject('setCursorPosition')
const setHistoryPosition = inject('setHistoryPosition')
const setQuery = inject('setQuery')
const hidePrompt = inject('hidePrompt')
const prompt = inject('prompt')

const isDisabled = ref(false)
const placeholder = ref('')
const query = ref('')
const queryRef = ref(null)

// To allow user to mutate query from outside not only from a history component
watch(() => terminal.value.query, newQuery => {
  if (!isDisabled.value) {
    query.value = newQuery
  }
})

const autocomplete = () => {

}

const forwardHistory = () => {
  const executedCommands = terminal.value.executedCommands
  const historyPosition = terminal.value.historyPosition

  if (isEmpty(executedCommands)) {
    return
  }

  if (historyPosition < executedCommands.size) {
    setHistoryPosition(historyPosition + 1)
    query.value = [...executedCommands][historyPosition + 1]
  }
}
const backwardHistory = () => {
  const executedCommands = terminal.value.executedCommands
  const historyPosition = terminal.value.historyPosition

  if (isEmpty(executedCommands)) {
    return
  }

  if (historyPosition > executedCommands.size) {
    return
  }
  if (historyPosition === executedCommands.size) {
    setHistoryPosition(executedCommands.size - 1)
    query.value = [...executedCommands][executedCommands.size - 1]
    return
  }
  if (historyPosition === 0) {
    query.value = [...executedCommands][0]
  }
  if (historyPosition > 0) {
    setHistoryPosition(historyPosition - 1)
    query.value = [...executedCommands][historyPosition - 1]
  }
}

const focus = () => {
  queryRef.value.focus()
}

const dispatch = query => {
  isDisabled.value = true
  emits('dispatch', query)
}

watch(query, () => {
  setCursorPosition(queryRef.value.selectionStart)
})

// Apply given cursor position to actual cursor position
// TODO This gets called for every input since cursor position is mutated at the
// mother component. It's eventually necessary
watch(() => terminal.value.cursorPosition, cursorPosition => {
  // TODO: Unwatch to avoid check
  if (isDisabled.value) {
    return
  }
  queryRef.value.setSelectionRange(cursorPosition, cursorPosition)
})

onMounted(() => {
  focus()

  const helpText = inject('helpText')
  const helpTimeout = inject('helpTimeout')
  const showHelp = inject('showHelp')

  if (showHelp && !isDisabled.value) {
    const timeout = setTimeout(() => {
      placeholder.value = helpText
    }, helpTimeout)

    watch(isDisabled, () => {
      clearTimeout(timeout)
    })
  }
})

watch(isDisabled, () => {
  placeholder.value = ''
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
