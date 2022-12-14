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
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import VueCommand from '@/components/VueCommand'
import { createQuery, newDefaultHistory } from '@/library'
import NanoEditor from '@/hosted/NanoEditor.vue'
import ChuckNorris from '@/hosted/ChuckNorris.vue'
import { onMounted, ref } from 'vue'

const PROMPT = '~neil@moon:#/'

export default {
  components: {
    VueCommand
  },

  setup () {
    const history = ref(newDefaultHistory())
    const query = ref('')

    return {
      commands: {
        clear: () => {
          history.value = []
          return createQuery()
        },

        nano: () => NanoEditor,
        norris: () => ChuckNorris
      },

      history,
      prompt: PROMPT,
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
    .vue-command__actions {
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
    }

    .vue-command__content {
      height: 250px;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }
}
</style>
