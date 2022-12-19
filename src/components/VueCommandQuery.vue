<template>
  <div class="vue-command__query">
    <span
      v-if="isReverseISearch"
      class="command__query__reverse-i-search__prompt">
      {{ reverseISearch }}
    </span>
    <input
      v-if="isReverseISearch"
      ref="reverseISearchRef"
      v-model="reverseISearch"
      class="vue-command__query__reverse-i-search__input"
      :disabled="isOutdated"
      autocapitalize="none"
      autocorrect="off"
      type="text"
      @input="searchIReverse($event.target.value)"
      @keydown.tab.exact.prevent="cancel"
      @keydown.esc.exact.prevent="cancel"
      @keyup.enter.exact="submit" />

    <span
      v-if="!hidePrompt && !isReverseISearch"
      class="vue-command__query__prompt">
      {{ local.prompt }}
    </span>
    <!-- TODO Make textarea to enforce word break -->
    <input
      v-if="!isReverseISearch"
      ref="queryRef"
      v-model="local.query"
      class="vue-command__query__input"
      :disabled="isOutdated"
      :placeholder="placeholder"
      autocapitalize="none"
      autocorrect="off"
      type="text"
      @click="setCursorPosition($refs.queryRef.selectionStart)"
      @input="setQuery($event.target.value)"
      @keydown.tab.exact.prevent="autocompleteQuery"
      @keydown.ctrl.r.exact.prevent="showReverseISearch"
      @keyup.arrow-left.exact="setCursorPosition($refs.queryRef.selectionStart)"
      @keyup.arrow-right.exact="setCursorPosition($refs.queryRef.selectionStart)"
      @keyup.enter.exact="submit" />
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watch,
  inject,
  defineExpose,
  onBeforeMount,
  reactive
} from 'vue'
import {
  and
} from '@/utils'
import {
  defaultParser,
  createStdout,
  listFormatter
} from '@/library'
import head from 'lodash.head'
import lt from 'lodash.lt'
import gt from 'lodash.gt'
import isFunction from 'lodash.isfunction'
import trimStart from 'lodash.trimstart'
import isEmpty from 'lodash.isempty'
import size from 'lodash.size'
import includes from 'lodash.includes'

const appendToHistory = inject('appendToHistory')
const dispatch = inject('dispatch')
const dispatchedQueries = inject('dispatchedQueries')
// TODO Inject dispatched queries
const hidePrompt = inject('hidePrompt')
const optionsResolver = inject('optionsResolver')
const parser = inject('parser')
const programs = inject('programs')
const setCursorPosition = inject('setCursorPosition')
const setQuery = inject('setQuery')
const terminal = inject('terminal')

const isOutdated = ref(false)
const isReverseISearch = ref(false)
const reverseISearch = ref('(reverse-i-search)`\': ')
const placeholder = ref('')
const queryRef = ref(null)

const local = reactive({
  prompt: '',
  query: ''
})

// Autocompletes a command and calls options resolver with found program
// and parsed query if there are more than two arguments
const autocompleteQuery = () => {
  // An empty query shall be never autocompleted
  if (isEmpty(local.query)) {
    return
  }

  // ['bash', '--help']
  const parsedQuery = defaultParser(local.query)
  // bash, make, sh
  const command = head(parsedQuery)

  const commands = []
  // TODO Use lodashs filter
  for (const program of programs.value) {
    // If program starts with command, add command to be possibly autocompleted
    if (program.startsWith(command)) {
      commands.push(program)
    }
  }

  // Print commands based on length
  switch (size(commands)) {
    // No command
    case 0:
      break

    // One command
    case 1: {
      const program = head(commands)
      if (and(
        // Check if query expects autocomplete
        lt(program.length, size(trimStart(local.query))),
        // Check if user provided options resolver
        isFunction(optionsResolver), isFunction(parser))
      ) {
        optionsResolver(program, parser(local.query), setQuery)
        return
      }

      // If query has white spaces at the end, ignore
      if (gt(program.length, size(trimStart(local.query)))) {
        setQuery(program)
      }

      break
    }

    // Multiple commands
    default: {
      // TODO Create terminal-like columns

      // Print a list of commands

      // Invalidate query to preserve it locally
      isOutdated.value = true

      // Preserve the current query since it gets emptied after "createStdout"
      // exited
      appendToHistory(createStdout(listFormatter(...commands)))
    }
  }
}
// Focuses the input
const focus = () => {
  queryRef.value.focus()
}
const searchIReverse = () => {
  console.debug()
}
const showReverseISearch = () => {
  isReverseISearch.value = true
}
// Deactivates this query and dispatches it to execute the command
const submit = () => {
  isOutdated.value = true
  dispatch(local.query)
}

// Apply given cursor position to actual cursor position
const unwatchLocalQuery = watch(() => local.query, () => {
  setCursorPosition(queryRef.value.selectionStart)
})
const unwatchTerminalCursorPosition = watch(
  () => terminal.value.cursorPosition,
  cursorPosition => {
    queryRef.value.setSelectionRange(cursorPosition, cursorPosition)
  }
)
// This allows to mutate the query from outside the component and not only
// inside a history entry
const unwatchTerminalQuery = watch(
  () => terminal.value.query,
  query => {
    local.query = query
  }
)
const unwatchIsDisabled = watch(isOutdated, () => {
  unwatchTerminalQuery()
  unwatchLocalQuery()
  unwatchTerminalCursorPosition()
  unwatchIsDisabled()
  isReverseISearch.value = false
  placeholder.value = ''
})

onBeforeMount(() => {
  local.prompt = terminal.value.prompt
})
onMounted(() => {
  focus()

  const helpText = inject('helpText')
  const helpTimeout = inject('helpTimeout')
  const showHelp = inject('showHelp')

  // Show eventually help as placeholder
  if (and(showHelp, !isOutdated.value)) {
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
