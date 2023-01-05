<template>
  <div>
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

      <!-- TODO Make textarea to enforce word break -->
      <input
        ref="queryRef"
        v-model="local.query"
        :class="{
          'vue-command__query__input': !invert,
          'vue-command__query__input--invert': invert
        }"
        :disabled="isOutdatedQuery"
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

    <div
      v-for="(multilineQuery, index) in multilineQueries"
      :key="index"
      :class="{
        'vue-command__multiline-query': !invert,
        'vue-command__multiline-query--invert': invert
      }">
      <span
        :class="{
          'vue-command__multiline-query__prompt': !invert,
          'vue-command__multiline-query__prompt--invert': invert
        }">></span>
      <input
        ref="multilineQueryRefs"
        :class="{
          'vue-command__multiline-query__input': !invert,
          'vue-command__multiline-query__input--invert': invert
        }"
        :disabled="isOutdatedMultilineQuery(index)"
        autocapitalize="none"
        autocorrect="off"
        type="text"
        :value="multilineQuery"
        @click="setCursorPosition($refs.multilineQueryRefs[index].selectionStart)"
        @input="setLastMultilineQuery($event.target.value)"
        @keyup.arrow-left.exact="setCursorPosition($refs.multilineQueryRefs[index].selectionStart)"
        @keyup.arrow-right.exact="setCursorPosition($refs.multilineQueryRefs[index].selectionStart)"
        @keyup.enter.exact="submit">
    </div>
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
  nextTick,
  computed,
  provide
} from 'vue'
import {
  and,
  or
} from '@/utils'
import {
  defaultParser,
  createStdout,
  createQuery,
  listFormatter
} from '@/library'
import {
  head,
  isEmpty,
  eq,
  size,
  isFunction,
  gt,
  last,
  set,
  trimStart,
  lt,
  join
} from 'lodash'

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
const signals = inject('signals')
const terminal = inject('terminal')

// Indicates if the query, including multiline queries, is invalid
const isOutdated = ref(false)
const multilineQueryRefs = ref(null)
const placeholder = ref('')
const queryRef = ref(null)

const local = reactive({
  prompt: '',
  query: ''
})
const multilineQueries = reactive([])

const isOutdatedMultilineQuery = computed(() => {
  return index => or(
    and(!isEmpty(multilineQueries), !eq(index, size(multilineQueries) - 1)),
    isOutdated.value
  )
})
const isOutdatedQuery = computed(() => {
  return or(isOutdated.value, !isEmpty(multilineQueries))
})
const lastQuery = computed(() => {
  // Check query for new multiline request
  if (isEmpty(multilineQueries)) {
    return local.query
  }

  // Check last multiline query for next multiline request
  const lastMultilineQuery = last(multilineQueries)
  return lastMultilineQuery
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
// Focuses the query or multiline query
const focus = () => {
  if (isEmpty(multilineQueries)) {
    queryRef.value.focus()
    return
  }

  const lastMultilineQueryRef = last(multilineQueryRefs.value)
  lastMultilineQueryRef.focus()
}
const reverseISearch = event => {
  // TODO
  // console.debug(event)
}
// Cancels the current query and creates a new one
const sigint = () => {
  if (isEmpty(multilineQueries)) {
    local.query = `${local.query}^C`
  }

  if (!isEmpty(multilineQueries)) {
    const lastMultilineQuery = last(multilineQueries)
    setLastMultilineQuery(`${lastMultilineQuery}^C`)
  }

  isOutdated.value = true
  appendToHistory(createQuery())
}
const setLastMultilineQuery = multilineQuery => {
  set(multilineQueries, size(multilineQueries) - 1, multilineQuery)
}
// Deactivates this query or spawns new multiline queries and finally dispatches
// it to execute the command
const submit = async () => {
  // Check query for new multiline request
  if (and(
    eq(lastQuery.value.at(-1), '\\'),
    !eq(lastQuery.value.slice(-2), '\\\\') // Ignore "\\"
  )) {
    multilineQueries.push('')
    return
  }

  const multilineQuery = local.query
    .concat(multilineQueries.join(''))
    .replaceAll(/(?<!\\)\\(?!\\)/g, '')
  setQuery(multilineQuery)

  isOutdated.value = true

  dispatch()
}

const unwatchMultilineQueries = watch(multilineQueries, async () => {
  await nextTick()
  focus()
})
const unwatchLocalQuery = watch(() => local.query, query => {
  // Apply given cursor position to actual cursor position
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
  signals.off('SIGINT', sigint)
  unwatchLocalQuery()
  unwatchTerminalQuery()
  unwatchTerminalCursorPosition()
  placeholder.value = ''
  unwatchMultilineQueries()
  unwatchIsOutdated()
})

onBeforeMount(() => {
  local.prompt = terminal.value.prompt
})
onMounted(() => {
  signals.on('SIGINT', sigint)

  focus()

  // Show eventually help as placeholder
  if (showHelp) {
    const timeout = setTimeout(() => {
      if (!isOutdated.value) {
        placeholder.value = helpText
      }
    }, helpTimeout)

    const unwatchIsOutdated = watch(isOutdated, () => {
      clearTimeout(timeout)
      unwatchIsOutdated()
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
  .vue-command__query--invert,
  .vue-command__multiline-query,
  .vue-command__multiline-query--invert {
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
    .vue-command__query__input--invert,
    .vue-command__multiline-query,
    .vue-command__multiline-query--invert    {
      border: none;
      outline: none;
      flex: 1;
      width: 100%;

    }

    .vue-command__query__prompt,
    .vue-command__query__prompt--invert,
    .vue-command__multiline-query__prompt,
    .vue-command__multiline-query__prompt {
      margin-right: 0.25rem;
    }
  }

  .vue-command__multiline-query,
  .vue-command__multiline-query--invert {
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

    .vue-command__multiline-query__input,
    .vue-command__multiline-query__input--invert {
      border: none;
      outline: none;
      flex: 1;
      width: 100%;

    }
  }
}

.vue-command {
  .vue-command__multiline-query,
  .vue-command__query {
    .vue-command__multiline-query__input,
    .vue-command__query__input {
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.vue-command--invert {
  .vue-command__multiline-query,
  .vue-command__query--invert {
    .vue-command__multiline-query__input,
    .vue-command__query__input--invert {
      &::placeholder {
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
