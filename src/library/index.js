import { defineComponent, h, inject, markRaw, nextTick, onMounted } from 'vue'
import VueCommand from '@/components/VueCommand'
import XQuery from '@/components/XQuery'
// import { ARROW_UP_KEY, ARROW_DOWN_KEY, R_KEY, TAB_KEY } from '../constants/keys'

export const newDefaultHistory = () => [createQuery()]

// TODO Context is missing
export const createQuery = (name = 'VueCommandXQuery', context = {}) => markRaw(defineComponent({
  name,
  provide () {
    return {
      context
    }
  },

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
