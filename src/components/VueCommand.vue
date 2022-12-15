<template>
  <div
    ref="vueCommandRef"
    class="vue-command">
    <div class="vue-command__actions">
      <span class="vue-command__action-button vue-command__action-button--close"></span>
      <span class="vue-command__action-button vue-command__action-button--minimize"></span>
      <span class="vue-command__action-button vue-command__action-button--fullscreen"></span>
    </div>

    <div
      ref="vueCommandHistoryRef"
      class="vue-command__history"
      @click="autoFocus">
      <div
        v-for="(component, index) in local.history"
        v-show="shouldShowHistoryEntry(index)"
        :key="index"
        :class="{
          'vue-command__history__entry-container': true,
          'vue-command__history__entry-container--fullscreen': local.isFullscreen
        }">
        <component
          :is="component"
          ref="vueCommandHistoryEntriesRef"
          class="vue-command__history__entry" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose, defineProps, defineEmits, markRaw, defineComponent, provide, watch, reactive, h, computed, onMounted, nextTick, getCurrentInstance } from 'vue'
import { createCommandNotFound, createQuery, defaultParser, newDefaultHistory, newDefaultEventResolver } from '@/library'
import head from 'lodash.head'
import isFunction from 'lodash.isfunction'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import last from 'lodash.last'
import eq from 'lodash.eq'

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

  eventResolver: {
    default: newDefaultEventResolver,
    required: false,
    type: Array
  },

  executedCommands: {
    default: new Set(),
    required: false,
    type: Set
  },

  helpText: {
    required: false,
    type: String
  },

  helpTimeout: {
    default: 3500,
    required: false,
    type: Number
  },

  hidePrompt: {
    default: false,
    required: false,
    type: Boolean
  },

  history: {
    default: newDefaultHistory,
    required: false,
    type: Array
  },

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

  parser: {
    default: defaultParser,
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

const emits = defineEmits([
  'update:cursorPosition',
  'update:executedCommands',
  'update:history',
  'update:historyPosition',
  'update:isFullscreen',
  'update:query'
])

const vueCommandHistoryEntriesRef = ref(null)
const vueCommandHistoryRef = ref(null)
const vueCommandRef = ref(null)

// A local copy to allow the absence of properties
const local = reactive({
  cursorPosition: props.cursorPosition,
  executedCommands: props.executedCommands,
  history: props.history,
  historyPosition: props.historyPosition,
  isFullscreen: props.isFullscreen,
  query: props.query
})

// Reactive terminal states
const terminal = computed(() => ({
  cursorPosition: local.cursorPosition,
  executedCommands: local.executedCommands,
  history: local.history,
  historyPosition: local.historyPosition,
  isFullscreen: local.isFullscreen,
  query: local.query
}))

// Fullscreen hides any non-active history entries
const shouldShowHistoryEntry = computed(() => {
  return index => !local.isFullscreen || (local.isFullscreen && (index === local.history.length - 1))
})

const appendToHistory = (...components) => {
  local.history.push(...components)
  emits('update:history', local.history)
}

const setCursorPosition = cursorPosition => {
  local.cursorPosition = cursorPosition
  emits('update:cursorPosition', cursorPosition)
}

const addExecutedCommands = executedCommands => {
  local.executedCommands.add(executedCommands)
  emits('update:executedCommands', local.executedCommands)
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

// Sets history position by given executed commands
const autoHistoryPosition = () => {
  setHistoryPosition(local.executedCommands.size)
}

// Waits for the DOM and scrolls to the bottom of the history
const scrollToBottom = async () => {
  await nextTick()
  vueCommandHistoryRef.value.scrollTop = vueCommandHistoryRef.value.scrollHeight
}

// Not the query component needs to maintain the validation upon focus but
// rather the terminal
const autoFocus = () => {
  if (local.isFullscreen) {
    return
  }

  // Only focus if last history entry is query
  const lastHistoryEntry = last(local.history)
  if (!eq(get(lastHistoryEntry, '__name'), 'VueCommandQuery')) {
    return
  }

  // Do the actual focus
  const lastHistoryEntryRef = last(vueCommandHistoryEntriesRef.value)
  const focus = get(lastHistoryEntryRef, 'focus')
  focus()
}

// Parses the query, looks for a user given command and appends the resulting
// component to the history
const dispatch = async query => {
  // An empty query is a empty string
  if (isEmpty(query)) {
    appendToHistory(createQuery())
    return
  }
  // bash --help
  addExecutedCommands(query)

  // ['bash', '--help']
  const parsedQuery = props.parser(query)
  // bash, make, sh
  const program = head(defaultParser(query))
  // Returned command/component
  const getCommand = get(props.commands, program)
  if (isFunction(getCommand)) {
    // Command found
    const command = await Promise.resolve(getCommand(parsedQuery))
    const component = defineComponent({
      provide () {
        return {
          // This will be unique for the component
          context: {
            rawQuery: query,
            parsedQuery
          }
        }
      },

      render: () => h(command)
    })

    appendToHistory(markRaw(component))
    return
  }
  // Command not found

  appendToHistory(createCommandNotFound(program))
}

// Tear down component and execute final steps
const exit = () => {
  appendToHistory(createQuery())
  autoHistoryPosition()
  setCursorPosition(0)
  setQuery('')
  setFullscreen(false)
}

watch([local.history, props.history], async () => {
  await scrollToBottom()
})
watch(() => props.cursorPosition, cursorPosition => {
  local.cursorPosition = cursorPosition
})
watch(() => props.executedCommands, executedCommands => {
  local.executedCommands = executedCommands
  // User has to take care of new history position
})
watch(() => props.history, history => {
  local.history = history
  // User has to take care of new executed programs and history position
})
watch(() => props.historyPosition, historyPosition => {
  local.historyPosition = historyPosition
})
watch(() => props.isFullscreen, isFullscreen => {
  local.isFullscreen = isFullscreen
})
watch(() => props.query, query => {
  local.query = query
  // User has to take care of new cursor position
})

onMounted(() => {
  const currentInstance = getCurrentInstance()
  for (const bindEventListener of props.eventResolver) {
    bindEventListener(currentInstance.refs, currentInstance.exposed)
  }
})

provide('terminal', terminal)
provide('dispatch', dispatch)
provide('exit', exit)
provide('addExecutedCommands', addExecutedCommands)
provide('setCursorPosition', setCursorPosition)
provide('setFullscreen', setFullscreen)
provide('setHistoryPosition', setHistoryPosition)
provide('setQuery', setQuery)
provide('helpText', props.helpText)
provide('helpTimeout', props.helpTimeout)
provide('hidePrompt', props.hidePrompt)
provide('prompt', props.prompt)
provide('showHelp', props.showHelp)

defineExpose({
  addExecutedCommands,
  dispatch,
  exit,
  setCursorPosition,
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

  .vue-command__actions {
    @include clearfix();
    position: inherit;
    padding: 10px;
    background-color: #111316;
  }

  .vue-command__action-button {
    display: inline-block;
    border-radius: 100%;

    &:before {
      content: ' ';
      display: block;
      height: 13px;
      width: 13px;
    }

    &:not(:last-child) {
      margin-right: 7px;
    }
  }

  .vue-command__action-button--close {
    background-color: #ff5f58;
  }

  .vue-command__action-button--minimize {
    background-color: #ffbd2e;
  }

  .vue-command__action-button--fullscreen {
    background-color: #29ca41;
  }

  .vue-command__history {
    overflow: auto;
    background-color: #111316;
    display: block;
    padding: 0 12px 10px;
    margin: 0;
    white-space: pre-line;
    line-height: 1.33;
    color: $seashell;
    font-size: 1rem;
    font-family: monospace;
    color: #ffffff;
    height: 100%;

    input,
    textarea {
      color: #ffffff;
    }
  }

  .vue-command__history__entry-container--fullscreen {
    height: 100%;
  }
}
</style>
