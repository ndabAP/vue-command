<template>
  <div @keyup.down="mutatePointerHandler" @keyup.up="mutatePointerHandler" id="vue-command">
    <div id="term" :class="{ 'white-bg': whiteTheme, 'dark-bg': !whiteTheme }">
      <div class="term-bar" v-if="!hideTitle">
        <span class="term-title" :class="{
          'dark-font': whiteTheme,
          'white-font': !whiteTheme
        }">{{ title }}</span>
      </div>
      <div class="cont">
        <div class="term-cont">
          <div>
            <stdin
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
  </div>
</template>

<script>
import Stdin from './Stdin'
import Stdout from './Stdout'
import uniq from 'lodash/uniq'
import head from 'lodash/head'
import cloneDeep from 'lodash/cloneDeep'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import yargsParser from 'yargs-parser'

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
      type: Object
    }
  },

  components: { Stdin, Stdout },

  data: () => ({
    history: [],
    executed: [],
    pointer: 0,
    last: '',
    progress: 0
  }),

  updated () {
    const terminal = document.getElementsByTagName('html')[0]
    terminal.scrollTop = terminal.scrollHeight

    const input = document.getElementsByTagName('input')[this.history.length]
    input.focus()
  },

  methods: {
    mutatePointerHandler ({ key }) {
      if (key === 'ArrowUp' && this.pointer > 0) {
        this.pointer--
        this.last = this.executed[this.pointer]
      } else if (key === 'ArrowDown' && this.pointer < size(this.executed) - 1) {
        this.pointer++
        this.last = this.executed[this.pointer]
      }
    },

    async handle (command) {
      const cmd = head(yargsParser(command, this.yargsOptions)._)

      if (isEmpty(cmd)) {
        this.history.push(null)
        this.progress++
      } else {
        let executed = cloneDeep(this.executed)
        executed.push(command)
        executed = uniq(executed)

        this.executed = executed
        this.pointer = size(executed)

        this.progress++

        if (this.commands[cmd]) {
          this.history.push(this.commands[cmd](yargsParser(command, this.yargsOptions)))
        } else this.history.push(`${command}: command not found`)
      }
    }
  }
}
</script>

<style lang="scss">
  $background: #111;

  #vue-command {
    ::-webkit-scrollbar {
      width: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background: #ddd;
      -webkit-border-radius: 8px;
    }

    .dark-bg {
      background: $background;
    }

    .dark-font {
      color: #000;

      a {
        color: white;
      }
    }

    div.cont {
      height: 100%;
      min-width: 150px;
      width: 100%;
    }

    #term {
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

    .white-bg {
      background: #ffffff;
    }

    .white-font {
      color: #ffffff;

      a {
        color: #ffffff;
      }
    }
  }
</style>
