<template>
  <div
    :class="{
      'vue-command__query': !invert,
      'vue-command__query--invert': invert
    }">
    <span
      v-if="!hidePrompt"
      :class="{
        'vue-command__query__prompt': !invert,
        'vue-command__query__prompt--invert': invert
      }">
      {{ local.prompt }}
    </span>

    <!-- TODO Move autocomplete and search to parent -->
    <!-- TODO Make textarea to enforce word break -->
    <input
      ref="queryRef"
      v-model="local.query"
      :class="{
        'vue-command__query__input': !invert,
        'vue-command__query__input--invert': invert
      }"
      :disabled="isOutdated"
      :placeholder="placeholder"
      autocapitalize="none"
      autocorrect="off"
      type="text"
      @click="setCursorPosition($refs.queryRef.selectionStart)"
      @input="setQuery($event.target.value)"
      @keydown.tab.exact.prevent="autocompleteQuery"
      @keydown.ctrl.r.exact.prevent="reverseISearch"
      @keyup.arrow-left.exact="setCursorPosition($refs.queryRef.selectionStart)"
      @keyup.arrow-right.exact="setCursorPosition($refs.queryRef.selectionStart)"
      @keyup.enter.exact="submit">
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
  reactive,
  nextTick
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

const appendToHistory = inject('appendToHistory')
const dispatch = inject('dispatch')
const hidePrompt = inject('hidePrompt')
const invert = inject('invert')
const helpText = inject('helpText')
const helpTimeout = inject('helpTimeout')
const optionsResolver = inject('optionsResolver')
const parser = inject('parser')
const programs = inject('programs')
const setCursorPosition = inject('setCursorPosition')
const setQuery = inject('setQuery')
const showHelp = inject('showHelp')
const terminal = inject('terminal')

const isOutdated = ref(false)
const placeholder = ref('')
const queryRef = ref(null)

const local = reactive({
  prompt: '',
  query: ''
})

// Autocompletes a command and calls options resolver with found program
// and parsed query if there are more than two arguments
const autocompleteQuery = async () => {
  const query = local.query

  // An empty query shall be never autocompleted
  if (isEmpty(query)) {
    return
  }

  // ['bash', '--help']
  const parsedQuery = defaultParser(query)
  // bash, make, sh
  const command = head(parsedQuery)

  const commands = []
  // TODO Use lodash
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
        lt(size(program), size(trimStart(query))),
        // Check if user provided options resolver
        isFunction(optionsResolver), isFunction(parser))
      ) {
        optionsResolver(program, parser(query), setQuery)
        return
      }

      // If query has white spaces at the end, ignore
      if (gt(size(program), size(trimStart(query)))) {
        setQuery(program)
      }

      break
    }

    // Multiple commands
    default: {
      // TODO Create terminal-like columns

      // Print a list of commands

      // Invalidate query since a new one is created and to the current one
      isOutdated.value = true

      appendToHistory(createStdout(listFormatter(...commands)))

      // We have to wait for the query to be loaded
      // TODO Maybe listen to some event, indicating that the query has been
      // mounted
      await nextTick()

      // Overwrite new query with old one
      setQuery(local.query)
    }
  }
}
// Focuses the input
const focus = () => {
  queryRef.value.focus()
}
const reverseISearch = event => {
  // TODO
  // console.debug(event)
}
const showDelayedHelp = () => {
  const timeout = setTimeout(() => {
    placeholder.value = helpText
  }, helpTimeout)

  const unwatchIsDisabled = watch(isOutdated, () => {
    clearTimeout(timeout)
    unwatchIsDisabled()
  })
}
// Deactivates this query and dispatches it to execute the command
const submit = () => {
  isOutdated.value = true
  dispatch()
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
// Free resources if query is outdated/inactive
const unwatchIsOutdated = watch(isOutdated, () => {
  unwatchTerminalQuery()
  unwatchLocalQuery()
  unwatchTerminalCursorPosition()
  unwatchIsOutdated()
  placeholder.value = ''
})

onBeforeMount(() => {
  local.prompt = terminal.value.prompt
})
onMounted(() => {
  focus()

  // Show eventually help as placeholder
  if (and(showHelp, !isOutdated.value)) {
    showDelayedHelp()
  }
})

defineExpose({
  focus
})
</script>

<style lang="scss">
.vue-command,
.vue-command--invert {

  .vue-command__query,
  .vue-command__query--invert {
    display: flex;

    input::placeholder,
    input {
      font: 1rem Consolas,
        Monaco,
        'Andale Mono',
        'Ubuntu Mono',
        monospace;
      ;
    }

    .vue-command__query__input,
    .vue-command__query__input--invert {
      border: none;
      outline: none;
      flex: 1;
      width: 100%;

    }

    .vue-command__query__prompt,
    .vue-command__query__prompt--invert {
      margin-right: 0.25rem;
    }
  }
}

.vue-command {
  .vue-command__query {
    .vue-command__query__input {
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.vue-command--invert {
  .vue-command__query--invert {
    .vue-command__query__input--invert {
      &::placeholder {
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
