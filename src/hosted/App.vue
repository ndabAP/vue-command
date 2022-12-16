<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working, most feature-rich Vue.js terminal emulator.</p>

    <vue-command
      v-model:history="history"
      v-model:query="query"
      :commands="commands"
      :prompt="prompt"
      help-text="Type in help"
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
          if ((parsed[1] === '../' || parsed[1] === '..') && prompt.value === `${PROMPT}/home`) {
            prompt.value = `${PROMPT}`
          }

          return createQuery()
        },

        clear: () => {
          history.value = []
          return createQuery()
        },

        'hello-world': () => createStdout('Hello world'),

        help: () => {
          return createStdout(`cd
            clear
            hello-world
            help
            nano
            norris
          `)
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

  .vue-command {
    width: 400px;

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

    .vue-command__actions {
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
</style>
