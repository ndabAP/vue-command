<template>
  <div
    ref="vueCommandRef"
    class="vue-command">
    <slot name="bar">
      <div
        v-if="!hideBar"
        class="vue-command__bar">
        <!-- TODO Emit unique event per button -->
        <span class="vue-command__bar__button vue-command__bar__button--close"></span>
        <span class="vue-command__bar__button vue-command__bar__button--minimize"></span>
        <span class="vue-command__bar__button vue-command__bar__button--fullscreen"></span>
      </div>
    </slot>

    <div
      ref="vueCommandHistoryRef"
      class="vue-command__history"
      @click="autoFocus">
      <div
        v-for="(component, index) in local.history"
        v-show="shouldShowHistoryEntry(index)"
        :key="index"
        :class="{
          'vue-command__history__entry': true,
          'vue-command__history__entry--fullscreen': shouldBeFullscreen(index)
        }">
        <!-- User given components like bash and query -->
        <component
          :is="component"
          ref="vueCommandHistoryEntryComponentRefs"
          class="vue-command__history__entry__component" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineExpose,
  defineProps,
  defineEmits,
  markRaw,
  defineComponent,
  provide,
  watch,
  reactive,
  h,
  computed,
  onMounted,
  nextTick,
  getCurrentInstance
} from 'vue'
import {
  createCommandNotFound,
  createQuery,
  defaultParser,
  newDefaultHistory,
  newDefaultEventResolver
} from '@/library'
import {
  and,
  or
} from '@/utils'
import head from 'lodash.head'
import isFunction from 'lodash.isfunction'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import last from 'lodash.last'
import eq from 'lodash.eq'
import nth from 'lodash.nth'
import lt from 'lodash.lt'

const props = defineProps({
  commands: {
    default: () => ({}),
    required: false,
    type: Object
  },

  cursorPosition: {
    default: 0,
    required: false,
    type: Number
  },

  dispatchedQueries: {
    // A set makes it possible to have unique values
    default: new Set(),
    required: false,
    type: Set
  },

  eventResolver: {
    default: () => newDefaultEventResolver(),
    required: false,
    type: Array
  },

  helpText: {
    required: false,
    type: String
  },

  helpTimeout: {
    default: 3000,
    required: false,
    type: Number
  },

  hideBar: {
    default: false,
    required: false,
    type: Boolean
  },

  hidePrompt: {
    default: false,
    required: false,
    type: Boolean
  },

  history: {
    default: () => newDefaultHistory(),
    required: false,
    type: Array
  },

  // TODO Eventually remove this since its a built-in feature
  historyPosition: {
    default: 0,
    required: false,
    type: Number
  },

  isFullscreen: {
    default: false,
    required: false,
    type: Boolean
  },

  // Called with the found program, parsed query and query setter
  optionsResolver: {
    default: null,
    required: false,
    type: Function
  },

  parser: {
    // See: https://vuejs.org/guide/components/props.html#prop-validation
    default: query => defaultParser(query),
    required: false,
    type: Function
  },

  prompt: {
    default: '~$',
    required: false,
    type: String
  },

  showHelp: {
    default: false,
    required: false,
    type: Boolean
  },

  query: {
    default: '',
    required: false,
    type: String
  }
})

// Update user given properties
const emits = defineEmits([
  'update:cursorPosition',
  'update:dispatchedQueries',
  'update:history',
  'update:historyPosition',
  'update:isFullscreen',
  'update:query'
])

// DOM references
const vueCommandHistoryEntryComponentRefs = ref(null)
const vueCommandHistoryRef = ref(null)
const vueCommandRef = ref(null)

// A local copy to allow the absence of properties
const local = reactive({
  cursorPosition: props.cursorPosition,
  dispatchedQueries: props.dispatchedQueries,
  history: props.history,
  historyPosition: props.historyPosition,
  isFullscreen: props.isFullscreen,
  prompt: props.prompt,
  query: props.query
})

// Reactive terminal state
const terminal = computed(() => ({
  cursorPosition: local.cursorPosition,
  dispatchedQueries: local.dispatchedQueries,
  history: local.history,
  historyPosition: local.historyPosition,
  isFullscreen: local.isFullscreen,
  prompt: local.prompt,
  query: local.query
}))

