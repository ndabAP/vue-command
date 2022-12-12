<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working, most feature-rich Vue.js terminal emulator.</p>

    <vue-command :commands="commands">
    </vue-command>
    <pre>
      <code>
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import VueCommand from '../components/VueCommand'
import { createStdout, createHistory } from '../library'
import HelloContext from './HelloContext.vue'

const PROMPT = '~neil@moon:#/'

export default {
  components: {
    VueCommand
  },

  data: () => ({
    commands: {
      context: () => HelloContext
    }

    // history: [],
    // prompt: PROMPT,
    // query: ''
  })
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono');

$border-radius: 8px;

body {

  h1,
  h2,
  h3 {
    font-family: "Inconsolata", monospace;
  }

  p {
    font-family: "Montserrat", sans-serif;
  }

  font-family: 'Ubuntu';
  display: grid;
  place-items: center;
  height: 95vh;
  margin: 0;

  main {
    margin: 1rem;
    max-width: 400px;
    width: calc(100% - 2rem);
  }

  .vue-command {
    .window {
      height: 300px;
    }
  }
}
</style>
