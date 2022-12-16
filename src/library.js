import {
  defineComponent,
  h,
  inject,
  markRaw,
  onMounted
} from 'vue'
import VueCommand from '@/components/VueCommand'
import VueCommandQuery from '@/components/VueCommandQuery'
import split from 'lodash.split'
import trim from 'lodash.trim'

// Suffix "KEY" is added to avoid JavaScript collisions
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'
const C_KEY = 67
const R_KEY = 82
const TAB_KEY = 9

// Creates a command not found component
export const createCommandNotFound = (command, text = 'command not found', name = 'VueCommandNotFound') => createStdout(`${command}: ${text}`, name)

// Creates a textual "stdout" component containing a div element with the given
// text or as inner HTML
export const createStdout = (text, name = 'VueCommandStdout', innerHTML = false) => markRaw(defineComponent({
  name,
  setup () {
    // This tears down the component automatically
    const exit = inject('exit')
    onMounted(exit)
  },

  render: () => {
    if (innerHTML) {
      return h('div', { innerHTML: text })
    }
    return h('div', text)
  }
}))

// Creates a new query component
// TODO Add name
export const createQuery = () => markRaw(VueCommandQuery)

// Cycles through dispatched queries with arrow keyes
export const defaultHistoryEventResolver = (refs, eventProvider) => {
  // TODO Bind on last query?
  const vueCommandHistoryRef = refs.vueCommandHistoryRef

  const eventResolver = event => {
    switch (event.key) {
      // Validate history event
      case ARROW_UP_KEY:
      case ARROW_DOWN_KEY:

        // TODO Check if arrows keys are pressed exclusively

        event.preventDefault()

        switch (event.key) {
          // Back in history, index down
          case ARROW_UP_KEY:
            eventProvider.decrementHistory()
            break

          // Back in history, index up
          case ARROW_DOWN_KEY:
            eventProvider.incrementHistory()
            break
        }
    }
  }

  vueCommandHistoryRef.addEventListener('keydown', eventResolver)
}

// A simple query parser which splits arguments by spaces
export const defaultParser = query => split(trim(query), ' ')

// Returns a list of default event resolver
export const newDefaultEventResolver = () => [defaultHistoryEventResolver]

// Returns a history with one query as first input
export const newDefaultHistory = () => [createQuery()]

export default VueCommand
