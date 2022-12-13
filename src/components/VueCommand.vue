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
          :key="index"
          class="vue-command__history-entry">
          <component :is="component" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { parse as parseCommand } from 'shell-quote'
import { defineProps, onBeforeMount, defineEmits, markRaw, defineComponent, ref, provide, watch, reactive, h, computed } from 'vue'
import { createEmptyStdout, createCommandNotFound, createQuery, newDefaultHistory } from '@/library'
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

  prompt: {
    default: '~$',
    required: false,
    type: String
  },

  history: {
    default: newDefaultHistory,
    required: false,
    type: Array
  }
})

const emits = defineEmits(['update:history', 'update:query'])

// Contains a local copy if one of the properties is not given
const local = reactive({
  history: props.history
})

const updateHistory = history => {
  local.history = history
  emits('update:history', history)
}

const dispatch = async query => {
  const parsedCommand = parseCommand(query)
  if (isEmpty(parsedCommand)) {
    updateHistory([...local.history, createQuery()])
    return
  }

  const program = head(parsedCommand)
  const command = get(props.commands, program)
  if (isFunction(command)) {
    const component = await Promise.resolve(command())
    updateHistory([...local.history, markRaw(component)])
    return
  }

  updateHistory([...local.history, createCommandNotFound(program)])
}

provide('context', computed(() => ({
})))
provide('environment', computed(() => ({
  prompt: props.prompt
})))
provide('exit', () => {
  updateHistory([...local.history, createQuery()])
})
provide('dispatch', dispatch)
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
    padding: 10px 10px 10px;
    margin: 0;
    white-space: pre-line;
    line-height: 1.33;
    color: $seashell;
    font-size: 1rem;
    font-family: monospace;
  }
}
</style>
