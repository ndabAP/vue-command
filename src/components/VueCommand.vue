<template>
  <div
    ref="vueCommandRef"
    :class="{
      'vue-command': !invert,
      'vue-command--invert': invert
    }">
    <!-- Bar -->
    <slot
      v-if="!hideBar"
      name="bar">
      <div
        :class="{
          'vue-command__bar': !invert,
          'vue-command__bar--invert': invert
        }">
        <div>
          <slot
            v-if="!hideButtons"
            name="buttons">
            <span
              :class="{
                'vue-command__bar__button': !invert,
                'vue-command__bar__button--invert': invert,
                'vue-command__bar__button--fullscreen': !invert,
                'vue-command__bar__button--fullscreen--invert': invert
              }"
              @click="emits('closeClicked')" />
            <span
              :class="{
                'vue-command__bar__button': !invert,
                'vue-command__bar__button--invert': invert,
                'vue-command__bar__button--minimize': !invert,
                'vue-command__bar__button--minimize--invert': invert
              }"
              @click="emits('minimizeClicked')" />
            <span
              :class="{
                'vue-command__bar__button': !invert,
                'vue-command__bar__button--invert': invert,
                'vue-command__bar__button--close': !invert,
                'vue-command__bar__button--close--invert': invert
              }"
              @click="emits('fullscreenClicked')" />
          </slot>
        </div>
        <div>
          <slot
            v-if="!hideTitle"
            name="title">
            <span
              :class="{
                'vue-command__bar__title': !invert,
                'vue-command__bar__title--invert': invert
              }">{{ title }}</span>
          </slot>
        </div>
        <div>&#8203;</div>
      </div>
    </slot>

    <!-- History -->
    <div
      ref="vueCommandHistoryRef"
      :class="{
        'vue-command__history': !invert,
        'vue-command__history--invert': invert
      }"
      @click="autoFocus">
      <div
        v-for="(component, index) in local.history"
        v-show="shouldShowHistoryEntry(index)"
        :key="index"
        :class="{
          'vue-command__history__entry': !invert,
          'vue-command__history__entry--invert': invert,
          'vue-command__history__entry--fullscreen': shouldBeFullscreen(index),
          'vue-command__history__entry--fullscreen--invert': and(
            invert,
            shouldBeFullscreen(index)
          )
        }">
        <!-- Components -->
        <component
          :is="component"
          ref="vueCommandHistoryEntryComponentRefs"
          :class="{
            'vue-command__history__entry__component': !invert,
            'vue-command__history__entry__component--invert': invert
          }" />
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
  getCurrentInstance,
  useSlots
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
  or,
  newEventBus,
  PUBLISH_SYMBOL
} from '@/utils'
import {
  eq,
  size,
  keys,
  get,
  last,
  isEmpty,
  head,
  isFunction,
  nth,
  lt
} from 'lodash'

const slots = useSlots()

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
    default: null,
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

  hideButtons: {
    default: false,
    required: false,
    type: Boolean
  },

  hidePrompt: {
    default: false,
    required: false,
    type: Boolean
  },

  hideTitle: {
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

  invert: {
    default: false,
    required: false,
    type: Boolean
  },

  // An interpreter allows to execute arbitrary code after a query has been
  // dispatched
  interpreter: {
    default: null,
    required: false,
    type: Function
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

  title: {
    default: '~$',
    required: false,
    type: String
  },

  query: {
    default: '',
    required: false,
    type: String
  }
})

