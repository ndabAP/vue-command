<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working Vue.js terminal emulator.</p>

    <vue-command
      :current="current"
      :commands="commands"
      :executed.sync="executed"
      :history.sync="history"
      :help-timeout="1250"
      :is-in-progress.sync="isInProgress"
      show-help/>
    <pre>
      <code>
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import ChuckNorris from './ChuckNorris'
import KliehParty from './KliehParty'
import LoadingAnimation from './LoadingAnimation'
import NanoEditor from './NanoEditor'
import VueCommand from '../components/VueCommand'
import { createStdout, createDummyStdout } from '../library'

export default {
  components: {
    VueCommand
  },

  data: () => ({
    commands: {
      clear: undefined,
      help: () => createStdout(`Available programms:<br><br>
        &nbsp;clear<br>
        &nbsp;klieh<br>
        &nbsp;loading [--timeout n] [--amount n]<br>
        &nbsp;nano<br>
        &nbsp;norris<br>
        &nbsp;pokedex pokemon --color<br>
        &nbsp;pwd<br>
      `),

      klieh: () => KliehParty,
      loading: () => LoadingAnimation,
      nano: () => NanoEditor,
      norris: () => ChuckNorris,
      pokedex: ({ color, _ }) => {
        // Return help since no match
        let stdout = createStdout(`Usage: pokedex pokemon [option]<br><br>

          Example: pokedex pikachu --color
        `)

        if (color && _[1] === 'pikachu') {
          stdout = createStdout('yellow')
        }

        return stdout
      },

      pwd: () => createStdout('/home/neil')
    },

    current: '',
    executed: new Set(),
    history: [],
    isInProgress: true
  }),

  created () {
    this.commands.clear = () => {
      this.history = []
      // Push dummy Stdout to show Stdin
      return createDummyStdout()
    }
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
