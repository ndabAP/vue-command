<template>
  <div
    ref="vue-command"
    class="vue-command">
    <div class="window">
      <div class="window__actions">
        <span class="window__actionButton window__actionButton--close"></span>
        <span class="window__actionButton window__actionButton--minimize"></span>
        <span class="window__actionButton window__actionButton--fullscreen"></span>
      </div>

      <div class="window__content">
        <div
          v-for="(stdout, index) in local.history"
          :key="index"
          class="vue-command__history-entry">
          <component
            :is="stdout"
            class="vue-command__history-stdout" />
          <x-query
            v-if="index === 0 || !(index === local.history.length - 1 && local.isRunning)"
            class="vue-command__history_query"
            :is-active="index === 0 || index === (local.history.length - 1)"
            :is-running="local.isRunning"
            :modalValue="local.query"
            @update:modelValue="updateQuery"
            @submit="onSubmitQuery">
            <template #prompt>
              <slot name="prompt" />
            </template>
          </x-query>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { parse } from 'shell-quote'
import { defineProps, onBeforeMount, defineEmits, markRaw, defineComponent, ref, provide, watch, reactive, h } from 'vue'
import XQuery from '@/components/XQuery.vue'
import { createEmptyStdout, createCommandNotFound } from '@/library'

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
    default: () => [markRaw(createEmptyStdout())],
    required: false,
    type: Array
  },

  query: {
    default: '',
    required: false,
    type: String
  }
})

const emits = defineEmits(['update:history', 'update:query', 'update:isRunning'])

const local = reactive({
  history: props.history,
  isRunning: props.isRunning,
  query: props.query
})

const updateIsRunning = isRunning => {
  local.isRunning = isRunning
  emits('update:isRunning', isRunning)
}
const updateQuery = query => {
  local.query = query
  emits('update:query', query)
}
const updateHistory = history => {
  local.history = history
  emits('update:history', history)
}

const onSubmitQuery = async () => {
  updateIsRunning(true)

  const commands = props.commands
  const history = local.history
  const query = local.query

  const stdin = parse(query)
  if (stdin.length === 0) {
    updateHistory([...history, createEmptyStdout()])
    return
  }

  const program = stdin[0]
  // Check if command exists
  const command = commands[program]
  if (typeof command === 'function') {
    const stdout = await Promise.resolve(command())
    // Extend component
    const component = defineComponent({
      setup () {
        provide('context', reactive({
          isRunning: props.isRunning
        }))

        provide('terminate', () => updateIsRunning(false))
      },

      render () {
        return h(stdout)
      }
    })

    updateHistory([...history, markRaw(component)])

    return
  }

  updateHistory([...history, createCommandNotFound(program)])
}
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
  }
}
</style>
