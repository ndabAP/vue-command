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
      {{ prompt }}
    </span>

    <!-- TODO Move autocomplete and search to parent -->
    <!-- TODO Make textarea to enforce word break -->
    <input
      ref="queryRef"
      v-model="query"
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
      @keyup.enter.exact="submit($event.target.value)" />
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
const optionsResolver = inject('optionsResolver')
const parser = inject('parser')
const programs = inject('programs')
const setCursorPosition = inject('setCursorPosition')
const setQuery = inject('setQuery')
const terminal = inject('terminal')

const isOutdated = ref(false)
const placeholder = ref('')
const prompt = ref('')
const query = ref('')
const queryRef = ref(null)

// Autocompletes a command and calls options resolver with found program
// and parsed query if there are more than two arguments
const autocompleteQuery = async () => {
  // An empty query shall be never autocompleted
  if (isEmpty(query.value)) {
    return
  }

  // ['bash', '--help']
  const parsedQuery = defaultParser(query.value)
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
        lt(program.length, size(trimStart(query.value))),
        // Check if user provided options resolver
        isFunction(optionsResolver), isFunction(parser))
      ) {
        optionsResolver(program, parser(query.value), setQuery)
        return
      }

      // If query has white spaces at the end, ignore
      if (gt(program.length, size(trimStart(query.value)))) {
        setQuery(program)
      }

      break
    }

    // Multiple commands
    default: {
      // TODO Create terminal-like columns

      // Print a list of commands

      // Preserve the current query since it gets emptied after "createStdout"
      // exited
      const previousQuery = query.value
      appendToHistory(createStdout(listFormatter(...commands)))

      // Wait until the query component has been rendered
      await nextTick()

      // Set the previous query again
      setQuery(previousQuery)
      query.value = previousQuery
      // Invalidate query
      isOutdated.value = true
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

// Deactivates this query and dispatches it to execute the command
const submit = () => {
  isOutdated.value = true
  dispatch(query.value)
}

// Apply given cursor position to actual cursor position
const unwatchQuery = watch(query, () => {
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
  queryValue => {
    query.value = queryValue
  }
)
const unwatchIsDisabled = watch(isOutdated, () => {
  unwatchTerminalQuery()
  unwatchQuery()
  unwatchTerminalCursorPosition()
  unwatchIsDisabled()
  placeholder.value = ''
})

onBeforeMount(() => {
  prompt.value = terminal.value.prompt
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
.vue-command,
.vue-command--invert {

  .vue-command__query,
  .vue-command__query--invert {
    display: flex;

    input::placeholder,
    input {
      font: 1rem monospace;
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
