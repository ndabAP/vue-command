<template>
  <div class="vue-command">
    <div class="vue-command__window">
      <div class="vue-command__window__actions">
        <span class="vue-command__window__action-button vue-command__window__action-button--close"></span>
        <span class="vue-command__window__action-button vue-command__window__action-button--minimize"></span>
        <span class="vue-command__window__action-button vue-command__window__action-button--fullscreen"></span>
      </div>

      <div class="vue-command__window__content">
        <div
          v-for="(component, index) in local.history"
          v-show="!isFullscreen || (isFullscreen && index === local.history.length - 1)"
          :key="index"
          class="vue-command__history-entry">
          <component :is="component" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: Programm "help" could be generated
import { parse as parseQuery } from 'shell-quote'
import { defineProps, onBeforeMount, defineEmits, markRaw, defineComponent, ref, provide, watch, reactive, h, computed } from 'vue'
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

  prompt: {
    default: '~$',
    required: false,
    type: String
  },

  showHelp: {
    default: false,
    required: false,
    type: Boolean
  }
})

const emits = defineEmits(['update:history', 'update:cursorPosition'])

const isFullscreen = ref(false)

// A local copy of properties if one of them properties is not given
const local = reactive({
  cursorPosition: props.cursorPosition,
  history: props.history
})

watch(() => props.history, history => {
  local.history = history
})
watch(() => props.cursorPosition, cursorPosition => {
  local.cursorPosition = cursorPosition
})

const appendToHistory = (...components) => {
  local.history.push(...components)
  emits('update:history', local.history)
}

const setCursorPosition = cursorPosition => {
  local.cursorPosition = cursorPosition
  emits('update:cursorPosition', cursorPosition)
}

const setFullscreen = isFullscreenValue => {
  isFullscreen.value = isFullscreenValue
}

const executedPrograms = ref(new Set())

const dispatch = async query => {
  const parsedQuery = parseQuery(query)
  if (isEmpty(parsedQuery)) {
    appendToHistory(createQuery())
    return
  }

  const program = head(parsedQuery)
  const getCommand = get(props.commands, program)
  if (isFunction(getCommand)) {
    const component = await Promise.resolve(getCommand(parsedQuery))
    appendToHistory(markRaw(component))
    executedPrograms.value.add(program)
    return
  }

  appendToHistory(createCommandNotFound(program))
}

provide('context', computed(() => ({
  isFullscreen,
  cursorPosition: local.cursorPosition
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
  setFullscreen(false)
})

provide('setFullscreen', setFullscreen)
provide('setCursorPosition', setCursorPosition)
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

  .vue-command__window {
    background-color: #111316;
    border-radius: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .vue-command__window__actions {
    @include clearfix();
    position: relative;
    padding: 10px;
  }

  .vue-command__window__action-button {
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

  .vue-command__window__action-button--close {
    background-color: #ff5f58;
  }

  .vue-command__window__action-button--minimize {
    background-color: #ffbd2e;
  }

  .vue-command__window__action-button--fullscreen {
    background-color: #29ca41;
  }

  .vue-command__window__content {
    display: block;
    padding: 4px 12px 10px;
    margin: 0;
    white-space: pre-line;
    line-height: 1.33;
    color: $seashell;
    font-size: 1rem;
    font-family: monospace;
    color: #ffffff;

    a,
    span,
    input,
    textarea {
      color: #ffffff;
    }
  }
}
</style>
