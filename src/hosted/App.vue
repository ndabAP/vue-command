<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working Vue.js terminal emulator.</p>

    <vue-command
      :built-in="builtIn"
      :commands="commands"
      :current.sync="current"
      :help-timeout="1250"
      :executed="executed"
      :history="history"
      show-help/>
    <pre>
      <code>
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import VueCommand from '../components/VueCommand'

export default {
  components: {
    VueCommand
  },

  data: () => ({
    builtIn: {
      clear: undefined,
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

      help: () => (`List of commands<br><br>

        clear<br>
        pokedex pokemon [option]<br>
        pwd
      `)
    },

    current: '',
    executed: new Set(),
    history: ['']
  }),

  created () {
    this.builtIn.clear = async () => {
      this.history = []
      // Wait for DOM
      await this.$nextTick()
      this.history = ['']

      this.executed.clear()
    }

    this.builtIn.pwd = () => {
      this.executed.delete('pwd')
      this.executed.add('pwd')

      this.history.push('/home/neil')
    }
  }
}
</script>

<style lang="scss">
  body {
    display: grid;
    place-items: center;
    height: 95vh;
    margin: 0;

    main {
      margin: 1rem;
    }

    h1, h2, h3 {
      font-family: 'Inconsolata', monospace;
    }

    p {
      font-family: 'Montserrat', sans-serif;
    }

    pre {
      width: 100%;
      padding: 0;
      margin-top: 1em;
      overflow: auto;
      overflow-y: hidden;
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      border-radius: 8px;

      code {
        padding: 10px;
        color: #333;
        margin: 5px;
      }
    }

    .vue-command {
      .term {
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
      }

      .term-std {
        min-height: 300px;
        max-height: 300px;
        overflow-y: scroll;
      }
    }
  }
</style>
