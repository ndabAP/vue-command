<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working Vue.js terminal emulator.</p>

    <vue-moveable
      class="moveable"
      v-bind="moveable"
      @on-click="test"
      @drag="drag"
      @drag-start="setIsDragging(true)"
      @drag-end="setIsDragging(false)">
      <vue-command
        :class="{ dragging: isDragging }"
        :autocompletion-resolver="autocompletionResolver"
        :built-in="builtIn"
        :commands="commands"
        :history.sync="history"
        :help-timeout="1250"
        :prompt="prompt"
        :stdin.sync="stdin"
        show-help>
      </vue-command>
    </vue-moveable>
    <pre>
      <code>
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import VueMoveable from 'vue-moveable'

import ChuckNorris from './ChuckNorris'
import KliehParty from './KliehParty'
import LoadingAnimation from './LoadingAnimation'
import NanoEditor from './NanoEditor'
import VueCommand from '../components/VueCommand'
import { createStdout, createStderr, createDummyStdout } from '../library'

const PROMPT = '~neil@moon:#'

export default {
  components: {
    VueCommand,
    VueMoveable
  },

  data: () => ({
    autocompletionResolver: () => undefined,
    builtIn: {
      // Reverse current Stdin
      reverse: undefined
    },

    commands: {
      // Navigate to home, self and back
      cd: undefined,

      // Clear terminals history
      clear: undefined,

      // Show help
      help: () => createStdout(`Available programms:<br><br>
        &nbsp;cd [dir]<br>
        &nbsp;clear<br>
        &nbsp;hello-world<br>
        &nbsp;klieh<br>
        &nbsp;loading [--timeout n] [--amount n]<br>
        &nbsp;nano<br>
        &nbsp;norris<br>
        &nbsp;pokedex pokemon --color<br>
        &nbsp;pwd<br>
        &nbsp;reverse text<br>
      `),

      // Return simple text
      'hello-world': () => createStdout('Hello world'),

      // Show a animation
      klieh: () => KliehParty,

      // Simulate a loading animation
      loading: () => LoadingAnimation,

      // Nano editor available in many shells
      nano: () => NanoEditor,

      // Return a Chuck Norris joke
      norris: () => ChuckNorris,

      // Return color for Pokemon Pikachu
      pokedex: ({ color, _ }) => {
        if (color && _[1] === 'pikachu') {
          return createStdout('yellow')
        }

        // Return help since no match
        return createStderr(`Usage: pokedex pokemon [option]<br><br>

          Example: pokedex pikachu --color
        `)
      },

      // Show current path
      pwd: () => undefined
    },

    history: [],
    isDragging: false,
    moveable: {
      dragArea: false,
      draggable: true
    },

    prompt: PROMPT,
    stdin: ''
  }),

  created () {
    this.commands.clear = () => {
      this.history = []
      // Push dummy Stdout to show Stdin
      return createDummyStdout()
    }

    this.commands.cd = ({ _ }) => {
      if ((_[1] === 'home' || _[1] === 'home/') && this.prompt === PROMPT) {
        this.prompt = `${PROMPT}/home`

        return createDummyStdout()
      }

      // Navigate from home to root
      if ((_[1] === '../' || _[1] === '..') && this.prompt === `${PROMPT}/home`) {
        this.prompt = PROMPT

        return createDummyStdout()
      }

      // Navigate to self
      if (_[1] === '.' || typeof _[1] === 'undefined') {
        return createDummyStdout()
      }

      return createStderr(`cd: ${_[1]}: No such file or directory`)
    }

    this.commands.pwd = () => {
      // Take current prompt into account
      if (this.prompt === '~neil@moon:#') {
        return createStdout('/')
      } else {
        return createStdout('/home')
      }
    }

    this.builtIn.reverse = stdin => {
      stdin = stdin.trim()
      // Get second argument
      const argument = stdin.split(' ')[1]

      // Do nothing if no argument given
      if (!argument) {
        return
      }

      // Reverse argument
      this.stdin = argument.split('').reverse().join('')
    }

    this.autocompletionResolver = () => {
      // Make sure only programs are autocompleted since there is no support for arguments, yet
      const command = this.stdin.split(' ')
      if (command.length > 1) {
        return
      }

      const autocompleteableProgram = command[0]
      // Collect all autocompletion candidates
      const candidates = []
      const programs = [...Object.keys(this.commands), ...Object.keys(this.builtIn)].sort()
      programs.forEach(program => {
        if (program.startsWith(autocompleteableProgram)) {
          candidates.push(program)
        }
      })

      // Autocompletion resolved into multiple results
      if (this.stdin !== '' && candidates.length > 1) {
        this.history.push({
          // Build table programmatically
          render: createElement => {
            const columns = candidates.length < 5 ? candidates.length : 4
            const rows = candidates.length < 5 ? 1 : Math.ceil(candidates.length / columns)

            let index = 0
            const table = []
            for (let i = 0; i < rows; i++) {
              const row = []
              for (let j = 0; j < columns; j++) {
                row.push(createElement('td', candidates[index]))
                index++
              }

              table.push(createElement('tr', [row]))
            }

            return createElement('table', { style: { width: '100%' } }, [table])
          }
        })
      }

      // Autocompletion resolved into one result
      if (candidates.length === 1) {
        this.stdin = candidates[0]
      }
    }
  },

  methods: {
    drag ({ target, transform }) {
      target.style.transform = transform
    },

    resize ({
      target, width, height, delta
    }) {
      delta[0] && (target.style.width = `${width}px`)
      delta[1] && (target.style.height = `${height}px`)
    },

    setIsDragging (isDragging) {
      this.isDragging = isDragging
    },

    test (event) {
      console.log(event)
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
    -webkit-border-bottom-left-radius: $border-radius;
    -webkit-border-bottom-right-radius: $border-radius;
    -moz-border-bottom-left-radius: $border-radius;
    -moz-border-bottom-right-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;

    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: #252525;
    }

    ::-webkit-scrollbar-thumb {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #333;
    }

    .term-bar {
      -webkit-border-top-left-radius: $border-radius;
      -webkit-border-top-right-radius: $border-radius;
      -moz-border-top-right-radius: $border-radius;
      -moz-border-top-left-radius: $border-radius;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    .term-std {
      min-height: 312px;
      max-height: 312px;
      overflow-y: scroll;
    }
  }

  // Add the desktop grabbing effect
  .dragging {
    cursor: grabbing;
  }

  // Added by the moveable library
  .moveable-line {
    background: none !important;
  }
}
</style>
