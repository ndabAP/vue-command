import { defineComponent, h, inject, markRaw, onMounted } from 'vue'
import VueCommand from '@/components/VueCommand'
import VueCommandQuery from '@/components/VueCommandQuery'
import split from 'lodash.split'
import { trim } from 'lodash'

// Suffix "KEY" is added to avoid JavaScript collisions
export const ARROW_UP_KEY = 38
export const ARROW_DOWN_KEY = 40
export const C_KEY = 67
export const R_KEY = 82
export const TAB_KEY = 9

// Returns a history with one query
export const newDefaultHistory = () => [createQuery()]

// Returns a list of with default event resolver
export const newDefaultEventResolver = () => [historyEventResolver]

// A simple command parser which splits arguments by spaces
export const defaultParser = command => split(trim(command), ' ')

// Cycles through executed commands
export const historyEventResolver = (refs, eventProvider) => {
  const vueCommandHistoryRef = refs.vueCommandHistoryRef

  const eventResolver = event => {
    const terminal = eventProvider.terminal.value
    const executedCommands = terminal.executedCommands

    switch (event.keyCode) {
      // Validate history event
      case ARROW_UP_KEY:
      case ARROW_DOWN_KEY:

        // TODO Check if arrows keys are pressed exactly without any other key

        event.preventDefault()

        switch (event.keyCode) {
          // Back in history, index down
          case ARROW_UP_KEY:
            if (terminal.historyPosition !== 0) {
              eventProvider.setHistoryPosition(terminal.historyPosition - 1)
              eventProvider.setQuery([...executedCommands][terminal.historyPosition - 1])
            }
            break

          // Back in history, index up
          case ARROW_DOWN_KEY:
            if (executedCommands.size - 1 >= terminal.historyPosition) {
              eventProvider.setHistoryPosition(terminal.historyPosition + 1)
              eventProvider.setQuery([...executedCommands][terminal.historyPosition + 1])
            }
            break
        }
    }
  }

  vueCommandHistoryRef.addEventListener('keydown', eventResolver)
}

// Creates a new query component
export const createQuery = () => markRaw(VueCommandQuery)

// Returns a Stdout component containing a span element with given text or as
// inner HTML
export const createStdout = (text, name = 'VueCommandStdout', innerHTML = false) => markRaw(defineComponent({
  name,
  setup () {
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

// Returns a command not found component
export const createCommandNotFound = (command, text = 'command not found', name = 'VueCommandCommandNotFound') => createStdout(`${command}: ${text}`, name)

export default VueCommand
