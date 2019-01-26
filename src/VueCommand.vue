<template>
  <div @keyup.down="mutatePointerHandler" @keyup.up="mutatePointerHandler" id="vue-command">
    <div id="term" class="term">
      <div class="term-bar">
        <span class="term-title">{{ title }}</span>
      </div>
      <div class="cont">
        <div class="term-cont">
          <div>
            <Stdin @handle="handle($event)"/>

            <div v-for="(io, index) in history" :key="index">
              <Stdout :io="io" class="term-cmd"/>

              <Stdin :is-last="index === progress - 1" :last="last" @handle="handle"/>
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
import yargsParser from 'yargs-parser'

export default {
  props: {
    title: {
      type: String,
      default: 'neil@moon: ~'
    },

    commands: {
      type: Object,
      required: false
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
      } else if (key === 'ArrowDown' && this.pointer < size(this.executed)) {
        this.pointer++
        this.last = this.executed[this.pointer]
      }
    },

    async handle (command) {
      const cmd = head(yargsParser(command)._)

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
</script>

<style lang="scss">
  $background: #111;

  #vue-command {
    html {
      box-sizing: border-box;
    }

    *, *:before, *:after {
      box-sizing: inherit;
    }

    html, body {
      width: 100%;
      background: $background;
    }

    body {
      margin: 0;
    }

    @media only screen and (min-width: 600px) {
      input {
        min-width: 400px;
      }
    }

    @media only screen and (max-width: 320px) {
      input {
        max-width: 120px;
      }
    }

    @media only screen and (max-width: 375px) and (max-width: 375px) {
      input {
        max-width: 120px;
      }
    }

    input {
      background: none;
      border: none;
      outline: none;
      color: #dadfe5;
      font-family: 'Inconsolata', monospace;
      font-size: 1rem;
    }

    div.cont {
      width: 100%;
      height: 100%;
      min-width: 150px;
    }

    #term {
      height: 100%;
      width: 100%;
      background: $background;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;

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
      background-color: $background;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
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
