<template>
  <div
    class="vue-command"
    @keyup.down="mutatePointerHandler"
    @keyup.up="mutatePointerHandler"
    @keydown.tab.prevent="autocomplete">
    <div
      :class="{ 'white-bg': whiteTheme, 'dark-bg': !whiteTheme }"
      class="term">
      <div
        v-if="!hideBar"
        class="term-bar">
        <span
          :class="{
            'dark-font': whiteTheme,
            'white-font': !whiteTheme
          }"
          class="term-title">
          {{ title }}
        </span>
      </div>

      <div
        ref="term-std"
        class="term-std">
        <div class="term-cont">
          <div
            v-if="showIntro"
            :class="{ 'white-font': !whiteTheme, 'dark-font': whiteTheme }">
            {{ intro }}
          </div>
          <stdin
            :bus="bus"
            :hide-prompt="hidePrompt"
            :is-in-progress="isInProgress"
            :is-last="progress === 0"
            :prompt="prompt"
            :help-text="helpText"
            :keep-prompt="keepPrompt"
            :help-timeout="helpTimeout"
            :show-help="showHelp"
            :white-theme="whiteTheme"
            :uid="_uid"
            @handle="handle"
            @typing="setCurrent"/>

          <div
            v-for="(stdout, index) in history"
            :key="index">
            <stdout
              :white-theme="whiteTheme"
              :stdout="stdout"
              class="term-stdout"/>

            <stdin
              :bus="bus"
              :hide-prompt="hidePrompt"
              :is-in-progress="isInProgress"
              :is-last="index === progress - 1"
              :last-command="last"
              :prompt="prompt"
              :help-text="helpText"
              :keep-prompt="keepPrompt"
              :help-timeout="helpTimeout"
              :show-help="showHelp"
              :white-theme="whiteTheme"
              :uid="_uid"
              @handle="handle"
              @typing="setCurrent"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import has from 'lodash/has'
import head from 'lodash/head'
import cloneDeep from 'lodash/cloneDeep'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import each from 'lodash/each'
import keys from 'lodash/keys'
import invoke from 'lodash/invoke'
import trim from 'lodash/trim'
import without from 'lodash/without'
import eq from 'lodash/eq'
import gt from 'lodash/gt'
import lt from 'lodash/lt'
import get from 'lodash/get'
import { and } from 'ramda'
import yargsParser from 'yargs-parser'

import Stdin from './Stdin'
import Stdout from './Stdout'
import { ARROW_DOWN_KEY, ARROW_UP_KEY, TAB_KEY } from './constants'

// Event bus for communication
const EventBus = new Vue()

export default {
  components: { Stdin, Stdout },

  props: {
    commands: {
      type: Object,
      required: true
    },

    helpTimeout: {
      type: Number,
      default: 4000
    },

    hideBar: {
      type: Boolean,
      default: false
    },

    hidePrompt: {
      type: Boolean,
      default: false
    },

    helpText: {
      type: String,
      default: 'Type help'
    },

    intro: {
      type: String,
      default: 'Fasten your seatbelts!'
    },

    keepPrompt: {
      type: Boolean,
      default: false
    },

    notFound: {
      type: String,
      default: 'command not found'
    },

    prompt: {
      type: String,
      default: '~neil@moon:#'
    },

    showHelp: {
      type: Boolean,
      default: false
    },

    showIntro: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: 'neil@moon: ~'
    },

    whiteTheme: {
      type: Boolean,
      default: false
    },

    yargsOptions: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    // Bus for communication
    bus: EventBus,
    // All executed commands
    history: [],
    // Indicates if a command is in progress
    isInProgress: false,
    // Non-empty executed commands
    executed: [],
    // Current input
    current: '',
    // Last pointed command
    last: '',
    // History command pointer
    pointer: 0
  }),

  computed: {
    // Amount of executed commands
    progress: {
      get () {
        return size(this.history)
      }
    }
  },

  watch: {
    current () {
      // Emit the current input as an event
      this.$emit('input', this.current)
    }
  },

  methods: {
    // Lets user navigate through history based on input key
    mutatePointerHandler ({ key }) {
      // Check if pointer is mutable and input key is up key
      const isMutableAndUpKey = and(
        eq(key, ARROW_UP_KEY),
        gt(this.pointer, 0)
      )

      if (isMutableAndUpKey) {
        this.setPointer(this.pointer - 1)
        this.setLast(get(this.executed, this.pointer))
      }

      // Check if pointer is mutable and input key is down key
      const isMutableAndDownKey = and(
        eq(key, ARROW_DOWN_KEY),
        lt(this.pointer, size(this.executed) - 1)
      )

      if (isMutableAndDownKey) {
        this.setPointer(this.pointer + 1)
        this.setLast(get(this.executed, this.pointer))
      }
    },

    // Provides autocompletion for tab key
    autocomplete ({ key }) {
      if (and(eq(key, TAB_KEY), !isEmpty(this.current))) {
        each(keys(this.commands).sort(), command => {
          if (command.startsWith(this.current)) {
            this.bus.$emit('autocomplete', { command, uid: this._uid })

            // Terminate iteration because of successful hit
            return false
          }
        })
      }
    },

    // Handles the command
    async handle (command) {
      // Remove leading and trailing whitespace
      command = trim(command)

      this.$emit('execute', command)

      // Parse the command and try to get the program
      const program = head(yargsParser(command, this.yargsOptions)._)

      if (isEmpty(program)) {
        // Empty stdin
        this.history.push(null)
      } else {
        let executed = cloneDeep(this.executed)
        // Remove duplicate commands for a clear history
        executed = without(executed, command)
        executed.push(command)

        this.setExecuted(executed)
        // Point to latest command plus one
        this.setPointer(size(executed))

        // Check if command has been found
        if (has(this.commands, program)) {
          this.history.push('')
          this.setIsInProgress(true)

          const stdout = await Promise.resolve(
            invoke(this.commands, program, yargsParser(command, this.yargsOptions))
          )

          // Add program result to history
          Vue.set(this.history, size(this.history) - 1, stdout)

          this.setIsInProgress(false)
          this.$emit('executed', command)
        } else this.history.push(`${command}: ${this.notFound}`)
      }

      this.setCurrent('')
    },

    setCurrent (current) {
      this.current = current
    },

    setIsInProgress (isInProgress) {
      this.isInProgress = isInProgress
    },

    setExecuted (executed) {
      this.executed = executed
    },

    setPointer (pointer) {
      this.pointer = pointer
    },

    setLast (last) {
      this.last = last
    }
  }
}
</script>

<style lang="scss">
  @import './scss/mixins';

  .vue-command {
    ::-webkit-scrollbar {
      width: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background: #ddd;
      -webkit-border-radius: 8px;
      border-radius: 8px;
    }

    .term {
      border: 1px solid $background;
    }

    .term-bar {
      border-bottom: 1px solid #252525;
      margin-bottom: 0.5rem;
      display: flex;
      flex-direction: row;
      height: 32px;
      justify-content: center;
      top: 0;
      width: 100%;
    }

    .term-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.85rem;
      margin: auto 0;
    }

    .term-cont {
      font-family: 'Inconsolata', monospace;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }
</style>
