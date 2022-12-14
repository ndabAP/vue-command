import { defineComponent, h, inject, markRaw, onMounted } from 'vue'
import VueCommand from '@/components/VueCommand'
import XQuery from '@/components/XQuery'
import split from 'lodash.split'
import { trim } from 'lodash'

export const newDefaultHistory = () => [createQuery()]

export const defaultParser = command => split(trim(command), ' ')

export const defaultEventResolver = () => []

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
