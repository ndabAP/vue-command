<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working, most feature-rich Vue.js terminal emulator. Now with Vue.js 3 support!</p>

    <vue-command
      v-model:history="history"
      v-model:query="query"
      :commands="commands"
      :prompt="prompt"
      help-text="Type in help"
      :invert="invert"
      show-help>
    </vue-command>
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
  newDefaultHistory,
  textFormatter
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
    const invert = ref(true)
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
          const text = 'Hello world'
          return createStdout(textFormatter(text))
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
      invert,
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

    .vue-command,
    .vue-command--invert {
      ::-webkit-scrollbar {
        width: 6px;
      }

      .vue-command__bar,
      .vue-command__bar--invert {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
      }

      .vue-command__history,
      .vue-command__history--invert {
        height: 260px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
    }

    .vue-command {
      ::-webkit-scrollbar-track {
        background: #252525;
      }

      ::-webkit-scrollbar-thumb {
        background: #f1f1f1;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #333;
      }
    }

    .vue-command--invert {
      ::-webkit-scrollbar-track {
        background: #dadada;
      }

      ::-webkit-scrollbar-thumb {
        background: #0e0e0e;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #cccccc;
      }
    }
  }
}
</style>
