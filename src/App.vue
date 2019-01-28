<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working Vue.js terminal emulator.</p>

    <vue-command
      :yargs-options="{ alias: { color: ['colour'] } }"
      title="neil@moon ~"
      :commands="commands"
      show-help
    />

    <pre>
      <code>
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import VueCommand from './VueCommand'

export default {
  components: {
    VueCommand
  },

  data: () => ({
    commands: {
      pokedex: ({ color, _ }) => {
        if (color && _[1] === 'pikachu') return 'yellow'

        return `Usage: pokedex pokemon [option]<br><br>

        Example: pokedex pikachu --color
        `
      },

      help: () => (`Usage: pokedex pokemon [option]<br><br>

        Example: pokedex pikachu --color
      `)
    }
  })
}
</script>

<style lang="scss">
  body {
    display: grid;
    place-items: center;
    height: 95vh;
    margin: 0;
  }

  h1 {
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
  }

  pre code {
    padding: 10px;
    color: #333;
    margin: 5px;
  }

  .vue-command {
    .term {
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      border-radius: 8px;
    }

    .cont {
      min-height: 300px;
      max-height: 300px;
      overflow-y: scroll;
    }
  }
</style>
