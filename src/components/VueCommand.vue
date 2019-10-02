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
          :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"
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

          <div
            v-for="(stdout, index) in history"
            :key="index">
            <stdout
              v-if="index !== 0"
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
              @cursor="setCursor"
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
import head from 'lodash/head'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import keys from 'lodash/keys'
import trim from 'lodash/trim'
import eq from 'lodash/eq'
import gt from 'lodash/gt'
import lt from 'lodash/lt'
import get from 'lodash/get'
import constant from 'lodash/constant'
import find from 'lodash/find'
import flow from 'lodash/flow'
import split from 'lodash/fp/split'
import { and, inc, dec, when } from 'ramda'

import Stdin from './Stdin'
import Stdout from './Stdout'
import Autocomplete from '../mixins/autocomplete'
import Handle from '../mixins/handle'
import { ARROW_DOWN_KEY, ARROW_UP_KEY } from '../keys'

// Event bus for communication
const EventBus = new Vue()

export default {
  components: { Stdin, Stdout },

  mixins: [Autocomplete, Handle],

  props: {
    autocompletionResolver: {
      type: Object,
      default: () => ({})
    },

    builtIn: {
      type: Object,
      default: () => ({})
    },

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
    // Current cursor position at STDIN
    cursor: 0,
    // All executed commands
    history: [''],
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
    },

    // Is the current input part of available programs
    isCurrentCommand: {
      get () {
        const command = find(keys(this.commands), command => eq(command, trim(this.current)))

        return !isUndefined(command)
      }
    },

    // Returns the program of the current input, if given
    currentProgram: {
      get () {
        return flow([
          split(' '),
          head,
          current => {
            return when(
              () => isUndefined(find(keys(this.commands), command => eq(command, trim(current)))),
              constant(undefined)
            )(current)
          }
        ])(this.current)
      }
    }
  },

  watch: {
    current () {
      // Emit the current input as an event
      this.$emit('input', this.current)

      // Make searching history work again
      if (isEmpty(this.current)) {
        this.setPointer(size(this.executed))
        this.setLast('')
      }
    }
  },

  methods: {
    // Lets user navigate through history based on input key
    mutatePointerHandler ({ key }) {
      // Check if pointer is mutable and input key is up key
      const isMutablePointerAndUpKey = and(
        eq(key, ARROW_UP_KEY),
        gt(this.pointer, 0)
      )

      if (isMutablePointerAndUpKey) {
        this.setPointer(dec(this.pointer))
        this.setLast(get(this.executed, this.pointer))
      }

      // Check if pointer is mutable and input key is down key
      const isMutablePointerAndDownKey = and(
        eq(key, ARROW_DOWN_KEY),
        lt(this.pointer, dec(size(this.executed)))
      )

      if (isMutablePointerAndDownKey) {
        this.setPointer(inc(this.pointer))
        this.setLast(get(this.executed, this.pointer))
      }
    },

    setCurrent (current) {
      this.current = current
    },

    setCursor (cursor) {
      this.cursor = cursor
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
  @import '../scss/mixins';

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
