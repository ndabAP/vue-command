import { defineComponent, h, inject, markRaw, nextTick, onMounted } from 'vue'
import VueCommand from '@/components/VueCommand'
import XQuery from '@/components/XQuery'
// import { ARROW_UP_KEY, ARROW_DOWN_KEY, R_KEY, TAB_KEY } from '../constants/keys'

export const newDefaultHistory = () => [createQuery()]

export const createQuery = (name = 'VueCommandXQuery') => markRaw(defineComponent({
  name,
  setup () {
    const dispatch = inject('dispatch')
    const environment = inject('environment')

    const prompt = environment.value.prompt

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
export const createCommandNotFound = (command, name = 'VueCommandCommandNotFound') => createStdout(`${command}: command not found`, name)

export default VueCommand
