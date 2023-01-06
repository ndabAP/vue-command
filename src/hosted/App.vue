<template>
  <section>
    <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div class="container">
        <div class="row">
          <div class="col">
            <h1>vue-command</h1>
            <p class="lead">
              A fully working, most feature-rich Vue.js terminal emulator. Now with Vue.js 3 support! <a
                href="https://github.com/ndabAP/vue-command">Github</a>
            </p>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col">
            <vue-command
              v-model:cursor-position="cursorPosition"
              v-model:dispatched-queries="dispatchedQueries"
              v-model:history="history"
              v-model:query="query"
              :commands="commands"
              :hide-bar="hideBar"
              :hide-prompt="hidePrompt"
              :hide-title="hideTitle"
              :invert="invert"
              :prompt="prompt"
              :options-resolver="optionsResolver"
              title="bash - 720x350"
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
  newDefaultHistory,
  tableFormatter
} from '@/library'
import NanoEditor from '@/hosted/NanoEditor.vue'
import ChuckNorris from '@/hosted/ChuckNorris.vue'

const PROMPT = 'neil@moon~$'

export default {
  components: {
    VueCommand
  },

  setup () {
    const cursorPosition = ref(0)
    const dispatchedQueries = ref(new Set())
    const hideBar = ref(false)
    const hidePrompt = ref(false)
    const hideTitle = ref(false)
    const history = ref(newDefaultHistory())
    const invert = ref(false)
    const prompt = ref(PROMPT)
    const query = ref('')

    const optionsResolver = (program, parsedQuery, setQuery) => {
      switch (program) {
        case 'cd':
          switch (parsedQuery.length) {
            case 1:
              setQuery('cd home')
              break
            // TODO Check last index instead of second
            case 2:
              if ('home'.startsWith(parsedQuery[1]) && parsedQuery[1] !== 'home') {
                setQuery('cd home')
              }
              break
          }
          break
      }
    }

    const commands = {
      cd: parsed => {
        if (parsed.length < 2) {
          return createQuery()
        }
        if (parsed[parsed.length - 1] === 'home') {
          prompt.value = `${PROMPT}/home`
        }
        if ((parsed[parsed.length - 1] === '../' || parsed[parsed.length - 1] === '..') &&
            prompt.value === `${PROMPT}/home`) {
          prompt.value = `${PROMPT}`
        }

        return createQuery()
      },

      clear: () => {
        // This is necessary since Vue.js losses its reactivity if set to empty
        history.value.splice(0, history.value.length)

        return createQuery()
      },

      'hello-world': () => {
        return createStdout('Hello world')
      },

      history: () => {
        const history = []
        for (const [index, entry] of [...dispatchedQueries.value].entries()) {
          history.push([index, entry])
        }

        return createStdout(tableFormatter(history))
      },

      nano: () => NanoEditor,
      norris: () => ChuckNorris
    }
    commands.help = () => {
      // TODO Create terminal-like columns
      const list = Object.keys(commands)
      return createStdout(listFormatter(...list))
    }

    return {
      commands,

      cursorPosition,
      dispatchedQueries,
      hideBar,
      hidePrompt,
      hideTitle,
      history,
      invert,
      prompt,
      query,

      optionsResolver
    }
  }
}
</script>

<style lang="scss">
@media (min-width: 1200px) {
  .container {
    max-width: 720px;
  }
}

.vue-command,
.vue-command--invert {
  width: 100%;

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
    height: 350px;
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
