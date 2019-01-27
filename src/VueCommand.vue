<template>
  <div @keyup.down="mutatePointerHandler" @keyup.up="mutatePointerHandler" id="vue-command">
    <div id="term">
      <div class="term-bar" v-if="!hideTitle">
        <span class="term-title">{{ title }}</span>
      </div>
      <div class="cont">
        <div class="term-cont">
          <div>
            <stdin
              :hide-prompt="hidePrompt"
              :prompt="prompt"
              :placeholder-text="placeholderText"
              :is-last="progress === 0"
              :show-help="showHelp"
              @handle="handle($event)"/>

            <div v-for="(io, index) in history" :key="index">
              <stdout :io="io" class="term-cmd"/>

              <stdin
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

    input {
      width: 60%;
      background: none;
      border: none;
      outline: none;
      color: #dadfe5;
      font-family: 'Inconsolata', monospace;
      font-size: 1rem;
    }

    @media only screen and (max-width: 400px) {
      input {
        width: 40%;
      }

      ::-webkit-input-placeholder { /* WebKit browsers */
        color: transparent;
      }
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: transparent;
      }
      ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: transparent;
      }
      :-ms-input-placeholder { /* Internet Explorer 10+ */
        color: transparent;
      }
    }

    div.cont {
      width: 100%;
      height: 100%;
      min-width: 150px;
    }

    #term {
      border: 1px solid $background;
      height: 100%;
      width: 100%;
      background: $background;

      a {
        color: white;
      }
    }

    .term-bar {
      height: 32px;
      width: 100%;
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid #252525;
      justify-content: center;
      top: 0;
    }

    .term-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.85rem;
      color: #ddd;
      margin: auto 0;
    }

    .term-cont {
      font-family: 'Inconsolata', monospace;
      color: #fff;
      padding: 0.5rem;
    }

    .term-caret {
      display: inline-block;
      color: #fff;
      padding: 0;
      margin: 0;
      font-family: inherit;
      font-size: inherit;

      &.blink {
        color: transparent;
      }
    }

    .term-input-hide {
      opacity: 0;
      background: none;
      border: 0;
      color: transparent;
      position: absolute;
    }
  }
</style>
