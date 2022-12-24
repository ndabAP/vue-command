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
import isFunction from 'lodash.isfunction'

// Suffix "KEY" is added to avoid collisions
const ARROW_UP_KEY = 'ArrowUp'
const ARROW_DOWN_KEY = 'ArrowDown'

// Cycles through dispatched queries with arrow keys
export const defaultHistoryEventResolver = (refs, { decrementHistory, incrementHistory }) => {
  const vueCommandRef = refs.vueCommandRef

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
            decrementHistory()
            break

          // Back in history, index up
          case ARROW_DOWN_KEY:
            incrementHistory()
            break
        }
    }
  }

  vueCommandRef.addEventListener('keydown', eventResolver)
}

export const defaultSignalEventResolver = (refs, { sendSignal }) => {
  const vueCommandRef = refs.vueCommandRef

  const eventResolver = event => {
    switch (event.key) {
      // Validate event
    }
    sendSignal('SIGINT')
  }

  vueCommandRef.addEventListener('keydown', eventResolver)
}

// Returns a list of default event resolver
export const newDefaultEventResolver = () => [defaultHistoryEventResolver, defaultSignalEventResolver]

// Creates a "stdout" with the given formatter or text and name. It exits as
// soon as the component has been mounted
export const createStdout = (formatterOrText, name = 'VueCommandStdout') => markRaw(defineComponent({
  name,
  setup () {
    // This tears down the component automatically
    const exit = inject('exit')
    onMounted(exit)
  },

  render () {
    if (isFunction(formatterOrText)) {
      // This is automatically called with the bound arguments
      return formatterOrText()
    }

    return h('div', formatterOrText)
  }
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
  return createStdout(text, name)
}

// Creates a new query component
export const createQuery = () => markRaw(VueCommandQuery)

// A simple query parser which trims the query and splits the arguments by
// spaces
export const defaultParser = query => split(trim(query), ' ')

// Formats the given elements as a list
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

// Formats the object as json
export const jsonFormatter = value => {
  return h('div', JSON.stringify(value, null, 2))
}

// Formats the rows as HTML table
export const tableFormatter = rows => {
  return () => {
    const tbody = []
    forEach(rows, row => {
      const trs = []
      forEach(row, td => {
        trs.push(h('td', td))
      })

      tbody.push(h('tr', trs))
    })

    return h('table', tbody)
  }
}

export default VueCommand