// Provided commands as programs. It takes the keys of the commands object
const programs = computed(() => {
  return Object.keys(props.commands)
})

// If the terminal is in fullscreen mode, it hides any non-active history
// entries
const shouldShowHistoryEntry = computed(() => {
  return index => or(
    !local.isFullscreen,
    and(local.isFullscreen, eq(index, local.history.length - 1))
  )
})
const shouldBeFullscreen = computed(() => {
  return index => and(local.isFullscreen, eq(index, local.history.length - 1))
})

// Removes and adds the dispatched query to enforce the quries first position
const addDispatchedQuery = dispatchedQuery => {
  local.dispatchedQueries.delete(dispatchedQuery)
  local.dispatchedQueries.add(dispatchedQuery)
  emits('update:dispatchedQueries', local.dispatchedQueries)
}

const appendToHistory = (...components) => {
  local.history.push(...components)
  emits('update:history', local.history)
}

const incrementHistory = () => {
  // History pointer must be lower query history
  if (!lt(local.historyPosition, local.dispatchedQueries.size)) {
    return
  }

  setHistoryPosition(local.historyPosition + 1)
  const query = nth([...local.dispatchedQueries], local.historyPosition)
  setQuery(query)
}

const decrementHistory = () => {
  // History pointer must be greater zero
  if (eq(local.historyPosition, 0)) {
    return
  }

  setHistoryPosition(local.historyPosition - 1)
  const query = nth([...local.dispatchedQueries], local.historyPosition)
  setQuery(query)
}

const setCursorPosition = cursorPosition => {
  local.cursorPosition = cursorPosition
  emits('update:cursorPosition', cursorPosition)
}

const setFullscreen = isFullscreen => {
  local.isFullscreen = isFullscreen
  emits('update:isFullscreen', isFullscreen)
}

const setHistoryPosition = historyPosition => {
  local.historyPosition = historyPosition
  emits('update:historyPosition', historyPosition)
}

const setQuery = query => {
  local.query = query
  emits('update:query', query)
}

// Focuses to the last query input if the last history entry is a query input
const autoFocus = () => {
  // Not the query needs to maintain the validation upon focus but rather the
  // terminal itself

  if (local.isFullscreen) {
    return
  }

  // Only focus if last history entry is query
  const lastHistoryEntry = last(local.history)
  // TODO Find a better way to verify that
  if (!eq(get(lastHistoryEntry, '__name'), 'VueCommandQuery')) {
    return
  }

  // Do the actual focus
  const lastHistoryEntryRef = last(vueCommandHistoryEntryComponentRefs.value)
  const focus = get(lastHistoryEntryRef, 'focus')
  focus()
}

// Sets history position by given dispatched queries
const autoHistoryPosition = () => {
  setHistoryPosition(local.dispatchedQueries.size)
}

// Parses the query, looks for a user given command and appends the resulting
// component to the history
const dispatch = async query => {
  // An empty query is an empty string
  if (isEmpty(query)) {
    appendToHistory(createQuery())
    return
  }
  // bash --help
  addDispatchedQuery(query)

  // ['bash', '--help']
  const parsedQuery = props.parser(query)
  // bash, make, sh
  const program = head(defaultParser(query))
  const getCommand = get(props.commands, program)

  // Check if command was provided
  if (!isFunction(getCommand)) {
    // Command not found
    appendToHistory(createCommandNotFound(program))
    return
  }

  // Command found, resolving it
  const command = await Promise.resolve(getCommand(parsedQuery))

  // If returned component is query, don't provide any context and push
  // instantly to history
  if (eq(get(command, '__name'), 'VueCommandQuery')) {
    const query = command
    appendToHistory(query)
    return
  }

  // Command is user created component. Decorate component
  const component = defineComponent({
    provide () {
      return {
        // This will be unique for the component and not reactive by design
        context: {
          rawQuery: query,
          parsedQuery
        }
      }
    },

    // This nesting makes it possible to provide the context
    render: () => h(command)
  })
  appendToHistory(markRaw(component))
}

// Tear down component and execute final steps
const exit = () => {
  // TODO Does order matter?
  appendToHistory(createQuery())
  autoHistoryPosition()
  setCursorPosition(0)
  setFullscreen(false)
  setQuery('')
}

