<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working Vue.js terminal emulator.</p>

    <vue-command
      :built-in="builtIn"
      :help-timeout="1250"
      :commands="commands"
      :current.sync="current"
      :executed.sync="executed"
      :history.sync="history"
      show-help/>
    <pre>
      <code>
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import klieh from './KliehParty'
import loading from './LoadingAnimation'
import nano from './NanoEditor'
import VueCommand from '../components/VueCommand'
import { createComponent } from '../../lib/index'

export default {
  components: {
    VueCommand
  },

  data: () => ({
    builtIn: {
      clear: undefined,
      help: undefined,
      pwd: undefined
    },

    commands: {
      pokedex: ({ color, _ }) => {
        if (color && _[1] === 'pikachu') {
          return 'yellow'
        }

        // Return help since no match
        return `Usage: pokedex pokemon [option]<br><br>

          Example: pokedex pikachu --color
        `
      },

      klieh: () => klieh,
      loading: () => loading,
      nano: () => nano
    },

    current: '',
    executed: new Set(),
    history: ['']
  }),

  created () {
    const pwd = () => {
      this.executed.delete('pwd')
      this.executed.add('pwd')
      this.history.push(createComponent('/home/neil'))
    }

    const clear = async () => {
      this.history = []
      // Wait for DOM
      await this.$nextTick()
      this.executed.clear()
      this.history = ['']
    }

    const help = async () => {
      this.executed.delete('help')
      await this.$nextTick()
      this.executed.add('help')
      this.history.push(createComponent(`Available programms:<br><br>

        &nbsp;klieh<br>
        &nbsp;loading [--timeout n] [--amount n]<br>
        &nbsp;nano<br>
        &nbsp;pokedex pokemon --color<br>
      `))
    }

    this.builtIn.pwd = pwd
    this.builtIn.clear = clear
    this.builtIn.help = help
  }
}
</script>

<style lang="scss">
$border-radius: 8px;

body {
  display: grid;
  place-items: center;
  height: 95vh;
  margin: 0;

  main {
    margin: 1rem;
    max-width: 400px;
    width: calc(100% - 2rem);
  }

  h1,
  h2,
  h3 {
    font-family: "Inconsolata", monospace;
  }

  p {
    font-family: "Montserrat", sans-serif;
  }

  pre {
    width: 100%;
    padding: 0;
    margin-top: 1em;
    overflow: auto;
    overflow-y: hidden;

    code {
      padding: 10px;
      color: #333;
      margin: 5px;
    }
  }

  .vue-command {
    .term-bar {
      -webkit-border-top-left-radius: $border-radius;
      -webkit-border-top-left-radius: $border-radius;
      -moz-border-top-right-radius: $border-radius;
      -moz-border-top-left-radius: $border-radius;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    .term-std {
      min-height: 300px;
      max-height: 300px;
      overflow-y: scroll;
    }
  }
}
</style>
