<template>
  <div class="vue-command__query">
    <span
      v-if="!hidePrompt"
      class="vue-command__query__prompt">
      {{ prompt }}
    </span>

    <!-- TODO Move autocomplete and search to terminal -->
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
  onBeforeMount
} from 'vue'
import {
  and
} from '@/utils'
import { defaultParser } from '@/library'
import head from 'lodash.head'
import lt from 'lodash.lt'
import gt from 'lodash.gt'
import isFunction from 'lodash.isfunction'
import trimStart from 'lodash.trimstart'
import isEmpty from 'lodash.isempty'

const dispatch = inject('dispatch')
const hidePrompt = inject('hidePrompt')
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
const autocompleteQuery = () => {
  // An empty query is an empty string
  if (isEmpty(query.value)) {
    return
  }

  // ['bash', '--help']
  const parsedQuery = defaultParser(query.value)
  // bash, make, sh
  const command = head(parsedQuery)

  for (const program of programs.value) {
    // If query starts with program, autcomplete
    if (!program.startsWith(command)) {
      continue
    }

    if (and(
      // Check if query expects autocomplete
      lt(program.length, trimStart(query.value).length),
      // Check if user provided options resolver
      isFunction(optionsResolver) && isFunction(parser))
    ) {
      optionsResolver(program, parser(query.value), setQuery)
      return
    }

    // If query has white spaces at the end, ignore
    if (gt(program.length, trimStart(query.value).length)) {
      setQuery(program)
      return
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
