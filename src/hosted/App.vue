<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working, most feature-rich Vue.js terminal emulator. Now with Vue.js 3 support!</p>

    <ul>
      <li> Simple, yet extensible API</li>
      <li> Supports asynchronous commands</li>
      <li> Supports fullscreen mode</li>
      <li> Provide your own parser (falls back to simple one)</li>
      <li> Provide your own event resolver</li>
      <li> Autocompletion resolver (with <kbd>↹</kbd>)</li>
      <li> Browse history (with <kbd>↑</kbd>/<kbd>↓</kbd>)</li>
      <li> Search history (with <kbd>Ctrl</kbd> + <kbd>r</kbd>) (comming soon)</li>
      <li> Customize the terminal with slots</li>
    </ul>

    <vue-command
      v-model:history="history"
      v-model:query="query"
      :commands="commands"
      :prompt="prompt"
      help-text="Type in help"
      show-help />

    <pre>
      <code>
$ npm install --save vue-command
      </code>
    </pre>
  </main>
</template>

<script lang="js">
import { ref } from 'vue'
import VueCommand from '@/components/VueCommand'
import {
  createStdout,
  createQuery,
  listFormatter,
  newDefaultHistory
} from '@/library'
import NanoEditor from '@/hosted/NanoEditor.vue'
import ChuckNorris from '@/hosted/ChuckNorris.vue'

const PROMPT = '~$'

export default {
  components: {
    VueCommand
  },

  setup () {
    const history = ref(newDefaultHistory())
    const prompt = ref(PROMPT)
    const query = ref('')

    return {
      commands: {
        cd: parsed => {
          if (parsed.length < 1) {
            return
          }
          if (parsed[1] === 'home') {
            prompt.value = `${PROMPT}/home`
          }
          if ((parsed[1] === '../' || parsed[1] === '..') &&
            prompt.value === `${PROMPT}/home`) {
            prompt.value = `${PROMPT}`
          }

          return createQuery()
        },

        clear: () => {
          history.value = []
          return createQuery()
        },

        'hello-world': () => {
          return createStdout('Hello world')
        },

        // TODO Create terminal-like columns
        help: () => {
          const list = ['cd', 'hello-world', 'help', 'nano', 'norris']
          return createStdout(listFormatter(...list))
        },

        nano: () => NanoEditor,
        norris: () => ChuckNorris
      },

      history,
      prompt,
      query
    }
  }
}
</script>

<style lang="scss">
body {
  font-family: sans-serif;
  display: grid;
  place-items: center;
  margin: 0;

  main {
    max-width: 400px;
    margin-left: 5px;
    margin-right: 5px;

    .vue-command {
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

      .vue-command__bar {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
      }

      .vue-command__history {
        height: 260px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
    }
  }
}
</style>
