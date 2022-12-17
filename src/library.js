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
import forEach from 'lodash.foreach'

// Suffix "KEY" is added to avoid collisions
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'

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

// Returns a list of default event resolver
export const newDefaultEventResolver = () => [defaultHistoryEventResolver]

// Creates a "stdout" with the given formatter and name. It exists as soon as
// component is rendered
export const createStdout = (formatter, name = 'VueCommandStdout') => markRaw(defineComponent({
  name,
  setup () {
    // This tears down the component automatically
    const exit = inject('exit')
    onMounted(exit)
  },

  render: formatter
}))

// Formats the given text
export const textFormatter = (text, innerHtml = false) => {
  return () => {
    if (innerHtml) {
      return h('div', { innerHtml: text })
    }

    return h('div', text)
  }
}

// Creates a command not found component
export const createCommandNotFound = (command, notFoundText = 'command not found', name = 'VueCommandNotFound') => {
  const text = `${command}: ${notFoundText}`
  return createStdout(textFormatter(text), name)
}

// Creates a new query component
// TODO Add name
export const createQuery = () => markRaw(VueCommandQuery)

// A simple query parser which trims the query and splits the arguments by
// spaces
export const defaultParser = query => split(trim(query), ' ')

// Formats the given elements as a list
// TODO Use HTML to enforce a new line
export const listFormatter = (...lis) => {
  return () => {
    const ul = []
    forEach(lis, li => {
      ul.push(h('li', li))
    })

    return h('ul', ul)
  }
}

// Returns a history with one query as first input
export const newDefaultHistory = () => [createQuery()]

// Formats the rows as HTML table
export const tableFormatter = rows => {
  return () => {
    const tbody = []
    forEach(rows, row => {
      const trs = []
      forEach(row, cell => {
        const td = h('td', cell)
        trs.push(td)
      })

      const tr = h('tr', trs)
      tbody.push(tr)
    })

    return h('table', tbody)
  }
}

export default VueCommand
