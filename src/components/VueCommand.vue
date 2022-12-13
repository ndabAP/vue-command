<template>
  <div ref="vue-command" class="vue-command">
    <div class="window">
      <div class="window__actions">
        <span class="window__actionButton window__actionButton--close"></span>
        <span class="window__actionButton window__actionButton--minimize"></span>
        <span class="window__actionButton window__actionButton--fullscreen"></span>
      </div>

      <div class="window__content">
        <div v-for="(component, index) in local.history" :key="index" class="vue-command__history-entry">
          <component :is="component" />

          <!--
          <x-query
            v-show="index === 0 || !(index === local.history.length - 1 && local.isRunning)"
            :v-if="component.name === 'XQuery'"
            @submit="process">
            <template #prompt>
              <slot name="prompt" />
            </template>
          </x-query> -->
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

const props = defineProps({
  commands: {
    required: false,
    type: Object
  },

  isRunning: {
    default: false,
    required: false,
    type: Boolean
  },

  prompt: {
    required: false,
    type: String
  },

  history: {
    default: newDefaultHistory,
    required: false,
    type: Array
  }
})

const emits = defineEmits(['update:history', 'update:query', 'update:isRunning'])

// Contains a local copy if one of the properties is not given
const local = reactive({
  history: props.history,
  isRunning: props.isRunning
})

const updateIsRunning = isRunning => {
  local.isRunning = isRunning
  emits('update:isRunning', isRunning)
}
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
  // Check if command exists
  const command = props.commands[program]
  if (isFunction(command)) {
    const component = await Promise.resolve(command())
    updateHistory([...history, markRaw(component)])

    return
  }

  updateHistory([...local.history, createCommandNotFound(program)])
}

provide('context', computed(() => ({
  isRunning: local.isRunning
})))
provide('exit', () => {
  updateHistory([...local.history, createQuery()])
})
provide('dispatch', dispatch)

</script>

<style lang="scss">
.vue-command {

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

  $seashell: #f1f1f1;

  .window {
    background-color: #111316;
    border-radius: 10px;
  }

  .window__actions {
    @include clearfix();
    position: relative;
    padding: 10px;
  }

  .window__actionButton {
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

  .window__actionButton--close {
    background-color: #ff5f58;
  }

  .window__actionButton--minimize {
    background-color: #ffbd2e;
  }

  .window__actionButton--fullscreen {
    background-color: #29ca41;
  }

  .window__content {
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
