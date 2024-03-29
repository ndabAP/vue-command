<template>
  <section>
    <div class="mt-4">
      <div class="container">
        <h1>vue-command</h1>
        <p class="lead">
          A fully working, most feature-rich Vue.js terminal emulator. Now with Vue.js 3 support! <a
            href="https://github.com/ndabAP/vue-command">Github</a>
        </p>

        <pre><code>$ npm install --save vue-command</code></pre>

        <div class="mb-4">
          <vue-command
            v-model:cursor-position="cursorPosition"
            v-model:dispatched-queries="dispatchedQueries"
            v-model:is-fullscreen="isFullscreen"
            v-model:history="history"
            v-model:history-position="historyPosition"
            v-model:query="query"
            :commands="commands"
            :font="font"
            :help-text="helpText"
            :help-timeout="helpTimeout"
            :hide-bar="hideBar"
            :hide-buttons="hideButtons"
            :hide-prompt="hidePrompt"
            :hide-title="hideTitle"
            :invert="invert"
            :prompt="prompt"
            :options-resolver="optionsResolver"
            :show-help="showHelp"
            :title="title" />
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-borderless">
            <thead>
              <tr>
                <th scope="col">
                  Property
                </th>
                <th scope="col">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><pre><code>cursor-position</code></pre></td>
                <td>
                  <pre><code>{{ cursorPosition }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>dispatched-queries</code></pre></td>
                <td>
                  <pre><code>{{ dispatchedQueries }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>help-text</code></pre></td>
                <td>
                  <pre><code>{{ helpText }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>help-timeout</code></pre></td>
                <td>
                  <pre><code>{{ helpTimeout }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>hide-bar</code></pre></td>
                <td>
                  <input
                    v-model="hideBar"
                    class="form-check-input"
                    type="checkbox"
                    value="">
                </td>
              </tr>
              <tr>
                <td><pre><code>hide-buttons</code></pre></td>
                <td>
                  <input
                    v-model="hideButtons"
                    class="form-check-input"
                    type="checkbox"
                    value="">
                </td>
              </tr>
              <tr>
                <td><pre><code>hide-prompt</code></pre></td>
                <td>
                  <pre><code>{{ hidePrompt }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>hide-title</code></pre></td>
                <td>
                  <input
                    v-model="hideTitle"
                    class="form-check-input"
                    type="checkbox"
                    value="">
                </td>
              </tr>
              <tr>
                <td><pre><code>help-timeout</code></pre></td>
                <td>
                  <pre><code>{{ helpTimeout }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>history</code></pre></td>
                <td>
                  <pre><code>{{ history }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>history-position</code></pre></td>
                <td>
                  <pre><code>{{ historyPosition }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>invert</code></pre></td>
                <td>
                  <input
                    v-model="invert"
                    class="form-check-input"
                    type="checkbox"
                    value="">
                </td>
              </tr>
              <tr>
                <td><pre><code>is-fullscreen</code></pre></td>
                <td>
                  <pre><code>{{ isFullscreen }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>prompt</code></pre></td>
                <td>
                  <pre><code>{{ prompt }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>query</code></pre></td>
                <td>
                  <pre><code>{{ query }}</code></pre>
                </td>
              </tr>
              <tr>
                <td><pre><code>title</code></pre></td>
                <td>
                  <pre><code>{{ title }}</code></pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
import { ref } from 'vue'
import VueCommand from '@/components/VueCommand'
import {
  createStderr,
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
    const font = ref('')
    const helpText = ref('Type in help')
    const helpTimeout = ref(3500)
    const hideBar = ref(false)
    const hideButtons = ref(false)
    const hidePrompt = ref(false)
    const hideTitle = ref(false)
    const history = ref(newDefaultHistory())
    const historyPosition = ref(0)
    const invert = ref(false)
    const isFullscreen = ref(false)
    const prompt = ref(PROMPT)
    const query = ref('')
    const showHelp = ref(true)
    const title = ref('bash - 720x350')

    const optionsResolver = (program, parsedQuery, setQuery) => {
      const lastArgument = parsedQuery[parsedQuery.length - 1]

      switch (program) {
        case 'cd':
          switch (parsedQuery.length) {
            case 0:
              break

            case 1:
              setQuery('cd home')
              break

            default:
              if ('home'.startsWith(lastArgument) && lastArgument !== 'home') {
                setQuery('cd home')
              }
              break
          }
          break
      }
    }

    const commands = {
      cd: parsedQuery => {
        if (parsedQuery.length < 2 || parsedQuery[parsedQuery.length - 1] === '.') {
          return createQuery()
        }

        const lastArgument = parsedQuery[parsedQuery.length - 1]

        if (lastArgument === 'home') {
          prompt.value = `${PROMPT}/home`
        }
        if ((lastArgument === '../' || lastArgument === '..') &&
            prompt.value === `${PROMPT}/home`) {
          prompt.value = `${PROMPT}`
        }
        if (lastArgument !== 'home' && lastArgument !== '../' && lastArgument !== '..') {
          return createStderr(`bash: cd: ${lastArgument}: No such file or directory`)
        }

        return createQuery()
      },

      clear: () => {
        // "splice" is necessary since Vue.js losses its reactivity if array is
        // set to empty
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
      norris: () => ChuckNorris,

      'set-font': parsedQuery => {
        if (parsedQuery.length < 2) {
          return createStderr('Missing font')
        }

        const match = parsedQuery.at(1)
        if (match) {
          font.value = match.replace(/['"]+/g, '')
          return createQuery()
        }

        return createStderr('Missing font')
      }
    }
    commands.help = () => {
      const list = Object.keys(commands)
      // TODO: Create terminal-like columns
      return createStdout(listFormatter(...list))
    }

    return {
      commands,

      cursorPosition,
      dispatchedQueries,
      helpText,
      helpTimeout,
      hideBar,
      hideButtons,
      hidePrompt,
      hideTitle,
      history,
      historyPosition,
      invert,
      isFullscreen,
      prompt,
      query,
      showHelp,
      title,
      font,

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
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }

  .vue-command__history,
  .vue-command__history--invert {
    height: 350px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
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
