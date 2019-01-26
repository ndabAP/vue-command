<template>
  <div @keyup.down="mutatePointerHandler" @keyup.up="mutatePointerHandler" id="vue-command">
    <div id="term" :style="{
      borderRadius: styles.border
    }">
      <div class="term-bar" v-if="!hideTitle">
        <span class="term-title">{{ title }}</span>
      </div>
      <div class="cont" :style="{
        maxHeight: styles.maxHeight,
        overflowX: 'auto',
        minHeight: styles.minHeight
      }">
        <div class="term-cont">
          <div>
            <stdin @handle="handle($event)" :is-last="progress === 0" :help="help"/>

            <div v-for="(io, index) in history" :key="index">
              <stdout :io="io" class="term-cmd"/>

              <stdin :is-last="index === progress - 1" :last="last" :help="help" @handle="handle"/>
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
    title: {
      type: String,
      default: 'neil@moon: ~'
    },

    hideTitle: {
      type: Boolean,
      default: false
    },

    commands: {
      type: Object,
      required: false
    },

    styles: {
      border: 0,
      stylesHeight: 'initial',
      minHeight: 'initial'
    },

    help: {
      type: Boolean,
      default: false
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
      const cmd = head(yargsParser(command)._)

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
          this.history.push(this.commands[cmd](yargsParser(command)))
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
    }

    input {
      background: none;
      border: none;
      outline: none;
      color: #dadfe5;
      font-family: 'Inconsolata', monospace;
      font-size: 1rem;
    }

    @media only screen and (max-width: 400px) {
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

    .term-cmd {
      background: none;
      margin: 0;
      border: 0;
      color: inherit;
      font-family: inherit;
      font-size: 1rem;
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