// Waits for the DOM and scrolls to the bottom of the history
const scrollToBottom = async () => {
  await nextTick()
  vueCommandHistoryRef.value.scrollTop = vueCommandHistoryRef.value.scrollHeight
}

watch(local.history, async () => {
  // Scroll to bottom if history was mutated
  // TODO Listen for some query ready event and scroll only then since its
  // triggered by a history change whose entries might not done loading
  await scrollToBottom()
})
// Mirror user properties with local ones
watch(() => props.cursorPosition, cursorPosition => {
  local.cursorPosition = cursorPosition
})
watch(() => props.dispatchedQueries, dispatchedQueries => {
  local.dispatchedQueries = dispatchedQueries
  // User has to take care of new history position
})
watch(() => props.history, history => {
  local.history = history
  // User has to take care of new executed programs and history position
})
watch(() => props.historyPosition, historyPosition => {
  local.historyPosition = historyPosition
  // User has to take care of new query
  // TODO Really?
})
watch(() => props.isFullscreen, isFullscreen => {
  local.isFullscreen = isFullscreen
})
watch(() => props.prompt, prompt => {
  local.prompt = prompt
})
watch(() => props.query, query => {
  local.query = query
  // Cursor position gets automatically updated in query component
})

onMounted(() => {
  // Binds given event listeners and calls them with the terminals references
  // and exposed methods and values
  const currentInstance = getCurrentInstance()
  for (const bindEventListener of props.eventResolver) {
    bindEventListener(currentInstance.refs, currentInstance.exposed)
  }
})

provide('addDispatchedQuery', addDispatchedQuery)
provide('appendToHistory', appendToHistory)
provide('dispatch', dispatch)
provide('decrementHistory', decrementHistory)
provide('exit', exit)
provide('helpText', props.helpText)
provide('helpTimeout', props.helpTimeout)
provide('hidePrompt', props.hidePrompt)
provide('incrementHistory', incrementHistory)
provide('optionsResolver', props.optionsResolver)
provide('parser', props.parser)
provide('programs', programs)
provide('setCursorPosition', setCursorPosition)
provide('setFullscreen', setFullscreen)
provide('setHistoryPosition', setHistoryPosition)
provide('showHelp', props.showHelp)
provide('setQuery', setQuery)
provide('terminal', terminal)

defineExpose({
  addDispatchedQuery,
  appendToHistory,
  decrementHistory,
  dispatch,
  exit,
  incrementHistory,
  programs,
  setCursorPosition,
  setFullscreen,
  setHistoryPosition,
  setQuery,
  terminal
})
</script>

<style lang="scss">
.vue-command {
  $seashell: #f1f1f1;

  @mixin clearfix() {

    &:before,
    &:after {
      content: " ";
      display: table;
    }

    &:after {
      clear: both;
    }
  }

  overflow-y: hidden;
  overflow-x: hidden;

  .vue-command__bar {
    @include clearfix();
    position: inherit;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #111316;
  }

  .vue-command__bar__button {
    display: inline-block;
    border-radius: 100%;

    &:before {
      content: ' ';
      display: block;
      height: 12px;
      width: 12px;
    }

    &:not(:last-child) {
      margin-right: 7px;
    }
  }

  .vue-command__bar__button--close {
    background-color: #ff5f58;
  }

  .vue-command__bar__button--minimize {
    background-color: #ffbd2e;
  }

  .vue-command__bar__button--fullscreen {
    background-color: #29ca41;
  }

  .vue-command__history {
    overflow: auto;
    word-break: break-all;
    background-color: #111316;
    display: block;
    padding: 12px 12px 12px 12px;
    margin: 0;
    white-space: pre-line;
    line-height: 1.33;
    color: $seashell;
    font-size: 1rem;
    font-family: monospace;
    color: #ffffff;
    height: 100%;

    /* Provide reasonable default values */
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    input,
    textarea {
      background: none;
      border: none;
      outline: none;
      flex: 1;
      width: 100%;
      font-size: 1rem;
      resize: none;
      overflow: hidden;
      color: #ffffff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .vue-command__history__entry--fullscreen {
    height: 100%;
  }
}
</style>
