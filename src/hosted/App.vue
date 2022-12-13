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
body {
  font-family: sans-serif;

  display: grid;
  place-items: center;
  margin: 0;

  .vue-command {
    .vue-command__window {
      height: 300px;
      width: 420px;
    }
  }
}
</style>
