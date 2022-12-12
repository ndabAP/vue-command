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
          <x-stdout :component="stdout" />

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
import getOpts from 'getopts'
import { defineProps, onBeforeMount, defineEmits } from 'vue'
import XQuery from '@/components/XQuery.vue'
import XStdout from '@/components/XStdout.vue'
import { createEmptyStdout } from '../library'

const props = defineProps({
  commands: {
    required: false,
    type: Object
  },

  prompt: {
    required: false,
    type: String
  },

  history: {
    required: true,
    type: Array
  },

  parserOptions: {
    default: () => ({}),
    required: false,
    type: Object
  },

  query: {
    default: '',
    required: false,
    type: String
  }
})

const emits = defineEmits(['update:history', 'update:query'])

onBeforeMount(() => {
})

const updateQuery = query => {
  emits('update:query', query)
}

const updateHistory = history => {
  emits('update:history', history)
}

const accommodateTokens = query => {
  // Contains the tokens to merge option-value pairs
  const tokens = []
  // Contains the current token pair for each iteration
  let tokenPairs = []
  const tokenPairsExpression = /[^\s"]+|"([^"]*)"/gi
  // Iterate through all tokens
  do {
    tokenPairs = tokenPairsExpression.exec(query)

    if (tokenPairs != null) {
      tokens.push(tokenPairs[1] ? tokenPairs[1] : tokenPairs[0])
    }
  } while (tokenPairs != null)

  // Contains accommodated tokens to parse
  const accommodatedTokens = []
  let isNextTokenOptionValue = false
  tokens.forEach((token, index) => {
    // Check if next token is option value
    if (isNextTokenOptionValue) {
      isNextTokenOptionValue = false

      return
    }

    // Check if option has value assigned
    if (token.endsWith('=')) {
      // Merge option with value
      accommodatedTokens.push(token + tokens[index + 1])

      isNextTokenOptionValue = true
    } else {
      // Token is not part of option-value pair
      accommodatedTokens.push(token)
    }
  })

  return accommodatedTokens
}

const processQuery = async () => {
  const commands = props.commands
  const history = props.history
  const parserOptions = props.parserOptions
  const query = props.query

  if (query === '') {
    updateHistory([...history, createEmptyStdout()])
    return
  }

  // First token is program
  const program = getOpts(query.trim().split(' '), parserOptions)._[0]

  // Check if command exists
  if (typeof commands[program] === 'function') {
    const stdin = query.trim()

    const accommodatedTokens = accommodateTokens(stdin)
    const parsed = getOpts(accommodatedTokens, parserOptions)

    const component = await Promise.resolve(commands[program](parsed))
    updateHistory([...history, component])
  }
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
