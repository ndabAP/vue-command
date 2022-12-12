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
          v-for="(stdout, index) in history"
          :key="index"
          class="vue-command__history-entry">
          <component
            :is="stdout"
            class="vue-command__stdout" />

          <x-query
            :modalValue="query"
            @update:modelValue="updateQuery"
            @enter="processQuery">
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
import { defineProps, onBeforeMount, defineEmits, markRaw, defineComponent, reactive, provide, watch } from 'vue'
import XQuery from '@/components/XQuery.vue'
import XStdout from '@/components/XStdout.vue'
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
    required: true,
    type: Array
  },

  query: {
    default: '',
    required: false,
    type: String
  }
})

const emits = defineEmits(['update:history', 'update:query', 'update:isRunning'])

onBeforeMount(() => {
})

const updateIsRunning = isRunning => {
  emits('update:isRunning', isRunning)
}
const updateQuery = query => {
  emits('update:query', query)
}
const updateHistory = history => {
  emits('update:history', history)
}

const processQuery = async () => {
  const commands = props.commands
  const history = props.history
  const query = props.query
  const isRunning = props.isRunning

  const stdin = parse(query)
  if (stdin.length === 0) {
    updateHistory([...history, createEmptyStdout()])
    return
  }

  const program = stdin[0]
  // Check if command exists
  const command = commands[program]
  if (typeof command === 'function') {
    let stdout = await Promise.resolve(command())
    // Extend component
    stdout = defineComponent({
      extends: stdout,
      setup () {
        provide('terminate', () => updateIsRunning(false))
      },

      computed: {
        context: {
          get () {
            return {
              stdin
            }
          }
        },

        environment: {
          get () {
            return reactive({

            })
          }
        }
      }
    })

    // updateIsRunning(true)
    updateHistory([...history, markRaw(stdout)])
    // updateIsRunning(false)

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
