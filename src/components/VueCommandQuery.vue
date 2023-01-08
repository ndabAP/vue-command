<template>
  <div>
    <!-- Query -->
    <div
      v-show="shouldShowQuery"
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
        @keydown.tab.exact.prevent="autocompleteQuery"
        @keydown.ctrl.r.exact.prevent="showReverseISearch()"
        @keyup.arrow-left.exact="setCursorPosition($refs.queryRef.selectionStart)"
        @keyup.arrow-right.exact="setCursorPosition($refs.queryRef.selectionStart)"
        @keyup.end.exact="setCursorPosition($refs.queryRef.selectionStart)"
        @keyup.enter.exact="submit">
    </div>

    <!-- Multiline queries -->
    <div
      v-for="(multilineQuery, index) in multilineQueries"
      v-show="isBeforeReverseISearch(index)"
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
        :value="multilineQuery"
        autocapitalize="none"
        autocorrect="off"
        type="text"
        @click="setCursorPosition($refs.multilineQueryRefs[index].selectionStart)"
        @input="setLastMultilineQuery($event.target.value)"
        @keydown.ctrl.r.exact.prevent="showReverseISearch()"
        @keyup.arrow-left.exact="setCursorPosition($refs.multilineQueryRefs[index].selectionStart)"
        @keyup.arrow-right.exact="setCursorPosition($refs.multilineQueryRefs[index].selectionStart)"
        @keyup.end.exact="setCursorPosition($refs.multilineQueryRefs[index].selectionStart)"
        @keyup.enter.exact="submit">
    </div>

    <!-- Reverse I search -->
    <div
      v-if="isReverseISearch"
      :class="{
        'vue-command__reverse-i-search': !invert,
        'vue-command__reverse-i-search--invert': invert
      }">
      <span
        :class="{
          'vue-command__reverse-i-search-status': !invert,
          'vue-command__reverse-i-search-status--invert': invert
        }">({{ reverseISearchStatus }})`</span><input
        ref="reverseISearchRef"
        v-model="reverseISearch"
        :class="{
          'vue-command__reverse-i-search__input': !invert,
          'vue-command__reverse-i-search__input--invert': invert
        }"
        :disabled="isOutdated"
        autocapitalize="none"
        autocorrect="off"
        type="text"
        @click="setCursorPosition($refs.queryRef.selectionStart)"
        @input="resizeReverseISearch"
        @keydown.ctrl.r.exact.prevent="cycleReverseISearch"
        @keydown.esc.exact="hideReverseISearch()"
        @keyup.arrow-left.exact="setCursorPosition($refs.queryRef.selectionStart)"
        @keyup.arrow-right.exact="setCursorPosition($refs.queryRef.selectionStart)"
        @keyup.end.exact="setCursorPosition($refs.queryRef.selectionStart)"
        @keyup.enter.exact="submit">': {{ local.query }}
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
  onBeforeUnmount,
  reactive,
  nextTick,
  computed
} from 'vue'
import {
  and,
  or,
  xor
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
const isReverseISearch = ref(false)
const multilineQueryRefs = ref(null)
const placeholder = ref('')
const reverseISearch = ref('')
const reverseISearchRef = ref(null)
const reverseISearchStatus = ref('reverse-i-search')
const queryRef = ref(null)

const local = reactive({
  prompt: terminal.value.prompt,
  query: ''
})
const multilineQueries = reactive([])

const isBeforeReverseISearch = computed(() => {
  return index => xor(
    !isReverseISearch.value,
    and(
      isReverseISearch.value,
      lt(index, size(multilineQueries) - 1)
    )
  )
})
const isOutdatedMultilineQuery = computed(() => {
  return index => or(
    isOutdated.value,
    and(
      !isEmpty(multilineQueries),
      !eq(index, size(multilineQueries) - 1)
    )
  )
})
const isOutdatedQuery = computed(() => {
  return or(isOutdated.value, !isEmpty(multilineQueries))
})
// Returns the last query or last multiline query
const lastQuery = computed(() => {
  if (isEmpty(multilineQueries)) {
    return local.query
  }

  // Return last multiline query
  const lastMultilineQuery = last(multilineQueries)
  return lastMultilineQuery
})
const shouldShowQuery = computed(() => {
  return or(
    !isReverseISearch.value,
    and(
      isReverseISearch.value,
      !isEmpty(multilineQueries)
    )
  )
})

// Autocompletes a command and calls the options resolver with found program and
// parsed query if there are more than two arguments
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

      // Invalidate query since a new one will be created
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
const cycleReverseISearch = () => {
  // TODO
}
// Focuses the last query or multiline query
const focus = () => {
  if (isEmpty(multilineQueries)) {
    queryRef.value.focus()
    return
  }

  const lastMultilineQueryRef = last(multilineQueryRefs.value)
  lastMultilineQueryRef.focus()
}
// Hides reverse I search and focused last query
const hideReverseISearch = async () => {
  isReverseISearch.value = false

  // Focus last query
  await nextTick()
  focus()
}
// Resizes the reverse I search input according to its length
const resizeReverseISearch = () => {
  reverseISearchRef.value.style.width = `${parseInt(reverseISearch.value.length)}ch`
}
// Cancels the current query or multiline query and creates a new query
const sigint = () => {
  if (isEmpty(multilineQueries)) {
    // "setQuery" would overwrite the parent query while we only need to
    // overwrite the locale one
    local.query = `${local.query}^C`
  }

  if (!isEmpty(multilineQueries)) {
    const lastMultilineQuery = last(multilineQueries)
    setLastMultilineQuery(`${lastMultilineQuery}^C`)
  }

  // Invalidate current query
  isOutdated.value = true
  appendToHistory(createQuery())
}
// Sets the last multiline query
const setLastMultilineQuery = multilineQuery => {
  set(multilineQueries, size(multilineQueries) - 1, multilineQuery)
}
// Shows and focuses the reverse I search
const showReverseISearch = async () => {
  isReverseISearch.value = true

  // Wait for DOM
  await nextTick()
  reverseISearchRef.value.focus()
}
// Deactivates this query or spawns eventually new multiline queries and finally
// dispatches the query to execute it
const submit = async () => {
  // Check query for new multiline request
  if (and(
    // Look for "\"
    eq(lastQuery.value.at(-1), '\\'),
    // Ignore "\\"
    !eq(lastQuery.value.slice(-2), '\\\\')
  )) {
    multilineQueries.push('')

    // Focus newest multiline query. "autofocus" doesn't seem to work
    await nextTick()
    const lastMultilineQueryRef = last(multilineQueryRefs.value)
    lastMultilineQueryRef.focus()

    return
  }

  // No new multiline query requested
  isOutdated.value = true
  // No reverse I search anymore requested
  isReverseISearch.value = false

  // Concatenate base query with multiline queries and remove slashes and white
  // spaces
  const query = local.query
    .concat(join(multilineQueries, ''))
    .replaceAll(/(?<!\\)\\(?!\\)/g, '')
    .trim()

  // Dispatch the query to the parent
  dispatch(query)
}

const unwatchMultilineQueries = watch(multilineQueries, async () => {
  await nextTick()

  const lastMultilineQueryRef = last(multilineQueryRefs.value)
  // Apply given cursor position to actual cursor position
  setCursorPosition(lastMultilineQueryRef.selectionStart)
})
const unwatchLocalQuery = watch(() => local.query, async () => {
  await nextTick()

  // Apply given cursor position to actual cursor position
  setCursorPosition(queryRef.value.selectionStart)
})
const unwatchTerminalCursorPosition = watch(
  () => terminal.value.cursorPosition,
  async cursorPosition => {
    await nextTick()

    // Apply given cursor position to actual cursor position
    queryRef.value.setSelectionRange(cursorPosition, cursorPosition)
  }
)
const unwatchTerminalQuery = watch(
  () => terminal.value.query,
  async query => {
    await nextTick()

    // This allows to mutate the query from outside the component and not only
    // inside a history entry
    local.query = query
  }
)
const unwatchReverseISearch = watch(reverseISearch, () => {
  for (const dispatchedQuery of terminal.value.dispatchedQueries) {
    if (dispatchedQuery.startsWith(reverseISearch.value)) {
      setQuery(dispatchedQuery)

      // Reset status if dispatched query has been found
      reverseISearchStatus.value = 'reverse-i-search'

      return
    }
  }

  reverseISearchStatus.value = 'failed reverse-i-search'
})
const unwatchIsOutdated = watch(isOutdated, () => {
  // Free resources if query, multiline query or reverse I search is
  // outdated/inactive

  signals.off('SIGINT', sigint)
  unwatchLocalQuery()
  unwatchTerminalQuery()
  unwatchTerminalCursorPosition()
  placeholder.value = ''
  unwatchMultilineQueries()
  unwatchIsOutdated()
  unwatchReverseISearch()
})

onMounted(() => {
  // Bind signals
  signals.on('SIGINT', sigint)

  // Set initial query state
  setQuery('')
  setCursorPosition(0)

  // Focus query
  queryRef.value.focus()

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
onBeforeUnmount(() => {
  // If query is removed from history, unsubscribe from "SIGINT"
  signals.off('SIGINT', sigint)
})

defineExpose({
  focus
})
</script>

<style lang="scss">
.vue-command,
.vue-command--invert {

  /* TODO Separate, simplify */

  .vue-command__reverse-i-search {
    .vue-command__reverse-i-search__input {
      caret-color: transparent;
      padding: 0;
      width: 0ch;
    }
  }

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
    .vue-command__multiline-query--invert,
    .vue-command__reverse-i-search__input,
    .vue-command__reverse-i-search__input--invert {
      border: none;
      outline: none;
    }

    .vue-command__query__input,
    .vue-command__query__input--invert,
    .vue-command__multiline-query,
    .vue-command__multiline-query--invert {
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
