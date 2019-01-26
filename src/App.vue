<template>
  <main>
    <h1>vue-command</h1>
    <p>A fully working Vue.js terminal emulator.</p>
    <vue-command
      style="max-width: 600px"
      title="neil@moon ~"
      :commands="commands"
      :styles="{ border: '8px', maxHeight: '150px', minHeight: '325px' }"
      help
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
      pokedex: args => {
        if (args.color && args._[1] === 'pikachu') return 'yellow'

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

<style>
  body {
    display: grid;
    place-items: center;
    height: 95vh;
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
</style>
