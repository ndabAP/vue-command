import { defineComponent, h, inject, markRaw, onMounted } from 'vue'
import VueCommand from '@/components/VueCommand'
import XQuery from '@/components/XQuery'
import split from 'lodash.split'
import { trim } from 'lodash'

// Suffix "KEY" is added to avoid JavaScript collisions
export const ARROW_UP_KEY = 38
export const ARROW_DOWN_KEY = 40
export const C_KEY = 67
export const R_KEY = 82
export const TAB_KEY = 9

export const newDefaultHistory = () => [createQuery()]

export const defaultParser = command => split(trim(command), ' ')

export const defaultEventResolver = () => [historyEventResolver]

export const historyEventResolver = vueCommandRef => {
  const { provides } = vueCommandRef

  const eventResolver = event => {
    console.debug(vueCommandRef)

    switch (event.keyCode) {
      case ARROW_UP_KEY:
      case ARROW_DOWN_KEY:

        switch (event.keyCode) {
          // Back in history, index down
          case ARROW_UP_KEY:
            // event.preventDefault()
            if (provides.terminal.value.historyPosition !== 0) {
              provides.setHistoryPosition(33)
              provides.setQuery('TEST')
            }

            break

          // Back in history, index up
          case ARROW_DOWN_KEY:
            break
        }
    }
  }

  vueCommandRef.refs.vueCommandHistoryRef.addEventListener('keydown', eventResolver)
}

export const createQuery = (name = 'VueCommandXQuery') => markRaw(defineComponent({
  name,
  setup () {
    const dispatch = inject('dispatch')
    const terminal = inject('terminal')

    const prompt = terminal.value.prompt

    return () => [
      h(
        XQuery,
        {
          prompt,
          onDispatch: dispatch
        }
      )
    ]
  }
}))

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
