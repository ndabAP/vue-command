<template>
  <div
    @keyup.down="mutatePointerHandler"
    @keyup.up="mutatePointerHandler"
    @keydown.tab="autocomplete"
    class="vue-command"
  >
    <div :class="{ 'white-bg': whiteTheme, 'dark-bg': !whiteTheme }" class="term">

      <div class="term-bar" v-if="!hideTitle">
        <span class="term-title" :class="{
          'dark-font': whiteTheme,
          'white-font': !whiteTheme
        }">{{ title }}</span>
      </div>

      <div class="cont" ref="term-cont">
        <div class="term-cont">
          <stdin
            @typing="setCurrent"
            :white-theme="whiteTheme"
            :hide-prompt="hidePrompt"
            :prompt="prompt"
            :placeholder-text="placeholderText"
            :is-last="progress === 0"
            :show-help="showHelp"
            @handle="handle($event)"/>

          <div v-for="(io, index) in history" :key="index">
            <stdout :white-theme="whiteTheme" :io="io" class="term-cmd"/>

            <stdin
              @typing="setCurrent"
              :white-theme="whiteTheme"
              :hide-prompt="hidePrompt"
              :prompt="prompt"
              :placeholder-text="placeholderText"
              :is-last="index === progress - 1"
              :last-command="last"
              :show-help="showHelp"
              @handle="handle"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import uniq from 'lodash/uniq'
import has from 'lodash/has'
import head from 'lodash/head'
import cloneDeep from 'lodash/cloneDeep'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import each from 'lodash/each'
import keys from 'lodash/keys'
import yargsParser from 'yargs-parser'

import Stdin from './Stdin'
import Stdout from './Stdout'
import { ARROW_DOWN_KEY, ARROW_UP_KEY, TAB_KEY } from './constants'

export default {
  props: {
    commands: {
      type: Object,
      required: true
    },

    hideTitle: {
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

    whiteTheme: {
      type: Boolean,
      default: false
    },

    yargsOptions: {
      type: Object,
      default: {}
    }
  },

  components: {Stdin, Stdout},

  data: () => ({
    // All executed commands
    history: [],
    // Non-empty executed commands
    executed: [],
    // Current input
    current: '',
    // Last pointed command
    last: '',
    // History command pointer
    pointer: 0,
    // Amount of executed commands
    progress: 0
  }),

  updated () {
    const terminal = this.$refs['term-cont']
    terminal.scrollTop = terminal.scrollHeight
  },

  methods: {
    mutatePointerHandler ({key}) {
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
            this.$_bus.$emit('autocomplete', command)

            return false
          }
        })
      }
    },

    setCurrent (current) {
      this.current = current
    },

    async handle (command) {
      const cmd = head(yargsParser(command, this.yargsOptions)._)

      if (isEmpty(cmd)) {
        this.history.push(null)
      } else {
        let executed = cloneDeep(this.executed)
        executed.push(command)
        executed = uniq(executed)

        this.executed = executed
        this.pointer = size(executed)

        if (has(this.commands, cmd)) {
          this.history.push(this.commands[cmd](yargsParser(command, this.yargsOptions)))
        } else this.history.push(`${command}: command not found`)
      }

      this.setCurrent('')
      this.progress++
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

    .vue-command:first-child {
      border: 1px solid $background;
      height: 100%;
      width: 100%;
    }

    .term-bar {
      border-bottom: 1px solid #252525;
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
      padding: 0.5rem;
    }

    .term-caret {
      color: #fff;
      display: inline-block;
      font-family: inherit;
      font-size: inherit;
      margin: 0;
      padding: 0;

      &.blink {
        color: transparent;
      }
    }

    .term-input-hide {
      background: none;
      border: 0;
      color: transparent;
      opacity: 0;
      position: absolute;
    }
  }
</style>
