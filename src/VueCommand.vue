<template>
  <div
    @keyup.down="mutatePointerHandler"
    @keyup.up="mutatePointerHandler"
    @keydown.tab="autocomplete"
    class="vue-command"
  >
    <div :class="{ 'white-bg': whiteTheme, 'dark-bg': !whiteTheme }" class="term">

      <div class="term-bar" v-if="!hideBar">
        <span class="term-title" :class="{
          'dark-font': whiteTheme,
          'white-font': !whiteTheme
        }">{{ title }}</span>
      </div>

      <div class="term-std" ref="term-std">
        <div class="term-cont">
          <stdin
            @handle="handle"
            @typing="setCurrent"
            :bus="bus"
            :hide-prompt="hidePrompt"
            :is-last="progress === 0"
            :prompt="prompt"
            :placeholder-text="placeholderText"
            :placeholder-timeout="placeholderTimeout"
            :show-help="showHelp"
            :white-theme="whiteTheme"
            :uid="_uid"/>

          <div v-for="(stdout, index) in history" :key="index">
            <stdout :white-theme="whiteTheme" :stdout="stdout" class="term-stdout"/>

            <stdin
              @handle="handle"
              @typing="setCurrent"
              :bus="bus"
              :hide-prompt="hidePrompt"
              :is-last="index === progress - 1"
              :last-command="last"
              :prompt="prompt"
              :placeholder-text="placeholderText"
              :placeholder-timeout="placeholderTimeout"
              :show-help="showHelp"
              :white-theme="whiteTheme"
              :uid="_uid"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import uniq from 'lodash/uniq'
import has from 'lodash/has'
import head from 'lodash/head'
import cloneDeep from 'lodash/cloneDeep'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import each from 'lodash/each'
import keys from 'lodash/keys'
import invoke from 'lodash/invoke'
import yargsParser from 'yargs-parser'

import Stdin from './Stdin'
import Stdout from './Stdout'
import { ARROW_DOWN_KEY, ARROW_UP_KEY, TAB_KEY } from './constants'

const EventBus = new Vue()

export default {
  props: {
    commands: {
      type: Object,
      required: true
    },

    hideBar: {
      type: Boolean,
      default: false
    },

    hidePrompt: {
      type: Boolean,
      default: false
    },

    showHelp: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: 'neil@moon: ~'
    },

    prompt: {
      type: String,
      default: '~neil@moon:#'
    },

    placeholderText: {
      type: String,
      default: 'Type help'
    },

    placeholderTimeout: {
      type: Number,
      default: 4000
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

  components: { Stdin, Stdout },

  data: () => ({
    // Bus for communication
    bus: EventBus,
    // All executed commands
    history: [],
    // Non-empty executed commands
    executed: [],
    // Current input
    current: '',
    // Last pointed command
    last: '',
    // History command pointer
    pointer: 0
  }),

  updated () {
    const terminal = this.$refs['term-std']
    terminal.scrollTop = terminal.scrollHeight
  },

  computed: {
    // Amount of executed commands
    progress: {
      get () {
        return size(this.history)
      }
    }
  },

  methods: {
    mutatePointerHandler ({ key }) {
      if (key === ARROW_UP_KEY && this.pointer > 0) {
        this.pointer--
        this.last = this.executed[this.pointer]
      } else if (key === ARROW_DOWN_KEY && this.pointer < size(this.executed) - 1) {
        this.pointer++
        this.last = this.executed[this.pointer]
      }
    },

    autocomplete (event) {
      event.preventDefault()

      if (event.key === TAB_KEY && !isEmpty(this.current)) {
        each(keys(this.commands).sort(), command => {
          if (command.startsWith(this.current)) {
            this.bus.$emit('autocomplete', { command, uid: this._uid } )

            return false
          }
        })
      }
    },

    setCurrent (current) {
      this.current = current
    },

    async handle (command) {
      const program = head(yargsParser(command, this.yargsOptions)._)

      if (isEmpty(program)) {
        this.history.push(null)
      } else {
        let executed = cloneDeep(this.executed)
        executed.push(command)
        executed = uniq(executed)

        this.executed = executed
        this.pointer = size(executed)

        if (has(this.commands, program)) {
          const stdout = invoke(this.commands, program, yargsParser(command, this.yargsOptions))
          this.history.push(stdout)
        } else this.history.push(`${command}: command not found`)
      }

      this.setCurrent('')
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
    }
  }
</style>