// Update user given properties
const emits = defineEmits([
  'closeClicked',
  'minimizeClicked',
  'fullscreenClicked',
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
// Signals like SIGINT or SIGKILL
const signals = reactive(newEventBus())
// Reactive terminal state
const terminal = computed(() => ({
  cursorPosition: local.cursorPosition,
  dispatchedQueries: local.dispatchedQueries,
  history: local.history,
  historyPosition: local.historyPosition,
  invert: props.invert,
  isFullscreen: local.isFullscreen,
  prompt: local.prompt,
  query: local.query
}))

// Provided commands as programs. It takes the keys of the commands object
const programs = computed(() => {
  return keys(props.commands)
})
// Determinates if the given history entry at index should be fullscreen or not
const shouldBeFullscreen = computed(() => {
  return index => and(
    local.isFullscreen,
    eq(index, size(local.history) - 1)
  )
})
// If the terminal is in fullscreen mode, it hides any non-active history
// entries
const shouldShowHistoryEntry = computed(() => {
  return index => or(
    !local.isFullscreen,
    and(local.isFullscreen, eq(index, size(local.history) - 1))
  )
})

// Removes and adds the dispatched query to enforce the queries first position
const addDispatchedQuery = dispatchedQuery => {
  local.dispatchedQueries.delete(dispatchedQuery)
  local.dispatchedQueries.add(dispatchedQuery)
  emits('update:dispatchedQueries', local.dispatchedQueries)
}
// Focuses to the last query, multiline query or reverse I search input if the
// last history entry is a query input
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
  lastHistoryEntryRef.focus()
}
const appendToHistory = (...components) => {
  local.history.push(...components)
  emits('update:history', local.history)
}
// Parses the query, looks for a user given command and appends the resulting
// component to the history
const dispatch = async query => {
  // Call given interpreter to execute arbitrary code, if given
  if (isFunction(props.interpreter)) {
    props.interpreter(query)
    return
  }

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
  // TODO Find a better way to find out the name
  if (eq(get(command, '__name'), 'VueCommandQuery')) {
    appendToHistory(command)
    return
  }

  // Command is user created component. Decorate component
  const component = defineComponent({
    name: 'VueCommandOut',
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
  setCursorPosition(0)
  setFullscreen(false)
  setHistoryPosition(local.dispatchedQueries.size)
  setQuery('')
}
// Decreases the history position about one and sets the new query
const decrementHistory = () => {
  // History pointer must be greater zero
  if (eq(local.historyPosition, 0)) {
    return
  }

  setHistoryPosition(local.historyPosition - 1)
  const query = nth([...local.dispatchedQueries], local.historyPosition)
  setQuery(query)
}
// Increases the history position about one and sets the new query
const incrementHistory = () => {
  // History pointer must be lower query history
  if (!lt(local.historyPosition, local.dispatchedQueries.size)) {
    return
  }

  setHistoryPosition(local.historyPosition + 1)
  const query = nth([...local.dispatchedQueries], local.historyPosition)
  setQuery(query)
}
const sendSignal = signal => {
  signals[PUBLISH_SYMBOL](signal)
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
})
watch(() => props.historyPosition, historyPosition => {
  local.historyPosition = historyPosition
  // User has to take care of new query
})
watch(() => props.isFullscreen, isFullscreen => {
  local.isFullscreen = isFullscreen
})
watch(() => props.prompt, prompt => {
  local.prompt = prompt
})
watch(() => props.query, query => {
  local.query = query
  // Cursor position gets updated in query component
})

onMounted(() => {
  // Binds given event listeners and calls them with the terminals references
  // and exposed properties
  const currentInstance = getCurrentInstance()
  for (const bindEventListener of props.eventResolver) {
    bindEventListener(currentInstance.refs, currentInstance.exposed)
  }

  // Scroll to bottom if history changes
  const resizeObsever = new ResizeObserver(() => {
    // TODO Only scroll to bottom if user scrolled to bottom before
    vueCommandHistoryRef.value.scrollTop = vueCommandHistoryRef.value.scrollHeight
  })
  for (const vueCommandHistoryEntry of vueCommandHistoryRef.value.children) {
    resizeObsever.observe(vueCommandHistoryEntry)
  }
  // If history changes, unobserve all history entries and observe again
  watch(local.history, async () => {
    await nextTick()

    resizeObsever.disconnect()
    for (const vueCommandHistoryEntry of vueCommandHistoryRef.value.children) {
      resizeObsever.observe(vueCommandHistoryEntry)
    }
  })
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
provide('sendSignal', sendSignal)
provide('setCursorPosition', setCursorPosition)
provide('setFullscreen', setFullscreen)
provide('setHistoryPosition', setHistoryPosition)
provide('setQuery', setQuery)
provide('showHelp', props.showHelp)
provide('signals', signals)
provide('slots', slots)
provide('terminal', terminal)

defineExpose({
  addDispatchedQuery,
  appendToHistory,
  decrementHistory,
  dispatch,
  exit,
  incrementHistory,
  programs,
  sendSignal,
  setCursorPosition,
  setFullscreen,
  setHistoryPosition,
  setQuery,
  signals,
  terminal
})
</script>

<style lang="scss">
/* Common attribues */

.vue-command,
.vue-command--invert {
  font-family: Consolas,
    Monaco,
    'Andale Mono',
    'Ubuntu Mono',
    monospace;

  @mixin clearfix() {

    &:before,
    &:after {
      display: table;
    }

    &:after {
      clear: both;
    }
  }

  overflow-x: hidden;
  overflow-y: hidden;

  .vue-command__bar,
  .vue-command__bar--invert {
    @include clearfix();

    display: flex;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    justify-content: space-between;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    position: inherit;
  }

  .vue-command__bar__button,
  .vue-command__bar__button--invert {
    display: inline-block;
    border-radius: 100%;

    &:before {
      content: ' ';
      display: block;
      height: 12px;
      width: 12px;
    }

    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  .vue-command__history--invert,
  .vue-command__history {
    display: block;
    height: 100%;
    line-height: 1.33;
    margin: 0;
    overflow: auto;
    padding: 12px 12px 12px 12px;
    white-space: pre-line;
    word-break: break-all;

    /* Provide reasonable default values */
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    input,
    textarea {
      background: none;
      border: none;
      flex: 1;
      font-size: 1rem;
      outline: none;
      overflow: hidden;
      resize: none;
      width: 100%;
    }
  }

  .vue-command__history__entry--fullscreen {
    height: 100%;
  }
}

/* Individual attribues */

.vue-command {
  $seashell: #f1f1f1;

  .vue-command__bar {
    color: $seashell;
    background-color: #111316;
  }

  .vue-command__bar__title {
    color: $seashell;
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
    background-color: #111316;
    color: $seashell;

    /* Provide reasonable default values */
    input,
    textarea {
      background: none;
      color: #ffffff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.vue-command--invert {
  $seashell-invert: #0e0e0e;

  .vue-command__bar--invert {
    background-color: #eeece9;
  }

  .vue-command__bar__title--invert {
    color: $seashell-invert;
  }

  .vue-command__bar__button--close--invert {
    background-color: #00a0a7;
  }

  .vue-command__bar__button--minimize--invert {
    background-color: #0042d1;
  }

  .vue-command__bar__button--fullscreen--invert {
    background-color: #d635be;
  }

  .vue-command__history--invert {
    background-color: #eeece9;
    color: $seashell-invert;

    /* Provide reasonable default values */
    input,
    textarea {
      background: none;
      color: #000000;

      &::placeholder {
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
