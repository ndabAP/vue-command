<template>
  <section>
    <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div class="container">
        <div class="row">
          <div class="col">
            <h1>vue-command </h1>
            <p class="lead">
              A fully working, most feature-rich Vue.js terminal emulator.
            </p>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col">
            <vue-command
              v-model:history="history"
              v-model:query="query"
              :commands="commands"
              :hide-bar="hideBar"
              :hide-prompt="hidePrompt"
              :invert="invert"
              :prompt="prompt"
              help-text="Type in help"
              show-help />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <pre><code>$ npm install --save vue-command</code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
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

const PROMPT = 'neil@moon~$'

export default {
  components: {
    VueCommand
  },

  setup () {
    const hideBar = ref(false)
    const hidePrompt = ref(false)
    const history = ref(newDefaultHistory())
    const invert = ref(false)
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

      hideBar,
      hidePrompt,
      history,
      invert,
      prompt,
      query
    }
  }
}
</script>

<style lang="scss">
@media (min-width: 1200px) {
  .container {
    max-width: 768px;
  }
}

.vue-command,
.vue-command--invert {
  width: 670px;

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
    height: 384px;
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
</style>
