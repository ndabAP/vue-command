import { defineComponent, h, markRaw, nextTick } from 'vue'
import VueCommand from '../components/VueCommand'
import XQuery from '../components/XQuery'
// import { ARROW_UP_KEY, ARROW_DOWN_KEY, R_KEY, TAB_KEY } from '../constants/keys'

export const createHistory = (root = [markRaw(createEmptyStdout())]) => {
  return [...root]
}

// Returns a Stdout component containing a span element with given inner content
export const createStdout = (text, name = 'VueCommandStdout', innerHTML = false) => defineComponent({
  name,
  render: () => {
    if (innerHTML) {
      return h('span', { innerHTML: text })
    }

    return h('span', text)
  }
})

// Returns an empty stdout component to not show a Stdin
export const createEmptyStdout = (name = 'VueCommandEmptyStdout') => createStdout('<!-- Empty Stdout -->', name, true)

export default VueCommand
