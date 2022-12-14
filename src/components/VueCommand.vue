<template>
  <div
    ref="vueCommand"
    class="vue-command">
    <div class="vue-command__actions">
      <span class="vue-command__action-button vue-command__action-button--close"></span>
      <span class="vue-command__action-button vue-command__action-button--minimize"></span>
      <span class="vue-command__action-button vue-command__action-button--fullscreen"></span>
    </div>

    <div
      ref="vueCommandContent"
      class="vue-command__content">
      <div
        v-for="(component, index) in local.history"
        v-show="showHistoryEntry(index)"
        :key="index"
        class="vue-command__history-entry">
        <component :is="component" />
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: Programm "help" could be generated
import { parse as parseQuery } from 'shell-quote'
import { defineProps, onBeforeMount, defineEmits, markRaw, defineComponent, ref, provide, watch, reactive, h, computed, onMounted } from 'vue'
import { createCommandNotFound, createQuery, newDefaultHistory } from '@/library'
import isEmpty from 'lodash.isempty'
import head from 'lodash.head'
import isFunction from 'lodash.isfunction'
import get from 'lodash.get'

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

// This will be overwritten for every dispatched query
let parsedQuery = []

const local = reactive({
  cursorPosition: props.cursorPosition,
  executedCommands: props.executedCommands,
  history: props.history,
  historyPosition: props.historyPosition,
  isFullscreen: props.isFullscreen,
  query: props.query
})

const showHistoryEntry = computed(() => {
  return index => !local.isFullscreen || (local.isFullscreen && (index === local.history.length - 1))
})
const isLastHistoryEntry = computed(() => {
  return index => (index === local.history.length - 1)
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

const autoSetHistoryPosition = () => {
  setHistoryPosition(local.executedCommands.size)
}

const dispatch = async query => {
  // [bash, --debug]
  parsedQuery = parseQuery(query)

  if (isEmpty(parsedQuery)) {
    appendToHistory(createQuery())
    return
  }

  addExecutedCommands(query)

  // bash
  const program = head(parsedQuery)
  // Returned command/component
  const getCommand = get(props.commands, program)
  if (isFunction(getCommand)) {
    // Command found
    const command = await Promise.resolve(getCommand(parsedQuery))
    appendToHistory(markRaw(command))
  } else {
    // Command not found
    appendToHistory(createCommandNotFound(program))
  }
}

watch(() => props.cursorPosition, cursorPosition => {
  local.cursorPosition = cursorPosition
})
watch(() => props.executedCommands, executedCommands => {
  local.executedCommands = executedCommands
  autoSetHistoryPosition()
})
watch(() => props.history, history => {
  local.history = history
})
watch(() => props.historyPosition, historyPosition => {
  local.historyPosition = historyPosition
})
watch(() => props.isFullscreen, isFullscreen => {
  local.isFullscreen = isFullscreen
})
watch(() => props.query, query => {
  local.query = query
})

onMounted(() => {
  autoSetHistoryPosition()
})

provide('context', computed(() => ({
  cursorPosition: local.cursorPosition,
  executedCommands: local.executedCommands,
  history: local.history,
  historyPosition: local.historyPosition,
  isFullscreen: local.isFullscreen,
  parsedQuery,
  query: local.query
})))
provide('environment', computed(() => ({
  helpText: props.helpText,
  helpTimeout: props.helpTimeout,
  hidePrompt: props.hidePrompt,
  prompt: props.prompt,
  showHelp: props.showHelp
})))
provide('dispatch', dispatch)
provide('exit', () => {
  // Tear down
  appendToHistory(createQuery())
  autoSetHistoryPosition()
  setFullscreen(false)
  setCursorPosition(0)
  setQuery('')
})
provide('addExecutedCommands', addExecutedCommands)
provide('setCursorPosition', setCursorPosition)
provide('setFullscreen', setFullscreen)
provide('setHistoryPosition', setHistoryPosition)
provide('setQuery', setQuery)
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

  .vue-command__content {
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
}
</style>
