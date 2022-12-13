import { defineComponent, h, inject, markRaw, nextTick, onMounted } from 'vue'
import VueCommand from '@/components/VueCommand'
import XQuery from '@/components/XQuery'
// import { ARROW_UP_KEY, ARROW_DOWN_KEY, R_KEY, TAB_KEY } from '../constants/keys'

export const newDefaultHistory = () => [createQuery()]

export const createQuery = () => markRaw(defineComponent({
  name: 'XQuery', // VueCommandXQuery
  inject: ['dispatch'],
  render () {
    return h(XQuery, {
      onDispatch: this.dispatch
    })
  }
}))

// Returns a Stdout component containing a span element with given text or as
// inner HTML
export const createStdout = (text, name = 'VueCommandStdout', innerHTML = false) => defineComponent({
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
})

// Returns a command not found component
export const createCommandNotFound = (command, name = 'VueCommandCommandNotFound') => markRaw(createStdout(`${command}: command not found`, name))

// Returns an empty stdout component to not show a Stdin
export const createEmptyStdout = (name = 'VueCommandEmptyStdout') => markRaw(createStdout('<!-- VueCommandEmptyStdout -->', name, true))

export default VueCommand
